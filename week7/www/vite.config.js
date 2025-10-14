import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  base: "./",
  build: {
    target: "esnext",
    outDir: "../../docs/week7",
    sourcemap: true,
  },

  server: {
    open: true,
  },
});
