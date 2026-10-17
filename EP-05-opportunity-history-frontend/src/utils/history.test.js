import { describe, expect, it } from 'vitest';
import { createHistoryEntries, filterHistory, formatFieldValue, toCsv } from './history';

const opportunity = { id: 'opp-1', name: 'Cơ hội CRM', company: 'Công ty Sao Mai', stage: 'Đàm phán', value: 250000000, closeDate: '2026-11-20', owner: 'Lê Thu Hà' };
const existing = [
  { id: 'h1', opportunityId: 'opp-1', field: 'value', before: 200000000, after: 250000000, actor: 'Nguyễn Minh Anh', timestamp: '2026-10-17T03:00:00.000Z', note: 'Bổ sung hạng mục đào tạo' },
  { id: 'h2', opportunityId: 'opp-1', field: 'stage', before: 'Đề xuất giải pháp', after: 'Đàm phán', actor: 'Lê Thu Hà', timestamp: '2026-10-16T03:00:00.000Z', note: '' },
];

describe('history helpers', () => {
  it('creates one history row per changed field with before/after and actor', () => {
    const entries = createHistoryEntries({
      opportunityId: 'opp-1',
      before: { stage: 'Đề xuất giải pháp', value: 200, closeDate: '2026-11-20', owner: 'Lê Thu Hà' },
      after: { stage: 'Đàm phán', value: 250, closeDate: '2026-11-28', owner: 'Nguyễn Minh Anh' },
      actor: 'Nguyễn Minh Anh', note: 'Đã trao đổi với khách hàng', timestamp: '2026-10-17T03:00:00.000Z', idFactory: (() => { let i = 0; return () => ++i; })(),
    });
    expect(entries).toHaveLength(4);
    expect(entries.map((entry) => entry.field)).toEqual(['stage', 'value', 'closeDate', 'owner']);
    expect(entries[0]).toMatchObject({ before: 'Đề xuất giải pháp', after: 'Đàm phán', actor: 'Nguyễn Minh Anh', note: 'Đã trao đổi với khách hàng' });
  });

  it('does not create history records when no fields changed', () => {
    expect(createHistoryEntries({ opportunityId: 'opp-1', before: opportunity, after: { ...opportunity }, actor: 'Nguyễn Minh Anh' })).toEqual([]);
  });

  it('formats VND and date values for display', () => {
    expect(formatFieldValue('value', 250000000)).toContain('250.000.000');
    expect(formatFieldValue('closeDate', '2026-11-20')).toBe('20/11/2026');
    expect(formatFieldValue('owner', 'Lê Thu Hà')).toBe('Lê Thu Hà');
  });

  it('filters by keyword, field, actor, and opportunity', () => {
    expect(filterHistory(existing, [opportunity], { query: 'Sao Mai', opportunityId: '', field: '', actor: '', from: '', to: '' })).toHaveLength(2);
    expect(filterHistory(existing, [opportunity], { query: '', opportunityId: '', field: 'value', actor: '', from: '', to: '' })).toHaveLength(1);
    expect(filterHistory(existing, [opportunity], { query: '', opportunityId: '', field: '', actor: 'Lê Thu Hà', from: '', to: '' })).toHaveLength(1);
    expect(filterHistory(existing, [opportunity], { query: '', opportunityId: 'other', field: '', actor: '', from: '', to: '' })).toHaveLength(0);
  });

  it('exports previous and new values along with the actor in CSV', () => {
    const csv = toCsv(existing, [opportunity]);
    expect(csv).toContain('Cơ hội CRM');
    expect(csv).toContain('Nguyễn Minh Anh');
    expect(csv).toContain('200.000.000 ₫');
    expect(csv).toContain('250.000.000 ₫');
    expect(csv).toContain('Bổ sung hạng mục đào tạo');
  });
});
