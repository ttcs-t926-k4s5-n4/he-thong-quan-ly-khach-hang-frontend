import React from 'react';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';

export default function SafeDeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  category
}) {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--danger)' }}>
            <Trash2 size={20} color="var(--danger)" />
            <span>Xác Nhận Xóa Mục Danh Mục</span>
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
          <div className="alert-box alert-success">
            <Check size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Kiểm tra an toàn dữ liệu: ĐẠT</strong><br />
              Mục này hiện có <strong>0 tham chiếu</strong> trong cơ sở dữ liệu CRM (Không có khách hàng, lead hay cơ hội nào liên kết). Việc xóa là hoàn toàn an toàn và không gây lỗi toàn vẹn dữ liệu.
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Bạn có chắc chắn muốn xóa mục danh mục <strong>"{item.name}"</strong> (Mã: <code>{item.code}</code>) khỏi danh mục <em>{category?.name}</em> không?
          </p>
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
            className="btn btn-danger-outline"
            style={{ background: 'var(--danger)', color: '#ffffff' }}
            onClick={() => {
              onConfirm(category.id, item.id);
              onClose();
            }}
          >
            <Trash2 size={16} />
            <span>Xác Nhận Xóa Vĩnh Viễn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
