// =====================================================================
// SCRUM-93: ĐỘNG CƠ ĐÁNH GIÁ CƠ HỘI ĐÌNH TRỆ (STAGNANCY EVALUATION ENGINE)
// AC1: Cơ hội không hoạt động trong N ngày được gắn cờ (N theo từng giai đoạn)
// AC2: Cơ hội quá ngày dự kiến chốt mà chưa đóng cũng được gắn cờ
// =====================================================================

import { getDaysDiff } from './formatters.js';

/**
 * Đánh giá một cơ hội bán hàng dựa trên cấu hình ngưỡng N ngày và ngày hiện tại
 */
export const evaluateOpportunity = (opportunity, stageThresholds, currentDate) => {
  const stageInfo = stageThresholds[opportunity.stage] || { thresholdDays: 7, isClosed: false };
  const isClosed = Boolean(stageInfo.isClosed);

  // Nếu cơ hội đã đóng (Won hoặc Lost) thì không gắn cờ đình trệ
  if (isClosed) {
    return {
      ...opportunity,
      isClosed: true,
      hasFlag: false,
      flagType: 'NONE',
      severity: 'SAFE',
      severityLabel: 'Đã hoàn tất',
      daysSinceLastActivity: getDaysDiff(opportunity.lastActivityDate, currentDate),
      thresholdDays: 0,
      daysInactiveOverThreshold: 0,
      daysOverdue: 0,
      isCloseDateOverdue: false,
      isInactivityBreached: false,
      flagReasons: [],
      temperature: 'closed',
      recommendedAction: 'Thương vụ đã hoàn tất chu trình bán hàng.'
    };
  }

  // 1. Kiểm tra tiêu chí AC1: Không có hoạt động nào trong N ngày
  const thresholdDays = Number(stageThresholds[opportunity.stage]?.thresholdDays ?? 7);
  const daysSinceLastActivity = Math.max(0, getDaysDiff(opportunity.lastActivityDate, currentDate));
  const isInactivityBreached = daysSinceLastActivity >= thresholdDays;
  const daysInactiveOverThreshold = Math.max(0, daysSinceLastActivity - thresholdDays);

  // 2. Kiểm tra tiêu chí AC2: Quá ngày dự kiến chốt mà chưa đóng
  const isCloseDateOverdue = Boolean(opportunity.expectedCloseDate && opportunity.expectedCloseDate < currentDate);
  const daysOverdue = isCloseDateOverdue ? Math.max(0, getDaysDiff(opportunity.expectedCloseDate, currentDate)) : 0;

  // 3. Tổng hợp cờ & Phân loại
  const hasFlag = isInactivityBreached || isCloseDateOverdue;
  let flagType = 'NONE';
  let severity = 'SAFE';
  let severityLabel = 'Bình thường';
  const flagReasons = [];

  if (isInactivityBreached && isCloseDateOverdue) {
    flagType = 'DUAL';
    severity = 'CRITICAL';
    severityLabel = 'Khẩn Cấp (Cờ Kép)';
    flagReasons.push(
      `Không có hoạt động trong ${daysSinceLastActivity} ngày (vượt ngưỡng N = ${thresholdDays} ngày của giai đoạn ${stageInfo.label})`,
      `Đã quá ngày dự kiến chốt ${daysOverdue} ngày (${opportunity.expectedCloseDate}) mà chưa đóng hợp đồng`
    );
  } else if (isInactivityBreached) {
    flagType = 'INACTIVITY';
    if (daysInactiveOverThreshold >= 5) {
      severity = 'CRITICAL';
      severityLabel = 'Khẩn Cấp (Đình trệ nặng)';
    } else if (daysInactiveOverThreshold >= 2) {
      severity = 'HIGH';
      severityLabel = 'Nguy cơ cao';
    } else {
      severity = 'MEDIUM';
      severityLabel = 'Cảnh báo sớm';
    }
    flagReasons.push(
      `Không có hoạt động tương tác trong ${daysSinceLastActivity} ngày (vượt ngưỡng N = ${thresholdDays} ngày của giai đoạn ${stageInfo.label})`
    );
  } else if (isCloseDateOverdue) {
    flagType = 'OVERDUE_CLOSE';
    if (daysOverdue >= 5) {
      severity = 'CRITICAL';
      severityLabel = 'Khẩn Cấp (Trễ hạn dài)';
    } else if (daysOverdue >= 2) {
      severity = 'HIGH';
      severityLabel = 'Nguy cơ cao';
    } else {
      severity = 'MEDIUM';
      severityLabel = 'Cảnh báo trễ hạn';
    }
    flagReasons.push(
      `Đã quá ngày dự kiến chốt ${daysOverdue} ngày (${opportunity.expectedCloseDate}) nhưng hợp đồng chưa được đóng`
    );
  }

  // 4. Đo lường "Nhiệt độ thương vụ" (Deal Temperature)
  let temperature = 'warm'; // Tươi mới, tương tác tốt
  if (severity === 'CRITICAL') {
    temperature = 'frozen'; // Lạnh cóng, nguy cơ mất deal cao
  } else if (hasFlag) {
    temperature = 'cooling'; // Đang nguội dần, cần hâm nóng
  }

  // 5. Khuyến nghị can thiệp hành động dành cho Trưởng nhóm (AC3)
  let recommendedAction = 'Deal đang có tiến độ tốt, tiếp tục bám sát kế hoạch.';
  if (flagType === 'DUAL') {
    recommendedAction = '🚨 NGUY CƠ CAO MẤT DEAL: Trưởng nhóm cần gọi điện trực tiếp cho Lãnh đạo khách hàng hoặc tổ chức cuộc họp giải cứu khẩn cấp.';
  } else if (flagType === 'OVERDUE_CLOSE') {
    recommendedAction = '⚠️ QUÁ HẠN CHỐT: Yêu cầu Sales Rep làm việc lại với bên mua để xác nhận lý do trì hoãn hoặc cập nhật lại ngày chốt thực tế.';
  } else if (flagType === 'INACTIVITY') {
    if (opportunity.stage === 'PROPOSAL') {
      recommendedAction = '⚠️ BÁO GIÁ ĐÃ NGUỘI: Khách hàng im lặng sau báo giá. Cần liên hệ thẩm định lại ngân sách hoặc đưa thêm ưu đãi/chiết khấu thời hạn.';
    } else if (opportunity.stage === 'NEGOTIATION') {
      recommendedAction = '⚠️ VƯỚNG MẮC PHÁP LÝ: Giai đoạn thương thảo cần hỗ trợ pháp chế rà soát lại điều khoản hợp đồng giúp Rep tháo gỡ điểm nghẽn.';
    } else {
      recommendedAction = '⚠️ THIẾU TƯƠNG TÁC: Nhắc nhở Rep gọi điện thoại hỏi thăm tiến độ hoặc gửi thêm tài liệu giải pháp chuyên sâu.';
    }
  }

  const hasIntervention = Array.isArray(opportunity.interventions) && opportunity.interventions.length > 0;

  return {
    ...opportunity,
    isClosed: false,
    hasFlag,
    flagType,
    severity,
    severityLabel,
    daysSinceLastActivity,
    thresholdDays,
    daysInactiveOverThreshold,
    daysOverdue,
    isCloseDateOverdue,
    isInactivityBreached,
    flagReasons,
    temperature,
    recommendedAction,
    hasIntervention,
    interventionCount: opportunity.interventions?.length || 0,
    lastIntervention: hasIntervention ? opportunity.interventions[opportunity.interventions.length - 1] : null
  };
};

/**
 * Đánh giá danh sách toàn bộ cơ hội
 */
export const evaluateAllOpportunities = (opportunities, stageThresholds, currentDate) => {
  return opportunities.map(opp => evaluateOpportunity(opp, stageThresholds, currentDate));
};

/**
 * Tính toán các chỉ số Dashboard cảnh báo cơ hội đình trệ
 */
export const calculateStagnantPipelineMetrics = (evaluatedOpportunities) => {
  const totalDeals = evaluatedOpportunities.length;
  const openDeals = evaluatedOpportunities.filter(o => !o.isClosed);
  const closedDeals = evaluatedOpportunities.filter(o => o.isClosed);
  
  const flaggedDeals = openDeals.filter(o => o.hasFlag);
  const dualFlaggedDeals = openDeals.filter(o => o.flagType === 'DUAL');
  const inactivityFlaggedDeals = openDeals.filter(o => o.isInactivityBreached);
  const overdueCloseFlaggedDeals = openDeals.filter(o => o.isCloseDateOverdue);
  
  const criticalDeals = flaggedDeals.filter(o => o.severity === 'CRITICAL');
  const highRiskDeals = flaggedDeals.filter(o => o.severity === 'HIGH');
  const mediumRiskDeals = flaggedDeals.filter(o => o.severity === 'MEDIUM');

  const totalOpenPipelineValue = openDeals.reduce((sum, o) => sum + Number(o.value || 0), 0);
  const stagnantPipelineValue = flaggedDeals.reduce((sum, o) => sum + Number(o.value || 0), 0);
  const criticalPipelineValue = criticalDeals.reduce((sum, o) => sum + Number(o.value || 0), 0);

  const stagnantRate = totalOpenPipelineValue > 0 
    ? (stagnantPipelineValue / totalOpenPipelineValue) * 100 
    : 0;

  const intervenedDeals = flaggedDeals.filter(o => o.hasIntervention);
  const rescueRate = flaggedDeals.length > 0 
    ? (intervenedDeals.length / flaggedDeals.length) * 100 
    : 0;

  return {
    totalDeals,
    openDealsCount: openDeals.length,
    closedDealsCount: closedDeals.length,
    flaggedDealsCount: flaggedDeals.length,
    dualFlaggedCount: dualFlaggedDeals.length,
    inactivityFlaggedCount: inactivityFlaggedDeals.length,
    overdueCloseFlaggedCount: overdueCloseFlaggedDeals.length,
    criticalCount: criticalDeals.length,
    highRiskCount: highRiskDeals.length,
    mediumRiskCount: mediumRiskDeals.length,
    totalOpenPipelineValue,
    stagnantPipelineValue,
    criticalPipelineValue,
    stagnantRate,
    intervenedCount: intervenedDeals.length,
    unintervenedCount: flaggedDeals.length - intervenedDeals.length,
    rescueRate
  };
};
