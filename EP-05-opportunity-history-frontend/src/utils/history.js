import { FIELD_META } from '../data/seed.js';

export const FIELD_KEYS = ['stage', 'value', 'closeDate', 'owner'];

export function formatCurrency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(number).replace(/\u00A0/g, ' ');
}

export function formatFieldValue(field, value) {
  if (value === null || value === undefined || value === '') return '—';
  if (field === 'value') return formatCurrency(value);
  if (field === 'closeDate') {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(date);
  }
  return String(value);
}

export function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';
  const dateText = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(date);
  return `${dateText} · ${timeText}`;
}

export function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(-2).map((part) => part[0] || '').join('').toUpperCase();
}

export function createHistoryEntries({ opportunityId, before, after, actor, note = '', timestamp = new Date().toISOString(), idFactory = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }) {
  return FIELD_KEYS
    .filter((field) => String(before[field] ?? '') !== String(after[field] ?? ''))
    .map((field) => ({
      id: `hist-${idFactory()}`,
      opportunityId,
      field,
      before: before[field] ?? '',
      after: after[field] ?? '',
      actor,
      timestamp,
      note: note.trim(),
    }));
}

export function getFieldLabel(field) {
  return FIELD_META[field]?.label ?? field;
}

function localDateKey(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function filterHistory(history, opportunities, filters) {
  const opportunityMap = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));
  const query = filters.query.trim().toLocaleLowerCase('vi');
  return history.filter((entry) => {
    const opportunity = opportunityMap.get(entry.opportunityId);
    if (!opportunity) return false;
    if (filters.opportunityId && entry.opportunityId !== filters.opportunityId) return false;
    if (filters.field && entry.field !== filters.field) return false;
    if (filters.actor && entry.actor !== filters.actor) return false;
    const entryDate = localDateKey(entry.timestamp);
    if (filters.from && entryDate < filters.from) return false;
    if (filters.to && entryDate > filters.to) return false;
    if (query) {
      const values = [
        opportunity.name, opportunity.company, entry.actor, entry.note,
        getFieldLabel(entry.field), formatFieldValue(entry.field, entry.before), formatFieldValue(entry.field, entry.after),
      ];
      if (!values.some((value) => String(value ?? '').toLocaleLowerCase('vi').includes(query))) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function toCsv(history, opportunities) {
  const opportunityMap = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));
  const columns = ['Thời điểm', 'Cơ hội', 'Công ty', 'Trường thay đổi', 'Giá trị trước', 'Giá trị sau', 'Người thực hiện', 'Ghi chú'];
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = history.map((entry) => {
    const opportunity = opportunityMap.get(entry.opportunityId);
    return [
      formatDateTime(entry.timestamp), opportunity?.name, opportunity?.company,
      getFieldLabel(entry.field), formatFieldValue(entry.field, entry.before),
      formatFieldValue(entry.field, entry.after), entry.actor, entry.note,
    ].map(escape).join(',');
  });
  return `\uFEFF${columns.map(escape).join(',')}\r\n${rows.join('\r\n')}`;
}
