export const mockTimelineEvents = [
  // ==========================================
  // CUSTOMER 1: VIETTEL POST (CUST-1021)
  // ==========================================
  {
    id: 'EVT-102-001',
    customerId: 'CUST-1021',
    type: 'HANDOVER',
    typeLabel: 'Bàn giao phụ trách CSKH',
    category: 'HANDOVER',
    timestamp: '2026-10-17T09:30:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh (Sales Rep)',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '🤝 Chuyển giao toàn diện hồ sơ khách hàng sang Chăm sóc khách hàng',
    summary: 'Lê Quốc Hưng bàn giao toàn bộ lịch sử tương tác, hồ sơ thương thảo và các đầu mối Viettel Post cho Hoàng Kim Ngân (CSKH) tiếp quản.',
    isKeyMilestone: true,
    details: {
      fromMember: 'Lê Quốc Hưng (Sales Rep)',
      toMember: 'Hoàng Kim Ngân (CSKH)',
      reason: 'Lê Quốc Hưng nhận lệnh điều động phụ trách chiến dịch dự án lớn miền Nam. Bàn giao trước thềm ký kết hợp đồng.',
      handoverChecklist: [
        { item: 'Biên bản thử nghiệm POC 50 bưu cục đã nghiệm thu thành công', completed: true },
        { item: 'Dự thảo Hợp đồng kinh tế và Báo giá BQ-2026-003 đã thống nhất với anh Long', completed: true },
        { item: 'Giới thiệu đầu mối CSKH qua điện thoại với Giám đốc CNTT', completed: false }
      ],
      personalAdvice: 'Anh Nguyễn Bảo Long là người thẳng thắn, coi trọng chữ tín và tiến độ. Em nên gọi điện giới thiệu bản thân vào sáng sớm (khoảng 09:00 - 10:30), tránh gọi từ 14:00 - 15:30 vì anh hay họp Ban Giám đốc.',
      attachments: [
        { name: 'Bien_Ban_Ban_Giao_Ho_So_KH_ViettelPost.pdf', size: '1.4 MB' },
        { name: 'So_Tay_Thong_Tin_Dau_Moi_Lien_He_VTP.docx', size: '420 KB' }
      ]
    }
  },
  {
    id: 'EVT-102-002',
    customerId: 'CUST-1021',
    type: 'QUOTE_SENT',
    typeLabel: 'Báo giá đã gửi',
    category: 'QUOTATION',
    timestamp: '2026-10-15T14:30:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📄 Gửi Báo giá chính thức BQ-2026-003 (Đã duyệt chiết khấu 5%)',
    summary: 'Phát hành báo giá lần 3 theo đề xuất của anh Long, tổng giá trị sau chiết khấu 820.000.000 ₫ kèm gói hỗ trợ kỹ thuật On-site 12 tháng.',
    isKeyMilestone: true,
    details: {
      quoteCode: 'BQ-2026-003',
      subTotal: 863157895,
      discountPercent: 5,
      discountAmount: 43157895,
      finalAmount: 820000000,
      vatPercent: 8,
      currency: 'VND',
      validUntil: '2026-11-15',
      paymentTerms: 'Thanh toán 3 đợt (40% sau khi ký, 40% sau khi triển khai POC 50 bưu cục, 20% khi nghiệm thu toàn diện)',
      lineItems: [
        { name: 'Bản quyền Nền tảng Enterprise Cloud CRM (Gói 500 tài khoản người dùng)', qty: 1, unitPrice: 520000000, total: 520000000 },
        { name: 'Module Tích hợp API ERP Viettel Post & Hệ thống Vận đơn Bưu chính', qty: 1, unitPrice: 180000000, total: 180000000 },
        { name: 'Gói Dịch vụ Đào tạo & Chuyển giao công nghệ cho 50 bưu cục trưởng', qty: 1, unitPrice: 85000000, total: 85000000 },
        { name: 'Dịch vụ Kỹ thuật On-site 24/7 & Cam kết SLA 99.99% (Năm đầu)', qty: 1, unitPrice: 78157895, total: 78157895 }
      ],
      clientFeedback: 'Anh Long đã xem qua email và xác nhận đồng ý với phương án giá này, đang trình Tổng Giám đốc ký duyệt.',
      attachments: [
        { name: 'Bao_Gia_BQ-2026-003_ViettelPost_Official.pdf', size: '2.8 MB' },
        { name: 'Phu_Luc_Tinh_Nang_Ky_Thuat_Va_SLA.pdf', size: '1.2 MB' }
      ]
    }
  },
  {
    id: 'EVT-102-003',
    customerId: 'CUST-1021',
    type: 'OPPORTUNITY_CHANGE',
    typeLabel: 'Thay đổi cơ hội',
    category: 'OPPORTUNITY',
    timestamp: '2026-10-15T15:00:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '💼 Chuyển giai đoạn cơ hội: Đề xuất Báo giá ➔ Thương thảo hợp đồng',
    summary: 'Cơ hội OPP-2026-VTP được nâng cấp từ giai đoạn "Đề xuất & Báo giá" sang "Thương thảo hợp đồng". Tăng xác suất thắng từ 65% lên 85%.',
    isKeyMilestone: true,
    details: {
      opportunityCode: 'OPP-2026-VTP',
      oldStage: 'PROPOSAL',
      oldStageLabel: 'Đề xuất & Báo giá',
      newStage: 'NEGOTIATION',
      newStageLabel: 'Thương thảo hợp đồng',
      oldProbability: 65,
      newProbability: 85,
      dealValue: 850000000,
      expectedCloseDate: '2026-10-25',
      changeReason: 'Khách hàng duyệt sơ bộ Báo giá BQ-2026-003 và gửi danh sách điều khoản pháp lý cần điều chỉnh trong Hợp đồng kinh tế.'
    }
  },
  {
    id: 'EVT-102-004',
    customerId: 'CUST-1021',
    type: 'CALL',
    typeLabel: 'Cuộc gọi',
    category: 'ACTIVITY',
    timestamp: '2026-10-14T16:15:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📞 Cuộc gọi đàm phán chính sách chiết khấu với Giám đốc CNTT',
    summary: 'Cuộc gọi 18 phút trao đổi trực tiếp với anh Long về đề xuất chiết khấu thêm 5% cho đơn hàng đầu tiên.',
    isKeyMilestone: false,
    details: {
      callDirection: 'OUTBOUND',
      contactPerson: 'Anh Nguyễn Bảo Long (0912.888.666)',
      duration: '18 phút 42 giây',
      callResult: 'SUCCESSFUL',
      notes: 'Anh Long cho biết nếu công ty chúng ta duyệt được chiết khấu 5% (xuống tròn khoảng 820 triệu đồng), anh sẽ ký tờ trình phê duyệt ngân sách ngay trong tuần để kịp giải ngân Quý 4. Lê Quốc Hưng đã xin ý kiến Trưởng nhóm Trọng và được duyệt.'
    }
  },
  {
    id: 'EVT-102-005',
    customerId: 'CUST-1021',
    type: 'MEETING',
    typeLabel: 'Cuộc họp',
    category: 'ACTIVITY',
    timestamp: '2026-10-12T09:00:00Z',
    actorId: 'tran_mai',
    actorName: 'Trần Thị Mai',
    actorRole: 'Kỹ sư Giải pháp (Pre-Sales)',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: '🤝 Buổi họp Đánh giá & Nghiệm thu Thử nghiệm POC Kỹ thuật',
    summary: 'Họp trực tiếp tại Trụ sở Viettel Post để trình diễn kết quả thử nghiệm kết nối dữ liệu giả lập 50 bưu cục đồng thời.',
    isKeyMilestone: true,
    details: {
      location: 'Phòng họp Tầng 8, Tòa nhà Viettel Post, Khu CNC Hòa Lạc, Hà Nội',
      meetingType: 'IN_PERSON',
      duration: '90 phút',
      attendees: [
        'Trần Thị Mai (Kỹ sư Pre-sales)',
        'Lê Quốc Hưng (Sales Rep)',
        'Anh Nguyễn Bảo Long (Giám đốc CNTT VTP)',
        'Anh Trần Tuấn Anh (Trưởng phòng Hạ tầng Mạng VTP)',
        'Chị Lê Thu Hà (Chuyên viên Vận hành Hệ thống VTP)'
      ],
      meetingMinutes: 'Đã giả lập tải 120.000 vận đơn cùng lúc trong giờ cao điểm. Tốc độ phản hồi trung bình của hệ thống đạt 145ms (vượt tiêu chuẩn yêu cầu < 300ms của Viettel Post). Anh Long đánh giá xuất sắc năng lực chịu tải của nền tảng.',
      nextStep: 'Hoàn thiện hồ sơ nghiệm thu kỹ thuật và gửi báo giá thương mại chính thức kèm chiết khấu.'
    }
  },
  {
    id: 'EVT-102-006',
    customerId: 'CUST-1021',
    type: 'EMAIL',
    typeLabel: 'Email trao đổi',
    category: 'ACTIVITY',
    timestamp: '2026-10-11T10:20:00Z',
    actorId: 'tran_mai',
    actorName: 'Trần Thị Mai',
    actorRole: 'Kỹ sư Giải pháp (Pre-Sales)',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: '✉️ Gửi tài liệu Kiến trúc bảo mật Cloud & Báo cáo Pentest ISO 27001',
    summary: 'Giải đáp toàn diện 15 câu hỏi của Hội đồng An toàn thông tin Viettel Post về mã hóa dữ liệu đầu cuối và sao lưu dự phòng.',
    isKeyMilestone: false,
    details: {
      fromEmail: 'mai.tt@crm-enterprise.vn',
      toEmail: 'long.nb@viettelpost.com.vn',
      ccEmails: ['hung.lq@crm-enterprise.vn', 'security@viettelpost.com.vn'],
      subject: '[Viettel Post x CRM] Tài liệu Kiến trúc Bảo mật & Chứng chỉ An toàn thông tin',
      bodySnippet: 'Kính gửi Anh Long và Ban An toàn thông tin Viettel Post,\nTheo đề nghị trong buổi làm việc tuần trước, nhóm Kỹ thuật xin gửi kèm toàn bộ tài liệu giải trình cơ chế mã hóa AES-256, báo cáo kiểm thử thâm nhập (Pentest) gần nhất đạt chứng nhận ISO/IEC 27001:2022 và cam kết SLA xử lý sự cố...',
      attachments: [
        { name: 'Kien_Truc_Bao_Mat_Du_Lieu_ViettelPost.pdf', size: '3.5 MB' },
        { name: 'Chung_Chi_ISO27001_Bao_Cao_Pentest_2026.pdf', size: '4.1 MB' }
      ]
    }
  },
  {
    id: 'EVT-102-007',
    customerId: 'CUST-1021',
    type: 'QUOTE_SENT',
    typeLabel: 'Báo giá đã gửi',
    category: 'QUOTATION',
    timestamp: '2026-10-09T11:00:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📄 Gửi Báo giá lần 2 BQ-2026-002 (Bổ sung Module tích hợp API ERP)',
    summary: 'Điều chỉnh báo giá lần 2 theo yêu cầu bổ sung module đồng bộ dữ liệu hai chiều với phần mềm lõi bưu điện.',
    isKeyMilestone: false,
    details: {
      quoteCode: 'BQ-2026-002',
      finalAmount: 863157895,
      discountPercent: 0,
      currency: 'VND',
      validUntil: '2026-11-09',
      attachments: [
        { name: 'Bao_Gia_BQ-2026-002_ViettelPost.pdf', size: '2.1 MB' }
      ]
    }
  },
  {
    id: 'EVT-102-008',
    customerId: 'CUST-1021',
    type: 'NOTE',
    typeLabel: 'Ghi chú nội bộ',
    category: 'ACTIVITY',
    timestamp: '2026-10-08T15:45:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📝 Cập nhật sơ đồ phân quyền & các bên liên quan tại Viettel Post',
    summary: 'Ghi chú nội bộ về những nhân vật có tiếng nói quyết định trong gói thầu này để CSKH và Kỹ thuật phối hợp nhịp nhàng.',
    isKeyMilestone: false,
    details: {
      noteContent: '1. Anh Nguyễn Bảo Long (Giám đốc CNTT): Quyết định 80% về kỹ thuật và giải pháp.\n2. Chị Nguyễn Thị Thu (Phó Tổng Giám đốc phụ trách Vận hành): Người ký duyệt cuối cùng trên hợp đồng.\n3. Anh Tuấn Anh (Trưởng phòng Hạ tầng): Chuyên gia soi kỹ chi tiết kỹ thuật bảo mật, cần trao đổi bằng thuật ngữ chuẩn xác.',
      tags: ['Cơ cấu tổ chức', 'Stakeholders', 'Viettel Post']
    }
  },
  {
    id: 'EVT-102-009',
    customerId: 'CUST-1021',
    type: 'CALL',
    typeLabel: 'Cuộc gọi',
    category: 'ACTIVITY',
    timestamp: '2026-10-06T14:00:00Z',
    actorId: 'tran_mai',
    actorName: 'Trần Thị Mai',
    actorRole: 'Kỹ sư Giải pháp (Pre-Sales)',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: '📞 Trao đổi kỹ thuật với Trưởng phòng Hạ tầng mạng Viettel Post',
    summary: 'Cuộc gọi 25 phút thống nhất thông số cổng kết nối VPN IPsec và cấu hình máy chủ Gateway cho buổi thử nghiệm POC.',
    isKeyMilestone: false,
    details: {
      contactPerson: 'Anh Trần Tuấn Anh (Trưởng phòng Hạ tầng)',
      duration: '25 phút 10 giây',
      callResult: 'SUCCESSFUL',
      notes: 'Thống nhất mở dải IP thử nghiệm vào sáng 10/10 để team kỹ thuật phía ta tiến hành cài đặt mô phỏng môi trường Sandbox.'
    }
  },
  {
    id: 'EVT-102-010',
    customerId: 'CUST-1021',
    type: 'QUOTE_SENT',
    typeLabel: 'Báo giá đã gửi',
    category: 'QUOTATION',
    timestamp: '2026-10-04T09:30:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📄 Gửi Bản Dự toán & Báo giá lần đầu BQ-2026-001',
    summary: 'Báo giá sơ bộ ban đầu trị giá 890.000.000 ₫ gửi sau khi hoàn thành buổi khảo sát nhu cầu nghiệp vụ.',
    isKeyMilestone: false,
    details: {
      quoteCode: 'BQ-2026-001',
      finalAmount: 890000000,
      currency: 'VND',
      attachments: [
        { name: 'Du_Toan_So_Bo_BQ-2026-001.pdf', size: '1.8 MB' }
      ]
    }
  },
  {
    id: 'EVT-102-011',
    customerId: 'CUST-1021',
    type: 'OPPORTUNITY_CHANGE',
    typeLabel: 'Thay đổi cơ hội',
    category: 'OPPORTUNITY',
    timestamp: '2026-10-03T16:00:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '💼 Chuyển giai đoạn cơ hội: Khảo sát ➔ Đề xuất & Báo giá',
    summary: 'Hoàn tất khảo sát hiện trạng 50 bưu cục, nâng cơ hội sang giai đoạn Đề xuất giải pháp và chuẩn bị bảng báo giá chi tiết.',
    isKeyMilestone: false,
    details: {
      opportunityCode: 'OPP-2026-VTP',
      oldStage: 'QUALIFICATION',
      oldStageLabel: 'Khảo sát nhu cầu',
      newStage: 'PROPOSAL',
      newStageLabel: 'Đề xuất & Báo giá',
      oldProbability: 40,
      newProbability: 65
    }
  },
  {
    id: 'EVT-102-012',
    customerId: 'CUST-1021',
    type: 'MEETING',
    typeLabel: 'Cuộc họp',
    category: 'ACTIVITY',
    timestamp: '2026-10-02T10:00:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '🤝 Cuộc gặp đầu tiên: Khảo sát hiện trạng & Tiếp nhận bài toán bài bản',
    summary: 'Gặp gỡ trực tiếp anh Long và đội ngũ vận hành tại Trụ sở Viettel Post để khảo sát nhu cầu nâng cấp kênh tương tác bưu phẩm.',
    isKeyMilestone: true,
    details: {
      location: 'Phòng họp Tầng 3, Trụ sở Viettel Post Hà Nội',
      duration: '120 phút',
      attendees: ['Lê Quốc Hưng (Sales)', 'Trần Thị Mai (Pre-sales)', 'Anh Nguyễn Bảo Long (Giám đốc CNTT)']
    }
  },
  {
    id: 'EVT-102-013',
    customerId: 'CUST-1021',
    type: 'OPPORTUNITY_CHANGE',
    typeLabel: 'Thay đổi cơ hội',
    category: 'OPPORTUNITY',
    timestamp: '2026-10-01T08:30:00Z',
    actorId: 'dinh_trong',
    actorName: 'Trần Đình Trọng',
    actorRole: 'Trưởng nhóm Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: '💼 Khởi tạo cơ hội kinh doanh mới OPP-2026-VTP',
    summary: 'Trưởng nhóm Trần Đình Trọng khởi tạo và phân công cơ hội Viettel Post trị giá dự kiến 850.000.000 ₫ cho Lê Quốc Hưng phụ trách.',
    isKeyMilestone: true,
    details: {
      opportunityCode: 'OPP-2026-VTP',
      dealValue: 850000000,
      initialStage: 'PROSPECTING',
      assignedTo: 'Lê Quốc Hưng'
    }
  },

  // ==========================================
  // CUSTOMER 2: NOVALAND GROUP (CUST-1022)
  // ==========================================
  {
    id: 'EVT-102-020',
    customerId: 'CUST-1022',
    type: 'QUOTE_SENT',
    typeLabel: 'Báo giá đã gửi',
    category: 'QUOTATION',
    timestamp: '2026-10-14T10:00:00Z',
    actorId: 'nguyen_an',
    actorName: 'Nguyễn Văn An',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: '📄 Gửi Báo giá BQ-2026-002 cho Novaland (Gói CRM Cư dân)',
    summary: 'Gửi báo giá chính thức giải pháp CRM cư dân Novaland trị giá 1.15 tỷ đồng cho Trưởng ban Mua sắm Phạm Quỳnh Nga.',
    isKeyMilestone: true,
    details: {
      quoteCode: 'BQ-2026-002',
      finalAmount: 1150000000,
      discountPercent: 4,
      currency: 'VND'
    }
  },
  {
    id: 'EVT-102-021',
    customerId: 'CUST-1022',
    type: 'HANDOVER',
    typeLabel: 'Bàn giao phụ trách CSKH',
    category: 'HANDOVER',
    timestamp: '2026-10-12T08:00:00Z',
    actorId: 'nguyen_an',
    actorName: 'Nguyễn Văn An',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: '🤝 Bàn giao hồ sơ Novaland cho CSKH Hoàng Kim Ngân',
    summary: 'Bàn giao chuyển giao trách nhiệm theo quy trình chuẩn khi báo giá đã gửi đi, CSKH theo sát phản hồi của ban Pháp chế.',
    isKeyMilestone: true,
    details: {
      fromMember: 'Nguyễn Văn An',
      toMember: 'Hoàng Kim Ngân',
      reason: 'Bàn giao theo quy chuẩn để CSKH đồng hành giải đáp thắc mắc dịch vụ.'
    }
  },
  {
    id: 'EVT-102-022',
    customerId: 'CUST-1022',
    type: 'CALL',
    typeLabel: 'Cuộc gọi',
    category: 'ACTIVITY',
    timestamp: '2026-10-10T15:30:00Z',
    actorId: 'hoang_ngan',
    actorName: 'Hoàng Kim Ngân',
    actorRole: 'Chăm sóc khách hàng',
    actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: '📞 Cuộc gọi thăm hỏi & Tiếp nhận ý kiến chị Nga Novaland',
    summary: 'CSKH Ngân gọi điện chào hỏi chị Nga, ghi nhận đề xuất hỗ trợ xuất hóa đơn điện tử theo quý.',
    isKeyMilestone: false,
    details: {
      duration: '12 phút',
      contactPerson: 'Chị Phạm Quỳnh Nga'
    }
  },

  // ==========================================
  // CUSTOMER 3: TIMO PLUS (CUST-1023)
  // ==========================================
  {
    id: 'EVT-102-030',
    customerId: 'CUST-1023',
    type: 'MEETING',
    typeLabel: 'Cuộc họp',
    category: 'ACTIVITY',
    timestamp: '2026-10-16T14:00:00Z',
    actorId: 'tran_mai',
    actorName: 'Trần Thị Mai',
    actorRole: 'Kỹ sư Giải pháp (Pre-Sales)',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: '🤝 Họp rà soát độ chính xác phân loại vé tự động AI Ticket',
    summary: 'Họp trực tuyến với Head of CX Vũ Hoàng Nam, ghi nhận thuật toán đạt độ chính xác 94.8% trên 5.000 vé mẫu.',
    isKeyMilestone: true,
    details: {
      meetingType: 'ONLINE',
      duration: '60 phút'
    }
  },
  {
    id: 'EVT-102-031',
    customerId: 'CUST-1023',
    type: 'QUOTE_SENT',
    typeLabel: 'Báo giá đã gửi',
    category: 'QUOTATION',
    timestamp: '2026-10-10T11:00:00Z',
    actorId: 'nguyen_an',
    actorName: 'Nguyễn Văn An',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: '📄 Gửi Báo giá BQ-2026-001-TIMO (Gói API AI Ticket Classifier)',
    summary: 'Gửi báo giá bản quyền tính toán theo số lượng API Call hàng tháng trị giá 640.000.000 ₫.',
    isKeyMilestone: false,
    details: {
      quoteCode: 'BQ-2026-001-TIMO',
      finalAmount: 640000000
    }
  },

  // ==========================================
  // CUSTOMER 4: WINCOMMERCE (CUST-1024)
  // ==========================================
  {
    id: 'EVT-102-040',
    customerId: 'CUST-1024',
    type: 'OPPORTUNITY_CHANGE',
    typeLabel: 'Thay đổi cơ hội',
    category: 'OPPORTUNITY',
    timestamp: '2026-10-16T15:30:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '🎉 Chiến thắng thương vụ (Closed Won): Ký Hợp đồng WinCommerce 1.45 Tỷ',
    summary: 'Chính thức ký kết hợp đồng thương mại triển khai CRM cho 3.600 điểm bán WinMart & WinMart+.',
    isKeyMilestone: true,
    details: {
      dealValue: 1450000000,
      newStage: 'CLOSED_WON',
      newStageLabel: 'Thắng thầu - Đã ký hợp đồng'
    }
  },
  {
    id: 'EVT-102-041',
    customerId: 'CUST-1024',
    type: 'QUOTE_SENT',
    typeLabel: 'Báo giá đã gửi',
    category: 'QUOTATION',
    timestamp: '2026-10-14T09:00:00Z',
    actorId: 'le_hung',
    actorName: 'Lê Quốc Hưng',
    actorRole: 'Chuyên viên Kinh doanh',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: '📄 Gửi Báo giá & Dự thảo Hợp đồng BQ-2026-004-WIN',
    summary: 'Báo giá thương mại hoàn tất được Ban Giám đốc Masan WinCommerce phê duyệt không chỉnh sửa.',
    isKeyMilestone: true,
    details: {
      quoteCode: 'BQ-2026-004-WIN',
      finalAmount: 1450000000
    }
  }
];
