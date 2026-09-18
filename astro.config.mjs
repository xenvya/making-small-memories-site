import { defineConfig } from "astro/config";
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://makingsmallmemories.com",
  output: "static",
  trailingSlash: "never",
  redirects: {
    "/concept-one": "/",
    "/concept-two": "/",
    "/concept-three": "/",
    "/concept-four": "/",
    "/concept-five": "/",
  },
  build: { format: "file" },
});
