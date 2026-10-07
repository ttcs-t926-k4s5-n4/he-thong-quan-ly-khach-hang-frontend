// Mock Data for SCRUM-63 Price Catalog & Quotation Management System

export const INITIAL_PRODUCTS = [
  {
    id: 'PRD-001',
    code: 'SP-ERP-ENT',
    name: 'Phần mềm ERP Doanh nghiệp (Gói Doanh Nghiệp Lớn)',
    type: 'one_time', // 'one_time' (Sản phẩm một lần) | 'subscription' (Dịch vụ thuê bao)
    category: 'Phần mềm',
    unit: 'Gói bản quyền',
    listedPrice: 150000000, // 150 triệu VNĐ
    floorPrice: 120000000,  // 120 triệu VNĐ (Ngưỡng tự động duyệt, dưới mức này phải trình GĐ)
    costPrice: 65000000,    // 65 triệu VNĐ (Chỉ GĐKD xem & sửa)
    status: 'active',       // 'active' (Đang kinh doanh) | 'discontinued' (Ngừng kinh doanh)
    description: 'Hệ thống quản trị nguồn lực doanh nghiệp tích hợp Kế toán, Kho, Mua hàng, Nhân sự on-premise.',
    createdAt: '2026-01-15'
  },
  {
    id: 'PRD-002',
    code: 'SUB-CRM-PRO',
    name: 'Dịch vụ CRM Cloud Đa Kênh (Thuê bao Người dùng)',
    type: 'subscription',
    billingCycle: 'month',  // month | quarter | year
    category: 'Dịch vụ Cloud',
    unit: 'User/Tháng',
    listedPrice: 350000,
    floorPrice: 280000,
    costPrice: 110000,
    status: 'active',
    description: 'Nền tảng CRM điện toán đám mây kết nối Zalo OA, Facebook, Hotline tổng đài IP và quản lý phễu bán hàng.',
    createdAt: '2026-02-01'
  },
  {
    id: 'PRD-003',
    code: 'HW-SEC-FW500',
    name: 'Thiết bị Tường lửa Thế hệ mới Next-Gen FW500',
    type: 'one_time',
    category: 'Phần cứng',
    unit: 'Thiết bị',
    listedPrice: 48000000,
    floorPrice: 42000000,
    costPrice: 28000000,
    status: 'active',
    description: 'Tường lửa bảo mật phần cứng chống tấn công DDoS, lọc mã độc chuyên sâu, thông lượng 5 Gbps.',
    createdAt: '2026-02-20'
  },
  {
    id: 'PRD-004',
    code: 'SUB-SLA-247',
    name: 'Gói Dịch Vụ Hỗ Trợ Kỹ Thuật Cao Cấp SLA 24/7',
    type: 'subscription',
    billingCycle: 'year',
    category: 'Dịch vụ CNTT',
    unit: 'Gói/Năm',
    listedPrice: 60000000,
    floorPrice: 50000000,
    costPrice: 22000000,
    status: 'active',
    description: 'Cam kết phản hồi sự cố trong 15 phút, kỹ sư trực ca 24/7/365, bảo trì định kỳ hàng tháng.',
    createdAt: '2026-03-05'
  },
  {
    id: 'PRD-005',
    code: 'SRV-TRAIN-ON',
    name: 'Dịch Vụ Đào Tạo Vận Hành & Chuyển Giao Công Nghệ',
    type: 'one_time',
    category: 'Dịch vụ',
    unit: 'Khóa (3 ngày)',
    listedPrice: 25000000,
    floorPrice: 20000000,
    costPrice: 8500000,
    status: 'active',
    description: 'Đào tạo trực tiếp tại văn phòng khách hàng cho đội ngũ quản trị và người dùng cuối kèm tài liệu.',
    createdAt: '2026-03-12'
  },
  {
    id: 'PRD-006',
    code: 'SUB-AI-SEAT',
    name: 'Trợ Lý AI Phân Tích Dữ Liệu Bán Hàng Thông Minh',
    type: 'subscription',
    billingCycle: 'month',
    category: 'AI & Tự động hóa',
    unit: 'Tài khoản/Tháng',
    listedPrice: 850000,
    floorPrice: 650000,
    costPrice: 280000,
    status: 'active',
    description: 'Tích hợp mô hình AI phân tích xu hướng thị trường, dự báo doanh thu và đề xuất gợi ý bán chéo.',
    createdAt: '2026-04-01'
  },
  {
    id: 'PRD-007',
    code: 'SP-LEGACY-POS',
    name: 'Máy POS Bán Hàng Cầm Tay Đời Cũ V2 (Tồn kho)',
    type: 'one_time',
    category: 'Phần cứng',
    unit: 'Chiếc',
    listedPrice: 8500000,
    floorPrice: 7000000,
    costPrice: 5200000,
    status: 'discontinued', // Ngừng kinh doanh: Không cho đưa vào báo giá mới!
    description: 'Thiết bị POS thế hệ 2, nhà sản xuất đã dừng hỗ trợ linh kiện, ngưng chào bán mới từ Quý 3.',
    createdAt: '2025-11-10'
  },
  {
    id: 'PRD-008',
    code: 'SP-DEMO-TEST',
    name: 'Gói Khảo Sát Hệ Thống Hạ Tầng Sơ Bộ (Chưa có Báo giá)',
    type: 'one_time',
    category: 'Dịch vụ',
    unit: 'Lần khảo sát',
    listedPrice: 5000000,
    floorPrice: 4000000,
    costPrice: 1500000,
    status: 'active',
    description: 'Sản phẩm mới đưa vào danh mục, CHƯA TỪNG xuất hiện trong báo giá nào -> Có thể xoá thử nghiệm!',
    createdAt: '2026-09-28'
  }
];

export const INITIAL_QUOTES = [
  {
    id: 'BG-2026-001',
    code: 'BG-2026-001',
    customerName: 'Tập đoàn Công nghệ Viễn thông Phương Nam',
    contactPerson: 'Ông Trần Văn Nam (Giám đốc CNTT)',
    salesRep: 'Nguyễn Minh Tuấn (Chuyên viên KD)',
    createdAt: '2026-09-15',
    status: 'approved', // 'approved' | 'pending_approval' | 'rejected'
    items: [
      {
        productId: 'PRD-001',
        productCode: 'SP-ERP-ENT',
        productName: 'Phần mềm ERP Doanh nghiệp (Gói Doanh Nghiệp Lớn)',
        unit: 'Gói bản quyền',
        quantity: 1,
        listedPrice: 150000000,
        floorPrice: 120000000,
        offeredPrice: 135000000, // >= 120tr -> Hợp lệ, tự động duyệt
        requiresApproval: false
      },
      {
        productId: 'PRD-004',
        productCode: 'SUB-SLA-247',
        productName: 'Gói Dịch Vụ Hỗ Trợ Kỹ Thuật Cao Cấp SLA 24/7',
        unit: 'Gói/Năm',
        quantity: 1,
        listedPrice: 60000000,
        floorPrice: 50000000,
        offeredPrice: 55000000, // >= 50tr -> Hợp lệ
        requiresApproval: false
      }
    ],
    note: 'Khách hàng ký hợp đồng nguyên tắc 3 năm, áp dụng mức giá chuẩn theo bảng giá niêm yết.',
    approvalHistory: [
      {
        date: '2026-09-15 14:30',
        action: 'Tự động duyệt',
        by: 'Hệ thống Quản lý Bảng giá',
        comment: 'Tất cả đơn giá chào bán đều trên hoặc bằng Giá sàn niêm yết.'
      }
    ]
  },
  {
    id: 'BG-2026-002',
    code: 'BG-2026-002',
    customerName: 'Công ty Cổ phần Bán lẻ Thời trang An Thịnh',
    contactPerson: 'Bà Lê Thu Hà (Trưởng phòng Thu mua)',
    salesRep: 'Phạm Hồng Nhung (Nhân viên kinh doanh)',
    createdAt: '2026-09-22',
    status: 'pending_approval', // Cần duyệt chiết khấu vì có sản phẩm dưới giá sàn!
    items: [
      {
        productId: 'PRD-002',
        productCode: 'SUB-CRM-PRO',
        productName: 'Dịch vụ CRM Cloud Đa Kênh (Thuê bao Người dùng)',
        unit: 'User/Tháng',
        quantity: 50,
        listedPrice: 350000,
        floorPrice: 280000,
        offeredPrice: 240000, // < 280,000đ -> DƯỚI GIÁ SÀN! Bắt buộc trình GĐ
        requiresApproval: true,
        breachReason: 'Khách hàng mua số lượng lớn 50 user, cam kết thanh toán 1 lần cả năm.'
      },
      {
        productId: 'PRD-005',
        productCode: 'SRV-TRAIN-ON',
        productName: 'Dịch Vụ Đào Tạo Vận Hành & Chuyển Giao Công Nghệ',
        unit: 'Khóa (3 ngày)',
        quantity: 1,
        listedPrice: 25000000,
        floorPrice: 20000000,
        offeredPrice: 22000000,
        requiresApproval: false
      }
    ],
    note: 'Đề xuất Giám đốc duyệt giảm giá gói CRM Cloud xuống 240.000đ/user để chốt deal trước cuối tháng.',
    approvalHistory: [
      {
        date: '2026-09-22 09:15',
        action: 'Yêu cầu duyệt chiết khấu ngoại lệ',
        by: 'Phạm Hồng Nhung',
        comment: 'Đơn giá CRM Cloud (240.000đ) vi phạm giá sàn (280.000đ).'
      }
    ]
  },
  {
    id: 'BG-2026-003',
    code: 'BG-2026-003',
    customerName: 'Ngân hàng TMCP Quốc tế Thịnh Vượng',
    contactPerson: 'Ông Hoàng Quốc Bảo (Phó Ban Mua sắm Tập trung)',
    salesRep: 'Đỗ Hùng Dũng (Trưởng nhóm Kinh doanh)',
    createdAt: '2026-09-25',
    status: 'approved',
    items: [
      {
        productId: 'PRD-003',
        productCode: 'HW-SEC-FW500',
        productName: 'Thiết bị Tường lửa Thế hệ mới Next-Gen FW500',
        unit: 'Thiết bị',
        quantity: 2,
        listedPrice: 48000000,
        floorPrice: 42000000,
        offeredPrice: 45000000,
        requiresApproval: false
      }
    ],
    note: 'Cung cấp thiết bị tường lửa cho trung tâm dự phòng dữ liệu.',
    approvalHistory: [
      {
        date: '2026-09-25 11:00',
        action: 'Tự động duyệt',
        by: 'Hệ thống Quản lý Bảng giá',
        comment: 'Giá bán trong khung quy định.'
      }
    ]
  }
];

export const INITIAL_CATEGORIES = [
  'Tất cả danh mục',
  'Phần mềm',
  'Dịch vụ Cloud',
  'Phần cứng',
  'Dịch vụ CNTT',
  'Dịch vụ',
  'AI & Tự động hóa'
];

export const SAMPLE_CUSTOMERS = [
  { id: 'CUST-01', name: 'Tập đoàn Công nghệ Viễn thông Phương Nam', contact: 'Trần Văn Nam', email: 'nam.tv@phuongnamtech.vn' },
  { id: 'CUST-02', name: 'Công ty Cổ phần Bán lẻ Thời trang An Thịnh', contact: 'Lê Thu Hà', email: 'ha.le@anthinhretail.com' },
  { id: 'CUST-03', name: 'Ngân hàng TMCP Quốc tế Thịnh Vượng', contact: 'Hoàng Quốc Bảo', email: 'bao.hq@vpbanker.vn' },
  { id: 'CUST-04', name: 'Tổng Công ty Dược phẩm Quốc tế Medico', contact: 'Vũ Minh Tuấn', email: 'tuan.vm@medicocorp.com' },
  { id: 'CUST-05', name: 'Tập đoàn Sản xuất & Logistics Toàn Cầu', contact: 'Ngô Khánh Linh', email: 'linh.nk@globallogistics.vn' }
];
