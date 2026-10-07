import React, { useState } from 'react';
import {
  Building2,
  ArrowLeft,
  Layers,
  PlusCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Link2Off,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Users,
  PieChart,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatShortVND,
  calculateGroupTotals,
  getDirectSubsidiaries,
  isParentCompany
} from '../utils/hierarchyUtils';
import { RELATION_TYPES } from '../data/mockData';

export function ParentCompanyDetailView({
  parentCustomer,
  allCustomers,
  allContracts,
  allDeals,
  onBack,
  onSelectCustomer,
  onOpenDeclareRelationModal,
  onOpenUnlinkModal,
  onOpenDetailModal
}) {
  const [activeTab, setActiveTab] = useState('TREE'); // 'TREE' | 'CONTRACTS' | 'SUBSIDIARIES' | 'BREAKDOWN'
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('ALL');

  // Tính toán hợp nhất toàn bộ dữ liệu tài chính của tập đoàn
  const groupTotals = calculateGroupTotals(
    parentCustomer.id,
    allCustomers,
    allContracts,
    allDeals
  );

  const directSubsidiaries = getDirectSubsidiaries(parentCustomer.id, allCustomers);

  // Danh sách hợp đồng của cả tập đoàn (Mẹ + các con)
  const groupEntityIds = groupTotals.groupEntities.map((e) => e.id);
  const consolidatedContracts = allContracts.filter((ct) =>
    groupEntityIds.includes(ct.customerId)
  );

  // Lọc hợp đồng theo đơn vị được chọn trong tab hợp đồng
  const filteredContracts =
    selectedEntityFilter === 'ALL'
      ? consolidatedContracts
      : consolidatedContracts.filter((ct) => ct.customerId === selectedEntityFilter);

  const filteredContractsTotal = filteredContracts.reduce(
    (sum, ct) => sum + (ct.value || 0),
    0
  );

  // Tỷ lệ % của riêng công ty mẹ và các công ty con
  const parentPercent =
    groupTotals.totalGroupValue > 0
      ? ((groupTotals.parentDirectValue / groupTotals.totalGroupValue) * 100).toFixed(1)
      : 0;

  const subsidiariesPercent =
    groupTotals.totalGroupValue > 0
      ? ((groupTotals.subsidiariesValue / groupTotals.totalGroupValue) * 100).toFixed(1)
      : 0;

  // Danh sách các tập đoàn khác để chuyển đổi nhanh
  const otherParentCompanies = allCustomers.filter(
    (c) => isParentCompany(c, allCustomers) && c.id !== parentCustomer.id
  );

  return (
    <div className="parent-detail-page">
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Quay lại danh sách khách hàng
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Corporate Group Switcher */}
          {otherParentCompanies.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Chuyển nhanh tập đoàn:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
                value={parentCustomer.id}
                onChange={(e) => {
                  const target = allCustomers.find((c) => c.id === e.target.value);
                  if (target) onSelectCustomer(target);
                }}
              >
                <option value={parentCustomer.id}>🏢 {parentCustomer.shortName} (Hiện tại)</option>
                {otherParentCompanies.map((p) => (
                  <option key={p.id} value={p.id}>
                    🏢 {p.shortName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Gắn thêm công ty con mới vào tập đoàn này */}
          <button
            className="btn btn-corporate"
            onClick={() => onOpenDeclareRelationModal({ defaultParentId: parentCustomer.id })}
          >
            <PlusCircle size={16} /> Gắn thêm công ty con vào tập đoàn
          </button>
        </div>
      </div>

      {/* =========================================================================
          HERO FINANCIAL CARD: HIỂN THỊ TỔNG GIÁ TRỊ HỢP ĐỒNG CẢ NHÓM CÔNG TY (TIÊU CHÍ 2)
          ========================================================================= */}
      <div className="group-hero-card">
        {/* Header thông tin công ty mẹ */}
        <div className="group-hero-header">
          <div className="group-title-group">
            <div
              className="group-avatar"
              style={{ background: parentCustomer.avatarBg || '#3b82f6' }}
            >
              {parentCustomer.logoInitials || 'CORP'}
            </div>
            <div className="group-meta">
              <div className="group-badge-row">
                <span className="badge badge-parent">
                  <Building2 size={13} /> TRỤ SỞ CÔNG TY MẸ (HOLDING)
                </span>
                <span className="badge badge-success">
                  {groupTotals.totalEntitiesCount} Pháp nhân thành viên
                </span>
                <span className="badge badge-warning">
                  {groupTotals.totalContractsCount} Hợp đồng toàn nhóm
                </span>
              </div>
              <h1 className="group-main-title">{parentCustomer.name}</h1>
              <div className="group-sub-info">
                <span>Mã: <strong>{parentCustomer.code}</strong></span>
                <span>MST: <strong>{parentCustomer.taxId}</strong></span>
                <span>Ngành nghề: <strong>{parentCustomer.industry}</strong></span>
                <span>Phụ trách: <strong>{parentCustomer.salesOwner}</strong></span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onOpenDetailModal(parentCustomer)}
          >
            <ExternalLink size={14} /> Hồ sơ pháp nhân mẹ
          </button>
        </div>

        {/* Khối tài chính hợp nhất nổi bật */}
        <div className="group-financial-highlight">
          {/* Cột 1: TỔNG GIÁ TRỊ HỢP ĐỒNG TOÀN TẬP ĐOÀN */}
          <div className="consolidated-block">
            <span className="consolidated-tag">
              <Sparkles size={14} /> Tổng giá trị hợp đồng cả nhóm công ty (Consolidated Value)
            </span>
            <div className="consolidated-amount">
              {formatCurrencyVND(groupTotals.totalGroupValue)}
            </div>
            <div className="consolidated-note">
              Hợp nhất từ <strong>Công ty Mẹ</strong> và <strong>{groupTotals.subsidiariesCount} Công ty con</strong> thành viên trực thuộc.
            </div>
          </div>

          {/* Cột 2: Doanh số riêng của mẹ vs Doanh số công ty con */}
          <div className="split-stats-col">
            <div>
              <div className="split-label">Doanh số riêng của Công ty Mẹ:</div>
              <div className="split-value" style={{ color: '#93c5fd' }}>
                {formatShortVND(groupTotals.parentDirectValue)}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                  ({parentPercent}%)
                </span>
              </div>
            </div>
            <div style={{ marginTop: '6px' }}>
              <div className="split-label">Đóng góp từ {groupTotals.subsidiariesCount} Công ty Con:</div>
              <div className="split-value" style={{ color: '#a78bfa' }}>
                {formatShortVND(groupTotals.subsidiariesValue)}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                  ({subsidiariesPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Cột 3: Chỉ số bổ trợ (Active Contracts & Pipeline) */}
          <div className="split-stats-col">
            <div>
              <div className="split-label">Tổng số Hợp đồng có hiệu lực:</div>
              <div className="split-value" style={{ color: '#34d399' }}>
                {groupTotals.totalContractsCount} Hợp đồng
              </div>
            </div>
            <div style={{ marginTop: '6px' }}>
              <div className="split-label">Cơ hội Pipeline đang đàm phán:</div>
              <div className="split-value" style={{ color: '#f59e0b' }}>
                {formatShortVND(groupTotals.totalPipelineValue)}
              </div>
            </div>
          </div>
        </div>

        {/* Thanh tỷ trọng phần trăm đồ họa */}
        <div className="ratio-bar-wrap">
          <div className="ratio-bar-header">
            <span>Cơ cấu đóng góp doanh thu tập đoàn:</span>
            <span>
              Công ty Mẹ: {parentPercent}% | Các Công ty Con: {subsidiariesPercent}%
            </span>
          </div>
          <div className="ratio-bar-track">
            {groupTotals.breakdown.map((item) => (
              <div
                key={item.id}
                className="ratio-bar-segment"
                style={{
                  width: `${item.percentOfGroup}%`,
                  background: item.color
                }}
                title={`${item.shortName}: ${formatShortVND(item.contractValue)} (${item.percentOfGroup}%)`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION CONTROLS
          ========================================================================= */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'TREE' ? 'active' : ''}`}
          onClick={() => setActiveTab('TREE')}
        >
          <Layers size={16} />
          Sơ Đồ Cây Tập Đoàn (Hierarchy Tree)
          <span className="tab-badge">{groupTotals.totalEntitiesCount}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'CONTRACTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('CONTRACTS')}
        >
          <FileText size={16} />
          Hợp Đồng Hợp Nhất Cả Tập Đoàn
          <span className="tab-badge">{groupTotals.totalContractsCount}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'SUBSIDIARIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('SUBSIDIARIES')}
        >
          <Building2 size={16} />
          Danh Sách Công Ty Con Trực Thuộc
          <span className="tab-badge">{directSubsidiaries.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'BREAKDOWN' ? 'active' : ''}`}
          onClick={() => setActiveTab('BREAKDOWN')}
        >
          <PieChart size={16} />
          Phân Tích Tỷ Trọng Doanh Thu
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SƠ ĐỒ CÂY TẬP ĐOÀN TRỰC QUAN (INTERACTIVE HIERARCHY TREE)
          ========================================================================= */}
      {activeTab === 'TREE' && (
        <div className="tree-visualizer-container">
          <div className="tree-header">
            <div>
              <h2 className="tree-title">
                <Layers size={20} color="#6366f1" /> Cấu Trúc Phân Cấp Tập Đoàn & Phân Bổ Giá Trị
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Sơ đồ liên kết pháp nhân từ Công ty Mẹ đến các Công ty Con thành viên. Nhấp vào từng pháp nhân để xem hợp đồng tương ứng.
              </p>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onOpenDeclareRelationModal({ defaultParentId: parentCustomer.id })}
            >
              <PlusCircle size={14} /> Gắn thêm công ty con mới
            </button>
          </div>

          <div className="tree-canvas">
            {/* 1. NODE CÔNG TY MẸ Ở ĐỈNH */}
            <div className="tree-node-parent">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  className="group-avatar"
                  style={{
                    background: parentCustomer.avatarBg || '#3b82f6',
                    width: '44px',
                    height: '44px',
                    fontSize: '0.95rem'
                  }}
                >
                  {parentCustomer.logoInitials || 'CORP'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-parent">🏢 CÔNG TY MẸ ĐIỀU HÀNH</span>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    {parentCustomer.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    MST: {parentCustomer.taxId} | Phụ trách: {parentCustomer.salesOwner}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Hợp đồng riêng của Mẹ:
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60a5fa' }}>
                  {formatCurrencyVND(groupTotals.parentDirectValue)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {groupTotals.parentContractsCount} hợp đồng đã ký
                </div>
              </div>
            </div>

            {/* 2. CÁC NHÁNH CÔNG TY CON */}
            {directSubsidiaries.length === 0 ? (
              <div
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  background: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-lg)',
                  width: '100%',
                  maxWidth: '580px'
                }}
              >
                <div style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Chưa có công ty con nào được gắn vào tập đoàn này.
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenDeclareRelationModal({ defaultParentId: parentCustomer.id })}
                >
                  <PlusCircle size={14} /> Gắn khách hàng làm công ty con ngay
                </button>
              </div>
            ) : (
              <div className="tree-children-row">
                {directSubsidiaries.map((child) => {
                  const childContracts = allContracts.filter((ct) => ct.customerId === child.id);
                  const childTotalVal = childContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);
                  const relationInfo = RELATION_TYPES.find((r) => r.id === child.relationType);

                  return (
                    <div key={child.id} className="tree-node-child">
                      <div className="child-node-header">
                        <div className="child-node-info">
                          <div
                            className="child-avatar"
                            style={{ background: child.avatarBg || '#6366f1' }}
                          >
                            {child.logoInitials || 'SUB'}
                          </div>
                          <div>
                            <div className="child-name">{child.shortName}</div>
                            <div className="child-meta">Mã: {child.code} | MST: {child.taxId}</div>
                          </div>
                        </div>

                        <span className="badge badge-child">
                          <Percent size={11} /> {child.ownershipPercent || 100}%
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Quan hệ: <strong>{relationInfo?.label || 'Công ty con'}</strong>
                      </div>

                      <div className="child-financial-bar">
                        <span className="child-fin-label">Giá trị hợp đồng:</span>
                        <span className="child-fin-val">{formatCurrencyVND(childTotalVal)}</span>
                      </div>

                      <div className="child-node-actions">
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          {childContracts.length} HĐ | Sales: {child.salesOwner}
                        </span>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            onClick={() => {
                              setSelectedEntityFilter(child.id);
                              setActiveTab('CONTRACTS');
                            }}
                            title="Xem các hợp đồng của công ty con này"
                          >
                            Xem HĐ
                          </button>

                          <button
                            className="btn btn-danger-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            onClick={() => onOpenUnlinkModal(child, parentCustomer)}
                            title="Tách công ty con này khỏi tập đoàn"
                          >
                            <Link2Off size={12} /> Tách
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: BẢNG HỢP ĐỒNG HỢP NHẤT TOÀN TẬP ĐOÀN (CONSOLIDATED CONTRACTS)
          ========================================================================= */}
      {activeTab === 'CONTRACTS' && (
        <div>
          {/* Bộ lọc hợp đồng theo từng công ty thành viên */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Lọc theo pháp nhân:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                value={selectedEntityFilter}
                onChange={(e) => setSelectedEntityFilter(e.target.value)}
              >
                <option value="ALL">🏢 Toàn bộ Tập đoàn ({consolidatedContracts.length} hợp đồng)</option>
                <option value={parentCustomer.id}>
                  ⭐ Trụ sở Mẹ: {parentCustomer.shortName} ({groupTotals.parentContractsCount} HĐ)
                </option>
                {directSubsidiaries.map((child) => {
                  const cCount = allContracts.filter((ct) => ct.customerId === child.id).length;
                  return (
                    <option key={child.id} value={child.id}>
                      🏬 {child.shortName} ({cCount} HĐ)
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Đang hiển thị: <strong>{filteredContracts.length}</strong> hợp đồng | Tổng giá trị lọc: 
              <strong style={{ color: '#60a5fa', marginLeft: '6px' }}>
                {formatCurrencyVND(filteredContractsTotal)}
              </strong>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Số HĐ / Mã Hợp Đồng</th>
                  <th>Tên Gói Thầu & Nội Dung</th>
                  <th>Pháp Nhân Đứng Tên Ký</th>
                  <th>Giá Trị Hợp Đồng</th>
                  <th>Thời Hạn Hiệu Lực</th>
                  <th>Trạng Thái</th>
                  <th>Người Phụ Trách</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      Không tìm thấy hợp đồng nào theo điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => {
                    const isParentContract = contract.customerId === parentCustomer.id;
                    const entity = groupTotals.groupEntities.find((e) => e.id === contract.customerId);

                    return (
                      <tr key={contract.id}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                            {contract.contractNumber}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            {contract.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                            {contract.scope}
                          </div>
                        </td>
                        <td>
                          {isParentContract ? (
                            <span className="badge badge-parent">
                              🏢 {parentCustomer.shortName} (Mẹ)
                            </span>
                          ) : (
                            <span className="badge badge-child">
                              🏬 {entity?.shortName || 'Công ty con'}
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 800,
                              fontSize: '0.96rem',
                              color: isParentContract ? '#60a5fa' : '#a78bfa'
                            }}
                          >
                            {formatCurrencyVND(contract.value)}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {contract.startDate} → {contract.endDate}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${contract.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                            {contract.status === 'ACTIVE' ? 'Đang hiệu lực' : 'Đã nghiệm thu'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {contract.salesRep}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DANH SÁCH & QUẢN LÝ CÔNG TY CON (SUBSIDIARIES MANAGEMENT)
          ========================================================================= */}
      {activeTab === 'SUBSIDIARIES' && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Danh Sách Các Pháp Nhân Trực Thuộc Tập Đoàn
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Quản lý tỷ lệ sở hữu vốn và giá trị hợp đồng đóng góp từ từng công ty con.
              </p>
            </div>

            <button
              className="btn btn-corporate"
              onClick={() => onOpenDeclareRelationModal({ defaultParentId: parentCustomer.id })}
            >
              <PlusCircle size={15} /> Gắn thêm công ty con mới
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Công Ty Con Thành Viên</th>
                  <th>Mã Số Thuế (MST)</th>
                  <th>Loại Quan Hệ</th>
                  <th>Tỷ Lệ Sở Hữu (%)</th>
                  <th>Số Lượng HĐ</th>
                  <th>Tổng Giá Trị Đóng Góp</th>
                  <th>Người Phụ Trách</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {directSubsidiaries.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      Tập đoàn này hiện chưa có công ty con nào.
                    </td>
                  </tr>
                ) : (
                  directSubsidiaries.map((child) => {
                    const childContracts = allContracts.filter((ct) => ct.customerId === child.id);
                    const childVal = childContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);
                    const relationInfo = RELATION_TYPES.find((r) => r.id === child.relationType);

                    return (
                      <tr key={child.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              className="child-avatar"
                              style={{ background: child.avatarBg || '#6366f1', width: '32px', height: '32px', fontSize: '0.75rem' }}
                            >
                              {child.logoInitials || 'SUB'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                {child.name}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                Mã: {child.code}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                            {child.taxId}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-child">
                            {relationInfo?.label || 'Công ty con'}
                          </span>
                        </td>
                        <td>
                          <span className="badge-percent">
                            {child.ownershipPercent || 100}%
                          </span>
                        </td>
                        <td>
                          <strong>{childContracts.length}</strong> HĐ
                        </td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#a78bfa' }}>
                            {formatCurrencyVND(childVal)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem' }}>{child.salesOwner}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onOpenDetailModal(child)}
                              title="Xem hồ sơ chi tiết"
                            >
                              Hồ sơ
                            </button>
                            <button
                              className="btn btn-danger-outline btn-sm"
                              onClick={() => onOpenUnlinkModal(child, parentCustomer)}
                              title="Tách công ty con này khỏi tập đoàn"
                            >
                              <Link2Off size={13} /> Tách
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
      )}

      {/* =========================================================================
          TAB 4: PHÂN TÍCH CƠ CẤU DOANH THU TẬP ĐOÀN (REVENUE BREAKDOWN)
          ========================================================================= */}
      {activeTab === 'BREAKDOWN' && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
            Bảng Phân Bổ Tỷ Trọng Đóng Góp Giá Trị Hợp Đồng Toàn Tập Đoàn
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Đo lường mức độ đóng góp hợp đồng của Công ty Mẹ và các Công ty Con trong tổng quy mô{' '}
            <strong style={{ color: '#60a5fa' }}>{formatCurrencyVND(groupTotals.totalGroupValue)}</strong>.
          </p>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Pháp Nhân</th>
                <th>Vai Trò Trong Nhóm</th>
                <th>Tỷ Lệ Sở Hữu</th>
                <th>Số Lượng HĐ</th>
                <th>Giá Trị Đóng Góp</th>
                <th>Tỷ Trọng (%)</th>
                <th>Thanh Trực Quan</th>
              </tr>
            </thead>
            <tbody>
              {groupTotals.breakdown.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Mã: {item.code} | Sales: {item.salesOwner}
                    </div>
                  </td>
                  <td>
                    {item.isParent ? (
                      <span className="badge badge-parent">🏢 Công Ty Mẹ</span>
                    ) : (
                      <span className="badge badge-child">🏬 Công Ty Con</span>
                    )}
                  </td>
                  <td>
                    <span className="badge-percent">
                      {item.isParent ? '100% (Chi phối)' : `${item.ownershipPercent || 100}%`}
                    </span>
                  </td>
                  <td>
                    <strong>{item.contractCount}</strong> HĐ
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {formatCurrencyVND(item.contractValue)}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#60a5fa' }}>{item.percentOfGroup}%</strong>
                  </td>
                  <td style={{ minWidth: '160px' }}>
                    <div
                      style={{
                        height: '10px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '99px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${item.percentOfGroup}%`,
                          background: item.color,
                          borderRadius: '99px'
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
