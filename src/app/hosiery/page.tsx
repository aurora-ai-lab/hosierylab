import { SiteHeader } from "@/components/SiteHeader";
import { HosieryExplorer } from "@/components/HosieryExplorer";
import { allHosiery } from "@/lib/data";

export const metadata = { title: "Explore Hosiery · HosieryLab" };

export default function HosieryPage() {
  const count = allHosiery.length;
  return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">THE CATALOG</p><h1>Explore hosiery.</h1><p>{count} rendered visual references are indexed across length, coverage, opacity, color and construction. Records marked “low confidence” are generated archive entries awaiting editorial review.</p></div><div className="intro-stat"><strong>{count}</strong><span>indexed assets</span></div></div><HosieryExplorer /></main></>;
}
