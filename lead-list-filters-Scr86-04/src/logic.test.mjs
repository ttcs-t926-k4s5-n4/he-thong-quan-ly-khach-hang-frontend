import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_FILTERS, isOverdue, filterLeads, saveFilter, applySavedFilter } from './logic.mjs';
const now = Date.parse('2026-10-14T10:00:00.000Z');
const leads = [
  { id: 'LD-1', name: 'Nguyễn An', company: 'Alpha Tech', email: 'an@alpha.vn', status: 'Mới', source: 'Website', temperature: 'Nóng', owner: 'Trần Hà', createdAt: new Date(now - 30 * 3600000).toISOString(), contactedAt: null },
  { id: 'LD-2', name: 'Lê Bình', company: 'Beta Retail', email: 'binh@beta.vn', status: 'Đang chăm sóc', source: 'Facebook', temperature: 'Ấm', owner: 'Lê Hương', createdAt: new Date(now - 5 * 86400000).toISOString(), contactedAt: new Date(now - 2 * 3600000).toISOString() },
  { id: 'LD-3', name: 'Phạm Chi', company: 'Alpha Care', email: 'chi@alpha.vn', status: 'Mới', source: 'Website', temperature: 'Nóng', owner: 'Trần Hà', createdAt: new Date(now - 50 * 86400000).toISOString(), contactedAt: null },
];
test('Tìm kiếm không phân biệt hoa thường theo tên hoặc doanh nghiệp', () => assert.deepEqual(filterLeads(leads, { ...DEFAULT_FILTERS, query: 'ALPHA', period: 'Tất cả thời gian' }, now).map((l) => l.id), ['LD-1', 'LD-3']));
test('Lọc đa điều kiện theo trạng thái, nguồn, nhiệt độ và phụ trách', () => { const out = filterLeads(leads, { ...DEFAULT_FILTERS, status: 'Mới', source: 'Website', temperature: 'Nóng', owner: 'Trần Hà' }, now); assert.deepEqual(out.map((l) => l.id), ['LD-1']); });
test('SLA quá hạn chỉ chọn lead chưa liên hệ hơn 24 giờ', () => { assert.equal(isOverdue(leads[0], now), true); assert.equal(isOverdue(leads[1], now), false); assert.deepEqual(filterLeads(leads, { ...DEFAULT_FILTERS, period: 'Tất cả thời gian', overdueOnly: true }, now).map((l) => l.id), ['LD-1', 'LD-3']); });
test('Khoảng thời gian loại lead cũ hơn ngưỡng', () => assert.deepEqual(filterLeads(leads, { ...DEFAULT_FILTERS, period: '7 ngày gần đây' }, now).map((l) => l.id), ['LD-1', 'LD-2']));
test('Lưu và áp dụng bộ lọc đã đặt tên', () => { const filters = { ...DEFAULT_FILTERS, status: 'Mới', overdueOnly: true }; const saved = saveFilter([], 'Lead cần gọi', filters); assert.deepEqual(applySavedFilter(saved, saved[0].id), filters); });
test('Chặn tên bộ lọc trống hoặc bị trùng', () => { assert.throws(() => saveFilter([], '  ', DEFAULT_FILTERS), /đặt tên/i); const saved = saveFilter([], 'Sáng nay', DEFAULT_FILTERS); assert.throws(() => saveFilter(saved, 'sáng nay', DEFAULT_FILTERS), /tồn tại/i); });
