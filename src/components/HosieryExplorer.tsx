"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import { allHosiery, lengthFilters } from "@/lib/data";
import { COLOR_CODES, type ColorCode } from "@/lib/color";
import { localePath, type Locale } from "@/lib/i18n";
import { typeName } from "@/lib/display";
import { HosieryCard } from "./HosieryCard";

const typeFilters = [
  ["all", "All types"], ["pantyhose_tights", "Pantyhose / Tights"], ["footless_tights", "Footless tights"],
  ["stirrup_tights", "Stirrup tights"], ["suspender_tights", "Suspender tights"], ["bodystocking", "Bodystocking"],
  ["stockings", "Stockings"], ["stay_ups", "Stay-ups / Hold-ups"], ["over_knee_socks", "Over-the-knee socks"],
  ["knee_highs", "Knee-highs"], ["socks", "Sheer socks"], ["footies", "Footies"],
] as const;

const denierFilters = [["all", "All denier"], ["0-10", "≤10D"], ["11-20", "11–20D"], ["21-35", "21–35D"], ["36-59", "36–59D"], ["60-99", "60–99D"], ["100+", "100D+"]] as const;
const opacityFilters = [["all", "All opacity"], ["ultra_sheer", "Ultra sheer"], ["sheer", "Sheer"], ["semi_sheer", "Semi-sheer"], ["semi_opaque", "Semi-opaque"], ["opaque", "Opaque"], ["heavy_opaque", "Heavy opaque"], ["open_structure", "Open structure"]] as const;
const colorFilters = [["all", "All colors"], ["black", "Black"], ["skin_tone", "Skin tones"], ["white", "White"], ["cream", "Cream"], ["grey", "Grey"], ["brown", "Brown"], ["navy", "Navy"], ["blue", "Blue"], ["red", "Red"], ["burgundy", "Burgundy"], ["pink", "Pink"], ["purple", "Purple"], ["yellow", "Yellow"], ["green", "Green"], ["multi", "Multicolour"]] as const;

function typeCode(item: (typeof allHosiery)[number]) {
  const value = (item.garmentType + " " + item.lengthLabel).toLowerCase();
  if (value.includes("bodystocking")) return "bodystocking";
  if (value.includes("footless")) return "footless_tights";
  if (value.includes("stirrup")) return "stirrup_tights";
  if (value.includes("stocking") && value.includes("thigh")) return "stockings";
  if (value.includes("stay-up") || value.includes("stay up") || value.includes("hold-up")) return "stay_ups";
  if (value.includes("knee high")) return "knee_highs";
  if (value.includes("sock")) return item.lengthClass === "over_the_knee" ? "over_knee_socks" : "socks";
  if (value.includes("footie") || value.includes("no-show")) return "footies";
  return "pantyhose_tights";
}

function opacityCode(value: string) {
  return value.toLowerCase().replace(/[ -]/g, "_");
}

function denierMatches(value: string, denier: number | null) {
  if (value === "all") return true;
  if (denier === null) return false;
  if (value === "100+") return denier >= 100;
  const match = value.match(/^(\d+)-(\d+)$/);
  if (!match) return false;
  const min = Number(match[1]);
  const max = Number(match[2]);
  return denier >= min && denier <= max;
}

export function HosieryExplorer({ locale = "zh" }: { locale?: Locale }) {
  const [query, setQuery] = useState("");
  const [length, setLength] = useState("all");
  const [type, setType] = useState("all");
  const [denier, setDenier] = useState("all");
  const [opacity, setOpacity] = useState("all");
  const [color, setColor] = useState("all");
  const [sort, setSort] = useState("code");
  const initialized = useRef(false);
  const colorCounts = useMemo(() => {
    const counts = new Map<ColorCode, number>();
    for (const item of allHosiery) counts.set(item.colorCode, (counts.get(item.colorCode) ?? 0) + 1);
    return counts;
  }, []);
  const visibleColorFilters = colorFilters.filter(([value]) => value === "all" || (colorCounts.get(value) ?? 0) > 0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    const qDenier = q.match(/^(\d+)D\+$/i)?.[1];
    setQuery(q);
    setLength(params.get("len") ?? params.get("length") ?? "all");
    setType(params.get("type") ?? "all");
    setDenier(params.get("denier") ?? params.get("den") ?? (q === "≤10D" ? "0-10" : q === "11–20D" ? "11-20" : qDenier ? `${qDenier}-999` : "all"));
    setOpacity(params.get("opacity") ?? params.get("op") ?? "all");
    const rawColor = params.get("color");
    setColor(rawColor && COLOR_CODES.includes(rawColor as ColorCode) ? rawColor : "all");
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (color !== "all") params.set("color", color);
    if (denier !== "all") params.set("denier", denier);
    if (length !== "all") params.set("length", length);
    if (opacity !== "all") params.set("opacity", opacity);
    if (type !== "all") params.set("type", type);
    params.sort();
    const search = params.toString();
    const base = localePath(locale, "/hosiery");
    window.history.replaceState(null, "", search ? `${base}?${search}` : base);
  }, [query, color, denier, length, opacity, type, locale]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = allHosiery.filter((item) => {
      const haystack = [item.name, item.code, item.lengthLabel, item.colorLabel, item.material.join(" "), item.finish, item.knit, item.motif].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (length === "all" || item.lengthClass === length) && (type === "all" || typeCode(item) === type) && denierMatches(denier, item.denier) && (opacity === "all" || opacityCode(item.opacity) === opacity) && (color === "all" || item.colorCode === color);
    });
    return sort === "denier" ? [...filtered].sort((a, b) => (a.denier ?? 999) - (b.denier ?? 999)) : filtered;
  }, [query, length, type, denier, opacity, color, sort]);

  return (
    <div>
        <div className="explore-toolbar">
        <label className="search-input"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={locale === "en" ? "Search color, denier, material, style..." : "搜索颜色、D 数、材质、风格..."} /></label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label={locale === "en" ? "Sort results" : "排序结果"}><option value="code">{locale === "en" ? "Recently added" : "最近添加"}</option><option value="denier">{locale === "en" ? "Denier: low to high" : "D 数：从低到高"}</option></select>
      </div>
      <div className="filter-row">
        <div className="filter-group"><span className="filter-label">{locale === "en" ? "Length" : "长度"}</span>{lengthFilters.map(([value, label]) => <button key={value} onClick={() => setLength(value)} className={"filter-chip " + (length === value ? "active" : "")}>{locale === "en" ? label : ({ all: "全部长度", footie: "船袜 / 隐形袜", ankle: "踝袜", crew: "中筒袜", mid_calf: "小腿中部", knee_high: "及膝袜", over_the_knee: "过膝袜", thigh_high: "大腿袜", waist: "连裤袜 / 紧身袜", full_body: "连体袜" } as Record<string, string>)[value]}</button>)}</div>
        <div className="filter-group"><span className="filter-label">{locale === "en" ? "Type" : "类型"}</span>{typeFilters.map(([value, label]) => <button key={value} onClick={() => setType(value)} className={"filter-chip " + (type === value ? "active" : "")}>{locale === "en" ? label : value === "all" ? "全部类型" : typeName(value, locale)}</button>)}</div>
        <div className="filter-group"><span className="filter-label">{locale === "en" ? "Denier" : "D 数"}</span>{denierFilters.map(([value, label]) => <button key={value} onClick={() => setDenier(value)} className={"filter-chip " + (denier === value ? "active" : "")}>{label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">{locale === "en" ? "Opacity" : "透明度"}</span>{opacityFilters.map(([value, label]) => <button key={value} onClick={() => setOpacity(value)} className={"filter-chip " + (opacity === value ? "active" : "")}>{locale === "en" ? label : value === "all" ? "全部透明度" : label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">{locale === "en" ? "Color" : "颜色"}</span>{visibleColorFilters.map(([value, label]) => <button key={value} onClick={() => setColor(value)} className={"filter-chip " + (color === value ? "active" : "")}>{value === "all" ? (locale === "en" ? label : "全部颜色") : `${locale === "en" ? label : ({ black: "黑色", skin_tone: "肤色", white: "白色", grey: "灰色", brown: "棕色", navy: "藏青", burgundy: "酒红" } as Record<string, string>)[value] ?? label} · ${colorCounts.get(value) ?? 0}`}</button>)}</div>
      </div>
      <div className="results-head"><span>{results.length.toLocaleString()} {locale === "en" ? "specimens" : "条记录"}</span><span>{locale === "en" ? "Each record includes image, full-body prompt, hosiery prompt and metadata" : "每条记录包含图片、全身提示词、丝袜提示词和元数据"}</span></div>
      <div className="specimen-grid">{results.map((item) => <HosieryCard item={item} key={item.code} locale={locale} />)}</div>
      {!results.length && <div className="empty-state">{locale === "en" ? "No specimens match this combination. Try another filter." : "没有符合条件的记录，换一个筛选试试。"}</div>}
    </div>
  );
}







