import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  site: 'https://portfolio-braydev.xyz',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    ssr: {
      noExternal: ['@braydev/venus']
    },
    optimizeDeps: {
      exclude: ['@braydev/venus']
    }
  }
});