import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { allHosiery } from "@/lib/data";
import { looks } from "@/lib/looks";

export const metadata = { title: "风格 · HosieryLab", description: "按黑丝、绝对领域、渔网、后缝线和过膝等视觉风格查找可复制的丝袜提示词。", alternates: { canonical: "/looks" } };

export default function LooksPage() {
  return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">VISUAL LOOKS</p><h1>按风格找。</h1><p>先用角色创作里常用的叫法进入，再从真实目录卡片复制丝袜或整图提示词。</p></div><div className="intro-stat"><strong>{looks.length}</strong><span>visual looks</span></div></div><div className="look-grid">{looks.map((look) => { const count = allHosiery.filter(look.match).length; const cover = allHosiery.find(look.match) ?? allHosiery[0]; return <Link className="look-card" href={`/looks/${look.slug}`} key={look.slug}><img src={cover.imageUrl ?? `/catalog/${cover.code}.webp`} alt={`${look.title} visual reference`} /><div className="look-card-copy"><span>{look.jp}</span><h2>{look.title}</h2><p>{look.description}</p><small>{count} 条可复制记录 →</small></div></Link>; })}</div></main></>;
}


