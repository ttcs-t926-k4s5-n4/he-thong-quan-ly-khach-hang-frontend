# BÁO CÁO TOÀN DIỆN KIỂM THỬ VÀ ĐÁNH GIÁ CHẤT LƯỢNG (QA AUDIT REPORT)
**Hệ thống Quản lý Khách hàng - Frontend CRM**

- **Ngày thực hiện:** 22/10/2026
- **Repository:** `ttcs-t926-k4s5-n4/he-thong-quan-ly-khach-hang-frontend`
- **Tài khoản thực hiện QA:** `dtc245200270` (Email: `225133188+dtc245200270@users.noreply.github.com`)
- **Môi trường:** Node.js v26.8.2 | npm 11.19.1 | Windows 10/11 x64

---

## MỤC LỤC
1. [Tình trạng Git & So sánh Nhánh develop vs main](#1-tình-trạng-git--so-sánh-nhánh-develop-vs-main)
2. [Kiến trúc Tích hợp Ứng dụng Gốc vs 22 Module Độc lập](#2-kiến-trúc-tích-hợp-ứng-dụng-gốc-vs-22-module-độc-lập)
3. [Bảng Ma trận Phạm vi QA Toàn Dự án](#3-bảng-ma-trận-phạm-vi-qa-toàn-dự-án)
4. [Chi tiết Các Lỗi Phát hiện & Phân loại](#4-chi-tiết-các-lỗi-phát-hiện--phân-loại)
5. [Hướng dẫn Kiểm thử Thủ công (Manual Testing Guide)](#5-hướng-dẫn-kiểm-thử-thủ-công-manual-testing-guide)
6. [Kế hoạch & Đề xuất Pull Request](#6-kế-hoạch--đề-xuất-pull-request)

---

## 1. TÌNH TRẠNG GIT & SO SÁNH NHÁNH `develop` VS `main`

### 1.1. Trạng thái kiểm tra
- `git status`: Working tree sạch, không có uncommitted changes trên code gốc.
- `git fetch origin`: Đã đồng bộ toàn bộ ref mới nhất từ remote.
- Commit HEAD của `main`: `c55789f` (*fix(call-log): resolve template string interpolation and export imports*).
- Commit HEAD của `origin/develop`: `d4d115b` (*feat: add sprint4-lead-marketing frontend module*).

### 1.2. So sánh chi tiết `develop` với `main`
- Lệnh: `git log --oneline develop..main`
  - Kết quả: `main` đang **đi trước** `develop` 43 commits.
  - Toàn bộ 43 commits này thuộc về việc phát triển, kiểm thử và merge PR #29 của module [EP-06-CSR104-call-logging-frontend/](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/EP-06-CSR104-call-logging-frontend).
- Lệnh: `git log --oneline main..develop`
  - Kết quả: Rỗng. Nhánh `develop` **không có commit nào** mà `main` chưa có (toàn bộ lịch sử `develop` là tập con tiền nhiệm của `main`).
- Khác biệt file: Thay đổi giữa `develop` và `main` chỉ nằm trong thư mục `EP-06-CSR104-call-logging-frontend/` (8 files thay đổi: code logic, storage, test cases, docs và lockfile).

---

## 2. KIẾN TRÚC TÍCH HỢP ỨNG DỤNG GỐC VS 22 MODULE ĐỘC LẬP

Dựa trên việc đọc [package.json](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/package.json), [vite.config.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/vite.config.js) và [src/App.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/App.jsx):

### 2.1. Phân hệ được tích hợp vào Ứng dụng Gốc (`qa-crm-frontend`)
Ứng dụng gốc tại root là hệ thống CRM trung tâm chạy trên cổng **3000**, có cơ chế gọi API tập trung qua [src/api.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/api.js) trỏ về Backend (`http://127.0.0.1:8000`), bao gồm:
1. **Core & Xác thực:**
   - Đăng nhập, Quên mật khẩu (`/forgot-password`), Đặt lại mật khẩu (`/reset-password`), Kích hoạt tài khoản (`/activate`), Hồ sơ cá nhân (`/profile`), Đổi mật khẩu (`/change-password`).
2. **Quản trị người dùng & Phân quyền:**
   - Quản lý người dùng (`/users`), Vai trò & nhóm (`/roles`), Khóa & bàn giao (`/account-lock`), Nhập người dùng Excel (`/user-import`), Trường tùy chỉnh (`/custom-fields`), Nhật ký thay đổi (`/audit`), Hòm thư demo (`/outbox`).
3. **Cấu hình kinh doanh:**
   - Sản phẩm & bảng giá (`/products`), Cơ cấu kinh doanh (`/org`), Danh mục bán hàng (`/categories`), Pipeline (`/pipeline`), Lý do thắng/thua (`/reasons`).
4. **Quản lý khách hàng (Sprint 1-3):**
   - Dữ liệu kinh doanh (`/customers`), Khách hàng doanh nghiệp (`/crm-customers`), Khách hàng 360° (`/customer-360`), Tìm & lọc khách hàng (`/customer-filter`), Gộp khách trùng (`/duplicates`), Chăm sóc định kỳ (`/care`), Hỗ trợ & rủi ro (`/support`).
5. **Lead & Marketing (Sprint 4):**
   - Tích hợp trực tiếp từ module mã nguồn [src/Sprint4.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/Sprint4.jsx):
     - Danh sách Lead (`/leads`)
     - Nhập Lead Excel (`/lead-import`)
     - Chiến dịch Marketing (`/campaigns`)
     - Biểu mẫu nhúng (`/lead-forms`)
     - Gộp Lead trùng (`/lead-duplicates`)
     - Chấm điểm Lead (`/lead-scoring`)
     - Phân bổ Lead (`/lead-assignment`)

### 2.2. Danh sách 22 Module độc lập (Standalone Submodules)
Toàn bộ 22 thư mục con dưới đây được cấu hình như các dự án SPA React + Vite riêng biệt với `package.json`, `vite.config.js` và cổng chạy riêng, **chưa được bundle hay nhúng vào Router của App gốc**:
1. `crm-customer-management` (cổng 5173)
2. `crm-user-management` (cổng 5173)
3. `sprint4-lead-marketing` (cổng 5173)
4. `EP-05-Sales-Pipeline-Nam` (cổng 5173)
5. `EP-05-SCR98-opportunity-documents-frontend` (cổng 5173)
6. `EP-05-opportunity-filter-frontend` (cổng 5173)
7. `EP-05-opportunity-history-frontend` (cổng 5173)
8. `EP-05-opportunity-sharing-frontend` (cổng 5173)
9. `EP-06-CRM-Activities-Tasks-Nam` (cổng 5173)
10. `EP-06-CSR103-reminders-frontend` (cổng 5173)
11. `EP-06-CSR104-call-logging-frontend` (cổng 5173)
12. `lead-assignment-sla-Scr85-04` (cổng 5173)
13. `lead-list-filters-Scr86-04` (cổng 5173)
14. `S04-04-Scrum81-lead-deduplication` (cổng 5180)
15. `S04-04-Scrum82-lead-scoring` (cổng 5182)
16. `S04-04-Scrum83-lead-routing` (cổng 5184)
17. `S04-05-Scrum91-opportunity-close` (cổng 5186)
18. `S04-05-Scrum92-revenue-forecast` (cổng 5187)
19. `S04-05-Scrum93-stagnant-opportunity-alert` (cổng 5188)
20. `S04-05-Scrum94-reassign-opportunity` (cổng 5189)
21. `S04-06-Scrum101-sales-calendar` (cổng 5190)
22. `S04-06-Scrum102-customer-timeline` (cổng 5191)

---

## 3. BẢNG MA TRẬN PHẠM VI QA TOÀN DỰ ÁN

| STT | Phân hệ / Module | Cổng Dev thực tế | Có `test`? | Có `lint`? | Có `build`? | Kết quả Unit Test | Kết quả Lint | Kết quả Build | Trạng thái Trình duyệt tự động | Ghi chú & Đánh giá |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **0** | **Root (`qa-crm-frontend`)** | **3000** | ❌ Không | ✔ Có (`eslint .`) | ✔ Có (`vite build`) | NOT RUN | **FAIL** (Thiếu `eslint.config.js`) | **FAIL** (Lỗi `index.css`) | **BLOCKED** (Lỗi Playwright Azure CDN 404 + HTTP 500) | **CRITICAL:** Sập khi chạy do import sai file stylesheet. |
| 1 | `crm-customer-management` | 5173 | ❌ Không | ✔ Có | ✔ Có | NOT RUN | **FAIL** (2 lỗi React Hooks cascading renders) | **PASS** (dist 277kB) | **BLOCKED** | Standalone Customer Management UI |
| 2 | `crm-user-management` | 5173 | ❌ Không | ✔ Có | ✔ Có | NOT RUN | **PASS** (0 lỗi, 0 cảnh báo) | **PASS** (dist 653kB) | **BLOCKED** | Standalone User Management UI |
| 3 | `sprint4-lead-marketing` | 5173 | ❌ Không | ✔ Có | ✔ Có | NOT RUN | **PASS** (0 lỗi, 0 cảnh báo) | **PASS** (dist 670kB) | **BLOCKED** | Standalone Lead & Marketing UI |
| 4 | `EP-05-Sales-Pipeline-Nam` | 5173 | ❌ Không | ✔ Có | ✔ Có | NOT RUN | **FAIL** (1 lỗi React Hook cascading render) | **PASS** (dist 247kB) | **BLOCKED** | Kanban Sales Pipeline |
| 5 | `EP-05-SCR98-opportunity-documents-frontend` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **PASS** (10/10 tests, 137ms) | NOT RUN | **PASS** (dist 196kB) | **BLOCKED** | Quản lý file đính kèm cơ hội |
| 6 | `EP-05-opportunity-filter-frontend` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **PASS** (9/9 tests, 144ms) | NOT RUN | **PASS** (dist 177kB) | **BLOCKED** | Bộ lọc & tìm kiếm cơ hội |
| 7 | `EP-05-opportunity-history-frontend` | 5173 | ✔ Có (`vitest`, `smoke`) | ❌ Không | ✔ Có | **FAIL** (Smoke: PASS; Vitest: 4 fail / 4 pass) | NOT RUN | **PASS** (dist 190kB) | **BLOCKED** | Lịch sử thay đổi cơ hội |
| 8 | `EP-05-opportunity-sharing-frontend` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **FAIL** (3 fail / 7 pass) | NOT RUN | **PASS** (dist 184kB) | **BLOCKED** | Phân quyền chia sẻ cơ hội |
| 9 | `EP-06-CRM-Activities-Tasks-Nam` | 5173 | ❌ Không | ✔ Có | ✔ Có | NOT RUN | **PASS** (0 lỗi, 0 cảnh báo) | **PASS** (dist 233kB) | **BLOCKED** | Hoạt động & Nhiệm vụ CRM |
| 10 | `EP-06-CSR103-reminders-frontend` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **PASS** (11/11 tests, 147ms) | NOT RUN | **FAIL** (Thiếu `src/main.jsx`) | **BLOCKED** | Nhắc việc: Thiếu file entrypoint React |
| 11 | `EP-06-CSR104-call-logging-frontend` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **PASS** (31/31 tests, 220ms) | NOT RUN | **PASS** (dist 179kB) | **BLOCKED** | Ghi nhận nhanh cuộc gọi |
| 12 | `lead-assignment-sla-Scr85-04` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **PASS** (6/6 tests, 128ms) | NOT RUN | **PASS** (dist 160kB) | **BLOCKED** | SLA 24h & tiếp nhận lead |
| 13 | `lead-list-filters-Scr86-04` | 5173 | ✔ Có (`node --test`) | ❌ Không | ✔ Có | **PASS** (6/6 tests, 121ms) | NOT RUN | **PASS** (dist 162kB) | **BLOCKED** | Bộ lọc danh sách lead |
| 14 | `S04-04-Scrum81-lead-deduplication` | 5180 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | **PASS** (dist 319kB) | **BLOCKED** | Lọc trùng lead |
| 15 | `S04-04-Scrum82-lead-scoring` | 5182 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Chấm điểm lead |
| 16 | `S04-04-Scrum83-lead-routing` | 5184 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Điều phối lead |
| 17 | `S04-05-Scrum91-opportunity-close` | 5186 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Đóng cơ hội |
| 18 | `S04-05-Scrum92-revenue-forecast` | 5187 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Dự báo doanh thu |
| 19 | `S04-05-Scrum93-stagnant-opportunity-alert` | 5188 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Cảnh báo cơ hội đình trệ |
| 20 | `S04-05-Scrum94-reassign-opportunity` | 5189 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Phân bổ lại cơ hội |
| 21 | `S04-06-Scrum101-sales-calendar` | 5190 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | **PASS** (dist 318kB) | **BLOCKED** | Lịch kinh doanh |
| 22 | `S04-06-Scrum102-customer-timeline` | 5191 | ❌ Không | ❌ Không | ✔ Có | NOT RUN | NOT RUN | **PASS** (dist 318kB) | **BLOCKED** | Dòng thời gian tương tác |

---

## 4. CHI TIẾT CÁC LỖI PHÁT HIỆN & PHÂN LOẠI

### LỖI 1: ROOT APP SẬP KHI KHỞI CHẠY (HTTP 500 / UNRESOLVED IMPORT)
- **Phân loại:** **Lỗi ứng dụng (Application Bug - Blocker)**
- **Module:** Root (`qa-crm-frontend`)
- **Commit gây lỗi:** `ae1701e7cdf23a50aa6953514c6e0d5d30455ed8` ("chore: align root configuration and styles with develop")
- **File:** [src/main.jsx (dòng 3)](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/main.jsx#L3)
- **Lệnh đã chạy:** `npm run build` và `npm run dev`
- **Log thực tế:**
  ```text
  [UNRESOLVED_IMPORT] Could not resolve './index.css' in src/main.jsx
     ╭─[ src/main.jsx:3:8 ]
   3 │ import "./index.css";
     │        ──────┬──────  
     │              ╰──────── Module not found.
  ```
  Khi mở trình duyệt tới `http://localhost:3000/`, Vite trả về:
  `HTTP/1.1 500 Internal Server Error: Failed to resolve import "./index.css" from "src/main.jsx". Does the file exist?`
- **Các bước tái hiện:**
  1. Mở terminal tại thư mục gốc `qa-crm-frontend`.
  2. Chạy `npm run dev` hoặc `npm run build`.
  3. Mở trình duyệt truy cập `http://localhost:3000/`.
  4. Màn hình báo lỗi Error Overlay 500 của Vite, không load được ứng dụng React.
- **Nguyên nhân kỹ thuật:** Tác giả commit `ae1701e` đã thay đổi file `src/main.jsx` và import `./index.css`. Tuy nhiên trong thư mục `src/`, file stylesheet chứa toàn bộ giao diện hệ thống là `styles.css`. Không hề có file `src/index.css`.

---

### LỖI 2: ROOT APP THIẾU CẤU HÌNH ESLINT 10
- **Phân loại:** **Lỗi cấu hình (Configuration Bug)**
- **Module:** Root (`qa-crm-frontend`)
- **Commit:** HEAD (`c55789f`)
- **Lệnh đã chạy:** `npm run lint`
- **Log thực tế:**
  ```text
  > sprint4-lead-marketing@0.0.0 lint
  > eslint .

  Oops! Something went wrong! :(
  ESLint: 10.12.0
  ESLint couldn't find an eslint.config.* file.
  From ESLint v9.0.0, the default configuration file is now eslint.config.*.
  ```
- **Các bước tái hiện:**
  1. Tại thư mục gốc `qa-crm-frontend`, chạy `npm run lint`.
  2. Linter báo lỗi thoát mã 1 ngay lập tức.
- **Nguyên nhân kỹ thuật:** `package.json` cài đặt ESLint v10 nhưng trong thư mục gốc không có file `eslint.config.js` (Flat config format) như các thư mục con khác.

---

### LỖI 3: UNIT TEST THẤT BẠI TẠI `EP-05-opportunity-sharing-frontend` DO MOCK THỜI GIAN
- **Phân loại:** **Lỗi test (Test / Mock Bug)**
- **Module:** `EP-05-opportunity-sharing-frontend`
- **Commit:** HEAD (`c55789f`)
- **File:** [src/utils/shareLogic.test.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/EP-05-opportunity-sharing-frontend/src/utils/shareLogic.test.js#L16)
- **Lệnh đã chạy:** `node --test src/utils/shareLogic.test.js`
- **Log thực tế:**
  ```text
  ✖ chủ sở hữu có thể thêm nhiều thành viên và tạo audit log (2.6416ms)
    AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    + actual: 'activity_logged'
    - expected: 'member_added'
  ✖ chỉ chủ sở hữu mới được xóa thành viên chia sẻ (0.5418ms)
    AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    + actual: 'activity_logged'
    - expected: 'member_removed'
  ✖ chuyển owner thay đổi chủ sở hữu, giữ chủ cũ trong team và ghi log có lý do (0.4515ms)
    AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    + actual: 'activity_logged'
    - expected: 'owner_transferred'
  ℹ tests 10 | pass 7 | fail 3
  ```
- **Các bước tái hiện:**
  1. Mở terminal tại `qa-crm-frontend/EP-05-opportunity-sharing-frontend`.
  2. Chạy `node --test src/utils/shareLogic.test.js`.
  3. Quan sát: 7 tests PASS, 3 tests FAIL.
- **Nguyên nhân kỹ thuật:**
  Trong file test, biến `now` được gán cố định là `'2026-10-17T14:30:00.000Z'`. Tuy nhiên trong [seed.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/EP-05-opportunity-sharing-frontend/src/data/seed.js#L31), dữ liệu mồi được sinh động bằng hàm `stamp(0, ...)` (tức ngày hôm nay 22/10/2026).
  Hàm nghiệp vụ `addAudit` sắp xếp mảng nhật ký giảm dần theo thời gian (`b.createdAt - a.createdAt`). Vì ngày 17/10/2026 nhỏ hơn ngày 22/10/2026, bản ghi mới tạo bị xếp phía sau bản ghi seed của ngày hôm nay (`type: 'activity_logged'`), dẫn đến câu lệnh `assert.equal(updated.audit[0].type, 'member_added')` bị fail.

---

### LỖI 4: VITEST THẤT BẠI TRÊN `EP-05-opportunity-history-frontend` DO MÔI TRƯỜNG RUNTIME
- **Phân loại:** **Lỗi test & Lỗi môi trường (Test & Runtime Environment Bug)**
- **Module:** `EP-05-opportunity-history-frontend`
- **Commit:** HEAD (`c55789f`)
- **Lệnh đã chạy:** `npm test` (`vitest run`)
- **Log thực tế:**
  ```text
  FAIL src/utils/history.test.js > history helpers > exports previous and new values along with the actor in CSV
  AssertionError: expected '\ufeff"Thời điểm","Cơ hội","Công ty",…' to contain '200.000.000 ₫'
  - Expected: 200.000.000 ₫
  + Received: 200.000.000\u00a0₫

  FAIL src/App.test.jsx > Opportunity history UI > filters the history table by search text
  TypeError: Cannot read properties of undefined (reading 'clear')
   ❯ src/App.test.jsx:7:16
        7|   localStorage.clear();
  ```
- **Các bước tái hiện:**
  1. Mở terminal tại `qa-crm-frontend/EP-05-opportunity-history-frontend`.
  2. Chạy `npm test`.
  3. Kết quả: 4 tests FAIL, 4 tests PASS.
- **Nguyên nhân kỹ thuật:**
  1. Lỗi test: Hàm `Intl.NumberFormat('vi-VN')` trong Node runtime mới xuất ra ký tự khoảng trắng không ngắt (non-breaking space Unicode `\u00A0`), trong khi test case dùng chuỗi chứa khoảng trắng thông thường (`\u0020`).
  2. Lỗi môi trường: Tính năng `--experimental-localstorage` trên Node.js v26 làm sai lệch mock `localStorage` trong JSDOM khi chạy runner vitest nếu không được cấu hình tường minh. (Lưu ý: script `node ./src/test/smoke.mjs` chạy độc lập vẫn PASS).

---

### LỖI 5: LỖI REACT HOOKS CASCADING RENDERS TRÊN `crm-customer-management` VÀ `EP-05-Sales-Pipeline-Nam`
- **Phân loại:** **Lỗi mã nguồn (Application / React Hook Bug)**
- **Modules:** `crm-customer-management` và `EP-05-Sales-Pipeline-Nam`
- **Commit:** HEAD (`c55789f`)
- **Lệnh đã chạy:** `npm run lint`
- **Log thực tế:**
  - `crm-customer-management`:
    ```text
    ContactForm.jsx: 28:7 error Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)
    CustomerForm.jsx: 35:7 error Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)
    ✖ 2 problems (2 errors, 0 warnings)
    ```
  - `EP-05-Sales-Pipeline-Nam`:
    ```text
    App.jsx: 144:7 error Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)
    ✖ 1 problem (1 error, 0 warnings)
    ```
- **Các bước tái hiện:**
  1. Tại từng thư mục trên, chạy `npm run lint`.
  2. Linter báo lỗi mã 1 và chỉ rõ dòng gọi `setFormData` / `setNotice` đồng bộ bên trong `useEffect`.
- **Nguyên nhân kỹ thuật:** Theo chuẩn React 19 và ESLint React Hooks mới, việc gọi `setState` đồng bộ ngay trong thân `useEffect` khi dependency thay đổi sẽ kích hoạt re-render liên tầng, làm giảm hiệu năng và tiềm ẩn vòng lặp vô hạn.

---

### LỖI 6: THIẾU FILE ENTRYPOINT `src/main.jsx` TRÊN `EP-06-CSR103-reminders-frontend` (BUILD FAIL)
- **Phân loại:** **Lỗi ứng dụng (Application Bug - Missing Entrypoint)**
- **Module:** `EP-06-CSR103-reminders-frontend`
- **Commit:** HEAD (`c55789f`)
- **Lệnh đã chạy:** `npm run build`
- **Log thực tế:**
  ```text
  > ep-06-csr103-reminders-frontend@1.0.0 build
  > vite build

  vite v6.4.5 building for production...
  ✗ Build failed in 40ms
  error during build:
  [vite:build-html] Failed to resolve /src/main.jsx from C:/Users/Dell Precision 5550/qa-crm-frontend/EP-06-CSR103-reminders-frontend/index.html
  file: C:/Users/Dell Precision 5550/qa-crm-frontend/EP-06-CSR103-reminders-frontend/index.html
  ```
- **Các bước tái hiện:**
  1. Mở terminal tại `qa-crm-frontend/EP-06-CSR103-reminders-frontend`.
  2. Chạy `npm run build`.
  3. Quá trình đóng gói thất bại ngay lập tức ở bước đọc `index.html`.
- **Nguyên nhân kỹ thuật:** File [index.html](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/EP-06-CSR103-reminders-frontend/index.html#L12) khai báo thẻ script `<script type="module" src="/src/main.jsx"></script>`, tuy nhiên trong thư mục `src/` chỉ có `App.jsx`, `styles.css`, `data/` và `utils/`, hoàn toàn thiếu file khởi tạo `main.jsx`.

---

### LỖI 7: TRÌNH DUYỆT TỰ ĐỘNG PLAYWRIGHT BỊ CHẶN BỞI HỆ THỐNG (AZURE CDN 404)
- **Phân loại:** **Lỗi môi trường (Environment Bug - BLOCKED)**
- **Hạ tầng:** Antigravity Browser Runner
- **Lệnh thực hiện:** Gọi `browser_subagent` điều hướng đến `http://localhost:3000/`
- **Log thực tế:**
  ```text
  failed to create browser context: failed to run playwright manager: failed to install playwright: could not install driver: got non 200 status code: 404 (404 Not Found) from https://playwright.azureedge.net/builds/driver/playwright-1.57.0-win32_x64.zip
  ```
- **Đánh giá:** Lỗi mạng từ CDN máy chủ phân phối gói Playwright 1.57.0 trên môi trường Windows khiến trình duyệt tự động không thể tạo context để chụp ảnh màn hình và click tương tác. Do đó, toàn bộ phần kiểm thử giao diện trực quan tự động được đánh dấu **BLOCKED**.

---

## 5. HƯỚNG DẪN KIỂM THỬ THỦ CÔNG (MANUAL TESTING GUIDE)

Vì trình duyệt tự động bị BLOCKED do CDN Playwright, Tester/Developer vui lòng thực hiện kiểm thử thủ công trên trình duyệt thật (Chrome/Edge/Brave) theo các kịch bản sau:

### Kịch bản 1: Kiểm tra Ứng dụng Gốc (Root CRM Shell)
1. **Kiểm tra trạng thái lỗi 500 hiện tại:**
   - Mở terminal tại thư mục gốc `qa-crm-frontend`.
   - Chạy: `npm run dev`.
   - Mở trình duyệt tại: `http://localhost:3000/`.
   - **Kỳ vọng:** Màn hình hiển thị Overlay đỏ báo lỗi `Failed to resolve import "./index.css" from "src/main.jsx"`.
2. **Kiểm tra sau khi khắc phục tạm thời:**
   - Đổi dòng 3 của [src/main.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/main.jsx) thành `import './styles.css'`.
   - Lưu file và quay lại trình duyệt `http://localhost:3000/`.
   - **Kỳ vọng:** Form Đăng nhập CRM hiển thị hoàn chỉnh với giao diện màu tối/sáng chuẩn.
   - Thử bấm Đăng nhập khi chưa bật backend: Hệ thống hiện thông báo đỏ *"Không thể kết nối tới máy chủ. Hãy kiểm tra Backend đang chạy tại http://127.0.0.1:8000"*.

---

### Kịch bản 2: Kiểm tra Module Tìm kiếm & Lọc cơ hội (`EP-05-opportunity-filter-frontend`)
1. Di chuyển vào thư mục: `cd EP-05-opportunity-filter-frontend`.
2. Chạy: `npm run dev`.
3. Mở trình duyệt tại: `http://localhost:5173/`.
4. **Các bước kiểm tra chức năng:**
   - **Tìm kiếm không dấu:** Nhập `thoa` vào ô tìm kiếm -> Kỳ vọng tìm ra cơ hội có chữ `Thỏa thuận`.
   - **Lọc theo Giai đoạn & Giá trị:** Chọn giai đoạn `Đề xuất giải pháp`, nhập khoảng tiền `100.000.000` đến `500.000.000` -> Kỳ vọng danh sách lọc chính xác.
   - **Lưu bộ lọc (Preset):** Bấm "Lưu bộ lọc", đặt tên `Bộ lọc Test QA`, F5 tải lại trang -> Bộ lọc vẫn còn được lưu trong `localStorage`.
   - **Xuất CSV:** Bấm nút "Xuất CSV" -> Tải về file `.csv` có UTF-8 BOM, mở bằng Excel hiển thị đúng dấu tiếng Việt.

---

### Kịch bản 3: Kiểm tra Ghi nhận Cuộc gọi nhanh (`EP-06-CSR104-call-logging-frontend`)
1. Di chuyển vào thư mục: `cd EP-06-CSR104-call-logging-frontend`.
2. Chạy: `npm run dev`.
3. Mở trình duyệt tại: `http://localhost:5173/`.
4. **Các bước kiểm tra:**
   - Chọn khách hàng từ danh sách.
   - Chọn kết quả: `Hẹn gọi lại` -> Kiểm tra ô nhập ngày giờ gọi lại bắt buộc hiển thị; chọn ngày trong quá khứ hệ thống phải báo lỗi.
   - Bấm "Lưu cuộc gọi" -> Cuộc gọi được thêm ngay vào lịch sử và tự động liên kết với cơ hội mới nhất.

---

### Kịch bản 4: Kiểm tra Lịch bán hàng & Dòng thời gian (`S04-06`)
1. **Lịch bán hàng (`S04-06-Scrum101-sales-calendar`):**
   - Chạy tại port `5190`: `cd S04-06-Scrum101-sales-calendar && npm run dev`.
   - Mở `http://localhost:5190/` -> Kiểm tra chế độ xem Tháng / Tuần / Ngày, bấm tạo sự kiện mới.
2. **Dòng thời gian khách hàng (`S04-06-Scrum102-customer-timeline`):**
   - Chạy tại port `5191`: `cd S04-06-Scrum102-customer-timeline && npm run dev`.
   - Mở `http://localhost:5191/` -> Kiểm tra bộ lọc theo kênh (Cuộc gọi, Email, Gặp mặt, Ghi chú), xem chi tiết từng tương tác.

---

## 6. KẾ HOẠCH & ĐỀ XUẤT PULL REQUEST

### 6.1. Quy tắc bảo toàn
- Toàn bộ mã nguồn và test hiện tại được **giữ nguyên 100%** không can thiệp trái phép, bảo toàn tính toàn vẹn của repository.
- Tài khoản thực hiện commit và PR: `dtc245200270`.
- **Tuyệt đối không merge vào nhánh `main`**.

### 6.2. Kế hoạch đóng gói PR
- Nhánh phát hành: `qa/comprehensive-audit-report` (tạo từ `main`).
- Nội dung PR: Đính kèm tài liệu báo cáo QA hoàn chỉnh `QA_COMPREHENSIVE_AUDIT_REPORT.md`.
- Các nhánh fix riêng biệt (sẽ được tạo khi được phê duyệt):
  1. `fix/root-app-stylesheet-import`: Sửa `src/main.jsx` trỏ về `./styles.css` và bổ sung `eslint.config.js`.
  2. `fix/ep06-reminders-entrypoint`: Bổ sung `src/main.jsx` cho `EP-06-CSR103-reminders-frontend`.
  3. `fix/ep05-sharing-test-mock`: Sửa mock thời gian `now` trong `shareLogic.test.js`.
  4. `fix/ep05-history-test-vitest`: Sửa định dạng non-breaking space và config vitest environment.
  5. `fix/react-hooks-cascading-renders`: Khắc phục cảnh báo `set-state-in-effect` trong Customer & Pipeline components.
