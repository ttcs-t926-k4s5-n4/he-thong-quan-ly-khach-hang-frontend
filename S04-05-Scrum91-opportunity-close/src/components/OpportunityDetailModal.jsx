import React from 'react';
import { 
  X, 
  Lock, 
  CheckCircle, 
  Trophy, 
  XCircle, 
  Clock, 
  User, 
  Building, 
  DollarSign, 
  FileText, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { OPPORTUNITY_STAGES } from '../data/mockOpportunities';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OpportunityDetailModal = ({ isOpen, onClose, opportunity }) => {
  if (!isOpen || !opportunity) return null;

  const stageObj = OPPORTUNITY_STAGES[opportunity.stage] || { label: opportunity.stage, badgeClass: 'badge-proposal' };
  const isWon = opportunity.stage === 'CLOSED_WON';
  const isLost = opportunity.stage === 'CLOSED_LOST';
  const closedData = opportunity.closedData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="font-mono text-indigo-400" style={{ fontWeight: '700', fontSize: '1rem' }}>
              {opportunity.id}
            </span>
            <span className={`badge ${stageObj.badgeClass}`}>
              {isWon && <Trophy size={12} />}
              {isLost && <XCircle size={12} />}
              {stageObj.label}
            </span>
            {opportunity.isLocked && (
              <span className="badge badge-locked">
                <Lock size={12} /> Đã Khóa (AC3)
              </span>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Lock status banner */}
          {opportunity.isLocked && (
            <div style={{
              background: 'rgba(148, 163, 184, 0.08)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <Lock size={16} className="text-slate-400" />
              <span>
                <strong>Trạng thái bảo vệ:</strong> Cơ hội đã đóng và được khóa an toàn. Nhân viên kinh doanh không thể sửa đổi số liệu. Chỉ Trưởng nhóm trở lên mới có thể mở lại (AC3).
              </span>
            </div>
          )}

          {/* Basic Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            background: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Khách hàng:</span>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{opportunity.customerName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opportunity.industry}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Người phụ trách:</span>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{opportunity.ownerName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mã NV: {opportunity.ownerId}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá trị dự kiến:</span>
              <div className="font-mono" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                {formatCurrency(opportunity.expectedValue)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dự kiến đóng:</span>
              <div className="font-mono" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                {formatDate(opportunity.expectedCloseDate)}
              </div>
            </div>
          </div>

          {/* Details for CLOSED WON (AC1) */}
          {isWon && closedData && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(30, 41, 59, 0.8))',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Trophy size={18} className="text-emerald-400" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--success)' }}>
                  Hồ Sơ Thương Vụ Đóng Thắng (AC1 & AC4)
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá trị chốt thực tế:</span>
                  <div className="font-mono text-emerald-400" style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                    {formatCurrency(closedData.actualValue)}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ngày ký hợp đồng:</span>
                  <div className="font-mono" style={{ fontWeight: '600' }}>
                    {formatDate(closedData.signedDate)}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Số hợp đồng:</span>
                  <div className="font-mono" style={{ fontWeight: '600' }}>
                    {closedData.contractNumber || '—'}
                  </div>
                </div>
              </div>

              {closedData.winReasons && closedData.winReasons.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Yếu tố then chốt chiến thắng:
                  </span>
                  <div className="tags-wrap">
                    {closedData.winReasons.map((r, i) => (
                      <span key={i} className="badge badge-won">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              {closedData.lessonsLearned && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bài học thành công chia sẻ:</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                    "{closedData.lessonsLearned}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Details for CLOSED LOST (AC2) */}
          {isLost && closedData && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(30, 41, 59, 0.8))',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <XCircle size={18} className="text-rose-400" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--danger)' }}>
                  Hồ Sơ Thương Vụ Thất Bại (AC2 - Bài Học Rút Ra)
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lý do thua:</span>
                  <div style={{ fontWeight: '700', color: 'var(--danger)' }}>
                    {closedData.lossReason}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đối thủ thắng thầu:</span>
                  <div style={{ fontWeight: '600' }}>
                    {closedData.competitorName || 'Không rõ đối thủ'}
                  </div>
                </div>

                {closedData.competitorPrice && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá đối thủ chào thầu:</span>
                    <div className="font-mono" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {formatCurrency(closedData.competitorPrice)}
                    </div>
                  </div>
                )}
              </div>

              {closedData.lessonsLearned && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phân tích & Bài học kinh nghiệm:</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                    "{closedData.lessonsLearned}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Audit Trail Timeline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <Clock size={16} className="text-indigo-400" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Nhật Ký Kiểm Toán Lịch Sử (Audit Trail)
              </h4>
            </div>

            <div className="timeline">
              {(opportunity.auditTrail || []).map((log, index) => {
                const isWonAction = log.action === 'CLOSED_WON';
                const isLostAction = log.action === 'CLOSED_LOST';
                const isReopenedAction = log.action === 'REOPENED';

                return (
                  <div key={log.id || index} className="timeline-item">
                    <div className={`timeline-dot ${isWonAction ? 'won' : isLostAction ? 'lost' : isReopenedAction ? 'reopened' : ''}`}>
                      {isWonAction && <Trophy size={14} />}
                      {isLostAction && <XCircle size={14} />}
                      {isReopenedAction && <Clock size={14} />}
                      {!isWonAction && !isLostAction && !isReopenedAction && <FileText size={14} />}
                    </div>
                    <div className="timeline-content">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="timeline-actor">{log.actor}</span>
                        <span className="timeline-time font-mono">{log.timestamp}</span>
                      </div>
                      <div className="timeline-details">{log.details}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
