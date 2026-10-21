import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Laptop,
  CheckCircle2,
  FileText,
  Key,
  Printer,
  ArrowRight,
  UserCheck,
  Percent,
  Target
} from 'lucide-react';
import { OBJECT_TYPES } from '../data/mockData';

export function AuditDetailModal({ log, onClose }) {
  if (!log) return null;

  const typeConfig = OBJECT_TYPES[log.objectType] || {
    label: log.objectType,
    color: '#64748B',
    bgColor: 'rgba(100, 116, 139, 0.15)'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span
              className="object-type-badge"
              style={{
                backgroundColor: typeConfig.bgColor,
                color: typeConfig.color,
                borderColor: typeConfig.borderColor
              }}
            >
              {typeConfig.label}
            </span>
            <h2 className="modal-title">Chi Tiết Bản Ghi Kiểm Toán: {log.id}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Cảnh báo nếu là bản ghi bất thường cuối quý */}
          {log.isAnomalous && (
            <div className="modal-anomaly-banner">
              <AlertTriangle size={20} className="text-amber" />
              <div>
                <strong>Dấu hiệu bất thường cuối quý:</strong> {log.anomalyReason}
              </div>
            </div>
          )}

          {/* Grid thông tin chung */}
          <div className="detail-grid">
            {/* Người thực hiện */}
            <div className="detail-card">
              <span className="detail-card-label">Người thực hiện</span>
              <div className="detail-user-box">
                <img
                  src={log.user.avatar}
                  alt={log.user.name}
                  className="user-avatar-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <h4 className="detail-user-name">{log.user.name}</h4>
                  <p className="detail-user-email">{log.user.email}</p>
                  <span className="badge badge-outline">{log.user.role}</span>
                </div>
              </div>
            </div>

            {/* Thời điểm & Mạng */}
            <div className="detail-card">
              <span className="detail-card-label">Thời điểm & Hạ tầng</span>
              <div className="meta-list">
                <div className="meta-row">
                  <Clock size={15} />
                  <span><strong>Thời gian:</strong> {log.timestamp}</span>
                </div>
                <div className="meta-row">
                  <Laptop size={15} />
                  <span><strong>Địa chỉ IP:</strong> {log.ipAddress}</span>
                </div>
                <div className="meta-row">
                  <FileText size={15} />
                  <span><strong>Mã đối tượng:</strong> <code>{log.targetId}</code></span>
                </div>
              </div>
            </div>
          </div>

          {/* Đối tượng bị ảnh hưởng */}
          <div className="target-banner-box">
            <span className="target-banner-label">Đối tượng / Thực thể bị thay đổi:</span>
            <h4 className="target-banner-name">{log.targetName}</h4>
            <div className="target-banner-field">
              Trường dữ liệu bị can thiệp: <code>{log.fieldName}</code> ({log.changeType})
            </div>
          </div>

          {/* SO SÁNH GIÁ TRỊ TRƯỚC VÀ SAU (Visual Side-by-Side Diff) */}
          <div className="diff-section">
            <h4 className="diff-section-title">
              So sánh biến động dữ liệu (Audit Value Comparison)
            </h4>
            <div className="diff-comparison-grid">
              <div className="diff-pane diff-pane-before">
                <div className="diff-pane-header">
                  <span className="diff-dot red-dot"></span>
                  <span>GIÁ TRỊ TRƯỚC KHI SỬA (PREVIOUS VALUE)</span>
                </div>
                <div className="diff-pane-content font-mono">
                  {log.oldValue}
                </div>
              </div>

              <div className="diff-pane diff-pane-after">
                <div className="diff-pane-header">
                  <span className="diff-dot green-dot"></span>
                  <span>GIÁ TRỊ SAU KHI SỬA (MODIFIED VALUE)</span>
                </div>
                <div className="diff-pane-content font-mono">
                  {log.newValue}
                </div>
              </div>
            </div>
          </div>

          {/* Lý do & Căn cứ phê duyệt */}
          <div className="detail-grid">
            <div className="detail-card">
              <span className="detail-card-label">Lý do điều chỉnh (Giải trình)</span>
              <p className="detail-reason-text">
                &ldquo;{log.reason || 'Không có giải trình đính kèm'}&rdquo;
              </p>
            </div>

            <div className="detail-card">
              <span className="detail-card-label">Căn cứ / Người phê duyệt</span>
              <p className="detail-approved-text">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>{log.approvedBy || 'Tự động duyệt theo quyền hệ thống'}</span>
              </p>
            </div>
          </div>

          {/* Mã băm toàn vẹn SHA-256 */}
          <div className="integrity-box">
            <div className="integrity-header">
              <Key size={15} />
              <span>Chữ ký xác thực toàn vẹn (SHA-256 Tamper-Proof Audit Hash)</span>
            </div>
            <code className="integrity-hash">{log.integrityHash}</code>
            <span className="integrity-status">
              <ShieldCheck size={14} className="text-emerald" /> Chuỗi khối kiểm toán không thể bị sửa đổi hay xoá
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>In trích lục kiểm toán</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            <span>Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
