import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { HosieryCard } from "@/components/HosieryCard";
import { HeroExperiment } from "@/components/HeroExperiment";
import { allHosiery } from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell">
          <div className="hero-copy"><p className="eyebrow">THE VISUAL INTELLIGENCE DATABASE FOR HOSIERY</p><h1>Every pair,<br /><em>under the same light.</em></h1><p className="hero-lede">A measured visual index of hosiery — organized by length, coverage, denier, color, material, finish and structure.</p><p className="hero-audience">Built for designers, stylists and AI character creators who need hosiery to look right.</p><div className="hero-actions"><Link className="button button-dark" href="/hosiery">Explore the catalog <span>↗</span></Link><Link className="quiet-link" href="/about/sources">Read our method</Link></div></div>
          <HeroExperiment />
        </section>

        <section className="quick-section shell"><div className="section-kicker">从一个问题开始</div><div className="quick-filters">{[["黑色", "color=black"], ["肉色", "color=skin_tone"], ["≤10D", "denier=0-10"], ["11–20D", "denier=11-20"], ["40D+", "denier=60-99"], ["薄透", "opacity=sheer"], ["哑光", "q=matte"], ["有图案", "q=pattern"]].map(([label, query]) => <Link key={label} href={`/hosiery?${query}`} className="quick-pill">{label}</Link>)}</div></section>


        <section className="chapter-section shell"><div className="section-heading"><div><div className="section-kicker">THE MAP</div><h2>Three ways to enter the lab.</h2></div><Link className="quiet-link" href="/hosiery">View all specimens →</Link></div><div className="chapter-grid"><Link href="/hosiery?length=waist" className="chapter-card chapter-wide"><span className="chapter-number">I</span><h3>Length<br /><em>From toe to waist.</em></h3><span className="chapter-arrow">↗</span></Link><Link href="/hosiery?opacity=sheer" className="chapter-card chapter-dark"><span className="chapter-number">II</span><h3>The sheer<br /><em>spectrum.</em></h3><span className="chapter-arrow">↗</span></Link><Link href="/hosiery?q=black" className="chapter-card chapter-swatch"><span className="chapter-number">III</span><h3>Color,<br /><em>named & measured.</em></h3><div className="swatch-row"><i /><i /><i /><i /><i /></div></Link></div></section>

        <section className="featured-section shell"><div className="section-heading"><div><div className="section-kicker">FEATURED COMPARISON</div><h2>One variable at a time.</h2></div><Link className="quiet-link" href="/hosiery">找更多丝袜 →</Link></div><div className="featured-grid">{allHosiery.slice(0, 3).map((item) => <HosieryCard item={item} key={item.code} />)}</div></section>

        <section className="method-band"><div className="shell method-inner"><div><div className="section-kicker">OUR METHOD</div><h2>Facts first.<br /><em>Visuals with a source.</em></h2></div><div className="method-copy"><p>Every record tells you what it is, where the information came from, and whether it is a real SKU or a HosieryLab Standard Variant built for fair comparison.</p><Link className="button button-light" href="/about/sources">How the lab works <span>↗</span></Link></div></div></section>
      </main>
    </>
  );
}









