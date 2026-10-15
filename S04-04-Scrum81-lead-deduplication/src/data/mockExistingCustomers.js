/**
 * Dữ liệu Khách Hàng Đã Có Trong Hệ Thống CRM (Existing Official Customers)
 * Dùng để đối soát và kích hoạt tiêu chí 2:
 * "Lead trùng với khách hàng đã có được gợi ý gắn thẳng vào khách hàng đó"
 */

export const mockExistingCustomers = [
  {
    id: "KH-001",
    code: "CUST-FPT",
    name: "Công ty Cổ phần FPT (FPT Corporation)",
    shortName: "FPT Telecom / FPT Corp",
    taxCode: "0101248141",
    primaryPhone: "02473007300",
    primaryEmail: "contact@fpt.com.vn",
    domain: "fpt.com.vn",
    address: "Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội",
    industry: "Công nghệ thông tin & Viễn thông",
    accountTier: "VIP Enterprise",
    assignedSales: {
      id: "SALES-01",
      name: "Lê Hải Đăng",
      email: "dang.lh@crmcorp.vn",
      phone: "0903112233",
      role: "Key Account Manager"
    },
    totalContractValue: 2450000000, // 2.45 tỷ
    activeContractsCount: 3,
    status: "ACTIVE_CUSTOMER",
    contacts: [
      { id: "CTC-01", name: "Trương Gia Bình", role: "Chủ tịch HĐQT", email: "binh.tg@fpt.com.vn", phone: "0903456789" },
      { id: "CTC-02", name: "Nguyễn Văn Khoa", role: "Tổng Giám Đốc", email: "khoa.nv@fpt.com.vn", phone: "0912888999" }
    ],
    lastInteraction: "2026-10-08 15:30:00",
    notes: "Khách hàng chiến lược cấp tập đoàn. Đang triển khai giai đoạn 2 giải pháp Cloud & Security."
  },
  {
    id: "KH-002",
    code: "CUST-VIETTEL",
    name: "Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)",
    shortName: "Viettel Group",
    taxCode: "0100109106",
    primaryPhone: "02462556789",
    primaryEmail: "info@viettel.com.vn",
    domain: "viettel.com.vn",
    address: "Số 1 Trần Hữu Dực, Mỹ Đình 2, Nam Từ Liêm, Hà Nội",
    industry: "Viễn thông & Quốc phòng",
    accountTier: "VIP Enterprise",
    assignedSales: {
      id: "SALES-02",
      name: "Phạm Quốc Toàn",
      email: "toan.pq@crmcorp.vn",
      phone: "0904223344",
      role: "Senior Enterprise Sales"
    },
    totalContractValue: 4800000000, // 4.8 tỷ
    activeContractsCount: 5,
    status: "ACTIVE_CUSTOMER",
    contacts: [
      { id: "CTC-03", name: "Tào Đức Thắng", role: "Chủ tịch kiêm TGĐ", email: "thang.td@viettel.com.vn", phone: "0988776655" },
      { id: "CTC-04", name: "Đỗ Minh Phương", role: "Phó Tổng Giám Đốc", email: "phuong.dm@viettel.com.vn", phone: "0983112233" }
    ],
    lastInteraction: "2026-10-07 10:15:00",
    notes: "Đang vận hành hệ thống hạ tầng dữ liệu và thanh toán số."
  },
  {
    id: "KH-003",
    code: "CUST-VNM",
    name: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)",
    shortName: "Vinamilk",
    taxCode: "0300588569",
    primaryPhone: "02854155555",
    primaryEmail: "vinamilk@vinamilk.com.vn",
    domain: "vinamilk.com.vn",
    address: "10 Tân Trào, Tân Phú, Quận 7, TP. Hồ Chí Minh",
    industry: "Hàng tiêu dùng nhanh (FMCG)",
    accountTier: "Enterprise",
    assignedSales: {
      id: "SALES-03",
      name: "Nguyễn Thị Phương Thảo",
      email: "thao.ntp@crmcorp.vn",
      phone: "0905334455",
      role: "Account Executive"
    },
    totalContractValue: 1250000000, // 1.25 tỷ
    activeContractsCount: 2,
    status: "ACTIVE_CUSTOMER",
    contacts: [
      { id: "CTC-05", name: "Mai Kiều Liên", role: "Tổng Giám Đốc", email: "lien.mk@vinamilk.com.vn", phone: "0903888777" }
    ],
    lastInteraction: "2026-10-05 16:45:00",
    notes: "Đã ký hợp đồng giải pháp tự động hóa chuỗi cung ứng ERP."
  },
  {
    id: "KH-004",
    code: "CUST-TCB",
    name: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
    shortName: "Techcombank",
    taxCode: "0100230800",
    primaryPhone: "02439446368",
    primaryEmail: "call_center@techcombank.com.vn",
    domain: "techcombank.com.vn",
    address: "Số 6 Quang Trung, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    industry: "Tài chính & Ngân hàng",
    accountTier: "VIP Enterprise",
    assignedSales: {
      id: "SALES-01",
      name: "Lê Hải Đăng",
      email: "dang.lh@crmcorp.vn",
      phone: "0903112233",
      role: "Key Account Manager"
    },
    totalContractValue: 3100000000,
    activeContractsCount: 4,
    status: "ACTIVE_CUSTOMER",
    contacts: [
      { id: "CTC-06", name: "Jens Lottner", role: "Tổng Giám Đốc", email: "lottner.j@techcombank.com.vn", phone: "0909123456" }
    ],
    lastInteraction: "2026-10-06 09:00:00",
    notes: "Ngân hàng chuyển đổi số toàn diện."
  }
];
