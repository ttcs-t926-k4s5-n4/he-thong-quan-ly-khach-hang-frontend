# EP-06 — Chia sẻ cơ hội kinh doanh (Frontend)

Frontend demo dùng **React 18 + Vite 6**, giao diện tiếng Việt, dữ liệu mẫu và lưu trạng thái vào `localStorage`. Không cần backend để thử luồng UI.

## Chạy bằng VS Code

Yêu cầu Node.js 18 trở lên.

```powershell
npm install
npm run dev
```

Mở URL Vite in ra trong Terminal (thường là `http://localhost:5173`).

## Chạy kiểm thử

```powershell
npm test
```

Các bài test chạy bằng Node.js `node:test`, không cần thư viện test bổ sung. Để tạo bản production:

```powershell
npm run build
npm run preview
```

## Chức năng có trong demo

- Danh sách cơ hội mẫu, tổng quan pipeline và trang chi tiết cơ hội được chọn.
- Người sở hữu chính được hiển thị riêng, có nhãn `CHỦ SỞ HỮU`.
- Chủ sở hữu có thể thêm nhiều thành viên chia sẻ và gỡ thành viên; hệ thống bỏ qua thành viên trùng lặp và không cho thêm chủ sở hữu như một member.
- Thành viên chia sẻ có thể ghi hoạt động dạng cuộc gọi, cuộc họp, email, ghi chú hoặc công việc. Mỗi hoạt động được lưu kèm người ghi, thời điểm và nhật ký.
- Thành viên chia sẻ không thể quản lý thành viên hay chuyển quyền sở hữu. Có hộp chọn `Mô phỏng người dùng` ở góc dưới bên phải để thử quyền với nhiều vai trò.
- Chỉ chủ sở hữu hiện tại mới được chuyển quyền sở hữu. Lý do chuyển quyền là bắt buộc; nhật ký ghi người thực hiện, chủ cũ, chủ mới, thời gian và lý do. Chủ cũ được giữ lại thành thành viên chia sẻ để tiếp tục theo dõi.
- Xem timeline hoạt động và nhật ký thay đổi; dữ liệu cơ hội được lưu tự động trên cùng trình duyệt.
- Có nút `Đặt lại demo` để khôi phục dữ liệu ban đầu.

## Cấu trúc chính

```text
EP-06-opportunity-sharing-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── data/seed.js
    └── utils/
        ├── shareLogic.js
        └── shareLogic.test.js
```

## Lưu ý

Đây là bản frontend minh họa, chưa tích hợp API, đăng nhập thật hay kiểm soát quyền ở phía server. Danh sách người dùng và cơ hội chỉ là dữ liệu mẫu; `Mô phỏng người dùng` phục vụ thử luồng quyền giao diện. Ứng dụng sản phẩm thật cần xác thực và áp dụng quyền ở backend trước khi thay đổi dữ liệu.
