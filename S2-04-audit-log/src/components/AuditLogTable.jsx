import React, { useState } from 'react';
import {
  Percent,
  Target,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  Clock,
  Laptop,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { OBJECT_TYPES } from '../data/mockData';

export function AuditLogTable({
  logs,
  onSelectLog,
  currentPage,
  pageSize,
  onPageChange
}) {
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Sorting
  const sortedLogs = [...logs].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'user') {
      aVal = a.user.name;
      bVal = b.user.name;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / pageSize) || 1;
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getObjectTypeIcon = (type) => {
    switch (type) {
      case 'DISCOUNT':
        return <Percent size={14} />;
      case 'SALES_TARGET':
        return <Target size={14} />;
      case 'DATA_OWNERSHIP':
        return <ShieldCheck size={14} />;
      case 'USER_ROLE':
        return <UserCheck size={14} />;
      default:
        return <HelpCircle size={14} />;
    }
  };

  const getSeverityBadge = (severity, isAnomalous) => {
    if (isAnomalous) {
      return (
        <span className="badge badge-anomalous" title="Hành vi đáng ngờ làm lệch số liệu chốt sổ cuối quý!">
          <AlertTriangle size={12} className="alert-pulse" />
          <span>Lệch Cuối Quý ⚠️</span>
        </span>
      );
    }

    switch (severity) {
      case 'critical':
        return <span className="badge badge-critical">Nghiêm trọng</span>;
      case 'high':
        return <span className="badge badge-high">Mức độ cao</span>;
      case 'medium':
        return <span className="badge badge-medium">Trung bình</span>;
      case 'low':
        return <span className="badge badge-low">Thông thường</span>;
      default:
        return <span className="badge">{severity}</span>;
    }
  };

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="audit-table">
          <thead>
            <tr>
              <th className="th-time" onClick={() => handleSort('timestamp')}>
                <div className="th-content">
                  <Clock size={14} />
                  <span>Thời điểm</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>

              <th className="th-user" onClick={() => handleSort('user')}>
                <div className="th-content">
                  <span>Người thực hiện</span>
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>

              <th className="th-type">
                <div className="th-content">
                  <span>Loại đối tượng</span>
                </div>
              </th>

              <th className="th-target">
                <div className="th-content">
                  <span>Bản ghi / Đối tượng bị sửa</span>
                </div>
              </th>

              <th className="th-diff">
                <div className="th-content">
                  <span>Giá trị trước &rarr; Giá trị sau</span>
                </div>
              </th>

              <th className="th-severity">
                <div className="th-content">
                  <span>Mức độ / Trạng thái</span>
                </div>
              </th>

              <th className="th-action">
                <div className="th-content">
                  <span>Thao tác</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="td-empty">
                  <div className="empty-state">
                    <AlertTriangle size={36} className="text-muted" />
                    <h4>Không tìm thấy bản ghi kiểm toán nào</h4>
                    <p>Hãy thử xóa bộ lọc hoặc nới lỏng khoảng thời gian tìm kiếm.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => {
                const typeConfig = OBJECT_TYPES[log.objectType] || {
                  label: log.objectType,
                  color: '#64748B',
                  bgColor: 'rgba(100, 116, 139, 0.15)',
                  borderColor: 'rgba(100, 116, 139, 0.3)'
                };

                return (
                  <tr
                    key={log.id}
                    className={`audit-row ${log.isAnomalous ? 'row-anomalous' : ''}`}
                    onClick={() => onSelectLog(log)}
                  >
                    {/* 1. Thời điểm */}
                    <td className="td-time">
                      <div className="timestamp-cell">
                        <span className="timestamp-main">{log.timestamp}</span>
                        <span className="timestamp-id">{log.id}</span>
                      </div>
                    </td>

                    {/* 2. Người thực hiện */}
                    <td className="td-user">
                      <div className="user-profile-cell">
                        <img
                          src={log.user.avatar}
                          alt={log.user.name}
                          className="user-avatar"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="user-info">
                          <span className="user-name">{log.user.name}</span>
                          <span className="user-role-badge">
                            {log.user.role.split('(')[0]}
                          </span>
                          <span className="user-ip">
                            <Laptop size={11} /> {log.ipAddress.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Loại đối tượng */}
                    <td className="td-type">
                      <span
                        className="object-type-badge"
                        style={{
                          backgroundColor: typeConfig.bgColor,
                          color: typeConfig.color,
                          borderColor: typeConfig.borderColor
                        }}
                      >
                        {getObjectTypeIcon(log.objectType)}
                        <span>{typeConfig.label}</span>
                      </span>
                    </td>

                    {/* 4. Đối tượng bị ảnh hưởng */}
                    <td className="td-target">
                      <div className="target-cell">
                        <span className="target-name" title={log.targetName}>
                          {log.targetName}
                        </span>
                        <span className="target-id-field">
                          <code className="code-id">{log.targetId}</code> &bull;{' '}
                          <span className="field-name">{log.fieldName}</span>
                        </span>
                      </div>
                    </td>

                    {/* 5. Giá trị Trước & Sau (Visual Diff) */}
                    <td className="td-diff">
                      <div className="diff-cell">
                        <div className="diff-item diff-old" title="Giá trị trước khi sửa">
                          <span className="diff-tag">Cũ:</span>
                          <span className="diff-val-old">{log.oldValue}</span>
                        </div>
                        <div className="diff-arrow">
                          <ArrowRight size={14} />
                        </div>
                        <div className="diff-item diff-new" title="Giá trị sau khi sửa">
                          <span className="diff-tag">Mới:</span>
                          <span className="diff-val-new">{log.newValue}</span>
                        </div>
                      </div>
                    </td>

                    {/* 6. Mức độ / Trạng thái */}
                    <td className="td-severity">
                      {getSeverityBadge(log.severity, log.isAnomalous)}
                    </td>

                    {/* 7. Thao tác */}
                    <td className="td-action" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-action-view"
                        onClick={() => onSelectLog(log)}
                        title="Xem chi tiết bằng chứng kiểm toán"
                      >
                        <Eye size={14} />
                        <span>Chi tiết</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="table-footer">
        <span className="page-info">
          Trang <strong>{currentPage}</strong> trên <strong>{totalPages}</strong> (Tổng cộng {logs.length} bản ghi)
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            className="btn-page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} /> Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`btn-page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="btn-page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Tiếp <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
