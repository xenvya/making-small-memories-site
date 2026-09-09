import { defineConfig } from "astro/config";
export default defineConfig({
  site:
    process.env.PUBLIC_SITE_URL ||
    "https://making-small-memories-concepts.xenvya.workers.dev",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
});
