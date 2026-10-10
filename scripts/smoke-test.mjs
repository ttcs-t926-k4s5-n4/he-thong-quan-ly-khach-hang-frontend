import assert from 'node:assert/strict';
import { applyLeadFilters, convertLead, isOverdue, logContact, qualifyLead, receiveLead, rejectLead, STATUS } from '../src/logic.js';

const lead = {
  id: 'LD-1234', name: 'Nguyễn Văn A', company: 'Công ty A', email: 'a@example.vn', phone: '0900000000',
  source: 'Website', temperature: 'Nóng', status: STATUS.ASSIGNED, owner: 'Nguyễn Minh Anh',
  createdAt: '2026-01-01T09:00:00.000Z', slaDueAt: '2026-01-01T10:00:00.000Z',
  potentialValue: 250000000, qualified: false,
  activities: [{ id: 'old-1', title: 'Lead được tạo', detail: 'Tạo từ website', at: '2026-01-01T09:00:00.000Z' }],
};
const now = new Date('2026-01-01T12:00:00.000Z');
let checks = 0;
const check = (name, callback) => {
  callback();
  checks += 1;
  console.log(`✓ ${name}`);
};

check('Lead quá SLA chỉ bị gắn cờ nếu chưa liên hệ', () => {
  assert.equal(isOverdue(lead, now), true);
  assert.equal(isOverdue({ ...lead, firstContactAt: now.toISOString() }, now), false);
  assert.equal(isOverdue({ ...lead, status: STATUS.WAITING }, now), false);
});

check('Nhận lead chuyển trạng thái sang Đang chăm sóc và ghi lịch sử', () => {
  const received = receiveLead(lead, 'Nguyễn Minh Anh', now);
  assert.equal(received.status, STATUS.WORKING);
  assert.equal(received.owner, 'Nguyễn Minh Anh');
  assert.equal(received.activities.at(-1).title, 'Đã nhận lead');
});

check('Từ chối bắt buộc có lý do và trả lead về hàng chờ', () => {
  assert.throws(() => rejectLead(lead, '  '), /Vui lòng nhập lý do/);
  const rejected = rejectLead(lead, 'Không đúng khu vực', now);
  assert.equal(rejected.status, STATUS.WAITING);
  assert.equal(rejected.owner, null);
  assert.match(rejected.activities.at(-1).detail, /Không đúng khu vực/);
});

check('Ghi nhận liên hệ sẽ gỡ cờ quá SLA và thêm hoạt động', () => {
  const contacted = logContact(lead, 'Đã gọi và trao đổi nhu cầu.', now);
  assert.equal(isOverdue(contacted, now), false);
  assert.equal(contacted.activities.length, 2);
});

check('Chuyển đổi cần lead đủ điều kiện, tạo khách hàng + người liên hệ + cơ hội và giữ lịch sử', () => {
  assert.throws(() => convertLead(lead, now), /đủ điều kiện/);
  const result = convertLead(qualifyLead(lead, now), now);
  assert.equal(result.lead.status, STATUS.CONVERTED);
  assert.equal(result.customer.name, lead.company);
  assert.equal(result.customer.email, lead.email);
  assert.equal(result.contact.name, lead.name);
  assert.equal(result.contact.customerId, result.customer.id);
  assert.equal(result.customer.activities.length, lead.activities.length + 2);
  assert.equal(result.opportunity.value, lead.potentialValue);
  assert.equal(result.lead.activities.length, lead.activities.length + 2);
  assert.throws(() => convertLead(result.lead, now), /đã được chuyển đổi/);
});

check('Bộ lọc tìm kiếm, nguồn, người phụ trách, SLA và khoảng ngày', () => {
  const other = { ...lead, id: 'LD-9999', name: 'Trần B', company: 'Công ty B', email: 'b@example.vn', phone: '0911111111', source: 'Facebook', owner: 'Trần Quốc Bảo', status: STATUS.WORKING, createdAt: '2026-02-01T09:00:00.000Z', firstContactAt: now.toISOString() };
  assert.equal(applyLeadFilters([lead, other], { query: 'công ty a' }, now).length, 1);
  assert.equal(applyLeadFilters([lead, other], { source: 'Facebook' }, now).length, 1);
  assert.equal(applyLeadFilters([lead, other], { owner: 'Tôi' }, now).length, 1);
  assert.equal(applyLeadFilters([lead, other], { overdueOnly: true }, now).length, 1);
  assert.equal(applyLeadFilters([lead, other], { startDate: '2026-02-01', endDate: '2026-02-01' }, now).length, 1);
});

console.log(`\nKết quả: ${checks}/${checks} nhóm smoke test đã PASS.`);
