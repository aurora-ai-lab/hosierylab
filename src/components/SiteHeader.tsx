"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MotionToggle } from "./MotionToggle";
import { localePath, ui, type Locale } from "@/lib/i18n";

const quickLinks = {
  zh: [["黑色", "color=black"], ["肤色", "color=skin_tone"], ["过膝", "length=over_the_knee"], ["渔网", "q=网"], ["≤20D", "denier=11-20"]],
  en: [["Black", "color=black"], ["Skin tones", "color=skin_tone"], ["Over the knee", "length=over_the_knee"], ["Fishnet", "q=fishnet"], ["≤20D", "denier=11-20"]],
} as const;

export function SiteHeader({ locale = "zh" }: { locale?: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [queryString, setQueryString] = useState("");
  const pathname = usePathname();
  const text = ui[locale];
  const switchHref = `${localePath(locale === "en" ? "zh" : "en", pathname)}${queryString}`;

  useEffect(() => {
    setQueryString(window.location.search);
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  }, [locale]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href={localePath(locale, "/")} onClick={() => setMenuOpen(false)}>HOSIERY<span>LAB</span></Link>
        <nav className="main-nav" aria-label={locale === "en" ? "Main navigation" : "主导航"}>
          <Link href={localePath(locale, "/hosiery")}>{text.nav.find}</Link>
          <Link href={localePath(locale, "/mcp")}>MCP</Link>
          
          <Link href={localePath(locale, "/guide")}>{text.nav.guide}</Link>
          <Link href={localePath(locale, "/learn")}>{text.nav.learn}</Link>
        </nav>
        <form className="header-search" action={localePath(locale, "/hosiery")}>
          <input name="q" aria-label={locale === "en" ? "Search hosiery" : "搜索丝袜"} placeholder={text.search} />
          <button type="submit" aria-label={locale === "en" ? "Search" : "搜索"}>⌕</button>
        </form>
        <MotionToggle locale={locale} />
        <Link className="language-switch" href={switchHref} onClick={() => setMenuOpen(false)}>{text.language}</Link>
        <Link className="account-link" href={localePath(locale, "/account")} onClick={() => setMenuOpen(false)}>{locale === "en" ? "Account" : "账户"}</Link>
        <Link className="mobile-find" href={localePath(locale, "/hosiery")} onClick={() => setMenuOpen(false)}>{text.nav.find}</Link>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? (locale === "en" ? "Close menu" : "关闭菜单") : (locale === "en" ? "Open menu" : "打开菜单")} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>☰</button>
      </div>
      {menuOpen && <div className="mobile-sheet"><nav aria-label={locale === "en" ? "Mobile navigation" : "移动端导航"}>
        <Link href={localePath(locale, "/hosiery")} onClick={() => setMenuOpen(false)}>{text.nav.find} <span>→</span></Link>
        <Link href={localePath(locale, "/mcp")} onClick={() => setMenuOpen(false)}>MCP <span>→</span></Link>
        <div className="mobile-quick-links">{quickLinks[locale].map(([label, query]) => <Link key={label} href={`${localePath(locale, "/hosiery")}?${query}`} onClick={() => setMenuOpen(false)}>{label}</Link>)}</div>
        
        <Link href={localePath(locale, "/guide")} onClick={() => setMenuOpen(false)}>{text.nav.guide} <span>→</span></Link>
        <Link href={localePath(locale, "/learn")} onClick={() => setMenuOpen(false)}>{text.nav.learn} <span>→</span></Link>
      </nav><div className="mobile-sheet-footer"><MotionToggle locale={locale} /><Link className="language-switch" href={switchHref} onClick={() => setMenuOpen(false)}>{text.language}</Link><Link href={localePath(locale, "/about/sources")} onClick={() => setMenuOpen(false)}>{text.nav.sources}</Link><Link href={localePath(locale, "/changelog")} onClick={() => setMenuOpen(false)}>{text.nav.changelog}</Link><Link href={localePath(locale, "/terms")} onClick={() => setMenuOpen(false)}>{text.nav.terms}</Link></div></div>}
    </header>
  );
}



