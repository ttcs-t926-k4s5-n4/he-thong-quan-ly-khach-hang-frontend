// =====================================================================
// SCRUM-101: Người dùng & Danh sách Nhân sự Nhóm Kinh Doanh
// =====================================================================

export const USER_ROLES = {
  TEAM_LEAD: {
    id: 'TEAM_LEAD',
    name: 'Trưởng nhóm kinh doanh',
    badgeColor: 'amber',
    description: 'Xem toàn bộ lịch làm việc chồng chéo của các thành viên, phát hiện xung đột, tìm khung giờ rảnh chung và bố trí lịch gặp tối ưu.'
  },
  SALES_REP: {
    id: 'SALES_REP',
    name: 'Nhân viên kinh doanh',
    badgeColor: 'blue',
    description: 'Xem lịch cá nhân theo ngày/tuần/tháng, quản lý cuộc gặp đã đặt và công việc có hạn, tra cứu lịch đồng đội để tránh trùng giờ.'
  }
};

export const MOCK_USERS = [
  {
    id: 'USR-LEAD-01',
    name: 'Trần Đình Trọng',
    email: 'trong.tran@companycrm.vn',
    role: 'TEAM_LEAD',
    roleTitle: 'Trưởng nhóm Kinh doanh Enterprise',
    color: '#8b5cf6', // Violet
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    department: 'Nhóm Doanh Nghiệp Lớn',
    phone: '0912.888.777'
  },
  {
    id: 'USR-REP-01',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Senior Account Executive',
    color: '#3b82f6', // Sapphire Blue
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    department: 'Nhóm Doanh Nghiệp Lớn',
    phone: '0903.111.222'
  },
  {
    id: 'USR-REP-02',
    name: 'Trần Thị Mai',
    email: 'mai.tran@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Enterprise Account Executive',
    color: '#10b981', // Emerald
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    department: 'Nhóm Doanh Nghiệp Lớn',
    phone: '0903.222.333'
  },
  {
    id: 'USR-REP-03',
    name: 'Lê Quốc Hưng',
    email: 'hung.le@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Account Executive',
    color: '#f59e0b', // Amber/Orange
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    department: 'Nhóm Doanh Nghiệp Lớn',
    phone: '0903.333.444'
  },
  {
    id: 'USR-REP-04',
    name: 'Hoàng Kim Chi',
    email: 'chi.hoang@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Account Executive (Fintech & Ngân hàng)',
    color: '#ec4899', // Pink / Rose
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    department: 'Nhóm Doanh Nghiệp Lớn',
    phone: '0903.444.555'
  },
  {
    id: 'USR-REP-05',
    name: 'Vũ Đức Thắng',
    email: 'thang.vu@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Junior Sales Executive',
    color: '#06b6d4', // Cyan
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    department: 'Nhóm Doanh Nghiệp Lớn',
    phone: '0903.555.666'
  }
];
