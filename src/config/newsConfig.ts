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
  slug: string;
  resumen?: string;
  porQueImporta?: string;
  tags?: string[];
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
    {
      name: "CNN en Español",
      url: "https://translate.google.com/website?sl=en&tl=es&hl=es&client=srp&u=http://rss.cnn.com/rss/cnn_topstories.rss",
    },
    {
      name: "CNN en Español",
      url: "https://translate.google.com/website?sl=en&tl=es&hl=es&client=srp&u=http://rss.cnn.com/rss/cnn_world.rss",
    },
    {
      name: "El País (América)",
      url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada",
    },
    { name: "DW Actualidad", url: "https://rss.dw.com/rdf/rss-sp-all" },
    { name: "France 24", url: "https://www.france24.com/es/rss" },
    { name: "La Republica", url: "https://www.larepublica.co/rss" },
    {
      name: "portafolio",
      url: "https://www.portafolio.co/rss/internacional.xml",
    },
  ],
  tecnologia: [
    { name: "Xataka", url: "https://www.xataka.com/feedburner.xml" },
    { name: "Applesfera", url: "https://www.applesfera.com/index.xml" },
    { name: "Genbeta", url: "https://www.genbeta.com/index.xml" },
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
      url: "https://as.com/rss/tags/ultimas_noticias.xml",
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
      url: "https://www.elespectador.com/arc/outboundfeeds/discover/category/politica/?outputType=xml",
    },
    { name: "La Silla Vacía", url: "https://www.lasillavacia.com/feed/" },
  ],
  finanzas: [
    { name: "Portafolio", url: "https://www.portafolio.co/rss/economia.xml" },
    {
      name: "Portafolio",
      url: "https://www.portafolio.co/rss/economia/finanzas.xml",
    },
    {
      name: "Portafolio",
      url: "https://www.portafolio.co/rss/negocios.xml",
    },
    { name: "La República", url: "https://www.larepublica.co/rss" },
    {
      name: "Semana Economía y Empresas",
      url: "https://www.semana.com/arc/outboundfeeds/rss/category/economia/empresas/?outputType=xml",
    },
  ],
  local: [
    { name: "Chicanoticias", url: "https://www.chicanoticias.com/feed/" },
    { name: "GS Noticias", url: "https://gsnoticias.com/feed/" },
    { name: "Montería Radio 38", url: "https://www.monteriaradio.com/feed/" },
    { name: "Zenu Radio", url: "https://zenuradio.com/feed/" },
  ],
};
