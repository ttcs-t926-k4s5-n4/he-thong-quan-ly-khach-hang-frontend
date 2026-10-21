import React, { useState, useEffect } from 'react';
import { X, MapPin, Save, AlertCircle } from 'lucide-react';

export default function TerritoryModal({
  isOpen,
  onClose,
  onSave,
  editingTerritory
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    regionGroup: 'Miền Bắc',
    provincesStr: '',
    marketPotential: 'Cao (Doanh nghiệp B2B & KCN)',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTerritory) {
      setFormData({
        name: editingTerritory.name || '',
        code: editingTerritory.code || '',
        regionGroup: editingTerritory.regionGroup || 'Miền Bắc',
        provincesStr: (editingTerritory.provinces || []).join(', '),
        marketPotential: editingTerritory.marketPotential || '',
        description: editingTerritory.description || ''
      });
    } else {
      setFormData({
        name: '',
        code: `TERR-NEW-${Date.now().toString().slice(-3)}`,
        regionGroup: 'Miền Bắc',
        provincesStr: '',
        marketPotential: 'Cao (Doanh nghiệp B2B & KCN)',
        description: ''
      });
    }
    setError('');
  }, [editingTerritory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên khu vực địa lý.');
      return;
    }
    if (!formData.code.trim()) {
      setError('Vui lòng nhập mã khu vực.');
      return;
    }

    const provinces = formData.provincesStr
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    onSave({
      ...formData,
      id: editingTerritory ? editingTerritory.id : `KV-${Date.now().toString().slice(-4)}`,
      provinces: provinces.length > 0 ? provinces : [formData.name],
      status: 'active'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="modal-title">
                {editingTerritory ? 'Chỉnh Sửa Khu Vực Địa Lý' : 'Khai Báo Khu Vực Địa Lý Mới'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Định nghĩa địa bàn kinh doanh để gán trách nhiệm cho các nhóm bán hàng
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--accent-rose-bg)', 
                color: 'var(--accent-rose)', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Tên Khu Vực Địa Lý *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Vùng Duyên Hải Miền Trung..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mã Khu Vực *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Phân Vùng Miền Trọng Điểm</label>
                <select 
                  className="form-select"
                  value={formData.regionGroup}
                  onChange={(e) => setFormData({ ...formData, regionGroup: e.target.value })}
                >
                  <option value="Toàn Quốc">Toàn Quốc</option>
                  <option value="Miền Bắc">Miền Bắc</option>
                  <option value="Miền Trung">Miền Trung</option>
                  <option value="Miền Nam">Miền Nam</option>
                  <option value="Đặc Biệt">Thị Trường Mới / Đặc Biệt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tiềm Năng Thị Trường</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Cao / Rất Lớn / Tiềm Năng..."
                  value={formData.marketPotential}
                  onChange={(e) => setFormData({ ...formData, marketPotential: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Danh Sách Tỉnh / Thành / Quận Huyện (cách nhau bằng dấu phẩy)</label>
              <textarea 
                className="form-textarea"
                rows="2"
                placeholder="Ví dụ: Hà Nội, Bắc Ninh, Hải Dương, Hưng Yên..."
                value={formData.provincesStr}
                onChange={(e) => setFormData({ ...formData, provincesStr: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô Tả & Định Hướng Khai Thác</label>
              <textarea 
                className="form-textarea"
                rows="2"
                placeholder="Ghi chú về phân khúc khách hàng, cơ chế mở rộng..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{editingTerritory ? 'Cập Nhật Khu Vực' : 'Lưu Khu Vực'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
