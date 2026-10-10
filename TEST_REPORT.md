# Báo cáo kiểm tra

## Đã chạy thành công

- `node --check src/logic.js`
- `node --check src/data.js`
- Kiểm tra cú pháp JSX/JS bằng TypeScript transpiler được cài sẵn trong môi trường thực thi, với các file `src/App.jsx`, `src/main.jsx`, `src/App.test.jsx`, `src/logic.test.js`, `src/tests/setup.js`.
- Smoke test độc lập không cần dependency qua `npm run test:logic`: 6 nhóm kiểm tra về SLA, nhận lead, từ chối lead, ghi nhận liên hệ, chuyển đổi, và bộ lọc.

## Chưa chạy được trong môi trường dựng project này

`npm install` bị timeout vì môi trường không phân giải được `registry.npmjs.org` (`EAI_AGAIN`). Do đó chưa thể chạy `npm test` bằng Vitest hoặc `npm run build` bằng Vite tại đây. Các test giao diện và cấu hình build đã được đưa vào project để chạy sau khi cài dependency ở máy phát triển có kết nối npm.
