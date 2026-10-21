// =====================================================================
// SCRUM-101: Dữ liệu Lịch Cuộc Gặp Đã Đặt & Công Việc Có Hạn
// =====================================================================

export const EVENT_TYPES = {
  MEETING: {
    id: 'MEETING',
    name: 'Cuộc gặp đã đặt',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: '#3b82f6',
    badgeText: 'Cuộc gặp',
    icon: 'Calendar'
  },
  TASK: {
    id: 'TASK',
    name: 'Công việc có hạn',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#f59e0b',
    badgeText: 'Hạn chót',
    icon: 'CheckSquare'
  }
};

export const MEETING_TYPES = {
  CLIENT_OFFICE: { id: 'CLIENT_OFFICE', label: 'Tại trụ sở khách hàng', icon: 'Building2' },
  ONLINE: { id: 'ONLINE', label: 'Họp trực tuyến (Teams/Meet)', icon: 'Video' },
  INTERNAL: { id: 'INTERNAL', label: 'Họp nội bộ / Chiến lược', icon: 'Users' }
};

export const TASK_PRIORITIES = {
  URGENT: { id: 'URGENT', label: 'Khẩn cấp', color: '#ef4444', bgColor: '#fee2e2' },
  HIGH: { id: 'HIGH', label: 'Cao', color: '#f97316', bgColor: '#ffedd5' },
  MEDIUM: { id: 'MEDIUM', label: 'Trung bình', color: '#3b82f6', bgColor: '#dbeafe' },
  LOW: { id: 'LOW', label: 'Thấp', color: '#64748b', bgColor: '#f1f5f9' }
};

export const INITIAL_EVENTS = [
  // ==========================================
  // THỨ HAI: 2026-10-19
  // ==========================================
  {
    id: 'EVT-1001',
    type: 'MEETING',
    title: 'Demo giải pháp CRM Cloud & Báo cáo Doanh số',
    date: '2026-10-19',
    startTime: '08:30',
    endTime: '10:00',
    meetingType: 'ONLINE',
    location: 'Google Meet: meet.google.com/crm-vtel-demo',
    company: 'Viettel Telecom',
    clientName: 'Anh Vũ Đình Long - Phó Giám đốc CNTT',
    attendees: ['USR-REP-01', 'USR-LEAD-01'], // An & Trọng
    status: 'CONFIRMED',
    notes: 'Trình bày module bảo mật dữ liệu theo chuẩn ISO và phân quyền đa cấp bậc.'
  },
  {
    id: 'EVT-1002',
    type: 'TASK',
    title: 'Hoàn thiện hồ sơ năng lực & Dự toán gói 1.8 tỷ VNĐ',
    date: '2026-10-19',
    dueTime: '11:30',
    company: 'Viettel Telecom',
    clientName: 'Anh Vũ Đình Long',
    assignedTo: 'USR-REP-01', // An
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    notes: 'Ký số tờ trình và gửi cho ban đấu thầu Viettel trước giờ nghỉ trưa.'
  },
  {
    id: 'EVT-1003',
    type: 'MEETING',
    title: 'Thương thảo hợp đồng nâng cấp ERP chi nhánh',
    date: '2026-10-19',
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'CLIENT_OFFICE',
    location: 'Tòa nhà Vinamilk Tower, Số 10 Tân Trào, Q.7, TP.HCM',
    company: 'Vinamilk Việt Nam',
    clientName: 'Chị Nguyễn Mai Phương - Trưởng phòng Mua sắm',
    attendees: ['USR-REP-02'], // Mai
    status: 'CONFIRMED',
    notes: 'Chốt điều khoản thanh toán 3 đợt và thời gian nghiệm thu giai đoạn 1.'
  },
  {
    id: 'EVT-1004',
    type: 'TASK',
    title: 'Gửi biên bản họp và dự thảo hợp đồng pháp lý',
    date: '2026-10-19',
    dueTime: '17:00',
    company: 'Vinamilk Việt Nam',
    clientName: 'Chị Nguyễn Mai Phương',
    assignedTo: 'USR-REP-02', // Mai
    priority: 'MEDIUM',
    status: 'TODO',
    notes: 'Chỉnh sửa phụ lục bảo hành 24 tháng theo phản hồi từ buổi họp.'
  },

  // ==========================================
  // THỨ BA: 2026-10-20 (Có xung đột lịch thực tế giữa An & Trọng để test)
  // ==========================================
  {
    id: 'EVT-1005',
    type: 'MEETING',
    title: 'Họp thẩm định giải pháp tích hợp Core Banking',
    date: '2026-10-20',
    startTime: '09:30',
    endTime: '11:00',
    meetingType: 'CLIENT_OFFICE',
    location: 'Tòa nhà Techcombank, 191 Bà Triệu, Hà Nội',
    company: 'Techcombank',
    clientName: 'Anh Trần Hữu Hoàng - Trưởng khối Hạ tầng',
    attendees: ['USR-REP-01'], // An
    status: 'CONFIRMED',
    notes: 'Thẩm định kết nối API Gateway và mã hóa đường truyền HSM.'
  },
  {
    id: 'EVT-1006',
    type: 'MEETING',
    title: 'Họp điều phối chiến dịch chốt Deal Quý 4 toàn nhóm',
    date: '2026-10-20',
    startTime: '10:00',
    endTime: '11:30', // XUNG ĐỘT với EVT-1005 từ 10:00 - 11:00!
    meetingType: 'INTERNAL',
    location: 'Phòng Họp Diamond - Tầng 12',
    company: 'Nội bộ Công ty',
    clientName: 'Trần Đình Trọng chủ trì',
    attendees: ['USR-LEAD-01', 'USR-REP-01', 'USR-REP-02', 'USR-REP-03'], // Trọng, An, Mai, Hưng
    status: 'CONFIRMED',
    notes: 'Rà soát danh sách 15 cơ hội lớn cuối năm và phân bổ lại nguồn lực.'
  },
  {
    id: 'EVT-1007',
    type: 'TASK',
    title: 'Nộp báo cáo rà soát an toàn thông tin (Checklist ISO)',
    date: '2026-10-20',
    dueTime: '14:30',
    company: 'Techcombank',
    clientName: 'Anh Trần Hữu Hoàng',
    assignedTo: 'USR-REP-01', // An
    priority: 'URGENT',
    status: 'TODO',
    notes: 'Trả lời 45 câu hỏi an ninh mạng theo mẫu của ngân hàng Techcombank.'
  },
  {
    id: 'EVT-1008',
    type: 'MEETING',
    title: 'Tư vấn giải pháp số hóa chuỗi cung ứng logistics',
    date: '2026-10-20',
    startTime: '15:00',
    endTime: '16:30',
    meetingType: 'ONLINE',
    location: 'Microsoft Teams: teams.microsoft.com/masan-supply',
    company: 'Tập đoàn Masan',
    clientName: 'Anh Đỗ Quang Tuấn - Giám đốc Vận hành',
    attendees: ['USR-REP-03', 'USR-LEAD-01'], // Hưng & Trọng
    status: 'CONFIRMED',
    notes: 'Trình bày mô hình quản trị kho vận tập trung và dự báo nhu cầu bằng AI.'
  },

  // ==========================================
  // THỨ TƯ: 2026-10-21
  // ==========================================
  {
    id: 'EVT-1009',
    type: 'MEETING',
    title: 'Gặp gỡ Ban Lãnh đạo FPT Retail & Thuyết trình POC',
    date: '2026-10-21',
    startTime: '09:00',
    endTime: '10:30',
    meetingType: 'CLIENT_OFFICE',
    location: 'FPT Tower, Cầu Giấy, Hà Nội',
    company: 'FPT Software & Retail',
    clientName: 'Chị Đinh Bích Thảo - Phó TGĐ Phụ trách Chuyển đổi số',
    attendees: ['USR-REP-01', 'USR-REP-02'], // An & Mai
    status: 'CONFIRMED',
    notes: 'Trình diễn khả năng đồng bộ 850 cửa hàng Long Châu và FPT Shop thời gian thực.'
  },
  {
    id: 'EVT-1010',
    type: 'TASK',
    title: 'Tính toán biểu phí gói mở rộng 500 người dùng',
    date: '2026-10-21',
    dueTime: '12:00',
    company: 'FPT Software & Retail',
    clientName: 'Chị Đinh Bích Thảo',
    assignedTo: 'USR-REP-01', // An
    priority: 'HIGH',
    status: 'COMPLETED',
    notes: 'Áp dụng chính sách giảm 20% cho hợp đồng cam kết 3 năm.'
  },
  {
    id: 'EVT-1011',
    type: 'MEETING',
    title: 'Tiếp nhận yêu cầu hệ thống thanh toán qua ví điện tử',
    date: '2026-10-21',
    startTime: '14:30',
    endTime: '16:00',
    meetingType: 'ONLINE',
    location: 'Zoom Meeting: zoom.us/j/9882233441',
    company: 'Công ty Cổ phần Dịch vụ Di động Trực tuyến (MoMo)',
    clientName: 'Anh Bùi Minh Cường - Head of Partnerships',
    attendees: ['USR-REP-04'], // Chi
    status: 'CONFIRMED',
    notes: 'Khảo sát lưu lượng giao dịch đỉnh điểm dịp Black Friday.'
  },
  {
    id: 'EVT-1012',
    type: 'TASK',
    title: 'Lập sơ đồ kiến trúc luồng dữ liệu thanh toán SDK',
    date: '2026-10-21',
    dueTime: '17:30',
    company: 'MoMo',
    clientName: 'Anh Bùi Minh Cường',
    assignedTo: 'USR-REP-04', // Chi
    priority: 'MEDIUM',
    status: 'TODO',
    notes: 'Phối hợp cùng Solution Architect vẽ sơ đồ tuần tự (Sequence Diagram).'
  },

  // ==========================================
  // THỨ NĂM: 2026-10-22
  // ==========================================
  {
    id: 'EVT-1013',
    type: 'MEETING',
    title: 'Họp thẩm định quy trình quản lý đại lý ô tô điện',
    date: '2026-10-22',
    startTime: '08:30',
    endTime: '10:00',
    meetingType: 'ONLINE',
    location: 'Microsoft Teams: teams.microsoft.com/vinfast-dealer',
    company: 'VinFast Auto',
    clientName: 'Anh Hoàng Thế Vinh - Trưởng phòng Đại lý Toàn quốc',
    attendees: ['USR-REP-03', 'USR-REP-05'], // Hưng & Thắng
    status: 'CONFIRMED',
    notes: 'Phân tích yêu cầu đồng bộ số liệu giao xe và bảo hiểm tự động.'
  },
  {
    id: 'EVT-1014',
    type: 'TASK',
    title: 'Gửi phương án bảo mật phân quyền cho 120 showroom',
    date: '2026-10-22',
    dueTime: '11:30',
    company: 'VinFast Auto',
    clientName: 'Anh Hoàng Thế Vinh',
    assignedTo: 'USR-REP-03', // Hưng
    priority: 'URGENT',
    status: 'TODO',
    notes: 'Đảm bảo mỗi showroom chỉ thấy dữ liệu khách của địa bàn phụ trách.'
  },
  {
    id: 'EVT-1015',
    type: 'MEETING',
    title: 'Trình bày giải pháp chăm sóc khách hàng đa kênh (Omnichannel)',
    date: '2026-10-22',
    startTime: '13:30',
    endTime: '15:00',
    meetingType: 'CLIENT_OFFICE',
    location: 'Tòa nhà VPBank, 89 Láng Hạ, Đống Đa, Hà Nội',
    company: 'Ngân hàng VPBank',
    clientName: 'Chị Phan Thu Thủy - Giám đốc Trung tâm Dịch vụ Khách hàng',
    attendees: ['USR-REP-01', 'USR-LEAD-01'], // An & Trọng
    status: 'CONFIRMED',
    notes: 'Demo tính năng tích hợp Tổng đài VoIP, Zalo OA và Live Chat trong 1 màn hình.'
  },
  {
    id: 'EVT-1016',
    type: 'TASK',
    title: 'Hoàn thiện bản khảo sát hạ tầng Contact Center',
    date: '2026-10-22',
    dueTime: '16:30',
    company: 'Ngân hàng VPBank',
    clientName: 'Chị Phan Thu Thủy',
    assignedTo: 'USR-REP-01', // An
    priority: 'HIGH',
    status: 'TODO',
    notes: 'Đo lường băng thông mạng và số lượng cuộc gọi đồng thời.'
  },

  // ==========================================
  // THỨ SÁU: 2026-10-23
  // ==========================================
  {
    id: 'EVT-1017',
    type: 'MEETING',
    title: 'Ký kết biên bản ghi nhớ hợp tác chiến lược (MOU)',
    date: '2026-10-23',
    startTime: '10:00',
    endTime: '11:30',
    meetingType: 'CLIENT_OFFICE',
    location: 'Tiki Tower, Số 285 Cách Mạng Tháng 8, Q.10, TP.HCM',
    company: 'Công ty Cổ phần Ti Ki (Tiki)',
    clientName: 'Anh Huỳnh Quốc Bảo - Giám đốc Thương mại',
    attendees: ['USR-REP-02', 'USR-LEAD-01'], // Mai & Trọng
    status: 'CONFIRMED',
    notes: 'Lễ ký kết gói triển khai giải pháp quản lý bán hàng cho 15.000 nhà bán hàng.'
  },
  {
    id: 'EVT-1018',
    type: 'TASK',
    title: 'Xuất hóa đơn & thủ tục tạm ứng đợt 1',
    date: '2026-10-23',
    dueTime: '15:00',
    company: 'Tiki',
    clientName: 'Anh Huỳnh Quốc Bảo',
    assignedTo: 'USR-REP-02', // Mai
    priority: 'MEDIUM',
    status: 'TODO',
    notes: 'Chuyển thông tin cho phòng kế toán phát hành hóa đơn điện tử VAT.'
  },
  {
    id: 'EVT-1019',
    type: 'MEETING',
    title: 'Họp tổng kết tuần & Đánh giá tiến độ KPI nhóm',
    date: '2026-10-23',
    startTime: '16:00',
    endTime: '17:30',
    meetingType: 'INTERNAL',
    location: 'Phòng Họp Sapphire & Google Meet',
    company: 'Nội bộ Nhóm Enterprise',
    clientName: 'Trần Đình Trọng chủ trì',
    attendees: ['USR-LEAD-01', 'USR-REP-01', 'USR-REP-02', 'USR-REP-03', 'USR-REP-04', 'USR-REP-05'],
    status: 'CONFIRMED',
    notes: 'Đánh giá tỷ lệ chuyển đổi, tháo gỡ vướng mắc các hợp đồng sắp ký.'
  },

  // ==========================================
  // THỨ BẢY: 2026-10-24
  // ==========================================
  {
    id: 'EVT-1020',
    type: 'TASK',
    title: 'Cập nhật ghi chú CRM và chuẩn bị kế hoạch tuần mới',
    date: '2026-10-24',
    dueTime: '11:00',
    company: 'Nội bộ',
    clientName: 'Cá nhân',
    assignedTo: 'USR-REP-01',
    priority: 'LOW',
    status: 'TODO',
    notes: 'Kiểm tra lại toàn bộ email chưa trả lời và lên lịch hẹn tuần sau.'
  },

  // ==========================================
  // CÁC NGÀY KHÁC TRONG THÁNG 10/2026 (Cho chế độ xem Tháng & Lịch dài)
  // ==========================================
  {
    id: 'EVT-1021',
    type: 'MEETING',
    title: 'Khởi động dự án nâng cấp CRM Toàn diện',
    date: '2026-10-05',
    startTime: '09:00',
    endTime: '11:00',
    meetingType: 'CLIENT_OFFICE',
    location: 'Hội trường Viettel Tower',
    company: 'Viettel Telecom',
    clientName: 'Anh Vũ Đình Long',
    attendees: ['USR-REP-01', 'USR-LEAD-01'],
    status: 'COMPLETED',
    notes: 'Họp Kick-off thành công, thống nhất kế hoạch 90 ngày.'
  },
  {
    id: 'EVT-1022',
    type: 'TASK',
    title: 'Giao nộp tài liệu giải pháp kiến trúc tổng thể (v1.0)',
    date: '2026-10-09',
    dueTime: '17:00',
    company: 'Viettel Telecom',
    clientName: 'Anh Vũ Đình Long',
    assignedTo: 'USR-REP-01',
    priority: 'HIGH',
    status: 'COMPLETED',
    notes: 'Đã được nghiệm thu và duyệt sang bước tiếp theo.'
  },
  {
    id: 'EVT-1023',
    type: 'MEETING',
    title: 'Khảo sát quy trình chuỗi bán lẻ 300 cửa hàng',
    date: '2026-10-14',
    startTime: '14:00',
    endTime: '16:00',
    meetingType: 'CLIENT_OFFICE',
    location: 'Trụ sở Bách Hóa Xanh, TP. Thủ Đức',
    company: 'Tập đoàn Thế Giới Di Động',
    clientName: 'Anh Đoàn Văn Hiểu - Giám đốc Công nghệ',
    attendees: ['USR-REP-03', 'USR-REP-04'],
    status: 'COMPLETED',
    notes: 'Hoàn tất khảo sát hiện trạng tại 5 siêu thị mẫu.'
  },
  {
    id: 'EVT-1024',
    type: 'MEETING',
    title: 'Hội thảo Trực tuyến: Ứng dụng AI trong Bán hàng Doanh nghiệp',
    date: '2026-10-27',
    startTime: '09:00',
    endTime: '11:30',
    meetingType: 'ONLINE',
    location: 'Webinar Trực tuyến: webinar.companycrm.vn/sales-ai',
    company: 'Hiệp hội Doanh nghiệp TP.HCM',
    clientName: 'Ban Thư ký Diễn đàn Doanh nghiệp',
    attendees: ['USR-LEAD-01', 'USR-REP-01', 'USR-REP-02'],
    status: 'CONFIRMED',
    notes: 'Chia sẻ kinh nghiệm thực chiến tự động hóa quy trình Sales CRM.'
  },
  {
    id: 'EVT-1025',
    type: 'TASK',
    title: 'Chốt số liệu doanh số tháng 10 và gửi Ban Giám Đốc',
    date: '2026-10-30',
    dueTime: '17:00',
    company: 'Nội bộ Công ty',
    clientName: 'Ban Giám Đốc',
    assignedTo: 'USR-LEAD-01',
    priority: 'URGENT',
    status: 'TODO',
    notes: 'Tổng hợp báo cáo doanh thu thực tế và dự báo cho tháng 11/2026.'
  }
];
