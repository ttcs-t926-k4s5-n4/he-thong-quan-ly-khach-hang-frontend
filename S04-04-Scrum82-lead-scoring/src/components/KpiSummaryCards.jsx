import React from 'react';
import { 
  Users, 
  Flame, 
  SunMedium, 
  Snowflake, 
  ShieldCheck 
} from 'lucide-react';

export default function KpiSummaryCards({
  totalLeads = 0,
  hotCount = 0,
  warmCount = 0,
  coldCount = 0,
  activeFilter = 'ALL',
  onSelectFilter,
  hotThreshold = 70,
  warmThreshold = 40
}) {
  return (
    <div className="kpi-grid">
      {/* 1. Tổng Lead */}
      <div 
        className={`kpi-card ${activeFilter === 'ALL' ? 'active' : ''}`}
        onClick={() => onSelectFilter('ALL')}
      >
        <div className="kpi-info">
          <span className="kpi-label">Tổng Leads Quản Lý</span>
          <span className="kpi-value">{totalLeads}</span>
          <span className="kpi-subtext">Xếp hạng theo điểm ưu tiên</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#3b82f6' }}>
          <Users size={24} />
        </div>
      </div>

      {/* 2. Lead NÓNG */}
      <div 
        className={`kpi-card ${activeFilter === 'HOT' ? 'active' : ''}`}
        onClick={() => onSelectFilter('HOT')}
        style={activeFilter === 'HOT' ? { borderColor: '#f43f5e', background: 'var(--hot-50)' } : {}}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#e11d48' }}>🔥 Lead NÓNG (HOT)</span>
          <span className="kpi-value" style={{ color: '#e11d48' }}>{hotCount}</span>
          <span className="kpi-subtext">Điểm &ge; {hotThreshold} &bull; Gọi ngay trong 30 phút!</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#ffe4e6', color: '#e11d48' }}>
          <Flame size={24} />
        </div>
      </div>

      {/* 3. Lead ẤM */}
      <div 
        className={`kpi-card ${activeFilter === 'WARM' ? 'active' : ''}`}
        onClick={() => onSelectFilter('WARM')}
        style={activeFilter === 'WARM' ? { borderColor: '#f59e0b', background: 'var(--warm-50)' } : {}}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#d97706' }}>☀️ Lead ẤM (WARM)</span>
          <span className="kpi-value" style={{ color: '#d97706' }}>{warmCount}</span>
          <span className="kpi-subtext">Điểm {warmThreshold} - {hotThreshold - 1} &bull; Gọi trong ngày</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
          <SunMedium size={24} />
        </div>
      </div>

      {/* 4. Lead LẠNH (KHÔNG BỊ LOẠI BỎ) */}
      <div 
        className={`kpi-card ${activeFilter === 'COLD' ? 'active' : ''}`}
        onClick={() => onSelectFilter('COLD')}
        style={activeFilter === 'COLD' ? { borderColor: '#0284c7', background: 'var(--cold-50)' } : {}}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#0284c7' }}>❄️ Lead LẠNH (COLD)</span>
          <span className="kpi-value" style={{ color: '#0284c7' }}>{coldCount}</span>
          <span className="kpi-subtext">Điểm &lt; {warmThreshold} &bull; Lưu trữ đầy đủ, không loại bỏ</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
          <Snowflake size={24} />
        </div>
      </div>
    </div>
  );
}
