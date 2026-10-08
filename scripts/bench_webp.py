from PIL import Image
from pathlib import Path
import time
p=Path(r"E:\AI\Projects\hosierylab\assets\grok-inbox\images\HL-A000001-product-v1.png")
out=Path(r"E:\AI\Temp\bench.webp")
im=Image.open(p).convert("RGBA")
t=time.time(); im.save(out,"WEBP",quality=88,method=0); print(time.time()-t, out.stat().st_size)
