const dateDaysAgo = (days, hour = 10, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const dateInDays = (days, hour = 9, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const demoCustomers = [
  { id: 'cus-001', name: 'Nguyễn Minh Anh', company: 'An Phát Logistics', phone: '0901 234 567', initials: 'MA', color: 'violet' },
  { id: 'cus-002', name: 'Trần Quốc Bảo', company: 'Công ty Kết Nối Xanh', phone: '0912 345 678', initials: 'QB', color: 'blue' },
  { id: 'cus-003', name: 'Lê Thu Hà', company: 'Hải Đăng Retail', phone: '0934 567 890', initials: 'TH', color: 'orange' },
  { id: 'cus-004', name: 'Phạm Đức Long', company: 'Minh Long Manufacturing', phone: '0987 654 321', initials: 'ĐL', color: 'green' },
  { id: 'cus-005', name: 'Vũ Hoàng Yến', company: 'Sao Việt Trading', phone: '0908 111 223', initials: 'HY', color: 'pink' },
];

export const demoOpportunities = [
  { id: 'opp-001', customerId: 'cus-001', name: 'Mở rộng kho vận miền Bắc', stage: 'Đàm phán', value: 580000000, status: 'open', updatedAt: dateDaysAgo(1, 15, 25) },
  { id: 'opp-002', customerId: 'cus-001', name: 'Hợp đồng vận hành 2027', stage: 'Tiếp cận', value: 310000000, status: 'open', updatedAt: dateDaysAgo(4, 11, 10) },
  { id: 'opp-003', customerId: 'cus-002', name: 'Triển khai hệ thống CRM', stage: 'Đề xuất', value: 420000000, status: 'open', updatedAt: dateDaysAgo(0, 9, 30) },
  { id: 'opp-004', customerId: 'cus-002', name: 'Tư vấn chuyển đổi số', stage: 'Thành công', value: 150000000, status: 'won', updatedAt: dateDaysAgo(8, 14, 5) },
  { id: 'opp-005', customerId: 'cus-003', name: 'Chuỗi cửa hàng thông minh', stage: 'Khảo sát', value: 265000000, status: 'open', updatedAt: dateDaysAgo(2, 16, 45) },
  { id: 'opp-006', customerId: 'cus-004', name: 'Bảo trì thiết bị năm 2027', stage: 'Tiếp cận', value: 190000000, status: 'open', updatedAt: dateDaysAgo(3, 13, 0) },
  { id: 'opp-007', customerId: 'cus-005', name: 'Phân phối sản phẩm Q4', stage: 'Thất bại', value: 98000000, status: 'lost', updatedAt: dateDaysAgo(12, 10, 0) },
];

export const demoCallLogs = [
  {
    id: 'call-demo-1', customerId: 'cus-002', customerName: 'Trần Quốc Bảo', company: 'Công ty Kết Nối Xanh', phone: '0912 345 678',
    outcome: 'connected', outcomeLabel: 'Đã trao đổi', note: 'Khách muốn xem demo quy trình quản lý lead, gửi lịch trong chiều nay.',
    opportunityId: 'opp-003', opportunityName: 'Triển khai hệ thống CRM', opportunityStage: 'Đề xuất', callbackAt: dateInDays(1, 14, 0),
    createdAt: dateDaysAgo(0, 9, 42), createdBy: 'Phạm Ngọc Anh'
  },
  {
    id: 'call-demo-2', customerId: 'cus-003', customerName: 'Lê Thu Hà', company: 'Hải Đăng Retail', phone: '0934 567 890',
    outcome: 'no_answer', outcomeLabel: 'Không nghe máy', note: 'Đã gọi lần 1, thử gọi lại sau giờ nghỉ trưa.',
    opportunityId: 'opp-005', opportunityName: 'Chuỗi cửa hàng thông minh', opportunityStage: 'Khảo sát', callbackAt: dateInDays(0, 13, 30),
    createdAt: dateDaysAgo(0, 8, 55), createdBy: 'Phạm Ngọc Anh'
  },
  {
    id: 'call-demo-3', customerId: 'cus-001', customerName: 'Nguyễn Minh Anh', company: 'An Phát Logistics', phone: '0901 234 567',
    outcome: 'meeting', outcomeLabel: 'Đã đặt lịch hẹn', note: 'Thống nhất họp trực tuyến để trao đổi phạm vi triển khai.',
    opportunityId: 'opp-001', opportunityName: 'Mở rộng kho vận miền Bắc', opportunityStage: 'Đàm phán', callbackAt: null,
    createdAt: dateDaysAgo(1, 16, 18), createdBy: 'Phạm Ngọc Anh'
  },
  {
    id: 'call-demo-4', customerId: 'cus-004', customerName: 'Phạm Đức Long', company: 'Minh Long Manufacturing', phone: '0987 654 321',
    outcome: 'busy', outcomeLabel: 'Máy bận', note: 'Đầu dây đang bận, sẽ liên hệ lại vào sáng mai.',
    opportunityId: 'opp-006', opportunityName: 'Bảo trì thiết bị năm 2027', opportunityStage: 'Tiếp cận', callbackAt: dateInDays(1, 9, 15),
    createdAt: dateDaysAgo(1, 15, 2), createdBy: 'Phạm Ngọc Anh'
  }
];

export const CALL_OUTCOMES = [
  { id: 'connected', label: 'Đã trao đổi', description: 'Nói chuyện được với khách', icon: 'message' },
  { id: 'no_answer', label: 'Không nghe máy', description: 'Chưa kết nối được', icon: 'phoneMissed' },
  { id: 'busy', label: 'Máy bận', description: 'Gọi lại sau', icon: 'phone' },
  { id: 'callback', label: 'Hẹn gọi lại', description: 'Có thời gian cụ thể', icon: 'calendar' },
  { id: 'meeting', label: 'Đã đặt lịch hẹn', description: 'Hẹn demo / gặp mặt', icon: 'calendarCheck' },
  { id: 'not_interested', label: 'Chưa có nhu cầu', description: 'Theo dõi sau', icon: 'minusCircle' },
];
