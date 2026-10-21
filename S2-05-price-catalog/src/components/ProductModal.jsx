import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Repeat, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Check, 
  Percent, 
  Coins 
} from 'lucide-react';
import { formatVND, calculateMargin, formatPercent } from '../utils/formatters';

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingProduct, 
  currentRole, 
  existingProducts = [] 
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'one_time', // 'one_time' | 'subscription'
    billingCycle: 'month',
    unit: 'Gói',
    category: 'Phần mềm',
    listedPrice: '',
    floorPrice: '',
    costPrice: '',
    description: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        listedPrice: editingProduct.listedPrice || '',
        floorPrice: editingProduct.floorPrice || '',
        costPrice: editingProduct.costPrice || ''
      });
    } else {
      // New product defaults
      setFormData({
        code: `SP-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        type: 'one_time',
        billingCycle: 'month',
        unit: 'Bộ',
        category: 'Phần mềm',
        listedPrice: '',
        floorPrice: '',
        costPrice: currentRole === 'director' ? '' : 0,
        description: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [editingProduct, isOpen, currentRole]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code || !formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã sản phẩm / dịch vụ.';
    } else {
      // Check duplicate code
      const isDuplicate = existingProducts.some(
        p => p.code.toUpperCase() === formData.code.trim().toUpperCase() && 
             (!editingProduct || p.id !== editingProduct.id)
      );
      if (isDuplicate) {
        newErrors.code = 'Mã sản phẩm này đã tồn tại trong danh mục!';
      }
    }

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên sản phẩm / dịch vụ.';
    }

    if (!formData.unit || !formData.unit.trim()) {
      newErrors.unit = 'Vui lòng nhập đơn vị tính (Cái, Bộ, User/Tháng...).';
    }

    const listed = Number(formData.listedPrice);
    const floor = Number(formData.floorPrice);
    const cost = Number(formData.costPrice);

    if (isNaN(listed) || listed <= 0) {
      newErrors.listedPrice = 'Giá niêm yết phải lớn hơn 0 ₫.';
    }

    if (isNaN(floor) || floor <= 0) {
      newErrors.floorPrice = 'Giá sàn phải lớn hơn 0 ₫.';
    } else if (listed > 0 && floor > listed) {
      newErrors.floorPrice = 'Giá sàn không được cao hơn Giá niêm yết chuẩn!';
    }

    if (currentRole === 'director') {
      if (isNaN(cost) || cost < 0) {
        newErrors.costPrice = 'Giá vốn không hợp lệ.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productPayload = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      listedPrice: Number(formData.listedPrice),
      floorPrice: Number(formData.floorPrice),
      // If sales rep, preserve original cost or 0
      costPrice: currentRole === 'director' ? Number(formData.costPrice) : (editingProduct ? editingProduct.costPrice : 0)
    };

    onSave(productPayload);
    onClose();
  };

  // Calculate live margin
  const liveListed = Number(formData.listedPrice) || 0;
  const liveFloor = Number(formData.floorPrice) || 0;
  const liveCost = Number(formData.costPrice) || 0;
  const marginListed = liveListed > 0 && currentRole === 'director' ? calculateMargin(liveListed, liveCost) : 0;
  const marginFloor = liveFloor > 0 && currentRole === 'director' ? calculateMargin(liveFloor, liveCost) : 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-box modal-lg">
        <div className="modal-header">
          <div className="modal-title">
            <Package size={22} color="var(--primary)" />
            <span>{editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm / Dịch Vụ' : 'Khai Báo Sản Phẩm / Dịch Vụ Mới'}</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type selection: One-time vs Subscription */}
            <div className="form-group">
              <label className="form-label">
                <span>Phân loại sản phẩm / dịch vụ <span style={{ color: '#ef4444' }}>*</span></span>
                <span className="form-helper">Theo tiêu chí SCRUM-63</span>
              </label>
              <div className="radio-cards-grid">
                <div 
                  className={`radio-card ${formData.type === 'one_time' ? 'active' : ''}`}
                  onClick={() => handleChange('type', 'one_time')}
                >
                  <Package size={20} color={formData.type === 'one_time' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div>
                    <div className="radio-card-title">Sản phẩm một lần</div>
                    <div className="radio-card-desc">Thiết bị phần cứng, Giấy phép on-premise vĩnh viễn, Gói chuyển giao</div>
                  </div>
                </div>

                <div 
                  className={`radio-card ${formData.type === 'subscription' ? 'active' : ''}`}
                  onClick={() => handleChange('type', 'subscription')}
                >
                  <Repeat size={20} color={formData.type === 'subscription' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div>
                    <div className="radio-card-title">Dịch vụ thuê bao</div>
                    <div className="radio-card-desc">Thuê bao SaaS định kỳ hàng tháng/năm, Gói hỗ trợ SLA 24/7, AI Seat</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-grid">
              {/* Product Code */}
              <div className="form-group">
                <label className="form-label">
                  <span>Mã sản phẩm / SKU <span style={{ color: '#ef4444' }}>*</span></span>
                  <span className="form-helper">Duy nhất</span>
                </label>
                <input
                  type="text"
                  className="form-input form-input-mono"
                  placeholder="VD: SP-ERP-01, SUB-CRM-PRO"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                />
                {errors.code && <span className="form-helper error">{errors.code}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="Phần mềm">Phần mềm</option>
                  <option value="Dịch vụ Cloud">Dịch vụ Cloud</option>
                  <option value="Phần cứng">Phần cứng</option>
                  <option value="Dịch vụ CNTT">Dịch vụ CNTT</option>
                  <option value="Dịch vụ">Dịch vụ</option>
                  <option value="AI & Tự động hóa">AI & Tự động hóa</option>
                </select>
              </div>

              {/* Product Name */}
              <div className="form-group col-span-2">
                <label className="form-label">
                  <span>Tên sản phẩm / Dịch vụ <span style={{ color: '#ef4444' }}>*</span></span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Phần mềm Quản trị Quan hệ Khách hàng CRM Cloud Pro"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && <span className="form-helper error">{errors.name}</span>}
              </div>

              {/* Unit of measure */}
              <div className="form-group">
                <label className="form-label">
                  <span>Đơn vị tính <span style={{ color: '#ef4444' }}>*</span></span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Cái, Bộ, License, User/Tháng, Gói/Năm"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                />
                {errors.unit && <span className="form-helper error">{errors.unit}</span>}
              </div>

              {/* Billing cycle if subscription */}
              {formData.type === 'subscription' && (
                <div className="form-group">
                  <label className="form-label">Chu kỳ tính phí</label>
                  <select
                    className="form-select"
                    value={formData.billingCycle}
                    onChange={(e) => handleChange('billingCycle', e.target.value)}
                  >
                    <option value="month">Hàng tháng (Monthly)</option>
                    <option value="quarter">Hàng quý (Quarterly)</option>
                    <option value="year">Hàng năm (Annual)</option>
                  </select>
                </div>
              )}

              {/* Listed Price */}
              <div className="form-group">
                <label className="form-label">
                  <span>Giá niêm yết chuẩn (VNĐ) <span style={{ color: '#ef4444' }}>*</span></span>
                  <span className="form-helper">Bảng giá xuất phát</span>
                </label>
                <input
                  type="number"
                  className="form-input form-input-mono"
                  placeholder="VD: 50000000"
                  value={formData.listedPrice}
                  onChange={(e) => handleChange('listedPrice', e.target.value)}
                />
                <span className="form-helper" style={{ color: 'var(--primary)' }}>
                  {formatVND(Number(formData.listedPrice) || 0)}
                </span>
                {errors.listedPrice && <span className="form-helper error">{errors.listedPrice}</span>}
              </div>

              {/* Floor Price */}
              <div className="form-group">
                <label className="form-label">
                  <span>Giá sàn (VNĐ) <span style={{ color: '#ef4444' }}>*</span></span>
                  <span className="form-helper">Ngưỡng tự duyệt</span>
                </label>
                <input
                  type="number"
                  className="form-input form-input-mono"
                  placeholder="VD: 40000000"
                  value={formData.floorPrice}
                  onChange={(e) => handleChange('floorPrice', e.target.value)}
                />
                <span className="form-helper" style={{ color: '#fbbf24' }}>
                  {formatVND(Number(formData.floorPrice) || 0)} (Ngưỡng chiết khấu tối đa)
                </span>
                {errors.floorPrice && <span className="form-helper error">{errors.floorPrice}</span>}
              </div>

              {/* Cost Price - CRITICAL REQUIREMENT: ONLY DIRECTOR CAN VIEW & EDIT */}
              <div className="form-group col-span-2" style={{
                background: currentRole === 'director' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${currentRole === 'director' ? 'var(--emerald-border)' : 'var(--rose-border)'}`,
                padding: '1rem',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, color: currentRole === 'director' ? '#34d399' : '#f87171' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {currentRole === 'director' ? <Unlock size={16} /> : <Lock size={16} />}
                      <span>Giá Vốn (COGS - Cost Price)</span>
                    </div>
                  </label>
                  <span className="security-pill" style={{ color: currentRole === 'director' ? '#34d399' : '#f87171' }}>
                    {currentRole === 'director' ? 'Cấp quyền Giám Đốc' : 'BẢO MẬT: CHỈ GĐKD ĐƯỢC XEM & SỬA'}
                  </span>
                </div>

                {currentRole === 'director' ? (
                  <>
                    <input
                      type="number"
                      className="form-input form-input-mono"
                      placeholder="Nhập giá vốn (VNĐ)"
                      value={formData.costPrice}
                      onChange={(e) => handleChange('costPrice', e.target.value)}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                      <span style={{ color: '#34d399' }}>{formatVND(liveCost)}</span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <span>Biên LN Giá Niêm Yết: <strong style={{ color: '#10b981' }}>{formatPercent(marginListed)}</strong></span>
                        <span>Biên LN Giá Sàn: <strong style={{ color: '#fbbf24' }}>{formatPercent(marginFloor)}</strong></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      value="•••••••••••••• (Đã bị ẩn theo phân quyền SCRUM-63)"
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed', color: 'var(--text-muted)' }}
                    />
                    <p style={{ fontSize: '0.775rem', color: '#f87171', marginTop: '0.4rem' }}>
                      ⚠️ Bạn đang ở vai trò <strong>Nhân viên kinh doanh</strong>. Bạn không có quyền truy cập hoặc điều chỉnh Giá vốn. Vui lòng liên hệ Giám đốc kinh doanh nếu cần cập nhật giá vốn.
                    </p>
                  </div>
                )}
                {errors.costPrice && <span className="form-helper error">{errors.costPrice}</span>}
              </div>

              {/* Description */}
              <div className="form-group col-span-2">
                <label className="form-label">Mô tả sản phẩm / dịch vụ</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Ghi chú chi tiết thông số kỹ thuật, phạm vi cung cấp, điều kiện bảo hành..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Trạng thái kinh doanh</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="active">Đang kinh doanh (Cho phép báo giá)</option>
                  <option value="discontinued">Ngừng kinh doanh (Không cho tạo báo giá mới)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{editingProduct ? 'Lưu Cập Nhật' : 'Tạo Sản Phẩm Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
