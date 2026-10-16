/**
 * Cấu Hình Tiêu Chí Chấm Điểm Mặc Định (Lead Scoring Configuration)
 * Do Giám Đốc Kinh Doanh (Sales Director) quản lý và khai báo.
 * Đáp ứng tiêu chí 1 & tiêu chí 3 của đề bài.
 */

export const defaultScoringConfig = {
  // 1. Ngưỡng điểm phân loại Nóng / Ấm / Lạnh (Configurable Thresholds)
  thresholds: {
    hotMin: 70,    // >= 70 điểm: NÓNG (HOT) - Gọi ngay trong 30 phút
    warmMin: 40    // 40 - 69 điểm: ẤM (WARM) - Gọi trong ngày; < 40 điểm: LẠNH (COLD)
  },

  // 2. Bốn Nhóm Tiêu Chí Khai Báo Được (4 Configurable Criteria Groups)
  criteriaGroups: {
    // Tiêu chí 1: Ngành nghề phù hợp (Industry Fit)
    industry: {
      name: "Ngành nghề phù hợp",
      weight: "Trọng số chính",
      enabled: true,
      options: [
        { key: "IT_TELECOM", label: "Công nghệ thông tin & Viễn thông", points: 25 },
        { key: "FINANCE_BANKING", label: "Tài chính & Ngân hàng", points: 20 },
        { key: "MANUFACTURING", label: "Sản xuất & Công nghiệp", points: 15 },
        { key: "RETAIL_ECOMMERCE", label: "Bán lẻ & Thương mại điện tử", points: 10 },
        { key: "SERVICES_OTHER", label: "Dịch vụ & Khác", points: 5 }
      ]
    },

    // Tiêu chí 2: Quy mô doanh nghiệp (Company Size)
    companySize: {
      name: "Quy mô doanh nghiệp",
      weight: "Số lượng nhân sự",
      enabled: true,
      options: [
        { key: "ENTERPRISE", label: "Doanh nghiệp lớn (> 500 nhân sự)", points: 30 },
        { key: "UPPER_MID", label: "Doanh nghiệp vừa (100 - 500 nhân sự)", points: 20 },
        { key: "MID", label: "Doanh nghiệp nhỏ (20 - 100 nhân sự)", points: 10 },
        { key: "SMALL", label: "Siêu nhỏ (< 20 nhân sự)", points: 5 }
      ]
    },

    // Tiêu chí 3: Nguồn lead (Lead Source)
    leadSource: {
      name: "Nguồn tiếp thị (Lead Source)",
      weight: "Kênh thu hút khách",
      enabled: true,
      options: [
        { key: "HOTLINE_DEMO", label: "Hotline / Đăng ký Demo trực tiếp", points: 25 },
        { key: "EXPO_EVENT", label: "Hội thảo & Triển lãm chuyên ngành", points: 20 },
        { key: "GOOGLE_SEARCH", label: "Google Search Ads (Ý định mua cao)", points: 15 },
        { key: "FACEBOOK_EBOOK", label: "Facebook Lead Ads / Tải Ebook", points: 10 },
        { key: "ORGANIC_OTHER", label: "Website vãng lai / Khác", points: 5 }
      ]
    },

    // Tiêu chí 4: Mức độ quan tâm (Interest / Intent Level)
    interestLevel: {
      name: "Mức độ quan tâm (Intent Level)",
      weight: "Tín hiệu mua hàng",
      enabled: true,
      options: [
        { key: "URGENT", label: "Rất cao (Cần triển khai ngay trong tháng này)", points: 30 },
        { key: "EVALUATING", label: "Cao (Đang so sánh tính năng và khảo sát giá)", points: 20 },
        { key: "RESEARCHING", label: "Trung bình (Đang tìm hiểu và thu thập tài liệu)", points: 10 },
        { key: "BROWSING", label: "Thấp (Mới để lại thông tin, chưa rõ nhu cầu)", points: 0 }
      ]
    }
  }
};
