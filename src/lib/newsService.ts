import { getRss, type VenusRssItem } from "@braydev/venus";
import { SOURCES, type NewsItem, type Category } from "../config/newsConfig";

const IMG_SRC_REGEX = /<img[^>]+src=["']([^"']+)["']/i;
const NEWS_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CONCURRENT_FETCHES = 5;

type CachedNewsEntry = {
  expiresAt: number;
  data: NewsItem[];
};

const newsCache = new Map<string, CachedNewsEntry>();
const inFlightRequests = new Map<string, Promise<NewsItem[]>>();

const getCacheKey = (category?: Category) => category ?? "all";

const sortNews = (items: NewsItem[], topInterest?: string): NewsItem[] => {
  return [...items].sort((a, b) => {
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
};

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

const fetchNewsForSources = async (
  category?: Category,
): Promise<NewsItem[]> => {
  const selectedSources = category
    ? SOURCES[category].map((s) => ({ ...s, category }))
    : Object.entries(SOURCES).flatMap(([cat, srcs]) =>
        srcs.map((s) => ({ ...s, category: cat as Category })),
      );

  const newsGroups = await fetchWithConcurrencyLimit(
    selectedSources,
    MAX_CONCURRENT_FETCHES,
    async (source) => {
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
    },
  );

  return newsGroups.flat();
};

export async function getNews(
  category?: Category,
  topInterest?: string,
): Promise<NewsItem[]> {
  const cacheKey = getCacheKey(category);
  const now = Date.now();

  const cached = newsCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return sortNews(cached.data, topInterest);
  }

  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) {
    return sortNews(await inFlight, topInterest);
  }

  const request = fetchNewsForSources(category)
    .then((news) => {
      newsCache.set(cacheKey, {
        data: news,
        expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
      });

      return news;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);

  return sortNews(await request, topInterest);
}
