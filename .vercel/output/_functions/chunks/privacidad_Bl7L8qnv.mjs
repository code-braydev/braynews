import { c as createComponent } from './astro-component_eBedEnUG.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_BIWdabtt.mjs';
import { $ as $$Layout, a as $$Badge } from './Badge_C2L7RpmF.mjs';

const $$Privacidad = createComponent(($$result, $$props, $$slots) => {
  const title = "Privacidad y Transparencia | BrayNews";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": "Conoce cómo protegemos tu información y mejoramos tu experiencia en BrayNews." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-3xl mx-auto px-6 py-16 md:py-24"> <article class="animate-fade-in"> <header class="border-b border-slate-100 dark:border-slate-800 pb-10 mb-12"> <div class="mb-4"> ${renderComponent($$result2, "Badge", $$Badge, { "variant": "tecnologia" }, { "default": ($$result3) => renderTemplate`Seguridad` })} </div> <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
Privacidad y <span class="text-blue-600">Transparencia</span> </h1> <p class="text-lg text-slate-500 dark:text-slate-400 mt-4 font-medium leading-relaxed">
En BrayNews, tu tranquilidad es tan importante como la información que
          compartimos.
</p> </header> <div class="space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg"> <section> <div class="flex items-center gap-3 mb-3"> <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600"> <span class="text-sm">🛡️</span> </div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Navegación Anónima
</h2> </div> <p>
Nos tomamos en serio la confianza de nuestros lectores. <strong>No solicitamos registros</strong>, nombres o correos electrónicos para acceder a las noticias. Tu
            navegación en este portal es libre y anónima.
</p> </section> <section> <div class="flex items-center gap-3 mb-3"> <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600"> <span class="text-sm">🤝</span> </div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Publicidad y Cookies de Terceros
</h2> </div> <p>
Para mantener BrayNews gratuito, utilizamos proveedores externos
            como <strong>Google AdSense</strong>. Estos proveedores utilizan
            cookies para mostrar anuncios basados en las visitas anteriores del
            usuario a este sitio web o a otros sitios de Internet.
</p> <p class="mt-4">
Los usuarios pueden inhabilitar la publicidad personalizada
            dirigiéndose a <a href="https://www.google.com/settings/ads" class="text-blue-600 underline">Configuración de anuncios</a>.
</p> </section> <section> <div class="flex items-center gap-3 mb-3"> <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600"> <span class="text-sm">✨</span> </div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Preferencias Locales
</h2> </div> <p>
Usamos tecnologías mínimas de almacenamiento local (localStorage)
            para recordar tus preferencias de interfaz, como el <strong>Modo Oscuro</strong>. Estos datos no salen de tu navegador ni se asocian con tu
            identidad personal.
</p> </section> <section> <div class="flex items-center gap-3 mb-3"> <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600"> <span class="text-sm">🔗</span> </div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Enlaces Externos
</h2> </div> <p>
Como agregador, conectamos con medios oficiales. Al hacer clic en
            una noticia, serás redirigido al sitio de origen. Te recomendamos
            revisar sus propias políticas de privacidad, ya que BrayNews no
            tiene control sobre el contenido de terceros.
</p> </section> </div> <footer class="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center"> <p class="text-[10px] text-slate-400 mb-6 uppercase tracking-[0.2em] font-black">
Última actualización: Abril 2026
</p> </footer> </article> </main> ` })}`;
}, "/home/braydev/projects/Braydev/news/src/pages/privacidad.astro", void 0);

const $$file = "/home/braydev/projects/Braydev/news/src/pages/privacidad.astro";
const $$url = "/privacidad";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacidad,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
