import React, { useState } from 'react';
import { X, ArrowRightLeft, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateSingleTeamAssignment } from '../utils/orgUtils';

export default function TransferModal({
  isOpen,
  onClose,
  employee,
  teams,
  employees,
  onConfirmTransfer
}) {
  const [targetTeamId, setTargetTeamId] = useState('');
  const [reason, setReason] = useState('Đáp ứng kế hoạch kinh doanh và mở rộng thị trường quý mới.');
  const [approver, setApprover] = useState('Ban Giám Đốc Kinh Doanh');
  const [error, setError] = useState('');

  if (!isOpen || !employee) return null;

  const currentTeam = teams.find(t => t.id === employee.teamId);
  const targetTeam = teams.find(t => t.id === targetTeamId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetTeamId) {
      setError('Vui lòng chọn nhóm kinh doanh đích.');
      return;
    }

    const validation = validateSingleTeamAssignment(employee.id, targetTeamId, employees);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    onConfirmTransfer({
      employeeId: employee.id,
      employeeName: employee.name,
      fromTeamId: currentTeam?.id || 'none',
      fromTeamName: currentTeam?.name || 'Chưa phân nhóm',
      toTeamId: targetTeam.id,
      toTeamName: targetTeam.name,
      reason,
      approvedBy: approver,
      transferDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}>
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h3 className="modal-title">Điều Chuyển Nhóm Kinh Doanh (SCRUM-64)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Đảm bảo mỗi nhân viên chỉ thuộc đúng 1 nhóm tại một thời điểm
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
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Thông tin nhân sự đang chuyển */}
            <div style={{ padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="emp-avatar" style={{ backgroundColor: employee.avatarColor || '#3b82f6' }}>
                  {employee.name.split(' ').map(n => n[0]).slice(-2).join('')}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>{employee.name} ({employee.code})</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Chức danh: {employee.position} &bull; Email: {employee.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Sơ đồ chuyển dịch từ Nhóm A sang Nhóm B */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
              {/* Nhóm Hiện Tại (Nguồn) */}
              <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-rose)', textTransform: 'uppercase' }}>
                  Nhóm Hiện Tại (Rời khỏi)
                </span>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} style={{ color: 'var(--accent-rose)' }} />
                  <span>{currentTeam?.name || 'Chưa gán nhóm'}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Mã: {currentTeam?.code || 'N/A'}
                </div>
              </div>

              {/* Mũi tên */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowRightLeft size={22} style={{ color: 'var(--accent-blue)' }} />
              </div>

              {/* Nhóm Đích (Mới) */}
              <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-emerald)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                  Nhóm Đích Mới (Gia nhập)
                </span>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} style={{ color: 'var(--accent-emerald)' }} />
                  <span>{targetTeam?.name || 'Chọn nhóm đích...'}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Mã: {targetTeam?.code || '---'}
                </div>
              </div>
            </div>

            {/* Chọn nhóm đích */}
            <div className="form-group">
              <label className="form-label">Chọn Nhóm Kinh Doanh Mới *</label>
              <select 
                className="form-select"
                value={targetTeamId}
                onChange={(e) => {
                  setTargetTeamId(e.target.value);
                  setError('');
                }}
                required
              >
                <option value="">-- Vui lòng chọn nhóm kinh doanh tiếp nhận --</option>
                {teams.filter(t => t.id !== employee.teamId).map(t => (
                  <option key={t.id} value={t.id}>
                    {'— '.repeat(t.level)} {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Lý do & Người duyệt */}
            <div className="form-group">
              <label className="form-label">Lý Do / Căn Cứ Điều Chuyển</label>
              <textarea 
                className="form-textarea"
                rows="2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Người Phê Duyệt Quyết Định</label>
              <input 
                type="text" 
                className="form-input"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                required
              />
            </div>

            <div style={{ 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--accent-emerald-bg)', 
              color: 'var(--accent-emerald)', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>
                Sau khi xác nhận, nhân viên này sẽ <strong>chỉ thuộc duy nhất nhóm mới</strong> và hoàn toàn rời khỏi nhóm cũ.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <ArrowRightLeft size={16} />
              <span>Xác Nhận Điều Chuyển</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
