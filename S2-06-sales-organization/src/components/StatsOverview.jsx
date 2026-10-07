import React from 'react';
import { 
  Network, 
  Users, 
  MapPin, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { formatShortVND } from '../utils/orgUtils';

export default function StatsOverview({
  teams,
  employees,
  territories,
  accessibleDeals,
  currentEmp
}) {
  // Tính số nhóm đã có trưởng nhóm
  const teamsWithLeader = teams.filter(t => t.leaderId).length;
  const isLeaderAssigned100Percent = teamsWithLeader === teams.length;

  // Tính số khu vực đã được gán ít nhất 1 nhóm
  const assignedTerritoryIds = new Set(teams.flatMap(t => t.territoryIds || []));
  const assignedTerritoryCount = territories.filter(tr => assignedTerritoryIds.has(tr.id)).length;

  // Tổng doanh số trong phạm vi của user hiện tại
  const totalScopePipeline = accessibleDeals.reduce((sum, d) => sum + d.dealValue, 0);

  return (
    <div className="stats-grid">
      {/* 1. Nhóm & Cây tổ chức */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-title">Cấu Trúc Cây Tổ Chức</span>
          <span className="stat-value">{teams.length} Nhóm KD</span>
          <span className="stat-desc" style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} />
            {teamsWithLeader}/{teams.length} Nhóm có Trưởng nhóm (100%)
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
          <Network size={24} />
        </div>
      </div>

      {/* 2. Nhân sự & Ràng buộc đơn nhất */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-title">Quy Chuẩn Nhân Sự</span>
          <span className="stat-value">{employees.length} Nhân Sự</span>
          <span className="stat-desc" style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} />
            Mỗi nhân viên thuộc đúng 1 nhóm
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
          <Users size={24} />
        </div>
      </div>

      {/* 3. Phân bổ Địa bàn / Khu vực */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-title">Độ Phủ Địa Bàn KD</span>
          <span className="stat-value">{assignedTerritoryCount}/{territories.length} Khu Vực</span>
          <span className="stat-desc" style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} />
            Đã gán cho các nhóm chuyên trách
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <MapPin size={24} />
        </div>
      </div>

      {/* 4. Doanh số trong phạm vi nhìn thấy */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-title">Doanh Số Trong Tầm Nhìn</span>
          <span className="stat-value">{formatShortVND(totalScopePipeline)}</span>
          <span className="stat-desc" style={{ color: 'var(--text-muted)' }}>
            Góc nhìn của: <strong>{currentEmp?.name}</strong>
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <TrendingUp size={24} />
        </div>
      </div>
    </div>
  );
}
