import React, { useState } from 'react';
import { X, Send, Lock, AlertTriangle, Building, Users } from 'lucide-react';

export function RequestApprovalModal({
  customerA,
  customerB,
  report,
  currentUser,
  onClose,
  onSubmitRequest
}) {
  const [note, setNote] = useState(
    `Chào Trưởng nhóm, em phát hiện hồ sơ [${customerA.name}] và [${customerB.name}] bị trùng lặp do em (${customerA.ownerName}) và bạn ${customerB.ownerName} cùng tiếp cận chào hàng. Đề xuất Trưởng nhóm phê duyệt gộp vào hồ sơ chính để hai bên cùng phối hợp chăm sóc.`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRequest({
      customerA,
      customerB,
      report,
      requester: currentUser,
      note,
      submittedAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h3>
              <Send size={20} style={{ color: '#8b5cf6' }} />
              <span>Gửi Yêu Cầu Gộp Khách Hàng Lên Trưởng Nhóm</span>
            </h3>
            <p>Do quyền hạn Chuyên viên KD không được tự gộp, phiếu đề xuất sẽ được chuyển tới Trưởng nhóm phê duyệt.</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.825rem',
                color: '#c4b5fd'
              }}
            >
              <strong>Cặp khách hàng cần gộp:</strong>
              <br />• Bản ghi 1: <strong>[{customerA.id}] {customerA.name}</strong> (Phụ trách: {customerA.ownerName})
              <br />• Bản ghi 2: <strong>[{customerB.id}] {customerB.name}</strong> (Phụ trách: {customerB.ownerName})
              <br />• Lý do trùng: {report.reasons.join(', ')}
            </div>

            <div>
              <label className="field-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Nội dung giải trình đề xuất gộp *
              </label>
              <textarea
                className="role-select"
                rows={5}
                style={{ width: '100%', resize: 'vertical', lineHeight: 1.5 }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-pill" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="btn-pill btn-primary"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderColor: '#8b5cf6' }}
            >
              <Send size={15} />
              <span>Gửi phiếu đề xuất</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
