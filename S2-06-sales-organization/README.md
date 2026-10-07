# Hệ Thống Khai Báo Cơ Cấu Tổ Chức Kinh Doanh & Phân Quyền Dữ Liệu (SCRUM-64)

> **Mã công việc:** SCRUM-17 / SCRUM-64  
> **Ngôn ngữ & Công nghệ:** React 19, Vite, Vanilla Modern CSS, Lucide Icons  
> **Trạng thái:** Hoàn thành 100% các tiêu chí nghiệm thu (Acceptance Criteria)

---

## 1. Phân Tích Đề Bài & Yêu Cầu Nghiệp Vụ (User Story)

### User Story:
> *"Là Giám đốc kinh doanh, tôi muốn khai báo cơ cấu tổ chức kinh doanh, để phạm vi dữ liệu của trưởng nhóm bám đúng cây tổ chức thật."*

### 4 Tiêu Chí Nghiệm Thu (Acceptance Criteria) Từ Đề Bài:

| STT | Yêu cầu trong mô tả (Description) | Giải pháp kỹ thuật trong ứng dụng React |
| :---: | :--- | :--- |
| **1** | **Nhóm kinh doanh có cấu trúc cây, mỗi nhóm có một trưởng nhóm** | • Cây tổ chức phân cấp đa tầng: Cấp 0 (Ban Giám Đốc) $\rightarrow$ Cấp 1 (Khối Vùng/Miền) $\rightarrow$ Cấp 2 (Chi Nhánh) $\rightarrow$ Cấp 3 (Nhóm Chuyên Trách).<br>• Giao diện sơ đồ cây trực quan với đường nối phân nhánh, trạng thái mở rộng/thu gọn (Expand/Collapse).<br>• **Mỗi nhóm có đúng MỘT trưởng nhóm (Leader ⭐):** Hiển thị rõ danh tính, email, điện thoại, chức vụ; form tạo/sửa nhóm bắt buộc chỉ định 1 trưởng nhóm duy nhất. |
| **2** | **Mỗi nhân viên thuộc đúng một nhóm tại một thời điểm** | • Thuộc tính `teamId` của nhân viên là duy nhất. Không bao giờ tồn tại trường hợp một nhân sự thuộc 2 nhóm đồng thời.<br>• **Quy trình điều chuyển nhân sự (Transfer Modal):** Khi chuyển nhân viên từ Nhóm A sang Nhóm B, hệ thống tự động gỡ khỏi nhóm cũ, gia nhập nhóm mới và lưu vết vào **Lịch sử điều chuyển (Audit Log)**. |
| **3** | **Cây tổ chức này quyết định phạm vi dữ liệu mà Trưởng nhóm nhìn thấy** | • **Giải thuật duyệt cây con đệ quy (Recursive Subtree Discovery):**<br>&nbsp;&nbsp;- *Giám đốc kinh doanh (Root Leader):* Xem 100% dữ liệu toàn quốc.<br>&nbsp;&nbsp;- *Lãnh đạo Khối Vùng (Regional Head):* Chỉ nhìn thấy toàn bộ dữ liệu nhánh con thuộc vùng mình phụ trách. Khóa hoàn toàn dữ liệu của Vùng khác.<br>&nbsp;&nbsp;- *Trưởng nhóm cơ sở (Team Leader):* Chỉ nhìn thấy dữ liệu của nhóm mình.<br>&nbsp;&nbsp;- *Nhân viên kinh doanh thường:* Chỉ nhìn thấy dữ liệu cá nhân mình tạo (My Data Only).<br>• **Trình mô phỏng phạm vi dữ liệu (Data Scope Simulator):** Cho phép đổi vai trò người dùng trong 1 click để kiểm chứng bảng Cơ hội & Khách hàng tự động lọc tương ứng. |
| **4** | **Khai báo khu vực địa lý và gán khu vực cho nhóm** | • Quản lý danh mục Khu vực địa lý (Mã khu vực, Tên khu vực, Vùng miền, Danh sách các tỉnh/thành trực thuộc, Tiềm năng thị trường).<br>• **Gán khu vực cho nhóm kinh doanh:** Phân bổ một hoặc nhiều khu vực cho từng nhóm kinh doanh; kiểm soát độ phủ địa bàn, cảnh báo khu vực chưa có nhóm phụ trách. |

---

## 2. Cấu Trúc Thư Mục Dự Án

```
scrum-64-sales-organization/
├── index.html                               # HTML chuẩn SEO, font Plus Jakarta Sans & JetBrains Mono
├── package.json                             # Cấu hình dự án React 19 + Vite
├── run.bat                                  # File khởi chạy ứng dụng 1-click trên Windows
├── vite.config.js                           # Cấu hình máy chủ Vite port 5175
├── src/
│   ├── main.jsx                             # Điểm gắn kết React DOM
│   ├── App.jsx                              # Quản lý state toàn cục, tab điều hướng, tính toán phạm vi dữ liệu
│   ├── index.css                            # Thiết kế Modern CSS (Dark/Light mode, Glassmorphism, Tree Connectors)
│   ├── data/
│   │   └── mockData.js                      # Dữ liệu mẫu chuẩn: Cây 13 nhóm, 23 nhân sự, 10 khu vực, 13 cơ hội bán hàng
│   ├── utils/
│   │   └── orgUtils.js                      # Thuật toán duyệt cây con, tính toán quyền xem, format VNĐ, kiểm tra đơn nhóm
│   └── components/
│       ├── Header.jsx                       # Thanh tiêu đề, Bộ chuyển vai trò (User Impersonation), Đổi theme Sáng/Tối
│       ├── StatsOverview.jsx                # Thẻ KPI (Tổng nhóm, Trưởng nhóm 100%, Quy chuẩn nhân sự, Độ phủ địa bàn)
│       ├── OrgTreeView.jsx                  # Sơ đồ cây phân cấp tương tác (Tiêu chí 1: Đúng 1 trưởng nhóm/nhóm)
│       ├── TeamModal.jsx                    # Modal thêm/sửa nhóm kinh doanh & chỉ định Trưởng nhóm
│       ├── EmployeeManagement.jsx           # Quản lý nhân sự, bộ lọc phòng ban, tab Lịch sử điều chuyển (Tiêu chí 2)
│       ├── EmployeeModal.jsx                # Modal thêm mới nhân sự (Bắt buộc chọn đúng 1 nhóm trực thuộc)
│       ├── TransferModal.jsx                # Modal điều chuyển nhân sự giữa các nhóm với cam kết đơn nhóm
│       ├── TerritoryManagement.jsx          # Danh mục khu vực địa lý & bảng phân công nhóm phụ trách (Tiêu chí 4)
│       ├── TerritoryModal.jsx               # Modal khai báo / sửa thông tin khu vực địa lý
│       ├── AssignTerritoryModal.jsx         # Modal phân bổ nhóm kinh doanh phụ trách địa bàn
│       ├── DataScopeSimulator.jsx           # Mô phỏng phạm vi dữ liệu theo cây tổ chức (Tiêu chí cốt lõi 3)
│       ├── HierarchyAnalytics.jsx           # Báo cáo cơ cấu tổ chức, chỉ tiêu doanh số theo nhánh cây
│       └── ScrumGuideModal.jsx              # Modal hướng dẫn nghiệm thu 4 tiêu chí SCRUM-64
```

---

## 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Khởi chạy 1-Click trên Windows
1. Mở thư mục: `subtask-frontend/scrum-64-sales-organization/`
2. Nhấp đúp chuột vào file **`run.bat`**
3. Trình duyệt sẽ tự động mở ứng dụng tại: `http://localhost:5175`

### Cách 2: Khởi chạy bằng dòng lệnh Terminal
```bash
# Di chuyển vào thư mục dự án
cd "c:/Users/FPT SHOP/.gemini/antigravity-ide/scratch/subtask-frontend/scrum-64-sales-organization"

# Cài đặt thư viện (nếu chưa cài)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

---

## 4. Kịch Bản Kiểm Thử Nhanh 4 Tiêu Chí Nghiệm Thu (Demo Walkthrough)

### Kịch bản 1: Kiểm tra Cấu trúc cây & Đúng 1 Trưởng nhóm (Tiêu chí 1)
1. Bấm vào tab **"1. Sơ Đồ Cây Tổ Chức"**.
2. Quan sát cây tổ chức từ Cấp 0 (Ban Giám Đốc) $\rightarrow$ Cấp 1 (Khối Miền Bắc, Miền Trung, Miền Nam) $\rightarrow$ Cấp 2 (Chi Nhánh) $\rightarrow$ Cấp 3 (Nhóm Bán Hàng).
3. Tại mỗi thẻ nhóm:
   - Thấy thẻ **Trưởng Nhóm Chính Thức (Duy nhất)** với biểu tượng vương miện ⭐ `Crown`.
   - Bấm nút **"Thêm nhóm con"** hoặc **"Sửa"**: Form bắt buộc chọn đúng 1 nhân viên làm Trưởng nhóm.

### Kịch bản 2: Kiểm tra Mỗi nhân viên thuộc đúng một nhóm (Tiêu chí 2)
1. Bấm vào tab **"2. Quản Lý Nhân Sự & Đơn Nhóm"**.
2. Tìm nhân viên **"Hoàng Minh Tuấn"** (đang thuộc *Nhóm SME & Khách Hàng Tăng Trưởng HN*).
3. Bấm nút **"Điều chuyển"**:
   - Modal hiển thị rõ Nhóm hiện tại (rời khỏi) và cho phép chọn Nhóm đích mới.
   - Chọn nhóm đích mới (ví dụ: *Nhóm Doanh Nghiệp Lớn Enterprise HN*).
   - Bấm **"Xác Nhận Điều Chuyển"**.
4. **Kết quả:** Nhân viên Tuấn lập tức chuyển sang nhóm mới và hoàn toàn không còn ở nhóm cũ. Bấm sub-tab **"Lịch Sử Điều Chuyển"** để xem nhật ký lưu vết thời gian thực.

### Kịch bản 3: Kiểm tra Cây tổ chức quyết định phạm vi dữ liệu (Tiêu chí cốt lõi 3)
1. Bấm vào tab **"4. Mô Phỏng Phạm Vi Dữ Liệu"**.
2. Thử nghiệm 4 góc nhìn:
   - **Góc nhìn 1 - Giám Đốc Kinh Doanh Toàn Quốc (Nguyễn Văn An):**
     - Phạm vi: Thấy toàn bộ **13/13 cơ hội** của toàn quốc (Tổng: ~15,8 Tỷ ₫, tỷ lệ: 100%).
   - **Góc nhìn 2 - Giám Đốc Khối Miền Bắc (Trần Thị Bình):**
     - Bấm nút nhanh *"Trần Thị Bình"*:
     - **Kết quả:** Bảng cơ hội tự động lọc chỉ còn **6 cơ hội** thuộc nhánh Miền Bắc (Hà Nội, Hải Phòng). Toàn bộ cơ hội của Miền Trung (Đà Nẵng) và Miền Nam (TP.HCM, Cần Thơ) hoàn toàn bị ẩn!
   - **Góc nhìn 3 - Trưởng Nhóm SME Hà Nội (Đỗ Thu Hằng):**
     - Bấm nút nhanh *"Đỗ Thu Hằng"*:
     - **Kết quả:** Chỉ còn **2 cơ hội** của các thành viên trong nhóm SME Hà Nội.
   - **Góc nhìn 4 - Chuyên Viên Kinh Doanh (Hoàng Minh Tuấn):**
     - Bấm nút nhanh *"Hoàng Minh Tuấn"*:
     - **Kết quả:** Chỉ hiển thị đúng **1 cơ hội** do chính Tuấn phụ trách (My Data Only).

### Kịch bản 4: Kiểm tra Khai báo & Gán khu vực địa lý cho nhóm (Tiêu chí 4)
1. Bấm vào tab **"3. Khai Báo Khu Vực Địa Lý"**.
2. Xem danh sách 10 khu vực địa lý đã khai báo (Toàn quốc, Hà Nội, Hải Phòng - Quảng Ninh, Đà Nẵng, TP.HCM,...).
3. Bấm **"Khai Báo Khu Vực Mới"** để tạo một địa bàn mới (ví dụ: *Vùng Duyên Hải Nam Trung Bộ*).
4. Tìm khu vực *"Thị Trường Khai Phá & Hải Đảo Mới (Chưa Gán Nhóm)"*:
   - Đang có cảnh báo đỏ `⚠️ Chưa gán nhóm phụ trách`.
   - Bấm nút **"Gán Nhóm"**, tick chọn *Chi Nhánh Cần Thơ & Miền Tây*, bấm **"Lưu Phân Bổ Nhóm"**.
   - Cảnh báo biến mất và nhóm được gán thành công!
