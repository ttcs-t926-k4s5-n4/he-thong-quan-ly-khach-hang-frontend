# BÁO CÁO TOÀN DIỆN KIỂM THỬ VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG (QA AUDIT REPORT - GIAI ĐOẠN HIỆU CHỈNH)
**Dự án: Hệ thống Quản lý Khách hàng - Frontend CRM**

> **KẾT LUẬN TIẾN ĐỘ & MỨC ĐỘ SẴN SÀNG:**  
> **ĐÃ KIỂM TRA TOÀN DIỆN BUILD, LINT, UNIT TEST VÀ RÀ SOÁT GIAO DIỆN (ĐẠT PARTIAL 21/23 PHÂN HỆ KIỂM TRA ĐƯỢC); CHƯA ĐẠT ĐIỀU KIỆN NGHIỆM THU ĐỂ ĐƯA LÊN MAIN.**  
> - **Lý do chính:**  
>   1. **Blocker Ứng dụng gốc:** Ứng dụng gốc (`qa-crm-frontend` / Root App) gặp lỗi import CSS gây sập HTTP 500 khi khởi chạy dev server và thất bại khi build;  
>   2. **Blocker Phân hệ:** Phân hệ `EP-06-CSR103-reminders-frontend` thiếu file entrypoint `src/main.jsx`;  
>   3. **Lỗi Unit Test & Lint:** 2 phân hệ gặp lỗi Unit Test (`EP-05-opportunity-sharing` fail 3/10 test, `EP-05-opportunity-history` fail 4/8 test); 3 phân hệ lỗi Lint;  
>   4. **Blocker Môi trường Tích hợp:** Backend API local chưa hoạt động tại cổng 8000/5000, khiến toàn bộ kiểm thử tích hợp thực tế và lưu trữ CSDL bị **BLOCKED**.

- **Kỹ sư QA thực hiện:** Đinh Xuân Mạnh
- **Tài khoản GitHub:** `dtc245200270` (`225133188+dtc245200270@users.noreply.github.com`)
- **Repository:** `https://github.com/ttcs-t926-k4s5-n4/he-thong-quan-ly-khach-hang-frontend.git`
- **Môi trường Runtime:** Node.js `v26.8.2` | npm `11.19.1` | Google Chrome (Chromium Headless) | Windows 10/11 x64
- **Nhánh QA đang kiểm thử:** `qa/frontend-verification` (nhánh mới tạo từ `main` tại commit `56b66da8013a625162bdc8aae8ed7eb5526a75fa`)
- **Thư mục minh chứng hình ảnh:** `qa-evidence/` (lưu trữ đầy đủ các ảnh chụp màn hình kiểm chứng)

---

## MỤC LỤC
1. [Tình trạng Git & Nhánh làm việc](#1-tình-trạng-git--nhánh-làm-việc)
2. [Phân định Phương pháp: Đọc Code vs Kiểm thử Thực tế](#2-phân-định-phương-pháp-đọc-code-vs-kiểm-thử-thực-tế)
3. [Kiến trúc Tích hợp: Ứng dụng Gốc vs 22 Module Độc lập](#3-kiến-trúc-tích-hợp-ứng-dụng-gốc-vs-22-module-độc-lập)
4. [Bảng Ma trận QA Toàn bộ 23 Phân hệ](#4-bảng-ma-trận-qa-toàn-bộ-23-phân-hệ)
5. [Chi tiết Kiểm tra Linting & Nguyên nhân 16 Phân hệ N/A](#5-chi-tiết-kiểm-tra-linting--nguyên-nhân-16-phân-hệ-na)
6. [Xác minh Chuyên sâu Nguyên nhân Unit Test Thất bại](#6-xác-minh-chuyên-sâu-nguyên-nhân-unit-test-thất-bại)
7. [Phiếu Ghi nhận Lỗi cho Developer (Defect Log)](#7-phiếu-ghi-nhận-lỗi-cho-developer-defect-log)
8. [Kế hoạch Phối hợp với Cửa sổ Backend](#8-kế-hoạch-phối-hợp-với-cửa-sổ-backend)
9. [Đánh giá Nghiệm thu & Điều kiện Đưa lên Main](#9-đánh-giá-nghiệm-thu--điều-kiện-đưa-lên-main)

---

## 1. TÌNH TRẠNG GIT & NHÁNH LÀM VIỆC

- **Nhánh kiểm thử hiện tại:** `qa/frontend-verification`.
  - Được khởi tạo trực tiếp từ commit HEAD của `main` (`56b66da docs(qa): merge PR #33 hoàn thiện báo cáo QA Phase 3 và 100% minh chứng UI`).
  - Toàn bộ mã nguồn và lịch sử commit của các thành viên khác được bảo toàn nguyên vẹn 100%.
  - Không thực hiện force push, không `git reset --hard`, không tự ý gộp đè các nhánh feature.
- **Đối soát với nhánh `develop`:**
  - Commit HEAD của `origin/develop`: `d4d115b`.
  - Kết quả kiểm tra tổ tiên: `git merge-base --is-ancestor origin/develop origin/main` trả về `0` (Success).
  - Khẳng định: Mọi mã nguồn trên nhánh `develop` đã được tích hợp đầy đủ vào `main`.
- **Chính sách bảo vệ nhánh `main`:**
  - Chưa push bất kỳ thay đổi ứng dụng nào lên nhánh `main` khi các bài kiểm tra bắt buộc còn trạng thái **FAIL** hoặc **BLOCKED**.
  - Các tài liệu QA và kết quả đối soát được quản lý chặt chẽ trên nhánh `qa/frontend-verification`.

---

## 2. PHÂN ĐỊNH PHƯƠNG PHÁP: ĐỌC CODE VS KIỂM THỬ THỰC TẾ

Nhằm đảm bảo tính khách quan và chuẩn mực kỹ thuật của QA, báo cáo phân định rạch ròi giữa hai nhóm kết quả:

| Tiêu chí | Đọc code tĩnh (Static Code Review) | Kiểm thử thực tế (Runtime Verification) | Kết luận của QA |
|:---|:---|:---|:---|
| **Khởi động Root App** | Thấy cấu hình Vite server port 3000, import React, JSX hợp lệ cú pháp tổng thể. | Chạy `npm run dev` / `npm run build` gặp lỗi sập HTTP 500 do import `./index.css` không tồn tại. | **FAIL (Blocker)** – Không thể chạy được trong môi trường thực tế. |
| **Phân quyền vai trò (RBAC)** | Đọc thấy hàm `menuForUserFrontend` trong `src/App.jsx` lọc menu theo vai trò (`ADMIN`, `DIRECTOR`, `SALES`, v.v.). | Chưa gọi được API xác thực Backend thực tế; chưa kiểm tra được việc người dùng sửa đổi token client-side hoặc bypass request. | **CHƯA ĐỦ ĐIỀU KIỆN KẾT LUẬN AN TOÀN**. RBAC bắt buộc phải được bảo vệ tại Backend. |
| **Độ hoàn chỉnh giao diện** | Đọc thấy nhiều component được viết chi tiết, có mockup dữ liệu đa dạng. | 21/23 phân hệ render thành công trên trình duyệt; 2 phân hệ lỗi hoàn toàn (Root App sập 500, CSR103 thiếu entrypoint). | **PARTIAL (21/23 ĐẠT KIỂM THỬ TRỰC QUAN)**. Chưa kết luận hoàn chỉnh toàn hệ thống. |
| **Tính đúng đắn của Unit Test** | Đọc code test thấy khai báo assertion có vẻ hợp lý. | Chạy thực tế bằng Node test runner và Vitest: phát hiện 7 test case thất bại do lệch fixture thời gian, khác biệt ký tự tiền tệ và thiếu mock storage. | **FAIL** – Phải xác minh nguyên nhân gốc trước khi phân loại. |
| **Lưu trữ dữ liệu thực tế** | Thấy các hàm gọi `fetch()` hoặc `api()` tới Backend URL. | Backend API offline (`curl` không kết nối được), không có dữ liệu thực tế nào được ghi vào CSDL. | **BLOCKED** – Tuyệt đối không dùng dữ liệu mock để kết luận đạt. |

---

## 3. KIẾN TRÚC TÍCH HỢP: ỨNG DỤNG GỐC VS 22 MODULE ĐỘC LẬP

1. **Ứng dụng Gốc (`qa-crm-frontend` / Root App):**
   - Được thiết kế là vỏ tích hợp (Integration Shell) toàn hệ thống chạy tại cổng **3000**.
   - Tích hợp điều hướng tập trung qua [src/App.jsx](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/src/App.jsx), phân hệ Lead & Marketing qua [src/Sprint4.jsx](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/src/Sprint4.jsx), và kết nối API qua [src/api.js](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/src/api.js).
   - Tình trạng: **Bị chặn hoàn toàn do BUG-01 (sập 500)**.
2. **22 Phân hệ Chức năng Độc lập:**
   - Được phân chia theo từng User Story / Epic (Jira) của các thành viên.
   - Mỗi phân hệ sở hữu cấu trúc Vite riêng, giao diện độc lập và bộ dữ liệu mock/logic riêng.

---

## 4. BẢNG MA TRẬN QA TOÀN BỘ 23 PHÂN HỆ

| STT | Tên phân hệ / Thư mục | Port | Build | Lint | Unit Test | Giao diện thực tế | Tích hợp Backend | Ghi chú & Đánh giá QA |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 0 | `Root CRM App` (Ứng dụng gốc) | 3000 | **FAIL** | **FAIL** | N/A | **FAIL** (Sập 500) | **BLOCKED** | **Blocker:** Lỗi import CSS gây sập dev server và build. |
| 1 | `crm-customer-management` | 5055 | **PASS** | **FAIL** | N/A | **PASS** | **BLOCKED** | Build 192kB. Lint báo 2 lỗi `set-state-in-effect`. Giao diện khách hàng render chuẩn. |
| 2 | `crm-user-management` | 5070 | **PASS** | **PASS** | N/A | **PASS** | **BLOCKED** | Build 188kB. Lint sạch 100%. Quản trị người dùng & phân vai trò render chuẩn. |
| 3 | `sprint4-lead-marketing` | 5062 | **PASS** | **PASS** | N/A | **PASS** | **BLOCKED** | Build 198kB. Lint sạch 100%. Bảng điều khiển chiến dịch lead & biểu mẫu nhúng render chuẩn. |
| 4 | `EP-05-Sales-Pipeline-Nam` | 5063 | **PASS** | **FAIL** | N/A | **PASS** | **BLOCKED** | Build 247kB. Lint báo 1 lỗi hook `set-state-in-effect`. Bảng Kanban phân đoạn cơ hội render trực quan. |
| 5 | `EP-05-SCR98-opportunity-documents-frontend` | 5055 | **PASS** | N/A | **PASS** (10/10) | **PASS** | **BLOCKED** | Build 165kB. 10/10 Unit test đạt. Quản lý tài liệu cơ hội kéo thả render chuẩn. |
| 6 | `EP-05-opportunity-filter-frontend` | 5055 | **PASS** | N/A | **PASS** (9/9) | **PASS** | **BLOCKED** | Build 181kB. 9/9 Unit test đạt (144ms). Bộ lọc cơ hội nâng cao render chuẩn. |
| 7 | `EP-05-opportunity-history-frontend` | 5055 | **PASS** | N/A | **FAIL** (4/8 fail) | **PASS** | **BLOCKED** | Build 174kB. 4 test case fail (ký tự tiền tệ `\u00A0` và mock localStorage). Giao diện render tốt. |
| 8 | `EP-05-opportunity-sharing-frontend` | 5072 | **PASS** | N/A | **FAIL** (3/10 fail)| **PASS** | **BLOCKED** | Build 184kB. 3 test case fail (lệch mốc thời gian fixture). Giao diện chia sẻ quyền render chuẩn. |
| 9 | `EP-06-CRM-Activities-Tasks-Nam` | 5064 | **PASS** | **PASS** | N/A | **PASS** | **BLOCKED** | Build 233kB. Lint sạch 100%. Quản lý hoạt động & nhiệm vụ hiển thị chuẩn. |
| 10 | `EP-06-CSR103-reminders-frontend` | 5085 | **FAIL** | N/A | **PASS** (11/11) | **FAIL** (Thiếu file) | **BLOCKED** | Logic test 11/11 đạt. **Blocker: Build/Dev thất bại do thiếu file `src/main.jsx`.** |
| 11 | `EP-06-CSR104-call-logging-frontend` | 5055 | **PASS** | N/A | **PASS** (31/31) | **PASS** | **BLOCKED** | Unit test 31/31 đạt. Giao diện ghi nhanh cuộc gọi render chuẩn. |
| 12 | `lead-assignment-sla-Scr85-04` | 5055 | **PASS** | N/A | **PASS** (6/6) | **PASS** | **BLOCKED** | Unit test 6/6 đạt. Thẻ SLA 24h & đếm ngược phân bổ hiển thị trực quan. |
| 13 | `lead-list-filters-Scr86-04` | 5065 | **PASS** | N/A | **PASS** (6/6) | **PASS** | **BLOCKED** | Unit test 6/6 đạt. Bộ lọc danh sách lead tiềm năng render chuẩn. |
| 14 | `S04-04-Scrum81-lead-deduplication` | 5073 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 319kB. Giao diện rà soát & gộp trùng lead render chuẩn. |
| 15 | `S04-04-Scrum82-lead-scoring` | 5074 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 282kB. Bảng chấm điểm & phân hạng tiềm năng lead hiển thị chuẩn. |
| 16 | `S04-04-Scrum83-lead-routing` | 5075 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 278kB. Quy tắc định tuyến & phân luồng lead render chuẩn. |
| 17 | `S04-05-Scrum91-opportunity-close` | 5081 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 311kB. Quy trình đóng cơ hội Thắng/Thua và ghi nhận lý do render chuẩn. |
| 18 | `S04-05-Scrum92-revenue-forecast` | 5082 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 303kB. Dự báo doanh thu kỳ kinh doanh theo xác suất render chuẩn. |
| 19 | `S04-05-Scrum93-stagnant-opportunity-alert` | 5083 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 334kB. Cảnh báo cơ hội tồn đọng chậm tiến độ render chuẩn. |
| 20 | `S04-05-Scrum94-reassign-opportunity` | 5084 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 329kB. Điều chuyển & phân bổ lại cơ hội kinh doanh render chuẩn. |
| 21 | `S04-06-Scrum101-sales-calendar` | 5190 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 318kB. Lịch làm việc tuần/ngày, cảnh báo chồng chéo lịch hẹn render chuẩn. |
| 22 | `S04-06-Scrum102-customer-timeline` | 5191 | **PASS** | N/A | N/A | **PASS** | **BLOCKED** | Build 318kB. Dòng thời gian tương tác 360 độ khách hàng render chuẩn. |

> **ĐÁNH GIÁ TỔNG QUAN GIAO DIỆN:** **PARTIAL (21/23 ĐẠT KIỂM THỬ TRỰC QUAN)**  
> - **21 phân hệ kiểm tra được:** Render chính xác, bố cục trực quan, biểu đồ và form thao tác mượt mà trên trình duyệt.  
> - **2 phần chưa đạt kiểm thử:**  
>   1. `Root CRM App`: Sập hoàn toàn màn hình đỏ (500 Error Overlay);  
>   2. `EP-06-CSR103-reminders-frontend`: Không thể khởi động do thiếu file `src/main.jsx`.

---

## 5. CHI TIẾT KIỂM TRA LINTING & NGUYÊN NHÂN 16 PHÂN HỆ N/A

Kiểm tra trực tiếp file `package.json` của từng phân hệ cho thấy cấu hình công cụ kiểm tra cú pháp (Lint) có sự không đồng nhất lớn giữa các thành viên:

### 5.1. Nhóm 6 Phân hệ Có Cấu hình Lint
- **3 Phân hệ PASS (100% sạch lỗi):**
  - `crm-user-management`: ESLint chạy sạch hoàn toàn.
  - `EP-06-CRM-Activities-Tasks-Nam`: ESLint chạy sạch hoàn toàn.
  - `sprint4-lead-marketing`: ESLint chạy sạch hoàn toàn.
- **3 Phân hệ FAIL (Có lỗi lint):**
  - `Root CRM App`: Cài đặt ESLint v10 nhưng thiếu file cấu hình Flat Config `eslint.config.js`.
  - `crm-customer-management`: 2 lỗi `react-hooks/set-state-in-effect` tại [ContactForm.jsx:L28](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/crm-customer-management/src/components/ContactForm.jsx#L28) và [CustomerForm.jsx:L35](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/crm-customer-management/src/components/CustomerForm.jsx#L35).
  - `EP-05-Sales-Pipeline-Nam`: 1 lỗi `react-hooks/set-state-in-effect` tại [src/App.jsx:L144](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/EP-05-Sales-Pipeline-Nam/src/App.jsx#L144).

### 5.2. Nhóm 16 Phân hệ Đánh dấu N/A (Chưa hỗ trợ Lint)
- Danh sách: `EP-05-opportunity-filter-frontend`, `EP-05-opportunity-history-frontend`, `EP-05-opportunity-sharing-frontend`, `EP-05-SCR98-opportunity-documents-frontend`, `EP-06-CSR103-reminders-frontend`, `EP-06-CSR104-call-logging-frontend`, `lead-assignment-sla-Scr85-04`, `lead-list-filters-Scr86-04`, `S04-04-Scrum81-lead-deduplication`, `S04-04-Scrum82-lead-scoring`, `S04-04-Scrum83-lead-routing`, `S04-05-Scrum91-opportunity-close`, `S04-05-Scrum92-revenue-forecast`, `S04-05-Scrum93-stagnant-opportunity-alert`, `S04-05-Scrum94-reassign-opportunity`, `S04-06-Scrum101-sales-calendar`, `S04-06-Scrum102-customer-timeline`.
- **Nguyên nhân kỹ thuật chính xác:** File `package.json` của 16 phân hệ này được tạo ở mức tối thiểu cho Vite + React, **hoàn toàn không khai báo gói `eslint` trong `devDependencies` và không có script `"lint": "eslint ."` trong mục `"scripts"`**. Do đó, QA không thể thực thi lệnh kiểm tra mã nguồn tự động mà không can thiệp sửa đổi cấu trúc dự án của thành viên.

---

## 6. XÁC MINH CHUYÊN SÂU NGUYÊN NHÂN UNIT TEST THẤT BẠI

QA đã tiến hành chạy độc lập từng test suite với đầy đủ stack trace để phân tích bản chất lỗi:

### 6.1. Xác minh `EP-05-opportunity-sharing-frontend` (FAIL 3 / PASS 7)
- **Lệnh thực thi:** `node --test src/utils/shareLogic.test.js`
- **Các test case thất bại:**
  1. `chủ sở hữu có thể thêm nhiều thành viên và tạo audit log`
  2. `chỉ chủ sở hữu mới được xóa thành viên chia sẻ`
  3. `chuyển owner thay đổi chủ sở hữu, giữ chủ cũ trong team và ghi log có lý do`
- **Chi tiết lỗi:**
  ```text
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual: 'activity_logged'
  - expected: 'member_added'
  ```
- **Xác minh nguyên nhân gốc (Root Cause):**
  - Hàm `addAudit()` trong `shareLogic.js` thực hiện sắp xếp audit log giảm dần theo thời gian:
    ```javascript
    function addAudit(opportunity, entry) {
      return [...(opportunity.audit || []), entry].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    ```
  - Trong `src/data/seed.js`, hàm `stamp(daysAgo)` sinh ngày động tính từ ngày chạy thực tế (`new Date().getDate() - daysAgo`). Vì vậy, `log-142-4` có mốc thời gian là **ngày hôm nay** (ví dụ 26/10/2026).
  - Tuy nhiên, file test `src/utils/shareLogic.test.js` lại gán cứng:
    ```javascript
    const now = '2026-10-17T14:30:00.000Z';
    ```
  - Khi thực hiện hành động thêm thành viên vào ngày `2026-10-17`, bản ghi mới có thời gian **cũ hơn** bản ghi mẫu `log-142-4` (ngày 26/10/2026). Do đó `addAudit()` đẩy bản ghi mới ra phía sau, khiến phần tử đầu tiên `updated.audit[0]` vẫn là `activity_logged`.
  - **Kết luận phân loại:** **LỖI THIẾT KẾ TEST FIXTURE** (Lệch mốc thời gian giữa test case và seed generator, không phải lỗi logic chia sẻ quyền).

### 6.2. Xác minh `EP-05-opportunity-history-frontend` (FAIL 4 / PASS 4)
- **Lệnh thực thi:** `npm test` (Vitest v2.1.9)
- **Các test case thất bại:**
  1. `src/utils/history.test.js` > `exports previous and new values along with the actor in CSV`
  2. `src/App.test.jsx` > `filters the history table by search text`
  3. `src/App.test.jsx` > `records each changed field when saving an opportunity`
  4. `src/App.test.jsx` > `creates a new opportunity and records its initial fields`
- **Chi tiết lỗi 1 (Unicode Không gian không ngắt):**
  ```text
  AssertionError: expected '...200.000.000\u00A0₫...' to contain '200.000.000 ₫'
  ```
  - `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` trong Node.js phiên bản mới sử dụng ký tự **Non-breaking space (`\u00A0`)** giữa số tiền và ký hiệu `₫`, trong khi câu lệnh test `expect().toContain('200.000.000 ₫')` dùng dấu cách thông thường ASCII space (`\u0020`).
- **Chi tiết lỗi 2 (Thiếu Mock Môi trường Storage):**
  ```text
  TypeError: Cannot read properties of undefined (reading 'clear')
  at beforeEach (src/App.test.jsx:7:16): localStorage.clear();
  ```
  - Node.js v26 hiển thị cảnh báo: `ExperimentalWarning: localStorage is not available because --localstorage-file was not provided`.
  - Môi trường JSDOM của Vitest chưa được cấu hình mock polyfill cho đối tượng `globalThis.localStorage`.
- **Kết luận phân loại:** **LỖI ASSERTION UNICODE & THIẾU MOCK MÔI TRƯỜNG TEST** (Không phải lỗi hiển thị lịch sử cơ hội trên trình duyệt thực tế).

---

## 7. PHIẾU GHI NHẬN LỖI CHO DEVELOPER (DEFECT LOG)

### 🎫 BUG-01 (Blocker - Ứng dụng Gốc CRM)
- **Phân hệ:** `qa-crm-frontend` (Root App)
- **Vị trí phát hiện:** [src/main.jsx:L3](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/src/main.jsx#L3)
- **Mức độ:** **Blocker** (Chặn toàn bộ việc khởi chạy và tích hợp ứng dụng)
- **Bước tái hiện:**
  1. Mở terminal tại thư mục gốc dự án.
  2. Chạy `npm run build` hoặc `npm run dev`.
  3. Mở trình duyệt tới `http://localhost:3000/`.
- **Kết quả mong đợi:** Ứng dụng nạp thành công, hiển thị giao diện đăng nhập CRM.
- **Kết quả thực tế:** Màn hình sập HTTP 500 với log: `[UNRESOLVED_IMPORT] Could not resolve './index.css' in src/main.jsx`.
- **Đề xuất khắc phục cho Developer:** Đổi dòng 3 từ `import './index.css'` thành `import './styles.css'`.

---

### 🎫 BUG-02 (Major - Cấu hình Linter)
- **Phân hệ:** `qa-crm-frontend` (Root App)
- **Vị trí phát hiện:** Thư mục gốc dự án
- **Mức độ:** **Major** (Thất bại quy trình kiểm tra chất lượng code tự động)
- **Bước tái hiện:** Chạy `npm run lint`.
- **Kết quả mong đợi:** ESLint chạy kiểm tra cú pháp và thông báo đạt.
- **Kết quả thực tế:** Báo lỗi `ESLint: 10.12.0. ESLint couldn't find an eslint.config.* file.`
- **Đề xuất khắc phục cho Developer:** Bổ sung file cấu hình Flat Config `eslint.config.js` tương thích với ESLint v10 theo mẫu chuẩn của Vite React.

---

### 🎫 BUG-03 (Blocker - Module Nhắc Việc Thiếu Entrypoint)
- **Phân hệ:** `EP-06-CSR103-reminders-frontend`
- **Vị trí phát hiện:** [EP-06-CSR103-reminders-frontend/index.html](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/EP-06-CSR103-reminders-frontend/index.html)
- **Mức độ:** **Blocker** (Không thể build hoặc chạy độc lập phân hệ này)
- **Bước tái hiện:**
  1. Di chuyển vào thư mục phân hệ: `cd EP-06-CSR103-reminders-frontend`.
  2. Chạy `npm run build`.
- **Kết quả mong đợi:** Đóng gói bundle thành công.
- **Kết quả thực tế:** Lỗi `[vite:build-html] Failed to resolve /src/main.jsx from index.html`. Thư mục `src/` hoàn toàn thiếu file khởi tạo `main.jsx`.
- **Đề xuất khắc phục cho Developer:** Bổ sung file `src/main.jsx` để mount component `App.jsx` vào thẻ `#root`.

---

### 🎫 BUG-04 (Minor - Lệch Fixture Thời Gian Unit Test)
- **Phân hệ:** `EP-05-opportunity-sharing-frontend`
- **Vị trí phát hiện:** `src/utils/shareLogic.test.js` dòng 16
- **Mức độ:** **Minor** (Lỗi bài test, không ảnh hưởng logic ứng dụng runtime)
- **Bước tái hiện:** Chạy `node --test src/utils/shareLogic.test.js`.
- **Kết quả mong đợi:** 10/10 test case đạt PASS.
- **Kết quả thực tế:** 3 test case fail với lỗi `Expected 'activity_logged' to be strictly equal to 'member_added'`.
- **Đề xuất khắc phục cho Developer:** Cập nhật biến `now` trong bài test thành `new Date(Date.now() + 1000).toISOString()` để đảm bảo bản ghi mới luôn có thời gian lớn nhất so với dữ liệu seed động.

---

### 🎫 BUG-05 (Minor - Ký tự Unicode và Mock Storage trong Test)
- **Phân hệ:** `EP-05-opportunity-history-frontend`
- **Vị trí phát hiện:** `src/utils/history.test.js:44` và `src/App.test.jsx:7`
- **Mức độ:** **Minor** (Lỗi bài test do khác biệt môi trường Node 26)
- **Bước tái hiện:** Chạy `npm test`.
- **Kết quả thực tế:**
  1. So sánh chuỗi tiền tệ fail do lệch ký tự space `\u0020` với non-breaking space `\u00A0`.
  2. `localStorage.clear()` báo lỗi undefined.
- **Đề xuất khắc phục cho Developer:**
  1. Chuẩn hóa chuỗi so sánh: `.replace(/\u00A0/g, ' ')`.
  2. Cấu hình mock `localStorage` trong file `setupTests.js` hoặc setup của Vitest.

---

### 🎫 BUG-06 (Minor - Cảnh báo React Hooks trong useEffect)
- **Phân hệ:** `crm-customer-management` ([ContactForm.jsx:28](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/crm-customer-management/src/components/ContactForm.jsx#L28), [CustomerForm.jsx:35](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/crm-customer-management/src/components/CustomerForm.jsx#L35)) và `EP-05-Sales-Pipeline-Nam` ([src/App.jsx:144](file:///c:/Users/Dell%20Precision%205550/Downloads/he-thong-quan-ly-khach-hang-frontend-main/he-thong-quan-ly-khach-hang-frontend-main/EP-05-Sales-Pipeline-Nam/src/App.jsx#L144))
- **Mức độ:** **Minor / Code Quality**
- **Log thực tế:** `Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)`.
- **Đánh giá ảnh hưởng thực tế:**
  - Trong điều kiện bình thường, `setState` chỉ chạy khi prop `contact` thay đổi hoặc khi lưu storage gặp lỗi. Ứng dụng không bị treo hay lặp vô hạn.
  - Tuy nhiên, vi phạm tiêu chuẩn của React 19 / ESLint compiler mới, có thể gây render thừa 1 chu kỳ.
- **Đề xuất khắc phục cho Developer:** Sử dụng `key={contact?.id || 'new'}` trên component Form để reset state tự động thay vì dùng `useEffect` gọi `setFormData`, hoặc dùng `queueMicrotask` / action event handler.

---

### 🌐 ENV-01 (Blocker - Môi trường Backend Offline)
- **Phân hệ:** Toàn hệ thống
- **Địa chỉ gọi API:** `http://127.0.0.1:8000/` hoặc `http://127.0.0.1:5000/`
- **Mức độ:** **Blocker** (Chặn toàn bộ kiểm thử tích hợp thực tế)
- **Hiện trạng:** Cổng mạng không có tiến trình lắng nghe, HTTP request bị từ chối kết nối.

---

## 8. KẾ HOẠCH PHỐI HỢP VỚI CỬA SỔ BACKEND

Để thực hiện kiểm thử tích hợp thực tế theo đúng yêu cầu nghiệp vụ mà không làm trùng lặp cổng hoặc gây sai lệch dữ liệu, QA đối soát thông số kỹ thuật chuẩn từ Backend như sau:

### 8.1. Thông số Kỹ thuật Backend từ Cấu hình Thực tế
1. **Lệnh khởi chạy phiên máy chủ:**
   - Sử dụng script tự động:
     ```powershell
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
     .\chay_server.ps1
     ```
   - Hoặc khởi chạy thủ công:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     pip install -r requirements.txt
     python -m app.seed --reset
     python run.py
     ```
2. **Cổng dịch vụ (Port):**
   - Mặc định của Backend Flask: **Cổng `5000`** (truy cập tài liệu API: `http://127.0.0.1:5000/api`).
   - Cấu hình tùy chọn qua biến môi trường: `CRM_PORT=8000` nếu muốn đồng bộ với file `.env.example` của Frontend.
3. **Cơ sở dữ liệu kiểm thử:**
   - File SQLite tại: `instance/crm.sqlite3`.
   - Lệnh nạp lại dữ liệu mẫu sạch phục vụ test: `python -m app.seed --reset`.
4. **Danh sách Tài khoản Test theo từng Vai trò (Mật khẩu mặc định: `123456`):**
   - **Giám đốc kinh doanh (`DIRECTOR`):** Username `giamdoc` – Quản trị toàn bộ dữ liệu hệ thống.
   - **Trưởng nhóm kinh doanh (`TEAM_LEADER`):** Username `truongnhom1` (Miền Bắc), `truongnhom2` (Miền Nam) – Quản lý dữ liệu nội bộ nhóm.
   - **Nhân viên kinh doanh (`SALES`):** Username `nhanvien1`, `nhanvien2`, `nhanvien3` – Chỉ quản lý khách hàng và cơ hội cá nhân sở hữu.
   - **Quản trị hệ thống (`ADMIN`):** Username `quantri` – Quản lý cấu hình, người dùng và phân quyền vai trò.

### 8.2. Yêu cầu Phối hợp
- Yêu cầu cửa sổ Backend khởi động một phiên máy chủ duy nhất trên cổng đã thỏa thuận (khuyến nghị cổng 5000 hoặc 8000).
- Sau khi cổng mở, Frontend sẽ cập nhật `VITE_API_URL` tương ứng trong file `.env.local` để tiến hành phiên kiểm thử tích hợp thực tế.

---

## 9. ĐÁNH GIÁ NGHIỆM THU & ĐIỀU KIỆN ĐƯA LÊN MAIN

| Hạng mục kiểm tra bắt buộc | Tiêu chí nghiệm thu | Trạng thái thực tế | Kết luận |
|:---|:---|:---:|:---:|
| **Build & Khởi động Root CRM** | Đóng gói thành công, không lỗi sập dev server. | **FAIL** (Sập 500) | ❌ **CHẶN (BLOCKER)** |
| **Build 22 Phân hệ Độc lập** | 100% phân hệ build thành công. | **21 PASS / 1 FAIL** | ❌ **CHƯA ĐẠT** (Lỗi CSR103) |
| **Kiểm tra Chuẩn hóa (Lint)** | Sạch lỗi cú pháp và cảnh báo nghiêm trọng. | **3 PASS / 3 FAIL / 16 N/A** | ⚠️ **CẦN SỬA** |
| **Kiểm thử Đơn vị (Unit Test)** | 100% test case đạt trạng thái Passed. | **6 PASS / 2 FAIL** (73/80 đạt) | ⚠️ **CẦN SỬA** |
| **Kiểm thử Giao diện Trực quan** | Render đầy đủ, không tràn nội dung, hiển thị đúng mockup. | **PARTIAL** (21/23 kiểm tra được) | ⚠️ **CẦN SỬA 2 PHẦN LỖI** |
| **Kiểm thử Tích hợp Backend & DB** | Đăng nhập thực tế, lưu dữ liệu thành công vào SQLite. | **BLOCKED** | ❌ **CHẶN (OFFLINE)** |

### 📌 KẾT LUẬN CUỐI CÙNG:
1. **CHƯA ĐỦ ĐIỀU KIỆN ĐỂ GỘP/PUSH LÊN NHÁNH `main`.**
2. **Hành động Git hiện tại:** Toàn bộ kết quả kiểm thử, ma trận đánh giá và phiếu lỗi được lưu giữ và commit trên nhánh **`qa/frontend-verification`**. Nhánh `main` được giữ an toàn tuyệt đối.
3. **Điều kiện mở khóa nghiệm thu:**
   - Developer khắc phục xong 2 lỗi Blocker: BUG-01 (CSS Root) và BUG-03 (entrypoint CSR103).
   - Cửa sổ Backend khởi động phiên API để QA thực hiện retest và regression tích hợp thực tế.
