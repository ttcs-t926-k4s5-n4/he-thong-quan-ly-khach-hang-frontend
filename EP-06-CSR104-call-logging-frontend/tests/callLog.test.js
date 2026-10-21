import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCallLog,
  findLatestOpenOpportunity,
  formatVnd,
  getCallSummary,
  getDefaultCallbackDateTime,
  matchesCallLogSearch,
  normalizeSearchText,
} from '../src/lib/callLog.js';
import {
  readStoredCallLogs,
  readStoredCustomerId,
} from '../src/lib/storage.js';
const now = new Date('2026-10-18T10:00:00.000Z');
const customers = [
  { id: 'c1', name: 'Nguyễn Minh Anh', company: 'An Phát Logistics', phone: '0901' },
  { id: 'c2', name: 'Trần Quốc Bảo', company: 'Kết Nối Xanh', phone: '0912' },
];
const opportunities = [
  { id: 'o1', customerId: 'c1', name: 'Cơ hội cũ', stage: 'Tiếp cận', status: 'open', value: 100, updatedAt: '2026-10-10T10:00:00.000Z' },
  { id: 'o2', customerId: 'c1', name: 'Cơ hội mới nhất', stage: 'Đàm phán', status: 'open', value: 200, updatedAt: '2026-10-17T10:00:00.000Z' },
  { id: 'o3', customerId: 'c1', name: 'Cơ hội đã thắng', stage: 'Thành công', status: 'won', value: 300, updatedAt: '2026-10-18T09:00:00.000Z' },
];

const baseInput = (overrides = {}) => ({
  customerId: 'c1', outcome: 'connected', note: ' Khách quan tâm gói Pro ',
  customers, opportunities, createdBy: 'Phạm Ngọc Anh', ...overrides,
});

test('Chuẩn hóa tiếng Việt không dấu và dấu câu', () => {
  assert.equal(normalizeSearchText('  NGUYỄN Minh-Ánh! '), 'nguyen minh anh');
  assert.equal(normalizeSearchText('Đàm phán / gọi lại'), 'dam phan goi lai');
});

test('Tìm kiếm hoạt động bằng từ khóa không dấu', () => {
  assert.equal(matchesCallLogSearch({ customerName: 'Nguyễn Minh Anh', note: 'Khách cần báo giá trước thứ Sáu' }, 'nguyen minh'), true);
  assert.equal(matchesCallLogSearch({ customerName: 'Nguyễn Minh Anh', note: 'Khách cần báo giá trước thứ Sáu' }, 'bao gia'), true);
  assert.equal(matchesCallLogSearch({ customerName: 'Nguyễn Minh Anh', note: 'Khách cần báo giá' }, 'hop dong'), false);
  assert.equal(matchesCallLogSearch({ customerName: 'Nguyễn Minh Anh' }, ''), true);
});

test('Chọn cơ hội đang mở được cập nhật mới nhất, không chọn cơ hội đã đóng', () => {
  assert.equal(findLatestOpenOpportunity('c1', opportunities)?.id, 'o2');
  assert.equal(findLatestOpenOpportunity('unknown', opportunities), null);
});

test('Lưu cuộc gọi và tự động gắn vào cơ hội mới nhất', () => {
  const log = createCallLog(baseInput(), { now, idFactory: () => 'test-call-1' });
  assert.equal(log.id, 'test-call-1');
  assert.equal(log.customerName, 'Nguyễn Minh Anh');
  assert.equal(log.note, 'Khách quan tâm gói Pro');
  assert.equal(log.opportunityId, 'o2');
  assert.equal(log.opportunityName, 'Cơ hội mới nhất');
  assert.equal(log.createdAt, now.toISOString());
});

test('Không cho lưu khi chưa chọn khách hàng', () => {
  assert.throws(() => createCallLog(baseInput({ customerId: '' }), { now }), /chọn khách hàng/i);
});

test('Không cho lưu khi khách hàng không tồn tại', () => {
  assert.throws(() => createCallLog(baseInput({ customerId: 'unknown' }), { now }), /không tìm thấy khách hàng/i);
});

test('Không cho lưu khi chưa chọn kết quả cuộc gọi', () => {
  assert.throws(() => createCallLog(baseInput({ outcome: '' }), { now }), /chọn kết quả/i);
});

test('Kết quả hẹn gọi lại yêu cầu có thời gian gọi lại', () => {
  assert.throws(() => createCallLog(baseInput({ outcome: 'callback' }), { now }), /thời gian gọi lại/i);
});

test('Từ chối lịch gọi lại nằm trong quá khứ', () => {
  assert.throws(() => createCallLog(baseInput({ outcome: 'callback', callbackAt: '2026-10-18T09:00:00.000Z' }), { now }), /hiện tại hoặc tương lai/i);
});

test('Cho phép ghi cuộc gọi chưa kết nối cơ hội và gán lịch hẹn hợp lệ', () => {
  const log = createCallLog(baseInput({ customerId: 'c2', outcome: 'connected', callbackAt: '2026-10-19T09:00:00.000Z' }), { now });
  assert.equal(log.opportunityId, null);
  assert.equal(log.callbackAt, '2026-10-19T09:00:00.000Z');
});

test('Tổng hợp lượt gọi hôm nay, kết nối và lịch gọi lại', () => {
  const logs = [
    { createdAt: '2026-10-18T09:00:00.000Z', outcome: 'connected', callbackAt: '2026-10-19T09:00:00.000Z' },
    { createdAt: '2026-10-18T09:30:00.000Z', outcome: 'meeting', callbackAt: '2026-10-18T09:00:00.000Z' },
    { createdAt: '2026-10-17T09:30:00.000Z', outcome: 'no_answer', callbackAt: null },
  ];
  assert.deepEqual(getCallSummary(logs, now), { callsToday: 2, connectedToday: 2, callbacksDue: 1, overdueCallbacks: 1 });
});

test('Mốc gọi lại mặc định là 9 giờ sáng ngày kế tiếp', () => {
  const value = getDefaultCallbackDateTime(new Date('2026-10-18T10:00:00.000Z'));
  const date = new Date(value);
  assert.equal(date.getDate(), 19);
  assert.equal(date.getHours(), 9);
  assert.equal(date.getMinutes(), 0);
});

test('Định dạng giá trị tiền tệ Việt Nam', () => {
  assert.match(formatVnd(1000000), /1\.000\.000/);
});
test('Từ chối thời gian gọi lại không hợp lệ', () => {
  assert.throws(
    () =>
      createCallLog(
        baseInput({ callbackAt: 'not-a-valid-date' }),
        { now },
      ),
    /thời gian gọi lại không hợp lệ/i,
  );
});

test('Từ chối lịch gọi lại trong quá khứ khi đã bật lịch', () => {
  assert.throws(
    () =>
      createCallLog(
        baseInput({
          outcome: 'connected',
          callbackAt: '2026-10-18T09:00:00.000Z',
        }),
        { now },
      ),
    /hiện tại hoặc tương lai/i,
  );
});

test('Tìm kiếm cuộc gọi theo số điện thoại, cơ hội và người tạo', () => {
  const log = {
    phone: '0901',
    opportunityName: 'Hợp đồng Pro',
    createdBy: 'Phạm Ngọc Anh',
  };

  assert.equal(matchesCallLogSearch(log, '0901'), true);
  assert.equal(matchesCallLogSearch(log, 'hop dong'), true);
  assert.equal(matchesCallLogSearch(log, 'ngoc anh'), true);
  assert.equal(matchesCallLogSearch(log, 'khach hang khac'), false);
});

test('Thống kê bỏ qua ngày tạo và lịch gọi lại không hợp lệ', () => {
  const logs = [
    {
      createdAt: 'invalid-date',
      outcome: 'connected',
      callbackAt: 'invalid-date',
    },
    {
      createdAt: now.toISOString(),
      outcome: 'connected',
      callbackAt: 'invalid-date',
    },
  ];

  assert.deepEqual(getCallSummary(logs, now), {
    callsToday: 1,
    connectedToday: 1,
    callbacksDue: 0,
    overdueCallbacks: 0,
  });
});
test('Dùng dữ liệu mẫu khi JSON cuộc gọi bị lỗi', () => {
  const fallback = [{ id: 'demo-call' }];
  const storage = { getItem: () => '{invalid-json' };

  assert.deepEqual(
    readStoredCallLogs(storage, 'calls', fallback),
    fallback,
  );
});

test('Dùng dữ liệu mẫu khi dữ liệu cuộc gọi không phải mảng', () => {
  const fallback = [{ id: 'demo-call' }];
  const storage = {
    getItem: () => JSON.stringify({ id: 'invalid' }),
  };

  assert.deepEqual(
    readStoredCallLogs(storage, 'calls', fallback),
    fallback,
  );
});

test('Bỏ qua phần tử không hợp lệ trong lịch sử cuộc gọi', () => {
  const storage = {
    getItem: () =>
      JSON.stringify([
        { id: 'call-1' },
        null,
        'invalid',
        ['nested-array'],
        { id: 'call-2' },
      ]),
  };

  assert.deepEqual(
    readStoredCallLogs(storage, 'calls', []),
    [{ id: 'call-1' }, { id: 'call-2' }],
  );
});

test('Khôi phục khách hàng có ID hợp lệ đã lưu', () => {
  const customers = [
    { id: 'cus-001' },
    { id: 'cus-002' },
  ];

  const storage = {
    getItem: () => JSON.stringify('cus-002'),
  };

  assert.equal(
    readStoredCustomerId(
      storage,
      'customer',
      'cus-001',
      customers,
    ),
    'cus-002',
  );
});

test('Dùng khách hàng mặc định khi ID đã lưu không tồn tại', () => {
  const customers = [{ id: 'cus-001' }];

  const storage = {
    getItem: () => JSON.stringify('cus-unknown'),
  };

  assert.equal(
    readStoredCustomerId(
      storage,
      'customer',
      'cus-001',
      customers,
    ),
    'cus-001',
  );
});

test('sanitizeText loại bỏ ký tự HTML nguy hiểm', () => { assert.equal(sanitizeText('  <b>test</b> '), 'btest/b'); });


test('formatCallDuration chuyển giây sang định dạng phút giây', () => { assert.equal(formatCallDuration(125), '2m 5s'); assert.equal(formatCallDuration(45), '45s'); });


test('sortCallLogs sắp xếp chính xác theo ngày tạo', () => { const items = [{ createdAt: '2026-10-01' }, { createdAt: '2026-10-05' }]; const sorted = sortCallLogs(items, 'createdAt', false); assert.equal(sorted[0].createdAt, '2026-10-05'); });


test('filterLogsByOutcome lọc đúng theo kết quả cuộc gọi', () => { const logs = [{ outcome: 'connected' }, { outcome: 'no_answer' }]; assert.equal(filterLogsByOutcome(logs, 'connected').length, 1); assert.equal(filterLogsByOutcome(logs, 'all').length, 2); });


test('exportLogsToCsv cơ bản', () => { assert.equal(typeof exportLogsToCsv([]), 'string'); });
