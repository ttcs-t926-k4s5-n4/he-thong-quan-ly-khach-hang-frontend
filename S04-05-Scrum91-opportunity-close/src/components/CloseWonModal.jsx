import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { WIN_REASONS } from '../data/mockLossReasons';

export const CloseWonModal = ({ isOpen, onClose, opportunity, onSubmitWon }) => {
  if (!isOpen || !opportunity) return null;

  const [actualValue, setActualValue] = useState(opportunity.expectedValue || '');
  const [signedDate, setSignedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [contractNumber, setContractNumber] = useState(
    `HĐ-2026/${opportunity.id.replace('OPP-2026-', '')}`
  );
  const [selectedReasons, setSelectedReasons] = useState([
    'Giải pháp kỹ thuật ưu việt & Demo xuất sắc'
  ]);
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opportunity) {
      setActualValue(opportunity.expectedValue || '');
      setContractNumber(`HĐ-2026/${opportunity.id.replace('OPP-2026-', '')}`);
      setErrors({});
    }
  }, [opportunity]);

  const numActual = Number(actualValue) || 0;
  const numExpected = Number(opportunity.expectedValue) || 0;
  const delta = numActual - numExpected;
  const deltaPercent = numExpected > 0 ? (delta / numExpected) * 100 : 0;

  const handleToggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate AC1: Bắt buộc nhập giá trị chốt thực tế > 0
    if (!actualValue || isNaN(Number(actualValue)) || Number(actualValue) <= 0) {
      newErrors.actualValue = 'Vui lòng nhập giá trị chốt thực tế hợp lệ (lớn hơn 0 ₫).';
    }

    // Validate AC1: Bắt buộc nhập ngày ký
    if (!signedDate || signedDate.trim() === '') {
      newErrors.signedDate = 'Vui lòng chọn ngày ký kết hợp đồng.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmitWon(opportunity.id, {
      actualValue: numActual,
      signedDate,
      contractNumber: contractNumber.trim() || `HĐ-2026/${opportunity.id}`,
      winReasons: selectedReasons,
      lessonsLearned: lessonsLearned.trim() || 'Chốt thành công theo đúng cam kết báo giá kỹ thuật.'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleFormSubmit}>
          {/* Header */}
          <div className="modal-header won-header">
            <div className="modal-title-group">
              <div className="kpi-icon-wrap won" style={{ width: '32px', height: '32px' }}>
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="modal-title" style={{ color: 'var(--success)' }}>
                  Đóng Thắng Cơ Hội Bán Hàng (Closed Won)
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
            {/* Acceptance Criteria 1 Notice */}
            <div style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#34d399'
            }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>Yêu cầu Tiêu chí 1 (AC1):</strong> Bắt buộc nhập <em>Giá trị chốt thực tế</em> và <em>Ngày ký hợp đồng</em>. Giá trị này sẽ được tính ngay vào chỉ tiêu KPI của người sở hữu (<strong>{opportunity.ownerName}</strong>).
              </span>
            </div>

            {/* Field: Actual Value */}
            <div className="form-group">
              <label className="form-label" htmlFor="actual-val-input">
                <span>Giá trị chốt thực tế (VNĐ)</span>
                <span className="required-star">* (Bắt buộc)</span>
              </label>
              <input
                id="actual-val-input"
                type="number"
                min="1"
                step="1000"
                className={`form-input font-mono ${errors.actualValue ? 'has-error' : ''}`}
                value={actualValue}
                onChange={(e) => {
                  setActualValue(e.target.value);
                  if (errors.actualValue) setErrors({ ...errors, actualValue: null });
                }}
                placeholder="Nhập số tiền chốt thực tế, ví dụ: 125000000"
              />
              {errors.actualValue && (
                <span className="form-error-msg">
                  <AlertCircle size={12} /> {errors.actualValue}
                </span>
              )}

              {/* Delta Comparison Preview */}
              <div className="delta-box" style={{ marginTop: '0.4rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="delta-label">Giá trị dự kiến ban đầu:</div>
                  <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(opportunity.expectedValue)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="delta-label">Chênh lệch (Δ):</div>
                  <div className={`delta-val ${delta >= 0 ? 'positive' : 'negative'} font-mono`}>
                    {delta >= 0 ? `+${formatCurrency(delta)}` : formatCurrency(delta)} 
                    <span style={{ fontSize: '0.75rem', marginLeft: '0.35rem' }}>
                      ({delta >= 0 ? `+${Math.round(deltaPercent)}%` : `${Math.round(deltaPercent)}%`})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field: Signed Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="signed-date-input">
                <Calendar size={14} className="text-muted" />
                <span>Ngày ký kết hợp đồng chính thức</span>
                <span className="required-star">* (Bắt buộc)</span>
              </label>
              <input
                id="signed-date-input"
                type="date"
                className={`form-input font-mono ${errors.signedDate ? 'has-error' : ''}`}
                value={signedDate}
                onChange={(e) => {
                  setSignedDate(e.target.value);
                  if (errors.signedDate) setErrors({ ...errors, signedDate: null });
                }}
              />
              {errors.signedDate && (
                <span className="form-error-msg">
                  <AlertCircle size={12} /> {errors.signedDate}
                </span>
              )}
            </div>

            {/* Field: Contract Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="contract-no-input">
                <FileText size={14} className="text-muted" />
                <span>Số hiệu / Mã hợp đồng kinh tế</span>
              </label>
              <input
                id="contract-no-input"
                type="text"
                className="form-input font-mono"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="Ví dụ: HĐ-2026/088-GHN"
              />
            </div>

            {/* Field: Key Win Reasons */}
            <div className="form-group">
              <label className="form-label">
                <Sparkles size={14} className="text-emerald-400" />
                <span>Lý do chính giúp thắng thầu (Chọn các yếu tố)</span>
              </label>
              <div className="tags-wrap">
                {WIN_REASONS.map((reason) => {
                  const isSelected = selectedReasons.includes(reason);
                  return (
                    <button
                      type="button"
                      key={reason}
                      className={`tag-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleReason(reason)}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field: Win Lessons Learned */}
            <div className="form-group">
              <label className="form-label" htmlFor="lessons-input">
                <span>Bài học thành công rút ra (Kinh nghiệm cho toàn đội ngũ Sales)</span>
              </label>
              <textarea
                id="lessons-input"
                rows="3"
                className="form-textarea"
                placeholder="Chia sẻ yếu tố mấu chốt: Buổi demo tính năng nào khách thích nhất? Cách xử lý phản đối giá? Kỹ thuật đàm phán hợp đồng..."
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
              />
              <span className="form-hint">
                Dữ liệu này sẽ được lưu vào Trung tâm Phân tích Win/Loss để toàn công ty học hỏi.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-won">
              <Trophy size={15} />
              Xác Nhận Đóng Thắng & Tính KPI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
