import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const projectRoot = process.cwd();
const stage = path.join(projectRoot, "assets", "grok-inbox-v2");
const [startArg, endArg] = process.argv.slice(2);
const start = Number(startArg);
const end = Number(endArg);
if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > 1000) throw new Error("Usage: node upload-r2-v2.mjs START END");

function readEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
}
function contentType(file) {
  return { ".png": "image/png", ".json": "application/json", ".md": "text/markdown; charset=utf-8" }[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}
const env = readEnv(await fs.readFile(path.join(projectRoot, ".env.r2"), "utf8"));
for (const key of ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]) if (!env[key]) throw new Error(`Missing ${key}`);
const client = new S3Client({ region: "auto", endpoint: env.R2_ENDPOINT, forcePathStyle: true, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY } });

const files = [];
for (let n = start; n <= end; n += 1) {
  const code = `HL-A${String(n).padStart(6, "0")}`;
  const stem = `${code}-product-v1`;
  for (const folder of ["images", "prompts", "metadata"]) {
    const ext = folder === "images" ? ".png" : folder === "prompts" ? ".md" : ".json";
    files.push({ absolute: path.join(stage, folder, stem + ext), key: `${folder}/${stem}${ext}` });
  }
}
let completed = 0;
for (const file of files) {
  const body = await fs.readFile(file.absolute);
  await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: file.key, Body: body, ContentType: contentType(file.absolute), CacheControl: file.key.startsWith("images/") ? "public, max-age=31536000, immutable" : "no-cache" }));
  completed += 1;
  if (completed % 30 === 0 || completed === files.length) console.log(`uploaded ${completed}/${files.length}`);
}
console.log(`R2 batch complete: ${start}-${end}`);
