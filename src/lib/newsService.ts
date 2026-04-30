import { getRss, type VenusRssItem } from "@braydev/venus";
import { SOURCES, type NewsItem, type Category } from "../config/newsConfig";

const IMG_SRC_REGEX = /<img[^>]+src=["']([^"']+)["']/i;

const transformItem = (
  item: VenusRssItem,
  sourceName: string,
  category: Category,
): NewsItem => {
  // 1. Forzamos a 'any' solo para buscar propiedades que no están en el tipo oficial
  const rawItem = item as any;

  const htmlContent = item.content || item.description || "";

  const rawSnippet = htmlContent
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  // 2. Intentamos buscar en orden de probabilidad:
  // enclosure -> media -> regex en el HTML
  const thumb =
    rawItem.enclosure?.url ||
    rawItem.media?.content?.[0]?.url ||
    rawItem.media?.thumbnail?.[0]?.url ||
    htmlContent.match(IMG_SRC_REGEX)?.[1] ||
    "/placeholder-news.jpg"; // Un fallback por si acaso

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

// ... tus otros imports

export async function getNews(
  category?: Category,
  topInterest?: string, // <--- Añadimos esto
): Promise<NewsItem[]> {
  const selectedSources = category
    ? SOURCES[category].map((s) => ({ ...s, category }))
    : Object.entries(SOURCES).flatMap(([cat, srcs]) =>
        srcs.map((s) => ({ ...s, category: cat as Category })),
      );

  const allNews = await Promise.all(
    selectedSources.map(async (source) => {
      const { ok, data } = await getRss(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 ...",
          Accept: "application/rss+xml, ...",
        },
        timeout: 8000,
        rssMode: "lenient",
      });

      if (!ok || !data?.items?.length) return [];

      return data.items.map((item) =>
        transformItem(item, source.name, source.category),
      );
    }),
  );

  const flattenedNews = allNews.flat();

  // ALGORITMO DE PERSONALIZACIÓN
  return flattenedNews.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();

    // 1. Calculamos un "boost" de tiempo (ej. 2 horas en milisegundos)
    // Esto hace que si una noticia es de su interés, "parezca" más nueva de lo que es
    const hourInMs = 1000 * 60 * 60;
    const boost = 4 * hourInMs; // 4 horas de ventaja a lo que le gusta

    let scoreA = dateA;
    let scoreB = dateB;

    if (topInterest) {
      if (a.category === topInterest) scoreA += boost;
      if (b.category === topInterest) scoreB += boost;
    }

    return scoreB - scoreA;
  });
}
