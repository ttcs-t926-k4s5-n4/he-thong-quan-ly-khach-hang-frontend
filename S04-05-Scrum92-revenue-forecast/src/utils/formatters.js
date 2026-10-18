/**
 * Format currency in Vietnamese Dong (VNĐ)
 * @param {number} amount
 * @returns {string} e.g. "150.000.000 ₫"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format currency in compact Vietnamese notation
 * @param {number} amount
 * @returns {string} e.g. "1,25 tỷ" or "350 tr"
 */
export const formatCompactCurrency = (amount) => {
  if (!amount || isNaN(amount)) return '0 ₫';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1000000000) {
    const val = abs / 1000000000;
    return `${sign}${val.toFixed(2).replace(/\.00$/, '').replace('.', ',')} tỷ ₫`;
  }
  if (abs >= 1000000) {
    const val = abs / 1000000;
    return `${sign}${val.toFixed(1).replace(/\.0$/, '').replace('.', ',')} tr ₫`;
  }
  if (abs >= 1000) {
    const val = abs / 1000;
    return `${sign}${val.toFixed(0)} k ₫`;
  }
  return `${sign}${abs} ₫`;
};

/**
 * Format percentage
 * @param {number} percent
 * @returns {string} e.g. "85.4%"
 */
export const formatPercent = (percent) => {
  if (percent === undefined || percent === null || isNaN(percent)) return '0%';
  return `${percent.toFixed(1)}%`;
};

/**
 * Format ISO date string into DD/MM/YYYY
 * @param {string} dateString
 * @returns {string} e.g. "25/10/2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
};

/**
 * Reference date simulation is October 2026 (Month 10 / Q4)
 */
export const CURRENT_REFERENCE_DATE = {
  year: 2026,
  month: 10, // Tháng 10
  quarter: 4 // Quý 4
};

/**
 * Determine period for an opportunity date
 * @param {string} dateString YYYY-MM-DD
 * @returns {'THIS_MONTH' | 'NEXT_MONTH' | 'THIS_QUARTER' | 'OTHER'}
 */
export const getPeriodType = (dateString) => {
  if (!dateString) return 'OTHER';
  const parts = dateString.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);

  if (y === CURRENT_REFERENCE_DATE.year) {
    if (m === 10) return 'THIS_MONTH';
    if (m === 11) return 'NEXT_MONTH';
    if (m === 12) return 'THIS_QUARTER'; // Belonging to Q4
  }
  return 'OTHER';
};
