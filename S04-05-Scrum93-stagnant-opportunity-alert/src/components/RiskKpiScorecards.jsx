import React from 'react';
import { 
  AlertOctagon, 
  Clock, 
  CalendarX, 
  ShieldAlert, 
  TrendingDown, 
  HelpCircle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { formatVND, formatCompactVND, formatPercent } from '../utils/formatters.js';

export const RiskKpiScorecards = ({ metrics, onFilterByFlag }) => {
  return (
    <div className="kpi-grid">
      {/* KPI 1: Doanh số nguy cơ mất do đình trệ */}
      <div 
        className="kpi-card critical-kpi"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterByFlag('ALL_FLAGGED')}
        title="Nhấp để lọc danh sách cơ hội có cờ đình trệ"
      >
        <div className="kpi-header">
          <span className="kpi-title">Doanh Số Đình Trệ (Rủi Ro Mất)</span>
          <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <TrendingDown size={18} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#ef4444' }}>
          {formatCompactVND(metrics.stagnantPipelineValue)}
        </div>
        <div className="kpi-subtext">
          <span style={{ color: '#ef4444', fontWeight: 700 }}>
            {formatPercent(metrics.stagnantRate, 1)}
          </span>
          <span>trên tổng {formatCompactVND(metrics.totalOpenPipelineValue)} pipeline mở</span>
        </div>
      </div>

      {/* KPI 2: Tổng số cơ hội có cờ cảnh báo */}
      <div 
        className="kpi-card warning-kpi"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterByFlag('ALL_FLAGGED')}
        title="Nhấp để xem toàn bộ cơ hội có cờ"
      >
        <div className="kpi-header">
          <span className="kpi-title">Số Cơ Hội Bị Gắn Cờ</span>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertOctagon size={18} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#f59e0b' }}>
          {metrics.flaggedDealsCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {metrics.openDealsCount} deal</span>
        </div>
        <div className="kpi-subtext">
          <span className="badge badge-flag-dual" style={{ padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>
            🚨 {metrics.criticalCount} Khẩn cấp
          </span>
          <span>cần can thiệp ngay</span>
        </div>
      </div>

      {/* KPI 3: Cờ không hoạt động > N ngày (AC1) */}
      <div 
        className="kpi-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterByFlag('INACTIVITY')}
        title="Nhấp để lọc các cơ hội vi phạm ngưỡng N ngày theo giai đoạn (AC1)"
      >
        <div className="kpi-header">
          <span className="kpi-title">Không Hoạt Động &gt; N Ngày (AC1)</span>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock size={18} />
          </div>
        </div>
        <div className="kpi-value">
          {metrics.inactivityFlaggedCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>deal</span>
        </div>
        <div className="kpi-subtext">
          <span>Ngưỡng N cấu hình theo từng giai đoạn</span>
        </div>
      </div>

      {/* KPI 4: Cờ quá ngày dự kiến chốt (AC2) */}
      <div 
        className="kpi-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterByFlag('OVERDUE_CLOSE')}
        title="Nhấp để lọc các cơ hội quá ngày dự kiến chốt mà chưa đóng (AC2)"
      >
        <div className="kpi-header">
          <span className="kpi-title">Quá Hạn Chốt Chưa Đóng (AC2)</span>
          <div className="kpi-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <CalendarX size={18} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#ec4899' }}>
          {metrics.overdueCloseFlaggedCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>deal</span>
        </div>
        <div className="kpi-subtext">
          <span>Đã quá ngày hẹn ký hợp đồng nhưng chưa chốt</span>
        </div>
      </div>

      {/* KPI 5: Tỷ lệ can thiệp của Trưởng nhóm (AC3) */}
      <div 
        className="kpi-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterByFlag('INTERVENED')}
        title="Xem các cơ hội đã được Trưởng nhóm can thiệp"
      >
        <div className="kpi-header">
          <span className="kpi-title">Tỷ Lệ Đã Can Thiệp Sớm</span>
          <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <ShieldAlert size={18} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#818cf8' }}>
          {formatPercent(metrics.rescueRate, 0)}
        </div>
        <div className="kpi-subtext">
          <span style={{ color: metrics.unintervenedCount > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
            {metrics.intervenedCount} đã can thiệp
          </span>
          <span>• còn {metrics.unintervenedCount} deal chờ can thiệp</span>
        </div>
      </div>
    </div>
  );
};
