import subprocess
import sys
from pathlib import Path

PROJECT = Path(r"E:\AI\Projects\hosierylab")
ARCHIVE = Path(r"E:\AI\Temp") / f"hosierylab-{sys.argv[1]}.tar.gz"
KEY = Path(r"C:\Users\Administrator\.ssh\quantus_vast_50481064")
RELEASE = sys.argv[1]


def run(args, cwd=None):
    subprocess.run(args, cwd=cwd, check=True)


run(["npm.cmd", "run", "build"], PROJECT)
run(["tar", "-czf", str(ARCHIVE), "-C", str(PROJECT / "out"), "."])
run(["scp", "-i", str(KEY), "-o", "StrictHostKeyChecking=no", str(ARCHIVE), f"root@209.74.79.244:/tmp/{ARCHIVE.name}"])
remote = (
    f"mkdir -p /opt/hosierylab/releases/{RELEASE}/out && "
    f"tar -xzf /tmp/{ARCHIVE.name} -C /opt/hosierylab/releases/{RELEASE}/out && "
    f"sed -i 's|/opt/hosierylab/releases/[^;]*/out|/opt/hosierylab/releases/{RELEASE}/out|g' /etc/nginx/conf.d/hosierylab.conf && "
    "nginx -t && systemctl reload nginx"
)
run(["ssh", "-i", str(KEY), "-o", "StrictHostKeyChecking=no", "root@209.74.79.244", remote])
print(f"deployed {RELEASE}")
