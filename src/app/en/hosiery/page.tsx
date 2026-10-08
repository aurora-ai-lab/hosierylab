import { SiteHeader } from "@/components/SiteHeader";
import { HosieryExplorer } from "@/components/HosieryExplorer";
import { allHosiery } from "@/lib/data";

export const metadata = { title: "Explore hosiery · HosieryLab", description: "Browse 2,000 visual hosiery references by length, coverage, denier, color and construction.", alternates: { canonical: "/en/hosiery" } };

export default function EnglishHosieryPage() {
  return <><SiteHeader locale="en" /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">THE CATALOG</p><h1>Explore hosiery.</h1><p>{allHosiery.length.toLocaleString()} rendered visual references indexed across length, coverage, opacity, color and construction. Each record keeps its image, prompt layers and metadata together.</p></div><div className="intro-stat"><strong>{allHosiery.length}</strong><span>indexed assets</span></div></div><HosieryExplorer locale="en" /></main></>;
}
