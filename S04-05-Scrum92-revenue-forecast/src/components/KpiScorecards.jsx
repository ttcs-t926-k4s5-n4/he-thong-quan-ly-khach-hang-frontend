import React from 'react';
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const KpiScorecards = ({ stats }) => {
  const isExceeded = stats.gapToTarget <= 0;
  const gapAbs = Math.abs(stats.gapToTarget);

  return (
    <div className="kpi-grid">
      {/* 1. Target Quota (Chỉ tiêu) */}
      <div className="kpi-card card-quota">
        <div className="kpi-card-header">
          <span className="kpi-title">Chỉ Tiêu Doanh Số (Quota)</span>
          <div className="kpi-icon-box">
            <Target size={18} />
          </div>
        </div>
        <div className="kpi-main-val">
          {formatCurrency(stats.targetQuota)}
        </div>
        <div className="kpi-footer">
          <span>Kế hoạch giao cho kỳ</span>
          <span className="kpi-subtag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            100% KPI
          </span>
        </div>
      </div>

      {/* 2. Actual Closed Won (Đã chốt thực tế) */}
      <div className="kpi-card card-won">
        <div className="kpi-card-header">
          <span className="kpi-title">Đã Chốt Thực Tế (Won)</span>
          <div className="kpi-icon-box">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="kpi-main-val" style={{ color: 'var(--success)' }}>
          {formatCurrency(stats.actualClosedWon)}
        </div>
        <div className="kpi-footer">
          <span>{stats.wonCount} hợp đồng đã ký</span>
          <span className="kpi-subtag" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            {formatPercent(stats.actualAttainmentRate)} chỉ tiêu
          </span>
        </div>
      </div>

      {/* 3. Weighted Forecast (Dự báo trọng số) */}
      <div className="kpi-card card-forecast">
        <div className="kpi-card-header">
          <span className="kpi-title">Dự Báo Trọng Số (Forecast)</span>
          <div className="kpi-icon-box">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="kpi-main-val" style={{ color: '#38bdf8' }}>
          {formatCurrency(stats.weightedForecast)}
        </div>
        <div className="kpi-footer">
          <span>{stats.openCount} deal mở (∑ Value × Prob)</span>
          <span className="kpi-subtag" style={{ background: 'var(--info-bg)', color: '#38bdf8' }}>
            Kỳ vọng toán học
          </span>
        </div>
      </div>

      {/* 4. Total Projected Revenue (Tổng kỳ vọng = Đã chốt + Dự báo) */}
      <div className="kpi-card card-total">
        <div className="kpi-card-header">
          <span className="kpi-title">Tổng Doanh Số Kỳ Vọng</span>
          <div className="kpi-icon-box">
            <Layers size={18} />
          </div>
        </div>
        <div className="kpi-main-val" style={{ color: '#818cf8' }}>
          {formatCurrency(stats.totalProjectedRevenue)}
        </div>
        <div className="kpi-footer">
          <span>Đã chốt + Dự báo trọng số</span>
          <span 
            className="kpi-subtag" 
            style={{ 
              background: isExceeded ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.15)', 
              color: isExceeded ? 'var(--success)' : '#818cf8',
              fontWeight: 700 
            }}
          >
            {formatPercent(stats.projectedAttainmentRate)} tiến độ
          </span>
        </div>
      </div>

      {/* 5. Gap to Target (Chênh lệch / Khoảng cách) */}
      <div className="kpi-card card-gap">
        <div className="kpi-card-header">
          <span className="kpi-title">Chênh Lệch Với Chỉ Tiêu</span>
          <div className="kpi-icon-box">
            <Scale size={18} />
          </div>
        </div>
        <div 
          className="kpi-main-val" 
          style={{ color: isExceeded ? 'var(--success)' : 'var(--warning)' }}
        >
          {isExceeded ? `+${formatCurrency(gapAbs)}` : `-${formatCurrency(gapAbs)}`}
        </div>
        <div className="kpi-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {isExceeded ? (
              <>
                <ArrowUpRight size={14} color="var(--success)" />
                Vượt kế hoạch
              </>
            ) : (
              <>
                <ArrowDownRight size={14} color="var(--warning)" />
                Cần bù đắp
              </>
            )}
          </span>
          <span 
            className="kpi-subtag" 
            style={{ 
              background: isExceeded ? 'var(--success-bg)' : 'var(--warning-bg)', 
              color: isExceeded ? 'var(--success)' : 'var(--warning)' 
            }}
          >
            {isExceeded ? 'ĐẠT VƯỢT KPI 🏆' : 'CẦN THÊM DEAL'}
          </span>
        </div>
      </div>
    </div>
  );
};
