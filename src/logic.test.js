import { describe, expect, it } from 'vitest';
import { applyLeadFilters, convertLead, isOverdue, logContact, qualifyLead, receiveLead, rejectLead, STATUS } from './logic.js';

const baseLead = {
  id: 'LD-1234', name: 'Nguyễn Văn A', company: 'Công ty A', email: 'a@example.vn', phone: '0900000000',
  source: 'Website', temperature: 'Nóng', status: STATUS.ASSIGNED, owner: 'Nguyễn Minh Anh', createdAt: '2026-01-01T09:00:00.000Z',
  slaDueAt: '2026-01-01T10:00:00.000Z', potentialValue: 250000000, qualified: false, activities: [{ id: 'old-1', title: 'Lead được tạo', detail: 'Tạo từ website', at: '2026-01-01T09:00:00.000Z' }],
};
const now = new Date('2026-01-01T12:00:00.000Z');

describe('SLA and lead state transitions', () => {
  it('flags overdue leads only when the first contact has not happened', () => {
    expect(isOverdue(baseLead, now)).toBe(true);
    expect(isOverdue({ ...baseLead, firstContactAt: '2026-01-01T11:00:00.000Z' }, now)).toBe(false);
    expect(isOverdue({ ...baseLead, status: STATUS.WAITING }, now)).toBe(false);
  });

  it('moves an accepted lead into care and records an activity', () => {
    const received = receiveLead(baseLead, 'Nguyễn Minh Anh', now);
    expect(received.status).toBe(STATUS.WORKING);
    expect(received.owner).toBe('Nguyễn Minh Anh');
    expect(received.activities.at(-1).title).toBe('Đã nhận lead');
  });

  it('requires a rejection reason and returns rejected leads to distribution queue', () => {
    expect(() => rejectLead(baseLead, '  ')).toThrow('Vui lòng nhập lý do từ chối.');
    const rejected = rejectLead(baseLead, 'Không đúng khu vực', now);
    expect(rejected.status).toBe(STATUS.WAITING);
    expect(rejected.owner).toBeNull();
    expect(rejected.activities.at(-1).detail).toContain('Không đúng khu vực');
  });

  it('clears the SLA flag after the first contact and preserves activity history', () => {
    const contacted = logContact(baseLead, 'Đã gọi và trao đổi nhu cầu.', now);
    expect(contacted.firstContactAt).toBe(now.toISOString());
    expect(contacted.activities).toHaveLength(2);
    expect(isOverdue(contacted, now)).toBe(false);
  });

  it('converts a qualified lead into customer, contact and opportunity without losing existing activities', () => {
    expect(() => convertLead(baseLead, now)).toThrow('Lead cần được đánh dấu đủ điều kiện');
    const qualified = qualifyLead(baseLead, now);
    const result = convertLead(qualified, now);
    expect(result.lead.status).toBe(STATUS.CONVERTED);
    expect(result.customer.name).toBe(baseLead.company);
    expect(result.customer.email).toBe(baseLead.email);
    expect(result.contact.name).toBe(baseLead.name);
    expect(result.contact.customerId).toBe(result.customer.id);
    expect(result.customer.activities).toHaveLength(baseLead.activities.length + 2);
    expect(result.opportunity.value).toBe(baseLead.potentialValue);
    expect(result.lead.activities).toHaveLength(baseLead.activities.length + 2);
    expect(() => convertLead(result.lead, now)).toThrow('đã được chuyển đổi');
  });

  it('filters by query, source, status, owner, overdue state and date range', () => {
    const other = { ...baseLead, id: 'LD-9999', name: 'Trần B', company: 'Công ty B', email: 'b@example.vn', phone: '0911111111', source: 'Facebook', owner: 'Trần Quốc Bảo', status: STATUS.WORKING, createdAt: '2026-02-01T09:00:00.000Z', firstContactAt: now.toISOString() };
    expect(applyLeadFilters([baseLead, other], { query: 'công ty a' }, now)).toHaveLength(1);
    expect(applyLeadFilters([baseLead, other], { source: 'Facebook' }, now)).toHaveLength(1);
    expect(applyLeadFilters([baseLead, other], { status: STATUS.WORKING }, now)).toHaveLength(1);
    expect(applyLeadFilters([baseLead, other], { owner: 'Tôi' }, now)).toHaveLength(1);
    expect(applyLeadFilters([baseLead, other], { overdueOnly: true }, now)).toHaveLength(1);
    expect(applyLeadFilters([baseLead, other], { startDate: '2026-02-01', endDate: '2026-02-01' }, now)).toHaveLength(1);
  });
});
