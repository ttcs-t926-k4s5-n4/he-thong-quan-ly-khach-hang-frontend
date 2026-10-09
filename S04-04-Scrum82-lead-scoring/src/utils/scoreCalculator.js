/**
 * Module Thuật Toán Chấm Điểm & Phân Loại Lead Tự Động (Lead Scoring & Classification Engine)
 * Đáp ứng các tiêu chí của Giám Đốc Kinh Doanh:
 * 1. Chấm điểm theo 4 nhóm tiêu chí khai báo được
 * 2. Tự động tính lại khi thông tin thay đổi
 * 3. Phân loại Nóng, Ấm, Lạnh theo ngưỡng điểm khai báo
 * 4. Sắp xếp thứ tự ưu tiên cuộc gọi, không tự động loại bỏ lead
 */

/**
 * Tính toán chi tiết điểm số của một Lead theo cấu hình hiện tại
 */
export function calculateLeadScore(lead, config) {
  if (!lead || !config) {
    return {
      totalScore: 0,
      classification: "COLD",
      breakdown: []
    };
  }

  const { thresholds, criteriaGroups } = config;
  const breakdown = [];
  let totalScore = 0;

  // 1. Tiêu chí: Ngành nghề phù hợp (Industry)
  if (criteriaGroups.industry?.enabled) {
    const opt = criteriaGroups.industry.options.find(o => o.key === lead.industry);
    const pts = opt ? opt.points : 0;
    totalScore += pts;
    breakdown.push({
      criteriaKey: "industry",
      criteriaName: criteriaGroups.industry.name,
      selectedLabel: opt ? opt.label : "Chưa xác định",
      pointsEarned: pts,
      maxPossiblePoints: Math.max(...criteriaGroups.industry.options.map(o => o.points))
    });
  }

  // 2. Tiêu chí: Quy mô doanh nghiệp (Company Size)
  if (criteriaGroups.companySize?.enabled) {
    const opt = criteriaGroups.companySize.options.find(o => o.key === lead.companySize);
    const pts = opt ? opt.points : 0;
    totalScore += pts;
    breakdown.push({
      criteriaKey: "companySize",
      criteriaName: criteriaGroups.companySize.name,
      selectedLabel: opt ? opt.label : "Chưa xác định",
      pointsEarned: pts,
      maxPossiblePoints: Math.max(...criteriaGroups.companySize.options.map(o => o.points))
    });
  }

  // 3. Tiêu chí: Nguồn lead (Lead Source)
  if (criteriaGroups.leadSource?.enabled) {
    const opt = criteriaGroups.leadSource.options.find(o => o.key === lead.leadSource);
    const pts = opt ? opt.points : 0;
    totalScore += pts;
    breakdown.push({
      criteriaKey: "leadSource",
      criteriaName: criteriaGroups.leadSource.name,
      selectedLabel: opt ? opt.label : "Chưa xác định",
      pointsEarned: pts,
      maxPossiblePoints: Math.max(...criteriaGroups.leadSource.options.map(o => o.points))
    });
  }

  // 4. Tiêu chí: Mức độ quan tâm (Interest Level)
  if (criteriaGroups.interestLevel?.enabled) {
    const opt = criteriaGroups.interestLevel.options.find(o => o.key === lead.interestLevel);
    const pts = opt ? opt.points : 0;
    totalScore += pts;
    breakdown.push({
      criteriaKey: "interestLevel",
      criteriaName: criteriaGroups.interestLevel.name,
      selectedLabel: opt ? opt.label : "Chưa xác định",
      pointsEarned: pts,
      maxPossiblePoints: Math.max(...criteriaGroups.interestLevel.options.map(o => o.points))
    });
  }

  // Phân loại Nóng, Ấm, Lạnh dựa theo ngưỡng điểm khai báo
  let classification = "COLD";
  let priorityRank = 3;
  let slaRecommendation = "Nuôi dưỡng qua Email tự động, gọi trong vòng 24-48 giờ";
  let badgeColor = "blue";

  if (totalScore >= thresholds.hotMin) {
    classification = "HOT";
    priorityRank = 1;
    slaRecommendation = "Ưu tiên số 1: Gọi ngay trong vòng 15 - 30 phút! Tỷ lệ chốt cao.";
    badgeColor = "red";
  } else if (totalScore >= thresholds.warmMin) {
    classification = "WARM";
    priorityRank = 2;
    slaRecommendation = "Ưu tiên số 2: Gọi trong ngày làm việc, gửi trước tài liệu demo.";
    badgeColor = "amber";
  }

  return {
    totalScore,
    classification,
    priorityRank,
    slaRecommendation,
    badgeColor,
    breakdown
  };
}

/**
 * Xử lý tính điểm và sắp xếp thứ tự ưu tiên cuộc gọi cho toàn bộ danh sách Leads
 * TIÊU CHÍ 4: Điểm chỉ để sắp xếp ưu tiên, không tự động loại bất kỳ Lead nào!
 */
export function scoreAndRankAllLeads(leads = [], config) {
  const scoredLeads = leads.map(lead => {
    const scoreResult = calculateLeadScore(lead, config);
    return {
      ...lead,
      scoreResult
    };
  });

  // Mặc định sắp xếp: Điểm cao nhất lên đầu (Hot -> Warm -> Cold)
  return scoredLeads.sort((a, b) => b.scoreResult.totalScore - a.scoreResult.totalScore);
}
