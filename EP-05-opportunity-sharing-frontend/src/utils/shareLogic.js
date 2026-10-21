export function getActorRole(opportunity, actorId) {
  if (!opportunity || !actorId) return 'none';
  if (opportunity.ownerId === actorId) return 'owner';
  if (opportunity.memberIds?.includes(actorId)) return 'member';
  return 'none';
}

export function canManageSharing(opportunity, actorId) {
  return getActorRole(opportunity, actorId) === 'owner';
}

export function canLogActivity(opportunity, actorId) {
  return ['owner', 'member'].includes(getActorRole(opportunity, actorId));
}

const personName = (team, id) => team.find((person) => person.id === id)?.name || 'Người dùng không xác định';
const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function addAudit(opportunity, entry) {
  return [...(opportunity.audit || []), entry].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addMembersToOpportunity(opportunity, actorId, requestedIds, team, now = new Date().toISOString()) {
  if (!canManageSharing(opportunity, actorId)) throw new Error('Chỉ chủ sở hữu mới được thêm thành viên chia sẻ.');
  const existing = new Set([opportunity.ownerId, ...(opportunity.memberIds || [])]);
  const validIds = [...new Set(requestedIds)].filter((id) => team.some((person) => person.id === id) && !existing.has(id));
  if (!validIds.length) return { ...opportunity };
  const names = validIds.map((id) => personName(team, id));
  return {
    ...opportunity,
    memberIds: [...(opportunity.memberIds || []), ...validIds],
    updatedAt: now,
    audit: addAudit(opportunity, {
      id: newId('audit-member-added'), type: 'member_added', actorId, createdAt: now,
      summary: `Chia sẻ cơ hội với ${names.join(', ')}.`, details: { memberIds: validIds },
    }),
  };
}

export function removeSharedMember(opportunity, actorId, memberId, team, now = new Date().toISOString()) {
  if (!canManageSharing(opportunity, actorId)) throw new Error('Chỉ chủ sở hữu mới được quản lý thành viên chia sẻ.');
  if (!(opportunity.memberIds || []).includes(memberId)) throw new Error('Người này không nằm trong danh sách thành viên chia sẻ.');
  const name = personName(team, memberId);
  return {
    ...opportunity,
    memberIds: opportunity.memberIds.filter((id) => id !== memberId),
    updatedAt: now,
    audit: addAudit(opportunity, {
      id: newId('audit-member-removed'), type: 'member_removed', actorId, createdAt: now,
      summary: `Đã bỏ quyền chia sẻ của ${name}.`, details: { memberId },
    }),
  };
}

export function recordActivity(opportunity, actorId, form, team, now = new Date().toISOString()) {
  if (!canLogActivity(opportunity, actorId)) throw new Error('Bạn cần là chủ sở hữu hoặc thành viên được chia sẻ để ghi hoạt động.');
  const title = String(form.title || '').trim();
  const note = String(form.note || '').trim();
  const type = ['call', 'meeting', 'email', 'note', 'task'].includes(form.type) ? form.type : 'note';
  if (!title) throw new Error('Vui lòng nhập tiêu đề hoạt động.');
  if (!note) throw new Error('Vui lòng nhập nội dung hoạt động.');
  const activity = { id: newId('activity'), type, title, note, actorId, createdAt: now };
  return {
    ...opportunity,
    activities: [activity, ...(opportunity.activities || [])],
    updatedAt: now,
    audit: addAudit(opportunity, {
      id: newId('audit-activity'), type: 'activity_logged', actorId, createdAt: now,
      summary: `${personName(team, actorId)} ghi hoạt động: ${title}.`, details: { activityId: activity.id, activityType: type },
    }),
  };
}

export function transferOwnership(opportunity, actorId, newOwnerId, reason, team, now = new Date().toISOString()) {
  if (!canManageSharing(opportunity, actorId)) throw new Error('Chỉ chủ sở hữu hiện tại mới được chuyển quyền sở hữu.');
  if (!team.some((person) => person.id === newOwnerId)) throw new Error('Vui lòng chọn người sở hữu mới hợp lệ.');
  if (newOwnerId === opportunity.ownerId) throw new Error('Người được chọn đã là chủ sở hữu hiện tại.');
  const cleanReason = String(reason || '').trim();
  if (!cleanReason) throw new Error('Vui lòng nhập lý do chuyển quyền sở hữu để ghi nhật ký.');
  const previousOwnerId = opportunity.ownerId;
  const previousOwnerName = personName(team, previousOwnerId);
  const nextOwnerName = personName(team, newOwnerId);
  const memberIds = new Set(opportunity.memberIds || []);
  memberIds.delete(newOwnerId);
  if (previousOwnerId !== newOwnerId) memberIds.add(previousOwnerId);
  return {
    ...opportunity,
    ownerId: newOwnerId,
    memberIds: [...memberIds],
    updatedAt: now,
    audit: addAudit(opportunity, {
      id: newId('audit-owner-transfer'), type: 'owner_transferred', actorId, createdAt: now,
      summary: `Chuyển quyền sở hữu từ ${previousOwnerName} sang ${nextOwnerName}.`,
      details: { previousOwnerId, newOwnerId, reason: cleanReason },
    }),
  };
}

export function getAvailableMembers(opportunity, team) {
  const taken = new Set([opportunity.ownerId, ...(opportunity.memberIds || [])]);
  return team.filter((person) => !taken.has(person.id));
}
