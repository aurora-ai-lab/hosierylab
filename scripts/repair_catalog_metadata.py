from __future__ import annotations
import hashlib, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import build_catalog_2000 as b

project = b.PROJECT
work = project / 'assets' / 'catalog-2000'
public = project / 'public'
datasets = [("A", "legacy", project / "assets" / "grok-inbox"), ("B", "v2", project / "assets" / "grok-inbox-v2")]

generated_path = project / 'src' / 'lib' / 'generatedCatalog.ts'
text = generated_path.read_text(encoding='utf-8')
json_text = text.split(' = ', 1)[1].rsplit(';', 1)[0].strip()
catalog = json.loads(json_text)
by_code = {item['code']: item for item in catalog}
changed = []
for prefix, dataset, root in datasets:
    files = sorted((root / 'metadata').glob('*.json'), key=lambda p: int(re.search(r'(\d{6})', p.name).group(1)))
    for index, source_path in enumerate(files, 1):
        code = f'HL-{prefix}{index:06d}'
        source_meta = json.loads(source_path.read_text(encoding='utf-8'))
        original = str(source_meta.get('positive_prompt', '')).strip()
        body, hosiery = b.split_prompt(original, str(source_meta.get('hosiery', '')))
        # The parsed hosiery segment is authoritative; do not let costume colors leak in.
        name, parts = b.public_name(hosiery, hosiery, original)
        current_meta_path = work / 'metadata' / f'{code}.json'
        record = json.loads(current_meta_path.read_text(encoding='utf-8'))
        source_hash = record.get('source_image_sha256', '')
        item = b.make_item(code, dataset, source_meta, source_path, name, parts, body, hosiery, original, str(source_meta.get('negative_prompt', '')), source_hash)
        record.update({
            'name': name, 'public_name': name, 'display_name': name,
            'original_prompt': original, 'full_body_prompt': body, 'hosiery_prompt': hosiery,
            'hosiery': hosiery, 'assetHosiery': hosiery,
            'image_status': 'rendered', 'watermark_version': 'hosierylab-v1',
        })
        current_meta_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        (public / 'archive' / 'metadata' / f'{code}.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        (work / 'prompts' / 'full-body' / f'{code}.md').write_text(body + '\n', encoding='utf-8')
        (work / 'prompts' / 'hosiery' / f'{code}.md').write_text(hosiery + '\n', encoding='utf-8')
        (public / 'archive' / 'prompts' / f'{code}-full-body.md').write_text(body + '\n', encoding='utf-8')
        (public / 'archive' / 'prompts' / f'{code}-hosiery.md').write_text(hosiery + '\n', encoding='utf-8')
        by_code[code].update(item)
        changed.append(code)

catalog = [by_code[f'HL-{prefix}{i:06d}'] for prefix in ('A', 'B') for i in range(1, 1001)]
generated_path.write_text('// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck\nimport type { HosieryItem } from "./data";\n\nexport const generatedCatalog: HosieryItem[] = ' + json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print(json.dumps({'updated': len(changed), 'first': changed[0], 'last': changed[-1]}, ensure_ascii=False))
