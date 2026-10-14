export const SLA_HOURS = 24;
export const isSlaOverdue = (lead, now = Date.now(), slaHours = SLA_HOURS) => {
  if (lead.contactedAt || lead.status === 'Đã liên hệ' || lead.status === 'Đã chuyển đổi') return false;
  const created = new Date(lead.createdAt).getTime();
  return Number.isFinite(created) && (now - created) > slaHours * 60 * 60 * 1000;
};
export function acceptLead(lead, actor = 'Bạn') {
  if (lead.status === 'Đã chuyển đổi') throw new Error('Lead đã chuyển đổi và không thể chỉnh sửa.');
  return { ...lead, status: 'Đang chăm sóc', owner: actor, acceptedAt: new Date().toISOString(), activities: [...(lead.activities || []), { at: new Date().toISOString(), text: `${actor} đã nhận lead` }] };
}
export function rejectLead(lead, reason, actor = 'Bạn') {
  const cleanReason = String(reason || '').trim();
  if (!cleanReason) throw new Error('Vui lòng nhập lý do từ chối.');
  if (lead.status === 'Đã chuyển đổi') throw new Error('Lead đã chuyển đổi và không thể chỉnh sửa.');
  return { ...lead, status: 'Chờ phân bổ', owner: '', rejectionReason: cleanReason, rejectedAt: new Date().toISOString(), activities: [...(lead.activities || []), { at: new Date().toISOString(), text: `${actor} từ chối lead: ${cleanReason}` }] };
}
export function markContacted(lead, note = 'Đã ghi nhận liên hệ') {
  const at = new Date().toISOString();
  return { ...lead, status: 'Đang chăm sóc', contactedAt: at, lastContactNote: String(note || '').trim(), activities: [...(lead.activities || []), { at, text: String(note || 'Đã ghi nhận liên hệ').trim() }] };
}
export function makeManagerAlert(lead, now = Date.now()) {
  if (!isSlaOverdue(lead, now)) return null;
  return { id: `alert-${lead.id}`, leadId: lead.id, leadName: lead.name, message: `Lead ${lead.name} đã quá SLA 24 giờ và chưa được liên hệ.`, createdAt: new Date(now).toISOString(), status: 'Đã tạo cảnh báo (demo)' };
}
