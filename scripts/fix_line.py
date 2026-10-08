from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
lines=p.read_text(encoding='utf-8').splitlines()
lines[65]='    parts=[field_en(translate_text(x), ["recognizable costume top detail", "coordinated lower-garment detail", "signature head accessory or gloves"][idx]) for idx, x in enumerate(source_parts)]'
p.write_text('\n'.join(lines)+'\n',encoding='utf-8')
