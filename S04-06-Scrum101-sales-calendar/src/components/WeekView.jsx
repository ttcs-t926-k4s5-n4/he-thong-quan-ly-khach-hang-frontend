import React from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Video 
} from 'lucide-react';
import { 
  getWeekDays, 
  isSameDay, 
  timeToMinutes, 
  formatDateISO 
} from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function WeekView({
  currentDate,
  events,
  conflictsMap,
  onSelectDate,
  onSelectEvent,
  onNewEventAtSlot
}) {
  const weekDays = getWeekDays(currentDate);
  const weekdaysName = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Khung giờ từ 08:00 đến 20:00 (12 tiếng)
  const startHour = 8;
  const totalHours = 12; // 8:00 -> 20:00
  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i);

  return (
    <div className="week-view-container">
      {/* Hàng Header ngày trong tuần */}
      <div className="week-header-row">
        <div className="week-time-gutter-header" />
        {weekDays.map((d, index) => {
          const isToday = isSameDay(d, new Date('2026-10-18'));
          const isSelected = isSameDay(d, currentDate);

          return (
            <div 
              key={index} 
              className={`week-day-header-cell ${isToday ? 'is-today' : ''}`}
              style={{
                outline: isSelected ? '2px solid var(--primary)' : 'none',
                outlineOffset: '-2px'
              }}
              onClick={() => onSelectDate(d)}
            >
              <span className="week-day-name">{weekdaysName[index]}</span>
              <div className="week-day-date" style={{ color: isToday ? 'var(--primary)' : 'inherit' }}>
                {d.getDate()}/{d.getMonth() + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dải hiển thị Công việc có hạn (Deadlines row) - Tiêu chí AC2 */}
      <div className="week-deadlines-bar">
        <div className="deadlines-label">
          <CheckSquare size={13} />
          <span>Hạn Chót</span>
        </div>

        {weekDays.map((d, index) => {
          const dateStr = formatDateISO(d);
          const dayTasks = events.filter(e => e.date === dateStr && e.type === 'TASK');

          return (
            <div key={index} className="deadlines-day-col">
              {dayTasks.map(task => (
                <div 
                  key={task.id}
                  className="event-chip chip-task"
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                    opacity: task.status === 'COMPLETED' ? 0.6 : 1
                  }}
                  onClick={() => onSelectEvent(task)}
                  title={`Việc có hạn: ${task.title} (Hạn: ${task.dueTime})`}
                >
                  <span style={{ fontWeight: 800 }}>⏰ {task.dueTime}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Lưới thời gian & Cuộc họp theo giờ */}
      <div className="week-grid-body">
        {/* Cột trục thời gian */}
        <div className="time-axis-col">
          {hours.map(hour => (
            <div key={hour} className="time-slot-label">
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* 7 Cột tương ứng 7 ngày */}
        {weekDays.map((d, colIndex) => {
          const dateStr = formatDateISO(d);
          const dayMeetings = events.filter(e => e.date === dateStr && e.type === 'MEETING');

          return (
            <div 
              key={colIndex} 
              className="week-day-column"
              onDoubleClick={(e) => {
                if (onNewEventAtSlot) {
                  // Ước tính giờ theo tọa độ click
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  const clickedHour = Math.min(19, Math.max(8, Math.floor(startHour + clickY / 60)));
                  onNewEventAtSlot(d, `${String(clickedHour).padStart(2, '0')}:00`);
                }
              }}
            >
              {/* Các đường kẻ ngang mỗi tiếng */}
              {hours.map(hour => (
                <div key={hour} className="hour-slot-guideline" />
              ))}

              {/* Thẻ cuộc họp được đặt vị trí tuyệt đối (Absolute Positioning) */}
              {dayMeetings.map(meeting => {
                const startMins = timeToMinutes(meeting.startTime);
                const endMins = timeToMinutes(meeting.endTime);
                const baseMins = startHour * 60;

                // Tính toán top & height (mỗi giờ = 60px)
                const top = Math.max(0, ((startMins - baseMins) / 60) * 60);
                const durationMins = Math.max(30, endMins - startMins);
                const height = (durationMins / 60) * 60 - 2;

                const isConflict = conflictsMap.has(meeting.id);

                return (
                  <div
                    key={meeting.id}
                    className={`week-event-card card-meeting ${isConflict ? 'has-conflict' : ''}`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`
                    }}
                    onClick={() => onSelectEvent(meeting)}
                    title={`${meeting.title} (${meeting.startTime} - ${meeting.endTime})`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="card-time">
                        {meeting.startTime} - {meeting.endTime}
                      </span>
                      {isConflict && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ef4444', fontWeight: 800 }}>
                          <AlertTriangle size={12} />
                          <span style={{ fontSize: '0.62rem' }}>TRÙNG</span>
                        </div>
                      )}
                    </div>

                    <div className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {meeting.title}
                    </div>

                    {height > 45 && meeting.company && (
                      <div className="card-client" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        🏢 {meeting.company}
                      </div>
                    )}

                    {/* Hiển thị avatar người tham gia nếu thẻ đủ cao */}
                    {height > 65 && meeting.attendees && (
                      <div className="attendees-avatars-cluster" style={{ marginTop: 'auto' }}>
                        {meeting.attendees.map(uId => {
                          const user = MOCK_USERS.find(u => u.id === uId);
                          if (!user) return null;
                          return (
                            <img 
                              key={uId}
                              src={user.avatar} 
                              alt={user.name} 
                              className="cluster-avatar"
                              title={user.name}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
