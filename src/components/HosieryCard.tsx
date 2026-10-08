import Link from "next/link";
import type { HosieryItem } from "@/lib/data";
import { LegDiagram } from "./LegDiagram";
import { CopyPromptButton } from "./CopyPromptButton";
import type { Locale } from "@/lib/i18n";
import { colorName, lengthName, nameOf, opacityName } from "@/lib/display";

export function HosieryCard({ item, source = "catalog", surface = "catalog", locale = "zh" }: { item: HosieryItem; source?: "catalog" | "guide" | "learn" | "look"; surface?: "catalog" | "detail" | "similar"; locale?: Locale }) {
  const imageUrl = item.imageUrl ?? `/catalog/${item.code}.webp`;
  const prefix = locale === "en" ? "/en" : "";
  return (
    <article className="specimen-card">
      <Link href={`${prefix}/hosiery/${item.code.toLowerCase()}`} className="card-visual">
        {imageUrl ? <img className="card-image" src={imageUrl} alt={`${item.name} visual reference`} loading="lazy" /> : <div className="card-image-fallback visible"><LegDiagram item={item} compact /></div>}
      </Link>
      <div className="card-body">
        <Link href={`${prefix}/hosiery/${item.code.toLowerCase()}`}><h3>{nameOf(item, locale)}</h3></Link>
        <p className="card-meta">{lengthName(item.lengthLabel, locale)} · {item.denier ? `${item.denier}D` : locale === "en" ? "Open structure" : "开放结构"} · {opacityName(item.opacity, locale)}</p>
        <div className="card-tags"><span>{colorName(item, locale)}</span><span>{item.finish}</span><span>{item.knit}</span></div>
        <div className="card-actions"><CopyPromptButton code={item.code} kind="hosiery" compact source={source} surface={surface} locale={locale} /><CopyPromptButton code={item.code} compact source={source} surface={surface} locale={locale} /></div>
      </div>
    </article>
  );
}



