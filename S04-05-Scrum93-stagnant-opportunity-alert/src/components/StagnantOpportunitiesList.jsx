import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Calendar, 
  User, 
  PhoneCall, 
  Mail, 
  CalendarPlus, 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Flame, 
  ThermometerSnowflake, 
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { formatVND, formatCompactVND, formatDateVN } from '../utils/formatters.js';

export const StagnantOpportunitiesList = ({
  opportunities,
  stageThresholds,
  activeTab,
  onTabChange,
  flagFilter,
  onFlagFilterChange,
  stageFilter,
  onStageFilterChange,
  repFilter,
  onRepFilterChange,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  onOpenInterventionModal,
  onOpenLogActivityModal,
  onOpenExtendCloseModal,
  onOpenDetailModal,
  onOpenThresholdModal,
  currentPersona
}) => {
  // Lọc cơ hội theo Tab & Filters
  let filteredOpportunities = opportunities.filter((opp) => {
    // Tab 1: Chỉ cơ hội có cờ (Chế độ Trưởng nhóm)
    if (activeTab === 'FLAGGED_ONLY' && !opp.hasFlag) {
      return false;
    }
    // Tab 3: Chỉ cơ hội đã can thiệp
    if (activeTab === 'INTERVENED_ONLY' && !opp.hasIntervention) {
      return false;
    }

    // Filter theo Loại cờ
    if (flagFilter === 'DUAL' && opp.flagType !== 'DUAL') return false;
    if (flagFilter === 'INACTIVITY' && !opp.isInactivityBreached) return false;
    if (flagFilter === 'OVERDUE_CLOSE' && !opp.isCloseDateOverdue) return false;
    if (flagFilter === 'UNINTERVENED' && (opp.hasIntervention || !opp.hasFlag)) return false;

    // Filter theo Giai đoạn
    if (stageFilter !== 'ALL' && opp.stage !== stageFilter) return false;

    // Filter theo Nhân viên
    if (repFilter !== 'ALL' && opp.salesRepId !== repFilter) return false;

    // Filter theo Tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCustomer = opp.customerName.toLowerCase().includes(q);
      const matchId = opp.id.toLowerCase().includes(q);
      const matchRep = opp.salesRepName.toLowerCase().includes(q);
      if (!matchTitle && !matchCustomer && !matchId && !matchRep) return false;
    }

    return true;
  });

  // Sắp xếp
  filteredOpportunities.sort((a, b) => {
    if (sortBy === 'SEVERITY') {
      const rank = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, SAFE: 0 };
      const rankA = rank[a.severity] || 0;
      const rankB = rank[b.severity] || 0;
      if (rankB !== rankA) return rankB - rankA;
      return (b.value || 0) - (a.value || 0);
    }
    if (sortBy === 'VALUE_DESC') return (b.value || 0) - (a.value || 0);
    if (sortBy === 'INACTIVE_DESC') return (b.daysSinceLastActivity || 0) - (a.daysSinceLastActivity || 0);
    if (sortBy === 'OVERDUE_DESC') return (b.daysOverdue || 0) - (a.daysOverdue || 0);
    return 0;
  });

  const flaggedCount = opportunities.filter(o => o.hasFlag).length;
  const intervenedCount = opportunities.filter(o => o.hasFlag && o.hasIntervention).length;

  return (
    <div className="table-card">
      {/* 1. Thanh điều hướng các chế độ xem của Trưởng nhóm (AC3) */}
      <div className="manager-view-bar">
        <div className="view-tabs">
          <button 
            className={`view-tab ${activeTab === 'FLAGGED_ONLY' ? 'active badge-pulse' : ''}`}
            onClick={() => onTabChange('FLAGGED_ONLY')}
            title="Chế độ xem dành riêng cho Trưởng nhóm: Chỉ hiển thị các thương vụ có cờ đình trệ"
          >
            <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
            <span>🚨 Cơ Hội Có Cờ Đình Trệ (Dành Riêng Cho Trưởng Nhóm)</span>
            <span className="tab-badge tab-badge-amber">{flaggedCount}</span>
          </button>

          <button 
            className={`view-tab ${activeTab === 'ALL_PIPELINE' ? 'active' : ''}`}
            onClick={() => onTabChange('ALL_PIPELINE')}
            title="Xem toàn bộ các cơ hội trong phễu bán hàng (cả bình thường và có cờ)"
          >
            <span>🌐 Toàn Bộ Pipeline</span>
            <span className="tab-badge tab-badge-gray">{opportunities.length}</span>
          </button>

          <button 
            className={`view-tab ${activeTab === 'INTERVENED_ONLY' ? 'active' : ''}`}
            onClick={() => onTabChange('INTERVENED_ONLY')}
            title="Danh sách các thương vụ đã được Trưởng nhóm can thiệp chỉ đạo"
          >
            <ShieldCheck size={15} style={{ color: '#10b981' }} />
            <span>🛡️ Đã Can Thiệp &amp; Chỉ Đạo</span>
            <span className="tab-badge" style={{ background: '#10b981', color: '#fff' }}>{intervenedCount}</span>
          </button>
        </div>

        {activeTab === 'FLAGGED_ONLY' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span className="badge badge-flag-dual" style={{ fontSize: '0.7rem' }}>
              ⚡ Chế độ Trưởng nhóm kích hoạt
            </span>
            <span>Hiển thị ưu tiên cơ hội có rủi ro nguội lạnh</span>
          </div>
        )}
      </div>

      {/* 2. Thanh lọc & Tìm kiếm chuyên sâu */}
      <div className="filter-toolbar">
        <div className="search-input-box">
          <Search size={15} />
          <input 
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên cơ hội, khách hàng, nhân viên..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        {/* Lọc loại cờ */}
        <select 
          className="filter-select"
          value={flagFilter}
          onChange={(e) => onFlagFilterChange(e.target.value)}
          title="Lọc theo loại cờ cảnh báo"
        >
          <option value="ALL">Tất cả loại cờ</option>
          <option value="DUAL">🚨 Cờ Kép (Quá hạn chốt &amp; Đình trệ &gt; N ngày)</option>
          <option value="INACTIVITY">⏱️ Cờ Không hoạt động &gt; N ngày (AC1)</option>
          <option value="OVERDUE_CLOSE">📅 Cờ Quá ngày chốt chưa đóng (AC2)</option>
          <option value="UNINTERVENED">⚠️ Chưa có can thiệp của Trưởng nhóm</option>
        </select>

        {/* Lọc Giai đoạn */}
        <select 
          className="filter-select"
          value={stageFilter}
          onChange={(e) => onStageFilterChange(e.target.value)}
          title="Lọc theo giai đoạn bán hàng"
        >
          <option value="ALL">Tất cả giai đoạn</option>
          <option value="QUALIFICATION">Khảo sát &amp; Đánh giá</option>
          <option value="SOLUTION_DEMO">Giải pháp &amp; Demo POC</option>
          <option value="PROPOSAL">Gửi Báo Giá &amp; Đề Xuất</option>
          <option value="NEGOTIATION">Thương Thảo Hợp Đồng</option>
        </select>

        {/* Lọc Nhân viên */}
        <select 
          className="filter-select"
          value={repFilter}
          onChange={(e) => onRepFilterChange(e.target.value)}
          title="Lọc theo nhân viên kinh doanh phụ trách"
        >
          <option value="ALL">Tất cả nhân viên phụ trách</option>
          <option value="USR-REP-01">Nguyễn Văn An (Enterprise)</option>
          <option value="USR-REP-02">Trần Thị Mai (Enterprise)</option>
          <option value="USR-REP-03">Lê Quốc Hưng (Miền Bắc)</option>
          <option value="USR-REP-04">Hoàng Kim Chi (Bán lẻ F&amp;B)</option>
        </select>

        {/* Sắp xếp */}
        <select 
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          title="Sắp xếp danh sách"
        >
          <option value="SEVERITY">Sắp xếp: Mức độ nghiêm trọng nhất</option>
          <option value="VALUE_DESC">Sắp xếp: Giá trị hợp đồng (Cao → Thấp)</option>
          <option value="INACTIVE_DESC">Sắp xếp: Số ngày im ắng nhiều nhất</option>
          <option value="OVERDUE_DESC">Sắp xếp: Quá hạn ngày chốt lâu nhất</option>
        </select>
      </div>

      {/* 3. Bảng cơ hội chi tiết */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cơ Hội &amp; Khách Hàng</th>
              <th>Giá Trị</th>
              <th>Giai Đoạn</th>
              <th>Phụ Trách</th>
              <th>
                Hoạt Động Cuối
                <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--text-muted)' }}>
                  (So với ngưỡng N ngày)
                </span>
              </th>
              <th>
                Dự Kiến Chốt
                <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--text-muted)' }}>
                  (So với hôm nay)
                </span>
              </th>
              <th>Cờ Cảnh Báo &amp; Rủi Ro</th>
              <th>Trưởng Nhóm Can Thiệp</th>
              <th style={{ textAlign: 'right' }}>Hành Động Sớm</th>
            </tr>
          </thead>
          <tbody>
            {filteredOpportunities.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 0.5rem auto', display: 'block' }} />
                  <strong>Không có cơ hội nào phù hợp với bộ lọc hiện tại.</strong>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Tất cả các cơ hội đều đang được tương tác đều đặn hoặc đã được giải quyết!
                  </p>
                </td>
              </tr>
            ) : (
              filteredOpportunities.map((opp) => {
                const stageInfo = stageThresholds[opp.stage] || {};
                const thresholdN = stageInfo.thresholdDays || 7;

                return (
                  <tr 
                    key={opp.id} 
                    className={opp.severity === 'CRITICAL' ? 'row-critical' : ''}
                  >
                    {/* Tên cơ hội & Khách hàng */}
                    <td>
                      <div className="deal-title">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {opp.id}
                        </span>
                        <span 
                          style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
                          onClick={() => onOpenDetailModal(opp)}
                          title="Bấm xem chi tiết hồ sơ thương vụ"
                        >
                          {opp.title}
                        </span>
                      </div>
                      <div className="deal-customer">
                        🏢 {opp.customerName} • <span style={{ color: 'var(--text-muted)' }}>{opp.industry}</span>
                      </div>
                    </td>

                    {/* Giá trị thương vụ */}
                    <td>
                      <div className="deal-value">
                        {formatVND(opp.value)}
                      </div>
                    </td>

                    {/* Giai đoạn */}
                    <td>
                      <span className={`badge ${stageInfo.badgeClass || 'badge-qualification'}`}>
                        {stageInfo.shortLabel || opp.stage}
                      </span>
                    </td>

                    {/* Nhân viên phụ trách */}
                    <td>
                      <div className="deal-rep">
                        <img 
                          src={opp.salesRepAvatar} 
                          alt={opp.salesRepName} 
                          className="rep-avatar"
                        />
                        <div>
                          <div className="rep-name">{opp.salesRepName}</div>
                          <div className="rep-team">
                            {opp.teamId === 'TEAM_ENTERPRISE' ? 'Enterprise' : opp.teamId === 'TEAM_NORTH' ? 'Miền Bắc' : 'Bán lẻ'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Hoạt động cuối cùng vs Ngưỡng N ngày (AC1) */}
                    <td>
                      <div className="activity-metric">
                        <span style={{ fontSize: '0.78rem' }}>
                          📅 {formatDateVN(opp.lastActivityDate)}
                        </span>
                        {opp.isClosed ? (
                          <span className="metric-highlight-good">Đã đóng</span>
                        ) : opp.isInactivityBreached ? (
                          <span className="metric-highlight-bad">
                            ⏱️ {opp.daysSinceLastActivity} ngày im ắng (Max {thresholdN} ngày)
                          </span>
                        ) : (
                          <span className="metric-highlight-good">
                            ✓ {opp.daysSinceLastActivity} ngày (Trong hạn {thresholdN} ngày)
                          </span>
                        )}
                        <span className="metric-threshold-tag">
                          {opp.lastActivityType}
                        </span>
                      </div>
                    </td>

                    {/* Ngày dự kiến chốt (AC2) */}
                    <td>
                      <div className="activity-metric">
                        <span style={{ fontSize: '0.78rem' }}>
                          🎯 {formatDateVN(opp.expectedCloseDate)}
                        </span>
                        {opp.isClosed ? (
                          <span style={{ color: 'var(--text-muted)' }}>---</span>
                        ) : opp.isCloseDateOverdue ? (
                          <span className="metric-highlight-bad" style={{ color: '#ec4899' }}>
                            ⚠️ Trễ {opp.daysOverdue} ngày chưa đóng
                          </span>
                        ) : (
                          <span className="metric-highlight-good">
                            ✓ Còn {Math.abs(opp.daysOverdue)} ngày
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Cờ cảnh báo & Nhiệt độ */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                        {opp.flagType === 'DUAL' && (
                          <span className="badge badge-flag-dual" title={opp.flagReasons.join('\n')}>
                            🚨 CỜ KÉP: Quá Hạn &amp; Đình Trệ
                          </span>
                        )}
                        {opp.flagType === 'INACTIVITY' && (
                          <span className="badge badge-flag-inactivity" title={opp.flagReasons.join('\n')}>
                            ⏱️ Cờ: &gt; {thresholdN} Ngày Không Hoạt Động
                          </span>
                        )}
                        {opp.flagType === 'OVERDUE_CLOSE' && (
                          <span className="badge badge-flag-overdue" title={opp.flagReasons.join('\n')}>
                            📅 Cờ: Quá Hạn Chốt Chưa Đóng
                          </span>
                        )}
                        {opp.flagType === 'NONE' && (
                          <span className="badge badge-safe">
                            ✓ Bình thường
                          </span>
                        )}

                        {/* Nhiệt độ deal */}
                        {opp.temperature === 'frozen' && (
                          <span className="temp-tag temp-frozen" title="Thương vụ đã lạnh cóng, nguy cơ hủy deal rất cao">
                            <ThermometerSnowflake size={12} /> Đã lạnh cóng
                          </span>
                        )}
                        {opp.temperature === 'cooling' && (
                          <span className="temp-tag temp-cooling" title="Thương vụ đang nguội dần, cần hâm nóng sớm">
                            <Clock size={12} /> Đang nguội dần
                          </span>
                        )}
                        {opp.temperature === 'warm' && (
                          <span className="temp-tag temp-warm" title="Thương vụ tươi mới, tương tác tốt">
                            <Flame size={12} /> Đang ấm áp
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Trạng thái can thiệp của Trưởng nhóm */}
                    <td>
                      {opp.hasIntervention ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            <ShieldCheck size={12} /> Đã có chỉ đạo ({opp.interventionCount})
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {opp.lastIntervention?.type === 'PING_REP' ? '💬 Đã nhắc Rep' : '🤝 Đã họp cứu deal'}
                          </span>
                        </div>
                      ) : opp.hasFlag ? (
                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                          <XCircle size={12} /> Chưa can thiệp
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>---</span>
                      )}
                    </td>

                    {/* Các hành động sớm */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                        {/* Nút Can thiệp sớm */}
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => onOpenInterventionModal(opp)}
                          title="Trưởng nhóm can thiệp sớm: Nhắc nhở Rep, lên lịch họp cứu deal, chỉ đạo"
                        >
                          <ShieldCheck size={13} />
                          <span>Can Thiệp</span>
                        </button>

                        {/* Nút Ghi nhận hoạt động */}
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenLogActivityModal(opp)}
                          title="Ghi nhận hoạt động mới (Cuộc gọi, Họp, Email) để gỡ cờ đình trệ"
                        >
                          <PhoneCall size={13} />
                          <span>Ghi HĐ</span>
                        </button>

                        {/* Nút Gia hạn ngày chốt */}
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenExtendCloseModal(opp)}
                          title="Gia hạn ngày dự kiến chốt để gỡ cờ quá hạn"
                        >
                          <CalendarPlus size={13} />
                          <span>Gia Hạn</span>
                        </button>

                        {/* Nút Xem chi tiết */}
                        <button 
                          className="btn btn-icon btn-sm"
                          onClick={() => onOpenDetailModal(opp)}
                          title="Xem chi tiết dòng thời gian và lịch sử thương vụ"
                        >
                          <Eye size={13} />
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
