"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
type MotionMode = "complete" | "simple" | "static";
const modes: MotionMode[] = ["complete", "simple", "static"];
const labels: Record<Locale, Record<MotionMode, string>> = { zh: { complete: "完整", simple: "简洁", static: "静止" }, en: { complete: "Full", simple: "Reduced", static: "Still" } };
export function MotionToggle({ locale = "zh" }: { locale?: Locale }) {
  const [mode, setMode] = useState<MotionMode>("complete");
  useEffect(() => { const saved = window.localStorage.getItem("hl-motion") as MotionMode | null; const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; const next = reduced ? "static" : saved ?? (window.localStorage.getItem("hl-fx") === "off" ? "simple" : "complete"); setMode(next); document.documentElement.dataset.motion = next; }, []);
  function cycle() { const next = modes[(modes.indexOf(mode) + 1) % modes.length]; setMode(next); window.localStorage.setItem("hl-motion", next); document.documentElement.dataset.motion = next; }
  return <button className="motion-toggle" type="button" onClick={cycle} aria-label={locale === "en" ? `Motion: ${labels[locale][mode]}. Click to change` : `动效：${labels[locale][mode]}，点击切换`}>{locale === "en" ? "Motion" : "动效"} ✦ {labels[locale][mode]}</button>;
}
