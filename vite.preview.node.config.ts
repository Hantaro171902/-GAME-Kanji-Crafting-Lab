import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Preview build: emit a self-contained node-server bundle (Nitro node-server
// preset) instead of the default Cloudflare Worker output, so the preview
// container can serve it with `node server/index.mjs`.
export default defineConfig({
  nitro: {
    preset: "node-server",
    output: { dir: ".preview-dist/output" },
  },
});