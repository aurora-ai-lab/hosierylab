import { SiteHeader } from "@/components/SiteHeader";
import { HosieryExplorer } from "@/components/HosieryExplorer";

export const metadata = { title: "Explore Hosiery · HosieryLab" };

export default function HosieryPage() {
  return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">THE CATALOG</p><h1>Explore hosiery.</h1><p>12 indexed starter specimens, organized across length, coverage, opacity, color and construction. The first 200 rendered visual assets are tracked in the project manifest, ready to expand toward 10,000.</p></div><div className="intro-stat"><strong>200</strong><span>rendered assets</span></div></div><HosieryExplorer /></main></>;
}
