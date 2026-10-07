import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit2,
  Check,
  Eye,
  SkipForward,
  RefreshCw,
  ArrowRight,
  Filter,
  CheckCheck
} from 'lucide-react';

export default function PreviewTable({
  rows,
  onRowChange,
  onDuplicateActionChange,
  onBulkDuplicateAction,
  onOpenCompareModal,
  onExecuteImport,
  activeFilter,
  setActiveFilter
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null); // { rowNumber, field }
  const [editValue, setEditValue] = useState('');

  // Lọc dữ liệu theo Search và Filter Tab
  const filteredRows = rows.filter(row => {
    // 1. Lọc theo Tab
    if (activeFilter === 'VALID' && (!row.isValid || row.isDuplicate)) return false;
    if (activeFilter === 'DUPLICATE' && !row.isDuplicate) return false;
    if (activeFilter === 'INVALID' && row.isValid) return false;

    // 2. Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = row.name && row.name.toLowerCase().includes(q);
      const matchCode = row.code && row.code.toLowerCase().includes(q);
      const matchTax = row.taxCode && row.taxCode.toLowerCase().includes(q);
      const matchEmail = row.email && row.email.toLowerCase().includes(q);
      const matchPhone = row.phone && row.phone.toLowerCase().includes(q);
      return matchName || matchCode || matchTax || matchEmail || matchPhone;
    }
    return true;
  });

  // Bắt đầu sửa trực tiếp trên ô
  const handleStartEdit = (row, field) => {
    setEditingCell({ rowNumber: row.rowNumber, field });
    setEditValue(row[field] || '');
  };

  // Lưu giá trị sau khi sửa inline
  const handleSaveEdit = (row, field) => {
    onRowChange(row.rowNumber, field, editValue);
    setEditingCell(null);
  };

  // Đếm nhanh
  const duplicateCount = rows.filter(r => r.isDuplicate).length;
  const errorCount = rows.filter(r => !r.isValid).length;
  const validCount = rows.filter(r => r.isValid && !r.isDuplicate).length;
  const readyToImportCount = rows.filter(
    r => r.isValid && (!r.isDuplicate || r.duplicateAction === 'update' || r.duplicateAction === 'create')
  ).length;

  return (
    <div className="preview-card">
      {/* Thanh công cụ Preview Table */}
      <div className="preview-toolbar">
        <div className="toolbar-left">
          {/* Ô tìm kiếm */}
          <div className="search-input-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Tìm theo tên công ty, MST, email, SĐT..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Bộ lọc theo trạng thái dòng */}
          <div className="filter-btn-group">
            <button
              className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              Tất cả ({rows.length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'VALID' ? 'active' : ''}`}
              onClick={() => setActiveFilter('VALID')}
            >
              <CheckCircle2 size={13} /> Hợp lệ ({validCount})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'DUPLICATE' ? 'active' : ''}`}
              onClick={() => setActiveFilter('DUPLICATE')}
            >
              <AlertTriangle size={13} /> Trùng lặp ({duplicateCount})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'INVALID' ? 'active' : ''}`}
              onClick={() => setActiveFilter('INVALID')}
            >
              <XCircle size={13} /> Có lỗi ({errorCount})
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          {/* Nút hành động chính: TIẾN HÀNH NHẬP */}
          <button
            className="btn btn-primary"
            onClick={onExecuteImport}
            disabled={rows.length === 0}
            title="Tiến hành đưa dữ liệu hợp lệ vào danh mục khách hàng hệ thống CRM"
          >
            <CheckCheck size={16} /> Tiến Hành Nhập Dữ Liệu ({readyToImportCount} khách hàng)
          </button>
        </div>
      </div>

      {/* Thanh xử lý hàng loạt cho các bản ghi trùng lặp (Acceptance Criteria 2) */}
      {duplicateCount > 0 && (
        <div className="bulk-duplicate-bar">
          <div className="bulk-bar-left">
            <AlertTriangle size={18} />
            <span>
              Phát hiện <strong>{duplicateCount}</strong> bản ghi trùng lặp trong tệp xem trước:
            </span>
          </div>

          <div className="bulk-bar-actions">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thao tác hàng loạt:</span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onBulkDuplicateAction('skip')}
              title="Đánh dấu bỏ qua toàn bộ bản ghi trùng lặp, không thêm vào hệ thống"
            >
              <SkipForward size={14} style={{ color: 'var(--warning)' }} /> Bỏ Qua Tất Cả
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onBulkDuplicateAction('update')}
              title="Đánh dấu cập nhật dữ liệu mới từ Excel vào hồ sơ khách hàng hiện có"
            >
              <RefreshCw size={14} style={{ color: 'var(--primary)' }} /> Cập Nhật Tất Cả
            </button>
          </div>
        </div>
      )}

      {/* Thông báo hướng dẫn sửa lỗi trực tiếp */}
      {errorCount > 0 && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <XCircle size={16} flexShrink={0} />
          <span>
            <strong>Chú ý:</strong> Đang có <strong>{errorCount}</strong> dòng dữ liệu bị lỗi. Bạn có thể <strong>click trực tiếp vào ô màu đỏ</strong> để chỉnh sửa và sửa lỗi ngay trên bảng mà không cần tải lại file!
          </span>
        </div>
      )}

      {/* Bảng Dữ Liệu Xem Trước (Preview Table) */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Dòng</th>
              <th style={{ width: '130px' }}>Trạng Thái</th>
              <th style={{ width: '110px' }}>Mã KH</th>
              <th style={{ minWidth: '220px' }}>Tên Công Ty / Khách Hàng (*)</th>
              <th style={{ minWidth: '120px' }}>Mã Số Thuế</th>
              <th style={{ minWidth: '180px' }}>Email</th>
              <th style={{ minWidth: '120px' }}>Số Điện Thoại</th>
              <th style={{ minWidth: '160px' }}>Địa Chỉ & Tỉnh/Thành</th>
              <th style={{ width: '130px' }}>Người Phụ Trách</th>
              <th style={{ width: '160px', textAlign: 'center' }}>Xử Lý Trùng Lặp</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy dòng dữ liệu nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredRows.map(row => {
                const hasError = !row.isValid;
                const isDup = row.isDuplicate;

                let rowClass = 'row-valid';
                if (hasError) rowClass = 'row-error';
                else if (isDup) rowClass = 'row-duplicate';

                return (
                  <tr key={row.rowNumber} className={rowClass}>
                    {/* Số dòng theo bảng tính Excel */}
                    <td style={{ textAlign: 'center', fontWeight: 600, fontFamily: varMono, color: 'var(--text-secondary)' }}>
                      #{row.rowNumber}
                    </td>

                    {/* Huy hiệu Trạng thái */}
                    <td>
                      {hasError ? (
                        <span className="badge badge-danger" title={Object.values(row.errors).join(', ')}>
                          <XCircle size={12} /> Lỗi Dữ Liệu
                        </span>
                      ) : isDup ? (
                        <span className="badge badge-warning" title={row.duplicateReason}>
                          <AlertTriangle size={12} /> Trùng Lặp
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Hợp Lệ
                        </span>
                      )}
                    </td>

                    {/* Mã khách hàng */}
                    <td style={{ fontFamily: varMono, fontSize: '0.78rem' }}>
                      {row.code || '—'}
                    </td>

                    {/* Tên công ty (Có kiểm tra lỗi & Sửa inline) */}
                    <td>
                      {editingCell?.rowNumber === row.rowNumber && editingCell?.field === 'name' ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="inline-edit-input"
                            value={editValue}
                            autoFocus
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(row, 'name');
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ padding: '0.2rem 0.4rem' }}
                            onClick={() => handleSaveEdit(row, 'name')}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cell-error-box"
                          onClick={() => handleStartEdit(row, 'name')}
                          title="Nhấn đúp hoặc click để sửa trực tiếp"
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              color: row.errors?.name ? 'var(--danger)' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                              cursor: 'pointer'
                            }}
                          >
                            <span>{row.name || <em style={{ color: 'var(--danger)' }}>[Bị trống]</em>}</span>
                            <Edit2 size={12} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
                          </div>
                          {row.errors?.name && (
                            <span className="cell-tooltip">{row.errors.name}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Mã số thuế */}
                    <td>
                      {editingCell?.rowNumber === row.rowNumber && editingCell?.field === 'taxCode' ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="inline-edit-input"
                            value={editValue}
                            autoFocus
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(row, 'taxCode');
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ padding: '0.2rem 0.4rem' }}
                            onClick={() => handleSaveEdit(row, 'taxCode')}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cell-error-box"
                          onClick={() => handleStartEdit(row, 'taxCode')}
                          title="Click để sửa mã số thuế"
                        >
                          <span
                            style={{
                              fontFamily: varMono,
                              color: row.errors?.taxCode ? 'var(--danger)' : 'var(--text-primary)'
                            }}
                          >
                            {row.taxCode || '—'}
                          </span>
                          {row.errors?.taxCode && (
                            <span className="cell-tooltip">{row.errors.taxCode}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Email */}
                    <td>
                      {editingCell?.rowNumber === row.rowNumber && editingCell?.field === 'email' ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="inline-edit-input"
                            value={editValue}
                            autoFocus
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(row, 'email');
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ padding: '0.2rem 0.4rem' }}
                            onClick={() => handleSaveEdit(row, 'email')}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cell-error-box"
                          onClick={() => handleStartEdit(row, 'email')}
                          title="Click để sửa email"
                        >
                          <span
                            style={{
                              color: row.errors?.email ? 'var(--danger)' : 'var(--text-primary)'
                            }}
                          >
                            {row.email || '—'}
                          </span>
                          {row.errors?.email && (
                            <span className="cell-tooltip">{row.errors.email}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Số điện thoại */}
                    <td>
                      {editingCell?.rowNumber === row.rowNumber && editingCell?.field === 'phone' ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="inline-edit-input"
                            value={editValue}
                            autoFocus
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(row, 'phone');
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ padding: '0.2rem 0.4rem' }}
                            onClick={() => handleSaveEdit(row, 'phone')}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cell-error-box"
                          onClick={() => handleStartEdit(row, 'phone')}
                          title="Click để sửa số điện thoại"
                        >
                          <span
                            style={{
                              fontFamily: varMono,
                              color: row.errors?.phone ? 'var(--danger)' : 'var(--text-primary)'
                            }}
                          >
                            {row.phone || '—'}
                          </span>
                          {row.errors?.phone && (
                            <span className="cell-tooltip">{row.errors.phone}</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Địa chỉ & Thành phố */}
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <div>{row.address || '—'}</div>
                      {row.city && <div style={{ color: 'var(--text-muted)' }}>{row.city}</div>}
                    </td>

                    {/* Nhân viên phụ trách */}
                    <td style={{ fontSize: '0.8rem' }}>
                      {row.assignedSales || '—'}
                    </td>

                    {/* Cột Xử lý trùng lặp (Tiêu chí 2: Chọn Bỏ qua hoặc Cập nhật) */}
                    <td style={{ textAlign: 'center' }}>
                      {isDup ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
                          <div className="duplicate-action-selector">
                            <button
                              type="button"
                              className={`duplicate-action-btn ${row.duplicateAction === 'skip' ? 'active-skip' : ''}`}
                              onClick={() => onDuplicateActionChange(row.rowNumber, 'skip')}
                              title="Bỏ qua dòng này khi nhập vào hệ thống"
                            >
                              Bỏ qua
                            </button>
                            <button
                              type="button"
                              className={`duplicate-action-btn ${row.duplicateAction === 'update' ? 'active-update' : ''}`}
                              onClick={() => onDuplicateActionChange(row.rowNumber, 'update')}
                              title="Cập nhật thông tin mới từ file Excel vào khách hàng hiện có"
                            >
                              Cập nhật
                            </button>
                          </div>

                          {row.matchedCustomer && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', color: 'var(--warning)' }}
                              onClick={() => onOpenCompareModal(row)}
                              title="Xem so sánh cạnh nhau giữa dòng Excel và khách hàng trong hệ thống"
                            >
                              <Eye size={12} /> So sánh
                            </button>
                          )}
                        </div>
                      ) : hasError ? (
                        <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>Cần sửa lỗi</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Tạo mới</span>
                      )}
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

const varMono = 'var(--font-mono)';
