import React from 'react';
import { 
  Search, 
  Filter, 
  Lock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Eye, 
  Trophy, 
  TrendingDown, 
  FileCheck,
  Building,
  User
} from 'lucide-react';
import { OPPORTUNITY_STAGES } from '../data/mockOpportunities';
import { formatCurrency, formatDate } from '../utils/formatters';
import { USER_ROLES } from '../data/mockUsers';

export const OpportunityTable = ({
  opportunities,
  currentUser,
  searchTerm,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  ownerFilter,
  onOwnerFilterChange,
  users,
  onOpenCloseWonModal,
  onOpenCloseLostModal,
  onOpenReopenModal,
  onViewDetail
}) => {
  const currentRole = USER_ROLES[currentUser.role] || USER_ROLES.SALES_REP;
  const canReopen = currentRole.canReopen;

  return (
    <div className="table-card">
      {/* Toolbar / Filters */}
      <div className="table-toolbar">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo mã cơ hội, tiêu đề, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          {/* Filter Stage */}
          <select 
            className="filter-select"
            value={stageFilter}
            onChange={(e) => onStageFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả giai đoạn</option>
            <option value="OPEN">Chỉ cơ hội Đang Mở</option>
            <option value="CLOSED_WON">Đóng Thắng (Won)</option>
            <option value="CLOSED_LOST">Đóng Thua (Lost)</option>
            <option value="NEGOTIATION">Đang Đàm Phán</option>
            <option value="PROPOSAL">Gửi Báo Giá</option>
          </select>

          {/* Filter Owner */}
          <select 
            className="filter-select"
            value={ownerFilter}
            onChange={(e) => onOwnerFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả người phụ trách</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã & Tiêu Đề Cơ Hội</th>
              <th>Khách Hàng / Ngành</th>
              <th>Người Sở Hữu</th>
              <th>Giá Trị Dự Kiến</th>
              <th>Giá Trị Chốt Thực Tế</th>
              <th>Giai Đoạn (Stage)</th>
              <th>Khóa Sửa Đổi</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy cơ hội nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              opportunities.map((opp) => {
                const isClosed = opp.stage === 'CLOSED_WON' || opp.stage === 'CLOSED_LOST';
                const isWon = opp.stage === 'CLOSED_WON';
                const isLost = opp.stage === 'CLOSED_LOST';
                const stageObj = OPPORTUNITY_STAGES[opp.stage] || { label: opp.stage, badgeClass: 'badge-proposal' };
                const isOwner = opp.ownerId === currentUser.id;

                return (
                  <tr key={opp.id}>
                    {/* Title */}
                    <td>
                      <div className="opp-title-cell">
                        <span className="opp-title-text">
                          <span className="font-mono" style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>
                            {opp.id}
                          </span>
                          <span>{opp.title}</span>
                        </span>
                        <span className="opp-customer-name">
                          Dự kiến đóng: {formatDate(opp.expectedCloseDate)} &bull; Xác suất: {opp.probability}%
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          {opp.customerName}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {opp.industry} &bull; {opp.customerCode}
                        </span>
                      </div>
                    </td>

                    {/* Owner */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <User size={14} className="text-muted" />
                        <span style={{ fontWeight: isOwner ? '700' : '500', color: isOwner ? 'var(--accent-primary)' : 'inherit' }}>
                          {opp.ownerName}
                        </span>
                        {isOwner && (
                          <span style={{ fontSize: '0.68rem', background: 'var(--info-bg)', color: '#60a5fa', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                            Bạn
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Expected Value */}
                    <td>
                      <span className="font-mono" style={{ fontWeight: '600' }}>
                        {formatCurrency(opp.expectedValue)}
                      </span>
                    </td>

                    {/* Actual Value */}
                    <td>
                      {isWon && opp.closedData?.actualValue ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="font-mono text-emerald-400" style={{ fontWeight: '700' }}>
                            {formatCurrency(opp.closedData.actualValue)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Ký ngày: {formatDate(opp.closedData.signedDate)}
                          </span>
                        </div>
                      ) : isLost ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          0 ₫ (Thua thầu)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* Stage Badge */}
                    <td>
                      <span className={`badge ${stageObj.badgeClass}`}>
                        {isWon && <Trophy size={12} />}
                        {isLost && <TrendingDown size={12} />}
                        {stageObj.label}
                      </span>
                    </td>

                    {/* Lock Status (AC3) */}
                    <td>
                      {opp.isLocked ? (
                        <span 
                          className="badge badge-locked" 
                          title="Cơ hội đã đóng và bị khóa. Không thể sửa đổi thông tin theo quy định."
                        >
                          <Lock size={12} />
                          Đã Khóa
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={12} /> Cho phép sửa
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-buttons">
                        {!isClosed ? (
                          <>
                            {/* AC1: Đóng Thắng */}
                            <button
                              className="btn btn-won"
                              onClick={() => onOpenCloseWonModal(opp)}
                              title="Đóng Thắng: Bắt buộc nhập giá trị chốt thực tế và ngày ký (AC1)"
                            >
                              <Trophy size={14} />
                              Đóng Thắng
                            </button>

                            {/* AC2: Đóng Thua */}
                            <button
                              className="btn btn-lost"
                              onClick={() => onOpenCloseLostModal(opp)}
                              title="Đóng Thua: Bắt buộc chọn lý do thua và đối thủ nếu có (AC2)"
                            >
                              <XCircle size={14} />
                              Đóng Thua
                            </button>
                          </>
                        ) : (
                          <>
                            {/* AC3: Mở lại cơ hội - chỉ Trưởng nhóm trở lên */}
                            <button
                              className="btn btn-reopen"
                              disabled={!canReopen}
                              onClick={() => onOpenReopenModal(opp)}
                              title={
                                canReopen
                                  ? 'Mở lại cơ hội: Bắt buộc nhập lý do mở lại (AC3)'
                                  : 'Bạn đang đăng nhập vai trò Nhân viên kinh doanh. Chỉ Trưởng nhóm trở lên mới có quyền mở lại cơ hội đã đóng (AC3).'
                              }
                            >
                              <RotateCcw size={14} />
                              Mở Lại
                            </button>
                          </>
                        )}

                        {/* View Detail & Audit Log */}
                        <button
                          className="btn btn-ghost"
                          onClick={() => onViewDetail(opp)}
                          title="Xem chi tiết hồ sơ cơ hội & Nhật ký kiểm toán"
                        >
                          <Eye size={14} />
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
