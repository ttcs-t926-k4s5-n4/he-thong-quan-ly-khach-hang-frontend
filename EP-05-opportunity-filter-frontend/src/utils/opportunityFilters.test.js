import test from 'node:test';
import assert from 'node:assert/strict';
import { OPPORTUNITIES } from '../data/opportunities.js';
import {
  EMPTY_FILTERS,
  filterOpportunities,
  hasActiveFilters,
  makeSavedFilter,
  parseSavedFilters,
  serializeSavedFilters,
  sortOpportunities,
  toCsv,
  validateFilters,
} from './opportunityFilters.js';

test('empty filters return all opportunities', () => {
  assert.equal(filterOpportunities(OPPORTUNITIES, EMPTY_FILTERS).length, OPPORTUNITIES.length);
  assert.equal(hasActiveFilters(EMPTY_FILTERS), false);
});

test('search matches opportunity name, company, owner, product and ignores Vietnamese accents', () => {
  assert.ok(filterOpportunities(OPPORTUNITIES, { ...EMPTY_FILTERS, search: 'nova retail' }).some((x) => x.id === 'OP-2402'));
  assert.ok(filterOpportunities(OPPORTUNITIES, { ...EMPTY_FILTERS, search: 'nguyen minh anh' }).length > 0);
  assert.ok(filterOpportunities(OPPORTUNITIES, { ...EMPTY_FILTERS, search: 'crm enterprise' }).length > 0);
  assert.ok(filterOpportunities(OPPORTUNITIES, { ...EMPTY_FILTERS, search: 'dong duong logistics' }).some((x) => x.id === 'OP-2404')); 
});

test('stage, product and owner filters combine with AND logic', () => {
  const result = filterOpportunities(OPPORTUNITIES, {
    ...EMPTY_FILTERS,
    stage: 'Đàm phán',
    product: 'CRM Enterprise',
    owner: 'Võ Ngọc Linh',
  });
  assert.deepEqual(result.map((x) => x.id), ['OP-2405', 'OP-2410']);
});

test('min and max value boundaries are inclusive', () => {
  const result = filterOpportunities(OPPORTUNITIES, { ...EMPTY_FILTERS, minValue: '500000000', maxValue: '700000000' });
  assert.ok(result.some((x) => x.id === 'OP-2401'));
  assert.ok(result.every((x) => x.value >= 500000000 && x.value <= 700000000));
});

test('close date boundaries are inclusive and use ISO dates safely', () => {
  const result = filterOpportunities(OPPORTUNITIES, { ...EMPTY_FILTERS, closeFrom: '2026-10-20', closeTo: '2026-10-22' });
  assert.ok(result.length > 0);
  assert.ok(result.every((x) => x.closeDate >= '2026-10-20' && x.closeDate <= '2026-10-22'));
});

test('filter validation catches inconsistent value and date ranges', () => {
  assert.ok(validateFilters({ ...EMPTY_FILTERS, minValue: '900', maxValue: '100' }).maxValue);
  assert.ok(validateFilters({ ...EMPTY_FILTERS, closeFrom: '2026-11-02', closeTo: '2026-10-01' }).closeTo);
  assert.deepEqual(validateFilters({ ...EMPTY_FILTERS, minValue: '100', maxValue: '500' }), {});
});

test('saved filter round trips and invalid local storage data safely falls back to empty', () => {
  const saved = makeSavedFilter('Cần chốt tuần này', { ...EMPTY_FILTERS, stage: 'Đàm phán' }, 'preset-1');
  const restored = parseSavedFilters(serializeSavedFilters([saved]));
  assert.equal(restored.length, 1);
  assert.equal(restored[0].name, 'Cần chốt tuần này');
  assert.equal(restored[0].filters.stage, 'Đàm phán');
  assert.deepEqual(parseSavedFilters('{bad-json'), []);
  assert.deepEqual(parseSavedFilters('{"not":"an array"}'), []);
});

test('sort returns a new list and sorts numeric and date fields', () => {
  const original = [...OPPORTUNITIES];
  const sorted = sortOpportunities(OPPORTUNITIES, 'value', 'desc');
  assert.notEqual(sorted, OPPORTUNITIES);
  assert.ok(sorted[0].value >= sorted[1].value);
  assert.equal(OPPORTUNITIES[0].id, original[0].id);
  assert.ok(sortOpportunities(OPPORTUNITIES, 'closeDate', 'asc')[0].closeDate <= sortOpportunities(OPPORTUNITIES, 'closeDate', 'asc').at(-1).closeDate);
});

test('CSV export includes BOM, headers and escapes quotes', () => {
  const csv = toCsv([{ ...OPPORTUNITIES[0], name: 'Cơ hội "đặc biệt"' }]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"Cơ hội ""đặc biệt"""'));
  assert.ok(csv.includes('Mã cơ hội'));
});
