# EP-06-CSR104 – Ghi nhanh kết quả cuộc gọi

Frontend React + Vite dành cho nhân viên kinh doanh ghi lại kết quả cuộc gọi ngay trên điện thoại. Thiết kế mobile-first, có sẵn dữ liệu demo và chạy độc lập trong VS Code.

## Chức năng

- Chọn khách hàng từ danh sách; hiển thị công ty và số điện thoại.
- Biểu mẫu gọn: Đã trao đổi, Không nghe máy, Máy bận, Hẹn gọi lại, Đã đặt lịch hẹn, Chưa có nhu cầu.
- Nhập ghi chú ngắn tối đa 280 ký tự.
- Bật lịch gọi lại và chọn ngày/giờ. Khi chọn kết quả “Hẹn gọi lại”, khu vực lịch được bật sẵn với thời gian mặc định ngày kế tiếp lúc 09:00.
- Kiểm tra dữ liệu bắt buộc và không cho tạo lịch gọi lại trong quá khứ.
- Tự động gắn cuộc gọi vào cơ hội đang mở có thời điểm cập nhật gần nhất của khách hàng; nếu chưa có cơ hội đang mở, lưu cuộc gọi vào hồ sơ khách hàng.
- Thống kê cuộc gọi hôm nay, kết nối và lịch gọi lại.
- Tìm kiếm hoạt động không phân biệt dấu tiếng Việt; lọc theo tất cả, có lịch gọi lại hoặc đã gắn cơ hội.
- Lưu nhật ký và khách hàng đang chọn trong `localStorage`.
- Giao diện responsive, có tab chuyển nhanh giữa biểu mẫu và lịch sử trên màn hình điện thoại.

## Yêu cầu

- Node.js 18 trở lên
- npm

## Chạy trong VS Code

```bash
npm install
npm run dev
```

Mở URL localhost được hiển thị trong terminal, thông thường là `http://localhost:5173`.

## Kiểm thử và build

```bash
npm test
npm run build
```

Các kiểm thử logic sử dụng `node:test` tích hợp sẵn nên không cần cài thư viện test riêng.

## Ghi chú về dữ liệu

Đây là frontend demo. Cuộc gọi được lưu cục bộ trong trình duyệt và không đồng bộ giữa thiết bị. Danh sách khách hàng/cơ hội là dữ liệu mẫu; khi tích hợp vào CRM, hãy lấy dữ liệu từ API và xử lý quyền/lưu nhật ký ở backend.

<!-- Architecture: Modal -> Form -> Validation -> Storage Sync -> Event Notification -->


### Tiện ích mở rộng
- sortCallLogs(logs, key, asc): Sắp xếp cuộc gọi đa tiêu chí.
- sanitizeText(str): Chuẩn hóa và làm sạch chuỗi văn bản.


### Chính sách lưu trữ dữ liệu
- Dự phòng an toàn khi localStorage bị khoá hoặc đầy dung lượng.


- `exportLogsToCsv`: Hỗ trợ trích xuất lịch sử cuộc gọi.
