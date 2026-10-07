# Hệ Thống Nhập Danh Sách Khách Hàng Hàng Loạt Từ Excel (SCRUM-193 / SCRUM-74)

> **Mã công việc:** `SCRUM-18 / SCRUM-74` (Subtask: `SCRUM-193 frontend`)  
> **Ngôn ngữ & Nền tảng:** `React 19`, `Vite`, `SheetJS (xlsx)`, `Vanilla Modern CSS`, `Lucide Icons`  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Nhân viên kinh doanh, tôi muốn nhập danh sách khách hàng hàng loạt từ Excel, để đưa danh mục khách đang có vào hệ thống mà không gõ lại."*

### Bảng Đối Chiếu 2 Tiêu Chí Nghiệm Thu (Acceptance Criteria):

| STT | Tiêu chí trong Jira Ticket | Giải pháp kỹ thuật trong ứng dụng React | Minh chứng kiểm thử |
| :---: | :--- | :--- | :--- |
| **1** | **Tải được tệp mẫu, xem trước và báo lỗi theo từng dòng** | • **Tải tệp mẫu chuẩn:** Nút *"Tải Tệp Mẫu Excel (.xlsx)"* và *"Tải Mẫu CSV"* tự động xuất file Excel thật có sẵn 2 Sheet: Sheet 1 chứa dữ liệu mẫu với các cột chuẩn hóa (`Mã KH`, `Tên công ty (*)`, `MST`, `Email`, `SĐT`, `Địa chỉ`, `Tỉnh/Thành`, `Ngành nghề`, `Đầu mối`, `Phụ trách`), Sheet 2 hướng dẫn chi tiết quy tắc nhập liệu.<br>• **Bảng Xem Trước (Preview Table):** Đánh số dòng đúng chuẩn Excel (`# Dòng 2`, `# Dòng 3`...), hỗ trợ tìm kiếm, phân loại và phân trang.<br>• **Báo lỗi theo từng dòng (Row Error Highlighting):** Đánh dấu màu đỏ nổi bật các dòng vi phạm dữ liệu (thiếu tên công ty bắt buộc, sai định dạng email, SĐT không đủ 10 số, MST không đúng quy cách). Ô bị lỗi có viền đỏ, icon cảnh báo và tooltip giải thích chi tiết.<br>• **Sửa trực tiếp (Inline Quick Edit):** Cho phép người dùng click trực tiếp vào ô bị lỗi để gõ sửa ngay trên giao diện web; khi sửa đúng, dòng tự động đổi sang màu xanh Hợp Lệ mà không cần tải lại file! | Nút tải tệp mẫu hoạt động thực tế; Bảng preview với các dòng đỏ, ô đỏ và tính năng gõ sửa tức thì. |
| **2** | **Bản ghi trùng được đánh dấu rõ trong bản xem trước để chọn bỏ qua hoặc cập nhật** | • **Đánh dấu rõ bản ghi trùng lặp:** Huy hiệu màu vàng cam `⚠️ TRÙNG LẶP` nổi bật trên từng dòng, chỉ rõ nguyên nhân trùng: Trùng MST với FPT Corporation (`0101248141`), trùng MST với Viettel (`0100109106`), trùng Email với Vinamilk, hoặc trùng lặp nội bộ trong file.<br>• **Bộ chọn hành động linh hoạt:** Trên từng dòng trùng cung cấp 2 nút lựa chọn rõ ràng: **`Bỏ qua (Skip)`** (không thêm vào CRM) hoặc **`Cập nhật (Update)`** (ghi đè thông tin mới từ Excel vào hồ sơ khách hàng hiện có).<br>• **Thao tác hàng loạt (Bulk Actions):** Cung cấp 2 nút 1-click *"Bỏ qua tất cả"* và *"Cập nhật tất cả"* giúp tiết kiệm thời gian khi nhập danh sách lớn.<br>• **Cửa sổ so sánh cạnh nhau (Dual-pane Modal):** Nút *"So sánh"* mở modal so sánh chi tiết giữa dữ liệu trong file Excel và dữ liệu hiện có trong CRM.<br>• **Tiến trình nhập & Báo cáo kết quả:** Nút *"Tiến hành nhập dữ liệu"* cập nhật CSDL CRM, hiển thị màn hình tổng kết nghiệm thu và cho phép xem ngay danh mục khách hàng sau khi nhập. | Badge vàng cam `TRÙNG LẶP`, thanh công cụ thao tác hàng loạt, modal so sánh song song và modal tổng kết nhập. |

---

## 2. Cấu Trúc Thư Mục Dự Án

```
S3-03-customer-import/
├── index.html                               # HTML gốc chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                             # Cấu hình React 19, Vite, SheetJS (xlsx), Lucide Icons
├── vite.config.js                           # Cấu hình Vite máy chủ tại cổng 5179
├── run.bat                                  # File khởi chạy ứng dụng tự động 1-click trên Windows
├── README.md                                # Tài liệu phân tích và hướng dẫn kiểm thử chi tiết
└── src/
    ├── main.jsx                             # Điểm gắn kết React DOM 19
    ├── App.jsx                              # State trung tâm, điều phối đọc file, sửa lỗi & import
    ├── index.css                            # CSS Enterprise Theme (Dark/Light mode, Emerald Excel, Table styling)
    ├── data/
    │   ├── mockExistingCustomers.js         # CSDL 8 khách hàng lớn trong hệ thống (FPT, Viettel, Vingroup...)
    │   └── mockPresetFiles.js               # 3 bộ tệp mẫu thử nghiệm 1-click (Trùng lặp, Có lỗi, Chuẩn 100%)
    ├── utils/
    │   ├── excelParser.js                   # Lõi phân tích file Excel/CSV, map cột, validate lỗi & phát hiện trùng
    │   └── templateDownloader.js            # Xuất và tải tệp mẫu Excel (.xlsx 2 sheets) & CSV chuẩn UTF-8
    └── components/
        ├── Header.jsx                       # Thanh tiêu đề, Ticket Badge SCRUM-193, Role Switcher, Tải mẫu
        ├── KpiSummaryCards.jsx              # 4 thẻ KPI thống kê số dòng (Tổng, Hợp lệ, Trùng lặp, Có lỗi)
        ├── FileUploadZone.jsx               # Kéo thả file, chọn tệp từ máy & 3 kịch bản mẫu 1-click
        ├── PreviewTable.jsx                 # ★ BẢNG XEM TRƯỚC, BÁO LỖI TỪNG DÒNG, SỬA INLINE & XỬ LÝ TRÙNG
        ├── DuplicateCompareModal.jsx        # ★ MODAL SO SÁNH SONG SONG DÒNG EXCEL VS KHÁCH HÀNG CRM
        ├── ImportSummaryModal.jsx           # Báo cáo tổng kết số lượng thêm mới, cập nhật, bỏ qua & tải log
        ├── CustomerSystemView.jsx           # Danh mục khách hàng CRM sau khi nhập (gắn nhãn Mới/Cập nhật)
        ├── JiraGuideModal.jsx               # Bảng tra cứu trực quan đối chiếu 2 tiêu chí nghiệm thu Jira
        └── Toast.jsx                        # Thông báo phản hồi thời gian thực
```

---

## 3. Hướng Dẫn Cài Đặt & Khởi Chạy Ứng Dụng

### Cách 1: Chạy nhanh 1-Click bằng file `run.bat` (Khuyên dùng trên Windows)
Nhấp đúp chuột vào file:
```cmd
run.bat
```
Ứng dụng sẽ tự động mở trên trình duyệt tại địa chỉ: `http://localhost:5179`

### Cách 2: Chạy bằng dòng lệnh Terminal
```bash
cd subtask-frontend/S3-03-customer-import
npm.cmd run dev -- --open
```

---

## 4. Kịch Bản Kiểm Thử Nghiệm Thu (Acceptance Testing Checklist)

### 🧪 Kịch bản 1: Kiểm tra Tải tệp mẫu Excel & CSV (Tiêu chí 1)
1. Trên thanh Header hoặc trong khối Tải Lên Tệp, bấm nút **"Tải Mẫu Excel (.xlsx)"**:
   - Trình duyệt tự động tải về file: `Mau_Nhap_Khach_Hang_CRM_Enterprise.xlsx`.
   - Mở file trong Microsoft Excel: File có 2 sheet rõ ràng (`Danh_Sach_Khach_Hang` và `Huong_Dan_Nhap_Lieu`).
2. Bấm thử nút **"Tải Mẫu CSV"**: Tải về file `.csv` chuẩn mã hóa UTF-8 BOM, mở bằng Excel không bao giờ bị lỗi font tiếng Việt.

### 🧪 Kịch bản 2: Kiểm tra Tiêu chí 2 (Đánh dấu bản ghi trùng & Chọn Bỏ qua / Cập nhật)
1. Trong mục *"Kịch Bản Kiểm Thử Nhanh 1-Click"*, bấm vào **"Kịch bản 1: Có bản ghi trùng"**:
2. Quan sát bảng xem trước:
   - Các dòng **#3 (FPT IS)**, **#5 (Viettel Telecom)**, **#7 (Nhà máy Sữa Vinamilk)** và **#9** được gắn màu vàng cam nổi bật kèm huy hiệu: `⚠️ TRÙNG LẶP`.
   - Nêu rõ lý do trùng: *Trùng Mã số thuế (0101248141) với [KH-001] Công ty Cổ phần FPT*, *Trùng Email...*
3. Tại dòng **#3 (FPT IS)**, bấm nút **"So sánh"**:
   - Modal so sánh cạnh nhau 2 cột mở ra: Cột trái (Excel) vs Cột phải (Hệ thống CRM).
   - Thử chọn đổi giữa **"Bỏ qua (Skip)"** và **"Cập nhật (Update)"**.
4. Thử tính năng **Thao tác hàng loạt**:
   - Bấm nút **"Bỏ Qua Tất Cả"** trên thanh cảnh báo màu vàng: Toàn bộ 4 bản ghi trùng chuyển sang trạng thái `Bỏ qua`.
   - Bấm nút **"Cập Nhật Tất Cả"**: Toàn bộ chuyển sang trạng thái `Cập nhật`.

### 🧪 Kịch bản 3: Kiểm tra Tiêu chí 1 (Báo lỗi theo từng dòng & Sửa lỗi trực tiếp Inline)
1. Bấm vào kịch bản **"Kịch bản 2: Báo lỗi từng dòng"**:
2. Quan sát bảng xem trước:
   - Các dòng lỗi được tô nền đỏ cam nhẹ kèm huy hiệu màu đỏ: `🔴 Lỗi Dữ Liệu`.
   - Dòng **#2**: Ô Tên công ty có viền đỏ báo `[Tên công ty là thông tin bắt buộc, không được để trống]`.
   - Dòng **#3**: Ô Email có viền đỏ báo `[Email không đúng định dạng chuẩn]`.
   - Dòng **#4**: Ô SĐT báo `[Số điện thoại không hợp lệ (yêu cầu từ 9 đến 11 chữ số)]`.
   - Dòng **#5**: Ô MST báo `[Mã số thuế không hợp lệ]`.
3. **Thử nghiệm tính năng Sửa trực tiếp (Inline Quick Edit):**
   - Click vào ô Tên công ty bị trống của dòng #2.
   - Gõ tên công ty: `Công ty Cổ phần Thương mại Hoàng Kim` và nhấn Enter (hoặc bấm dấu check ✔).
   - **Kết quả:** Dòng #2 lập tức tự động đổi từ `🔴 Lỗi Dữ Liệu` sang `🟢 Hợp Lệ`!

### 🧪 Kịch bản 4: Kiểm tra Tiến hành nhập dữ liệu vào CRM & Màn hình nghiệm thu
1. Sau khi chọn tệp hợp lệ hoặc kịch bản mẫu, bấm nút xanh: **"Tiến Hành Nhập Dữ Liệu (... khách hàng)"**.
2. Màn hình **Báo Cáo Nghiệm Thu** mở ra:
   - Hiển thị rõ số lượng: Khách hàng thêm mới thành công, số lượng cập nhật từ bản ghi trùng, số lượng bỏ qua, số lượng loại trừ.
   - Bấm nút **"Tải Biên Bản Nhật Ký (.txt)"** để lưu lại lịch sử import.
3. Bấm **"Xem Danh Mục Khách Hàng CRM"**:
   - Chuyển sang màn hình quản lý khách hàng của hệ thống.
   - Các khách hàng mới xuất hiện với huy hiệu xanh: `[MỚI TỪ EXCEL]`.
   - Các khách hàng cũ được cập nhật mang huy hiệu xanh dương: `[VỪA CẬP NHẬT]`.

### 🧪 Kịch bản 5: Kiểm tra Kéo thả hoặc Tải file Excel thật từ máy tính
1. Người dùng có thể kéo thả bất kỳ file `.xlsx`, `.xls` hoặc `.csv` vào vùng Dropzone.
2. Hệ thống sử dụng thư viện **SheetJS (xlsx)** đọc tức thời dữ liệu, tự động nhận diện tên cột tiếng Việt/tiếng Anh và hiển thị lên bảng xem trước.
