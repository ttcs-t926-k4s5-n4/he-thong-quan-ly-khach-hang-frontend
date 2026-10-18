const day = (offset) => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

export const USERS = [
  { id: 'minh', name: 'Nguyễn Quang Minh', shortName: 'Minh', role: 'Nhân viên kinh doanh', initials: 'NM', color: 'violet' },
  { id: 'lan', name: 'Trần Ngọc Lan', shortName: 'Lan', role: 'Trưởng nhóm kinh doanh', initials: 'TL', color: 'rose' },
  { id: 'huy', name: 'Lê Đức Huy', shortName: 'Huy', role: 'Nhân viên kinh doanh', initials: 'LH', color: 'blue' },
  { id: 'ha', name: 'Phạm Thu Hà', shortName: 'Hà', role: 'Nhân viên kinh doanh', initials: 'PH', color: 'amber' },
  { id: 'an', name: 'Đỗ Hoàng An', shortName: 'An', role: 'Nhân viên kinh doanh', initials: 'DA', color: 'teal' },
]

export const createSeedTasks = () => ([
  { id: 't-101', title: 'Gửi báo giá phiên bản cuối', deal: 'Gói giải pháp ERP', customer: 'An Phát Logistics', dueDate: day(-2), assigneeId: 'minh', priority: 'high', type: 'email', completed: false, description: 'Gửi bảng giá đã cập nhật theo phạm vi tích hợp và thời hạn bảo hành.' },
  { id: 't-102', title: 'Xác nhận lịch demo sản phẩm', deal: 'CRM Enterprise', customer: 'Thịnh Vượng Group', dueDate: day(0), assigneeId: 'minh', priority: 'high', type: 'meeting', completed: false, description: 'Chốt lịch với đội vận hành và chuẩn bị tài khoản demo.' },
  { id: 't-103', title: 'Gọi lại khách hàng sau buổi tư vấn', deal: 'Hệ thống quản lý kho', customer: 'Minh Long Trading', dueDate: day(1), assigneeId: 'minh', priority: 'medium', type: 'call', completed: false, description: 'Thu thập phản hồi và xác nhận các yêu cầu ưu tiên.' },
  { id: 't-104', title: 'Hoàn thiện hồ sơ đề xuất', deal: 'Gói giải pháp ERP', customer: 'An Phát Logistics', dueDate: day(3), assigneeId: 'huy', priority: 'medium', type: 'document', completed: false, description: 'Tổng hợp đề xuất kỹ thuật và kế hoạch triển khai.' },
  { id: 't-105', title: 'Gửi biên bản cuộc họp', deal: 'Phần mềm quản trị bán hàng', customer: 'Sunrise Retail', dueDate: day(-1), assigneeId: 'ha', priority: 'high', type: 'email', completed: false, description: 'Gửi biên bản và các đầu việc đã thống nhất.' },
  { id: 't-106', title: 'Cập nhật yêu cầu tích hợp', deal: 'CRM Enterprise', customer: 'Thịnh Vượng Group', dueDate: day(2), assigneeId: 'an', priority: 'low', type: 'task', completed: false, description: 'Cập nhật checklist yêu cầu tích hợp vào CRM.' },
  { id: 't-107', title: 'Chuẩn bị tài liệu giới thiệu', deal: 'Nâng cấp hệ thống POS', customer: 'Bách Hóa Xanh An', dueDate: day(6), assigneeId: 'huy', priority: 'low', type: 'document', completed: false, description: 'Chuẩn bị tài liệu sản phẩm và case study phù hợp.' },
  { id: 't-108', title: 'Xác nhận hợp đồng bản nháp', deal: 'Phần mềm quản trị bán hàng', customer: 'Sunrise Retail', dueDate: day(-4), assigneeId: 'ha', priority: 'medium', type: 'task', completed: false, description: 'Rà soát điều khoản thanh toán cùng khách hàng.' },
  { id: 't-109', title: 'Gửi lời cảm ơn sau demo', deal: 'Nâng cấp hệ thống POS', customer: 'Bách Hóa Xanh An', dueDate: day(-1), assigneeId: 'minh', priority: 'low', type: 'email', completed: true, description: 'Đã gửi email cảm ơn và tài liệu tham khảo.' },
  { id: 't-110', title: 'Chuẩn bị nội dung buổi discovery', deal: 'Phân hệ chăm sóc khách hàng', customer: 'Đại Việt Services', dueDate: day(7), assigneeId: 'an', priority: 'medium', type: 'meeting', completed: false, description: 'Soạn câu hỏi khám phá quy trình hiện tại.' },
])

export const DEFAULT_SETTINGS = {
  enabled: true,
  reminderDays: [3, 1],
  remindOnDueDate: true,
  showOverdueOnHome: true,
}
