import argparse
import json
from pathlib import Path
from PIL import Image

PROJECT = Path(r'E:\AI\Projects\hosierylab')
STAGE = PROJECT / 'assets' / 'grok-inbox-v2'
PUBLIC_CATALOG = PROJECT / 'public' / 'catalog'
PUBLIC_ARCHIVE = PROJECT / 'public' / 'archive'

parser = argparse.ArgumentParser()
parser.add_argument('start', type=int)
parser.add_argument('end', type=int)
args = parser.parse_args()

PUBLIC_CATALOG.mkdir(parents=True, exist_ok=True)
(PUBLIC_ARCHIVE / 'metadata').mkdir(parents=True, exist_ok=True)
(PUBLIC_ARCHIVE / 'prompts').mkdir(parents=True, exist_ok=True)

copied = []
for n in range(args.start, args.end + 1):
    code = f'HL-A{n:06d}'
    stem = f'{code}-product-v1'
    image = STAGE / 'images' / f'{stem}.png'
    metadata = STAGE / 'metadata' / f'{stem}.json'
    prompt = STAGE / 'prompts' / f'{stem}.md'
    if not image.exists() or not metadata.exists() or not prompt.exists():
        raise FileNotFoundError(f'incomplete staged asset: {stem}')
    with Image.open(image) as source:
        source.convert('RGB').resize((900, 1600), Image.Resampling.LANCZOS).save(
            PUBLIC_CATALOG / f'{code}.webp', 'WEBP', quality=80, method=6
        )
    (PUBLIC_ARCHIVE / 'metadata' / metadata.name).write_bytes(metadata.read_bytes())
    (PUBLIC_ARCHIVE / 'prompts' / prompt.name).write_bytes(prompt.read_bytes())
    copied.append(code)

print(json.dumps({'site_assets_synced': len(copied), 'first': copied[0], 'last': copied[-1]}, ensure_ascii=False))
