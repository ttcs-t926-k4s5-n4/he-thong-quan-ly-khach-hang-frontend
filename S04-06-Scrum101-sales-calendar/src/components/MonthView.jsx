import React from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';
import { getMonthDays, isSameDay } from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function MonthView({
  currentDate,
  events,
  conflictsMap,
  onSelectDate,
  onSelectEvent,
  onSwitchToDayView
}) {
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const days = getMonthDays(year, monthIndex);

  const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  return (
    <div className="month-view-container">
      {/* Hàng tiêu đề các thứ trong tuần */}
      <div className="month-weekdays-header">
        {weekdays.map((day, idx) => (
          <div key={idx} style={{ color: idx >= 5 ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Lưới các ngày trong tháng */}
      <div className="month-grid">
        {days.map((dayObj, index) => {
          const dateStr = dayObj.dateString;
          const isSelected = isSameDay(dayObj.date, currentDate);

          // Lọc các sự kiện trong ngày này
          const dayEvents = events.filter(e => e.date === dateStr);
          const meetings = dayEvents.filter(e => e.type === 'MEETING');
          const tasks = dayEvents.filter(e => e.type === 'TASK');
          const hasDayConflict = dayEvents.some(e => conflictsMap.has(e.id));

          // Giới hạn hiển thị 3 sự kiện đầu tiên trên ô ngày
          const visibleEvents = dayEvents.slice(0, 3);
          const hiddenCount = dayEvents.length - visibleEvents.length;

          return (
            <div 
              key={index}
              className={`month-day-cell ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${dayObj.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectDate(dayObj.date)}
              onDoubleClick={() => {
                onSelectDate(dayObj.date);
                if (onSwitchToDayView) onSwitchToDayView();
              }}
              title="Nhấp đúp chuột để chuyển sang chế độ xem Ngày chi tiết"
            >
              {/* Tiêu đề ô ngày */}
              <div className="day-header-row">
                <span className="day-number">
                  {dayObj.date.getDate()}
                </span>

                {/* Các chấm trạng thái tóm tắt */}
                <div className="day-badges-summary">
                  {hasDayConflict && (
                    <span className="badge-dot conflict" title="Có xung đột lịch trùng nhau" />
                  )}
                  {meetings.length > 0 && (
                    <span className="badge-dot meeting" title={`${meetings.length} cuộc gặp`} />
                  )}
                  {tasks.length > 0 && (
                    <span className="badge-dot task" title={`${tasks.length} công việc có hạn`} />
                  )}
                </div>
              </div>

              {/* Danh sách các chip sự kiện trong ô ngày */}
              <div className="day-events-list">
                {visibleEvents.map(event => {
                  const isConflict = conflictsMap.has(event.id);
                  const isMeeting = event.type === 'MEETING';

                  return (
                    <div
                      key={event.id}
                      className={`event-chip ${isMeeting ? 'chip-meeting' : 'chip-task'} ${isConflict ? 'has-conflict' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      title={`${event.title} (${isMeeting ? `${event.startTime} - ${event.endTime}` : `Hạn: ${event.dueTime}`})`}
                    >
                      {isConflict ? (
                        <AlertTriangle size={11} color="var(--danger-border)" />
                      ) : isMeeting ? (
                        <CalendarIcon size={11} />
                      ) : (
                        <CheckSquare size={11} />
                      )}
                      
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                        {isMeeting ? event.startTime : event.dueTime}
                      </span>

                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.company ? `${event.company} - ${event.title}` : event.title}
                      </span>
                    </div>
                  );
                })}

                {hiddenCount > 0 && (
                  <div 
                    className="more-events-indicator"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(dayObj.date);
                      if (onSwitchToDayView) onSwitchToDayView();
                    }}
                  >
                    +{hiddenCount} sự kiện khác...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
