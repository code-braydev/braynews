import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  site: 'https://braydev.xyz',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    ssr: {
      // Forzamos a que Venus y otras dependencias se empaqueten 
      // dentro del archivo entry.mjs para que Vercel no tenga que buscarlas
      noExternal: ['@braydev/venus']
    },
    optimizeDeps: {
      exclude: ['@braydev/venus']
    }
  }
});