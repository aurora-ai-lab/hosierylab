import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-inner"><div><Link className="wordmark" href="/">HOSIERY<span>LAB</span></Link><p>Structured hosiery references for designers, stylists and AI character creators.</p></div><nav aria-label="Footer navigation"><Link href="/hosiery">Catalog</Link><Link href="/compare">Compare</Link><Link href="/history">History</Link><Link href="/about/sources">Method</Link></nav><small>Images are synthetic references unless a record says otherwise. © 2026 HosieryLab.</small></div></footer>;
}
