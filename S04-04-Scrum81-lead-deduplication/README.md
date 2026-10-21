# Hệ Thống Cảnh Báo & Gộp Lead Trùng Lặp (Marketing CRM)

> **User Story:** *"Là Nhân viên Marketing, tôi muốn được cảnh báo và gộp lead trùng, để không để hai nhân viên cùng gọi một người trong một buổi sáng."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Vanilla Modern CSS`, `Lucide Icons`  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 🎯 1. Phân Tích Đề Bài & Bảng Đối Chiếu Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### Bối cảnh nghiệp vụ thực tế:
- **Người dùng:** Nhân viên Marketing (Marketing Specialist / Lead Generator).
- **Vấn đề thực tế:** Khi chạy các chiến dịch Marketing (Google Ads, Facebook Lead Ads, Landing page, Zalo OA...), một khách hàng có thể đăng ký nhiều lần với các kênh khác nhau hoặc điền số điện thoại giống nhau nhưng khác email, tên công ty viết tắt... Nếu hệ thống chia 2 lead này cho 2 nhân viên Telesales độc lập (ví dụ: NV Hoàng Tuấn và NV Mai Linh), cả 2 nhân viên sẽ cùng nhấc máy gọi cho vị khách đó trong cùng một buổi sáng, gây phiền hà nghiêm trọng cho khách và lãng phí nguồn lực công ty!
- **Giải pháp:** Hệ thống cảnh báo thời gian thực, chủ động phát hiện trùng lặp đa tiêu chí, bảo vệ chống xung đột cuộc gọi trong buổi sáng, gợi ý gắn vào Khách hàng doanh nghiệp đã có và bảo toàn 100% lịch sử tương tác khi gộp.

---

### Bảng Đối Chiếu 3 Tiêu Chí Nghiệm Thu:

| STT | Tiêu chí trong Jira Ticket | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng kiểm thử |
| :---: | :--- | :--- | :--- |
| **1** | **Phát hiện trùng theo email, số điện thoại và tên công ty** | • **Email Matcher:** Chuẩn hóa trim, lowercase; so khớp chính xác.<br>• **Phone Matcher:** Loại bỏ ký tự đặc biệt, chuẩn hóa `+84` $\rightarrow$ `0`, đối soát đồng nhất 10 số.<br>• **Company Matcher:** Loại bỏ từ dừng pháp lý (`Công ty Cổ phần`, `TNHH`, `Tập đoàn`, `Corp`...) kết hợp thuật toán khoảng cách Levenshtein & Token Jaccard Similarity ($\ge 75\%$).<br>• **Cảnh Báo Xung Đột Cuộc Gọi Buổi Sáng:** Phát hiện Lead #LD-102 trùng SĐT với Lead #LD-101 (đã có Telesales Hoàng Tuấn gọi lúc 08:30 sáng nay). Lập tức hiển thị banner đỏ và huy hiệu: `🚨 NGUY CƠ GỌI TRÙNG BUỔI SÁNG!`.<br>• **Live Deduplication Scanner:** Quét và cảnh báo tức thì ngay khi gõ phím trên form thêm Lead mới! | Banner cảnh báo đỏ nổi bật đầu trang; Huy hiệu `CRITICAL` và `NGUY CƠ GỌI TRÙNG BUỔI SÁNG` trên bảng; Khối quét thời gian thực trong modal thêm Lead. |
| **2** | **Lead trùng với khách hàng đã có được gợi ý gắn thẳng vào khách hàng đó** | • **Đối soát CSDL Khách hàng CRM:** Tự động so sánh Lead mới với danh mục Khách hàng chính thức đã ký hợp đồng (`KH-001 FPT`, `KH-002 Viettel`, `KH-003 Vinamilk`...).<br>• **Huy hiệu nhận diện:** Gắn thẻ màu tím `🏢 TRÙNG KHÁCH HÀNG: KH-001 (FPT)`.<br>• **Gợi ý gắn thẳng:** Nút chuyên biệt *"Gắn Vào KH"* mở modal `AttachToCustomerModal.jsx`.<br>• Cho phép chuyển đổi Lead thành **Người liên hệ mới (Contact)** hoặc **Cơ hội tái mua / Bán thêm (Upsell Opportunity)**.<br>• Chuyển giao toàn bộ thông tin chiến dịch và thông báo cho Sales phụ trách tài khoản (Key Account Manager). | Cột tình trạng có badge tím; Nút *"Gắn Vào KH"*; Modal liên kết khách hàng hiển thị thông tin hợp đồng và phân loại chuyển đổi. |
| **3** | **Gộp giữ nguyên lịch sử của cả hai bản ghi** | • **Giao diện So Sánh Song Song (Dual-Pane Side-by-Side):** Cột trái (Master) vs Cột phải (Duplicate).<br>• **Hoán đổi vai trò:** Nút *"Swap ⇄"* đảo chiều Master/Duplicate chỉ với 1 click.<br>• **Bộ giải quyết xung đột trường:** Tự do chọn giữ trường thông tin tốt nhất (Họ tên, SĐT, Email, Nguồn tiếp thị, Telesales phụ trách).<br>• **Bảo Toàn 100% Lịch Sử (Unified Timeline):** Tích hợp trọn vẹn toàn bộ các cuộc gọi Telesales, ghi chú tư vấn, email tương tác từ cả 2 bản ghi theo trình tự thời gian.<br>• **Gắn nhãn nguồn gốc:** Từng sự kiện được gắn nhãn `[Gốc từ Lead #LD-101]` và `[Gốc từ Lead #LD-102]`. Sau khi gộp, nhân viên nhìn thấy rõ cuộc gọi sáng nay để không gọi lại! | Khối *"Xem Trước Dòng Thời Gian Lịch Sử Hợp Nhất"* trong modal gộp; Modal xem chi tiết `LeadDetailModal.jsx`; Thẻ KPI *"Cuộc Gọi Đã Bảo Vệ"*. |

---

## 📂 2. Cấu Trúc Thư Mục Dự Án

```
lead-deduplication/
├── index.html                           # HTML gốc, Google Fonts Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình Vite cổng 5180
├── run.bat                              # File khởi chạy 1-click tự động trên Windows
├── README.md                            # Tài liệu đối chiếu tiêu chí và kịch bản nghiệm thu
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # State trung tâm, điều phối luồng gộp, gắn KH & bộ lọc
    ├── index.css                        # CSS hoàn chỉnh chuẩn Enterprise (Glassmorphism, Dark/Light mode)
    ├── data/
    │   ├── mockLeads.js                 # Dữ liệu Lead tiếp thị mẫu (có các cặp trùng lặp, log cuộc gọi sáng nay)
    │   └── mockExistingCustomers.js     # Danh bạ Khách hàng chính thức trong CRM (FPT, Viettel, Vinamilk...)
    ├── utils/
    │   └── duplicateDetector.js         # Thuật toán đa tiêu chí (Email, Phone, Fuzzy Company) & Hợp nhất Timeline
    └── components/
        ├── Header.jsx                   # Thanh tiêu đề, Vai trò NV Marketing, Theme Switcher, Badge User Story
        ├── DuplicateAlertBanner.jsx     # Banner cảnh báo nguy cơ 2 nhân viên gọi cùng 1 người sáng nay
        ├── KpiSummaryCards.jsx          # 4 thẻ thống kê chỉ số (Tổng Lead, Trùng lặp, Trùng KH, Bảo vệ cuộc gọi)
        ├── LeadListView.jsx             # Bảng danh sách Lead, bộ lọc Tab, tìm kiếm và nút thao tác
        ├── SideBySideMergeModal.jsx     # ★ MODAL SO SÁNH SONG SONG & BẢO TOÀN 100% LỊCH SỬ
        ├── AttachToCustomerModal.jsx    # ★ MODAL GỢI Ý GẮN LEAD VÀO KHÁCH HÀNG DOANH NGHIỆP ĐÃ CÓ
        ├── NewLeadModal.jsx             # ★ FORM TẠO LEAD TÍCH HỢP LIVE DUPLICATE SCANNER THỜI GIAN THỰC
        ├── LeadDetailModal.jsx          # Xem chi tiết hồ sơ & Dòng thời gian lịch sử sau khi gộp
        ├── MergeHistoryDrawer.jsx       # Nhật ký kiểm toán các lượt gộp và chuyển đổi dữ liệu (Audit Trail)
        ├── JiraGuideModal.jsx           # Bảng tra cứu trực quan kèm 3 nút chạy nhanh kịch bản kiểm thử
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Chạy nhanh 1-Click bằng file `run.bat` (Khuyên dùng trên Windows)
1. Vào thư mục: `lead-deduplication`
2. Nhấp đúp chuột vào file:
   ```cmd
   run.bat
   ```
3. Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:5180`

### Cách 2: Chạy bằng Terminal
```bash
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\lead-deduplication"
npm.cmd run dev
```

---

## 🧪 4. Kịch Bản Kiểm Thử Nghiệm Thu (Acceptance Testing Checklist)

### 🧪 Kịch bản 1: Kiểm tra Tiêu chí 1 (Phát hiện trùng theo Email, SĐT, Tên cty & Cảnh báo gọi trùng sáng nay)
1. Quan sát đầu trang: **Banner cảnh báo đỏ nổi bật**:
   - Thông báo rõ ràng: *"CẢNH BÁO NGUY CẤP: NGUY CƠ 2 NHÂN VIÊN CÙNG GỌI MỘT NGƯỜI TRONG BUỔI SÁNG!"*.
   - Chỉ rõ: Nhân viên Nguyễn Hoàng Tuấn đã gọi cho anh Phạm Văn Bình lúc 08:30 sáng nay, trong khi Lead trùng LD-102 đang giao cho nhân viên Trần Thị Mai Linh!
2. Quan sát dòng **Lead LD-101** và **LD-102** trên bảng:
   - Cột Tình trạng hiển thị huy hiệu chớp nháy màu đỏ: `🚨 NGUY CƠ 2 NV GỌI TRÙNG SÁNG NAY!`.
   - Cột Liên hệ tô màu đỏ nổi bật trường trùng lặp: `⚠️ Trùng SĐT` và `⚠️ Trùng Email`.
3. Kiểm tra tính năng **Live Duplicate Scanner**:
   - Bấm nút **"+ Thêm Lead Mới (Live Scanner)"**.
   - Bấm nút *"⚡ Trùng Lead khác (FPT - Đã có cuộc gọi 08:30)"*.
   - Quan sát ngay bên dưới form: Khung cảnh báo màu đỏ lập tức hiển thị chỉ rõ trùng với ai và có nút gộp nhanh ngay trong form!

---

### 🧪 Kịch bản 2: Kiểm tra Tiêu chí 2 (Gợi ý gắn Lead vào Khách hàng đã có trong CRM)
1. Trên bảng danh sách Lead, chọn Tab **"🏢 Trùng Khách hàng đã có"**:
   - Dòng **Lead LD-104 (Trần Thu Hà - FPT)** và **Lead LD-106 (Vũ Hải Nam - Vinamilk)** được hiển thị.
   - Cột Tình trạng có huy hiệu màu tím: `🏢 Trùng KH: KH-001 (90%)` (FPT Corporation).
2. Tại dòng Lead LD-104, bấm nút màu tím **"Gắn Vào KH"**:
   - Modal `AttachToCustomerModal` mở ra hiển thị song song:
     - Bên trái: Thông tin Lead mới từ chiến dịch Triển lãm Tech Expo 2026.
     - Bên phải: Hồ sơ Khách hàng VIP FPT (Doanh thu 2.45 tỷ đồng, do Sales Lê Hải Đăng phụ trách).
   - Chọn phương thức: *"Tạo Người liên hệ mới & Mở Cơ hội Tái mua (Upsell Opportunity)"*.
   - Bấm nút **"Xác Nhận Gắn Thẳng Vào Khách Hàng"**:
     - Lead LD-104 được đánh dấu `ĐÃ GẮN VÀO KH #KH-001`.
     - Toàn bộ lịch sử tư vấn được bảo lưu và chuyển giao cho Key Account Manager.

---

### 🧪 Kịch bản 3: Kiểm tra Tiêu chí 3 (Gộp giữ nguyên 100% lịch sử của cả hai bản ghi)
1. Tại dòng **Lead LD-101** (hoặc trên Banner cảnh báo), bấm nút **"Gộp Lead"**:
   - Modal so sánh song song mở ra với 2 cột:
     - Cột trái: Bản ghi chính (Master) - `LD-101 (Phạm Văn Bình)`.
     - Cột phải: Bản ghi sáp nhập (Duplicate) - `LD-102 (Phạm Bình)`.
2. Thử nghiệm nút **Hoán Đổi Master ⇄ Duplicate (Swap)**:
   - Bấm nút đảo vai trò ở giữa: Hai cột hoán đổi mượt mà, người dùng có toàn quyền chọn ai làm Master.
3. Thử nghiệm chọn trường dữ liệu (Field Selection):
   - Thử bấm chọn Họ tên hoặc Email của bên A hoặc bên B.
4. Kiểm tra phần **"Xem Trước Dòng Thời Gian Lịch Sử Hợp Nhất (Bảo Toàn 100%)"**:
   - Quan sát danh sách hoạt động: Hiển thị đầy đủ cả cuộc gọi lúc 08:30 sáng nay của NV Tuấn (từ LD-101) và ghi chú tải Ebook (từ LD-102).
   - Từng mục đều có nhãn nguồn gốc rõ ràng: `[Gốc từ Lead #LD-101]` và `[Gốc từ Lead #LD-102]`.
5. Bấm nút **"Xác Nhận Gộp & Bảo Toàn Lịch Sử"**:
   - Hệ thống thông báo thành công.
   - Lead LD-102 được đánh dấu `ĐÃ GỘP VÀO #LD-101`.
   - Bấm nút **"Chi Tiết"** tại LD-101: Quan sát thấy toàn bộ lịch sử của cả 2 bản ghi đã được tích hợp đầy đủ!
   - Thẻ KPI *"Cuộc Gọi Đã Bảo Vệ"* tăng lên, phản ánh đúng mục tiêu đề bài: **không để hai nhân viên cùng gọi một người trong một buổi sáng**.
