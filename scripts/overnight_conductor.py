import subprocess
import sys
from pathlib import Path

PROJECT = Path(r"E:\AI\Projects\hosierylab")
PYTHON = Path(r"D:\ComfyUI-V9.5\python\python.exe")
RENDER = PROJECT / "scripts" / "render_batch.py"
SYNC = PROJECT / "scripts" / "sync_site.py"
DEPLOY = PROJECT / "scripts" / "deploy_site.py"
R2_UPLOAD = PROJECT / "scripts" / "upload-r2.mjs"
LOG = Path(r"E:\AI\Temp\hosierylab-overnight.log")


def log(message):
    with LOG.open("a", encoding="utf-8") as stream:
        stream.write(message + "\n")
    print(message, flush=True)


def run(command):
    result = subprocess.run(command, cwd=PROJECT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    with LOG.open("a", encoding="utf-8") as stream:
        stream.write(result.stdout)
        stream.write(result.stderr)
    if result.returncode:
        raise RuntimeError(f"command failed: {' '.join(map(str, command))}")


def main():
    for start in range(201, 1001, 10):
        end = min(start + 9, 1000)
        log(f"START batch {start}-{end}")
        run([str(PYTHON), str(RENDER), str(start), str(end)])
        completed = end - 200
        if completed % 100 == 0:
            log(f"SYNC website after {completed} new renders")
            run([str(PYTHON), str(SYNC)])
            release = f"20261006-batch-{completed:04d}"
            run([str(PYTHON), str(DEPLOY), release])
            log(f"SYNC complete {release}")
            run(["node", str(R2_UPLOAD)])
            log("R2 sync complete")
    log("ALL remaining renders complete")


if __name__ == "__main__":
    main()
