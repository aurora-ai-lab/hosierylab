from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT = Path(r"E:\AI\Projects\hosierylab")
DATASETS = [("A", "legacy", PROJECT / "assets" / "grok-inbox"), ("B", "v2", PROJECT / "assets" / "grok-inbox-v2")]
WORK = PROJECT / "assets" / "catalog-2000"
PUBLIC = PROJECT / "public"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def denier(text: str, fallback: str = "") -> int | None:
    match = re.search(r"(?<!\d)(\d{1,3})\s*(?:D|denier|DENIER)(?!\w)", text, re.I)
    if not match:
        match = re.search(r"(?<!\d)(\d{1,3})\s*D", fallback, re.I)
    return int(match.group(1)) if match else None


def first_match(text: str, patterns: list[tuple[str, str]], default: str) -> str:
    for pattern, value in patterns:
        if re.search(pattern, text, re.I):
            return value
    return default


def split_prompt(positive: str, hosiery_hint: str) -> tuple[str, str]:
    # Vietnamese source prompts place hosiery after the phone/pose description.
    start = re.search(r"\b(?:tất|quần tất)\b", positive, re.I)
    if not start:
        return positive.strip(), hosiery_hint.strip() or "丝袜属性待补充"
    body = positive[: start.start()].rstrip(" .，,;；")
    tail = positive[start.start() :]
    end = re.search(r"\b(?:Bối cảnh|Hội trường|Không khỏa thân|Không có chữ)\b", tail, re.I)
    hosiery = tail[: end.start()].strip(" .，,;；") if end else tail.strip()
    return body, hosiery or hosiery_hint.strip() or "丝袜属性待补充"


def public_name(text: str, hosiery_text: str, positive: str) -> tuple[str, dict]:
    combined = " ".join([text, hosiery_text])
    d = denier(combined, text)
    color = first_match(
        combined,
        [
            (r"酒红|đỏ rượu|burgundy|wine", "酒红"),
            (r"海军蓝|xanh navy|navy", "海军蓝"),
            (r"炭灰|烟灰|xám khói|than", "炭灰"),
            (r"咖啡|cà phê|coffee", "咖啡棕"),
            (r"白色|纯白|trắng|white", "纯白"),
            (r"蜜裸|裸色|nude|nude mật ong|da màu nude", "蜜裸"),
            (r"黑色|纯黑|đen|black", "纯黑"),
        ],
        "自然肤色",
    )
    features: list[str] = []
    for pattern, value in [
        (r"波点|chấm bi|polka", "波点"),
        (r"后缝|đường may sau|seam", "后缝线"),
        (r"罗纹|dệt gân|gân|rib", "罗纹"),
        (r"缎光|ánh satin|satin", "缎光"),
        (r"蕾丝|ren|lace", "蕾丝"),
        (r"破洞|rách|distressed", "破洞"),
        (r"网眼|网袜|lưới|fishnet", "网眼"),
        (r"吊带|dây treo|suspender", "吊带"),
        (r"不透|đục|opaque", "不透"),
        (r"超薄|siêu mỏng|薄透|mỏng trong|siêu trong", "薄透"),
    ]:
        if re.search(pattern, combined, re.I) and value not in features:
            features.append(value)
    if re.search(r"tất đùi|大腿袜", combined, re.I):
        garment = "大腿袜"
    elif re.search(r"dây treo|吊带|suspender", combined, re.I):
        garment = "吊带袜"
    elif re.search(r"lưới|网眼|fishnet", combined, re.I):
        garment = "网袜"
    else:
        garment = "连裤袜"
    denier_label = f"{d}D" if d is not None else "开放结构"
    name = " ".join(features + [denier_label, color, garment])
    if not features and name.endswith("连裤袜"):
        name = f"{denier_label} {color} 连裤袜"
    return name, {"denier": d, "color": color, "features": features, "garment": garment}


def build_image(source: Path, destination: Path, font: ImageFont.FreeTypeFont) -> None:
    image = Image.open(source).convert("RGBA")
    draw = ImageDraw.Draw(image, "RGBA")
    label = "HOSIERYLAB.COM"
    margin = max(24, image.width // 38)
    bbox = draw.textbbox((0, 0), label, font=font)
    x = image.width - (bbox[2] - bbox[0]) - margin
    y = image.height - (bbox[3] - bbox[1]) - margin
    draw.rounded_rectangle(
        (x - 14, y - 10, x + (bbox[2] - bbox[0]) + 14, y + (bbox[3] - bbox[1]) + 10),
        radius=8,
        fill=(0, 0, 0, 84),
    )
    draw.text((x + 1, y + 1), label, font=font, fill=(0, 0, 0, 125))
    draw.text((x, y), label, font=font, fill=(255, 255, 255, 190))
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(destination, "WEBP", quality=88, method=0)


def make_item(code: str, dataset: str, meta: dict, source_meta_path: Path, public_name_value: str, parts: dict, body: str, hosiery: str, original: str, negative: str, source_hash: str) -> dict:
    garment = parts["garment"]
    thigh = garment in {"大腿袜", "吊带袜"}
    length_class = "thigh_high" if thigh else "waist"
    length_label = "Thigh High / Stockings" if thigh else "Pantyhose / Tights"
    opacity = "Opaque" if "不透" in parts["features"] else "Ultra Sheer" if "薄透" in parts["features"] else "Sheer"
    finish = "Satin" if "缎光" in parts["features"] else "Matte" if "罗纹" in parts["features"] or "不透" in parts["features"] else "Natural"
    knit = "Ribbed" if "罗纹" in parts["features"] else "Seamed" if "后缝线" in parts["features"] else "Mesh" if "网眼" in parts["features"] else "Plain"
    motif = "Polka dot" if "波点" in parts["features"] else "None"
    image_path = f"/catalog/{code}.webp"
    prompt_root = f"/archive/prompts/{code}"
    metadata_path = f"/archive/metadata/{code}.json"
    slug_seed = hashlib.sha1(f"{code}:{public_name_value}:{source_hash}".encode()).hexdigest()[:10]
    slug = re.sub(r"[^a-z0-9]+", "-", public_name_value.lower()).strip("-") or "hosiery"
    slug = f"{slug}-{slug_seed}"
    return {
        "code": code,
        "slug": slug,
        "name": public_name_value,
        "origin": "standard_variant",
        "isSynthetic": True,
        "brand": "HosieryLab",
        "lengthClass": length_class,
        "lengthLabel": length_label,
        "coverage": "Toe → Upper Thigh" if thigh else "Toe → Natural Waist",
        "topPosition": "Upper Thigh" if thigh else "Natural Waist",
        "garmentType": garment,
        "foot": "Full Foot",
        "toe": "Review from image",
        "heel": "Review from image",
        "topBand": "Review from image",
        "support": "Review from image",
        "denier": parts["denier"],
        "opacity": opacity,
        "colorFamily": parts["color"],
        "colorLabel": parts["color"],
        "hex": "#171719" if parts["color"] == "纯黑" else "#a8755d",
        "material": ["Nylon / Polyamide", "Elastane"],
        "finish": finish,
        "knit": knit,
        "motif": motif,
        "season": ["All-season"],
        "occasion": ["Editorial", "Reference"],
        "style": ["Material study"],
        "visualEffect": parts["features"] or ["Surface study"],
        "description": f"{public_name_value} 的视觉参考，按统一光线记录丝袜的结构、透明度和表面特征。",
        "visualNotes": hosiery,
        "history": "HosieryLab visual reference with preserved prompt and render provenance.",
        "confidence": "medium",
        "sourceType": f"{dataset}_prompt",
        "imageUrl": image_path,
        "assetSeed": meta.get("seed"),
        "assetHosiery": meta.get("hosiery") or hosiery,
        "assetShoe": meta.get("shoe", ""),
        "dataset": dataset,
        "promptMetadataUrl": metadata_path,
        "promptOriginalUrl": f"{prompt_root}-original.md",
        "promptFullBodyUrl": f"{prompt_root}-full-body.md",
        "promptHosieryUrl": f"{prompt_root}-hosiery.md",
        "watermarkVersion": "hosierylab-v1",
    }


def main() -> None:
    for path in [WORK, PUBLIC / "catalog", PUBLIC / "archive" / "metadata", PUBLIC / "archive" / "prompts"]:
        path.mkdir(parents=True, exist_ok=True)
    for path in [PUBLIC / "catalog", PUBLIC / "archive" / "metadata", PUBLIC / "archive" / "prompts"]:
        for pattern in ["HL-A*.webp", "HL-B*.webp", "HL-A*.json", "HL-B*.json", "HL-A*.md", "HL-B*.md"]:
            for file in path.glob(pattern):
                file.unlink()
    if WORK.exists():
        shutil.rmtree(WORK)
    for sub in ["images/source", "images/public", "metadata", "prompts/original", "prompts/full-body", "prompts/hosiery"]:
        (WORK / sub).mkdir(parents=True, exist_ok=True)
    font_path = Path(r"C:\Windows\Fonts\arial.ttf")
    font = ImageFont.truetype(str(font_path), 30)
    catalog: list[dict] = []
    manifest: list[dict] = []
    for prefix, dataset, root in DATASETS:
        metadata_files = sorted((root / "metadata").glob("*.json"), key=lambda p: int(re.search(r"(\d{6})", p.name).group(1)))
        if len(metadata_files) != 1000:
            raise RuntimeError(f"Expected 1000 metadata files in {root}, found {len(metadata_files)}")
        for index, source_meta_path in enumerate(metadata_files, 1):
            meta = read_json(source_meta_path)
            code = f"HL-{prefix}{index:06d}"
            source_image = root / "images" / f"HL-A{index:06d}-product-v1.png"
            if not source_image.exists():
                raise FileNotFoundError(source_image)
            original = str(meta.get("positive_prompt", "")).strip()
            negative = str(meta.get("negative_prompt", "")).strip()
            body, hosiery_prompt = split_prompt(original, str(meta.get("hosiery", "")))
            name, parts = public_name(str(meta.get("hosiery", "")), hosiery_prompt, original)
            source_hash = hashlib.sha256(source_image.read_bytes()).hexdigest()
            public_image = WORK / "images" / "public" / f"{code}.webp"
            build_image(source_image, public_image, font)
            shutil.copy2(source_image, WORK / "images" / "source" / f"{code}.png")
            (WORK / "prompts" / "original" / f"{code}.md").write_text(original + "\n", encoding="utf-8")
            (WORK / "prompts" / "full-body" / f"{code}.md").write_text(body + "\n", encoding="utf-8")
            (WORK / "prompts" / "hosiery" / f"{code}.md").write_text(hosiery_prompt + "\n", encoding="utf-8")
            item = make_item(code, dataset, meta, source_meta_path, name, parts, body, hosiery_prompt, original, negative, source_hash)
            record = dict(meta)
            record.update({
                "hl_code": code,
                "dataset": dataset,
                "public_name": name,
                "name": name,
                "original_prompt": original,
                "full_body_prompt": body,
                "hosiery_prompt": hosiery_prompt,
                "negative_prompt": negative,
                "public_image": item["imageUrl"],
                "prompt_metadata_url": item["promptMetadataUrl"],
                "prompt_original_url": item["promptOriginalUrl"],
                "prompt_full_body_url": item["promptFullBodyUrl"],
                "prompt_hosiery_url": item["promptHosieryUrl"],
                "source_image_sha256": source_hash,
                "image_status": "rendered",
                "watermark_version": "hosierylab-v1",
            })
            (WORK / "metadata" / f"{code}.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            shutil.copy2(public_image, PUBLIC / "catalog" / f"{code}.webp")
            shutil.copy2(WORK / "metadata" / f"{code}.json", PUBLIC / "archive" / "metadata" / f"{code}.json")
            for kind in ["original", "full-body", "hosiery"]:
                shutil.copy2(WORK / "prompts" / kind / f"{code}.md", PUBLIC / "archive" / "prompts" / f"{code}-{kind}.md")
            catalog.append(item)
            manifest.append({"hl_code": code, "dataset": dataset, "source_image_sha256": source_hash, "public_image_sha256": hashlib.sha256(public_image.read_bytes()).hexdigest(), "metadata": f"metadata/{code}.json"})
    (WORK / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    generated = "// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck\nimport type { HosieryItem } from \"./data\";\n\nexport const generatedCatalog: HosieryItem[] = " + json.dumps(catalog, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (PROJECT / "src" / "lib" / "generatedCatalog.ts").write_text(generated, encoding="utf-8")
    print(json.dumps({"records": len(catalog), "images": len(list((WORK / "images" / "public").glob("*.webp"))), "metadata": len(list((WORK / "metadata").glob("*.json"))), "prompts_each": len(list((WORK / "prompts" / "original").glob("*.md"))), "manifest": len(manifest)}, ensure_ascii=False))


if __name__ == "__main__":
    main()


