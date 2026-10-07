import fs from "node:fs/promises";
import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

function readEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
}

const args = new Set(process.argv.slice(2));
const limitArg = process.argv.find((value) => value.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : Infinity;
const env = readEnv(await fs.readFile(new URL("../.env.r2", import.meta.url), "utf8"));
for (const key of ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]) if (!env[key]) throw new Error(`Missing ${key}`);
const client = new S3Client({ region: "auto", endpoint: env.R2_ENDPOINT, forcePathStyle: true, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY } });

async function listAll(prefix) {
  const keys = new Set(); let token;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: env.R2_BUCKET, Prefix: prefix, MaxKeys: 1000, ContinuationToken: token }));
    for (const object of page.Contents ?? []) if (object.Key) keys.add(object.Key);
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function readJson(key) {
  const response = await client.send(new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
  return JSON.parse(await response.Body.transformToString());
}

const [imageKeys, promptKeys, metadataKeys] = await Promise.all([listAll("images/"), listAll("prompts/"), listAll("metadata/")]);
const codes = [...new Set([...imageKeys, ...promptKeys, ...metadataKeys].map((key) => key.match(/(HL-[A-Z]?\d{6})-product-v1/)?.[1]).filter(Boolean))].sort().slice(0, limit);
const report = { bucket: env.R2_BUCKET, checked: 0, publishable: 0, blocked: 0, missing: [], warnings: [], records: [] };
for (const code of codes) {
  report.checked += 1;
  const image = `images/${code}-product-v1.png`, prompt = `prompts/${code}-product-v1.md`, metadata = `metadata/${code}-product-v1.json`;
  const missing = [!imageKeys.has(image) && "image", !promptKeys.has(prompt) && "prompt", !metadataKeys.has(metadata) && "metadata"].filter(Boolean);
  if (missing.length) { report.blocked += 1; report.missing.push({ code, missing }); continue; }
  let meta;
  try { meta = await readJson(metadata); } catch { report.blocked += 1; report.missing.push({ code, missing: ["invalid_metadata"] }); continue; }
  const blocking = [];
  if (meta.image_status !== "rendered") blocking.push("image_status_not_rendered");
  if (!meta.positive_prompt) blocking.push("positive_prompt_missing");
  if (!meta.seed) report.warnings.push({ code, warning: "seed_missing" });
  if (!meta.facts_hash) report.warnings.push({ code, warning: "facts_hash_missing" });
  const record = { code, category: meta.category ?? (meta.cosplay_archetype ? "cosplay" : "anime"), image, prompt, metadata, image_status: meta.image_status ?? null, has_full_prompt: Boolean(meta.positive_prompt), has_snippet: Boolean(meta.product_prompt || meta.snippet_prompt), facts_hash: meta.facts_hash ?? null };
  report.records.push(record);
  if (blocking.length) { report.blocked += 1; report.missing.push({ code, missing: blocking }); } else report.publishable += 1;
}
await fs.writeFile(new URL("../r2-ingest-report.json", import.meta.url), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ ...report, records: undefined, report_file: "r2-ingest-report.json", mode: args.has("--publish") ? "publish-gate-only" : "dry-run" }, null, 2));
if (report.blocked) process.exitCode = 2;
