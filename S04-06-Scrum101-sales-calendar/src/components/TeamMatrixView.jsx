import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Calendar, 
  Plus 
} from 'lucide-react';
import { 
  formatDateISO, 
  formatDateVietnamese, 
  timeToMinutes 
} from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function TeamMatrixView({
  currentDate,
  events,
  conflictsMap,
  selectedUserIds,
  onSelectEvent,
  onOpenSlotFinder,
  onNewEventAtSlot
}) {
  const dateStr = formatDateISO(currentDate);

  // Lọc danh sách thành viên đang được chọn để hiển thị
  const activeMembers = MOCK_USERS.filter(u => selectedUserIds.includes(u.id));

  // Khung giờ từ 08:00 đến 18:00 (10 tiếng làm việc)
  const startHour = 8;
  const totalHours = 10;
  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i);

  return (
    <div className="team-matrix-container">
      {/* Thanh thông tin chế độ Lịch Chồng Nhóm */}
      <div className="team-matrix-header">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--primary)" />
            <span>Ma Trận Lịch Chồng Cả Nhóm (Team Overlap Matrix)</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Ngày: <strong>{formatDateVietnamese(currentDate)}</strong> • So sánh lịch song song giữa các thành viên để bố trí cuộc họp không bị chồng chéo.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onOpenSlotFinder}
          style={{ fontSize: '0.82rem' }}
        >
          <Sparkles size={15} />
          <span>Đề Xuất Khung Giờ Trống Cả Nhóm</span>
        </button>
      </div>

      {/* Ma trận các cột thành viên */}
      <div 
        className="team-matrix-columns-wrap"
        style={{
          gridTemplateColumns: `70px repeat(${Math.max(1, activeMembers.length)}, minmax(200px, 1fr))`
        }}
      >
        {/* Cột góc trái: Trục giờ */}
        <div style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '12px 6px', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          GIỜ
        </div>

        {/* Tiêu đề từng thành viên */}
        {activeMembers.map(user => (
          <div key={user.id} className="matrix-member-header">
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${user.color}` }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: user.color, fontWeight: 600 }}>
                {user.role === 'TEAM_LEAD' ? '👑 Trưởng Nhóm' : user.roleTitle}
              </div>
            </div>
          </div>
        ))}

        {/* Thân ma trận: Trục giờ */}
        <div className="time-axis-col" style={{ height: `${totalHours * 60}px` }}>
          {hours.map(h => (
            <div key={h} className="time-slot-label" style={{ height: '60px' }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Cột sự kiện của từng thành viên */}
        {activeMembers.map(user => {
          // Lọc các sự kiện liên quan đến nhân viên này trong ngày
          const userDayEvents = events.filter(e => 
            e.date === dateStr &&
            (
              (e.type === 'MEETING' && (e.attendees || []).includes(user.id)) ||
              (e.type === 'TASK' && e.assignedTo === user.id)
            )
          );

          return (
            <div 
              key={user.id} 
              className="matrix-col-body"
              style={{ height: `${totalHours * 60}px` }}
              onDoubleClick={(e) => {
                if (onNewEventAtSlot) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  const clickedHour = Math.min(17, Math.max(8, Math.floor(startHour + clickY / 60)));
                  onNewEventAtSlot(currentDate, `${String(clickedHour).padStart(2, '0')}:00`, user.id);
                }
              }}
              title="Nhấp đúp chuột vào ô trống để xếp lịch hẹn với nhân viên này"
            >
              {/* Kẻ ô từng giờ */}
              {hours.map(h => (
                <div key={h} className="hour-slot-guideline" style={{ height: '60px' }} />
              ))}

              {/* Render sự kiện của nhân sự */}
              {userDayEvents.map(event => {
                const isMeeting = event.type === 'MEETING';
                const startTimeStr = isMeeting ? event.startTime : event.dueTime;
                const endTimeStr = isMeeting ? event.endTime : event.dueTime;

                const startMins = timeToMinutes(startTimeStr);
                const endMins = isMeeting ? timeToMinutes(endTimeStr) : startMins + 45;
                const baseMins = startHour * 60;

                const top = Math.max(0, ((startMins - baseMins) / 60) * 60);
                const durationMins = Math.max(35, endMins - startMins);
                const height = (durationMins / 60) * 60 - 4;

                const isConflict = conflictsMap.has(event.id);

                return (
                  <div
                    key={event.id}
                    className={`week-event-card ${isMeeting ? 'card-meeting' : 'card-task'} ${isConflict ? 'has-conflict' : ''}`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      borderLeftColor: user.color
                    }}
                    onClick={() => onSelectEvent(event)}
                    title={`${event.title} (${startTimeStr} - ${endTimeStr})`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="card-time" style={{ color: user.color }}>
                        {startTimeStr} {isMeeting ? `- ${endTimeStr}` : '(Hạn chót)'}
                      </span>
                      {isConflict && (
                        <AlertTriangle size={12} color="var(--danger-border)" />
                      )}
                    </div>

                    <div className="card-title" style={{ fontSize: '0.73rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {event.title}
                    </div>

                    {event.company && (
                      <div className="card-client" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.company}
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
