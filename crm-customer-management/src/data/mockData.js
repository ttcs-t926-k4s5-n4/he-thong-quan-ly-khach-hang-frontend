export const initialCustomers = [
  {
    id: 1,
    companyName: "Công ty TNHH Công nghệ ABC",
    taxCode: "0101234567",
    industry: "Công nghệ thông tin",
    scale: "51 - 200 nhân viên",
    website: "https://abc.com.vn",
    address: "Tầng 5, 123 Cầu Giấy, Hà Nội",
    owner: "Nguyễn Văn Nam",
    status: "Khách hàng",
    totalSignedValue: 850000000,
    openOpportunityValue: 250000000,
    contacts: [
      {
        id: 101,
        name: "Nguyễn Minh Anh",
        position: "Giám đốc",
        email: "anh.nguyen@abc.com.vn",
        phone: "0901234567",
        role: "người quyết định",
        isPrimary: true,
      },
      {
        id: 102,
        name: "Trần Văn Bình",
        position: "Trưởng phòng IT",
        email: "binh.tran@abc.com.vn",
        phone: "0912345678",
        role: "người ảnh hưởng",
        isPrimary: false,
      },
    ],
    opportunities: [
      {
        id: 1001,
        name: "Triển khai hệ thống CRM",
        value: 250000000,
        status: "Đang mở",
      },
    ],
    activities: [
      {
        id: 2001,
        type: "meeting",
        title: "Gặp khách hàng",
        description: "Trao đổi nhu cầu triển khai CRM.",
        date: "2026-10-01",
      },
      {
        id: 2002,
        type: "call",
        title: "Gọi điện",
        description: "Trao đổi về báo giá.",
        date: "2026-09-28",
      },
    ],
    attachments: [
      {
        id: 3001,
        name: "Hop_dong_ABC.pdf",
        size: "2.4 MB",
      },
    ],
  },

  {
    id: 2,
    companyName: "Công ty Cổ phần Thương mại Minh Phát",
    taxCode: "0102345678",
    industry: "Thương mại",
    scale: "201 - 500 nhân viên",
    website: "https://minhphat.vn",
    address: "45 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    owner: "Trần Minh Anh",
    status: "Đang giao dịch",
    totalSignedValue: 420000000,
    openOpportunityValue: 380000000,
    contacts: [
      {
        id: 103,
        name: "Lê Quốc Huy",
        position: "Phó Tổng giám đốc",
        email: "huy.le@minhphat.vn",
        phone: "0987654321",
        role: "người quyết định",
        isPrimary: true,
      },
    ],
    opportunities: [
      {
        id: 1002,
        name: "Hệ thống quản lý bán hàng",
        value: 380000000,
        status: "Đang mở",
      },
    ],
    activities: [
      {
        id: 2003,
        type: "email",
        title: "Gửi báo giá",
        description: "Đã gửi báo giá phiên bản mới.",
        date: "2026-10-03",
      },
    ],
    attachments: [],
  },

  {
    id: 3,
    companyName: "Công ty TNHH Sản xuất Đông Á",
    taxCode: "0103456789",
    industry: "Sản xuất",
    scale: "Trên 500 nhân viên",
    website: "https://donga.vn",
    address: "Khu công nghiệp Thăng Long, Hà Nội",
    owner: "Lê Hoàng Long",
    status: "Tiềm năng",
    totalSignedValue: 0,
    openOpportunityValue: 650000000,
    contacts: [
      {
        id: 104,
        name: "Phạm Đức Thành",
        position: "Giám đốc IT",
        email: "thanh.pham@donga.vn",
        phone: "0978123456",
        role: "người ảnh hưởng",
        isPrimary: true,
      },
    ],
    opportunities: [
      {
        id: 1003,
        name: "Phần mềm quản lý doanh nghiệp",
        value: 650000000,
        status: "Đang mở",
      },
    ],
    activities: [
      {
        id: 2004,
        type: "meeting",
        title: "Demo sản phẩm",
        description: "Demo giải pháp quản lý doanh nghiệp.",
        date: "2026-10-04",
      },
    ],
    attachments: [],
  },

  {
    id: 4,
    companyName: "Công ty Cổ phần Tài chính Việt Nam",
    taxCode: "0104567890",
    industry: "Tài chính - Ngân hàng",
    scale: "201 - 500 nhân viên",
    website: "https://taichinhviet.vn",
    address: "88 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
    owner: "Phạm Thu Hà",
    status: "Ngừng hợp tác",
    totalSignedValue: 120000000,
    openOpportunityValue: 0,
    contacts: [
      {
        id: 105,
        name: "Nguyễn Hoàng Nam",
        position: "Trưởng phòng kinh doanh",
        email: "nam.nguyen@taichinhviet.vn",
        phone: "0968123456",
        role: "người dùng cuối",
        isPrimary: true,
      },
    ],
    opportunities: [],
    activities: [
      {
        id: 2005,
        type: "call",
        title: "Trao đổi hợp tác",
        description: "Khách hàng tạm dừng hợp tác.",
        date: "2026-08-20",
      },
    ],
    attachments: [],
  },

  {
    id: 5,
    companyName: "Công ty TNHH Dịch vụ Sao Việt",
    taxCode: "0105678901",
    industry: "Dịch vụ",
    scale: "11 - 50 nhân viên",
    website: "https://saoviet.vn",
    address: "12 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    owner: "Nguyễn Văn Nam",
    status: "Tiềm năng",
    totalSignedValue: 0,
    openOpportunityValue: 180000000,
    contacts: [
      {
        id: 106,
        name: "Vũ Thanh Tùng",
        position: "Giám đốc",
        email: "tung.vu@saoviet.vn",
        phone: "0908765432",
        role: "người quyết định",
        isPrimary: true,
      },
    ],
    opportunities: [
      {
        id: 1004,
        name: "CRM cho doanh nghiệp",
        value: 180000000,
        status: "Đang mở",
      },
    ],
    activities: [],
    attachments: [],
  },
];

export const owners = [
  "Nguyễn Văn Nam",
  "Trần Minh Anh",
  "Lê Hoàng Long",
  "Phạm Thu Hà",
];

export const customerStatuses = [
  "Tiềm năng",
  "Đang giao dịch",
  "Khách hàng",
  "Ngừng hợp tác",
];