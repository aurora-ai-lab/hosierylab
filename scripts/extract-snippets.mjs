import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "assets", "grok-inbox", "metadata");
const files = (await fs.readdir(dir)).filter((name) => name.endsWith(".json") && name.startsWith("HL-"));
const report = { scanned: 0, extracted: 0, missing: [] };

function extract(meta) {
  if (meta.product_prompt) return meta.product_prompt;
  const prompt = String(meta.positive_prompt ?? "");
  const sentences = prompt.split(/(?<=[.!?。！？])\s+/);
  const hit = sentences.find((sentence) => /\b(tất|vớ|hosiery|stocking|tights|pantyhose|denier|denier)\b/i.test(sentence));
  if (hit) return hit.trim();
  const value = meta.hosiery_vi || meta.hosiery;
  return value ? `Tất/hosiery: ${String(value).trim()}.` : null;
}

for (const name of files) {
  report.scanned += 1;
  const file = path.join(dir, name);
  const meta = JSON.parse(await fs.readFile(file, "utf8"));
  const snippet = extract(meta);
  if (!snippet) { report.missing.push(meta.hl_code ?? name); continue; }
  meta.product_prompt = snippet;
  meta.snippet_source = "extracted_from_positive_prompt";
  await fs.writeFile(file, JSON.stringify(meta, null, 2) + "\n", "utf8");
  report.extracted += 1;
}
await fs.writeFile(path.join(root, "snippet-extraction-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ ...report, report_file: "snippet-extraction-report.json" }, null, 2));
if (report.missing.length) process.exitCode = 2;
