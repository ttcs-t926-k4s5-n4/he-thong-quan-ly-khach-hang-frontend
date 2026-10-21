import React from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  MapPin, 
  Video, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Plus 
} from 'lucide-react';
import { 
  getWeekDays, 
  isSameDay, 
  formatDateISO, 
  formatDateVietnamese 
} from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function MobileAgendaView({
  currentDate,
  events,
  conflictsMap,
  onSelectDate,
  onSelectEvent,
  onToggleTaskComplete,
  onOpenNewEvent
}) {
  const weekDays = getWeekDays(currentDate);
  const weekdaysShort = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const dateStr = formatDateISO(currentDate);
  const dayEvents = events
    .filter(e => e.date === dateStr)
    .sort((a, b) => {
      const timeA = a.startTime || a.dueTime || '00:00';
      const timeB = b.startTime || b.dueTime || '00:00';
      return timeA.localeCompare(timeB);
    });

  return (
    <div className="mobile-agenda-container">
      {/* Dải trượt chọn ngày ngang (Touch-friendly Date Strip Carousel) */}
      <div className="mobile-date-strip">
        {weekDays.map((d, idx) => {
          const isSelected = isSameDay(d, currentDate);
          const isToday = isSameDay(d, new Date('2026-10-18'));
          const curDateStr = formatDateISO(d);
          
          const dEvents = events.filter(e => e.date === curDateStr);
          const hasMeeting = dEvents.some(e => e.type === 'MEETING');
          const hasTask = dEvents.some(e => e.type === 'TASK');
          const hasConflict = dEvents.some(e => conflictsMap.has(e.id));

          return (
            <div
              key={idx}
              className={`mobile-date-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectDate(d)}
            >
              <span className="mobile-pill-day">{weekdaysShort[idx]}</span>
              <span className="mobile-pill-num">{d.getDate()}</span>
              
              <div className="mobile-pill-dots">
                {hasConflict && <span className="badge-dot conflict" />}
                {hasMeeting && <span className="badge-dot meeting" />}
                {hasTask && <span className="badge-dot task" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tiêu đề ngày đang chọn trên Mobile */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{formatDateVietnamese(currentDate)}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {dayEvents.length} lịch hẹn & việc cần làm
          </span>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => onOpenNewEvent(currentDate)}
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <Plus size={14} />
          <span>Thêm</span>
        </button>
      </div>

      {/* Danh sách thẻ sự kiện Mobile (Agenda Cards) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {dayEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <CalendarIcon size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>Không có lịch trong ngày này</p>
          </div>
        ) : (
          dayEvents.map(event => {
            const isMeeting = event.type === 'MEETING';
            const isConflict = conflictsMap.has(event.id);

            return (
              <div
                key={event.id}
                className={`mobile-event-card ${isMeeting ? 'is-meeting' : 'is-task'}`}
                onClick={() => onSelectEvent(event)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        fontSize: '0.78rem', 
                        fontFamily: 'var(--font-mono)', 
                        fontWeight: 800,
                        color: isMeeting ? 'var(--meeting-color)' : 'var(--task-color)'
                      }}
                    >
                      {isMeeting ? `${event.startTime} - ${event.endTime}` : `Hạn: ${event.dueTime}`}
                    </span>
                    <span style={{ fontSize: '0.68rem', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>
                      {isMeeting ? 'Cuộc gặp' : 'Việc có hạn'}
                    </span>
                  </div>

                  {isConflict && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--danger-border)', fontSize: '0.7rem', fontWeight: 800 }}>
                      <AlertTriangle size={12} />
                      TRÙNG LỊCH
                    </span>
                  )}
                </div>

                <div 
                  style={{ 
                    fontWeight: 700, 
                    fontSize: '0.92rem',
                    textDecoration: (!isMeeting && event.status === 'COMPLETED') ? 'line-through' : 'none',
                    opacity: (!isMeeting && event.status === 'COMPLETED') ? 0.6 : 1
                  }}
                >
                  {event.title}
                </div>

                {event.company && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    🏢 {event.company}
                  </div>
                )}

                {/* Chân thẻ Mobile: Người tham gia & Thao tác */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                  {isMeeting && event.attendees ? (
                    <div className="attendees-avatars-cluster">
                      {event.attendees.map(uId => {
                        const user = MOCK_USERS.find(u => u.id === uId);
                        if (!user) return null;
                        return (
                          <img 
                            key={uId}
                            src={user.avatar} 
                            alt={user.name} 
                            className="cluster-avatar"
                            style={{ width: '22px', height: '22px' }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Giao cho: {MOCK_USERS.find(u => u.id === event.assignedTo)?.name}
                    </span>
                  )}

                  {!isMeeting && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleTaskComplete) onToggleTaskComplete(event.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: event.status === 'COMPLETED' ? 'var(--success-border)' : 'var(--primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {event.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      {event.status === 'COMPLETED' ? 'Đã xong' : 'Xong việc'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
