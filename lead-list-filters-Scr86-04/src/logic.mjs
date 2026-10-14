export const DEFAULT_FILTERS = Object.freeze({ query: '', status: 'Tất cả trạng thái', source: 'Tất cả nguồn', temperature: 'Tất cả mức độ', owner: 'Tất cả người phụ trách', period: '30 ngày gần đây', overdueOnly: false });
export function isOverdue(lead, now = Date.now(), slaHours = 24) {
  if (lead.contactedAt || lead.status === 'Đã chuyển đổi' || lead.status === 'Đã liên hệ') return false;
  const created = new Date(lead.createdAt).getTime();
  return Number.isFinite(created) && now - created > slaHours * 3600000;
}
export function filterLeads(leads, filters = DEFAULT_FILTERS, now = Date.now()) {
  return leads.filter((lead) => {
    const query = String(filters.query || '').trim().toLowerCase();
    const matchQuery = !query || `${lead.id} ${lead.name} ${lead.company} ${lead.email} ${lead.phone}`.toLowerCase().includes(query);
    const matchStatus = !filters.status || filters.status === 'Tất cả trạng thái' || lead.status === filters.status;
    const matchSource = !filters.source || filters.source === 'Tất cả nguồn' || lead.source === filters.source;
    const matchTemperature = !filters.temperature || filters.temperature === 'Tất cả mức độ' || lead.temperature === filters.temperature;
    const matchOwner = !filters.owner || filters.owner === 'Tất cả người phụ trách' || lead.owner === filters.owner;
    const dayCount = filters.period === '7 ngày gần đây' ? 7 : filters.period === '14 ngày gần đây' ? 14 : filters.period === 'Tất cả thời gian' ? Infinity : 30;
    const matchPeriod = dayCount === Infinity || now - new Date(lead.createdAt).getTime() <= dayCount * 86400000;
    const matchOverdue = !filters.overdueOnly || isOverdue(lead, now);
    return matchQuery && matchStatus && matchSource && matchTemperature && matchOwner && matchPeriod && matchOverdue;
  });
}
export function saveFilter(savedFilters, name, filters) {
  const clean = String(name || '').trim();
  if (!clean) throw new Error('Vui lòng đặt tên cho bộ lọc.');
  const duplicate = savedFilters.some((f) => f.name.toLowerCase() === clean.toLowerCase());
  if (duplicate) throw new Error('Tên bộ lọc đã tồn tại. Hãy chọn tên khác.');
  return [...savedFilters, { id: `filter-${Date.now()}-${savedFilters.length}`, name: clean, filters: { ...filters } }];
}
export function applySavedFilter(savedFilters, id) {
  const found = savedFilters.find((item) => item.id === id);
  if (!found) throw new Error('Không tìm thấy bộ lọc đã lưu.');
  return { ...DEFAULT_FILTERS, ...found.filters };
}
