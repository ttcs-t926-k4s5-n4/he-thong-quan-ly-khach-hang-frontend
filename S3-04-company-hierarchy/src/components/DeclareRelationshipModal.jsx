import React, { useState, useEffect } from 'react';
import {
  Building2,
  X,
  Layers,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatShortVND,
  validateParentChildRelation,
  calculateGroupTotals,
  getIndividualContractValue
} from '../utils/hierarchyUtils';
import { RELATION_TYPES } from '../data/mockData';

export function DeclareRelationshipModal({
  isOpen,
  onClose,
  customers,
  contracts,
  defaultChildId = null,
  defaultParentId = null,
  onSaveRelation
}) {
  const [selectedChildId, setSelectedChildId] = useState(defaultChildId || '');
  const [selectedParentId, setSelectedParentId] = useState(defaultParentId || '');
  const [relationType, setRelationType] = useState('SUBSIDIARY');
  const [ownershipPercent, setOwnershipPercent] = useState(65);
  const [legalBasis, setLegalBasis] = useState('Nghị quyết HĐQT phê duyệt cơ cấu vốn & tỷ lệ sở hữu');

  // Khi modal mở với tham số mặc định
  useEffect(() => {
    if (defaultChildId) setSelectedChildId(defaultChildId);
    if (defaultParentId) setSelectedParentId(defaultParentId);
  }, [defaultChildId, defaultParentId, isOpen]);

  if (!isOpen) return null;

  // Thực hiện kiểm tra tính hợp lệ của quan hệ mẹ - con
  const validationResult = validateParentChildRelation(
    selectedChildId,
    selectedParentId,
    customers
  );

  // Tính toán số liệu xem trước tác động (Live Impact Preview)
  const childCustomer = customers.find((c) => c.id === selectedChildId);
  const parentCustomer = customers.find((c) => c.id === selectedParentId);

  const childContractValue = childCustomer
    ? getIndividualContractValue(childCustomer.id, contracts)
    : 0;

  let currentParentTotals = null;
  let newParentTotalValue = 0;

  if (parentCustomer) {
    currentParentTotals = calculateGroupTotals(parentCustomer.id, customers, contracts);
    newParentTotalValue = currentParentTotals.totalGroupValue + childContractValue;
  }

  // Xử lý lưu khai báo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validationResult.isValid) return;

    onSaveRelation({
      childId: selectedChildId,
      parentId: selectedParentId,
      relationType,
      ownershipPercent: Number(ownershipPercent),
      legalBasis
    });
  };

  // Kịch bản thử nhanh 1: Gắn hợp lệ
  const simulateValid = () => {
    const child = customers.find((c) => c.id === 'KH-TCB' || c.id === 'KH-ABC-TECH');
    const parent = customers.find((c) => c.id === 'KH-FPT-CORP');
    if (child && parent) {
      setSelectedChildId(child.id);
      setSelectedParentId(parent.id);
      setRelationType('SUBSIDIARY');
      setOwnershipPercent(65);
      setLegalBasis('Nghị quyết HĐQT số 28/2026/NQ-FPT về việc mua 65% cổ phần chi phối');
    }
  };

  // Kịch bản thử nhanh 2: Lỗi vòng lặp tuần hoàn (FPT Corp làm con của FPT Soft)
  const simulateCircularError = () => {
    setSelectedChildId('KH-FPT-CORP'); // Mẹ
    setSelectedParentId('KH-FPT-SOFT'); // Con của mẹ -> Gắn ngược lại sẽ tạo vòng lặp!
  };

  // Kịch bản thử nhanh 3: Tự gắn chính mình
  const simulateSelfParent = () => {
    setSelectedChildId('KH-FPT-CORP');
    setSelectedParentId('KH-FPT-CORP');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={22} color="#6366f1" />
            <span>Khai Báo Quan Hệ Công Ty Mẹ - Con (SCRUM-73)</span>
          </div>
          <button className="icon-btn" onClick={onClose} title="Đóng modal">
            <X size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Quick Simulation Bar */}
            <div style={{ background: 'var(--bg-muted)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={14} color="#f59e0b" /> THỬ NHANH CÁC KỊCH BẢN KIỂM THỬ:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem' }}
                  onClick={simulateValid}
                >
                  ⚡ Kịch bản hợp lệ (Gắn Techcombank vào FPT)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', color: '#f87171' }}
                  onClick={simulateCircularError}
                >
                  ⚡ Kiểm tra lỗi vòng lặp (Circular Loop)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', color: '#fbbf24' }}
                  onClick={simulateSelfParent}
                >
                  ⚡ Kiểm tra lỗi tự gán chính mình
                </button>
              </div>
            </div>

            {/* Bước 1: Chọn Công Ty Con */}
            <div className="form-group">
              <label className="form-label">
                <span>1. Chọn Khách Hàng Làm Công Ty Con (Subsidiary) <span style={{ color: '#ef4444' }}>*</span></span>
                {childCustomer && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    HĐ hiện tại: {formatShortVND(childContractValue)}
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                required
              >
                <option value="">-- Chọn công ty con cần liên kết --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code} - MST: {c.taxId})
                  </option>
                ))}
              </select>
            </div>

            {/* Bước 2: Chọn Công Ty Mẹ */}
            <div className="form-group">
              <label className="form-label">
                <span>2. Chọn Công Ty Mẹ Quản Lý (Parent Holding) <span style={{ color: '#ef4444' }}>*</span></span>
                {parentCustomer && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Mã: {parentCustomer.code}
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                required
              >
                <option value="">-- Chọn công ty mẹ điều hành --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code} - MST: {c.taxId})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Validation Alert Box */}
            {!validationResult.isValid ? (
              <div className="alert-box alert-danger">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Không thể thiết lập quan hệ:</strong>
                  <div>{validationResult.message}</div>
                </div>
              </div>
            ) : validationResult.hasExistingParent ? (
              <div className="alert-box alert-warning">
                <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Cảnh báo chuyển đổi công ty mẹ:</strong>
                  <div>{validationResult.message}</div>
                </div>
              </div>
            ) : (
              selectedChildId &&
              selectedParentId && (
                <div className="alert-box alert-info">
                  <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Quan hệ hợp lệ:</strong>
                    <div>{validationResult.message}</div>
                  </div>
                </div>
              )
            )}

            {/* Bước 3: Loại Quan Hệ & Tỷ Lệ Sở Hữu (%) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">3. Loại Quan Hệ Sở Hữu</label>
                <select
                  className="form-select"
                  value={relationType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRelationType(val);
                    const opt = RELATION_TYPES.find((r) => r.id === val);
                    if (opt) setOwnershipPercent(opt.defaultOwnership);
                  }}
                >
                  {RELATION_TYPES.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Tỷ Lệ Sở Hữu Vốn:</span>
                  <strong style={{ color: '#60a5fa' }}>{ownershipPercent}%</strong>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="100"
                    value={ownershipPercent}
                    onChange={(e) => setOwnershipPercent(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '70px', padding: '6px 8px', textAlign: 'center' }}
                    min="1"
                    max="100"
                    value={ownershipPercent}
                    onChange={(e) => setOwnershipPercent(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Căn cứ pháp lý */}
            <div className="form-group">
              <label className="form-label">4. Căn Cứ Pháp Lý & Ghi Chú Cơ Cấu</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Nhập số quyết định, nghị quyết HĐQT hoặc hợp đồng chuyển nhượng vốn..."
                value={legalBasis}
                onChange={(e) => setLegalBasis(e.target.value)}
              />
            </div>

            {/* Live Impact Preview Card */}
            {validationResult.isValid && childCustomer && parentCustomer && currentParentTotals && (
              <div className="impact-preview-card">
                <div className="impact-header">
                  <TrendingUp size={15} /> XEM TRƯỚC TÁC ĐỘNG TỔNG GIÁ TRỊ HỢP ĐỒNG CẢ TẬP ĐOÀN
                </div>

                <div className="impact-values-row">
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Giá trị Tập đoàn {parentCustomer.shortName} hiện tại:
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      {formatCurrencyVND(currentParentTotals.totalGroupValue)}
                    </div>
                  </div>

                  <ArrowRight size={22} className="impact-arrow" />

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 600 }}>
                      Tổng giá trị mới sau khi gắn thêm {childCustomer.shortName}:
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#60a5fa' }}>
                      {formatCurrencyVND(newParentTotalValue)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#34d399' }}>
                      + {formatCurrencyVND(childContractValue)} hợp đồng gia tăng
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Modal */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-corporate"
              disabled={!validationResult.isValid}
              style={{
                opacity: validationResult.isValid ? 1 : 0.5,
                cursor: validationResult.isValid ? 'pointer' : 'not-allowed'
              }}
            >
              <CheckCircle2 size={16} /> Xác Nhận Khai Báo Quan Hệ Mẹ - Con
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
