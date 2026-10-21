// =====================================================================
// SCRUM-93: Dữ liệu mẫu cơ hội bán hàng B2B (Pipeline Opportunities)
// Ngày đánh giá giả lập chuẩn hệ thống: 2026-10-18
// =====================================================================

export const CURRENT_SYSTEM_DATE = '2026-10-18';

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'OPP-9301',
    title: 'Hệ thống ERP Phân phối Dược phẩm Toàn quốc',
    customerName: 'Tập đoàn Dược phẩm Nam Á',
    industry: 'Y tế & Dược phẩm',
    value: 680000000, // 680 triệu
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-12', // Đã quá hạn 6 ngày (so với 18/10)
    lastActivityDate: '2026-10-09', // 9 ngày trước (ngưỡng Thương thảo N = 3 ngày -> lố 6 ngày!)
    lastActivityType: 'Cuộc gọi điện thoại',
    lastActivityNote: 'Phó Tổng Giám đốc báo đang họp HĐQT rà soát phụ lục hợp đồng, hẹn phản hồi lại trong ngày nhưng im lặng suốt từ đó.',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-08-15',
    interventions: [
      {
        id: 'INT-01',
        type: 'PING_REP',
        title: 'Nhắc nhở cập nhật thương thảo',
        author: 'Trần Đình Trọng (Trưởng nhóm)',
        date: '2026-10-15 14:30',
        content: 'Deal này giá trị lớn, đã quá ngày chốt 3 ngày. An liên hệ gấp với Ban Giám đốc bên đó xem đang vướng mắc điều khoản nào.'
      }
    ],
    activities: [
      { date: '2026-10-09', type: 'CALL', author: 'Nguyễn Văn An', content: 'Gọi trao đổi về điều khoản thanh toán 3 đợt.' },
      { date: '2026-10-04', type: 'MEETING', author: 'Nguyễn Văn An', content: 'Họp trực tiếp tại trụ sở Nam Á rà soát hợp đồng mẫu.' }
    ]
  },
  {
    id: 'OPP-9302',
    title: 'Giải pháp CRM Omnichannel & Loyalty App',
    customerName: 'Chuỗi Cà phê Highlands Star',
    industry: 'F&B & Bán lẻ',
    value: 420000000, // 420 triệu
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-10-26', // Chưa quá hạn (còn 8 ngày)
    lastActivityDate: '2026-10-06', // 12 ngày trước (ngưỡng Báo giá N = 5 ngày -> lố 7 ngày!)
    lastActivityType: 'Gửi Email Báo Giá',
    lastActivityNote: 'Đã gửi file PDF báo giá gói Enterprise kèm chiết khấu 15%, chưa thấy khách hàng mở lại email hoặc phản hồi.',
    salesRepId: 'USR-REP-02',
    salesRepName: 'Trần Thị Mai',
    salesRepAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-09-02',
    interventions: [],
    activities: [
      { date: '2026-10-06', type: 'EMAIL', author: 'Trần Thị Mai', content: 'Gửi báo giá chính thức v2 kèm đề xuất giải pháp CRM.' },
      { date: '2026-09-28', type: 'DEMO', author: 'Trần Thị Mai', content: 'Demo tính năng tích hợp Zalo Mini App và tích điểm.' }
    ]
  },
  {
    id: 'OPP-9303',
    title: 'Phần mềm Quản lý Kho Thông Minh WMS & Barcode',
    customerName: 'Logistics Tân Cảng Miền Bắc',
    industry: 'Logistics & Vận tải',
    value: 350000000, // 350 triệu
    stage: 'SOLUTION_DEMO',
    expectedCloseDate: '2026-10-15', // Quá hạn 3 ngày
    lastActivityDate: '2026-10-01', // 17 ngày trước (ngưỡng Demo N = 10 ngày -> lố 7 ngày!)
    lastActivityType: 'Demo trực tiếp tại kho',
    lastActivityNote: 'Đã demo chạy thử máy quét mã vạch Honeywell tại kho số 3, Giám đốc kho đánh giá tốt nhưng sau đó không có biên bản nghiệm thu POC.',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    createdAt: '2026-08-20',
    interventions: [],
    activities: [
      { date: '2026-10-01', type: 'DEMO', author: 'Lê Quốc Hưng', content: 'Test thiết bị quét mã vạch và đồng bộ dữ liệu vào kho.' }
    ]
  },
  {
    id: 'OPP-9304',
    title: 'Cổng thanh toán & Hóa đơn điện tử B2B',
    customerName: 'Công ty Cổ phần Bán lẻ SunMart',
    industry: 'Chuỗi Siêu thị',
    value: 280000000,
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-10-28',
    lastActivityDate: '2026-10-11', // 7 ngày trước (ngưỡng Báo giá N = 5 ngày -> lố 2 ngày)
    lastActivityType: 'Họp trực tuyến Teams',
    lastActivityNote: 'Khách hàng phân vân giữa 2 gói Standard và Pro, nói sẽ bàn bạc với phòng Tài chính nhưng 1 tuần chưa hồi âm.',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_RETAIL',
    createdAt: '2026-09-10',
    interventions: [],
    activities: [
      { date: '2026-10-11', type: 'ONLINE_MEETING', author: 'Hoàng Kim Chi', content: 'Thuyết minh bảng so sánh chi phí gói Pro.' }
    ]
  },
  {
    id: 'OPP-9305',
    title: 'Nền tảng Quản trị Nhân sự & Chấm công AI FaceID',
    customerName: 'Tổng Công ty May 10 Hưng Yên',
    industry: 'Sản xuất & May mặc',
    value: 520000000,
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-17', // Quá hạn 1 ngày
    lastActivityDate: '2026-10-13', // 5 ngày trước (ngưỡng Thương thảo N = 3 ngày -> lố 2 ngày)
    lastActivityType: 'Gửi dự thảo Hợp đồng',
    lastActivityNote: 'Gửi bản thảo có chữ ký nháy của Giám đốc kinh doanh sang phía đối tác duyệt bảo lãnh thanh toán.',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-08-30',
    interventions: [],
    activities: [
      { date: '2026-10-13', type: 'EMAIL', author: 'Nguyễn Văn An', content: 'Gửi hợp đồng nguyên tắc có điều khoản bảo hành 24 tháng.' }
    ]
  },
  {
    id: 'OPP-9306',
    title: 'Hạ tầng Cloud Server & Sao lưu Dữ liệu Dự phòng',
    customerName: 'Bệnh viện Đa khoa Quốc tế An Sinh',
    industry: 'Y tế',
    value: 390000000,
    stage: 'QUALIFICATION',
    expectedCloseDate: '2026-11-15',
    lastActivityDate: '2026-10-05', // 13 ngày trước (ngưỡng Khảo sát N = 7 ngày -> lố 6 ngày!)
    lastActivityType: 'Khảo sát hạ tầng server phòng IT',
    lastActivityNote: 'Trưởng phòng IT đi công tác nước ngoài, nhân viên kỹ thuật báo phải chờ sếp về mới tiếp tục.',
    salesRepId: 'USR-REP-02',
    salesRepName: 'Trần Thị Mai',
    salesRepAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-09-18',
    interventions: [],
    activities: [
      { date: '2026-10-05', type: 'SITE_VISIT', author: 'Trần Thị Mai', content: 'Đo lường dung lượng lưu trữ PACS và HIS bệnh viện.' }
    ]
  },
  {
    id: 'OPP-9307',
    title: 'Phần mềm Kế toán Tài chính Đa chi nhánh',
    customerName: 'Tập đoàn Xây dựng Horizon',
    industry: 'Bất động sản & Xây dựng',
    value: 310000000,
    stage: 'SOLUTION_DEMO',
    expectedCloseDate: '2026-10-14', // Quá hạn 4 ngày (nhưng tương tác còn mới)
    lastActivityDate: '2026-10-15', // 3 ngày trước (ngưỡng Demo N = 10 -> Không vi phạm hoạt động)
    lastActivityType: 'Cuộc gọi chăm sóc khách hàng',
    lastActivityNote: 'Kế toán trưởng vừa hỏi thêm về tính năng kết chuyển công nợ ngoại tệ. Tương tác vẫn có nhưng ngày hẹn chốt đã quá hạn.',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    createdAt: '2026-09-05',
    interventions: [],
    activities: [
      { date: '2026-10-15', type: 'CALL', author: 'Lê Quốc Hưng', content: 'Tư vấn module hạch toán tỷ giá hối đoái liên ngân hàng.' }
    ]
  },
  {
    id: 'OPP-9308',
    title: 'Giải pháp Helpdesk & Chăm sóc Khách hàng Tự động',
    customerName: 'Fintech Tài chính FastPay',
    industry: 'Tài chính Công nghệ',
    value: 240000000,
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-10-16', // Quá hạn 2 ngày
    lastActivityDate: '2026-10-16', // 2 ngày trước (ngưỡng Báo giá N = 5 -> Không vi phạm hoạt động)
    lastActivityType: 'Gửi phụ lục tính năng',
    lastActivityNote: 'Đã bổ sung module chatbot AI xử lý khiếu nại khách hàng theo yêu cầu của Giám đốc CSKH.',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_RETAIL',
    createdAt: '2026-09-12',
    interventions: [],
    activities: [
      { date: '2026-10-16', type: 'EMAIL', author: 'Hoàng Kim Chi', content: 'Gửi demo kịch bản Bot tự động phân loại ticket hỗ trợ.' }
    ]
  },
  {
    id: 'OPP-9309',
    title: 'Hệ thống Quản lý Bán hàng & Chuỗi Nhượng quyền F&B',
    customerName: 'Chuỗi Trà sữa Phúc An Tea',
    industry: 'F&B',
    value: 195000000,
    stage: 'QUALIFICATION',
    expectedCloseDate: '2026-11-05', // Còn 18 ngày
    lastActivityDate: '2026-10-16', // 2 ngày trước (ngưỡng N = 7 -> Cực kỳ an toàn)
    lastActivityType: 'Gặp gỡ trực tiếp',
    lastActivityNote: 'Đã trao đổi với Giám đốc Vận hành về nhu cầu đồng bộ 35 điểm bán lẻ trên toàn quốc.',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_RETAIL',
    createdAt: '2026-10-02',
    interventions: [],
    activities: [
      { date: '2026-10-16', type: 'MEETING', author: 'Hoàng Kim Chi', content: 'Khảo sát quy trình order tại cửa hàng mẫu Quận 1.' }
    ]
  },
  {
    id: 'OPP-9310',
    title: 'Tích hợp API Cổng Thanh toán Quốc tế Visa/Mastercard',
    customerName: 'Sàn Thương mại Điện tử VietShop',
    industry: 'Thương mại điện tử',
    value: 450000000,
    stage: 'SOLUTION_DEMO',
    expectedCloseDate: '2026-10-30', // Còn 12 ngày
    lastActivityDate: '2026-10-16', // 2 ngày trước (ngưỡng N = 10 -> Cực kỳ an toàn)
    lastActivityType: 'Họp kỹ thuật cùng đội ngũ Dev',
    lastActivityNote: 'Đã bàn giao sandbox API và hướng dẫn tích hợp webhook xử lý giao dịch hoàn tiền.',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-09-20',
    interventions: [],
    activities: [
      { date: '2026-10-16', type: 'DEMO', author: 'Nguyễn Văn An', content: 'Demo API sandbox test thành công giao dịch thẻ 3D Secure.' }
    ]
  },
  {
    id: 'OPP-9311',
    title: 'Bản quyền Phần mềm Văn phòng Microsoft 365 E5',
    customerName: 'Ngân hàng Thương mại Cổ phần Á Châu',
    industry: 'Ngân hàng & Bảo hiểm',
    value: 850000000,
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-22', // Còn 4 ngày
    lastActivityDate: '2026-10-17', // 1 ngày trước (ngưỡng N = 3 -> Bình thường, rất nóng)
    lastActivityType: 'Gặp gỡ chốt chiết khấu với Ban Mua hàng',
    lastActivityNote: 'Hai bên đã thống nhất mức chiết khấu 8% gói 500 licenses, chuẩn bị in hợp đồng đóng dấu.',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-08-10',
    interventions: [],
    activities: [
      { date: '2026-10-17', type: 'MEETING', author: 'Nguyễn Văn An', content: 'Chốt bảng giá cuối cùng cùng Trưởng ban Mua sắm.' }
    ]
  },
  {
    id: 'OPP-9312',
    title: 'Hệ thống Hội nghị Truyền hình & Phòng họp Trực tuyến',
    customerName: 'Trường Đại học Quốc tế Sài Gòn',
    industry: 'Giáo dục',
    value: 220000000,
    stage: 'CLOSED_WON',
    expectedCloseDate: '2026-10-14',
    lastActivityDate: '2026-10-14',
    lastActivityType: 'Ký hợp đồng & Nhận tạm ứng',
    lastActivityNote: 'Khách hàng đã ký hợp đồng và chuyển khoản đặt cọc 50%. Bàn giao phòng kỹ thuật triển khai.',
    salesRepId: 'USR-REP-02',
    salesRepName: 'Trần Thị Mai',
    salesRepAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_ENTERPRISE',
    createdAt: '2026-08-12',
    interventions: [],
    activities: [
      { date: '2026-10-14', type: 'CONTRACT', author: 'Trần Thị Mai', content: 'Ký hợp đồng chính thức và nghiệm thu bàn giao.' }
    ]
  },
  {
    id: 'OPP-9313',
    title: 'Triển khai Tổng đài VoIP Call Center 100 Agent',
    customerName: 'Bảo hiểm Nhân thọ Prudential Care',
    industry: 'Tài chính & Bảo hiểm',
    value: 380000000,
    stage: 'CLOSED_LOST',
    expectedCloseDate: '2026-10-10',
    lastActivityDate: '2026-10-08',
    lastActivityType: 'Khách hàng gửi thông báo từ chối',
    lastActivityNote: 'Đối thủ chào giá thấp hơn 20% kèm gói thoại nội mạng miễn phí, thương vụ không thành công.',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    createdAt: '2026-07-25',
    interventions: [],
    activities: [
      { date: '2026-10-08', type: 'CALL', author: 'Lê Quốc Hưng', content: 'Ghi nhận lý do thua deal do chính sách giá cước viễn thông.' }
    ]
  },
  {
    id: 'OPP-9314',
    title: 'Phần mềm Tự động hóa Tiếp thị Marketing Automation',
    customerName: 'Thương hiệu Thời trang IVY Moda',
    industry: 'Thời trang & Bán lẻ',
    value: 260000000,
    stage: 'QUALIFICATION',
    expectedCloseDate: '2026-11-20',
    lastActivityDate: '2026-10-08', // 10 ngày trước (ngưỡng Khảo sát N = 7 ngày -> lố 3 ngày)
    lastActivityType: 'Gửi form khảo sát quy trình bán lẻ',
    lastActivityNote: 'Đã gửi bộ câu hỏi khảo sát hành vi khách hàng mua sắm tại cửa hàng nhưng Trưởng phòng Marketing chưa phản hồi.',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_RETAIL',
    createdAt: '2026-09-25',
    interventions: [],
    activities: [
      { date: '2026-10-08', type: 'EMAIL', author: 'Hoàng Kim Chi', content: 'Gửi bản khảo sát đánh giá hệ thống POS và CRM hiện tại.' }
    ]
  },
  {
    id: 'OPP-9315',
    title: 'Hệ thống Quản lý Dự án Bất động sản PMS',
    customerName: 'Công ty Cổ phần Đầu tư Đất Xanh Miền Bắc',
    industry: 'Bất động sản',
    value: 580000000,
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-13', // Quá hạn 5 ngày
    lastActivityDate: '2026-10-10', // 8 ngày trước (ngưỡng Thương thảo N = 3 ngày -> lố 5 ngày)
    lastActivityType: 'Gửi bản đàm phán SLA hỗ trợ kỹ thuật',
    lastActivityNote: 'Bên khách hàng đề nghị cam kết thời gian phản hồi sự cố dưới 15 phút, đang chờ ý kiến Trưởng nhóm.',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    teamId: 'TEAM_NORTH',
    createdAt: '2026-08-01',
    interventions: [],
    activities: [
      { date: '2026-10-10', type: 'EMAIL', author: 'Lê Quốc Hưng', content: 'Gửi bảng cam kết SLA 24/7 và điều khoản bồi thường vi phạm.' }
    ]
  }
];
