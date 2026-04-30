import { c as createComponent } from './astro-component_eBedEnUG.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, l as renderComponent } from './entrypoint_BIWdabtt.mjs';
import { a as $$Badge, b as $$Button, r as renderScript, $ as $$Layout } from './Badge_C2L7RpmF.mjs';
import he from 'he';
import 'clsx';
import { getRss } from '@braydev/venus';

const $$ImageContainer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ImageContainer;
  const { src, alt, class: className } = Astro2.props;
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 transition-all duration-300",
    "isolate",
    className
  ], "class:list")}> <img${addAttribute(src || DEFAULT_IMAGE, "src")}${addAttribute(alt, "alt")} class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" decoding="async"${addAttribute(`this.onerror=null; this.src='${DEFAULT_IMAGE}';`, "onerror")}> <div class="absolute inset-0 ring-1 ring-inset ring-slate-900/10 dark:ring-white/10 rounded-xl pointer-events-none z-10"></div> </div>`;
}, "/home/braydev/projects/Braydev/news/src/components/ui/ImageContainer.astro", void 0);

const $$NewCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$NewCard;
  const { id, noticia, variant = "default", dark = false } = Astro2.props;
  const tituloLimpio = he.decode(noticia.title || "");
  const snippetLimpio = he.decode(noticia.contentSnippet || "");
  const fecha = new Date(noticia.pubDate).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const isFeatured = variant === "featured";
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(id, "id")}${addAttribute([
    "news-card group flex flex-col h-full rounded-2xl transition-all duration-500 border overflow-hidden",
    isFeatured ? "lg:grid lg:grid-cols-2 lg:gap-8 bg-blue-50/50 dark:bg-slate-900/50 border-blue-100 dark:border-slate-800 p-4 md:p-6" : dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
  ], "class:list")}${addAttribute(noticia.category, "data-category")}> <div${addAttribute([
    "overflow-hidden",
    isFeatured ? "rounded-xl h-full" : "w-full"
  ], "class:list")}> ${renderComponent($$result, "ImageContainer", $$ImageContainer, { "src": noticia.thumbnail, "alt": tituloLimpio, "class:list": [
    "transition-transform duration-700 group-hover:scale-110",
    isFeatured ? "h-64 lg:h-10/12 min-h-62.5 lg:min-h-100" : "aspect-video md:aspect-16/10"
  ] })} </div> <div class="flex flex-col grow p-4 md:p-5 space-y-4"> <div class="flex justify-between items-center gap-2"> ${renderComponent($$result, "Badge", $$Badge, { "variant": noticia.category }, { "default": ($$result2) => renderTemplate`${noticia.category}` })} <span class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 truncate"> ${noticia.sourceName} </span> </div> <div class="space-y-3 grow"> <h3${addAttribute([
    "font-black leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300",
    isFeatured ? "text-2xl md:text-3xl lg:text-4xl" : "text-lg md:text-xl line-clamp-2 md:line-clamp-3",
    dark ? "text-white" : "text-slate-900 dark:text-white"
  ], "class:list")}> <a${addAttribute(noticia.link, "href")} target="_blank" rel="noopener noreferrer">${tituloLimpio}</a> </h3> <p${addAttribute([
    "text-sm leading-relaxed line-clamp-3",
    dark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
  ], "class:list")}> ${snippetLimpio} </p> ${isFeatured && renderTemplate`<div class="pt-4"> ${renderComponent($$result, "Button", $$Button, { "href": noticia.link, "class": "w-full md:w-auto" }, { "default": ($$result2) => renderTemplate`
Leer noticia completa
` })} </div>`} </div> <footer class="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center"> <time class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic"> ${fecha} </time> ${!isFeatured && renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": noticia.link, "variant": "ghost", "class": "px-0! min-h-0! py-0! text-blue-600 dark:text-blue-400 hover:bg-transparent" }, { "default": ($$result2) => renderTemplate`
LEER MÁS →
` })}`} </footer> </div> </article> ${renderScript($$result, "/home/braydev/projects/Braydev/news/src/components/new/NewCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/braydev/projects/Braydev/news/src/components/new/NewCard.astro", void 0);

const SOURCES = {
  general: [
    {
      name: "El Espectador",
      url: "https://www.elespectador.com/arc/outboundfeeds/discover/?outputType=xml"
    },
    { name: "El Tiempo", url: "https://www.eltiempo.com/rss/colombia.xml" },
    { name: "BBC Mundo", url: "https://feeds.bbci.co.uk/mundo/rss.xml" },
    { name: "CNN en Español", url: "https://cnnespanol.cnn.com/feed/" },
    {
      name: "El País (América)",
      url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada"
    },
    { name: "DW Actualidad", url: "https://rss.dw.com/rdf/rss-sp-all" },
    { name: "France 24", url: "https://www.france24.com/es/rss" },
    { name: "La Republica", url: "https://www.larepublica.co/rss" }
  ],
  tecnologia: [
    { name: "Xataka", url: "https://feeds.feedburner.com/xataka2" },
    { name: "Applesfera", url: "https://feeds.feedburner.com/applesfera" },
    { name: "Genbeta", url: "https://feeds.feedburner.com/genbeta" },
    {
      name: "Wired Tech",
      url: "https://www.wired.com/feed/category/gear/latest/rss"
    },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
    { name: "Hipertextual", url: "https://hipertextual.com/feed" }
  ],
  deportes: [
    { name: "Marca", url: "https://e00-marca.uecdn.es/rss/portada.xml" },
    {
      name: "AS Colombia",
      url: "https://colombia.as.com/rss/tags/ultimas_noticias/a/"
    },
    { name: "ESPN", url: "https://www.espn.com.co/espn/rss/news" },
    {
      name: "El Tiempo Deportes",
      url: "https://www.eltiempo.com/rss/deportes.xml"
    }
  ],
  politica: [
    {
      name: "El Espectador Política",
      url: "https://www.elespectador.com/arc/outboundfeeds/politica/?outputType=xml"
    },
    { name: "Semana Política", url: "https://www.semana.com/rss/politica" },
    { name: "La Silla Vacía", url: "https://www.lasillavacia.com/feed/" }
  ],
  finanzas: [
    { name: "Portafolio", url: "https://www.portafolio.co/rss/negocios" },
    { name: "La República", url: "https://www.larepublica.co/rss" },
    { name: "Forbes Colombia", url: "https://forbes.co/feed/" },
    { name: "Bloomberg", url: "https://www.bloomberglinea.com/index.xml" }
  ],
  local: [
    { name: "Chicanoticias", url: "https://www.chicanoticias.com/feed/" },
    { name: "GS Noticias", url: "https://gsnoticias.com/feed/" },
    { name: "Montería Radio 38", url: "https://www.monteriaradio.com/feed/" },
    { name: "Zenu Radio", url: "https://zenuradio.com/feed/" }
  ]
};

const IMG_SRC_REGEX = /<img[^>]+src=["']([^"']+)["']/i;
const transformItem = (item, sourceName, category) => {
  const rawItem = item;
  const htmlContent = item.content || item.description || "";
  const rawSnippet = htmlContent.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  const thumb = rawItem.enclosure?.url || rawItem.media?.content?.[0]?.url || rawItem.media?.thumbnail?.[0]?.url || htmlContent.match(IMG_SRC_REGEX)?.[1] || "/placeholder-news.jpg";
  return {
    title: (item.title || "Sin título").trim(),
    link: item.link || "#",
    pubDate: item.pubDate || (/* @__PURE__ */ new Date()).toISOString(),
    contentSnippet: rawSnippet.slice(0, 160) + (rawSnippet.length >= 160 ? "..." : ""),
    category,
    sourceName,
    thumbnail: thumb
  };
};
async function getNews(category, topInterest) {
  const selectedSources = Object.entries(SOURCES).flatMap(
    ([cat, srcs]) => srcs.map((s) => ({ ...s, category: cat }))
  );
  const allNews = await Promise.all(
    selectedSources.map(async (source) => {
      const { ok, data } = await getRss(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 ...",
          Accept: "application/rss+xml, ..."
        },
        timeout: 8e3,
        rssMode: "lenient"
      });
      if (!ok || !data?.items?.length) return [];
      return data.items.map(
        (item) => transformItem(item, source.name, source.category)
      );
    })
  );
  const flattenedNews = allNews.flat();
  return flattenedNews.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    let scoreA = dateA;
    let scoreB = dateB;
    return scoreB - scoreA;
  });
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const userPreference = Astro2.cookies.get("pref_category")?.value;
  const todasLasNoticias = await getNews();
  let noticiasOrdenadas = [...todasLasNoticias];
  if (userPreference) {
    noticiasOrdenadas = todasLasNoticias.sort((a, b) => {
      const isAPreferred = a.category === userPreference;
      const isBPreferred = b.category === userPreference;
      if (isAPreferred && !isBPreferred) return -1;
      if (!isAPreferred && isBPreferred) return 1;
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });
  }
  const [noticiaPrincipal, ...otrasNoticias] = noticiasOrdenadas;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "BrayNews - Noticias de Montería, Córdoba y el Mundo | Actualidad de BrayDev", "description": "BrayNews: Tu portal de noticias inteligente. Lee lo último sobre tecnología, deportes, política, finanzas y noticias locales de Montería y Córdoba.", "keywords": "BrayNews, noticias Montería, noticias Córdoba, noticias Colombia, portal de noticias, actualidad en tiempo real, noticias de BrayDev, tecnología, deportes, política, finanzas" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 py-8"> <header class="mb-12"> <h1 class="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter"> ${userPreference ? `Noticias para ti: ${userPreference}` : "Últimas Noticias"} </h1> <p class="text-slate-500 dark:text-slate-400 font-medium"> ${userPreference ? `Basado en tu interés por ${userPreference}, hemos actualizado tu portada.` : "La actualidad de Montería y el mundo en un solo lugar."} </p> </header> ${noticiaPrincipal && renderTemplate`<section class="mb-16"> ${renderComponent($$result2, "NewsCard", $$NewCard, { "noticia": noticiaPrincipal, "variant": "featured" })} </section>`} <section> <div class="flex items-center gap-4 mb-8"> <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Más para leer
</h2> <div class="h-px bg-slate-200 dark:bg-slate-800 grow"></div> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${otrasNoticias.slice(0, 12).map((n) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewCard, { "noticia": n })}`)} </div> </section> </main> ` })}`;
}, "/home/braydev/projects/Braydev/news/src/pages/index.astro", void 0);

const $$file = "/home/braydev/projects/Braydev/news/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
