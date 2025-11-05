import themeTokens from './themeTokens.js';
import cssVarsPlugin from './cssVarsPlugin.js';
import textStylesPlugin from "../../config/textStylesPlugin.js";

export default {
  theme: {
    extend: {
      ...themeTokens,
    },
  },
  plugins: [cssVarsPlugin, textStylesPlugin],
};
