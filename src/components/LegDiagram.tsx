export function LegDiagram({ item, compact = false }: { item: { lengthClass: string; hex: string; opacity: string; foot: string; topPosition: string }; compact?: boolean }) {
  const footless = item.foot === "Footless";
  return (
    <div className={`leg-diagram ${compact ? "compact" : ""}`} aria-label={`Coverage ${item.topPosition}, ${item.opacity}`}>
      <div className="diagram-glow" style={{ background: item.hex, opacity: item.opacity.includes("Sheer") ? 0.35 : 0.7 }} />
      <div className="diagram-leg" style={{ background: `linear-gradient(135deg, ${item.hex}, #ece8e0)` }}>
        <span className="diagram-top" style={{ background: item.hex }} />
        {!footless && <span className="diagram-foot" style={{ background: item.hex }} />}
        {item.lengthClass === "thigh_high" && <span className="diagram-band" style={{ borderColor: item.hex }} />}
      </div>
      <div className="diagram-label">{item.topPosition}</div>
    </div>
  );
}
