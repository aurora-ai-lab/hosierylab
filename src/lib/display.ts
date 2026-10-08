import { colorEntryOf } from "./color";
import type { HosieryItem } from "./data";
import type { Locale } from "./i18n";

const tokenEn: Record<string, string> = {
  "薄透": "Sheer", "后缝线": "Back-seam", "吊带": "Suspender", "缎光": "Satin",
  "蕾丝": "Lace", "网眼": "Mesh", "波点": "Polka-dot", "罗纹": "Ribbed", "不透": "Opaque",
};
const garmentEn: Record<string, string> = { "连裤袜": "Pantyhose", "大腿袜": "Thigh-highs", "吊带袜": "Suspender stockings", "网袜": "Fishnets" };

export function colorName(item: HosieryItem, locale: Locale) {
  if (locale === "zh") return item.colorLabel;
  try { return colorEntryOf(item.colorFamily).en; } catch { return item.colorLabel; }
}

export function garmentName(item: HosieryItem, locale: Locale) {
  if (locale === "zh") return item.garmentType;
  return garmentEn[item.garmentType] ?? item.lengthLabel;
}

export function nameOf(item: HosieryItem, locale: Locale) {
  if (locale === "zh") return item.name;
  const tokens = item.visualEffect.filter((token) => token !== "Surface study" && tokenEn[token]).map((token) => tokenEn[token]);
  if (item.visualEffect.includes("吊带") && item.garmentType === "吊带袜") tokens.splice(tokens.indexOf("Suspender"), 1);
  const base = [...tokens, item.denier ? `${item.denier}D` : "Open structure", colorName(item, "en"), garmentName(item, "en")].join(" ");
  return item.visualEffect.includes("吊带") && item.garmentType !== "吊带袜" ? `${base} with suspenders` : base;
}

export function descriptionOf(item: HosieryItem, locale: Locale) {
  if (locale === "zh") return item.description;
  return `Visual reference for ${nameOf(item, "en")}, recorded under the same light: structure, opacity and surface.`;
}

const lengthZh: Record<string, string> = { "Pantyhose / Tights": "连裤袜 / 紧身袜", "Thigh High / Stockings": "大腿袜 / 长筒袜", "Over-the-knee": "过膝袜", "Knee-high": "及膝袜", "Crew": "中筒袜", "Ankle": "踝袜", "Footie / No-show": "船袜 / 隐形袜" };
const opacityZh: Record<string, string> = { "Ultra Sheer": "超薄透", Sheer: "薄透", "Semi-sheer": "半透", "Semi-opaque": "半不透", Opaque: "不透", "Heavy Opaque": "厚实不透", "Open Structure": "开放结构" };
const typeZh: Record<string, string> = { pantyhose_tights: "连裤袜 / 紧身袜", footless_tights: "无脚紧身袜", stirrup_tights: "踩脚袜", suspender_tights: "吊带紧身袜", bodystocking: "连体袜", stockings: "长筒袜", stay_ups: "大腿袜 / 自粘袜", over_knee_socks: "过膝袜", knee_highs: "及膝袜", socks: "薄袜", footies: "船袜" };
export function lengthName(value: string, locale: Locale) { return locale === "zh" ? (lengthZh[value] ?? value) : value; }
export function opacityName(value: string, locale: Locale) { return locale === "zh" ? (opacityZh[value] ?? value) : value; }
export function typeName(value: string, locale: Locale) { return locale === "zh" ? (typeZh[value] ?? value) : value; }
