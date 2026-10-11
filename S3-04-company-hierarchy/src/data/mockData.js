/**
 * DỮ LIỆU MẪU CHUẨN DOANH NGHIỆP - SCRUM-18 / SCRUM-73
 * Quản lý quan hệ công ty mẹ - con và tính toán hợp nhất giá trị hợp đồng tập đoàn
 */

export const CURRENT_USERS = [
  {
    id: 'USR-001',
    name: 'Nguyễn Hoàng Nam',
    email: 'nam.nh@crmcorp.vn',
    role: 'SALES_REP',
    roleTitle: 'Nhân viên kinh doanh',
    avatar: '👨‍💼',
    team: 'Khối Doanh nghiệp Lớn (Enterprise Sales)'
  },
  {
    id: 'USR-002',
    name: 'Trần Thị Mai Linh',
    email: 'linh.ttm@crmcorp.vn',
    role: 'TEAM_LEAD',
    roleTitle: 'Trưởng nhóm kinh doanh',
    avatar: '👩‍💼',
    team: 'Phòng Khách hàng Chiến lược'
  },
  {
    id: 'USR-003',
    name: 'Lê Quang Vinh',
    email: 'vinh.lq@crmcorp.vn',
    role: 'SALES_DIRECTOR',
    roleTitle: 'Giám đốc kinh doanh',
    avatar: '👔',
    team: 'Ban Giám đốc Kinh doanh'
  }
];

export const INITIAL_CUSTOMERS = [
  // ================= TẬP ĐOÀN FPT (MẸ & 4 CON) =================
  {
    id: 'KH-FPT-CORP',
    code: 'FPT-CORP',
    name: 'Công ty Cổ phần FPT (FPT Corporation)',
    shortName: 'Tập đoàn FPT',
    taxId: '0101248141',
    industry: 'Công nghệ & Viễn thông',
    address: 'Tòa nhà FPT, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    website: 'https://fpt.com.vn',
    phone: '024 7300 7300',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: null, // CÔNG TY MẸ
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1988,
    employeeCount: 48000,
    avatarBg: '#3b82f6',
    logoInitials: 'FPT',
    notes: 'Tập đoàn Công nghệ hàng đầu Việt Nam'
  },
  {
    id: 'KH-FPT-SOFT',
    code: 'FPT-SOFT',
    name: 'Công ty TNHH Phần mềm FPT (FPT Software)',
    shortName: 'FPT Software',
    taxId: '0101601092',
    industry: 'Xuất khẩu Phần mềm & Dịch vụ CNTT',
    address: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    website: 'https://fptsoftware.com',
    phone: '024 3768 9048',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: 'KH-FPT-CORP', // CON CỦA FPT CORP
    relationType: 'WHOLLY_OWNED', // 100% vốn
    ownershipPercent: 100,
    establishedYear: 1999,
    employeeCount: 30000,
    avatarBg: '#0284c7',
    logoInitials: 'FSW',
    notes: 'Công ty thành viên phụ trách mảng gia công & xuất khẩu phần mềm toàn cầu'
  },
  {
    id: 'KH-FPT-IS',
    code: 'FPT-IS',
    name: 'Công ty Cổ phần Hệ thống Thông tin FPT (FPT Information System)',
    shortName: 'FPT IS',
    taxId: '0102015430',
    industry: 'Tích hợp Hệ thống & Chuyển đổi số Doanh nghiệp',
    address: 'Tầng 22 Tòa nhà Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    website: 'https://fpt-is.com',
    phone: '024 3562 4128',
    salesOwner: 'Trần Thị Mai Linh',
    parentId: 'KH-FPT-CORP', // CON CỦA FPT CORP
    relationType: 'SUBSIDIARY',
    ownershipPercent: 85.5,
    establishedYear: 1994,
    employeeCount: 3500,
    avatarBg: '#6366f1',
    logoInitials: 'FIS',
    notes: 'Đơn vị tích hợp hệ thống, giải pháp ERP và Chính phủ số'
  },
  {
    id: 'KH-FPT-TEL',
    code: 'FPT-TEL',
    name: 'Công ty Cổ phần Viễn thông FPT (FPT Telecom)',
    shortName: 'FPT Telecom',
    taxId: '0101778163',
    industry: 'Dịch vụ Viễn thông & Trung tâm dữ liệu',
    address: 'Tòa nhà PVI, Số 1 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    website: 'https://fpt.vn',
    phone: '1900 6600',
    salesOwner: 'Lê Văn Bách',
    parentId: 'KH-FPT-CORP', // CON CỦA FPT CORP
    relationType: 'SUBSIDIARY',
    ownershipPercent: 51.2,
    establishedYear: 1997,
    employeeCount: 9500,
    avatarBg: '#8b5cf6',
    logoInitials: 'FTL',
    notes: 'Cung cấp hạ tầng Internet, truyền hình OTT và Cloud Data Center'
  },
  {
    id: 'KH-FPT-CLOUD',
    code: 'FPT-CLOUD',
    name: 'Công ty TNHH FPT Smart Cloud',
    shortName: 'FPT Smart Cloud',
    taxId: '0109322384',
    industry: 'Điện toán Đám mây & Trí tuệ Nhân tạo (AI)',
    address: 'Tầng 7 Tòa nhà FPT Tower, Cầu Giấy, Hà Nội',
    website: 'https://fptcloud.com',
    phone: '1900 638 399',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: 'KH-FPT-CORP', // CON CỦA FPT CORP
    relationType: 'WHOLLY_OWNED',
    ownershipPercent: 100,
    establishedYear: 2020,
    employeeCount: 650,
    avatarBg: '#06b6d4',
    logoInitials: 'FSC',
    notes: 'Hạ tầng Cloud đạt chuẩn quốc tế & hệ sinh thái FPT GenAI'
  },

  // ================= TẬP ĐOÀN VINGROUP (MẸ & 4 CON) =================
  {
    id: 'KH-VIN-GROUP',
    code: 'VIN-GROUP',
    name: 'Tập đoàn Vingroup - Công ty Cổ phần',
    shortName: 'Tập đoàn Vingroup',
    taxId: '0101245486',
    industry: 'Tập đoàn Đa ngành (Bất động sản, Công nghiệp, Dịch vụ)',
    address: 'Số 7 Đường Bằng Lăng 1, KĐT Sinh thái Vinhomes Riverside, Long Biên, Hà Nội',
    website: 'https://vingroup.net',
    phone: '024 3974 9999',
    salesOwner: 'Trần Thị Mai Linh',
    parentId: null, // CÔNG TY MẸ
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1993,
    employeeCount: 52000,
    avatarBg: '#dc2626',
    logoInitials: 'VIC',
    notes: 'Tập đoàn kinh tế tư nhân đa ngành quy mô lớn nhất Việt Nam'
  },
  {
    id: 'KH-VIN-HOMES',
    code: 'VIN-HOMES',
    name: 'Công ty Cổ phần Vinhomes',
    shortName: 'Vinhomes',
    taxId: '0102674146',
    industry: 'Phát triển & Quản lý Bất động sản',
    address: 'Tòa nhà Symphony, Chu Huy Mân, Vinhomes Riverside, Long Biên, Hà Nội',
    website: 'https://vinhomes.vn',
    phone: '1900 232 389',
    salesOwner: 'Trần Thị Mai Linh',
    parentId: 'KH-VIN-GROUP',
    relationType: 'SUBSIDIARY',
    ownershipPercent: 66.8,
    establishedYear: 2008,
    employeeCount: 12000,
    avatarBg: '#ea580c',
    logoInitials: 'VHM',
    notes: 'Nhà phát triển bất động sản thương mại và nhà ở hàng đầu'
  },
  {
    id: 'KH-VIN-FAST',
    code: 'VIN-FAST',
    name: 'Công ty Cổ phần Sản xuất và Kinh doanh VinFast',
    shortName: 'VinFast Auto',
    taxId: '0201801234',
    industry: 'Sản xuất Xe điện & Công nghiệp nặng',
    address: 'Khu công nghiệp Đình Vũ, Cát Hải, Hải Phòng',
    website: 'https://vinfastauto.com',
    phone: '1900 232 389',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: 'KH-VIN-GROUP',
    relationType: 'SUBSIDIARY',
    ownershipPercent: 51.5,
    establishedYear: 2017,
    employeeCount: 16000,
    avatarBg: '#b91c1c',
    logoInitials: 'VFS',
    notes: 'Thương hiệu ô tô và xe máy điện thông minh'
  },
  {
    id: 'KH-VIN-PEARL',
    code: 'VIN-PEARL',
    name: 'Công ty Cổ phần Vinpearl',
    shortName: 'Vinpearl',
    taxId: '4200456891',
    industry: 'Du lịch nghỉ dưỡng, Vui chơi giải trí',
    address: 'Đảo Hòn Tre, Phường Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
    website: 'https://vinpearl.com',
    phone: '1900 232 389',
    salesOwner: 'Vũ Minh Tuấn',
    parentId: 'KH-VIN-GROUP',
    relationType: 'SUBSIDIARY',
    ownershipPercent: 84.0,
    establishedYear: 2001,
    employeeCount: 8500,
    avatarBg: '#d97706',
    logoInitials: 'VPL',
    notes: 'Hệ sinh thái khách sạn nghỉ dưỡng 5 sao và công viên giải trí'
  },

  // ================= TẬP ĐOÀN MASAN (MẸ & 2 CON) =================
  {
    id: 'KH-MSN-GROUP',
    code: 'MSN-GROUP',
    name: 'Công ty Cổ phần Tập đoàn Masan (Masan Group)',
    shortName: 'Masan Group',
    taxId: '0303576603',
    industry: 'Hàng tiêu dùng & Bán lẻ',
    address: 'Phòng 802, Tầng 8, Central Plaza, 17 Lê Duẩn, Bến Nghé, Quận 1, TP. HCM',
    website: 'https://masangroup.com',
    phone: '028 6256 3862',
    salesOwner: 'Phạm Thanh Thảo',
    parentId: null, // CÔNG TY MẸ
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1996,
    employeeCount: 38000,
    avatarBg: '#059669',
    logoInitials: 'MSN',
    notes: 'Tập đoàn tiêu dùng, bán lẻ và chuỗi cung ứng hàng đầu'
  },
  {
    id: 'KH-MSN-CONS',
    code: 'MSN-CONS',
    name: 'Công ty Cổ phần Hàng tiêu dùng Masan (Masan Consumer)',
    shortName: 'Masan Consumer',
    taxId: '0302017440',
    industry: 'Sản xuất Thực phẩm & Đồ uống',
    address: 'Tầng 12, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. HCM',
    website: 'https://masanconsumer.com',
    phone: '028 6255 5660',
    salesOwner: 'Phạm Thanh Thảo',
    parentId: 'KH-MSN-GROUP',
    relationType: 'SUBSIDIARY',
    ownershipPercent: 72.3,
    establishedYear: 2000,
    employeeCount: 14000,
    avatarBg: '#10b981',
    logoInitials: 'MCH',
    notes: 'Nhãn hàng gia vị Chin-su, Nam Ngư, Mì Omachi, Kokomi'
  },
  {
    id: 'KH-MSN-WCM',
    code: 'MSN-WCM',
    name: 'Công ty Cổ phần Dịch vụ Thương mại Tổng hợp WinCommerce',
    shortName: 'WinCommerce',
    taxId: '0104918404',
    industry: 'Hệ thống Siêu thị & Cửa hàng tiện lợi WinMart',
    address: 'Tầng 5, Tòa nhà MPlaza Saigon, 39 Lê Duẩn, Quận 1, TP. HCM',
    website: 'https://winmart.vn',
    phone: '024 7106 6866',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: 'KH-MSN-GROUP',
    relationType: 'SUBSIDIARY',
    ownershipPercent: 70.0,
    establishedYear: 2014,
    employeeCount: 22000,
    avatarBg: '#16a34a',
    logoInitials: 'WCM',
    notes: 'Vận hành chuỗi hơn 3.600 siêu thị WinMart và WinMart+'
  },

  // ================= TẬP ĐOÀN VIETTEL (MẸ & 2 CON) =================
  {
    id: 'KH-VTL-GROUP',
    code: 'VTL-GROUP',
    name: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)',
    shortName: 'Tập đoàn Viettel',
    taxId: '0100109106',
    industry: 'Viễn thông, Công nghệ cao & Quốc phòng',
    address: 'Lô D26 Khu đô thị mới Cầu Giấy, Yên Hòa, Cầu Giấy, Hà Nội',
    website: 'https://viettel.com.vn',
    phone: '024 6255 6789',
    salesOwner: 'Lê Quang Vinh',
    parentId: null, // CÔNG TY MẸ
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1989,
    employeeCount: 45000,
    avatarBg: '#be123c',
    logoInitials: 'VTL',
    notes: 'Tập đoàn viễn thông và công nghệ quốc gia'
  },
  {
    id: 'KH-VTL-SOL',
    code: 'VTL-SOL',
    name: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel (Viettel Solutions)',
    shortName: 'Viettel Solutions',
    taxId: '0100109106-056',
    industry: 'Giải pháp Công nghệ Thông tin Doanh nghiệp',
    address: 'Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình, Hà Nội',
    website: 'https://solutions.viettel.vn',
    phone: '1800 8000',
    salesOwner: 'Lê Quang Vinh',
    parentId: 'KH-VTL-GROUP',
    relationType: 'WHOLLY_OWNED',
    ownershipPercent: 100,
    establishedYear: 2018,
    employeeCount: 4200,
    avatarBg: '#e11d48',
    logoInitials: 'VTS',
    notes: 'Cung cấp hạ tầng số và giải pháp chuyển đổi số cho Chính phủ và Doanh nghiệp'
  },
  {
    id: 'KH-VTL-CYB',
    code: 'VTL-CYB',
    name: 'Công ty An ninh mạng Viettel (Viettel Cyber Security)',
    shortName: 'Viettel Cyber Security',
    taxId: '0100109106-088',
    industry: 'An toàn Thông tin & Giám sát SOC',
    address: 'Tầng 41 Tòa nhà Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    website: 'https://viettelcybersecurity.com',
    phone: '024 6666 8989',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: 'KH-VTL-GROUP',
    relationType: 'WHOLLY_OWNED',
    ownershipPercent: 100,
    establishedYear: 2019,
    employeeCount: 800,
    avatarBg: '#9f1239',
    logoInitials: 'VCS',
    notes: 'Trung tâm giám sát điều hành an ninh mạng hàng đầu khu vực'
  },

  // ================= CÁC KHÁCH HÀNG ĐỘC LẬP (CHƯA CÓ MẸ - SẴN SÀNG KHAI BÁO) =================
  {
    id: 'KH-TCB',
    code: 'TCB-BANK',
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)',
    shortName: 'Techcombank',
    taxId: '0100230800',
    industry: 'Tài chính & Ngân hàng',
    address: 'Số 6 Quang Trung, Phường Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    website: 'https://techcombank.com',
    phone: '024 3944 6368',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: null, // Độc lập
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1993,
    employeeCount: 12500,
    avatarBg: '#b91c1c',
    logoInitials: 'TCB',
    notes: 'Ngân hàng thương mại cổ phần hàng đầu Việt Nam'
  },
  {
    id: 'KH-VNM',
    code: 'VNM-MILK',
    name: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
    shortName: 'Vinamilk',
    taxId: '0300588569',
    industry: 'Sản xuất Sữa & Dinh dưỡng',
    address: 'Số 10 Tân Trào, Phường Tân Phú, Quận 7, TP. HCM',
    website: 'https://vinamilk.com.vn',
    phone: '028 5415 5555',
    salesOwner: 'Trần Thị Mai Linh',
    parentId: null, // Độc lập
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1976,
    employeeCount: 9600,
    avatarBg: '#0284c7',
    logoInitials: 'VNM',
    notes: 'Thương hiệu sữa quốc gia số 1 Việt Nam'
  },
  {
    id: 'KH-HPG',
    code: 'HPG-STEEL',
    name: 'Công ty Cổ phần Tập đoàn Hòa Phát',
    shortName: 'Hòa Phát Group',
    taxId: '0900189284',
    industry: 'Sản xuất Thép & Công nghiệp nặng',
    address: 'KCN Phố Nối A, Xã Giai Phạm, Yên Mỹ, Hưng Yên',
    website: 'https://hoaphat.com.vn',
    phone: '024 6284 8666',
    salesOwner: 'Vũ Minh Tuấn',
    parentId: null, // Độc lập
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1992,
    employeeCount: 31000,
    avatarBg: '#ea580c',
    logoInitials: 'HPG',
    notes: 'Tập đoàn sản xuất công nghiệp và thép xây dựng số 1 Đông Nam Á'
  },
  {
    id: 'KH-THC',
    code: 'THC-AUTO',
    name: 'Công ty Cổ phần Tập đoàn Trường Hải (THACO)',
    shortName: 'THACO Group',
    taxId: '4000109964',
    industry: 'Ô tô, Cơ khí & Nông nghiệp',
    address: 'Số 19 Đào Trinh Nhất, Linh Tây, TP. Thủ Đức, TP. HCM',
    website: 'https://thaco.com.vn',
    phone: '028 3997 7824',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: null, // Độc lập
    relationType: null,
    ownershipPercent: null,
    establishedYear: 1997,
    employeeCount: 28000,
    avatarBg: '#475569',
    logoInitials: 'THC',
    notes: 'Tập đoàn công nghiệp đa ngành thế hệ mới'
  },
  {
    id: 'KH-ABC-TECH',
    code: 'ABC-TECH',
    name: 'Công ty TNHH Giải pháp Phần mềm ABC Tech',
    shortName: 'ABC Tech Solutions',
    taxId: '0108991234',
    industry: 'Phần mềm & AI Startup',
    address: 'Tầng 5 Tòa nhà CTM, 139 Cầu Giấy, Hà Nội',
    website: 'https://abctech.vn',
    phone: '024 3888 9999',
    salesOwner: 'Nguyễn Hoàng Nam',
    parentId: null, // Độc lập (Có thể thử gán làm con của FPT hoặc Viettel)
    relationType: null,
    ownershipPercent: null,
    establishedYear: 2021,
    employeeCount: 120,
    avatarBg: '#10b981',
    logoInitials: 'ABC',
    notes: 'Startup công nghệ triển vọng, đang tìm kiếm hợp tác tập đoàn'
  }
];

export const INITIAL_CONTRACTS = [
  // HỢP ĐỒNG FPT CORP (MẸ)
  {
    id: 'CT-FPT-01',
    contractNumber: 'HĐ-FPT/2026/001',
    customerId: 'KH-FPT-CORP',
    title: 'Cung cấp Nền tảng Chuyển đổi số & Đô thị Thông minh Cấp Quốc Gia',
    value: 45000000000, // 45 TỶ VND
    startDate: '2025-01-15',
    endDate: '2027-01-15',
    status: 'ACTIVE', // ACTIVE, COMPLETED, PENDING_RENEWAL
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Theo 4 giai đoạn tiến độ',
    scope: 'Triển khai trung tâm điều hành IOC và kiến trúc dữ liệu dùng chung'
  },
  {
    id: 'CT-FPT-02',
    contractNumber: 'HĐ-FPT/2026/002',
    customerId: 'KH-FPT-CORP',
    title: 'Dịch vụ Giám sát An ninh mạng & Bảo mật Hệ thống Tài chính SOC',
    value: 18500000000, // 18.5 TỶ VND
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Thanh toán định kỳ hàng quý',
    scope: 'Giám sát 24/7 SIEM/SOC và phản ứng sự cố khẩn cấp'
  },

  // HỢP ĐỒNG FPT SOFTWARE (CON CỦA FPT)
  {
    id: 'CT-FSW-01',
    contractNumber: 'HĐ-FSW/2025/112',
    customerId: 'KH-FPT-SOFT',
    title: 'Phát triển Hệ thống Core Banking & Mobile App Thế Hệ Mới',
    value: 32000000000, // 32 TỶ VND
    startDate: '2025-03-01',
    endDate: '2026-09-30',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Theo Milestone Sprint bàn giao',
    scope: 'Đội ngũ 60 kỹ sư phát triển phần mềm ngân hàng số'
  },
  {
    id: 'CT-FSW-02',
    contractNumber: 'HĐ-FSW/2025/145',
    customerId: 'KH-FPT-SOFT',
    title: 'Gia công Phần mềm Điều khiển Xe Tự Hành Automotive Cho Đối Tác Nhật',
    value: 28400000000, // 28.4 TỶ VND
    startDate: '2025-02-10',
    endDate: '2026-12-31',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'ODC hàng tháng theo giờ làm việc (Man-month)',
    scope: 'Phát triển Embedded Software chuẩn AUTOSAR'
  },

  // HỢP ĐỒNG FPT IS (CON CỦA FPT)
  {
    id: 'CT-FIS-01',
    contractNumber: 'HĐ-FIS/2025/209',
    customerId: 'KH-FPT-IS',
    title: 'Triển khai Hệ thống Quản trị Doanh nghiệp SAP S/4HANA Cloud',
    value: 24000000000, // 24 TỶ VND
    startDate: '2025-04-01',
    endDate: '2026-04-01',
    status: 'ACTIVE',
    salesRep: 'Trần Thị Mai Linh',
    paymentTerms: 'Nghiệm thu theo phân hệ FICO, MM, SD',
    scope: 'Tư vấn và chuyển đổi toàn bộ dữ liệu ERP'
  },
  {
    id: 'CT-FIS-02',
    contractNumber: 'HĐ-FIS/2025/288',
    customerId: 'KH-FPT-IS',
    title: 'Giải pháp Hóa đơn điện tử & Hợp đồng điện tử FPT.eContract',
    value: 7500000000, // 7.5 TỶ VND
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'COMPLETED',
    salesRep: 'Trần Thị Mai Linh',
    paymentTerms: 'Thanh toán trọn gói 1 lần',
    scope: 'Tích hợp chữ ký số HSM và xác thực danh tính căn cước eKYC'
  },

  // HỢP ĐỒNG FPT TELECOM (CON CỦA FPT)
  {
    id: 'CT-FTEL-01',
    contractNumber: 'HĐ-FTEL/2025/301',
    customerId: 'KH-FPT-TEL',
    title: 'Thuê Đường truyền Kênh riêng Quốc tế MPLS & Internet Leased Line',
    value: 15200000000, // 15.2 TỶ VND
    startDate: '2025-05-01',
    endDate: '2027-05-01',
    status: 'ACTIVE',
    salesRep: 'Lê Văn Bách',
    paymentTerms: 'Định kỳ 6 tháng/lần',
    scope: 'Băng thông kết nối 10Gbps cam kết SLA 99.99%'
  },
  {
    id: 'CT-FTEL-02',
    contractNumber: 'HĐ-FTEL/2025/355',
    customerId: 'KH-FPT-TEL',
    title: 'Thuê Chỗ đặt máy chủ Colocation & Dịch vụ Cloud Data Center Tier 3',
    value: 11800000000, // 11.8 TỶ VND
    startDate: '2025-07-01',
    endDate: '2026-07-01',
    status: 'ACTIVE',
    salesRep: 'Lê Văn Bách',
    paymentTerms: 'Hàng quý',
    scope: 'Thuê 20 Rack tại Trung tâm dữ liệu FPT Fornix Tân Thuận'
  },

  // HỢP ĐỒNG FPT SMART CLOUD (CON CỦA FPT)
  {
    id: 'CT-FSC-01',
    contractNumber: 'HĐ-FSC/2025/401',
    customerId: 'KH-FPT-CLOUD',
    title: 'Cung cấp Hạ tầng Điện toán Đám mây FPT Cloud & Dịch vụ Trợ lý AI',
    value: 14600000000, // 14.6 TỶ VND
    startDate: '2025-08-01',
    endDate: '2026-08-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Trả trước gói cam kết sử dụng 1 năm',
    scope: 'Triển khai Trợ lý ảo AI Voicebot và hạ tầng Cloud GPU'
  },

  // HỢP ĐỒNG VINGROUP (MẸ)
  {
    id: 'CT-VIN-01',
    contractNumber: 'HĐ-VIC/2025/001',
    customerId: 'KH-VIN-GROUP',
    title: 'Xây dựng Nền tảng Siêu ứng dụng & Trục Dữ liệu Tập đoàn Đa ngành',
    value: 55000000000, // 55 TỶ VND
    startDate: '2025-01-10',
    endDate: '2027-01-10',
    status: 'ACTIVE',
    salesRep: 'Trần Thị Mai Linh',
    paymentTerms: 'Theo giai đoạn',
    scope: 'Tích hợp hệ sinh thái VinID, Vinhomes, VinFast, Vinpearl'
  },

  // HỢP ĐỒNG VINHOMES (CON CỦA VINGROUP)
  {
    id: 'CT-VHM-01',
    contractNumber: 'HĐ-VHM/2025/012',
    customerId: 'KH-VIN-HOMES',
    title: 'Hệ thống Quản lý Tòa nhà Thông minh BMS & IoT Smart City',
    value: 35000000000, // 35 TỶ VND
    startDate: '2025-03-15',
    endDate: '2026-09-15',
    status: 'ACTIVE',
    salesRep: 'Trần Thị Mai Linh',
    paymentTerms: 'Theo cụm đô thị',
    scope: 'Triển khai camera AI nhận diện khuôn mặt và barrier tự động'
  },
  {
    id: 'CT-VHM-02',
    contractNumber: 'HĐ-VHM/2025/044',
    customerId: 'KH-VIN-HOMES',
    title: 'Nền tảng Quản lý Cư dân & Thanh toán Phí dịch vụ Chung cư',
    value: 22500000000, // 22.5 TỶ VND
    startDate: '2025-05-01',
    endDate: '2026-05-01',
    status: 'ACTIVE',
    salesRep: 'Trần Thị Mai Linh',
    paymentTerms: 'Thanh toán theo quý',
    scope: 'Ứng dụng Vinhomes Resident trên iOS/Android'
  },

  // HỢP ĐỒNG VINFAST (CON CỦA VINGROUP)
  {
    id: 'CT-VFS-01',
    contractNumber: 'HĐ-VFS/2025/088',
    customerId: 'KH-VIN-FAST',
    title: 'Hệ thống Điều phối Vận hành Trạm Sạc Xe Điện Toàn Quốc',
    value: 48000000000, // 48 TỶ VND
    startDate: '2025-02-01',
    endDate: '2026-08-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Theo tiến độ đấu nối',
    scope: 'Hệ thống IoT quản lý 150.000 cổng sạc trên 63 tỉnh thành'
  },
  {
    id: 'CT-VFS-02',
    contractNumber: 'HĐ-VFS/2025/102',
    customerId: 'KH-VIN-FAST',
    title: 'Nền tảng Thương mại Điện tử Đặt mua Ô tô Trực tuyến & Quản lý Đại lý DMS',
    value: 36000000000, // 36 TỶ VND
    startDate: '2025-04-10',
    endDate: '2026-04-10',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Nghiệm thu toàn phần',
    scope: 'Trục DMS kết nối 80 showroom phân phối ô tô điện'
  },

  // HỢP ĐỒNG VINPEARL (CON CỦA VINGROUP)
  {
    id: 'CT-VPL-01',
    contractNumber: 'HĐ-VPL/2025/019',
    customerId: 'KH-VIN-PEARL',
    title: 'Hệ thống Đặt phòng Khách sạn & Bán vé Vui chơi Trực tuyến Centralized Booking',
    value: 16200000000, // 16.2 TỶ VND
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    status: 'ACTIVE',
    salesRep: 'Vũ Minh Tuấn',
    paymentTerms: 'Hàng quý',
    scope: 'Tích hợp kết nối các kênh OTA quốc tế Agoda, Booking.com'
  },

  // HỢP ĐỒNG MASAN GROUP (MẸ)
  {
    id: 'CT-MSN-01',
    contractNumber: 'HĐ-MSN/2025/001',
    customerId: 'KH-MSN-GROUP',
    title: 'Nền tảng Tích hợp Chuỗi Cung ứng Hợp nhất Point of Life',
    value: 22000000000, // 22 TỶ VND
    startDate: '2025-01-20',
    endDate: '2026-07-20',
    status: 'ACTIVE',
    salesRep: 'Phạm Thanh Thảo',
    paymentTerms: 'Milestone',
    scope: 'Tối ưu hóa Logistics và dữ liệu người tiêu dùng tập đoàn'
  },
  // HỢP ĐỒNG MASAN CONSUMER (CON)
  {
    id: 'CT-MCH-01',
    contractNumber: 'HĐ-MCH/2025/022',
    customerId: 'KH-MSN-CONS',
    title: 'Hệ thống Quản lý Phân phối Điểm bán lẻ DMS cho 300.000 Tạp hóa',
    value: 31000000000, // 31 TỶ VND
    startDate: '2025-02-15',
    endDate: '2026-08-15',
    status: 'ACTIVE',
    salesRep: 'Phạm Thanh Thảo',
    paymentTerms: 'Theo quý',
    scope: 'Quản lý lộ trình nhân viên sales và chấm điểm trưng bày hàng hóa'
  },
  // HỢP ĐỒNG WINCOMMERCE (CON)
  {
    id: 'CT-WCM-01',
    contractNumber: 'HĐ-WCM/2025/050',
    customerId: 'KH-MSN-WCM',
    title: 'Hệ thống Bán hàng Tính tiền Tự động POS & Quản lý Kho Siêu thị WinMart',
    value: 28500000000, // 28.5 TỶ VND
    startDate: '2025-03-01',
    endDate: '2026-03-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Theo số lượng máy POS',
    scope: 'Triển khai cho 3.600 điểm bán trên toàn quốc'
  },

  // HỢP ĐỒNG VIETTEL GROUP (MẸ)
  {
    id: 'CT-VTL-01',
    contractNumber: 'HĐ-VTL/2025/001',
    customerId: 'KH-VTL-GROUP',
    title: 'Giải pháp Hạ tầng Trạm Phát sóng 5G & Trục Truyền dẫn Băng rộng',
    value: 68000000000, // 68 TỶ VND
    startDate: '2025-01-01',
    endDate: '2027-01-01',
    status: 'ACTIVE',
    salesRep: 'Lê Quang Vinh',
    paymentTerms: 'Theo quý',
    scope: 'Thiết bị viễn thông và phần mềm điều khiển mạng lưới'
  },
  // HỢP ĐỒNG VIETTEL SOLUTIONS (CON)
  {
    id: 'CT-VTS-01',
    contractNumber: 'HĐ-VTS/2025/031',
    customerId: 'KH-VTL-SOL',
    title: 'Hệ thống Trung tâm Giám sát Điều hành Thông minh IOC Cấp Tỉnh',
    value: 42000000000, // 42 TỶ VND
    startDate: '2025-04-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    salesRep: 'Lê Quang Vinh',
    paymentTerms: 'Theo đợt nghiệm thu',
    scope: 'Xây dựng IOC cho 5 tỉnh thành trọng điểm'
  },
  // HỢP ĐỒNG VIETTEL CYBER SECURITY (CON)
  {
    id: 'CT-VCS-01',
    contractNumber: 'HĐ-VCS/2025/077',
    customerId: 'KH-VTL-CYB',
    title: 'Dịch vụ Kiểm thử Xâm nhập Độc lập & Đánh giá Lỗ hổng Bảo mật Red Team',
    value: 19500000000, // 19.5 TỶ VND
    startDate: '2025-05-15',
    endDate: '2026-05-15',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Theo đợt kiểm thử',
    scope: 'Penetration testing toàn diện hạ tầng máy chủ và ứng dụng'
  },

  // HỢP ĐỒNG CỦA CÁC KHÁCH HÀNG ĐỘC LẬP
  {
    id: 'CT-TCB-01',
    contractNumber: 'HĐ-TCB/2025/009',
    customerId: 'KH-TCB',
    title: 'Nâng cấp Hệ thống Thanh toán Trực tuyến Quốc tế Swift & Visa/Master',
    value: 25000000000, // 25 TỶ VND
    startDate: '2025-02-01',
    endDate: '2026-02-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Theo quý',
    scope: 'Giải pháp Gateway chuẩn PCI-DSS'
  },
  {
    id: 'CT-VNM-01',
    contractNumber: 'HĐ-VNM/2025/015',
    customerId: 'KH-VNM',
    title: 'Tự động hóa Dây chuyền Nhà máy Sữa Thông minh Smart Factory 4.0',
    value: 38000000000, // 38 TỶ VND
    startDate: '2025-01-15',
    endDate: '2026-07-15',
    status: 'ACTIVE',
    salesRep: 'Trần Thị Mai Linh',
    paymentTerms: 'Theo tiến độ lắp đặt',
    scope: 'Hệ thống cảm biến SCADA & điều khiển robot AGV'
  },
  {
    id: 'CT-HPG-01',
    contractNumber: 'HĐ-HPG/2025/033',
    customerId: 'KH-HPG',
    title: 'Hệ thống Giám sát Năng lượng & Giảm phát thải Khí nhà kính Khu Liên Hợp Gang Thép',
    value: 34000000000, // 34 TỶ VND
    startDate: '2025-03-20',
    endDate: '2026-09-20',
    status: 'ACTIVE',
    salesRep: 'Vũ Minh Tuấn',
    paymentTerms: 'Theo mốc KPI',
    scope: 'Hệ thống đo kiểm lượng tiêu thụ điện và khí đốt lò cao'
  },
  {
    id: 'CT-THC-01',
    contractNumber: 'HĐ-THC/2025/040',
    customerId: 'KH-THC',
    title: 'Phần mềm Quản lý Chuỗi Cung ứng và Vận tải Logistics THILOGI',
    value: 29500000000, // 29.5 TỶ VND
    startDate: '2025-04-01',
    endDate: '2026-04-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Hàng tháng',
    scope: 'Tối ưu hóa tuyến đường vận tải cảng Chu Lai'
  },
  {
    id: 'CT-ABC-01',
    contractNumber: 'HĐ-ABC/2025/001',
    customerId: 'KH-ABC-TECH',
    title: 'Tư vấn Kiến trúc Cloud & Hợp tác Phát triển Module AI OCR',
    value: 5500000000, // 5.5 TỶ VND
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    status: 'ACTIVE',
    salesRep: 'Nguyễn Hoàng Nam',
    paymentTerms: 'Trả góp 4 đợt',
    scope: 'Bản quyền công nghệ nhận dạng hóa đơn tự động'
  }
];

export const INITIAL_PIPELINE_DEALS = [
  {
    id: 'DL-01',
    customerId: 'KH-FPT-SOFT',
    title: 'Dự án Mở rộng Trung tâm Phần mềm tại Đà Nẵng (Campus F-Complex)',
    value: 15000000000,
    stage: 'Đàm phán Hợp đồng',
    probability: 80
  },
  {
    id: 'DL-02',
    customerId: 'KH-FPT-IS',
    title: 'Gói thầu Hiện đại hóa Hệ thống Thu thuế Điện tử',
    value: 20000000000,
    stage: 'Chào giá Kỹ thuật',
    probability: 65
  },
  {
    id: 'DL-03',
    customerId: 'KH-VIN-FAST',
    title: 'Hợp tác Cung cấp Chip Bán dẫn và Vi mạch Điều khiển Pin EV',
    value: 40000000000,
    stage: 'Thẩm định Năng lực',
    probability: 70
  },
  {
    id: 'DL-04',
    customerId: 'KH-MSN-WCM',
    title: 'Nâng cấp Trạm Tự Check-out Self-service Kiosk cho Siêu thị',
    value: 12000000000,
    stage: 'Đàm phán Thương thảo',
    probability: 85
  }
];

export const RELATION_TYPES = [
  {
    id: 'WHOLLY_OWNED',
    label: 'Công ty con 100% vốn (Wholly Owned Subsidiary)',
    description: 'Công ty mẹ sở hữu toàn bộ 100% vốn điều lệ',
    defaultOwnership: 100,
    badgeColor: '#10b981'
  },
  {
    id: 'SUBSIDIARY',
    label: 'Công ty con chi phối (> 50% vốn)',
    description: 'Công ty mẹ sở hữu trên 50% vốn điều lệ và nắm quyền kiểm soát',
    defaultOwnership: 65,
    badgeColor: '#3b82f6'
  },
  {
    id: 'ASSOCIATE',
    label: 'Công ty liên kết (20% - 50% vốn)',
    description: 'Công ty mẹ có ảnh hưởng đáng kể nhưng không nắm quyền chi phối',
    defaultOwnership: 35,
    badgeColor: '#f59e0b'
  },
  {
    id: 'BRANCH',
    label: 'Chi nhánh / Đơn vị phụ thuộc (Branch Unit)',
    description: 'Đơn vị hạch toán phụ thuộc theo Luật Doanh nghiệp',
    defaultOwnership: 100,
    badgeColor: '#8b5cf6'
  }
];
