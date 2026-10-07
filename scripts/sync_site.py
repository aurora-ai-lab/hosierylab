import json
import re
import sys
from pathlib import Path

from PIL import Image

PROJECT = Path(r"E:\AI\Projects\hosierylab")
ARCHIVE = PROJECT / "assets" / "grok-inbox"
PUBLIC_CATALOG = PROJECT / "public" / "catalog"
PUBLIC_ARCHIVE = PROJECT / "public" / "archive"
CATALOG_TS = PROJECT / "src" / "lib" / "generatedCatalog.ts"
START_MARKER = "  // AUTO_RENDERED_ARCHIVE_START"
END_MARKER = "  // AUTO_RENDERED_ARCHIVE_END"


def metadata_entries():
    entries = []
    for path in sorted((ARCHIVE / "metadata").glob("HL-*.json")):
        if "HL-A" in path.name:
            continue
        meta = json.loads(path.read_text(encoding="utf-8"))
        if meta.get("image_status") != "rendered":
            continue
        number = int(re.search(r"HL-(\d{6})-", path.name).group(1))
        if number <= 200:
            continue
        code = f"HL-{number:06d}"
        hosiery = str(meta.get("hosiery") or meta.get("hosiery_vi") or "Hosiery reference")
        shoe = str(meta.get("shoe") or "Footwear context")
        outfit = str(meta.get("outfit") or meta.get("cosplay_archetype") or "Cosplay archive")
        denier_match = re.search(r"(\d+)\s*[dD]", hosiery)
        denier = int(denier_match.group(1)) if denier_match else None
        color = "Jet Black" if "黑" in hosiery or "đen" in hosiery else "Natural"
        hex_value = "#171719" if color == "Jet Black" else "#a8755d"
        entry = {
            "code": code,
            "slug": f"rendered-{number:06d}",
            "name": str(meta.get("name") or f"{code} · {outfit}"),
            "origin": "standard_variant",
            "isSynthetic": True,
            "brand": "HosieryLab Generated Archive",
            "lengthClass": "waist",
            "lengthLabel": "Pantyhose / Tights",
            "coverage": "Toe → Natural Waist",
            "topPosition": "Natural Waist",
            "garmentType": "Pantyhose / Tights",
            "foot": "Full Foot",
            "toe": "Review from asset",
            "heel": "Review from asset",
            "topBand": "Review from asset",
            "support": "Review from asset",
            "denier": denier,
            "opacity": "Sheer" if denier is None or denier <= 30 else "Semi-opaque",
            "colorFamily": "Black" if color == "Jet Black" else "Skin tones",
            "colorLabel": color,
            "hex": hex_value,
            "material": ["Nylon / Polyamide", "Elastane"],
            "finish": "Unclassified",
            "knit": "Review from asset",
            "motif": "Review from asset",
            "season": ["All-season"],
            "occasion": ["Editorial", "Reference"],
            "style": ["Cosplay", "Archive"],
            "visualEffect": ["Surface comparison", "Material study"],
            "description": f"Rendered visual reference {code}, generated from the Vietnamese prompt and held for editorial review.",
            "visualNotes": f"Hosiery prompt metadata: {hosiery}. Shoe context: {shoe}.",
            "history": "Generated archive asset with prompt, seed and render metadata.",
            "confidence": "low",
            "sourceType": "generated_prompt_metadata",
            "imageUrl": f"/catalog/{code}.webp",
            "assetSeed": meta.get("seed"),
            "assetHosiery": hosiery,
            "assetShoe": shoe,
            "cosplayArchetype": outfit,
        }
        entries.append(entry)
    return entries


def ts(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def sync():
    PUBLIC_CATALOG.mkdir(parents=True, exist_ok=True)
    (PUBLIC_ARCHIVE / "metadata").mkdir(parents=True, exist_ok=True)
    (PUBLIC_ARCHIVE / "prompts").mkdir(parents=True, exist_ok=True)
    rendered = []
    for path in sorted((ARCHIVE / "images").glob("HL-*-product-v1.png")):
        if "HL-A" in path.name:
            continue
        number = int(re.search(r"HL-(\d{6})-", path.name).group(1))
        if number <= 12:
            continue
        output = PUBLIC_CATALOG / f"HL-{number:06d}.webp"
        with Image.open(path) as image:
            image.convert("RGB").resize((900, 1600), Image.Resampling.LANCZOS).save(output, "WEBP", quality=80, method=6)
        rendered.append(number)
        code = f"HL-{number:06d}-product-v1"
        for folder in ("metadata", "prompts"):
            source = ARCHIVE / folder / f"{code}.{'json' if folder == 'metadata' else 'md'}"
            if source.exists():
                (PUBLIC_ARCHIVE / folder / source.name).write_bytes(source.read_bytes())

    source = CATALOG_TS.read_text(encoding="utf-8")
    archived_entries = []
    if START_MARKER in source:
        end = source.index(END_MARKER)
        archived_entries = [line.rstrip().rstrip(",") for line in source[source.index(START_MARKER):end].splitlines() if '"code": "HL-A' in line]
        source = source[: source.index(START_MARKER)].rstrip() + "\n];\n"
    closing = source.rfind("\n];")
    if closing < 0:
        raise RuntimeError("generatedCatalog.ts array closing marker not found")
    base = source[:closing].rstrip()
    if not base.endswith(","):
        base += ","
    entries = []
    for item in metadata_entries():
        entries.append("  " + ts(item).replace(":", ": ", 1))
    all_entries = archived_entries + entries
    block = "\n" + START_MARKER + "\n" + ",\n".join(all_entries) + ("\n" if all_entries else "") + END_MARKER
    CATALOG_TS.write_text(base + block + "\n];\n", encoding="utf-8")
    print(json.dumps({"rendered_assets": rendered, "catalog_entries": len(entries)}, ensure_ascii=False))


if __name__ == "__main__":
    sync()
