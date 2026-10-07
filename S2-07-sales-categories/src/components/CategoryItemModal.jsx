import React, { useState, useEffect } from 'react';
import { X, Check, Tag, Hash, FileText, Palette, Star } from 'lucide-react';

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#f97316', // Orange
  '#64748b'  // Slate
];

export default function CategoryItemModal({
  isOpen,
  onClose,
  onSave,
  category,
  editingItem,
  existingItems
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    color: '#3b82f6',
    isActive: true,
    isDefault: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        code: editingItem.code || '',
        name: editingItem.name || '',
        description: editingItem.description || '',
        color: editingItem.color || category?.color || '#3b82f6',
        isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
        isDefault: editingItem.isDefault || false
      });
    } else {
      // Create new: generate suggested code
      const count = (existingItems?.length || 0) + 1;
      const prefix = category?.code ? category.code.replace('CAT_', '') : 'ITEM';
      setFormData({
        code: `${prefix}_${count < 10 ? '0' + count : count}`,
        name: '',
        description: '',
        color: category?.color || '#3b82f6',
        isActive: true,
        isDefault: false
      });
    }
    setErrors({});
  }, [editingItem, category, isOpen, existingItems]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Vui lòng nhập tên mục danh mục';
    }
    if (!formData.code.trim()) {
      errs.code = 'Vui lòng nhập mã danh mục';
    } else {
      // Check code uniqueness
      const duplicate = existingItems.find(
        i => i.code.trim().toUpperCase() === formData.code.trim().toUpperCase() &&
             (!editingItem || i.id !== editingItem.id)
      );
      if (duplicate) {
        errs.code = 'Mã danh mục này đã tồn tại trong hệ thống';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Tag size={20} color="var(--primary)" />
            <span>{editingItem ? 'Chỉnh Sửa Mục Danh Mục' : 'Thêm Mục Danh Mục Mới'}</span>
          </div>
          <button 
            className="btn btn-outline btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert-box alert-info">
              <span>Đang thao tác trên danh mục: <strong>{category?.name}</strong>. Mục này sẽ có hiệu lực trên toàn bộ phân hệ CRM bán hàng.</span>
            </div>

            {/* Mã Danh mục */}
            <div className="form-group">
              <label className="form-label">
                <span>Mã Danh Mục (Code) <span style={{ color: 'var(--danger)' }}>*</span></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duy nhất, viết hoa, gạch dưới</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                  placeholder="VD: IND_TECH, SIZE_SME..."
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                />
              </div>
              {errors.code && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.code}</span>}
            </div>

            {/* Tên Mục */}
            <div className="form-group">
              <label className="form-label">
                <span>Tên Hiển Thị (Display Name) <span style={{ color: 'var(--danger)' }}>*</span></span>
              </label>
              <input 
                type="text"
                className="form-input"
                placeholder="VD: Công nghệ thông tin & Viễn thông..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
              {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.name}</span>}
            </div>

            {/* Mô tả chi tiết */}
            <div className="form-group">
              <label className="form-label">
                <span>Mô Tả Hướng Dẫn Sử Dụng</span>
              </label>
              <textarea 
                className="form-textarea"
                rows={3}
                placeholder="Mô tả phạm vi áp dụng giúp nhân viên kinh doanh chọn chính xác..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Màu nhận diện */}
            <div className="form-group">
              <label className="form-label">
                <span>Màu Sắc Nhận Diện (Dùng cho Biểu Đồ & Thẻ CRM)</span>
              </label>
              <div className="color-swatches">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch-btn ${formData.color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c, color: c }}
                    onClick={() => setFormData({ ...formData, color: c })}
                    title={`Chọn màu ${c}`}
                  />
                ))}
                <input 
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: '50%' }}
                  title="Chọn màu tùy biến khác"
                />
              </div>
            </div>

            {/* Tùy chọn trạng thái & mặc định */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input 
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Kích hoạt áp dụng ngay (Active)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input 
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Đặt làm giá trị gợi ý mặc định</span>
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
              type="submit" 
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>{editingItem ? 'Lưu Thay Đổi' : 'Tạo Mục Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
