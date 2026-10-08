import json, re
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab')
errors=[]; seen=set()
for prefix in 'AB':
  for i in range(1,1001):
    code=f'HL-{prefix}{i:06d}'; seen.add(code)
    m=json.loads((root/'assets/catalog-2000/metadata'/f'{code}.json').read_text(encoding='utf-8'))
    for key in ['hl_code','seed','checkpoint','positive_prompt','negative_prompt','cosplay_archetype','cosplay_parts','hosiery','shoe','prompt_language','image_status','original_prompt','full_body_prompt','hosiery_prompt']:
      if key not in m or m[key] in (None,''): errors.append(f'{code}:missing {key}')
    if m.get('hl_code') != code: errors.append(f'{code}:hl_code mismatch')
    if m.get('image_status') != 'rendered': errors.append(f'{code}:status {m.get("image_status")}')
    if not (root/'public/catalog'/f'{code}.webp').exists(): errors.append(f'{code}:image')
    if not (root/'public/archive/metadata'/f'{code}.json').exists(): errors.append(f'{code}:public metadata')
    if re.search(r'archive|unreviewed|low confidence|generated|unclassified|review', m.get('name',''), re.I): errors.append(f'{code}:generic name {m.get("name")}')
print(json.dumps({'records':len(seen),'errors':len(errors),'sample':errors[:10]},ensure_ascii=False))
raise SystemExit(1 if errors else 0)
