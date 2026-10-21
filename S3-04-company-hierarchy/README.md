# Hệ Thống Khai Báo Quan Hệ Công Ty Mẹ - Con & Tổng Giá Trị Tập Đoàn (SCRUM-73)

> **Mã công việc:** `SCRUM-18 / SCRUM-73`  
> **Ngôn ngữ & Nền tảng:** `React 19`, `Vite`, `Vanilla Modern CSS`, `Lucide Icons`  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Nhân viên kinh doanh, tôi muốn khai báo quan hệ công ty mẹ và công ty con, để nhìn được tổng giá trị của cả tập đoàn chứ không chỉ từng pháp nhân."*

### Bảng Đối Chiếu Tiêu Chí Nghiệm Thu (Acceptance Criteria):

| STT | Tiêu chí trong Jira Ticket | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng kiểm thử |
| :---: | :--- | :--- | :--- |
| **1** | **Gắn một khách hàng làm công ty con của khách hàng khác** | • **Giao diện Khai báo trực quan:** Nút *"Khai báo Quan hệ Mẹ - Con"* cho phép chọn công ty con và công ty mẹ từ danh bạ khách hàng doanh nghiệp.<br>• **Thuộc tính quan hệ chi tiết:** Hỗ trợ thiết lập loại quan hệ (100% vốn, chi phối >50%, liên kết 20-50%, chi nhánh trực thuộc) và thanh trượt tỷ lệ sở hữu (1% - 100%).<br>• **Kiểm soát tính toàn vẹn (Validation):** Tự động phát hiện và chặn đứng trường hợp tự làm mẹ chính mình (**Self-parenting**) và thuật toán phát hiện vòng lặp tuần hoàn (**Circular Loop Detection**: nếu A là mẹ của B thì B không thể là mẹ của A).<br>• **Xem trước tức thì (Live Impact Preview):** Hiển thị ngay tổng giá trị hợp đồng tập đoàn mẹ sẽ tăng thêm bao nhiêu tỷ đồng sau khi liên kết. | Modal `DeclareRelationshipModal.jsx` với bộ kiểm tra lỗi thông minh và các nút bấm thử nhanh kịch bản kiểm thử. |
| **2** | **Trang công ty mẹ hiển thị tổng giá trị hợp đồng của cả nhóm công ty** | • **Hero Financial Bar Hợp Nhất:** Trang chi tiết tập đoàn hiển thị nổi bật **TỔNG GIÁ TRỊ HỢP ĐỒNG CẢ TẬP ĐOÀN (CONSOLIDATED VALUE)** với số tiền hàng trăm tỷ VNĐ (tự động cộng dồn hợp đồng của công ty mẹ + toàn bộ các công ty con thành viên).<br>• **Tách bạch nguồn doanh số:** Phân định rõ Doanh số riêng của Công ty Mẹ vs Đóng góp từ các Công ty Con (% và số tiền).<br>• **Sơ đồ Cây Tập Đoàn Trực Quan (Hierarchy Tree):** Hiển thị sơ đồ phả hệ từ Công ty Mẹ đến các Công ty Con, hiển thị doanh số từng nhánh, người phụ trách và nút thao tác.<br>• **Bảng Hợp Đồng Hợp Nhất:** Danh sách toàn bộ hợp đồng trong nhóm, có badge phân loại rõ hợp đồng nào do Mẹ ký, hợp đồng nào do Con ký.<br>• **Phân tích Cơ cấu Doanh thu:** Bảng và biểu đồ tỷ trọng đóng góp phần trăm của từng pháp nhân. | Màn hình `ParentCompanyDetailView.jsx` với 4 tab nghiệp vụ chuyên sâu. |

---

## 2. Cấu Trúc Thư Mục Dự Án

```
S3-02-company-hierarchy/
├── index.html                               # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                             # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                           # Cấu hình Vite máy chủ tại cổng 5178
├── run.bat                                  # File khởi chạy ứng dụng tự động 1-click trên Windows
├── README.md                                # Tài liệu phân tích và hướng dẫn kiểm thử chi tiết
└── src/
    ├── main.jsx                             # Điểm gắn kết React DOM 19
    ├── App.jsx                              # Quản lý State toàn cục, điều hướng màn hình & Toast
    ├── index.css                            # CSS thiết kế chuẩn Enterprise, Dark/Light mode, Glassmorphism
    ├── data/
    │   └── mockData.js                      # Dữ liệu mẫu chuẩn: FPT, Vingroup, Masan, Viettel, Techcombank...
    ├── utils/
    │   └── hierarchyUtils.js                # Thuật toán tính tổng hợp nhất, cây phả hệ, kiểm tra vòng lặp
    └── components/
        ├── Header.jsx                       # Thanh tiêu đề, Role Switcher, Ticket Badge, đổi Theme
        ├── KpiSummaryCards.jsx              # 4 thẻ chỉ số KPI tổng quan hệ thống tập đoàn
        ├── CustomerListView.jsx             # Bảng danh sách khách hàng doanh nghiệp & bộ lọc
        ├── ParentCompanyDetailView.jsx      # ★ LÕI TRANG CÔNG TY MẸ HIỂN THỊ TỔNG GIÁ TRỊ NHÓM
        ├── DeclareRelationshipModal.jsx     # ★ LÕI GẮN MỘT KHÁCH HÀNG LÀM CÔNG TY CON CỦA KHÁCH HÀNG KHÁC
        ├── UnlinkConfirmationModal.jsx      # Modal xác nhận tách công ty con an toàn
        ├── CustomerDetailModal.jsx          # Modal xem hồ sơ chi tiết và hợp đồng riêng lẻ
        ├── JiraGuideModal.jsx               # Bảng tra cứu trực quan đối chiếu 2 tiêu chí nghiệm thu Jira
        └── Toast.jsx                        # Thông báo phản hồi thời gian thực
```

---

## 3. Hướng Dẫn Cài Đặt & Khởi Chạy Ứng Dụng

### Cách 1: Chạy nhanh 1-Click bằng file `run.bat` (Khuyên dùng trên Windows)
Nhấp đúp chuột vào file:
```cmd
run.bat
```
Ứng dụng sẽ tự động mở trên trình duyệt tại địa chỉ: `http://localhost:5178`

### Cách 2: Chạy bằng dòng lệnh Terminal
```bash
cd subtask-frontend/S3-02-company-hierarchy
npm run dev -- --open
```

---

## 4. Kịch Bản Kiểm Thử Nghiệm Thu (Acceptance Testing Checklist)

### 🧪 Kịch bản 1: Kiểm tra Tiêu chí 2 (Trang công ty mẹ hiển thị tổng giá trị hợp đồng của cả nhóm công ty)
1. Trên giao diện Danh sách Khách hàng, tìm dòng **Công ty Cổ phần FPT (FPT-CORP)**.
2. Quan sát cột **"Tổng Giá Trị Tập Đoàn (Consolidated)"**:
   - Hiển thị số tiền: **`197.000.000.000 đ`** (197 Tỷ đồng).
   - Nhấn nút **"🏢 Xem Tập Đoàn"**.
3. Quan sát giao diện **Trang Chi Tiết Tập Đoàn FPT**:
   - Khối tài chính màu xanh phát sáng hiển thị:
     - **Tổng giá trị hợp đồng cả nhóm công ty:** `197.000.000.000 đ`.
     - **Doanh số riêng của Công ty Mẹ:** `63.500.000.000 đ` (32.2%).
     - **Đóng góp từ 4 Công ty Con:** `133.500.000.000 đ` (67.8%).
     - **Tổng số hợp đồng toàn nhóm:** `9 Hợp đồng`.
4. Bấm vào tab **"Hợp Đồng Hợp Nhất Cả Tập Đoàn"**:
   - Toàn bộ 9 hợp đồng được liệt kê chi tiết.
   - Thử chọn lọc theo dropdown *"FPT Software"* hoặc *"FPT IS"*: Bảng lập tức lọc hợp đồng của riêng đơn vị đó và cập nhật lại tổng số tiền.
5. Bấm vào tab **"Sơ Đồ Cây Tập Đoàn"**:
   - Quan sát cây phả hệ với Công ty mẹ ở đỉnh và 4 nhánh công ty con tỏa xuống bên dưới.

### 🧪 Kịch bản 2: Kiểm tra Tiêu chí 1 (Gắn một khách hàng làm công ty con của khách hàng khác)
1. Bấm nút **"+ Gắn thêm công ty con vào tập đoàn"** (hoặc nút *"Khai báo Quan hệ Mẹ - Con"* ở thanh công cụ).
2. Thử nghiệm **Gắn khách hàng thành công**:
   - Ô 1 (Công ty Con): Chọn **Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)** hoặc **ABC Tech Solutions**.
   - Ô 2 (Công ty Mẹ): Chọn **Công ty Cổ phần FPT (FPT Corporation)**.
   - Chọn Tỷ lệ sở hữu: `65%`.
   - Quan sát khối **"Xem trước tác động"**: Hệ thống tính toán ngay tổng giá trị Tập đoàn FPT sẽ tăng từ `197 Tỷ đ` lên `222 Tỷ đ` (+ 25 Tỷ đ từ hợp đồng của Techcombank)!
   - Bấm nút **"Xác Nhận Khai Báo Quan Hệ Mẹ - Con"**.
   - Quan sát: Toast thông báo màu xanh thành công, và tổng giá trị Tập đoàn FPT lập tức cập nhật thành **222 Tỷ đ**, cây tập đoàn có thêm nhánh Techcombank!

### 🧪 Kịch bản 3: Kiểm tra Chặn Lỗi Nghiệp Vụ (Anti-Circular Dependency & Self-parenting)
1. Mở lại Modal **Khai báo Quan hệ Mẹ - Con**.
2. Bấm nút tiện ích: **"⚡ Kiểm tra lỗi vòng lặp (Circular Loop)"**:
   - Hệ thống tự điền: Công ty Con là *FPT Corporation*, Công ty Mẹ là *FPT Software*.
   - **Kết quả:** Hệ thống lập tức xuất hiện **Cảnh báo lỗi màu đỏ**: *"Phát hiện xung đột vòng lặp tuần hoàn (Circular Loop): Công ty FPT Software hiện đang là công ty con trực thuộc của FPT Corporation. Do đó không thể đảo ngược quan hệ này!"* và **Nút Lưu bị khóa hoàn toàn**.
3. Bấm nút: **"⚡ Kiểm tra lỗi tự gán chính mình"**:
   - Chọn FPT Corp làm mẹ của FPT Corp $\rightarrow$ Hệ thống cảnh báo đỏ và khóa nút lưu.

### 🧪 Kịch bản 4: Kiểm tra Tách công ty con (Unlink / Detach)
1. Tại Sơ đồ Cây hoặc Bảng Quản lý Công ty Con của Tập đoàn FPT, bấm nút **"Tách"** tại một công ty con.
2. Modal xác nhận mở ra, hiển thị rõ số tiền sẽ bị giảm trừ khỏi tổng giá trị tập đoàn mẹ.
3. Bấm **"Xác Nhận Ngắt Liên Kết"** $\rightarrow$ Hệ thống cập nhật lại ngay tổng giá trị tập đoàn mẹ và chuyển công ty con thành Pháp nhân Độc lập.
