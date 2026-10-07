// Dữ liệu mẫu ban đầu cho Cơ cấu tổ chức kinh doanh (SCRUM-64)

export const INITIAL_TEAMS = [
  {
    id: 'team-root',
    code: 'BGD-HQ',
    name: 'Ban Giám Đốc Kinh Doanh Toàn Quốc',
    level: 0,
    parentId: null,
    leaderId: 'NV-001', // Nguyễn Văn An
    territoryIds: ['KV-VN-ALL'],
    description: 'Điều hành chiến lược kinh doanh toàn quốc, phân bổ hạn mức doanh thu và quản lý trực tiếp các khối vùng.',
    color: '#3b82f6',
    createdAt: '2025-01-01'
  },
  {
    id: 'team-north',
    code: 'KKD-MB',
    name: 'Khối Kinh Doanh Miền Bắc',
    level: 1,
    parentId: 'team-root',
    leaderId: 'NV-002', // Trần Thị Bình
    territoryIds: ['KV-MB-HN', 'KV-MB-QN', 'KV-MB-TB'],
    description: 'Chịu trách nhiệm phát triển thị trường và chỉ tiêu doanh số khu vực Bắc Bộ.',
    color: '#06b6d4',
    createdAt: '2025-01-05'
  },
  {
    id: 'team-central',
    code: 'KKD-MT',
    name: 'Khối Kinh Doanh Miền Trung',
    level: 1,
    parentId: 'team-root',
    leaderId: 'NV-003', // Hoàng Đình Trọng
    territoryIds: ['KV-MT-DN', 'KV-MT-NT'],
    description: 'Phát triển thị trường miền Trung và Cao nguyên Tây Nguyên.',
    color: '#f59e0b',
    createdAt: '2025-01-05'
  },
  {
    id: 'team-south',
    code: 'KKD-MN',
    name: 'Khối Kinh Doanh Miền Nam',
    level: 1,
    parentId: 'team-root',
    leaderId: 'NV-004', // Vũ Mai Phương
    territoryIds: ['KV-MN-HCM', 'KV-MN-BD', 'KV-MN-CT'],
    description: 'Thị trường trọng điểm Đông Nam Bộ và Đồng bằng Sông Cửu Long.',
    color: '#10b981',
    createdAt: '2025-01-05'
  },
  {
    id: 'team-hn-branch',
    code: 'CN-HN',
    name: 'Chi Nhánh Hà Nội',
    level: 2,
    parentId: 'team-north',
    leaderId: 'NV-005', // Phạm Minh Đức
    territoryIds: ['KV-MB-HN'],
    description: 'Phụ trách thị trường vùng Thủ đô Hà Nội và các tỉnh lân cận.',
    color: '#3b82f6',
    createdAt: '2025-01-10'
  },
  {
    id: 'team-hp-branch',
    code: 'CN-HP',
    name: 'Chi Nhánh Hải Phòng & Duyên Hải',
    level: 2,
    parentId: 'team-north',
    leaderId: 'NV-006', // Lê Thanh Vân
    territoryIds: ['KV-MB-QN'],
    description: 'Khai thác cụm cảng biển, logistics và khu công nghiệp Hải Phòng - Quảng Ninh.',
    color: '#06b6d4',
    createdAt: '2025-01-10'
  },
  {
    id: 'team-dn-branch',
    code: 'CN-DN',
    name: 'Chi Nhánh Đà Nẵng & Vùng Động Lực',
    level: 2,
    parentId: 'team-central',
    leaderId: 'NV-007', // Nguyễn Công Trí
    territoryIds: ['KV-MT-DN'],
    description: 'Tập trung phát triển khách hàng du lịch, công nghệ cao và B2B Đà Nẵng.',
    color: '#f59e0b',
    createdAt: '2025-01-12'
  },
  {
    id: 'team-hcm-branch',
    code: 'CN-HCM',
    name: 'Chi Nhánh TP. Hồ Chí Minh',
    level: 2,
    parentId: 'team-south',
    leaderId: 'NV-008', // Đặng Quốc Hưng
    territoryIds: ['KV-MN-HCM'],
    description: 'Trung tâm kinh tế phía Nam, quản lý các nhóm phân khúc Doanh nghiệp lớn và SME.',
    color: '#10b981',
    createdAt: '2025-01-10'
  },
  {
    id: 'team-ct-branch',
    code: 'CN-CT',
    name: 'Chi Nhánh Cần Thơ & Miền Tây',
    level: 2,
    parentId: 'team-south',
    leaderId: 'NV-009', // Võ Thị Kim Ngân
    territoryIds: ['KV-MN-CT'],
    description: 'Mở rộng thị trường nông nghiệp công nghệ cao và chuỗi cung ứng Cửu Long.',
    color: '#14b8a6',
    createdAt: '2025-01-15'
  },
  {
    id: 'team-hn-ent',
    code: 'ENT-HN',
    name: 'Nhóm Doanh Nghiệp Lớn (Enterprise HN)',
    level: 3,
    parentId: 'team-hn-branch',
    leaderId: 'NV-010', // Bùi Gia Huy
    territoryIds: ['KV-MB-HN'],
    description: 'Tập trung các gói giải pháp chuyển đổi số cho tập đoàn, ngân hàng và cơ quan chính phủ.',
    color: '#8b5cf6',
    createdAt: '2025-02-01'
  },
  {
    id: 'team-hn-sme',
    code: 'SME-HN',
    name: 'Nhóm SME & Khách Hàng Tăng Trưởng HN',
    level: 3,
    parentId: 'team-hn-branch',
    leaderId: 'NV-011', // Đỗ Thu Hằng
    territoryIds: ['KV-MB-HN'],
    description: 'Cung cấp giải pháp phần mềm SaaS cho doanh nghiệp vừa và nhỏ khu vực phía Bắc.',
    color: '#ec4899',
    createdAt: '2025-02-01'
  },
  {
    id: 'team-hcm-ent',
    code: 'ENT-HCM',
    name: 'Nhóm Doanh Nghiệp Lớn & FDI TP.HCM',
    level: 3,
    parentId: 'team-hcm-branch',
    leaderId: 'NV-012', // Trịnh Bá Thông
    territoryIds: ['KV-MN-HCM', 'KV-MN-BD'],
    description: 'Tiếp cận các công ty đa quốc gia, FDI trong các khu công nghiệp phía Nam.',
    color: '#8b5cf6',
    createdAt: '2025-02-01'
  },
  {
    id: 'team-hcm-sme',
    code: 'SME-HCM',
    name: 'Nhóm SME & Kênh Bán Lẻ TP.HCM',
    level: 3,
    parentId: 'team-hcm-branch',
    leaderId: 'NV-013', // Lâm Mỹ Uyên
    territoryIds: ['KV-MN-HCM'],
    description: 'Đẩy mạnh bán hàng đa kênh, chuỗi cửa hàng và doanh nghiệp thương mại điện tử.',
    color: '#ec4899',
    createdAt: '2025-02-01'
  }
];

export const INITIAL_EMPLOYEES = [
  // 1. Cấp Ban Giám Đốc
  {
    id: 'NV-001',
    code: 'EMP001',
    name: 'Nguyễn Văn An',
    gender: 'Nam',
    teamId: 'team-root',
    isLeader: true,
    position: 'Giám Đốc Kinh Doanh Toàn Quốc',
    email: 'an.nguyen@congty.com.vn',
    phone: '0903 111 222',
    kpiTarget: 50000000000,
    avatarColor: '#3b82f6',
    joinedDate: '2022-03-15'
  },

  // 2. Cấp Vùng
  {
    id: 'NV-002',
    code: 'EMP002',
    name: 'Trần Thị Bình',
    gender: 'Nữ',
    teamId: 'team-north',
    isLeader: true,
    position: 'Giám Đốc Khối Kinh Doanh Miền Bắc',
    email: 'binh.tran@congty.com.vn',
    phone: '0912 333 444',
    kpiTarget: 22000000000,
    avatarColor: '#06b6d4',
    joinedDate: '2022-06-01'
  },
  {
    id: 'NV-003',
    code: 'EMP003',
    name: 'Hoàng Đình Trọng',
    gender: 'Nam',
    teamId: 'team-central',
    isLeader: true,
    position: 'Giám Đốc Khối Kinh Doanh Miền Trung',
    email: 'trong.hoang@congty.com.vn',
    phone: '0988 555 666',
    kpiTarget: 10000000000,
    avatarColor: '#f59e0b',
    joinedDate: '2023-01-10'
  },
  {
    id: 'NV-004',
    code: 'EMP004',
    name: 'Vũ Mai Phương',
    gender: 'Nữ',
    teamId: 'team-south',
    isLeader: true,
    position: 'Giám Đốc Khối Kinh Doanh Miền Nam',
    email: 'phuong.vu@congty.com.vn',
    phone: '0909 777 888',
    kpiTarget: 28000000000,
    avatarColor: '#10b981',
    joinedDate: '2022-04-15'
  },

  // 3. Cấp Chi Nhánh
  {
    id: 'NV-005',
    code: 'EMP005',
    name: 'Phạm Minh Đức',
    gender: 'Nam',
    teamId: 'team-hn-branch',
    isLeader: true,
    position: 'Trưởng Chi Nhánh Hà Nội',
    email: 'duc.pham@congty.com.vn',
    phone: '0977 123 456',
    kpiTarget: 14000000000,
    avatarColor: '#3b82f6',
    joinedDate: '2023-03-01'
  },
  {
    id: 'NV-006',
    code: 'EMP006',
    name: 'Lê Thanh Vân',
    gender: 'Nữ',
    teamId: 'team-hp-branch',
    isLeader: true,
    position: 'Trưởng Chi Nhánh Hải Phòng',
    email: 'van.le@congty.com.vn',
    phone: '0966 234 567',
    kpiTarget: 6000000000,
    avatarColor: '#06b6d4',
    joinedDate: '2023-05-15'
  },
  {
    id: 'NV-007',
    code: 'EMP007',
    name: 'Nguyễn Công Trí',
    gender: 'Nam',
    teamId: 'team-dn-branch',
    isLeader: true,
    position: 'Trưởng Chi Nhánh Đà Nẵng',
    email: 'tri.nguyen@congty.com.vn',
    phone: '0933 345 678',
    kpiTarget: 8000000000,
    avatarColor: '#f59e0b',
    joinedDate: '2023-07-01'
  },
  {
    id: 'NV-008',
    code: 'EMP008',
    name: 'Đặng Quốc Hưng',
    gender: 'Nam',
    teamId: 'team-hcm-branch',
    isLeader: true,
    position: 'Trưởng Chi Nhánh TP.HCM',
    email: 'hung.dang@congty.com.vn',
    phone: '0908 456 789',
    kpiTarget: 20000000000,
    avatarColor: '#10b981',
    joinedDate: '2022-09-01'
  },
  {
    id: 'NV-009',
    code: 'EMP009',
    name: 'Võ Thị Kim Ngân',
    gender: 'Nữ',
    teamId: 'team-ct-branch',
    isLeader: true,
    position: 'Trưởng Chi Nhánh Cần Thơ',
    email: 'ngan.vo@congty.com.vn',
    phone: '0944 567 890',
    kpiTarget: 5000000000,
    avatarColor: '#14b8a6',
    joinedDate: '2023-11-20'
  },

  // 4. Cấp Trưởng Nhóm Đội Bán Hàng (Team Leaders)
  {
    id: 'NV-010',
    code: 'EMP010',
    name: 'Bùi Gia Huy',
    gender: 'Nam',
    teamId: 'team-hn-ent',
    isLeader: true,
    position: 'Trưởng Nhóm Enterprise Hà Nội',
    email: 'huy.bui@congty.com.vn',
    phone: '0918 112 334',
    kpiTarget: 8000000000,
    avatarColor: '#8b5cf6',
    joinedDate: '2023-08-10'
  },
  {
    id: 'NV-011',
    code: 'EMP011',
    name: 'Đỗ Thu Hằng',
    gender: 'Nữ',
    teamId: 'team-hn-sme',
    isLeader: true,
    position: 'Trưởng Nhóm SME Hà Nội',
    email: 'hang.do@congty.com.vn',
    phone: '0979 223 445',
    kpiTarget: 5000000000,
    avatarColor: '#ec4899',
    joinedDate: '2023-09-01'
  },
  {
    id: 'NV-012',
    code: 'EMP012',
    name: 'Trịnh Bá Thông',
    gender: 'Nam',
    teamId: 'team-hcm-ent',
    isLeader: true,
    position: 'Trưởng Nhóm Enterprise & FDI HCM',
    email: 'thong.trinh@congty.com.vn',
    phone: '0902 334 556',
    kpiTarget: 12000000000,
    avatarColor: '#8b5cf6',
    joinedDate: '2023-06-15'
  },
  {
    id: 'NV-013',
    code: 'EMP013',
    name: 'Lâm Mỹ Uyên',
    gender: 'Nữ',
    teamId: 'team-hcm-sme',
    isLeader: true,
    position: 'Trưởng Nhóm SME TP.HCM',
    email: 'uyen.lam@congty.com.vn',
    phone: '0938 445 667',
    kpiTarget: 6000000000,
    avatarColor: '#ec4899',
    joinedDate: '2023-10-01'
  },

  // 5. Cấp Chuyên Viên Kinh Doanh (Sales Reps - Staff Members)
  // Thuộc Nhóm Enterprise Hà Nội
  {
    id: 'NV-014',
    code: 'EMP014',
    name: 'Dương Văn Khôi',
    gender: 'Nam',
    teamId: 'team-hn-ent',
    isLeader: false,
    position: 'Chuyên Viên Tư Vấn Giải Pháp Enterprise',
    email: 'khoi.duong@congty.com.vn',
    phone: '0915 556 778',
    kpiTarget: 3500000000,
    avatarColor: '#6366f1',
    joinedDate: '2024-02-15'
  },
  {
    id: 'NV-015',
    code: 'EMP015',
    name: 'Chu Thị Bích Ngọc',
    gender: 'Nữ',
    teamId: 'team-hn-ent',
    isLeader: false,
    position: 'Chuyên Viên Bán Hàng B2B Cấp Cao',
    email: 'ngoc.chu@congty.com.vn',
    phone: '0983 667 889',
    kpiTarget: 3000000000,
    avatarColor: '#a855f7',
    joinedDate: '2024-03-01'
  },

  // Thuộc Nhóm SME Hà Nội
  {
    id: 'NV-016',
    code: 'EMP016',
    name: 'Hoàng Minh Tuấn',
    gender: 'Nam',
    teamId: 'team-hn-sme',
    isLeader: false,
    position: 'Chuyên Viên Bán Hàng SME',
    email: 'tuan.hoang@congty.com.vn',
    phone: '0972 778 990',
    kpiTarget: 2000000000,
    avatarColor: '#f43f5e',
    joinedDate: '2024-04-10'
  },
  {
    id: 'NV-017',
    code: 'EMP017',
    name: 'Phan Thị Mai Lan',
    gender: 'Nữ',
    teamId: 'team-hn-sme',
    isLeader: false,
    position: 'Chuyên Viên Phát Triển Khách Hàng Mới',
    email: 'lan.phan@congty.com.vn',
    phone: '0945 889 001',
    kpiTarget: 1800000000,
    avatarColor: '#fb7185',
    joinedDate: '2024-05-02'
  },

  // Thuộc Chi Nhánh Hải Phòng
  {
    id: 'NV-018',
    code: 'EMP018',
    name: 'Tạ Quang Dũng',
    gender: 'Nam',
    teamId: 'team-hp-branch',
    isLeader: false,
    position: 'Chuyên Viên B2B Cảng Biển & Logistics',
    email: 'dung.ta@congty.com.vn',
    phone: '0961 990 112',
    kpiTarget: 2500000000,
    avatarColor: '#0284c7',
    joinedDate: '2024-01-15'
  },

  // Thuộc Chi Nhánh Đà Nẵng
  {
    id: 'NV-019',
    code: 'EMP019',
    name: 'Mai Xuân Hào',
    gender: 'Nam',
    teamId: 'team-dn-branch',
    isLeader: false,
    position: 'Chuyên Viên Bán Hàng Miền Trung',
    email: 'hao.mai@congty.com.vn',
    phone: '0935 112 233',
    kpiTarget: 2200000000,
    avatarColor: '#d97706',
    joinedDate: '2024-02-20'
  },

  // Thuộc Nhóm Enterprise TP.HCM
  {
    id: 'NV-020',
    code: 'EMP020',
    name: 'Trần Bảo Anh',
    gender: 'Nữ',
    teamId: 'team-hcm-ent',
    isLeader: false,
    position: 'Key Account Manager (FDI Accounts)',
    email: 'anh.tran@congty.com.vn',
    phone: '0901 223 344',
    kpiTarget: 5000000000,
    avatarColor: '#7c3aed',
    joinedDate: '2023-11-01'
  },
  {
    id: 'NV-021',
    code: 'EMP021',
    name: 'Ngô Kiến Quốc',
    gender: 'Nam',
    teamId: 'team-hcm-ent',
    isLeader: false,
    position: 'Chuyên Viên Tư Vấn ERP & Cloud',
    email: 'quoc.ngo@congty.com.vn',
    phone: '0937 334 455',
    kpiTarget: 4500000000,
    avatarColor: '#9333ea',
    joinedDate: '2024-01-08'
  },

  // Thuộc Nhóm SME TP.HCM
  {
    id: 'NV-022',
    code: 'EMP022',
    name: 'Lê Hoàng Yến',
    gender: 'Nữ',
    teamId: 'team-hcm-sme',
    isLeader: false,
    position: 'Chuyên Viên Bán Hàng Kênh Bán Lẻ',
    email: 'yen.le@congty.com.vn',
    phone: '0948 445 566',
    kpiTarget: 2500000000,
    avatarColor: '#db2777',
    joinedDate: '2024-03-12'
  },

  // Thuộc Chi Nhánh Cần Thơ
  {
    id: 'NV-023',
    code: 'EMP023',
    name: 'Huỳnh Tấn Tài',
    gender: 'Nam',
    teamId: 'team-ct-branch',
    isLeader: false,
    position: 'Chuyên Viên Bán Hàng Khu Vực Sông Hậu',
    email: 'tai.huynh@congty.com.vn',
    phone: '0974 556 677',
    kpiTarget: 2000000000,
    avatarColor: '#0d9488',
    joinedDate: '2024-04-01'
  }
];

export const INITIAL_TERRITORIES = [
  {
    id: 'KV-VN-ALL',
    code: 'TERR-VN-ALL',
    name: 'Toàn Quốc (Việt Nam)',
    regionGroup: 'Toàn Quốc',
    provinces: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Toàn bộ 63 tỉnh thành'],
    marketPotential: 'Rất Lớn (100.000+ Doanh nghiệp)',
    status: 'active',
    description: 'Bao quát toàn bộ lãnh thổ quốc gia, do Ban Giám đốc trực tiếp chỉ đạo định hướng.'
  },
  {
    id: 'KV-MB-HN',
    code: 'TERR-MB-HN',
    name: 'Thủ Đô Hà Nội & Vùng Vệ Tinh',
    regionGroup: 'Miền Bắc',
    provinces: ['Hà Nội', 'Bắc Ninh', 'Hưng Yên', 'Vĩnh Phúc'],
    marketPotential: 'Cực Cao (Tập trung cơ quan TW & Tổng công ty)',
    status: 'active',
    description: 'Thị trường trọng điểm phía Bắc với mật độ doanh nghiệp công nghệ và trụ sở tập đoàn lớn.'
  },
  {
    id: 'KV-MB-QN',
    code: 'TERR-MB-QN',
    name: 'Vùng Duyên Hải Đông Bắc (Hải Phòng - Quảng Ninh)',
    regionGroup: 'Miền Bắc',
    provinces: ['Hải Phòng', 'Quảng Ninh', 'Hải Dương'],
    marketPotential: 'Cao (Khu kinh tế Đình Vũ, Cát Hải, logistics cảng biển)',
    status: 'active',
    description: 'Trung tâm công nghiệp phụ trợ, xuất nhập khẩu cảng biển nước sâu.'
  },
  {
    id: 'KV-MB-TB',
    code: 'TERR-MB-TB',
    name: 'Vùng Tây Bắc & Trung Du',
    regionGroup: 'Miền Bắc',
    provinces: ['Thái Nguyên', 'Phú Thọ', 'Bắc Giang', 'Lạng Sơn', 'Lào Cai'],
    marketPotential: 'Trung Bình (Nhà máy điện tử, chế biến, nông sản)',
    status: 'active',
    description: 'Cụm công nghiệp chế tạo thiết bị thông minh và thương mại biên giới.'
  },
  {
    id: 'KV-MT-DN',
    code: 'TERR-MT-DN',
    name: 'Đà Nẵng & Vùng Động Lực Miền Trung',
    regionGroup: 'Miền Trung',
    provinces: ['Đà Nẵng', 'Quảng Nam', 'Thừa Thiên Huế'],
    marketPotential: 'Cao (Khu CNTT tập trung, chuỗi resort cao cấp, cơ khí ô tô Chu Lai)',
    status: 'active',
    description: 'Trục phát triển công nghệ cao, du lịch - khách sạn và công nghiệp lắp ráp.'
  },
  {
    id: 'KV-MT-NT',
    code: 'TERR-MT-NT',
    name: 'Nam Trung Bộ & Cao Nguyên Tây Nguyên',
    regionGroup: 'Miền Trung',
    provinces: ['Khánh Hòa', 'Bình Định', 'Đắk Lắk', 'Lâm Đồng'],
    marketPotential: 'Trung Bình (Nông sản chất lượng cao, năng lượng tái tạo, thủy sản)',
    status: 'active',
    description: 'Vùng nguyên liệu nông sản xuất khẩu chủ lực và trung tâm du lịch duyên hải.'
  },
  {
    id: 'KV-MN-HCM',
    code: 'TERR-MN-HCM',
    name: 'TP. Hồ Chí Minh (Trung Tâm Tài Chính)',
    regionGroup: 'Miền Nam',
    provinces: ['TP. Hồ Chí Minh (Toàn bộ các quận huyện và TP. Thủ Đức)'],
    marketPotential: 'Cực Kỳ Lớn (Đầu tàu kinh tế, hàng chục nghìn doanh nghiệp hoạt động)',
    status: 'active',
    description: 'Trung tâm tài chính, thương mại, dịch vụ lớn nhất cả nước, chiếm tỷ trọng doanh thu cao nhất.'
  },
  {
    id: 'KV-MN-BD',
    code: 'TERR-MN-BD',
    name: 'Vành Đai Công Nghiệp Đông Nam Bộ',
    regionGroup: 'Miền Nam',
    provinces: ['Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Tây Ninh'],
    marketPotential: 'Rất Cao (Các KCN VSIP, Amata, cảng Cái Mép - Thị Vải)',
    status: 'active',
    description: 'Thủ phủ khu công nghiệp, doanh nghiệp có vốn FDI và chế xuất lớn.'
  },
  {
    id: 'KV-MN-CT',
    code: 'TERR-MN-CT',
    name: 'Đồng Bằng Sông Cửu Long (Cần Thơ & Miền Tây)',
    regionGroup: 'Miền Nam',
    provinces: ['Cần Thơ', 'Long An', 'Tiền Giang', 'An Giang', 'Đồng Tháp', 'Kiên Giang'],
    marketPotential: 'Khá (Thủy hải sản, lúa gạo, logistics đường thủy)',
    status: 'active',
    description: 'Vựa lúa và trung tâm xuất khẩu thủy hải sản lớn nhất Việt Nam.'
  },
  {
    id: 'KV-NEW-OPEN',
    code: 'TERR-NEW-OPEN',
    name: 'Thị Trường Khai Phá & Hải Đảo Mới (Chưa Gán Nhóm)',
    regionGroup: 'Đặc Biệt',
    provinces: ['Phú Quốc', 'Côn Đảo', 'Khu kinh tế Vân Phong'],
    marketPotential: 'Tiềm Năng Mới (Dự án đặc khu kinh tế biển)',
    status: 'pending',
    description: 'Khu vực địa lý mới mở rộng, đang chờ phân bổ nhóm kinh doanh chuyên trách phụ trách.'
  }
];

// Dữ liệu Khách hàng & Cơ hội kinh doanh dùng để MINH HỌA TIÊU CHÍ 3 (Data Scope)
export const INITIAL_DEALS = [
  {
    id: 'DEAL-001',
    title: 'Hệ thống ERP Doanh Nghiệp Viễn Thông',
    clientName: 'Tập Đoàn Viễn Thông Viettel',
    territoryId: 'KV-MB-HN',
    assignedEmployeeId: 'NV-014', // Dương Văn Khôi (Thuộc team-hn-ent)
    teamId: 'team-hn-ent',
    dealValue: 1850000000,
    stage: 'Ký hợp đồng',
    probability: 90,
    expectedClose: '2026-10-25'
  },
  {
    id: 'DEAL-002',
    title: 'Phần mềm Quản Trị Nhân Sự & Chấm Công Cloud',
    clientName: 'Ngân Hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
    territoryId: 'KV-MB-HN',
    assignedEmployeeId: 'NV-015', // Chu Thị Bích Ngọc (Thuộc team-hn-ent)
    teamId: 'team-hn-ent',
    dealValue: 1200000000,
    stage: 'Đàm phán báo giá',
    probability: 75,
    expectedClose: '2026-11-15'
  },
  {
    id: 'DEAL-003',
    title: 'Gói Giải Pháp Bán Hàng Đa Kênh Cho Chuỗi Cà Phê',
    clientName: 'Chuỗi F&B Highlands Coffee Miền Bắc',
    territoryId: 'KV-MB-HN',
    assignedEmployeeId: 'NV-016', // Hoàng Minh Tuấn (Thuộc team-hn-sme)
    teamId: 'team-hn-sme',
    dealValue: 450000000,
    stage: 'Khảo sát nhu cầu',
    probability: 60,
    expectedClose: '2026-10-30'
  },
  {
    id: 'DEAL-004',
    title: 'Hệ thống Hóa Đơn Điện Tử Tích Hợp Kế Toán',
    clientName: 'Công Ty CP Dược Phẩm Hà Tây',
    territoryId: 'KV-MB-HN',
    assignedEmployeeId: 'NV-017', // Phan Thị Mai Lan (Thuộc team-hn-sme)
    teamId: 'team-hn-sme',
    dealValue: 320000000,
    stage: 'Thành công',
    probability: 100,
    expectedClose: '2026-10-02'
  },
  {
    id: 'DEAL-005',
    title: 'Giải Pháp Điều Hành Cảng Biển Thông Minh',
    clientName: 'Công Ty CP Cảng Hải Phòng',
    territoryId: 'KV-MB-QN',
    assignedEmployeeId: 'NV-018', // Tạ Quang Dũng (Thuộc team-hp-branch)
    teamId: 'team-hp-branch',
    dealValue: 950000000,
    stage: 'Ký hợp đồng',
    probability: 85,
    expectedClose: '2026-11-05'
  },
  {
    id: 'DEAL-006',
    title: 'Phần mềm Quản Lý Bảo Trì Đội Tàu Biển',
    clientName: 'Tập Đoàn Than Khoáng Sản Vinacomin Quảng Ninh',
    territoryId: 'KV-MB-QN',
    assignedEmployeeId: 'NV-018', // Tạ Quang Dũng (Thuộc team-hp-branch)
    teamId: 'team-hp-branch',
    dealValue: 800000000,
    stage: 'Đàm phán báo giá',
    probability: 70,
    expectedClose: '2026-12-01'
  },
  {
    id: 'DEAL-007',
    title: 'Hệ Thống Đặt Phòng & CRM Resort Biển 5 Sao',
    clientName: 'Furama Resort Danang',
    territoryId: 'KV-MT-DN',
    assignedEmployeeId: 'NV-019', // Mai Xuân Hào (Thuộc team-dn-branch)
    teamId: 'team-dn-branch',
    dealValue: 680000000,
    stage: 'Ký hợp đồng',
    probability: 90,
    expectedClose: '2026-10-20'
  },
  {
    id: 'DEAL-008',
    title: 'Quản Lý Chuỗi Cung Ứng Linh Kiện Ô Tô',
    clientName: 'Tập Đoàn Thaco Chu Lai',
    territoryId: 'KV-MT-DN',
    assignedEmployeeId: 'NV-019', // Mai Xuân Hào (Thuộc team-dn-branch)
    teamId: 'team-dn-branch',
    dealValue: 1400000000,
    stage: 'Khảo sát nhu cầu',
    probability: 50,
    expectedClose: '2026-12-15'
  },
  {
    id: 'DEAL-009',
    title: 'Nền Tảng Core Banking Tích Hợp Đa Kênh',
    clientName: 'Ngân Hàng TMCP Á Châu (ACB)',
    territoryId: 'KV-MN-HCM',
    assignedEmployeeId: 'NV-020', // Trần Bảo Anh (Thuộc team-hcm-ent)
    teamId: 'team-hcm-ent',
    dealValue: 2400000000,
    stage: 'Ký hợp đồng',
    probability: 95,
    expectedClose: '2026-10-18'
  },
  {
    id: 'DEAL-010',
    title: 'Hệ Thống MES Quản Lý Sản Xuất Nhà Máy Điện Tử',
    clientName: 'Tập Đoàn Samsung Electronics HCMC CE Complex',
    territoryId: 'KV-MN-HCM',
    assignedEmployeeId: 'NV-021', // Ngô Kiến Quốc (Thuộc team-hcm-ent)
    teamId: 'team-hcm-ent',
    dealValue: 3100000000,
    stage: 'Đàm phán báo giá',
    probability: 80,
    expectedClose: '2026-11-20'
  },
  {
    id: 'DEAL-011',
    title: 'Hệ Thống POS & Khách Hàng Thân Thiết 200 Cửa Hàng',
    clientName: 'Chuỗi Cửa Hàng Tiện Lợi GS25 Việt Nam',
    territoryId: 'KV-MN-HCM',
    assignedEmployeeId: 'NV-022', // Lê Hoàng Yến (Thuộc team-hcm-sme)
    teamId: 'team-hcm-sme',
    dealValue: 580000000,
    stage: 'Thành công',
    probability: 100,
    expectedClose: '2026-10-05'
  },
  {
    id: 'DEAL-012',
    title: 'Phần mềm Truy Xuất Nguồn Gốc Thủy Sản Xuất Khẩu',
    clientName: 'Công Ty CP Thủy Sản Minh Phú Cần Thơ',
    territoryId: 'KV-MN-CT',
    assignedEmployeeId: 'NV-023', // Huỳnh Tấn Tài (Thuộc team-ct-branch)
    teamId: 'team-ct-branch',
    dealValue: 850000000,
    stage: 'Khảo sát nhu cầu',
    probability: 65,
    expectedClose: '2026-11-30'
  },
  {
    id: 'DEAL-013',
    title: 'Chuyển Đổi Số Quản Trị Kho Vận Tây Nam Bộ',
    clientName: 'Tập Đoàn Lộc Trời',
    territoryId: 'KV-MN-CT',
    assignedEmployeeId: 'NV-023', // Huỳnh Tấn Tài (Thuộc team-ct-branch)
    teamId: 'team-ct-branch',
    dealValue: 920000000,
    stage: 'Đàm phán báo giá',
    probability: 70,
    expectedClose: '2026-12-10'
  }
];

export const INITIAL_TRANSFERS = [
  {
    id: 'TF-001',
    employeeId: 'NV-016',
    employeeName: 'Hoàng Minh Tuấn',
    fromTeamId: 'team-hn-ent',
    fromTeamName: 'Nhóm Enterprise Hà Nội',
    toTeamId: 'team-hn-sme',
    toTeamName: 'Nhóm SME Hà Nội',
    reason: 'Tái cơ cấu chuyên môn nhằm hỗ trợ tăng trưởng phân khúc khách hàng SME.',
    approvedBy: 'Trần Thị Bình (Giám đốc Miền Bắc)',
    transferDate: '2025-08-15 09:30'
  },
  {
    id: 'TF-002',
    employeeId: 'NV-022',
    employeeName: 'Lê Hoàng Yến',
    fromTeamId: 'team-hcm-branch',
    fromTeamName: 'Chi Nhánh TP.HCM',
    toTeamId: 'team-hcm-sme',
    toTeamName: 'Nhóm SME & Kênh Bán Lẻ TP.HCM',
    reason: 'Bổ nhiệm chính thức vào nhóm bán lẻ chuyên biệt.',
    approvedBy: 'Đặng Quốc Hưng (Trưởng CN TP.HCM)',
    transferDate: '2025-09-01 14:15'
  }
];
