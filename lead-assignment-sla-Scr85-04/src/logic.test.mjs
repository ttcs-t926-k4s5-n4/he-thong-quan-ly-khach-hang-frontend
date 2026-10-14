import test from 'node:test';
import assert from 'node:assert/strict';
import { isSlaOverdue, acceptLead, rejectLead, markContacted, makeManagerAlert } from './logic.mjs';
const freshLead = (patch = {}) => ({ id: 'L-101', name: 'Nguyễn Minh Anh', status: 'Mới', owner: 'Trần Hà', createdAt: new Date(Date.now() - 30 * 3600000).toISOString(), contactedAt: null, activities: [], ...patch });

test('SLA: lead chưa liên hệ quá 24 giờ được gắn cờ', () => assert.equal(isSlaOverdue(freshLead()), true));
test('SLA: lead đã liên hệ không còn bị gắn cờ', () => assert.equal(isSlaOverdue(freshLead({ contactedAt: new Date().toISOString() })), false));
test('Nhận lead chuyển trạng thái sang Đang chăm sóc', () => assert.equal(acceptLead(freshLead()).status, 'Đang chăm sóc'));
test('Từ chối thiếu lý do bị chặn', () => assert.throws(() => rejectLead(freshLead(), '  '), /lý do/));
test('Từ chối có lý do trả lead về Chờ phân bổ và ghi lịch sử', () => { const lead = rejectLead(freshLead(), 'Không đúng khu vực'); assert.equal(lead.status, 'Chờ phân bổ'); assert.equal(lead.owner, ''); assert.match(lead.activities.at(-1).text, /Không đúng khu vực/); });
test('Ghi nhận liên hệ xóa cờ SLA; cảnh báo chỉ tạo khi quá hạn', () => { const lead = freshLead(); assert.ok(makeManagerAlert(lead)); assert.equal(makeManagerAlert(markContacted(lead)), null); });
