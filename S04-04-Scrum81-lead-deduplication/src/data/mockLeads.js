/**
 * Dữ liệu Khách hàng Tiềm năng (Marketing Leads)
 * Được thiết kế mô phỏng các chiến dịch Marketing thực tế,
 * chứa các trường hợp trùng lặp để kiểm thử 3 tiêu chí đề bài.
 */

export const initialMockLeads = [
  {
    id: "LD-101",
    code: "LEAD-101",
    fullName: "Phạm Văn Bình",
    jobTitle: "Giám đốc Công nghệ (CTO)",
    companyName: "Công ty Cổ phần Công nghệ FPT",
    email: "binh.pv@fpt.com.vn",
    phone: "0912345678",
    industry: "Công nghệ thông tin",
    leadSource: "Google Ads - Chiến dịch CRM Enterprise Q4",
    leadScore: 92,
    status: "CONTACTED", // Đã liên hệ
    assignedTo: {
      id: "STAFF-01",
      name: "Nguyễn Hoàng Tuấn",
      role: "Chuyên viên Telesales",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-09 08:05:00",
    budget: "500.000.000 đ",
    timeline: [
      {
        id: "TL-101-1",
        leadId: "LD-101",
        type: "CALL",
        title: "Cuộc gọi telesales tư vấn lần 1",
        actor: "Nguyễn Hoàng Tuấn (STAFF-01)",
        timestamp: "2026-10-09 08:30:15",
        timeLabel: "Sáng nay 08:30",
        isThisMorning: true,
        callDuration: "4 phút 25 giây",
        callStatus: "CONNECTED",
        content: "Đã liên hệ anh Bình. Anh Bình cho biết công ty đang tìm kiếm phần mềm CRM đa kênh quản trị 150 nhân sự. Đã hẹn gửi tài liệu demo và bảng chào giá vào 14:00 chiều nay.",
        sourceTag: "Gốc từ Lead #LD-101"
      },
      {
        id: "TL-101-2",
        leadId: "LD-101",
        type: "NOTE",
        title: "Ghi chú phân loại nhu cầu kỹ thuật",
        actor: "Nguyễn Hoàng Tuấn (STAFF-01)",
        timestamp: "2026-10-09 08:38:00",
        timeLabel: "Sáng nay 08:38",
        content: "Yêu cầu tích hợp SSO nội bộ, phân quyền RBAC đa cấp và API mở với SAP ERP.",
        sourceTag: "Gốc từ Lead #LD-101"
      },
      {
        id: "TL-101-3",
        leadId: "LD-101",
        type: "SYSTEM",
        title: "Thu nhận Lead từ Google Ads",
        actor: "Hệ thống Marketing Bot",
        timestamp: "2026-10-09 08:05:00",
        timeLabel: "Sáng nay 08:05",
        content: "Khách hàng điền form chuyển đổi Landing Page: Campaign 'Google_Ads_Enterprise_Q4', từ khóa 'phần mềm crm doanh nghiệp'.",
        sourceTag: "Gốc từ Lead #LD-101"
      }
    ]
  },
  {
    id: "LD-102",
    code: "LEAD-102",
    fullName: "Phạm Bình", // Tên gần giống
    jobTitle: "CTO",
    companyName: "FPT Software & Technology", // Tên công ty tương đồng
    email: "binh.pv@fpt.com.vn", // TRÙNG EMAIL 100%
    phone: "0912 345 678", // TRÙNG SỐ ĐIỆN THOẠI (sau chuẩn hóa)
    industry: "Công nghệ thông tin",
    leadSource: "Facebook Lead Form - Tải Ebook Chuyển Đổi Số",
    leadScore: 85,
    status: "NEW", // Mới tạo - ĐANG CHỜ GỌI!
    assignedTo: {
      id: "STAFF-02",
      name: "Trần Thị Mai Linh",
      role: "Chuyên viên Telesales",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-09 09:10:00", // Vừa đăng ký thêm cách đây ít phút
    budget: "450.000.000 đ",
    timeline: [
      {
        id: "TL-102-1",
        leadId: "LD-102",
        type: "NOTE",
        title: "Tải Ebook và để lại số điện thoại",
        actor: "Hệ thống Marketing Bot",
        timestamp: "2026-10-09 09:10:00",
        timeLabel: "Sáng nay 09:10",
        content: "Khách để lại lời nhắn: 'Muốn nhận tài liệu phân tích ROI triển khai hệ thống quản trị khách hàng B2B'.",
        sourceTag: "Gốc từ Lead #LD-102"
      },
      {
        id: "TL-102-2",
        leadId: "LD-102",
        type: "EMAIL",
        title: "Email tự động gửi Ebook",
        actor: "Hệ thống Email Marketing",
        timestamp: "2026-10-09 09:12:00",
        timeLabel: "Sáng nay 09:12",
        content: "Đã gửi tệp PDF 'Cam_nang_chuyen_doi_so_CRM_2026.pdf' đến email binh.pv@fpt.com.vn.",
        sourceTag: "Gốc từ Lead #LD-102"
      }
    ]
  },
  {
    id: "LD-103",
    code: "LEAD-103",
    fullName: "Nguyễn Minh Châu",
    jobTitle: "Trưởng phòng CNTT",
    companyName: "Tổng Công ty Viễn thông Viettel",
    email: "chau.nm@viettel-telecom.vn",
    phone: "0987654321",
    industry: "Viễn thông",
    leadSource: "Zalo OA Marketing",
    leadScore: 88,
    status: "QUALIFIED",
    assignedTo: {
      id: "STAFF-03",
      name: "Lê Văn Hùng",
      role: "Chuyên viên Tư vấn",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-08 14:20:00",
    budget: "600.000.000 đ",
    timeline: [
      {
        id: "TL-103-1",
        leadId: "LD-103",
        type: "CALL",
        title: "Trao đổi qua điện thoại",
        actor: "Lê Văn Hùng (STAFF-03)",
        timestamp: "2026-10-08 15:45:00",
        timeLabel: "Hôm qua 15:45",
        callDuration: "3 phút 10 giây",
        callStatus: "CONNECTED",
        content: "Khách quan tâm phân hệ Quản lý Hợp đồng và Chiết khấu đại lý. Chờ sếp duyệt ngân sách.",
        sourceTag: "Gốc từ Lead #LD-103"
      }
    ]
  },
  {
    id: "LD-105",
    code: "LEAD-105",
    fullName: "Nguyễn Minh Châu", // TRÙNG TÊN & SĐT VỚI LD-103
    jobTitle: "Trưởng phòng Công nghệ Thông tin",
    companyName: "Công ty Cổ phần Công nghệ Viettel", // Trùng tên công ty
    email: "minhchau.viettel@gmail.com", // Khác email cá nhân
    phone: "0987.654.321", // TRÙNG SỐ ĐIỆN THOẠI 100%
    industry: "Viễn thông & CNTT",
    leadSource: "Form Landing Page Đăng ký dùng thử",
    leadScore: 78,
    status: "NEW",
    assignedTo: {
      id: "STAFF-04",
      name: "Phạm Thu Hương",
      role: "Chuyên viên Telesales",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-09 07:45:00",
    budget: "550.000.000 đ",
    timeline: [
      {
        id: "TL-105-1",
        leadId: "LD-105",
        type: "NOTE",
        title: "Khách đăng ký dùng thử bản Enterprise 14 ngày",
        actor: "Hệ thống Webhook",
        timestamp: "2026-10-09 07:45:00",
        timeLabel: "Sáng nay 07:45",
        content: "Kích hoạt tenant demo tên miền viettel-demo.crmcorp.vn.",
        sourceTag: "Gốc từ Lead #LD-105"
      }
    ]
  },
  {
    id: "LD-104",
    code: "LEAD-104",
    fullName: "Trần Thu Hà",
    jobTitle: "Trưởng phòng Mua sắm & Đấu thầu",
    companyName: "Công ty Cổ phần FPT (FPT Corporation)", // TRÙNG VỚI KHÁCH HÀNG KH-001
    email: "ha.tt@fpt.com.vn", // Cùng domain fpt.com.vn
    phone: "0903456789", // TRÙNG SĐT LIÊN HỆ CỦA KH-001
    industry: "Công nghệ thông tin",
    leadSource: "Hội thảo Triển lãm Tech Expo 2026",
    leadScore: 95,
    status: "NEW",
    assignedTo: {
      id: "STAFF-02",
      name: "Trần Thị Mai Linh",
      role: "Chuyên viên Telesales",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-09 08:50:00",
    budget: "1.200.000.000 đ",
    timeline: [
      {
        id: "TL-104-1",
        leadId: "LD-104",
        type: "NOTE",
        title: "Gặp gỡ và quét mã QR tại gian hàng Tech Expo",
        actor: "Trần Thị Mai Linh (STAFF-02)",
        timestamp: "2026-10-09 08:50:00",
        timeLabel: "Sáng nay 08:50",
        content: "Chị Hà trao đổi muốn mua thêm module Quản lý Hợp đồng điện tử tích hợp vào hệ thống hiện có.",
        sourceTag: "Gốc từ Lead #LD-104"
      }
    ]
  },
  {
    id: "LD-106",
    code: "LEAD-106",
    fullName: "Vũ Hải Nam",
    jobTitle: "Giám đốc Vận hành Chuỗi cung ứng",
    companyName: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)", // TRÙNG KHÁCH HÀNG KH-003
    email: "nam.vh@vinamilk.com.vn", // Cùng domain vinamilk.com.vn
    phone: "02854155555", // TRÙNG SĐT TỔNG ĐÀI KH-003
    industry: "Hàng tiêu dùng nhanh (FMCG)",
    leadSource: "Webinar Tối ưu Chuỗi cung ứng",
    leadScore: 89,
    status: "NEW",
    assignedTo: {
      id: "STAFF-01",
      name: "Nguyễn Hoàng Tuấn",
      role: "Chuyên viên Telesales",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-09 09:25:00",
    budget: "850.000.000 đ",
    timeline: [
      {
        id: "TL-106-1",
        leadId: "LD-106",
        type: "NOTE",
        title: "Đăng ký tư vấn sau buổi Webinar",
        actor: "Marketing Automation",
        timestamp: "2026-10-09 09:25:00",
        timeLabel: "Sáng nay 09:25",
        content: "Anh Nam hỏi về khả năng liên kết CRM với kho lạnh thông minh IoT.",
        sourceTag: "Gốc từ Lead #LD-106"
      }
    ]
  },
  {
    id: "LD-107",
    code: "LEAD-107",
    fullName: "Lê Quốc Bảo",
    jobTitle: "Giám đốc Điều hành (CEO)",
    companyName: "Công ty TNHH Giải pháp Phần mềm Alpha",
    email: "bao.lq@alphasoft.vn",
    phone: "0933456789",
    industry: "Sản xuất phần mềm",
    leadSource: "Website Form Tư Vấn Trực Tiếp",
    leadScore: 75,
    status: "CONTACTED",
    assignedTo: {
      id: "STAFF-03",
      name: "Lê Văn Hùng",
      role: "Chuyên viên Tư vấn",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-07 11:00:00",
    budget: "200.000.000 đ",
    timeline: [
      {
        id: "TL-107-1",
        leadId: "LD-107",
        type: "CALL",
        title: "Gọi tư vấn tính năng",
        actor: "Lê Văn Hùng (STAFF-03)",
        timestamp: "2026-10-07 14:15:00",
        timeLabel: "07/10 14:15",
        callDuration: "5 phút 10 giây",
        callStatus: "CONNECTED",
        content: "Khách hàng muốn thử nghiệm gói Starter 20 user.",
        sourceTag: "Gốc từ Lead #LD-107"
      }
    ]
  },
  {
    id: "LD-108",
    code: "LEAD-108",
    fullName: "Đặng Thị Hồng",
    jobTitle: "Trưởng phòng Kinh doanh",
    companyName: "Công ty Cổ phần Dược Phẩm Hoa Sen",
    email: "hong.dt@duochoasen.com.vn",
    phone: "0944567890",
    industry: "Dược phẩm & Y tế",
    leadSource: "Google Search Ads",
    leadScore: 82,
    status: "QUALIFIED",
    assignedTo: {
      id: "STAFF-04",
      name: "Phạm Thu Hương",
      role: "Chuyên viên Telesales",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
    },
    createdAt: "2026-10-08 09:30:00",
    budget: "350.000.000 đ",
    timeline: [
      {
        id: "TL-108-1",
        leadId: "LD-108",
        type: "NOTE",
        title: "Nhận yêu cầu báo giá chi tiết",
        actor: "Phạm Thu Hương (STAFF-04)",
        timestamp: "2026-10-08 10:00:00",
        timeLabel: "08/10 10:00",
        content: "Đã gửi email catalog sản phẩm và bảng giá theo quy mô 50 chi nhánh thuốc.",
        sourceTag: "Gốc từ Lead #LD-108"
      }
    ]
  }
];
