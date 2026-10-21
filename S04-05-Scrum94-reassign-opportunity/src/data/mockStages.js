// =====================================================================
// SCRUM-94: Danh mục giai đoạn cơ hội bán hàng B2B (Pipeline Stages)
// =====================================================================

export const PIPELINE_STAGES = {
  DISCOVERY: {
    id: 'DISCOVERY',
    name: 'Khảo sát & Đánh giá nhu cầu',
    shortName: 'Khảo sát',
    probability: 20,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    badgeClass: 'badge-blue'
  },
  POC_DEMO: {
    id: 'POC_DEMO',
    name: 'Trình diễn Demo & POC',
    shortName: 'Demo POC',
    probability: 40,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    badgeClass: 'badge-purple'
  },
  PROPOSAL: {
    id: 'PROPOSAL',
    name: 'Gửi Báo Giá & Đề Xuất Giải Pháp',
    shortName: 'Báo giá',
    probability: 60,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    badgeClass: 'badge-amber'
  },
  NEGOTIATION: {
    id: 'NEGOTIATION',
    name: 'Thương Thảo Hợp Đồng & Pháp Lý',
    shortName: 'Thương thảo',
    probability: 80,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    badgeClass: 'badge-pink'
  },
  CLOSING: {
    id: 'CLOSING',
    name: 'Chuẩn Bị Ký Kết & Chốt Deal',
    shortName: 'Ký kết',
    probability: 95,
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    badgeClass: 'badge-cyan'
  },
  CLOSED_WON: {
    id: 'CLOSED_WON',
    name: 'Thành Công (Closed Won)',
    shortName: 'Thành công',
    probability: 100,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    badgeClass: 'badge-emerald'
  },
  CLOSED_LOST: {
    id: 'CLOSED_LOST',
    name: 'Thất Bại (Closed Lost)',
    shortName: 'Thất bại',
    probability: 0,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.15)',
    borderColor: 'rgba(107, 114, 128, 0.4)',
    badgeClass: 'badge-gray'
  }
};
