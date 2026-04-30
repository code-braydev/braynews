import { c as createComponent } from './astro-component_eBedEnUG.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_BIWdabtt.mjs';
import { $ as $$Layout, a as $$Badge } from './Badge_C2L7RpmF.mjs';

const $$Terminos = createComponent(($$result, $$props, $$slots) => {
  const title = "Compromiso del Lector | BrayNews";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": "Términos y condiciones de uso de BrayNews. Información sobre nuestra naturaleza como agregador y curador de noticias." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-3xl mx-auto px-6 py-16 md:py-24"> <article class="animate-fade-in"> <header class="border-b border-slate-100 dark:border-slate-800 pb-10 mb-12"> <div class="mb-4"> ${renderComponent($$result2, "Badge", $$Badge, { "variant": "general" }, { "default": ($$result3) => renderTemplate`Legal` })} </div> <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
Términos de <span class="text-blue-600">Uso</span> </h1> <p class="text-lg text-slate-500 dark:text-slate-400 mt-4 font-medium">
Transparencia y claridad sobre nuestra labor de curación informativa.
</p> </header> <div class="space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg"> <section> <div class="flex items-center gap-3 mb-4"> <div class="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
01
</div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Naturaleza del Servicio
</h2> </div> <p> <strong>BrayNews</strong> funciona como un nodo tecnológico de curación
            y centralización de actualidad. Nuestra plataforma organiza información
            de diversas fuentes oficiales para facilitar el acceso a la noticia de
            manera ágil. No reemplazamos al medio emisor, sino que actuamos como un
            puente directo hacia el periodismo profesional.
</p> </section> <section> <div class="flex items-center gap-3 mb-4"> <div class="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
02
</div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Propiedad Intelectual
</h2> </div> <p>
Respetamos profundamente el trabajo periodístico. Cada tarjeta de
            noticia muestra un fragmento breve (snippet) y enlaza
            obligatoriamente a su <strong>fuente original</strong>. Los derechos
            de autor, marcas, imágenes y textos íntegros pertenecen
            exclusivamente al medio emisor citado en cada publicación.
</p> </section> <section> <div class="flex items-center gap-3 mb-4"> <div class="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
03
</div> <h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
Responsabilidad del Contenido
</h2> </div> <p>
Al ser una plataforma de enlace, <strong>BrayNews</strong> no se hace
            responsable por las opiniones, cambios de última hora o la veracidad de
            la información vertida en los sitios externos. El usuario reconoce que
            al hacer clic en una noticia, está accediendo a un entorno independiente
            de nuestro portal.
</p> </section> </div> <footer class="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6"> <div class="text-center"> <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
Montería, Córdoba - Colombia
</p> <p class="text-xs text-slate-500 mt-1">
Última actualización: Abril 2026
</p> </div> </footer> </article> </main> ` })}`;
}, "/home/braydev/projects/Braydev/news/src/pages/terminos.astro", void 0);

const $$file = "/home/braydev/projects/Braydev/news/src/pages/terminos.astro";
const $$url = "/terminos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terminos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
