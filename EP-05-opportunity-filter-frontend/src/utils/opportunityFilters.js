export const EMPTY_FILTERS = Object.freeze({
  search: '',
  stage: '',
  minValue: '',
  maxValue: '',
  closeFrom: '',
  closeTo: '',
  product: '',
  owner: '',
});

export const FILTER_STORAGE_KEY = 'northstar-opportunity-saved-filters-v1';

export function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim();
}

export function hasActiveFilters(filters) {
  return Object.entries(filters ?? EMPTY_FILTERS).some(([key, value]) => String(value ?? '').trim() !== '' && key in EMPTY_FILTERS);
}

export function filterOpportunities(opportunities, filters = EMPTY_FILTERS) {
  const search = normalizeText(filters.search);
  const min = filters.minValue === '' || filters.minValue == null ? null : Number(filters.minValue);
  const max = filters.maxValue === '' || filters.maxValue == null ? null : Number(filters.maxValue);

  return opportunities.filter((item) => {
    const searchable = normalizeText([item.id, item.name, item.company, item.owner, item.product, item.stage].join(' '));
    if (search && !searchable.includes(search)) return false;
    if (filters.stage && item.stage !== filters.stage) return false;
    if (min !== null && Number.isFinite(min) && item.value < min) return false;
    if (max !== null && Number.isFinite(max) && item.value > max) return false;
    if (filters.closeFrom && item.closeDate < filters.closeFrom) return false;
    if (filters.closeTo && item.closeDate > filters.closeTo) return false;
    if (filters.product && item.product !== filters.product) return false;
    if (filters.owner && item.owner !== filters.owner) return false;
    return true;
  });
}

export function sortOpportunities(items, sortKey = 'closeDate', sortDirection = 'asc') {
  const sign = sortDirection === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign;
    return String(av ?? '').localeCompare(String(bv ?? ''), 'vi', { numeric: true }) * sign;
  });
}

export function validateFilters(filters) {
  const errors = {};
  if (filters.minValue !== '' && (!Number.isFinite(Number(filters.minValue)) || Number(filters.minValue) < 0)) {
    errors.minValue = 'Giá trị tối thiểu phải là số không âm.';
  }
  if (filters.maxValue !== '' && (!Number.isFinite(Number(filters.maxValue)) || Number(filters.maxValue) < 0)) {
    errors.maxValue = 'Giá trị tối đa phải là số không âm.';
  }
  if (filters.minValue !== '' && filters.maxValue !== '' && Number(filters.minValue) > Number(filters.maxValue)) {
    errors.maxValue = 'Giá trị tối đa phải lớn hơn hoặc bằng tối thiểu.';
  }
  if (filters.closeFrom && filters.closeTo && filters.closeFrom > filters.closeTo) {
    errors.closeTo = 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.';
  }
  return errors;
}

export function serializeSavedFilters(savedFilters) {
  return JSON.stringify(savedFilters);
}

export function parseSavedFilters(raw) {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((entry) => entry && typeof entry.id === 'string' && typeof entry.name === 'string' && entry.filters && typeof entry.filters === 'object');
  } catch {
    return [];
  }
}

export function makeSavedFilter(name, filters, id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`) {
  return {
    id,
    name: name.trim(),
    filters: { ...EMPTY_FILTERS, ...filters },
    createdAt: new Date().toISOString(),
  };
}

export function toCsv(items) {
  const headers = ['Mã cơ hội', 'Tên cơ hội', 'Công ty', 'Giai đoạn', 'Giá trị (VND)', 'Ngày chốt dự kiến', 'Sản phẩm', 'Người sở hữu', 'Xác suất (%)'];
  const rows = items.map((item) => [item.id, item.name, item.company, item.stage, item.value, item.closeDate, item.product, item.owner, item.probability]);
  const cell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return '\uFEFF' + [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

export function formatCompactCurrency(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ ₫`;
  return `${Math.round(value / 1_000_000).toLocaleString('vi-VN')} tr ₫`;
}

export function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
}
