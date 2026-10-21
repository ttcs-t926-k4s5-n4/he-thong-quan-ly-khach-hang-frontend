import React, { useState } from 'react';
import { X, Building2, MapPin, Check, Save } from 'lucide-react';

export default function AssignTerritoryModal({
  isOpen,
  onClose,
  territory,
  teams,
  onSaveAssignments
}) {
  if (!isOpen || !territory) return null;

  // Initial assigned team IDs
  const [selectedTeamIds, setSelectedTeamIds] = useState(() => {
    return teams.filter(t => (t.territoryIds || []).includes(territory.id)).map(t => t.id);
  });

  const toggleTeam = (teamId) => {
    setSelectedTeamIds(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const handleSave = () => {
    onSaveAssignments(territory.id, selectedTeamIds);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="modal-title">Phân Bổ Nhóm Phụ Trách Địa Bàn</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Khu vực: <strong>{territory.name}</strong> ({territory.code})
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} style={{ color: 'var(--accent-amber)' }} />
            <span style={{ fontSize: '0.85rem' }}>
              Các tỉnh thành trực thuộc: <strong>{territory.provinces.join(', ')}</strong>
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Chọn các nhóm kinh doanh chịu trách nhiệm phát triển doanh số tại khu vực này:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
            {teams.map(team => {
              const isSelected = selectedTeamIds.includes(team.id);
              return (
                <div 
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                    background: isSelected ? 'var(--accent-emerald-bg)' : 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        border: `2px solid ${isSelected ? 'var(--accent-emerald)' : 'var(--border-strong)'}`,
                        backgroundColor: isSelected ? 'var(--accent-emerald)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                        {'— '.repeat(team.level)} {team.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Mã: {team.code} &bull; Cấp {team.level}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: isSelected ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                    {isSelected ? 'Đang phụ trách' : 'Chưa gán'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Lưu Phân Bổ Nhóm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
