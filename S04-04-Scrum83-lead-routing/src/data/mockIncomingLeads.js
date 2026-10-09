/**
 * Danh sách Khách hàng Tiềm năng (Incoming Leads)
 * Được thiết kế để kiểm nghiệm cơ chế phân bổ tự động,
 * thứ tự ưu tiên First-Match-Wins và Hàng chờ chia tay (Unassigned Queue).
 */

export const initialMockLeads = [
  {
    id: "LD-301",
    code: "LEAD-301",
    fullName: "Phạm Văn Bình",
    companyName: "Công ty Cổ phần Công nghệ FPT",
    phone: "0912345678",
    email: "binh.pv@fpt.com.vn",
    region: "NORTH",                // Miền Bắc
    industry: "IT_TELECOM",         // CNTT -> Khớp RULE 1 (Thắng vì ưu tiên cao hơn Rule 2 Miền Bắc!)
    source: "Google Ads Enterprise",
    intakeTime: "2026-10-09 08:30:15",
    status: "UNPROCESSED"
  },
  {
    id: "LD-302",
    code: "LEAD-302",
    fullName: "Nguyễn Thị Thu Hà",
    companyName: "Ngân hàng TMCP Quân Đội (MBBank)",
    phone: "0988112233",
    email: "ha.ntt@mbbank.com.vn",
    region: "NORTH",
    industry: "FINANCE_BANKING",    // Tài chính -> Khớp RULE 1 (First match wins)
    source: "Hội thảo Chuyển Đổi Số",
    intakeTime: "2026-10-09 08:35:00",
    status: "UNPROCESSED"
  },
  {
    id: "LD-303",
    code: "LEAD-303",
    fullName: "Trần Văn Toàn",
    companyName: "Nhà Máy Dệt May Đông Á (Hải Phòng)",
    phone: "0904556677",
    email: "toan.tv@donga-textile.vn",
    region: "NORTH",                // Miền Bắc
    industry: "MANUFACTURING",      // Sản xuất -> Không khớp Rule 1, khớp RULE 2 (Miền Bắc)
    source: "Hotline Tiếp Nhận",
    intakeTime: "2026-10-09 08:40:20",
    status: "UNPROCESSED"
  },
  {
    id: "LD-304",
    code: "LEAD-304",
    fullName: "Lê Thị Mai",
    companyName: "Tập đoàn Thủy Sản Nam Bộ (Cần Thơ)",
    phone: "0939112233",
    email: "mai.lt@nambo-seafood.vn",
    region: "SOUTH",                // Miền Nam
    industry: "MANUFACTURING",      // Sản xuất -> Không khớp Rule 1, khớp RULE 3 (Miền Nam)
    source: "Triển Lãm Nông Nghiệp",
    intakeTime: "2026-10-09 08:45:10",
    status: "UNPROCESSED"
  },
  {
    id: "LD-305",
    code: "LEAD-305",
    fullName: "Võ Minh Trí",
    companyName: "Chuỗi Cửa Hàng Thời Trang Bích Ngọc",
    phone: "0977889900",
    email: "tri.vm@bichngoc-fashion.vn",
    region: "CENTRAL",              // Miền Trung -> Không khớp Rule 2 & 3
    industry: "RETAIL_ECOMMERCE",   // Bán lẻ -> Khớp RULE 4 (Round-Robin)
    source: "Facebook Lead Ads",
    intakeTime: "2026-10-09 08:50:00",
    status: "UNPROCESSED"
  },
  {
    id: "LD-306",
    code: "LEAD-306",
    fullName: "Hoàng Gia Bảo",
    companyName: "Tổ Hợp Năng Lượng Tái Tạo Miền Trung",
    phone: "0918776655",
    email: "bao.hg@mientrung-energy.vn",
    region: "CENTRAL",              // Miền Trung
    industry: "ENERGY_SOLAR",       // Ngành Năng lượng mới -> KHÔNG KHỚP BẤT KỲ QUY TẮC NÀO! (Rơi vào hàng chờ chia tay)
    source: "Website Form Vãng Lai",
    intakeTime: "2026-10-09 08:55:00",
    status: "UNPROCESSED"
  },
  {
    id: "LD-307",
    code: "LEAD-307",
    fullName: "David Johnson",
    companyName: "Global Logistics Singapore Pte",
    phone: "+65 9123 4567",
    email: "david@globallogistics.sg",
    region: "INTERNATIONAL",        // Quốc tế
    industry: "SHIPPING_CARGO",     // Vận tải biển quốc tế -> KHÔNG KHỚP QUY TẮC NÀO! (Rơi vào hàng chờ chia tay)
    source: "LinkedIn InMail",
    intakeTime: "2026-10-09 09:00:00",
    status: "UNPROCESSED"
  }
];
