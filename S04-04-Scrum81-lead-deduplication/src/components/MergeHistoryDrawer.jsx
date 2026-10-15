import React from 'react';
import { 
  History, 
  X, 
  GitMerge, 
  Building2, 
  Clock, 
  CheckCircle, 
  ShieldCheck 
} from 'lucide-react';

export default function MergeHistoryDrawer({ 
  isOpen, 
  onClose, 
  history = [] 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '650px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <History size={20} />
            </div>
            <div>
              <div className="modal-title">Nhật Ký Kiểm Toán Gộp & Gắn Lead (Audit Trail)</div>
              <div className="modal-subtitle">
                Truy vết toàn bộ các giao dịch hợp nhất dữ liệu trong phiên làm việc
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
              <History size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <div>Chưa có giao dịch gộp nào trong phiên này.</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Thực hiện gộp 2 Lead hoặc gắn Lead vào Khách hàng để ghi nhận nhật ký kiểm toán.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {history.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>
                      {item.type === 'ATTACH_CUSTOMER' ? (
                        <>
                          <Building2 size={16} color="#7c3aed" />
                          <span>Gắn Lead vào Khách Hàng {item.customerCode}</span>
                        </>
                      ) : (
                        <>
                          <GitMerge size={16} color="var(--primary-600)" />
                          <span>Gộp #{item.secondaryCode} vào #{item.masterCode}</span>
                        </>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} />
                      {item.timestamp}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {item.description}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span>Thực hiện: <strong>{item.performedBy || 'Nhân viên Marketing'}</strong></span>
                    <span style={{ color: 'var(--success-600)', fontWeight: 600 }}>
                      ✓ Đã bảo toàn {item.preservedActivitiesCount || 0} hoạt động
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Đóng Nhật Ký
          </button>
        </div>
      </div>
    </div>
  );
}
