import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowLeftRight, 
  Eye, 
  CheckSquare, 
  Square, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  User, 
  Building2,
  Phone,
  Mail,
  History,
  Briefcase
} from 'lucide-react';
import { PIPELINE_STAGES } from '../data/mockStages';
import { MEMBER_STATUS } from '../data/mockUsers';
import { formatCurrency, formatDate, getDaysAgoText } from '../utils/formatters';

export const OpportunitiesTable = ({
  opportunities,
  currentPersona,
  users,
  selectedDealIds,
  onToggleSelectDeal,
  onSelectAllDeals,
  onClearSelection,
  onOpenReassignModal,
  onOpenDetailModal,
  activeFilterTab,
  onSelectTab,
  selectedRepFilter,
  onSelectRepFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');

  // Lọc cơ hội theo Tab & Dropdowns & Search
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((deal) => {
      // 1. Lọc theo Tab chính
      if (activeFilterTab === 'URGENT') {
        const isUrgent = deal.assigneeStatus === 'ON_LEAVE_SICK' || 
                         deal.assigneeStatus === 'ON_LEAVE_MATERNITY' || 
                         deal.assigneeStatus === 'OVERLOADED';
        if (!isUrgent) return false;
      } else if (activeFilterTab === 'MY_DEALS') {
        if (deal.salesRepId !== currentPersona.id) return false;
      } else if (activeFilterTab === 'NEWLY_RECEIVED') {
        if (!deal.isNewlyReassigned) return false;
      } else if (activeFilterTab === 'TRANSFERRED') {
        if (!deal.reassignCount || deal.reassignCount === 0) return false;
      }

      // 2. Lọc theo nhân sự nếu chọn từ TeamWorkloadBoard
      if (selectedRepFilter && deal.salesRepId !== selectedRepFilter) {
        return false;
      }

      // 3. Lọc theo Giai đoạn
      if (selectedStage !== 'ALL' && deal.stage !== selectedStage) {
        return false;
      }

      // 4. Tìm kiếm từ khóa
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = deal.title.toLowerCase().includes(term);
        const matchCustomer = deal.customerName.toLowerCase().includes(term);
        const matchCode = deal.id.toLowerCase().includes(term);
        const matchRep = deal.salesRepName.toLowerCase().includes(term);
        const matchIndustry = deal.industry?.toLowerCase().includes(term);
        if (!matchTitle && !matchCustomer && !matchCode && !matchRep && !matchIndustry) {
          return false;
        }
      }

      return true;
    });
  }, [opportunities, activeFilterTab, selectedRepFilter, selectedStage, searchTerm, currentPersona]);

  // Kiểm tra trạng thái Select All
  const isAllFilteredSelected = 
    filteredOpportunities.length > 0 &&
    filteredOpportunities.every((d) => selectedDealIds.includes(d.id));

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      onClearSelection();
    } else {
      const allIds = filteredOpportunities.map((d) => d.id);
      onSelectAllDeals(allIds);
    }
  };

  // Đếm số lượng cho từng Tab
  const counts = useMemo(() => {
    return {
      ALL: opportunities.length,
      URGENT: opportunities.filter((o) => 
        o.assigneeStatus === 'ON_LEAVE_SICK' || 
        o.assigneeStatus === 'ON_LEAVE_MATERNITY' || 
        o.assigneeStatus === 'OVERLOADED'
      ).length,
      MY_DEALS: opportunities.filter((o) => o.salesRepId === currentPersona.id).length,
      NEWLY_RECEIVED: opportunities.filter((o) => o.isNewlyReassigned).length,
      TRANSFERRED: opportunities.filter((o) => o.reassignCount > 0).length
    };
  }, [opportunities, currentPersona]);

  return (
    <div className="table-container">
      {/* Thanh lọc & Tìm kiếm */}
      <div className="table-filter-bar">
        {/* Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilterTab === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectTab('ALL')}
          >
            <span>Tất cả</span>
            <span className="tab-count">{counts.ALL}</span>
          </button>

          <button 
            className={`filter-tab ${activeFilterTab === 'URGENT' ? 'active' : ''}`}
            onClick={() => onSelectTab('URGENT')}
            style={{ color: counts.URGENT > 0 ? '#f87171' : undefined }}
          >
            <span>🚨 Cần phân bổ lại</span>
            <span className="tab-count" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              {counts.URGENT}
            </span>
          </button>

          <button 
            className={`filter-tab ${activeFilterTab === 'MY_DEALS' ? 'active' : ''}`}
            onClick={() => onSelectTab('MY_DEALS')}
          >
            <span>💼 Của tôi ({currentPersona.name.split(' ').pop()})</span>
            <span className="tab-count">{counts.MY_DEALS}</span>
          </button>

          <button 
            className={`filter-tab ${activeFilterTab === 'NEWLY_RECEIVED' ? 'active' : ''}`}
            onClick={() => onSelectTab('NEWLY_RECEIVED')}
          >
            <span>✨ Mới nhận</span>
            <span className="tab-count" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              {counts.NEWLY_RECEIVED}
            </span>
          </button>

          <button 
            className={`filter-tab ${activeFilterTab === 'TRANSFERRED' ? 'active' : ''}`}
            onClick={() => onSelectTab('TRANSFERRED')}
          >
            <span>📜 Đã bàn giao</span>
            <span className="tab-count">{counts.TRANSFERRED}</span>
          </button>
        </div>

        {/* Tìm kiếm & Dropdown lọc */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Ô tìm kiếm */}
          <div className="filter-search-box">
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text"
              className="filter-search-input"
              placeholder="Tìm deal, khách hàng, ngành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Lọc theo Nhân sự */}
          <select 
            className="filter-select"
            value={selectedRepFilter || 'ALL'}
            onChange={(e) => onSelectRepFilter(e.target.value === 'ALL' ? null : e.target.value)}
          >
            <option value="ALL">Tất cả người phụ trách</option>
            {users.filter((u) => u.role === 'SALES_REP').map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.statusNote ? u.statusNote.slice(0, 18) + '...' : u.roleTitle.split(' (')[0]})
              </option>
            ))}
          </select>

          {/* Lọc theo Giai đoạn */}
          <select 
            className="filter-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option value="ALL">Tất cả giai đoạn</option>
            {Object.values(PIPELINE_STAGES).map((stg) => (
              <option key={stg.id} value={stg.id}>
                {stg.name} ({stg.probability}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu cơ hội */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '42px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  className="custom-checkbox"
                  checked={isAllFilteredSelected}
                  onChange={handleToggleSelectAll}
                  title="Chọn tất cả cơ hội đang hiển thị"
                />
              </th>
              <th>Mã & Tên Thương Vụ / Khách Hàng</th>
              <th>Giá Trị</th>
              <th>Giai Đoạn</th>
              <th>Người Phụ Trách Hiện Tại</th>
              <th>Hoạt Động Cuối & Tương Tác</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOpportunities.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Briefcase size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                  <div>Không tìm thấy cơ hội nào phù hợp với bộ lọc hiện tại.</div>
                </td>
              </tr>
            ) : (
              filteredOpportunities.map((deal) => {
                const isSelected = selectedDealIds.includes(deal.id);
                const stageConfig = PIPELINE_STAGES[deal.stage] || PIPELINE_STAGES.DISCOVERY;
                const statusConfig = MEMBER_STATUS[deal.assigneeStatus] || MEMBER_STATUS.ACTIVE_NORMAL;

                return (
                  <tr 
                    key={deal.id}
                    className={isSelected ? 'row-selected' : ''}
                  >
                    {/* Checkbox chọn từng deal (AC1) */}
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        className="custom-checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectDeal(deal.id)}
                      />
                    </td>

                    {/* Tên thương vụ & Khách hàng */}
                    <td>
                      <div className="deal-title-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span 
                            className="deal-title-link"
                            onClick={() => onOpenDetailModal(deal)}
                          >
                            {deal.title}
                          </span>
                          
                          {/* Huy hiệu Mới Nhận Bàn Giao (AC2) */}
                          {deal.isNewlyReassigned && (
                            <span className="badge badge-new-reassigned" title={`Mới bàn giao từ ${deal.reassignedFromName || 'đồng nghiệp'}`}>
                              ✨ Mới nhận bàn giao
                            </span>
                          )}

                          {/* Huy hiệu Đã từng bàn giao X lần */}
                          {deal.reassignCount > 0 && !deal.isNewlyReassigned && (
                            <span className="badge badge-purple" title={`Đã chuyển giao ${deal.reassignCount} lần`}>
                              <History size={11} />
                              <span>{deal.reassignCount} lần bàn giao</span>
                            </span>
                          )}
                        </div>

                        <div className="deal-customer-row">
                          <span className="deal-code">{deal.id}</span>
                          <span>•</span>
                          <span style={{ fontWeight: 600 }}>{deal.customerName}</span>
                          <span>•</span>
                          <span>{deal.industry}</span>
                        </div>
                      </div>
                    </td>

                    {/* Giá trị thương vụ */}
                    <td>
                      <div className="deal-value-cell">
                        {formatCurrency(deal.value)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Chốt: {formatDate(deal.expectedCloseDate)}
                      </div>
                    </td>

                    {/* Giai đoạn pipeline */}
                    <td>
                      <span className={`badge ${stageConfig.badgeClass}`}>
                        {stageConfig.shortName} ({stageConfig.probability}%)
                      </span>
                    </td>

                    {/* Người phụ trách & Trạng thái tải (AC1, AC2) */}
                    <td>
                      <div className="assignee-cell">
                        <img 
                          src={deal.salesRepAvatar} 
                          alt={deal.salesRepName} 
                          className="assignee-avatar"
                        />
                        <div>
                          <div className="assignee-name">{deal.salesRepName}</div>
                          <span className={`badge ${statusConfig.badgeClass}`} style={{ marginTop: '0.15rem' }}>
                            {statusConfig.shortLabel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Hoạt động cuối */}
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {deal.lastActivityType}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {getDaysAgoText(deal.lastActivityDate)} ({formatDate(deal.lastActivityDate)})
                      </div>
                      {deal.lastActivityNote && (
                        <div style={{ 
                          fontSize: '0.72rem', 
                          color: 'var(--text-secondary)', 
                          marginTop: '0.2rem',
                          maxWidth: '280px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {deal.lastActivityNote}
                        </div>
                      )}
                    </td>

                    {/* Nút hành động */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {/* Nút phân bổ lại riêng lẻ (AC1) */}
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => onOpenReassignModal([deal.id])}
                          title="Chuyển quyền sở hữu cơ hội này cho người khác"
                        >
                          <ArrowLeftRight size={13} />
                          <span>Phân bổ</span>
                        </button>

                        {/* Nút xem chi tiết & toàn bộ lịch sử (AC2, AC3) */}
                        <button 
                          className="btn btn-sm btn-outline btn-icon"
                          onClick={() => onOpenDetailModal(deal)}
                          title="Xem toàn bộ lịch sử tương tác và biên bản chuyển giao"
                        >
                          <Eye size={15} />
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
};
