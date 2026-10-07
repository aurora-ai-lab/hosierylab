"use client";

import { useEffect, useMemo, useState } from "react";
import { allHosiery, catalogCategoryLabels, getCatalogCategory, lengthFilters } from "@/lib/data";
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

function colorCode(item: (typeof allHosiery)[number]) {
  const value = (item.colorFamily + " " + item.colorLabel).toLowerCase();
  if (value.includes("black")) return "black";
  if (value.includes("skin") || value.includes("natural") || value.includes("honey") || value.includes("nude")) return "skin_tone";
  if (value.includes("white")) return "white";
  if (value.includes("cream") || value.includes("ivory")) return "cream";
  if (value.includes("grey") || value.includes("gray") || value.includes("charcoal") || value.includes("graphite")) return "grey";
  if (value.includes("brown") || value.includes("coffee") || value.includes("mocha")) return "brown";
  if (value.includes("navy")) return "navy";
  if (value.includes("burgundy") || value.includes("wine")) return "burgundy";
  if (value.includes("pink")) return "pink";
  if (value.includes("purple")) return "purple";
  if (value.includes("yellow")) return "yellow";
  if (value.includes("green")) return "green";
  if (value.includes("blue")) return "blue";
  if (value.includes("red")) return "red";
  return "multi";
}

function denierMatches(value: string, denier: number | null) {
  if (value === "all") return true;
  if (value === "0-10") return denier !== null && denier <= 10;
  if (value === "11-20") return denier !== null && denier >= 11 && denier <= 20;
  if (value === "21-35") return denier !== null && denier >= 21 && denier <= 35;
  if (value === "36-59") return denier !== null && denier >= 36 && denier <= 59;
  if (value === "60-99") return denier !== null && denier >= 60 && denier <= 99;
  return denier !== null && denier >= 100;
}

export function HosieryExplorer() {
  const [query, setQuery] = useState("");
  const [length, setLength] = useState("all");
  const [type, setType] = useState("all");
  const [denier, setDenier] = useState("all");
  const [opacity, setOpacity] = useState("all");
  const [color, setColor] = useState("all");
  const [category, setCategory] = useState("all");
  const [reviewedOnly, setReviewedOnly] = useState(false);
  const [sort, setSort] = useState("code");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    setQuery(q);
    setLength(params.get("len") ?? params.get("length") ?? "all");
    setType(params.get("type") ?? "all");
    setDenier(params.get("den") ?? (q === "≤10D" ? "0-10" : q === "11–20D" ? "11-20" : q === "40D+" ? "60-99" : "all"));
    setOpacity(params.get("op") ?? params.get("opacity") ?? "all");
    setColor(params.get("color") ?? "all");
    setCategory(params.get("category") ?? "all");
    setReviewedOnly(params.get("reviewed") === "1");
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = allHosiery.filter((item) => {
      const haystack = [item.name, item.code, item.lengthLabel, item.colorLabel, item.material.join(" "), item.finish, item.knit, item.motif].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (!reviewedOnly || item.confidence !== "low") && (category === "all" || getCatalogCategory(item) === category) && (length === "all" || item.lengthClass === length) && (type === "all" || typeCode(item) === type) && denierMatches(denier, item.denier) && (opacity === "all" || opacityCode(item.opacity) === opacity) && (color === "all" || colorCode(item) === color);
    });
    return [...filtered].sort((a, b) => sort === "denier" ? (a.denier ?? 999) - (b.denier ?? 999) : a.code.localeCompare(b.code));
  }, [query, reviewedOnly, category, length, type, denier, opacity, color, sort]);

  return (
    <div>
      <div className="explore-toolbar">
        <label className="search-input"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search color, denier, material, style..." /></label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort results"><option value="code">Recently added</option><option value="denier">Denier: low to high</option></select>
      </div>
      <div className="filter-row">
        <div className="filter-group"><span className="filter-label">Category</span>{(Object.keys(catalogCategoryLabels) as Array<keyof typeof catalogCategoryLabels>).map((value) => <button key={value} onClick={() => setCategory(value)} className={"filter-chip " + (category === value ? "active" : "")}>{catalogCategoryLabels[value]}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Length</span>{lengthFilters.map(([value, label]) => <button key={value} onClick={() => setLength(value)} className={"filter-chip " + (length === value ? "active" : "")}>{label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Type</span>{typeFilters.map(([value, label]) => <button key={value} onClick={() => setType(value)} className={"filter-chip " + (type === value ? "active" : "")}>{label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Denier</span>{denierFilters.map(([value, label]) => <button key={value} onClick={() => setDenier(value)} className={"filter-chip " + (denier === value ? "active" : "")}>{label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Opacity</span>{opacityFilters.map(([value, label]) => <button key={value} onClick={() => setOpacity(value)} className={"filter-chip " + (opacity === value ? "active" : "")}>{label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Color</span>{colorFilters.map(([value, label]) => <button key={value} onClick={() => setColor(value)} className={"filter-chip " + (color === value ? "active" : "")}>{label}</button>)}</div>
        <div className="filter-group"><button onClick={() => setReviewedOnly((current) => !current)} className={"filter-chip " + (reviewedOnly ? "active" : "")} aria-pressed={reviewedOnly}>Reviewed only</button></div>
      </div>
      <div className="results-head"><span>{results.length} specimens</span><span>{reviewedOnly ? "Reviewed records only" : "Includes archive records · unreviewed records are labeled"}</span></div>
      <div className="specimen-grid">{results.map((item) => <HosieryCard item={item} key={item.code} />)}</div>
      {!results.length && <div className="empty-state">No specimens match this combination. Try another filter or turn off Reviewed only.</div>}
    </div>
  );
}

