# Kết quả kiểm thử – EP-06-CSR103

## Test logic tự động

Chạy bằng Node.js built-in test runner:

```bash
npm test
```

Kết quả thực thi trong môi trường tạo project: **11/11 test pass**.

1. Tính ngày còn lại/quá hạn theo ngày lịch.
2. Nhận diện quá hạn và loại trừ công việc đã hoàn thành.
3. Nhắc đúng mốc 3 ngày và ngày đến hạn.
4. Phân loại trạng thái nhắc: quá hạn, hôm nay, sắp đến hạn, hoàn thành.
5. Tắt nhắc thì không phát nhắc sắp hạn.
6. Khi tắt nhắc, hạn hôm nay không phát nhắc nhưng việc quá hạn vẫn được phân loại để cảnh báo.
7. Lọc công việc cá nhân theo người phụ trách.
8. Tổng hợp số việc quá hạn theo từng thành viên cho trưởng nhóm.
9. Lọc trạng thái và từ khóa.
10. Sắp xếp theo mức ưu tiên.
11. Kiểm tra dữ liệu biểu mẫu và bật/tắt mốc nhắc.

## Kiểm tra build

Cấu hình Vite và JSX đã được tạo, nhưng `npm run build` cần các dependency Vite/React được cài qua `npm install`. Nếu môi trường không có mạng truy cập npm registry, hãy chạy lệnh này trên máy phát triển có kết nối mạng rồi thử build.

## Phạm vi chưa có backend

- Không gửi email, SMS hoặc push notification ra ngoài trình duyệt.
- Quyền trưởng nhóm/nhân viên là mô phỏng UI; cần kiểm tra quyền thực tế ở backend.
- Dữ liệu demo được lưu cục bộ trên trình duyệt.
