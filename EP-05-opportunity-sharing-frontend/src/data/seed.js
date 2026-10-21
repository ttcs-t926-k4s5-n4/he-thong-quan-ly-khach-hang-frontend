export const TEAM = [
  { id: 'u-phong', name: 'Phạm Minh Phong', shortName: 'Phong', email: 'phong@acme.vn', role: 'Trưởng nhóm kinh doanh', color: 'violet' },
  { id: 'u-linh', name: 'Trần Mỹ Linh', shortName: 'Linh', email: 'linh@acme.vn', role: 'Chuyên viên kinh doanh', color: 'blue' },
  { id: 'u-minh', name: 'Nguyễn Quang Minh', shortName: 'Minh', email: 'minh@acme.vn', role: 'Chuyên viên giải pháp', color: 'green' },
  { id: 'u-an', name: 'Lê Hoàng An', shortName: 'An', email: 'an@acme.vn', role: 'Chuyên viên kinh doanh', color: 'orange' },
  { id: 'u-ha', name: 'Võ Thu Hà', shortName: 'Hà', email: 'ha@acme.vn', role: 'Quản lý khách hàng', color: 'pink' },
  { id: 'u-tuan', name: 'Đặng Anh Tuấn', shortName: 'Tuấn', email: 'tuan@acme.vn', role: 'Chuyên viên kỹ thuật', color: 'teal' },
  { id: 'u-thao', name: 'Phạm Thanh Thảo', shortName: 'Thảo', email: 'thao@acme.vn', role: 'Chuyên viên kinh doanh', color: 'indigo' },
];

const stamp = (daysAgo, hour = 9, minute = 15) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'OPP-2026-0142',
    name: 'Triển khai ERP toàn diện',
    company: 'Công ty CP Minh Long',
    value: 1280000000,
    stage: 'Đàm phán',
    closeDate: '2026-11-18',
    product: 'ERP Enterprise',
    ownerId: 'u-phong',
    memberIds: ['u-linh', 'u-minh'],
    updatedAt: stamp(0, 10, 40),
    activities: [
      { id: 'act-142-1', type: 'meeting', title: 'Họp rà soát yêu cầu', note: 'Đã thống nhất phạm vi triển khai giai đoạn 1 và lịch workshop kỹ thuật.', actorId: 'u-minh', createdAt: stamp(0, 10, 40) },
      { id: 'act-142-2', type: 'call', title: 'Trao đổi ngân sách với khách hàng', note: 'Khách hàng đang xem xét phương án thanh toán theo quý.', actorId: 'u-linh', createdAt: stamp(1, 15, 10) },
      { id: 'act-142-3', type: 'email', title: 'Gửi bản đề xuất thương mại', note: 'Đã gửi báo giá phiên bản 2 cho chị Mai.', actorId: 'u-phong', createdAt: stamp(3, 9, 5) },
    ],
    audit: [
      { id: 'log-142-1', type: 'created', actorId: 'u-phong', createdAt: stamp(22, 8, 45), summary: 'Tạo cơ hội và thiết lập Phạm Minh Phong làm chủ sở hữu.' },
      { id: 'log-142-2', type: 'member_added', actorId: 'u-phong', createdAt: stamp(8, 14, 20), summary: 'Chia sẻ cơ hội với Trần Mỹ Linh, Nguyễn Quang Minh.' },
      { id: 'log-142-3', type: 'activity_logged', actorId: 'u-linh', createdAt: stamp(1, 15, 10), summary: 'Ghi hoạt động: Trao đổi ngân sách với khách hàng.' },
      { id: 'log-142-4', type: 'activity_logged', actorId: 'u-minh', createdAt: stamp(0, 10, 40), summary: 'Ghi hoạt động: Họp rà soát yêu cầu.' },
    ],
  },
  {
    id: 'OPP-2026-0138',
    name: 'Nâng cấp hệ thống CRM',
    company: 'Công ty TNHH Sao Việt',
    value: 740000000,
    stage: 'Đề xuất giải pháp',
    closeDate: '2026-11-29',
    product: 'CRM Pro',
    ownerId: 'u-linh',
    memberIds: ['u-ha'],
    updatedAt: stamp(1, 16, 5),
    activities: [
      { id: 'act-138-1', type: 'email', title: 'Gửi demo và tài liệu giới thiệu', note: 'Đã chia sẻ tài liệu demo và kế hoạch chuyển đổi dữ liệu.', actorId: 'u-ha', createdAt: stamp(1, 16, 5) },
    ],
    audit: [
      { id: 'log-138-1', type: 'created', actorId: 'u-linh', createdAt: stamp(14, 11, 0), summary: 'Tạo cơ hội và thiết lập Trần Mỹ Linh làm chủ sở hữu.' },
      { id: 'log-138-2', type: 'member_added', actorId: 'u-linh', createdAt: stamp(4, 13, 35), summary: 'Chia sẻ cơ hội với Võ Thu Hà.' },
    ],
  },
  {
    id: 'OPP-2026-0127',
    name: 'Hệ thống quản lý kho WMS',
    company: 'Tập đoàn An Phát',
    value: 2160000000,
    stage: 'Đang tư vấn',
    closeDate: '2026-12-06',
    product: 'WMS Logistics',
    ownerId: 'u-an',
    memberIds: ['u-tuan', 'u-thao'],
    updatedAt: stamp(2, 11, 30),
    activities: [
      { id: 'act-127-1', type: 'note', title: 'Cập nhật yêu cầu tích hợp', note: 'Khách hàng cần kết nối thêm hai hệ thống cân điện tử.', actorId: 'u-tuan', createdAt: stamp(2, 11, 30) },
    ],
    audit: [
      { id: 'log-127-1', type: 'created', actorId: 'u-an', createdAt: stamp(18, 9, 20), summary: 'Tạo cơ hội và thiết lập Lê Hoàng An làm chủ sở hữu.' },
      { id: 'log-127-2', type: 'member_added', actorId: 'u-an', createdAt: stamp(6, 10, 10), summary: 'Chia sẻ cơ hội với Đặng Anh Tuấn, Phạm Thanh Thảo.' },
    ],
  },
  {
    id: 'OPP-2026-0119',
    name: 'Tự động hóa quy trình bán hàng',
    company: 'Công ty CP Đại Nam',
    value: 395000000,
    stage: 'Đủ điều kiện',
    closeDate: '2026-11-23',
    product: 'Sales Automation',
    ownerId: 'u-phong',
    memberIds: ['u-thao'],
    updatedAt: stamp(4, 13, 20),
    activities: [],
    audit: [
      { id: 'log-119-1', type: 'created', actorId: 'u-phong', createdAt: stamp(11, 14, 0), summary: 'Tạo cơ hội và thiết lập Phạm Minh Phong làm chủ sở hữu.' },
      { id: 'log-119-2', type: 'member_added', actorId: 'u-phong', createdAt: stamp(5, 10, 45), summary: 'Chia sẻ cơ hội với Phạm Thanh Thảo.' },
    ],
  },
];
