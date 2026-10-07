# Hệ Thống Quản Lý Danh Mục Sản Phẩm & Bảng Giá Niêm Yết Chuẩn (SCRUM-63)

> **Mã công việc:** SCRUM-17 / SCRUM-63  
> **Ngôn ngữ & Công nghệ:** React 19, Vite, Vanilla Modern CSS, Lucide Icons  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Giám đốc kinh doanh, tôi muốn quản lý danh mục sản phẩm dịch vụ và bảng giá niêm yết, để mọi báo giá đều xuất phát từ một bảng giá chuẩn thay vì giá tự nghĩ."*

### 4 Tiêu Chí Nghiệm Thu (Acceptance Criteria) Từ Đề Bài:

| STT | Yêu cầu trong mô tả (Description) | Giải pháp kỹ thuật trong ứng dụng React |
| :---: | :--- | :--- |
| **1** | **Khai báo đầy đủ:** Mã, tên, loại (sản phẩm một lần hoặc dịch vụ thuê bao), đơn vị tính, giá niêm yết, giá sàn. | Form modal chuẩn hóa có phân loại rõ ràng (📦 Sản phẩm một lần vs 🔄 Dịch vụ thuê bao kèm chu kỳ tính phí: Tháng/Quý/Năm), kiểm tra trùng mã SKU, bắt buộc Giá sàn $\le$ Giá niêm yết chuẩn. |
| **2** | **Quy tắc giá sàn:** Giá sàn là ngưỡng để xác định báo giá có cần duyệt chiết khấu hay không. | Trình tạo báo giá tự động so sánh đơn giá chào bán với Giá sàn:<br>• **Đơn giá $\ge$ Giá sàn:** `🟢 Hợp lệ (Tự động duyệt)`<br>• **Đơn giá $<$ Giá sàn:** `⚠️ Vượt thẩm quyền - Bắt buộc chuyển Giám đốc kinh doanh duyệt chiết khấu ngoại lệ`. |
| **3** | **Phân quyền giá vốn:** Giá vốn chỉ Giám đốc kinh doanh xem và sửa được. | **Role Switcher** linh hoạt (Giám đốc kinh doanh vs Nhân viên kinh doanh):<br>• **Giám đốc:** Xem số tiền Giá vốn, tính toán Biên lợi nhuận gộp (Gross Margin %), chỉnh sửa giá vốn trong biểu mẫu.<br>• **Nhân viên KD:** Cột giá vốn hiển thị mã hóa `•••••• 🔒`, trường nhập giá vốn bị vô hiệu hóa kèm cảnh báo bảo mật. |
| **4** | **Toàn vẹn dữ liệu:** Sản phẩm đã xuất hiện trong báo giá thì không xoá được, chỉ ngừng kinh doanh. | Kiểm tra liên kết dữ liệu thời gian thực giữa Bảng giá & Lịch sử báo giá:<br>• **Nếu sản phẩm đã có trong bất kỳ báo giá nào:** Chặn thao tác xoá cứng, hiển thị Modal cảnh báo nghiệp vụ và cung cấp nút 1-chạm chuyển sang trạng thái *"Ngừng kinh doanh"*.<br>• **Sản phẩm Ngừng kinh doanh:** Tự động bị ẩn/khóa trong Trình tạo báo giá mới, nhưng toàn bộ báo giá cũ vẫn nguyên vẹn. |

---

## 2. Cấu Trúc Thư Mục Dự Án

```
scrum-63-price-catalog/
├── index.html                           # HTML chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite
├── run.bat                              # File khởi chạy ứng dụng 1-click trên Windows
├── vite.config.js                       # Cấu hình máy chủ Vite port 5174
├── src/
│   ├── main.jsx                         # Điểm gắn kết React DOM
│   ├── App.jsx                          # State trung tâm, điều hướng Tab, kiểm soát ràng buộc xoá & phân quyền
│   ├── index.css                        # Hệ thống thiết kế Modern CSS (Dark/Light mode, Glassmorphism, Micro-animations)
│   ├── data/
│   │   └── mockData.js                  # Dữ liệu mẫu tiêu chuẩn B2B (SP 1 lần, Dịch vụ thuê bao, Báo giá mẫu, Khách hàng)
│   ├── utils/
│   │   └── formatters.js                # Hàm format tiền tệ VNĐ (₫), tỷ lệ %, tính toán biên lợi nhuận
│   └── components/
│       ├── Header.jsx                   # Thanh tiêu đề, Bộ chuyển vai trò (Role Switcher), Đổi theme Sáng/Tối
│       ├── SecurityBanner.jsx           # Banner thông báo quyền hạn bảo mật tương ứng với vai trò hiện tại
│       ├── StatsCards.jsx               # Thẻ chỉ số KPI (Tổng SP, Thuê bao MRR, Báo giá cần duyệt, Biên LN Giám đốc)
│       ├── ProductCatalog.jsx           # Bảng danh mục sản phẩm, bộ lọc loại/trạng thái/ngành hàng, sắp xếp giá/biên LN
│       ├── ProductModal.jsx             # Biểu mẫu Thêm mới / Chỉnh sửa sản phẩm với phân quyền giá vốn
│       ├── QuoteSimulator.jsx           # Trình lập báo giá từ Bảng giá chuẩn, tự động đánh giá ngưỡng giá sàn
│       ├── QuoteApprovalList.jsx        # Danh sách báo giá, giao diện phê duyệt chiết khấu của Giám đốc kinh doanh
│       ├── DeleteConstraintModal.jsx    # Hộp thoại cảnh báo toàn vẹn dữ liệu khi cố xoá sản phẩm đã có báo giá
│       ├── DirectorGuideModal.jsx       # Modal hướng dẫn nghiệm thu 4 tiêu chí SCRUM-63
│       └── AnalyticsDashboard.jsx       # Bảng phân tích cơ cấu sản phẩm & mức độ tuân thủ giá sàn
```

---

## 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Chạy tự động bằng 1-Click trên Windows
1. Mở thư mục `subtask-frontend/scrum-63-price-catalog/`
2. Nhấp đúp chuột vào file **`run.bat`**
3. Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:5174`

### Cách 2: Chạy bằng dòng lệnh Terminal
```bash
# Di chuyển vào thư mục dự án
cd "c:/Users/FPT SHOP/.gemini/antigravity-ide/scratch/subtask-frontend/scrum-63-price-catalog"

# Cài đặt thư viện (nếu chưa cài)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

---

## 4. Kịch Bản Kiểm Thử Nhanh Nghiệp Vụ (Demo Walkthrough)

### Kịch bản 1: Kiểm tra Phân quyền Giá Vốn (Tiêu chí 3)
1. Ở thanh Header phía trên cùng, bấm chọn vai trò **"Nhân Viên Kinh Doanh"**:
   - Cột **"Giá Vốn (COGS)"** trong bảng lập tức biến thành `•••••• 🔒`.
   - Chỉ số **"Biên Lợi Nhuận TB"** trên thẻ thống kê chuyển thành `•••••• (Dữ liệu bảo mật cấp Giám Đốc)`.
   - Bấm nút sửa bất kỳ sản phẩm nào -> Trường Giá vốn bị khóa mờ hoàn toàn với thông báo không có quyền can thiệp.
2. Bấm chuyển lại vai trò **"Giám Đốc Kinh Doanh"**:
   - Toàn bộ Giá vốn được hiển thị rõ ràng bằng số tiền VNĐ.
   - Hiển thị trực quan Biên lợi nhuận gộp (Gross Margin %) theo thời gian thực và cho phép chỉnh sửa giá vốn.

### Kịch bản 2: Kiểm tra Ràng buộc Xoá Sản Phẩm Đã Có Báo Giá (Tiêu chí 4)
1. Trong bảng sản phẩm, tìm sản phẩm `SP-ERP-ENT` (đang có trong 1 báo giá):
   - Bấm vào biểu tượng thùng rác màu đỏ (Xoá).
   - **Kết quả:** Hệ thống **CHẶN XOÁ HOÀN TOÀN**, hiển thị popup *"Ràng Buộc Nghiệp Vụ Toàn Vẹn Dữ Liệu (SCRUM-63)"*, liệt kê chi tiết báo giá `BG-2026-001` đang sử dụng sản phẩm này.
   - Bấm nút **"Chuyển Sang 'Ngừng Kinh Doanh' Ngay"** -> Sản phẩm chuyển sang trạng thái Ngừng kinh doanh an toàn.
2. Tìm sản phẩm `SP-DEMO-TEST` (sản phẩm mẫu chưa từng có báo giá nào, số báo giá = 0):
   - Bấm biểu tượng thùng rác (Xoá).
   - **Kết quả:** Hệ thống cho phép xác nhận và xoá bình thường khỏi danh mục.

### Kịch bản 3: Kiểm tra Kiểm soát Giá Sàn khi Lập Báo Giá (Tiêu chí 2)
1. Bấm tab **"2. Lập Báo Giá Chuẩn"**.
2. Chọn sản phẩm `Phần mềm ERP Doanh nghiệp` (Giá niêm yết chuẩn: 150.000.000 ₫, Giá sàn: 120.000.000 ₫).
3. Thử 2 trường hợp:
   - **Trường hợp A (Trong khung sàn):** Giảm giá xuống 135.000.000 ₫ ($\ge$ 120 triệu):
     - Hệ thống báo nhãn xanh: `✅ Trong khung cho phép (-10.0%)`.
     - Trạng thái tổng thể: `🟢 TỰ ĐỘNG PHÊ DUYỆT (HỢP LỆ)`.
   - **Trường hợp B (Dưới giá sàn):** Giảm giá xuống 100.000.000 ₫ ($<$ 120 triệu):
     - Hệ thống báo động đỏ nhấp nháy: `⚠️ CẦN DUYỆT CHIẾT KHẤU NGOẠI LỆ! (Thấp hơn giá sàn 20.000.000 ₫)`.
     - Yêu cầu sales bắt buộc nhập: *"Lý do xin duyệt chiết khấu ngoại lệ"*.
4. Bấm **"Gửi Trình Giám Đốc Duyệt Báo Giá"**:
   - Báo giá được tạo với mã mới và trạng thái *"Chờ GĐ Duyệt"*.
   - Sản phẩm được thêm vào báo giá này lập tức được khoá toàn vẹn dữ liệu (không thể xoá nữa).

### Kịch bản 4: Giám Đốc Phê Duyệt / Từ Chối Báo Giá Dưới Giá Sàn
1. Chuyển vai trò sang **"Giám Đốc Kinh Doanh"**.
2. Vào tab **"3. Danh Sách Báo Giá & Phê Duyệt"**:
   - Các báo giá dưới giá sàn (như `BG-2026-002`) sẽ hiển thị 2 nút thao tác nhanh: `[Duyệt]` và `[X] Từ chối`.
   - Hoặc bấm biểu tượng con mắt để xem toàn bộ thông tin chi tiết, nhập ý kiến chỉ đạo và ký duyệt báo giá.
