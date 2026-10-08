"use client";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { allHosiery } from "@/lib/data";
import { LegDiagram } from "@/components/LegDiagram";

export default function ComparePage() {
  const [selected, setSelected] = useState(allHosiery.slice(0, 2).map((item) => item.code));
  const records = useMemo(() => allHosiery.filter((item) => selected.includes(item.code)), [selected]);
  const add = (code: string) => setSelected((current) => current.includes(code) ? current.filter((x) => x !== code) : current.length < 4 ? [...current, code] : current);
  return <><SiteHeader /><main className="shell page-main"><div className="page-intro"><div><p className="eyebrow">CONTROLLED COMPARISON</p><h1>Put them side by side.</h1><p>Change one variable. See what actually changes.</p></div><div className="intro-stat"><strong>{records.length}</strong><span>of 4 selected</span></div></div><div className="compare-picker"><span className="filter-label">Add a specimen</span>{allHosiery.map((item) => <button key={item.code} onClick={() => add(item.code)} className={`filter-chip ${selected.includes(item.code) ? "active" : ""}`}>{item.name}</button>)}</div><div className="compare-stage">{records.map((item) => { const imageUrl = item.imageUrl ?? `/catalog/${item.code}.webp`; return <div className="compare-column" key={item.code}>{imageUrl ? <img className="compare-image" src={imageUrl} alt={`${item.name} visual reference`} /> : <LegDiagram item={item} compact />}<h3>{item.name}</h3><CompareRow label="Coverage" value={item.coverage} /><CompareRow label="Denier" value={item.denier ? `${item.denier}D` : "N/A"} /><CompareRow label="Opacity" value={item.opacity} /><CompareRow label="Color" value={item.colorLabel} /><CompareRow label="Finish" value={item.finish} /><CompareRow label="Knit" value={item.knit} /><CompareRow label="Foot" value={item.foot} /></div>; })}</div></main></>;
}
function CompareRow({ label, value }: { label: string; value: string }) { return <div className="compare-row"><span>{label}</span><strong>{value}</strong></div>; }


