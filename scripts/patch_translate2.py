from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
s=p.read_text(encoding='utf-8')
s=s.replace("('quần tất','pantyhose'),", "('quai chữ T','T-strap'),('cổ áo thủy thủ','sailor collar'),('nơ ngực','chest bow'),('màu khói','smoky gray'),('quần tất','pantyhose'),")
s=s.replace('re.sub(r"\\bbản mùa hè.*$","",m.group(1),flags=re.I)', 're.sub(r"\\b(?:bản mùa hè|dễ nhận ra|mùa hè).*$","",m.group(1),flags=re.I)')
p.write_text(s,encoding='utf-8')
