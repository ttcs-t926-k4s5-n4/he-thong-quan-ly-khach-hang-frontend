import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Calendar, Building, User, Target } from 'lucide-react';
import { OPPORTUNITY_STAGES } from '../data/mockStages';
import { MOCK_USERS, SALES_TEAMS } from '../data/mockUsers';
import { formatCurrency } from '../utils/formatters';

export const OpportunityModal = ({
  isOpen,
  onClose,
  onSave,
  initialOpportunity = null
}) => {
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    industry: 'Doanh nghiệp & B2B',
    expectedValue: 100000000,
    expectedCloseDate: '2026-10-28',
    stage: 'NEGOTIATION',
    probability: 80,
    ownerId: 'USR-001',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialOpportunity) {
      setFormData({
        title: initialOpportunity.title || '',
        customerName: initialOpportunity.customerName || '',
        industry: initialOpportunity.industry || 'Doanh nghiệp & B2B',
        expectedValue: initialOpportunity.expectedValue || 0,
        expectedCloseDate: initialOpportunity.expectedCloseDate || '2026-10-28',
        stage: initialOpportunity.stage || 'NEGOTIATION',
        probability: initialOpportunity.probability !== undefined ? initialOpportunity.probability : 80,
        ownerId: initialOpportunity.ownerId || 'USR-001',
        notes: initialOpportunity.notes || ''
      });
    } else {
      setFormData({
        title: '',
        customerName: '',
        industry: 'Doanh nghiệp & B2B',
        expectedValue: 120000000,
        expectedCloseDate: '2026-10-28',
        stage: 'NEGOTIATION',
        probability: 80,
        ownerId: 'USR-001',
        notes: ''
      });
    }
    setErrors({});
  }, [initialOpportunity, isOpen]);

  if (!isOpen) return null;

  // Handle stage change -> auto-update default probability
  const handleStageChange = (e) => {
    const newStage = e.target.value;
    const defaultProb = OPPORTUNITY_STAGES[newStage]?.defaultProbability ?? 50;
    setFormData((prev) => ({
      ...prev,
      stage: newStage,
      probability: defaultProb
    }));
  };

  const handleOwnerChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ownerId: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên cơ hội / dự án.';
    if (!formData.customerName.trim()) newErrors.customerName = 'Vui lòng nhập tên khách hàng.';
    if (!formData.expectedValue || formData.expectedValue <= 0) newErrors.expectedValue = 'Giá trị cơ hội phải lớn hơn 0.';
    if (!formData.expectedCloseDate) newErrors.expectedCloseDate = 'Vui lòng chọn ngày dự kiến chốt.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedOwner = MOCK_USERS.find((u) => u.id === formData.ownerId) || MOCK_USERS[2];

    const finalDeal = {
      id: initialOpportunity ? initialOpportunity.id : `OPP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title.trim(),
      customerName: formData.customerName.trim(),
      industry: formData.industry,
      expectedValue: Number(formData.expectedValue),
      actualWonValue: formData.stage === 'CLOSED_WON' ? Number(formData.expectedValue) : null,
      expectedCloseDate: formData.expectedCloseDate,
      stage: formData.stage,
      probability: Number(formData.probability),
      ownerId: selectedOwner.id,
      ownerName: selectedOwner.name,
      teamId: selectedOwner.teamId || 'TEAM_NORTH',
      teamName: selectedOwner.teamName || 'Nhóm Kinh doanh Miền Bắc',
      notes: formData.notes
    };

    onSave(finalDeal);
    onClose();
  };

  const calculatedWeighted = Math.round(Number(formData.expectedValue || 0) * (Number(formData.probability || 0) / 100));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 650 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {initialOpportunity ? `Chỉnh Sửa Cơ Hội: ${initialOpportunity.id}` : 'Thêm Cơ Hội Bán Hàng Mới'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Calculation Preview Banner */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.1))', 
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Công thức tính đóng góp dự báo:</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  {formatCurrency(formData.expectedValue || 0)} × {formData.probability}% =
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Doanh số dự báo trọng số:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                  {formatCurrency(calculatedWeighted)}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Tên Cơ Hội / Tên Dự Án *</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: Triển khai phần mềm ERP cho Công ty May 10"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.title}</span>}
            </div>

            {/* Customer & Industry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tên Khách Hàng / Doanh Nghiệp *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Công ty CP May 10"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
                {errors.customerName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Ngành Nghề Khách Hàng</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
            </div>

            {/* Value & Expected Close Date Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Giá Trị Cơ Hội (VNĐ) *</label>
                <input
                  type="number"
                  step="1000000"
                  className="form-control"
                  value={formData.expectedValue}
                  onChange={(e) => setFormData({ ...formData, expectedValue: e.target.value })}
                />
                {errors.expectedValue && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.expectedValue}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Kỳ Dự Kiến Chốt Hợp Đồng *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
                {errors.expectedCloseDate && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.expectedCloseDate}</span>}
              </div>
            </div>

            {/* Stage & Probability Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Giai Đoạn Phễu Bán Hàng</label>
                <select 
                  className="form-control"
                  value={formData.stage}
                  onChange={handleStageChange}
                >
                  {Object.values(OPPORTUNITY_STAGES).map((stg) => (
                    <option key={stg.id} value={stg.id}>
                      {stg.label} (Mặc định: {stg.defaultProbability}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Xác Suất Thắng Cơ Hội (%): {formData.probability}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                  style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--accent-primary)' }}
                />
              </div>
            </div>

            {/* Owner Rep */}
            <div className="form-group">
              <label className="form-label">Nhân Viên Kinh Doanh Phụ Trách</label>
              <select
                className="form-control"
                value={formData.ownerId}
                onChange={handleOwnerChange}
              >
                {MOCK_USERS.filter((u) => u.role === 'SALES_REP').map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} — {rep.teamName}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Ghi Chú Tiến Độ / Kế Hoạch Chốt Deal</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Nhập tình hình đàm phán hoặc vướng mắc kỹ thuật/pháp lý..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              {initialOpportunity ? 'Lưu Thay Đổi' : 'Thêm Vào Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
