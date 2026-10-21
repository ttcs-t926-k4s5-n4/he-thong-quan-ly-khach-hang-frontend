import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle2, 
  Briefcase, 
  Users, 
  FileText, 
  Sparkles,
  Info
} from 'lucide-react';
import { REASSIGNMENT_REASONS } from '../data/mockReassignmentReasons';
import { MEMBER_STATUS } from '../data/mockUsers';
import { formatCurrency } from '../utils/formatters';

export const ReassignModal = ({
  isOpen,
  onClose,
  dealIds = [],
  opportunities = [],
  teamWorkload = [],
  currentPersona,
  onConfirmReassign
}) => {
  if (!isOpen || dealIds.length === 0) return null;

  // Danh sách các cơ hội được chọn
  const selectedDeals = opportunities.filter((o) => dealIds.includes(o.id));
  const totalValue = selectedDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  // Tập hợp danh sách người phụ trách cũ
  const fromRepIds = Array.from(new Set(selectedDeals.map((d) => d.salesRepId)));

  // Lọc ứng viên nhận mới (loại bỏ người đang nghỉ dài hạn)
  const candidateReps = teamWorkload.filter((u) => u.role === 'SALES_REP');

  // Gợi ý ứng viên mặc định: Người rảnh tải nhất và không trùng với người cũ nếu chỉ chuyển 1 người
  const defaultTargetRep = candidateReps.find(
    (u) => u.canAcceptMore && !fromRepIds.includes(u.id)
  ) || candidateReps[0];

  const [selectedTargetRepId, setSelectedTargetRepId] = useState(defaultTargetRep?.id || '');
  const [selectedReasonId, setSelectedReasonId] = useState(REASSIGNMENT_REASONS[0].id);
  const [customReasonText, setCustomReasonText] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Tự động gợi ý lý do và checklist dựa trên tình trạng người cũ
  useEffect(() => {
    if (selectedDeals.length > 0) {
      const firstDeal = selectedDeals[0];
      let reason = REASSIGNMENT_REASONS[0]; // Mặc định: Nghỉ phép dài hạn

      if (firstDeal.assigneeStatus === 'ON_LEAVE_MATERNITY') {
        reason = REASSIGNMENT_REASONS.find((r) => r.id === 'LEAVE_MATERNITY') || reason;
      } else if (firstDeal.assigneeStatus === 'OVERLOADED') {
        reason = REASSIGNMENT_REASONS.find((r) => r.id === 'OVERLOAD') || reason;
      }

      setSelectedReasonId(reason.id);
      setHandoverNotes(reason.defaultNotes);
      setChecklist(reason.defaultChecklist || []);
    }
  }, [dealIds]);

  // Cập nhật khi đổi lý do
  const handleReasonChange = (reasonId) => {
    setSelectedReasonId(reasonId);
    const reason = REASSIGNMENT_REASONS.find((r) => r.id === reasonId);
    if (reason) {
      setHandoverNotes(reason.defaultNotes);
      setChecklist(reason.defaultChecklist || []);
    }
  };

  const handleToggleChecklistItem = (itemText) => {
    if (checklist.includes(itemText)) {
      setChecklist(checklist.filter((t) => t !== itemText));
    } else {
      setChecklist([...checklist, itemText]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedTargetRepId) {
      setErrorMsg('Vui lòng chọn nhân viên nhận bàn giao mới.');
      return;
    }

    const targetRep = candidateReps.find((u) => u.id === selectedTargetRepId);
    if (!targetRep) {
      setErrorMsg('Nhân viên nhận bàn giao không hợp lệ.');
      return;
    }

    // Cảnh báo nếu chọn người đang nghỉ phép
    if (targetRep.isOnLeave) {
      setErrorMsg(`Không thể phân bổ cho ${targetRep.name} vì nhân sự này đang nghỉ phép dài hạn!`);
      return;
    }

    const reasonData = REASSIGNMENT_REASONS.find((r) => r.id === selectedReasonId);
    if (!reasonData) {
      setErrorMsg('Vui lòng chọn lý do phân bổ lại.');
      return;
    }

    if (reasonData.id === 'CUSTOM' && !customReasonText.trim()) {
      setErrorMsg('Vui lòng nhập chi tiết lý do phân bổ tùy chỉnh.');
      return;
    }

    // Kích hoạt callback phân bổ
    onConfirmReassign({
      dealIds,
      targetRep,
      reasonData,
      customReasonText,
      handoverNotes,
      checklist,
      initiator: currentPersona
    });

    onClose();
  };

  const selectedTargetRep = candidateReps.find((u) => u.id === selectedTargetRepId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="modal-header">
          <div className="modal-title">
            <ArrowLeftRight size={20} color="#3b82f6" />
            <span>Phân Bổ Lại Quyền Sở Hữu Cơ Hội Kinh Doanh</span>
            <span className="ticket-tag">AC1 & AC3</span>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="modal-body">
          {errorMsg && (
            <div style={{
              background: 'var(--danger-bg)',
              color: '#f87171',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Danh sách deal được chọn (AC1) */}
          <div className="form-group">
            <label className="form-label">
              1. Danh sách cơ hội được chuyển giao ({selectedDeals.length} thương vụ)
              <span className="form-label-desc">
                Tổng giá trị chuyển quyền: <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{formatCurrency(totalValue)}</strong>
              </span>
            </label>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              maxHeight: '140px',
              overflowY: 'auto',
              padding: '0.5rem'
            }}>
              {selectedDeals.map((deal) => (
                <div 
                  key={deal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginRight: '0.4rem' }}>
                      {deal.id}
                    </span>
                    <strong>{deal.title}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>({deal.customerName})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#f87171', fontSize: '0.75rem' }}>
                      Từ: {deal.salesRepName}
                    </span>
                    <span style={{ color: '#34d399', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(deal.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Chọn người nhận mới (Target Assignee) */}
          <div className="form-group">
            <label className="form-label">
              2. Chọn nhân sự tiếp nhận bàn giao mới <span className="required">*</span>
              <span className="form-label-desc">
                Ưu tiên chọn nhân sự có sức chứa tốt (Rảnh tải) và có chuyên môn phù hợp với ngành của khách hàng
              </span>
            </label>

            <div className="assignee-selector-grid">
              {candidateReps.map((rep) => {
                const isSelected = selectedTargetRepId === rep.id;
                const statusConfig = MEMBER_STATUS[rep.dynamicStatus] || MEMBER_STATUS.ACTIVE_NORMAL;
                const isFromRep = fromRepIds.includes(rep.id);
                const isDisabled = rep.isOnLeave || rep.dynamicStatus === 'OVERLOADED';

                return (
                  <div 
                    key={rep.id}
                    className={`assignee-card-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && setSelectedTargetRepId(rep.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img 
                        src={rep.avatar} 
                        alt={rep.name} 
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                          {rep.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Hiện tại: {rep.activeDealCount} deals ({rep.workloadPercent}% tải)
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${statusConfig.badgeClass}`}>
                        {statusConfig.shortLabel}
                      </span>
                      {isSelected && (
                        <div style={{ color: '#3b82f6', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.2rem' }}>
                          Đã chọn ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedTargetRep && (
              <div style={{
                marginTop: '0.65rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Info size={16} color="#3b82f6" />
                <span>
                  <strong>{selectedTargetRep.name}</strong> sẽ nhận thêm {selectedDeals.length} deal. 
                  Tải sau chuyển giao: <strong>{selectedTargetRep.activeDealCount + selectedDeals.length} deals</strong>.
                </span>
              </div>
            )}
          </div>

          {/* 3. Lý do chuyển giao (AC3: Bắt buộc kèm nhật ký) */}
          <div className="form-group">
            <label className="form-label">
              3. Lý do chuyển quyền sở hữu (Bắt buộc theo chuẩn AC3) <span className="required">*</span>
              <span className="form-label-desc">
                Mỗi lần phân bổ bắt buộc được lưu vết vào Nhật ký kiểm toán CRM kèm lý do rõ ràng
              </span>
            </label>

            <select 
              className="form-select"
              value={selectedReasonId}
              onChange={(e) => handleReasonChange(e.target.value)}
            >
              {REASSIGNMENT_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.isUrgent ? '🚨 ' : '📌 '} {r.label}
                </option>
              ))}
            </select>

            {selectedReasonId === 'CUSTOM' && (
              <input 
                type="text"
                className="form-input"
                style={{ marginTop: '0.5rem' }}
                placeholder="Nhập chi tiết lý do phân bổ tùy chỉnh..."
                value={customReasonText}
                onChange={(e) => setCustomReasonText(e.target.value)}
              />
            )}
          </div>

          {/* 4. Ghi chú bàn giao & Chỉ đạo chiến lược */}
          <div className="form-group">
            <label className="form-label">
              4. Ghi chú bàn giao công việc & Chỉ đạo của Trưởng nhóm
              <span className="form-label-desc">
                Dặn dò người nhận mới về tính cách khách hàng, các điểm mấu chốt kỹ thuật hoặc điều khoản giá
              </span>
            </label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Nhập ghi chú chi tiết bàn giao công việc cho người mới..."
            />
          </div>

          {/* 5. Handover Checklist */}
          <div className="form-group">
            <label className="form-label">
              5. Danh mục kiểm tra bàn giao chuẩn (Handover Checklist)
            </label>
            <div className="checklist-container">
              {checklist.map((item, idx) => (
                <label key={idx} className="checklist-item">
                  <input 
                    type="checkbox"
                    className="custom-checkbox"
                    checked={true}
                    onChange={() => handleToggleChecklistItem(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy Bỏ
          </button>
          <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>
            <ArrowLeftRight size={16} />
            <span>Xác Nhận Phân Bổ ({selectedDeals.length} Deals)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
