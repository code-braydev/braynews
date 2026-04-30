export type Category =
  | "general"
  | "tecnologia"
  | "deportes"
  | "politica"
  | "finanzas"
  | "local";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  category: Category;
  sourceName: string;
  thumbnail?: string;
}

interface Source {
  name: string;
  url: string;
}

export const SOURCES: Record<Category, Source[]> = {
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
