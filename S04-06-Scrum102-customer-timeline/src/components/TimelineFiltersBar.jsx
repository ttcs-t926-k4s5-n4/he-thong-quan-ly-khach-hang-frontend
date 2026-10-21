import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  User, 
  Calendar, 
  ArrowUpDown, 
  Star,
  CheckCircle
} from 'lucide-react';
import { ACTIVITY_TYPES } from '../utils/timelineUtils';

export default function TimelineFiltersBar({
  teamMembers,
  selectedType,
  onSelectType,
  selectedActor,
  onSelectActor,
  searchQuery,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  sortOrder,
  onToggleSortOrder,
  onlyMilestones,
  onToggleOnlyMilestones,
  filteredCount,
  totalCount
}) {
  return (
    <div className="timeline-filters-bar">
      {/* Top Controls Row */}
      <div className="filters-top-row">
        {/* Search Box */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon-inside" />
          <input 
            type="text" 
            className="search-input"
            placeholder="Tìm kiếm nội dung, mã báo giá (BQ-2026), email, ghi chú..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Xóa tìm kiếm"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Controls: Performed By, Time Range, Sort Order, Milestones */}
        <div className="filters-controls-group">
          {/* Performed By (Actor) Selector */}
          <div className="filter-select-wrapper" title="Lọc theo người thực hiện">
            <User size={15} style={{ color: '#818cf8' }} />
            <label>Người thực hiện:</label>
            <select 
              value={selectedActor}
              onChange={(e) => onSelectActor(e.target.value)}
            >
              <option value="ALL">Tất cả nhân sự ({teamMembers.length})</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.roleCode})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="filter-select-wrapper" title="Lọc theo khoảng thời gian">
            <Calendar size={15} style={{ color: '#34d399' }} />
            <select 
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
            >
              <option value="ALL">Toàn bộ thời gian</option>
              <option value="7_DAYS">7 ngày qua</option>
              <option value="30_DAYS">30 ngày qua</option>
              <option value="THIS_QUARTER">Quý này (Q4/2026)</option>
            </select>
          </div>

          {/* Sort Order Button */}
          <button 
            className="btn btn-secondary"
            onClick={onToggleSortOrder}
            title={sortOrder === 'DESC' ? 'Đang xếp: Mới nhất trước' : 'Đang xếp: Cũ nhất trước'}
            style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem' }}
          >
            <ArrowUpDown size={14} />
            <span>{sortOrder === 'DESC' ? 'Mới nhất trước' : 'Cũ nhất trước'}</span>
          </button>

          {/* Milestones Only Toggle */}
          <button 
            className={`btn ${onlyMilestones ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onToggleOnlyMilestones}
            style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem' }}
            title="Chỉ hiển thị các mốc sự kiện quan trọng"
          >
            <Star size={14} style={{ fill: onlyMilestones ? '#fff' : 'none' }} />
            <span>Mốc quan trọng</span>
          </button>
        </div>
      </div>

      {/* Activity Type Chips Row */}
      <div className="type-chips-scroll">
        {ACTIVITY_TYPES.map(type => {
          const isActive = selectedType === type.key;
          return (
            <button
              key={type.key}
              className={`type-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectType(type.key)}
            >
              <span>{type.label}</span>
            </button>
          );
        })}

        {/* Counter Tag */}
        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
          Đang xem: <strong style={{ color: 'var(--text-primary)' }}>{filteredCount}</strong> / {totalCount} sự kiện
        </div>
      </div>
    </div>
  );
}
