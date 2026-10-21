# EP-05 — Opportunity Filter Frontend

Frontend React + Vite cho màn hình **Tìm kiếm & lọc cơ hội kinh doanh**.

## Chức năng

- Tìm kiếm theo mã/tên cơ hội, công ty, sản phẩm, giai đoạn hoặc người sở hữu. Tìm kiếm không phân biệt chữ hoa/thường và dấu tiếng Việt.
- Kết hợp bộ lọc theo giai đoạn, khoảng giá trị VND, ngày chốt dự kiến, sản phẩm và người sở hữu.
- Xác thực khoảng giá trị/ngày, báo lỗi rõ ràng khi điều kiện không hợp lệ.
- Lưu nhiều bộ lọc thường dùng vào `localStorage`; áp dụng lại hoặc xóa preset. Dữ liệu vẫn còn sau khi tải lại trang trên cùng trình duyệt.
- Sắp xếp theo giá trị và ngày chốt; phân trang; thay đổi số dòng hiển thị.
- Xuất CSV theo kết quả hiện đã lọc, có BOM UTF-8 để mở tiếng Việt tốt hơn trong Excel.
- Có trạng thái rỗng khi không tìm thấy kết quả, nhãn điều kiện lọc và thông báo thao tác.
- Responsive cho màn hình desktop, tablet và điện thoại.

## Yêu cầu

- Node.js 18 trở lên
- npm

## Chạy trong VS Code

```bash
npm install
npm run dev
```

Mở URL localhost mà Vite hiển thị trong Terminal.

## Kiểm thử và build

```bash
npm test
npm run build
```

`npm test` sử dụng Node.js built-in test runner và không cần thư viện kiểm thử bổ sung.

## Cấu trúc

```text
EP-05-opportunity-filter-frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── data/opportunities.js
│   └── utils/
│       ├── opportunityFilters.js
│       └── opportunityFilters.test.js
├── README.md
└── TEST-RESULTS.md
```

## Lưu ý phạm vi

Đây là frontend demo có dữ liệu mẫu. Bộ lọc đã lưu được giữ trong trình duyệt bằng `localStorage`; chưa kết nối API/backend hoặc dữ liệu thật của CRM.
