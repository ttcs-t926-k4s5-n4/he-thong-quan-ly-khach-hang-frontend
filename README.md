# NovaCRM — Frontend quản lý Lead (React)

Giao diện React tiếng Việt dựa trên mô tả yêu cầu: nhận/từ chối lead có SLA, bộ lọc và bộ lọc đã lưu, cảnh báo lead quá SLA, cùng luồng chuyển đổi lead thành khách hàng và cơ hội bán hàng.

## Yêu cầu

- Node.js 18+ (đề xuất Node.js 20 hoặc mới hơn)
- npm

## Chạy trên VS Code

1. Giải nén thư mục `lead-crm-frontend` và mở thư mục đó trong VS Code.
2. Mở Terminal tại thư mục dự án.
3. Chạy:

   ```bash
   npm install
   npm run dev
   ```

4. Mở địa chỉ Local do Vite in ra trong terminal (thường là `http://localhost:5173`).

## Chạy kiểm thử

```bash
npm test
npm run build
```

Các test bao phủ:

- Quy tắc tính lead quá SLA và gỡ cờ sau khi ghi nhận liên hệ.
- Nhận lead → trạng thái `Đang chăm sóc`.
- Từ chối lead bắt buộc có lý do → quay về `Chờ phân bổ`.
- Đánh dấu đủ điều kiện, tạo khách hàng, người liên hệ và cơ hội trong cùng luồng chuyển đổi.
- Giữ nguyên lịch sử hoạt động, ngăn chuyển đổi trùng.
- Lọc lead và lưu/áp dụng lại bộ lọc.
- Kiểm tra luồng giao diện qua các thao tác chính.

## Tính năng đã dựng

- Danh sách lead, tìm kiếm, lọc theo trạng thái/nguồn/phân loại/người phụ trách/ngày tạo.
- Bộ lọc lưu sẵn và tự lưu trên trình duyệt thông qua `localStorage`.
- Cờ đỏ cho lead quá SLA khi chưa có lần liên hệ đầu tiên; khu vực cảnh báo trưởng nhóm.
- Nhận lead, từ chối bắt buộc nhập lý do, ghi nhận liên hệ đầu tiên.
- Đánh dấu lead đủ điều kiện và chuyển đổi đồng thời thành khách hàng + cơ hội.
- Sau chuyển đổi, lead có trạng thái khóa; lịch sử hoạt động được sao lưu sang khách hàng mới và vẫn hiển thị trên lead.
- Trang danh sách khách hàng, người liên hệ, cơ hội, tổng quan và báo cáo cơ bản.
- Xuất danh sách lead đang lọc ra CSV.
- Giao diện responsive cho máy tính bảng và điện thoại.

## Lưu ý

Đây là bản frontend demo. Dữ liệu mẫu và trạng thái được lưu cục bộ trong trình duyệt; nút cảnh báo trưởng nhóm ghi nhận thao tác mô phỏng, chưa gửi thông báo qua email/Slack hoặc backend thực. Tạo lead mới, thiết lập và đồng bộ nhiều người dùng cần API/backend để hoạt động đầy đủ trong môi trường thật.
