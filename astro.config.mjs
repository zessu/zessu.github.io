// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import db from "@astrojs/db";
import seedData from "./db-init-integration.mjs";
import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://drew.is-a.dev",
  integrations: [mdx(), sitemap(), db(), seedData()],

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

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});