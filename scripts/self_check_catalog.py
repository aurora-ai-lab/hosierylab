from __future__ import annotations
import json,re
from pathlib import Path

ROOT=Path(r'E:\AI\Projects\hosierylab')
required=('hl_code','seed','checkpoint','original_prompt','full_body_prompt','hosiery_prompt','negative_prompt','cosplay_archetype','cosplay_parts','hosiery','shoe','prompt_language','image_status','source_prompt_vi','source_negative_prompt_vi')
errors=[]; records=[]
for prefix in 'AB':
    for n in range(1,1001):
        code=f'HL-{prefix}{n:06d}'
        path=ROOT/'assets/catalog-2000/metadata'/f'{code}.json'
        if not path.exists(): errors.append(f'{code}:missing metadata'); continue
        m=json.loads(path.read_text(encoding='utf-8')); records.append(code)
        for key in required:
            if key not in m or m[key] in ('',None,[]): errors.append(f'{code}:missing {key}')
        if m.get('hl_code')!=code: errors.append(f'{code}:hl_code mismatch')
        if m.get('prompt_language')!='en': errors.append(f'{code}:prompt_language')
        if m.get('image_status')!='rendered': errors.append(f'{code}:image_status')
        if len(m.get('cosplay_parts',[]))<3: errors.append(f'{code}:cosplay parts')
        for key in ('original_prompt','full_body_prompt','hosiery_prompt','negative_prompt'):
            if re.search(r'[\u00c0-\u024f\u1ea0-\u1eff]',str(m.get(key,''))): errors.append(f'{code}:{key} not English')
        if re.search(r'archive|unreviewed|low confidence|generated|unclassified|review',str(m.get('name','')),re.I): errors.append(f'{code}:generic name')
        for path2 in [ROOT/'public/catalog'/f'{code}.webp',ROOT/'public/archive/metadata'/f'{code}.json',ROOT/'public/archive/prompts'/f'{code}-original.md',ROOT/'public/archive/prompts'/f'{code}-full-body.md',ROOT/'public/archive/prompts'/f'{code}-hosiery.md']:
            if not path2.exists(): errors.append(f'{code}:missing {path2.relative_to(ROOT)}')
manifest=ROOT/'assets/catalog-2000/manifest.json'
if manifest.exists():
    entries=json.loads(manifest.read_text(encoding='utf-8'))
    if len(entries)!=2000: errors.append(f'manifest count {len(entries)}')
else: errors.append('manifest missing')
print(json.dumps({'records':len(records),'expected':2000,'errors':len(errors),'sample_errors':errors[:12]},ensure_ascii=False))
raise SystemExit(1 if len(records)!=2000 or errors else 0)
