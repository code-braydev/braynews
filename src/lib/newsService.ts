import { getRss, type VenusRssItem } from "@braydev/venus";
import { SOURCES, type NewsItem, type Category } from "../config/newsConfig";

const IMG_SRC_REGEX = /<img[^>]+src=["']([^"']+)["']/i;

const transformItem = (
  item: VenusRssItem,
  sourceName: string,
  category: Category,
): NewsItem => {
  const rawItem = item as any;

  const htmlContent = item.content || item.description || "";

  const rawSnippet = htmlContent
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  const thumb =
    rawItem.enclosure?.url ||
    rawItem.media?.content?.[0]?.url ||
    rawItem.media?.thumbnail?.[0]?.url ||
    htmlContent.match(IMG_SRC_REGEX)?.[1] ||
    null;

  return {
    title: (item.title || "Sin título").trim(),
    link: item.link || "#",
    pubDate: item.pubDate || new Date().toISOString(),
    contentSnippet:
      rawSnippet.slice(0, 160) + (rawSnippet.length >= 160 ? "..." : ""),
    category,
    sourceName,
    thumbnail: thumb,
  };
};

export async function getNews(
  category?: Category,
  topInterest?: string,
): Promise<NewsItem[]> {
  const selectedSources = category
    ? SOURCES[category].map((s) => ({ ...s, category }))
    : Object.entries(SOURCES).flatMap(([cat, srcs]) =>
        srcs.map((s) => ({ ...s, category: cat as Category })),
      );

  const allNews = await Promise.allSettled(
    selectedSources.map(async (source) => {
      const { ok, data, error } = await getRss(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 ...",
          Accept: "application/rss+xml, ...",
        },
        timeout: 8000,
        rssMode: "lenient",
      });

      if (!ok || !data?.items?.length) {
        if (!ok) {
          console.warn(`[NewsService] RSS failed for ${source.name}: ${error}`);
        }
        return [];
      }

      return data.items.map((item) =>
        transformItem(item, source.name, source.category),
      );
    }),
  );

  const flattenedNews = allNews
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result.status === "fulfilled" ? result.value : []))
    .flat();

  return flattenedNews.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();

    const hourInMs = 1000 * 60 * 60;
    const boost = 4 * hourInMs;

    let scoreA = dateA;
    let scoreB = dateB;

    if (topInterest) {
      if (a.category === topInterest) scoreA += boost;
      if (b.category === topInterest) scoreB += boost;
    }

    return scoreB - scoreA;
  });
}
