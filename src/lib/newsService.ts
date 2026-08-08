import snapshot from "../data/news-snapshot.json";
import type { NewsItem, Category } from "../config/newsConfig";

const items: NewsItem[] = (snapshot as { items?: NewsItem[] }).items ?? [];

const sortByDate = (list: NewsItem[]): NewsItem[] =>
  [...list].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

export const getAllNews = (): NewsItem[] => sortByDate(items);

export const getNews = (category?: Category): NewsItem[] =>
  sortByDate(
    category
      ? items.filter((item) => item.category === category)
      : [...items],
  );

export const getNewsBySlug = (slug: string): NewsItem | undefined =>
  items.find((item) => item.slug === slug);

export const getRelatedNews = (
  noticia: NewsItem,
  limit = 3,
): NewsItem[] => {
  const currentTags = new Set(
    (noticia.tags ?? []).map((tag) => tag.toLowerCase()),
  );

  const scored = items
    .filter((item) => item.slug !== noticia.slug)
    .map((item) => {
      let score = 0;
      if (item.category === noticia.category) score += 10;
      if (currentTags.size > 0) {
        const overlap = (item.tags ?? []).filter((tag) =>
          currentTags.has(tag.toLowerCase()),
        ).length;
        score += overlap * 100;
      }
      return { item, score, time: new Date(item.pubDate).getTime() };
    });

  scored.sort((a, b) => b.score - a.score || b.time - a.time);
  return scored.slice(0, limit).map((entry) => entry.item);
};
