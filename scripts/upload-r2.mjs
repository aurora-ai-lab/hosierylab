import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.r2");

function readEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
}

async function collect(directory, prefix) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const key = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await collect(absolute, key));
    else files.push({ absolute, key });
  }
  return files;
}

function contentType(file) {
  return { ".png": "image/png", ".webp": "image/webp", ".json": "application/json", ".md": "text/markdown; charset=utf-8" }[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}

const env = readEnv(await fs.readFile(envPath, "utf8"));
for (const key of ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]) {
  if (!env[key]) throw new Error(`Missing ${key} in .env.r2`);
}

const client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});

const files = [
  ...(await collect(path.join(projectRoot, "assets/grok-inbox/images"), "images")),
  ...(await collect(path.join(projectRoot, "assets/grok-inbox/prompts"), "prompts")),
  ...(await collect(path.join(projectRoot, "assets/grok-inbox/metadata"), "metadata")),
  ...(await collect(path.join(projectRoot, "public/reference"), "reference")),
];
let completed = 0;
const queue = [...files];
async function worker() {
  while (queue.length) {
    const file = queue.shift();
    if (!file) return;
    const body = await fs.readFile(file.absolute);
    await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: file.key, Body: body, ContentType: contentType(file.absolute), CacheControl: file.key.startsWith("images/") || file.key.startsWith("reference/") ? "public, max-age=31536000, immutable" : "no-cache" }));
    completed += 1;
    if (completed % 25 === 0 || completed === files.length) console.log(`uploaded ${completed}/${files.length}`);
  }
}
await Promise.all(Array.from({ length: Math.min(6, files.length) }, worker));
console.log(`R2 upload complete: ${files.length} objects to ${env.R2_BUCKET}`);
