import { SiteHeader } from "@/components/SiteHeader";
import { HosieryExplorer } from "@/components/HosieryExplorer";

export const metadata = { title: "Explore Hosiery · HosieryLab" };

export default function HosieryPage() {
  return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">THE CATALOG</p><h1>Explore hosiery.</h1><p>200 rendered visual references are indexed across length, coverage, opacity, color and construction. Records marked “low confidence” are generated archive entries awaiting editorial review.</p></div><div className="intro-stat"><strong>200</strong><span>indexed assets</span></div></div><HosieryExplorer /></main></>;
}
