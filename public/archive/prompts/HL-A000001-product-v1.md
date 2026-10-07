# HL-A000001-product-v1

## Positive prompt (vi)
Ảnh chụp iPhone siêu thực theo khung dọc 9:16, ánh sáng hội trường bình thường tại một hội chợ truyện tranh. Một phụ nữ Đông Á trưởng thành rõ ràng 24 tuổi, diện cosplay Sailor Moon dễ nhận ra với cổ áo thủy thủ màu trắng xanh, nơ ngực màu đỏ và găng tay trắng; váy xếp ly xanh trắng, trâm mặt trăng đi kèm đầy đủ, không phải đồ thường ngày. Cô ngồi trên mép bàn, máy ảnh đặt rất thấp gần sàn, một chân duỗi về phía ống kính, giày Mary Jane đen với quai chữ T ở tiền cảnh lớn hơn. Điện thoại thông minh dựng dọc áp sát máy ảnh, che hoàn toàn khuôn mặt từ trán đến cằm; không thấy mắt, lông mày, mũi, miệng hay cằm, chỉ thấy tóc hai bên đầu. tất da đen 15 denier, dệt trơn, siêu trong, ánh mờ tự nhiên, không họa tiết; thể hiện rõ độ trong, sợi dệt và bề mặt của tất. Bối cảnh gian hàng cosplay đông người nhưng không có chữ hay logo; không khỏa thân, không gợi dục, không phong cách hoạt hình, chất ảnh điện thoại chân thực.

## Negative prompt (vi)
áo sơ mi công sở, blazer, váy công sở, trang phục đường phố, thời trang thường ngày, anime, manga, CGI, ngoại hình vị thành niên, trẻ em, khỏa thân, chữ, watermark, minh họa, thiếu ngón tay, bàn chân biến dạng, khuôn mặt lộ ra ngoài điện thoại, người dưới 18 tuổi, trang phục đơn giản, nền trống

## Existing ComfyUI workflow
- Workflow: Z-image siêu nhanh văn bản (NVFP4, tương thích GPU 40 series)
- Model/checkpoint: z_image_turbo_nvfp4.safetensors
- Resolution: 720x1280 base, existing workflow upscale output
- Aspect ratio: 9:16
- Sampler settings: giữ nguyên workflow (Euler / simple / 9 steps / CFG 1 / denoise 1)
- Seed: 24061003
