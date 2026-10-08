from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\translate_catalog_prompts_en.py')
s=p.read_text(encoding='utf-8')
marker='def make_prompt(item, meta):'
helper='''def source_costume(meta):
    source=meta.get("source_prompt_vi") or meta.get("positive_prompt") or ""
    archetype="original convention character ensemble"; parts=[]
    m=re.search(r"diện cosplay\\s+(.+?)\\s+với\\s+(.+?)(?:;\\s*(?:không phải|kèm|đi kèm)|\\.\\s*(?:Cô|cô))",source,re.I|re.S)
    if m:
        archetype=clean(re.sub(r"\\bbản mùa hè.*$","",m.group(1),flags=re.I))
        parts=[clean(x) for x in re.split(r",|;| và ",clean(m.group(2))) if clean(x)]
        tail=source[m.end(1):]
        h=re.search(r";\\s*([^.;]+(?:đi kèm đầy đủ|đi kèm|đặc trưng)[^.;]*)",tail,re.I)
        if h: parts.append(clean(h.group(1)))
    else:
        m=re.search(r"Trang phục:\\s*(.*?)(?:Tất:|Tat:|Quần tất:|Hội trường|Hoi truong|Bối cảnh|Boi canh|$)",source,re.I|re.S)
        if m:
            parts=[clean(x) for x in re.split(r",|;| và ",m.group(1)) if clean(x)]
            archetype=parts[0] if parts else archetype
    return archetype,parts

'''
if 'def source_costume' not in s: s=s.replace(marker,helper+marker)
start=s.index('def make_prompt(item, meta):')
line_end=s.index('\n',s.index('\n',start)+1)
# replace first two body lines after function header
pos=s.index('\n',start)+1
nextpos=s.index('\n',pos)+1
s=s[:pos]+'    source_arch,source_parts=source_costume(meta)\n    archetype=field_en(source_arch,"original convention character ensemble")\n    parts=[field_en(translate_text(x), ["recognizable costume top detail","coordinated lower-garment detail","signature head accessory or gloves"][idx]) for idx,x in enumerate(source_parts)]'+s[nextpos:]
# replace shoe assignment line
s=s.replace("    shoe=field_en(meta.get('shoe_en') or translate_text(meta.get('shoe') or 'black heeled shoes'),'coordinated heeled convention shoes')", "    shoe=field_en(translate_text(meta.get('shoe') or 'black heeled shoes'),'coordinated heeled convention shoes')")
p.write_text(s,encoding='utf-8')
