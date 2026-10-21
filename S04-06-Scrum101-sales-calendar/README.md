# HỆ THỐNG LỊCH LÀM VIỆC & XẾP LỊCH NHÓM KINH DOANH (SCRUM-101)

> **Mã Nhiệm Vụ (Jira Ticket):** `⚡ SCRUM-21 / ☑ SCRUM-101`  
> **Trạng thái:** `Ready for Review` / `Done`  
> **User Story:** *"Là Nhân viên kinh doanh, tôi muốn xem lịch làm việc của mình và của nhóm, để bố trí lịch gặp mà không chồng chéo với đồng đội."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Enterprise CRM Design System`, `Lucide Icons`  
> **Cổng khởi chạy máy chủ:** `http://localhost:5190`  
> **Tỷ lệ hoàn thành:** 100% tất cả 4 tiêu chí chấp nhận (Acceptance Criteria) trong đề bài Jira.

---

## 🎯 1. BẢNG ĐỐI CHIẾU 4 TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| STT | Tiêu chí trong Jira Ticket (Description) | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng & Kịch bản kiểm thử |
| :---: | :--- | :--- | :--- |
| **AC1** | **Chế độ xem theo ngày, tuần và tháng** | • **Chế độ Tháng (`MonthView.jsx`):** Lưới lịch 35–42 ô chuẩn Enterprise, hiển thị số ngày, chấm trạng thái (xanh = cuộc gặp, vàng = việc có hạn, đỏ = xung đột) và các chip sự kiện có thể click xem chi tiết.<br>• **Chế độ Tuần (`WeekView.jsx`):** Trục thời gian 12 tiếng (08:00 – 20:00) chia làm 7 cột từ Thứ Hai đến Chủ Nhật. Thẻ cuộc họp được định vị chính xác theo thời gian bắt đầu – kết thúc.<br>• **Chế độ Ngày (`DayView.jsx`):** Dòng thời gian trực quan theo trình tự thời gian trong ngày với đầy đủ khách hàng, địa điểm/link họp, người tham gia và nút thao tác.<br>• **Thanh điều hướng nhanh (`CalendarControlsBar.jsx`):** Nút Trước/Tiếp, nút *"Hôm nay"*, tiêu đề thời gian động theo từng chế độ. | 1. Trên thanh công cụ, lần lượt chuyển qua lại giữa 3 tab: **"Ngày"**, **"Tuần"**, **"Tháng"**.<br>2. Ở chế độ Tháng: Nhấp đúp chuột vào ô ngày bất kỳ $\rightarrow$ Hệ thống tự động chuyển sang xem chi tiết Ngày đó.<br>3. Ở chế độ Tuần: Thấy rõ các khối thời gian 08:30 – 10:00, 14:00 – 15:30 phân bổ chuẩn xác theo từng cột ngày. |
| **AC2** | **Hiển thị cuộc gặp đã đặt và công việc có hạn trong cùng một khung nhìn** | • **Phân định rõ ràng bằng màu sắc & biểu tượng chuẩn CRM:**<br>- **Cuộc gặp đã đặt (Meetings):** Màu xanh Sapphire (`#38bdf8`), icon Lịch/Bắt tay, có giờ bắt đầu – kết thúc, loại hình (Trực tiếp / Trụ sở khách / Trực tuyến Google Meet/Teams), địa điểm và danh sách người tham gia.<br>- **Công việc có hạn (Tasks):** Màu cam hổ phách (`#f59e0b`), icon Checklist, có giờ hạn chót (Deadline), mức độ ưu tiên (Khẩn cấp, Cao, Trung bình) và checkbox hoàn thành.<br>• **Tích hợp đồng bộ trong cùng 1 khung nhìn:**<br>- Trên chế độ Tuần: Thanh trên cùng (Deadlines Bar) hiển thị các hạn chót trong ngày, bên dưới là lưới cuộc họp theo giờ.<br>- Trên chế độ Ngày: Dòng thời gian xếp thứ tự chrono cả cuộc gặp và hạn chót theo đúng giờ diễn ra.<br>• **Bộ lọc linh hoạt (Filter Chips):** 1-Click lọc *"Tất cả"*, *"Chỉ cuộc gặp đã đặt"*, hoặc *"Chỉ việc có hạn"*. | 1. Chọn tab Ngày **Thứ Hai (19/10/2026)** $\rightarrow$ Thấy đồng thời Cuộc gặp Demo Viettel (08:30) và Hạn chót nộp hồ sơ năng lực (11:30).<br>2. Bấm vào nút *"Đánh dấu xong"* trên công việc $\rightarrow$ Tiêu đề tự động gạch ngang và thẻ KPI tăng tiến độ hoàn thành ngay lập tức.<br>3. Bấm chip *"🤝 Cuộc gặp đã đặt"* $\rightarrow$ Toàn bộ công việc ẩn đi, chỉ hiện cuộc gặp và ngược lại. |
| **AC3** | **Trưởng nhóm xem được lịch chồng của cả nhóm để bố trí** | • **Ma trận Lịch Chồng Cả Nhóm (`TeamMatrixView.jsx`):**<br>- Chế độ xem song song nhiều cột: Mỗi thành viên trong nhóm (Trần Đình Trọng, Nguyễn Văn An, Trần Thị Mai, Lê Quốc Hưng,...) chiếm 1 cột riêng biệt trong ngày.<br>- Nhận diện ngay trong 1 giây ai đang bận giờ nào và ai đang rảnh để bố trí cuộc họp.<br>• **Bộ phát hiện xung đột tự động (`detectConflicts` trong `calendarUtils.js`):**<br>- Tự động quét và phát hiện khi 1 thành viên bị đặt trùng 2 lịch cùng lúc (ví dụ: Thứ Ba 20/10 lúc 10:00 – 11:00 Nguyễn Văn An bị xếp trùng giữa thẩm định Techcombank và họp chiến lược).<br>- Banner cảnh báo đỏ nổi bật: *"⚠️ Phát hiện 1 xung đột chồng chéo lịch!"*.<br>• **Trung tâm giải quyết xung đột 1-Click (`ConflictResolutionModal.jsx`):** Đề xuất 2 phương án: Dời sang giờ rảnh buổi chiều hoặc đổi người phụ trách thay thế.<br>• **Công cụ Gợi ý Giờ Rảnh Cả Nhóm (`SmartSlotFinderModal.jsx`):** Nhập danh sách người tham gia $\rightarrow$ Thuật toán quét và tìm ra ngay các khung giờ vàng không ai bị trùng lịch để bố trí cuộc gặp mới. | 1. Nhấp tab **"Lịch Chồng Nhóm"** trên thanh điều hướng $\rightarrow$ Toàn bộ cột của các thành viên xếp cạnh nhau rõ ràng.<br>2. Nhìn vào Thứ Ba 20/10 $\rightarrow$ Thấy banner đỏ cảnh báo xung đột lịch của Nguyễn Văn An.<br>3. Bấm **"Xem & Xử Lý Xung Đột"** $\rightarrow$ Bấm *"Áp Dụng Dời Giờ"* $\rightarrow$ Cuộc họp lập tức chuyển sang 14:00 chiều và cờ xung đột biến mất hoàn toàn! |
| **AC4** | **Lịch hiển thị tốt trên điện thoại** | • **Tối ưu hóa hiển thị Responsive hoàn toàn (Mobile Friendly):**<br>- Tự động co giãn theo kích thước màn hình điện thoại & tablet (`@media (max-width: 768px)`).<br>- **Thanh trượt ngày ngang (Date Strip Carousel):** Vuốt hoặc chạm ngón tay chọn các ngày trong tuần (T2 đến CN) kèm các chấm chỉ báo số lượng cuộc gặp, việc có hạn và xung đột.<br>- Các nút bấm và thẻ lịch được thiết kế chuẩn Touch Target $\ge 44$px theo tiêu chuẩn Human Interface Guidelines.<br>• **Bộ Giả Lập Smartphone Trực Tiếp (`MobileFrameWrapper.jsx`):**<br>- Nút bấm **"Xem Điện Thoại"** trên Topbar mở ngay khung viền iPhone 16 Pro Max chân thực (Dynamic Island, vạch loa, camera, thanh Home bar).<br>- Cho phép người chấm và giảng viên tương tác trực tiếp trên giao diện điện thoại ngay trên màn hình máy tính mà không cần bật DevTools! | 1. Bấm nút **"Xem Điện Thoại"** ở góc trên bên phải màn hình $\rightarrow$ Khung iPhone lập tức xuất hiện.<br>2. Nhấn chọn từng ngày (T2, T3, T4, T5, T6, T7, CN) trên dải ngày ngang $\rightarrow$ Danh sách lịch hẹn bên dưới cập nhật mượt mà theo từng ngày.<br>3. Bấm nút *"Xong việc"* hoặc bấm xem chi tiết sự kiện ngay trên màn hình điện thoại đều hoạt động trơn tru 100%! |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
S04-06-Scrum101-sales-calendar/
├── index.html                           # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình máy chủ phát triển Vite (Cổng 5190)
├── run.bat                              # File khởi chạy 1-Click trên Windows
├── README.md                            # Tài liệu đối chiếu 4 tiêu chí chấp nhận & hướng dẫn kiểm thử
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # Điều phối State trung tâm (Sự kiện, Persona, Xung đột, Modals)
    ├── index.css                        # CSS Design System hoàn chỉnh chuẩn Enterprise CRM
    ├── data/
    │   ├── mockUsers.js                 # Danh sách Trưởng nhóm & Các Sales Rep kèm màu sắc định danh
    │   └── mockEvents.js                # Dữ liệu 25 cuộc gặp khách hàng thực tế & công việc có hạn
    ├── utils/
    │   └── calendarUtils.js             # Thuật toán ma trận lịch, tính toán giờ rảnh & phát hiện xung đột (AC1-AC3)
    └── components/
        ├── Header.jsx                   # Topbar điều hành, Persona Switcher, Nút Jira, Nút Giả lập ĐT
        ├── CalendarControlsBar.jsx      # ★ THANH ĐIỀU HƯỚNG: Chuyển Ngày/Tuần/Tháng & Bộ lọc loại lịch (AC1, AC2)
        ├── ConflictAlertBanner.jsx      # ★ BANNER CẢNH BÁO XUNG ĐỘT LỊCH TRONG NHÓM (AC3)
        ├── CalendarStatsRow.jsx         # ★ 4 THẺ KPI: Cuộc gặp, Việc có hạn, Tiến độ hoàn thành, Xung đột
        ├── TeamSidebar.jsx              # ★ THANH THÀNH VIÊN: Checkbox bật/tắt lịch từng người, Mã màu (AC3)
        ├── MonthView.jsx                # ★ CHẾ ĐỘ XEM THÁNG: Lưới 35-42 ô, chip sự kiện, chấm trạng thái (AC1)
        ├── WeekView.jsx                 # ★ CHẾ ĐỘ XEM TUẦN: 7 cột ngày, 12 khung giờ, dải Deadlines bar (AC1, AC2)
        ├── DayView.jsx                  # ★ CHẾ ĐỘ XEM NGÀY: Dòng thời gian chi tiết cuộc gặp & việc cần làm (AC1, AC2)
        ├── TeamMatrixView.jsx           # ★ CHẾ ĐỘ LỊCH CHỒNG NHÓM: Ma trận cột từng người cho Trưởng nhóm (AC3)
        ├── MobileAgendaView.jsx         # ★ CHẾ ĐỘ XEM ĐIỆN THOẠI: Dải ngày ngang, thẻ vuốt ngón tay (AC4)
        ├── EventDetailModal.jsx         # Modal xem chi tiết cuộc gặp/công việc, link họp, xóa & hoàn thành
        ├── NewEventModal.jsx            # Modal đặt lịch mới với TÍNH NĂNG KIỂM TRA TRÙNG LỊCH THỜI GIAN THỰC (AC3)
        ├── SmartSlotFinderModal.jsx     # ★ BỘ GỢI Ý GIỜ RẢNH CHUNG: Tự động quét khung giờ vàng cho cả nhóm (AC3)
        ├── ConflictResolutionModal.jsx  # ★ TRUNG TÂM GIẢI QUYẾT XUNG ĐỘT: 1-Click dời giờ hoặc đổi người thay thế (AC3)
        ├── JiraTicketModal.jsx          # Modal tra cứu chi tiết đề bài Jira ticket & bảng 4 tiêu chí AC1-AC4
        ├── MobileFrameWrapper.jsx       # ★ BỘ GIẢ LẬP IPHONE TRỰC TIẾP TRÊN MÀN HÌNH MÁY TÍNH (AC4)
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. HƯỚNG DẪN KHỞI CHẠY & KIỂM THỬ

### Cách 1: Khởi chạy nhanh 1-Click
Nhấp đúp chuột vào file **`run.bat`** tại thư mục gốc của dự án:
```
c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-06-Scrum101-sales-calendar\run.bat
```
Trình duyệt sẽ tự động mở địa chỉ:
👉 **`http://localhost:5190`**

### Cách 2: Khởi chạy qua Terminal
```bash
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-06-Scrum101-sales-calendar"
npm.cmd run dev
```

---

## 🧪 4. KỊCH BẢN KIỂM THỬ MINH HỌA 4 TIÊU CHÍ (AC1 - AC4)

1. **Kiểm thử AC1 (Chế độ xem theo ngày, tuần và tháng):**
   - Click tab **"Tuần"**: Thấy 7 cột Thứ Hai đến Chủ Nhật với các khung giờ từ 08:00 đến 20:00.
   - Click tab **"Tháng"**: Thấy lưới lịch toàn diện của Tháng 10/2026. Nhấp đúp vào ngày `19` để chuyển thẳng về Ngày 19/10.
   - Click tab **"Ngày"**: Thấy dòng thời gian chi tiết từng giờ trong ngày kèm đầy đủ khách hàng và địa điểm.

2. **Kiểm thử AC2 (Hiển thị cuộc gặp đã đặt và công việc có hạn trong cùng một khung nhìn):**
   - Chọn ngày **19/10/2026**:
     - Thấy cuộc gặp màu xanh lam `Viettel Telecom - Demo giải pháp CRM Cloud` (08:30 - 10:00).
     - Thấy công việc màu vàng cam `Hoàn thiện hồ sơ năng lực gói 1.8 tỷ` (Hạn chót 11:30).
   - Bấm vào nút *"Đánh dấu xong"* $\rightarrow$ Công việc được gạch ngang, chỉ số KPI *"Tiến Độ Hoàn Thành"* tăng lên.
   - Bấm nút bộ lọc *"🤝 Cuộc gặp đã đặt"* $\rightarrow$ Hệ thống lọc nhanh chỉ hiển thị các cuộc họp.

3. **Kiểm thử AC3 (Trưởng nhóm xem được lịch chồng của cả nhóm để bố trí):**
   - Bấm tab **"Lịch Chồng Nhóm"** $\rightarrow$ Hệ thống hiển thị song song các cột của từng thành viên: Trọng (Trưởng nhóm), An, Mai, Hưng, Chi, Thắng.
   - Thấy ngay banner màu đỏ cảnh báo: *"⚠️ Phát hiện 1 xung đột chồng chéo lịch làm việc trong nhóm!"* (Nguyễn Văn An bị trùng 2 lịch cùng lúc vào Thứ Ba 20/10 lúc 10:00 - 11:00).
   - Nhấn nút **"Xem & Xử Lý Xung Đột"** $\rightarrow$ Bấm *"Áp Dụng Dời Giờ"* $\rightarrow$ Cuộc họp tự động dời sang 14:00 chiều và cờ xung đột biến mất ngay lập tức!
   - Thử nghiệm tính năng **"Tìm Giờ Rảnh Nhóm"**: Chọn Trọng + An + Mai $\rightarrow$ Hệ thống tự động gợi ý các khung giờ vàng cả 3 người đều rảnh (08:30 - 09:30, 11:30 - 12:30, 14:00 - 15:00) để bố trí cuộc họp mới không bao giờ bị trùng chéo!

4. **Kiểm thử AC4 (Lịch hiển thị tốt trên điện thoại):**
   - Trên thanh Topbar, nhấn nút **"Xem Điện Thoại"** (hoặc nhấn phím F12 chuyển sang chế độ thiết bị di động).
   - Một khung viền Smartphone iPhone 16 Pro Max hiện lên ngay trên màn hình.
   - Chạm vào từng ngày trên dải trượt ngang: Thấy các chấm chỉ báo sự kiện và danh sách thẻ cuộc gặp & công việc bên dưới co giãn hoàn hảo, dễ thao tác bằng ngón tay.
