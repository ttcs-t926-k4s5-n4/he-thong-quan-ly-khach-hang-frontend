export const ACTORS = [
  'Nguyễn Minh Anh',
  'Trần Hoàng Nam',
  'Lê Thu Hà',
  'Phạm Quốc Bảo',
];

export const STAGES = [
  'Khám phá',
  'Đánh giá nhu cầu',
  'Đề xuất giải pháp',
  'Đàm phán',
  'Đã thắng',
  'Đã mất',
];

export const FIELD_META = {
  stage: { label: 'Giai đoạn', shortLabel: 'Giai đoạn', icon: 'layers' },
  value: { label: 'Giá trị cơ hội', shortLabel: 'Giá trị', icon: 'wallet' },
  closeDate: { label: 'Ngày chốt dự kiến', shortLabel: 'Ngày chốt', icon: 'calendar' },
  owner: { label: 'Người sở hữu', shortLabel: 'Người sở hữu', icon: 'user' },
};

export const SEED_OPPORTUNITIES = [
  {
    id: 'opp-101',
    name: 'Triển khai nền tảng CRM',
    company: 'An Phát Group',
    stage: 'Đàm phán',
    value: 480000000,
    closeDate: '2026-11-12',
    owner: 'Nguyễn Minh Anh',
  },
  {
    id: 'opp-102',
    name: 'Gói dữ liệu doanh nghiệp',
    company: 'Minh Long Trading',
    stage: 'Đề xuất giải pháp',
    value: 265000000,
    closeDate: '2026-11-20',
    owner: 'Trần Hoàng Nam',
  },
  {
    id: 'opp-103',
    name: 'Mở rộng hệ thống ERP',
    company: 'VinaTech',
    stage: 'Đánh giá nhu cầu',
    value: 720000000,
    closeDate: '2026-12-05',
    owner: 'Lê Thu Hà',
  },
  {
    id: 'opp-104',
    name: 'Gia hạn dịch vụ Cloud',
    company: 'Blue Ocean Logistics',
    stage: 'Đã thắng',
    value: 180000000,
    closeDate: '2026-10-30',
    owner: 'Phạm Quốc Bảo',
  },
  {
    id: 'opp-105',
    name: 'Tự động hóa quy trình bán hàng',
    company: 'Nam Việt Retail',
    stage: 'Đánh giá nhu cầu',
    value: 350000000,
    closeDate: '2026-12-18',
    owner: 'Nguyễn Minh Anh',
  },
];

const at = (day, hour, minute = 0) =>
  new Date(2026, 9, day, hour, minute, 0).toISOString();

export const SEED_HISTORY = [
  {
    id: 'hist-010', opportunityId: 'opp-101', field: 'value', before: 390000000, after: 480000000,
    actor: 'Nguyễn Minh Anh', timestamp: at(17, 10, 42), note: 'Bổ sung hạng mục đào tạo và hỗ trợ vận hành.',
  },
  {
    id: 'hist-009', opportunityId: 'opp-102', field: 'closeDate', before: '2026-11-10', after: '2026-11-20',
    actor: 'Trần Hoàng Nam', timestamp: at(17, 9, 18), note: 'Khách hàng cần thêm thời gian duyệt ngân sách.',
  },
  {
    id: 'hist-008', opportunityId: 'opp-101', field: 'stage', before: 'Đề xuất giải pháp', after: 'Đàm phán',
    actor: 'Nguyễn Minh Anh', timestamp: at(16, 16, 5), note: 'Đã thống nhất phạm vi triển khai và chuyển sang trao đổi điều khoản.',
  },
  {
    id: 'hist-007', opportunityId: 'opp-103', field: 'owner', before: 'Trần Hoàng Nam', after: 'Lê Thu Hà',
    actor: 'Phạm Quốc Bảo', timestamp: at(16, 14, 31), note: 'Điều phối lại theo chuyên môn ngành sản xuất.',
  },
  {
    id: 'hist-006', opportunityId: 'opp-104', field: 'stage', before: 'Đàm phán', after: 'Đã thắng',
    actor: 'Phạm Quốc Bảo', timestamp: at(16, 11, 12), note: 'Hợp đồng đã được hai bên xác nhận.',
  },
  {
    id: 'hist-005', opportunityId: 'opp-102', field: 'value', before: 220000000, after: 265000000,
    actor: 'Trần Hoàng Nam', timestamp: at(15, 15, 48), note: 'Cập nhật theo số lượng giấy phép cuối cùng.',
  },
  {
    id: 'hist-004', opportunityId: 'opp-103', field: 'closeDate', before: '2026-11-21', after: '2026-12-05',
    actor: 'Lê Thu Hà', timestamp: at(15, 10, 25), note: 'Lịch đánh giá kỹ thuật được dời sang tháng sau.',
  },
  {
    id: 'hist-003', opportunityId: 'opp-101', field: 'owner', before: 'Lê Thu Hà', after: 'Nguyễn Minh Anh',
    actor: 'Trần Hoàng Nam', timestamp: at(14, 16, 2), note: 'Bàn giao cơ hội sau buổi họp khách hàng.',
  },
  {
    id: 'hist-002', opportunityId: 'opp-105', field: 'stage', before: 'Khám phá', after: 'Khám phá',
    actor: 'Nguyễn Minh Anh', timestamp: at(14, 9, 30), note: 'Ghi chú: đã hoàn thành cuộc gọi khám phá đầu tiên.',
  },
  {
    id: 'hist-001', opportunityId: 'opp-104', field: 'value', before: 150000000, after: 180000000,
    actor: 'Phạm Quốc Bảo', timestamp: at(13, 13, 40), note: 'Bao gồm thêm dung lượng lưu trữ.',
  },
];
