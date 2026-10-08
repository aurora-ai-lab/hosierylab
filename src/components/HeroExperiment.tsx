"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedGallery } from "./AnimatedGallery";
import type { Locale } from "@/lib/i18n";

const slides = {
  zh: [
    { key: "denier", alt: "丹尼尔长廊：5D 到 200D 的丝袜对比", range: "5D — 200D", title: "丹尼尔长廊", caption: "DENIER GALLERY / ONE LIGHT", labels: "5D · 10D · 15D · 20D · 40D · 80D · 100D · 200D" },
    { key: "finish", alt: "光泽长廊：哑光、柔光、缎光、亮光、高光、湿感与闪光", range: "MATTE — SHIMMER", title: "光泽长廊", caption: "FINISH GALLERY / ONE LIGHT", labels: "哑光 · 柔光 · 缎光 · 亮光 · 高光 · 湿感 · 闪光" },
  ],
  en: [
    { key: "denier", alt: "Denier gallery: hosiery from 5D to 200D", range: "5D — 200D", title: "Denier gallery", caption: "DENIER GALLERY / ONE LIGHT", labels: "5D · 10D · 15D · 20D · 40D · 80D · 100D · 200D" },
    { key: "finish", alt: "Finish gallery: matte through shimmer", range: "MATTE — SHIMMER", title: "Finish gallery", caption: "FINISH GALLERY / ONE LIGHT", labels: "Matte · Semi-matte · Satin · Glossy · High shine · Wet look · Shimmer" },
  ],
} as const;

export function HeroExperiment({ locale = "zh" }: { locale?: Locale }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.zh.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(distance) > 42) setActive((current) => (current + (distance < 0 ? 1 : slides.zh.length - 1)) % slides.zh.length);
  }

  const slide = slides[locale][active];
  return <div className="hero-experiment" onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { startX.current = null; }}>
    <div className="experiment-top"><span>{slide.title}</span><span>{slide.range}</span></div>
    <div className="experiment-stage"><AnimatedGallery mode={slide.key} label={slide.alt} /><div className="experiment-caption"><strong>{slide.caption}</strong><span>{slide.labels}</span></div></div>
    <div className="experiment-switch" aria-label={locale === "en" ? "Switch gallery" : "切换首页长廊"}><button type="button" className={active === 0 ? "active" : ""} onClick={() => setActive(0)} aria-label={locale === "en" ? "Denier gallery" : "丹尼尔长廊"} /><button type="button" className={active === 1 ? "active" : ""} onClick={() => setActive(1)} aria-label={locale === "en" ? "Finish gallery" : "光泽长廊"} /></div>
  </div>;
}
