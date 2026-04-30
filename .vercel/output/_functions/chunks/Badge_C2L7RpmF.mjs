import { c as createComponent } from './astro-component_eBedEnUG.mjs';
import 'piccolore';
import { n as createRenderInstruction, m as maybeRenderHead, h as addAttribute, o as renderSlot, r as renderTemplate, l as renderComponent, p as renderHead } from './entrypoint_BIWdabtt.mjs';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Button;
  const { href, id, class: className, variant = "primary" } = Astro2.props;
  const baseStyles = "inline-flex items-center justify-center transition-all duration-300 active:scale-95 select-none touch-manipulation";
  const variantStyles = {
    primary: {
      base: "px-6 py-3 min-h-[44px] text-sm md:text-base font-bold rounded-xl shadow-sm",
      colors: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 border border-transparent dark:border-blue-400/20 shadow-blue-900/10"
    },
    outline: {
      base: "px-6 py-3 min-h-[44px] text-sm md:text-base font-bold rounded-xl",
      colors: "bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
    },
    ghost: {
      base: "px-6 py-3 min-h-[44px] text-sm md:text-base font-bold rounded-xl",
      colors: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none"
    },
    icon: {
      base: "p-2 rounded-lg",
      colors: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none"
    },
    toggle: {
      base: "h-6 w-11 rounded-full shadow-inner",
      colors: "bg-slate-200 dark:bg-slate-700 shadow-inner transition-colors duration-300"
    }
  };
  const { base, colors } = variantStyles[variant];
  const styles = `${baseStyles} ${base} ${colors} ${className || ""}`;
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(styles, "class")}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(id, "id")}${addAttribute(styles, "class")}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/home/braydev/projects/Braydev/news/src/components/ui/Button.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const { pathname } = Astro2.url;
  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Tech", href: "/categoria/tecnologia" },
    { name: "Deportes", href: "/categoria/deportes" },
    { name: "Política", href: "/categoria/politica" },
    { name: "Finanzas", href: "/categoria/finanzas" },
    { name: "Local", href: "/categoria/local" }
  ];
  const isCurrentPage = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<header class="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300" data-astro-cid-j2devmb2> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j2devmb2> <div class="flex justify-between items-center h-14 md:h-16" data-astro-cid-j2devmb2> <div class="flex items-center gap-2 min-w-0" data-astro-cid-j2devmb2> <a href="/" class="flex items-center gap-2 group" data-astro-cid-j2devmb2> <div class="shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center overflow-hidden rounded-md bg-blue-50 dark:bg-slate-800" data-astro-cid-j2devmb2> <img src="/logo.png" alt="BrayNews Logo" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" data-astro-cid-j2devmb2> </div> <span class="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tighter truncate uppercase" data-astro-cid-j2devmb2>\nBRAY<span class="text-blue-600" data-astro-cid-j2devmb2>NEWS</span> </span> </a> </div> <nav class="hidden lg:flex items-center space-x-1" data-astro-cid-j2devmb2> ', ' </nav> <div class="flex items-center gap-2 md:gap-3 ml-2" data-astro-cid-j2devmb2> <div id="interest-tag" class="hidden animate-fade-in px-2 py-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest shadow-md" data-astro-cid-j2devmb2>\nPARA TI\n</div> ', " ", ' </div> </div> </div> <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 absolute w-full shadow-2xl animate-fade-in" data-astro-cid-j2devmb2> ', ' </div> </header> <script>\n  // Lógica del Tema (Persistente)\n  const themeToggle = document.getElementById("theme-toggle");\n  const html = document.documentElement;\n\n  const updateTheme = () => {\n    const isDark = html.classList.contains("dark");\n    localStorage.setItem("theme", isDark ? "dark" : "light");\n  };\n\n  themeToggle?.addEventListener("click", () => {\n    html.classList.toggle("dark");\n    updateTheme();\n  });\n\n  // Menú Móvil\n  const btn = document.getElementById("mobile-menu-btn");\n  const menu = document.getElementById("mobile-menu");\n  btn?.addEventListener("click", () => menu?.classList.toggle("hidden"));\n\n  // Lógica de Interés (Cookies de BrayNews)\n  const interestTag = document.getElementById("interest-tag");\n  const cookieValue = document.cookie\n    .split("; ")\n    .find((row) => row.startsWith("pref_category="))\n    ?.split("=")[1];\n\n  if (cookieValue && interestTag) {\n    interestTag.classList.remove("hidden");\n    interestTag.classList.add("flex");\n    // Opcional: Podrías cambiar el texto a "PARA TI: " + cookieValue\n  }\n<\/script>'])), maybeRenderHead(), navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute([
    "px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap",
    isCurrentPage(item.href) ? "bg-blue-600 text-white shadow-md shadow-blue-400/20" : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
  ], "class:list")} data-astro-cid-j2devmb2> ${item.name} </a>`), renderComponent($$result, "Button", $$Button, { "id": "theme-toggle", "variant": "toggle", "class": "relative group shrink-0 flex items-center justify-start pl-0.5", "data-astro-cid-j2devmb2": true }, { "default": ($$result2) => renderTemplate` <div class="h-5 w-5 flex items-center justify-center rounded-full bg-white dark:bg-blue-400 transition-transform duration-300 shadow-sm z-10 translate-x-0 dark:translate-x-5" data-astro-cid-j2devmb2> <span class="dark:hidden text-[9px] leading-none" data-astro-cid-j2devmb2>☀️</span> <span class="hidden dark:block text-[9px] leading-none" data-astro-cid-j2devmb2>🌙</span> </div> ` }), renderComponent($$result, "Button", $$Button, { "id": "mobile-menu-btn", "variant": "icon", "class": "lg:hidden", "data-astro-cid-j2devmb2": true }, { "default": ($$result2) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-j2devmb2> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" data-astro-cid-j2devmb2></path> </svg> ` }), navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800" data-astro-cid-j2devmb2> ${item.name} </a>`));
}, "/home/braydev/projects/Braydev/news/src/components/shared/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors duration-300"> <div class="max-w-7xl mx-auto px-6 py-8 md:py-10"> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-8 md:mb-10 text-center md:text-left"> <div class="space-y-3 flex flex-col items-center md:items-start"> <div class="flex items-center gap-2 group"> <div class="shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center overflow-hidden rounded-md"> <img src="/logo.png" alt="Logo de BrayNews" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"> </div> <span class="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tighter truncate uppercase">
BRAY<span class="text-blue-600">NEWS</span> </span> </div> <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
Tu portal de noticias de confianza. Actualidad local de Montería,
          tecnología y el mundo en un solo lugar.
</p> </div> <div> <h4 class="font-bold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-[0.2em]">
Secciones
</h4> <ul class="text-sm space-y-2.5 text-slate-500 dark:text-slate-400 font-medium"> <li> <a href="/categoria/tecnologia" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tecnología</a> </li> <li> <a href="/categoria/deportes" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Deportes</a> </li> <li> <a href="/categoria/politica" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Política</a> </li> <li> <a href="/categoria/finanzas" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Finanzas</a> </li> <li> <a href="/categoria/local" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Montería y Córdoba</a> </li> </ul> </div> <div> <h4 class="font-bold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-[0.2em]">
Legal
</h4> <ul class="text-sm space-y-2.5 text-slate-500 dark:text-slate-400 font-medium"> <li> <a href="/contacto" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contacto</a> </li> <li> <a href="/privacidad" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Política de Privacidad</a> </li> <li> <a href="/terminos" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Términos de Servicio</a> </li> </ul> </div> </div> <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center"> <p class="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-widest text-center md:text-left">
&copy; ${year} BrayNews — Hecho con ❤️ desde Montería, Colombia.
</p> </div> </div> </footer>`;
}, "/home/braydev/projects/Braydev/news/src/components/shared/Footer.astro", void 0);

const $$CookieConsent = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="cookie-banner" class="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-sm z-50 transform translate-y-20 opacity-0 transition-all duration-500 ease-out hidden"> <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl p-6 md:p-8"> <div class="flex items-center gap-3 mb-4"> <div class="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-xl">
🍪
</div> <h2 class="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">
Privacidad <span class="text-blue-600">&</span> Cookies
</h2> </div> <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
Al navegar en <strong>BrayNews</strong>, aceptas nuestros
<a href="/terminos" class="text-blue-600 underline font-bold">Términos de Uso</a> y el uso de cookies para mejorar tu experiencia.
</p> <div class="flex flex-col gap-3"> ${renderComponent($$result, "Button", $$Button, { "id": "accept-cookies", "class": "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95" }, { "default": ($$result2) => renderTemplate`
Aceptar y Continuar
` })} </div> </div> </div> ${renderScript($$result, "/home/braydev/projects/Braydev/news/src/components/CookieConsent.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/braydev/projects/Braydev/news/src/components/CookieConsent.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "BrayNews: Tu portal de noticias inteligente con la actualidad de Montería, Córdoba y el mundo. Las mejores noticias de BrayDev.",
    author = "BrayDev",
    keywords = "BrayNews, braydev noticias, noticias Montería, noticias Córdoba, noticias Colombia, actualidad monteria, noticias de BrayDev, noticias en tiempo real, portal de noticias",
    ogType = "website",
    ogImage = "/og-image.jpg"
  } = Astro2.props;
  const canonicalURL = new URL(
    Astro2.url.pathname,
    Astro2.site || "https://braydev.xyz"
  );
  return renderTemplate(_a || (_a = __template(['<html lang="es" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/favicon.png"><title>', '</title><meta name="description"', '><meta name="keywords"', '><meta name="author"', '><meta name="copyright"', '><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="language" content="es-CO"><meta name="geo.placename" content="Montería, Córdoba, Colombia"><meta name="geo.region" content="CO-COR"><meta name="geo.position" content="8.7479;-75.8814"><link rel="canonical"', '><link rel="alternate" hreflang="es"', '><link rel="alternate" hreflang="es-CO"', '><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:alt"', '><meta property="og:image:type" content="image/jpeg"><meta property="og:site_name" content="BrayNews"><meta property="og:locale" content="es_CO"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@braydev"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><script>\n      const theme = (() => {\n        if (\n          typeof localStorage !== "undefined" &&\n          localStorage.getItem("theme")\n        ) {\n          return localStorage.getItem("theme");\n        }\n        return window.matchMedia("(prefers-color-scheme: dark)").matches\n          ? "dark"\n          : "light";\n      })();\n\n      if (theme === "dark") {\n        document.documentElement.classList.add("dark");\n      } else {\n        document.documentElement.classList.remove("dark");\n      }\n    <\/script><!-- Schema.org JSON-LD: Organization & NewsMediaOrganization --><script type="application/ld+json">\n      {\n        "@context": "https://schema.org",\n        "@type": ["NewsMediaOrganization", "Organization"],\n        "name": "BrayNews",\n        "alternateName": "Bray News",\n        "description": "Portal de noticias inteligente con actualidad de Montería, Córdoba y el mundo.",\n        "url": "https://braydev.xyz",\n        "logo": {\n          "@type": "ImageObject",\n          "url": "https://braydev.xyz/logo.png",\n          "width": 500,\n          "height": 500\n        },\n        "image": "https://braydev.xyz/og-image.jpg",\n        "sameAs": ["https://twitter.com/braydev", "https://github.com/braydev"],\n        "founder": {\n          "@type": "Person",\n          "name": "BrayDev"\n        },\n        "address": {\n          "@type": "PostalAddress",\n          "addressLocality": "Montería",\n          "addressRegion": "Córdoba",\n          "addressCountry": "CO"\n        },\n        "contactPoint": {\n          "@type": "ContactPoint",\n          "contactType": "Customer Service",\n          "url": "https://braydev.xyz/contacto"\n        },\n        "knowsAbout": [\n          "Noticias",\n          "Tecnología",\n          "Deportes",\n          "Política",\n          "Finanzas",\n          "Montería",\n          "Córdoba"\n        ]\n      }\n    <\/script>', '</head> <body class="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col antialiased"> ', ' <main class="grow relative"> ', " ", " </main> ", " </body></html>"])), title, addAttribute(description, "content"), addAttribute(keywords, "content"), addAttribute(author, "content"), addAttribute(`© 2026 ${author}`, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "href"), addAttribute(ogType, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(ogImage, Astro2.site).href, "content"), addAttribute(title, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(ogImage, Astro2.site).href, "content"), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "CookieConsent", $$CookieConsent, {}), renderComponent($$result, "Footer", $$Footer, {}));
}, "/home/braydev/projects/Braydev/news/src/layouts/Layout.astro", void 0);

const $$Badge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Badge;
  const { variant = "default" } = Astro2.props;
  const variants = {
    tecnologia: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
    general: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-400/10 dark:text-slate-400 dark:border-slate-400/20",
    local: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
    deportes: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20",
    politica: "bg-red-100 text-red-700 border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
    finanzas: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20",
    default: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  };
  return renderTemplate`${maybeRenderHead()}<span${addAttribute([
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px]",
    "uppercase tracking-[0.12em] font-black border transition-all duration-300",
    "whitespace-nowrap select-none",
    variants[variant]
  ], "class:list")}> ${renderSlot($$result, $$slots["default"])} </span>`;
}, "/home/braydev/projects/Braydev/news/src/components/ui/Badge.astro", void 0);

export { $$Layout as $, $$Badge as a, $$Button as b, renderScript as r };
