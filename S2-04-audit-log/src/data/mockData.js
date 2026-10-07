// Dữ liệu mẫu kiểm toán (Audit Logs) phục vụ điều tra sai lệch số liệu cuối quý (SCRUM-62)
export const OBJECT_TYPES = {
  DISCOUNT: {
    id: 'DISCOUNT',
    label: 'Chiết khấu',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    icon: 'Percent'
  },
  SALES_TARGET: {
    id: 'SALES_TARGET',
    label: 'Chỉ tiêu doanh số',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    icon: 'Target'
  },
  DATA_OWNERSHIP: {
    id: 'DATA_OWNERSHIP',
    label: 'Quyền sở hữu dữ liệu',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    icon: 'ShieldCheck'
  },
  USER_ROLE: {
    id: 'USER_ROLE',
    label: 'Vai trò người dùng',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    icon: 'UserCheck'
  }
};

export const USERS_LIST = [
  {
    id: 'usr_001',
    name: 'Trần Văn Hoàng',
    email: 'hoang.tran@company.com',
    role: 'Quản trị hệ thống (System Admin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'usr_002',
    name: 'Lê Thị Bích Ngọc',
    email: 'ngoc.le@company.com',
    role: 'Giám đốc Kinh doanh (Sales Director)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'usr_003',
    name: 'Nguyễn Minh Đức',
    email: 'duc.nguyen@company.com',
    role: 'Trưởng phòng KD Miền Nam (Sales Manager)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'usr_004',
    name: 'Phạm Quốc Tuấn',
    email: 'tuan.pham@company.com',
    role: 'Chuyên viên Kinh doanh (Senior AE)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'usr_005',
    name: 'Hoàng Thuỳ Trang',
    email: 'trang.hoang@company.com',
    role: 'Kế toán trưởng / Kiểm soát tài chính',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'usr_006',
    name: 'Vũ Đình Trọng',
    email: 'trong.vu@company.com',
    role: 'Quản lý Dữ liệu CRM (Data Steward)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-2024-9841',
    timestamp: '2024-09-30 23:42:15',
    user: USERS_LIST[2], // Nguyễn Minh Đức
    ipAddress: '192.168.10.45 (VP Sài Gòn)',
    objectType: 'SALES_TARGET',
    targetId: 'TGT-Q3-SGN',
    targetName: 'Chỉ tiêu Doanh thu Quý 3 - Team Sales Nam Bộ',
    fieldName: 'target_revenue_quota',
    oldValue: '15,000,000,000 VND (15 Tỷ)',
    newValue: '10,500,000,000 VND (10.5 Tỷ)',
    changeType: 'Cập nhật chỉ tiêu',
    severity: 'critical',
    isAnomalous: true,
    anomalyReason: 'Hạ 4.5 tỷ chỉ tiêu vào lúc 23:42 ngày cuối cùng của Quý 3 để khớp thưởng đạt 100% KPI.',
    reason: 'Điều chỉnh hồi tố theo phê duyệt miệng trong cuộc họp nội bộ',
    approvedBy: 'Chưa có phiếu duyệt chính thức (Unapproved)',
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'AUD-2024-9840',
    timestamp: '2024-09-30 21:15:08',
    user: USERS_LIST[3], // Phạm Quốc Tuấn
    ipAddress: '113.161.72.10 (Mạng ngoài / 4G)',
    objectType: 'DISCOUNT',
    targetId: 'HD-2024-VIP-089',
    targetName: 'Hợp đồng Cung cấp Thiết bị - KH Tập đoàn Alpha Group',
    fieldName: 'discount_percentage',
    oldValue: '8.0%',
    newValue: '28.5%',
    changeType: 'Sửa mức chiết khấu',
    severity: 'critical',
    isAnomalous: true,
    anomalyReason: 'Chiết khấu tăng đột biến +20.5% vào đêm chốt sổ quý làm hụt 1.8 tỷ doanh thu thực tế.',
    reason: 'Áp dụng chính sách khuyến mại đối tác chiến lược phút chót',
    approvedBy: 'Tự động duyệt qua quyền vượt định mức (Overridden)',
    integrityHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  {
    id: 'AUD-2024-9839',
    timestamp: '2024-09-30 18:30:22',
    user: USERS_LIST[1], // Lê Thị Bích Ngọc
    ipAddress: '192.168.1.12 (VP Hội đồng)',
    objectType: 'DATA_OWNERSHIP',
    targetId: 'DEAL-CORP-402',
    targetName: 'Hợp đồng Giải pháp Đám mây 20 Tỷ - Ngân hàng VietFin',
    fieldName: 'deal_owner_account',
    oldValue: 'Vũ Đức Thành (NV Kinh doanh Hà Nội)',
    newValue: 'Phạm Quốc Tuấn (Senior AE)',
    changeType: 'Chuyển quyền sở hữu',
    severity: 'high',
    isAnomalous: true,
    anomalyReason: 'Chuyển quyền sở hữu hợp đồng 20 tỷ chỉ 5 giờ trước thời điểm tính hoa hồng Quý 3.',
    reason: 'Tái cơ cấu danh mục khách hàng trọng điểm theo chỉ đạo',
    approvedBy: 'Lê Thị Bích Ngọc (Sales Director)',
    integrityHash: '7d56c42998fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c912'
  },
  {
    id: 'AUD-2024-9838',
    timestamp: '2024-09-30 14:10:45',
    user: USERS_LIST[0], // Trần Văn Hoàng (Admin)
    ipAddress: '192.168.1.2 (Máy trạm Admin Trung tâm)',
    objectType: 'USER_ROLE',
    targetId: 'USR-ACC-004',
    targetName: 'Tài khoản Phạm Quốc Tuấn (Senior AE)',
    fieldName: 'rbac_permission_role',
    oldValue: 'Sales_Staff (Chỉ có quyền đề xuất chiết khấu < 10%)',
    newValue: 'Sales_Special_Admin (Có quyền tự duyệt chiết khấu lên đến 30%)',
    changeType: 'Nâng quyền vai trò',
    severity: 'critical',
    isAnomalous: true,
    anomalyReason: 'Cấp quyền đặc quyền sửa chiết khấu cao cho nhân viên bán hàng vào ngày cuối quý.',
    reason: 'Cấp quyền khẩn cấp để xử lý deal đóng quý theo yêu cầu GĐKD',
    approvedBy: 'Ticket Jira SEC-904 (Cần kiểm tra lại chữ ký)',
    integrityHash: '3b92c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a101'
  },
  {
    id: 'AUD-2024-9835',
    timestamp: '2024-09-29 16:20:00',
    user: USERS_LIST[2], // Nguyễn Minh Đức
    ipAddress: '192.168.10.45 (VP Sài Gòn)',
    objectType: 'DISCOUNT',
    targetId: 'HD-2024-RETAIL-112',
    targetName: 'Đơn hàng Phân phối Quý - Chuỗi Bách Hóa XanhMart',
    fieldName: 'trade_discount_rate',
    oldValue: '5.0%',
    newValue: '12.0%',
    changeType: 'Sửa mức chiết khấu',
    severity: 'medium',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Chiết khấu sản lượng đạt mốc cam kết năm',
    approvedBy: 'Biên bản đàm phán số 45/BB-2024',
    integrityHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
  },
  {
    id: 'AUD-2024-9830',
    timestamp: '2024-09-28 11:05:30',
    user: USERS_LIST[4], // Hoàng Thuỳ Trang
    ipAddress: '192.168.1.88 (Phòng Tài chính)',
    objectType: 'SALES_TARGET',
    targetId: 'TGT-Q3-ECOMMERCE',
    targetName: 'Chỉ tiêu Doanh thu Kênh Thương mại Điện tử',
    fieldName: 'ecommerce_quarterly_target',
    oldValue: '8,000,000,000 VND',
    newValue: '7,200,000,000 VND',
    changeType: 'Cập nhật chỉ tiêu',
    severity: 'medium',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Trừ khấu hao ngân sách quảng cáo không được giải ngân',
    approvedBy: 'Quyết định HĐQT số 12/QĐ-TC',
    integrityHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 'AUD-2024-9824',
    timestamp: '2024-09-27 15:45:10',
    user: USERS_LIST[5], // Vũ Đình Trọng
    ipAddress: '192.168.1.50 (Data Hub)',
    objectType: 'DATA_OWNERSHIP',
    targetId: 'ACC-ENTERPRISE-55',
    targetName: 'Khách hàng Doanh nghiệp Tập đoàn Dầu khí PetroVN',
    fieldName: 'account_lead_consultant',
    oldValue: 'Ngô Thanh Tùng',
    newValue: 'Đoàn Thị Mai Phương',
    changeType: 'Chuyển quyền sở hữu',
    severity: 'low',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Nhân sự cũ chuyển công tác, bàn giao tài khoản phụ trách',
    approvedBy: 'Email phê duyệt của Trưởng bộ phận',
    integrityHash: '4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e'
  },
  {
    id: 'AUD-2024-9818',
    timestamp: '2024-09-25 09:30:00',
    user: USERS_LIST[1], // Lê Thị Bích Ngọc
    ipAddress: '192.168.1.12 (VP Hội đồng)',
    objectType: 'DISCOUNT',
    targetId: 'POL-DISCOUNT-Q3',
    targetName: 'Chính sách Chiết khấu Khách hàng Thân thiết Tier 1',
    fieldName: 'max_allowed_rebate',
    oldValue: '15.0%',
    newValue: '18.0%',
    changeType: 'Sửa mức chiết khấu',
    severity: 'high',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Gia hạn chính sách kích cầu tuần cuối quý theo kế hoạch ban giám đốc',
    approvedBy: 'Nghị quyết Ban Điều Hành số 88/NQ-BĐH',
    integrityHash: 'c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8'
  },
  {
    id: 'AUD-2024-9812',
    timestamp: '2024-09-22 17:15:33',
    user: USERS_LIST[0], // Trần Văn Hoàng
    ipAddress: '192.168.1.2 (Máy trạm Admin Trung tâm)',
    objectType: 'USER_ROLE',
    targetId: 'USR-ACC-012',
    targetName: 'Tài khoản Đặng Hoàng Long',
    fieldName: 'finance_approval_role',
    oldValue: 'Finance_Officer',
    newValue: 'Finance_Approver_Level2',
    changeType: 'Nâng quyền vai trò',
    severity: 'high',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Bổ nhiệm thay thế nhân sự nghỉ thai sản',
    approvedBy: 'Quyết định Nhân sự số 342/QĐ-NS',
    integrityHash: '9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d'
  },
  {
    id: 'AUD-2024-9805',
    timestamp: '2024-09-18 10:20:11',
    user: USERS_LIST[3], // Phạm Quốc Tuấn
    ipAddress: '192.168.1.75 (Tầng 4 Kinh doanh)',
    objectType: 'DISCOUNT',
    targetId: 'HD-2024-SME-301',
    targetName: 'Hợp đồng Dịch vụ Bảo trì Phần mềm - Cty Minh Long',
    fieldName: 'contract_discount',
    oldValue: '0.0%',
    newValue: '7.5%',
    changeType: 'Sửa mức chiết khấu',
    severity: 'low',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Chiết khấu thanh toán trước 100% giá trị hợp đồng',
    approvedBy: 'Trưởng phòng KD duyệt trên hệ thống ERP',
    integrityHash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b'
  },
  {
    id: 'AUD-2024-9799',
    timestamp: '2024-09-15 14:00:25',
    user: USERS_LIST[2], // Nguyễn Minh Đức
    ipAddress: '192.168.10.45 (VP Sài Gòn)',
    objectType: 'DATA_OWNERSHIP',
    targetId: 'OPP-GOV-889',
    targetName: 'Dự án Số hóa Hồ sơ Lưu trữ - Sở Thông Tin TT',
    fieldName: 'project_lead_assigned',
    oldValue: 'Bùi Anh Tuấn',
    newValue: 'Lý Quốc Hùng',
    changeType: 'Chuyển quyền sở hữu',
    severity: 'medium',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Tối ưu nguồn lực dự án công',
    approvedBy: 'Biên bản giao nhận dự án số 19',
    integrityHash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c'
  },
  {
    id: 'AUD-2024-9788',
    timestamp: '2024-09-10 08:45:00',
    user: USERS_LIST[1], // Lê Thị Bích Ngọc
    ipAddress: '192.168.1.12 (VP Hội đồng)',
    objectType: 'SALES_TARGET',
    targetId: 'TGT-Q3-GLOBAL',
    targetName: 'Chỉ tiêu Doanh thu Toàn quốc Quý 3/2024',
    fieldName: 'national_quarterly_target',
    oldValue: '60,000,000,000 VND',
    newValue: '62,500,000,000 VND',
    changeType: 'Cập nhật chỉ tiêu',
    severity: 'high',
    isAnomalous: false,
    anomalyReason: '',
    reason: 'Tăng mục tiêu tăng trưởng theo đà mở rộng thị trường quý 3',
    approvedBy: 'Nghị quyết HĐQT số 05/NQ-2024',
    integrityHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'
  }
];

// Danh mục thực thể để phục vụ chức năng "Thực hiện thay đổi mới / Giả lập"
export const SIMULATION_TARGETS = [
  {
    type: 'DISCOUNT',
    id: 'HD-2024-VIP-105',
    name: 'Hợp đồng Cung cấp Dịch vụ Viễn thông - Vingroup',
    currentValue: '10.0%',
    fieldName: 'Tỷ lệ chiết khấu thương mại'
  },
  {
    type: 'DISCOUNT',
    id: 'HD-2024-RETAIL-77',
    name: 'Đơn hàng Phân phối Toàn quốc - Thế Giới Số Digitech',
    currentValue: '5.5%',
    fieldName: 'Chiết khấu thanh toán sớm'
  },
  {
    type: 'SALES_TARGET',
    id: 'TGT-Q4-HN',
    name: 'Chỉ tiêu Doanh thu Quý 4 - Khu vực Hà Nội & Miền Bắc',
    currentValue: '25,000,000,000 VND',
    fieldName: 'Chỉ tiêu doanh số KPI Quý 4'
  },
  {
    type: 'SALES_TARGET',
    id: 'TGT-Q4-B2B',
    name: 'Chỉ tiêu Doanh thu Khối Khách hàng Doanh nghiệp Lớn (Key Accounts)',
    currentValue: '40,000,000,000 VND',
    fieldName: 'Chỉ tiêu KPI Khách hàng Trọng điểm'
  },
  {
    type: 'DATA_OWNERSHIP',
    id: 'ACC-VIP-099',
    name: 'Khách hàng VIP Hạng Kim Cương - Vietcombank',
    currentValue: 'Trần Minh Tuấn (Senior Sales)',
    fieldName: 'Người phụ trách tài khoản chính (Account Owner)'
  },
  {
    type: 'DATA_OWNERSHIP',
    id: 'DEAL-CORP-911',
    name: 'Cơ hội Hợp đồng Chuyển đổi số 15 Tỷ - VNPT',
    currentValue: 'Lê Văn Khải',
    fieldName: 'Quyền sở hữu cơ hội kinh doanh'
  },
  {
    type: 'USER_ROLE',
    id: 'USR-ACC-088',
    name: 'Tài khoản Nhân viên Nguyễn Lan Anh',
    currentValue: 'Sales_Representative (Nhân viên)',
    fieldName: 'Vai trò phân quyền hệ thống'
  },
  {
    type: 'USER_ROLE',
    id: 'USR-ACC-077',
    name: 'Tài khoản Trưởng nhóm Trần Hải Đăng',
    currentValue: 'Team_Leader',
    fieldName: 'Vai trò phê duyệt chiết khấu & ngân sách'
  }
];
