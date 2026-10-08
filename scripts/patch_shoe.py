from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
s=p.read_text(encoding='utf-8')
helper='''def source_shoe(meta):
    source=meta.get("source_prompt_vi") or ""
    m=re.search(r"((?:giày|xăng-đan|sandal|boot|guốc)[^,.]+?)(?:\\s+ở tiền cảnh|,|\\.)",source,re.I)
    return clean(m.group(1)) if m else clean(meta.get("shoe") or "black heeled shoes")

'''
if 'def source_shoe' not in s: s=s.replace('def make_prompt(item, meta):',helper+'def make_prompt(item, meta):')
s=s.replace("shoe=field_en(translate_text(meta.get('shoe') or 'black heeled shoes'),'coordinated heeled convention shoes')", "shoe=field_en(translate_text(source_shoe(meta)),'coordinated heeled convention shoes')")
p.write_text(s,encoding='utf-8')
