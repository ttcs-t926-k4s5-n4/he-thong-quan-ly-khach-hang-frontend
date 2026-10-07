import React, { useState } from 'react';
import { ArrowRightLeft, X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MergeReassignModal({
  isOpen,
  onClose,
  sourceItem,
  category,
  availableItems,
  onConfirmReassign
}) {
  const [targetItemId, setTargetItemId] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !sourceItem) return null;

  // Filter out the source item itself
  const selectableTargets = availableItems.filter(i => i.id !== sourceItem.id && i.isActive);

  const handleExecute = () => {
    if (!targetItemId) return;
    onConfirmReassign(category.id, sourceItem.id, targetItemId);
    onClose();
  };

  const targetItem = selectableTargets.find(i => i.id === targetItemId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ArrowRightLeft size={20} color="var(--primary)" />
            <span>Gộp & Chuyển Đổi Tham Chiếu Dữ Liệu</span>
          </div>
          <button 
            className="btn btn-outline btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="alert-box alert-warning">
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              Tính năng <strong>Gộp danh mục (Merge & Reassign)</strong>: Hệ thống sẽ tự động quét toàn bộ khách hàng, lead, cơ hội đang trỏ vào <strong>"{sourceItem.name}"</strong> và cập nhật sang mục đích mới. Sau khi hoàn tất, mục nguồn sẽ có 0 tham chiếu và có thể xóa an toàn!
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Mục nguồn đang chứa tham chiếu:</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={`${sourceItem.code} - ${sourceItem.name}`} 
                disabled 
                style={{ opacity: 0.8 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Chọn mục đích nhận dữ liệu thay thế: <span style={{ color: 'var(--danger)' }}>*</span></span>
              </label>
              <select 
                className="select-custom"
                value={targetItemId}
                onChange={(e) => setTargetItemId(e.target.value)}
              >
                <option value="">-- Chọn mục danh mục đích để tiếp nhận --</option>
                {selectableTargets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.code} - {t.name}
                  </option>
                ))}
              </select>
            </div>

            {targetItem && (
              <div style={{ background: 'var(--bg-muted)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mô phỏng thao tác:</span>
                <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem' }}>
                  [ {sourceItem.name} ] ➔ Chuyển toàn bộ dữ liệu sang ➔ [ {targetItem.name} ]
                </div>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', marginTop: '0.5rem' }}>
              <input 
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: 'var(--primary)' }}
              />
              <span>Tôi xác nhận cập nhật hàng loạt các bản ghi liên quan sang mục danh mục mới này.</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onClose}
          >
            Hủy Bỏ
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            disabled={!targetItemId || !confirmed}
            onClick={handleExecute}
          >
            <Check size={16} />
            <span>Thực Hiện Gộp Dữ Liệu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
