import React from 'react';
import { Link2Off, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatCurrencyVND, getIndividualContractValue, calculateGroupTotals } from '../utils/hierarchyUtils';

export function UnlinkConfirmationModal({
  isOpen,
  onClose,
  childCustomer,
  parentCustomer,
  contracts,
  customers,
  onConfirmUnlink
}) {
  if (!isOpen || !childCustomer || !parentCustomer) return null;

  const childVal = getIndividualContractValue(childCustomer.id, contracts);
  const parentTotals = calculateGroupTotals(parentCustomer.id, customers, contracts);
  const newParentValue = Math.max(0, parentTotals.totalGroupValue - childVal);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#ef4444' }}>
            <Link2Off size={22} />
            <span>Xác Nhận Tách Công Ty Con Khỏi Tập Đoàn</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="alert-box alert-warning">
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              Bạn có chắc chắn muốn ngắt quan hệ công ty con của{' '}
              <strong>"{childCustomer.name}"</strong> khỏi Tập đoàn{' '}
              <strong>"{parentCustomer.shortName}"</strong>?
            </div>
          </div>

          <div className="impact-preview-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>
              TÁC ĐỘNG TỚI TỔNG GIÁ TRỊ HỢP ĐỒNG CẢ TẬP ĐOÀN:
            </div>

            <div className="impact-values-row">
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Giá trị Tập đoàn hiện tại:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {formatCurrencyVND(parentTotals.totalGroupValue)}
                </div>
              </div>

              <ArrowRight size={20} style={{ color: '#ef4444' }} />

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', color: '#f87171' }}>
                  Giá trị mới sau khi tách:
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f87171' }}>
                  {formatCurrencyVND(newParentValue)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  - {formatCurrencyVND(childVal)} (Hợp đồng của {childCustomer.shortName})
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Sau khi tách, khách hàng này sẽ trở thành <strong>Khách hàng Độc lập</strong>. Toàn bộ dữ liệu hợp đồng cá nhân của khách hàng vẫn được bảo toàn nguyên vẹn 100%.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button
            className="btn btn-danger-outline"
            style={{ background: '#ef4444', color: '#fff', border: 'none' }}
            onClick={() => onConfirmUnlink(childCustomer.id)}
          >
            <Link2Off size={16} /> Xác Nhận Ngắt Liên Kết
          </button>
        </div>
      </div>
    </div>
  );
}
