import { OPPORTUNITY_STAGES } from '../data/mockStages';
import { SALES_TEAMS, MOCK_USERS } from '../data/mockUsers';
import { getPeriodType, formatCompactCurrency, formatPercent } from './formatters';

/**
 * Filter opportunities by period:
 * - 'THIS_MONTH': month 10/2026
 * - 'NEXT_MONTH': month 11/2026
 * - 'THIS_QUARTER': month 10, 11, 12 of 2026 (Q4)
 * - 'ALL': all opportunities
 */
export const filterOpportunitiesByPeriod = (opportunities, periodFilter) => {
  return opportunities.filter((opp) => {
    const period = getPeriodType(opp.expectedCloseDate);
    if (periodFilter === 'THIS_MONTH') {
      return period === 'THIS_MONTH';
    }
    if (periodFilter === 'NEXT_MONTH') {
      return period === 'NEXT_MONTH';
    }
    if (periodFilter === 'THIS_QUARTER') {
      return period === 'THIS_MONTH' || period === 'NEXT_MONTH' || period === 'THIS_QUARTER';
    }
    return true; // ALL
  });
};

/**
 * Calculate single opportunity weighted value
 * Formula: Value * (Probability / 100)
 */
export const calculateOpportunityWeightedValue = (opp, stageConfig = OPPORTUNITY_STAGES) => {
  if (opp.stage === 'CLOSED_WON') {
    return opp.actualWonValue !== null && opp.actualWonValue !== undefined 
      ? opp.actualWonValue 
      : opp.expectedValue;
  }
  if (opp.stage === 'CLOSED_LOST') {
    return 0;
  }
  const prob = opp.probability !== undefined && opp.probability !== null
    ? opp.probability
    : (stageConfig[opp.stage]?.defaultProbability ?? 50);

  return Math.round(opp.expectedValue * (prob / 100));
};

/**
 * Calculate full summary stats for a given slice of opportunities, period, team, rep
 */
export const calculateForecastStats = ({
  opportunities,
  periodFilter = 'THIS_MONTH',
  teamFilter = 'ALL',
  repFilter = 'ALL',
  stageConfig = OPPORTUNITY_STAGES
}) => {
  // 1. Filter opportunities by period
  let periodOpps = filterOpportunitiesByPeriod(opportunities, periodFilter);

  // 2. Filter by team
  if (teamFilter !== 'ALL') {
    periodOpps = periodOpps.filter((o) => o.teamId === teamFilter);
  }

  // 3. Filter by rep
  if (repFilter !== 'ALL') {
    periodOpps = periodOpps.filter((o) => o.ownerId === repFilter);
  }

  // 4. Determine Target Quota for this scope & period
  let targetQuota = 0;
  const isQuarter = periodFilter === 'THIS_QUARTER';

  if (repFilter !== 'ALL') {
    const user = MOCK_USERS.find((u) => u.id === repFilter);
    if (user) {
      targetQuota = isQuarter ? user.quarterlyQuota : user.monthlyQuota;
    }
  } else if (teamFilter !== 'ALL') {
    const team = SALES_TEAMS.find((t) => t.id === teamFilter);
    if (team) {
      targetQuota = isQuarter ? team.quarterlyQuota : team.monthlyQuota;
    }
  } else {
    // All company (Sales Director total quota)
    const director = MOCK_USERS.find((u) => u.role === 'SALES_DIRECTOR');
    if (director) {
      targetQuota = isQuarter ? director.quarterlyQuota : director.monthlyQuota;
    } else {
      targetQuota = SALES_TEAMS.reduce(
        (sum, t) => sum + (isQuarter ? t.quarterlyQuota : t.monthlyQuota),
        0
      );
    }
  }

  // 5. Aggregate calculations
  let actualClosedWon = 0;
  let weightedForecast = 0;
  let unweightedPipeline = 0;
  let wonCount = 0;
  let openCount = 0;
  let lostCount = 0;

  // Breakdown by Commit categories
  let commitValue = 0;
  let mostLikelyValue = 0;
  let pipelineOnlyValue = 0;

  periodOpps.forEach((opp) => {
    if (opp.stage === 'CLOSED_WON') {
      const wonVal = opp.actualWonValue !== null && opp.actualWonValue !== undefined 
        ? opp.actualWonValue 
        : opp.expectedValue;
      actualClosedWon += wonVal;
      wonCount++;
    } else if (opp.stage === 'CLOSED_LOST') {
      lostCount++;
    } else {
      // Open deal
      openCount++;
      unweightedPipeline += opp.expectedValue;
      const weighted = calculateOpportunityWeightedValue(opp, stageConfig);
      weightedForecast += weighted;

      if (opp.probability >= 80) {
        commitValue += weighted;
      } else if (opp.probability >= 60) {
        mostLikelyValue += weighted;
      } else {
        pipelineOnlyValue += weighted;
      }
    }
  });

  // Total projected revenue = Actual Won + Weighted Forecast
  const totalProjectedRevenue = actualClosedWon + weightedForecast;

  // Gap to target
  // positive: còn thiếu (shortfall)
  // negative: vượt chỉ tiêu (surplus)
  const gapToTarget = targetQuota - totalProjectedRevenue;

  // Attainment percentages
  const projectedAttainmentRate = targetQuota > 0 ? (totalProjectedRevenue / targetQuota) * 100 : 0;
  const actualAttainmentRate = targetQuota > 0 ? (actualClosedWon / targetQuota) * 100 : 0;

  // Scenarios
  const worstCase = actualClosedWon; // Chỉ những gì chắc chắn trong tay
  const mostLikely = totalProjectedRevenue; // Đã chốt + Dự báo trọng số
  const bestCase = actualClosedWon + unweightedPipeline; // Toàn bộ pipeline thắng 100%

  return {
    targetQuota,
    actualClosedWon,
    weightedForecast,
    totalProjectedRevenue,
    unweightedPipeline,
    gapToTarget,
    projectedAttainmentRate,
    actualAttainmentRate,
    wonCount,
    openCount,
    lostCount,
    totalDealsCount: periodOpps.length,
    filteredOpportunities: periodOpps,
    scenarios: {
      worstCase,
      mostLikely,
      bestCase
    },
    forecastCategories: {
      closedWon: actualClosedWon,
      commit: commitValue,
      mostLikely: mostLikelyValue,
      pipeline: pipelineOnlyValue
    }
  };
};

/**
 * Breakdown comparison by Teams
 */
export const calculateTeamBreakdown = (opportunities, periodFilter, stageConfig = OPPORTUNITY_STAGES) => {
  const periodOpps = filterOpportunitiesByPeriod(opportunities, periodFilter);
  const isQuarter = periodFilter === 'THIS_QUARTER';

  return SALES_TEAMS.map((team) => {
    const teamOpps = periodOpps.filter((o) => o.teamId === team.id);
    const quota = isQuarter ? team.quarterlyQuota : team.monthlyQuota;

    let actualWon = 0;
    let weighted = 0;
    let unweighted = 0;
    let openCount = 0;
    let wonCount = 0;

    teamOpps.forEach((opp) => {
      if (opp.stage === 'CLOSED_WON') {
        actualWon += (opp.actualWonValue ?? opp.expectedValue);
        wonCount++;
      } else if (opp.stage !== 'CLOSED_LOST') {
        openCount++;
        unweighted += opp.expectedValue;
        weighted += calculateOpportunityWeightedValue(opp, stageConfig);
      }
    });

    const totalProjected = actualWon + weighted;
    const attainment = quota > 0 ? (totalProjected / quota) * 100 : 0;
    const gap = quota - totalProjected;

    return {
      teamId: team.id,
      teamName: team.name,
      leadName: team.leadName,
      color: team.color,
      quota,
      actualWon,
      weighted,
      totalProjected,
      unweighted,
      attainment,
      gap,
      dealCount: teamOpps.length,
      openCount,
      wonCount
    };
  });
};

/**
 * Breakdown comparison by Sales Reps (Individual Employees)
 */
export const calculateRepBreakdown = (
  opportunities,
  periodFilter,
  teamFilter = 'ALL',
  stageConfig = OPPORTUNITY_STAGES
) => {
  const periodOpps = filterOpportunitiesByPeriod(opportunities, periodFilter);
  const isQuarter = periodFilter === 'THIS_QUARTER';

  let reps = MOCK_USERS.filter((u) => u.role === 'SALES_REP');
  if (teamFilter !== 'ALL') {
    reps = reps.filter((u) => u.teamId === teamFilter);
  }

  return reps.map((rep) => {
    const repOpps = periodOpps.filter((o) => o.ownerId === rep.id);
    const quota = isQuarter ? rep.quarterlyQuota : rep.monthlyQuota;

    let actualWon = 0;
    let weighted = 0;
    let unweighted = 0;
    let openCount = 0;
    let wonCount = 0;

    repOpps.forEach((opp) => {
      if (opp.stage === 'CLOSED_WON') {
        actualWon += (opp.actualWonValue ?? opp.expectedValue);
        wonCount++;
      } else if (opp.stage !== 'CLOSED_LOST') {
        openCount++;
        unweighted += opp.expectedValue;
        weighted += calculateOpportunityWeightedValue(opp, stageConfig);
      }
    });

    const totalProjected = actualWon + weighted;
    const attainment = quota > 0 ? (totalProjected / quota) * 100 : 0;
    const gap = quota - totalProjected;

    return {
      repId: rep.id,
      name: rep.name,
      avatar: rep.avatar,
      roleTitle: rep.roleTitle,
      teamId: rep.teamId,
      teamName: rep.teamName,
      quota,
      actualWon,
      weighted,
      totalProjected,
      unweighted,
      attainment,
      gap,
      dealCount: repOpps.length,
      openCount,
      wonCount
    };
  }).sort((a, b) => b.totalProjected - a.totalProjected);
};

/**
 * Breakdown by Stage
 */
export const calculateStageBreakdown = (
  opportunities,
  periodFilter,
  teamFilter = 'ALL',
  repFilter = 'ALL',
  stageConfig = OPPORTUNITY_STAGES
) => {
  let opps = filterOpportunitiesByPeriod(opportunities, periodFilter);
  if (teamFilter !== 'ALL') opps = opps.filter((o) => o.teamId === teamFilter);
  if (repFilter !== 'ALL') opps = opps.filter((o) => o.ownerId === repFilter);

  return Object.values(stageConfig).map((stage) => {
    const stageOpps = opps.filter((o) => o.stage === stage.id);
    let totalValue = 0;
    let totalWeighted = 0;

    stageOpps.forEach((opp) => {
      const val = opp.stage === 'CLOSED_WON' 
        ? (opp.actualWonValue ?? opp.expectedValue)
        : opp.expectedValue;
      totalValue += val;
      totalWeighted += calculateOpportunityWeightedValue(opp, stageConfig);
    });

    return {
      stageId: stage.id,
      label: stage.label,
      probability: stage.defaultProbability,
      color: stage.color,
      badgeClass: stage.badgeClass,
      count: stageOpps.length,
      totalValue,
      totalWeighted
    };
  });
};

/**
 * Generate Smart Executive Answers for Sales Director
 * Answering directly: "Tháng này về bao nhiêu bằng số liệu?"
 */
export const generateExecutiveAnswer = (stats, periodLabel = 'tháng này') => {
  const {
    targetQuota,
    actualClosedWon,
    weightedForecast,
    totalProjectedRevenue,
    gapToTarget,
    projectedAttainmentRate,
    openCount,
    wonCount
  } = stats;

  const isExceeded = gapToTarget <= 0;
  const gapAbsFormatted = formatCompactCurrency(Math.abs(gapToTarget));
  const projectedFormatted = formatCompactCurrency(totalProjectedRevenue);
  const wonFormatted = formatCompactCurrency(actualClosedWon);
  const weightedFormatted = formatCompactCurrency(weightedForecast);
  const quotaFormatted = formatCompactCurrency(targetQuota);
  const rateFormatted = formatPercent(projectedAttainmentRate);

  let statusSentence = '';
  let adviceSentence = '';

  if (isExceeded) {
    statusSentence = `Dự kiến ${periodLabel} doanh số toàn đội ngũ sẽ đạt ${projectedFormatted}, vượt chỉ tiêu ${gapAbsFormatted} (tương đương ${rateFormatted} KPI).`;
    adviceSentence = `Số đã ký thực tế là ${wonFormatted} (${wonCount} hợp đồng). Dự báo thu thêm ${weightedFormatted} từ ${openCount} cơ hội đang mở. Bạn đang có vùng đệm an toàn rất tốt để chốt sớm các hợp đồng quý tới.`;
  } else {
    statusSentence = `Dự kiến ${periodLabel} doanh số sẽ về khoảng ${projectedFormatted}, đạt ${rateFormatted} so với chỉ tiêu ${quotaFormatted}. Còn thiếu ${gapAbsFormatted} để cán đích 100%.`;
    adviceSentence = `Hiện đã chắc chắn ${wonFormatted} trong tay (${wonCount} hợp đồng đã ký). Cần tập trung thúc đẩy ${openCount} cơ hội ở giai đoạn Thương thảo (80%) và Đề xuất (60%) có tổng trọng số ${weightedFormatted} để lấp đầy khoảng cách còn thiếu.`;
  }

  return {
    headline: `Dự báo ${periodLabel}: Về khoảng ${projectedFormatted} (${rateFormatted} chỉ tiêu)`,
    statusSentence,
    adviceSentence,
    confidenceBadge: projectedAttainmentRate >= 90 ? 'Khả quan cao (High Confidence)' : 'Cần tăng tốc chốt deal (Attention Needed)'
  };
};
