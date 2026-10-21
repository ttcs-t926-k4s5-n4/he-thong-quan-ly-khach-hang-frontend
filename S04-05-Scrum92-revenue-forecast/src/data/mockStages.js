export const OPPORTUNITY_STAGES = {
  QUALIFICATION: {
    id: 'QUALIFICATION',
    label: 'Khảo sát & Đánh giá',
    defaultProbability: 20,
    color: '#06b6d4',
    badgeClass: 'badge-qualification',
    isClosed: false,
    description: 'Xác định ngân sách, người có quyền quyết định và nhu cầu bài toán của khách hàng.'
  },
  SOLUTION_DEMO: {
    id: 'SOLUTION_DEMO',
    label: 'Giải pháp & Demo POC',
    defaultProbability: 40,
    color: '#3b82f6',
    badgeClass: 'badge-solution',
    isClosed: false,
    description: 'Trình diễn giải pháp kỹ thuật, kiểm thử tính năng POC theo yêu cầu khách hàng.'
  },
  PROPOSAL: {
    id: 'PROPOSAL',
    label: 'Gửi Báo Giá & Đề Xuất',
    defaultProbability: 60,
    color: '#8b5cf6',
    badgeClass: 'badge-proposal',
    isClosed: false,
    description: 'Gửi hồ sơ chào giá chính thức, phương án triển khai và điều khoản thanh toán.'
  },
  NEGOTIATION: {
    id: 'NEGOTIATION',
    label: 'Thương Thảo Hợp Đồng',
    defaultProbability: 80,
    color: '#f59e0b',
    badgeClass: 'badge-negotiation',
    isClosed: false,
    description: 'Đàm phán chiết khấu, chốt các điều khoản pháp lý, hợp đồng chờ ký kết.'
  },
  CLOSED_WON: {
    id: 'CLOSED_WON',
    label: 'Đóng Thắng (Hợp Đồng Ký)',
    defaultProbability: 100,
    color: '#10b981',
    badgeClass: 'badge-won',
    isClosed: true,
    isWon: true,
    description: 'Khách hàng đã ký hợp đồng kinh tế và đặt cọc/thanh toán đợt 1.'
  },
  CLOSED_LOST: {
    id: 'CLOSED_LOST',
    label: 'Đóng Thua (Mất Deal)',
    defaultProbability: 0,
    color: '#ef4444',
    badgeClass: 'badge-lost',
    isClosed: true,
    isWon: false,
    description: 'Khách hàng hủy dự án hoặc chọn đối thủ cạnh tranh khác.'
  }
};
