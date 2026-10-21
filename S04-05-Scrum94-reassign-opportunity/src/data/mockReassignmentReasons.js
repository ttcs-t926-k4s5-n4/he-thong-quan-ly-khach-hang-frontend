// =====================================================================
// SCRUM-94: Danh mục Lý do phân bổ lại quyền sở hữu cơ hội (Transfer Reasons)
// Bắt buộc ghi nhận kèm nhật ký và ghi chú bàn giao
// =====================================================================

export const REASSIGNMENT_REASONS = [
  {
    id: 'LEAVE_EXTENDED',
    label: 'Người phụ trách nghỉ phép dài hạn (Ốm đau / Điều trị / Việc gia đình)',
    shortLabel: 'Nghỉ phép dài hạn',
    category: 'LEAVE',
    isUrgent: true,
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    description: 'Chuyển giao quyền sở hữu để thương vụ không bị đứng yên khi nhân viên vắng mặt trên 1 tuần.',
    defaultNotes: 'Người phụ trách hiện tại nghỉ phép dài hạn. Chuyển giao toàn bộ hồ sơ khách hàng, liên hệ và tài liệu đàm phán để deal tiếp tục tiến triển.',
    defaultChecklist: [
      'Đã thông báo lý do vắng mặt tạm thời cho khách hàng',
      'Đã bàn giao lịch sử trao đổi, báo giá và phụ lục kỹ thuật',
      'Đã lên lịch họp 3 bên (Handover meeting) hoặc cuộc gọi giới thiệu nhân sự mới',
      'Đã cập nhật số điện thoại & email của người nhận mới vào hệ thống khách hàng'
    ]
  },
  {
    id: 'LEAVE_MATERNITY',
    label: 'Người phụ trách nghỉ chế độ thai sản (Bàn giao dài hạn 6 tháng)',
    shortLabel: 'Nghỉ thai sản 6 tháng',
    category: 'LEAVE',
    isUrgent: true,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    description: 'Bàn giao dứt điểm 100% hồ sơ thương vụ, cam kết giữ nguyên hoa hồng theo tỷ lệ thỏa thuận nội bộ.',
    defaultNotes: 'Bàn giao chính thức do nhân viên bước vào kỳ nghỉ thai sản 6 tháng. Đảm bảo người mới nắm bắt toàn bộ ngữ cảnh trao đổi.',
    defaultChecklist: [
      'Đã hoàn tất biên bản bàn giao danh mục khách hàng',
      'Đã chuyển giao toàn bộ file hợp đồng và báo giá đang chào',
      'Đã giới thiệu người phụ trách mới qua email chính thức cho khách hàng',
      'Đã thống nhất phân chia hoa hồng chốt deal theo chính sách công ty'
    ]
  },
  {
    id: 'OVERLOAD',
    label: 'Người phụ trách quá tải số lượng thương vụ (> 5 deals lớn)',
    shortLabel: 'Nhân viên quá tải',
    category: 'WORKLOAD',
    isUrgent: true,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    description: 'San sẻ bớt cơ hội sang nhân sự có tải rảnh hơn để đảm bảo tốc độ tương tác và chất lượng dịch vụ.',
    defaultNotes: 'Nhân viên hiện tại đang dồn lực cho các deal nước rút nên bị quá tải. San sẻ cơ hội này sang thành viên còn rảnh để bám sát khách hàng mỗi ngày.',
    defaultChecklist: [
      'Đã rà soát mức độ cấp thiết và tiến độ của thương vụ',
      'Đã tóm tắt các điểm nút cần giải quyết ngay trong tuần này',
      'Người nhận mới xác nhận có đủ thời gian và năng lực tiếp quản',
      'Đã đặt lịch hẹn tiếp theo với khách hàng không quá 48 giờ tới'
    ]
  },
  {
    id: 'SKILL_FIT',
    label: 'Phù hợp năng lực chuyên môn & Kinh nghiệm theo ngành',
    shortLabel: 'Phù hợp chuyên môn',
    category: 'STRATEGY',
    isUrgent: false,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    description: 'Tối ưu tỷ lệ thắng (Win Rate) bằng cách giao deal cho chuyên gia am hiểu sâu về lĩnh vực của khách hàng.',
    defaultNotes: 'Người nhận mới có thế mạnh vượt trội về phân khúc ngành này (đã từng chốt nhiều deal tương tự), giúp gia tăng tối đa cơ hội chiến thắng.',
    defaultChecklist: [
      'Người mới đã nghiên cứu hồ sơ bài toán kỹ thuật của khách',
      'Chuẩn bị case study thực tế cùng ngành để trình bày thêm',
      'Người cũ vẫn hỗ trợ tư vấn hậu trường nếu cần thiết'
    ]
  },
  {
    id: 'TERRITORY_CHANGE',
    label: 'Điều chuyển phân vùng thị trường / Địa bàn kinh doanh',
    shortLabel: 'Phân vùng thị trường',
    category: 'STRATEGY',
    isUrgent: false,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    description: 'Điều chỉnh lại quyền sở hữu theo đúng vùng địa lý hoặc chi nhánh phụ trách.',
    defaultNotes: 'Khách hàng có trụ sở thuộc phân vùng địa bàn mới được quy hoạch lại. Chuyển quyền cho đại diện khu vực trực tiếp phụ trách.',
    defaultChecklist: [
      'Đúng địa bàn quy hoạch kinh doanh',
      'Chuyển thông tin đại diện kinh doanh địa phương cho khách',
      'Bàn giao lịch trình gặp mặt trực tiếp tại văn phòng khách hàng'
    ]
  },
  {
    id: 'CUSTOMER_REQUEST',
    label: 'Yêu cầu thay đổi người phụ trách từ phía Khách hàng',
    shortLabel: 'Khách hàng yêu cầu',
    category: 'CLIENT',
    isUrgent: true,
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    description: 'Khách hàng mong muốn làm việc với nhân sự khác có phong cách hoặc phương pháp tiếp cận phù hợp hơn.',
    defaultNotes: 'Tiếp nhận nguyện vọng từ Ban Giám đốc khách hàng về việc đổi đầu mối liên hệ. Chuyển giao ngay để giữ gìn mối quan hệ hợp tác lâu dài.',
    defaultChecklist: [
      'Trưởng nhóm đã trao đổi khéo léo với khách hàng và nhân viên cũ',
      'Người nhận mới tiếp cận với tâm thế trung lập, lịch thiệp',
      'Rà soát lại toàn bộ khúc mắc cũ để tránh lặp lại'
    ]
  },
  {
    id: 'CUSTOM',
    label: 'Lý do khác (Nhập chi tiết cụ thể)',
    shortLabel: 'Lý do tùy chỉnh',
    category: 'OTHER',
    isUrgent: false,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.15)',
    description: 'Trường hợp phân bổ đặc biệt được phê duyệt bởi Trưởng nhóm kinh doanh.',
    defaultNotes: 'Phân bổ theo quyết định chỉ đạo của Trưởng nhóm kinh doanh để tối ưu hóa nguồn lực chung của toàn đội ngũ.',
    defaultChecklist: [
      'Đã có sự đồng thuận giữa các bên liên quan',
      'Đã hoàn tất chuyển giao dữ liệu trên hệ thống CRM'
    ]
  }
];
