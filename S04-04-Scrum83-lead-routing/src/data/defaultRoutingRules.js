/**
 * Cấu Hình Danh Sách Quy Tắc Phân Bổ Lead Tự Động (Lead Routing Rules)
 * Do Giám Đốc Kinh Doanh thiết lập theo thứ tự ưu tiên (Priority Order).
 * Đáp ứng Tiêu chí 1 & Tiêu chí 2:
 * 1. Phân bổ theo khu vực, ngành nghề, hoặc xoay vòng đều
 * 2. Nhiều quy tắc xếp theo thứ tự ưu tiên, quy tắc đầu tiên khớp sẽ thắng (First-Match-Wins)
 */

export const defaultRoutingRules = [
  {
    id: "RULE-01",
    priority: 1,
    name: "Quy tắc 1: Khách hàng Trọng điểm Ngành Công Nghệ & Tài Chính",
    mode: "INDUSTRY", // Phân bổ theo ngành nghề
    description: "Tất cả Lead thuộc ngành CNTT hoặc Tài chính - Ngân hàng được chuyển thẳng cho Đội Enterprise VIP.",
    enabled: true,
    condition: {
      field: "industry",
      operator: "IN",
      values: ["IT_TELECOM", "FINANCE_BANKING"]
    },
    action: {
      type: "ASSIGN_TEAM_ROUND_ROBIN",
      teamId: "TEAM_ENTERPRISE",
      targetName: "Nhóm Khách Hàng Doanh Nghiệp Lớn (Enterprise VIP)"
    }
  },
  {
    id: "RULE-02",
    priority: 2,
    name: "Quy tắc 2: Phân bổ Địa bàn Miền Bắc",
    mode: "REGION", // Phân bổ theo khu vực
    description: "Lead có địa chỉ tại Miền Bắc (Hà Nội, Hải Phòng, Quảng Ninh...) tự động giao cho Nhóm Miền Bắc.",
    enabled: true,
    condition: {
      field: "region",
      operator: "EQUALS",
      values: ["NORTH"]
    },
    action: {
      type: "ASSIGN_TEAM_ROUND_ROBIN",
      teamId: "TEAM_NORTH",
      targetName: "Nhóm Kinh Doanh Miền Bắc"
    }
  },
  {
    id: "RULE-03",
    priority: 3,
    name: "Quy tắc 3: Phân bổ Địa bàn Miền Nam",
    mode: "REGION", // Phân bổ theo khu vực
    description: "Lead có địa chỉ tại Miền Nam (TP.HCM, Bình Dương, Đồng Nai...) tự động giao cho Nhóm Miền Nam.",
    enabled: true,
    condition: {
      field: "region",
      operator: "EQUALS",
      values: ["SOUTH"]
    },
    action: {
      type: "ASSIGN_TEAM_ROUND_ROBIN",
      teamId: "TEAM_SOUTH",
      targetName: "Nhóm Kinh Doanh Miền Nam"
    }
  },
  {
    id: "RULE-04",
    priority: 4,
    name: "Quy tắc 4: Xoay Vòng Đều Toàn Công Ty (Global Round-Robin)",
    mode: "ROUND_ROBIN", // Xoay vòng đều
    description: "Các Lead còn lại trong các ngành Bán lẻ & Dịch vụ được xoay vòng chia đều cho tất cả nhân viên.",
    enabled: true,
    condition: {
      field: "industry",
      operator: "IN",
      values: ["RETAIL_ECOMMERCE", "SERVICES_OTHER"]
    },
    action: {
      type: "GLOBAL_ROUND_ROBIN",
      targetName: "Xoay Vòng Đều Toàn Công Ty (Round-Robin)"
    }
  }
];
