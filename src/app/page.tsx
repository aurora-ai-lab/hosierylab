import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { HosieryCard } from "@/components/HosieryCard";
import { hosiery } from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell">
          <div className="hero-copy"><p className="eyebrow">THE VISUAL INTELLIGENCE DATABASE FOR HOSIERY</p><h1>Every pair,<br /><em>under the same light.</em></h1><p className="hero-lede">A measured visual index of hosiery — organized by length, coverage, denier, color, material, finish and structure.</p><p className="hero-audience">Built for designers, stylists and AI character creators who need hosiery to look right.</p><div className="hero-actions"><Link className="button button-dark" href="/hosiery">Explore the catalog <span>↗</span></Link><Link className="quiet-link" href="/about/sources">Read our method</Link></div></div>
          <div className="hero-experiment"><div className="experiment-top"><span>THE EXPERIMENT</span><span>5D — 100D</span></div><div className="experiment-stage"><img className="hero-reference-image" src="/reference/hero-main.png" alt="Hosiery denier comparison from 5D to 100D" /><div className="experiment-caption"><strong>DENIER / ONE LIGHT</strong><span>5D · 8D · 15D · 20D · 40D · 80D · 100D</span></div></div></div>
        </section>

        <section className="quick-section shell"><div className="section-kicker">START WITH A QUESTION</div><div className="quick-filters">{[["Black", "color=black"], ["Skin tones", "color=skin_tone"], ["≤10D", "den=0-10"], ["11–20D", "den=11-20"], ["40D+", "den=60-99"], ["Sheer", "op=sheer"], ["Matte", "q=matte"], ["Patterned", "q=pattern"]].map(([label, query]) => <Link key={label} href={`/hosiery?${query}`} className="quick-pill">{label}</Link>)}</div></section>


        <section className="chapter-section shell"><div className="section-heading"><div><div className="section-kicker">THE MAP</div><h2>Three ways to enter the lab.</h2></div><Link className="quiet-link" href="/hosiery">View all specimens →</Link></div><div className="chapter-grid"><Link href="/hosiery?length=waist" className="chapter-card chapter-wide"><span className="chapter-number">I</span><h3>Length<br /><em>From toe to waist.</em></h3><span className="chapter-arrow">↗</span></Link><Link href="/hosiery?opacity=sheer" className="chapter-card chapter-dark"><span className="chapter-number">II</span><h3>The sheer<br /><em>spectrum.</em></h3><span className="chapter-arrow">↗</span></Link><Link href="/hosiery?q=black" className="chapter-card chapter-swatch"><span className="chapter-number">III</span><h3>Color,<br /><em>named & measured.</em></h3><div className="swatch-row"><i /><i /><i /><i /><i /></div></Link></div></section>

        <section className="featured-section shell"><div className="section-heading"><div><div className="section-kicker">FEATURED COMPARISON</div><h2>One variable at a time.</h2></div><Link className="quiet-link" href="/compare">Open Compare →</Link></div><div className="featured-grid">{hosiery.slice(0, 3).map((item) => <HosieryCard item={item} key={item.code} />)}</div></section>

        <section className="method-band"><div className="shell method-inner"><div><div className="section-kicker">OUR METHOD</div><h2>Facts first.<br /><em>Visuals with a source.</em></h2></div><div className="method-copy"><p>Every record tells you what it is, where the information came from, and whether it is a real SKU or a HosieryLab Standard Variant built for fair comparison.</p><Link className="button button-light" href="/about/sources">How the lab works <span>↗</span></Link></div></div></section>
      </main>
    </>
  );
}

