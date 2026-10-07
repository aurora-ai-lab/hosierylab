# HL-A000134-product-v1

## Positive prompt (vi)
Ảnh iPhone 9:16 siêu thực. Một phụ nữ Đông Á trưởng thành, rõ ràng 24 tuổi, tại hội chợ truyện tranh, dáng người trẻ trưởng thành. Ngồi trên mép bàn, máy ảnh thấp gần sàn, một chân duỗi về phía ống kính, giày loafer xanh navy lớn ở tiền cảnh. Điện thoại bạc che kín mắt và mặt. Trang phục: đồng phục thủy thủ xanh navy, cổ trắng, váy xếp ly ngắn. Tất: tất nude mật ong 12 denier, mỏng, thấy kết cấu dệt và độ trong hợp lý. Hội trường triển lãm phía sau. Trông 24 tuổi, không trẻ hơn. Không chữ, không khỏa thân.

## Negative prompt (vi)
áo sơ mi công sở, blazer, váy công sở, trang phục đường phố, thời trang thường ngày, anime, manga, CGI, ngoại hình vị thành niên, trẻ em, khỏa thân, chữ, watermark, anime, manga, minh họa, CGI, ngoại hình vị thành niên, trẻ em, thiếu niên, khỏa thân, nhiều ngón tay, bàn chân biến dạng, chữ, watermark

## Existing ComfyUI workflow
- Workflow: Z-image siêu nhanh văn bản (NVFP4, tương thích GPU 40 series)
- Model/checkpoint: z_image_turbo_nvfp4.safetensors
- Resolution: 720x1280 base, existing workflow upscale output
- Aspect ratio: 9:16
- Sampler settings: giữ nguyên workflow (Euler / simple / 9 steps / CFG 1 / denoise 1)
- Seed: 24061134
