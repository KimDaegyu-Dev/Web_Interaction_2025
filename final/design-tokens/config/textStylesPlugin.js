import plugin from "tailwindcss/plugin";
import themeTokens from "../build/tailwind/themeTokens.js";

/**
 * Tailwind Plugin - textStyles
 * 자동으로 textStyles 객체를 .text-{key} 클래스로 등록
 */
export default plugin(function ({ addComponents }) {
  const styles = themeTokens.textStyles || {};
  const components = {};

  for (const [key, style] of Object.entries(styles)) {
    // 카멜케이스 → CSS 속성명으로 변환
    const cssStyle = Object.fromEntries(
      Object.entries(style).map(([prop, val]) => {
        const kebab = prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

        // 값 정규화
        let normalized = val;
        if (typeof val === "string") {
          normalized = val
            .replace("SemiBold", "600")
            .replace("Bold", "700")
            .replace("Medium", "500")
            .replace("Regular", "400");
        }

        // 단위/문자 정규화
        if (prop === "letterSpacing" && val.endsWith("%")) {
          // -3% → -0.03em
          const num = parseFloat(val) / 100;
          normalized = `${num}em`;
        }

        if (prop === "fontSize" && !isNaN(parseFloat(val))) {
          normalized = `${val}px`;
        }

        if (prop === "textCase") {
          return [
            "text-transform",
            val === "none" ? "none" : val.toLowerCase(),
          ];
        }

        if (prop === "textDecoration") {
          return [
            "text-decoration",
            val === "none" ? "none" : val.toLowerCase(),
          ];
        }

        return [kebab, normalized];
      }),
    );

    components[`.text-${key}`] = cssStyle;
  }

  addComponents(components);
});
