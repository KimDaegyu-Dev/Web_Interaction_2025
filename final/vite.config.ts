import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // other Babel plugins
          [
            "@locator/babel-jsx/dist",
            {
              env: "development",
            },
          ],
        ],
      },
    }),
    tailwindcss(),
    svgr({
      include: "**/*.svg?react",
      svgrOptions: {
        ref: true,
        expandProps: "end",
        replaceAttrValues: {
          strokecolor: "{props.strokecolor}",
          bgcolor: "{props.bgcolor}",
          fillcolor: "{props.fillcolor}",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    minify: true,
    cssCodeSplit: true,
    cssMinify: true,
  },
});
