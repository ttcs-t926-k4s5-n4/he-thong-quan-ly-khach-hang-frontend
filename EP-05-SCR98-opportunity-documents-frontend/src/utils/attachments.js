export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function canAccessOpportunity(userId, opportunity) {
  if (!userId || !opportunity) return false;
  return userId === opportunity.ownerId || (opportunity.sharedUserIds || []).includes(userId);
}

export function canDownloadAttachment(userId, opportunity) {
  return canAccessOpportunity(userId, opportunity);
}

export function canUploadAttachment(userId, opportunity) {
  return canAccessOpportunity(userId, opportunity);
}

export function validateFiles(fileList, maxBytes = MAX_FILE_SIZE) {
  const files = Array.from(fileList || []);
  const accepted = [];
  const rejected = [];
  for (const file of files) {
    if (!file || typeof file.name !== 'string') rejected.push({ file, reason: 'Tệp không hợp lệ.' });
    else if (Number(file.size) > maxBytes) rejected.push({ file, reason: `Vượt giới hạn ${formatBytes(maxBytes)}.` });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

export function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes)) || Number(bytes) < 0) return '—';
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)} KB`;
  if (value < 1024 ** 3) return `${(value / (1024 ** 2)).toFixed(value < 10 * 1024 ** 2 ? 1 : 0)} MB`;
  return `${(value / (1024 ** 3)).toFixed(1)} GB`;
}

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim().toLocaleLowerCase('vi');
}

export function filterAttachments(attachments, query = '', typeFilter = 'all') {
  const normalizedQuery = normalizeSearch(query.trim());
  return (attachments || []).filter((attachment) => {
    const searchable = normalizeSearch([attachment.name, attachment.uploaderName, attachment.note, attachment.type].join(' '));
    return (!normalizedQuery || searchable.includes(normalizedQuery)) && (typeFilter === 'all' || classifyFile(attachment.name, attachment.type) === typeFilter);
  });
}

export function classifyFile(name = '', mimeType = '') {
  const lower = String(name).toLowerCase();
  const mime = String(mimeType).toLowerCase();
  if (mime.includes('pdf') || lower.endsWith('.pdf')) return 'pdf';
  if (/\.(doc|docx|odt|rtf)$/.test(lower) || mime.includes('word') || mime.includes('document')) return 'word';
  if (/\.(xls|xlsx|csv|ods)$/.test(lower) || mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) return 'sheet';
  if (/\.(ppt|pptx|odp)$/.test(lower) || mime.includes('presentation') || mime.includes('powerpoint')) return 'slides';
  if (/\.(png|jpe?g|gif|webp|svg|bmp)$/.test(lower) || mime.startsWith('image/')) return 'image';
  if (/\.(zip|rar|7z|tar|gz)$/.test(lower) || mime.includes('zip') || mime.includes('compressed')) return 'archive';
  if (mime.startsWith('text/') || /\.(txt|md|log)$/.test(lower)) return 'text';
  return 'other';
}

export function makeAttachmentRecord({ file, opportunity, user, now = new Date(), id }) {
  return {
    id: id || (globalThis.crypto?.randomUUID?.() ?? `file-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`),
    opportunityId: opportunity.id,
    name: file.name,
    size: Number(file.size) || 0,
    type: file.type || 'application/octet-stream',
    lastModified: Number(file.lastModified) || null,
    uploaderId: user.id,
    uploaderName: user.name,
    uploadedAt: now.toISOString(),
    note: '',
    blob: file,
  };
}

export function sortAttachments(attachments, sortOrder = 'newest') {
  return [...(attachments || [])].sort((a, b) => {
    const timeA = new Date(a.uploadedAt || 0).getTime();
    const timeB = new Date(b.uploadedAt || 0).getTime();
    if (sortOrder === 'oldest') return timeA - timeB;
    if (sortOrder === 'name') return String(a.name).localeCompare(String(b.name), 'vi');
    return timeB - timeA;
  });
}

export function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}
