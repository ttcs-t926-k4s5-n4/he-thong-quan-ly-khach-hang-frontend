import React from 'react';
import { X, History, GitMerge, ShieldCheck, Users, Briefcase, Calendar, CheckCircle } from 'lucide-react';

export function MergeHistoryDrawer({ history, onClose }) {
  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h3>
              <History size={22} style={{ color: 'var(--primary)' }} />
              <span>Nhật Ký Lịch Sử Gộp Khách Hàng (Merge Audit Trail)</span>
            </h3>
            <p>Lưu vết toàn bộ các giao dịch sáp nhập hồ sơ, người phê duyệt, dữ liệu chuyển giao và phân bổ nhân sự.</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Chưa có giao dịch gộp khách hàng nào được ghi nhận.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd' }}>
                          [{item.id}]
                        </span>
                        <span className="badge badge-success">
                          <CheckCircle size={12} />
                          Đã hoàn tất sáp nhập
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Thời gian: <strong>{item.mergedAt}</strong> • Người phê duyệt:{' '}
                        <strong style={{ color: '#a78bfa' }}>{item.approvedBy}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Chi tiết 2 bản ghi */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: '1rem',
                      alignItems: 'center',
                      background: 'rgba(15, 23, 42, 0.4)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div>
                      <span className="field-label">Bản ghi Chính (Master)</span>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.primaryCustomer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        MST: {item.primaryCustomer.taxCode} • Sales: {item.primaryCustomer.ownerName}
                      </div>
                    </div>

                    <div style={{ color: 'var(--primary)' }}>
                      <GitMerge size={20} />
                    </div>

                    <div>
                      <span className="field-label">Bản ghi đã gộp vào</span>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fbbf24' }}>
                        {item.mergedCustomer.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        MST: {item.mergedCustomer.taxCode} • Sales cũ: {item.mergedCustomer.ownerName}
                      </div>
                    </div>
                  </div>

                  {/* Thống kê bảo toàn */}
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>
                      • Người liên hệ chuyển giao: <strong>{item.transferredContactsCount} người</strong>
                    </span>
                    <span>
                      • Cơ hội kinh doanh: <strong>{item.transferredDealsCount} deal</strong> ({formatCurrency(item.totalPipelineValue)})
                    </span>
                    <span>
                      • Hoạt động tích hợp: <strong>{item.transferredActivitiesCount} lượt</strong>
                    </span>
                  </div>

                  {item.coOwnerAssigned && (
                    <div style={{ fontSize: '0.775rem', color: '#93c5fd', marginTop: '0.5rem' }}>
                      🤝 Phối hợp sau gộp: <em>{item.coOwnerAssigned}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-pill" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
