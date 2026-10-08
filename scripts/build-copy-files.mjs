import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const metadataDir = path.join(root, "private", "archive", "metadata");
const outputDir = path.join(root, "public", "data", "copy");
fs.mkdirSync(outputDir, { recursive: true });
for (const file of fs.readdirSync(metadataDir).filter((name) => name.endsWith(".json"))) {
  const code = file.slice(0, -5);
  if (code === "HL-A000001" || code === "HL-A000002") continue;
  const raw = JSON.parse(fs.readFileSync(path.join(metadataDir, file), "utf8"));
  const prompts = {
    hosiery: raw.hosiery_prompt ?? raw.product_prompt ?? raw.prompts?.hosiery ?? null,
    full: raw.full_body_prompt ?? raw.original_prompt ?? raw.positive_prompt ?? raw.prompts?.full ?? null,
  };
  fs.writeFileSync(path.join(outputDir, `${code}.json`), JSON.stringify({ hl_code: code, prompts }, null, 2) + "\n");
}
console.log(`wrote ${fs.readdirSync(outputDir).length} copy files`);

