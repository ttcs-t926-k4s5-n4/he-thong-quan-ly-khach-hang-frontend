# HỆ THỐNG DÒNG THỜI GIAN TƯƠNG TÁC KHÁCH HÀNG & TIẾP NHẬN 5 PHÚT (SCRUM-102)

> **Mã Nhiệm Vụ (Jira Ticket):** `⚡ SCRUM-21 / ☑ SCRUM-102`  
> **Trạng thái:** `Ready for Review` / `Done`  
> **User Story:** *"Là Chăm sóc khách hàng, tôi muốn xem dòng thời gian tương tác đầy đủ của một khách hàng, để tiếp nhận khách từ đồng nghiệp mà nắm được bối cảnh trong năm phút."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Enterprise CRM Design System`, `Lucide Icons`  
> **Cổng khởi chạy máy chủ:** `http://localhost:5191`  
> **Tỷ lệ hoàn thành:** 100% tất cả các tiêu chí trong mô tả Jira Ticket.

---

## 🎯 1. BẢNG ĐỐI CHIẾU TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| STT | Tiêu chí trong Jira Ticket (Description) | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng & Kịch bản kiểm thử |
| :---: | :--- | :--- | :--- |
| **AC1** | **Gộp toàn bộ hoạt động, thay đổi cơ hội, báo giá đã gửi theo thứ tự thời gian** | • **Dòng thời gian hợp nhất (`TimelineView.jsx`):** Trục dọc trung tâm phát sáng (glowing spine) xâu chuỗi toàn bộ sự kiện theo đúng thứ tự thời gian (Chronological order).<br>• **Gộp đủ 4 nhóm tương tác chuẩn Enterprise:**<br>1. *Hoạt động thường nhật (Activities):* Cuộc gọi (Calls - thời lượng, kết quả), Cuộc họp (Meetings - Demo, khảo sát, biên bản), Email (Emails - trao đổi, tài liệu ISO), Ghi chú nội bộ (Notes).<br>2. *Thay đổi cơ hội (Opportunity Changes):* Khởi tạo cơ hội, thăng cấp giai đoạn (*Khảo sát* ➔ *Đề xuất Báo giá* ➔ *Thương thảo hợp đồng*), cập nhật xác suất thành công từ 40% lên 85%, điều chỉnh giá trị deal.<br>3. *Báo giá đã gửi (Quotes Sent):* Mã báo giá `BQ-2026-001`, `BQ-2026-002`, `BQ-2026-003` (820.000.000 ₫) kèm bảng chi tiết sản phẩm, chiết khấu 5% và file PDF đính kèm.<br>4. *Bàn giao trách nhiệm (Handover Events):* Sự kiện Sales Rep cũ bàn giao sang CSKH mới kèm lời dặn dò riêng.<br>• **Nhóm theo ngày tháng thông minh (`groupEventsByDate`):** Tự động phân tách các khối ngày (Hôm nay, Hôm qua, Ngày 15/10/2026...) kèm nhãn thời gian tương đối. | 1. Mở trang chủ `http://localhost:5191/` $\rightarrow$ Thấy toàn bộ lịch sử tương tác của Viettel Post xếp liền mạch theo thứ tự thời gian.<br>2. Trên dòng sự kiện báo giá ngày 15/10: Thấy khối nổi bật mã báo giá `BQ-2026-003` trị giá 820.000.000 ₫ (chiết khấu 5%).<br>3. Bấm nút *"Xem Bảng Chi Tiết Báo Giá"* $\rightarrow$ Modal hiển thị đầy đủ từng dịch vụ, đơn giá, thành tiền và điều khoản thanh toán 3 đợt. |
| **AC2** | **Lọc theo loại hoạt động và theo người thực hiện** | • **Lọc theo loại hoạt động (`TimelineFiltersBar.jsx`):**<br>- 7 chip lọc nhanh 1-Click: *Tất cả tương tác*, *📞 Cuộc gọi*, *🤝 Cuộc họp*, *✉️ Email trao đổi*, *💼 Thay đổi cơ hội*, *📄 Báo giá đã gửi*, *📝 Ghi chú & Bàn giao*.<br>- Đếm số lượng kết quả thời gian thực: Hiển thị rõ *"Đang xem: X / Y sự kiện"*.<br>• **Lọc theo người thực hiện (Performed By):**<br>- Dropdown chọn nhân sự: Lọc riêng các tương tác do *Lê Quốc Hưng* (Sales cũ), *Nguyễn Văn An* (Sales Rep), *Trần Thị Mai* (Kỹ sư Pre-sales), *Hoàng Kim Ngân* (CSKH), hoặc *Trần Đình Trọng* (Trưởng nhóm).<br>• **Bộ lọc bổ trợ thông minh:**<br>- Ô tìm kiếm từ khóa tức thì (gõ "báo giá", "chiết khấu", "POC", "0912"...).<br>- Lọc theo khoảng thời gian: 7 ngày qua, 30 ngày qua, Quý này, hoặc Toàn bộ.<br>- Đảo chiều sắp xếp: Mới nhất trước (DESC) $\leftrightarrow$ Cũ nhất trước (ASC).<br>- Bật/tắt chế độ *"Chỉ xem Mốc quan trọng (Milestones)"*. | 1. Bấm chip **"📄 Báo giá đã gửi"** $\rightarrow$ Dòng thời gian chỉ lọc ra 3 bản báo giá BQ-2026-001, 002, 003.<br>2. Chọn người thực hiện là **"Trần Thị Mai"** $\rightarrow$ Danh sách lập tức chỉ hiện các buổi họp kỹ thuật POC và email gửi kiến trúc bảo mật của kỹ sư Mai.<br>3. Nhập từ khóa *"chiết khấu"* vào ô tìm kiếm $\rightarrow$ Hệ thống lọc ngay cuộc gọi đàm phán và bản báo giá BQ-2026-003.<br>4. Bấm nút *"Mới nhất trước"* $\rightarrow$ Thứ tự dòng thời gian lập tức đảo chiều từ cũ đến mới trơn tru! |
| **AC3** | **Tiếp nhận khách từ đồng nghiệp mà nắm được bối cảnh trong 5 phút** | • **Trung tâm Tóm Tắt Bối Cảnh 5 Phút (`FiveMinuteBriefingDrawer.jsx`):**<br>- Nút nổi bật **`⚡ Bối Cảnh 5 Phút`** với hiệu ứng nhịp thở (pulse) mở ngay ngăn kéo bối cảnh điều hành.<br>- **Đồng hồ đếm thời gian đọc (5-Minute Timer):** Đếm ngược từ 05:00 giúp CSKH kiểm soát tốc độ tiếp thu bối cảnh (thời gian đọc thực tế chỉ ~2-3 phút).<br>- **Chân dung người quyết định chính (Key Decision Maker):** Anh Nguyễn Bảo Long - Giám đốc CNTT, phân tích đặc điểm tính cách (thẳng thắn, coi trọng dữ liệu bảo mật, giờ rảnh/giờ bận).<br>- **3 Điểm mấu chốt dặn dò từ đồng nghiệp cũ:** Tóm lược điều khoản chiết khấu, kết quả POC và thời điểm chốt hợp đồng tuần tới.<br>- **Lưu ý nhạy cảm (Sensitive Alert):** Cảnh báo những điều không nên nói khi tiếp xúc khách.<br>- **Kế hoạch hành động 24h đầu tiên:** Danh mục công việc kèm người phụ trách và hạn chót.<br>• **Quy trình tiếp nhận khách hàng 1-Click (`handleAcceptHandover`):**<br>- Nút *"Xác Nhận Tiếp Nhận Khách"* đổi trạng thái khách hàng sang *"Đã tiếp nhận bàn giao thành công"*.<br>- Tự động tạo và ghim ngay sự kiện bàn giao mới nhất lên đầu Timeline để lưu vết kiểm toán! | 1. Bấm nút **"⚡ Bối Cảnh 5 Phút"** trên thanh tiêu đề $\rightarrow$ Drawer bối cảnh trượt ra mượt mà từ bên phải.<br>2. Đồng hồ đếm 05:00 bắt đầu chạy; đọc lướt qua 4 mục: Tổng quan thương vụ, Chân dung anh Long, 3 điểm dặn dò và Kế hoạch 24h.<br>3. Bấm nút **"Sao Chép Tóm Tắt"** để dán nhanh vào sổ tay công việc.<br>4. Bấm nút **"Xác Nhận Đã Nắm Rõ & Tiếp Nhận Khách"** $\rightarrow$ Thẻ khách hàng chuyển trạng thái màu xanh ngọc, đồng thời dòng thời gian sinh ra sự kiện tiếp nhận của CSKH Hoàng Kim Ngân kèm thông báo Toast! |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
S04-06-Scrum102-customer-timeline/
├── index.html                           # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình máy chủ phát triển Vite (Cổng 5191)
├── run.bat                              # File khởi chạy 1-Click trên Windows
├── README.md                            # Tài liệu đối chiếu 3 tiêu chí chấp nhận & hướng dẫn kiểm thử
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # Điều phối State trung tâm (Khách hàng, Bộ lọc, Sự kiện, Modals)
    ├── index.css                        # CSS Design System hoàn chỉnh chuẩn Enterprise CRM (Dark/Light mode)
    ├── data/
    │   ├── mockTeamMembers.js           # Danh sách CSKH, Sales Rep cũ, Pre-sales & Trưởng nhóm
    │   ├── mockCustomers.js             # Dữ liệu 4 khách hàng B2B thực tế kèm hồ sơ tóm tắt 5 phút
    │   └── mockTimelineEvents.js        # Dữ liệu chi tiết các hoạt động, cơ hội, báo giá & bàn giao
    ├── utils/
    │   └── timelineUtils.js             # Hàm lọc theo loại, theo người, tìm kiếm, nhóm ngày & định dạng VNĐ
    └── components/
        ├── Header.jsx                   # Topbar điều hành, Chọn khách hàng, Persona CSKH, Nút Jira, Theme
        ├── CustomerHeroCard.jsx         # ★ THẺ HỒ SƠ KHÁCH HÀNG: Thông tin VIP, 4 thẻ KPI cơ hội & báo giá
        ├── FiveMinuteBriefingDrawer.jsx # ★ BỐI CẢNH 5 PHÚT: Đồng hồ 5 phút, chân dung sếp khách, lời dặn dò
        ├── TimelineFiltersBar.jsx       # ★ BỘ LỌC ĐA CHIỀU: 7 chip loại hoạt động & Dropdown người thực hiện
        ├── TimelineView.jsx             # ★ DÒNG THỜI GIAN HỢP NHẤT: Trục phát sáng, thẻ báo giá, deal, cuộc gọi
        ├── EventDetailModal.jsx         # Modal xem chi tiết từng tương tác, bảng báo giá mặt hàng, email thread
        ├── NewInteractionModal.jsx      # Modal thêm tương tác mới (Ghi nhận cuộc gọi, họp, email, đổi deal)
        ├── JiraTicketModal.jsx          # Modal tra cứu chi tiết đề bài Jira SCRUM-102 & đối chiếu tiêu chí
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. HƯỚNG DẪN KHỞI CHẠY DỰ ÁN

### Cách 1: Khởi chạy 1-Click trên Windows (Khuyên dùng)
Nhấp đúp chuột vào file **`run.bat`** tại thư mục dự án:
```cmd
c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-06-Scrum102-customer-timeline\run.bat
```

### Cách 2: Khởi chạy bằng dòng lệnh
Mở Terminal hoặc PowerShell tại thư mục dự án và gõ:
```bash
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-06-Scrum102-customer-timeline"
npm run dev
```
Trình duyệt sẽ tự động mở ứng dụng tại: **`http://localhost:5191`**

---

## 🧪 4. KỊCH BẢN KIỂM THỬ ĐÁNH GIÁ ĐỀ BÀI

1. **Kiểm thử Gộp dòng thời gian (AC1):**
   - Khách hàng mặc định: **Viettel Post** (`KH-VTPOST`).
   - Kéo xem dòng thời gian từ trên xuống: Thấy sự kiện bàn giao ngày 17/10, Báo giá `BQ-2026-003` (820 triệu) ngày 15/10, Chuyển giai đoạn deal sang *Thương thảo* ngày 15/10, Cuộc gọi thương thảo ngày 14/10, Cuộc họp Demo POC ngày 12/10, Email gửi bảo mật ngày 11/10...
   - Bấm nút **"Chi tiết"** trên từng sự kiện để xem toàn bộ biên bản, danh sách file và nội dung trao đổi.

2. **Kiểm thử Bộ lọc theo loại hoạt động & Người thực hiện (AC2):**
   - Bấm chip **"📞 Cuộc gọi"**: Danh sách chỉ hiện các cuộc gọi với thời lượng và kết quả.
   - Bấm chip **"💼 Thay đổi cơ hội"**: Hiển thị các bước chuyển giai đoạn từ Khảo sát $\rightarrow$ Đề xuất $\rightarrow$ Thương thảo.
   - Bấm chip **"📄 Báo giá đã gửi"**: Hiển thị 3 phiên bản báo giá từ sơ bộ đến chính thức.
   - Chọn dropdown **Người thực hiện**: Chọn *Lê Quốc Hưng* để xem các deal/báo giá do Sales cũ phụ trách; chọn *Trần Thị Mai* để xem các buổi họp kỹ thuật.
   - Gõ từ khóa vào ô tìm kiếm (ví dụ: `820` hoặc `Long`) để kiểm tra tìm kiếm tức thì.

3. **Kiểm thử Tiếp nhận bối cảnh trong 5 phút (AC3):**
   - Bấm nút **"⚡ Bối Cảnh 5 Phút"** màu xanh ngọc ở góc trên bên phải.
   - Đọc bản tóm tắt nhanh:
     - Khách hàng đang ở giai đoạn thương thảo cuối.
     - Người quyết định: Anh Nguyễn Bảo Long (Giám đốc CNTT).
     - 3 lời dặn dò quý giá từ đồng nghiệp bàn giao: Không đề cập lại chiết khấu thêm, lưu ý thời gian gọi trước 14:00.
     - Kế hoạch hành động 24h đầu tiên.
   - Bấm **"Xác Nhận Đã Nắm Rõ & Tiếp Nhận Khách"** $\rightarrow$ Hồ sơ khách hàng chuyển trạng thái màu xanh ngọc và tạo sự kiện tiếp nhận chính thức.

4. **Kiểm thử Ghi nhận tương tác mới:**
   - Bấm nút **"+ Ghi Nhận Tương Tác"** trên Topbar.
   - Chọn loại tương tác (ví dụ: Cuộc gọi), nhập tiêu đề và nội dung $\rightarrow$ Bấm **"Lưu Lên Dòng Thời Gian"**.
   - Sự kiện mới lập tức xuất hiện ở vị trí đầu tiên trên Timeline kèm thông báo Toast!
