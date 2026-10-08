import json,re
from pathlib import Path
root=Path(r'E:\AI\Projects\hosierylab')

def infer(prompt, shoe):
    outfit=''
    m=re.search(r'(?:Trang phục|Trang phuc):\s*(.*?)(?:Tất:|Tat:|Quần tất:|Hội trường|Hoi truong|Bối cảnh|Boi canh|$)',prompt,re.I|re.S)
    if m: outfit=re.sub(r'\s+',' ',m.group(1)).strip(' .;；')
    low=outfit.lower()
    archetype='Original convention ensemble'
    for terms,name in [
      (('gothic lolita',),'Gothic Lolita'),(('idol',),'Idol-inspired'),(('hakama','đồng bóng'),'Miko-inspired'),(('yukata',),'Yukata-inspired'),(('maid','hầu gái'),'Maid-inspired'),(('cyber',),'Cyberpunk'),(('tartan',),'Academy-inspired'),(('blazer',),'Academy-inspired'),(('ren','lace'),'Lace fantasy'),(('áo choàng','cape'),'Fantasy cape'),
    ]:
      if any(t in low for t in terms): archetype=name; break
    parts=[]
    for piece in re.split(r',|;| và | and ',outfit):
      piece=re.sub(r'\s+',' ',piece).strip(' .')
      if piece and piece not in parts: parts.append(piece)
    if shoe and shoe not in parts: parts.append(shoe)
    while len(parts)<3: parts.append('chi tiết viền trang phục đặc trưng')
    return archetype,parts[:3]
changed=0
for prefix,folder in [('A','grok-inbox'),('B','grok-inbox-v2')]:
  files=sorted((root/'assets'/folder/'metadata').glob('*.json'),key=lambda p:int(re.search(r'(\d{6})',p.name).group(1)))
  for i,src in enumerate(files,1):
    code=f'HL-{prefix}{i:06d}'
    record_path=root/'assets/catalog-2000/metadata'/f'{code}.json'
    public_path=root/'public/archive/metadata'/f'{code}.json'
    record=json.loads(record_path.read_text(encoding='utf-8'))
    srcmeta=json.loads(src.read_text(encoding='utf-8'))
    archetype=srcmeta.get('cosplay_archetype')
    parts=srcmeta.get('cosplay_parts')
    if not archetype or not isinstance(parts,list) or len(parts)<3:
      archetype,parts=infer(srcmeta.get('positive_prompt',''),srcmeta.get('shoe',''))
      changed+=1
    record['cosplay_archetype']=archetype
    record['cosplay_parts']=parts
    record['shoe']=srcmeta.get('shoe',record.get('shoe',''))
    record_path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    public_path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'updated':changed},ensure_ascii=False))
