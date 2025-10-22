import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait(), tailwindcss()],
  build: {
    outDir: "../docs/week8",
  },
  base: "/Web_Interaction_2025/week8/",
});
