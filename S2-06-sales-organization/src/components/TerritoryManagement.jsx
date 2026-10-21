import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Building2, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Tag
} from 'lucide-react';

export default function TerritoryManagement({
  territories,
  teams,
  onOpenAddTerritory,
  onOpenEditTerritory,
  onDeleteTerritory,
  onOpenAssignModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');

  const filteredTerritories = territories.filter(tr => {
    const matchesSearch = !searchQuery || 
      tr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.provinces.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegionFilter === 'all' || tr.regionGroup === selectedRegionFilter;

    return matchesSearch && matchesRegion;
  });

  // Tìm các nhóm đang phụ trách khu vực này
  const getTeamsCoveringTerritory = (terrId) => {
    return teams.filter(t => (t.territoryIds || []).includes(terrId));
  };

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} style={{ color: 'var(--accent-amber)' }} />
            <span>Khai Báo Khu Vực Địa Lý & Gán Địa Bàn Cho Nhóm</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Tiêu chí 4 SCRUM-64: Thiết lập các vùng thị trường, tỉnh thành trọng điểm và phân công nhóm kinh doanh chịu trách nhiệm.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddTerritory}>
          <Plus size={16} />
          <span>Khai Báo Khu Vực Mới</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <div style={{ padding: '14px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-box" style={{ minWidth: '280px' }}>
            <Search size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Tìm theo tên khu vực, tỉnh/thành, mã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} style={{ color: 'var(--text-muted)' }} />
            <select 
              className="form-select"
              style={{ fontSize: '0.82rem', padding: '6px 10px' }}
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
            >
              <option value="all">Tất cả vùng miền</option>
              <option value="Toàn Quốc">Toàn Quốc</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
              <option value="Đặc Biệt">Thị trường mới / Đặc biệt</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tổng số: <strong>{territories.length}</strong> khu vực khai báo
          </span>
        </div>
      </div>

      {/* Territory Grid / Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã & Tên Khu Vực Địa Lý</th>
              <th>Vùng Miền Trọng Điểm</th>
              <th>Phạm Vi Tỉnh / Thành Trực Thuộc</th>
              <th>Nhóm Kinh Doanh Được Gán Phụ Trách</th>
              <th>Tiềm Năng Thị Trường</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTerritories.map(tr => {
              const assignedTeams = getTeamsCoveringTerritory(tr.id);
              const isAssigned = assignedTeams.length > 0;

              return (
                <tr key={tr.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} style={{ color: 'var(--accent-amber)' }} />
                        <span>{tr.name}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {tr.code}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-medium)',
                      color: tr.regionGroup === 'Miền Bắc' ? 'var(--accent-cyan)' : tr.regionGroup === 'Miền Nam' ? 'var(--accent-emerald)' : tr.regionGroup === 'Miền Trung' ? 'var(--accent-amber)' : 'var(--accent-blue)'
                    }}>
                      {tr.regionGroup}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {tr.provinces.map((p, idx) => (
                        <span 
                          key={idx}
                          style={{
                            fontSize: '0.72rem',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--bg-surface-elevated)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {/* TIÊU CHÍ 4: GÁN KHU VỰC CHO NHÓM */}
                    {isAssigned ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {assignedTeams.map(t => (
                          <div 
                            key={t.id} 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '5px',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              background: 'var(--bg-surface-elevated)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              borderLeft: `3px solid ${t.color || 'var(--accent-blue)'}`
                            }}
                          >
                            <Building2 size={13} style={{ color: t.color || 'var(--accent-blue)' }} />
                            <span>{t.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--accent-rose)', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        background: 'var(--accent-rose-bg)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <AlertTriangle size={12} />
                        <span>Chưa gán nhóm phụ trách</span>
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {tr.marketPotential}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                        onClick={() => onOpenAssignModal(tr)}
                        title="Gán thêm nhóm kinh doanh phụ trách địa bàn này"
                      >
                        <Building2 size={13} />
                        <span>Gán Nhóm</span>
                      </button>
                      <button 
                        className="btn btn-secondary btn-icon"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => onOpenEditTerritory(tr)}
                        title="Chỉnh sửa khu vực"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn btn-danger btn-icon"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => onDeleteTerritory(tr)}
                        title="Xoá khu vực"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
