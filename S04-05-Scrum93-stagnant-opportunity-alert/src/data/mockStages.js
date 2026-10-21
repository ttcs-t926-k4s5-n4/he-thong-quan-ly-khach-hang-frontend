// =====================================================================
// SCRUM-93: Cấu hình giai đoạn bán hàng & Ngưỡng N ngày đình trệ mặc định (AC1)
// =====================================================================

export const DEFAULT_STAGE_THRESHOLDS = {
  QUALIFICATION: {
    id: 'QUALIFICATION',
    label: 'Khảo sát & Đánh giá nhu cầu',
    shortLabel: 'Khảo sát',
    thresholdDays: 7, // N = 7 ngày
    criticalMultiplier: 1.5, // > 10 ngày là mức khẩn cấp
    color: '#06b6d4', // Cyan
    badgeClass: 'badge-qualification',
    isClosed: false,
    description: 'Xác định chân dung khách hàng, ngân sách dự kiến, bài toán nghiệp vụ và người có quyền quyết định.',
    recommendation: 'Nếu quá 7 ngày không phản hồi, gửi tài liệu nghiên cứu tình huống (Case study) hoặc gọi điện nhắc nhở.'
  },
  SOLUTION_DEMO: {
    id: 'SOLUTION_DEMO',
    label: 'Giải pháp & Demo POC',
    shortLabel: 'Demo POC',
    thresholdDays: 10, // N = 10 ngày
    criticalMultiplier: 1.5, // > 15 ngày là mức khẩn cấp
    color: '#3b82f6', // Blue
    badgeClass: 'badge-solution',
    isClosed: false,
    description: 'Chuẩn bị kịch bản demo tính năng kỹ thuật, giải đáp thắc mắc và kiểm thử khả thi.',
    recommendation: 'Cần gửi bản ghi cuộc họp demo trong vòng 24h và chốt lịch họp phản hồi không quá 10 ngày.'
  },
  PROPOSAL: {
    id: 'PROPOSAL',
    label: 'Gửi Báo Giá & Đề Xuất',
    shortLabel: 'Báo giá',
    thresholdDays: 5, // N = 5 ngày
    criticalMultiplier: 1.6, // > 8 ngày là mức khẩn cấp
    color: '#8b5cf6', // Purple
    badgeClass: 'badge-proposal',
    isClosed: false,
    description: 'Xây dựng phương án triển khai chi tiết, chính sách giá, chiết khấu và điều khoản thanh toán.',
    recommendation: 'Báo giá để lâu sẽ bị đối thủ cạnh tranh chào giá rẻ hơn. Sau 5 ngày im lặng phải liên hệ tái thẩm định.'
  },
  NEGOTIATION: {
    id: 'NEGOTIATION',
    label: 'Thương Thảo Hợp Đồng',
    shortLabel: 'Thương thảo',
    thresholdDays: 3, // N = 3 ngày (giai đoạn nước rút)
    criticalMultiplier: 2.0, // > 6 ngày là mức cực kỳ khẩn cấp
    color: '#f59e0b', // Amber
    badgeClass: 'badge-negotiation',
    isClosed: false,
    description: 'Rà soát hợp đồng pháp lý, đàm phán tiến độ thanh toán và SLA bảo hành cam kết.',
    recommendation: 'Thương vụ ở giai đoạn này rất nhạy cảm. Trưởng nhóm cần trực tiếp tham gia hỗ trợ chốt hợp đồng.'
  },
  CLOSED_WON: {
    id: 'CLOSED_WON',
    label: 'Đóng Thắng (Hợp Đồng Ký)',
    shortLabel: 'Đã ký',
    thresholdDays: 0,
    color: '#10b981',
    badgeClass: 'badge-won',
    isClosed: true,
    isWon: true,
    description: 'Hợp đồng kinh tế đã ký kết thành công và hoàn tất thủ tục bàn giao.'
  },
  CLOSED_LOST: {
    id: 'CLOSED_LOST',
    label: 'Đóng Thua (Mất Deal)',
    shortLabel: 'Mất deal',
    thresholdDays: 0,
    color: '#ef4444',
    badgeClass: 'badge-lost',
    isClosed: true,
    isWon: false,
    description: 'Khách hàng quyết định dừng dự án hoặc ký hợp đồng với đơn vị đối thủ.'
  }
};
