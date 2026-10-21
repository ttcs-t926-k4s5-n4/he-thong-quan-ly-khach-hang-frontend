import React, { useState } from 'react';
import { 
  RotateCcw, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle,
  Lock,
  UserCheck
} from 'lucide-react';
import { USER_ROLES } from '../data/mockUsers';

export const ReopenModal = ({ 
  isOpen, 
  onClose, 
  opportunity, 
  currentUser, 
  onSubmitReopen 
}) => {
  if (!isOpen || !opportunity) return null;

  const currentRole = USER_ROLES[currentUser.role] || USER_ROLES.SALES_REP;
  const canReopen = currentRole.canReopen;

  const [reopenReason, setReopenReason] = useState('');
  const [targetStage, setTargetStage] = useState('NEGOTIATION');
  const [error, setError] = useState(null);

  const isWonOpportunity = opportunity.stage === 'CLOSED_WON';

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!canReopen) {
      setError('Bạn không có quyền thực hiện. Chỉ Trưởng nhóm trở lên mới mở lại được (AC3).');
      return;
    }

    // Validate AC3: Bắt buộc nhập lý do mở lại
    if (!reopenReason || reopenReason.trim().length < 5) {
      setError('Vui lòng nhập lý do mở lại cơ hội cụ thể (tối thiểu 5 ký tự).');
      return;
    }

    onSubmitReopen(opportunity.id, {
      reopenReason: reopenReason.trim(),
      targetStage,
      reopenedBy: currentUser.name,
      reopenedRole: currentRole.name
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleFormSubmit}>
          {/* Header */}
          <div className="modal-header reopen-header">
            <div className="modal-title-group">
              <div className="kpi-icon-wrap rate" style={{ width: '32px', height: '32px' }}>
                <RotateCcw size={18} />
              </div>
              <div>
                <h3 className="modal-title" style={{ color: 'var(--purple)' }}>
                  Mở Lại Cơ Hội Đã Đóng (Re-open Opportunity)
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {opportunity.id} &bull; {opportunity.title}
                </span>
              </div>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Acceptance Criteria 3 Banner */}
            <div style={{
              background: 'var(--purple-bg)',
              border: '1px solid var(--purple-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.82rem',
              color: '#d8b4fe'
            }}>
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Tiêu chí 3 (AC3):</strong> Cơ hội đã đóng không thể sửa bởi nhân viên. Chỉ <strong>Trưởng nhóm trở lên</strong> được phép mở lại và <strong>bắt buộc phải kèm lý do</strong>.
              </div>
            </div>

            {/* Role Verification Check */}
            <div style={{
              background: canReopen ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${canReopen ? 'var(--success-border)' : 'var(--danger-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} className={canReopen ? 'text-emerald-400' : 'text-rose-400'} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  Người thực hiện: <strong>{currentUser.name}</strong> ({currentRole.name})
                </span>
              </div>
              <span className={`role-badge ${currentRole.badgeColor}`}>
                {canReopen ? 'Đủ Quyền Mở Lại' : 'Không Đủ Quyền'}
              </span>
            </div>

            {!canReopen ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--danger)' }}>
                <AlertCircle size={28} style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  Bạn đang sử dụng vai trò Nhân viên kinh doanh.
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Vui lòng chuyển đổi người dùng sang <strong>Trần Đình Trọng (Trưởng nhóm)</strong> hoặc <strong>Lê Hoàng Nam (Giám đốc)</strong> trên thanh Persona Switcher để thực hiện quyền này.
                </p>
              </div>
            ) : (
              <>
                {/* Won rollback notice */}
                {isWonOpportunity && (
                  <div style={{
                    background: 'var(--warning-bg)',
                    border: '1px solid var(--warning-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    color: '#fbbf24'
                  }}>
                    ⚠️ <strong>Lưu ý về KPI (AC4):</strong> Cơ hội này trước đó đã Đóng Thắng. Sau khi mở lại, doanh số chốt thực tế sẽ tự động được hoàn trừ khỏi chỉ tiêu của người sở hữu (<strong>{opportunity.ownerName}</strong>).
                  </div>
                )}

                {/* Target Stage */}
                <div className="form-group">
                  <label className="form-label" htmlFor="target-stage-select">
                    <span>Trạng thái sau khi mở lại</span>
                  </label>
                  <select
                    id="target-stage-select"
                    className="form-select"
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value)}
                  >
                    <option value="NEGOTIATION">Đang Đàm Phán (Negotiation)</option>
                    <option value="PROPOSAL">Gửi Báo Giá (Proposal)</option>
                  </select>
                </div>

                {/* Field: Reopen Reason (MANDATORY AC3) */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reopen-reason-input">
                    <span>Lý do mở lại cơ hội</span>
                    <span className="required-star">* (Bắt buộc theo AC3)</span>
                  </label>
                  <textarea
                    id="reopen-reason-input"
                    rows="3"
                    className={`form-textarea ${error ? 'has-error' : ''}`}
                    placeholder="Ví dụ: Khách hàng yêu cầu tái đàm phán điều khoản thanh toán; Khách hàng liên hệ lại muốn tiếp tục dự án; Cần bổ sung sản phẩm mới vào hợp đồng..."
                    value={reopenReason}
                    onChange={(e) => {
                      setReopenReason(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                  {error && (
                    <span className="form-error-msg">
                      <AlertCircle size={12} /> {error}
                    </span>
                  )}
                  <span className="form-hint">
                    Lý do này sẽ được ghi lại trong Nhật ký kiểm toán (Audit Trail) vĩnh viễn.
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Đóng Cửa Sổ
            </button>
            {canReopen && (
              <button type="submit" className="btn btn-reopen">
                <RotateCcw size={15} />
                Xác Nhận Mở Lại Cơ Hội
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
