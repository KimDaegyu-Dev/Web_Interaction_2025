import StyleDictionary from "style-dictionary";
import { isColor } from "./config/filter.js";
import {
  cssVarsPlugin,
  preset,
  // themeColors,
  themeTokens,
} from "./config/format.js";
import { rgbChannels } from "./config/transform.js";

StyleDictionary.registerTransform({
  name: "color/rgb-channels",
  type: "value",
  filter: isColor,
  transform: rgbChannels,
});

StyleDictionary.registerTransformGroup({
  name: "tailwind",
  transforms: ["name/kebab", "color/rgb", "color/rgb-channels"],
});

StyleDictionary.registerFormat({
  name: "tailwind/css-vars-plugin",
  format: cssVarsPlugin,
});
StyleDictionary.registerFormat({
  name: "tailwind/theme-tokens",
  format: themeTokens,
});

// StyleDictionary.registerFormat({
//   name: "tailwind/theme-colors",
//   format: themeColors,
// });

StyleDictionary.registerFormat({
  name: "tailwind/preset",
  format: preset,
});

export default {
  source: ["./tokens/**/*.json"],
  platforms: {
    tailwindPreset: {
      buildPath: "build/tailwind/",
      transformGroup: "tailwind",
      transitive: false, // ✅ 참조 유지
      files: [
        {
          destination: "cssVarsPlugin.js",
          format: "tailwind/css-vars-plugin",
        },
        {
          destination: "themeTokens.js",
          format: "tailwind/theme-tokens",
        },
        // {
        //   destination: "themeColors.js",
        //   format: "tailwind/theme-colors",
        // },
        {
          destination: "preset.js",
          format: "tailwind/preset",
        },
      ],
    },
  },
};

//config.json
// {
//   "source": ["tokens/**/*.json"],
//   "platforms": {
//     "css": {
//       "transformGroup": "css",
//       "buildPath": "build/css/",
//       "files": [{ "destination": "variables.css", "format": "css/variables" }]
//     },
//     "tailwind": {
//       "transformGroup": "js",
//       "buildPath": "build/tailwind/",
//       "files": [
//         { "destination": "tokens-tailwind.js", "format": "javascript/es6" }
//       ]
//     }
//   }
// }
