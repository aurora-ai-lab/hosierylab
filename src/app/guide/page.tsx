import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { HosieryCard } from "@/components/HosieryCard";
import { allHosiery } from "@/lib/data";

export const metadata = { title: "用法 · HosieryLab", description: "了解复制丝袜、复制整图和提示词拆分的用法。", alternates: { canonical: "/guide" } };

export default function GuidePage() {
  const samples = allHosiery.slice(0, 3);
  return <><SiteHeader /><main className="shell article-page"><div className="article-hero"><p className="eyebrow">HOW TO USE</p><h1>复制什么，<em>放在哪里。</em></h1><p>每条记录都拆成整图、全身和丝袜三层。先确定你想保留多少画面信息，再复制对应的一层。</p></div><article className="article-body"><section><span className="section-kicker">01 · 两个按钮的区别</span><h2>复制丝袜，还是复制整图？</h2><p><strong>复制丝袜</strong>只带走颜色、D 数、织法、透明度、光泽、图案和袜口等结构信息，适合接到你自己的角色或场景提示词里。<strong>复制整图</strong>保留人物、服装、机位、环境和丝袜，适合先复现完整构图。</p></section><section><span className="section-kicker">02 · 组合自己的角色</span><h2>把丝袜接进你的角色 prompt</h2><p>先写人物、服装、动作和镜头，再把丝袜段落放在服装之后。保留它的结构词，删掉与自己场景冲突的鞋子或姿势。整图提示词可以作为参考，丝袜提示词是可移动的材料段落。</p><div className="guide-example"><code>人物与服装 → 动作与机位 → 【丝袜段落】 → 光线与画面限制</code></div></section><section><span className="section-kicker">03 · 在 GPT 或其他工具里</span><h2>先用已测试的整图，再拆分迁移</h2><p>本站整图记录按固定竖幅和统一模板整理，适合先在 GPT 图像里确认构图。迁移到其他工具时，建议先只复制丝袜段落，再逐项补回人物和镜头，便于排查差异。</p></section><section><span className="section-kicker">04 · 使用边界</span><h2>保持成人、合规和可识别</h2><p>使用时保留明确的成年设定，不生成裸露或未成年人内容。角色服装、丝袜结构和摄影限制应写清楚，避免用“cosplay”之类的泛化词代替具体服装部件。</p><Link className="text-link" href="/terms">查看使用条款 →</Link></section></article><section className="article-samples"><div className="section-heading"><div><div className="section-kicker">TRY A REAL RECORD</div><h2>现在复制一条。</h2></div><Link className="quiet-link" href="/hosiery">找更多丝袜 →</Link></div><div className="featured-grid">{samples.map((item) => <HosieryCard item={item} key={item.code} source="guide" />)}</div></section></main></>;
}

