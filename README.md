# Web viewer

Viewer vanilla HTML/JavaScript + Three.js cho mô hình ngôi miếu Việt Nam.

## Chạy local

Từ thư mục gốc dự án:

```bash
python3 -m http.server 8000 --directory web
```

Mở `http://localhost:8000/`.

Do viewer dùng ES modules, không mở trực tiếp bằng `file://`. Source dùng
Three.js từ CDN và không cần build step.

## Mô hình Blender

Chạy Blender từ thư mục gốc:

```bash
blender --background --python blender/create_temple.py
```

Lệnh này tạo:

- `blender/vietnamese_temple.blend`
- `web/public/model/temple.glb`

File GLB đã có sẵn. Viewer tải trực tiếp mô hình này và dùng thuộc tính
`part` từ Blender để bật/tắt từng nhóm. Trên macOS có thể gọi Blender bằng
`/Applications/Blender.app/Contents/MacOS/Blender`. Script cũng kết xuất
ảnh phối cảnh vào `blender/phoi-canh.jpg`.

## Điều khiển

- Chuột trái: xoay.
- Cuộn: zoom.
- Chuột phải: pan.
- Panel bên trái: bật/tắt các nhóm nền, kết cấu, mái, cửa và hoa văn.
