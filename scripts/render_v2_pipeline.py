import ast
import csv
import hashlib
import json
import re
import subprocess
import sys
import time
import urllib.request
import urllib.parse
import uuid
from pathlib import Path
from zipfile import ZipFile

from PIL import Image

PROJECT = Path(r'E:\AI\Projects\hosierylab')
ZIP_SOURCE = Path(r'C:\Users\Administrator\Downloads\vi_summer_v2.zip')
STAGE = PROJECT / 'assets' / 'grok-inbox-v2'
API = 'http://127.0.0.1:8188'
PYTHON = Path(r'D:\ComfyUI-V9.5\python\python.exe')
WORKFLOW_PATH = Path(r'D:\ComfyUI-V9.5\user\default\workflows\Z-image超极速文生图（NVFP4 50系显卡专用，40系可兼容运行）.json')
SYNC = PROJECT / 'scripts' / 'sync_v2_site.py'
DEPLOY = PROJECT / 'scripts' / 'deploy_site.py'
R2 = PROJECT / 'scripts' / 'upload-r2-v2.mjs'
LOG = Path(r'E:\AI\Temp\hosierylab-v2-pipeline.log')

renderer = PROJECT / 'scripts' / 'render_batch.py'
tree = ast.parse(renderer.read_text(encoding='utf-8-sig'))
tree.body = [node for node in tree.body if not isinstance(node, ast.If)]
builder = {'__name__': 'v2_pipeline_builder'}
exec(compile(tree, str(renderer), 'exec'), builder)

for folder in ('images', 'metadata', 'prompts'):
    (STAGE / folder).mkdir(parents=True, exist_ok=True)

def log(message):
    line = f'[{time.strftime("%Y-%m-%d %H:%M:%S")}] {message}'
    with LOG.open('a', encoding='utf-8') as stream:
        stream.write(line + '\n')
    print(line, flush=True)

def run(command):
    log('RUN ' + ' '.join(map(str, command)))
    result = subprocess.run(command, cwd=PROJECT, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if result.stdout:
        with LOG.open('a', encoding='utf-8') as stream:
            stream.write(result.stdout)
    if result.stderr:
        with LOG.open('a', encoding='utf-8') as stream:
            stream.write(result.stderr)
    if result.returncode:
        raise RuntimeError(f'command failed ({result.returncode}): {command}')

def parse_source():
    entries = []
    seen_seeds = set()
    with ZipFile(ZIP_SOURCE) as archive:
        names = sorted((name for name in archive.namelist() if name.endswith('.md')), key=lambda name: int(re.search(r'HL-A(\d+)', name).group(1)))
        assert len(names) == 1000, len(names)
        for name in names:
            text = archive.read(name).decode('utf-8')
            code = re.search(r'(HL-A\d{6})-product-v2', name).group(1)
            # The ZIP uses CRLF and leaves a blank line between sections; split on
            # the stable headings so either LF or CRLF is accepted.
            positive = text.split('## Positive prompt (vi)', 1)[1].split('## Negative prompt', 1)[0].strip()
            negative = text.split('## Negative prompt (vi)', 1)[1].split('## Existing ComfyUI workflow', 1)[0].strip()
            seed_match = re.search(r'- Seed:\s*(\d+)', text)
            seed = int(seed_match.group(1)) if seed_match else 261007000 + int(code[-6:])
            if seed in seen_seeds:
                seed = 261007000 + int(code[-6:])
            while seed in seen_seeds:
                seed += 1
            seen_seeds.add(seed)
            old_path = PROJECT / 'assets' / 'grok-inbox' / 'metadata' / f'{code}-product-v1.json'
            meta = json.loads(old_path.read_text(encoding='utf-8')) if old_path.exists() else {}
            meta.update({
                'hl_code': code,
                'filename': f'{code}-product-v1',
                'positive_prompt': positive,
                'negative_prompt': negative,
                'prompt_language': 'vi',
                'prompt_sha256': hashlib.sha256(positive.encode()).hexdigest(),
                'source_type': 'user_v2_prompt',
                'source_document': ZIP_SOURCE.name,
                'prompt_version': 'v2',
                'is_synthetic': True,
                'seed': seed,
                'checkpoint': 'z_image_turbo_nvfp4.safetensors',
                'workflow': WORKFLOW_PATH.name,
                'resolution_base': [720, 1280],
                'aspect_ratio': '9:16',
                'sampler': 'euler',
                'scheduler': 'simple',
                'steps': 9,
                'cfg': 1,
                'denoise': 1,
                'image_status': 'not_rendered',
                'qc_status': 'pending',
            })
            entries.append(meta)
    return entries

def persist(meta):
    (STAGE / 'metadata' / f"{meta['filename']}.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (STAGE / 'prompts' / f"{meta['filename']}.md").write_text(
        f"# {meta['filename']}\n\n## Positive prompt (vi)\n{meta['positive_prompt']}\n\n## Negative prompt (vi)\n{meta['negative_prompt']}\n\n## Existing ComfyUI workflow\n- Workflow: {meta['workflow']}\n- Model/checkpoint: {meta['checkpoint']}\n- Resolution: 720x1280 base, existing workflow upscale output\n- Aspect ratio: 9:16\n- Sampler settings: Euler / simple / 9 steps / CFG 1 / denoise 1\n- Seed: {meta['seed']}\n",
        encoding='utf-8')

def submit(meta):
    graph = builder['build_prompt'](meta, 1)
    graph['10']['inputs']['filename_prefix'] = 'grok-inbox-v2/' + meta['filename']
    body = {'prompt': graph, 'client_id': str(uuid.uuid4()), 'extra_data': {'extra_pnginfo': {'hosierylab_metadata': meta}}}
    request = urllib.request.Request(API + '/prompt', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(request, timeout=60) as response:
        result = json.loads(response.read())
    if 'prompt_id' not in result:
        raise RuntimeError(result)
    meta.update(image_status='queued', comfyui_prompt_id=result['prompt_id'])
    persist(meta)
    return result['prompt_id']

def collect(meta, prompt_id):
    with urllib.request.urlopen(API + '/history/' + prompt_id, timeout=30) as response:
        record = json.loads(response.read()).get(prompt_id)
    if not record:
        return None, None
    status = record.get('status', {})
    if status.get('status_str') == 'error':
        return 'error', json.dumps(status, ensure_ascii=False)
    images = record.get('outputs', {}).get('10', {}).get('images', [])
    if not images:
        return None, None
    image = images[-1]
    query = urllib.parse.urlencode({'filename': image['filename'], 'subfolder': image.get('subfolder', ''), 'type': image.get('type', 'output')})
    with urllib.request.urlopen(API + '/view?' + query, timeout=180) as response:
        data = response.read()
    target = STAGE / 'images' / f"{meta['filename']}.png"
    target.write_bytes(data)
    with Image.open(target) as opened:
        opened.verify()
    with Image.open(target) as opened:
        size = list(opened.size)
    if size[0] * 16 != size[1] * 9:
        raise RuntimeError(f'wrong aspect ratio {size}')
    meta.update(image_status='rendered', qc_status='pending', output_path=str(target), rendered_size=size, image_sha256=hashlib.sha256(data).hexdigest())
    persist(meta)
    return 'done', None

def render_batch(batch):
    pending = {}
    for meta in batch:
        target = STAGE / 'images' / f"{meta['filename']}.png"
        existing_meta = STAGE / 'metadata' / f"{meta['filename']}.json"
        if target.exists() and existing_meta.exists():
            loaded = json.loads(existing_meta.read_text(encoding='utf-8'))
            if loaded.get('image_status') == 'rendered':
                meta.update(loaded)
                log(f"SKIP {meta['hl_code']} already rendered")
                continue
        persist(meta)
        pending[meta['filename']] = (meta, submit(meta))
    while pending:
        for filename, (meta, prompt_id) in list(pending.items()):
            state, detail = collect(meta, prompt_id)
            if state == 'done':
                log(f"RENDERED {meta['hl_code']} seed={meta['seed']}")
                del pending[filename]
            elif state == 'error':
                meta['seed'] = int(meta['seed']) + 1
                meta['retry_count'] = int(meta.get('retry_count', 0)) + 1
                log(f"RETRY {meta['hl_code']} seed={meta['seed']} reason={detail}")
                pending[filename] = (meta, submit(meta))
        if pending:
            time.sleep(3)

def sync_and_release(start, end):
    run([str(PYTHON), str(SYNC), str(start), str(end)])
    release = f'20261007-v2-batch-{end:04d}'
    run([str(PYTHON), str(DEPLOY), release])
    run(['node', str(R2), str(start), str(end)])
    log(f'SYNCED website and R2 {start}-{end}')

def main():
    entries = parse_source()
    for meta in entries:
        persist(meta)
    log('Prepared 1000 v2 prompt records')
    for start in range(1, 1001, 10):
        end = min(start + 9, 1000)
        batch = entries[start - 1:end]
        log(f'START render batch {start}-{end}')
        render_batch(batch)
        log(f'COMPLETE render batch {start}-{end}')
        if end % 100 == 0:
            sync_and_release(end - 99, end)
    log('ALL 1000 v2 assets rendered, website synced, R2 synced')

if __name__ == '__main__':
    main()
