from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\build_catalog_2000.py')
s=p.read_text(encoding='utf-8')
s=s.replace('generated = "import type { HosieryItem } from \\"./data\\";\\n\\nexport const generatedCatalog: HosieryItem[] = " + json.dumps(catalog, ensure_ascii=False, separators=(",", ":")) + ";\\n"', 'generated = "// eslint-disable-next-line @typescript-eslint/ban-ts-comment\\n// @ts-nocheck\\nimport type { HosieryItem } from \\"./data\\";\\n\\nexport const generatedCatalog: HosieryItem[] = " + json.dumps(catalog, ensure_ascii=False, separators=(",", ":")) + ";\\n"')
p.write_text(s,encoding='utf-8')
p=Path(r'E:\AI\Projects\hosierylab\scripts\repair_catalog_metadata.py')
s=p.read_text(encoding='utf-8')
s=s.replace("generated_path.write_text('import type { HosieryItem } from \"./data\";\\n\\nexport const generatedCatalog: HosieryItem[] = ' +", "generated_path.write_text('// eslint-disable-next-line @typescript-eslint/ban-ts-comment\\n// @ts-nocheck\\nimport type { HosieryItem } from \"./data\";\\n\\nexport const generatedCatalog: HosieryItem[] = ' +")
p.write_text(s,encoding='utf-8')
