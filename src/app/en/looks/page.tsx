import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { allHosiery } from "@/lib/data";
import { looks } from "@/lib/looks";

const labels: Record<string, [string, string]> = { heisi: ["Black sheers", "A reference set for transparency, finish and shoe contrast."], "zettai-ryouiki": ["Zettai ryōiki", "Look at the relationship between hemline, exposed leg and upper edge."], fishnet: ["Fishnet", "Start with open structure, mesh scale and edge definition."], "back-seam": ["Back seam", "Follow the line from welt through heel and compare finish."], "over-knee": ["Over the knee", "Compare upper edge placement and coverage above the knee."], garter: ["Garter", "Treat hosiery, suspenders and clips as one visible structure."] };

export const metadata = { title: "Looks · HosieryLab", description: "Explore visual hosiery references by look and construction.", alternates: { canonical: "/en/looks" } };

export default function EnglishLooksPage() { return <><SiteHeader locale="en" /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">VISUAL LOOKS</p><h1>Browse by look.</h1><p>Enter through a visual idea, then narrow it down to records you can inspect and copy.</p></div><div className="intro-stat"><strong>{looks.length}</strong><span>visual looks</span></div></div><div className="look-grid">{looks.map((look) => { const count = allHosiery.filter(look.match).length; const cover = allHosiery.find(look.match) ?? allHosiery[0]; const [title, description] = labels[look.slug] ?? [look.title, look.description]; return <Link className="look-card" href={`/en/looks/${look.slug}`} key={look.slug}><img src={cover.imageUrl ?? `/catalog/${cover.code}.webp`} alt={`${title} visual reference`} /><div className="look-card-copy"><span>{look.jp}</span><h2>{title}</h2><p>{description}</p><small>{count} records →</small></div></Link>; })}</div></main></> }
