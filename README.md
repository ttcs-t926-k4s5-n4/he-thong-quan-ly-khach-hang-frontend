# CRM Configuration Frontend

Frontend React/Vite mô phỏng màn hình quản trị CRM dựa trên 3 nhóm yêu cầu:

1. **Trường tùy chỉnh**
   - Văn bản, số, ngày, danh sách chọn
   - Bật/tắt bắt buộc
   - Mã trường
   - Hiển thị trong form, bộ lọc và Excel
   - Thêm/xóa trường

2. **Pipeline & xác suất thắng**
   - Khai báo chuỗi giai đoạn
   - Xác suất thắng mặc định cho từng giai đoạn
   - Điều kiện bắt buộc để chuyển giai đoạn
   - Thêm/xóa/chỉnh sửa giai đoạn

3. **Lý do thắng/thua & đối thủ**
   - Danh mục lý do thắng
   - Danh mục lý do thua
   - Danh sách đối thủ
   - Dữ liệu được đánh dấu là bắt buộc khi đóng cơ hội

## Chạy trong VS Code

Yêu cầu Node.js 18+.

```bash
npm install
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal, thường là:

`http://localhost:5173`

Build production:

```bash
npm run build
npm run preview
```

## Ghi chú

- Đây là frontend độc lập, chưa có backend/API.
- Cấu hình được lưu bằng `localStorage`, nên refresh trang vẫn giữ dữ liệu.
- Nút **Xuất cấu hình JSON** tạo file `crm-configuration.json`.
- Khi tích hợp backend, có thể thay các hàm `localStorage` bằng API CRUD.
