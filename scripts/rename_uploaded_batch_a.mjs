import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dirs = {
  images: path.join(root, "assets/grok-inbox/images"),
  metadata: path.join(root, "assets/grok-inbox/metadata"),
  prompts: path.join(root, "assets/grok-inbox/prompts"),
  catalog: path.join(root, "public/catalog"),
  archiveMetadata: path.join(root, "public/archive/metadata"),
  archivePrompts: path.join(root, "public/archive/prompts"),
};

const pad = (n) => String(n).padStart(6, "0");
const oldCode = (n) => `HL-${pad(n)}`;
const newCode = (n) => `HL-A${pad(n)}`;
const productName = (n) => `${newCode(n)}-product-v1`;

function colorLabel(meta) {
  const text = `${meta.hosiery ?? ""} ${meta.hosiery_vi ?? ""} ${meta.positive_prompt ?? ""}`.toLowerCase();
  if (/酒红|đỏ rượu|burgundy|đỏ vang/.test(text)) return "酒红";
  if (/咖啡|nâu|cà phê|coffee|brown/.test(text)) return "咖啡棕";
  if (/海军蓝|xanh navy|navy/.test(text)) return "海军蓝";
  if (/炭灰|xám than|charcoal|graphite/.test(text)) return "炭灰";
  if (/烟灰|xám khói|smoke/.test(text)) return "烟灰";
  if (/深蓝|xanh đậm|blue/.test(text)) return "深蓝";
  if (/黑|đen|black/.test(text)) return "纯黑";
  if (/白|trắng|white/.test(text)) return "纯白";
  if (/裸|肤|nude|beige|蜜/.test(text)) return "自然肤色";
  if (/粉|hồng|pink/.test(text)) return "粉色";
  if (/绿|xanh lá|olive|green/.test(text)) return "橄榄绿";
  return "综合色";
}

function denierLabel(meta) {
  const text = `${meta.hosiery ?? ""} ${meta.hosiery_vi ?? ""} ${meta.positive_prompt ?? ""}`;
  const match = text.match(/(\d+)\s*(?:D|denier|丹尼尔)/i);
  return match ? `${match[1]}D` : "未标丹尼尔";
}

function poseLabel(meta) {
  const text = `${meta.positive_prompt ?? ""} ${meta.hosiery ?? ""}`.toLowerCase();
  if (/ngồi trên mép bàn|坐在桌沿/.test(text)) return "桌沿伸腿坐姿";
  if (/đứng|站立/.test(text)) return "交叠站姿";
  return "低机位伸腿姿";
}

function displayName(n, meta) {
  return `${denierLabel(meta)} ${colorLabel(meta)}连裤袜 · ${poseLabel(meta)}`;
}

function renamePair(dir, oldName, newName) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (!fs.existsSync(oldPath)) throw new Error(`Missing ${oldPath}`);
  fs.renameSync(oldPath, `${oldPath}.renaming`);
  fs.renameSync(`${oldPath}.renaming`, newPath);
}

const metadataByNumber = new Map();
for (let n = 1; n <= 1000; n += 1) {
  const oldProduct = `${oldCode(n)}-product-v1`;
  const newProduct = productName(n);
  const metaPath = path.join(dirs.metadata, `${oldProduct}.json`);
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const name = displayName(n, meta);
  meta.hl_code = newProduct;
  meta.display_name = name;
  meta.name = name;
  if (typeof meta.output_path === "string") meta.output_path = meta.output_path.replace(oldCode(n), newCode(n));
  metadataByNumber.set(n, { meta, name });
}

for (const dir of [dirs.images, dirs.metadata, dirs.prompts, dirs.catalog, dirs.archiveMetadata, dirs.archivePrompts]) {
  if (!fs.existsSync(dir)) continue;
  for (let n = 1; n <= 1000; n += 1) {
    const oldBase = oldCode(n);
    const newBase = newCode(n);
    const names = fs.readdirSync(dir).filter((entry) => entry.startsWith(`${oldBase}-product-v1.`) || entry === `${oldBase}.webp`);
    for (const name of names) renamePair(dir, name, name.replace(oldBase, newBase));
  }
}

for (let n = 1; n <= 1000; n += 1) {
  const info = metadataByNumber.get(n);
  const file = path.join(dirs.metadata, `${productName(n)}.json`);
  fs.writeFileSync(file, `${JSON.stringify(info.meta, null, 2)}\n`, "utf8");
  const promptFile = path.join(dirs.prompts, `${productName(n)}.md`);
  const prompt = fs.readFileSync(promptFile, "utf8").replaceAll(oldCode(n), newCode(n));
  fs.writeFileSync(promptFile, prompt, "utf8");
  for (const archiveFile of [path.join(dirs.archiveMetadata, `${productName(n)}.json`), path.join(dirs.archivePrompts, `${productName(n)}.md`)]) {
    if (fs.existsSync(archiveFile)) {
      const content = fs.readFileSync(archiveFile, "utf8").replaceAll(oldCode(n), newCode(n));
      fs.writeFileSync(archiveFile, content, "utf8");
    }
  }
}

let generated = fs.readFileSync(path.join(root, "src/lib/generatedCatalog.ts"), "utf8");
for (let n = 13; n <= 1000; n += 1) {
  const old = oldCode(n);
  const next = newCode(n);
  generated = generated.replaceAll(old, next).replaceAll(`rendered-${pad(n)}`, `archived-a${pad(n)}`);
  const info = metadataByNumber.get(n);
  const escaped = info.name.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  const line = new RegExp(`("code"\\s*:\\s*"${next}"[^\\n]*?"name"\\s*:\\s*")([^"]*)(")`);
  generated = generated.replace(line, `$1${escaped}$3`);
}
fs.writeFileSync(path.join(root, "src/lib/generatedCatalog.ts"), generated, "utf8");

let data = fs.readFileSync(path.join(root, "src/lib/data.ts"), "utf8");
for (let n = 1; n <= 12; n += 1) {
  const old = oldCode(n);
  const next = newCode(n);
  const at = data.indexOf(`code: "${old}"`);
  if (at < 0) throw new Error(`Missing standard record ${old}`);
  const start = data.lastIndexOf("  {", at);
  const end = data.indexOf("\n  },", at);
  let block = data.slice(start, end);
  block = block.replace(`code: "${old}"`, `code: "${next}"`);
  block = block.replace(/name: "[^"]*"/, `name: "${metadataByNumber.get(n).name}"`);
  data = `${data.slice(0, start)}${block}${data.slice(end)}`;
}
fs.writeFileSync(path.join(root, "src/lib/data.ts"), data, "utf8");

for (const file of ["src/components/HosieryCard.tsx", "src/app/compare/page.tsx", "src/app/hosiery/[slug]/page.tsx"]) {
  const full = path.join(root, file);
  let text = fs.readFileSync(full, "utf8");
  text = text.replaceAll("item.imageUrl ?? (Number(item.code.slice(3)) <= 200 ? `/catalog/${item.code}.webp` : undefined)", "item.imageUrl ?? `/catalog/${item.code}.webp`");
  fs.writeFileSync(full, text, "utf8");
}

console.log(JSON.stringify({ renamed: 1000, sample: [1, 2, 1000].map((n) => ({ code: newCode(n), name: metadataByNumber.get(n).name })) }, null, 2));
