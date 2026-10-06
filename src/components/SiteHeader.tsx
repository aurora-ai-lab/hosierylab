import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/">HOSIERY<span>LAB</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/hosiery">Explore</Link>
          <Link href="/hosiery">Hosiery</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/history">History</Link>
          <Link href="/about/sources">Sources</Link>
        </nav>
        <Link className="header-search" href="/hosiery">Search <span>⌕</span></Link>
      </div>
    </header>
  );
}
