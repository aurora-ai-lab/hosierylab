import json,re
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab')
for prefix,folder in [('A','grok-inbox'),('B','grok-inbox-v2')]:
  miss=[]; examples=[]
  for i in range(1,1001):
    code=f'HL-{prefix}{i:06d}'
    m=json.loads((root/'assets'/folder/'metadata'/f'{code}-product-v1.json').read_text(encoding='utf-8'))
    if not m.get('cosplay_archetype') or not m.get('cosplay_parts'):
      miss.append(code)
      if len(examples)<10: examples.append((code,m.get('positive_prompt','')[:420]))
  print(prefix,len(miss)); print(*examples,sep='\n')
