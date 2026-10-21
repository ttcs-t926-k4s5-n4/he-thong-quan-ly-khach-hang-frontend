export const USER_ROLES = {
  SALES_REP: {
    id: 'SALES_REP',
    name: 'Nhân viên kinh doanh',
    level: 1,
    badgeColor: 'blue',
    canReopen: false,
    description: 'Chỉ được đóng cơ hội do mình phụ trách. Không có quyền mở lại cơ hội đã đóng.'
  },
  TEAM_LEAD: {
    id: 'TEAM_LEAD',
    name: 'Trưởng nhóm kinh doanh',
    level: 2,
    badgeColor: 'purple',
    canReopen: true,
    description: 'Có quyền xem toàn bộ cơ hội của nhóm và mở lại cơ hội đã đóng (bắt buộc nhập lý do).'
  },
  SALES_DIRECTOR: {
    id: 'SALES_DIRECTOR',
    name: 'Giám đốc kinh doanh',
    level: 3,
    badgeColor: 'amber',
    canReopen: true,
    description: 'Toàn quyền quản trị cơ hội, mở lại cơ hội, phê duyệt và xem phân tích chiến lược.'
  }
};

export const MOCK_USERS = [
  {
    id: 'USR-001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Doanh nghiệp (SME)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    quota: 800000000, // 800 triệu
    team: 'Nhóm Kinh doanh Miền Bắc'
  },
  {
    id: 'USR-002',
    name: 'Trần Thị Mai',
    email: 'mai.tran@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Tài chính - Ngân hàng',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    quota: 1000000000, // 1 tỷ
    team: 'Nhóm Doanh nghiệp Lớn (Enterprise)'
  },
  {
    id: 'USR-003',
    name: 'Lê Quốc Hưng',
    email: 'hung.le@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Chuyên viên Bán hàng Bán lẻ & F&B',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    quota: 650000000, // 650 triệu
    team: 'Nhóm Kinh doanh Miền Bắc'
  },
  {
    id: 'USR-010',
    name: 'Trần Đình Trọng',
    email: 'trong.tran@companycrm.vn',
    role: 'TEAM_LEAD',
    roleTitle: 'Trưởng nhóm Kinh doanh B2B',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    quota: 2450000000, // 2.45 tỷ
    team: 'Khối Kinh doanh Toàn quốc'
  },
  {
    id: 'USR-099',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@companycrm.vn',
    role: 'SALES_DIRECTOR',
    roleTitle: 'Giám đốc Kinh doanh Toàn quốc (CSO)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    quota: 5000000000, // 5 tỷ
    team: 'Ban Điều Hành'
  }
];
