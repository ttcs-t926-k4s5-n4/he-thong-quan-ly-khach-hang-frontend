# EP-07 – Tài liệu đính kèm cơ hội

Frontend demo React + Vite cho chức năng đính kèm tài liệu vào cơ hội kinh doanh.

## Chức năng

- Tải lên nhiều tệp cùng lúc bằng nút chọn tệp hoặc kéo-thả.
- Giới hạn tối đa 20 MB cho từng tệp; tệp quá giới hạn bị từ chối và hiển thị lý do.
- Lưu nội dung tệp trên trình duyệt bằng IndexedDB; metadata lưu tên tệp, dung lượng, loại, người tải lên và thời điểm.
- Tải xuống chỉ khả dụng khi người dùng hiện tại là chủ sở hữu hoặc thuộc danh sách thành viên được chia sẻ của cơ hội.
- Bộ chọn “Người dùng demo” giúp kiểm tra vai trò chủ sở hữu, thành viên được chia sẻ và người không có quyền.
- Hiển thị quyền truy cập theo từng cơ hội, danh sách thành viên, thông tin cơ hội và hoạt động tài liệu gần nhất.
- Tìm kiếm tài liệu theo tên/người tải lên, lọc loại tệp, sắp xếp theo thời gian hoặc tên.
- Chủ sở hữu có thể xóa tài liệu sau khi xác nhận.
- Có dữ liệu mẫu dạng TXT để thử tải xuống ngay lần đầu.

## Chạy trong VS Code

Yêu cầu Node.js 18 trở lên.

```powershell
npm install
npm run dev
```

Vite sẽ in địa chỉ local (mặc định `http://localhost:5173`).

## Kiểm thử logic

```powershell
npm test
```

## Build

```powershell
npm run build
```

## Lưu ý

Đây là frontend demo, chưa kết nối API/backend hay hệ thống đăng nhập thật. Bộ chọn người dùng chỉ mô phỏng danh tính để thử giao diện và logic ở client. Trong hệ thống thật, quyền tải xuống phải được xác thực phía backend; không nên chỉ dựa vào kiểm tra frontend. File được lưu bằng IndexedDB trên trình duyệt hiện tại, không tự đồng bộ giữa nhiều máy/người dùng. Dữ liệu mẫu là các tệp văn bản `.txt`, được gắn nhãn DEMO.
