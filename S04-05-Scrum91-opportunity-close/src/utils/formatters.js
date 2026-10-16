/**
 * Format số tiền sang định dạng tiền tệ Việt Nam Đồng (VNĐ)
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(amount));
};

/**
 * Format ngày tháng yyyy-mm-dd sang dd/mm/yyyy
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
};

/**
 * Format phần trăm
 * @param {number} value 
 * @returns {string}
 */
export const formatPercent = (value) => {
  if (value === undefined || value === null || isNaN(Number(value))) return '0%';
  return `${Math.round(Number(value))}%`;
};

/**
 * Tính toán số liệu KPI doanh số người sở hữu theo Tiêu chí 4 (AC4)
 * "Cơ hội thắng được tính vào chỉ tiêu của người sở hữu"
 */
export const calculateUserKpis = (opportunities, users) => {
  return users.map((user) => {
    // Lọc các cơ hội thuộc sở hữu của user này và có stage là CLOSED_WON
    const wonOpportunities = opportunities.filter(
      (opp) => opp.ownerId === user.id && opp.stage === 'CLOSED_WON'
    );

    // Tính tổng giá trị chốt thực tế (actualValue)
    const actualRevenue = wonOpportunities.reduce((sum, opp) => {
      const val = opp.closedData?.actualValue || opp.expectedValue || 0;
      return sum + Number(val);
    }, 0);

    const lostOpportunities = opportunities.filter(
      (opp) => opp.ownerId === user.id && opp.stage === 'CLOSED_LOST'
    );

    const openOpportunities = opportunities.filter(
      (opp) => opp.ownerId === user.id && opp.stage !== 'CLOSED_WON' && opp.stage !== 'CLOSED_LOST'
    );

    const pipelineValue = openOpportunities.reduce((sum, opp) => sum + (opp.expectedValue || 0), 0);

    const quota = user.quota || 0;
    const progressPercent = quota > 0 ? (actualRevenue / quota) * 100 : 0;
    const remainingAmount = Math.max(0, quota - actualRevenue);
    const isQuotaMet = actualRevenue >= quota;

    return {
      ...user,
      actualRevenue,
      wonCount: wonOpportunities.length,
      lostCount: lostOpportunities.length,
      openCount: openOpportunities.length,
      pipelineValue,
      progressPercent,
      remainingAmount,
      isQuotaMet
    };
  });
};

/**
 * Tính toán số liệu phân tích tổng quan toàn công ty
 */
export const calculateCompanyStats = (opportunities) => {
  const total = opportunities.length;
  const won = opportunities.filter((o) => o.stage === 'CLOSED_WON');
  const lost = opportunities.filter((o) => o.stage === 'CLOSED_LOST');
  const open = opportunities.filter((o) => o.stage !== 'CLOSED_WON' && o.stage !== 'CLOSED_LOST');

  const totalWonRevenue = won.reduce((sum, o) => sum + (o.closedData?.actualValue || o.expectedValue || 0), 0);
  const totalPipeline = open.reduce((sum, o) => sum + (o.expectedValue || 0), 0);
  
  const closedCount = won.length + lost.length;
  const winRate = closedCount > 0 ? (won.length / closedCount) * 100 : 0;

  return {
    total,
    openCount: open.length,
    wonCount: won.length,
    lostCount: lost.length,
    totalWonRevenue,
    totalPipeline,
    winRate: Math.round(winRate)
  };
};
