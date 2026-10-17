import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Award, 
  AlertCircle, 
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const KpiQuotaOverview = ({ 
  userKpis, 
  currentUser, 
  companyStats,
  onFilterByOwner
}) => {
  // Tìm KPI của user hiện tại đang được chọn ở persona switcher
  const currentUserKpi = userKpis.find((u) => u.id === currentUser.id) || userKpis[0];

  return (
    <div>
      {/* 4 Summary Stat Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Doanh Số Chốt Thắng (Won)</span>
            <div className="kpi-icon-wrap won">
              <Trophy size={20} />
            </div>
          </div>
          <div className="kpi-value font-mono">
            {formatCurrency(companyStats.totalWonRevenue)}
          </div>
          <div className="kpi-subtext">
            <CheckCircle size={14} className="text-emerald-400" />
            <span>{companyStats.wonCount} hợp đồng đã ký kết</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Tỷ Lệ Thắng (Win Rate)</span>
            <div className="kpi-icon-wrap rate">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value font-mono">
            {companyStats.winRate}%
          </div>
          <div className="kpi-subtext">
            <span>Dựa trên {companyStats.wonCount + companyStats.lostCount} thương vụ đã đóng</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Cơ Hội Đang Xử Lý (Pipeline)</span>
            <div className="kpi-icon-wrap quota">
              <Target size={20} />
            </div>
          </div>
          <div className="kpi-value font-mono">
            {formatCurrency(companyStats.totalPipeline)}
          </div>
          <div className="kpi-subtext">
            <span>{companyStats.openCount} cơ hội đang đàm phán / báo giá</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Thương Vụ Thất Bại (Lost)</span>
            <div className="kpi-icon-wrap lost">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="kpi-value font-mono">
            {companyStats.lostCount}
          </div>
          <div className="kpi-subtext">
            <span>Đã ghi nhận bài học rút ra & đối thủ</span>
          </div>
        </div>
      </div>

      {/* Target & Quota Progress for Current Owner (AC4 Focus) */}
      <div className="quota-progress-container">
        <div className="quota-header-row">
          <div className="quota-user-info">
            <img 
              src={currentUserKpi.avatar} 
              alt={currentUserKpi.name} 
              className="quota-avatar" 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="quota-user-name">{currentUserKpi.name}</h3>
                <span className="badge badge-proposal">Người sở hữu đang đăng nhập</span>
                {currentUserKpi.isQuotaMet && (
                  <span className="badge badge-won" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Award size={12} /> Vượt chỉ tiêu!
                  </span>
                )}
              </div>
              <p className="quota-user-meta">
                {currentUserKpi.roleTitle} &bull; {currentUserKpi.team}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Chỉ tiêu được giao (Quota)
            </span>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {formatCurrency(currentUserKpi.quota)}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="progress-track" title={`Đã đạt ${formatPercent(currentUserKpi.progressPercent)} chỉ tiêu`}>
          <div 
            className={`progress-fill ${currentUserKpi.isQuotaMet ? 'overachieved' : ''}`}
            style={{ width: `${Math.min(100, currentUserKpi.progressPercent)}%` }}
          />
        </div>

        <div className="progress-stats-row">
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Doanh số chốt thắng thực tế: </span>
            <strong className="font-mono text-emerald-400" style={{ fontSize: '1.05rem', marginLeft: '0.25rem' }}>
              {formatCurrency(currentUserKpi.actualRevenue)}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              ({formatPercent(currentUserKpi.progressPercent)} chỉ tiêu &bull; {currentUserKpi.wonCount} hợp đồng)
            </span>
          </div>

          <div>
            {currentUserKpi.isQuotaMet ? (
              <span className="text-emerald-400 font-mono" style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                🎉 Đã hoàn thành xuất sắc vượt chỉ tiêu!
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Còn thiếu: <strong className="font-mono" style={{ color: 'var(--warning)' }}>{formatCurrency(currentUserKpi.remainingAmount)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Team Quota Comparison Leaderboard */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} className="text-indigo-400" />
            Bảng Đối Chiếu Chỉ Tiêu Doanh Số Các Nhân Viên (AC4)
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Giá trị chốt thực tế của cơ hội Thắng tự động cộng dồn vào người sở hữu
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {userKpis.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <div 
                key={u.id}
                style={{
                  background: isCurrent ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(30, 41, 59, 0.8))' : 'var(--bg-card)',
                  border: isCurrent ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onClick={() => onFilterByOwner(u.id)}
                title="Bấm để lọc danh sách cơ hội của nhân viên này"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.roleTitle}</div>
                    </div>
                  </div>
                  <span className={`badge ${u.isQuotaMet ? 'badge-won' : 'badge-proposal'}`}>
                    {formatPercent(u.progressPercent)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Đạt: <strong className="font-mono text-emerald-400">{formatCurrency(u.actualRevenue)}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Chỉ tiêu: <span className="font-mono">{formatCurrency(u.quota)}</span></span>
                </div>

                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min(100, u.progressPercent)}%`, 
                      background: u.isQuotaMet ? 'var(--success)' : 'var(--accent-primary)',
                      borderRadius: '3px'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
