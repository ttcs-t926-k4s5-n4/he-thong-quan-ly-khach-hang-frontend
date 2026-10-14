# Hệ Thống Cấu Hình Quy Tắc Phân Bổ Lead Tự Động (Lead Routing Engine)

Dự án React đáp ứng trọn vẹn yêu cầu bài toán quản lý & phân bổ Lead cho **Giám đốc kinh doanh**:
> **"Là Giám đốc kinh doanh, tôi muốn cấu hình quy tắc phân bổ lead tự động, để lead tới tay người phụ trách trong vài phút thay vì chờ họp giao ban."**

---

## 🎯 4 Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### 1. Phân bổ linh hoạt: Theo khu vực, ngành nghề hoặc xoay vòng Round-Robin
- **Theo ngành nghề (Industry-based)**: Tự động lọc các Lead thuộc ngành đặc thù (VD: *Công nghệ / Phần mềm, Tài chính - Ngân hàng*) chuyển thẳng đến **Đội Enterprise / Chuyên viên giải pháp cao cấp**.
- **Theo khu vực địa lý (Region-based)**: Lọc Lead tại Miền Bắc (Hà Nội, Hải Phòng,...) gán cho **Team Sales Miền Bắc**, Lead Miền Nam (TP.HCM, Cần Thơ,...) gán cho **Team Sales Miền Nam**.
- **Xoay vòng đều trong nhóm (Round-Robin)**: Phân bổ xoay tua tuần tự giữa các Sales Reps trong nhóm, đảm bảo công bằng khối lượng công việc, không để dồn lead cho một người.

### 2. Thứ tự ưu tiên & Nguyên tắc First-Match-Wins
- Các quy tắc được sắp xếp theo mức độ ưu tiên từ trên xuống dưới (#1, #2, #3, #4,...).
- Giám đốc kinh doanh có thể **Đẩy lên (Move Up)** hoặc **Hạ xuống (Move Down)** mức độ ưu tiên chỉ bằng 1 cú nhấp chuột.
- Khi lead mới đổ về, thuật toán quét từ quy tắc cao nhất xuống. **Quy tắc đầu tiên thỏa mãn điều kiện sẽ thắng và thực hiện phân bổ ngay**, dừng duyệt các quy tắc phía sau.

### 3. Hàng chờ phân tay cho Trưởng nhóm (Fallback Queue)
- Bất kỳ Lead nào không khớp với mọi quy tắc kích hoạt sẽ tự động rơi vào **Hàng chờ trưởng nhóm phân tay (Unassigned Fallback Queue)**.
- Giao diện cung cấp nút **"Phân Bổ Thủ Công"** mở Modal cho phép Trưởng nhóm chỉ định nhân sự phụ trách và thêm ghi chú phân công.

### 4. Xử lý nền & Cam kết SLA trong vòng 5 phút
- Hệ thống chạy cơ chế Background Routing Engine tự động phân phối chỉ trong vài giây khi lead vào.
- Hiển thị đồng hồ đếm ngược SLA 5 phút, nhãn trạng thái đạt chuẩn SLA.
- Thay thế hoàn toàn quy trình họp giao ban đầu tuần/đầu ngày chậm trễ, giảm thời gian tiếp cận khách từ hàng chục giờ xuống dưới 5 phút.

---

## 🛠️ Công Nghệ Sử Dụng
- **React 19** + **Vite** (Build cực nhanh, nhẹ và tối ưu)
- **Lucide React Icons** (Bộ icon hiện đại, chuyên nghiệp)
- **Modern Responsive CSS** (Design system hiện đại, hỗ trợ Dark / Light mode, Glassmorphism, Micro-animations)
- **Hỗ trợ 1-Click Interactive Test Runner** trong giao diện để kiểm thử nhanh cả 4 tiêu chí.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu môi trường
- Node.js >= 18.0

### Cách chạy nhanh
```bash
# Di chuyển vào thư mục dự án
cd lead-routing

# Cài đặt thư viện (nếu chưa có node_modules)
npm install

# Khởi chạy dev server trên cổng 5184
npm run dev
```

Mở trình duyệt truy cập: **`http://localhost:5184/`**
