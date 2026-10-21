import React, { useState } from 'react';
import { 
  Search, 
  Edit3, 
  Calendar, 
  Percent, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  SlidersHorizontal 
} from 'lucide-react';
import { OPPORTUNITY_STAGES } from '../data/mockStages';
import { formatCurrency, formatDate, formatPercent, getPeriodType } from '../utils/formatters';
import { calculateOpportunityWeightedValue } from '../utils/forecastCalculations';

export const OpportunityTable = ({
  opportunities,
  onEditOpportunity,
  onQuickUpdateProbability,
  stageFilter,
  setStageFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered list
  const filtered = opportunities.filter((opp) => {
    // Stage filter
    if (stageFilter !== 'ALL' && opp.stage !== stageFilter) return false;

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = opp.id.toLowerCase().includes(q);
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCustomer = opp.customerName.toLowerCase().includes(q);
      const matchOwner = opp.ownerName.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCustomer && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="var(--accent-primary)" />
            Chi Tiết Các Cơ Hội Đóng Góp Vào Dự Báo ({filtered.length} thương vụ)
          </h3>

          {/* Stage Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${stageFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.76rem' }}
              onClick={() => setStageFilter('ALL')}
            >
              Tất cả ({opportunities.length})
            </button>
            {Object.values(OPPORTUNITY_STAGES).map((stg) => (
              <button
                key={stg.id}
                className={`btn ${stageFilter === stg.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.76rem' }}
                onClick={() => setStageFilter(stg.id)}
              >
                {stg.label} ({opportunities.filter((o) => o.stage === stg.id).length})
              </button>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="search-input-box">
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm theo mã, khách hàng, nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Cơ Hội</th>
              <th>Khách Hàng & Dự Án</th>
              <th>Phụ Trách & Nhóm</th>
              <th>Giai Đoạn</th>
              <th>Xác Suất Thắng (%)</th>
              <th>Giá Trị Cơ Hội</th>
              <th>Dự Báo Trọng Số (Giá Trị × %)</th>
              <th>Dự Kiến Chốt</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                  Không tìm thấy cơ hội bán hàng nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filtered.map((opp) => {
                const stage = OPPORTUNITY_STAGES[opp.stage] || OPPORTUNITY_STAGES.PROPOSAL;
                const weightedVal = calculateOpportunityWeightedValue(opp);
                const period = getPeriodType(opp.expectedCloseDate);

                return (
                  <tr key={opp.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: '#818cf8' }}>
                        {opp.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ maxWidth: 300 }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{opp.title}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {opp.customerName} • <span style={{ color: 'var(--text-muted)' }}>{opp.industry}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{opp.ownerName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{opp.teamName}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-stage ${stage.badgeClass}`}>
                        {stage.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div style={{ 
                          width: 45, 
                          height: 6, 
                          borderRadius: 3, 
                          background: 'rgba(255,255,255,0.1)', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${opp.probability}%`, 
                            height: '100%', 
                            background: stage.color 
                          }} />
                        </div>
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontWeight: 700, 
                          color: stage.color 
                        }}>
                          {opp.probability}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatCurrency(opp.expectedValue)}
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: opp.stage === 'CLOSED_WON' ? 'var(--success)' : '#38bdf8' }}>
                        {formatCurrency(weightedVal)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {opp.stage === 'CLOSED_WON' 
                          ? 'Đã chốt (100%)' 
                          : `${formatCurrency(opp.expectedValue)} × ${opp.probability}%`}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-secondary)" />
                        <span style={{ fontSize: '0.82rem' }}>{formatDate(opp.expectedCloseDate)}</span>
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.1rem 0.4rem', 
                        borderRadius: 'var(--radius-full)',
                        background: period === 'THIS_MONTH' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.06)',
                        color: period === 'THIS_MONTH' ? '#818cf8' : 'var(--text-muted)',
                        fontWeight: 600
                      }}>
                        {period === 'THIS_MONTH' ? 'Tháng này' : (period === 'NEXT_MONTH' ? 'Tháng sau' : 'Quý này')}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => onEditOpportunity(opp)}
                        title="Chỉnh sửa cơ hội hoặc cập nhật giai đoạn & xác suất"
                      >
                        <Edit3 size={13} />
                        Sửa Deal
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
