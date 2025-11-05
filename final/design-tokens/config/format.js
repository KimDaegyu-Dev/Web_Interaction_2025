import { isColor } from "./filter.js";
import {
  parseBorderToken,
  parseGenericToken,
  parseTextStyleToken,
  parseTypographyToken,
} from "./transform.js";

/**
 * Exports tailwind plugin for declaring root CSS vars
 * @see https://tailwindcss.com/docs/plugins#overview
 */
export function cssVarsPlugin({ dictionary }) {
  const vars = dictionary.allTokens
    .map((token) => {
      let value = token?.$value || token?.value;

      // ✅ 객체인 경우 문자열(JSON)로 변환
      if (typeof value === "object") {
        try {
          value = JSON.stringify(value);
        } catch {
          value = String(value);
        }
      }

      // ✅ 숫자는 그대로, 문자열은 따옴표로 감쌈
      const formattedValue = typeof value === "number" ? value : `'${value}'`;

      return `'--${token.name}': ${formattedValue}`;
    })
    .join(",\n\t\t\t");

  return `import plugin from 'tailwindcss/plugin.js';

export default plugin(function ({ addBase }) {
\taddBase({
\t\t':root': {
\t\t\t${vars},
\t\t},
\t});
});\n`;
}

/**
 * Exports theme color definitions
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
// export function themeColors({ dictionary, options }) {
//   const tokens = dictionary.allTokens.filter((token) =>
//     isColor(token, options),
//   );

//   const theme = tokens
//     .map((token) => {
//       return `\t'${token.name}': 'rgb(var(--${token.name}))'`;
//     })
//     .join(",\n");

//   return `export default {\n${theme},\n};\n`;
// }
//=> Token 전체 굽기로 대체
// ---------- 5. Main Formatter ----------
export function themeTokens({ dictionary }) {
  const tailwindMap = {
    color: "colors",
    colors: "colors",
    spacing: "spacing",
    border: "border",
    typography: "typography",
    opacity: "opacity",
    shadow: "boxShadow",
    elevation: "boxShadow",
    motion: "transitionDuration",
    "z-index": "zIndex",
    dimension: "width",
    grid: "width",
  };

  const result = {
    colors: {},
    spacing: {},
    borderRadius: {},
    borderWidth: {},
    boxShadow: {},
    opacity: {},
    transitionDuration: {},
    transitionTimingFunction: {},
    zIndex: {},
    width: {},
    height: {},
    fontFamily: {},
    fontWeight: {},
    fontSize: {},
    lineHeight: {},
    letterSpacing: {},
    textStyles: {},
  };

  // 🚫 제외할 카테고리 정의
  const excludedCategories = ["grid", "dimension", "motion", "elevation"];

  dictionary.allTokens.forEach((token) => {
    const [category, ...rest] = token.path;
    const lowerCategory = category.toLowerCase();
    const tailwindKey = tailwindMap[category];
    const name = rest.join("-").replace(/^\d+-/, "");
    const value = token.$value;

    // 🚫 특정 카테고리는 themeTokens에서 제외
    if (excludedCategories.includes(lowerCategory)) return;

    // 1️⃣ 복합 텍스트 (Headings, Body 등)
    if (
      [
        "headings",
        "mobile headings",
        "headline",
        "body",
        "body large",
        "caption",
        "footnote",
        "small",
      ].includes(lowerCategory)
    ) {
      parseTextStyleToken(token, result, category, name, value);
      return;
    }

    // 2️⃣ border 토큰 처리
    if (lowerCategory === "border") {
      parseBorderToken(token, result, name, value);
      return;
    }

    // 3️⃣ typography 토큰 처리
    if (lowerCategory === "typography") {
      parseTypographyToken(token, result, name, value);
      return;
    }

    // 4️⃣ 일반 속성 처리
    if (tailwindKey) {
      parseGenericToken(token, result, tailwindKey, name, value);
    }
  });

  return `export default ${JSON.stringify(result, null, 2)};`;
}

/**
 * Exports tailwind preset
 * @see https://tailwindcss.com/docs/presets
 */
// export function preset() {
//   return `import themeColors from './themeColors.js';
// import cssVarsPlugin from './cssVarsPlugin.js';

// export default {
// \ttheme: {
// \t\textend: {
// \t\t\tcolors: {
// \t\t\t\t...themeColors, // <-- theme colors defined here
// \t\t\t},
// \t\t},
// \t},
// \tplugins: [cssVarsPlugin], // <-- plugin imported here
// };\n`;
// }
/**
 * Exports tailwind preset
 * @see https://tailwindcss.com/docs/presets
 */
export function preset() {
  return `import themeTokens from './themeTokens.js';
import cssVarsPlugin from './cssVarsPlugin.js';
import textStylesPlugin from "../../config/textStylesPlugin.js";

export default {
  theme: {
    extend: {
      ...themeTokens,
    },
  },
  plugins: [cssVarsPlugin, textStylesPlugin],
};\n`;
}
