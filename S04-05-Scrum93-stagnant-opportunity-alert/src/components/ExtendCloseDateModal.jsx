import React, { useState } from 'react';
import { Calendar, CalendarPlus, X, Check, AlertCircle } from 'lucide-react';
import { formatDateVN } from '../utils/formatters.js';

export const ExtendCloseDateModal = ({
  isOpen,
  onClose,
  opportunity,
  onSaveNewCloseDate
}) => {
  if (!isOpen || !opportunity) return null;

  const [newCloseDate, setNewCloseDate] = useState('2026-10-31');
  const [reason, setReason] = useState('Khách hàng xin thêm thời gian rà soát hồ sơ thanh toán nội bộ với Hội đồng Quản trị.');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCloseDate) {
      alert('Vui lòng chọn ngày dự kiến chốt mới.');
      return;
    }

    onSaveNewCloseDate(opportunity.id, newCloseDate, reason);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <CalendarPlus size={20} style={{ color: '#ec4899' }} />
            <span>Gia Hạn Ngày Dự Kiến Chốt (Giải Tỏa Cờ AC2)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              🎯 <strong>Tiêu chí AC2:</strong> Cơ hội quá ngày dự kiến chốt mà chưa đóng sẽ bị gắn cờ. Khi cập nhật ngày dự kiến chốt mới về tương lai, hệ thống sẽ <strong>tự động gỡ bỏ cờ quá hạn chốt</strong>!
            </div>

            <div className="form-group">
              <label className="form-label">Cơ Hội:</label>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {opportunity.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Khách hàng: {opportunity.customerName}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ngày Dự Kiến Chốt Hiện Tại (Đang Quá Hạn):</label>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 700 }}>
                {formatDateVN(opportunity.expectedCloseDate)} 
                {opportunity.isCloseDateOverdue && ` (Đã trễ ${opportunity.daysOverdue} ngày)`}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Chọn Ngày Dự Kiến Chốt Mới:</label>
              <input 
                type="date"
                className="form-control"
                value={newCloseDate}
                onChange={(e) => setNewCloseDate(e.target.value)}
                min="2026-10-18"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lý Do Gia Hạn Hợp Đồng:</label>
              <textarea 
                className="form-control"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do khách hàng xin lùi ngày chốt hoặc điều kiện cần chờ đợi..."
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: '#ec4899' }}>
              <Check size={16} />
              <span>Gia Hạn &amp; Gỡ Cờ Quá Hạn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
