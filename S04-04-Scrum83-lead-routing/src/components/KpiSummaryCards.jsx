import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Inbox, 
  Clock, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export default function KpiSummaryCards({
  totalLeads = 0,
  autoAssignedCount = 0,
  waitingManualCount = 0,
  manuallyAssignedCount = 0,
  activeFilter = 'ALL',
  onSelectFilter
}) {
  return (
    <div className="kpi-grid">
      {/* 1. Tổng Lead */}
      <div 
        className={`kpi-card ${activeFilter === 'ALL' ? 'active' : ''}`}
        onClick={() => onSelectFilter('ALL')}
      >
        <div className="kpi-info">
          <span className="kpi-label">Tổng Leads Tiếp Nhận</span>
          <span className="kpi-value">{totalLeads}</span>
          <span className="kpi-subtext">Đổ về tự động từ các chiến dịch</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
          <Users size={24} />
        </div>
      </div>

      {/* 2. Đã phân bổ tự động */}
      <div 
        className={`kpi-card ${activeFilter === 'ASSIGNED' ? 'active' : ''}`}
        onClick={() => onSelectFilter('ASSIGNED')}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#059669' }}>Đã Phân Bổ Tự Động</span>
          <span className="kpi-value" style={{ color: '#059669' }}>{autoAssignedCount}</span>
          <span className="kpi-subtext">Khớp quy tắc &bull; Tới tay Sales trong vài phút</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
          <CheckCircle2 size={24} />
        </div>
      </div>

      {/* 3. Hàng chờ chia tay cho Trưởng nhóm */}
      <div 
        className={`kpi-card ${activeFilter === 'WAITING' ? 'active' : ''}`}
        onClick={() => onSelectFilter('WAITING')}
        style={waitingManualCount > 0 ? { borderColor: '#fcd34d', background: '#fffbeb' } : {}}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#d97706' }}>Hàng Chờ Phân Bổ Tay</span>
          <span className="kpi-value" style={{ color: '#d97706' }}>{waitingManualCount}</span>
          <span className="kpi-subtext">Không khớp quy tắc &bull; Chờ Trưởng nhóm chia</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
          <Inbox size={24} />
        </div>
      </div>

      {/* 4. SLA Tốc độ chạy nền */}
      <div 
        className="kpi-card"
        onClick={() => onSelectFilter('ASSIGNED')}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#16a34a' }}>SLA Phân Bổ Chạy Nền</span>
          <span className="kpi-value" style={{ color: '#16a34a' }}>&lt; 5 Phút</span>
          <span className="kpi-subtext">Đạt 100% mục tiêu &bull; Không chờ họp giao ban</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
          <Clock size={24} />
        </div>
      </div>
    </div>
  );
}
