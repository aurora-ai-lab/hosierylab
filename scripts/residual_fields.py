import json,re,collections
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab'); c=collections.Counter()
for pre in 'AB':
 for i in range(1,1001):
  m=json.loads((root/'assets/catalog-2000/metadata'/f'HL-{pre}{i:06d}.json').read_text(encoding='utf-8'))
  for k in ('cosplay_archetype_en','shoe_en'):
   if re.search(r'[À-ỹ]',m.get(k,'')): c[(k,m[k])]+=1
  for n,x in enumerate(m.get('cosplay_parts_en',[])):
   if re.search(r'[À-ỹ]',x): c[(f'part{n}',x)]+=1
for (k,v),n in c.most_common(120): print(n,k,repr(v))
