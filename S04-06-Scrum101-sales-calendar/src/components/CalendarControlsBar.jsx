import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CalendarDays, 
  Clock, 
  LayoutGrid, 
  Sparkles,
  Filter,
  Users
} from 'lucide-react';
import { 
  formatDateVietnamese, 
  formatWeekRange, 
  getWeekDays 
} from '../utils/calendarUtils';

export default function CalendarControlsBar({
  viewMode,
  onChangeViewMode,
  currentDate,
  onPrevDate,
  onNextDate,
  onToday,
  filterType,
  onChangeFilterType,
  onOpenSlotFinder,
  currentUser
}) {
  // Format current date label depending on viewMode
  let dateTitle = '';
  if (viewMode === 'MONTH') {
    dateTitle = `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;
  } else if (viewMode === 'WEEK') {
    const week = getWeekDays(currentDate);
    dateTitle = `Tuần: ${formatWeekRange(week[0], week[6])}`;
  } else if (viewMode === 'DAY' || viewMode === 'TEAM_MATRIX') {
    dateTitle = formatDateVietnamese(currentDate);
  }

  return (
    <div className="calendar-controls-bar">
      {/* Cụm điều hướng ngày tháng */}
      <div className="nav-cluster">
        <div className="nav-buttons">
          <button className="nav-btn" onClick={onPrevDate} title="Trước">
            <ChevronLeft size={18} />
          </button>
          <button className="nav-btn" onClick={onNextDate} title="Tiếp theo">
            <ChevronRight size={18} />
          </button>
        </div>

        <button className="btn-today" onClick={onToday}>
          Hôm Nay
        </button>

        <h2 className="current-date-title">{dateTitle}</h2>
      </div>

      {/* Cụm chuyển đổi chế độ xem (Chế độ xem theo ngày, tuần, tháng & Lịch chồng nhóm) */}
      <div className="view-mode-tabs">
        <button 
          className={`view-mode-tab ${viewMode === 'DAY' ? 'active' : ''}`}
          onClick={() => onChangeViewMode('DAY')}
        >
          <Clock size={15} />
          <span>Ngày</span>
        </button>

        <button 
          className={`view-mode-tab ${viewMode === 'WEEK' ? 'active' : ''}`}
          onClick={() => onChangeViewMode('WEEK')}
        >
          <CalendarDays size={15} />
          <span>Tuần</span>
        </button>

        <button 
          className={`view-mode-tab ${viewMode === 'MONTH' ? 'active' : ''}`}
          onClick={() => onChangeViewMode('MONTH')}
        >
          <LayoutGrid size={15} />
          <span>Tháng</span>
        </button>

        {/* Tab Lịch Chồng Cả Nhóm (Đặc biệt cho Trưởng Nhóm hoặc Sales Rep tra cứu) */}
        <button 
          className={`view-mode-tab ${viewMode === 'TEAM_MATRIX' ? 'active' : ''}`}
          onClick={() => onChangeViewMode('TEAM_MATRIX')}
          title="Trưởng nhóm xem được lịch chồng của cả nhóm để bố trí"
        >
          <Users size={15} />
          <span>Lịch Chồng Nhóm</span>
        </button>
      </div>

      {/* Cụm bộ lọc: Cuộc gặp đã đặt vs Công việc có hạn trong cùng một khung nhìn */}
      <div className="filter-bar">
        <div className="filter-chip-group" style={{ display: 'flex', gap: '6px' }}>
          <button 
            className={`filter-chip ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => onChangeFilterType('ALL')}
          >
            Tất cả
          </button>

          <button 
            className={`filter-chip chip-meetings ${filterType === 'MEETING' ? 'active' : ''}`}
            onClick={() => onChangeFilterType('MEETING')}
          >
            🤝 Cuộc gặp đã đặt
          </button>

          <button 
            className={`filter-chip chip-tasks ${filterType === 'TASK' ? 'active' : ''}`}
            onClick={() => onChangeFilterType('TASK')}
          >
            📋 Việc có hạn
          </button>
        </div>

        {/* Nút Tìm Giờ Rảnh Cả Nhóm (Smart Slot Finder) */}
        <button 
          className="btn btn-secondary"
          onClick={onOpenSlotFinder}
          style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: 'var(--primary)' }}
        >
          <Sparkles size={15} />
          <span>Tìm Giờ Rảnh Nhóm</span>
        </button>
      </div>
    </div>
  );
}
