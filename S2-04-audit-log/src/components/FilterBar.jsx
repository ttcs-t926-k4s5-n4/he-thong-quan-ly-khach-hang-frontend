import React from 'react';
import { Search, Filter, Calendar, User, Tag, RotateCcw, ShieldAlert } from 'lucide-react';
import { OBJECT_TYPES, USERS_LIST } from '../data/mockData';

export function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) {
  const handleUserChange = (e) => {
    onFilterChange({ ...filters, selectedUser: e.target.value });
  };

  const handleObjectTypeChange = (e) => {
    onFilterChange({ ...filters, selectedObjectType: e.target.value });
  };

  const handleStartDateChange = (e) => {
    onFilterChange({ ...filters, startDate: e.target.value, datePreset: 'custom' });
  };

  const handleEndDateChange = (e) => {
    onFilterChange({ ...filters, endDate: e.target.value, datePreset: 'custom' });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handlePresetClick = (preset) => {
    let start = '';
    let end = '';

    if (preset === 'today') {
      start = '2024-09-30';
      end = '2024-09-30';
    } else if (preset === 'last7days') {
      start = '2024-09-24';
      end = '2024-09-30';
    } else if (preset === 'q3_close') {
      // Thời điểm chốt sổ Quý 3 (28/09 - 30/09)
      start = '2024-09-28';
      end = '2024-09-30';
    } else if (preset === 'month9') {
      start = '2024-09-01';
      end = '2024-09-30';
    } else if (preset === 'all') {
      start = '';
      end = '';
    }

    onFilterChange({
      ...filters,
      datePreset: preset,
      startDate: start,
      endDate: end
    });
  };

  const isFiltered =
    filters.selectedUser !== 'ALL' ||
    filters.selectedObjectType !== 'ALL' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.searchQuery !== '' ||
    filters.discrepancyOnly;

  return (
    <section className="filter-panel" aria-label="Bộ lọc kiểm toán">
      <div className="filter-main-row">
        {/* Tìm kiếm từ khóa */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo Mã bản ghi, đối tượng, lý do, người sửa..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              title="Xoá tìm kiếm"
            >
              ×
            </button>
          )}
        </div>

        {/* Lọc theo Người dùng */}
        <div className="filter-control">
          <label className="filter-label" htmlFor="user-select">
            <User size={15} />
            <span>Người thực hiện:</span>
          </label>
          <select
            id="user-select"
            className="filter-select"
            value={filters.selectedUser}
            onChange={handleUserChange}
          >
            <option value="ALL">-- Tất cả người dùng ({USERS_LIST.length}) --</option>
            {USERS_LIST.map((usr) => (
              <option key={usr.id} value={usr.id}>
                {usr.name} ({usr.role.split('(')[0].trim()})
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Loại đối tượng */}
        <div className="filter-control">
          <label className="filter-label" htmlFor="object-type-select">
            <Tag size={15} />
            <span>Loại đối tượng:</span>
          </label>
          <select
            id="object-type-select"
            className="filter-select"
            value={filters.selectedObjectType}
            onChange={handleObjectTypeChange}
          >
            <option value="ALL">-- Tất cả loại đối tượng --</option>
            <option value="DISCOUNT">🏷️ Chiết khấu (Discount)</option>
            <option value="SALES_TARGET">🎯 Chỉ tiêu doanh số (Target)</option>
            <option value="DATA_OWNERSHIP">🛡️ Quyền sở hữu dữ liệu</option>
            <option value="USER_ROLE">👤 Vai trò người dùng (Roles)</option>
          </select>
        </div>
      </div>

      <div className="filter-sub-row">
        {/* Khoảng thời gian: Date Range Picker */}
        <div className="date-range-group">
          <span className="date-group-label">
            <Calendar size={15} /> Khoảng thời gian:
          </span>
          <div className="date-inputs">
            <input
              type="date"
              className="date-input"
              value={filters.startDate}
              onChange={handleStartDateChange}
              title="Từ ngày"
            />
            <span className="date-sep">đến</span>
            <input
              type="date"
              className="date-input"
              value={filters.endDate}
              onChange={handleEndDateChange}
              title="Đến ngày"
            />
          </div>

          {/* Quick presets */}
          <div className="quick-presets">
            <button
              type="button"
              className={`preset-btn ${filters.datePreset === 'all' ? 'preset-active' : ''}`}
              onClick={() => handlePresetClick('all')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`preset-btn ${filters.datePreset === 'q3_close' ? 'preset-active highlight-preset' : ''}`}
              onClick={() => handlePresetClick('q3_close')}
              title="Lọc thời điểm 3 ngày chốt sổ Quý 3 (28/09 - 30/09)"
            >
              ⭐ Chốt Quý 3 (28-30/09)
            </button>
            <button
              type="button"
              className={`preset-btn ${filters.datePreset === 'month9' ? 'preset-active' : ''}`}
              onClick={() => handlePresetClick('month9')}
            >
              Tháng 9/2024
            </button>
            <button
              type="button"
              className={`preset-btn ${filters.datePreset === 'last7days' ? 'preset-active' : ''}`}
              onClick={() => handlePresetClick('last7days')}
            >
              7 ngày qua
            </button>
          </div>
        </div>

        {/* Filter stats & Reset button */}
        <div className="filter-actions-right">
          <span className="results-count">
            Hiển thị <strong>{totalResults}</strong> kết quả phù hợp
          </span>

          {isFiltered && (
            <button
              type="button"
              className="btn btn-reset"
              onClick={onResetFilters}
              title="Đặt lại toàn bộ bộ lọc"
            >
              <RotateCcw size={14} />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
