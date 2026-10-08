import json,re
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab')
errors=[]; vi=[]
for pre in 'AB':
 for i in range(1,1001):
  code=f'HL-{pre}{i:06d}'; m=json.loads((root/'assets/catalog-2000/metadata'/f'{code}.json').read_text(encoding='utf-8'))
  for k in ('positive_prompt','original_prompt','full_body_prompt','hosiery_prompt','negative_prompt'):
   v=m.get(k,'')
   if not v: errors.append(f'{code}:{k}:missing')
   if re.search(r'[\u00c0-\u024f\u1ea0-\u1eff]',v): vi.append((code,k,v))
  if m.get('prompt_language')!='en': errors.append(f'{code}:language')
  for k in ('seed','checkpoint','cosplay_archetype','cosplay_parts','hosiery','shoe','image_status'):
   if not m.get(k): errors.append(f'{code}:{k}:missing')
  if m.get('image_status')!='rendered': errors.append(f'{code}:status')
print(json.dumps({'records':2000,'errors':len(errors),'non_english_prompt_fields':len(vi),'sample_errors':errors[:5],'sample_non_english':vi[:2]},ensure_ascii=False))
raise SystemExit(1 if errors or vi else 0)
