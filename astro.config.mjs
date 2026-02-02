// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://noticias.braydev.xyz', 
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap()
  ],
  output: 'static', 
  build: {
    inlineStylesheets: 'always'
  }
});