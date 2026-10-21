# HỆ THỐNG PHÂN BỔ LẠI CƠ HỘI KINH DOANH (SCRUM-94)

> **Mã Nhiệm Vụ (Jira Ticket):** `⚡ SCRUM-20 / ☑ SCRUM-94`  
> **Trạng thái:** `Ready for Review` / `Done`  
> **User Story:** *"Là Trưởng nhóm kinh doanh, tôi muốn phân bổ lại cơ hội cho người khác trong nhóm, để thương vụ không đứng yên khi người phụ trách nghỉ dài hoặc quá tải."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Enterprise CRM Design System`, `Lucide Icons`  
> **Cổng khởi chạy máy chủ:** `http://localhost:5189`  
> **Tỷ lệ hoàn thành:** 100% tất cả 3 tiêu chí chấp nhận (Acceptance Criteria) trong đề bài.

---

## 🎯 1. BẢNG ĐỐI CHIẾU 3 TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| STT | Tiêu chí trong Jira Ticket (Description) | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng & Kịch bản kiểm thử |
| :---: | :--- | :--- | :--- |
| **AC1** | **Chuyển quyền sở hữu một hoặc nhiều cơ hội cùng lúc** | • **Phân bổ 1 cơ hội riêng lẻ:** Nút *"Phân bổ"* trên từng dòng mở ngay modal chọn nhân sự mới và lý do.<br>• **Phân bổ hàng loạt (Bulk Transfer):**<br>- Checkbox đa chọn trên từng cơ hội kèm checkbox *"Chọn tất cả"* trên thanh tiêu đề bảng.<br>- Thanh công cụ nổi (**`BulkActionToolbar.jsx`**) tự động trượt lên hiển thị: Số lượng deal đã chọn, tổng giá trị chuyển quyền, cùng 2 nút: *"Phân bổ lại cho 1 người"* hoặc *"Cân bằng tải tự động"**.<br>• **Bảng theo dõi tải nhóm (`TeamWorkloadBoard.jsx`):**<br>- Thể hiện trực quan sức chứa từng Sales Rep (Số deal đang giữ / Tối đa, thanh đo % tải).<br>- Nhận diện rõ ràng người đang nghỉ dài hạn (Lê Quốc Hưng nghỉ ốm 3 tuần, Hoàng Kim Chi nghỉ thai sản 6 tháng) hoặc quá tải (Nguyễn Văn An gánh 6 deal).<br>- Nút bấm 1-Click: *"Bàn giao deal"* tự động gom toàn bộ cơ hội của nhân sự đó vào danh sách phân bổ. | 1. Tích chọn 3 cơ hội bất kỳ (hoặc bấm chọn deal của người nghỉ thai sản Hoàng Kim Chi) $\rightarrow$ Thanh công cụ nổi lập tức xuất hiện.<br>2. Bấm *"Phân bổ lại cho 1 người"* $\rightarrow$ Chọn Trần Thị Mai hoặc Vũ Đức Thắng $\rightarrow$ Bấm *"Xác nhận"* $\rightarrow$ 3 cơ hội lập tức đổi sang người mới! |
| **AC2** | **Người nhận thấy ngay cơ hội trong danh sách của mình cùng toàn bộ lịch sử** | • **Đồng bộ thời gian thực vào danh sách người nhận:**<br>- State React & localStorage cập nhật ngay `salesRepId` và gắn cờ `isNewlyReassigned = true`.<br>- **Bộ chuyển đổi Persona (Persona Switcher):** Cho phép đổi vai trò sang người nhận (vd: Trần Thị Mai hoặc Vũ Đức Thắng).<br>- **Banner chào mừng (`RecipientWelcomeBanner.jsx`):** Khi chuyển sang người nhận, banner lập tức hiển thị thông báo có deal mới nhận bàn giao kèm tổng giá trị và người cũ bàn giao.<br>- Tab lọc *"Cơ hội của tôi"* và tab *"✨ Mới nhận"* giúp người nhận truy cập nhanh chóng.<br>• **Bảo tồn 100% lịch sử tương tác (`OpportunityDetailModal.jsx`):**<br>- Toàn bộ cuộc gọi, email, demo, báo giá của người phụ trách cũ được giữ nguyên vẹn 100%.<br>- Đính kèm sự kiện chuyển quyền `REASSIGNMENT` đặc biệt lên dòng thời gian (Ai chuyển, thời gian, lý do, ghi chú dặn dò). | 1. Thực hiện chuyển deal từ Lê Quốc Hưng sang Trần Thị Mai.<br>2. Trên thanh Topbar, đổi Persona sang *"Trần Thị Mai"* $\rightarrow$ Banner chào mừng nổi lên ngay trên cùng báo nhận deal mới.<br>3. Mở xem chi tiết deal $\rightarrow$ Thấy toàn bộ biên bản cuộc họp cũ của Hưng kèm mốc bàn giao mới nhất! |
| **AC3** | **Mỗi lần chuyển được ghi nhật ký kèm lý do** | • **Bắt buộc nhập lý do chuyển nhượng:**<br>- 7 danh mục lý do chuẩn CRM: Nghỉ phép dài hạn, Nghỉ thai sản, Quá tải deal, Phù hợp chuyên môn ngành, Điều chuyển địa bàn, Yêu cầu từ khách, Lý do khác.<br>- Trường nhập ghi chú bàn giao công việc và checklist kiểm tra (Đã thông báo khách hàng, đã bàn giao báo giá...).<br>• **Nhật ký kiểm toán trung tâm (`ReassignmentAuditLogModal.jsx`):**<br>- Lưu vết chi tiết từng phiên phân bổ: Mã phiên (`TRF-xxxx`), thời gian, người thực hiện (Trưởng nhóm), người cũ ➔ người mới, danh sách deal, lý do, ghi chú.<br>- Cho phép tìm kiếm, lọc theo lý do và xuất báo cáo CSV.<br>• **Lịch sử phân bổ theo từng deal:** Tab riêng trong modal chi tiết lưu vết toàn bộ các lần đổi chủ sở hữu của deal đó kèm Biên bản bàn giao in ấn được. | 1. Khi mở modal phân bổ, nếu không chọn người nhận hoặc không có lý do sẽ bị chặn lại.<br>2. Bấm nút *"Nhật ký"* trên Topbar $\rightarrow$ Xem toàn bộ lịch sử các phiên chuyển giao kèm đầy đủ chi tiết.<br>3. Bấm *"Xuất Báo Cáo CSV"* $\rightarrow$ Tải về file bảng tính kiểm toán hoàn chỉnh. |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
S04-05-Scrum94-reassign-opportunity/
├── index.html                           # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình máy chủ phát triển Vite (Cổng 5189)
├── run.bat                              # File khởi chạy 1-Click trên Windows
├── README.md                            # Tài liệu đối chiếu 3 tiêu chí chấp nhận & hướng dẫn kiểm thử
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # Điều phối State trung tâm (Cơ hội, Persona, Audit Logs, Modals)
    ├── index.css                        # CSS Design System hoàn chỉnh chuẩn Enterprise CRM
    ├── data/
    │   ├── mockStages.js                # Danh mục 7 giai đoạn Pipeline (Discovery, Demo, Proposal, Closing...)
    │   ├── mockUsers.js                 # Danh sách Trưởng nhóm & Các Sales Rep kèm trạng thái tải & nghỉ phép
    │   ├── mockReassignmentReasons.js   # 7 Danh mục lý do chuyển giao chuẩn & Handover checklist (AC3)
    │   └── mockOpportunities.js         # Dữ liệu 16 cơ hội B2B thực tế kèm lịch sử tương tác và nhật ký bàn giao
    ├── utils/
    │   ├── formatters.js                # Định dạng tiền tệ VNĐ, ngày tháng, tính toán thời gian
    │   └── reassignmentEngine.js        # Động cơ phân bổ 1 hoặc nhiều deal & Thuật toán cân bằng tải tự động (AC1-AC3)
    └── components/
        ├── Header.jsx                   # Topbar điều hành, Persona Switcher, Nút Jira ticket, Nút Nhật ký
        ├── WorkloadSummaryCards.jsx     # ★ 4 THẺ KPI: Tổng pipeline, Cần phân bổ gấp, Sức chứa tải, Lượt bàn giao
        ├── TeamWorkloadBoard.jsx        # ★ BẢNG GIÁM SÁT TẢI & NGHỈ PHÉP: Nút bàn giao nhanh 1-Click (AC1)
        ├── BulkActionToolbar.jsx        # ★ THANH CÔNG CỤ THAO TÁC HÀNG LOẠT: Phân bổ hàng loạt & Cân bằng tải (AC1)
        ├── RecipientWelcomeBanner.jsx   # ★ BANNER THÔNG BÁO CHO NGƯỜI NHẬN: Thấy ngay deal mới (AC2)
        ├── OpportunitiesTable.jsx       # ★ BẢNG DỮ LIỆU CƠ HỘI: Checkbox đa chọn, Bộ lọc, Cờ ✨ Mới nhận (AC1, AC2)
        ├── ReassignModal.jsx            # ★ MODAL PHÂN BỔ: Chọn người nhận, bắt buộc lý do, ghi chú, checklist (AC1, AC3)
        ├── AutoBalanceModal.jsx         # ★ MODAL CÂN BẰNG TẢI TỰ ĐỘNG: Tự chia đều cho người rảnh tải (AC1)
        ├── OpportunityDetailModal.jsx   # ★ HỒ SƠ DEAL: Giữ 100% lịch sử cũ, Nhật ký bàn giao & Biên bản in ấn (AC2, AC3)
        ├── ReassignmentAuditLogModal.jsx# ★ NHẬT KÝ KIỂM TOÁN HỆ THỐNG: Tìm kiếm, lọc lý do, xuất báo cáo CSV (AC3)
        ├── JiraTicketModal.jsx          # Modal tra cứu chi tiết đề bài Jira ticket & bảng 3 tiêu chí AC1-AC3
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. HƯỚNG DẪN KHỞI CHẠY & KIỂM THỬ

### Cách 1: Khởi chạy nhanh 1-Click
Nhấp đúp chuột vào file **`run.bat`** tại thư mục gốc của dự án. Trình duyệt sẽ tự động mở địa chỉ:
`http://localhost:5189`

### Cách 2: Khởi chạy qua dòng lệnh Terminal
```bash
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-05-Scrum94-reassign-opportunity"
npm run dev
```

---

## 🧪 4. KỊCH BẢN KIỂM THỬ MINH HỌA 3 TIÊU CHÍ

1. **Kiểm thử AC1 (Phân bổ nhiều cơ hội cùng lúc):**
   - Trên bảng, tích chọn 2 deal của nhân viên đang nghỉ ốm Lê Quốc Hưng (`OPP-9401` và `OPP-9402`).
   - Thanh công cụ nổi bật lên: *"Đã chọn 2 cơ hội (Tổng giá trị: 1.470.000.000 ₫)"*.
   - Nhấn nút **"Phân bổ lại cho 1 người"** ➔ Chọn người nhận là **Trần Thị Mai** ➔ Chọn lý do *"Người phụ trách nghỉ phép dài hạn"* ➔ Nhấn **"Xác Nhận Phân Bổ"**.
   - Cả 2 deal lập tức đổi chủ sở hữu sang Trần Thị Mai với huy hiệu `✨ Mới nhận bàn giao`.

2. **Kiểm thử AC2 (Người nhận thấy ngay trong danh sách cùng toàn bộ lịch sử):**
   - Trên Topbar góc phải, đổi Persona từ *"Trần Đình Trọng"* sang **"Trần Thị Mai"**.
   - Banner màu xanh ngọc xuất hiện ngay lập tức: *"🎉 Thông báo nhận bàn giao cơ hội mới (2 thương vụ)"*.
   - Bấm vào biểu tượng con mắt trên deal `OPP-9401` ➔ Tab *"Toàn bộ lịch sử tương tác"* hiển thị trọn vẹn các cuộc họp và email trước đây của Lê Quốc Hưng, kèm thêm sự kiện bàn giao mới nhất trên đỉnh timeline.

3. **Kiểm thử AC3 (Mỗi lần chuyển được ghi nhật ký kèm lý do):**
   - Nhấn nút **"Nhật ký"** trên Topbar ➔ Mở modal Audit Log.
   - Thấy ngay phiên phân bổ vừa thực hiện với đầy đủ: Mã phiên, ngày giờ, người thực hiện (Trưởng nhóm Trọng), Từ Lê Quốc Hưng ➔ Sang Trần Thị Mai, lý do chuyển nhượng và ghi chú chi tiết.
   - Bấm nút **"Xuất Báo Cáo CSV"** để tải file kiểm toán về máy tính.
