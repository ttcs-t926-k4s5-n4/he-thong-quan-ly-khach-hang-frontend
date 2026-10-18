import React from 'react';
import { Activity, Info } from 'lucide-react';
import { formatCurrency, formatPercent, formatCompactCurrency } from '../utils/formatters';

export const ProgressGauge = ({ stats }) => {
  const { targetQuota, actualClosedWon, weightedForecast, unweightedPipeline, totalProjectedRevenue } = stats;

  const wonPercent = targetQuota > 0 ? Math.min(100, (actualClosedWon / targetQuota) * 100) : 0;
  const forecastPercent = targetQuota > 0 ? Math.min(100 - wonPercent, (weightedForecast / targetQuota) * 100) : 0;
  const totalPercent = targetQuota > 0 ? (totalProjectedRevenue / targetQuota) * 100 : 0;

  return (
    <div className="gauge-section">
      <div className="gauge-header">
        <div className="gauge-title">
          <Activity size={18} color="var(--accent-primary)" />
          Thước Đo Tiến Độ So Sánh Doanh Số Thực Tế & Dự Báo vs Chỉ Tiêu (100% Quota)
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          Đạt Dự Kiến: <span style={{ color: totalPercent >= 100 ? 'var(--success)' : '#818cf8' }}>{formatPercent(totalPercent)}</span>
        </div>
      </div>

      <div className="progress-track-wrapper">
        <div className="progress-track">
          {/* Actual Won portion */}
          <div 
            className="bar-won" 
            style={{ width: `${wonPercent}%` }}
            title={`Đã chốt thực tế: ${formatCurrency(actualClosedWon)} (${formatPercent(wonPercent)})`}
          />
          {/* Weighted Forecast portion */}
          <div 
            className="bar-forecast" 
            style={{ width: `${forecastPercent}%` }}
            title={`Dự báo trọng số: ${formatCurrency(weightedForecast)} (${formatPercent(forecastPercent)})`}
          />
          {/* 100% Target Marker */}
          <div className="progress-target-marker" style={{ left: '100%' }} title="Mốc chỉ tiêu 100%" />
        </div>
      </div>

      <div className="gauge-legend">
        <div className="legend-items">
          <div className="legend-item">
            <span className="dot dot-won" />
            <span>Đã chốt thực tế: <strong>{formatCompactCurrency(actualClosedWon)}</strong> ({formatPercent(targetQuota > 0 ? (actualClosedWon / targetQuota) * 100 : 0)})</span>
          </div>
          <div className="legend-item">
            <span className="dot dot-forecast" />
            <span>Dự báo trọng số: <strong>{formatCompactCurrency(weightedForecast)}</strong></span>
          </div>
          <div className="legend-item">
            <span className="dot dot-target" />
            <span>Chỉ tiêu mục tiêu: <strong>{formatCompactCurrency(targetQuota)}</strong></span>
          </div>
          <div className="legend-item">
            <span className="dot dot-unweighted" />
            <span>Tổng phễu mở chưa nhân xác suất: <strong>{formatCompactCurrency(unweightedPipeline)}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <Info size={13} />
          <span>Thước đo tự động đồng bộ theo kỳ và bộ lọc nhân viên/nhóm</span>
        </div>
      </div>
    </div>
  );
};
