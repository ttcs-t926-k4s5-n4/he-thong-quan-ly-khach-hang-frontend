import React from 'react';
import { Calendar, CheckSquare, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function CalendarStatsRow({ events, conflictsMap }) {
  // Compute stats
  const totalMeetings = events.filter(e => e.type === 'MEETING' && e.status !== 'CANCELLED').length;
  const totalTasks = events.filter(e => e.type === 'TASK').length;
  const completedTasks = events.filter(e => e.type === 'TASK' && e.status === 'COMPLETED').length;
  const urgentTasks = events.filter(e => e.type === 'TASK' && e.priority === 'URGENT' && e.status !== 'COMPLETED').length;
  
  // Unique conflicts count
  const conflictEventIds = Array.from(conflictsMap.keys());
  const conflictCount = Math.floor(conflictEventIds.length / 2);

  return (
    <div className="calendar-stats-row">
      {/* Thẻ 1: Tổng cuộc gặp đã đặt */}
      <div className="kpi-card">
        <div className="kpi-card-left">
          <span className="kpi-title">Cuộc Gặp Đã Đặt</span>
          <span className="kpi-value">{totalMeetings}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--meeting-color)', marginTop: '2px' }}>
            🤝 Lịch hẹn trực tiếp & Online
          </span>
        </div>
        <div className="kpi-icon-pill" style={{ background: 'var(--meeting-bg)', color: 'var(--meeting-color)' }}>
          <Calendar size={20} />
        </div>
      </div>

      {/* Thẻ 2: Công việc có hạn */}
      <div className="kpi-card">
        <div className="kpi-card-left">
          <span className="kpi-title">Công Việc Có Hạn</span>
          <span className="kpi-value">{totalTasks}</span>
          <span style={{ fontSize: '0.72rem', color: urgentTasks > 0 ? 'var(--danger-border)' : 'var(--task-color)', marginTop: '2px' }}>
            📋 {urgentTasks > 0 ? `${urgentTasks} việc khẩn cấp cần xong` : 'Trong tầm kiểm soát'}
          </span>
        </div>
        <div className="kpi-icon-pill" style={{ background: 'var(--task-bg)', color: 'var(--task-color)' }}>
          <CheckSquare size={20} />
        </div>
      </div>

      {/* Thẻ 3: Tỷ lệ hoàn thành công việc */}
      <div className="kpi-card">
        <div className="kpi-card-left">
          <span className="kpi-title">Tiến Độ Hoàn Thành</span>
          <span className="kpi-value">
            {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '100%'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--success-border)', marginTop: '2px' }}>
            ✓ Đã xong {completedTasks}/{totalTasks} công việc
          </span>
        </div>
        <div className="kpi-icon-pill" style={{ background: 'var(--success-bg)', color: 'var(--success-border)' }}>
          <CheckCircle2 size={20} />
        </div>
      </div>

      {/* Thẻ 4: Xung đột lịch */}
      <div className="kpi-card" style={{ borderColor: conflictCount > 0 ? 'var(--danger-border)' : 'var(--border-light)' }}>
        <div className="kpi-card-left">
          <span className="kpi-title">Xung Đột Chồng Lịch</span>
          <span className="kpi-value" style={{ color: conflictCount > 0 ? 'var(--danger-border)' : 'var(--text-primary)' }}>
            {conflictCount}
          </span>
          <span style={{ fontSize: '0.72rem', color: conflictCount > 0 ? 'var(--danger-border)' : 'var(--text-muted)', marginTop: '2px' }}>
            {conflictCount > 0 ? '⚠️ Cần điều phối giờ lại' : '✓ Không có chồng chéo'}
          </span>
        </div>
        <div className="kpi-icon-pill" style={{ background: conflictCount > 0 ? 'var(--danger-bg)' : 'rgba(255, 255, 255, 0.05)', color: conflictCount > 0 ? 'var(--danger-border)' : 'var(--text-muted)' }}>
          <AlertOctagon size={20} />
        </div>
      </div>
    </div>
  );
}
