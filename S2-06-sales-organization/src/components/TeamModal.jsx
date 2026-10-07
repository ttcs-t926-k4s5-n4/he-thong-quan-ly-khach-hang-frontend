import React, { useState, useEffect } from 'react';
import { X, Building2, Crown, MapPin, AlertCircle, Save } from 'lucide-react';

export default function TeamModal({
  isOpen,
  onClose,
  onSave,
  editingTeam,
  parentTeamId,
  teams,
  employees,
  territories
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentId: '',
    leaderId: '',
    territoryIds: [],
    description: '',
    color: '#3b82f6'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTeam) {
      setFormData({
        name: editingTeam.name || '',
        code: editingTeam.code || '',
        parentId: editingTeam.parentId || '',
        leaderId: editingTeam.leaderId || '',
        territoryIds: editingTeam.territoryIds || [],
        description: editingTeam.description || '',
        color: editingTeam.color || '#3b82f6'
      });
    } else {
      setFormData({
        name: '',
        code: `KD-${Date.now().toString().slice(-4)}`,
        parentId: parentTeamId || (teams[0] ? teams[0].id : ''),
        leaderId: '',
        territoryIds: [],
        description: '',
        color: '#06b6d4'
      });
    }
    setError('');
  }, [editingTeam, parentTeamId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên nhóm kinh doanh.');
      return;
    }
    if (!formData.code.trim()) {
      setError('Vui lòng nhập mã định danh nhóm.');
      return;
    }

    // Xác định cấp độ (level) dựa trên nhóm cha
    let level = 1;
    if (formData.parentId) {
      const parent = teams.find(t => t.id === formData.parentId);
      if (parent) {
        level = parent.level + 1;
      }
    } else {
      level = 0; // Root
    }

    onSave({
      ...formData,
      level,
      parentId: formData.parentId || null
    });
    onClose();
  };

  const handleToggleTerritory = (terrId) => {
    setFormData(prev => {
      const exists = prev.territoryIds.includes(terrId);
      return {
        ...prev,
        territoryIds: exists 
          ? prev.territoryIds.filter(id => id !== terrId)
          : [...prev.territoryIds, terrId]
      };
    });
  };

  // Lọc danh sách nhóm có thể làm cha (tránh chọn chính nó)
  const availableParentTeams = teams.filter(t => !editingTeam || t.id !== editingTeam.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="modal-title">
                {editingTeam ? 'Chỉnh Sửa Nhóm Kinh Doanh' : 'Thêm Mới Nhóm Kinh Doanh'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Khai báo vị trí trong cây tổ chức và phân bổ đúng 1 trưởng nhóm
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
                <label className="form-label">Tên Nhóm Kinh Doanh *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Nhóm Khách Hàng FDI Miền Bắc..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mã Nhóm *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="FDI-MB"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Cấp trên / Nhóm cha */}
              <div className="form-group">
                <label className="form-label">Nhóm Quản Lý Cấp Trên (Nhóm Cha)</label>
                <select 
                  className="form-select"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  disabled={editingTeam && editingTeam.parentId === null}
                >
                  {(!editingTeam || editingTeam.parentId !== null) && (
                    <option value="">-- Cấp cao nhất (Root - Ban Giám Đốc) --</option>
                  )}
                  {availableParentTeams.map(t => (
                    <option key={t.id} value={t.id}>
                      {'— '.repeat(t.level)} {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trưởng nhóm duy nhất - Tiêu chí 1 */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Crown size={14} style={{ color: 'var(--accent-amber)' }} />
                  <span>Trưởng Nhóm Bổ Nhiệm (Duy Nhất)</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.leaderId}
                  onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                >
                  <option value="">-- Chưa bổ nhiệm Trưởng nhóm --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      ⭐ {emp.name} ({emp.code} - {emp.position})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Theo quy định SCRUM-64: Mỗi nhóm có đúng một trưởng nhóm.
                </span>
              </div>
            </div>

            {/* Màu nhận diện */}
            <div className="form-group">
              <label className="form-label">Màu Sắc Nhận Diện Trên Cây</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: c,
                      border: formData.color === c ? '3px solid #ffffff' : 'none',
                      cursor: 'pointer',
                      boxShadow: formData.color === c ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Gán khu vực địa lý - Tiêu chí 4 */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span>Khu Vực Địa Lý Phân Bổ Cho Nhóm</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto', padding: '8px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                {territories.map(tr => {
                  const isChecked = formData.territoryIds.includes(tr.id);
                  return (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => handleToggleTerritory(tr.id)}
                      className={`btn ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
                    >
                      <MapPin size={12} />
                      <span>{tr.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mô tả */}
            <div className="form-group">
              <label className="form-label">Mô Tả & Trách Nhiệm Của Nhóm</label>
              <textarea 
                className="form-textarea"
                rows="2"
                placeholder="Nhiệm vụ trọng tâm, chỉ tiêu doanh thu hoặc đối tượng khách hàng phục vụ..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{editingTeam ? 'Cập Nhật Nhóm' : 'Tạo Mới Nhóm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
