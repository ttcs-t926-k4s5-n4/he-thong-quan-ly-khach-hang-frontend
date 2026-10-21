import React, { useState, useEffect } from 'react';
import { 
  XCircle, 
  X, 
  AlertCircle, 
  ShieldAlert, 
  Building, 
  FileText,
  DollarSign
} from 'lucide-react';
import { LOSS_REASONS } from '../data/mockLossReasons';
import { MOCK_COMPETITORS } from '../data/mockCompetitors';

export const CloseLostModal = ({ isOpen, onClose, opportunity, onSubmitLost }) => {
  if (!isOpen || !opportunity) return null;

  const [lossReason, setLossReason] = useState('');
  const [competitorId, setCompetitorId] = useState('COMP-01');
  const [customCompetitor, setCustomCompetitor] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opportunity) {
      setLossReason('');
      setCompetitorId('COMP-01');
      setCustomCompetitor('');
      setCompetitorPrice('');
      setLessonsLearned('');
      setErrors({});
    }
  }, [opportunity]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate AC2: Bắt buộc chọn lý do thua
    if (!lossReason || lossReason.trim() === '') {
      newErrors.lossReason = 'Vui lòng chọn lý do thua thương vụ (bắt buộc theo Tiêu chí 2).';
    }

    if (competitorId === 'COMP-OTHER' && !customCompetitor.trim()) {
      newErrors.customCompetitor = 'Vui lòng nhập tên đối thủ hoặc ghi "Không rõ đối thủ".';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCompObj = MOCK_COMPETITORS.find((c) => c.id === competitorId);
    const competitorName = competitorId === 'COMP-OTHER' 
      ? customCompetitor.trim() 
      : selectedCompObj?.name || 'Chưa xác định';

    onSubmitLost(opportunity.id, {
      lossReason,
      competitorId,
      competitorName,
      competitorPrice: competitorPrice ? Number(competitorPrice) : null,
      lessonsLearned: lessonsLearned.trim() || 'Thất bại do sự chênh lệch về giá và mối quan hệ thị trường.',
      type: 'LOST'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleFormSubmit}>
          {/* Header */}
          <div className="modal-header lost-header">
            <div className="modal-title-group">
              <div className="kpi-icon-wrap lost" style={{ width: '32px', height: '32px' }}>
                <XCircle size={18} />
              </div>
              <div>
                <h3 className="modal-title" style={{ color: 'var(--danger)' }}>
                  Đóng Thua Cơ Hội Bán Hàng (Closed Lost)
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
            {/* Acceptance Criteria 2 Notice */}
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#f87171'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>Yêu cầu Tiêu chí 2 (AC2):</strong> Bắt buộc chọn <em>Lý do thua</em> và <em>Đối thủ thắng thầu nếu có</em> để phục vụ mục đích <strong>công ty học hỏi từ cả thương vụ thắng lẫn thua</strong>.
              </span>
            </div>

            {/* Field: Loss Reason */}
            <div className="form-group">
              <label className="form-label" htmlFor="loss-reason-select">
                <span>Lý do chính dẫn tới thất bại thương vụ</span>
                <span className="required-star">* (Bắt buộc)</span>
              </label>
              <select
                id="loss-reason-select"
                className={`form-select ${errors.lossReason ? 'has-error' : ''}`}
                value={lossReason}
                onChange={(e) => {
                  setLossReason(e.target.value);
                  if (errors.lossReason) setErrors({ ...errors, lossReason: null });
                }}
              >
                <option value="">-- Chọn nguyên nhân thua thầu chính --</option>
                {LOSS_REASONS.map((lr) => (
                  <option key={lr.id} value={lr.label}>
                    {lr.label}
                  </option>
                ))}
              </select>
              {errors.lossReason && (
                <span className="form-error-msg">
                  <AlertCircle size={12} /> {errors.lossReason}
                </span>
              )}
            </div>

            {/* Field: Competitor */}
            <div className="form-group">
              <label className="form-label" htmlFor="competitor-select">
                <Building size={14} className="text-muted" />
                <span>Đối thủ thắng thầu (Nếu có)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Theo Tiêu chí 2)</span>
              </label>
              <select
                id="competitor-select"
                className="form-select"
                value={competitorId}
                onChange={(e) => setCompetitorId(e.target.value)}
              >
                {MOCK_COMPETITORS.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} {comp.strengths ? `(${comp.strengths})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* If OTHER competitor selected */}
            {competitorId === 'COMP-OTHER' && (
              <div className="form-group">
                <label className="form-label" htmlFor="custom-comp-input">
                  <span>Tên đối thủ cụ thể / Ghi chú</span>
                  <span className="required-star">* (Bắt buộc khi chọn khác)</span>
                </label>
                <input
                  id="custom-comp-input"
                  type="text"
                  className={`form-input ${errors.customCompetitor ? 'has-error' : ''}`}
                  value={customCompetitor}
                  onChange={(e) => {
                    setCustomCompetitor(e.target.value);
                    if (errors.customCompetitor) setErrors({ ...errors, customCompetitor: null });
                  }}
                  placeholder="Nhập tên công ty đối thủ hoặc giải pháp tự phát triển"
                />
                {errors.customCompetitor && (
                  <span className="form-error-msg">
                    <AlertCircle size={12} /> {errors.customCompetitor}
                  </span>
                )}
              </div>
            )}

            {/* Competitor Price (Optional estimate) */}
            <div className="form-group">
              <label className="form-label" htmlFor="comp-price-input">
                <DollarSign size={14} className="text-muted" />
                <span>Giá trúng thầu ước tính của đối thủ (VNĐ - nếu biết)</span>
              </label>
              <input
                id="comp-price-input"
                type="number"
                min="0"
                step="1000"
                className="form-input font-mono"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(e.target.value)}
                placeholder="Ví dụ: 85000000"
              />
            </div>

            {/* Loss Lessons Learned / Post-Mortem */}
            <div className="form-group">
              <label className="form-label" htmlFor="loss-notes-input">
                <FileText size={14} className="text-muted" />
                <span>Phân tích nguyên nhân & Bài học rút ra (Học hỏi từ thương vụ thua)</span>
              </label>
              <textarea
                id="loss-notes-input"
                rows="3"
                className="form-textarea"
                placeholder="Ví dụ: Đối thủ có gói dịch vụ bảo trì 2 năm miễn phí; Khách hàng đánh giá giao diện mobile của ta chưa tối ưu; Cần cải thiện demo tính năng báo cáo..."
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
              />
              <span className="form-hint">
                Dữ liệu bài học kinh nghiệm sẽ được tổng hợp cho khối Kỹ thuật, Sản phẩm và Ban giám đốc.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-lost">
              <XCircle size={15} />
              Xác Nhận Đóng Thua & Lưu Bài Học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
