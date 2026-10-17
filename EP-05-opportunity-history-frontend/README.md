# Northstar CRM — Lịch sử thay đổi cơ hội

Frontend React + Vite để theo dõi lịch sử cập nhật cơ hội kinh doanh. Giao diện tiếng Việt, responsive và có dữ liệu demo.

## Chức năng

- Theo dõi thay đổi theo từng trường: **giai đoạn**, **giá trị**, **ngày chốt dự kiến**, **người sở hữu**.
- Khi cập nhật cơ hội, hệ thống tạo **một dòng lịch sử riêng cho mỗi trường thay đổi**; mỗi dòng có giá trị trước/sau, người thực hiện, thời điểm và ghi chú.
- Tạo cơ hội mới; các trường khởi tạo cũng được ghi vào lịch sử.
- Tìm kiếm theo tên cơ hội, công ty, người thực hiện, ghi chú hoặc giá trị.
- Lọc theo trường dữ liệu, cơ hội, người thực hiện và khoảng thời gian.
- Mở rộng từng dòng để xem thông tin và ghi chú chi tiết.
- Xuất kết quả đang lọc ra CSV, định dạng UTF-8 BOM để mở tốt bằng Excel.
- Tự động lưu cơ hội và lịch sử vào `localStorage` trên trình duyệt hiện tại.
- Thiết kế responsive cho desktop, tablet và điện thoại.

## Chạy trong VS Code

Yêu cầu Node.js 18+. `@vitejs/plugin-react` đã được ghim ở nhánh 4.x để tương thích với Vite 6; tránh dùng `latest` cho plugin vì các bản mới có thể yêu cầu Vite major mới hơn.

```bash
npm install
```

Chỉ chạy lệnh tiếp theo sau khi `npm install` hoàn tất thành công:

```bash
npm run dev
```

Mở URL Vite in ra terminal (thường là `http://localhost:5173`).

## Kiểm thử

```bash
npm test
npm run test:smoke
npm run build
```

## Cấu trúc

```text
src/
  data/seed.js             # Dữ liệu demo và danh sách trường
  utils/history.js         # Tạo log, lọc, định dạng và xuất CSV
  utils/history.test.js    # Kiểm thử logic lịch sử
  components/              # Có thể bổ sung component tái sử dụng tại đây
  App.jsx                  # Giao diện và luồng chức năng chính
  App.test.jsx              # Kiểm thử các luồng giao diện quan trọng
  styles.css               # Thiết kế responsive
  main.jsx                 # Điểm khởi chạy React
```

## Ghi chú dữ liệu

Đây là frontend demo, chưa kết nối API/backend. Dữ liệu lưu trong trình duyệt đang sử dụng; xóa dữ liệu website hoặc dùng trình duyệt khác sẽ không giữ dữ liệu này. Khi tích hợp hệ thống thật, hãy thay lớp `localStorage` bằng API có xác thực và lưu lịch sử phía server.
