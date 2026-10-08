import type { ColorCode } from "./color";

export type Locale = "zh" | "en";

export const ui = {
  zh: {
    nav: { find: "找丝袜", looks: "风格", guide: "用法", learn: "丝袜百科", sources: "方法与来源", changelog: "更新日志", terms: "使用条款" },
    search: "搜 黑丝 / 20D / HL",
    language: "EN",
    motion: { complete: "完整", simple: "简洁", static: "静止" },
  },
  en: {
    nav: { find: "Find hosiery", looks: "Looks", guide: "How to use", learn: "Hosiery 101", sources: "Method & sources", changelog: "Changelog", terms: "Terms" },
    search: "Search black / 20D / HL",
    language: "中文",
    motion: { complete: "Full", simple: "Reduced", static: "Still" },
  },
} as const;

export const colorLabel: Record<ColorCode, { zh: string; en: string }> = {
  black: { zh: "黑色", en: "Black" },
  skin_tone: { zh: "肤色", en: "Skin tones" },
  white: { zh: "白色", en: "White" },
  cream: { zh: "奶油色", en: "Cream" },
  grey: { zh: "灰色", en: "Gray" },
  brown: { zh: "棕色", en: "Brown" },
  navy: { zh: "藏青", en: "Navy" },
  blue: { zh: "蓝色", en: "Blue" },
  red: { zh: "红色", en: "Red" },
  burgundy: { zh: "酒红", en: "Burgundy" },
  pink: { zh: "粉色", en: "Pink" },
  purple: { zh: "紫色", en: "Purple" },
  yellow: { zh: "黄色", en: "Yellow" },
  green: { zh: "绿色", en: "Green" },
  multi: { zh: "多色", en: "Multicolor" },
};

export function localePath(locale: Locale, path: string) {
  const clean = path || "/";
  if (locale === "en") return clean === "/" ? "/en" : `/en${clean}`;
  return clean === "/en" ? "/" : clean.replace(/^\/en(?=\/|$)/, "") || "/";
}


