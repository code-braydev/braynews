import { getRss, type VenusRssItem } from "@braydev/venus";
import { SOURCES, type NewsItem, type Category } from "../config/newsConfig";
import { slugForItem } from "./slug";

const MAX_CONCURRENT_FETCHES = 5;

const fetchWithConcurrencyLimit = async <T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex++;
        results[currentIndex] = await mapper(items[currentIndex]);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

const transformItem = (
  item: VenusRssItem,
  sourceName: string,
  category: Category,
): NewsItem => {
  const htmlContent = item.content || item.description || "";

  const rawSnippet = htmlContent
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  const link = item.link || "#";

  return {
    title: (item.title || "Sin título").trim(),
    link,
    pubDate: item.pubDate || new Date().toISOString(),
    contentSnippet:
      rawSnippet.slice(0, 160) + (rawSnippet.length >= 160 ? "..." : ""),
    category,
    sourceName,
    thumbnail: item.image || null,
    slug: slugForItem(item.title || "Sin título", link),
  };
};

const fetchNewsForSources = async (): Promise<NewsItem[]> => {
  const selectedSources = Object.entries(SOURCES).flatMap(([cat, srcs]) =>
    srcs.map((s) => ({ ...s, category: cat as Category })),
  );

  const newsGroups = await fetchWithConcurrencyLimit(
    selectedSources,
    MAX_CONCURRENT_FETCHES,
    async (source) => {
      const { ok, data, error, errorCode } = await getRss(source.url, {
        timeout: 8000,
        rssMode: "lenient",
        retry: { attempts: 2, backoffMs: 500, maxBackoffMs: 3000 },
      });

      if (!ok || !data?.items?.length) {
        if (!ok) {
          console.warn(
            `[NewsService] RSS failed for ${source.name} (${errorCode}): ${error}`,
          );
        }

        return [];
      }

      return data.items.map((item) =>
        transformItem(item, source.name, source.category),
      );
    },
  );

  return newsGroups.flat();
};

export const fetchAllNews = async (): Promise<NewsItem[]> =>
  fetchNewsForSources();
