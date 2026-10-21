import React from 'react';
import { 
  X, 
  Flame, 
  SunMedium, 
  Snowflake, 
  BarChart3, 
  CheckCircle2, 
  Building 
} from 'lucide-react';

export default function ScoreBreakdownModal({ lead, onClose }) {
  if (!lead || !lead.scoreResult) return null;

  const { totalScore, classification, breakdown, slaRecommendation } = lead.scoreResult;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="modal-title">Bảng Chi Tiết Điểm Số & Đánh Giá Tiềm Năng</div>
              <div className="modal-subtitle">
                {lead.fullName} &bull; {lead.companyName}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Top Total Score Card */}
          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Tổng Điểm Tích Lũy</span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {totalScore} / 110 điểm
              </div>
            </div>

            <div>
              {classification === 'HOT' && (
                <span className="badge-hot" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                  <Flame size={16} /> 🔥 NÓNG (HOT)
                </span>
              )}
              {classification === 'WARM' && (
                <span className="badge-warm" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                  <SunMedium size={16} /> ☀️ ẤM (WARM)
                </span>
              )}
              {classification === 'COLD' && (
                <span className="badge-cold" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                  <Snowflake size={16} /> ❄️ LẠNH (COLD)
                </span>
              )}
            </div>
          </div>

          {/* Breakdown Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span className="field-label">Điểm Từng Tiêu Chí:</span>
            {breakdown.map((item, idx) => {
              const pct = Math.round((item.pointsEarned / item.maxPossiblePoints) * 100);
              return (
                <div 
                  key={idx}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {item.criteriaName}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: item.pointsEarned > 0 ? '#16a34a' : 'var(--text-dim)' }}>
                      +{item.pointsEarned} điểm
                    </strong>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Giá trị ghi nhận: <strong>{item.selectedLabel}</strong> (Tối đa {item.maxPossiblePoints}đ)
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.2rem' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${pct}%`, 
                        background: pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#3b82f6',
                        borderRadius: '4px' 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SLA Recommendation Box */}
          <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong>Khuyến nghị hành động Telesales:</strong> {slaRecommendation}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
