// =====================================================================
// SCRUM-93: Người dùng & Phân cấp vai trò quản lý kinh doanh
// =====================================================================

export const USER_ROLES = {
  TEAM_LEAD: {
    id: 'TEAM_LEAD',
    name: 'Trưởng nhóm kinh doanh (Persona Chính - SCRUM-93)',
    badgeColor: 'amber',
    description: 'Nhận cảnh báo cơ hội đình trệ, cấu hình N ngày theo giai đoạn, kích hoạt tác vụ đánh giá hàng ngày, can thiệp sớm vào deal nguội.'
  },
  SALES_REP: {
    id: 'SALES_REP',
    name: 'Nhân viên kinh doanh',
    badgeColor: 'blue',
    description: 'Xem các cơ hội của bản thân, nhận cảnh báo nhắc nhở từ Trưởng nhóm, cập nhật hoạt động mới.'
  },
  SALES_DIRECTOR: {
    id: 'SALES_DIRECTOR',
    name: 'Giám đốc kinh doanh',
    badgeColor: 'purple',
    description: 'Giám sát tổng quan tỷ lệ đình trệ toàn công ty, xem năng lực can thiệp và giải cứu thương vụ của các nhóm.'
  }
};

export const SALES_TEAMS = [
  {
    id: 'TEAM_ENTERPRISE',
    name: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    leadName: 'Trần Đình Trọng',
    leadId: 'USR-LEAD-01',
    color: '#8b5cf6'
  },
  {
    id: 'TEAM_NORTH',
    name: 'Nhóm Kinh doanh Miền Bắc',
    leadName: 'Vũ Minh Đức',
    leadId: 'USR-LEAD-02',
    color: '#3b82f6'
  },
  {
    id: 'TEAM_RETAIL',
    name: 'Nhóm Chuỗi Bán lẻ & F&B',
    leadName: 'Phạm Thanh Thảo',
    leadId: 'USR-LEAD-03',
    color: '#10b981'
  }
];

export const MOCK_USERS = [
  {
    id: 'USR-LEAD-01',
    name: 'Trần Đình Trọng',
    email: 'trong.tran@companycrm.vn',
    role: 'TEAM_LEAD',
    roleTitle: 'Trưởng nhóm Kinh doanh Enterprise',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    phone: '0912.888.777'
  },
  {
    id: 'USR-REP-01',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Senior Account Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    phone: '0903.111.222'
  },
  {
    id: 'USR-REP-02',
    name: 'Trần Thị Mai',
    email: 'mai.tran@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Enterprise Account Executive',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    phone: '0903.222.333'
  },
  {
    id: 'USR-REP-03',
    name: 'Lê Quốc Hưng',
    email: 'hung.le@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Account Executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    phone: '0903.333.444'
  },
  {
    id: 'USR-REP-04',
    name: 'Hoàng Kim Chi',
    email: 'chi.hoang@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Account Executive',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_RETAIL',
    phone: '0903.444.555'
  },
  {
    id: 'USR-DIR-01',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@companycrm.vn',
    role: 'SALES_DIRECTOR',
    roleTitle: 'Giám đốc Kinh doanh Toàn quốc (CSO)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    teamId: 'ALL',
    phone: '0988.999.000'
  }
];
