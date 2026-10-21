# Hệ Thống Nhật Ký Thay Đổi Dữ Liệu Nhạy Cảm (SCRUM-62)

> **Mã công việc:** SCRUM-16 / SCRUM-62  
> **Ngôn ngữ & Công nghệ:** React 19, Vite, Vanilla Modern CSS, Lucide Icons  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Quản trị hệ thống, tôi muốn xem nhật ký thay đổi trên dữ liệu nhạy cảm, để truy được ai đã sửa chiết khấu hoặc chỉ tiêu khi cuối quý số liệu không khớp."*

### Yêu Cầu Chức Năng (Acceptance Criteria):
1. **Ghi lại mọi thay đổi trên:**
   - **Chiết khấu (Discount):** Tỷ lệ %, chiết khấu thương mại, khuyến mại giờ chót.
   - **Chỉ tiêu (Sales Target / Quota):** Chỉ tiêu doanh số vùng/miền, hạn mức KPI cá nhân & tập thể.
   - **Quyền sở hữu dữ liệu (Data Ownership):** Phụ trách hợp đồng, tài khoản khách hàng VIP, dự án lớn.
   - **Vai trò người dùng (User Role):** Cấp quyền đặc cách, thay đổi phân quyền duyệt chiết khấu và phê duyệt ngân sách.
2. **Mỗi bản ghi kiểm toán (Audit Record) có đầy đủ:**
   - **Người thực hiện:** Tên, Email, Ảnh đại diện, Vai trò trong tổ chức, Địa chỉ IP & Thiết bị.
   - **Thời điểm:** Ngày giờ thực hiện chi tiết đến từng giây.
   - **Giá trị Trước (Old / Previous Value):** Định dạng trực quan, gạch ngang màu đỏ.
   - **Giá trị Sau (New / Modified Value):** Nổi bật màu xanh, mũi tên chuyển dịch giá trị.
3. **Bộ lọc đa chiều (Filtering & Search):**
   - **Lọc theo Người dùng:** Dropdown chọn nhân sự kèm thông tin phòng ban.
   - **Lọc theo Loại đối tượng:** Chiết khấu, Chỉ tiêu, Quyền sở hữu, Vai trò.
   - **Lọc theo Khoảng thời gian:** Chọn từ ngày - đến ngày + Các mốc nhanh (Chốt Quý 3: 28-30/09, Hôm nay, 7 ngày qua, Tháng 9).
   - **Tìm kiếm từ khóa tức thì:** Tìm theo mã bản ghi, tên đối tượng, lý do điều chỉnh.

---

## 2. Các Tính Năng Nổi Bật Được Tích Hợp

- 🔍 **Chế độ Điều tra Sai lệch Cuối Quý (Forensic Discrepancy Investigation):**
  - Hệ thống tự động đánh dấu các giao dịch bất thường (Anomalous transactions) xảy ra vào những giờ phút cuối của Quý 3 (Ví dụ: Hạ 4.5 tỷ chỉ tiêu lúc 23:42 ngày 30/09, đẩy chiết khấu lên 28.5% làm hụt 1.8 tỷ doanh thu).
  - Nút chuyển nhanh 1-chạm giúp Quản trị viên lọc ngay các bản ghi gây lệch số liệu.
- 🧪 **Trình Giả Lập Thay Đổi Dữ Liệu Nhạy Cảm (Live Simulation Sandbox):**
  - Cho phép người dùng nhấn nút `+ Giả lập sửa dữ liệu nhạy cảm`.
  - Thay đổi thực tế giá trị của Chiết khấu / Chỉ tiêu / Quyền sở hữu / Vai trò, nhập lý do giải trình.
  - Ngay lập tức một bản ghi Audit Log mới được sinh ra và đưa lên đầu bảng theo thời gian thực (Real-time Audit Trail).
- 🔬 **Modal Chi Tiết Kiểm Toán & So Sánh Visual Diff:**
  - So sánh song song (Side-by-side) Giá trị trước vs Giá trị sau.
  - Hiển thị chữ ký toàn vẹn SHA-256 chống làm giả dữ liệu kiểm toán.
  - Tích hợp nút in trích lục kiểm toán thân thiện cho thanh tra nội bộ.
- 📥 **Xuất Báo Cáo CSV / Excel:**
  - Hỗ trợ mã hóa UTF-8 BOM, đảm bảo mở trực tiếp bằng Microsoft Excel trên Windows hiển thị tiếng Việt có dấu chuẩn 100%.

---

## 3. Cấu Trúc Thư Mục Dự Án

```
scrum-62-audit-log/
├── index.html                   # HTML gốc, Google Fonts Inter & JetBrains Mono, SEO tags
├── package.json                 # Cấu hình dự án React + Vite
├── run.bat                      # File chạy ứng dụng tự động 1-click
├── src/
│   ├── main.jsx                 # Điểm khởi chạy React DOM
│   ├── App.jsx                  # State chính, logic lọc & xử lý nghiệp vụ
│   ├── App.css                  # Toàn bộ CSS phong cách Modern Dark Enterprise
│   ├── index.css                # CSS variables, typography, glassmorphism, reset
│   ├── data/
│   │   └── mockData.js          # Dữ liệu mẫu kiểm toán bám sát kịch bản lệch số liệu cuối quý
│   ├── utils/
│   │   └── exportCsv.js         # Tiện ích xuất file CSV chuẩn kiểm toán
│   └── components/
│       ├── Header.jsx           # Thanh tiêu đề, thông tin Jira Ticket & User Story
│       ├── KpiMetrics.jsx       # 4 thẻ chỉ số thống kê & lọc nhanh
│       ├── ForensicBanner.jsx   # Banner cảnh báo vụ việc lệch 6.3 tỷ Quý 3
│       ├── FilterBar.jsx        # Bộ lọc người dùng, loại đối tượng, khoảng thời gian
│       ├── AuditLogTable.jsx    # Bảng nhật ký thay đổi với visual diff & phân trang
│       ├── AuditDetailModal.jsx # Hộp thoại soi chi tiết bằng chứng & chữ ký số
│       ├── SimulateChangeModal.jsx # Hộp thoại thực hành sửa dữ liệu nhạy cảm
│       └── NotificationToast.jsx   # Thông báo phản hồi thao tác
```

---

## 4. Hướng Dẫn Khởi Chạy Ứng Dụng

### Cách 1: Sử dụng file `run.bat` (Khuyên dùng trên Windows)
Chỉ cần nhấp đúp chuột vào file:
```
c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\scrum-62-audit-log\run.bat
```

### Cách 2: Khởi chạy qua dòng lệnh Terminal
```bash
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\scrum-62-audit-log"
npm run dev
```
Sau đó mở trình duyệt tại: **`http://localhost:5173`**
