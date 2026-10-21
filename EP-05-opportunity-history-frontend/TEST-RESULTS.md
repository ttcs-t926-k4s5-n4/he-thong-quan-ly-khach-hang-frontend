# Kết quả kiểm thử

## Đã chạy thành công

- `npm run test:smoke`: PASS.
  - Ghi nhận từng trường thay đổi thành một dòng.
  - Không tạo lịch sử khi giá trị không đổi.
  - Định dạng giá trị tiền và ngày.
  - Tìm kiếm theo từ khóa, lọc theo loại thay đổi/người thực hiện/khoảng ngày.
  - Tạo dữ liệu CSV có BOM UTF-8.
- Kiểm tra cú pháp JSX bằng TypeScript transpiler: `src/App.jsx`, `src/main.jsx`, `src/App.test.jsx` đều hợp lệ.
- Kiểm tra cú pháp Node.js cho các hàm tiện ích và script smoke test: PASS.

## Chưa thể chạy trong môi trường tạo project

`npm install` không hoàn tất do môi trường không phân giải được `registry.npmjs.org` (`EAI_AGAIN`). Vì vậy `npm test` (Vitest), `npm run build` (Vite) và các kiểm thử giao diện trong `src/App.test.jsx` chưa được thực thi tại đây. Sau khi cài dependency thành công trên máy có mạng, chạy:

```bash
npm install
npm test
npm run test:smoke
npm run build
```

## Sửa dependency (17-10-2026)

- Đổi `@vitejs/plugin-react` từ `latest` sang `^4.3.4`, là nhánh tương thích với Vite 6, để tránh lỗi `ERESOLVE` do plugin-react 6.x yêu cầu Vite 8.x.
- Thêm khai báo yêu cầu Node.js `>=18.0.0`.
- Khi cài mới, chạy `npm install` và đợi thành công trước khi chạy `npm run dev`. Không cần dùng `--force` hoặc `--legacy-peer-deps`.
