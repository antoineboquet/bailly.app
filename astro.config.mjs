import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  build: {
    format: "file"
  },
  integrations: [
    solidJs(),
    tailwind({
      applyBaseStyles: false
    })
  ],
  trailingSlash: "never"
});
