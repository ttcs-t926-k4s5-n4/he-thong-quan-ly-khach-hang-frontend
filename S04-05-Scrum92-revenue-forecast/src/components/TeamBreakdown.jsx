import React, { useState } from 'react';
import { Building2, Users, Award, TrendingUp, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { formatCurrency, formatPercent, formatCompactCurrency } from '../utils/formatters';

export const TeamBreakdown = ({
  teamStats,
  repStats,
  onSelectTeam,
  onSelectRep,
  selectedTeam,
  selectedRep
}) => {
  const [viewMode, setViewMode] = useState('TEAMS'); // 'TEAMS' | 'REPS'

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {viewMode === 'TEAMS' ? <Building2 size={18} color="var(--accent-primary)" /> : <Users size={18} color="var(--accent-primary)" />}
            Phân Rã Dự Báo Theo Tổ Chức Bán Hàng (Tiêu Chí 4)
          </h3>
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              className={`nav-tab-btn ${viewMode === 'TEAMS' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setViewMode('TEAMS')}
            >
              <Building2 size={14} />
              Theo Từng Nhóm ({teamStats.length})
            </button>
            <button
              className={`nav-tab-btn ${viewMode === 'REPS' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setViewMode('REPS')}
            >
              <Users size={14} />
              Theo Từng Nhân Viên ({repStats.length})
            </button>
          </div>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Nhấp vào hàng để lọc nhanh danh sách cơ hội tương ứng
        </span>
      </div>

      {viewMode === 'TEAMS' ? (
        /* Team View Table */
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên Nhóm Kinh Doanh</th>
                <th>Trưởng Nhóm</th>
                <th>Chỉ Tiêu (Quota)</th>
                <th>Đã Chốt Thực Tế</th>
                <th>Dự Báo Trọng Số</th>
                <th>Tổng Doanh Số Kỳ Vọng</th>
                <th>% Tiến Độ</th>
                <th>Số Deal</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team) => {
                const isSelected = selectedTeam === team.teamId;
                const isExceeded = team.gap <= 0;
                return (
                  <tr 
                    key={team.teamId}
                    style={{ 
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--accent-primary)' : 'transparent'
                    }}
                    onClick={() => onSelectTeam(isSelected ? 'ALL' : team.teamId)}
                  >
                    <td>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: team.color }} />
                        {team.teamName}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{team.leadName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(team.quota)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: 600 }}>
                      {formatCurrency(team.actualWon)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                      {formatCurrency(team.weighted)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: 700 }}>
                      {formatCurrency(team.totalProjected)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          color: isExceeded ? 'var(--success)' : (team.attainment >= 75 ? '#818cf8' : 'var(--warning)') 
                        }}>
                          {formatPercent(team.attainment)}
                        </span>
                        {isExceeded && <Award size={14} color="var(--success)" title="Vượt chỉ tiêu" />}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {team.wonCount} đã chốt / {team.openCount} mở
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTeam(isSelected ? 'ALL' : team.teamId);
                        }}
                      >
                        {isSelected ? 'Đang Lọc' : 'Xem Cơ Hội'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Sales Rep View Table */
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Nhân Viên Kinh Doanh</th>
                <th>Nhóm Phụ Trách</th>
                <th>Chỉ Tiêu (Quota)</th>
                <th>Đã Chốt Thực Tế</th>
                <th>Dự Báo Trọng Số</th>
                <th>Tổng Kỳ Vọng</th>
                <th>% Tiến Độ</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {repStats.map((rep, idx) => {
                const isSelected = selectedRep === rep.repId;
                const isExceeded = rep.gap <= 0;
                return (
                  <tr 
                    key={rep.repId}
                    style={{ 
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--accent-primary)' : 'transparent'
                    }}
                    onClick={() => onSelectRep(isSelected ? 'ALL' : rep.repId)}
                  >
                    <td>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%',
                        background: idx === 0 ? '#facc15' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#d97706' : 'rgba(255,255,255,0.06)')),
                        color: idx <= 2 ? '#000' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {idx + 1}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img 
                          src={rep.avatar} 
                          alt={rep.name} 
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{rep.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{rep.roleTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{rep.teamName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(rep.quota)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: 600 }}>
                      {formatCurrency(rep.actualWon)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                      {formatCurrency(rep.weighted)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: 700 }}>
                      {formatCurrency(rep.totalProjected)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          color: isExceeded ? 'var(--success)' : (rep.attainment >= 80 ? '#818cf8' : 'var(--warning)') 
                        }}>
                          {formatPercent(rep.attainment)}
                        </span>
                        {isExceeded && <Award size={14} color="var(--success)" title="Vượt chỉ tiêu cá nhân" />}
                      </div>
                    </td>
                    <td>
                      <button 
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRep(isSelected ? 'ALL' : rep.repId);
                        }}
                      >
                        {isSelected ? 'Đang Lọc' : 'Xem Cơ Hội'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
