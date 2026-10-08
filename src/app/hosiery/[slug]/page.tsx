import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LegDiagram } from "@/components/LegDiagram";
import { HosieryCard } from "@/components/HosieryCard";
import { PromptBundle } from "@/components/PromptBundle";
import { allHosiery, getHosiery } from "@/lib/data";
import type { Metadata } from "next";

export function generateStaticParams() { return allHosiery.flatMap((item) => [{ slug: item.slug }, { slug: item.code.toLowerCase() }]); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getHosiery(slug);
  if (!item) return { title: "Specimen not found · HosieryLab" };
  const title = item.name + " | HosieryLab";
  const canonicalSlug = item.code.toLowerCase();
  const image = item.imageUrl ?? "/catalog/" + item.code + ".webp";
  return { title, description: item.description, alternates: { canonical: "/hosiery/" + canonicalSlug }, openGraph: { title, description: item.description, url: "/hosiery/" + canonicalSlug, type: "article", images: [{ url: image, alt: item.name + " visual reference" }] }, twitter: { card: "summary_large_image", title, description: item.description, images: [image] } };
}

export default async function HosieryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getHosiery(slug);
  if (!item) notFound();
  const similar = allHosiery.filter((entry) => entry.code !== item.code && (entry.lengthClass === item.lengthClass || entry.colorFamily === item.colorFamily)).slice(0, 3);
  const imageUrl = item.imageUrl ?? `/catalog/${item.code}.webp`;
  return <><SiteHeader /><main className="shell detail-page"><Link className="back-link" href="/hosiery">← 返回目录</Link><div className="detail-hero"><div className="detail-media"><div className="detail-visual">{imageUrl ? <img className="detail-image" src={imageUrl} alt={`${item.name} 视觉参考`} /> : <div className="detail-image-fallback visible"><LegDiagram item={item} /></div>}</div><PromptBundle code={item.code} /></div><div className="detail-copy"><p className="eyebrow">视觉档案</p><h1>{item.name}</h1><p className="detail-lede">{item.description}</p><div className="detail-tags"><span>{item.lengthLabel}</span><span>{item.denier ? `${item.denier}D` : "开放结构"}</span><span>{item.opacity}</span><span>{item.finish}</span></div><Link className="button button-dark" href={`/compare?ids=${item.code}`}>加入对比 <span>＋</span></Link></div></div><section className="detail-sections"><div className="detail-section"><div className="section-kicker">规格</div><h2>完整记录。</h2><div className="spec-table"><Spec label="覆盖范围" value={item.coverage} /><Spec label="顶部位置" value={item.topPosition} /><Spec label="袜型" value={item.garmentType} /><Spec label="脚部" value={item.foot} /><Spec label="脚尖 / 脚跟" value={`${item.toe} · ${item.heel}`} /><Spec label="袜口 / 支撑" value={`${item.topBand} · ${item.support}`} /><Spec label="颜色" value={`${item.colorLabel} · ${item.hex}`} /><Spec label="材质" value={item.material.join(" + ")} /><Spec label="织法 / 图案" value={`${item.knit} · ${item.motif}`} /><Spec label="季节 / 场景" value={`${item.season.join(", ")} · ${item.occasion.join(", ")}`} /></div></div><div className="detail-section profile-section"><div className="section-kicker">视觉特征</div><h2>眼睛看到的。</h2><p>{item.visualNotes}</p><div className="profile-bar"><span>透明度</span><i style={{ width: item.opacity.includes("Opaque") ? "82%" : item.opacity.includes("Sheer") ? "28%" : "55%" }} /></div><div className="profile-bar"><span>表面</span><i style={{ width: item.finish.includes("Gloss") || item.finish.includes("Satin") ? "78%" : "38%" }} /></div><p className="history-note"><strong>历史与演变</strong>{item.history}</p></div></section><section className="detail-section similar-section"><div className="section-heading"><div><div className="section-kicker">相近丝袜</div><h2>附近记录。</h2></div><Link className="quiet-link" href="/hosiery">查看全部 →</Link></div><div className="featured-grid">{similar.map((entry) => <HosieryCard item={entry} key={entry.code} />)}</div></section></main></>;
}
function Spec({ label, value }: { label: string; value: string }) { return <div className="spec-row"><span>{label}</span><strong>{value}</strong></div>; }



