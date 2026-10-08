import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const root = process.cwd();
const stage = path.join(root, "assets", "catalog-2000");
function readEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const i = line.indexOf("=");
    return [line.slice(0, i), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
}
const env = readEnv(await fs.readFile(path.join(root, ".env.r2"), "utf8"));
for (const key of ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]) if (!env[key]) throw new Error(`Missing ${key}`);
const client = new S3Client({ region: "auto", endpoint: env.R2_ENDPOINT, forcePathStyle: true, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY } });
const records = [];
for (const dataset of ["A", "B"]) for (let n = 1; n <= 1000; n += 1) {
  const code = `HL-${dataset}${String(n).padStart(6, "0")}`;
  records.push(
    [path.join(stage, "images", "source", `${code}.png`), `hosierylab/${dataset}/original-images/${code}.png`, "image/png", "public, max-age=31536000, immutable"],
    [path.join(stage, "images", "public", `${code}.webp`), `hosierylab/${dataset}/images/${code}.webp`, "image/webp", "public, max-age=31536000, immutable"],
    [path.join(stage, "metadata", `${code}.json`), `hosierylab/${dataset}/metadata/${code}.json`, "application/json", "no-cache"],
    [path.join(stage, "prompts", "original", `${code}.md`), `hosierylab/${dataset}/prompts/${code}/original.md`, "text/markdown; charset=utf-8", "no-cache"],
    [path.join(stage, "prompts", "full-body", `${code}.md`), `hosierylab/${dataset}/prompts/${code}/full-body.md`, "text/markdown; charset=utf-8", "no-cache"],
    [path.join(stage, "prompts", "hosiery", `${code}.md`), `hosierylab/${dataset}/prompts/${code}/hosiery.md`, "text/markdown; charset=utf-8", "no-cache"],
  );
}
const chunkSize = 24;
let completed = 0;
for (let i = 0; i < records.length; i += chunkSize) {
  await Promise.all(records.slice(i, i + chunkSize).map(async ([absolute, key, ContentType, CacheControl]) => {
    const Body = await fs.readFile(absolute);
    await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: key, Body, ContentType, CacheControl }));
  }));
  completed += Math.min(chunkSize, records.length - i);
  if (completed % 600 === 0 || completed === records.length) console.log(`uploaded ${completed}/${records.length}`);
}
console.log("R2 catalog upload complete: 2000 records, source images + watermarked images + metadata + 3 prompt variants");
