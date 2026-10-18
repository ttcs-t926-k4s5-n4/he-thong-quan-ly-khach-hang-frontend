// =====================================================================
// SCRUM-94: Utilities - Định dạng tiền tệ VNĐ, thời gian & nhãn
// =====================================================================

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCompactCurrency = (amount) => {
  if (!amount || isNaN(amount)) return '0 ₫';
  if (amount >= 1000000000) {
    const b = (amount / 1000000000).toFixed(2);
    return `${b} tỷ ₫`;
  }
  if (amount >= 1000000) {
    const m = (amount / 1000000).toFixed(0);
    return `${m} triệu ₫`;
  }
  return formatCurrency(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '---';
  try {
    const d = new Date(dateTimeStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dateTimeStr;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  } catch {
    return dateTimeStr;
  }
};

export const getDaysAgoText = (dateStr, currentDateStr = '2026-10-18') => {
  if (!dateStr) return '';
  const d1 = new Date(dateStr);
  const d2 = new Date(currentDateStr);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  return `${diffDays} ngày trước`;
};
