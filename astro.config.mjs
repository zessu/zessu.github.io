// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: "https://github.com/zessu/zessu.github.io",
  integrations: [mdx(), sitemap(), db()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "load",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "synthwave-84",
        dark: "dracula",
      },
    },
  },
});
