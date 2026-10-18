# HỆ THỐNG CẢNH BÁO CƠ HỘI ĐÌNH TRỆ & CAN THIỆP SỚM (SCRUM-93)

> **Mã Nhiệm Vụ (Jira Ticket):** `⚡ SCRUM-20 / ☑ SCRUM-93`  
> **Trạng thái:** `Ready for Review` / `Done`  
> **User Story:** *"Là Trưởng nhóm kinh doanh, tôi muốn được cảnh báo khi cơ hội đình trệ, để can thiệp sớm thay vì phát hiện khi thương vụ đã nguội."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Enterprise CRM Design System`, `Lucide Icons`  
> **Cổng khởi chạy máy chủ:** `http://localhost:5188`  
> **Tỷ lệ hoàn thành:** 100% tất cả 4 tiêu chí chấp nhận (Acceptance Criteria) trong đề bài.

---

## 🎯 1. BẢNG ĐỐI CHIẾU 4 TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA)

| STT | Tiêu chí trong Jira Ticket (Description) | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng & Kiểm thử |
| :---: | :--- | :--- | :--- |
| **AC1** | **Cơ hội không có hoạt động nào trong N ngày được gắn cờ, N cấu hình theo từng giai đoạn** | • **Động cơ đánh giá (`evaluateOpportunity` trong `src/utils/stagnantEvaluation.js`):**<br>- Tính số ngày kể từ hoạt động cuối: `daysSinceLastActivity = daysBetween(lastActivityDate, today)`.<br>- Lấy ngưỡng $N$ cấu hình cho giai đoạn tương ứng: `thresholdN = stageThresholds[stage].thresholdDays`.<br>- Nếu `daysSinceLastActivity >= thresholdN` (và deal chưa đóng) $\rightarrow$ Gắn cờ cảnh báo `INACTIVITY` hoặc cờ kép `DUAL` nếu kết hợp quá hạn chốt.<br>• **Ma trận ngưỡng $N$ ngày chuẩn theo từng giai đoạn:**<br>1. *Khảo sát & Đánh giá nhu cầu*: $N = 7$ ngày<br>2. *Giải pháp & Demo POC*: $N = 10$ ngày<br>3. *Gửi Báo Giá & Đề Xuất*: $N = 5$ ngày<br>4. *Thương Thảo Hợp Đồng*: $N = 3$ ngày (giai đoạn nước rút)<br>• **Bộ cấu hình ngưỡng N ngày (`ThresholdConfigModal.jsx`):**<br>Cho phép Trưởng nhóm kéo thanh trượt (slider) hoặc nhập số ngày $N$ cho từng giai đoạn, hiển thị trước số cơ hội bị ảnh hưởng ngay tức thì và lưu vào hệ thống. | • Cột *"Hoạt Động Cuối"* trong bảng hiển thị rõ: `⏱️ 12 ngày im ắng (Max 5 ngày)`.<br>• Mở modal Cấu hình ngưỡng $N$ ngày $\rightarrow$ Kéo giảm $N$ giai đoạn Báo Giá từ 5 xuống 3 ngày $\rightarrow$ Bảng danh sách cơ hội lập tức tăng thêm các deal bị gắn cờ; tăng lên 15 ngày thì deal tự động hết cờ! |
| **AC2** | **Cơ hội quá ngày dự kiến chốt mà chưa đóng cũng được gắn cờ** | • **Động cơ kiểm tra ngày chốt hợp đồng:**<br>- Kiểm tra điều kiện: `expectedCloseDate < currentDate` và giai đoạn thương vụ chưa đóng (`stage !== 'CLOSED_WON'` và `stage !== 'CLOSED_LOST'`).<br>- Tính số ngày trễ hẹn: `daysOverdue = daysBetween(expectedCloseDate, today)`.<br>- Nếu vi phạm $\rightarrow$ Gắn cờ `OVERDUE_CLOSE` (màu hồng neon / đỏ) với thông báo: *"Đã quá ngày dự kiến chốt X ngày nhưng chưa đóng hợp đồng"*.<br>• **Gắn cờ kép (Dual Critical Flag 🚨):** Deal vừa quá ngày chốt vừa không có tương tác $> N$ ngày sẽ được phân loại vào mức độ rủi ro **Khẩn Cấp (Critical)**.<br>• **Bộ gia hạn ngày chốt (`ExtendCloseDateModal.jsx`):** Cho phép Trưởng nhóm/Rep cập nhật ngày chốt mới trong tương lai kèm lý do $\rightarrow$ Hệ thống tự động gỡ bỏ cờ quá hạn chốt ngay tức thì. | • Cột *"Dự Kiến Chốt"* trong bảng thể hiện rõ: `⚠️ Trễ 6 ngày chưa đóng`.<br>• Thử bấm nút *"Gia Hạn"* trên deal quá hạn $\rightarrow$ Chọn ngày mới trong tương lai $\rightarrow$ Cờ `OVERDUE_CLOSE` lập tức biến mất khỏi dòng thương vụ. |
| **AC3** | **Danh sách cơ hội có cờ hiển thị riêng cho trưởng nhóm** | • **Chế độ xem chuyên biệt dành riêng cho Trưởng nhóm (`StagnantOpportunitiesList.jsx`):**<br>- **Tab 1: 🚨 Cơ Hội Có Cờ Đình Trệ (Dành Riêng Cho Trưởng Nhóm):** Chế độ mặc định, tự động lọc riêng toàn bộ cơ hội đang có cờ để Trưởng nhóm tập trung can thiệp khẩn cấp.<br>- **Tab 2: 🌐 Toàn Bộ Pipeline:** Cho phép đối chiếu với bức tranh tổng thể.<br>- **Tab 3: 🛡️ Đã Can Thiệp & Chỉ Đạo:** Quản lý các deal đã được Trưởng nhóm xử lý.<br>• **Đo lường "Nhiệt độ thương vụ" (Deal Temperature):**<br>- ❄️ *Lạnh cóng (Frozen)*: Bị cờ kép hoặc im ắng quá 2 lần ngưỡng $N$.<br>- 🌡️ *Đang nguội dần (Cooling)*: Vượt ngưỡng $N$ ngày hoặc trễ hẹn chốt.<br>- 🔥 *Ấm áp (Warm)*: Tương tác đều đặn.<br>• **4 Hành động can thiệp sớm của Trưởng nhóm (`InterventionModal.jsx`):**<br>1. *Nhắc nhở khẩn Rep (Ping Rep)*<br>2. *Họp giải cứu deal 3 bên (Deal Rescue Meeting)*<br>3. *Chuyển giao người phụ trách (Reassign Rep)*<br>4. *Chỉ đạo chiến lược (Chiết khấu, gia hạn SLA...)* | • Khi mở ứng dụng, màn hình mặc định mở tab *"Cơ Hội Có Cờ Đình Trệ"* hiển thị riêng 8 thương vụ rủi ro.<br>• Trưởng nhóm bấm nút *"Can Thiệp"* $\rightarrow$ Chọn hành động $\rightarrow$ Deal được gắn huy hiệu `🛡️ Đã có chỉ đạo (1)`.<br>• Bấm *"Ghi HĐ"* $\rightarrow$ Cập nhật cuộc gọi/họp mới $\rightarrow$ Deal tự động được gỡ cờ vì đã có hoạt động! |
| **AC4** | **Tác vụ đánh giá chạy mỗi ngày một lần** | • **Mô hình tác vụ định kỳ tự động (Daily Evaluation Cron Job):**<br>- Cấu hình chu kỳ: `0 6 * * *` (Chạy tự động lúc 06:00:00 sáng mỗi ngày).<br>- Banner trên đỉnh trang (`DailyEvaluationBanner.jsx`) hiển thị rõ: Giờ chạy gần nhất, số deal đã quét, số deal có cờ phát hiện, thời gian lần chạy tiếp theo.<br>• **Kích hoạt đánh giá thủ công ngay lập tức:**<br>Nút **`⚡ Quét Đánh Giá Ngay`** cho phép Trưởng nhóm bấm quét lại toàn bộ dữ liệu tức thì khi vừa cập nhật ngưỡng hoặc thêm deal mới.<br>• **Nhật ký các lần chạy (`DailyEvaluationJobModal.jsx`):** Bảng Execution History ghi lại chi tiết từng lần chạy định kỳ của hệ thống và các lần chạy thủ công (thời điểm, thời lượng ms, số deal quét, biến động số cờ). | • Bấm nút *"⚡ Quét Đánh Giá Ngay"* $\rightarrow$ Icon quay spinner quét toàn bộ cơ hội, cập nhật thời gian chạy mới nhất và xuất hiện Toast thông báo thành công.<br>• Mở modal *"Nhật Ký Chạy"* $\rightarrow$ Thấy rõ lịch sử các lần chạy lúc 06:00 AM hàng ngày kèm thông số chi tiết. |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
S04-05-Scrum93-stagnant-opportunity-alert/
├── index.html                           # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình máy chủ phát triển Vite (Cổng 5188)
├── run.bat                              # File khởi chạy 1-Click trên Windows
├── README.md                            # Tài liệu đối chiếu 4 tiêu chí chấp nhận & hướng dẫn kiểm thử
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # Điều phối State trung tâm (Cơ hội, Ngưỡng N ngày, Job history, Modals)
    ├── index.css                        # CSS Design System hoàn chỉnh chuẩn Enterprise CRM
    ├── data/
    │   ├── mockStages.js                # Danh mục giai đoạn & Ngưỡng N ngày mặc định (AC1)
    │   ├── mockUsers.js                 # Danh sách Trưởng nhóm, Nhân viên kinh doanh & Giám đốc (AC3)
    │   ├── mockOpportunities.js         # Dữ liệu 15 cơ hội B2B thực tế kèm ngày hoạt động & ngày chốt
    │   └── mockEvaluationJob.js         # Cấu hình Cron job hàng ngày & Nhật ký lịch sử chạy (AC4)
    ├── utils/
    │   ├── formatters.js                # Định dạng tiền tệ VNĐ, ngày tháng, tính toán khoảng cách ngày
    │   └── stagnantEvaluation.js        # Động cơ phân tích rủi ro, tính toán cờ vi phạm & bảng điểm KPI
    └── components/
        ├── Header.jsx                   # Topbar điều hành, Persona Switcher, Nút Jira ticket, Theme switcher
        ├── DailyEvaluationBanner.jsx     # ★ BANNER TÁC VỤ ĐÁNH GIÁ CHẠY MỖI NGÀY MỘT LẦN (AC4)
        ├── RiskKpiScorecards.jsx        # ★ 5 THẺ ĐIỂM KPI RỦI RO: Doanh số mất, Cờ N ngày, Quá hạn, Can thiệp
        ├── StagnantOpportunitiesList.jsx# ★ DANH SÁCH CƠ HỘI CÓ CỜ HIỂN THỊ RIÊNG CHO TRƯỞNG NHÓM (AC3)
        ├── ThresholdConfigModal.jsx     # ★ BỘ CẤU HÌNH NGƯỠNG N NGÀY THEO TỪNG GIAI ĐOẠN (AC1)
        ├── DailyEvaluationJobModal.jsx  # ★ NHẬT KÝ & CẤU HÌNH TÁC VỤ ĐÁNH GIÁ HÀNG NGÀY (AC4)
        ├── InterventionModal.jsx        # ★ MODAL TRƯỞNG NHÓM CAN THIỆP SỚM VÀO THƯƠNG VỤ (AC3)
        ├── LogActivityModal.jsx         # Modal ghi nhận hoạt động mới (Gỡ cờ đình trệ N ngày)
        ├── ExtendCloseDateModal.jsx     # Modal gia hạn ngày dự kiến chốt (Gỡ cờ quá hạn chốt)
        ├── OpportunityDetailModal.jsx   # Modal xem toàn bộ hồ sơ, dòng thời gian tương tác của deal
        ├── JiraTicketModal.jsx          # Modal tra cứu chi tiết đề bài Jira ticket & bảng 4 tiêu chí AC1-AC4
        ├── AddOpportunityModal.jsx      # Modal tạo cơ hội mới để thử nghiệm gắn cờ
        ├── ExportReportModal.jsx        # Modal xuất báo cáo CSV & in tóm tắt rủi ro cho Ban Giám Đốc
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. HƯỚNG DẪN KHỞI CHẠY VÀ KIỂM THỬ

### 1. Khởi chạy ứng dụng:
- Cách 1: Nhấp đúp vào file `run.bat` tại thư mục dự án.
- Cách 2: Mở terminal tại thư mục dự án và chạy:
  ```bash
  npm run dev
  ```
- Ứng dụng chạy trên cổng: **`http://localhost:5188`**

### 2. Kịch bản kiểm thử nhanh các tiêu chí:
1. **Kiểm tra AC1 (Cơ hội không hoạt động trong N ngày):**
   - Quan sát deal `OPP-9302 (Chuỗi Cà phê Highlands Star)`: Đang ở giai đoạn *Gửi Báo Giá*, ngày hoạt động cuối là `06/10/2026` (12 ngày trước). Vì ngưỡng giai đoạn Báo Giá là $N = 5$ ngày $\rightarrow$ Bị gắn cờ `⏱️ Cờ: > 5 Ngày Không Hoạt Động`.
   - Bấm nút **"Cấu hình Ngưỡng N Ngày"** trên topbar $\rightarrow$ Kéo slider giai đoạn Báo Giá lên 15 ngày $\rightarrow$ Bấm Lưu $\rightarrow$ Cờ cảnh báo của deal này lập tức biến mất!
2. **Kiểm tra AC2 (Cơ hội quá ngày dự kiến chốt mà chưa đóng):**
   - Quan sát deal `OPP-9307 (Tập đoàn Xây dựng Horizon)`: Ngày chốt là `14/10/2026` (trễ 4 ngày so với hôm nay 18/10) $\rightarrow$ Bị gắn cờ `📅 Cờ: Quá Hạn Chốt Chưa Đóng`.
   - Bấm nút **"Gia Hạn"** trên dòng deal đó $\rightarrow$ Chọn ngày mới `31/10/2026` $\rightarrow$ Bấm Lưu $\rightarrow$ Cờ quá hạn được gỡ bỏ ngay lập tức.
3. **Kiểm tra AC3 (Danh sách riêng cho Trưởng nhóm & Can thiệp sớm):**
   - Mặc định tab *"🚨 Cơ Hội Có Cờ Đình Trệ (Dành Riêng Cho Trưởng Nhóm)"* chỉ lọc 8 deal có cờ.
   - Bấm nút **"Can Thiệp"** trên deal `OPP-9301` $\rightarrow$ Chọn *"1. Nhắc nhở khẩn Rep"* $\rightarrow$ Bấm Gửi $\rightarrow$ Deal được gắn huy hiệu `🛡️ Đã có chỉ đạo (2)`.
   - Bấm nút **"Ghi HĐ"** $\rightarrow$ Ghi một cuộc gọi mới vào ngày hôm nay $\rightarrow$ Deal được gỡ cờ vì đã có hoạt động!
4. **Kiểm tra AC4 (Tác vụ đánh giá chạy mỗi ngày một lần):**
   - Xem banner đầu trang: Lịch chạy tự động định kỳ `06:00:00 AM`.
   - Bấm nút **"⚡ Quét Đánh Giá Ngay"** $\rightarrow$ Hệ thống quét lại và ghi thêm 1 bản ghi vào lịch sử.
   - Bấm nút **"Nhật Ký Chạy"** $\rightarrow$ Xem bảng log lưu trữ lịch sử các lần chạy định kỳ.
