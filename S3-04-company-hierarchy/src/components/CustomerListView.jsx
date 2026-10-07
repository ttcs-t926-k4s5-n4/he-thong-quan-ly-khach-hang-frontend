import React, { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  Layers,
  PlusCircle,
  ExternalLink,
  Link,
  ChevronRight,
  Filter,
  CheckCircle2,
  Compass
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatShortVND,
  calculateGroupTotals,
  getIndividualContractValue,
  getDirectSubsidiaries,
  isParentCompany,
  isSubsidiary,
  isIndependent,
  getRootParent
} from '../utils/hierarchyUtils';

export function CustomerListView({
  customers,
  contracts,
  activeFilter,
  onFilterChange,
  onSelectParentGroup,
  onOpenDeclareRelationModal,
  onOpenDetailModal
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc dữ liệu khách hàng theo tìm kiếm và tab bộ lọc
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // 1. Lọc theo Tab cấu trúc
      if (activeFilter === 'PARENTS_ONLY' && !isParentCompany(customer, customers)) {
        return false;
      }
      if (activeFilter === 'SUBSIDIARIES_ONLY' && !isSubsidiary(customer)) {
        return false;
      }
      if (activeFilter === 'INDEPENDENT_ONLY' && !isIndependent(customer, customers)) {
        return false;
      }

      // 2. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = customer.name.toLowerCase().includes(q);
        const matchShort = customer.shortName.toLowerCase().includes(q);
        const matchCode = customer.code.toLowerCase().includes(q);
        const matchTax = customer.taxId.toLowerCase().includes(q);
        const matchSales = customer.salesOwner.toLowerCase().includes(q);
        const matchIndustry = customer.industry.toLowerCase().includes(q);
        return matchName || matchShort || matchCode || matchTax || matchSales || matchIndustry;
      }

      return true;
    });
  }, [customers, activeFilter, searchQuery]);

  // Đếm số lượng cho từng tab
  const counts = useMemo(() => {
    return {
      all: customers.length,
      parents: customers.filter((c) => isParentCompany(c, customers)).length,
      subsidiaries: customers.filter((c) => isSubsidiary(c)).length,
      independent: customers.filter((c) => isIndependent(c, customers)).length
    };
  }, [customers]);

  return (
    <div className="customer-list-section">
      {/* Search & Tool Bar */}
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
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '320px', maxWidth: '520px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Tìm theo tên công ty, MST, mã khách hàng, người phụ trách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Nút Khai báo Quan hệ Mẹ - Con mới */}
        <button
          className="btn btn-corporate"
          onClick={() => onOpenDeclareRelationModal({})}
          title="Khai báo liên kết quan hệ công ty mẹ - công ty con"
        >
          <PlusCircle size={16} /> Khai báo Quan hệ Mẹ - Con
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs-container" style={{ marginBottom: '18px' }}>
        <button
          className={`tab-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => onFilterChange('ALL')}
        >
          Tất Cả Khách Hàng
          <span className="tab-badge">{counts.all}</span>
        </button>

        <button
          className={`tab-btn ${activeFilter === 'PARENTS_ONLY' ? 'active' : ''}`}
          onClick={() => onFilterChange('PARENTS_ONLY')}
        >
          <Building2 size={15} /> Chỉ Công Ty Mẹ (Tập Đoàn)
          <span className="tab-badge">{counts.parents}</span>
        </button>

        <button
          className={`tab-btn ${activeFilter === 'SUBSIDIARIES_ONLY' ? 'active' : ''}`}
          onClick={() => onFilterChange('SUBSIDIARIES_ONLY')}
        >
          <Layers size={15} /> Chỉ Công Ty Con
          <span className="tab-badge">{counts.subsidiaries}</span>
        </button>

        <button
          className={`tab-btn ${activeFilter === 'INDEPENDENT_ONLY' ? 'active' : ''}`}
          onClick={() => onFilterChange('INDEPENDENT_ONLY')}
        >
          <Compass size={15} /> Khách Hàng Độc Lập
          <span className="tab-badge">{counts.independent}</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Doanh Nghiệp / Pháp Nhân</th>
              <th>Mã Số Thuế</th>
              <th>Cấu Trúc Tập Đoàn</th>
              <th>Hợp Đồng Riêng Lẻ</th>
              <th>Tổng Giá Trị Tập Đoàn (Consolidated)</th>
              <th>Phụ Trách Bán Hàng</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '42px', color: 'var(--text-muted)' }}>
                  Không tìm thấy khách hàng nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const isParent = isParentCompany(customer, customers);
                const isChild = isSubsidiary(customer);
                const individualVal = getIndividualContractValue(customer.id, contracts);

                // Nếu là công ty mẹ -> tính tổng cả tập đoàn
                let groupTotals = null;
                let rootParent = null;

                if (isParent) {
                  groupTotals = calculateGroupTotals(customer.id, customers, contracts);
                } else if (isChild) {
                  rootParent = getRootParent(customer.id, customers);
                  if (rootParent) {
                    groupTotals = calculateGroupTotals(rootParent.id, customers, contracts);
                  }
                }

                const directChildren = getDirectSubsidiaries(customer.id, customers);

                return (
                  <tr key={customer.id}>
                    {/* Cột 1: Tên & Thông tin pháp nhân */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          className="child-avatar"
                          style={{
                            background: customer.avatarBg || '#3b82f6',
                            width: '40px',
                            height: '40px',
                            fontSize: '0.85rem'
                          }}
                        >
                          {customer.logoInitials || 'DN'}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              fontSize: '0.94rem',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              if (isParent) onSelectParentGroup(customer);
                              else onOpenDetailModal(customer);
                            }}
                          >
                            {customer.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                            Mã: <strong style={{ color: 'var(--text-primary)' }}>{customer.code}</strong> | {customer.industry}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Mã số thuế */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                        {customer.taxId}
                      </span>
                    </td>

                    {/* Cột 3: Vai trò tập đoàn */}
                    <td>
                      {isParent ? (
                        <span
                          className="badge badge-parent"
                          style={{ cursor: 'pointer' }}
                          onClick={() => onSelectParentGroup(customer)}
                          title="Nhấp để xem trang tập đoàn"
                        >
                          <Building2 size={12} /> CÔNG TY MẸ ({directChildren.length} con)
                        </span>
                      ) : isChild ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span className="badge badge-child">
                            <Layers size={12} /> Con ({customer.ownershipPercent || 100}%)
                          </span>
                          {rootParent && (
                            <span
                              style={{
                                fontSize: '0.72rem',
                                color: '#a5b4fc',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                              onClick={() => onSelectParentGroup(rootParent)}
                            >
                              Thuộc: {rootParent.shortName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-independent">
                          <Compass size={12} /> Độc Lập
                        </span>
                      )}
                    </td>

                    {/* Cột 4: Hợp đồng riêng lẻ */}
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {formatCurrencyVND(individualVal)}
                      </span>
                    </td>

                    {/* Cột 5: TỔNG GIÁ TRỊ TẬP ĐOÀN (TIÊU CHÍ 2 JIRA) */}
                    <td>
                      {isParent && groupTotals ? (
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '1.05rem',
                              fontWeight: 900,
                              color: '#60a5fa',
                              cursor: 'pointer'
                            }}
                            onClick={() => onSelectParentGroup(customer)}
                            title="Xem trang chi tiết công ty mẹ"
                          >
                            {formatCurrencyVND(groupTotals.totalGroupValue)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            Hợp nhất từ {groupTotals.totalEntitiesCount} pháp nhân
                          </div>
                        </div>
                      ) : isChild && groupTotals && rootParent ? (
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.85rem',
                              color: '#a78bfa',
                              cursor: 'pointer'
                            }}
                            onClick={() => onSelectParentGroup(rootParent)}
                          >
                            {formatShortVND(groupTotals.totalGroupValue)} (Toàn nhóm)
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Đóng góp: {formatShortVND(individualVal)}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {formatCurrencyVND(individualVal)} (Chưa lập nhóm)
                        </span>
                      )}
                    </td>

                    {/* Cột 6: Phụ trách */}
                    <td>
                      <span style={{ fontSize: '0.84rem' }}>{customer.salesOwner}</span>
                    </td>

                    {/* Cột 7: Thao tác */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {/* Nút Xem Tập Đoàn nếu là Mẹ hoặc Con */}
                        {isParent ? (
                          <button
                            className="btn btn-corporate btn-sm"
                            onClick={() => onSelectParentGroup(customer)}
                            title="Xem trang tập đoàn công ty mẹ"
                          >
                            <Building2 size={13} /> Xem Tập Đoàn
                          </button>
                        ) : isChild && rootParent ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onSelectParentGroup(rootParent)}
                            title="Xem trang tập đoàn công ty mẹ"
                          >
                            Xem Tập Đoàn Mẹ
                          </button>
                        ) : null}

                        {/* Nút Gắn Mẹ - Con */}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenDeclareRelationModal({ defaultChildId: customer.id })}
                          title="Gắn khách hàng này làm công ty con hoặc công ty mẹ"
                        >
                          <Link size={13} /> Gắn Mẹ/Con
                        </button>

                        {/* Chi tiết pháp nhân */}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenDetailModal(customer)}
                          title="Xem thông tin chi tiết khách hàng"
                        >
                          Chi tiết
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
