import React from 'react';
import { Calendar, Filter, Users, Building2 } from 'lucide-react';
import { SALES_TEAMS, MOCK_USERS } from '../data/mockUsers';

export const PeriodBar = ({
  periodFilter,
  setPeriodFilter,
  teamFilter,
  setTeamFilter,
  repFilter,
  setRepFilter
}) => {
  const periods = [
    { id: 'THIS_MONTH', label: 'Tháng Này', sub: 'T10/2026' },
    { id: 'NEXT_MONTH', label: 'Tháng Sau', sub: 'T11/2026' },
    { id: 'THIS_QUARTER', label: 'Quý Này', sub: 'Q4/2026' },
    { id: 'ALL', label: 'Tất Cả Kỳ', sub: 'Toàn bộ' }
  ];

  // Filter reps based on selected team
  const availableReps = MOCK_USERS.filter((u) => {
    if (u.role !== 'SALES_REP') return false;
    if (teamFilter === 'ALL') return true;
    return u.teamId === teamFilter;
  });

  return (
    <div className="period-bar">
      {/* Period Horizon Selector (Tiêu chí 2) */}
      <div className="period-tabs">
        {periods.map((p) => (
          <button
            key={p.id}
            className={`period-tab ${periodFilter === p.id ? 'active' : ''}`}
            onClick={() => setPeriodFilter(p.id)}
          >
            <Calendar size={14} />
            <span>{p.label}</span>
            <span className="period-badge">{p.sub}</span>
          </button>
        ))}
      </div>

      {/* Scope Selectors: Team & Rep (Tiêu chí 4) */}
      <div className="scope-selectors">
        {/* Team Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Building2 size={16} color="var(--text-secondary)" />
          <select
            className="select-box"
            value={teamFilter}
            onChange={(e) => {
              setTeamFilter(e.target.value);
              setRepFilter('ALL'); // Reset rep when team changes
            }}
          >
            <option value="ALL">🏢 Toàn bộ Nhóm kinh doanh</option>
            {SALES_TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rep Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={16} color="var(--text-secondary)" />
          <select
            className="select-box"
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
          >
            <option value="ALL">👤 Toàn bộ Nhân viên ({availableReps.length} người)</option>
            {availableReps.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name} ({rep.roleTitle})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
