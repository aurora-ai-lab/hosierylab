import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const nodes = [
  ["Material", "From silk to synthetics", "Materials changed the weight, durability and visual language of hosiery."],
  ["Technique", "Fine-gauge knitting", "A thinner yarn made a new kind of transparency possible."],
  ["Garment Form", "The rise of tights", "The joined-waist construction changed how coverage could be worn."],
  ["Cultural Moment", "The visible leg", "Hosiery moved from hidden foundation to an intentional surface."],
  ["Manufacturing", "Seam, heel, welt", "Small structural details became recognizable visual signals."],
];
export default function HistoryPage() { return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">HISTORY OF HOSIERY</p><h1>A material has a lineage.</h1><p>History Nodes connect technique, construction and cultural context to the specimens in the catalog.</p></div><div className="intro-stat"><strong>05</strong><span>starter nodes</span></div></div><div className="history-list">{nodes.map(([type, title, description], index) => <article className="history-node" key={title}><div className="node-year">0{index + 1}</div><div><span className="node-type">{type}</span><h2>{title}</h2><p>{description}</p></div><Link href="/hosiery">View related specimens →</Link></article>)}</div></main></> }
