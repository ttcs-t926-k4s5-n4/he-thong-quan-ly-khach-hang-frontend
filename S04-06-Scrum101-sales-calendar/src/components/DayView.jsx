import React from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  MapPin, 
  Video, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Users, 
  Plus 
} from 'lucide-react';
import { formatDateISO, formatDateVietnamese } from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function DayView({
  currentDate,
  events,
  conflictsMap,
  onSelectEvent,
  onToggleTaskComplete,
  onOpenNewEvent
}) {
  const dateStr = formatDateISO(currentDate);
  const dayEvents = events
    .filter(e => e.date === dateStr)
    .sort((a, b) => {
      const timeA = a.startTime || a.dueTime || '00:00';
      const timeB = b.startTime || b.dueTime || '00:00';
      return timeA.localeCompare(timeB);
    });

  const meetings = dayEvents.filter(e => e.type === 'MEETING');
  const tasks = dayEvents.filter(e => e.type === 'TASK');

  return (
    <div className="day-view-container">
      {/* Thẻ tóm tắt ngày */}
      <div className="day-header-summary-card">
        <div className="day-summary-left">
          <h2>{formatDateVietnamese(currentDate)}</h2>
          <p>
            Tổng cộng: <strong style={{ color: 'var(--meeting-color)' }}>{meetings.length} cuộc gặp</strong> •{' '}
            <strong style={{ color: 'var(--task-color)' }}>{tasks.length} công việc có hạn</strong>
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => onOpenNewEvent(currentDate)}
        >
          <Plus size={16} />
          <span>Thêm Vào Ngày Này</span>
        </button>
      </div>

      {/* Danh sách Dòng thời gian sự kiện trong ngày (Cả Cuộc gặp & Việc có hạn) */}
      <div className="day-timeline-list">
        {dayEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <CalendarIcon size={44} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Không có cuộc gặp hoặc công việc nào trong ngày này</p>
            <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Nhấn nút "Thêm Vào Ngày Này" để bố trí lịch làm việc mới</p>
          </div>
        ) : (
          dayEvents.map(event => {
            const isMeeting = event.type === 'MEETING';
            const isConflict = conflictsMap.has(event.id);
            const conflictDetails = isConflict ? conflictsMap.get(event.id) : [];

            return (
              <div 
                key={event.id}
                className={`timeline-event-item ${isConflict ? 'is-conflict' : ''}`}
                onClick={() => onSelectEvent(event)}
                style={{ cursor: 'pointer' }}
              >
                {/* Cột thời gian bên trái */}
                <div className="timeline-time-col">
                  <span className="timeline-time-val">
                    {isMeeting ? event.startTime : event.dueTime}
                  </span>
                  <span className="timeline-duration">
                    {isMeeting ? `đến ${event.endTime}` : 'Hạn chót'}
                  </span>
                </div>

                {/* Cột nội dung chi tiết sự kiện */}
                <div className="timeline-content-col">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`timeline-type-pill ${isMeeting ? 'meeting' : 'task'}`}>
                        {isMeeting ? <CalendarIcon size={12} /> : <CheckSquare size={12} />}
                        {isMeeting ? 'Cuộc Gặp Đã Đặt' : 'Công Việc Có Hạn'}
                      </span>

                      {isConflict && (
                        <span 
                          style={{
                            background: 'var(--danger-bg)',
                            color: 'var(--danger-border)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid var(--danger-border)'
                          }}
                        >
                          <AlertTriangle size={12} />
                          Trùng Giờ Với Sự Kiện Khác
                        </span>
                      )}
                    </div>

                    {!isMeeting && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleTaskComplete) onToggleTaskComplete(event.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: event.status === 'COMPLETED' ? 'var(--success-border)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        {event.status === 'COMPLETED' ? (
                          <>
                            <CheckCircle2 size={16} color="var(--success-border)" />
                            <span>Đã hoàn thành</span>
                          </>
                        ) : (
                          <>
                            <Circle size={16} />
                            <span>Đánh dấu xong</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <h3 
                    className="timeline-title"
                    style={{
                      textDecoration: (!isMeeting && event.status === 'COMPLETED') ? 'line-through' : 'none',
                      opacity: (!isMeeting && event.status === 'COMPLETED') ? 0.6 : 1
                    }}
                  >
                    {event.title}
                  </h3>

                  {/* Thông tin Khách hàng, Địa điểm, Họp trực tuyến */}
                  <div className="timeline-meta-row">
                    {event.company && (
                      <div className="timeline-meta-item">
                        <Building2 size={14} color="var(--primary)" />
                        <strong>{event.company}</strong>
                        {event.clientName && <span>({event.clientName})</span>}
                      </div>
                    )}

                    {event.location && (
                      <div className="timeline-meta-item">
                        {event.meetingType === 'ONLINE' ? (
                          <Video size={14} color="var(--meeting-color)" />
                        ) : (
                          <MapPin size={14} color="#f43f5e" />
                        )}
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Cảnh báo xung đột chi tiết (nếu có) */}
                  {isConflict && conflictDetails.length > 0 && (
                    <div 
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderLeft: '3px solid var(--danger-border)',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        color: '#fca5a5'
                      }}
                    >
                      <strong>⚠️ Xung đột lịch:</strong> Trùng giờ với "
                      <em>{conflictDetails[0].targetTitle}</em>" ({conflictDetails[0].targetTime}).
                      Nhấn vào thẻ để điều phối hoặc chuyển giờ rảnh.
                    </div>
                  )}

                  {/* Danh sách người tham gia (Attendees) */}
                  {isMeeting && event.attendees && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tham gia:</span>
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
                              title={`${user.name} (${user.roleTitle})`}
                              style={{ borderColor: user.color }}
                            />
                          );
                        })}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {event.attendees.map(uId => MOCK_USERS.find(u => u.id === uId)?.name).filter(Boolean).join(', ')}
                      </span>
                    </div>
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
