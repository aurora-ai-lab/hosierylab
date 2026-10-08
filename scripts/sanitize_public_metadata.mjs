import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

// Render provenance stays in assets/. Only this allowlist can enter a public build.
const directory = resolve('out/archive/metadata');
try { await readdir(directory); } catch (error) {
  if (error?.code === 'ENOENT') {
    console.log('No public metadata directory in this build; skipping sanitation.');
    process.exit(0);
  }
  throw error;
}
const allowed = new Set(['hl_code', 'seed', 'positive_prompt', 'negative_prompt', 'original_prompt', 'full_body_prompt', 'hosiery_prompt', 'product_prompt', 'cosplay_archetype', 'cosplay_parts', 'hosiery', 'shoe', 'prompt_language', 'image_status', 'is_synthetic', 'aspect_ratio', 'rendered_size', 'display_name', 'name', 'dataset', 'public_name', 'public_image', 'prompt_metadata_url', 'prompt_original_url', 'prompt_full_body_url', 'prompt_hosiery_url', 'assetHosiery', 'source_prompt_vi', 'source_negative_prompt_vi', 'prompt_language_source', 'cosplay_archetype_en', 'cosplay_parts_en', 'shoe_en', 'translation_version', 'watermark_version']);
let count = 0;
for (const file of await readdir(directory)) {
  if (!file.endsWith('.json')) continue;
  const path = join(directory, file);
  const source = JSON.parse(await readFile(path, 'utf8'));
  const metadata = Object.fromEntries(Object.entries(source).filter(([key]) => allowed.has(key)));
  const text = JSON.stringify(metadata, null, 2);
  if (/[A-Za-z]:\\\\|file:\/\//.test(text)) throw new Error(`Local path in public metadata: ${file}`);
  await writeFile(path, text + '\n');
  count++;
}
if (!count) throw new Error('No public metadata found');
console.log(`Public metadata sanitized: ${count} records; private render metadata preserved.`);
