import React from 'react';
import { ShieldAlert, Compass, Rocket, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const ScenariosComparison = ({ stats }) => {
  const { targetQuota, scenarios, forecastCategories } = stats;

  const worstAttainment = targetQuota > 0 ? (scenarios.worstCase / targetQuota) * 100 : 0;
  const mostAttainment = targetQuota > 0 ? (scenarios.mostLikely / targetQuota) * 100 : 0;
  const bestAttainment = targetQuota > 0 ? (scenarios.bestCase / targetQuota) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={18} color="var(--accent-primary)" />
          Phân Tích 3 Kịch Bản Doanh Số Cuối Kỳ (Forecasting Scenarios)
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Hỗ trợ Giám đốc kinh doanh lập kế hoạch dòng tiền và điều hành chiến lược
        </span>
      </div>

      <div className="comparison-grid">
        {/* Worst Case */}
        <div className="scenario-card scenario-worst">
          <div>
            <div className="scenario-badge">
              Kịch Bản Tối Thiểu (Worst Case)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <ShieldAlert size={16} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Chắc chắn có trong tay</span>
            </div>
            <div className="scenario-val" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(scenarios.worstCase)}
            </div>
            <div className="scenario-desc">
              Chỉ tính các hợp đồng đã ký thành công (Closed Won 100%). Không tính thêm bất kỳ cơ hội nào chưa chốt.
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tỷ lệ đạt chỉ tiêu:</span>
            <strong style={{ color: worstAttainment >= 100 ? 'var(--success)' : 'var(--text-secondary)' }}>
              {formatPercent(worstAttainment)}
            </strong>
          </div>
        </div>

        {/* Most Likely (Weighted Forecast) */}
        <div className="scenario-card scenario-most">
          <div>
            <div className="scenario-badge">
              Kịch Bản Kỳ Vọng (Most Likely) ★
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8' }}>
              <Compass size={16} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Dự báo theo trọng số xác suất</span>
            </div>
            <div className="scenario-val" style={{ color: '#818cf8' }}>
              {formatCurrency(scenarios.mostLikely)}
            </div>
            <div className="scenario-desc">
              Tổng hợp từ số đã chốt cộng với kỳ vọng xác suất thống kê của từng giai đoạn cơ hội: <strong>∑ (Giá trị × Xác suất)</strong>.
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tỷ lệ đạt chỉ tiêu:</span>
            <strong style={{ color: mostAttainment >= 100 ? 'var(--success)' : '#818cf8' }}>
              {formatPercent(mostAttainment)}
            </strong>
          </div>
        </div>

        {/* Best Case */}
        <div className="scenario-card scenario-best">
          <div>
            <div className="scenario-badge">
              Kịch Bản Tối Đa (Best Case)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)' }}>
              <Rocket size={16} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Toàn bộ Pipeline thắng</span>
            </div>
            <div className="scenario-val" style={{ color: 'var(--success)' }}>
              {formatCurrency(scenarios.bestCase)}
            </div>
            <div className="scenario-desc">
              Trường hợp thuận lợi tuyệt đối khi đội ngũ Sales chốt thắng 100% tất cả các cơ hội đang mở trong kỳ này.
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tỷ lệ đạt chỉ tiêu:</span>
            <strong style={{ color: 'var(--success)' }}>
              {formatPercent(bestAttainment)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
