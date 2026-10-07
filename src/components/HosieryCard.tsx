import Link from "next/link";
import { catalogCategoryLabels, getCatalogCategory, type HosieryItem } from "@/lib/data";
import { LegDiagram } from "./LegDiagram";

export function HosieryCard({ item, showCompare = true }: { item: HosieryItem; showCompare?: boolean }) {
  const imageUrl = item.imageUrl ?? `/catalog/${item.code}.webp`;
  return (
    <article className="specimen-card">
      <Link href={`/hosiery/${item.slug}`} className="card-visual">
        {imageUrl ? <img className="card-image" src={imageUrl} alt={`${item.name} visual reference`} loading="lazy" /> : <div className="card-image-fallback visible"><LegDiagram item={item} compact /></div>}
        <div className="card-badge">{catalogCategoryLabels[getCatalogCategory(item)]}</div>
      </Link>
      <div className="card-body">
        <div className="card-code">{item.code} · {item.confidence} confidence</div>
        <Link href={`/hosiery/${item.slug}`}><h3>{item.name}</h3></Link>
        <p className="card-meta">{item.lengthLabel} · {item.denier ? `${item.denier}D` : "Open structure"} · {item.opacity}</p>
        <div className="card-tags"><span>{item.colorLabel}</span><span>{item.finish}</span><span>{item.knit}</span></div>
        {showCompare && <Link className="text-link" href={`/compare?ids=${item.code}`}>Add to compare →</Link>}
      </div>
    </article>
  );
}
