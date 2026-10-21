export function normalizeSearchText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (letter) => (letter === 'Đ' ? 'D' : 'd'))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function findLatestOpenOpportunity(customerId, opportunities = []) {
  return opportunities
    .filter((opportunity) => opportunity.customerId === customerId && opportunity.status === 'open')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] ?? null;
}

export function formatVnd(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatDateTime(value, options = {}) {
  if (!value) return 'Chưa đặt lịch';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Thời gian không hợp lệ';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', ...options,
  }).format(date);
}

export function toLocalDateTimeInput(date) {
  const current = new Date(date);
  const offsetMs = current.getTimezoneOffset() * 60000;
  return new Date(current.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function getDefaultCallbackDateTime(now = new Date()) {
  const callback = new Date(now);
  callback.setDate(callback.getDate() + 1);
  callback.setHours(9, 0, 0, 0);
  return toLocalDateTimeInput(callback);
}

export function createCallLog(input, { now = new Date(), idFactory = () => `call-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` } = {}) {
  const { customerId, outcome, note = '', callbackAt = '', customers = [], opportunities = [], createdBy = 'Nhân viên kinh doanh', outcomeLabels = {} } = input;
  if (!customerId) throw new Error('Vui lòng chọn khách hàng.');
  const customer = customers.find((item) => item.id === customerId);
  if (!customer) throw new Error('Không tìm thấy khách hàng đã chọn.');
  if (!outcome) throw new Error('Vui lòng chọn kết quả cuộc gọi.');

  const callbackDate = callbackAt ? new Date(callbackAt) : null;
  if (outcome === 'callback' && !callbackAt) throw new Error('Vui lòng chọn thời gian gọi lại.');
  if (callbackAt && (!callbackDate || Number.isNaN(callbackDate.getTime()))) {
    throw new Error('Thời gian gọi lại không hợp lệ.');
  }
  if (callbackAt && callbackDate.getTime() < now.getTime()) {
    throw new Error('Thời gian gọi lại phải ở hiện tại hoặc tương lai.');
  }

  const opportunity = findLatestOpenOpportunity(customerId, opportunities);
  const outcomeFallback = {
    connected: 'Đã trao đổi', no_answer: 'Không nghe máy', busy: 'Máy bận', callback: 'Hẹn gọi lại',
    meeting: 'Đã đặt lịch hẹn', not_interested: 'Chưa có nhu cầu',
  };

  return {
    id: idFactory(),
    customerId: customer.id,
    customerName: customer.name,
    company: customer.company,
    phone: customer.phone,
    outcome,
    outcomeLabel: outcomeLabels[outcome] ?? outcomeFallback[outcome] ?? outcome,
    note: String(note).trim(),
    opportunityId: opportunity?.id ?? null,
    opportunityName: opportunity?.name ?? null,
    opportunityStage: opportunity?.stage ?? null,
    opportunityValue: opportunity?.value ?? null,
    callbackAt: callbackAt ? callbackDate.toISOString() : null,
    createdAt: now.toISOString(),
    createdBy,
  };
}

export function matchesCallLogSearch(log, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  const searchable = normalizeSearchText([
    log.customerName, log.company, log.phone, log.outcomeLabel,
    log.note, log.opportunityName, log.createdBy,
  ].filter(Boolean).join(' '));
  return normalizedQuery.split(' ').every((token) => searchable.includes(token));
}

export function getCallSummary(logs = [], now = new Date()) {
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayLogs = logs.filter((log) => {
    const date = new Date(log.createdAt);
    if (Number.isNaN(date.getTime())) return false;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` === todayKey;
  });
  const validCallbacks = logs.filter((log) => log.callbackAt && !Number.isNaN(new Date(log.callbackAt).getTime()));
  const callbacksDue = validCallbacks.filter((log) => new Date(log.callbackAt).getTime() >= now.getTime());
  const overdueCallbacks = validCallbacks.filter((log) => new Date(log.callbackAt).getTime() < now.getTime());
  return {
    callsToday: todayLogs.length,
    connectedToday: todayLogs.filter((log) => ['connected', 'meeting'].includes(log.outcome)).length,
    callbacksDue: callbacksDue.length,
    overdueCallbacks: overdueCallbacks.length,
  };
}

export const sanitizeText = (str) => typeof str === 'string' ? str.trim().replace(/[<>]/g, '') : '';


export const formatCallDuration = (sec) => { const s = Number(sec) || 0; const m = Math.floor(s / 60); const r = s % 60; return m > 0 ? ${m}m s : ${r}s; };

