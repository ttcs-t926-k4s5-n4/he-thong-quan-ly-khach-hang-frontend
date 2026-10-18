import React, { useState } from 'react';
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  CalendarOff, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';
import { MEMBER_STATUS } from '../data/mockUsers';
import { formatCompactCurrency } from '../utils/formatters';

export const TeamWorkloadBoard = ({
  teamWorkload,
  onSelectRepFilter,
  selectedRepFilter,
  onQuickReassignRep
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Lọc chỉ các Sales Rep (không hiển thị Director trong danh sách nhận deal thông thường)
  const reps = teamWorkload.filter((u) => u.role === 'SALES_REP');

  return (
    <div className="workload-board">
      <div className="workload-board-header">
        <div className="workload-title">
          <Users size={19} color="#3b82f6" />
          <span>Bảng Theo Dõi Khối Lượng Công Việc & Trạng Thái Nhân Sự (Team Capacity)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedRepFilter && (
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => onSelectRepFilter(null)}
              style={{ fontSize: '0.75rem' }}
            >
              ✕ Bỏ lọc nhân sự
            </button>
          )}
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="workload-members-grid">
          {reps.map((member) => {
            const statusConfig = MEMBER_STATUS[member.dynamicStatus] || MEMBER_STATUS.ACTIVE_NORMAL;
            const isFilterActive = selectedRepFilter === member.id;

            // Màu của progress bar
            let barColor = '#3b82f6';
            if (member.dynamicStatus === 'OVERLOADED') barColor = '#ef4444';
            else if (member.isOnLeave) barColor = '#f97316';
            else if (member.dynamicStatus === 'ACTIVE_CAPACITY') barColor = '#10b981';

            return (
              <div 
                key={member.id}
                className={`member-workload-card ${
                  member.dynamicStatus === 'OVERLOADED' ? 'is-overloaded' : ''
                } ${member.isOnLeave ? 'is-leave' : ''} ${isFilterActive ? 'active-filter' : ''}`}
                style={{
                  borderWidth: isFilterActive ? '2px' : '1px',
                  borderColor: isFilterActive ? 'var(--accent-primary)' : undefined
                }}
              >
                {/* Header card */}
                <div className="member-top">
                  <div className="member-info-left">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="member-avatar"
                    />
                    <div>
                      <div className="member-name">{member.name}</div>
                      <div className="member-role">{member.roleTitle.split(' (')[0]}</div>
                    </div>
                  </div>
                  <span className={`badge ${statusConfig.badgeClass}`}>
                    {statusConfig.shortLabel}
                  </span>
                </div>

                {/* Progress bar đo tải */}
                <div>
                  <div className="progress-track">
                    <div 
                      className="progress-bar"
                      style={{ 
                        width: `${Math.min(member.workloadPercent, 100)}%`,
                        background: barColor
                      }}
                    />
                  </div>
                  <div className="member-stats-row" style={{ marginTop: '0.4rem' }}>
                    <span>
                      Đang giữ: <strong>{member.activeDealCount}</strong> / {member.maxCapacity} deals
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {formatCompactCurrency(member.totalPipelineValue)}
                    </span>
                  </div>
                </div>

                {/* Ghi chú lý do nếu nghỉ hoặc quá tải */}
                {member.statusNote && (
                  <div style={{ 
                    fontSize: '0.72rem', 
                    color: 'var(--text-muted)', 
                    background: 'rgba(0,0,0,0.2)', 
                    padding: '0.35rem 0.5rem', 
                    borderRadius: '4px',
                    lineHeight: '1.3'
                  }}>
                    {member.statusNote}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.35rem' }}>
                  <button 
                    className="btn btn-sm btn-outline"
                    style={{ flex: 1, fontSize: '0.72rem', padding: '0.25rem 0.4rem' }}
                    onClick={() => onSelectRepFilter(isFilterActive ? null : member.id)}
                  >
                    {isFilterActive ? 'Đang lọc ✓' : `Xem ${member.activeDealCount} deal`}
                  </button>

                  {/* Nút phân bổ nhanh cho người nghỉ hoặc người quá tải */}
                  {(member.isOnLeave || member.dynamicStatus === 'OVERLOADED') && member.activeDealCount > 0 && (
                    <button 
                      className="btn btn-sm btn-danger"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                      onClick={() => onQuickReassignRep(member)}
                      title={`Bàn giao các deal của ${member.name} sang người khác`}
                    >
                      <Zap size={13} />
                      <span>Bàn giao deal</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
