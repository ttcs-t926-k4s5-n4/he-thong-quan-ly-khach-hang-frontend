// Utility functions for SCRUM-102 Customer Interaction Timeline

export const ACTIVITY_TYPES = [
  { key: 'ALL', label: 'Tất cả tương tác', icon: 'Layers', color: '#6366f1' },
  { key: 'CALL', label: '📞 Cuộc gọi', icon: 'PhoneCall', color: '#0ea5e9' },
  { key: 'MEETING', label: '🤝 Cuộc họp', icon: 'Users', color: '#8b5cf6' },
  { key: 'EMAIL', label: '✉️ Email trao đổi', icon: 'Mail', color: '#10b981' },
  { key: 'OPPORTUNITY_CHANGE', label: '💼 Thay đổi cơ hội', icon: 'Briefcase', color: '#f59e0b' },
  { key: 'QUOTE_SENT', label: '📄 Báo giá đã gửi', icon: 'FileText', color: '#ec4899' },
  { key: 'HANDOVER', label: '🤝 Bàn giao & CSKH', icon: 'ArrowRightLeft', color: '#a855f7' },
  { key: 'NOTE', label: '📝 Ghi chú nội bộ', icon: 'StickyNote', color: '#64748b' }
];

export function formatVND(amount) {
  if (amount == null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatVNDCompact(amount) {
  if (amount == null || isNaN(amount)) return '0 ₫';
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(2).replace(/\.00$/, '')} Tỷ ₫`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace(/\.0$/, '')} Triệu ₫`;
  }
  return formatVND(amount);
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} • ${day}/${month}/${year}`;
}

export function formatDateOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getRelativeTimeVi(isoString, baseDate = new Date('2026-10-18T08:00:00Z')) {
  if (!isoString) return '';
  const target = new Date(isoString);
  const diffMs = baseDate.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60 && diffMinutes >= 0) {
    return `${diffMinutes} phút trước`;
  }
  if (diffHours < 24 && diffHours >= 0) {
    return `${diffHours} giờ trước`;
  }
  if (diffDays === 0) {
    return 'Hôm nay';
  }
  if (diffDays === 1) {
    return 'Hôm qua';
  }
  if (diffDays < 30) {
    return `${diffDays} ngày trước`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} tháng trước`;
}

export function filterAndSortTimelineEvents({
  events,
  customerId,
  selectedType = 'ALL',
  selectedActor = 'ALL',
  searchQuery = '',
  timeRange = 'ALL', // '7_DAYS', '30_DAYS', 'THIS_QUARTER', 'ALL'
  sortOrder = 'DESC', // 'DESC' (mới nhất trước) | 'ASC' (cũ nhất trước)
  onlyMilestones = false
}) {
  let filtered = events.filter(evt => evt.customerId === customerId);

  // Filter by Type
  if (selectedType !== 'ALL') {
    filtered = filtered.filter(evt => evt.type === selectedType);
  }

  // Filter by Actor
  if (selectedActor !== 'ALL') {
    filtered = filtered.filter(evt => evt.actorId === selectedActor);
  }

  // Filter by Only Milestones
  if (onlyMilestones) {
    filtered = filtered.filter(evt => evt.isKeyMilestone);
  }

  // Filter by Search Query
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(evt => {
      const matchTitle = evt.title && evt.title.toLowerCase().includes(q);
      const matchSummary = evt.summary && evt.summary.toLowerCase().includes(q);
      const matchActor = evt.actorName && evt.actorName.toLowerCase().includes(q);
      const matchQuoteCode = evt.details?.quoteCode && evt.details.quoteCode.toLowerCase().includes(q);
      const matchOppCode = evt.details?.opportunityCode && evt.details.opportunityCode.toLowerCase().includes(q);
      const matchContact = evt.details?.contactPerson && evt.details.contactPerson.toLowerCase().includes(q);
      const matchNotes = evt.details?.notes && evt.details.notes.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchActor || matchQuoteCode || matchOppCode || matchContact || matchNotes;
    });
  }

  // Filter by Time Range (assuming current demo date 2026-10-18)
  if (timeRange !== 'ALL') {
    const refDate = new Date('2026-10-18T23:59:59Z').getTime();
    filtered = filtered.filter(evt => {
      const evtTime = new Date(evt.timestamp).getTime();
      const diffDays = (refDate - evtTime) / (1000 * 60 * 60 * 24);
      if (timeRange === '7_DAYS') return diffDays <= 7 && diffDays >= 0;
      if (timeRange === '30_DAYS') return diffDays <= 30 && diffDays >= 0;
      if (timeRange === 'THIS_QUARTER') return diffDays <= 90 && diffDays >= 0;
      return true;
    });
  }

  // Sort by Timestamp
  filtered.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === 'DESC' ? timeB - timeA : timeA - timeB;
  });

  return filtered;
}

export function groupEventsByDate(events) {
  const groups = {};
  events.forEach(evt => {
    const dateKey = formatDateOnly(evt.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = {
        dateString: dateKey,
        relativeLabel: getRelativeTimeVi(evt.timestamp),
        items: []
      };
    }
    groups[dateKey].items.push(evt);
  });
  return Object.values(groups);
}

export function calculateTimelineStats(events) {
  const total = events.length;
  const quotesCount = events.filter(e => e.type === 'QUOTE_SENT').length;
  const oppChangesCount = events.filter(e => e.type === 'OPPORTUNITY_CHANGE').length;
  const meetingsAndCalls = events.filter(e => e.type === 'MEETING' || e.type === 'CALL').length;
  const handoversCount = events.filter(e => e.type === 'HANDOVER').length;
  const totalQuoteValue = events
    .filter(e => e.type === 'QUOTE_SENT' && e.details?.finalAmount)
    .reduce((sum, e) => sum + e.details.finalAmount, 0);

  return {
    total,
    quotesCount,
    oppChangesCount,
    meetingsAndCalls,
    handoversCount,
    totalQuoteValue
  };
}
