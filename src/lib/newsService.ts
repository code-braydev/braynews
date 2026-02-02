import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["enclosure", "enclosure"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

export const SOURCES = {
  general: [
    {
      name: "El Espectador",
      url: "https://www.elespectador.com/arc/outboundfeeds/discover/?outputType=xml",
    },
    { name: "El Tiempo", url: "https://www.eltiempo.com/rss/colombia.xml" },
    { name: "BBC Mundo", url: "https://feeds.bbci.co.uk/mundo/rss.xml" },
    { name: "CNN en Español", url: "https://cnnespanol.cnn.com/feed/" },
    {
      name: "El País (América)",
      url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada",
    },
    { name: "DW Actualidad", url: "https://rss.dw.com/rdf/rss-sp-all" },
    { name: "France 24", url: "https://www.france24.com/es/rss" },
    { name: "La Republica", url: "https://www.larepublica.co/rss" },
  ],
  tecnologia: [
    { name: "Xataka", url: "https://feeds.feedburner.com/xataka2" },
    { name: "Applesfera", url: "https://feeds.feedburner.com/applesfera" },
    { name: "Genbeta", url: "https://feeds.feedburner.com/genbeta" },
    {
      name: "Wired Tech",
      url: "https://www.wired.com/feed/category/gear/latest/rss",
    },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
    { name: "Hipertextual", url: "https://hipertextual.com/feed" },
  ],
  deportes: [
    { name: "Marca", url: "https://e00-marca.uecdn.es/rss/portada.xml" },
    {
      name: "AS Colombia",
      url: "https://colombia.as.com/rss/tags/ultimas_noticias/a/",
    },
    { name: "ESPN", url: "https://www.espn.com.co/espn/rss/news" },
    {
      name: "El Tiempo Deportes",
      url: "https://www.eltiempo.com/rss/deportes.xml",
    },
  ],
  politica: [
    {
      name: "El Espectador Política",
      url: "https://www.elespectador.com/arc/outboundfeeds/politica/?outputType=xml",
    },
    { name: "Semana Política", url: "https://www.semana.com/rss/politica" },
    { name: "La Silla Vacía", url: "https://www.lasillavacia.com/feed/" },
  ],
  finanzas: [
    { name: "Portafolio", url: "https://www.portafolio.co/rss/negocios" },
    { name: "La República", url: "https://www.larepublica.co/rss" },
    { name: "Forbes Colombia", url: "https://forbes.co/feed/" },
    { name: "Bloomberg", url: "https://www.bloomberglinea.com/index.xml" },
  ],
  local: [
    { name: "Chicanoticias", url: "https://www.chicanoticias.com/feed/" },
    { name: "GS Noticias", url: "https://gsnoticias.com/feed/" },
    { name: "Montería Radio 38", url: "https://www.monteriaradio.com/feed/" },
    { name: "Zenu Radio", url: "https://zenuradio.com/feed/" },
  ],
};

function cleanXml(rawXml: string) {
  return rawXml
    .replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, "&amp;")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

export async function getNews(category?: keyof typeof SOURCES) {
  const selectedSources = category
    ? SOURCES[category].map((s) => ({ ...s, category }))
    : Object.entries(SOURCES).flatMap(([cat, srcs]) =>
        srcs.map((s) => ({ ...s, category: cat })),
      );

  const allNews = await Promise.all(
    selectedSources.map(async (source) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(source.url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 BrayNews-Bot/1.0", // User agent más limpio
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
        });
        clearTimeout(timeout);

        if (!response.ok) return [];

        const rawData = await response.text();
        if (rawData.toLowerCase().includes("<!doctype html>")) return [];

        const feed = await parser.parseString(cleanXml(rawData));

        return feed.items.map((item: any) => {
          let thumb =
            item.enclosure?.url ||
            item.mediaContent?.url ||
            item.mediaContent?.["$"]?.url ||
            item["media:content"]?.["$"]?.url ||
            null;

          const fullContent =
            item.contentEncoded || item.content || item.contentSnippet || "";

          if (!thumb && fullContent) {
            const imgMatch = fullContent.match(/<img[^>]+src="([^">]+)"/);
            thumb = imgMatch ? imgMatch[1] : null;
          }

          const cleanSnippet = (item.contentSnippet || item.content || "")
            .replace(/<[^>]*>?/gm, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 160);

          return {
            title: (item.title || "Sin título").trim(),
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            contentSnippet:
              cleanSnippet + (cleanSnippet.length >= 160 ? "..." : ""),
            category: source.category as any,
            sourceName: source.name,
            thumbnail: thumb || undefined,
          };
        });
      } catch (e) {
        // Silencio absoluto en producción para mejorar el rendimiento de logs
        return [];
      }
    }),
  );

  return allNews
    .flat()
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );
}
