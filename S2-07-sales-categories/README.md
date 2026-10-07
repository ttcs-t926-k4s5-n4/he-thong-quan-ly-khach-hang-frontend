# Hệ Thống Khai Báo Danh Mục Dùng Chung Bán Hàng (SCRUM-65)

> **Mã công việc:** SCRUM-17 / SCRUM-65  
> **Ngôn ngữ & Nền tảng:** React 19, Vite, Vanilla Modern CSS, Lucide Icons  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Giám đốc kinh doanh, tôi muốn khai báo các danh mục dùng chung của bán hàng, để cả khối gọi tên nguồn lead và ngành nghề giống nhau để báo cáo gộp được."*

### 3 Tiêu Chí Nghiệm Thu (Acceptance Criteria) Từ Đề Bài:

| STT | Yêu cầu trong mô tả (Description) | Giải pháp kỹ thuật trong ứng dụng React |
| :---: | :--- | :--- |
| **1** | **Ngành nghề khách hàng, quy mô doanh nghiệp, nguồn lead, loại hoạt động** | • Khai báo và quản lý đầy đủ **4 bộ danh mục chuẩn hóa** toàn quốc.<br>• Mỗi mục danh mục gồm: Mã code (viết hoa duy nhất), Tên hiển thị, Mô tả hướng dẫn sử dụng, Thẻ màu nhận diện (đồng bộ biểu đồ), Cờ gợi ý mặc định, Trạng thái (Đang áp dụng / Tạm ngưng).<br>• Hỗ trợ đầy đủ chức năng Thêm mới, Chỉnh sửa, Tìm kiếm tức thì, Lọc theo trạng thái và dữ liệu. |
| **2** | **Giá trị đang được tham chiếu thì không xoá được** | • **Thuật toán kiểm tra toàn vẹn tham chiếu (Referential Integrity Guard):** Quét kiểm tra liên kết thực tế từ Khách hàng doanh nghiệp, Đầu mối bán hàng (Leads), Cơ hội kinh doanh (Deals) và Hoạt động (Activities).<br>• Khi mục đang có bản ghi trỏ tới: Nút Xóa tự động chuyển thành **Khóa đỏ (🔒 Lock)** kèm badge số lượng bản ghi tham chiếu.<br>• Bấm xóa sẽ hiển thị **Modal cảnh báo vi phạm ràng buộc dữ liệu**, phân tích số lượng bản ghi đang dùng và cung cấp 3 hướng giải quyết an toàn: (1) Tra cứu chi tiết bản ghi, (2) Chuyển sang "Tạm ngưng" để bảo vệ báo cáo lịch sử, hoặc (3) "Gộp & Chuyển dữ liệu" (Merge / Reassign) sang mục khác để dọn dẹp.<br>• Đối với các mục có 0 tham chiếu (mục thử nghiệm): Cho phép xóa vĩnh viễn an toàn với hộp thoại xác nhận. |
| **3** | **Sắp xếp được thứ tự hiển thị** | • **Kéo thả trực quan (HTML5 Drag & Drop):** Giữ chuột vào biểu tượng tay nắm (Grip) để kéo thả thay đổi vị trí dòng linh hoạt với hiệu ứng viền sáng highlight.<br>• **Mũi tên Lên / Xuống (Up / Down arrows):** Thao tác nhanh cho từng dòng trên mọi thiết bị.<br>• **Sắp xếp thông minh:** Hỗ trợ nút sắp xếp nhanh theo A-Z, sắp xếp theo mức độ phổ biến trong CRM (Usage count) hoặc khôi phục thứ tự chuẩn.<br>• **Widget Live CRM Preview:** Hộp chọn mẫu ở chân trang phản ánh ngay lập tức thứ tự vừa sắp xếp trong thời gian thực. |

---

## 2. Tính Năng Gia Tăng: Báo Cáo Gộp Bán Hàng & Đối Chiếu Trước / Sau

Xuất phát từ mục tiêu cốt lõi của Giám đốc kinh doanh: **"...để cả khối gọi tên nguồn lead và ngành nghề giống nhau để báo cáo gộp được"**, hệ thống tích hợp sẵn phân hệ:

1. **Dashboard Báo Cáo Gộp Bán Hàng Toàn Khối (Consolidated Sales BI):**
   - Báo cáo số lượng đầu mối và doanh số dự kiến theo từng **Nguồn Lead** chuẩn hóa.
   - Báo cáo phân bổ doanh thu thực tế và hợp đồng thành công theo từng **Ngành nghề khách hàng**.
   - Báo cáo phân khúc khách hàng và giá trị đơn hàng trung bình (AOV) theo **Quy mô doanh nghiệp**.
   - Báo cáo năng suất tương tác của toàn đội ngũ bán hàng theo **Loại hoạt động**.
2. **Bảng Đối Chiếu Trước & Sau Khi Chuẩn Hóa (Standardization Impact):**
   - *Trước khi có SCRUM-65:* Nguồn lead bị phân mảnh thành 15 biến thể tự do gõ bằng tay ("web", "website", "form trang chu", "inbound", "qc google",...) $\rightarrow$ Không thể gộp báo cáo.
   - *Sau khi áp dụng SCRUM-65:* 100% dữ liệu thống nhất về mã chuẩn $\rightarrow$ Báo cáo gộp tự động, chính xác 100%, tiết kiệm 3-4 ngày tổng hợp thủ công mỗi tháng.
3. **Trình Mô Phỏng Nhập Liệu CRM (CRM Simulator):**
   - Cho phép nhập thử một Lead hoặc Khách hàng mới với các dropdown lấy trực tiếp từ danh mục chung.
   - Khi chọn một mục trước đó có 0 tham chiếu $\rightarrow$ Mục đó lập tức nhảy lên 1 tham chiếu và được hệ thống khóa xóa ngay lập tức!

---

## 3. Cấu Trúc Thư Mục Dự Án

```
scrum-65-sales-categories/
├── index.html                               # HTML chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                             # Cấu hình dự án React 19 + Vite + Lucide Icons
├── run.bat                                  # Khởi chạy 1-click trên máy tính Windows (Port 5176)
├── vite.config.js                           # Cấu hình máy chủ Vite port 5176
├── src/
│   ├── main.jsx                             # Điểm gắn kết React DOM
│   ├── App.jsx                              # Quản lý state toàn cục, tab điều hướng, CRUD danh mục
│   ├── index.css                            # Modern CSS (Dark/Light mode, Glassmorphism, Drag-Drop styles)
│   ├── data/
│   │   └── categoryData.js                  # 4 bộ danh mục chuẩn, 38+ bản ghi CRM mẫu, dữ liệu đối chiếu
│   ├── utils/
│   │   └── referenceUtils.js                # Thuật toán kiểm tra toàn vẹn tham chiếu, gộp dữ liệu, định dạng tiền tệ
│   └── components/
│       ├── Header.jsx                       # Thanh tiêu đề, Nút Tiêu chí Jira, Reset dữ liệu, Đổi theme
│       ├── StatsCards.jsx                   # 4 thẻ KPI (Tổng mục, Mục đang áp dụng, Khóa xóa tham chiếu, Mục an toàn)
│       ├── CategoryNavCards.jsx             # 4 thẻ chuyển đổi nhanh giữa các danh mục dùng chung
│       ├── CategoryItemList.jsx             # Bảng quản lý mục, Kéo thả sắp xếp, Khóa xóa và Live CRM Preview
│       ├── CategoryItemModal.jsx            # Modal thêm mới / chỉnh sửa mục danh mục
│       ├── IntegrityDeleteModal.jsx         # Modal khóa xóa do vi phạm ràng buộc tham chiếu dữ liệu (Tiêu chí 2)
│       ├── SafeDeleteConfirmModal.jsx       # Modal xác nhận xóa an toàn đối với các mục 0 tham chiếu
│       ├── MergeReassignModal.jsx           # Modal gộp và chuyển đổi tham chiếu sang mục khác
│       ├── ReferenceDetailsModal.jsx        # Modal tra cứu chi tiết các bản ghi CRM đang sử dụng mục này
│       ├── ConsolidatedReportView.jsx       # Báo cáo gộp bán hàng & Đối chiếu Trước / Sau chuẩn hóa
│       ├── CrmSimulatorView.jsx             # Mô phỏng nhập liệu CRM và kiểm chứng kích hoạt khóa xóa
│       └── Scrum65GuideModal.jsx            # Modal hướng dẫn nghiệm thu 3 tiêu chí SCRUM-65
```

---

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy Ứng Dụng

### Cách 1: Chạy 1-Click trên Windows (Khuyến nghị)
Nhấp đúp chuột vào file:
```
subtask-frontend\scrum-65-sales-categories\run.bat
```
Ứng dụng sẽ tự động mở tại địa chỉ: `http://localhost:5176`

### Cách 2: Khởi chạy bằng dòng lệnh terminal
```bash
cd subtask-frontend/scrum-65-sales-categories
npm.cmd install
npm.cmd run dev
```

---

## 5. Kịch Bản Kiểm Tra Nghiệm Thu (Acceptance Testing Checklist)

1. **Kiểm tra Tiêu chí 1 (4 Danh mục chuẩn):**
   - Quan sát 4 thẻ: Ngành nghề khách hàng, Quy mô doanh nghiệp, Nguồn lead, Loại hoạt động.
   - Nhấp vào từng thẻ để xem danh sách các mục thuộc danh mục đó.
   - Bấm nút **"Thêm Mục Mới"** để tạo thêm 1 ngành nghề hoặc nguồn lead mới.
   - Thử bấm vào pill trạng thái để chuyển đổi giữa **"Đang áp dụng"** và **"Tạm ngưng"**.
2. **Kiểm tra Tiêu chí 2 (Khóa xóa khi có tham chiếu):**
   - Trong danh mục Ngành nghề, tìm mục **"Công nghệ thông tin & Viễn thông"** (có badge đỏ `Đang tham chiếu (18)`).
   - Bấm nút Xóa (hình ổ khóa 🔒) $\rightarrow$ Hệ thống hiển thị modal **"Ràng Buộc Dữ Liệu: Không Thể Xóa Mục Này!"**, giải thích rõ có bao nhiêu khách hàng và cơ hội đang liên kết.
   - Thử tính năng **"Tạm ngưng"** hoặc **"Gộp dữ liệu"** sang mục khác.
   - Tìm mục **"Mục thử nghiệm ngành nghề mới (Chưa có dữ liệu)"** có badge xanh `0 tham chiếu (Xóa an toàn)`. Bấm nút Xóa $\rightarrow$ Hệ thống cho phép xóa an toàn.
3. **Kiểm tra Tiêu chí 3 (Sắp xếp thứ tự hiển thị):**
   - Giữ chuột vào icon 6 chấm (Grip) và kéo một dòng lên hoặc xuống vị trí mới.
   - Hoặc bấm nút mũi tên **Lên (↑)** / **Xuống (↓)** trên từng dòng.
   - Quan sát mục **"Mô Phỏng Trực Tiếp Trên Giao Diện Bán Hàng (Live CRM Preview)"** ở dưới chân trang: Dropdown tự động cập nhật thứ tự các lựa chọn tức thì!
   - Thử các nút tiện ích: **"Sắp xếp A-Z"**, **"Xếp theo Phổ biến"**, **"Thứ tự chuẩn"**.
4. **Kiểm tra Báo cáo gộp bán hàng:**
   - Chuyển sang tab **"2. Báo Cáo Gộp Bán Hàng Toàn Khối"** để xem các biểu đồ phân tích theo Nguồn Lead và Ngành nghề.
   - Nhấp nút **"Đối Chiếu Trước & Sau Chuẩn Hóa"** để xem sự khác biệt giữa dữ liệu phân mảnh và dữ liệu chuẩn hóa.
5. **Kiểm tra Mô phỏng CRM:**
   - Chuyển sang tab **"3. Mô Phỏng Nhập Liệu CRM & Khóa Xóa"**.
   - Tạo một Lead mới chọn một mục trước đó có 0 tham chiếu $\rightarrow$ Quay lại tab Danh mục sẽ thấy mục đó tăng tham chiếu và nút Xóa lập tức bị khóa!
