import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle, Building2 } from 'lucide-react';

export default function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  teams,
  defaultTeamId
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    gender: 'Nam',
    position: 'Chuyên Viên Kinh Doanh B2B',
    teamId: '',
    email: '',
    phone: '',
    kpiTarget: 2000000000,
    avatarColor: '#3b82f6',
    isLeader: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        code: `EMP${Date.now().toString().slice(-3)}`,
        gender: 'Nam',
        position: 'Chuyên Viên Kinh Doanh B2B',
        teamId: defaultTeamId || (teams[0] ? teams[0].id : ''),
        email: '',
        phone: '0901 000 999',
        kpiTarget: 2000000000,
        avatarColor: '#3b82f6',
        isLeader: false
      });
      setError('');
    }
  }, [isOpen, defaultTeamId, teams]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ và tên nhân viên.');
      return;
    }
    if (!formData.teamId) {
      setError('Bắt buộc phải chỉ định đúng 1 nhóm kinh doanh trực thuộc.');
      return;
    }

    onSave({
      ...formData,
      id: `NV-${Date.now().toString().slice(-4)}`,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@congty.com.vn`,
      joinedDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="modal-title">Thêm Mới Nhân Sự Kinh Doanh</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Chỉ định nhân viên vào đúng 1 nhóm kinh doanh tại thời điểm tạo
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

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Họ Và Tên *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mã Nhân Viên *</label>
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
                <label className="form-label">Giới Tính</label>
                <select 
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Chức Danh Chuyên Môn</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Chuyên viên B2B / Key Account..."
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>

            {/* TIÊU CHÍ 2: CHỈ ĐỊNH ĐÚNG 1 NHÓM */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={14} style={{ color: 'var(--accent-blue)' }} />
                <span>Nhóm Kinh Doanh Trực Thuộc (Bắt buộc chọn đúng 1 nhóm) *</span>
              </label>
              <select 
                className="form-select"
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                required
              >
                <option value="">-- Chọn nhóm kinh doanh --</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {'— '.repeat(t.level)} {t.name} ({t.code})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Ràng buộc hệ thống: Mỗi nhân viên thuộc đúng một nhóm tại một thời điểm.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Email Công Việc</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="ten.nv@congty.com.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số Điện Thoại</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="09xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Chỉ Tiêu Hạn Mức Doanh Số Cá Nhân (VNĐ)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.kpiTarget}
                onChange={(e) => setFormData({ ...formData, kpiTarget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Lưu Nhân Sự</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
