import React, { useState } from 'react';
import { 
  UserPlus, 
  X, 
  Check, 
  Building, 
  MapPin, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export default function ManualAssignModal({
  lead,
  allReps = [],
  onClose,
  onConfirmManualAssign
}) {
  const [selectedStaffId, setSelectedStaffId] = useState(allReps[0]?.id || '');
  const [assignNote, setAssignNote] = useState('Phân bổ thủ công theo chỉ định của Trưởng nhóm kinh doanh.');

  if (!lead) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosenStaff = allReps.find(r => r.id === selectedStaffId);
    if (!chosenStaff) {
      alert('Vui lòng chọn nhân viên tiếp nhận!');
      return;
    }

    onConfirmManualAssign({
      leadId: lead.id,
      assignedStaff: chosenStaff,
      assignNote
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <div className="modal-title">Phân Bổ Thủ Công Cho Lead Trong Hàng Chờ</div>
              <div className="modal-subtitle">
                Đáp ứng Tiêu chí 3: Dành cho Trưởng nhóm phân tay khi lead không khớp quy tắc tự động
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Lead Summary */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem' }}>{lead.fullName}</strong>
                <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                  CHỜ PHÂN TAY
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {lead.companyName} &bull; SĐT: {lead.phone}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Khu vực: <strong>{lead.region}</strong> &bull; Ngành: <strong>{lead.industry}</strong> &bull; Nguồn: {lead.source}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: '0.2rem' }}>
                Lý do vào hàng chờ: {lead.routingResult?.reason || 'Không khớp quy tắc tự động nào'}
              </div>
            </div>

            {/* Select Sales Rep */}
            <div className="form-group">
              <label className="form-label">Chọn Nhân Viên Tiếp Nhận Phụ Trách (*):</label>
              <select 
                className="form-select"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
              >
                {allReps.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.role} - {rep.teamName}) &bull; Đang phụ trách: {rep.activeLeadCount} lead
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="form-group">
              <label className="form-label">Ghi Chú Giao Việc / Chỉ Đạo Của Trưởng Nhóm:</label>
              <textarea 
                className="form-textarea"
                rows={3}
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-warning btn-sm">
              <Check size={16} />
              <span>Xác Nhận Giao Việc Cho Nhân Viên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
