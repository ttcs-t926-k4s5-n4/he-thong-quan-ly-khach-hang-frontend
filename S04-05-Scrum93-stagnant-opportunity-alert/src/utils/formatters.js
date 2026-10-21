// =====================================================================
// SCRUM-93: Các tiện ích định dạng tiền tệ VNĐ, ngày tháng và hiển thị
// =====================================================================

export const formatVND = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCompactVND = (amount) => {
  if (!amount || isNaN(amount)) return '0 ₫';
  if (amount >= 1000000000) {
    const val = (amount / 1000000000).toFixed(2);
    return `${val.replace(/\.?0+$/, '')} Tỷ ₫`;
  }
  if (amount >= 1000000) {
    const val = (amount / 1000000).toFixed(0);
    return `${val} Tr ₫`;
  }
  return formatVND(amount);
};

export const formatDateVN = (dateInput) => {
  if (!dateInput) return '---';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTimeVN = (dateTimeInput) => {
  if (!dateTimeInput) return '---';
  const d = new Date(dateTimeInput);
  if (isNaN(d.getTime())) return String(dateTimeInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const getDaysDiff = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return 0;
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const formatPercent = (value, decimals = 1) => {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};
