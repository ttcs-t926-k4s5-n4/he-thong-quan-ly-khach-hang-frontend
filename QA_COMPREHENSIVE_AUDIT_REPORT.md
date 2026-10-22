# BÁO CÁO TIẾN ĐỘ VÀ KẾT QUẢ KIỂM THỬ TỪNG PHẦN (QA AUDIT REPORT)
**Hệ thống Quản lý Khách hàng - Frontend CRM**

> **KẾT LUẬN TIẾN ĐỘ HIỆN TẠI:**
> **Đã kiểm tra build/lint/unit test một phần; kiểm thử giao diện còn BLOCKED.** (Chưa hoàn tất QA toàn bộ dự án do kiểm thử tự động trên trình duyệt bị chặn bởi lỗi môi trường mạng hệ thống và cần tiếp tục nghiệm thu thủ công).

- **Thời gian thực hiện kiểm thử:** 22/10/2026
- **Repository:** `ttcs-t926-k4s5-n4/he-thong-quan-ly-khach-hang-frontend`
- **Tài khoản thực hiện:** `dtc245200270` (`225133188+dtc245200270@users.noreply.github.com`)
- **Môi trường Runtime:** Node.js `v26.8.2` | npm `11.19.1` | Windows 10/11 x64
- **Commit được kiểm thử:** `c55789f0f1dcd7951a134857bc432acfe464019a` (HEAD nhánh `main`)

---

## MỤC LỤC
1. [Tình trạng Git & So sánh Nhánh develop vs main](#1-tình-trạng-git--so-sánh-nhánh-develop-vs-main)
2. [Kiến trúc Tích hợp Ứng dụng Gốc vs 22 Module Độc lập](#2-kiến-trúc-tích-hợp-ứng-dụng-gốc-vs-22-module-độc-lập)
3. [Tổng hợp Số liệu Từng Loại Kiểm tra (Tách riêng)](#3-tổng-hợp-số-liệu-từng-loại-kiểm-tra-tách-riêng)
4. [Bảng Ma trận Chi tiết 23 Phân hệ](#4-bảng-ma-trận-chi-tiết-23-phân-hệ)
5. [Chi tiết Kiểm thử Build 6 Phân hệ Bổ sung (SCRUM-82, 83, 91, 92, 93, 94)](#5-chi-tiết-kiểm-thử-build-6-phân-hệ-bổ-sung-scrum-82-83-91-92-93-94)
6. [Nhật ký Lỗi Kỹ thuật & Giả thuyết Nguyên nhân](#6-nhật-ký-lỗi-kỹ-thuật--giả-thuyết-nguyên-nhân)
7. [Checklist Kiểm thử Thủ công (Manual QA Checklist)](#7-checklist-kiểm-thử-thủ-công-manual-qa-checklist)
8. [Thông tin Nhánh & Pull Request](#8-thông-tin-nhánh--pull-request)

---

## 1. TÌNH TRẠNG GIT & SO SÁNH NHÁNH `develop` VS `main`

### 1.1. Trạng thái kiểm tra Git
- `git status`: Working tree sạch sẽ, các file mã nguồn và test của dự án được bảo toàn nguyên vẹn 100%.
- `git fetch origin`: Đã fetch đầy đủ toàn bộ refs mới nhất.
- Commit HEAD nhánh `main`: `c55789f` (*fix(call-log): resolve template string interpolation and export imports*).
- Commit HEAD nhánh `origin/develop`: `d4d115b` (*feat: add sprint4-lead-marketing frontend module*).

### 1.2. So sánh 2 nhánh
- Lệnh: `git log --oneline develop..main`
  - Kết quả: `main` đang **đi trước** `develop` **43 commits**.
  - Toàn bộ các commits này thuộc phân hệ [EP-06-CSR104-call-logging-frontend/](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/EP-06-CSR104-call-logging-frontend) đã được merge vào `main` qua PR #29.
- Lệnh: `git log --oneline main..develop`
  - Kết quả: Rỗng — `develop` không có commit nào mà `main` chưa có.
- File thay đổi giữa `develop..main`: Chỉ có 8 files trong thư mục `EP-06-CSR104-call-logging-frontend/`.

---

## 2. KIẾN TRÚC TÍCH HỢP ỨNG DỤNG GỐC VS 22 MODULE ĐỘC LẬP

Dựa trên việc đọc [package.json](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/package.json), [vite.config.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/vite.config.js) và [src/App.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/App.jsx):

### 2.1. Phân hệ được tích hợp trong Ứng dụng Gốc (`qa-crm-frontend`)
Chạy tại cổng **3000**, giao tiếp Backend API qua [src/api.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/api.js) (`http://127.0.0.1:8000`):
1. **Core & Xác thực:** Đăng nhập, Hồ sơ (`/profile`), Đổi mật khẩu (`/change-password`), Quên/Khôi phục mật khẩu.
2. **Quản trị người dùng & Phân quyền:** `/users`, `/roles`, Khóa & bàn giao (`/account-lock`), Nhập Excel (`/user-import`), Nhật ký thay đổi (`/audit`), Outbox mail (`/outbox`).
3. **Cấu hình kinh doanh:** `/products`, `/categories`, `/pipeline`, `/reasons`, `/org`, `/custom-fields`.
4. **Quản lý khách hàng (Sprint 1-3):** Dữ liệu kinh doanh (`/customers`), Khách hàng DN (`/crm-customers`), Khách hàng 360° (`/customer-360`), Tìm & lọc (`/customer-filter`), Gộp trùng (`/duplicates`), Chăm sóc định kỳ (`/care`), Hỗ trợ & rủi ro (`/support`).
5. **Lead & Marketing (Sprint 4):** Tích hợp từ [src/Sprint4.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/Sprint4.jsx): `/leads`, `/lead-import`, `/campaigns`, `/lead-forms`, `/lead-duplicates`, `/lead-scoring`, `/lead-assignment`.

### 2.2. Danh sách 22 Module độc lập (Standalone Modules)
Các module con chạy SPA React + Vite riêng biệt với `package.json` và cổng riêng, **chưa nhúng vào router của Root App**:
`crm-customer-management`, `crm-user-management`, `sprint4-lead-marketing`, `EP-05-Sales-Pipeline-Nam`, `EP-05-SCR98-opportunity-documents-frontend`, `EP-05-opportunity-filter-frontend`, `EP-05-opportunity-history-frontend`, `EP-05-opportunity-sharing-frontend`, `EP-06-CRM-Activities-Tasks-Nam`, `EP-06-CSR103-reminders-frontend`, `EP-06-CSR104-call-logging-frontend`, `lead-assignment-sla-Scr85-04`, `lead-list-filters-Scr86-04`, `S04-04-Scrum81-lead-deduplication`, `S04-04-Scrum82-lead-scoring`, `S04-04-Scrum83-lead-routing`, `S04-05-Scrum91-opportunity-close`, `S04-05-Scrum92-revenue-forecast`, `S04-05-Scrum93-stagnant-opportunity-alert`, `S04-05-Scrum94-reassign-opportunity`, `S04-06-Scrum101-sales-calendar`, `S04-06-Scrum102-customer-timeline`.

---

## 3. TỔNG HỢP SỐ LIỆU TỪNG LOẠI KIỂM TRA (TÁCH RIÊNG)

*(Theo nguyên tắc không gộp chung các loại kiểm tra khác nhau thành một tỷ lệ PASS duy nhất)*

### 3.1. Số liệu Đóng gói (Build)
- **Tổng số phân hệ được kiểm tra build:** 23/23 (1 Root + 22 Submodules)
- **PASS:** **21 / 23**
- **FAIL:** **2 / 23** (Gồm: Root App do lỗi import stylesheet; `EP-06-CSR103-reminders-frontend` do thiếu entrypoint `src/main.jsx`)
- **NOT RUN:** **0 / 23**

### 3.2. Số liệu Kiểm tra Cú pháp & Quy chuẩn Mã nguồn (Lint)
- **Tổng số phân hệ có khai báo script `lint`:** 6 / 23
- **PASS:** **3 / 6** (`crm-user-management`, `sprint4-lead-marketing`, `EP-06-CRM-Activities-Tasks-Nam`)
- **FAIL:** **3 / 6** (Gồm: Root App thiếu file `eslint.config.js`; `crm-customer-management` có 2 lỗi React Hook; `EP-05-Sales-Pipeline-Nam` có 1 lỗi React Hook)
- **NOT RUN:** **17 / 23** (Các phân hệ này không định nghĩa script `lint` trong `package.json`)

### 3.3. Số liệu Kiểm thử Đơn vị Tự động (Unit Test)
- **Tổng số phân hệ có khai báo script `test`:** 8 / 23
- **PASS:** **6 / 8** (`EP-05-SCR98` [10/10], `EP-05-opportunity-filter` [9/9], `EP-06-CSR103` [11/11], `EP-06-CSR104` [31/31], `lead-assignment-sla` [6/6], `lead-list-filters` [6/6])
- **FAIL:** **2 / 8** (`EP-05-opportunity-sharing` [3 fail / 7 pass], `EP-05-opportunity-history` [4 fail / 4 pass])
- **NOT RUN:** **15 / 23** (Các phân hệ này không có test script)

### 3.4. Số liệu Kiểm thử Giao diện Trình duyệt Tự động (Automated Browser UI Test)
- **BLOCKED:** **23 / 23** (Do Azure CDN của Playwright trả về 404 Not Found khi tải driver 1.57.0 trên Windows).

---

## 4. BẢNG MA TRẬN CHI TIẾT 23 PHÂN HỆ

| STT | Phân hệ / Thư mục | Cổng Dev thực tế | Kiểm thử Unit Test | Kiểm thử Lint | Kiểm thử Build | Kiểm thử Browser | Trạng thái kỹ thuật |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **0** | **Root (`qa-crm-frontend`)** | **3000** | NOT RUN | **FAIL** | **FAIL** | **BLOCKED** | Lỗi import `./index.css`; thiếu `eslint.config.js`. Dev server trả HTTP 500. |
| 1 | `crm-customer-management` | 5173 | NOT RUN | **FAIL** | **PASS** | **BLOCKED** | Build thành công (277kB). Lint báo 2 lỗi React Hooks `set-state-in-effect`. |
| 2 | `crm-user-management` | 5173 | NOT RUN | **PASS** | **PASS** | **BLOCKED** | Build thành công (653kB). Lint 0 lỗi, 0 cảnh báo. |
| 3 | `sprint4-lead-marketing` | 5173 | NOT RUN | **PASS** | **PASS** | **BLOCKED** | Build thành công (670kB). Lint 0 lỗi, 0 cảnh báo. |
| 4 | `EP-05-Sales-Pipeline-Nam` | 5173 | NOT RUN | **FAIL** | **PASS** | **BLOCKED** | Build thành công (247kB). Lint báo 1 lỗi React Hook `set-state-in-effect`. |
| 5 | `EP-05-SCR98-opportunity-documents-frontend` | 5173 | **PASS** (10/10) | NOT RUN | **PASS** | **BLOCKED** | Unit test pass 100% (137ms). Build thành công (196kB). |
| 6 | `EP-05-opportunity-filter-frontend` | 5173 | **PASS** (9/9) | NOT RUN | **PASS** | **BLOCKED** | Unit test pass 100% (144ms). Build thành công (177kB). |
| 7 | `EP-05-opportunity-history-frontend` | 5173 | **FAIL** (4 fail / 4 pass) | NOT RUN | **PASS** | **BLOCKED** | Build thành công (190kB). Test fail do khoảng trắng non-breaking space và JSDOM trên Node v26. |
| 8 | `EP-05-opportunity-sharing-frontend` | 5173 | **FAIL** (3 fail / 7 pass) | NOT RUN | **PASS** | **BLOCKED** | Build thành công (184kB). Test fail do mock thời gian lệch với seed. |
| 9 | `EP-06-CRM-Activities-Tasks-Nam` | 5173 | NOT RUN | **PASS** | **PASS** | **BLOCKED** | Build thành công (233kB). Lint 0 lỗi, 0 cảnh báo. |
| 10 | `EP-06-CSR103-reminders-frontend` | 5173 | **PASS** (11/11) | NOT RUN | **FAIL** | **BLOCKED** | Test utils pass (147ms). Build fail do thiếu entrypoint `src/main.jsx`. |
| 11 | `EP-06-CSR104-call-logging-frontend` | 5173 | **PASS** (31/31) | NOT RUN | **PASS** | **BLOCKED** | Test pass 100% (220ms). Build thành công (179kB). |
| 12 | `lead-assignment-sla-Scr85-04` | 5173 | **PASS** (6/6) | NOT RUN | **PASS** | **BLOCKED** | Test pass 100% (128ms). Build thành công (160kB). |
| 13 | `lead-list-filters-Scr86-04` | 5173 | **PASS** (6/6) | NOT RUN | **PASS** | **BLOCKED** | Test pass 100% (121ms). Build thành công (162kB). |
| 14 | `S04-04-Scrum81-lead-deduplication` | 5180 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (319kB). Không có script test/lint. |
| 15 | `S04-04-Scrum82-lead-scoring` | 5182 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (282kB). Không có script test/lint. |
| 16 | `S04-04-Scrum83-lead-routing` | 5184 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (278kB). Không có script test/lint. |
| 17 | `S04-05-Scrum91-opportunity-close` | 5186 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (311kB). Không có script test/lint. |
| 18 | `S04-05-Scrum92-revenue-forecast` | 5187 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (303kB). Không có script test/lint. |
| 19 | `S04-05-Scrum93-stagnant-opportunity-alert` | 5188 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (334kB). Không có script test/lint. |
| 20 | `S04-05-Scrum94-reassign-opportunity` | 5189 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (329kB). Không có script test/lint. |
| 21 | `S04-06-Scrum101-sales-calendar` | 5190 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (318kB). Không có script test/lint. |
| 22 | `S04-06-Scrum102-customer-timeline` | 5191 | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build thành công (318kB). Không có script test/lint. |

---

## 5. CHI TIẾT KIỂM THỬ BUILD 6 PHÂN HỆ BỔ SUNG (SCRUM-82, 83, 91, 92, 93, 94)

Theo yêu cầu kiểm tra thực tế các phân hệ trước đó chưa được chạy build:

### 5.1. Module `S04-04-Scrum82-lead-scoring`
- **Lệnh thực hiện:** `npm install; npm run build` tại thư mục `S04-04-Scrum82-lead-scoring`
- **Mã thoát (Exit Code):** `0`
- **Kết quả:** **PASS**
- **Log gốc:**
  ```text
  added 20 packages, and audited 21 packages in 25s
  > lead-scoring-sales-director@1.0.0 build
  > vite build
  vite v8.3.5 building client environment for production...
  transforming...
  ✓ 1944 modules transformed.
  rendering chunks...
  dist/index.html                   1.16 kB │ gzip:  0.69 kB
  dist/assets/index-BKVVpyQI.css   10.91 kB │ gzip:  2.70 kB
  dist/assets/index-CG9ckvds.js   282.82 kB │ gzip: 85.15 kB
  ✓ built in 976ms
  ```

### 5.2. Module `S04-04-Scrum83-lead-routing`
- **Lệnh thực hiện:** `npm install; npm run build` tại thư mục `S04-04-Scrum83-lead-routing`
- **Mã thoát (Exit Code):** `0`
- **Kết quả:** **PASS**
- **Log gốc:**
  ```text
  added 20 packages, and audited 21 packages in 20s
  > lead-routing-sales-director@1.0.0 build
  > vite build
  vite v8.3.5 building client environment for production...
  transforming...
  ✓ 1945 modules transformed.
  rendering chunks...
  dist/index.html                   1.15 kB │ gzip:  0.68 kB
  dist/assets/index-DACbxVJT.css    9.82 kB │ gzip:  2.50 kB
  dist/assets/index-hafZDedG.js   278.73 kB │ gzip: 85.04 kB
  ✓ built in 940ms
  ```

### 5.3. Module `S04-05-Scrum91-opportunity-close`
- **Lệnh thực hiện:** `npm install; npm run build` tại thư mục `S04-05-Scrum91-opportunity-close`
- **Mã thoát (Exit Code):** `0`
- **Kết quả:** **PASS**
- **Log gốc:**
  ```text
  added 20 packages, and audited 21 packages in 20s
  > scrum91-opportunity-close-management@1.0.0 build
  > vite build
  vite v8.3.5 building client environment for production...
  transforming...
  ✓ 1949 modules transformed.
  rendering chunks...
  dist/index.html                   1.11 kB │ gzip:  0.66 kB
  dist/assets/index-BRErP0rb.css   18.11 kB │ gzip:  4.04 kB
  dist/assets/index-bQ7SJ3Yx.js   311.69 kB │ gzip: 91.30 kB
  ✓ built in 915ms
  ```

### 5.4. Module `S04-05-Scrum92-revenue-forecast`
- **Lệnh thực hiện:** `npm install; npm run build` tại thư mục `S04-05-Scrum92-revenue-forecast`
- **Mã thoát (Exit Code):** `0`
- **Kết quả:** **PASS**
- **Log gốc:**
  ```text
  added 20 packages, and audited 21 packages in 26s
  > scrum92-revenue-forecast-weighted-probability@1.0.0 build
  > vite build
  vite v8.3.5 building client environment for production...
  transforming...
  ✓ 1951 modules transformed.
  rendering chunks...
  dist/index.html                   1.12 kB │ gzip:  0.66 kB
  dist/assets/index-ZxvDA3qx.css   17.14 kB │ gzip:  3.79 kB
  dist/assets/index-CZHa2eTU.js   303.43 kB │ gzip: 90.71 kB
  ✓ built in 888ms
  ```

### 5.5. Module `S04-05-Scrum93-stagnant-opportunity-alert`
- **Lệnh thực hiện:** `npm install; npm run build` tại thư mục `S04-05-Scrum93-stagnant-opportunity-alert`
- **Mã thoát (Exit Code):** `0`
- **Kết quả:** **PASS**
- **Log gốc:**
  ```text
  added 20 packages, and audited 21 packages in 25s
  > scrum93-stagnant-opportunity-alert@1.0.0 build
  > vite build
  vite v8.3.5 building client environment for production...
  transforming...
  ✓ 1953 modules transformed.
  rendering chunks...
  dist/index.html                   1.18 kB │ gzip:  0.71 kB
  dist/assets/index-Dh10g_9f.css   15.33 kB │ gzip:  3.61 kB
  dist/assets/index-CMxgTyKP.js   334.78 kB │ gzip: 97.14 kB
  ✓ built in 942ms
  ```

### 5.6. Module `S04-05-Scrum94-reassign-opportunity`
- **Lệnh thực hiện:** `npm install; npm run build` tại thư mục `S04-05-Scrum94-reassign-opportunity`
- **Mã thoát (Exit Code):** `0`
- **Kết quả:** **PASS**
- **Log gốc:**
  ```text
  added 20 packages, and audited 21 packages in 23s
  > scrum94-reassign-opportunity@1.0.0 build
  > vite build
  vite v8.3.5 building client environment for production...
  transforming...
  ✓ 1951 modules transformed.
  rendering chunks...
  dist/index.html                   1.19 kB │ gzip:  0.71 kB
  dist/assets/index-Op32P0kz.css   19.15 kB │ gzip:  4.26 kB
  dist/assets/index-C1QFAhjL.js   329.48 kB │ gzip: 97.43 kB
  ✓ built in 871ms
  ```

---

## 6. NHẬT KÝ LỖI KỸ THUẬT & GIẢ THUYẾT NGUYÊN NHÂN

*(Các nguyên nhân chưa được xác nhận thông qua việc sửa và chạy thực tế được ghi nhận là **Giả thuyết kỹ thuật**)*

### LỖI 1: Root App sập khi khởi chạy (HTTP 500 / Unresolved Import)
- **Phân loại:** Lỗi ứng dụng (Application Bug - Blocker)
- **Module:** Root (`qa-crm-frontend`)
- **Commit được kiểm thử:** `ae1701e7cdf23a50aa6953514c6e0d5d30455ed8` (dòng 3 file `src/main.jsx`)
- **Lệnh:** `npm run build`
- **Exit Code:** `1`
- **Log thực tế:**
  ```text
  [UNRESOLVED_IMPORT] Could not resolve './index.css' in src/main.jsx
     ╭─[ src/main.jsx:3:8 ]
   3 │ import "./index.css";
     │        ──────┬──────  
     │              ╰──────── Module not found.
  ```
- **Bước tái hiện:** Tại thư mục gốc chạy `npm run dev`, mở trình duyệt tới `http://localhost:3000/`. Vite trả về HTTP 500.
- **Giả thuyết kỹ thuật:** Commit `ae1701e` đã sửa dòng import trong `src/main.jsx` thành `./index.css`, nhưng file stylesheet thực tế nằm tại `src/styles.css`.

---

### LỖI 2: Thiếu file cấu hình ESLint 10 tại Root App
- **Phân loại:** Lỗi cấu hình (Configuration Bug)
- **Module:** Root (`qa-crm-frontend`)
- **Commit:** `c55789f`
- **Lệnh:** `npm run lint`
- **Exit Code:** `1`
- **Log thực tế:**
  ```text
  ESLint couldn't find an eslint.config.* file.
  From ESLint v9.0.0, the default configuration file is now eslint.config.*.
  ```
- **Bước tái hiện:** Tại thư mục gốc chạy `npm run lint`.
- **Giả thuyết kỹ thuật:** `package.json` cài đặt ESLint 10 nhưng chưa bổ sung file `eslint.config.js` theo định dạng Flat Config.

---

### LỖI 3: Unit test thất bại tại `EP-05-opportunity-sharing-frontend`
- **Phân loại:** Lỗi test (Test / Mock Bug)
- **Module:** `EP-05-opportunity-sharing-frontend`
- **Commit:** `c55789f`
- **Lệnh:** `node --test src/utils/shareLogic.test.js`
- **Exit Code:** `1`
- **Log thực tế:**
  ```text
  ✖ chủ sở hữu có thể thêm nhiều thành viên và tạo audit log (2.6416ms)
    AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    + actual: 'activity_logged'
    - expected: 'member_added'
  ✖ chỉ chủ sở hữu mới được xóa thành viên chia sẻ (0.5418ms)
  ✖ chuyển owner thay đổi chủ sở hữu, giữ chủ cũ trong team và ghi log có lý do (0.4515ms)
  ℹ tests 10 | pass 7 | fail 3
  ```
- **Bước tái hiện:** `cd EP-05-opportunity-sharing-frontend && node --test src/utils/shareLogic.test.js`
- **Giả thuyết kỹ thuật:** Biến `now` trong file test bị gán cứng là `'2026-10-17'`, trong khi dữ liệu mồi (`seed.js`) sinh ngày tự động dựa trên ngày hiện tại `new Date()` (22/10/2026). Khi hàm `addAudit()` sắp xếp log giảm dần theo thời gian, log mới bị đẩy ra sau log mồi của ngày hôm nay, khiến kiểm tra `audit[0]` nhận được `'activity_logged'` thay vì loại mong muốn.

---

### LỖI 4: Vitest thất bại tại `EP-05-opportunity-history-frontend`
- **Phân loại:** Lỗi test & Môi trường runtime (Test & Environment Bug)
- **Module:** `EP-05-opportunity-history-frontend`
- **Commit:** `c55789f`
- **Lệnh:** `npm test`
- **Exit Code:** `1`
- **Log thực tế:**
  ```text
  FAIL src/utils/history.test.js: expected '\ufeff"Thời điểm"...' to contain '200.000.000 ₫'
  - Expected: 200.000.000 ₫ (\u0020)
  + Received: 200.000.000\u00a0₫ (\u00a0)

  FAIL src/App.test.jsx: TypeError: Cannot read properties of undefined (reading 'clear')
   ❯ src/App.test.jsx:7:16: localStorage.clear();
  ```
- **Bước tái hiện:** `cd EP-05-opportunity-history-frontend && npm test`
- **Giả thuyết kỹ thuật:**
  1. `Intl.NumberFormat('vi-VN')` trên Node mới dùng ký tự non-breaking space (`\u00A0`), trong khi test case viết bằng khoảng trắng ASCII (`\u0020`).
  2. Flag `--experimental-localstorage` trên Node v26 xung đột với đối tượng mock `localStorage` của JSDOM khi chạy Vitest.

---

### LỖI 5: Lỗi React Hook `set-state-in-effect` trên 2 phân hệ
- **Phân loại:** Lỗi mã nguồn (Application / React Hook Bug)
- **Modules:** `crm-customer-management` và `EP-05-Sales-Pipeline-Nam`
- **Lệnh:** `npm run lint`
- **Exit Code:** `0` (với thông báo lỗi eslint)
- **Log thực tế:**
  ```text
  crm-customer-management:
  ContactForm.jsx:28:7 error Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)
  CustomerForm.jsx:35:7 error Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)

  EP-05-Sales-Pipeline-Nam:
  App.jsx:144:7 error Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)
  ```
- **Bước tái hiện:** `npm run lint` tại 2 thư mục trên.
- **Giả thuyết kỹ thuật:** Component gọi `setState` đồng bộ ngay trong thân `useEffect` gây re-render liên tầng, vi phạm quy tắc khắt khe của React 19 và ESLint plugin mới.

---

### LỖI 6: Thiếu file entrypoint `src/main.jsx` tại `EP-06-CSR103-reminders-frontend`
- **Phân loại:** Lỗi ứng dụng (Application Bug - Missing Entrypoint)
- **Module:** `EP-06-CSR103-reminders-frontend`
- **Commit:** `c55789f`
- **Lệnh:** `npm run build`
- **Exit Code:** `1`
- **Log thực tế:**
  ```text
  [vite:build-html] Failed to resolve /src/main.jsx from index.html
  file: C:/Users/Dell Precision 5550/qa-crm-frontend/EP-06-CSR103-reminders-frontend/index.html
  ```
- **Bước tái hiện:** `cd EP-06-CSR103-reminders-frontend && npm run build`
- **Giả thuyết kỹ thuật:** File `index.html` gọi `/src/main.jsx`, nhưng trong thư mục `src/` chỉ có `App.jsx`, `styles.css`, `data/`, `utils/`, không có file `main.jsx`.

---

### LỖI 7: Trình duyệt tự động bị chặn tải Playwright Driver
- **Phân loại:** Lỗi môi trường (Environment Bug - BLOCKED)
- **Hạ tầng:** Antigravity Browser Runner
- **Log thực tế:**
  ```text
  failed to create browser context: failed to run playwright manager: failed to install playwright: could not install driver: got non 200 status code: 404 (404 Not Found) from https://playwright.azureedge.net/builds/driver/playwright-1.57.0-win32_x64.zip
  ```
- **Đánh giá:** Lỗi tải CDN Azure của Playwright 1.57.0 trên Windows khiến kiểm thử tự động trên browser bị **BLOCKED**. Cần tiến hành kiểm thử thủ công theo checklist dưới đây.

---

## 7. CHECKLIST KIỂM THỬ THỦ CÔNG (MANUAL QA CHECKLIST)

*(Mỗi mục được tách bạch rõ giữa **Kết quả mong đợi đúng nghiệp vụ** và **Kết quả lỗi thực tế hiện tại**. Tester/Developer thực hiện kiểm thử thực tế và đánh dấu kết quả)*

### 📋 CHECKLIST 1: ỨNG DỤNG GỐC CRM (`qa-crm-frontend`) - Ưu tiên cao
- [ ] **Mục 1.1: Khởi động và kiểm tra màn hình đăng nhập**
  - **Lệnh chạy:** Mở terminal tại `qa-crm-frontend`, chạy `npm run dev`.
  - **Thao tác:** Mở trình duyệt truy cập `http://localhost:3000/`.
  - **Kết quả lỗi thực tế hiện tại:** Màn hình Error Overlay đỏ của Vite hiển thị với lỗi 500: `Failed to resolve import "./index.css" from "src/main.jsx"`.
  - **Kết quả mong đợi đúng nghiệp vụ:** Màn hình hiển thị giao diện Đăng nhập CRM hoàn chỉnh (logo, ô nhập tài khoản, mật khẩu, nút Đăng nhập).
- [ ] **Mục 1.2: Kiểm tra cảnh báo khi thiếu Backend API**
  - **Thao tác:** Khi đang ở form Đăng nhập và Backend (`http://127.0.0.1:8000`) chưa chạy, nhập tài khoản bất kỳ và bấm "Đăng nhập".
  - **Kết quả mong đợi đúng nghiệp vụ:** Xuất hiện thông báo lỗi màu đỏ: *"Không thể kết nối tới máy chủ. Hãy kiểm tra Backend đang chạy tại http://127.0.0.1:8000."*
- [ ] **Mục 1.3: Điều hướng các trang chức năng (khi có phiên đăng nhập hợp lệ)**
  - **Thao tác:** Đăng nhập thành công và bấm các menu trên Sidebar: Khách hàng 360°, Lead, Chiến dịch, Sản phẩm, Quản lý người dùng.
  - **Kết quả mong đợi đúng nghiệp vụ:** Sidebar highlight đúng menu đang chọn, nội dung vùng Main đổi trang tương ứng mà không tải lại toàn trang.

---

### 📋 CHECKLIST 2: TÌM KIẾM & LỌC CƠ HỘI (`EP-05-opportunity-filter-frontend`) - Ưu tiên cao
- [ ] **Mục 2.1: Tìm kiếm tiếng Việt không dấu**
  - **Lệnh chạy:** `cd EP-05-opportunity-filter-frontend && npm run dev` (Cổng 5173).
  - **Thao tác:** Nhập từ khóa không dấu `thoa` vào thanh tìm kiếm.
  - **Kết quả mong đợi đúng nghiệp vụ:** Danh sách lọc ra đúng các cơ hội có chứa từ `Thỏa thuận` mà không phân biệt chữ hoa/thường hay dấu tiếng Việt.
- [ ] **Mục 2.2: Lọc kết hợp nhiều điều kiện (Giai đoạn, Giá trị, Ngày chốt)**
  - **Thao tác:** Chọn Giai đoạn = `Đề xuất giải pháp`, nhập khoảng giá trị từ `100.000.000` đến `500.000.000`.
  - **Kết quả mong đợi đúng nghiệp vụ:** Bảng dữ liệu hiển thị chính xác các cơ hội thỏa mãn đồng thời tất cả các tiêu chí (logic AND). Nếu nhập khoảng giá trị không hợp lệ (min > max), hệ thống hiển thị thông báo lỗi rõ ràng.
- [ ] **Mục 2.3: Lưu bộ lọc (Preset) và khôi phục sau tải lại trang**
  - **Thao tác:** Thiết lập một bộ lọc, bấm "Lưu bộ lọc", nhập tên `Bộ lọc Dự án Lớn`. Sau đó tải lại trang (F5).
  - **Kết quả mong đợi đúng nghiệp vụ:** Bộ lọc đã lưu vẫn hiển thị trong danh sách preset và khi bấm chọn sẽ tự động áp dụng lại các điều kiện đã lưu.
- [ ] **Mục 2.4: Xuất dữ liệu CSV**
  - **Thao tác:** Bấm nút "Xuất CSV".
  - **Kết quả mong đợi đúng nghiệp vụ:** Trình duyệt tải về file `.csv` có UTF-8 BOM, khi mở bằng Microsoft Excel hiển thị đúng dấu tiếng Việt không bị lỗi font (mojibake).

---

### 📋 CHECKLIST 3: GHI NHẬN CUỘC GỌI NHANH (`EP-06-CSR104-call-logging-frontend`) - Ưu tiên cao
- [ ] **Mục 3.1: Ghi nhận cuộc gọi kết nối thành công**
  - **Lệnh chạy:** `cd EP-06-CSR104-call-logging-frontend && npm run dev` (Cổng 5173).
  - **Thao tác:** Chọn khách hàng từ dropdown, chọn kết quả cuộc gọi là `Thành công / Đã kết nối`, nhập ghi chú và bấm "Lưu cuộc gọi".
  - **Kết quả mong đợi đúng nghiệp vụ:** Cuộc gọi xuất hiện ngay lập tức trên đầu bảng lịch sử và tự động liên kết với cơ hội đang mở mới nhất của khách hàng.
- [ ] **Mục 3.2: Lên lịch hẹn gọi lại và kiểm tra validation ngày giờ**
  - **Thao tác:** Chọn kết quả `Hẹn gọi lại`, thử để trống ngày giờ gọi lại hoặc chọn thời gian trong quá khứ.
  - **Kết quả mong đợi đúng nghiệp vụ:** Hệ thống chặn lưu và hiển thị thông báo lỗi yêu cầu chọn thời gian hợp lệ trong tương lai. Khi chọn thời gian tương lai hợp lệ, lịch hẹn được tạo thành công.

---

### 📋 CHECKLIST 4: QUẢN LÝ TÀI LIỆU ĐÍNH KÈM CƠ HỘI (`EP-05-SCR98`)
- [ ] **Mục 4.1: Kiểm tra tải lên file và giới hạn dung lượng 20MB**
  - **Lệnh chạy:** `cd EP-05-SCR98-opportunity-documents-frontend && npm run dev` (Cổng 5173).
  - **Thao tác:** Chọn tải lên file có dung lượng dưới 20MB và file trên 20MB.
  - **Kết quả mong đợi đúng nghiệp vụ:** File dưới 20MB được chấp nhận và hiển thị trong danh sách; file vượt quá 20MB bị từ chối kèm cảnh báo rõ ràng.
- [ ] **Mục 4.2: Lọc tài liệu theo định dạng và tìm kiếm**
  - **Thao tác:** Lọc theo loại tệp (PDF, Word, Excel, Hình ảnh) và gõ từ khóa tìm kiếm tên file.
  - **Kết quả mong đợi đúng nghiệp vụ:** Danh sách tài liệu phản hồi chính xác theo loại tệp và từ khóa.

---

### 📋 CHECKLIST 5: PHÂN BỔ LEAD VÀ CẢNH BÁO SLA 24H (`lead-assignment-sla-Scr85-04`)
- [ ] **Mục 5.1: Nhận diện gắn cờ SLA cho lead quá hạn 24 giờ**
  - **Lệnh chạy:** `cd lead-assignment-sla-Scr85-04 && npm run dev` (Cổng 5173).
  - **Thao tác:** Quan sát danh sách lead chưa liên hệ quá 24h.
  - **Kết quả mong đợi đúng nghiệp vụ:** Lead quá hạn 24h được hiển thị huy hiệu gắn cờ cảnh báo SLA màu đỏ.
- [ ] **Mục 5.2: Tiếp nhận và từ chối lead**
  - **Thao tác:** Bấm nhận lead -> Trạng thái đổi sang `Đang chăm sóc` và xóa cờ SLA. Bấm từ chối mà không nhập lý do -> Bị chặn; nhập đủ lý do -> Trả về `Chờ phân bổ` và ghi nhật ký.

---

### 📋 CHECKLIST 6: LỊCH BÁN HÀNG VÀ DÒNG THỜI GIAN (`S04-06`)
- [ ] **Mục 6.1: Lịch bán hàng (`S04-06-Scrum101-sales-calendar`)**
  - **Lệnh chạy:** `cd S04-06-Scrum101-sales-calendar && npm run dev` (Cổng 5190).
  - **Thao tác:** Chuyển đổi giữa các chế độ xem Tháng, Tuần, Ngày; bấm vào ngày để thêm sự kiện cuộc hẹn.
  - **Kết quả mong đợi đúng nghiệp vụ:** Sự kiện mới xuất hiện đúng ô ngày giờ tương ứng trên lịch.
- [ ] **Mục 6.2: Dòng thời gian khách hàng (`S04-06-Scrum102-customer-timeline`)**
  - **Lệnh chạy:** `cd S04-06-Scrum102-customer-timeline && npm run dev` (Cổng 5191).
  - **Thao tác:** Lọc tương tác theo các tab (Tất cả, Cuộc gọi, Email, Cuộc họp, Ghi chú).
  - **Kết quả mong đợi đúng nghiệp vụ:** Dòng thời gian sắp xếp đúng thứ tự thời gian giảm dần và chỉ hiển thị đúng loại tương tác được lọc.

---

## 8. THÔNG TIN NHÁNH & PULL REQUEST

- **Nhánh QA:** `qa/full-repo-audit-report` (tách từ `main`).
- **Tài khoản tạo PR:** `dtc245200270`
- **Trạng thái PR:** Đã tạo Pull Request chính thức vào nhánh `main` (**chưa merge**).
- **Mã số và Đường dẫn PR:**
  👉 **Pull Request #31:** [https://github.com/ttcs-t926-k4s5-n4/he-thong-quan-ly-khach-hang-frontend/pull/31](https://github.com/ttcs-t926-k4s5-n4/he-thong-quan-ly-khach-hang-frontend/pull/31)
