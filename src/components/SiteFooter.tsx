"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, ui, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale = "zh" }: { locale?: Locale }) {
  const pathname = usePathname();
  const activeLocale = locale === "en" || pathname.startsWith("/en") ? "en" : "zh";
  const text = ui[activeLocale];
  return <footer className="site-footer"><div className="shell footer-inner"><div><Link className="wordmark" href={localePath(activeLocale, "/")}>HOSIERY<span>LAB</span></Link><p>{activeLocale === "en" ? "A visual hosiery reference for designers, stylists and AI character creators." : "为设计师、造型师和 AI 角色创作者整理的丝袜视觉参考。"}</p></div><nav aria-label={activeLocale === "en" ? "Footer navigation" : "页脚导航"}><Link href={localePath(activeLocale, "/hosiery")}>{activeLocale === "zh" ? "丝袜馆" : text.nav.find}</Link><Link href={localePath(activeLocale, "/guide")}>{text.nav.guide}</Link><Link href={localePath(activeLocale, "/learn")}>{text.nav.learn}</Link><Link href={localePath(activeLocale, "/about/sources")}>{text.nav.sources}</Link><Link href={localePath(activeLocale, "/changelog")}>{text.nav.changelog}</Link><Link href={localePath(activeLocale, "/terms")}>{text.nav.terms}</Link></nav><small>{activeLocale === "en" ? "Unless marked otherwise, images are synthetic visual references. © 2026 HosieryLab." : "除非记录另有说明，图片均为合成视觉参考。© 2026 HosieryLab。"}</small></div></footer>;
}

