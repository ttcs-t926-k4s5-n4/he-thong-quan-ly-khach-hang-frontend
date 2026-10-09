import React from 'react';
import { 
  CheckCircle2, 
  Inbox, 
  Clock, 
  Building, 
  MapPin, 
  UserCheck, 
  UserPlus, 
  Search, 
  AlertTriangle, 
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function LeadDistributionTable({
  leads = [],
  activeFilter = 'ALL',
  onSelectFilter,
  searchQuery = '',
  onSearchChange,
  onOpenManualAssignModal
}) {
  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 'ASSIGNED' && lead.status !== 'ASSIGNED') return false;
    if (activeFilter === 'WAITING' && lead.status !== 'WAITING_MANUAL_ASSIGN') return false;
    if (activeFilter === 'MANUALLY_ASSIGNED' && lead.status !== 'MANUALLY_ASSIGNED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = lead.fullName?.toLowerCase().includes(q);
      const matchCompany = lead.companyName?.toLowerCase().includes(q);
      const matchStaff = lead.routingResult?.assignedStaff?.name?.toLowerCase().includes(q);
      return matchName || matchCompany || matchStaff;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Filter and Search Bar */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onSelectFilter('ALL')}
          >
            <span>Tất cả Leads ({leads.length})</span>
          </button>

          <button 
            className={`btn btn-sm ${activeFilter === 'ASSIGNED' ? 'btn-success' : 'btn-ghost'}`}
            onClick={() => onSelectFilter('ASSIGNED')}
          >
            <CheckCircle2 size={14} />
            <span>Đã phân bổ tự động ({leads.filter(l => l.status === 'ASSIGNED').length})</span>
          </button>

          <button 
            className={`btn btn-sm ${activeFilter === 'WAITING' ? 'btn-warning' : 'btn-ghost'}`}
            onClick={() => onSelectFilter('WAITING')}
          >
            <Inbox size={14} />
            <span>Hàng chờ Trưởng nhóm chia tay ({leads.filter(l => l.status === 'WAITING_MANUAL_ASSIGN').length})</span>
          </button>

          <button 
            className={`btn btn-sm ${activeFilter === 'MANUALLY_ASSIGNED' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onSelectFilter('MANUALLY_ASSIGNED')}
          >
            <UserCheck size={14} />
            <span>Đã chia tay ({leads.filter(l => l.status === 'MANUALLY_ASSIGNED').length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.35rem 0.65rem' }}>
          <Search size={14} color="#64748b" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, công ty, sales..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '220px', color: 'var(--text-main)' }}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Khách Hàng & Doanh Nghiệp</th>
              <th>Khu Vực & Ngành Nghề</th>
              <th>Quy Tắc Khớp (First-Match-Wins)</th>
              <th>Telesales Phụ Trách</th>
              <th>Trạng Thái & SLA Chạy Nền</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
                  Không tìm thấy Lead nào trong danh mục này.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const res = lead.routingResult || {};
                const isAutoAssigned = lead.status === 'ASSIGNED';
                const isWaitingManual = lead.status === 'WAITING_MANUAL_ASSIGN';
                const isManuallyAssigned = lead.status === 'MANUALLY_ASSIGNED';

                // Nhãn khu vực
                let regionLabel = 'Toàn quốc';
                if (lead.region === 'NORTH') regionLabel = 'Miền Bắc (Hà Nội)';
                else if (lead.region === 'SOUTH') regionLabel = 'Miền Nam (TP.HCM)';
                else if (lead.region === 'CENTRAL') regionLabel = 'Miền Trung (Đà Nẵng)';
                else if (lead.region === 'INTERNATIONAL') regionLabel = 'Quốc tế';

                return (
                  <tr key={lead.id} style={isWaitingManual ? { background: 'rgba(245, 158, 11, 0.04)' } : {}}>
                    {/* 1. Identity & Company */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{lead.fullName}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'var(--bg-surface-subtle)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                            {lead.code}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Building size={12} />
                          <span>{lead.companyName}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          SĐT: {lead.phone} &bull; Tiếp nhận: {lead.intakeTime}
                        </div>
                      </div>
                    </td>

                    {/* 2. Region & Industry */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                          <MapPin size={13} color="#2563eb" />
                          <span>{regionLabel}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Ngành: <strong>{lead.industry}</strong>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Nguồn: {lead.source}
                        </div>
                      </div>
                    </td>

                    {/* 3. Matched Rule (First-Match-Wins) */}
                    <td>
                      {isAutoAssigned && res.matchedRule ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge-assigned" style={{ fontSize: '0.72rem' }}>
                            <Zap size={12} />
                            Khớp Rule #{res.matchedRule.priority} (Thắng)
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {res.matchedRule.name}
                          </span>
                        </div>
                      ) : isManuallyAssigned ? (
                        <span style={{ fontSize: '0.76rem', color: '#7c3aed', fontWeight: 600 }}>
                          Phân bổ thủ công bởi Trưởng nhóm
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertTriangle size={13} />
                          Không khớp quy tắc nào
                        </span>
                      )}
                    </td>

                    {/* 4. Staff Assignee */}
                    <td>
                      {res.assignedStaff ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <img 
                            src={res.assignedStaff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'} 
                            alt="" 
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{res.assignedStaff.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{res.assignedTeamName}</span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#d97706', fontStyle: 'italic' }}>
                          Chưa có người phụ trách
                        </span>
                      )}
                    </td>

                    {/* 5. Status & SLA (< 5 min) */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {isAutoAssigned && (
                          <>
                            <span className="badge-sla">
                              ✓ {res.slaLabel || 'Hoàn tất < 5 phút'}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                              Giao lúc: {res.assignedAt}
                            </span>
                          </>
                        )}

                        {isWaitingManual && (
                          <div className="badge-waiting">
                            <Clock size={12} />
                            <span>CHỜ PHÂN TAY (HÀNG CHỜ)</span>
                          </div>
                        )}

                        {isManuallyAssigned && (
                          <span style={{ fontSize: '0.75rem', color: '#7c3aed', background: '#f5f3ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            ✓ Đã giao việc thành công
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. Actions */}
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        {isWaitingManual ? (
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => onOpenManualAssignModal(lead)}
                            title="Trưởng nhóm thực hiện phân bổ thủ công cho lead này"
                          >
                            <UserPlus size={14} />
                            <span>Phân Bổ Tay</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                            Đã chuyển giao
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
