import json,re,collections
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab')
for prefix in 'AB':
 c=collections.Counter(); samples=[]
 for i in range(1,1001):
  m=json.loads((root/'assets/catalog-2000'/'metadata'/f'HL-{prefix}{i:06d}.json').read_text(encoding='utf-8'))
  p=m['original_prompt']; key=p[:120]
  c[key]+=1
  if len(samples)<8: samples.append((f'HL-{prefix}{i:06d}',p))
 print(prefix,'unique prefixes',len(c));
 for k,v in c.most_common(10): print(v,repr(k))
 for code,p in samples: print(code,p)
