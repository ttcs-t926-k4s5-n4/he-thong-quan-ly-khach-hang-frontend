/**
 * Danh sách Khách hàng Tiềm năng (Leads) phục vụ chấm điểm và phân loại cuộc gọi
 */

export const initialMockLeads = [
  {
    id: "LD-201",
    code: "LEAD-201",
    fullName: "Nguyễn Hoàng Nam",
    jobTitle: "Giám đốc Công nghệ (CIO)",
    companyName: "Tập đoàn Công nghệ & Bán lẻ SmartRetail",
    phone: "0912888999",
    email: "nam.nh@smartretail.vn",
    industry: "IT_TELECOM",               // +25
    companySize: "ENTERPRISE",             // +30 (>500 nhân sự)
    leadSource: "HOTLINE_DEMO",           // +25 (Hotline trực tiếp)
    interestLevel: "URGENT",              // +30 (Triển khai trong tháng)
    assignedTo: {
      name: "Trần Mạnh Hùng",
      role: "Senior Sales Rep",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    },
    notes: "Khách hàng cần triển khai gấp CRM đa kênh cho 350 nhân sự bán hàng trước thềm Black Friday.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-09 08:15:00"
  },
  {
    id: "LD-202",
    code: "LEAD-202",
    fullName: "Đoàn Thị Bích Thủy",
    jobTitle: "Trưởng phòng Chuyển đổi số",
    companyName: "Ngân hàng TMCP Phương Đông (OCB)",
    phone: "0903112233",
    email: "thuy.dtb@ocb.com.vn",
    industry: "FINANCE_BANKING",          // +20
    companySize: "ENTERPRISE",             // +30 (>500 nhân sự)
    leadSource: "EXPO_EVENT",             // +20 (Tech Expo)
    interestLevel: "EVALUATING",          // +20 (Đang khảo sát giá)
    assignedTo: {
      name: "Nguyễn Thị Phương Thảo",
      role: "Key Account Sales",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    notes: "Đang mở gói thầu nâng cấp hệ thống chăm sóc khách hàng VIP Private Banking.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-09 08:45:00"
  },
  {
    id: "LD-203",
    code: "LEAD-203",
    fullName: "Lê Văn Hưng",
    jobTitle: "Phó Tổng Giám Đốc Vận Hành",
    companyName: "Công ty CP Sản Xuất Cơ Khí Tân Phát",
    phone: "0987654321",
    industry: "MANUFACTURING",            // +15
    companySize: "UPPER_MID",             // +20 (100 - 500 nhân sự)
    leadSource: "GOOGLE_SEARCH",          // +15
    interestLevel: "EVALUATING",          // +20
    email: "hung.lv@tanphat-mech.vn",
    assignedTo: {
      name: "Lê Hải Đăng",
      role: "Account Executive",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    notes: "Khách hàng muốn liên kết CRM với phân hệ kho và bảo hành linh kiện máy móc kéo dài.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-08 15:30:00"
  },
  {
    id: "LD-204",
    code: "LEAD-204",
    fullName: "Vũ Hải Đăng",
    jobTitle: "Trưởng phòng Kinh doanh",
    companyName: "Chuỗi Siêu Thị Thực Phẩm Xanh BioMart",
    phone: "0934567890",
    email: "dang.vh@biomart.vn",
    industry: "RETAIL_ECOMMERCE",         // +10
    companySize: "MID",                   // +10 (20 - 100 nhân sự)
    leadSource: "FACEBOOK_EBOOK",         // +10 (Tải ebook)
    interestLevel: "RESEARCHING",         // +10 (Thu thập tài liệu)
    assignedTo: {
      name: "Phạm Thu Hương",
      role: "Telesales Rep",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
    },
    notes: "Tải tài liệu 'Tối ưu trải nghiệm khách hàng tại điểm bán'. Chưa hẹn ngày trao đổi trực tiếp.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-09 09:00:00"
  },
  {
    id: "LD-205",
    code: "LEAD-205",
    fullName: "Bùi Thanh Hằng",
    jobTitle: "Chủ Doanh Nghiệp (Founder)",
    companyName: "Studio Thiết Kế Nội Thất ArtDecor",
    phone: "0945678901",
    email: "hang.bt@artdecor.com",
    industry: "SERVICES_OTHER",           // +5
    companySize: "SMALL",                 // +5 (< 20 nhân sự)
    leadSource: "ORGANIC_OTHER",          // +5
    interestLevel: "BROWSING",            // +0 (Mới tìm hiểu)
    assignedTo: {
      name: "Trần Mạnh Hùng",
      role: "Senior Sales Rep",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    },
    notes: "Để lại số điện thoại trên chatbox website hỏi bản miễn phí dùng thử. Quy mô 8 người.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-07 10:20:00"
  },
  {
    id: "LD-206",
    code: "LEAD-206",
    fullName: "Phạm Quốc Toàn",
    jobTitle: "Giám đốc Phát triển Phần mềm",
    companyName: "Công ty Cổ phần Giải pháp Fintech V-Pay",
    phone: "0908112233",
    email: "toan.pq@vpayfintech.vn",
    industry: "IT_TELECOM",               // +25
    companySize: "UPPER_MID",             // +20
    leadSource: "HOTLINE_DEMO",           // +25
    interestLevel: "EVALUATING",          // +20
    assignedTo: {
      name: "Nguyễn Thị Phương Thảo",
      role: "Key Account Sales",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    notes: "Đang mở rộng cổng thanh toán, muốn tích hợp CRM để quản lý hơn 2000 đối tác bán lẻ.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-09 09:30:00"
  },
  {
    id: "LD-207",
    code: "LEAD-207",
    fullName: "Đỗ Mai Trang",
    jobTitle: "Kế Toán Trưởng",
    companyName: "Xưởng Sản Xuất Nhựa Bao Bì Minh Phát",
    phone: "0977223344",
    email: "trang.dm@minhphatplastic.vn",
    industry: "MANUFACTURING",            // +15
    companySize: "MID",                   // +10
    leadSource: "FACEBOOK_EBOOK",         // +10
    interestLevel: "RESEARCHING",         // +10
    assignedTo: {
      name: "Phạm Thu Hương",
      role: "Telesales Rep",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
    },
    notes: "Quan tâm tính năng xuất hóa đơn và đối soát công nợ từ xa.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-08 14:10:00"
  },
  {
    id: "LD-208",
    code: "LEAD-208",
    fullName: "Hoàng Minh Trí",
    jobTitle: "Nhân viên Bán hàng",
    companyName: "Cửa hàng Phụ kiện Di Động Tuấn Vũ",
    phone: "0966554433",
    email: "tri.hm@tuanvu-store.vn",
    industry: "RETAIL_ECOMMERCE",         // +10
    companySize: "SMALL",                 // +5
    leadSource: "ORGANIC_OTHER",          // +5
    interestLevel: "BROWSING",            // +0
    assignedTo: {
      name: "Lê Hải Đăng",
      role: "Account Executive",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    notes: "Mới mở chi nhánh thứ 2, muốn quản lý tồn kho và bảo hành.",
    callStatus: "PENDING_CALL",
    createdAt: "2026-10-06 16:00:00"
  }
];
