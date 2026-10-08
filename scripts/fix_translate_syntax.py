from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
s=p.read_text(encoding='utf-8')
lines=s.splitlines()
lines=[line.split('    parts=[field_en(x,',1)[0].rstrip() if '])    parts=[field_en(x,' in line else line for line in lines]
p.write_text('\n'.join(lines)+'\n',encoding='utf-8')
