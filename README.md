# EP-03 – Frontend React CRM

Frontend demo cho EP-03, dựa trên 3 user story trong ảnh:

1. Nhân viên kinh doanh tìm kiếm & lọc khách hàng theo nhiều điều kiện.
2. Chăm sóc khách hàng ghi nhận yêu cầu hỗ trợ sau bán và cờ rủi ro rời bỏ.
3. Chăm sóc định kỳ danh sách khách chưa tương tác N ngày, ưu tiên theo giá trị hợp đồng.

## Công nghệ
- React 18
- Vite 5
- CSS thuần, không cần thư viện UI ngoài
- Dữ liệu mock trong `src/main.jsx` để chạy độc lập

## Chạy trong VS Code

Mở thư mục `EP-03_CRM_Frontend_React` bằng VS Code rồi mở Terminal:

```bash
npm install
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal (thường là `http://localhost:5173`).

## Chức năng đã làm

### EP-03.1 – Tìm kiếm & lọc
- Tìm theo tên công ty, MST, người liên hệ, SĐT.
- Lọc trạng thái, ngành nghề, quy mô, khu vực, người sở hữu, mức rủi ro.
- Lưu bộ lọc hay dùng.
- Mở nhanh hồ sơ khách hàng.
- Đánh dấu khách có nguy cơ rời bỏ.

### EP-03.2 – Hỗ trợ sau bán
- Tạo ticket hỗ trợ mới.
- Gán mức ưu tiên và trạng thái.
- Hiển thị các case có cờ rủi ro.
- Có luồng nhắc sales phụ trách.

### EP-03.3 – Chăm sóc định kỳ
- Chọn ngưỡng chưa tương tác 3/7/14/30 ngày.
- Sắp xếp danh sách theo giá trị hợp đồng giảm dần.
- Hiển thị ngày đến hạn chăm sóc.
- Đánh dấu đã liên hệ để reset lịch chăm sóc.

## Lưu ý
Đây là frontend prototype, chưa kết nối API/backend. Các thao tác đang cập nhật state ở client để bạn dễ demo Sprint/EP-03.
