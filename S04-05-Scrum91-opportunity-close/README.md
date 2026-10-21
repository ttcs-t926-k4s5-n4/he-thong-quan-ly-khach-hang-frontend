# HỆ THỐNG QUẢN LÝ ĐÓNG CƠ HỘI BÁN HÀNG & CHỈ TIÊU KPI SALES (SCRUM-91)

> **Mã Nhiệm Vụ (Jira Ticket):** `⚡ SCRUM-20 / ☑ SCRUM-91`  
> **Trạng thái:** `review`  
> **User Story:** *"Là Nhân viên kinh doanh, tôi muốn đóng một cơ hội với kết quả thắng hoặc thua, để công ty học được từ cả thương vụ thắng lẫn thua."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Vanilla Enterprise CSS Design System`, `Lucide Icons`  
> **Tỷ lệ hoàn thành:** 100% tất cả 4 tiêu chí chấp nhận (Acceptance Criteria) trong đề bài.

---

## 🎯 1. BẢNG ĐỐI CHIẾU 4 TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| STT | Tiêu chí trong Jira Ticket (Description) | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng kiểm thử |
| :---: | :--- | :--- | :--- |
| **AC1** | **Đóng Thắng bắt buộc nhập giá trị chốt thực tế và ngày ký** | • **Modal Đóng Thắng (`CloseWonModal.jsx`):**<br>- Form bắt buộc nhập `Giá trị chốt thực tế (VNĐ)`: Kiểm tra hợp lệ $> 0$, hiển thị định dạng tiền tệ và hộp so sánh chênh lệch (Δ Tăng/Giảm) so với giá trị dự kiến ban đầu.<br>- Bắt buộc chọn `Ngày ký hợp đồng` (không được để trống).<br>- Tự động gợi ý mã hợp đồng kinh tế và chọn các yếu tố then chốt chiến thắng.<br>- Nhập ghi chú bài học thành công chia sẻ cho toàn bộ Sales team.<br>- Kích hoạt hiệu ứng pháo hoa ăn mừng (Confetti celebration effect). | Bấm nút *"Đóng Thắng"* tại cơ hội đang đàm phán; validation báo đỏ nếu để trống giá trị hoặc ngày ký; sau khi đóng chuyển stage sang `CLOSED_WON` và khóa sửa đổi. |
| **AC2** | **Đóng Thua bắt buộc chọn lý do thua và đối thủ thắng thầu nếu có** | • **Modal Đóng Thua (`CloseLostModal.jsx`):**<br>- Bắt buộc chọn `Lý do thua` từ danh mục chuẩn (Giá quá cao, Thiếu tính năng cốt lõi, Đối thủ quan hệ sâu hơn, Khách hàng hoãn/hủy dự án...).<br>- Bắt buộc/chọn `Đối thủ thắng thầu nếu có` (Viettel Solutions, FPT, VNPT, CMC, MISA, Base.vn, Salesforce...) kèm giá trúng thầu ước tính của đối thủ.<br>- Nhập chi tiết phân tích nguyên nhân thua & bài học kinh nghiệm để bộ phận Sản phẩm (Product/R&D) và Ban Giám đốc cải tiến. | Bấm nút *"Đóng Thua"*; validation chặn submit nếu chưa chọn lý do; ghi nhận đối thủ và bài học vào Trung tâm học hỏi Win/Loss Hub. |
| **AC3** | **Cơ hội đã đóng không sửa được, chỉ Trưởng nhóm trở lên mở lại được kèm lý do** | • **Khóa cơ hội đã đóng (Immutability & Lock):** Khi cơ hội chuyển sang `CLOSED_WON` hoặc `CLOSED_LOST`, thuộc tính `isLocked = true`. Nút Đóng biến mất, hiển thị huy hiệu `🔒 Đã Khóa`.<br>• **Bộ chuyển đổi vai trò (Persona Switcher):**<br>- *Nhân viên kinh doanh (Nguyễn Văn An / Trần Thị Mai)*: Nút "Mở Lại" bị vô hiệu hóa kèm cảnh báo không đủ quyền hạn.<br>- *Trưởng nhóm (Trần Đình Trọng)* hoặc *Giám đốc (Lê Hoàng Nam)*: Có quyền bấm *"Mở Lại"*, mở `ReopenModal.jsx`.<br>• **Bắt buộc nhập lý do mở lại:** Bắt buộc nhập lý do (tái đàm phán, phụ lục hợp đồng, sai số liệu...). Mọi thao tác được lưu vết vĩnh viễn vào **Nhật ký kiểm toán (Audit Trail)**. | Thử mở lại khi ở vai trò Sales Rep $\rightarrow$ bị chặn; chuyển sang Team Lead $\rightarrow$ mở modal, bắt buộc nhập lý do $\rightarrow$ cơ hội mở khóa về trạng thái đàm phán. |
| **AC4** | **Cơ hội thắng được tính vào chỉ tiêu của người sở hữu** | • **Động cơ tính toán KPI thời gian thực (`calculateUserKpis`):** Tự động lọc tất cả cơ hội `CLOSED_WON` thuộc sở hữu của Sales Rep (`ownerId`), cộng dồn `actualValue` vào doanh số thực tế.<br>• **Thanh tiến độ KPI động:** Hiển thị % Hoàn thành chỉ tiêu, số tiền còn thiếu, badge "Vượt chỉ tiêu 🏆" khi đạt $\ge 100\%$.<br>• **Đồng bộ đảo chiều an toàn:** Khi một cơ hội thắng bị Trưởng nhóm Mở lại (Re-opened), hệ thống tự động hoàn trừ chính xác số tiền thắng khỏi chỉ tiêu của người sở hữu ngay lập tức! | Thẻ KPI hiển thị doanh số đạt được; đóng thắng cơ hội mới làm thanh tiến độ tăng ngay lập tức; mở lại cơ hội thắng làm KPI hoàn trừ tự động. |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
S04-05-Scrum91-opportunity-close/
├── index.html                           # HTML gốc, nhúng font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình Vite máy chủ phát triển (Cổng 5186)
├── run.bat                              # File khởi chạy 1-Click trên Windows
├── README.md                            # Tài liệu đối chiếu 4 tiêu chí chấp nhận & hướng dẫn kiểm thử
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # State trung tâm điều phối cơ hội, vai trò và tính KPI
    ├── index.css                        # CSS hoàn chỉnh chuẩn Enterprise (Glassmorphism, Dark/Light mode)
    ├── data/
    │   ├── mockOpportunities.js         # Dữ liệu cơ hội B2B (các stage: Negotiation, Proposal, Won, Lost, Audit log)
    │   ├── mockUsers.js                 # Danh sách Sales Rep, Team Lead, Director kèm Quota chỉ tiêu doanh số
    │   ├── mockLossReasons.js           # Danh mục chuẩn lý do thua và lý do thắng then chốt
    │   └── mockCompetitors.js           # Danh mục đối thủ cạnh tranh thị trường (Viettel, FPT, CMC, MISA...)
    ├── utils/
    │   ├── formatters.js                # Định dạng tiền tệ VND, ngày tháng, tính toán KPI người sở hữu
    │   └── confetti.js                  # Hiệu ứng pháo hoa ăn mừng khi đóng Thắng hợp đồng
    └── components/
        ├── Header.jsx                   # Topbar, Huy hiệu Jira ticket, Persona Switcher, Theme Switcher
        ├── JiraTicketModal.jsx          # Modal tra cứu chi tiết đề bài Jira ticket & bảng tiêu chí AC1-AC4
        ├── KpiQuotaOverview.jsx         # Bảng theo dõi Chỉ tiêu Doanh số của Sales Rep (AC4)
        ├── OpportunityTable.jsx         # Bảng cơ hội bán hàng, tìm kiếm, lọc và các nút thao tác nghiệp vụ
        ├── CloseWonModal.jsx            # ★ MODAL ĐÓNG THẮNG: Bắt buộc giá trị chốt thực tế & ngày ký (AC1)
        ├── CloseLostModal.jsx           # ★ MODAL ĐÓNG THUA: Bắt buộc chọn lý do thua & đối thủ (AC2)
        ├── ReopenModal.jsx              # ★ MODAL MỞ LẠI: Kiểm tra quyền Trưởng nhóm & bắt buộc lý do (AC3)
        ├── OpportunityDetailModal.jsx   # Xem chi tiết hồ sơ cơ hội, trạng thái khóa & Nhật ký kiểm toán
        ├── WinLossAnalytics.jsx         # ★ TRUNG TÂM PHÂN TÍCH & BÀI HỌC KINH NGHIỆM THẮNG / THUA
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. HƯỚNG DẪN KHỞI CHẠY NHANH

### Cách 1: Khởi chạy 1-Click trên Windows
Nhấp đúp chuột vào file **`run.bat`** trong thư mục dự án. Trình duyệt sẽ tự động mở tại:  
👉 **`http://localhost:5186`**

### Cách 2: Khởi chạy qua dòng lệnh Terminal
```bash
# Di chuyển vào thư mục dự án
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-05-Scrum91-opportunity-close"

# Khởi chạy máy chủ phát triển
npm.cmd run dev
```

---

## 🧪 4. KỊCH BẢN KIỂM THỬ TỪNG TIÊU CHÍ (TEST CASES)

### Test Case 1: Kiểm thử Tiêu chí 1 (AC1 - Đóng Thắng)
1. Đăng nhập vai trò **Nguyễn Văn An (Nhân viên kinh doanh)** trên thanh Persona Switcher ở góc trên bên phải.
2. Tại bảng danh sách cơ hội, tìm cơ hội **OPP-2026-101** (*Triển khai CRM cho Tập đoàn Dệt may Hòa Phát* - Giá trị dự kiến 120.000.000 ₫).
3. Bấm nút **"Đóng Thắng"** màu xanh lá.
4. Xóa trắng trường *Giá trị chốt thực tế* hoặc *Ngày ký* $\rightarrow$ Bấm xác nhận $\rightarrow$ Hệ thống lập tức báo lỗi validation màu đỏ.
5. Nhập giá trị chốt thực tế là `135000000` (135 triệu), chọn ngày ký hôm nay, tích chọn lý do thắng và nhập bài học thành công.
6. Bấm **"Xác Nhận Đóng Thắng & Tính KPI"**:
   - Pháo hoa ăn mừng bung tỏa trên màn hình.
   - Trạng thái cơ hội chuyển sang `CLOSED_WON` kèm huy hiệu `🔒 Đã Khóa`.
   - Xem thanh KPI phía trên: Doanh số thực tế của Nguyễn Văn An lập tức được cộng thêm 135.000.000 ₫!

### Test Case 2: Kiểm thử Tiêu chí 2 (AC2 - Đóng Thua)
1. Tìm cơ hội **OPP-2026-102** (*Chuỗi Phở 24* do Lê Quốc Hưng sở hữu).
2. Bấm nút **"Đóng Thua"** màu đỏ.
3. Không chọn lý do thua $\rightarrow$ Bấm submit $\rightarrow$ Hệ thống chặn lại và yêu cầu chọn lý do bắt buộc.
4. Chọn lý do: *"Giá quá cao so với ngân sách khách hàng"*, chọn đối thủ: *"MISA AMIS"*, nhập bài học rút ra.
5. Bấm **"Xác Nhận Đóng Thua & Lưu Bài Học"**:
   - Trạng thái cơ hội chuyển sang `CLOSED_LOST` và khóa sửa đổi.
   - Chuyển sang Tab *"Phân Tích & Bài Học Thắng/Thua"* $\rightarrow$ Thấy lý do và đối thủ được tự động thống kê vào biểu đồ phân tích thị phần.

### Test Case 3: Kiểm thử Tiêu chí 3 (AC3 - Quyền Khóa & Mở Lại)
1. Tại cơ hội **OPP-2026-104** (đã đóng thắng):
   - Đang ở vai trò **Nguyễn Văn An (Sales Rep)**: Nút *"Mở Lại"* bị vô hiệu hóa (disabled), rê chuột vào hiển thị tooltip giải thích quyền hạn.
2. Chuyển Persona Switcher trên Topbar sang **Trần Đình Trọng (Trưởng nhóm kinh doanh)**:
   - Nút *"Mở Lại"* chuyển sang khả dụng (màu tím).
3. Bấm nút **"Mở Lại"**:
   - Modal mở lại hiện ra, cảnh báo nếu mở lại cơ hội thắng thì doanh số sẽ bị hoàn trừ khỏi KPI của người sở hữu.
   - Để trống lý do mở lại $\rightarrow$ Bị chặn validation.
   - Nhập lý do: *"Khách hàng yêu cầu tái đàm phán bổ sung thêm 2 phân hệ"* $\rightarrow$ Bấm xác nhận.
   - Cơ hội quay lại trạng thái `NEGOTIATION`, mở khóa cho phép sửa, và ghi nhận nhật ký kiểm toán.

### Test Case 4: Kiểm thử Tiêu chí 4 (AC4 - Tính Chỉ Tiêu KPI Người Sở Hữu)
1. Quan sát chỉ tiêu cá nhân của các nhân viên tại Tab *"Chỉ Tiêu Doanh Số (AC4)"*.
2. Khi bất kỳ cơ hội nào chuyển sang `CLOSED_WON`, số tiền chốt thực tế tự động cộng dồn theo thời gian thực vào đúng người sở hữu cơ hội đó.
3. Khi đạt $\ge 100\%$ chỉ tiêu, nhân viên nhận huy hiệu vinh danh *"Vượt chỉ tiêu 🏆"*.
4. Khi Trưởng nhóm mở lại một cơ hội đã thắng, số tiền đó lập tức được hoàn trừ chính xác.
