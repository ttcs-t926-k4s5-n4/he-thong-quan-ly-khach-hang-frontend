# EP-06-CSR103 – Nhắc việc sắp đến hạn và quá hạn

Frontend React + Vite cho tính năng nhắc việc theo dõi công việc kinh doanh. Giao diện tiếng Việt, responsive desktop/tablet/mobile.

## Chức năng

- Trang tổng quan cá nhân với cảnh báo nổi bật cho công việc quá hạn.
- Danh sách nhắc việc quá hạn, đến hạn hôm nay và sắp đến hạn theo mốc đã cấu hình.
- Cấu hình bật/tắt nhắc trong ứng dụng, mốc 7/3/1 ngày trước hạn và nhắc đúng ngày đến hạn.
- Tạo công việc với tên, ngày hạn, người phụ trách, cơ hội, khách hàng, độ ưu tiên, loại việc và mô tả.
- Đánh dấu hoàn thành / mở lại công việc; dữ liệu được lưu trong localStorage.
- Tìm kiếm, lọc theo trạng thái, lọc theo người phụ trách khi mô phỏng trưởng nhóm và sắp xếp.
- Mô phỏng chuyển người dùng để kiểm tra giao diện theo nhân viên hoặc trưởng nhóm.
- Trưởng nhóm có trang tình hình đội nhóm và thống kê số việc quá hạn theo từng nhân viên.

## Yêu cầu

- Node.js 18 trở lên
- npm

## Chạy trong VS Code

```bash
npm install
npm run dev
```

Mở URL localhost mà Vite hiển thị trong terminal (thường là `http://localhost:5173`).

## Kiểm thử và build

```bash
npm test
npm run build
```

Các kiểm thử logic dùng Node.js built-in test runner nên chạy bằng `npm test` mà không cần thư viện test bổ sung.

## Dữ liệu và quyền

Dữ liệu demo và cấu hình nhắc được lưu trên trình duyệt bằng `localStorage`. Bộ chọn người dùng là mô phỏng frontend; đây chưa phải xác thực thật. Trong sản phẩm production, cần đưa lịch nhắc và dữ liệu task lên API/backend, xác thực quyền tại backend và dùng scheduler/notification service để gửi nhắc ổn định kể cả khi người dùng không mở ứng dụng.
