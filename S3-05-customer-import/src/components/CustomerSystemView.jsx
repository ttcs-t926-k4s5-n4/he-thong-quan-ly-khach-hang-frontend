import React, { useState } from 'react';
import {
  Building2,
  Search,
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  UserCheck
} from 'lucide-react';

export default function CustomerSystemView({
  customers,
  onBackToImport
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');

  // Lấy danh sách ngành nghề duy nhất
  const industries = ['ALL', ...new Set(customers.map(c => c.industry).filter(Boolean))];

  // Lọc khách hàng
  const filtered = customers.filter(c => {
    if (selectedIndustry !== 'ALL' && c.industry !== selectedIndustry) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = c.name && c.name.toLowerCase().includes(q);
      const matchTax = c.taxCode && c.taxCode.toLowerCase().includes(q);
      const matchEmail = c.email && c.email.toLowerCase().includes(q);
      const matchSales = c.assignedSales && c.assignedSales.toLowerCase().includes(q);
      return matchName || matchTax || matchEmail || matchSales;
    }
    return true;
  });

  // Đếm số lượng mới nhập
  const newlyImportedCount = customers.filter(c => c.isNewlyImported).length;
  const updatedCount = customers.filter(c => c.isRecentlyUpdated).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBackToImport}>
            <ArrowLeft size={15} /> Quay Lại Nhập Excel
          </button>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Danh Mục Khách Hàng Hệ Thống CRM ({customers.length})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {newlyImportedCount > 0 && (
                <span style={{ color: 'var(--primary)', marginRight: '1rem', fontWeight: 600 }}>
                  • Có {newlyImportedCount} khách hàng mới nhập từ tệp Excel
                </span>
              )}
              {updatedCount > 0 && (
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                  • Có {updatedCount} khách hàng vừa được cập nhật
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onBackToImport}>
          <FileSpreadsheet size={15} /> + Nhập Thêm Từ Excel
        </button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div className="search-input-box" style={{ minWidth: '320px' }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Tìm theo tên công ty, mã số thuế, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Ngành nghề:</span>
          <select
            className="role-select"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)'
            }}
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>
                {ind === 'ALL' ? 'Tất cả ngành nghề' : ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng Khách Hàng */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Mã KH</th>
              <th style={{ minWidth: '240px' }}>Tên Doanh Nghiệp</th>
              <th style={{ minWidth: '120px' }}>Mã Số Thuế</th>
              <th style={{ minWidth: '180px' }}>Liên Hệ (Email / SĐT)</th>
              <th style={{ minWidth: '160px' }}>Địa Chỉ</th>
              <th style={{ minWidth: '150px' }}>Lĩnh Vực</th>
              <th style={{ minWidth: '140px' }}>Nhân Viên Bán Hàng</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Nguồn Dữ Liệu</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy khách hàng nào phù hợp với từ khóa tìm kiếm.
                </td>
              </tr>
            ) : (
              filtered.map(cust => (
                <tr key={cust.id || cust.code}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {cust.id || cust.code}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cust.name}
                    </div>
                    {cust.contactPerson && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Đầu mối: {cust.contactPerson}
                      </div>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {cust.taxCode || '—'}
                  </td>
                  <td>
                    {cust.email && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {cust.email}
                      </div>
                    )}
                    {cust.phone && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {cust.phone}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div>{cust.address || '—'}</div>
                    {cust.city && <div style={{ color: 'var(--text-muted)' }}>{cust.city}</div>}
                  </td>
                  <td>
                    <span className="badge badge-info">{cust.industry || 'Chung'}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {cust.assignedSales || '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {cust.isNewlyImported ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={11} /> MỚI TỪ EXCEL
                      </span>
                    ) : cust.isRecentlyUpdated ? (
                      <span className="badge badge-info">
                        <RefreshCw size={11} /> VỪA CẬP NHẬT
                      </span>
                    ) : (
                      <span className="badge badge-info" style={{ opacity: 0.7 }}>
                        CSDL CŨ
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
