import React from 'react';
import { 
  FileText, 
  Briefcase, 
  PhoneCall, 
  Users, 
  Mail, 
  ArrowRightLeft, 
  StickyNote, 
  Paperclip, 
  ArrowRight, 
  Download, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { 
  groupEventsByDate, 
  formatDateTime, 
  formatVND, 
  formatVNDCompact,
  getRelativeTimeVi 
} from '../utils/timelineUtils';

export default function TimelineView({
  events,
  onSelectEvent,
  onResetFilters
}) {
  if (events.length === 0) {
    return (
      <div className="timeline-empty-state">
        <Inbox size={48} />
        <h3>Không tìm thấy tương tác nào phù hợp</h3>
        <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
          Vui lòng thử điều chỉnh lại bộ lọc loại hoạt động, người thực hiện hoặc từ khóa tìm kiếm.
        </p>
        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '1rem' }}
          onClick={onResetFilters}
        >
          Đặt lại toàn bộ bộ lọc
        </button>
      </div>
    );
  }

  const grouped = groupEventsByDate(events);

  return (
    <div className="timeline-section">
      {grouped.map((group, groupIdx) => (
        <div key={groupIdx} className="timeline-date-group">
          {/* Sticky Date Group Header */}
          <div className="date-group-header">
            <span className="date-header-dot" />
            <span>{group.dateString}</span>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>
              • {group.relativeLabel} ({group.items.length} tương tác)
            </span>
          </div>

          {/* Events List in Date Group */}
          <div className="timeline-events-list">
            {group.items.map(event => (
              <TimelineEventCard 
                key={event.id}
                event={event}
                onSelectEvent={onSelectEvent}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineEventCard({ event, onSelectEvent }) {
  // Determine card class and node icon
  let cardClass = 'timeline-event-card';
  let NodeIcon = Clock;
  let badgeClass = 'event-type-badge';

  switch (event.type) {
    case 'HANDOVER':
      cardClass += ' type-handover';
      NodeIcon = ArrowRightLeft;
      badgeClass += ' badge-handover';
      break;
    case 'QUOTE_SENT':
      cardClass += ' type-quote';
      NodeIcon = FileText;
      badgeClass += ' badge-quote';
      break;
    case 'OPPORTUNITY_CHANGE':
      cardClass += ' type-opp';
      NodeIcon = Briefcase;
      badgeClass += ' badge-opp';
      break;
    case 'MEETING':
      cardClass += ' type-meeting';
      NodeIcon = Users;
      badgeClass += ' badge-meeting';
      break;
    case 'CALL':
      cardClass += ' type-call';
      NodeIcon = PhoneCall;
      badgeClass += ' badge-call';
      break;
    case 'EMAIL':
      cardClass += ' type-email';
      NodeIcon = Mail;
      badgeClass += ' badge-email';
      break;
    case 'NOTE':
      cardClass += ' type-note';
      NodeIcon = StickyNote;
      badgeClass += ' badge-note';
      break;
    default:
      break;
  }

  return (
    <div className={cardClass}>
      {/* Node icon on spine */}
      <div className="event-node-dot" title={event.typeLabel}>
        <NodeIcon size={16} />
      </div>

      {/* Card Header */}
      <div className="card-header-row">
        <div>
          <span className={badgeClass}>
            <NodeIcon size={12} />
            <span>{event.typeLabel}</span>
          </span>
          {event.isKeyMilestone && (
            <span style={{
              marginLeft: '0.45rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              ★ Mốc quan trọng
            </span>
          )}
          <h3 className="card-title">{event.title}</h3>
        </div>

        {/* Timestamp & Actor */}
        <div className="card-time-actor">
          <div className="actor-badge" title={`Người thực hiện: ${event.actorName} (${event.actorRole})`}>
            <img 
              src={event.actorAvatar} 
              alt={event.actorName} 
              className="actor-avatar-mini" 
            />
            <span>{event.actorName}</span>
          </div>
          <span>•</span>
          <span title={formatDateTime(event.timestamp)}>
            {getRelativeTimeVi(event.timestamp)}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p className="card-summary">{event.summary}</p>

      {/* Specific Custom Blocks */}
      {/* 1. Quote Box */}
      {event.type === 'QUOTE_SENT' && event.details && (
        <div className="quote-highlight-box">
          <div className="quote-amount-display">
            <span className="quote-code-tag">MÃ BÁO GIÁ: {event.details.quoteCode}</span>
            <span className="quote-total">{formatVND(event.details.finalAmount)}</span>
            {event.details.discountPercent > 0 && (
              <span style={{ fontSize: '0.72rem', color: '#f472b6' }}>
                Đã áp dụng chiết khấu {event.details.discountPercent}% ({formatVND(event.details.discountAmount)})
              </span>
            )}
          </div>
          <button 
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            onClick={() => onSelectEvent(event)}
          >
            <span>Xem Bảng Chi Tiết Báo Giá</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* 2. Opportunity Stage Change Box */}
      {event.type === 'OPPORTUNITY_CHANGE' && event.details && (
        <div className="opp-stage-change-box">
          <div className="stage-arrow-transition">
            <span className="stage-badge-old">{event.details.oldStageLabel || 'Khởi tạo'}</span>
            <ArrowRight size={16} style={{ color: '#f59e0b' }} />
            <span className="stage-badge-new">{event.details.newStageLabel}</span>
          </div>
          {event.details.newProbability && (
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
              Xác suất thành công: {event.details.newProbability}%
            </span>
          )}
        </div>
      )}

      {/* 3. Handover Notes Box */}
      {event.type === 'HANDOVER' && event.details && (
        <div className="handover-notes-box">
          <div className="handover-notes-title">
            <Sparkles size={14} />
            <span>Lời dặn dò từ đồng nghiệp bàn giao ({event.details.fromMember}):</span>
          </div>
          <p className="handover-notes-text">
            "{event.details.personalAdvice}"
          </p>
        </div>
      )}

      {/* Card Footer: Attachments & View Details Button */}
      <div className="card-footer-row">
        <div className="attachments-mini-row">
          {event.details?.attachments?.map((att, i) => (
            <span key={i} className="attachment-pill" title={`${att.name} (${att.size})`}>
              <Paperclip size={12} />
              <span>{att.name}</span>
              <span style={{ opacity: 0.6 }}>({att.size})</span>
            </span>
          ))}
          {event.details?.duration && (
            <span className="attachment-pill" style={{ color: '#38bdf8' }}>
              <Clock size={12} />
              <span>Thời lượng: {event.details.duration}</span>
            </span>
          )}
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ fontSize: '0.75rem', padding: '0.28rem 0.65rem' }}
          onClick={() => onSelectEvent(event)}
        >
          <span>Chi tiết</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
