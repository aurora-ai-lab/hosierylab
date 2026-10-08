import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { allHosiery } from "@/lib/data";
import { getLook, looks } from "@/lib/looks";
import { HosieryCard } from "@/components/HosieryCard";

export function generateStaticParams() { return looks.map((look) => ({ slug: look.slug })); }
export default async function EnglishLookPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const look = getLook(slug); if (!look) notFound(); const records = allHosiery.filter(look.match).slice(0, 100); return <><SiteHeader locale="en" /><main className="shell page-main"><Link className="back-link" href="/en/looks">← Back to looks</Link><div className="look-intro"><div><p className="eyebrow">{look.jp}</p><h1>{look.title}</h1><p>{look.description}</p></div><div className="look-guidance"><strong>How to choose</strong>{look.guidance.map((line) => <span key={line}>{line}</span>)}</div></div><div className="look-actions"><Link className="button button-dark" href={`/en/hosiery?${look.query}`}>View filtered results <span>↗</span></Link></div><div className="results-head"><span>{records.length} matching records</span><span>Each card includes copyable prompt layers.</span></div><div className="specimen-grid">{records.map((item) => <HosieryCard item={item} key={item.code} locale="en" source="look" />)}</div></main></> }
