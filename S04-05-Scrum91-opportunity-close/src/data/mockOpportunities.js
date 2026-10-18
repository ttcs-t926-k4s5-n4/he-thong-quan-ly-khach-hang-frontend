export const OPPORTUNITY_STAGES = {
  PROPOSAL: {
    id: 'PROPOSAL',
    label: 'Gửi Báo Giá',
    badgeClass: 'badge-proposal',
    isClosed: false
  },
  NEGOTIATION: {
    id: 'NEGOTIATION',
    label: 'Đang Đàm Phán',
    badgeClass: 'badge-negotiation',
    isClosed: false
  },
  CLOSED_WON: {
    id: 'CLOSED_WON',
    label: 'Đóng Thắng (Won)',
    badgeClass: 'badge-won',
    isClosed: true,
    isWon: true
  },
  CLOSED_LOST: {
    id: 'CLOSED_LOST',
    label: 'Đóng Thua (Lost)',
    badgeClass: 'badge-lost',
    isClosed: true,
    isWon: false
  }
};

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'OPP-2026-101',
    title: 'Triển khai CRM cho Tập đoàn Dệt may Hòa Phát',
    customerName: 'Tập đoàn Dệt may Hòa Phát',
    customerCode: 'KH-0081',
    industry: 'Sản xuất & Xuất khẩu',
    ownerId: 'USR-001',
    ownerName: 'Nguyễn Văn An',
    expectedValue: 120000000, // 120 triệu
    expectedCloseDate: '2026-10-25',
    stage: 'NEGOTIATION',
    probability: 85,
    isLocked: false,
    closedData: null,
    auditTrail: [
      {
        id: 'LOG-001',
        action: 'CREATED',
        timestamp: '2026-09-15 09:30',
        actor: 'Nguyễn Văn An',
        details: 'Khởi tạo cơ hội từ nguồn Lead Sự kiện Triển lãm VietFab 2026'
      },
      {
        id: 'LOG-002',
        action: 'STAGE_CHANGED',
        timestamp: '2026-10-02 14:15',
        actor: 'Nguyễn Văn An',
        details: 'Chuyển giai đoạn từ Gửi Báo Giá sang Đang Đàm Phán'
      }
    ]
  },
  {
    id: 'OPP-2026-102',
    title: 'Phần mềm Quản lý Kho & Bán hàng Chuỗi Phở 24',
    customerName: 'Công ty CP Ẩm thực Truyền thống Phở 24',
    customerCode: 'KH-0094',
    industry: 'F&B Chuỗi Nhà Hàng',
    ownerId: 'USR-003',
    ownerName: 'Lê Quốc Hưng',
    expectedValue: 75000000, // 75 triệu
    expectedCloseDate: '2026-10-28',
    stage: 'NEGOTIATION',
    probability: 70,
    isLocked: false,
    closedData: null,
    auditTrail: [
      {
        id: 'LOG-003',
        action: 'CREATED',
        timestamp: '2026-09-20 11:00',
        actor: 'Lê Quốc Hưng',
        details: 'Khởi tạo cơ hội tư vấn 12 chi nhánh chuỗi Phở 24'
      }
    ]
  },
  {
    id: 'OPP-2026-103',
    title: 'Hệ thống Omni-channel E-commerce VNP Group',
    customerName: 'Tập đoàn Thương mại Điện tử VNP',
    customerCode: 'KH-0055',
    industry: 'Thương mại Điện tử',
    ownerId: 'USR-002',
    ownerName: 'Trần Thị Mai',
    expectedValue: 350000000, // 350 triệu
    expectedCloseDate: '2026-11-10',
    stage: 'PROPOSAL',
    probability: 60,
    isLocked: false,
    closedData: null,
    auditTrail: [
      {
        id: 'LOG-004',
        action: 'CREATED',
        timestamp: '2026-09-28 16:45',
        actor: 'Trần Thị Mai',
        details: 'Gửi hồ sơ thầu giải pháp tích hợp Shopee, TikTok Shop, Lazada'
      }
    ]
  },
  {
    id: 'OPP-2026-104',
    title: 'Chuyển đổi số Call Center Logistics Giao Hàng Nhanh',
    customerName: 'Công ty Cổ phần Dịch vụ Giao Hàng Nhanh',
    customerCode: 'KH-0032',
    industry: 'Vận tải & Logistics',
    ownerId: 'USR-001',
    ownerName: 'Nguyễn Văn An',
    expectedValue: 220000000,
    expectedCloseDate: '2026-10-15',
    stage: 'CLOSED_WON',
    probability: 100,
    isLocked: true, // Cơ hội đã đóng bị khóa không cho sửa
    closedData: {
      type: 'WON',
      actualValue: 245000000, // Chốt thực tế 245 triệu (vượt 25 triệu)
      signedDate: '2026-10-12',
      contractNumber: 'HĐ-2026/088-GHN',
      winReasons: ['Giải pháp kỹ thuật ưu việt & Demo xuất sắc', 'Quan hệ khách hàng và dịch vụ chăm sóc tốt'],
      lessonsLearned: 'Buổi demo thực tế trên dữ liệu mô phỏng 10.000 đơn/ngày đã thuyết phục hoàn toàn Giám đốc Công nghệ (CTO).',
      closedAt: '2026-10-12 16:30',
      closedBy: 'Nguyễn Văn An'
    },
    auditTrail: [
      {
        id: 'LOG-005',
        action: 'CLOSED_WON',
        timestamp: '2026-10-12 16:30',
        actor: 'Nguyễn Văn An',
        details: 'Đóng Thắng cơ hội. Giá trị chốt: 245.000.000 ₫. HĐ số: HĐ-2026/088-GHN. Ngày ký: 12/10/2026. Đã tính vào KPI cá nhân.'
      }
    ]
  },
  {
    id: 'OPP-2026-105',
    title: 'Gói Bảo mật & Hạ tầng Đám mây Ngân hàng Seabank',
    customerName: 'Ngân hàng TMCP Đông Nam Á (Seabank)',
    customerCode: 'KH-0019',
    industry: 'Tài chính - Ngân hàng',
    ownerId: 'USR-002',
    ownerName: 'Trần Thị Mai',
    expectedValue: 500000000,
    expectedCloseDate: '2026-10-10',
    stage: 'CLOSED_LOST',
    probability: 0,
    isLocked: true, // Cơ hội đã đóng bị khóa không cho sửa
    closedData: {
      type: 'LOST',
      lossReason: 'Đối thủ cạnh tranh có quan hệ sâu hơn',
      lossCategory: 'competition',
      competitorId: 'COMP-01',
      competitorName: 'Viettel Solutions',
      competitorPrice: 460000000,
      lessonsLearned: 'Đối thủ bán combo hạ tầng truyền dẫn mạng nội bộ chuyên dụng đã có sẵn với ngân hàng kèm gói phần mềm nên giá tổng thể rẻ hơn 8%. Bài học: Cần liên minh nhà mạng từ sớm.',
      closedAt: '2026-10-09 11:15',
      closedBy: 'Trần Thị Mai'
    },
    auditTrail: [
      {
        id: 'LOG-006',
        action: 'CLOSED_LOST',
        timestamp: '2026-10-09 11:15',
        actor: 'Trần Thị Mai',
        details: 'Đóng Thua cơ hội. Lý do: Đối thủ cạnh tranh có quan hệ sâu hơn (Viettel Solutions). Đã ghi nhận báo cáo phân tích đối thủ.'
      }
    ]
  },
  {
    id: 'OPP-2026-106',
    title: 'Phần mềm Quản lý Nhân sự & KPI Tập đoàn Tân Á Đại Thành',
    customerName: 'Tập đoàn Tân Á Đại Thành',
    customerCode: 'KH-0044',
    industry: 'Cơ khí & Vật liệu xây dựng',
    ownerId: 'USR-001',
    ownerName: 'Nguyễn Văn An',
    expectedValue: 180000000,
    expectedCloseDate: '2026-10-05',
    stage: 'CLOSED_WON',
    probability: 100,
    isLocked: true,
    closedData: {
      type: 'WON',
      actualValue: 180000000,
      signedDate: '2026-10-05',
      contractNumber: 'HĐ-2026/072-TADT',
      winReasons: ['Cam kết tiến độ bàn giao nhanh chóng', 'Thương hiệu uy tín và nhiều khách hàng tiêu biểu tương đồng'],
      lessonsLearned: 'Cam kết cử chuyên gia onsite hỗ trợ trực tiếp 2 tuần đầu khai trương phân hệ là yếu tố quyết định.',
      closedAt: '2026-10-05 15:00',
      closedBy: 'Nguyễn Văn An'
    },
    auditTrail: [
      {
        id: 'LOG-007',
        action: 'CLOSED_WON',
        timestamp: '2026-10-05 15:00',
        actor: 'Nguyễn Văn An',
        details: 'Đóng Thắng cơ hội. Giá trị chốt: 180.000.000 ₫. HĐ số: HĐ-2026/072-TADT. Đã tính vào KPI cá nhân.'
      }
    ]
  },
  {
    id: 'OPP-2026-107',
    title: 'Nâng cấp Hệ thống Vé & Core Billing Xe Khách Phương Trang',
    customerName: 'Công ty Cổ phần Xe Khách Phương Trang (FUTA Bus Lines)',
    customerCode: 'KH-0063',
    industry: 'Vận tải hành khách',
    ownerId: 'USR-003',
    ownerName: 'Lê Quốc Hưng',
    expectedValue: 90000000,
    expectedCloseDate: '2026-10-08',
    stage: 'CLOSED_LOST',
    probability: 0,
    isLocked: true,
    closedData: {
      type: 'LOST',
      lossReason: 'Giá quá cao so với ngân sách khách hàng',
      lossCategory: 'pricing',
      competitorId: 'COMP-05',
      competitorName: 'MISA AMIS',
      competitorPrice: 65000000,
      lessonsLearned: 'Khách hàng có ngân sách cố định 70 triệu. Gói chào thầu của ta chứa quá nhiều tính năng enterprise mà khách chưa dùng tới. Nên tách gói Starter tinh gọn hơn.',
      closedAt: '2026-10-08 17:20',
      closedBy: 'Lê Quốc Hưng'
    },
    auditTrail: [
      {
        id: 'LOG-008',
        action: 'CLOSED_LOST',
        timestamp: '2026-10-08 17:20',
        actor: 'Lê Quốc Hưng',
        details: 'Đóng Thua cơ hội. Lý do: Giá quá cao so với ngân sách khách hàng. Đối thủ: MISA AMIS.'
      }
    ]
  },
  {
    id: 'OPP-2026-108',
    title: 'Cổng Quản lý Dịch vụ Cư dân Bất động sản Novaland',
    customerName: 'Tập đoàn Đầu tư Địa ốc No Va (Novaland)',
    customerCode: 'KH-0012',
    industry: 'Bất động sản & Nghỉ dưỡng',
    ownerId: 'USR-002',
    ownerName: 'Trần Thị Mai',
    expectedValue: 420000000,
    expectedCloseDate: '2026-10-31',
    stage: 'NEGOTIATION',
    probability: 75,
    isLocked: false,
    closedData: null,
    auditTrail: [
      {
        id: 'LOG-009',
        action: 'CREATED',
        timestamp: '2026-09-10 10:00',
        actor: 'Trần Thị Mai',
        details: 'Khởi tạo cơ hội tích hợp Smart Home và thanh toán phí quản lý cư dân'
      }
    ]
  }
];
