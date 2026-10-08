from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
s=p.read_text(encoding='utf-8')
s=s.replace("('sandal','sandals'),", "('sandal','sandals'),('sandalss','sandals'),")
p.write_text(s,encoding='utf-8')
