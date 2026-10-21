export const mockCustomers = [
  {
    id: 'CUST-1021',
    code: 'KH-VTPOST',
    name: 'Tổng Công ty Cổ phần Bưu chính Viettel (Viettel Post)',
    shortName: 'Viettel Post',
    industry: 'Bưu chính, Logistics & Vận tải công nghệ',
    scale: '5.000+ nhân sự • Toàn quốc',
    website: 'https://viettelpost.com.vn',
    address: 'Tòa nhà Viettel Post, Khu Công nghệ cao Láng - Hòa Lạc, Hà Nội',
    tier: 'VIP Enterprise',
    status: 'HANDOVER_PENDING', // HANDOVER_PENDING, HANDOVER_ACCEPTED, ONBOARDING, ACTIVE
    statusLabel: 'Chờ CSKH tiếp nhận bối cảnh',
    statusColor: '#f59e0b',
    avatar: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150&auto=format&fit=crop&q=80',
    primaryContact: {
      name: 'Anh Nguyễn Bảo Long',
      title: 'Giám đốc Trung tâm CNTT & Chuyển đổi số',
      phone: '0912.888.666',
      email: 'long.nb@viettelpost.com.vn',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      decisionRole: 'Người ra quyết định chính (Key Decision Maker)',
      personality: 'Cẩn trọng, tôn trọng quy chuẩn kỹ thuật, đánh giá cao dữ liệu bảo mật và cam kết SLA thực tế.'
    },
    handoverInfo: {
      fromMemberId: 'le_hung',
      fromMemberName: 'Lê Quốc Hưng',
      fromMemberRole: 'Chuyên viên Kinh doanh (Sales Rep)',
      toMemberId: 'hoang_ngan',
      toMemberName: 'Hoàng Kim Ngân',
      toMemberRole: 'Chuyên viên Chăm sóc khách hàng (CSKH)',
      handoverDate: '2026-10-17T09:30:00Z',
      reason: 'Lê Quốc Hưng được điều động phụ trách dự án lớn khu vực Miền Nam. Bàn giao sang CSKH để tiếp quản chăm sóc trước thềm ký kết hợp đồng.',
      handoverStatus: 'PENDING_ACK',
      urgency: 'HIGH',
      takeoverDeadline: 'Hôm nay (Trong vòng 5 phút nắm bắt)'
    },
    activeOpportunity: {
      id: 'OPP-102-01',
      code: 'OPP-2026-VTP',
      name: 'Triển khai Nền tảng Quản trị Trải nghiệm & Tương tác Khách hàng Đa kênh',
      value: 850000000,
      stage: 'NEGOTIATION', // PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON
      stageLabel: 'Thương thảo hợp đồng',
      probability: 85,
      expectedCloseDate: '2026-10-25'
    },
    latestQuote: {
      id: 'QUOTE-102-03',
      code: 'BQ-2026-003',
      title: 'Báo giá bản quyền Enterprise Cloud & Gói dịch vụ tích hợp API ERP',
      totalAmount: 820000000,
      discountPercent: 5,
      sentDate: '2026-10-15T14:30:00Z',
      validUntil: '2026-11-15',
      status: 'APPROVED_BY_CLIENT',
      statusLabel: 'Khách hàng đã đồng ý sơ bộ'
    },
    fiveMinuteBriefing: {
      summary: 'Khách hàng trọng điểm B2B đang ở bước thương thảo cuối cùng. Đã hoàn tất thử nghiệm POC hạ tầng kết nối 50 bưu cục, giám đốc CNTT rất hài lòng về tốc độ API. Khách hàng đề nghị mức chiết khấu 5% và chúng ta đã gửi Báo giá BQ-2026-003.',
      keyTakeaways: [
        'Khách hàng đặc biệt chú trọng tính ổn định: Yêu cầu SLA cam kết tối thiểu 99.99% uptime và bảo mật phân vùng dữ liệu riêng.',
        'Đã chốt cấu hình gói Enterprise Cloud (820.000.000 ₫) kèm 1 năm hỗ trợ 24/7 trực tiếp.',
        'Ban Giám đốc Viettel Post sẽ họp phê duyệt ký kết hợp đồng vào Thứ Tư tới. Cần CSKH chủ động kết nối làm quen với anh Long ngay hôm nay.'
      ],
      nextActions: [
        {
          task: 'CSKH gọi điện chào mừng & giới thiệu là đầu mối đồng hành chính thức',
          deadline: 'Trước 11:30 hôm nay',
          priority: 'CRITICAL',
          owner: 'Hoàng Kim Ngân'
        },
        {
          task: 'Gửi bản dự thảo Kế hoạch Triển khai (Onboarding Roadmap) & Danh mục đầu mối kỹ thuật',
          deadline: 'Trước 16:00 hôm nay',
          priority: 'HIGH',
          owner: 'Hoàng Kim Ngân'
        },
        {
          task: 'Mời anh Long & Kỹ sư trưởng tham gia nhóm Zalo CSKH VIP chuyên biệt',
          deadline: 'Ngày mai 19/10/2026',
          priority: 'MEDIUM',
          owner: 'Hoàng Kim Ngân'
        }
      ],
      sensitiveNotes: 'Lưu ý: Không đề cập lại câu chuyện chiết khấu thêm vì ban giám đốc bên ta đã duyệt kịch kim 5%. Giữ thái độ nhã nhặn, tôn trọng thời gian biểu của anh Long (anh hay họp nội bộ từ 14:00 - 15:30).'
    }
  },
  {
    id: 'CUST-1022',
    code: 'KH-NOVALAND',
    name: 'Tập đoàn Đầu tư Địa ốc No Va (Novaland Group)',
    shortName: 'Novaland Group',
    industry: 'Bất động sản & Quản lý vận hành dự án',
    scale: '3.500+ nhân sự • TP. Hồ Chí Minh & Miền Nam',
    website: 'https://novaland.com.vn',
    address: 'Tòa nhà Novaland, 65 Nguyễn Du, Quận 1, TP. Hồ Chí Minh',
    tier: 'Enterprise Gold',
    status: 'ACTIVE',
    statusLabel: 'Đang tương tác thường kỳ',
    statusColor: '#10b981',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    primaryContact: {
      name: 'Chị Phạm Quỳnh Nga',
      title: 'Trưởng ban Mua sắm & Đấu thầu Tập đoàn',
      phone: '0903.111.222',
      email: 'nga.pq@novaland.com.vn',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      decisionRole: 'Thẩm định thương mại & Điều khoản hợp đồng',
      personality: 'Quyết đoán, yêu cầu rõ ràng về tiến độ thanh toán và hóa đơn chứng từ điện tử.'
    },
    handoverInfo: {
      fromMemberId: 'nguyen_an',
      fromMemberName: 'Nguyễn Văn An',
      fromMemberRole: 'Chuyên viên Kinh doanh',
      toMemberId: 'hoang_ngan',
      toMemberName: 'Hoàng Kim Ngân',
      toMemberRole: 'Chuyên viên CSKH',
      handoverDate: '2026-10-12T08:00:00Z',
      reason: 'Bàn giao chuyển giao trách nhiệm theo định kỳ quy trình CRM khi cơ hội bước qua giai đoạn Báo giá hoàn chỉnh.',
      handoverStatus: 'ACCEPTED',
      urgency: 'MEDIUM',
      takeoverDeadline: 'Đã hoàn tất tiếp nhận'
    },
    activeOpportunity: {
      id: 'OPP-102-02',
      code: 'OPP-2026-NOVA',
      name: 'Phần mềm Quản lý Chăm sóc Khách hàng Cư dân & Nhà đầu tư',
      value: 1200000000,
      stage: 'PROPOSAL',
      stageLabel: 'Đề xuất & Báo giá',
      probability: 70,
      expectedCloseDate: '2026-11-10'
    },
    latestQuote: {
      id: 'QUOTE-102-02',
      code: 'BQ-2026-002',
      title: 'Báo giá giải pháp CRM cư dân Novaland - Gói Multi-tenancy',
      totalAmount: 1150000000,
      discountPercent: 4,
      sentDate: '2026-10-14T10:00:00Z',
      validUntil: '2026-11-14',
      status: 'SENT',
      statusLabel: 'Đã gửi báo giá, đang chờ phản hồi'
    },
    fiveMinuteBriefing: {
      summary: 'Khách hàng có quy mô lớn, yêu cầu tích hợp sâu với ERP SAP. Hiện chị Nga đang lấy ý kiến thẩm định từ phòng Pháp chế và Tài chính kế toán về điều khoản thanh toán 3 đợt.',
      keyTakeaways: [
        'Cần chuẩn bị sẵn phụ lục bảo mật thông tin tài chính cư dân (NDA mở rộng).',
        'Kỹ sư Pre-sales Mai đã trả lời 12 câu hỏi bảo mật của ban CNTT Novaland.'
      ],
      nextActions: [
        {
          task: 'Theo dõi phản hồi của phòng Pháp chế Novaland về hợp đồng',
          deadline: '20/10/2026',
          priority: 'HIGH',
          owner: 'Hoàng Kim Ngân'
        }
      ],
      sensitiveNotes: 'Chị Nga thường xuyên phản hồi email sau 17:00 chiều. Ưu tiên liên hệ qua email trước khi gọi điện.'
    }
  },
  {
    id: 'CUST-1023',
    code: 'KH-TIMOPLUS',
    name: 'Ngân hàng số Timo Plus (Đối tác Ngân hàng Bản Việt)',
    shortName: 'Timo Plus Digital Bank',
    industry: 'Fintech & Tài chính công nghệ số',
    scale: '800+ nhân sự • Toàn quốc',
    website: 'https://timo.vn',
    address: 'Tòa nhà Pasteur, 194 Pasteur, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    tier: 'Fintech High Growth',
    status: 'ACTIVE',
    statusLabel: 'Thử nghiệm POC Kỹ thuật',
    statusColor: '#6366f1',
    avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    primaryContact: {
      name: 'Anh Vũ Hoàng Nam',
      title: 'Giám đốc Vận hành CSKH (Head of Customer Experience)',
      phone: '0979.999.333',
      email: 'nam.vh@timo.vn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      decisionRole: 'Trưởng bộ phận sử dụng trực tiếp',
      personality: 'Trẻ trung, am hiểu sâu về UI/UX và đòi hỏi tốc độ phản hồi tính năng dưới 100ms.'
    },
    handoverInfo: {
      fromMemberId: 'tran_mai',
      fromMemberName: 'Trần Thị Mai',
      fromMemberRole: 'Kỹ sư Giải pháp (Pre-Sales)',
      toMemberId: 'hoang_ngan',
      toMemberName: 'Hoàng Kim Ngân',
      toMemberRole: 'Chuyên viên CSKH',
      handoverDate: '2026-10-14T15:00:00Z',
      reason: 'Giai đoạn POC kiểm thử kỹ thuật đã qua, chuyển giao cho CSKH nắm bắt phản hồi người dùng thực tế.',
      handoverStatus: 'ACCEPTED',
      urgency: 'MEDIUM',
      takeoverDeadline: 'Đã hoàn tất tiếp nhận'
    },
    activeOpportunity: {
      id: 'OPP-102-03',
      code: 'OPP-2026-TIMO',
      name: 'Hệ thống Quản lý Vé Yêu Cầu Tích Hợp AI Phân Loại Tự Động',
      value: 640000000,
      stage: 'QUALIFICATION',
      stageLabel: 'Đánh giá & Demo POC',
      probability: 60,
      expectedCloseDate: '2026-11-20'
    },
    latestQuote: {
      id: 'QUOTE-102-01',
      code: 'BQ-2026-001-TIMO',
      title: 'Báo giá bản quyền API AI Ticket Classifier cho Fintech',
      totalAmount: 640000000,
      discountPercent: 0,
      sentDate: '2026-10-10T11:00:00Z',
      validUntil: '2026-11-10',
      status: 'SENT',
      statusLabel: 'Đang xem xét tính năng'
    },
    fiveMinuteBriefing: {
      summary: 'Timo Plus đang chạy thử nghiệm thuật toán AI phân loại ticket khách hàng tự động với 5.000 vé mẫu. Độ chính xác hiện đạt 94.8%, anh Nam mong muốn tinh chỉnh thêm mảng nhận diện khiếu nại chuyển khoản chậm.',
      keyTakeaways: [
        'Team kỹ thuật Timo đánh giá rất cao API webhook thời gian thực.',
        'Cần CSKH thu thập thêm danh sách lỗi ngoại lệ từ phía đại lý CSKH Timo.'
      ],
      nextActions: [
        {
          task: 'Tổ chức buổi họp tổng kết kết quả POC với team CX Timo',
          deadline: '22/10/2026',
          priority: 'MEDIUM',
          owner: 'Hoàng Kim Ngân'
        }
      ],
      sensitiveNotes: 'Team Timo làm việc theo văn hóa agile hiện đại, trao đổi nhanh qua Slack hoặc Google Meet.'
    }
  },
  {
    id: 'CUST-1024',
    code: 'KH-WINCOMMERCE',
    name: 'Công ty Cổ phần Dịch vụ Thương mại Tổng hợp WinCommerce',
    shortName: 'WinCommerce (WinMart & WinMart+)',
    industry: 'Bán lẻ nhu yếu phẩm & Chuỗi siêu thị tiện ích',
    scale: '10.000+ nhân sự • 3.600 điểm bán',
    website: 'https://winmart.vn',
    address: 'Tầng 12, Tòa nhà M-Plaza Saigon, 39 Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
    tier: 'Diamond Mega Account',
    status: 'ACTIVE',
    statusLabel: 'Vừa ký hợp đồng - Đang Onboarding',
    statusColor: '#0ea5e9',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    primaryContact: {
      name: 'Chị Đỗ Thúy Hằng',
      title: 'Giám đốc Vận hành & Trải nghiệm Khách hàng Hội viên Win',
      phone: '0988.444.555',
      email: 'hang.dt@wincommerce.masan.vn',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      decisionRole: 'Chủ dự án phía khách hàng',
      personality: 'Nhanh nhẹn, chú trọng kỷ luật triển khai theo ngày và kết quả đo lường CSAT.'
    },
    handoverInfo: {
      fromMemberId: 'le_hung',
      fromMemberName: 'Lê Quốc Hưng',
      fromMemberRole: 'Chuyên viên Kinh doanh',
      toMemberId: 'hoang_ngan',
      toMemberName: 'Hoàng Kim Ngân',
      toMemberRole: 'Chuyên viên CSKH',
      handoverDate: '2026-10-16T16:00:00Z',
      reason: 'Hợp đồng thương mại đã ký thành công! Bàn giao cho CSKH chính thức phụ trách toàn diện công tác Onboarding và đào tạo nhân viên.',
      handoverStatus: 'ACCEPTED',
      urgency: 'HIGH',
      takeoverDeadline: 'Đã hoàn tất tiếp nhận'
    },
    activeOpportunity: {
      id: 'OPP-102-04',
      code: 'OPP-2026-WIN',
      name: 'Hệ thống Quản lý Phản hồi Khách hàng Hội viên WiN tại 3.600 Siêu thị',
      value: 1450000000,
      stage: 'CLOSED_WON',
      stageLabel: 'Thắng thầu - Đã ký hợp đồng',
      probability: 100,
      expectedCloseDate: '2026-10-16'
    },
    latestQuote: {
      id: 'QUOTE-102-04',
      code: 'BQ-2026-004-WIN',
      title: 'Báo giá chính thức & Phụ lục Hợp đồng số 102/2026/HĐKT-WIN',
      totalAmount: 1450000000,
      discountPercent: 6,
      sentDate: '2026-10-14T09:00:00Z',
      validUntil: '2026-11-14',
      status: 'CONTRACT_SIGNED',
      statusLabel: 'Hợp đồng đã ký đóng dấu'
    },
    fiveMinuteBriefing: {
      summary: 'Dự án thành công lớn với Masan WinCommerce. Hợp đồng trị giá 1.45 tỷ đồng đã ký duyệt ngày 16/10. Hiện đang trong tuần đầu tiên của giai đoạn Onboarding triển khai cho 3.600 điểm bán.',
      keyTakeaways: [
        'Hợp đồng đã thu trước 40% giá trị đặt cọc vào tài khoản công ty.',
        'Chị Hằng đề nghị cử 2 chuyên viên CSKH hỗ trợ trực tiếp buổi đào tạo trực tuyến đầu tiên cho các giám sát vùng vào Thứ Sáu 24/10.'
      ],
      nextActions: [
        {
          task: 'Lập lịch Kick-off Onboarding nội bộ giữa CSKH và Kỹ thuật WinCommerce',
          deadline: '20/10/2026',
          priority: 'CRITICAL',
          owner: 'Hoàng Kim Ngân'
        }
      ],
      sensitiveNotes: 'Chuỗi bán lẻ vận hành 24/7, mọi thông báo bảo trì nâng cấp phải được gửi trước tối thiểu 72 giờ làm việc.'
    }
  }
];
