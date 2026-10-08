from pathlib import Path
p=Path(r'E:\AI\Projects\hosierylab\scripts\deploy_site.py')
s=p.read_text(encoding='utf-8').replace('RELEASE = sys.argv[1]\\nPYTHON = Path(r"D:\\\\ComfyUI-V9.5\\\\python\\\\python.exe")','RELEASE = sys.argv[1]\nPYTHON = Path(r"D:\\ComfyUI-V9.5\\python\\python.exe")').replace('], PROJECT)\\nrun(["npm.cmd"', '], PROJECT)\nrun(["npm.cmd"')
p.write_text(s,encoding='utf-8')
