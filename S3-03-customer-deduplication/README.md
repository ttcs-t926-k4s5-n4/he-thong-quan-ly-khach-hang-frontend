# Hệ Thống Cảnh Báo & Gộp Khách Hàng Trùng Lặp (SCRUM-72)

> **Mã công việc:** `SCRUM-18 / SCRUM-72`  
> **Ngôn ngữ & Nền tảng:** `React 19`, `Vite`, `Vanilla Modern CSS`, `Lucide Icons`  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Trưởng nhóm kinh doanh, tôi muốn được cảnh báo và gộp khách hàng trùng, để hai nhân viên không cùng chào một công ty mà không biết nhau."*

### Bảng Đối Chiếu 4 Tiêu Chí Nghiệm Thu (Acceptance Criteria):

| STT | Tiêu chí trong Jira Ticket | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng kiểm thử |
| :---: | :--- | :--- | :--- |
| **1** | **Phát hiện trùng theo mã số thuế, tên công ty gần giống và website** | • **Mã số thuế (MST):** Chuẩn hóa loại bỏ khoảng trắng, dấu gạch nối; đối soát 100% hoặc 10 số đầu của chi nhánh.<br>• **Tên công ty gần giống:** Chuẩn hóa bỏ từ dừng pháp lý (`Công ty Cổ phần`, `TNHH`, `Tập đoàn`, `Corp`...) kết hợp thuật toán so khớp Levenshtein Distance & Token Jaccard Similarity ($\ge 70\%$).<br>• **Website:** Chuẩn hóa bóc tách tên miền gốc (`fpt.com.vn`).<br>• **Live Scanner:** Cảnh báo trùng lặp tức thì ngay khi nhân viên gõ phím tạo khách hàng mới! | Banner cảnh báo đỏ nổi bật trên đầu trang; các thẻ badge `CRITICAL` và `HIGH` trên từng dòng bảng dữ liệu. |
| **2** | **Hiển thị so sánh cạnh nhau trước khi gộp (Side-by-side)** | • Màn hình **Dual-Pane Inspector** song song 2 cột: Cột trái (Bản ghi chính - Master Record) vs Cột phải (Bản ghi sáp nhập - Secondary Record).<br>• Hiển thị thanh đo tin cậy (%) và lý do xung đột chi tiết.<br>• **Nút hoán đổi (Swap button):** Cho phép đảo vai trò Master $\leftrightarrow$ Duplicate chỉ với 1 click.<br>• **Bộ giải quyết xung đột từng trường (Field Conflict Resolution):** Cho phép người dùng tích chọn giữ lại giá trị của bên A hoặc bên B cho từng trường thông tin (Tên, MST, Website, SĐT, Địa chỉ, Ngành nghề...). | Modal `SideBySideComparisonModal.jsx` với giao diện trực quan, chuyên nghiệp. |
| **3** | **Gộp giữ lại toàn bộ người liên hệ, cơ hội và hoạt động của cả hai bản ghi** | • **Người liên hệ (Contacts):** Chuyển giao trọn vẹn 100% danh bạ từ cả 2 bản ghi, gắn kèm nhãn nguồn gốc `[Từ KH-001]` và `[Từ KH-002]`.<br>• **Cơ hội kinh doanh (Deals):** Không làm mất bất kỳ cơ hội nào, bảo toàn toàn bộ Deals và cộng dồn tổng giá trị Pipeline bán hàng.<br>• **Hoạt động (Activities Timeline):** Tích hợp toàn bộ cuộc gọi, buổi họp, email, báo giá vào dòng thời gian thống nhất (Unified Activity Feed).<br>• **Mô hình phối hợp:** Chỉ định 1 bạn làm Đầu mối chính (Primary Owner), bạn còn lại làm Đồng phụ trách (Co-Owner) để cùng hợp tác, tránh giẫm chân nhau. | Tab xem chi tiết `CustomerDetailModal.jsx` và biên bản sau gộp `MergeSuccessModal.jsx`. |
| **4** | **Chỉ Trưởng nhóm trở lên được thực hiện gộp (RBAC Enforcement)** | • **Role Switcher** linh hoạt trên thanh Header để kiểm thử:<br>• **👤 Chuyên viên kinh doanh (`SALES_REP`):** Được xem cảnh báo, xem so sánh nhưng **NÚT GỘP BỊ KHÓA HOÀN TOÀN (Disabled 🔒)**; cung cấp nút *"Gửi yêu cầu gộp cho Trưởng nhóm"*.<br>• **👑 Trưởng nhóm kinh doanh (`TEAM_LEAD`):** Toàn quyền phê duyệt, chọn trường và bấm xác nhận gộp.<br>• **🏢 Giám đốc kinh doanh (`SALES_DIRECTOR`):** Toàn quyền quản trị và truy vết nhật ký kiểm toán. | Cảnh báo từ chối thẩm quyền (HTTP 403 mô phỏng) và khóa giao diện đối với vai trò Sales Rep. |

---

## 2. Cấu Trúc Thư Mục Dự Án

```
S3-01-customer-deduplication/
├── index.html                           # HTML gốc, Google Fonts Plus Jakarta Sans & JetBrains Mono, Favicon
├── package.json                         # Cấu hình dự án React 19 + Vite + Lucide Icons
├── vite.config.js                       # Cấu hình Vite cổng 5177
├── run.bat                              # File chạy ứng dụng tự động 1-click
├── README.md                            # Tài liệu phân tích và hướng dẫn kiểm thử chi tiết
└── src/
    ├── main.jsx                         # Điểm khởi chạy React DOM
    ├── App.jsx                          # State trung tâm, điều phối luồng gộp & bộ lọc
    ├── index.css                        # CSS hoàn chỉnh phong cách Enterprise Dark/Light, Glassmorphism
    ├── data/
    │   └── mockCustomers.js             # Dữ liệu khách hàng mẫu phong phú (FPT, Viettel, Vinamilk...)
    ├── utils/
    │   └── duplicateDetector.js         # Thuật toán đa tiêu chí đối soát trùng lặp thời gian thực
    └── components/
        ├── Header.jsx                   # Thanh tiêu đề, Role Switcher, Ticket Badge, đổi Theme
        ├── DuplicateAlertBanner.jsx     # Banner cảnh báo xung đột 2 nhân viên cùng chào hàng
        ├── KpiSummaryCards.jsx          # 4 thẻ chỉ số thống kê & lọc nhanh trạng thái trùng
        ├── CustomerListView.jsx         # Bảng danh sách khách hàng, tìm kiếm & thao tác gộp
        ├── SideBySideComparisonModal.jsx# ★ LÕI SO SÁNH SONG SONG & CHỌN TRƯỜNG DỮ LIỆU
        ├── NewCustomerModal.jsx         # Form tạo khách hàng tích hợp Live Deduplication Scanner
        ├── CustomerDetailModal.jsx      # Xem chi tiết hồ sơ, danh bạ, cơ hội & nhật ký sau gộp
        ├── MergeSuccessModal.jsx        # Báo cáo tổng kết dữ liệu bảo toàn sau khi gộp thành công
        ├── MergeHistoryDrawer.jsx       # Nhật ký kiểm toán các giao dịch gộp khách hàng (Audit Trail)
        ├── RequestApprovalModal.jsx     # Form gửi yêu cầu gộp lên Trưởng nhóm (Dành cho Sales Rep)
        └── JiraGuideModal.jsx           # Bảng tra cứu trực quan đối chiếu 4 tiêu chí nghiệm thu Jira
```

---

## 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Chạy nhanh 1-Click bằng file `run.bat` (Khuyên dùng trên Windows)
Nhấp đúp chuột vào file:
```cmd
run.bat
```
Ứng dụng sẽ tự động mở trình duyệt tại: `http://localhost:5177`

### Cách 2: Chạy bằng dòng lệnh Terminal
```bash
cd subtask-frontend/S3-01-customer-deduplication
npm.cmd run dev
```

---

## 4. Kịch Bản Kiểm Thử Nghiệm Thu (Acceptance Testing Checklist)

### 🧪 Kịch bản 1: Kiểm tra Tiêu chí 1 (Phát hiện trùng lặp đa tiêu chí & Live Scanner)
1. Quan sát đầu trang: **Banner cảnh báo đỏ** thông báo có 3 cặp khách hàng trùng lặp đang bị hai nhân viên cùng chào hàng.
2. Kiểm tra dòng **Công ty Cổ phần Công nghệ Thông tin FPT (KH-001)** và **FPT Information System (KH-002)**:
   - Hệ thống hiển thị badge đỏ: `CRITICAL - Trùng với [KH-002] (98%)`.
   - Nêu rõ lý do: Trùng mã số thuế 100% (`0101248141`), trùng tên miền website (`fpt.com.vn`), tên tương đồng rất cao.
3. Bấm nút **"+ Thêm khách hàng mới"** ở góc phải:
   - Bấm nút *"⚡ Nhập nhanh dữ liệu mẫu để thử cảnh báo trùng (FPT)"*.
   - Quan sát: Khối cảnh báo màu đỏ lập tức xuất hiện ngay bên dưới ô nhập, chỉ rõ doanh nghiệp này đang bị trùng với hồ sơ của bạn Mai Linh đang phụ trách!

### 🧪 Kịch bản 2: Kiểm tra Tiêu chí 2 (Hiển thị so sánh cạnh nhau trước khi gộp)
1. Tại dòng khách hàng **KH-001**, bấm nút **"So sánh & Gộp"**.
2. Giao diện modal mở ra hiển thị song song 2 cột cạnh nhau:
   - Cột trái: Bản ghi chính (Master Record) - `KH-001`.
   - Cột phải: Bản ghi sáp nhập (Secondary Record) - `KH-002`.
3. Bấm thử nút **Hoán đổi vai trò (Swap ⇄)** ở giữa 2 cột: Vai trò Master và Secondary lập tức đổi chỗ cho nhau mượt mà.
4. Thử bấm vào từng dòng thông tin (Tên công ty, Website, Số điện thoại, Người phụ trách chính): Người dùng có toàn quyền chọn giữ lại giá trị của bên A hay bên B.

### 🧪 Kịch bản 3: Kiểm tra Tiêu chí 3 (Bảo toàn 100% Người liên hệ, Cơ hội và Hoạt động)
1. Nhìn xuống phần **"Xem trước dữ liệu bảo toàn"** trong modal so sánh:
   - **Người liên hệ:** Hiển thị đủ 4 người (2 người từ KH-001 + 2 người từ KH-002).
   - **Cơ hội bán hàng:** Giữ trọn 2 Deal, tổng giá trị Pipeline được cộng dồn: `450.000.000 đ + 280.000.000 đ = 730.000.000 đ`.
   - **Hoạt động chăm sóc:** Tổng hợp 6 hoạt động theo thứ tự thời gian mới nhất đến cũ nhất.
   - **Mô hình hợp tác:** Chỉ định bạn Nguyễn Hoàng Nam làm Đầu mối chính, bạn Trần Thị Mai Linh làm Đồng phụ trách (Co-Owner).

### 🧪 Kịch bản 4: Kiểm tra Tiêu chí 4 (Phân quyền Trưởng nhóm trở lên)
1. Trên thanh Header, tại mục **"Vai trò"**, chọn `Nguyễn Hoàng Nam (Chuyên viên Kinh doanh - SALES_REP)`.
2. Bấm nút **"So sánh & Gộp"** trên bảng:
   - Quan sát dưới chân modal: **NÚT "XÁC NHẬN GỘP" BỊ KHÓA HOÀN TOÀN (Disabled 🔒)** kèm thông báo: *"Chỉ Trưởng nhóm kinh doanh trở lên mới có quyền gộp khách hàng"*.
   - Nút **"Gửi yêu cầu gộp cho Trưởng nhóm"** xuất hiện $\rightarrow$ Bấm vào để thử gửi phiếu đề xuất.
3. Đổi vai trò lại thành `Trần Mạnh Hùng (Trưởng nhóm kinh doanh - TEAM_LEAD)`:
   - Nút **"Xác nhận gộp khách hàng"** lập tức kích hoạt màu xanh ngọc rực rỡ.
   - Bấm xác nhận $\rightarrow$ Màn hình thông báo thành công mở ra, bản ghi KH-002 được hợp nhất hoàn toàn vào KH-001!
   - Bấm nút **"Lịch sử gộp"** trên Header để xem lại nhật ký kiểm toán vừa sinh ra.
