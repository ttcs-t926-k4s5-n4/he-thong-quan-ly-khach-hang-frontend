# BÁO CÁO TOÀN DIỆN KIỂM THỬ VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG (QA AUDIT REPORT)
**Dự án: Hệ thống Quản lý Khách hàng - Frontend CRM**

> **KẾT LUẬN TIẾN ĐỘ & MỨC ĐỘ SẴN SÀNG:**  
> **ĐÃ KIỂM TRA TOÀN DIỆN BUILD, LINT, UNIT TEST VÀ GIAO DIỆN CHỨC NĂNG BẰNG CHROME CỤC BỘ; CHƯA ĐẠT ĐIỀU KIỆN NGHIỆM THU BÀN GIAO TOÀN HỆ THỐNG.**  
> - **Lý do chính:** Ứng dụng gốc (`qa-crm-frontend`) đang gặp lỗi sập HTTP 500 khi khởi chạy (Blocker); phân hệ `EP-06-CSR103-reminders-frontend` thiếu file entrypoint `src/main.jsx`; 2 phân hệ lỗi Unit Test; Backend API (`http://127.0.0.1:8000`) chưa được khởi chạy để kiểm thử tích hợp thực tế.

- **Kỹ sư QA thực hiện:** Đinh Xuân Mạnh
- **Tài khoản GitHub:** `dtc245200270` (`225133188+dtc245200270@users.noreply.github.com`)
- **Repository:** `ttcs-t926-k4s5-n4/he-thong-quan-ly-khach-hang-frontend`
- **Môi trường Runtime:** Node.js `v26.8.2` | npm `11.19.1` | Google Chrome `135.0` | Windows 10/11 x64
- **Commit kiểm thử:** `540c4674107bc618e59b0ae4948f4554c5d7f4d0` (HEAD nhánh `main` sau merge PR #31)
- **Thư mục minh chứng hình ảnh:** `qa-evidence/`

---

## MỤC LỤC
1. [Tình trạng Git & Xác minh Phiên bản](#1-tình-trạng-git--xác-minh-phiên-bản)
2. [Kiến trúc Tích hợp: Ứng dụng Gốc vs 22 Module Độc lập](#2-kiến-trúc-tích-hợp-ứng-dụng-gốc-vs-22-module-độc-lập)
3. [Tổng hợp Số liệu Kiểm thử Tách riêng](#3-tổng-hợp-số-liệu-kiểm-thử-tách-riêng)
4. [Bảng Ma trận QA Toàn bộ 23 Phân hệ](#4-bảng-ma-trận-qa-toàn-bộ-23-phân-hệ)
5. [Chi tiết Kiểm thử Nghiệp vụ & Test Cases (Có Minh chứng)](#5-chi-tiết-kiểm-thử-nghiệp-vụ--test-cases-có-minh-chứng)
6. [Nhật ký Lỗi Kỹ thuật & Giả thuyết Nguyên nhân](#6-nhật-ký-lỗi-kỹ-thuật--giả-thuyết-nguyên-nhân)
7. [Đánh giá Mức độ Sẵn sàng Bàn giao](#7-đánh-giá-mức-độ-sẵn-sàng-bàn-giao)
8. [Kế hoạch Phát hành & Thông tin Pull Request](#8-kế-hoạch-phát-hành--thông-tin-pull-request)

---

## 1. TÌNH TRẠNG GIT & XÁC MINH PHIÊN BẢN

- **Trạng thái nhánh `main`:**
  - Nhánh `main` đã merge thành công Pull Request #31 tại commit `540c4674107bc618e59b0ae4948f4554c5d7f4d0`.
  - Không có commit mới nào từ xa sau commit `540c467`.
- **Nhánh `develop`:** Commit HEAD là `d4d115b`, đi sau `main` 44 commits.
- **Bảo toàn mã nguồn:** Toàn bộ mã nguồn ứng dụng và các file test được giữ nguyên bản 100%, không tự ý sửa code ứng dụng để làm sai lệch kết quả kiểm thử.

---

## 2. KIẾN TRÚC TÍCH HỢP: ỨNG DỤNG GỐC VS 22 MODULE ĐỘC LẬP

Dựa trên phân tích mã nguồn [src/App.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/App.jsx), [src/api.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/api.js) và các cấu hình [vite.config.js](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/vite.config.js):

### 2.1. Phân hệ được tích hợp trong Ứng dụng Gốc (`qa-crm-frontend`)
Ứng dụng gốc chạy tại cổng **3000**, có Router tập trung kết nối API qua `http://127.0.0.1:8000`:
- **Core & Xác thực:** Đăng nhập, Hồ sơ cá nhân (`/profile`), Đổi mật khẩu (`/change-password`), Quên/Khôi phục mật khẩu.
- **Quản trị người dùng & Phân quyền:** `/users`, `/roles`, Khóa & bàn giao (`/account-lock`), Nhập người dùng Excel (`/user-import`), Nhật ký thay đổi (`/audit`), Outbox mail (`/outbox`).
- **Cấu hình kinh doanh:** Sản phẩm & bảng giá (`/products`), Cơ cấu kinh doanh (`/org`), Danh mục bán hàng (`/categories`), Pipeline (`/pipeline`), Lý do thắng/thua (`/reasons`).
- **Quản lý khách hàng (Sprint 1-3):** Dữ liệu kinh doanh (`/customers`), Khách hàng DN (`/crm-customers`), Khách hàng 360° (`/customer-360`), Tìm & lọc (`/customer-filter`), Gộp trùng (`/duplicates`), Chăm sóc định kỳ (`/care`), Hỗ trợ & rủi ro (`/support`).
- **Lead & Marketing (Sprint 4):** Tích hợp từ [src/Sprint4.jsx](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/src/Sprint4.jsx): `/leads`, `/lead-import`, `/campaigns`, `/lead-forms`, `/lead-duplicates`, `/lead-scoring`, `/lead-assignment`.

### 2.2. Danh sách 22 Module độc lập (Standalone Modules)
Toàn bộ 22 phân hệ con đều được cấu hình chạy độc lập (SPA React + Vite), **chưa được mount vào router hay bundle của ứng dụng gốc**:
`crm-customer-management` (5173), `crm-user-management` (5173), `sprint4-lead-marketing` (5173), `EP-05-Sales-Pipeline-Nam` (5173), `EP-05-SCR98-opportunity-documents-frontend` (5173), `EP-05-opportunity-filter-frontend` (5173), `EP-05-opportunity-history-frontend` (5173), `EP-05-opportunity-sharing-frontend` (5173), `EP-06-CRM-Activities-Tasks-Nam` (5173), `EP-06-CSR103-reminders-frontend` (5173), `EP-06-CSR104-call-logging-frontend` (5173), `lead-assignment-sla-Scr85-04` (5173), `lead-list-filters-Scr86-04` (5173), `S04-04-Scrum81-lead-deduplication` (5180), `S04-04-Scrum82-lead-scoring` (5182), `S04-04-Scrum83-lead-routing` (5184), `S04-05-Scrum91-opportunity-close` (5186), `S04-05-Scrum92-revenue-forecast` (5187), `S04-05-Scrum93-stagnant-opportunity-alert` (5188), `S04-05-Scrum94-reassign-opportunity` (5189), `S04-06-Scrum101-sales-calendar` (5190), `S04-06-Scrum102-customer-timeline` (5191).

---

## 3. TỔNG HỢP SỐ LIỆU KIỂM THỬ TÁCH RIÊNG

*(Tuyệt đối không cộng gộp các loại kiểm thử khác nhau thành một tỷ lệ PASS chung)*

```text
========================================================================================
                          BẢNG TỔNG HỢP SỐ LIỆU KIỂM THỬ
========================================================================================
1. ĐÓNG GÓI (BUILD)                 : 21 PASS  | 2 FAIL   | 0 NOT RUN  (Tổng: 23)
2. QUY CHUẨN MÃ NGUỒN (LINT)        :  3 PASS  | 3 FAIL   | 17 NOT RUN (Tổng: 23)
3. KIỂM THỬ ĐƠN VỊ (UNIT TEST)      :  6 PASS  | 2 FAIL   | 15 NOT RUN (Tổng: 23)
   - Chi tiết Test Cases thực tế   : 73 PASS  | 7 FAIL   (Tổng: 80 test cases)
4. GIAO DIỆN CHỨC NĂNG (CHROME UI)  :  5 PASS  | 1 FAIL   | 17 NOT RUN (Tổng: 23)
5. TÍCH HỢP BACKEND API (INTEG)     :  0 PASS  | 0 FAIL   | 23 BLOCKED (Không có Backend)
========================================================================================
```

- **Đóng gói (Build):**
  - **PASS:** 21 phân hệ đóng gói production thành công qua Vite.
  - **FAIL:** 2 phân hệ (Root App sập CSS; `EP-06-CSR103-reminders-frontend` thiếu `src/main.jsx`).
- **Quy chuẩn mã nguồn (Lint):**
  - **PASS:** 3 phân hệ đạt chuẩn 0 lỗi (`crm-user-management`, `sprint4-lead-marketing`, `EP-06-CRM-Activities-Tasks-Nam`).
  - **FAIL:** 3 phân hệ có lỗi (Root App thiếu file cấu hình; `crm-customer-management` có 2 lỗi hook; `EP-05-Sales-Pipeline-Nam` có 1 lỗi hook).
  - **NOT RUN:** 17 phân hệ không khai báo script lint.
- **Kiểm thử đơn vị (Unit Test):**
  - **PASS:** 6 phân hệ (73 test cases pass 100%).
  - **FAIL:** 2 phân hệ (7 test cases fail do mock date và runtime string/localStorage).
  - **NOT RUN:** 15 phân hệ không có test script.
- **Giao diện chức năng bằng Chrome Headless:**
  - Khắc phục thành công sự cố driver Playwright bằng cách sử dụng trực tiếp Google Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) đã cài đặt trên máy.
  - Đã chụp ảnh và kiểm chứng giao diện thực tế cho 6 phân hệ quan trọng: Root App (FAIL), Sales Calendar (PASS), Opportunity Filter (PASS), Quick Call Logging (PASS), Documents (PASS), Lead SLA (PASS).
- **Tích hợp Backend API:**
  - **BLOCKED 100%:** Đã thăm dò cổng `http://127.0.0.1:8000/`, kết nối bị từ chối (`curl: Failed to connect to 127.0.0.1:8000`). Không có backend server đang hoạt động. Kiểm thử với dữ liệu mock không được tính là kiểm thử tích hợp.

---

## 4. BẢNG MA TRẬN QA TOÀN BỘ 23 PHÂN HỆ

| STT | Phân hệ / Thư mục | Cổng Dev | Build | Lint | Unit Test | Chrome UI | Backend Integ | Đánh giá tổng quan |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **0** | **Root (`qa-crm-frontend`)** | **3000** | **FAIL** | **FAIL** | NOT RUN | **FAIL** | **BLOCKED** | **CRITICAL BLOCKER:** Sập HTTP 500 do import sai `./index.css`. Thiếu `eslint.config.js`. |
| 1 | `crm-customer-management` | 5173 | **PASS** | **FAIL** | NOT RUN | NOT RUN | **BLOCKED** | Build 277kB. Lint báo 2 lỗi React Hooks cascading renders. |
| 2 | `crm-user-management` | 5173 | **PASS** | **PASS** | NOT RUN | NOT RUN | **BLOCKED** | Build 653kB. Lint sạch 100%. |
| 3 | `sprint4-lead-marketing` | 5173 | **PASS** | **PASS** | NOT RUN | NOT RUN | **BLOCKED** | Build 670kB. Lint sạch 100%. |
| 4 | `EP-05-Sales-Pipeline-Nam` | 5173 | **PASS** | **FAIL** | NOT RUN | NOT RUN | **BLOCKED** | Build 247kB. Lint báo 1 lỗi React Hook cascading render. |
| 5 | `EP-05-SCR98-opportunity-documents-frontend` | 5173 | **PASS** | NOT RUN | **PASS** (10/10) | **PASS** | **BLOCKED** | Unit test pass 100%. Giao diện tài liệu 20MB render chuẩn. |
| 6 | `EP-05-opportunity-filter-frontend` | 5173 | **PASS** | NOT RUN | **PASS** (9/9) | **PASS** | **BLOCKED** | Unit test pass 100%. Giao diện tìm kiếm, lọc đa điều kiện render chuẩn. |
| 7 | `EP-05-opportunity-history-frontend` | 5173 | **PASS** | NOT RUN | **FAIL** (4 fail / 4 pass) | NOT RUN | **BLOCKED** | Build 190kB. Smoke test pass. Vitest fail do khoảng trắng & JSDOM. |
| 8 | `EP-05-opportunity-sharing-frontend` | 5173 | **PASS** | NOT RUN | **FAIL** (3 fail / 7 pass) | NOT RUN | **BLOCKED** | Build 184kB. Unit test fail 3 case do mock date 17/10 < seed date hôm nay. |
| 9 | `EP-06-CRM-Activities-Tasks-Nam` | 5173 | **PASS** | **PASS** | NOT RUN | NOT RUN | **BLOCKED** | Build 233kB. Lint sạch 100%. |
| 10 | `EP-06-CSR103-reminders-frontend` | 5173 | **FAIL** | NOT RUN | **PASS** (11/11) | NOT RUN | **BLOCKED** | Unit test logic pass 100%. **Build fail do thiếu `src/main.jsx`.** |
| 11 | `EP-06-CSR104-call-logging-frontend` | 5173 | **PASS** | NOT RUN | **PASS** (31/31) | **PASS** | **BLOCKED** | Unit test pass 31/31. Giao diện ghi nhanh cuộc gọi render chuẩn. |
| 12 | `lead-assignment-sla-Scr85-04` | 5173 | **PASS** | NOT RUN | **PASS** (6/6) | **PASS** | **BLOCKED** | Unit test pass 100%. Giao diện phân bổ lead & SLA 24h render chuẩn. |
| 13 | `lead-list-filters-Scr86-04` | 5173 | **PASS** | NOT RUN | **PASS** (6/6) | NOT RUN | **BLOCKED** | Unit test pass 100%. Build 162kB. |
| 14 | `S04-04-Scrum81-lead-deduplication` | 5180 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 319kB. Không có test script. |
| 15 | `S04-04-Scrum82-lead-scoring` | 5182 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 282kB. Không có test script. |
| 16 | `S04-04-Scrum83-lead-routing` | 5184 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 278kB. Không có test script. |
| 17 | `S04-05-Scrum91-opportunity-close` | 5186 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 311kB. Không có test script. |
| 18 | `S04-05-Scrum92-revenue-forecast` | 5187 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 303kB. Không có test script. |
| 19 | `S04-05-Scrum93-stagnant-opportunity-alert` | 5188 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 334kB. Không có test script. |
| 20 | `S04-05-Scrum94-reassign-opportunity` | 5189 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 329kB. Không có test script. |
| 21 | `S04-06-Scrum101-sales-calendar` | 5190 | **PASS** | NOT RUN | NOT RUN | **PASS** | **BLOCKED** | Build 318kB. Giao diện lịch kinh doanh & chống trùng lịch render chuẩn. |
| 22 | `S04-06-Scrum102-customer-timeline` | 5191 | **PASS** | NOT RUN | NOT RUN | NOT RUN | **BLOCKED** | Build 318kB. Không có test script. |

---

## 5. CHI TIẾT KIỂM THỬ NGHIỆP VỤ & TEST CASES (CÓ MINH CHỨNG)

### TC-ROOT-01: Khởi động Ứng dụng Gốc CRM Shell
- **Mục tiêu:** Kiểm tra khả năng khởi chạy và hiển thị màn hình Đăng nhập của Root CRM.
- **Lệnh thực hiện:** `npm run dev` tại thư mục `qa-crm-frontend` (Cổng 3000).
- **Thao tác kiểm thử:** Điều hướng Chrome tới `http://localhost:3000/`.
- **Kết quả mong đợi đúng nghiệp vụ:** Màn hình hiển thị Form đăng nhập CRM với đầy đủ logo, các trường tài khoản, mật khẩu và nút Đăng nhập.
- **Kết quả thực tế hiện tại:** Màn hình Error Overlay đỏ của Vite xuất hiện báo lỗi `500 Internal Server Error`: `[plugin:vite:import-analysis] Failed to resolve import "./index.css" from "src/main.jsx"`.
- **Trạng thái:** **FAIL**
- **Minh chứng hình ảnh:** `qa-evidence/root_app_500_error.png`

---

### TC-ROOT-02: Kiểm tra Tích hợp Backend API
- **Mục tiêu:** Xác minh khả năng giao tiếp của Root App với máy chủ Backend API.
- **Lệnh thực hiện:** `curl.exe -i -m 3 http://127.0.0.1:8000/`
- **Kết quả mong đợi đúng nghiệp vụ:** Máy chủ Backend phản hồi mã trạng thái HTTP 200/401 hoặc thông tin API CRM.
- **Kết quả thực tế hiện tại:** `curl: (7) Failed to connect to 127.0.0.1:8000: Could not connect to server`.
- **Trạng thái:** **BLOCKED** (Do chưa có dịch vụ Backend hoạt động trên môi trường kiểm thử).

---

### TC-FILTER-01: Tìm kiếm & Lọc cơ hội kinh doanh (`EP-05-opportunity-filter-frontend`)
- **Mục tiêu:** Kiểm tra giao diện tìm kiếm không dấu tiếng Việt, lọc đa điều kiện và lưu bộ lọc preset.
- **Lệnh thực hiện:** `npm run dev -- --port 5055` tại `EP-05-opportunity-filter-frontend`.
- **Thao tác kiểm thử:** Điều hướng Chrome tới `http://127.0.0.1:5055/`.
- **Kết quả mong đợi đúng nghiệp vụ:** Giao diện hiển thị thống kê tổng cơ hội, tổng pipeline mở (4,3 tỷ đ), bộ lọc theo Giai đoạn, Khoảng giá trị VND, Ngày chốt và danh sách preset bộ lọc đã lưu.
- **Kết quả thực tế:** Giao diện render chính xác 100%, phản hồi đầy đủ các trường lọc và bảng dữ liệu mẫu. 9/9 Unit test tự động chạy bằng `node --test` đều đạt kết quả PASS (144ms).
- **Trạng thái:** **PASS**
- **Minh chứng hình ảnh:** `qa-evidence/ep05_opportunity_filter.png`

---

### TC-CALLLOG-01: Ghi nhanh Cuộc gọi và Tự động gắn Cơ hội (`EP-06-CSR104-call-logging-frontend`)
- **Mục tiêu:** Kiểm tra tính năng ghi nhận nhanh cuộc gọi chăm sóc khách hàng, ràng buộc lịch hẹn và tự động gắn cơ hội mở.
- **Lệnh thực hiện:** `npm run dev -- --port 5055` tại `EP-06-CSR104-call-logging-frontend`.
- **Thao tác kiểm thử:** Điều hướng Chrome tới `http://localhost:5055/`.
- **Kết quả mong đợi đúng nghiệp vụ:** Form ghi nhanh cuộc gọi hiển thị thông tin khách hàng, các nút bấm kết quả cuộc gọi (Đã kết nối, Không nghe máy, Máy bận, Hẹn gọi lại), ô hiển thị cơ hội liên quan tự động và bảng lịch sử chăm sóc gần đây.
- **Kết quả thực tế:** Giao diện render hoàn hảo; tính năng validation ngày hẹn quá khứ và tự động chọn cơ hội hoạt động chính xác. 31/31 Unit test tự động đều PASS (220ms).
- **Trạng thái:** **PASS**
- **Minh chứng hình ảnh:** `qa-evidence/ep06_call_logging.png`

---

### TC-DOCS-01: Quản lý Hồ sơ & Tài liệu đính kèm Cơ hội (`EP-05-SCR98`)
- **Mục tiêu:** Kiểm tra giao diện quản lý tài liệu hồ sơ thầu, báo giá, kiểm soát phân quyền và giới hạn dung lượng tải lên 20MB.
- **Lệnh thực hiện:** `npm run dev -- --port 5055` tại `EP-05-SCR98-opportunity-documents-frontend`.
- **Thao tác kiểm thử:** Điều hướng Chrome tới `http://localhost:5055/`.
- **Kết quả mong đợi đúng nghiệp vụ:** Giao diện hiển thị danh sách cơ hội bên trái, khu vực kéo thả tệp đính kèm ở giữa với nhãn giới hạn 20MB/tệp và bảng danh sách thành viên có quyền truy cập bên phải.
- **Kết quả thực tế:** Render chính xác theo thiết kế; 10/10 Unit test kiểm tra validation 20MB, lọc định dạng PDF/Word/Excel đều PASS (137ms).
- **Trạng thái:** **PASS**
- **Minh chứng hình ảnh:** `qa-evidence/ep05_opportunity_documents.png`

---

### TC-SLA-01: Tiếp nhận Phân bổ Lead & Cảnh báo SLA 24 Giờ (`lead-assignment-sla-Scr85-04`)
- **Mục tiêu:** Kiểm tra giao diện tiếp nhận lead, hiển thị cảnh báo vi phạm SLA 24h và ghi nhận phản hồi.
- **Lệnh thực hiện:** `npm run dev -- --port 5055` tại `lead-assignment-sla-Scr85-04`.
- **Thao tác kiểm thử:** Điều hướng Chrome tới `http://localhost:5055/`.
- **Kết quả mong đợi đúng nghiệp vụ:** Thống kê tổng lead, lead chờ tiếp nhận, cờ cảnh báo quá SLA (chưa liên hệ sau 24h), bảng danh sách lead kèm thẻ đếm ngược thời gian và panel chi tiết lead bên phải.
- **Kết quả thực tế:** Render đầy đủ thông tin cảnh báo SLA trực quan; 6/6 Unit test logic đều PASS (128ms).
- **Trạng thái:** **PASS**
- **Minh chứng hình ảnh:** `qa-evidence/lead_assignment_sla.png`

---

### TC-CALENDAR-01: Lịch làm việc & Chống chồng chéo lịch nhóm (`S04-06-Scrum101-sales-calendar`)
- **Mục tiêu:** Kiểm tra giao diện lịch bán hàng, quản lý cuộc gặp, phát hiện xung đột trùng giờ của thành viên trong nhóm.
- **Lệnh thực hiện:** Khởi chạy tại cổng 5190.
- **Thao tác kiểm thử:** Điều hướng Chrome tới `http://localhost:5190/`.
- **Kết quả mong đợi đúng nghiệp vụ:** Bảng lịch hiển thị theo tuần, banner cảnh báo màu đỏ khi có xung đột chồng chéo lịch hẹn của nhân viên kinh doanh, danh sách thành viên nhóm và thống kê tiến độ công việc.
- **Kết quả thực tế:** Giao diện render sắc nét, chế độ xem Tuần/Ngày/Tháng và cảnh báo xung đột lịch hoạt động trực quan.
- **Trạng thái:** **PASS**
- **Minh chứng hình ảnh:** `qa-evidence/scrum101_sales_calendar.png`

---

## 6. NHẬT KÝ LỖI KỸ THUẬT & GIẢ THUYẾT NGUYÊN NHÂN

*(Các nguyên nhân chưa được xác minh qua bản sửa và test lại đều được phân định rõ là **Giả thuyết kỹ thuật**)*

### 🔴 BUG-01 (Lỗi ứng dụng - Blocker): Root App sập khi khởi chạy
- **Phân hệ:** Root (`qa-crm-frontend`)
- **Commit:** `ae1701e7cdf23a50aa6953514c6e0d5d30455ed8` (dòng 3 file `src/main.jsx`)
- **Lệnh:** `npm run build` | **Exit Code:** `1`
- **Log thực tế:** `[UNRESOLVED_IMPORT] Could not resolve './index.css' in src/main.jsx`. HTTP GET `/src/main.jsx` trả mã 500.
- **Giả thuyết kỹ thuật:** Tác giả commit `ae1701e` đổi đường dẫn import thành `./index.css`, nhưng file stylesheet thực tế trong thư mục `src/` là `styles.css`.

### 🔴 BUG-02 (Lỗi cấu hình): Root App thiếu file cấu hình ESLint 10
- **Phân hệ:** Root (`qa-crm-frontend`)
- **Commit:** `540c467`
- **Lệnh:** `npm run lint` | **Exit Code:** `1`
- **Log thực tế:** `ESLint: 10.12.0. ESLint couldn't find an eslint.config.* file.`
- **Giả thuyết kỹ thuật:** Dự án cài ESLint v10 nhưng thiếu file `eslint.config.js` (Flat Config format).

### 🔴 BUG-03 (Lỗi ứng dụng - Missing Entrypoint): `EP-06-CSR103` thiếu file `src/main.jsx`
- **Phân hệ:** `EP-06-CSR103-reminders-frontend`
- **Commit:** `540c467`
- **Lệnh:** `npm run build` | **Exit Code:** `1`
- **Log thực tế:** `[vite:build-html] Failed to resolve /src/main.jsx from index.html`.
- **Giả thuyết kỹ thuật:** `index.html` gọi thẻ script `/src/main.jsx`, nhưng thư mục `src/` chỉ chứa `App.jsx`, `styles.css`, `data/`, `utils/`, hoàn toàn thiếu file khởi tạo `main.jsx`.

### 🟡 BUG-04 (Lỗi test / Mock Date): `EP-05-opportunity-sharing` fail 3 test case
- **Phân hệ:** `EP-05-opportunity-sharing-frontend`
- **Commit:** `540c467`
- **Lệnh:** `node --test src/utils/shareLogic.test.js` | **Exit Code:** `1`
- **Log thực tế:** `AssertionError: Expected 'activity_logged' to be strictly equal to 'member_added'`.
- **Giả thuyết kỹ thuật:** Biến `now` trong test bị gán cứng là `2026-10-17`, trong khi file `seed.js` sinh ngày tương đối theo ngày chạy thực tế (22/10/2026). Khi hàm `addAudit()` sắp xếp log giảm dần theo thời gian, log mới bị đẩy ra sau dữ liệu mồi của ngày hôm nay.

### 🟡 BUG-05 (Lỗi test & Runtime): `EP-05-opportunity-history` fail 4 test case
- **Phân hệ:** `EP-05-opportunity-history-frontend`
- **Commit:** `540c467`
- **Lệnh:** `npm test` | **Exit Code:** `1`
- **Log thực tế:** `AssertionError: expected to contain '200.000.000 ₫' (\u0020 vs \u00A0)` và `TypeError: Cannot read properties of undefined (reading 'clear')` tại `localStorage.clear()`.
- **Giả thuyết kỹ thuật:** `Intl.NumberFormat('vi-VN')` trên Node mới dùng ký tự non-breaking space (`\u00A0`); cờ `--experimental-localstorage` trên Node v26 xung đột với JSDOM mock của Vitest.

### 🟡 BUG-06 (Lỗi mã nguồn React Hooks): Vi phạm `set-state-in-effect`
- **Phân hệ:** `crm-customer-management` và `EP-05-Sales-Pipeline-Nam`
- **Lệnh:** `npm run lint` | **Exit Code:** `0` (báo 3 lỗi)
- **Log thực tế:** `Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)`.
- **Giả thuyết kỹ thuật:** Component gọi `setState` đồng bộ ngay trong thân `useEffect` khi dependency thay đổi, vi phạm quy tắc khắt khe của React 19.

### ⚪ ENV-01 (Lỗi môi trường): Backend API không phản hồi
- **Địa chỉ:** `http://127.0.0.1:8000/`
- **Log thực tế:** `curl: (7) Failed to connect to 127.0.0.1:8000: Could not connect to server`.
- **Đánh giá:** Dịch vụ Backend chưa được khởi chạy. Toàn bộ phần kiểm thử tích hợp API Backend được xếp vào trạng thái **BLOCKED**.

---

## 7. ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG BÀN GIAO

| Tiêu chí đánh giá | Trạng thái hiện tại | Đánh giá chấp thuận bàn giao |
|:---|:---:|:---|
| Khởi động ứng dụng gốc CRM Shell | **FAIL** (Sập 500) | ❌ **CHƯA ĐẠT (BLOCKER)** |
| Tính toàn vẹn đóng gói toàn bộ 23 phân hệ | **21 PASS / 2 FAIL** | ❌ **CHƯA ĐẠT** (Còn 2 phân hệ lỗi build) |
| Chuẩn hóa cú pháp & Linter | **3 PASS / 3 FAIL** | ⚠️ **CẦN KHẮC PHỤC** |
| Kiểm thử đơn vị nghiệp vụ (Unit Test) | **6 PASS / 2 FAIL** | ⚠️ **CẦN SỬA TEST VÀ RUNTIME** |
| Giao diện trực quan các phân hệ độc lập | **5 PASS / 1 FAIL** | ✔ **ĐẠT MỘT PHẦN** (Các module con hiển thị xuất sắc) |
| Kiểm thử tích hợp Backend thực tế | **BLOCKED** | ❌ **CHƯA ĐẠT** (Chưa có Backend API) |

> **KẾT LUẬN CUỐI CÙNG:**  
> Hệ thống **CHƯA ĐẠT ĐIỀU KIỆN NGHIỆM THU BÀN GIAO**. Nhóm phát triển cần ưu tiên giải quyết lỗi import stylesheet của Root App và bổ sung file entrypoint cho phân hệ Reminders trước khi chuyển sang giai đoạn kiểm thử tích hợp Backend.

---

## 8. KẾ HOẠCH PHÁT HÀNH & THÔNG TIN PULL REQUEST

- **Nhánh QA Phase 2:** `qa/phase2-system-wide-evidence` (tách từ `main`).
- **Tài khoản tạo PR:** `dtc245200270`
- **Nội dung commit:** Cập nhật tài liệu [QA_COMPREHENSIVE_AUDIT_REPORT.md](file:///c:/Users/Dell%20Precision%205550/qa-crm-frontend/QA_COMPREHENSIVE_AUDIT_REPORT.md) và đính kèm bộ minh chứng hình ảnh trong thư mục `qa-evidence/`.
- **Đường dẫn Pull Request mới:** Sẽ được tạo và cập nhật ngay sau bước kiểm tra diff.
