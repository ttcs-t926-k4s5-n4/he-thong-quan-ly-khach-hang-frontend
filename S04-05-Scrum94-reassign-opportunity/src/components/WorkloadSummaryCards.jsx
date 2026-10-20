import React from 'react';
import { 
  Briefcase, 
  AlertTriangle, 
  Users, 
  ArrowLeftRight, 
  TrendingUp, 
  Sparkles,
  Flame,
  CalendarOff
} from 'lucide-react';
import { formatCompactCurrency } from '../utils/formatters';

export const WorkloadSummaryCards = ({
  opportunities,
  teamWorkload,
  auditLogs,
  activeFilterTab,
  onSelectTab
}) => {
  // 1. Tổng cơ hội & giá trị pipeline
  const activeOpportunities = opportunities.filter((o) => o.stage !== 'CLOSED_LOST');
  const totalValue = activeOpportunities.reduce((sum, o) => sum + (o.value || 0), 0);

  // 2. Cơ hội cần can thiệp gấp (Của người nghỉ phép hoặc người quá tải)
  const urgentDeals = opportunities.filter((o) => {
    return o.assigneeStatus === 'ON_LEAVE_SICK' || 
           o.assigneeStatus === 'ON_LEAVE_MATERNITY' || 
           o.assigneeStatus === 'OVERLOADED';
  });
  const urgentValue = urgentDeals.reduce((sum, o) => sum + (o.value || 0), 0);

  // 3. Nhân sự: Đếm theo nhóm
  const overloadedCount = teamWorkload.filter((u) => u.dynamicStatus === 'OVERLOADED').length;
  const leaveCount = teamWorkload.filter((u) => u.isOnLeave).length;
  const readyCount = teamWorkload.filter((u) => u.canAcceptMore).length;

  // 4. Số lượng cơ hội mới nhận bàn giao (AC2)
  const newlyReassignedDeals = opportunities.filter((o) => o.isNewlyReassigned);
  const totalReassignedCount = auditLogs.length;

  return (
    <div className="kpi-grid">
      {/* Thẻ 1: Tổng Pipeline */}
      <div 
        className={`kpi-card ${activeFilterTab === 'ALL' ? 'active-filter' : ''}`}
        onClick={() => onSelectTab('ALL')}
      >
        <div className="kpi-card-header">
          <span className="kpi-label">Tổng Cơ Hội Pipeline</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Briefcase size={20} />
          </div>
        </div>
        <div className="kpi-value">{activeOpportunities.length}</div>
        <div className="kpi-footer">
          <span>Tổng giá trị thương vụ:</span>
          <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{formatCompactCurrency(totalValue)}</strong>
        </div>
      </div>

      {/* Thẻ 2: 🚨 Cần Phân Bổ Gấp (Nghỉ phép / Quá tải) */}
      <div 
        className={`kpi-card ${activeFilterTab === 'URGENT' ? 'active-filter' : ''}`}
        onClick={() => onSelectTab('URGENT')}
        style={{ borderColor: urgentDeals.length > 0 ? 'rgba(239, 68, 68, 0.4)' : undefined }}
      >
        <div className="kpi-card-header">
          <span className="kpi-label" style={{ color: urgentDeals.length > 0 ? '#f87171' : undefined }}>
            🚨 Cần Phân Bổ Gấp
          </span>
          <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#ef4444' }}>
          {urgentDeals.length} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>deal</span>
        </div>
        <div className="kpi-footer">
          <span>Giá trị đang rủi ro đứng yên:</span>
          <strong style={{ color: '#f87171', fontFamily: 'var(--font-mono)' }}>{formatCompactCurrency(urgentValue)}</strong>
        </div>
      </div>

      {/* Thẻ 3: Trạng thái Tải Đội Ngũ */}
      <div 
        className="kpi-card"
        title="Nhân viên quá tải (>5 deal) hoặc đang nghỉ phép dài hạn"
      >
        <div className="kpi-card-header">
          <span className="kpi-label">Sức Chứa Đội Ngũ (Capacity)</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Users size={20} />
          </div>
        </div>
        <div className="kpi-value" style={{ fontSize: '1.3rem' }}>
          <span style={{ color: '#10b981' }}>{readyCount} Rảnh</span>
          <span style={{ color: 'var(--text-muted)', margin: '0 0.35rem' }}>•</span>
          <span style={{ color: '#ef4444' }}>{overloadedCount} Tải</span>
          <span style={{ color: 'var(--text-muted)', margin: '0 0.35rem' }}>•</span>
          <span style={{ color: '#f97316' }}>{leaveCount} Nghỉ</span>
        </div>
        <div className="kpi-footer">
          <span>Ứng viên nhận bàn giao:</span>
          <strong style={{ color: '#10b981' }}>{readyCount} nhân sự sẵn sàng</strong>
        </div>
      </div>

      {/* Thẻ 4: Số lượt phân bổ & Giải cứu */}
      <div 
        className={`kpi-card ${activeFilterTab === 'NEWLY_RECEIVED' ? 'active-filter' : ''}`}
        onClick={() => onSelectTab('NEWLY_RECEIVED')}
      >
        <div className="kpi-card-header">
          <span className="kpi-label">Thương Vụ Đã Bàn Giao</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <ArrowLeftRight size={20} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#10b981' }}>
          {totalReassignedCount} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>lần</span>
        </div>
        <div className="kpi-footer">
          <span>Mới bàn giao gần đây:</span>
          <strong style={{ color: '#38bdf8' }}>{newlyReassignedDeals.length} deal có cờ mới</strong>
        </div>
      </div>
    </div>
  );
};
