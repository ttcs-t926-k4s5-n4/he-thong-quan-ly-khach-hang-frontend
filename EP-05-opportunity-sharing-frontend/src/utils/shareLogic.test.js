import test from 'node:test';
import assert from 'node:assert/strict';
import { TEAM, INITIAL_OPPORTUNITIES } from '../data/seed.js';
import {
  addMembersToOpportunity,
  canLogActivity,
  canManageSharing,
  getActorRole,
  getAvailableMembers,
  recordActivity,
  removeSharedMember,
  transferOwnership,
} from './shareLogic.js';

const base = () => structuredClone(INITIAL_OPPORTUNITIES[0]);
const now = '2026-10-17T14:30:00.000Z';

test('xác định vai trò owner, member và người chưa được chia sẻ', () => {
  const opp = base();
  assert.equal(getActorRole(opp, 'u-phong'), 'owner');
  assert.equal(getActorRole(opp, 'u-linh'), 'member');
  assert.equal(getActorRole(opp, 'u-an'), 'none');
  assert.equal(canManageSharing(opp, 'u-linh'), false);
  assert.equal(canLogActivity(opp, 'u-linh'), true);
  assert.equal(canLogActivity(opp, 'u-an'), false);
});

test('chủ sở hữu có thể thêm nhiều thành viên và tạo audit log', () => {
  const updated = addMembersToOpportunity(base(), 'u-phong', ['u-ha', 'u-tuan'], TEAM, now);
  assert.deepEqual(updated.memberIds, ['u-linh', 'u-minh', 'u-ha', 'u-tuan']);
  assert.equal(updated.audit[0].type, 'member_added');
  assert.match(updated.audit[0].summary, /Võ Thu Hà/);
});

test('thêm member bỏ qua owner, thành viên trùng lặp và ID không hợp lệ', () => {
  const updated = addMembersToOpportunity(base(), 'u-phong', ['u-phong', 'u-linh', 'u-linh', 'not-real'], TEAM, now);
  assert.deepEqual(updated.memberIds, ['u-linh', 'u-minh']);
  assert.equal(updated.audit.length, base().audit.length);
});

test('thành viên được chia sẻ không thể tự thêm người khác', () => {
  assert.throws(() => addMembersToOpportunity(base(), 'u-linh', ['u-ha'], TEAM, now), /Chỉ chủ sở hữu/);
});

test('member được ghi hoạt động và hoạt động được ghi vào nhật ký', () => {
  const updated = recordActivity(base(), 'u-linh', { type: 'call', title: 'Gọi khách hàng', note: 'Khách hẹn trao đổi tuần sau.' }, TEAM, now);
  assert.equal(updated.activities[0].actorId, 'u-linh');
  assert.equal(updated.activities[0].title, 'Gọi khách hàng');
  assert.equal(updated.audit[0].type, 'activity_logged');
});

test('không cho người chưa tham gia ghi hoạt động và yêu cầu đủ nội dung', () => {
  assert.throws(() => recordActivity(base(), 'u-an', { title: 'Gọi khách', note: 'Trao đổi' }, TEAM, now), /chủ sở hữu hoặc thành viên/);
  assert.throws(() => recordActivity(base(), 'u-linh', { title: '', note: 'Nội dung' }, TEAM, now), /tiêu đề/);
  assert.throws(() => recordActivity(base(), 'u-linh', { title: 'Gọi khách', note: ' ' }, TEAM, now), /nội dung/);
});

test('chỉ chủ sở hữu mới được xóa thành viên chia sẻ', () => {
  assert.throws(() => removeSharedMember(base(), 'u-linh', 'u-minh', TEAM, now), /Chỉ chủ sở hữu/);
  const updated = removeSharedMember(base(), 'u-phong', 'u-minh', TEAM, now);
  assert.deepEqual(updated.memberIds, ['u-linh']);
  assert.equal(updated.audit[0].type, 'member_removed');
});

test('chuyển owner thay đổi chủ sở hữu, giữ chủ cũ trong team và ghi log có lý do', () => {
  const updated = transferOwnership(base(), 'u-phong', 'u-linh', 'Phân công Linh điều phối thương vụ', TEAM, now);
  assert.equal(updated.ownerId, 'u-linh');
  assert.deepEqual(updated.memberIds, ['u-minh', 'u-phong']);
  assert.equal(updated.audit[0].type, 'owner_transferred');
  assert.equal(updated.audit[0].details.reason, 'Phân công Linh điều phối thương vụ');
});

test('chuyển owner từ member không được phép và lý do là bắt buộc', () => {
  assert.throws(() => transferOwnership(base(), 'u-linh', 'u-minh', 'Lý do', TEAM, now), /Chỉ chủ sở hữu/);
  assert.throws(() => transferOwnership(base(), 'u-phong', 'u-linh', '', TEAM, now), /lý do chuyển quyền/);
  assert.throws(() => transferOwnership(base(), 'u-phong', 'u-phong', 'Lý do', TEAM, now), /chủ sở hữu hiện tại/);
});

test('danh sách thành viên khả dụng loại trừ owner và members hiện tại', () => {
  const ids = getAvailableMembers(base(), TEAM).map((person) => person.id);
  assert.deepEqual(ids, ['u-an', 'u-ha', 'u-tuan', 'u-thao']);
});
