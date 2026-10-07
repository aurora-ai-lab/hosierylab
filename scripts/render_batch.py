import json
import re
import sys
import time
import uuid
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

API = "http://127.0.0.1:8188"
ROOT = Path(r"E:\AI\Projects\hosierylab\assets\grok-inbox")
WORKFLOW_PATH = Path(r"D:\ComfyUI-V9.5\user\default\workflows\Z-image超极速文生图（NVFP4 50系显卡专用，40系可兼容运行）.json")
FIXED_NEGATIVE = "áo sơ mi công sở, blazer, váy công sở, trang phục đường phố, thời trang thường ngày, anime, manga, CGI, ngoại hình vị thành niên, trẻ em, khỏa thân, chữ, watermark"

workflow = json.loads(WORKFLOW_PATH.read_text(encoding="utf-8"))
nodes = {str(n["id"]): n for n in workflow["nodes"] if n.get("mode", 0) == 0}
links = {str(link[0]): [str(link[1]), link[2]] for link in workflow["links"]}
keep = {"1", "2", "3", "4", "5", "6", "7", "8", "10", "13", "14"}


def normalize(number):
    code = f"HL-{number:06d}-product-v1"
    metadata_path = ROOT / "metadata" / f"{code}.json"
    prompt_path = ROOT / "prompts" / f"{code}.md"
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    positive = metadata.get("positive_prompt", "").strip()
    positive = positive.replace(
        "Điện thoại trắng che kín mắt và mặt.",
        "Điện thoại dựng dọc áp sát máy ảnh, che hoàn toàn khuôn mặt từ trán đến cằm; không thấy mắt, lông mày, mũi, miệng hay cằm.",
    ).replace(
        "Điện thoại đen che kín mắt và mặt.",
        "Điện thoại dựng dọc áp sát máy ảnh, che hoàn toàn khuôn mặt từ trán đến cằm; không thấy mắt, lông mày, mũi, miệng hay cằm.",
    )
    negative = metadata.get("negative_prompt", "").strip()
    negative = FIXED_NEGATIVE + (", " + negative if negative else "")
    seed = int(metadata.get("seed") or (24061000 + number))
    metadata.update(
        {
            "hl_code": code,
            "seed": seed,
            "checkpoint": "z_image_turbo_nvfp4.safetensors",
            "workflow": WORKFLOW_PATH.name,
            "positive_prompt": positive,
            "negative_prompt": negative,
            "prompt_language": "vi",
            "image_status": "queued",
            "is_synthetic": True,
            "aspect_ratio": "9:16",
            "resolution_base": "720x1280",
            "sampler": "euler",
            "scheduler": "simple",
            "steps": 9,
            "cfg": 1,
            "denoise": 1,
            "cosplay_archetype": metadata.get("cosplay_archetype") or metadata.get("outfit") or "cosplay archive",
            "cosplay_parts": metadata.get("cosplay_parts") or [metadata.get("outfit_vi", "costume detail"), "anime cosplay accessory", "character footwear"],
        }
    )
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    prompt_path.write_text(
        f"# {code}\n\n## Positive prompt (vi)\n{positive}\n\n## Negative prompt (vi)\n{negative}\n\n"
        f"## ComfyUI settings\n- Workflow: {WORKFLOW_PATH.name}\n- Checkpoint: z_image_turbo_nvfp4.safetensors\n"
        "- Resolution: 720x1280 base, existing workflow upscale output\n- Aspect ratio: 9:16\n"
        f"- Sampler: Euler / simple / 9 steps / CFG 1 / denoise 1\n- Seed: {seed}\n",
        encoding="utf-8",
    )
    return metadata


def build_prompt(metadata, number):
    graph = {}
    for node_id in keep:
        node = nodes[node_id]
        inputs = {}
        for input_spec in node.get("inputs", []):
            if input_spec.get("link") is not None:
                source = links[str(input_spec["link"])]
                inputs[input_spec["name"]] = [source[0], source[1]]
        widgets = node.get("widgets_values", [])
        if node["type"] == "UNETLoader":
            inputs.update(unet_name=widgets[0], weight_dtype=widgets[1])
        elif node["type"] == "CLIPLoader":
            inputs.update(clip_name=widgets[0], type=widgets[1], device=widgets[2])
        elif node["type"] == "VAELoader":
            inputs["vae_name"] = widgets[0]
        elif node["type"] == "UpscaleModelLoader":
            inputs["model_name"] = widgets[0]
        elif node["type"] == "EmptyLatentImage":
            inputs.update(width=widgets[0], height=widgets[1], batch_size=widgets[2])
        elif node["type"] == "KSampler":
            inputs.update(
                seed=int(metadata["seed"]),
                steps=widgets[2],
                cfg=widgets[3],
                sampler_name=widgets[4],
                scheduler=widgets[5],
                denoise=widgets[6],
            )
        elif node["type"] == "CLIPTextEncode":
            inputs["text"] = metadata["positive_prompt"]
        elif node["type"] == "SaveImage":
            inputs["filename_prefix"] = f"HL-{number:06d}-product-v1"
        graph[node_id] = {"class_type": node["type"], "inputs": inputs}
    # The saved workflow zeroes the negative conditioning. Add a Vietnamese negative encoder
    # while retaining the workflow's sampler, checkpoint, dimensions, and upscale path.
    graph["16"] = {"class_type": "CLIPTextEncode", "inputs": {"clip": ["2", 0], "text": metadata["negative_prompt"]}}
    graph["4"]["inputs"]["negative"] = ["16", 0]
    return graph


def submit(graph):
    body = json.dumps({"prompt": graph, "client_id": str(uuid.uuid4())}).encode()
    request = urllib.request.Request(API + "/prompt", data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as error:
        return {"error": error.read().decode("utf-8", "replace")}


def history(prompt_id):
    with urllib.request.urlopen(API + "/history/" + prompt_id, timeout=60) as response:
        return json.loads(response.read())


def save_result(number, metadata, prompt_id, record):
    images = record.get("outputs", {}).get("10", {}).get("images", [])
    if not images:
        return False
    image = images[-1]
    query = urllib.parse.urlencode(
        {"filename": image["filename"], "subfolder": image.get("subfolder", ""), "type": image.get("type", "output")}
    )
    data = urllib.request.urlopen(API + "/view?" + query, timeout=180).read()
    target = ROOT / "images" / f"HL-{number:06d}-product-v1.png"
    target.write_bytes(data)
    with Image.open(target) as opened:
        size = opened.size
    if size[0] * 16 != size[1] * 9:
        target.unlink(missing_ok=True)
        return False
    metadata.update(
        {
            "image_status": "rendered",
            "output_path": str(target),
            "rendered_size": list(size),
            "comfyui_prompt_id": prompt_id,
        }
    )
    (ROOT / "metadata" / f"HL-{number:06d}-product-v1.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return True


def wait_for(number, metadata, prompt_id):
    deadline = time.time() + 7200
    while time.time() < deadline:
        time.sleep(3)
        try:
            response = history(prompt_id)
        except Exception:
            continue
        if prompt_id not in response:
            continue
        record = response[prompt_id]
        status = record.get("status", {})
        if status.get("status_str") == "error":
            return False
        if record.get("outputs", {}).get("10", {}).get("images"):
            return save_result(number, metadata, prompt_id, record)
    return False


def render_batch(start, end):
    numbers = list(range(start, end + 1))
    pending = {}
    failures = []
    for number in numbers:
        target = ROOT / "images" / f"HL-{number:06d}-product-v1.png"
        if target.exists():
            continue
        metadata = normalize(number)
        result = submit(build_prompt(metadata, number))
        print(f"HL-{number:06d} submit {result}", flush=True)
        if result.get("prompt_id"):
            pending[number] = (metadata, result["prompt_id"])
        else:
            failures.append(number)
    while pending:
        for number, (metadata, prompt_id) in list(pending.items()):
            if wait_for(number, metadata, prompt_id):
                print(f"HL-{number:06d} rendered seed={metadata['seed']}", flush=True)
                del pending[number]
            else:
                failures.append(number)
                del pending[number]
                print(f"HL-{number:06d} failed seed={metadata['seed']}", flush=True)
    for number in dict.fromkeys(failures):
        metadata = normalize(number)
        seed = int(metadata["seed"]) + 1
        for _ in range(4):
            metadata["seed"] = seed
            (ROOT / "metadata" / f"HL-{number:06d}-product-v1.json").write_text(
                json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
            result = submit(build_prompt(metadata, number))
            print(f"HL-{number:06d} retry seed={seed} submit {result}", flush=True)
            if result.get("prompt_id") and wait_for(number, metadata, result["prompt_id"]):
                print(f"HL-{number:06d} rendered retry seed={seed}", flush=True)
                break
            seed += 1
        else:
            print(f"HL-{number:06d} FAILED after retries", flush=True)
    rendered = [n for n in numbers if (ROOT / "images" / f"HL-{n:06d}-product-v1.png").exists()]
    failed = [n for n in numbers if n not in rendered]
    print(json.dumps({"batch": numbers, "rendered": rendered, "failed": failed}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    start_number, end_number = map(int, sys.argv[1:3])
    if end_number - start_number + 1 > 10:
        raise SystemExit("Each ComfyUI batch may contain at most 10 items.")
    render_batch(start_number, end_number)
