"use client";

import { useMemo, useState } from "react";
import { allHosiery, lengthFilters } from "@/lib/data";
import { HosieryCard } from "./HosieryCard";

export function HosieryExplorer() {
  const [query, setQuery] = useState("");
  const [length, setLength] = useState("all");
  const [opacity, setOpacity] = useState("all");
  const [sort, setSort] = useState("code");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = allHosiery.filter((item) => {
      const haystack = [item.name, item.code, item.lengthLabel, item.colorLabel, item.material.join(" "), item.finish, item.knit, item.motif].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (length === "all" || item.lengthClass === length) && (opacity === "all" || item.opacity.toLowerCase().replace("-", " ") === opacity);
    });
    return [...filtered].sort((a, b) => sort === "denier" ? (a.denier ?? 999) - (b.denier ?? 999) : a.code.localeCompare(b.code));
  }, [query, length, opacity, sort]);

  return (
    <div>
      <div className="explore-toolbar">
        <label className="search-input"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search color, denier, material, style..." /></label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort results"><option value="code">Recently added</option><option value="denier">Denier: low to high</option></select>
      </div>
      <div className="filter-row">
        <div className="filter-group"><span className="filter-label">Length</span>{lengthFilters.map(([value, label]) => <button key={value} onClick={() => setLength(value)} className={`filter-chip ${length === value ? "active" : ""}`}>{label}</button>)}</div>
        <div className="filter-group"><span className="filter-label">Opacity</span>{[["all", "All opacity"], ["ultra sheer", "Ultra sheer"], ["sheer", "Sheer"], ["semi-opaque", "Semi-opaque"], ["opaque", "Opaque"], ["open structure", "Open structure"]].map(([value, label]) => <button key={value} onClick={() => setOpacity(value)} className={`filter-chip ${opacity === value ? "active" : ""}`}>{label}</button>)}</div>
      </div>
      <div className="results-head"><span>{results.length} specimens</span><span>V1 local catalog · filters are URL-ready next</span></div>
      <div className="specimen-grid">{results.map((item) => <HosieryCard item={item} key={item.code} />)}</div>
      {!results.length && <div className="empty-state">No specimens match this combination. Try another length or opacity.</div>}
    </div>
  );
}
