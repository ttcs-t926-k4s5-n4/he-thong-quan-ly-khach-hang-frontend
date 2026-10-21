// =====================================================================
// SCRUM-94: Dữ liệu mẫu 16 Cơ hội kinh doanh B2B (Pipeline Opportunities)
// Mô phỏng các deal thuộc nhân sự nghỉ dài hạn & nhân sự quá tải
// Ngày hiện tại của hệ thống: 2026-10-18
// =====================================================================

export const CURRENT_SYSTEM_DATE = '2026-10-18';

export const INITIAL_OPPORTUNITIES = [
  // -------------------------------------------------------------
  // Nhóm deal của Lê Quốc Hưng (USR-REP-03) - Đang nghỉ ốm 3 tuần!
  // -------------------------------------------------------------
  {
    id: 'OPP-9401',
    title: 'Hệ thống ERP Quản trị Bệnh viện & Chuỗi Phòng khám Nam An',
    customerName: 'Tập đoàn Y tế Nam An',
    industry: 'Y tế & Bệnh viện',
    contactPerson: 'BS. Lê Minh Trí - Phó Giám đốc Y khoa',
    contactPhone: '0912.445.678',
    contactEmail: 'tri.lm@naman-med.vn',
    value: 850000000, // 850 triệu
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-30',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_SICK',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-08',
    lastActivityType: 'Họp trực tiếp tại bệnh viện',
    lastActivityNote: 'BS. Trí đã chốt xong phạm vi tính năng quản lý bệnh án điện tử EMR, đang chờ phản hồi về điều khoản bảo mật dữ liệu y tế.',
    activities: [
      { id: 'ACT-01', date: '2026-10-08 14:00', type: 'MEETING', author: 'Lê Quốc Hưng', content: 'Họp trực tiếp tại bệnh viện rà soát tiêu chuẩn kết nối HIS/LIS.' },
      { id: 'ACT-02', date: '2026-10-02 09:30', type: 'PROPOSAL', author: 'Lê Quốc Hưng', content: 'Gửi bảng báo giá chi tiết gói phần mềm ERP Bệnh viện v2.1.' },
      { id: 'ACT-03', date: '2026-09-20 15:30', type: 'DEMO', author: 'Lê Quốc Hưng', content: 'Buổi demo thực tế phân hệ khám chữa bệnh ngoại trú cho Hội đồng chuyên môn.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9402',
    title: 'Hạ tầng Điện toán Đám mây & Di trú Dữ liệu Hybrid Cloud',
    customerName: 'Công ty Cổ phần Vận tải LogiFast',
    industry: 'Logistics & Vận tải',
    contactPerson: 'Nguyễn Tiến Dũng - Giám đốc CNTT (CIO)',
    contactPhone: '0913.556.789',
    contactEmail: 'dung.nt@logifast.vn',
    value: 620000000, // 620 triệu
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-11-10',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_SICK',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-07',
    lastActivityType: 'Gửi Email báo giá',
    lastActivityNote: 'Đã gửi file chi phí dự toán chuyển dịch 45 máy chủ ảo lên private cloud, khách hàng hẹn tuần này phản hồi nhưng chưa gọi lại được.',
    activities: [
      { id: 'ACT-04', date: '2026-10-07 16:15', type: 'EMAIL', author: 'Lê Quốc Hưng', content: 'Gửi tài liệu phân tích TCO (Tổng chi phí sở hữu) trong 3 năm.' },
      { id: 'ACT-05', date: '2026-09-28 10:00', type: 'CALL', author: 'Lê Quốc Hưng', content: 'Trao đổi về băng thông đường truyền VPN leased-line kết nối kho bãi.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9403',
    title: 'Giải pháp Giám sát An ninh Mạng SIEM & SOC Managed Service',
    customerName: 'Ngân hàng Số FinTrust Việt Nam',
    industry: 'Tài chính & Ngân hàng',
    contactPerson: 'Trần Khánh Toàn - Trưởng phòng An toàn Thông tin',
    contactPhone: '0918.777.888',
    contactEmail: 'toan.tk@fintrust.com.vn',
    value: 1200000000, // 1.2 tỷ
    stage: 'POC_DEMO',
    expectedCloseDate: '2026-11-25',
    salesRepId: 'USR-REP-03',
    salesRepName: 'Lê Quốc Hưng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_SICK',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-06',
    lastActivityType: 'Triển khai thử nghiệm POC',
    lastActivityNote: 'Khách hàng đang cài đặt agent thu thập log thử nghiệm 14 ngày. Cần chuyên gia bảo mật theo sát để giải đáp thắc mắc kỹ thuật.',
    activities: [
      { id: 'ACT-06', date: '2026-10-06 11:30', type: 'DEMO', author: 'Lê Quốc Hưng', content: 'Cấu hình test log event collector trên cụm server dev của FinTrust.' },
      { id: 'ACT-07', date: '2026-09-25 14:00', type: 'MEETING', author: 'Lê Quốc Hưng', content: 'Họp bảo vệ phương án kỹ thuật và đáp ứng chuẩn PCI-DSS.' }
    ],
    reassignmentHistory: []
  },

  // -------------------------------------------------------------
  // Nhóm deal của Hoàng Kim Chi (USR-REP-04) - Nghỉ thai sản 6 tháng!
  // -------------------------------------------------------------
  {
    id: 'OPP-9404',
    title: 'Cổng Thanh toán Tự động & Quản lý Thẻ Trả trước Doanh nghiệp',
    customerName: 'Tập đoàn Bán lẻ VinMart Plus',
    industry: 'Bán lẻ & E-commerce',
    contactPerson: 'Phạm Hương Ly - Giám đốc Khối Khách hàng B2B',
    contactPhone: '0904.333.222',
    contactEmail: 'ly.ph@vinretail.vn',
    value: 980000000, // 980 triệu
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-28',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_MATERNITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-14',
    lastActivityType: 'Họp bàn giao hồ sơ',
    lastActivityNote: 'Chi đã tóm tắt các yêu cầu chiết khấu phí giao dịch quẹt thẻ, khách hàng mong muốn chốt hợp đồng trước tháng 11 để kịp mùa Black Friday.',
    activities: [
      { id: 'ACT-08', date: '2026-10-14 10:00', type: 'MEETING', author: 'Hoàng Kim Chi', content: 'Họp trực tuyến thống nhất tỷ lệ chia sẻ doanh thu và phí bảo trì hàng năm.' },
      { id: 'ACT-09', date: '2026-10-05 15:45', type: 'PROPOSAL', author: 'Hoàng Kim Chi', content: 'Gửi đề xuất gói tích hợp API cổng thanh toán với máy POS quầy thu ngân.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9405',
    title: 'Hệ thống Quản lý Rủi ro Tín dụng & AI Credit Scoring',
    customerName: 'Công ty Tài chính Tiêu dùng Mirae Easy',
    industry: 'Tài chính - Ngân hàng',
    contactPerson: 'Hoàng Minh Châu - Trưởng ban Thẩm định Tín dụng',
    contactPhone: '0909.112.233',
    contactEmail: 'chau.hm@miraeeasy.vn',
    value: 1450000000, // 1.45 tỷ
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-11-20',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_MATERNITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-11',
    lastActivityType: 'Thuyết trình giải pháp',
    lastActivityNote: 'Mô hình chấm điểm rủi ro AI đạt độ chính xác 94% trên tập dữ liệu thử nghiệm, khách hàng đang xin ý kiến Tổng Giám đốc.',
    activities: [
      { id: 'ACT-10', date: '2026-10-11 14:30', type: 'DEMO', author: 'Hoàng Kim Chi', content: 'Trình diễn mô hình máy học dự đoán tỷ lệ nợ xấu NPL.' },
      { id: 'ACT-11', date: '2026-09-29 09:00', type: 'MEETING', author: 'Hoàng Kim Chi', content: 'Khảo sát quy trình cấp tín dụng tiêu dùng qua ứng dụng di động.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9406',
    title: 'Nền tảng Ví điện tử & Tích điểm Thành viên E-Wallet',
    customerName: 'Tập đoàn Xăng dầu Petrol Solar',
    industry: 'Năng lượng & Bán lẻ',
    contactPerson: 'Đỗ Văn Cường - Trưởng phòng Marketing & Thẻ',
    contactPhone: '0908.445.566',
    contactEmail: 'cuong.dv@petrolsolar.vn',
    value: 750000000, // 750 triệu
    stage: 'DISCOVERY',
    expectedCloseDate: '2026-12-15',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_MATERNITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-12',
    lastActivityType: 'Khảo sát nhu cầu',
    lastActivityNote: 'Thu thập bảng câu hỏi nhu cầu tích điểm khi đổ xăng tại 200 trạm dịch vụ toàn miền Nam.',
    activities: [
      { id: 'ACT-12', date: '2026-10-12 10:30', type: 'MEETING', author: 'Hoàng Kim Chi', content: 'Trao đổi sơ bộ về phương án kết nối máy in hóa đơn điện tử tại trạm.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9407',
    title: 'Giải pháp Định danh Khách hàng Điện tử eKYC & Video KYC',
    customerName: 'Ngân hàng Thương mại Cổ phần Đại Phát',
    industry: 'Tài chính - Ngân hàng',
    contactPerson: 'Nguyễn Bích Ngọc - Phó phòng Ngân hàng Số',
    contactPhone: '0907.889.900',
    contactEmail: 'ngoc.nb@daiphatbank.vn',
    value: 1100000000, // 1.1 tỷ
    stage: 'POC_DEMO',
    expectedCloseDate: '2026-11-15',
    salesRepId: 'USR-REP-04',
    salesRepName: 'Hoàng Kim Chi',
    salesRepAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ON_LEAVE_MATERNITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-10',
    lastActivityType: 'Chạy thử nghiệm thuật toán Liveness',
    lastActivityNote: 'Đã test thành công 500 mẫu nhận diện khuôn mặt chống giả mạo Deepfake.',
    activities: [
      { id: 'ACT-13', date: '2026-10-10 15:00', type: 'DEMO', author: 'Hoàng Kim Chi', content: 'Demo thuật toán quét chip CCCD qua đầu đọc NFC.' }
    ],
    reassignmentHistory: []
  },

  // -------------------------------------------------------------
  // Nhóm deal của Nguyễn Văn An (USR-REP-01) - Đang QUÁ TẢI (6 deals)!
  // -------------------------------------------------------------
  {
    id: 'OPP-9408',
    title: 'Hệ thống Quản lý Chuỗi Cung ứng & Kho Thông minh WMS',
    customerName: 'Tập đoàn Thủy sản Minh Hải',
    industry: 'Sản xuất & Xuất khẩu',
    contactPerson: 'Vũ Quốc Toàn - Giám đốc Vận hành (COO)',
    contactPhone: '0912.998.877',
    contactEmail: 'toan.vq@minhhauseafood.vn',
    value: 920000000, // 920 triệu
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-25',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'OVERLOADED',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-09',
    lastActivityType: 'Trao đổi hợp đồng',
    lastActivityNote: 'Khách hàng hối thúc phản hồi điều khoản bảo hành 24 tháng, An chưa kịp sửa vì đang bận họp dự án bên Masan.',
    activities: [
      { id: 'ACT-14', date: '2026-10-09 11:00', type: 'CALL', author: 'Nguyễn Văn An', content: 'Khách hàng giục gửi dự thảo hợp đồng bản cuối.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9409',
    title: 'Phần mềm ERP Quản trị Sản xuất Ngành May Mặc Xuất khẩu',
    customerName: 'Tổng Công ty May 10 Hưng Yên',
    industry: 'Dệt may & Thời trang',
    contactPerson: 'Đặng Thanh Tùng - Giám đốc Kỹ thuật Nhà máy',
    contactPhone: '0915.667.788',
    contactEmail: 'tung.dt@may10hy.vn',
    value: 780000000, // 780 triệu
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-11-05',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'OVERLOADED',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-12',
    lastActivityType: 'Báo giá bổ sung module kiểm KCS',
    lastActivityNote: 'Đã gửi báo giá sơ bộ, cần theo dõi cuộc gọi follow-up nhưng An bị trùng lịch nhiều deal khác.',
    activities: [
      { id: 'ACT-15', date: '2026-10-12 16:30', type: 'EMAIL', author: 'Nguyễn Văn An', content: 'Gửi bảng chiết khấu theo số lượng license người dùng.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9410',
    title: 'Giải pháp Hoá đơn Điện tử & Kết nối Thuế Tự động Masan Group',
    customerName: 'Công ty Cổ phần Hàng Tiêu dùng Masan Consumer',
    industry: 'F&B & Hàng tiêu dùng',
    contactPerson: 'Nguyễn Hải Đăng - Kế toán trưởng Tập đoàn',
    contactPhone: '0919.223.344',
    contactEmail: 'dang.nh@masanconsumer.com',
    value: 1650000000, // 1.65 tỷ (Deal chiến lược An đang tập trung)
    stage: 'CLOSING',
    expectedCloseDate: '2026-10-22',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'OVERLOADED',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-17',
    lastActivityType: 'Trình ký Ban Điều Hành Masan',
    lastActivityNote: 'An đang túc trực tại văn phòng Masan để hoàn thiện hồ sơ trình Tổng Giám đốc ký duyệt trong tuần này.',
    activities: [
      { id: 'ACT-16', date: '2026-10-17 09:00', type: 'MEETING', author: 'Nguyễn Văn An', content: 'Họp với Tổ Pháp chế và Kiểm toán rà soát phụ lục thanh toán.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9411',
    title: 'Hệ thống Quản lý Bán hàng Phân phối DMS Đồ uống Sài Gòn',
    customerName: 'Công ty Nước Giải khát Saigon Beverage',
    industry: 'F&B & Bán lẻ',
    contactPerson: 'Bùi Tuấn Anh - Giám đốc Thương mại Toàn quốc',
    contactPhone: '0903.554.433',
    contactEmail: 'anh.bt@saigonbev.vn',
    value: 580000000, // 580 triệu (Thích hợp san tải cho Mai hoặc Thắng!)
    stage: 'POC_DEMO',
    expectedCloseDate: '2026-11-18',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'OVERLOADED',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-13',
    lastActivityType: 'Demo phân hệ định vị GPS Salesman',
    lastActivityNote: 'Khách hàng rất thích tính năng giám sát tuyến bán hàng trên bản đồ, cần người chuyên về Bán lẻ & F&B theo đuổi.',
    activities: [
      { id: 'ACT-17', date: '2026-10-13 14:00', type: 'DEMO', author: 'Nguyễn Văn An', content: 'Trình diễn ứng dụng di động cho 50 giám sát bán hàng.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9412',
    title: 'Phần mềm Quản lý Tài sản Cố định & Bảo trì Thiết bị Nhà máy',
    customerName: 'Nhà máy Thép Hòa Phát Dung Quất',
    industry: 'Luyện kim & Vật liệu Xây dựng',
    contactPerson: 'Lê Văn Hùng - Phó Quản đốc Kỹ thuật Cơ điện',
    contactPhone: '0914.887.766',
    contactEmail: 'hung.lv@hoaphatdq.vn',
    value: 720000000, // 720 triệu
    stage: 'DISCOVERY',
    expectedCloseDate: '2026-12-05',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'OVERLOADED',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-11',
    lastActivityType: 'Gửi tài liệu giới thiệu CMMS',
    lastActivityNote: 'Đang ở giai đoạn tìm hiểu sơ bộ, An chưa có thời gian bay vào Quảng Ngãi khảo sát thực tế nhà máy.',
    activities: [
      { id: 'ACT-18', date: '2026-10-11 10:15', type: 'CALL', author: 'Nguyễn Văn An', content: 'Tư vấn giải pháp quét mã QR code gắn trên từng động cơ băng chuyền.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9413',
    title: 'Giải pháp Chấm công Nhận diện Khuôn mặt AI 15 Phân xưởng',
    customerName: 'Tập đoàn Chế tạo Cơ khí An Phát',
    industry: 'Cơ khí & Chế tạo',
    contactPerson: 'Đoàn Nhật Quang - Trưởng phòng Hành chính Nhân sự',
    contactPhone: '0909.667.889',
    contactEmail: 'quang.dn@anphatmech.vn',
    value: 490000000, // 490 triệu (Thích hợp san tải cho Junior Vũ Đức Thắng!)
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-11-12',
    salesRepId: 'USR-REP-01',
    salesRepName: 'Nguyễn Văn An',
    salesRepAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'OVERLOADED',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-14',
    lastActivityType: 'Gửi báo giá máy chấm công camera AI',
    lastActivityNote: 'Đã gửi cấu hình 30 camera AI tại cổng ra vào các xưởng. Cần nhân sự năng động liên tục liên hệ chăm sóc.',
    activities: [
      { id: 'ACT-19', date: '2026-10-14 11:30', type: 'PROPOSAL', author: 'Nguyễn Văn An', content: 'Gửi báo giá thiết bị kèm chi phí lắp đặt hạ tầng mạng LAN.' }
    ],
    reassignmentHistory: []
  },

  // -------------------------------------------------------------
  // Nhóm deal của Trần Thị Mai (USR-REP-02) - Đang RẢNH TẢI (2 deals)!
  // -------------------------------------------------------------
  {
    id: 'OPP-9414',
    title: 'Giải pháp CRM Omnichannel & Loyalty App Chuỗi Highlands Star',
    customerName: 'Chuỗi Cà phê Highlands Star',
    industry: 'F&B & Bán lẻ',
    contactPerson: 'Lý Quốc Bảo - Giám đốc Trải nghiệm Khách hàng',
    contactPhone: '0903.998.776',
    contactEmail: 'bao.lq@highlandsstar.vn',
    value: 520000000, // 520 triệu
    stage: 'NEGOTIATION',
    expectedCloseDate: '2026-10-29',
    salesRepId: 'USR-REP-02',
    salesRepName: 'Trần Thị Mai',
    salesRepAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ACTIVE_CAPACITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-16',
    lastActivityType: 'Họp chốt điều khoản bảo mật khách hàng',
    lastActivityNote: 'Mai đang kiểm soát deal rất tốt, dự kiến ký hợp đồng trong 2 tuần tới.',
    activities: [
      { id: 'ACT-20', date: '2026-10-16 15:00', type: 'MEETING', author: 'Trần Thị Mai', content: 'Họp với Giám đốc Marketing Highlands Star chốt kế hoạch phát hành thẻ VIP.' }
    ],
    reassignmentHistory: []
  },
  {
    id: 'OPP-9415',
    title: 'Hệ thống Đặt bàn & Quản lý Thẻ Thành viên Golden Gate Group',
    customerName: 'Tập đoàn Ẩm thực Golden Spoon',
    industry: 'F&B & Dịch vụ',
    contactPerson: 'Trương Mỹ Linh - Trưởng phòng Khách hàng Thân thiết',
    contactPhone: '0908.123.987',
    contactEmail: 'linh.tm@goldenspoon.com.vn',
    value: 640000000, // 640 triệu
    stage: 'POC_DEMO',
    expectedCloseDate: '2026-11-28',
    salesRepId: 'USR-REP-02',
    salesRepName: 'Trần Thị Mai',
    salesRepAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ACTIVE_CAPACITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-15',
    lastActivityType: 'Trình diễn Mini App trên Zalo',
    lastActivityNote: 'Demo trôi chảy, phía Golden Spoon đang làm tờ trình cho Ban Giám đốc.',
    activities: [
      { id: 'ACT-21', date: '2026-10-15 10:00', type: 'DEMO', author: 'Trần Thị Mai', content: 'Demo tính năng tích điểm đổi voucher giảm giá trên Zalo OA.' }
    ],
    reassignmentHistory: []
  },

  // -------------------------------------------------------------
  // Deal của Junior Vũ Đức Thắng (USR-REP-05) - Mới có 1 deal, rất rảnh tải!
  // -------------------------------------------------------------
  {
    id: 'OPP-9416',
    title: 'Phần mềm Quản lý Tuyển dụng & Đánh giá Ứng viên ATS',
    customerName: 'Công ty Nhân sự TalentPro Việt Nam',
    industry: 'Dịch vụ & Nhân sự',
    contactPerson: 'Mai Phương Oanh - Giám đốc Tuyển dụng Toàn quốc',
    contactPhone: '0912.776.554',
    contactEmail: 'oanh.mp@talentpro.vn',
    value: 320000000, // 320 triệu
    stage: 'PROPOSAL',
    expectedCloseDate: '2026-11-14',
    salesRepId: 'USR-REP-05',
    salesRepName: 'Vũ Đức Thắng',
    salesRepAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    assigneeStatus: 'ACTIVE_CAPACITY',
    isNewlyReassigned: false,
    reassignedAt: null,
    reassignCount: 0,
    lastActivityDate: '2026-10-16',
    lastActivityType: 'Gửi bảng so sánh tính năng với đối thủ',
    lastActivityNote: 'Thắng theo sát rất nhiệt tình, khách hàng đánh giá cao tốc độ phản hồi nhanh.',
    activities: [
      { id: 'ACT-22', date: '2026-10-16 09:30', type: 'EMAIL', author: 'Vũ Đức Thắng', content: 'Gửi bản phân tích đối chiếu ATS tự động phân tích CV bằng AI.' }
    ],
    reassignmentHistory: []
  }
];

// Nhật ký chuyển nhượng khởi tạo ban đầu để minh chứng lịch sử (Initial Audit Logs)
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'TRF-9400',
    timestamp: '2026-10-05 14:30',
    batchId: 'BATCH-20261005-01',
    dealCount: 1,
    totalValue: 640000000,
    initiatorId: 'USR-LEAD-01',
    initiatorName: 'Trần Đình Trọng (Trưởng nhóm)',
    initiatorRole: 'TEAM_LEAD',
    deals: [
      {
        id: 'OPP-9415',
        title: 'Hệ thống Đặt bàn & Quản lý Thẻ Thành viên Golden Gate Group',
        customerName: 'Tập đoàn Ẩm thực Golden Spoon',
        value: 640000000,
        stage: 'POC_DEMO'
      }
    ],
    fromRepId: 'USR-REP-01',
    fromRepName: 'Nguyễn Văn An',
    toRepId: 'USR-REP-02',
    toRepName: 'Trần Thị Mai',
    reasonId: 'SKILL_FIT',
    reasonLabel: 'Phù hợp năng lực chuyên môn & Kinh nghiệm theo ngành',
    notes: 'Chuyển giao thương vụ F&B Golden Spoon từ Nguyễn Văn An sang Trần Thị Mai do Mai có thế mạnh vượt trội về mảng Chuỗi ẩm thực & Bán lẻ.',
    checklist: [
      'Đã thông báo lý do chuyển giao cho khách hàng Golden Spoon',
      'Đã bàn giao lịch sử demo và báo giá sơ bộ',
      'Mai đã liên hệ trực tiếp với Trưởng phòng Khách hàng Thân thiết'
    ]
  }
];
