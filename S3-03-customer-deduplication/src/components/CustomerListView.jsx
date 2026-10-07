import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  GitMerge,
  Eye,
  AlertTriangle,
  Globe,
  Building,
  Phone,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export function CustomerListView({
  customers,
  duplicatePairs,
  onOpenMergeModal,
  onOpenDetailModal,
  onOpenNewCustomerModal,
  activeFilter,
  onFilterChange,
  currentUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('ALL');

  // Bản đồ tìm kiếm cặp trùng cho mỗi khách hàng
  const duplicateMap = {};
  duplicatePairs.forEach((pair) => {
    duplicateMap[pair.customerA.id] = {
      target: pair.customerB,
      report: pair.report
    };
    duplicateMap[pair.customerB.id] = {
      target: pair.customerA,
      report: pair.report
    };
  });

  // Lọc dữ liệu
  const filteredCustomers = customers.filter((cust) => {
    // Lọc theo search
    const query = searchTerm.toLowerCase().trim();
    const matchSearch =
      !query ||
      cust.name.toLowerCase().includes(query) ||
      (cust.taxCode && cust.taxCode.toLowerCase().includes(query)) ||
      (cust.website && cust.website.toLowerCase().includes(query)) ||
      cust.ownerName.toLowerCase().includes(query) ||
      cust.id.toLowerCase().includes(query);

    // Lọc theo trạng thái trùng
    let matchDup = true;
    if (activeFilter === 'DUPLICATES_ONLY') {
      matchDup = Boolean(duplicateMap[cust.id]);
    } else if (activeFilter === 'SAFE_ONLY') {
      matchDup = !duplicateMap[cust.id];
    }

    // Lọc theo người phụ trách
    let matchOwner = true;
    if (ownerFilter !== 'ALL') {
      matchOwner = cust.ownerName === ownerFilter;
    }

    return matchSearch && matchDup && matchOwner;
  });

  // Danh sách các nhân viên phụ trách để hiển thị trong dropdown
  const uniqueOwners = Array.from(new Set(customers.map((c) => c.ownerName)));

  const formatCurrency = (val) => {
    if (!val) return '0 đ';
    return (val / 1000000).toLocaleString('vi-VN') + ' tr đ';
  };

  return (
    <div className="card-section">
      {/* Header Bar: Tiêu đề & Công cụ tìm kiếm, lọc, thêm mới */}
      <div className="card-header-bar">
        <div className="card-title-group">
          <h2>
            <Building size={20} style={{ color: 'var(--primary)' }} />
            <span>Danh Sách Khách Hàng Doanh Nghiệp ({filteredCustomers.length})</span>
          </h2>
          <p>
            Quản lý hồ sơ đối tác B2B, theo dõi đầu mối nhân viên phụ trách và phát hiện tức thì các trường hợp xung đột trùng lặp.
          </p>
        </div>

        <div className="toolbar-controls">
          {/* Ô Tìm Kiếm Tức Thì */}
          <div className="search-input-box">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm theo Tên công ty, MST, Website, Sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Lọc Trạng Thái Trùng */}
          <select
            className="filter-select"
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả khách hàng</option>
            <option value="DUPLICATES_ONLY">⚠️ Chỉ khách có cảnh báo trùng</option>
            <option value="SAFE_ONLY">✅ Khách hàng an toàn (Không trùng)</option>
          </select>

          {/* Lọc Theo Người Phụ Trách */}
          <select
            className="filter-select"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          >
            <option value="ALL">Mọi người phụ trách</option>
            {uniqueOwners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>

          {/* Nút Thêm Mới Khách Hàng (Tích hợp Live Simulator) */}
          <button className="btn-pill btn-primary" onClick={onOpenNewCustomerModal}>
            <UserPlus size={16} />
            <span>+ Thêm khách hàng mới</span>
          </button>
        </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="table-responsive">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Mã & Tên Công Ty</th>
              <th>Mã Số Thuế (MST)</th>
              <th>Website Doanh Nghiệp</th>
              <th>Nhân Viên Phụ Trách</th>
              <th>Dữ Liệu Liên Kết (Contacts/Deals/Logs)</th>
              <th>Tình Trạng Trùng Lặp</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy khách hàng nào phù hợp với điều kiện tìm kiếm và lọc.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const dupInfo = duplicateMap[cust.id];
                const totalDealValue = cust.deals.reduce((sum, d) => sum + d.amount, 0);

                return (
                  <tr key={cust.id} className={dupInfo ? 'duplicate-row' : ''}>
                    {/* Tên công ty & Mã KH */}
                    <td>
                      <div className="customer-name-box">
                        <div className="customer-name-title">
                          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            [{cust.id}]
                          </span>
                          <span>{cust.name}</span>
                        </div>
                        <div className="customer-meta-sub">
                          <span>{cust.industry}</span>
                          <span>•</span>
                          <span>{cust.address.split(',').pop()?.trim() || cust.address}</span>
                        </div>
                      </div>
                    </td>

                    {/* Mã số thuế */}
                    <td>
                      <span className="mono" style={{ fontWeight: 600, color: '#93c5fd' }}>
                        {cust.taxCode || 'Chưa khai báo'}
                      </span>
                    </td>

                    {/* Website */}
                    <td>
                      {cust.website ? (
                        <a
                          href={`https://${cust.website.replace(/^https?:\/\//, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            textDecoration: 'none'
                          }}
                        >
                          <Globe size={13} />
                          <span>{cust.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                          <ExternalLink size={11} style={{ opacity: 0.6 }} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* Người phụ trách */}
                    <td>
                      <div className="owner-pill">
                        <div>
                          <div style={{ fontWeight: 600 }}>{cust.ownerName}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {cust.ownerTeam}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dữ liệu liên kết: Contacts, Deals, Activities */}
                    <td>
                      <div className="stats-counter">
                        <span className="stat-item" title={`${cust.contacts.length} người liên hệ`}>
                          <Users size={13} style={{ color: '#60a5fa' }} />
                          <strong>{cust.contacts.length}</strong> LH
                        </span>
                        <span>•</span>
                        <span className="stat-item" title={`${cust.deals.length} cơ hội (${formatCurrency(totalDealValue)})`}>
                          <Briefcase size={13} style={{ color: '#34d399' }} />
                          <strong>{cust.deals.length}</strong> Deal ({formatCurrency(totalDealValue)})
                        </span>
                        <span>•</span>
                        <span className="stat-item" title={`${cust.activities.length} hoạt động chăm sóc`}>
                          <Calendar size={13} style={{ color: '#f59e0b' }} />
                          <strong>{cust.activities.length}</strong> Log
                        </span>
                      </div>
                    </td>

                    {/* Tình trạng trùng lặp */}
                    <td>
                      {dupInfo ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className={`badge badge-${dupInfo.report.confidence.toLowerCase()}`}>
                            <AlertTriangle size={12} />
                            Trùng với [{dupInfo.target.id}] ({dupInfo.report.score}%)
                          </span>
                          <div style={{ fontSize: '0.725rem', color: '#fca5a5' }}>
                            Sales phụ trách: <strong>{dupInfo.target.ownerName}</strong>
                          </div>
                        </div>
                      ) : (
                        <span className="badge badge-success">
                          <CheckCircle size={12} />
                          Hồ sơ an toàn
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {dupInfo && (
                          <button
                            className="btn-pill btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                            onClick={() => onOpenMergeModal(cust, dupInfo.target, dupInfo.report)}
                            title="Mở giao diện so sánh cạnh nhau và tiến hành gộp"
                          >
                            <GitMerge size={14} />
                            <span>So sánh & Gộp</span>
                          </button>
                        )}

                        <button
                          className="btn-pill"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                          onClick={() => onOpenDetailModal(cust)}
                          title="Xem chi tiết danh bạ, cơ hội & nhật ký"
                        >
                          <Eye size={14} />
                          <span>Chi tiết</span>
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
