export function rgbChannels(token) {
  const value = token?.$value || token?.value;
  const { r, g, b, a } = parseRGBA(value);
  const hasAlpha = a !== undefined;
  return `${r} ${g} ${b}${hasAlpha ? " / " + a : ""}`;
}

function parseRGBA(value) {
  const regex =
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+%?))?\s*\)/;
  const matches = value.match(regex);
  if (!matches) {
    throw new Error(`Value '${value}' is not a valid rgb or rgba format.`);
  }
  const [, r, g, b, a] = matches;
  return {
    r,
    g,
    b,
    a:
      a !== undefined
        ? a.endsWith("%")
          ? parseFloat(a) / 100
          : parseFloat(a)
        : undefined,
  };
}

// ---------- 1. Border Parser ----------
export function parseBorderToken(token, result, name, value) {
  const key = token.name.toLowerCase();
  if (key.includes("width")) {
    result.borderWidth[name.replace("width-", "")] = value;
  } else if (key.includes("radius")) {
    result.borderRadius[name.replace("radius-", "")] = value;
  }
}

// ---------- 2. Typography Parser ----------
export function parseTypographyToken(token, result, name, value) {
  const key = token.name.toLowerCase();

  const map = [
    { match: "font-families", target: "fontFamily" },
    { match: "font-weight", target: "fontWeight" },
    { match: "font-sizes", target: "fontSize" },
    { match: "line-height", target: "lineHeight" },
    { match: "letter-spacing", target: "letterSpacing" },
  ];

  for (const { match, target } of map) {
    if (key.includes(match)) {
      const clean = name.replace(`${match}-`, "");
      result[target][clean] = value;
      return;
    }
  }
}

// ---------- 3. TextStyle Parser ----------
export function parseTextStyleToken(token, result, category, name, value) {
  const textKey = `${category}-${name}`.replace(/\s+/g, "-").toLowerCase();

  if (typeof token.$value === "object" && token.$value !== null) {
    const typographyObj = {};

    for (const [prop, val] of Object.entries(token.$value)) {
      if (typeof val !== "string") continue;

      // ✅ 참조가 있는 경우 그대로 var(--...) 변환
      if (val.startsWith("{") && val.endsWith("}")) {
        typographyObj[prop] = `var(--${val
          .replace(/[{}]/g, "")
          .replace(/\./g, "-")})`;
      } else {
        // ✅ 리터럴 값은 그대로 사용
        typographyObj[prop] = val;
      }
    }

    result.textStyles[textKey] = typographyObj;
  } else {
    // 단일 문자열 값일 경우 참조 처리
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      result.textStyles[textKey] =
        `var(--${value.replace(/[{}]/g, "").replace(/\./g, "-")})`;
    } else {
      result.textStyles[textKey] = value;
    }
  }
}

// ---------- 4. Generic Token Parser ----------
export function parseGenericToken(token, result, tailwindKey, name, value) {
  if (!result[tailwindKey]) result[tailwindKey] = {};

  // ✅ 참조 문자열 그대로 처리
  if (
    typeof value === "string" &&
    value.startsWith("{") &&
    value.endsWith("}")
  ) {
    result[tailwindKey][name] =
      `var(--${value.replace(/[{}]/g, "").replace(/\./g, "-")})`;
  } else {
    result[tailwindKey][name] = value;
  }
}
