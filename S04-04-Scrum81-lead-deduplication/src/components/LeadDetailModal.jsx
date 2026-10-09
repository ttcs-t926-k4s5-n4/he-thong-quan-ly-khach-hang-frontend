import React from 'react';
import { 
  X, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Clock, 
  PhoneCall, 
  FileText, 
  Calendar, 
  GitMerge, 
  CheckCircle2, 
  Tag 
} from 'lucide-react';

export default function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <User size={20} />
            </div>
            <div>
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>{lead.fullName}</span>
                <span className="lead-code">{lead.code}</span>
                {lead.isMerged && (
                  <span className="badge badge-merged">ĐÃ GỘP VÀO #{lead.mergedIntoId}</span>
                )}
                {lead.isAttachedToCustomer && (
                  <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                    ĐÃ GẮN VÀO KH #{lead.attachedCustomerId}
                  </span>
                )}
              </div>
              <div className="modal-subtitle">
                {lead.jobTitle} &bull; {lead.companyName}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Số Điện Thoại</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>{lead.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Email</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>{lead.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Kênh Tiếp Thị</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-600)', marginTop: '2px' }}>{lead.leadSource}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Telesales Phụ Trách</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>{lead.assignedTo?.name}</div>
            </div>
          </div>

          {/* Unified Timeline Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--primary-600)" />
              <span>Dòng Thời Gian Lịch Sử Tương Tác ({lead.timeline?.length || 0} hoạt động)</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Sắp xếp theo trình tự thời gian
            </span>
          </div>

          {/* Timeline Feed */}
          <div className="timeline-feed">
            {(!lead.timeline || lead.timeline.length === 0) ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', padding: '1rem' }}>
                Chưa có hoạt động tương tác nào được ghi nhận.
              </div>
            ) : (
              lead.timeline.map((item, idx) => {
                let dotClass = 'timeline-dot-note';
                let Icon = FileText;

                if (item.type === 'CALL') {
                  dotClass = 'timeline-dot-call';
                  Icon = PhoneCall;
                } else if (item.type === 'EMAIL') {
                  dotClass = 'timeline-dot-email';
                  Icon = Mail;
                } else if (item.type === 'SYSTEM_MERGE') {
                  dotClass = 'timeline-dot-merge';
                  Icon = GitMerge;
                }

                return (
                  <div key={item.id || idx} className="timeline-item">
                    <span className={`timeline-dot ${dotClass}`} />
                    <div className="timeline-header">
                      <div className="timeline-title">
                        <Icon size={14} />
                        <span>{item.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.sourceBadge && (
                          <span className="timeline-source-badge">
                            {item.sourceBadge}
                          </span>
                        )}
                        <span className="timeline-time">
                          {item.timeLabel || item.timestamp}
                        </span>
                      </div>
                    </div>
                    {item.actor && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        Bởi: {item.actor} {item.callDuration && `(${item.callDuration})`}
                      </div>
                    )}
                    <div className="timeline-content">
                      {item.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
