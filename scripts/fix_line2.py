from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
s=p.read_text(encoding='utf-8')
s=s.replace('["recognizable costume top detail", "coordinated lower-garment detail", "signature head accessory or gloves"][idx]) for idx, x in enumerate(source_parts)', '["recognizable costume top detail", "coordinated lower-garment detail", "signature head accessory or gloves"][min(idx,2)]) for idx, x in enumerate(source_parts)')
p.write_text(s,encoding='utf-8')
