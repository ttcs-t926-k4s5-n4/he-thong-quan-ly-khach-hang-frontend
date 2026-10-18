# HỆ THỐNG DỰ BÁO DOANH SỐ TÍNH THEO TRỌNG SỐ XÁC SUẤT (SCRUM-92)

> **Mã Nhiệm Vụ (Jira Ticket):** `⚡ SCRUM-20 / ☑ SCRUM-92`  
> **Trạng thái:** `Ready for Review` / `Done`  
> **User Story:** *"Là Giám đốc kinh doanh, tôi muốn xem dự báo doanh số tính theo trọng số xác suất, để trả lời được câu hỏi tháng này về bao nhiêu bằng số liệu."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Vanilla Enterprise CRM Design System`, `Lucide Icons`  
> **Cổng khởi chạy máy chủ:** `http://localhost:5187`  
> **Tỷ lệ hoàn thành:** 100% tất cả 4 tiêu chí chấp nhận (Acceptance Criteria) trong đề bài.

---

## 🎯 1. BẢNG ĐỐI CHIẾU 4 TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| STT | Tiêu chí trong Jira Ticket (Description) | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng & Kiểm thử |
| :---: | :--- | :--- | :--- |
| **AC1** | **Dự báo bằng tổng của giá trị cơ hội nhân xác suất thắng của giai đoạn** | • **Động cơ tính toán dự báo trọng số (`calculateOpportunityWeightedValue`):**<br>- Cơ hội mở: $\text{Weighted Forecast} = \sum (\text{Giá trị cơ hội} \times \frac{\text{Xác suất thắng của giai đoạn}}{100})$.<br>- Cơ hội đã đóng thắng: Tính 100% giá trị hợp đồng đã chốt thực tế.<br>- Cơ hội đóng thua: Tính 0 VNĐ.<br>• **Ma trận xác suất chuẩn theo giai đoạn:**<br>1. *Khảo sát & Đánh giá nhu cầu*: 20%<br>2. *Giải pháp & Demo POC*: 40%<br>3. *Gửi Báo Giá & Đề Xuất*: 60%<br>4. *Thương Thảo Hợp Đồng*: 80%<br>5. *Đóng Thắng*: 100%<br>• **Bộ giả lập What-If (`WhatIfSimulatorModal.jsx`):** Cho phép Giám đốc kéo thanh trượt xác suất từng giai đoạn và xem mức biến thiên doanh số (+/- VNĐ) thời gian thực. | Cột *"Dự Báo Trọng Số"* trong bảng cơ hội thể hiện rõ công thức: `150.000.000 ₫ × 80% = 120.000.000 ₫`. Khi bấm sửa xác suất hoặc đổi giai đoạn, tổng số dự báo nhảy tức thì. |
| **AC2** | **Nhóm theo kỳ dự kiến chốt: tháng này, tháng sau, quý này** | • **Thanh điều hướng kỳ hạn (`PeriodBar.jsx`):**<br>- **Tháng này (10/2026):** Lọc các cơ hội có ngày chốt trong tháng 10/2026.<br>- **Tháng sau (11/2026):** Lọc các cơ hội dự kiến chốt tháng 11/2026.<br>- **Quý này (Q4/2026):** Tổng hợp cả quý 4 (tháng 10, 11, 12/2026) kèm điều chỉnh chỉ tiêu Quota quý tương ứng.<br>- **Tất cả các kỳ:** Xem bức tranh toàn cảnh pipeline.<br>• Phân tích thời gian tự động đồng bộ lại toàn bộ số liệu thẻ KPI, thanh tiến độ và bảng cơ hội. | Bấm chuyển đổi giữa các tab *"Tháng Này"*, *"Tháng Sau"*, *"Quý Này"*; các chỉ số Quota, Đã chốt, Dự báo và danh sách deal tự động lọc theo đúng kỳ hạn. |
| **AC3** | **So sánh dự báo với chỉ tiêu và với số đã chốt thực tế** | • **Thẻ điểm 5 chỉ số điều hành (`KpiScorecards.jsx`):**<br>1. *Chỉ Tiêu Doanh Số (Quota)*: Kế hoạch giao cho kỳ.<br>2. *Đã Chốt Thực Tế (Won)*: Doanh số chắc chắn từ hợp đồng đã ký.<br>3. *Dự Báo Trọng Số (Weighted Forecast)*: Doanh số kỳ vọng từ các deal đang đàm phán.<br>4. *Tổng Doanh Số Kỳ Vọng*: Đã chốt + Dự báo trọng số.<br>5. *Chênh Lệch / Khoảng Cách (Gap)*: Thừa/Thiếu bao nhiêu tiền kèm % hoàn thành.<br>• **Thước đo tiến độ kép (`ProgressGauge.jsx`):** Vạch Đã chốt (xanh lá) + Vạch Dự báo (xanh dương) so với mốc 100% chỉ tiêu (vạch vàng).<br>• **3 Kịch bản doanh số cuối kỳ (`ScenariosComparison.jsx`):**<br>- *Kịch bản Tối thiểu (Worst Case)*: Chỉ tính số đã ký trong tay.<br>- *Kịch bản Kỳ vọng (Most Likely)*: Đã ký + Dự báo trọng số xác suất.<br>- *Kịch bản Tối đa (Best Case)*: Đã ký + 100% toàn bộ pipeline mở. | Giám đốc nhìn thấy ngay câu trả lời: Tháng này dự kiến về bao nhiêu, đã có bao nhiêu chắc chắn trong tay, còn thiếu bao nhiêu để đạt 100% kế hoạch. |
| **AC4** | **Xem được theo từng nhân viên và từng nhóm** | • **Phân rã theo tổ chức bán hàng (`TeamBreakdown.jsx`):**<br>- **Chế độ xem theo Nhóm (Teams View):** Bảng tổng hợp so sánh Nhóm Miền Bắc, Nhóm Enterprise, Nhóm Bán lẻ F&B (Quota, Đã chốt, Dự báo, % Đạt, Số deal).<br>- **Chế độ xem theo Nhân viên (Sales Rep Leaderboard):** Xếp hạng từng chuyên viên kinh doanh (Nguyễn Văn An, Trần Thị Mai, Lê Quốc Hưng...), Avatar, Quota cá nhân, Doanh số dự kiến, Huy hiệu vượt chỉ tiêu 🏆.<br>• **Tính năng Drill-down liên thông:** Khi nhấp chuột vào một nhóm hoặc một nhân viên bất kỳ, toàn bộ dashboard và bảng cơ hội sẽ lọc theo đúng đối tượng đó. | Nhấp vào "Nhóm Kinh doanh Miền Bắc" $\rightarrow$ Bảng danh sách cơ hội bên dưới chỉ hiển thị các hợp đồng của Miền Bắc; nhấp vào "Nguyễn Văn An" $\rightarrow$ Thấy rõ cá nhân đạt bao nhiêu %. |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
S04-05-Scrum92-revenue-forecast/
├── index.html                           # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình máy chủ phát triển Vite (Cổng 5187)
├── run.bat                              # File khởi chạy 1-Click trên Windows
├── README.md                            # Tài liệu đối chiếu 4 tiêu chí chấp nhận & hướng dẫn kiểm thử
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # Điều phối State trung tâm (Kỳ, Nhóm, Nhân viên, Mô phỏng)
    ├── index.css                        # CSS Design System hoàn chỉnh chuẩn Enterprise CRM
    ├── data/
    │   ├── mockStages.js                # Danh mục giai đoạn bán hàng & xác suất mặc định (AC1)
    │   ├── mockUsers.js                 # Danh sách Giám đốc, Trưởng nhóm, Sales Rep & Quota tháng/quý (AC4)
    │   └── mockOpportunities.js         # Dữ liệu 18 cơ hội B2B phân bổ đa kỳ (Tháng này, Tháng sau, Quý này)
    ├── utils/
    │   ├── formatters.js                # Định dạng tiền tệ VNĐ (đầy đủ & rút gọn), ngày tháng, tỷ lệ %
    │   └── forecastCalculations.js      # Động cơ tính toán dự báo trọng số, kịch bản & AI Executive Answer
    └── components/
        ├── Header.jsx                   # Topbar điều hành, Persona Switcher, Nút Jira ticket, Theme switcher
        ├── ExecutiveAnswerBox.jsx       # ★ HỘP TRẢ LỜI CHO GIÁM ĐỐC: "Tháng này về bao nhiêu bằng số liệu?"
        ├── PeriodBar.jsx                # ★ BỘ CHỌN KỲ HẠN: Tháng này, Tháng sau, Quý này & Bộ lọc Nhóm/Rep (AC2, AC4)
        ├── KpiScorecards.jsx            # ★ 5 THẺ ĐIỂM KPI SO SÁNH: Quota vs Won vs Forecast vs Total vs Gap (AC3)
        ├── ProgressGauge.jsx            # Thước đo tiến độ kép so sánh thực tế + dự báo vs mốc 100% Quota
        ├── ScenariosComparison.jsx      # Phân tích 3 kịch bản doanh số: Worst Case, Most Likely, Best Case
        ├── TeamBreakdown.jsx            # ★ BẢNG PHÂN RÃ THEO NHÓM & XẾP HẠNG NHÂN VIÊN KINH DOANH (AC4)
        ├── OpportunityTable.jsx         # ★ BẢNG CHI TIẾT CƠ HỘI ĐÓNG GÓP: Giá trị × Xác suất = Dự báo (AC1)
        ├── WhatIfSimulatorModal.jsx     # ★ BỘ GIẢ LẬP WHAT-IF: Tinh chỉnh xác suất giai đoạn & xem tác động delta
        ├── OpportunityModal.jsx         # Modal thêm mới & chỉnh sửa nhanh cơ hội bán hàng
        ├── JiraTicketModal.jsx          # Modal tra cứu chi tiết đề bài Jira ticket & bảng 4 tiêu chí AC1-AC4
        ├── ExportReportModal.jsx        # Xuất báo cáo tóm tắt & tải file CSV/Excel cho Ban Giám Đốc
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. HƯỚNG DẪN KHỞI CHẠY NHANH

### Cách 1: Khởi chạy 1-Click trên Windows
Nhấp đúp chuột vào file **`run.bat`** trong thư mục dự án:
```
c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-05-Scrum92-revenue-forecast\run.bat
```
Trình duyệt sẽ mở ứng dụng tại:  
👉 **`http://localhost:5187`**

### Cách 2: Khởi chạy qua Terminal
```powershell
# Di chuyển vào thư mục dự án
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\Frontend-S04\S04-05-Scrum92-revenue-forecast"

# Khởi chạy Vite Dev Server
npm.cmd run dev
```

---

## 🧪 4. KỊCH BẢN KIỂM THỬ TỪNG TIÊU CHÍ (TEST CASES)

### Test Case 1: Kiểm thử Tiêu chí 1 (AC1 - Công thức tính dự báo trọng số xác suất)
1. Trên bảng **"Chi Tiết Các Cơ Hội Đóng Góp Vào Dự Báo"**:
   - Quan sát cơ hội **OPP-2026-101** (*Triển khai CRM Tập đoàn Dệt may Hòa Phát*).
   - Giá trị cơ hội: `150.000.000 ₫`.
   - Giai đoạn: `Thương Thảo Hợp Đồng` (Xác suất 80%).
   - Cột Dự báo trọng số tính chính xác: $150.000.000 \times 80\% = 120.000.000\text{ ₫}$.
2. Bấm nút **"Sửa Deal"** $\rightarrow$ Kéo xác suất từ `80%` lên `90%` $\rightarrow$ Nhìn thấy hộp xem trước công thức nhảy lên `135.000.000 ₫` $\rightarrow$ Bấm lưu.
3. Bấm nút **"Mô Phỏng What-If"** trên Header:
   - Kéo thanh trượt của giai đoạn *Thương Thảo* hoặc *Gửi Báo Giá* $\rightarrow$ Thấy hộp tác động Delta thông báo ngay doanh số dự kiến tăng/giảm bao nhiêu VNĐ.
   - Bấm *"Áp Dụng Vào Báo Cáo"* $\rightarrow$ Toàn bộ dự báo trên trang cập nhật theo xác suất giả lập mới.

### Test Case 2: Kiểm thử Tiêu chí 2 (AC2 - Nhóm theo kỳ: Tháng này, Tháng sau, Quý này)
1. Mặc định ứng dụng hiển thị tab **"Tháng Này (T10/2026)"**:
   - Thấy danh sách cơ hội dự kiến chốt trong tháng 10/2026.
   - Chỉ tiêu Quota tháng: 2,9 tỷ VNĐ.
2. Bấm chọn tab **"Tháng Sau (T11/2026)"**:
   - Bảng cơ hội tự động chuyển sang hiển thị các dự án của tháng 11/2026 (Manulife 750M, SSI 550M, Golden Gate 280M...).
   - Hộp trả lời của Giám đốc kinh doanh đổi câu trả lời cho kỳ *"Tháng sau (11/2026) về bao nhiêu bằng số liệu"*.
3. Bấm chọn tab **"Quý Này (Q4/2026)"**:
   - Chỉ tiêu Quota tự động mở rộng theo quý: 8,65 tỷ VNĐ.
   - Dự báo tổng hợp toàn bộ các tháng 10, 11, 12 thuộc Quý 4.

### Test Case 3: Kiểm thử Tiêu chí 3 (AC3 - So sánh dự báo vs chỉ tiêu vs số đã chốt thực tế)
1. Quan sát **Hàng 5 thẻ điểm KPI (KpiScorecards)**:
   - Thẻ 1: **Chỉ Tiêu (Quota)**: Ví dụ 2.900.000.000 ₫
   - Thẻ 2: **Đã Chốt Thực Tế (Won)**: Ví dụ 425.000.000 ₫ (GHN 245M + Tân Á Đại Thành 180M)
   - Thẻ 3: **Dự Báo Trọng Số (Weighted Forecast)**: Tổng các cơ hội mở nhân xác suất
   - Thẻ 4: **Tổng Doanh Số Kỳ Vọng**: Đã chốt + Dự báo trọng số
   - Thẻ 5: **Chênh Lệch Với Chỉ Tiêu (Gap)**: Cho biết còn thiếu bao nhiêu tiền để cán mốc 100% KPI.
2. Nhìn vào **Thước đo tiến độ kép (Progress Gauge)**:
   - Thấy rõ đoạn màu xanh lá (đã chốt) nối tiếp đoạn màu xanh dương (dự báo) hướng tới vạch vàng 100% chỉ tiêu.
3. Quan sát mục **Phân tích 3 Kịch bản**:
   - So sánh trực quan giữa kịch bản Worst Case (sàn an toàn), Most Likely (kỳ vọng trọng số), và Best Case (trần tối đa).

### Test Case 4: Kiểm thử Tiêu chí 4 (AC4 - Xem theo từng nhân viên và từng nhóm)
1. Tại khu vực **"Phân Rã Dự Báo Theo Tổ Chức Bán Hàng"**:
   - Bấm tab **"Theo Từng Nhóm"**: Thấy bảng so sánh 3 nhóm kinh doanh (Miền Bắc, Enterprise, Bán lẻ & F&B).
   - Nhấp vào hàng **"Nhóm Kinh doanh Miền Bắc"** $\rightarrow$ Thẻ KPI và bảng cơ hội bên dưới lập tức lọc riêng các hợp đồng của Miền Bắc.
2. Bấm chuyển sang tab **"Theo Từng Nhân Viên"**:
   - Thấy bảng xếp hạng doanh số (Leaderboard) sắp xếp từ cao xuống thấp của các Sales Rep kèm avatar và tiến độ % Quota cá nhân.
   - Nhấp vào **"Nguyễn Văn An"** $\rightarrow$ Toàn bộ trang chuyển sang chế độ phân tích cá nhân của Nguyễn Văn An (Chỉ tiêu 450M, đã chốt 425M đạt 94.4%, 1 deal đàm phán 150M trọng số 120M $\rightarrow$ Tổng kỳ vọng 545M đạt 121.1% vượt chỉ tiêu 🏆).
3. Đổi **Persona Switcher** trên góc phải màn hình sang *"Nguyễn Văn An"* hoặc *"Trần Đình Trọng"* để trải nghiệm góc nhìn phân quyền của từng cấp bậc.
