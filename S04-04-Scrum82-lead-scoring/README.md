# Hệ Thống Cấu Hình Chấm Điểm & Ưu Tiên Cuộc Gọi Lead (CRM Enterprise)

> **User Story:** *"Là Giám đốc kinh doanh, tôi muốn cấu hình chấm điểm lead theo tiêu chí khai báo được, để nhân viên gọi những lead có khả năng nhất trước."*  
> **Nền tảng & Công nghệ:** `React 19`, `Vite`, `Vanilla Modern CSS`, `Lucide Icons`  
> **Trạng thái:** Hoàn thành 100% cả 4 tiêu chí nghiệm thu (Acceptance Criteria)

---

## 🎯 1. Phân Tích Đề Bài & Bảng Đối Chiếu 4 Tiêu Chí Nghiệm Thu

### Bối cảnh nghiệp vụ thực tế:
- **Người dùng:** Giám đốc kinh doanh (Sales Director).
- **Vấn đề thực tế:** Khi số lượng Lead đổ về mỗi ngày rất lớn (hàng trăm đến hàng nghìn lead), nhân viên Telesales không biết nên gọi ai trước. Nếu gọi ngẫu nhiên hoặc theo thứ tự thời gian, nhân viên có thể mất nhiều giờ gọi cho các khách hàng nhỏ, không có ngân sách hoặc chỉ mới tìm hiểu vãng lai, trong khi bỏ lỡ các khách hàng doanh nghiệp lớn đang cần triển khai gấp trong tháng (Hot Leads)!
- **Giải pháp:** Xây dựng cỗ máy chấm điểm tự động (Configurable Lead Scoring Engine) cho phép Giám đốc kinh doanh khai báo các tiêu chí và trọng số điểm phù hợp với chiến lược bán hàng của công ty, tự động tính lại điểm số trong thời gian thực khi thông tin lead thay đổi, phân loại Nóng/Ấm/Lạnh theo ngưỡng điểm tùy biến, và sắp xếp hàng đợi cuộc gọi ưu tiên mà không loại bỏ bất kỳ cơ hội kinh doanh nào!

---

### Bảng Đối Chiếu 4 Tiêu Chí Nghiệm Thu:

| STT | Tiêu chí trong Jira Ticket | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng kiểm thử trên giao diện |
| :---: | :--- | :--- | :--- |
| **1** | **Khai báo tiêu chí và số điểm: ngành nghề phù hợp, quy mô doanh nghiệp, nguồn, mức độ quan tâm** | • Bảng điều khiển quản trị `ScoringConfigPanel.jsx` dành riêng cho Giám đốc kinh doanh.<br>• Khai báo 4 nhóm tiêu chí với số điểm tương ứng:<br>&nbsp;&nbsp;1. **Ngành nghề phù hợp:** CNTT & Viễn thông (+25đ), Tài chính - Ngân hàng (+20đ), Sản xuất (+15đ), Bán lẻ (+10đ), Dịch vụ (+5đ).<br>&nbsp;&nbsp;2. **Quy mô doanh nghiệp:** Lớn > 500 (+30đ), Vừa 100-500 (+20đ), Nhỏ 20-100 (+10đ), Siêu nhỏ < 20 (+5đ).<br>&nbsp;&nbsp;3. **Nguồn tiếp thị:** Hotline/Demo (+25đ), Hội thảo (+20đ), Google Search (+15đ), Facebook (+10đ), Khác (+5đ).<br>&nbsp;&nbsp;4. **Mức độ quan tâm:** Rất cao (+30đ), Cao (+20đ), Trung bình (+10đ), Thấp (+0đ).<br>• Cho phép gõ hoặc chỉnh sửa số điểm của từng tiêu chí trực tiếp trên màn hình! | Khối 4 nhóm tiêu chí với ô nhập điểm số (+đ) có thể tương tác; Nút *"Khôi Phục Mặc Định"*. |
| **2** | **Điểm được tính lại tự động khi thông tin lead thay đổi** | • Thuật toán `calculateLeadScore()` tự động tính toán lại toàn bộ điểm số ngay lập tức (Reactive Recalculation).<br>• Khi nhân viên sửa thông tin khách hàng (đổi ngành, đổi quy mô, hoặc cập nhật mức độ quan tâm sau cuộc gọi): Điểm số thay đổi ngay lập tức không cần tải lại trang.<br>• Modal `QuickEditLeadModal.jsx` tích hợp **Live Score Preview**: Hiển thị trực quan điểm cũ $\rightarrow$ điểm mới và $\Delta$ chênh lệch điểm (ví dụ: chuyển từ 30đ lên 85đ khi nâng mức độ quan tâm). | Modal *"Sửa Thông Tin"* hiển thị kết quả tính lại điểm số thời gian thực; Cột điểm và thứ hạng của bảng cập nhật ngay khi bấm Lưu. |
| **3** | **Phân loại Nóng, Ấm, Lạnh theo ngưỡng điểm khai báo được** | • Thanh trượt khai báo ngưỡng điểm trực quan trên `ScoringConfigPanel.jsx`: `hotMin` và `warmMin`.<br>• Mặc định:<br>&nbsp;&nbsp;🔥 **NÓNG (HOT):** $\ge 70$ điểm (Khuyến nghị: Gọi ngay trong vòng 15-30 phút).<br>&nbsp;&nbsp;☀️ **ẤM (WARM):** 40 - 69 điểm (Khuyến nghị: Gọi trong ngày làm việc).<br>&nbsp;&nbsp;❄️ **LẠNH (COLD):** $< 40$ điểm (Khuyến nghị: Nuôi dưỡng chuỗi email tự động).<br>• Khi Giám đốc kéo thanh trượt (ví dụ: nâng ngưỡng Nóng lên 80): Toàn bộ danh sách Lead được tự động tái phân loại Nóng/Ấm/Lạnh tương ứng ngay lập tức! | Thanh trượt ngưỡng điểm tương tác; 4 thẻ KPI thống kê số lượng Nóng/Ấm/Lạnh; Các huy hiệu màu đỏ `🔥 NÓNG`, vàng `☀️ ẤM`, xanh `❄️ LẠNH`. |
| **4** | **Điểm chỉ để sắp xếp ưu tiên, không tự động loại lead** | • Bảng danh sách mặc định sắp xếp theo **Hàng Đợi Cuộc Gọi Ưu Tiên (Telesales Call Priority Queue)** với huy hiệu Rank `#1`, `#2`, `#3`... từ điểm cao nhất đến thấp nhất.<br>• **Bảo toàn 100% Leads:** Ngay cả Lead Lạnh có điểm thấp nhất (ví dụ: 15-20 điểm) vẫn hiển thị đầy đủ trên giao diện CRM, vẫn có nhân viên phụ trách, nút gọi điện và nút ghi chú.<br>• Hệ thống cam kết không có cơ chế tự động xóa, ẩn hoặc loại bỏ bất kỳ lead nào khỏi cơ sở dữ liệu! | Banner xanh cam kết nghiệp vụ; Bộ lọc cho phép bấm vào tab `Lead LẠNH` để thấy đầy đủ 100% lead điểm thấp vẫn được lưu trữ và có nhân viên theo dõi. |

---

## 📂 2. Cấu Trúc Thư Mục Dự Án

```
lead-scoring/
├── index.html                           # HTML gốc, Google Fonts Plus Jakarta Sans & JetBrains Mono
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình Vite cổng 5182
├── run.bat                              # File khởi chạy 1-click tự động trên Windows
├── README.md                            # Tài liệu đối chiếu tiêu chí và kịch bản nghiệm thu
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # State trung tâm, điều phối tính điểm & cấu hình
    ├── index.css                        # CSS hoàn chỉnh phong cách Enterprise CRM
    ├── data/
    │   ├── defaultScoringConfig.js      # Cấu hình 4 nhóm tiêu chí và ngưỡng điểm Nóng/Ấm/Lạnh
    │   └── mockLeads.js                 # Danh sách Lead phong phú với đầy đủ các thuộc tính chấm điểm
    ├── utils/
    │   └── scoreCalculator.js           # Thuật toán tính điểm tự động, xếp hạng ưu tiên và phân loại
    └── components/
        ├── Header.jsx                   # Header với vai trò Giám Đốc Kinh Doanh, Theme Switcher
        ├── ScoringConfigPanel.jsx       # ★ BẢNG CẤU HÌNH TIÊU CHÍ VÀ NGƯỠNG ĐIỂM (TIÊU CHÍ 1 & 3)
        ├── KpiSummaryCards.jsx          # 4 thẻ thống kê (Tổng Lead, Lead Nóng, Lead Ấm, Lead Lạnh)
        ├── LeadPriorityQueue.jsx        # ★ BẢNG HÀNG ĐỢI GỌI ĐIỆN THEO ĐIỂM ƯU TIÊN (TIÊU CHÍ 4)
        ├── QuickEditLeadModal.jsx       # ★ MODAL SỬA THÔNG TIN & TÍNH LẠI ĐIỂM THỜI GIAN THỰC (TIÊU CHÍ 2)
        ├── ScoreBreakdownModal.jsx      # Xem chi tiết điểm số từng tiêu chí của một Lead
        ├── JiraGuideModal.jsx           # Bảng tra cứu trực quan kèm 4 nút chạy nhanh kịch bản kiểm thử
        └── Toast.jsx                    # Thông báo Toast nổi góc màn hình
```

---

## 🚀 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Chạy nhanh 1-Click bằng file `run.bat` (Khuyên dùng trên Windows)
1. Vào thư mục: `lead-scoring`
2. Nhấp đúp chuột vào file:
   ```cmd
   run.bat
   ```
3. Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:5182`

### Cách 2: Chạy bằng Terminal
```bash
cd "c:\Users\FPT SHOP\.gemini\antigravity-ide\scratch\lead-scoring"
npm.cmd run dev
```

---

## 🧪 4. Kịch Bản Kiểm Thử Nghiệm Thu (Acceptance Testing Checklist)

Bạn có thể mở ứng dụng tại `http://localhost:5182/` và bấm nút **"Tiêu Chí Đề Bài"** ở thanh Header để có sẵn 4 nút thử nghiệm nhanh:

1. **Kiểm tra Tiêu chí 1 (Khai báo tiêu chí và số điểm):**
   - Quan sát bảng **"Bảng Cấu Hình Tiêu Chí Chấm Điểm & Phân Loại Lead"** ở đầu trang.
   - Thấy đủ 4 nhóm tiêu chí: *Ngành nghề phù hợp*, *Quy mô doanh nghiệp*, *Nguồn tiếp thị*, *Mức độ quan tâm*.
   - Thử thay đổi số điểm của tiêu chí *Công nghệ thông tin* từ `25` lên `35` hoặc *Quy mô lớn* từ `30` lên `40`: Quan sát điểm số của toàn bộ Leads phía dưới lập tức tự động tăng theo!
2. **Kiểm tra Tiêu chí 2 (Điểm được tính lại tự động khi thông tin lead thay đổi):**
   - Tại bất kỳ dòng Lead nào (ví dụ dòng `Bùi Thanh Hằng - LEAD-205` đang có điểm thấp `15 điểm - LẠNH`), bấm nút **"Sửa Thông Tin"**.
   - Thử đổi *Mức độ quan tâm* từ `Thấp` sang `Rất cao (Cần triển khai ngay trong tháng này)` và *Quy mô* sang `Lớn > 500`.
   - Quan sát khung màu vàng bên dưới: Điểm số lập tức nhảy vọt từ `15` lên `75 điểm`, phân loại tự động chuyển từ `❄️ LẠNH` sang `🔥 NÓNG`!
   - Bấm **"Lưu & Cập Nhật"**: Lead này lập tức nhảy từ cuối bảng lên vị trí Top đầu của hàng đợi cuộc gọi!
3. **Kiểm tra Tiêu chí 3 (Phân loại Nóng, Ấm, Lạnh theo ngưỡng điểm khai báo được):**
   - Kéo thanh trượt **"Ngưỡng Lead NÓNG (HOT)"** từ `70` lên `85`:
   - Quan sát: Số lượng Lead Nóng trên thẻ KPI giảm xuống, các lead có điểm từ 70 - 84 tự động chuyển thành `☀️ ẤM (WARM)`.
   - Kéo ngược lại về `65`: Các lead lập tức chuyển lại thành `🔥 NÓNG (HOT)`!
4. **Kiểm tra Tiêu chí 4 (Điểm chỉ để sắp xếp ưu tiên, không tự động loại lead):**
   - Quan sát bảng hàng đợi: Lead được đánh số thứ tự ưu tiên `#1, #2, #3...` từ điểm cao đến điểm thấp để Telesales biết nên gọi ai trước.
   - Bấm vào thẻ KPI **"❄️ Lead LẠNH (COLD)"**: Thấy các lead có điểm thấp nhất (ví dụ 15-20 điểm) **vẫn hiển thị đầy đủ 100% trong danh sách**, vẫn có nhân viên phụ trách và nút gọi điện, chứng minh hệ thống không hề loại bỏ bất kỳ lead nào!
