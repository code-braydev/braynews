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

// ... (transformItem se mantiene igual)

export async function getNews(
  category?: Category,
  topInterest?: string,
): Promise<NewsItem[]> {
  const selectedSources = category
    ? SOURCES[category].map((s) => ({ ...s, category }))
    : Object.entries(SOURCES).flatMap(([cat, srcs]) =>
        srcs.map((s) => ({ ...s, category: cat as Category })),
      );

  const allNews = await Promise.all(
    selectedSources.map(async (source) => {
      // 1. Extraemos los 3 parámetros de Venus
      const { ok, data, error, errorCode, status } = await getRss(source.url, {
        timeout: 8000,
        rssMode: "lenient",
      });

      // 2. Si hay error, lo logueamos para verlo en el dashboard de Vercel
      if (!ok) {
        console.error(
          `[Venus Error] Fuente: ${source.name} | Motivo: ${error || errorCode || status || "Timeout"}`,
        );
        return [];
      }

      // 3. Validación extra de seguridad para los items
      if (!data?.items || !Array.isArray(data.items)) return [];

      return data.items.map((item) =>
        transformItem(item, source.name, source.category),
      );
    }),
  );

  const flattenedNews = allNews.flat();

  // 4. Protección en el Sort (Fechas inválidas)
  return flattenedNews.sort((a, b) => {
    // Si pubDate viene mal, usamos el tiempo actual para que no de NaN
    const dateA = new Date(a.pubDate || Date.now()).getTime();
    const dateB = new Date(b.pubDate || Date.now()).getTime();

    if (isNaN(dateA) || isNaN(dateB)) return 0; // Evita que el sort rompa la función

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
