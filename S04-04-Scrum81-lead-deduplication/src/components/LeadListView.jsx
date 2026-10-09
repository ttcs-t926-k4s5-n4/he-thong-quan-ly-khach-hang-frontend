import React from 'react';
import { 
  Search, 
  Plus, 
  GitMerge, 
  Building2, 
  Eye, 
  PhoneCall, 
  Mail, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  Building,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function LeadListView({
  leads = [],
  duplicateMap = new Map(),
  activeFilter = 'ALL',
  onSelectFilter,
  searchQuery = '',
  onSearchChange,
  onOpenNewLeadModal,
  onOpenMergeModal,
  onOpenAttachCustomerModal,
  onOpenDetailModal,
  onSimulateMorningCall
}) {
  // Lọc dữ liệu theo tab và từ khóa
  const filteredLeads = leads.filter(lead => {
    // 1. Lọc theo tab
    const dupInfo = duplicateMap.get(lead.id) || { duplicateLeads: [], matchedCustomers: [] };
    const hasDupLead = dupInfo.duplicateLeads && dupInfo.duplicateLeads.length > 0;
    const hasMatchedCust = dupInfo.matchedCustomers && dupInfo.matchedCustomers.length > 0;

    if (activeFilter === 'DUPLICATES' && !hasDupLead) return false;
    if (activeFilter === 'CUSTOMER_MATCHES' && !hasMatchedCust) return false;
    if (activeFilter === 'MERGED' && !lead.isMerged && !lead.isAttachedToCustomer) return false;

    // 2. Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = lead.fullName?.toLowerCase().includes(q);
      const matchCompany = lead.companyName?.toLowerCase().includes(q);
      const matchEmail = lead.email?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.includes(q);
      const matchCode = lead.code?.toLowerCase().includes(q);
      const matchStaff = lead.assignedTo?.name?.toLowerCase().includes(q);
      return matchName || matchCompany || matchEmail || matchPhone || matchCode || matchStaff;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filter and Action Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectFilter('ALL')}
          >
            <span>Tất cả Leads</span>
            <span className="filter-badge">{leads.length}</span>
          </button>

          <button 
            className={`filter-tab ${activeFilter === 'DUPLICATES' ? 'active' : ''}`}
            onClick={() => onSelectFilter('DUPLICATES')}
          >
            <AlertTriangle size={14} />
            <span>Cảnh báo trùng lặp</span>
            <span className="filter-badge" style={{ background: 'var(--danger-500)', color: 'white' }}>
              {leads.filter(l => (duplicateMap.get(l.id)?.duplicateLeads?.length || 0) > 0 && !l.isMerged).length}
            </span>
          </button>

          <button 
            className={`filter-tab ${activeFilter === 'CUSTOMER_MATCHES' ? 'active' : ''}`}
            onClick={() => onSelectFilter('CUSTOMER_MATCHES')}
          >
            <Building2 size={14} />
            <span>Trùng Khách hàng đã có</span>
            <span className="filter-badge" style={{ background: '#7c3aed', color: 'white' }}>
              {leads.filter(l => (duplicateMap.get(l.id)?.matchedCustomers?.length || 0) > 0 && !l.isAttachedToCustomer).length}
            </span>
          </button>

          <button 
            className={`filter-tab ${activeFilter === 'MERGED' ? 'active' : ''}`}
            onClick={() => onSelectFilter('MERGED')}
          >
            <CheckCircle size={14} />
            <span>Đã gộp / Gắn xong</span>
            <span className="filter-badge">
              {leads.filter(l => l.isMerged || l.isAttachedToCustomer).length}
            </span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search box */}
          <div className="search-box">
            <Search size={16} color="var(--text-dim)" />
            <input 
              type="text" 
              placeholder="Tìm theo Tên, SĐT, Email, Công ty..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Quick simulation button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onSimulateMorningCall}
            title="Kích hoạt mô phỏng Telesales gọi điện sáng nay để thử nghiệm tính năng cảnh báo"
          >
            <PhoneCall size={14} />
            <span>Thử Gọi Buổi Sáng</span>
          </button>

          {/* Add New Lead button */}
          <button 
            className="btn btn-primary btn-sm"
            onClick={onOpenNewLeadModal}
          >
            <Plus size={16} />
            <span>Thêm Lead Mới (Live Scanner)</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Khách Hàng & Doanh Nghiệp</th>
              <th>Thông Tin Liên Hệ</th>
              <th>Kênh Tiếp Thị</th>
              <th>Telesales Phụ Trách</th>
              <th>Tình Trạng & Đối Soát Trùng</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
                  Không tìm thấy Lead nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const dupInfo = duplicateMap.get(lead.id) || { duplicateLeads: [], matchedCustomers: [] };
                const topDup = dupInfo.duplicateLeads?.[0];
                const topCust = dupInfo.matchedCustomers?.[0];
                const isConflict = topDup?.morningCallConflict;

                return (
                  <tr 
                    key={lead.id} 
                    className={isConflict ? 'row-conflict' : ''}
                    style={lead.isMerged ? { opacity: 0.6 } : {}}
                  >
                    {/* 1. Identity & Company */}
                    <td>
                      <div className="lead-identity-cell">
                        <div className="lead-name-row">
                          <span className="lead-name">{lead.fullName}</span>
                          <span className="lead-code">{lead.code}</span>
                          {lead.isMerged && (
                            <span className="badge badge-merged">ĐÃ GỘP VÀO #{lead.mergedIntoId}</span>
                          )}
                          {lead.isAttachedToCustomer && (
                            <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                              ĐÃ GẮN VÀO KH #{lead.attachedCustomerId}
                            </span>
                          )}
                        </div>
                        {lead.jobTitle && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {lead.jobTitle}
                          </span>
                        )}
                        <div className="lead-company">
                          <Building size={13} />
                          <span>{lead.companyName}</span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Contact Details */}
                    <td>
                      <div className="contact-cell">
                        <div className={`contact-item ${topDup?.isPhoneMatch ? 'highlight-match' : ''}`}>
                          <Phone size={13} />
                          <span>{lead.phone}</span>
                          {topDup?.isPhoneMatch && (
                            <span title="Trùng số điện thoại!" style={{ color: 'var(--danger-600)', fontSize: '0.7rem' }}>⚠️ Trùng SĐT</span>
                          )}
                        </div>
                        <div className={`contact-item ${topDup?.isEmailMatch ? 'highlight-match' : ''}`}>
                          <Mail size={13} />
                          <span>{lead.email}</span>
                          {topDup?.isEmailMatch && (
                            <span title="Trùng Email!" style={{ color: 'var(--danger-600)', fontSize: '0.7rem' }}>⚠️ Trùng Email</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. Marketing Source */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {lead.leadSource}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            Điểm Lead: <strong>{lead.leadScore}/100</strong>
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            &bull; {lead.timeline?.length || 0} hoạt động
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Staff Assignee */}
                    <td>
                      <div className="staff-cell">
                        <img 
                          src={lead.assignedTo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'} 
                          alt="" 
                          className="staff-avatar"
                        />
                        <div className="staff-info">
                          <span className="staff-name">{lead.assignedTo?.name || 'Chưa phân công'}</span>
                          <span className="staff-role">{lead.assignedTo?.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* 5. Status & Duplicate Alerts */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {/* Morning Call Conflict Warning Badge (Highlighting acceptance criteria) */}
                        {isConflict && !lead.isMerged && (
                          <div className="badge badge-morning-conflict" title={topDup.conflictMessage}>
                            <ShieldAlert size={13} />
                            <span>NGUY CƠ 2 NV GỌI TRÙNG SÁNG NAY!</span>
                          </div>
                        )}

                        {/* Duplicate with another Lead Badge */}
                        {topDup && !lead.isMerged && (
                          <div 
                            className={`badge ${topDup.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}
                            title={topDup.reasons.join('\n')}
                          >
                            <AlertTriangle size={12} />
                            <span>
                              {topDup.severity} ({topDup.score}%) - Trùng {topDup.targetLead.code}
                            </span>
                          </div>
                        )}

                        {/* Match with Existing Customer Badge */}
                        {topCust && !lead.isAttachedToCustomer && (
                          <div 
                            className="badge badge-customer-match"
                            title={topCust.reasons.join('\n')}
                          >
                            <Building2 size={12} />
                            <span>
                              Trùng KH: {topCust.customer.id} ({topCust.score}%)
                            </span>
                          </div>
                        )}

                        {/* Clean Status */}
                        {!topDup && !topCust && !lead.isMerged && !lead.isAttachedToCustomer && (
                          <div className="badge badge-clean">
                            <CheckCircle size={12} />
                            <span>Độc lập / Hợp lệ</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 6. Actions */}
                    <td>
                      <div className="table-actions">
                        {/* Action 1: Merge Duplicate Leads */}
                        {topDup && !lead.isMerged && (
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => onOpenMergeModal(lead, topDup.targetLead)}
                            title="Mở màn hình so sánh và gộp bản ghi trùng lặp"
                          >
                            <GitMerge size={14} />
                            <span>Gộp Lead</span>
                          </button>
                        )}

                        {/* Action 2: Attach to Existing Customer */}
                        {topCust && !lead.isAttachedToCustomer && (
                          <button 
                            className="btn btn-sm"
                            style={{ background: '#7c3aed', color: 'white' }}
                            onClick={() => onOpenAttachCustomerModal(lead, topCust.customer)}
                            title="Gắn thẳng Lead này vào Khách hàng doanh nghiệp đã có"
                          >
                            <Building2 size={14} />
                            <span>Gắn Vào KH</span>
                          </button>
                        )}

                        {/* Action 3: View Full Timeline */}
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenDetailModal(lead)}
                          title="Xem chi tiết hồ sơ và toàn bộ dòng thời gian tương tác"
                        >
                          <Eye size={14} />
                          <span>Chi Tiết</span>
                        </button>
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
