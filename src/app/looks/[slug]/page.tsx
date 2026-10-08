import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { HosieryCard } from "@/components/HosieryCard";
import { allHosiery } from "@/lib/data";
import { getLook, looks } from "@/lib/looks";
import type { Metadata } from "next";

export function generateStaticParams() { return looks.map((look) => ({ slug: look.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const look = getLook(slug); return look ? { title: `${look.title} · HosieryLab`, description: look.description, alternates: { canonical: `/looks/${look.slug}` } } : { title: "Look not found · HosieryLab" }; }

export default async function LookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const look = getLook(slug);
  if (!look) notFound();
  const matched = allHosiery.filter(look.match);
  const records = matched.length >= 6 ? matched.slice(0, 18) : [...matched, ...allHosiery.filter((item) => !matched.includes(item)).slice(0, 12 - matched.length)];
  return <><SiteHeader /><main className="shell page-main"><Link className="back-link" href="/looks">← 返回风格</Link><div className="look-intro"><div><p className="eyebrow">{look.jp}</p><h1>{look.title}</h1><p>{look.description}</p></div><div className="look-guidance"><strong>怎么选</strong>{look.guidance.map((line) => <span key={line}>{line}</span>)}</div></div><div className="look-actions"><Link className="button button-dark" href={`/hosiery?${look.query}`}>查看全部筛选结果 <span>↗</span></Link><Link className="quiet-link" href="/learn">先看丝袜百科</Link></div><div className="results-head"><span>{matched.length} 条匹配记录</span><span>每张卡片都能复制整图或丝袜提示词</span></div><div className="specimen-grid">{records.map((item) => <HosieryCard item={item} key={item.code} source="look" />)}</div></main></>;
}

