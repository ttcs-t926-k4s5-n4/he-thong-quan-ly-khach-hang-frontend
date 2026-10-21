// =====================================================================
// SCRUM-94: Người dùng & Danh sách Nhân sự nhóm Kinh doanh
// Bao gồm trạng thái tải công việc & tình trạng nghỉ phép
// =====================================================================

export const USER_ROLES = {
  TEAM_LEAD: {
    id: 'TEAM_LEAD',
    name: 'Trưởng nhóm kinh doanh (Persona Chính - SCRUM-94)',
    badgeColor: 'amber',
    description: 'Thực hiện phân bổ lại một hoặc nhiều cơ hội cho người khác khi nhân viên nghỉ phép dài ngày hoặc quá tải.'
  },
  SALES_REP: {
    id: 'SALES_REP',
    name: 'Nhân viên kinh doanh (Người nhận / Người bàn giao)',
    badgeColor: 'blue',
    description: 'Xem ngay cơ hội mới được phân bổ trong danh sách của mình kèm đầy đủ 100% lịch sử tương tác trước đó.'
  },
  SALES_DIRECTOR: {
    id: 'SALES_DIRECTOR',
    name: 'Giám đốc kinh doanh',
    badgeColor: 'purple',
    description: 'Giám sát tính công bằng phân bổ tải và hiệu quả chuyển giao thương vụ toàn công ty.'
  }
};

export const MEMBER_STATUS = {
  OVERLOADED: {
    id: 'OVERLOADED',
    label: 'Đang quá tải (> 5 deals)',
    shortLabel: 'Quá tải',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    badgeClass: 'badge-danger',
    canReceive: false,
    tooltip: 'Nhân sự đang quản lý quá nhiều thương vụ lớn cùng lúc, cần phân bổ bớt ra ngoài để tránh trễ hạn chốt.'
  },
  ON_LEAVE_SICK: {
    id: 'ON_LEAVE_SICK',
    label: 'Nghỉ ốm dài ngày (Phẫu thuật/Điều trị)',
    shortLabel: 'Nghỉ ốm 3 tuần',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
    badgeClass: 'badge-orange',
    canReceive: false,
    tooltip: 'Nhân sự đang nghỉ điều trị y tế dài hạn, toàn bộ thương vụ hiện tại cần chuyển gấp cho đồng nghiệp khác tiếp quản.'
  },
  ON_LEAVE_MATERNITY: {
    id: 'ON_LEAVE_MATERNITY',
    label: 'Nghỉ thai sản (Chế độ 6 tháng)',
    shortLabel: 'Nghỉ thai sản',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    badgeClass: 'badge-pink',
    canReceive: false,
    tooltip: 'Nhân sự bắt đầu nghỉ thai sản 6 tháng, cần bàn giao dứt điểm 100% cơ hội kinh doanh cho nhóm.'
  },
  ACTIVE_CAPACITY: {
    id: 'ACTIVE_CAPACITY',
    label: 'Rảnh tải (Sẵn sàng nhận thêm deal)',
    shortLabel: 'Rảnh tải',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    badgeClass: 'badge-emerald',
    canReceive: true,
    tooltip: 'Nhân sự có năng lực tốt, số lượng deal hiện tại ít, là ứng viên số 1 để nhận cơ hội bàn giao.'
  },
  ACTIVE_NORMAL: {
    id: 'ACTIVE_NORMAL',
    label: 'Tải công việc bình thường',
    shortLabel: 'Bình thường',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    badgeClass: 'badge-blue',
    canReceive: true,
    tooltip: 'Tải công việc trong tầm kiểm soát, có thể nhận thêm 1-2 cơ hội phù hợp chuyên môn.'
  }
};

export const MOCK_USERS = [
  {
    id: 'USR-LEAD-01',
    name: 'Trần Đình Trọng',
    email: 'trong.tran@companycrm.vn',
    role: 'TEAM_LEAD',
    roleTitle: 'Trưởng nhóm Kinh doanh Enterprise (Lead)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0912.888.777',
    status: 'ACTIVE_NORMAL',
    maxCapacity: 10,
    specialties: ['Quản lý toàn diện', 'Thương thảo cấp cao', 'Chốt hợp đồng khủng']
  },
  {
    id: 'USR-REP-01',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Senior Account Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0903.111.222',
    status: 'OVERLOADED',
    maxCapacity: 5,
    specialties: ['ERP Doanh nghiệp', 'Sản xuất & Chuỗi cung ứng'],
    statusNote: 'Đang quản lý 6 deal lớn cùng lúc, phản hồi khách hàng bị chậm trễ do quá tải.'
  },
  {
    id: 'USR-REP-02',
    name: 'Trần Thị Mai',
    email: 'mai.tran@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Enterprise Account Executive',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0903.222.333',
    status: 'ACTIVE_CAPACITY',
    maxCapacity: 6,
    specialties: ['CRM Omnichannel', 'Bán lẻ & F&B', 'Chăm sóc khách hàng VIP'],
    statusNote: 'Vừa chốt xong 2 deal quý trước, đang rảnh tải và sẵn sàng nhận thêm các deal Bán lẻ/CRM.'
  },
  {
    id: 'USR-REP-03',
    name: 'Lê Quốc Hưng',
    email: 'hung.le@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Account Executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0903.333.444',
    status: 'ON_LEAVE_SICK',
    maxCapacity: 5,
    specialties: ['Hạ tầng Cloud & Bảo mật', 'Y tế & Bệnh viện'],
    statusNote: 'Nghỉ ốm điều trị phẫu thuật từ 10/10 đến 01/11. Cần phân bổ gấp 3 deal đang đàm phán!'
  },
  {
    id: 'USR-REP-04',
    name: 'Hoàng Kim Chi',
    email: 'chi.hoang@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Account Executive',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0903.444.555',
    status: 'ON_LEAVE_MATERNITY',
    maxCapacity: 5,
    specialties: ['Tài chính - Ngân hàng (BFSI)', 'Fintech & Thanh toán'],
    statusNote: 'Nghỉ chế độ thai sản 6 tháng bắt đầu từ tuần này. Cần bàn giao trọn vẹn toàn bộ 4 deal.'
  },
  {
    id: 'USR-REP-05',
    name: 'Vũ Đức Thắng',
    email: 'thang.vu@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Junior Account Executive',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0903.666.777',
    status: 'ACTIVE_CAPACITY',
    maxCapacity: 5,
    specialties: ['SaaS B2B', 'Chuyển đổi số SMEs', 'Nhiệt tình & Tiếp cận nhanh'],
    statusNote: 'Thành viên mới năng động, hiện chỉ giữ 1 deal, tải cực kỳ rảnh, sẵn sàng phối hợp nhận bàn giao.'
  },
  {
    id: 'USR-REP-06',
    name: 'Đặng Quỳnh Như',
    email: 'nhu.dang@companycrm.vn',
    role: 'SALES_REP',
    roleTitle: 'Key Account Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    teamName: 'Nhóm Doanh nghiệp Lớn (Enterprise)',
    phone: '0903.888.999',
    status: 'ACTIVE_NORMAL',
    maxCapacity: 6,
    specialties: ['Tài chính & Bảo hiểm', 'Giải pháp An ninh mạng', 'Quan hệ C-level'],
    statusNote: 'Đang phụ trách 2 deal tài chính, có quan hệ tốt với khối Ngân hàng, rất thích hợp nhận deal từ Kim Chi.'
  },
  {
    id: 'USR-DIR-01',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@companycrm.vn',
    role: 'SALES_DIRECTOR',
    roleTitle: 'Giám đốc Kinh doanh Toàn quốc (CSO)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    teamName: 'Ban Điều Hành Kinh Doanh',
    phone: '0988.999.000',
    status: 'ACTIVE_NORMAL',
    maxCapacity: 20,
    specialties: ['Chiến lược doanh số', 'Quy hoạch tổ chức']
  }
];
