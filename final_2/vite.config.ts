import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: "**/*.svg?react",
      svgrOptions: {
        ref: true,
        expandProps: "end",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/Web_Interaction_2025/final_2/",
  build: {
    outDir: "../docs/final_2",
    assetsDir: "assets",
    sourcemap: true,
    minify: true,
    cssCodeSplit: true,
    cssMinify: true,
  },
});
