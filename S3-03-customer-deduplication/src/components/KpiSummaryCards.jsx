import React from 'react';
import { Building2, AlertTriangle, Briefcase, CheckCircle2 } from 'lucide-react';

export function KpiSummaryCards({
  totalCount,
  duplicateCount,
  totalDealsAmount,
  mergedHistoryCount,
  activeFilter,
  onFilterChange,
  onOpenHistory
}) {
  const formatCurrency = (val) => {
    if (!val) return '0 đ';
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(2) + ' tỷ đ';
    }
    return (val / 1000000).toFixed(0) + ' tr đ';
  };

  return (
    <div className="kpi-grid">
      {/* 1. Tổng khách hàng */}
      <div
        className={`kpi-card ${activeFilter === 'ALL' ? 'active' : ''}`}
        onClick={() => onFilterChange('ALL')}
      >
        <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
          <Building2 size={24} />
        </div>
        <div>
          <div className="kpi-value">{totalCount}</div>
          <div className="kpi-label">Tổng khách hàng hệ thống</div>
        </div>
      </div>

      {/* 2. Cảnh báo trùng lặp */}
      <div
        className={`kpi-card ${activeFilter === 'DUPLICATES_ONLY' ? 'active' : ''}`}
        onClick={() => onFilterChange('DUPLICATES_ONLY')}
      >
        <div className="kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.18)', color: '#f87171' }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="kpi-value" style={{ color: duplicateCount > 0 ? '#f87171' : 'inherit' }}>
            {duplicateCount}
          </div>
          <div className="kpi-label">Hồ sơ có dấu hiệu trùng lặp</div>
        </div>
      </div>

      {/* 3. Tổng giá trị cơ hội */}
      <div
        className={`kpi-card ${activeFilter === 'SAFE_ONLY' ? 'active' : ''}`}
        onClick={() => onFilterChange('SAFE_ONLY')}
      >
        <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <Briefcase size={24} />
        </div>
        <div>
          <div className="kpi-value">{formatCurrency(totalDealsAmount)}</div>
          <div className="kpi-label">Tổng Pipeline cơ hội kinh doanh</div>
        </div>
      </div>

      {/* 4. Hồ sơ đã gộp */}
      <div className="kpi-card" onClick={onOpenHistory}>
        <div className="kpi-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <div className="kpi-value">{mergedHistoryCount}</div>
          <div className="kpi-label">Hồ sơ đã gộp thành công</div>
        </div>
      </div>
    </div>
  );
}
