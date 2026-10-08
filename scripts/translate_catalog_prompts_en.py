from __future__ import annotations
import json,re
from pathlib import Path

ROOT=Path(r'E:\AI\Projects\hosierylab')
META_DIR=ROOT/'assets/catalog-2000/metadata'
PUB_META=ROOT/'public/archive/metadata'
PROMPTS=ROOT/'assets/catalog-2000/prompts'
PUB_PROMPTS=ROOT/'public/archive/prompts'

def read_catalog():
    p=ROOT/'src/lib/generatedCatalog.ts'; t=p.read_text(encoding='utf-8'); return json.loads(t.split(' = ',1)[1].rsplit(';',1)[0].strip())

def clean(s): return re.sub(r'\s+',' ',str(s or '')).strip(' .;；,，')

def translate_text(s):
    s=clean(s)
    replacements=[
      ('quai chữ T','T-strap'),('cổ áo thủy thủ','sailor collar'),('nơ ngực','chest bow'),('màu khói','smoky gray'),('quần tất','pantyhose'),('tất đùi','thigh-high stockings'),('tất kiểu dây treo','suspender tights'),('tất lưới','fishnet hosiery'),('tất','hosiery'),('denier','denier'),('siêu trong','ultra-sheer'),('siêu mỏng','ultra-sheer'),('mỏng nhẹ','lightweight'),('mỏng','sheer'),('bán đục','semi-opaque'),('đục','opaque'),('ánh mờ tự nhiên','natural matte finish'),('bề mặt mờ','matte surface'),('ánh satin','satin sheen'),('dệt trơn','plain knit'),('dệt gân dọc','vertical rib knit'),('dệt gân','rib knit'),('đường may sau','back seam'),('gót cuban','Cuban heel'),('chấm bi nhỏ','small polka dots'),('lưới mắt nhỏ','fine mesh'),('mắt lưới đều và mảnh','fine even mesh'),('đai nịt tất','garter belt'),('dây treo','garter straps'),('kẹp kim loại','metal clips'),('ren hoa','floral lace'),('viền ren','lace trim'),('rách','distressed'),('thấy kết cấu dệt và độ trong hợp lý','showing knit fibers and realistic transparency'),('thể hiện rõ độ trong, sợi dệt và bề mặt của tất','clearly showing transparency, knit fibers and hosiery surface'),
      ('trắng','white'),('đen','black'),('đỏ rượu vang','burgundy'),('đỏ','red'),('xám khói','smoky gray'),('xám than','charcoal gray'),('xám nhạt','light gray'),('xám','gray'),('nâu nhạt','light brown'),('nâu','brown'),('xanh navy','navy blue'),('xanh đậm','deep blue'),('xanh lá','green'),('xanh bạc hà','mint green'),('xanh','blue'),('vàng nhạt','pale yellow'),('vàng','gold'),('hồng','pink'),('tím','purple'),('kem','cream'),('bạc','silver'),('be','beige'),('than','charcoal'),('nude mật ong','honey nude'),('nude','nude'),
      ('áo không tay','sleeveless top'),('áo yếm','halter top'),('áo ren','lace top'),('áo khoác','jacket'),('áo choàng','cape'),('áo sơ mi','shirt'),('áo blouse','blouse'),('áo','top'),('váy xếp ly','pleated skirt'),('váy ngắn loe','short flared skirt'),('váy ngắn','short skirt'),('váy quấn','wrap dress'),('váy','dress'),('quần short','shorts'),('tay áo phồng','puff sleeves'),('găng tay hở ngón','fingerless gloves'),('găng tay','gloves'),('mũ nồi','beret'),('mũ cói','straw hat'),('nơ tóc','hair bow'),('nơ','bow'),('trâm lông vũ','feather hairpin'),('trâm cài','hairpin'),('kẹp tóc','hair clip'),('phụ kiện đầu','head accessory'),('kính bảo hộ','goggles'),('ren','lace'),('voan chiffon','chiffon'),('voan','sheer chiffon'),('lụa','silk'),('cotton','cotton'),('vải lanh','linen'),('phong cách','style'),('mùa hè','summer'),('đi kèm đầy đủ','complete signature accessories'),('dễ nhận ra','recognizable'),
      ('giày cao gót','high heels'),('giày Mary Jane','Mary Jane shoes'),('giày búp bê','doll shoes'),('giày loafer','loafers'),('giày slingback','slingback shoes'),('xăng-đan','sandals'),('sandal','sandals'),('sandalss','sandals'),('boot','boots'),('gót nhọn','pointed heel'),('gót thấp','low heel'),('đế dày','platform sole'),('quai ngang','ankle strap'),('quai mảnh','thin straps'),('mũi hở','open toe'),('gót vừa','medium heel'),('đế cao','raised sole'),
      ('với','with'),('màu','colored'),('dài','length'),('ngắn','short'),('trên gối','above the knee'),('đến bắp chân','mid-calf length'),('ngang gối','knee length'),('cài sát chân tóc','worn at the hairline'),('cài lệch một bên','worn to one side'),('lộ nhẹ dưới gấu váy','slightly visible below the hem'),('cùng màu','matching'),('đặc trưng','signature'),
    ]
    for a,b in replacements: s=s.replace(a,b)
    # Strip remaining Vietnamese punctuation/labels while keeping useful translated words.
    s=re.sub(r'\b(?:Tất|Trang phục|Phụ kiện đầu|Hội trường|Bối cảnh|Trông|Không)\s*:?', '', s, flags=re.I)
    return clean(s)

def field_en(value, fallback):
    value=clean(value)
    if re.search(r"[À-ỹ]", value):
        m=re.search(r"(?:cosplay\s+)?([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*(?:\s*\([^)]*\))?)", value)
        if m and any(ch.isupper() for ch in m.group(1)):
            return f"{m.group(1)} signature costume detail"
        return fallback
    return value
def color_en(value):
    return {'纯黑':'black','纯白':'white','酒红':'burgundy','炭灰':'charcoal gray','咖啡棕':'coffee brown','蜜裸':'honey nude','自然肤色':'natural skin tone','海军蓝':'navy blue','红色':'red','灰色':'gray','白色':'white'}.get(value,translate_text(value))

def feature_en(f):
    return {'波点':'small polka dots','后缝线':'a centered back seam','罗纹':'rib-knit texture','缎光':'satin sheen','蕾丝':'lace trim','破洞':'distressed openings','网眼':'fine mesh structure','吊带':'matching garter straps and clips','不透':'opaque coverage','薄透':'ultra-sheer transparency'}.get(f,translate_text(f))

def garment_en(g): return {'连裤袜':'pantyhose','大腿袜':'thigh-high stockings','吊带袜':'suspender stockings','网袜':'fishnet hosiery'}.get(g,translate_text(g))

def source_costume(meta):
    source=meta.get("source_prompt_vi") or meta.get("positive_prompt") or ""
    archetype="original convention character ensemble"; parts=[]
    m=re.search(r"diện cosplay\s+(.+?)\s+với\s+(.+?)(?:;\s*(?:không phải|kèm|đi kèm)|\.\s*(?:Cô|cô))",source,re.I|re.S)
    if m:
        archetype=clean(re.sub(r"\b(?:bản mùa hè|dễ nhận ra|mùa hè).*$","",m.group(1),flags=re.I))
        parts=[clean(x) for x in re.split(r",|;| và ",clean(m.group(2))) if clean(x)]
        tail=source[m.end(1):]
        h=re.search(r";\s*([^.;]+(?:đi kèm đầy đủ|đi kèm|đặc trưng)[^.;]*)",tail,re.I)
        if h: parts.append(clean(h.group(1)))
    else:
        m=re.search(r"Trang phục:\s*(.*?)(?:Tất:|Tat:|Quần tất:|Hội trường|Hoi truong|Bối cảnh|Boi canh|$)",source,re.I|re.S)
        if m:
            parts=[clean(x) for x in re.split(r",|;| và ",m.group(1)) if clean(x)]
            archetype=parts[0] if parts else archetype
    return archetype,parts

def source_shoe(meta):
    source=meta.get("source_prompt_vi") or ""
    m=re.search(r"((?:giày|xăng-đan|sandal|boot|guốc)[^,.]+?)(?:\s+ở tiền cảnh|,|\.)",source,re.I)
    return clean(m.group(1)) if m else clean(meta.get("shoe") or "black heeled shoes")

def make_prompt(item, meta):
    source_arch,source_parts=source_costume(meta)
    archetype=field_en(source_arch,"original convention character ensemble")
    parts=[field_en(translate_text(x), ["recognizable costume top detail", "coordinated lower-garment detail", "signature head accessory or gloves"][min(idx,2)]) for idx, x in enumerate(source_parts)]
    while len(parts)<3: parts.append('signature costume detailing')
    parts=parts[:3]
    shoe=field_en(translate_text(source_shoe(meta)),'coordinated heeled convention shoes')
    denier=item.get('denier'); d=f'{denier} denier' if denier is not None else 'open-structure'
    color=color_en(item.get('colorLabel',''))
    garment=garment_en(item.get('garmentType',''))
    features=[feature_en(x) for x in item.get('visualEffect',[]) if x not in ('Surface study',)]
    if not features: features=['plain knit']
    hosiery=f'{color} {d} {garment}, '+', '.join(features)+', realistic transparency, visible knit fibers and surface texture'
    body=(f'Ultra-realistic iPhone photograph, vertical 9:16, ordinary venue lighting at a busy comic convention. '
          f'A clearly adult 24-year-old East Asian woman wears a recognizable {archetype} summer cosplay with '
          f'{parts[0]}, {parts[1]}, and {parts[2]}; this is a costume, not everyday clothing. '
          f'She sits on the edge of a table, the camera is very low near the floor, one leg extended toward the lens, '
          f'{shoe} larger in the foreground. A vertically held smartphone pressed close to the camera completely covers '
          f'her face from forehead to chin; no eyes, eyebrows, nose, mouth or chin are visible, only hair at both sides.')
    tail=(' Busy convention booth background with no text or logos; no nudity, no erotic framing, no cartoon or CGI style, '
          'realistic phone photography.')
    original=f'{body} Hosiery: {hosiery}.{tail}'
    negative=('office shirt, blazer, office skirt, streetwear, casual everyday fashion, anime, manga, CGI, youthful or minor appearance, '
              'child, nudity, text, watermark, illustration, deformed hands, malformed feet, visible face outside the phone, '
              'person under 18, simple costume, empty background')
    return original,body,hosiery,negative,archetype,parts,shoe

catalog=read_catalog(); by={x['code']:x for x in catalog}; changed=0
for prefix in 'AB':
  for i in range(1,1001):
    code=f'HL-{prefix}{i:06d}'; item=by[code]
    p=META_DIR/f'{code}.json'; meta=json.loads(p.read_text(encoding='utf-8'))
    old_positive=meta.get('positive_prompt') or meta.get('original_prompt','')
    old_negative=meta.get('negative_prompt','')
    if 'source_prompt_vi' not in meta: meta['source_prompt_vi']=old_positive
    if 'source_negative_prompt_vi' not in meta: meta['source_negative_prompt_vi']=old_negative
    original,body,hosiery,negative,arch,parts,shoe=make_prompt(item,meta)
    meta.update({'original_prompt':original,'positive_prompt':original,'full_body_prompt':body,'hosiery_prompt':hosiery,'negative_prompt':negative,'prompt_language':'en','prompt_language_source':'vi','cosplay_archetype':arch,'cosplay_parts_en':parts,'shoe_en':shoe,'hosiery':hosiery,'shoe':shoe,'translation_version':'en-v1'})
    p.write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); (PUB_META/f'{code}.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (PROMPTS/'original'/f'{code}.md').write_text(original+'\n',encoding='utf-8'); (PROMPTS/'full-body'/f'{code}.md').write_text(body+'\n',encoding='utf-8'); (PROMPTS/'hosiery'/f'{code}.md').write_text(hosiery+'\n',encoding='utf-8')
    (PUB_PROMPTS/f'{code}-original.md').write_text(original+'\n',encoding='utf-8'); (PUB_PROMPTS/f'{code}-full-body.md').write_text(body+'\n',encoding='utf-8'); (PUB_PROMPTS/f'{code}-hosiery.md').write_text(hosiery+'\n',encoding='utf-8')
    item['assetHosiery']=hosiery; item['assetShoe']=shoe; item['visualNotes']=hosiery
    changed+=1
out='// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck\nimport type { HosieryItem } from "./data";\n\nexport const generatedCatalog: HosieryItem[] = '+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+';\n'
(ROOT/'src/lib/generatedCatalog.ts').write_text(out,encoding='utf-8')
print(json.dumps({'translated':changed,'prompt_language':'en'},ensure_ascii=False))


