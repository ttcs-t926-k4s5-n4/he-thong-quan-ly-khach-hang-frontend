// Dữ liệu mẫu danh mục dùng chung bán hàng (SCRUM-65)
// Thiết kế cho Giám đốc kinh doanh quản trị chuẩn hóa toàn khối

export const CATEGORY_DEFINITIONS = [
  {
    id: 'industries',
    code: 'CAT_INDUSTRY',
    name: 'Ngành nghề khách hàng',
    shortName: 'Ngành nghề',
    description: 'Phân loại lĩnh vực sản xuất kinh doanh của khách hàng doanh nghiệp để đo lường hiệu quả bán hàng theo ngành.',
    iconName: 'Building2',
    color: '#3b82f6',
    crmFieldLabel: 'Lĩnh vực kinh doanh',
    sampleUsage: 'Hồ sơ khách hàng, Đăng ký Lead, Phân tích Doanh số theo ngành'
  },
  {
    id: 'company_sizes',
    code: 'CAT_COMPANY_SIZE',
    name: 'Quy mô doanh nghiệp',
    shortName: 'Quy mô DN',
    description: 'Phân khúc quy mô nhân sự và doanh thu của tổ chức khách hàng để định tuyến cho đội SME hoặc Enterprise.',
    iconName: 'Users2',
    color: '#10b981',
    crmFieldLabel: 'Quy mô nhân sự',
    sampleUsage: 'Chấm điểm tiềm năng Lead, Phân bổ người phụ trách, Báo cáo AOV'
  },
  {
    id: 'lead_sources',
    code: 'CAT_LEAD_SOURCE',
    name: 'Nguồn lead',
    shortName: 'Nguồn Lead',
    description: 'Kênh thu hút đầu mối bán hàng ban đầu để đánh giá ROI các chiến dịch Marketing và kênh phân phối.',
    iconName: 'Compass',
    color: '#f59e0b',
    crmFieldLabel: 'Kênh tiếp cận',
    sampleUsage: 'Form đăng ký Lead, Báo cáo hiệu quả Marketing, Phân tích CAC/LTV'
  },
  {
    id: 'activity_types',
    code: 'CAT_ACTIVITY_TYPE',
    name: 'Loại hoạt động',
    shortName: 'Loại hoạt động',
    description: 'Các hình thức tương tác giữa chuyên viên bán hàng và khách hàng nhằm chuẩn hóa KPI hoạt động kinh doanh.',
    iconName: 'CalendarCheck2',
    color: '#8b5cf6',
    crmFieldLabel: 'Hình thức tương tác',
    sampleUsage: 'Lịch làm việc, Nhật ký cuộc gọi, Đánh giá năng suất Sales rep'
  }
];

// Danh sách các mục thuộc từng danh mục
export const INITIAL_CATEGORY_ITEMS = {
  // 1. NGÀNH NGHỀ KHÁCH HÀNG
  industries: [
    {
      id: 'ind-tech',
      code: 'IND_TECH',
      name: 'Công nghệ thông tin & Viễn thông',
      description: 'Doanh nghiệp SaaS, phát triển phần mềm, tích hợp hệ thống, IDC và viễn thông.',
      color: '#3b82f6',
      icon: 'Laptop',
      sortOrder: 1,
      isActive: true,
      isDefault: true,
      createdDate: '2026-01-10'
    },
    {
      id: 'ind-manuf',
      code: 'IND_MANUF',
      name: 'Sản xuất & Chế tạo công nghiệp',
      description: 'Nhà máy cơ khí, điện tử tử, dệt may, da giày, chế biến xuất khẩu.',
      color: '#10b981',
      icon: 'Factory',
      sortOrder: 2,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'ind-retail',
      code: 'IND_RETAIL',
      name: 'Bán lẻ & Thương mại điện tử',
      description: 'Chuỗi cửa hàng, siêu thị bán lẻ, sàn TMĐT và thương mại phân phối tiêu dùng.',
      color: '#f59e0b',
      icon: 'ShoppingBag',
      sortOrder: 3,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'ind-fin',
      code: 'IND_FIN',
      name: 'Tài chính, Ngân hàng & Bảo hiểm',
      description: 'Ngân hàng thương mại, công ty chứng khoán, bảo hiểm, fintech & quỹ đầu tư.',
      color: '#8b5cf6',
      icon: 'Landmark',
      sortOrder: 4,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-12'
    },
    {
      id: 'ind-real',
      code: 'IND_REAL',
      name: 'Bất động sản & Xây dựng',
      description: 'Chủ đầu tư BĐS, sàn giao dịch môi giới, tổng thầu xây lắp công trình dân dụng.',
      color: '#ec4899',
      icon: 'Building',
      sortOrder: 5,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-12'
    },
    {
      id: 'ind-health',
      code: 'IND_HEALTH',
      name: 'Y tế, Dược phẩm & Chăm sóc sức khỏe',
      description: 'Bệnh viện, phòng khám đa khoa, chuỗi nhà thuốc, hãng dược và vật tư y tế.',
      color: '#06b6d4',
      icon: 'Stethoscope',
      sortOrder: 6,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-15'
    },
    {
      id: 'ind-edu',
      code: 'IND_EDU',
      name: 'Giáo dục, Đào tạo & EdTech',
      description: 'Hệ thống trường học, trung tâm ngoại ngữ, viện đào tạo nghề và nền tảng EdTech.',
      color: '#14b8a6',
      icon: 'GraduationCap',
      sortOrder: 7,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-15'
    },
    {
      id: 'ind-log',
      code: 'IND_LOG',
      name: 'Logistics, Kho bãi & Vận tải',
      description: 'Giao nhận chuyển phát, vận tải đa phương thức, cảng biển và quản lý kho vận.',
      color: '#6366f1',
      icon: 'Truck',
      sortOrder: 8,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-20'
    },
    {
      id: 'ind-fnb',
      code: 'IND_FNB',
      name: 'Dịch vụ Ẩm thực, Nhà hàng & Khách sạn (F&B)',
      description: 'Chuỗi cà phê, nhà hàng ẩm thực, resort nghỉ dưỡng và khách sạn quốc tế.',
      color: '#f97316',
      icon: 'UtensilsCrossed',
      sortOrder: 9,
      isActive: false, // Tạm ngưng
      isDefault: false,
      createdDate: '2026-02-01'
    },
    {
      id: 'ind-demo-del',
      code: 'IND_OTHER_EXP',
      name: 'Mục thử nghiệm ngành nghề mới (Chưa có dữ liệu)',
      description: 'Mục danh mục thử nghiệm vừa tạo, chưa có khách hàng hay cơ hội nào liên kết (Cho phép xóa tự do để kiểm tra).',
      color: '#64748b',
      icon: 'HelpCircle',
      sortOrder: 10,
      isActive: true,
      isDefault: false,
      createdDate: '2026-03-01'
    }
  ],

  // 2. QUY MÔ DOANH NGHIỆP
  company_sizes: [
    {
      id: 'size-micro',
      code: 'SIZE_MICRO',
      name: 'Siêu nhỏ (Dưới 10 nhân sự)',
      description: 'Doanh nghiệp khởi nghiệp, hộ kinh doanh cá thể, nhóm làm việc độc lập.',
      color: '#94a3b8',
      icon: 'User',
      sortOrder: 1,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'size-small',
      code: 'SIZE_SMALL',
      name: 'Nhỏ (10 - 49 nhân sự)',
      description: 'Doanh nghiệp SME đang đà phát triển, quy trình vận hành linh hoạt.',
      color: '#3b82f6',
      icon: 'Users',
      sortOrder: 2,
      isActive: true,
      isDefault: true,
      createdDate: '2026-01-10'
    },
    {
      id: 'size-med',
      code: 'SIZE_MEDIUM',
      name: 'Vừa (50 - 299 nhân sự)',
      description: 'Doanh nghiệp có cơ cấu phòng ban rõ ràng, nhu cầu chuẩn hóa dữ liệu cao.',
      color: '#10b981',
      icon: 'UsersRound',
      sortOrder: 3,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'size-large',
      code: 'SIZE_LARGE',
      name: 'Lớn (300 - 999 nhân sự)',
      description: 'Doanh nghiệp nhiều chi nhánh, quy trình đấu thầu và phê duyệt nhiều cấp.',
      color: '#f59e0b',
      icon: 'Building2',
      sortOrder: 4,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'size-ent',
      code: 'SIZE_ENTERPRISE',
      name: 'Tập đoàn Enterprise (1.000+ nhân sự)',
      description: 'Tập đoàn đa quốc gia, tổng công ty nhà nước hoặc tập đoàn niêm yết lớn.',
      color: '#8b5cf6',
      icon: 'Crown',
      sortOrder: 5,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'size-demo-del',
      code: 'SIZE_CUSTOM_TEMP',
      name: 'Quy mô chi nhánh vệ tinh (Chưa có dữ liệu)',
      description: 'Mục quy mô đặc thù vừa khai báo thử nghiệm, chưa được gán vào khách hàng nào (Có thể xóa an toàn).',
      color: '#64748b',
      icon: 'Layers',
      sortOrder: 6,
      isActive: true,
      isDefault: false,
      createdDate: '2026-03-01'
    }
  ],

  // 3. NGUỒN LEAD
  lead_sources: [
    {
      id: 'src-web',
      code: 'SRC_WEBSITE',
      name: 'Website / Inbound Form',
      description: 'Khách hàng chủ động điền form đăng ký tư vấn, yêu cầu báo giá trên website chính thức.',
      color: '#3b82f6',
      icon: 'Globe',
      sortOrder: 1,
      isActive: true,
      isDefault: true,
      createdDate: '2026-01-10'
    },
    {
      id: 'src-ref',
      code: 'SRC_REFERRAL',
      name: 'Khách hàng cũ giới thiệu (Referral)',
      description: 'Được đối tác hoặc khách hàng hiện tại tin tưởng giới thiệu trực tiếp cho đội bán hàng.',
      color: '#10b981',
      icon: 'Share2',
      sortOrder: 2,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'src-event',
      code: 'SRC_EVENT',
      name: 'Sự kiện, Triển lãm & Hội thảo chuyên ngành',
      description: 'Thu thập thông tin danh thiếp và QR code tại các hội chợ thương mại B2B.',
      color: '#f59e0b',
      icon: 'Sparkles',
      sortOrder: 3,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'src-ads',
      code: 'SRC_DIGITAL_ADS',
      name: 'Quảng cáo số (Google Ads / Facebook Ads)',
      description: 'Lead thu về từ các chiến dịch Marketing có trả phí trên Google Search, Youtube và Meta.',
      color: '#ef4444',
      icon: 'Megaphone',
      sortOrder: 4,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'src-outbound',
      code: 'SRC_COLD_OUTREACH',
      name: 'Outbound Telesales & Cold Email B2B',
      description: 'Nhân viên kinh doanh chủ động liên hệ danh sách khách hàng mục tiêu qua điện thoại hoặc email.',
      color: '#8b5cf6',
      icon: 'PhoneCall',
      sortOrder: 5,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'src-partner',
      code: 'SRC_PARTNER',
      name: 'Kênh Đối tác phân phối & Reseller',
      description: 'Lead do các đại lý liên minh, nhà phân phối ủy quyền chia sẻ dữ liệu.',
      color: '#06b6d4',
      icon: 'Handshake',
      sortOrder: 6,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-15'
    },
    {
      id: 'src-linkedin',
      code: 'SRC_LINKEDIN',
      name: 'Mạng xã hội Doanh nghiệp (LinkedIn)',
      description: 'Tiếp cận các Giám đốc công nghệ, Trưởng phòng mua hàng qua tin nhắn InMail trên LinkedIn.',
      color: '#0284c7',
      icon: 'Linkedin',
      sortOrder: 7,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-15'
    },
    {
      id: 'src-demo-del',
      code: 'SRC_PILOT_CAMPAIGN',
      name: 'Chiến dịch dùng thử mùa Lễ Tết (Chưa có dữ liệu)',
      description: 'Kênh thử nghiệm ngắn hạn đã ngưng chạy, không có cơ hội hay lead nào ràng buộc (Có thể xóa).',
      color: '#64748b',
      icon: 'Tag',
      sortOrder: 8,
      isActive: true,
      isDefault: false,
      createdDate: '2026-03-01'
    }
  ],

  // 4. LOẠI HOẠT ĐỘNG
  activity_types: [
    {
      id: 'act-call',
      code: 'ACT_CALL',
      name: 'Cuộc gọi điện tư vấn (Sales Call)',
      description: 'Trao đổi qua điện thoại thoại để khảo sát nhu cầu, làm rõ yêu cầu dự án.',
      color: '#3b82f6',
      icon: 'Phone',
      sortOrder: 1,
      isActive: true,
      isDefault: true,
      createdDate: '2026-01-10'
    },
    {
      id: 'act-meet',
      code: 'ACT_MEETING',
      name: 'Gặp mặt trực tiếp tại văn phòng (Face-to-Face Meeting)',
      description: 'Đến trực tiếp trụ sở doanh nghiệp khách hàng để đàm phán giải pháp chuyên sâu.',
      color: '#10b981',
      icon: 'Briefcase',
      sortOrder: 2,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'act-demo',
      code: 'ACT_ONLINE_DEMO',
      name: 'Trình diễn giải pháp trực tuyến (Online Demo)',
      description: 'Chia sẻ màn hình qua MS Teams / Zoom để demo chi tiết các tính năng sản phẩm.',
      color: '#8b5cf6',
      icon: 'Video',
      sortOrder: 3,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'act-email',
      code: 'ACT_EMAIL',
      name: 'Gửi Email báo giá & Hồ sơ năng lực',
      description: 'Gửi bảng tính chi phí dự toán, hợp đồng mẫu và tài liệu kỹ thuật qua email.',
      color: '#f59e0b',
      icon: 'Mail',
      sortOrder: 4,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-10'
    },
    {
      id: 'act-proposal',
      code: 'ACT_PROPOSAL',
      name: 'Thuyết trình đề xuất giải pháp (Proposal Defense)',
      description: 'Trình bày trước hội đồng thẩm định và ban giám đốc bên mua.',
      color: '#ec4899',
      icon: 'Presentation',
      sortOrder: 5,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-12'
    },
    {
      id: 'act-sign',
      code: 'ACT_SIGNING',
      name: 'Ký kết hợp đồng & Bàn giao dự án',
      description: 'Hoàn tất thủ tục pháp lý, nhận tạm ứng và chuyển giao cho bộ phận triển khai.',
      color: '#14b8a6',
      icon: 'FileCheck',
      sortOrder: 6,
      isActive: true,
      isDefault: false,
      createdDate: '2026-01-15'
    },
    {
      id: 'act-care',
      code: 'ACT_CARE',
      name: 'Chăm sóc sau bán & Hỗ trợ kỹ thuật',
      description: 'Hỏi thăm định kỳ mức độ hài lòng, hỗ trợ giải quyết thắc mắc trong quá trình vận hành.',
      color: '#06b6d4',
      icon: 'HeartHandshake',
      sortOrder: 7,
      isActive: false, // Tạm ngưng
      isDefault: false,
      createdDate: '2026-02-01'
    },
    {
      id: 'act-demo-del',
      code: 'ACT_SMS_ARCHIVE',
      name: 'Gửi tin nhắn SMS Brandname (Cũ - Không sử dụng)',
      description: 'Loại hoạt động gửi SMS hàng loạt của năm trước, hiện không có lịch trình hay báo cáo nào liên kết.',
      color: '#64748b',
      icon: 'MessageSquare',
      sortOrder: 8,
      isActive: true,
      isDefault: false,
      createdDate: '2026-03-01'
    }
  ]
};

// Dữ liệu CRM vận hành (Khách hàng, Lead, Cơ hội, Hoạt động)
// Dùng để kiểm tra ràng buộc tham chiếu xóa và xuất báo cáo gộp
export const INITIAL_OPERATIONAL_DATA = {
  // DANH SÁCH KHÁCH HÀNG DOANH NGHIỆP
  customers: [
    {
      id: 'CUST-001',
      code: 'KH-VNG',
      name: 'Công ty Cổ phần VNG Corporation',
      industryId: 'ind-tech',
      companySizeId: 'size-ent',
      leadSourceId: 'src-ref',
      annualRevenue: 8500000000,
      contactPerson: 'Lê Hồng Minh (Tổng Giám Đốc)',
      phone: '028 3822 5566',
      city: 'TP. Hồ Chí Minh',
      status: 'Active'
    },
    {
      id: 'CUST-002',
      code: 'KH-VINFAST',
      name: 'Tổ hợp Sản xuất Ô tô VinFast Hải Phòng',
      industryId: 'ind-manuf',
      companySizeId: 'size-ent',
      leadSourceId: 'src-event',
      annualRevenue: 24000000000,
      contactPerson: 'Trần Đình Long (Trưởng ban Mua sắm)',
      phone: '0225 398 7788',
      city: 'Hải Phòng',
      status: 'Active'
    },
    {
      id: 'CUST-003',
      code: 'KH-MWG',
      name: 'Tập đoàn Thế Giới Di Động (MWG)',
      industryId: 'ind-retail',
      companySizeId: 'size-ent',
      leadSourceId: 'src-ref',
      annualRevenue: 15200000000,
      contactPerson: 'Đoàn Văn Hiểu Em (Giám đốc Khối)',
      phone: '028 3812 5960',
      city: 'TP. Hồ Chí Minh',
      status: 'Active'
    },
    {
      id: 'CUST-004',
      code: 'KH-TECHCOMBANK',
      name: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)',
      industryId: 'ind-fin',
      companySizeId: 'size-ent',
      leadSourceId: 'src-partner',
      annualRevenue: 18900000000,
      contactPerson: 'Nguyễn Thị Bích (Head of Procurement)',
      phone: '024 3944 6368',
      city: 'Hà Nội',
      status: 'Active'
    },
    {
      id: 'CUST-005',
      code: 'KH-NOVANET',
      name: 'Công ty Cổ phần Công nghệ NovaNet',
      industryId: 'ind-tech',
      companySizeId: 'size-small',
      leadSourceId: 'src-web',
      annualRevenue: 1200000000,
      contactPerson: 'Vũ Đức Nam (CEO)',
      phone: '090 321 4455',
      city: 'Đà Nẵng',
      status: 'Active'
    },
    {
      id: 'CUST-006',
      code: 'KH-MEDLATEC',
      name: 'Bệnh viện Đa khoa MEDLATEC',
      industryId: 'ind-health',
      companySizeId: 'size-large',
      leadSourceId: 'src-ads',
      annualRevenue: 4600000000,
      contactPerson: 'BS. Bùi Quang Hưng (Phó Giám đốc)',
      phone: '024 3716 2066',
      city: 'Hà Nội',
      status: 'Active'
    },
    {
      id: 'CUST-007',
      code: 'KH-TOPICA',
      name: 'Tổ hợp Công nghệ Giáo dục TOPICA Edtech',
      industryId: 'ind-edu',
      companySizeId: 'size-med',
      leadSourceId: 'src-linkedin',
      annualRevenue: 3400000000,
      contactPerson: 'Trần Hoài An (Trưởng phòng CNTT)',
      phone: '024 7300 2000',
      city: 'Hà Nội',
      status: 'Active'
    },
    {
      id: 'CUST-008',
      code: 'KH-GHN',
      name: 'Giao Hàng Nhanh Express (Fast Delivery)',
      industryId: 'ind-log',
      companySizeId: 'size-large',
      leadSourceId: 'src-outbound',
      annualRevenue: 6200000000,
      contactPerson: 'Nguyễn Trần Thi (COO)',
      phone: '028 7300 1200',
      city: 'TP. Hồ Chí Minh',
      status: 'Active'
    },
    {
      id: 'CUST-009',
      code: 'KH-DATXANH',
      name: 'Tập đoàn Đất Xanh Group',
      industryId: 'ind-real',
      companySizeId: 'size-large',
      leadSourceId: 'src-event',
      annualRevenue: 7800000000,
      contactPerson: 'Lương Trí Thìn (Chủ tịch HĐQT)',
      phone: '028 6252 5252',
      city: 'TP. Hồ Chí Minh',
      status: 'Active'
    },
    {
      id: 'CUST-010',
      code: 'KH-GOLDEN-GATE',
      name: 'Golden Gate Restaurant Group',
      industryId: 'ind-fnb',
      companySizeId: 'size-large',
      leadSourceId: 'src-ref',
      annualRevenue: 5300000000,
      contactPerson: 'Đào Thế Vinh (Giám đốc vận hành)',
      phone: '024 3222 3000',
      city: 'Hà Nội',
      status: 'Active'
    },
    {
      id: 'CUST-011',
      code: 'KH-APTECH',
      name: 'Học viện Lập trình Quốc tế FPT-Aptech',
      industryId: 'ind-edu',
      companySizeId: 'size-small',
      leadSourceId: 'src-web',
      annualRevenue: 850000000,
      contactPerson: 'Dương Trọng Hải (Giám đốc Đào tạo)',
      phone: '024 7300 8855',
      city: 'Hà Nội',
      status: 'Active'
    },
    {
      id: 'CUST-012',
      code: 'KH-VIETTIEN',
      name: 'Tổng Công ty May Việt Tiến',
      industryId: 'ind-manuf',
      companySizeId: 'size-ent',
      leadSourceId: 'src-outbound',
      annualRevenue: 11200000000,
      contactPerson: 'Bùi Văn Tiến (Phó Tổng GĐ)',
      phone: '028 3864 0800',
      city: 'TP. Hồ Chí Minh',
      status: 'Active'
    }
  ],

  // DANH SÁCH LEADS (ĐẦU MỐI BÁN HÀNG)
  leads: [
    {
      id: 'LEAD-001',
      name: 'Nguyễn Quốc Bảo',
      title: 'Giám đốc Chuyển đổi số',
      company: 'Công ty Cổ phần Vua Nệm',
      industryId: 'ind-retail',
      companySizeId: 'size-med',
      leadSourceId: 'src-web',
      estimatedValue: 450000000,
      status: 'Qualified',
      assignedTo: 'Trần Văn Mạnh (Sales Miền Bắc)',
      createdDate: '2026-02-14'
    },
    {
      id: 'LEAD-002',
      name: 'Phạm Thị Thùy Dung',
      title: 'Trưởng phòng Cung ứng',
      company: 'Dược phẩm Hậu Giang (DHG Pharma)',
      industryId: 'ind-health',
      companySizeId: 'size-large',
      leadSourceId: 'src-event',
      estimatedValue: 1200000000,
      status: 'Contacted',
      assignedTo: 'Lê Hoàng Long (Sales Miền Tây)',
      createdDate: '2026-02-18'
    },
    {
      id: 'LEAD-003',
      name: 'Vũ Hoàng Quân',
      title: 'CTO',
      company: 'NextTech Fintech Ecosystem',
      industryId: 'ind-fin',
      companySizeId: 'size-large',
      leadSourceId: 'src-linkedin',
      estimatedValue: 900000000,
      status: 'Proposal',
      assignedTo: 'Nguyễn Bích Ngọc (Key Account)',
      createdDate: '2026-02-20'
    },
    {
      id: 'LEAD-004',
      name: 'Hoàng Minh Tuấn',
      title: 'Giám đốc Vận hành',
      company: 'Logistics Viettel Post',
      industryId: 'ind-log',
      companySizeId: 'size-ent',
      leadSourceId: 'src-partner',
      estimatedValue: 2500000000,
      status: 'Negotiation',
      assignedTo: 'Trần Văn Mạnh (Sales Miền Bắc)',
      createdDate: '2026-02-22'
    },
    {
      id: 'LEAD-005',
      name: 'Đặng Thanh Thảo',
      title: 'Phó Hiệu trưởng',
      company: 'Trường Đại học Quốc tế RMIT Việt Nam',
      industryId: 'ind-edu',
      companySizeId: 'size-large',
      leadSourceId: 'src-ref',
      estimatedValue: 800000000,
      status: 'Qualified',
      assignedTo: 'Phạm Hồng Ánh (Sales Miền Nam)',
      createdDate: '2026-02-24'
    },
    {
      id: 'LEAD-006',
      name: 'Trịnh Đình Quang',
      title: 'Trưởng phòng IT',
      company: 'Nhà máy Thép Hòa Phát Dung Quất',
      industryId: 'ind-manuf',
      companySizeId: 'size-ent',
      leadSourceId: 'src-outbound',
      estimatedValue: 3200000000,
      status: 'Demo',
      assignedTo: 'Lê Hoàng Long (Sales Miền Trung)',
      createdDate: '2026-02-25'
    },
    {
      id: 'LEAD-007',
      name: 'Ngô Kim Anh',
      title: 'Marketing Director',
      company: 'Chuỗi Trà sữa Phúc Long Heritage',
      industryId: 'ind-fnb',
      companySizeId: 'size-med',
      leadSourceId: 'src-ads',
      estimatedValue: 350000000,
      status: 'New',
      assignedTo: 'Phạm Hồng Ánh (Sales Miền Nam)',
      createdDate: '2026-02-27'
    },
    {
      id: 'LEAD-008',
      name: 'Lý Quốc Cường',
      title: 'Founder & CEO',
      company: 'Startup AI Robotica Labs',
      industryId: 'ind-tech',
      companySizeId: 'size-micro',
      leadSourceId: 'src-web',
      estimatedValue: 180000000,
      status: 'Qualified',
      assignedTo: 'Nguyễn Bích Ngọc (Inbound Sales)',
      createdDate: '2026-03-01'
    },
    {
      id: 'LEAD-009',
      name: 'Bùi Thu Hằng',
      title: 'Phó TGĐ Kinh doanh',
      company: 'Tập đoàn Bất động sản Hưng Thịnh Corp',
      industryId: 'ind-real',
      companySizeId: 'size-ent',
      leadSourceId: 'src-ref',
      estimatedValue: 1800000000,
      status: 'Proposal',
      assignedTo: 'Trần Văn Mạnh (Key Account)',
      createdDate: '2026-03-02'
    },
    {
      id: 'LEAD-010',
      name: 'Trương Gia Huy',
      title: 'Quản lý Chuỗi',
      company: 'Siêu thị Điện máy Chợ Lớn',
      industryId: 'ind-retail',
      companySizeId: 'size-large',
      leadSourceId: 'src-ads',
      estimatedValue: 750000000,
      status: 'Contacted',
      assignedTo: 'Phạm Hồng Ánh (Sales Miền Nam)',
      createdDate: '2026-03-03'
    }
  ],

  // DANH SÁCH CƠ HỘI KINH DOANH (DEALS / OPPORTUNITIES)
  deals: [
    {
      id: 'DEAL-001',
      title: 'Triển khai Nền tảng AI Cloud cho VNG Game Studio',
      customer: 'Công ty Cổ phần VNG Corporation',
      industryId: 'ind-tech',
      companySizeId: 'size-ent',
      leadSourceId: 'src-ref',
      amount: 3500000000,
      stage: 'Closed-Won',
      closeDate: '2026-02-10'
    },
    {
      id: 'DEAL-002',
      title: 'Hệ thống Quản lý Chuỗi Cung ứng Smart Factory',
      customer: 'Tổ hợp Sản xuất Ô tô VinFast Hải Phòng',
      industryId: 'ind-manuf',
      companySizeId: 'size-ent',
      leadSourceId: 'src-event',
      amount: 8200000000,
      stage: 'Negotiation',
      closeDate: '2026-03-30'
    },
    {
      id: 'DEAL-003',
      title: 'Nâng cấp Hạ tầng Omni-Channel 3.000 Điểm bán',
      customer: 'Tập đoàn Thế Giới Di Động (MWG)',
      industryId: 'ind-retail',
      companySizeId: 'size-ent',
      leadSourceId: 'src-ref',
      amount: 4800000000,
      stage: 'Closed-Won',
      closeDate: '2026-01-25'
    },
    {
      id: 'DEAL-004',
      title: 'Giải pháp Phân tích Dữ liệu Khách hàng VIP',
      customer: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)',
      industryId: 'ind-fin',
      companySizeId: 'size-ent',
      leadSourceId: 'src-partner',
      amount: 5100000000,
      stage: 'Proposal',
      closeDate: '2026-04-15'
    },
    {
      id: 'DEAL-005',
      title: 'Phần mềm Quản lý Bệnh án Điện tử EMR',
      customer: 'Bệnh viện Đa khoa MEDLATEC',
      industryId: 'ind-health',
      companySizeId: 'size-large',
      leadSourceId: 'src-ads',
      amount: 1950000000,
      stage: 'Closed-Won',
      closeDate: '2026-02-15'
    },
    {
      id: 'DEAL-006',
      title: 'Hệ thống LMS & Khảo thí Trực tuyến Thế hệ mới',
      customer: 'Tổ hợp Công nghệ Giáo dục TOPICA Edtech',
      industryId: 'ind-edu',
      companySizeId: 'size-med',
      leadSourceId: 'src-linkedin',
      amount: 1450000000,
      stage: 'Qualified',
      closeDate: '2026-05-01'
    },
    {
      id: 'DEAL-007',
      title: 'Hệ thống Tối ưu Tuyến đường Giao hàng Vận tải',
      customer: 'Giao Hàng Nhanh Express (Fast Delivery)',
      industryId: 'ind-log',
      companySizeId: 'size-large',
      leadSourceId: 'src-outbound',
      amount: 2800000000,
      stage: 'Negotiation',
      closeDate: '2026-03-20'
    },
    {
      id: 'DEAL-008',
      title: 'Phần mềm Quản lý Sàn Bất động sản và Giỏ hàng Dự án',
      customer: 'Tập đoàn Đất Xanh Group',
      industryId: 'ind-real',
      companySizeId: 'size-large',
      leadSourceId: 'src-event',
      amount: 2200000000,
      stage: 'Proposal',
      closeDate: '2026-04-20'
    }
  ],

  // DANH SÁCH HOẠT ĐỘNG BÁN HÀNG (ACTIVITIES)
  activities: [
    {
      id: 'ACT-001',
      title: 'Cuộc gọi thẩm định nhu cầu dự án ERP VinFast',
      activityTypeId: 'act-call',
      customer: 'Tổ hợp Sản xuất Ô tô VinFast',
      salesRep: 'Trần Văn Mạnh',
      date: '2026-02-28',
      status: 'Completed',
      duration: '45 phút',
      notes: 'Khách hàng có ngân sách 8 tỷ VNĐ, yêu cầu hỗ trợ chuẩn tích hợp SAP.'
    },
    {
      id: 'ACT-002',
      title: 'Họp trực tiếp tại trụ sở Techcombank Hà Nội',
      activityTypeId: 'act-meet',
      customer: 'Techcombank',
      salesRep: 'Nguyễn Bích Ngọc',
      date: '2026-03-01',
      status: 'Completed',
      duration: '120 phút',
      notes: 'Thống nhất phạm vi bảo mật SOC-2 và cơ chế mã hóa dữ liệu.'
    },
    {
      id: 'ACT-003',
      title: 'Demo giải pháp Smart Logistics cho GHN Express',
      activityTypeId: 'act-demo',
      customer: 'Giao Hàng Nhanh Express',
      salesRep: 'Phạm Hồng Ánh',
      date: '2026-03-02',
      status: 'Completed',
      duration: '60 phút',
      notes: 'Ban giám đốc GHN đánh giá cao tính năng tối ưu thuật toán lộ trình shipper.'
    },
    {
      id: 'ACT-004',
      title: 'Gửi bảng chào giá chính thức gói Enterprise cho MWG',
      activityTypeId: 'act-email',
      customer: 'Tập đoàn Thế Giới Di Động (MWG)',
      salesRep: 'Lê Hoàng Long',
      date: '2026-03-03',
      status: 'Completed',
      duration: '15 phút',
      notes: 'Đã gửi file PDF đính kèm biểu phí chiết khấu 15% cho hợp đồng 3 năm.'
    },
    {
      id: 'ACT-005',
      title: 'Thuyết trình đề xuất giải pháp LMS trước HĐQT TOPICA',
      activityTypeId: 'act-proposal',
      customer: 'Tổ hợp Công nghệ Giáo dục TOPICA',
      salesRep: 'Nguyễn Bích Ngọc',
      date: '2026-03-04',
      status: 'Completed',
      duration: '90 phút',
      notes: 'Khách hàng yêu cầu bổ sung phương án chạy chịu tải 100.000 sinh viên đồng thời.'
    },
    {
      id: 'ACT-006',
      title: 'Ký kết hợp đồng triển khai Bệnh án Điện tử MEDLATEC',
      activityTypeId: 'act-sign',
      customer: 'Bệnh viện Đa khoa MEDLATEC',
      salesRep: 'Trần Văn Mạnh',
      date: '2026-02-15',
      status: 'Completed',
      duration: '60 phút',
      notes: 'Đã nhận tạm ứng 30% giá trị hợp đồng qua tài khoản ngân hàng.'
    },
    {
      id: 'ACT-007',
      title: 'Cuộc gọi tư vấn khách hàng Inbound Vua Nệm',
      activityTypeId: 'act-call',
      customer: 'Công ty Cổ phần Vua Nệm',
      salesRep: 'Nguyễn Bích Ngọc',
      date: '2026-03-04',
      status: 'Completed',
      duration: '30 phút',
      notes: 'Hẹn gặp trực tiếp tại Showroom vào tuần sau.'
    },
    {
      id: 'ACT-008',
      title: 'Họp kỹ thuật tích hợp API cùng NovaNet Đà Nẵng',
      activityTypeId: 'act-meet',
      customer: 'Công ty Cổ phần Công nghệ NovaNet',
      salesRep: 'Lê Hoàng Long',
      date: '2026-03-05',
      status: 'Planned',
      duration: '90 phút',
      notes: 'Chuẩn bị tài liệu Webhook và Postman collection.'
    }
  ]
};

// Dữ liệu mô phỏng tình trạng "Trước khi chuẩn hóa"
// Giải thích bài toán nhức nhối của Giám đốc kinh doanh khi không có SCRUM-65:
export const LEGACY_FRAGMENTED_DATA_ANALYSIS = {
  problemSummary: 'Trước khi có danh mục dùng chung, mỗi chi nhánh & nhân viên bán hàng tự gõ tên tự do vào trường văn bản, dẫn đến dữ liệu bị phân mảnh thành hàng chục biến thể khác nhau. Giám đốc kinh doanh KHÔNG THỂ gộp báo cáo chính xác!',
  industryFragmentation: [
    { rawName: 'IT', mappedStandard: 'Công nghệ thông tin & Viễn thông', count: 14 },
    { rawName: 'Công nghệ', mappedStandard: 'Công nghệ thông tin & Viễn thông', count: 8 },
    { rawName: 'Phần mềm SaaS', mappedStandard: 'Công nghệ thông tin & Viễn thông', count: 11 },
    { rawName: 'Tech', mappedStandard: 'Công nghệ thông tin & Viễn thông', count: 6 },
    { rawName: 'SX & Chế tạo', mappedStandard: 'Sản xuất & Chế tạo công nghiệp', count: 12 },
    { rawName: 'Nhà máy cơ khí', mappedStandard: 'Sản xuất & Chế tạo công nghiệp', count: 9 },
    { rawName: 'Bán lẻ hàng hoá', mappedStandard: 'Bán lẻ & Thương mại điện tử', count: 15 },
    { rawName: 'Shop online ecom', mappedStandard: 'Bán lẻ & Thương mại điện tử', count: 7 },
    { rawName: 'Tài chính - bank', mappedStandard: 'Tài chính, Ngân hàng & Bảo hiểm', count: 10 }
  ],
  leadSourceFragmentation: [
    { rawName: 'web', mappedStandard: 'Website / Inbound Form', count: 28 },
    { rawName: 'website cong ty', mappedStandard: 'Website / Inbound Form', count: 19 },
    { rawName: 'form trang chu', mappedStandard: 'Website / Inbound Form', count: 12 },
    { rawName: 'Inbound', mappedStandard: 'Website / Inbound Form', count: 8 },
    { rawName: 'nguoi quen', mappedStandard: 'Khách hàng cũ giới thiệu (Referral)', count: 21 },
    { rawName: 'gioi thieu', mappedStandard: 'Khách hàng cũ giới thiệu (Referral)', count: 16 },
    { rawName: 'Khach cu', mappedStandard: 'Khách hàng cũ giới thiệu (Referral)', count: 9 },
    { rawName: 'qc google', mappedStandard: 'Quảng cáo số (Google Ads / Facebook Ads)', count: 25 },
    { rawName: 'fb ads', mappedStandard: 'Quảng cáo số (Google Ads / Facebook Ads)', count: 18 }
  ]
};
