// =============================================================================
// DỮ LIỆU MẪU KHÁCH HÀNG DOANH NGHIỆP & CẶP TRÙNG LẶP (SCRUM-18 / SCRUM-72)
// Mô phỏng thực tế bài toán: Hai nhân viên kinh doanh cùng chào 1 công ty
// =============================================================================

export const CURRENT_USERS = [
  {
    id: 'TL-01',
    name: 'Trần Mạnh Hùng',
    role: 'TEAM_LEAD',
    roleLabel: 'Trưởng nhóm kinh doanh',
    team: 'Nhóm Kinh doanh 1 & 2 (Khối Doanh nghiệp Lớn)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    canMerge: true,
    badgeColor: '#3b82f6'
  },
  {
    id: 'DIR-01',
    name: 'Lê Đình Khoa',
    role: 'SALES_DIRECTOR',
    roleLabel: 'Giám đốc Kinh doanh',
    team: 'Ban Điều hành Toàn quốc',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    canMerge: true,
    badgeColor: '#8b5cf6'
  },
  {
    id: 'REP-01',
    name: 'Nguyễn Hoàng Nam',
    role: 'SALES_REP',
    roleLabel: 'Chuyên viên Kinh doanh',
    team: 'Nhóm Kinh doanh 1',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    canMerge: false,
    badgeColor: '#10b981'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'KH-001',
    code: 'FPT-CORP',
    name: 'Công ty Cổ phần Công nghệ Thông tin FPT',
    taxCode: '0101248141',
    website: 'fpt.com.vn',
    phone: '024 7300 7300',
    email: 'contact@fpt.com.vn',
    address: 'Tòa nhà FPT, Phố Duy Tân, Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    industry: 'Công nghệ thông tin & Viễn thông',
    revenueTier: 'Trên 50.000 tỷ VNĐ',
    employeeCount: 48000,
    ownerId: 'REP-01',
    ownerName: 'Nguyễn Hoàng Nam',
    ownerTeam: 'Nhóm Kinh doanh 1',
    status: 'Đang chào giá (Proposal)',
    createdAt: '12/08/2026',
    lastContactDate: '18/09/2026',
    duplicateTargetId: 'KH-002', // Tham chiếu trùng
    contacts: [
      {
        id: 'CT-101',
        name: 'Lê Hải Đăng',
        title: 'Giám đốc Khối Hạ tầng Cloud',
        email: 'danglh@fpt.com.vn',
        phone: '0912 345 678',
        isPrimary: true,
        sourceCustomerId: 'KH-001'
      },
      {
        id: 'CT-102',
        name: 'Nguyễn Thu Hằng',
        title: 'Trưởng phòng Đấu thầu & Mua sắm',
        email: 'hangnt@fpt.com.vn',
        phone: '0983 111 222',
        isPrimary: false,
        sourceCustomerId: 'KH-001'
      }
    ],
    deals: [
      {
        id: 'DEAL-101',
        name: 'Triển khai Nền tảng API Gateway cho Khối Ngân hàng FPT',
        amount: 450000000,
        stage: 'Chào giá & Demo kỹ thuật',
        probability: 70,
        expectedCloseDate: '15/11/2026',
        ownerName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-001'
      }
    ],
    activities: [
      {
        id: 'ACT-101',
        type: 'CALL',
        title: 'Cuộc gọi trao đổi nhu cầu nâng cấp hạ tầng',
        content: 'Trao đổi với anh Đăng về phương án tích hợp hệ thống API Gateway chịu tải cao.',
        date: '15/08/2026 09:30',
        creatorName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-001'
      },
      {
        id: 'ACT-102',
        type: 'MEETING',
        title: 'Họp Demo giải pháp kỹ thuật trực tiếp',
        content: 'Trình diễn khả năng định tuyến tải và bảo mật chứng thực OAuth2 tại Tòa nhà FPT Cầu Giấy.',
        date: '22/08/2026 14:00',
        creatorName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-001'
      },
      {
        id: 'ACT-103',
        type: 'EMAIL',
        title: 'Gửi bản chào giá chính thức đợt 1',
        content: 'Đã gửi file PDF chào giá và bảng cam kết mức độ dịch vụ SLA 99.99% cho chị Hằng.',
        date: '05/09/2026 16:45',
        creatorName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-001'
      }
    ]
  },

  {
    id: 'KH-002',
    code: 'FPT-FIS',
    name: 'FPT Information System (Công ty Hệ thống Thông tin FPT - FIS)',
    taxCode: '0101248141', // Trùng 100% MST với KH-001
    website: 'https://www.fpt.com.vn/', // Trùng website với KH-001
    phone: '024 3562 6666',
    email: 'sales-fis@fpt.com.vn',
    address: 'Tầng 22 Tòa nhà Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội',
    industry: 'Tích hợp Hệ thống & Chuyển đổi số',
    revenueTier: 'Trên 15.000 tỷ VNĐ',
    employeeCount: 3200,
    ownerId: 'REP-02',
    ownerName: 'Trần Thị Mai Linh',
    ownerTeam: 'Nhóm Kinh doanh 2',
    status: 'Đang đàm phán hợp đồng',
    createdAt: '28/08/2026',
    lastContactDate: '28/09/2026',
    duplicateTargetId: 'KH-001', // Tham chiếu trùng
    contacts: [
      {
        id: 'CT-201',
        name: 'Vũ Minh Tuấn',
        title: 'Phó Tổng Giám đốc Công nghệ',
        email: 'tuanvm@fis.com.vn',
        phone: '0904 888 999',
        isPrimary: true,
        sourceCustomerId: 'KH-002'
      },
      {
        id: 'CT-202',
        name: 'Đặng Thùy Trang',
        title: 'Kế toán trưởng Phụ trách Hợp đồng',
        email: 'trangdt@fis.com.vn',
        phone: '0977 654 321',
        isPrimary: false,
        sourceCustomerId: 'KH-002'
      }
    ],
    deals: [
      {
        id: 'DEAL-102',
        name: 'Gói Bảo trì & Nâng cấp An toàn Thông tin Trung tâm Dữ liệu FIS',
        amount: 280000000,
        stage: 'Đàm phán điều khoản hợp đồng',
        probability: 85,
        expectedCloseDate: '30/10/2026',
        ownerName: 'Trần Thị Mai Linh',
        sourceCustomerId: 'KH-002'
      }
    ],
    activities: [
      {
        id: 'ACT-201',
        type: 'MEETING',
        title: 'Làm việc trực tiếp tại Keangnam Landmark 72',
        content: 'Chị Mai Linh gặp PTGĐ Tuấn thống nhất phạm vi dịch vụ SOC 24/7 và kiểm thử mã độc định kỳ.',
        date: '02/09/2026 10:15',
        creatorName: 'Trần Thị Mai Linh',
        sourceCustomerId: 'KH-002'
      },
      {
        id: 'ACT-202',
        type: 'CALL',
        title: 'Đàm phán tỷ lệ chiết khấu thanh toán trước',
        content: 'Khách hàng đề nghị giảm 5% nếu thanh toán trọn gói 1 năm ngay trong quý 4.',
        date: '14/09/2026 15:30',
        creatorName: 'Trần Thị Mai Linh',
        sourceCustomerId: 'KH-002'
      },
      {
        id: 'ACT-203',
        type: 'NOTE',
        title: 'Ghi chú quan trọng về xung đột chào giá',
        content: 'Khách hàng nhắc: "Hôm trước cũng có một bạn bên công ty em liên hệ chào giải pháp phần mềm cho chi nhánh Cầu Giấy, đề nghị cử 1 đầu mối phụ trách duy nhất."',
        date: '28/09/2026 17:00',
        creatorName: 'Trần Thị Mai Linh',
        sourceCustomerId: 'KH-002'
      }
    ]
  },

  {
    id: 'KH-003',
    code: 'VIETTEL-CORP',
    name: 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel Group)',
    taxCode: '0100109106',
    website: 'viettel.com.vn',
    phone: '024 6255 6789',
    email: 'info@viettel.com.vn',
    address: 'Số 1 Trần Hữu Dực, Phường Mỹ Đình 2, Nam Từ Liêm, Hà Nội',
    industry: 'Viễn thông & An ninh Mạng',
    revenueTier: 'Trên 170.000 tỷ VNĐ',
    employeeCount: 50000,
    ownerId: 'REP-03',
    ownerName: 'Lê Văn Đạt',
    ownerTeam: 'Nhóm Kinh doanh 1',
    status: 'Đang chào giá (Proposal)',
    createdAt: '05/07/2026',
    lastContactDate: '25/09/2026',
    duplicateTargetId: 'KH-004',
    contacts: [
      {
        id: 'CT-301',
        name: 'Đại tá Trần Văn Nam',
        title: 'Trưởng ban Công nghệ Tập đoàn',
        email: 'namtv@viettel.com.vn',
        phone: '0989 222 333',
        isPrimary: true,
        sourceCustomerId: 'KH-003'
      }
    ],
    deals: [
      {
        id: 'DEAL-103',
        name: 'Hạ tầng Giám sát Đám mây Đa vùng cho Viettel Cloud',
        amount: 820000000,
        stage: 'Đánh giá hồ sơ thầu',
        probability: 60,
        expectedCloseDate: '20/12/2026',
        ownerName: 'Lê Văn Đạt',
        sourceCustomerId: 'KH-003'
      }
    ],
    activities: [
      {
        id: 'ACT-301',
        type: 'MEETING',
        title: 'Tiếp xúc đầu mối Ban Công nghệ Viettel',
        content: 'Trình bày tài liệu kiến trúc kỹ thuật hệ thống quan trắc APM.',
        date: '10/08/2026 14:00',
        creatorName: 'Lê Văn Đạt',
        sourceCustomerId: 'KH-003'
      }
    ]
  },

  {
    id: 'KH-004',
    code: 'VIETTEL-TEL',
    name: 'Tổng Công ty Viễn thông Viettel (Viettel Telecom)',
    taxCode: '0100109106-001', // Nhánh của 0100109106
    website: 'https://vietteltelecom.vn/',
    phone: '024 6273 0123',
    email: 'cskh@viettel.com.vn',
    address: 'Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình, Hà Nội',
    industry: 'Viễn thông di động & Băng rộng',
    revenueTier: 'Trên 40.000 tỷ VNĐ',
    employeeCount: 12000,
    ownerId: 'REP-04',
    ownerName: 'Vũ Phương Thảo',
    ownerTeam: 'Nhóm Kinh doanh 2',
    status: 'Đang liên hệ tìm hiểu',
    createdAt: '19/08/2026',
    lastContactDate: '22/09/2026',
    duplicateTargetId: 'KH-003',
    contacts: [
      {
        id: 'CT-401',
        name: 'Hoàng Nhật Minh',
        title: 'Phó Giám đốc Trung tâm Giải pháp Số',
        email: 'minhhn@viettel.com.vn',
        phone: '0978 456 789',
        isPrimary: true,
        sourceCustomerId: 'KH-004'
      }
    ],
    deals: [
      {
        id: 'DEAL-104',
        name: 'Cung cấp Nền tảng Chatbot AI Chăm sóc Khách hàng Viettel',
        amount: 360000000,
        stage: 'Xây dựng bản chào kỹ thuật PoC',
        probability: 50,
        expectedCloseDate: '05/12/2026',
        ownerName: 'Vũ Phương Thảo',
        sourceCustomerId: 'KH-004'
      }
    ],
    activities: [
      {
        id: 'ACT-401',
        type: 'CALL',
        title: 'Giới thiệu giải pháp NLP Tiếng Việt cho Viettel Telecom',
        content: 'Chị Thảo gọi điện kết nối với anh Minh trao đổi demo PoC trong tháng 10.',
        date: '22/08/2026 10:00',
        creatorName: 'Vũ Phương Thảo',
        sourceCustomerId: 'KH-004'
      }
    ]
  },

  {
    id: 'KH-005',
    code: 'VINAMILK-HQ',
    name: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
    taxCode: '0300588569',
    website: 'vinamilk.com.vn',
    phone: '028 5415 5555',
    email: 'vinamilk@vinamilk.com.vn',
    address: 'Số 10 Tân Trào, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
    industry: 'Sản xuất Thực phẩm & Tiêu dùng nhanh (FMCG)',
    revenueTier: 'Trên 60.000 tỷ VNĐ',
    employeeCount: 10000,
    ownerId: 'REP-05',
    ownerName: 'Phạm Quốc Huy',
    ownerTeam: 'Nhóm Kinh doanh 2',
    status: 'Đang đàm phán hợp đồng',
    createdAt: '01/06/2026',
    lastContactDate: '30/09/2026',
    duplicateTargetId: 'KH-006',
    contacts: [
      {
        id: 'CT-501',
        name: 'Ngô Thanh Tùng',
        title: 'Giám đốc Chuỗi cung ứng Toàn quốc',
        email: 'tungnt@vinamilk.com.vn',
        phone: '0903 777 888',
        isPrimary: true,
        sourceCustomerId: 'KH-005'
      }
    ],
    deals: [
      {
        id: 'DEAL-105',
        name: 'Hệ thống Quản lý Vận tải Logistics Thông minh (TMS)',
        amount: 550000000,
        stage: 'Đàm phán giá cuối',
        probability: 90,
        expectedCloseDate: '15/10/2026',
        ownerName: 'Phạm Quốc Huy',
        sourceCustomerId: 'KH-005'
      }
    ],
    activities: [
      {
        id: 'ACT-501',
        type: 'MEETING',
        title: 'Thống nhất điều khoản triển khai tại Nhà máy Sữa Thống Nhất',
        content: 'Gặp anh Tùng khảo sát thực địa kho lạnh và luồng xuất nhập hàng.',
        date: '15/09/2026 15:00',
        creatorName: 'Phạm Quốc Huy',
        sourceCustomerId: 'KH-005'
      }
    ]
  },

  {
    id: 'KH-006',
    code: 'VINAMILK-LOG',
    name: 'Công ty CP Sữa Vinamilk - Khối Cung ứng & Kho vận',
    taxCode: '0300588569', // Trùng 100% MST
    website: 'https://www.vinamilk.com.vn',
    phone: '028 5415 5555',
    email: 'logistics@vinamilk.com.vn',
    address: 'Khu Công nghiệp VSIP 1, Thuận An, Bình Dương',
    industry: 'Chuỗi cung ứng & Kho bãi logistics',
    revenueTier: 'Trên 60.000 tỷ VNĐ',
    employeeCount: 2500,
    ownerId: 'REP-01',
    ownerName: 'Nguyễn Hoàng Nam',
    ownerTeam: 'Nhóm Kinh doanh 1',
    status: 'Tiếp cận sơ bộ',
    createdAt: '10/09/2026',
    lastContactDate: '12/09/2026',
    duplicateTargetId: 'KH-005',
    contacts: [
      {
        id: 'CT-601',
        name: 'Trương Kim Yến',
        title: 'Trưởng phòng Quản lý Đội xe Vận tải',
        email: 'yentk@vinamilk.com.vn',
        phone: '0918 333 444',
        isPrimary: true,
        sourceCustomerId: 'KH-006'
      }
    ],
    deals: [
      {
        id: 'DEAL-106',
        name: 'Phần mềm Giám sát Định vị GPS Đội xe Giao hàng Lạnh',
        amount: 195000000,
        stage: 'Gửi bản chào giá mẫu',
        probability: 40,
        expectedCloseDate: '28/11/2026',
        ownerName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-006'
      }
    ],
    activities: [
      {
        id: 'ACT-601',
        type: 'CALL',
        title: 'Anh Nam gọi chào hàng độc lập với chị Yến',
        content: 'Chị Yến phản hồi: "Bên chị đang đàm phán hợp đồng TMS lớn với bên em rồi mà, sao lại có bạn khác chào gói định vị rời thế này?"',
        date: '12/09/2026 11:30',
        creatorName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-006'
      }
    ]
  },

  {
    id: 'KH-007',
    code: 'VCB-BANK',
    name: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    taxCode: '0100112437',
    website: 'vietcombank.com.vn',
    phone: '024 3934 3137',
    email: 'contact@vietcombank.com.vn',
    address: 'Số 198 Trần Quang Khải, Hoàn Kiếm, Hà Nội',
    industry: 'Tài chính & Ngân hàng',
    revenueTier: 'Trên 70.000 tỷ VNĐ',
    employeeCount: 22000,
    ownerId: 'REP-01',
    ownerName: 'Nguyễn Hoàng Nam',
    ownerTeam: 'Nhóm Kinh doanh 1',
    status: 'Đã ký hợp đồng',
    createdAt: '15/04/2026',
    lastContactDate: '20/09/2026',
    duplicateTargetId: null, // Khách hàng an toàn
    contacts: [
      {
        id: 'CT-701',
        name: 'Bùi Đức Trọng',
        title: 'Giám đốc Trung tâm Dữ liệu VCB',
        email: 'trongbd@vietcombank.com.vn',
        phone: '0903 123 999',
        isPrimary: true,
        sourceCustomerId: 'KH-007'
      }
    ],
    deals: [
      {
        id: 'DEAL-107',
        name: 'Bảo trì Hệ thống Core Banking Định kỳ 2026 - 2027',
        amount: 1200000000,
        stage: 'Thực thi hợp đồng',
        probability: 100,
        expectedCloseDate: '01/09/2026',
        ownerName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-007'
      }
    ],
    activities: [
      {
        id: 'ACT-701',
        type: 'MEETING',
        title: 'Nghiệm thu giai đoạn 1 dịch vụ bảo trì định kỳ',
        content: 'Ký biên bản bàn giao và đánh giá hiệu năng hệ thống đạt cam kết.',
        date: '20/09/2026 09:00',
        creatorName: 'Nguyễn Hoàng Nam',
        sourceCustomerId: 'KH-007'
      }
    ]
  },

  {
    id: 'KH-008',
    code: 'VINGROUP',
    name: 'Tập đoàn Vingroup - Công ty CP',
    taxCode: '0101245486',
    website: 'vingroup.net',
    phone: '024 3974 9999',
    email: 'info@vingroup.net',
    address: 'Số 7 Đường Bằng Lăng 1, KĐT Sinh thái Vinhomes Riverside, Long Biên, Hà Nội',
    industry: 'Đa ngành (Bất động sản, Xe điện, Bán lẻ)',
    revenueTier: 'Trên 160.000 tỷ VNĐ',
    employeeCount: 60000,
    ownerId: 'REP-02',
    ownerName: 'Trần Thị Mai Linh',
    ownerTeam: 'Nhóm Kinh doanh 2',
    status: 'Đang liên hệ chào hàng',
    createdAt: '11/07/2026',
    lastContactDate: '15/09/2026',
    duplicateTargetId: null, // Khách hàng an toàn
    contacts: [
      {
        id: 'CT-801',
        name: 'Phạm Thị Thúy',
        title: 'Phó Ban Mua sắm Tập đoàn Vingroup',
        email: 'thuypt@vingroup.net',
        phone: '0988 555 666',
        isPrimary: true,
        sourceCustomerId: 'KH-008'
      }
    ],
    deals: [
      {
        id: 'DEAL-108',
        name: 'Phần mềm Quản lý Tài sản Doanh nghiệp EAM cho VinFast',
        amount: 720000000,
        stage: 'Thuyết trình giải pháp PoC',
        probability: 45,
        expectedCloseDate: '18/12/2026',
        ownerName: 'Trần Thị Mai Linh',
        sourceCustomerId: 'KH-008'
      }
    ],
    activities: [
      {
        id: 'ACT-801',
        type: 'EMAIL',
        title: 'Gửi profile năng lực nhà thầu và các dự án tiêu biểu',
        content: 'Đã gửi hồ sơ năng lực cho chị Thúy theo yêu cầu sau buổi gặp ngắn.',
        date: '15/09/2026 14:20',
        creatorName: 'Trần Thị Mai Linh',
        sourceCustomerId: 'KH-008'
      }
    ]
  }
];

export const INITIAL_MERGE_HISTORY = [
  {
    id: 'MRG-2026-001',
    mergedAt: '01/10/2026 15:45:12',
    approvedBy: 'Trần Mạnh Hùng (Trưởng nhóm kinh doanh)',
    primaryCustomer: {
      id: 'KH-098',
      name: 'Công ty Cổ phần Hàng Tiêu dùng Masan (Masan Consumer)',
      taxCode: '0302017440',
      ownerName: 'Nguyễn Hoàng Nam'
    },
    mergedCustomer: {
      id: 'KH-099',
      name: 'Masan Consumer - Chi nhánh Phía Bắc',
      taxCode: '0302017440-001',
      ownerName: 'Lê Văn Đạt'
    },
    matchReason: 'Trùng mã số thuế công ty mẹ (0302017440) và tên miền masanconsumer.com',
    transferredContactsCount: 3,
    transferredDealsCount: 2,
    totalPipelineValue: 420000000,
    transferredActivitiesCount: 5,
    coOwnerAssigned: 'Lê Văn Đạt (Đồng phụ trách)'
  }
];
