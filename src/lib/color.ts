export const COLOR_CODES = [
  "black", "skin_tone", "white", "cream", "grey", "brown", "navy",
  "blue", "red", "burgundy", "pink", "purple", "yellow", "green", "multi",
] as const;

export type ColorCode = (typeof COLOR_CODES)[number];

export type ColorEntry = {
  code: ColorCode;
  shade: string;
  zh: string;
  en: string;
  hex: string;
};

export const COLOR_REGISTRY: Record<string, ColorEntry> = {
  "纯黑": { code: "black", shade: "jet_black", zh: "纯黑", en: "Black", hex: "#0B0B0C" },
  "炭灰": { code: "grey", shade: "charcoal", zh: "炭灰", en: "Charcoal", hex: "#3A3A3C" },
  "纯白": { code: "white", shade: "pure_white", zh: "纯白", en: "White", hex: "#F3F0EA" },
  "蜜裸": { code: "skin_tone", shade: "honey", zh: "蜜裸", en: "Honey", hex: "#B98557" },
  "自然肤色": { code: "skin_tone", shade: "natural", zh: "自然肤色", en: "Natural Beige", hex: "#C79C76" },
  "酒红": { code: "burgundy", shade: "burgundy", zh: "酒红", en: "Burgundy", hex: "#5E1A2A" },
  "咖啡棕": { code: "brown", shade: "coffee", zh: "咖啡棕", en: "Coffee", hex: "#5B4031" },
  "海军蓝": { code: "navy", shade: "navy", zh: "海军蓝", en: "Navy", hex: "#1D2640" },
};

export const COLOR_FAMILY_TO_CODE: Record<string, ColorCode> = Object.fromEntries(
  Object.entries(COLOR_REGISTRY).map(([key, entry]) => [key, entry.code]),
) as Record<string, ColorCode>;

export function colorEntryOf(colorFamily: string): ColorEntry {
  const entry = COLOR_REGISTRY[colorFamily.trim()];
  if (!entry) throw new Error(`Unmapped colorFamily: "${colorFamily}" — add it to COLOR_REGISTRY`);
  return entry;
}

export function colorCodeOf(colorFamily: string): ColorCode {
  return colorEntryOf(colorFamily).code;
}
