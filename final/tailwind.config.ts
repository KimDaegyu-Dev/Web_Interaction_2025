import type { Config } from "tailwindcss";
import preset from "tailwindcss-preset-px-to-rem";
import tailwindPreset from "./design-tokens/build/tailwind/preset.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [preset, tailwindPreset],
} satisfies Config;
