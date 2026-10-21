# Kết quả kiểm thử – EP-06-CSR104

## Logic tests: 13/13 đạt

Đã chạy thật bằng `npm test` với Node.js built-in test runner:

1. Chuẩn hóa tiếng Việt không dấu và dấu câu.
2. Tìm hoạt động theo từ khóa không dấu.
3. Tự chọn cơ hội đang mở được cập nhật gần nhất, bỏ qua cơ hội đã thắng/thất bại.
4. Tạo nhật ký cuộc gọi, lưu ghi chú và tự gắn cơ hội.
5. Chặn khi chưa chọn khách hàng.
6. Chặn khách hàng không tồn tại.
7. Chặn khi chưa chọn kết quả cuộc gọi.
8. Bắt buộc ngày giờ với kết quả hẹn gọi lại.
9. Từ chối thời gian gọi lại trong quá khứ.
10. Cho phép lưu nếu khách hàng chưa có cơ hội đang mở và vẫn giữ lịch gọi lại hợp lệ.
11. Tổng hợp số lượt gọi, kết nối và lịch gọi lại.
12. Tính mặc định lịch gọi lại vào 09:00 ngày kế tiếp.
13. Định dạng tiền tệ VND.

## Kiểm tra cú pháp

- JSX/JS của `src/App.jsx` và `src/main.jsx` đã qua kiểm tra parser TypeScript JSX.
- `src/lib/callLog.js`, `src/data/demoData.js`, và `tests/callLog.test.js` đã chạy qua Node.js test runner.

## Build Vite

Chưa xác minh production build bằng Vite trong môi trường tạo project vì dependency React/Vite chưa được cài tại đây. Hãy chạy `npm install` và `npm run build` trên máy phát triển; nếu cần `npm test` không phụ thuộc mạng sau khi Node.js đã cài.

## Lưu ý

Nhật ký và khách hàng đang chọn được lưu trong `localStorage`; chưa có backend/API hoặc đồng bộ với CRM thật.

- Bổ sung kiểm thử đơn vị tự động mở rộng cho EP-06 CSR104.
