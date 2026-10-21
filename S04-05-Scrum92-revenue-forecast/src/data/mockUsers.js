export const USER_ROLES = {
  SALES_REP: {
    id: 'SALES_REP',
    name: 'Nhân viên kinh doanh',
    level: 1,
    badgeColor: 'blue',
    description: 'Xem dự báo cá nhân và cơ hội do mình phụ trách.'
  },
  TEAM_LEAD: {
    id: 'TEAM_LEAD',
    name: 'Trưởng nhóm kinh doanh',
    level: 2,
    badgeColor: 'purple',
    description: 'Xem dự báo của toàn bộ thành viên trong nhóm, so sánh chỉ tiêu nhóm.'
  },
  SALES_DIRECTOR: {
    id: 'SALES_DIRECTOR',
    name: 'Giám đốc kinh doanh',
    level: 3,
    badgeColor: 'amber',
    description: 'Toàn quyền xem dự báo toàn công ty, từng nhóm, từng nhân viên, điều chỉnh mô phỏng.'
  }
};

export const SALES_TEAMS = [
  {
    id: 'TEAM_NORTH',
    name: 'Nhóm Kinh doanh Miền Bắc',
    leadName: 'Trần Đình Trọng',
    monthlyQuota: 850000000, // 850 triệu
    quarterlyQuota: 2500000000, // 2.5 tỷ
    color: '#3b82f6'
  },
  {
    id: 'TEAM_ENTERPRISE',
    name: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    leadName: 'Vũ Minh Đức',
    monthlyQuota: 1400000000, // 1.4 tỷ
    quarterlyQuota: 4200000000, // 4.2 tỷ
    color: '#8b5cf6'
  },
  {
    id: 'TEAM_RETAIL',
    name: 'Nhóm Bán lẻ & Chuỗi F&B',
    leadName: 'Trần Đình Trọng',
    monthlyQuota: 650000000, // 650 triệu
    quarterlyQuota: 1950000000, // 1.95 tỷ
    color: '#10b981'
  }
];

export const MOCK_USERS = [
  {
    id: 'USR-099',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@companycrm.vn',
    role: 'SALES_DIRECTOR',
    roleTitle: 'Giám đốc Kinh doanh Toàn quốc (CSO)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    teamId: 'ALL',
    teamName: 'Ban Điều Hành & Khối Kinh Doanh',
    monthlyQuota: 2900000000, // 2.9 tỷ
    quarterlyQuota: 8650000000 // 8.65 tỷ
  },
  {
    id: 'USR-010',
    name: 'Trần Đình Trọng',
    email: 'trong.tran@companycrm.vn',
    role: 'TEAM_LEAD',
    roleTitle: 'Trưởng nhóm Kinh doanh Miền Bắc & F&B',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    teamName: 'Nhóm Kinh doanh Miền Bắc',
    monthlyQuota: 850000000,
    quarterlyQuota: 2500000000
  },
  {
    id: 'USR-001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng SME Miền Bắc',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    teamName: 'Nhóm Kinh doanh Miền Bắc',
    monthlyQuota: 450000000, // 450 triệu
    quarterlyQuota: 1350000000
  },
  {
    id: 'USR-002',
    name: 'Trần Thị Mai',
    email: 'mai.tran@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Enterprise',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    monthlyQuota: 800000000, // 800 triệu
    quarterlyQuota: 2400000000
  },
  {
    id: 'USR-003',
    name: 'Lê Quốc Hưng',
    email: 'hung.le@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Bán lẻ & F&B',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_RETAIL',
    teamName: 'Nhóm Bán lẻ & Chuỗi F&B',
    monthlyQuota: 400000000, // 400 triệu
    quarterlyQuota: 1200000000
  },
  {
    id: 'USR-004',
    name: 'Phạm Thị Hương',
    email: 'huong.pham@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Ngân hàng & Fintech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    monthlyQuota: 600000000, // 600 triệu
    quarterlyQuota: 1800000000
  },
  {
    id: 'USR-005',
    name: 'Hoàng Tuấn Kiệt',
    email: 'kiet.hoang@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Sản xuất & Dịch vụ',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    teamName: 'Nhóm Kinh doanh Miền Bắc',
    monthlyQuota: 400000000, // 400 triệu
    quarterlyQuota: 1200000000
  }
];
