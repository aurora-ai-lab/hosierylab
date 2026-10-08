import json,re,collections
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab'); c=collections.Counter()
for pre in 'AB':
 for i in range(1,1001):
  m=json.loads((root/'assets/catalog-2000/metadata'/f'HL-{pre}{i:06d}.json').read_text(encoding='utf-8'))
  for k in ('positive_prompt','full_body_prompt','hosiery_prompt','negative_prompt'):
   for x in re.findall(r"[\wÀ-ỹ]+",m[k],re.UNICODE):
    if re.search(r'[À-ỹ]',x): c[x]+=1
print(c.most_common(120))
