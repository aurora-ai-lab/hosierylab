import type { HosieryItem } from "./data";

export type LookDefinition = {
  slug: string;
  title: string;
  jp: string;
  description: string;
  guidance: string[];
  query: string;
  match: (item: HosieryItem) => boolean;
};

const text = (item: HosieryItem) => [item.name, item.colorFamily, item.colorLabel, item.garmentType, item.motif, item.knit, item.visualEffect.join(" "), item.assetHosiery ?? ""].join(" ").toLowerCase();
const black = (item: HosieryItem) => /黑|black|炭灰|charcoal|烟灰|灰/.test(text(item));

export const looks: LookDefinition[] = [
  { slug: "heisi", title: "黑丝", jp: "黒スト", description: "以黑色和轻薄到中等 D 数为核心，重点看透明度、光泽和鞋子如何改变黑丝的观感。", guidance: ["优先选择 8D–40D，透明度差异最容易被看见。", "亮面适合强调灯光反射，哑光更接近日常参考。", "连裤袜和大腿袜要分别确认腰口或袜口结构。"], query: "color=black", match: (item) => black(item) && (item.lengthClass === "waist" || item.lengthClass === "thigh_high") },
  { slug: "zettai-ryouiki", title: "绝对领域", jp: "絶対領域", description: "裙摆与过膝或大腿袜之间留下清晰的腿部区段，重点是长度关系和袜口位置。", guidance: ["先看大腿袜或过膝长度，再决定裙摆高度。", "选择清楚的袜口、吊带或防滑结构，避免把不同结构混在一起。", "对比页适合同时检查 15D、20D 和 40D。"], query: "length=thigh_high", match: (item) => item.lengthClass === "thigh_high" && black(item) },
  { slug: "fishnet", title: "渔网", jp: "網タイツ", description: "开放网眼结构优先于 D 数，用网孔大小、边缘和鞋子判断整体风格。", guidance: ["网眼结构不适合用普通透明度标签替代。", "查看 knit、motif 和 foot 信息，确认是否覆盖脚部。", "高对比鞋子能帮助看清网孔和边缘。"], query: "q=网", match: (item) => /网|mesh|open structure|fishnet/.test(text(item)) },
  { slug: "back-seam", title: "后缝线", jp: "バックシーム", description: "从后跟向上延伸的缝线是主要识别点，重点看线条是否连续、是否带有缎光或装饰。", guidance: ["优先查看 knit 为 Seamed 的记录。", "后缝线和波点、缎光可以同时出现，名称会保留这些特征。", "用详情页的全身提示词确认人物与姿势，再复制丝袜提示词。"], query: "q=后缝线", match: (item) => /后缝|seam/.test(text(item)) },
  { slug: "over-knee", title: "过膝", jp: "ニーハイ", description: "过膝袜的关键是膝盖以上的长度和袜口边界，适合用长度筛选快速查找。", guidance: ["先用过膝筛选，再按颜色和 D 数缩小范围。", "区分过膝袜、大腿袜和连裤袜的上端结构。", "鞋子会影响袜口到裙摆之间的视觉比例。"], query: "length=over_the_knee", match: (item) => item.lengthClass === "over_the_knee" || /过膝|over.?knee|knee high/.test(text(item)) },
  { slug: "garter", title: "吊带", jp: "ガーター", description: "吊带款把袜体、吊带和金属夹作为一个结构观察，适合从细节而不是通用标签判断。", guidance: ["确认名称或视觉说明中有吊带、袜带或夹子。", "查看袜口位置和吊带是否与人物服装连接。", "丝袜提示词只保留袜体与结构，整图提示词保留人物和场景。"], query: "q=吊带", match: (item) => /吊带|garter|suspender|袜带|夹/.test(text(item)) },
];

export function getLook(slug: string) { return looks.find((look) => look.slug === slug); }
