// Utility formatters for Currency, Percentages, and Calculations

export const formatVND = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
};

// Calculate gross margin %: ((Price - Cost) / Price) * 100
export const calculateMargin = (price, cost) => {
  if (!price || price <= 0) return 0;
  if (cost === undefined || cost === null) return 0;
  return ((price - cost) / price) * 100;
};

// Calculate discount %: ((Listed - Actual) / Listed) * 100
export const calculateDiscount = (listedPrice, actualPrice) => {
  if (!listedPrice || listedPrice <= 0) return 0;
  if (actualPrice >= listedPrice) return 0;
  return ((listedPrice - actualPrice) / listedPrice) * 100;
};
