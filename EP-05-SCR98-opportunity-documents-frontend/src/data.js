export const USERS = [
  { id: 'linh.tran', name: 'Nguyễn Thùy Linh', title: 'Trưởng nhóm kinh doanh', initials: 'NL', color: 'violet' },
  { id: 'minh.pham', name: 'Phạm Quang Minh', title: 'Nhân viên kinh doanh', initials: 'PM', color: 'blue' },
  { id: 'quang.vo', name: 'Võ Minh Quang', title: 'Chuyên viên giải pháp', initials: 'VQ', color: 'green' },
  { id: 'phuong.le', name: 'Lê Hoàng Phương', title: 'Nhân viên kinh doanh', initials: 'LP', color: 'orange' },
  { id: 'huy.ngo', name: 'Ngô Đức Huy', title: 'Nhân viên kinh doanh', initials: 'NH', color: 'pink' },
];

export const OPPORTUNITIES = [
  { id: 'OPP-2418', name: 'Gói CRM doanh nghiệp', company: 'Đại Phát Group', value: 1280000000, stage: 'Đàm phán', stageKey: 'negotiation', ownerId: 'linh.tran', sharedUserIds: ['minh.pham', 'quang.vo'], closingDate: '2026-11-12', initials: 'ĐP', companyColor: 'coral', updatedAt: '2026-10-16T09:40:00+07:00' },
  { id: 'OPP-2412', name: 'Nền tảng quản lý kho', company: 'An Bình Logistics', value: 680000000, stage: 'Đề xuất', stageKey: 'proposal', ownerId: 'minh.pham', sharedUserIds: ['linh.tran'], closingDate: '2026-11-24', initials: 'AB', companyColor: 'blue', updatedAt: '2026-10-15T15:20:00+07:00' },
  { id: 'OPP-2407', name: 'Gói dịch vụ năm 2026', company: 'Nova Retail', value: 450000000, stage: 'Đang đánh giá', stageKey: 'qualification', ownerId: 'quang.vo', sharedUserIds: ['phuong.le'], closingDate: '2026-12-05', initials: 'NR', companyColor: 'purple', updatedAt: '2026-10-14T10:05:00+07:00' },
  { id: 'OPP-2398', name: 'Tích hợp dữ liệu sản xuất', company: 'Thành Công Manufacturing', value: 2100000000, stage: 'Đề xuất', stageKey: 'proposal', ownerId: 'phuong.le', sharedUserIds: ['minh.pham'], closingDate: '2026-12-18', initials: 'TC', companyColor: 'green', updatedAt: '2026-10-13T14:45:00+07:00' },
  { id: 'OPP-2381', name: 'Tự động hóa chăm sóc KH', company: 'Bình Minh Services', value: 325000000, stage: 'Đang tiếp cận', stageKey: 'prospecting', ownerId: 'huy.ngo', sharedUserIds: [], closingDate: '2027-01-09', initials: 'BM', companyColor: 'amber', updatedAt: '2026-10-11T08:10:00+07:00' },
];

export const DEMO_ATTACHMENTS = [
  { id: 'demo-doc-1', opportunityId: 'OPP-2418', name: 'Bien-ban-hop-khoi-dong.txt', size: 18432, type: 'text/plain', uploaderId: 'minh.pham', uploaderName: 'Phạm Quang Minh', uploadedAt: '2026-10-16T09:45:00+07:00', note: 'Biên bản họp khởi động dự án', demoContent: 'BIÊN BẢN HỌP KHỞI ĐỘNG\n\nCơ hội: Gói CRM doanh nghiệp – Đại Phát Group\nNgười tham dự: Nhóm kinh doanh và đội tư vấn giải pháp\n\nNội dung chính:\n- Xác nhận phạm vi triển khai ban đầu.\n- Thống nhất đầu mối phối hợp hai bên.\n- Khách hàng sẽ phản hồi danh sách yêu cầu chi tiết trong tuần.\n\nTài liệu mẫu dùng để kiểm thử chức năng đính kèm.' },
  { id: 'demo-doc-2', opportunityId: 'OPP-2418', name: 'Danh-muc-ho-so-thau.txt', size: 12600, type: 'text/plain', uploaderId: 'linh.tran', uploaderName: 'Nguyễn Thùy Linh', uploadedAt: '2026-10-15T16:12:00+07:00', note: 'Checklist hồ sơ thầu', demoContent: 'DANH MỤC HỒ SƠ THẦU\n\n1. Hồ sơ năng lực doanh nghiệp\n2. Đề xuất giải pháp kỹ thuật\n3. Báo giá và điều khoản thương mại\n4. Kế hoạch triển khai\n5. Biên bản xác nhận yêu cầu\n\nĐây là tài liệu demo để kiểm tra chức năng tải xuống.' },
  { id: 'demo-doc-3', opportunityId: 'OPP-2418', name: 'Ghi-chu-yeu-cau-khach-hang.txt', size: 8650, type: 'text/plain', uploaderId: 'quang.vo', uploaderName: 'Võ Minh Quang', uploadedAt: '2026-10-14T11:30:00+07:00', note: 'Tổng hợp yêu cầu ban đầu', demoContent: 'GHI CHÚ YÊU CẦU KHÁCH HÀNG\n\n- Cần phân quyền theo phòng ban.\n- Cần báo cáo quản trị theo thời gian thực.\n- Cần tích hợp với phần mềm kế toán hiện tại.\n\nTài liệu demo được tạo sẵn để bạn thử giao diện.' },
  { id: 'demo-doc-4', opportunityId: 'OPP-2412', name: 'Yeu-cau-he-thong.txt', size: 9700, type: 'text/plain', uploaderId: 'minh.pham', uploaderName: 'Phạm Quang Minh', uploadedAt: '2026-10-15T15:25:00+07:00', note: 'Yêu cầu hệ thống quản lý kho', demoContent: 'YÊU CẦU HỆ THỐNG QUẢN LÝ KHO\n\n- Theo dõi nhập, xuất, tồn kho.\n- Hỗ trợ nhiều kho và nhiều chi nhánh.\n- Báo cáo tồn kho định kỳ.\n\nTài liệu mẫu.' },
];
