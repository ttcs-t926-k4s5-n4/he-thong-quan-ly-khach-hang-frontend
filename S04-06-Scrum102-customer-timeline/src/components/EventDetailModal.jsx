import React from 'react';
import { 
  X, 
  FileText, 
  Briefcase, 
  PhoneCall, 
  Users, 
  Mail, 
  ArrowRightLeft, 
  StickyNote, 
  Paperclip, 
  Download, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { formatDateTime, formatVND } from '../utils/timelineUtils';

export default function EventDetailModal({
  event,
  onClose
}) {
  if (!event) return null;

  const { details = {} } = event;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <span className="event-type-badge">
              {event.typeLabel}
            </span>
            <span>Chi Tiết Tương Tác</span>
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Title and Time Row */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {event.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                <span>{formatDateTime(event.timestamp)}</span>
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} />
                <span>Thực hiện: <strong>{event.actorName}</strong> ({event.actorRole})</span>
              </span>
            </div>
          </div>

          {/* Summary Box */}
          <div style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.25rem'
          }}>
            {event.summary}
          </div>

          {/* Type Specific Details */}
          {/* 1. QUOTE_SENT DETAILS */}
          {event.type === 'QUOTE_SENT' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f472b6' }}>
                  Bảng Chi Tiết Hạng Mục Báo Giá ({details.quoteCode})
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  Hiệu lực đến: {details.validUntil}
                </span>
              </div>

              {details.lineItems && (
                <div style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                        <th style={{ padding: '0.55rem 0.75rem' }}>Hạng mục / Dịch vụ</th>
                        <th style={{ padding: '0.55rem 0.75rem', textAlign: 'center', width: '60px' }}>SL</th>
                        <th style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.lineItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-primary)' }}>{item.name}</td>
                          <td style={{ padding: '0.55rem 0.75rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.qty}</td>
                          <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatVND(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total calculations */}
              <div style={{
                background: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.825rem',
                marginBottom: '1rem'
              }}>
                {details.subTotal && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tổng giá niêm yết:</span>
                    <span>{formatVND(details.subTotal)}</span>
                  </div>
                )}
                {details.discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f472b6' }}>
                    <span>Chiết khấu ({details.discountPercent}%):</span>
                    <span>-{formatVND(details.discountAmount)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#fff',
                  borderTop: '1px solid rgba(236, 72, 153, 0.2)',
                  paddingTop: '0.45rem',
                  marginTop: '0.25rem'
                }}>
                  <span>Tổng tiền thanh toán cuối cùng:</span>
                  <span style={{ color: '#34d399' }}>{formatVND(details.finalAmount)}</span>
                </div>
              </div>

              {details.paymentTerms && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>Điều khoản thanh toán:</strong> {details.paymentTerms}
                </div>
              )}
              {details.clientFeedback && (
                <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '0.5rem' }}>
                  <strong>Phản hồi của khách hàng:</strong> {details.clientFeedback}
                </div>
              )}
            </div>
          )}

          {/* 2. HANDOVER DETAILS */}
          {event.type === 'HANDOVER' && (
            <div>
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem' }}>
                  Lý do bàn giao:
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {details.reason}
                </div>
              </div>

              {details.handoverChecklist && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Danh mục hồ sơ bàn giao (Checklist):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {details.handoverChecklist.map((chk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <CheckCircle2 size={16} style={{ color: chk.completed ? '#10b981' : 'var(--text-tertiary)' }} />
                        <span style={{ color: chk.completed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {chk.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details.personalAdvice && (
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid #8b5cf6',
                  fontSize: '0.825rem',
                  fontStyle: 'italic',
                  color: '#e2e8f0',
                  lineHeight: 1.5
                }}>
                  "{details.personalAdvice}"
                </div>
              )}
            </div>
          )}

          {/* 3. MEETING DETAILS */}
          {event.type === 'MEETING' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              {details.location && (
                <div><strong>Địa điểm / Hình thức:</strong> {details.location}</div>
              )}
              {details.duration && (
                <div><strong>Thời lượng:</strong> {details.duration}</div>
              )}
              {details.attendees && (
                <div>
                  <strong>Thành phần tham gia:</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                    {details.attendees.map((att, i) => (
                      <li key={i}>{att}</li>
                    ))}
                  </ul>
                </div>
              )}
              {details.meetingMinutes && (
                <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginTop: '0.25rem' }}>
                  <strong>Biên bản tóm tắt cuộc họp:</strong>
                  <p style={{ marginTop: '0.35rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {details.meetingMinutes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. CALL DETAILS */}
          {event.type === 'CALL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
              <div><strong>Đầu mối liên hệ:</strong> {details.contactPerson}</div>
              <div><strong>Thời lượng đàm thoại:</strong> {details.duration}</div>
              {details.notes && (
                <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <strong>Ghi chép nội dung cuộc gọi:</strong>
                  <p style={{ marginTop: '0.35rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {details.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 5. EMAIL DETAILS */}
          {event.type === 'EMAIL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.825rem' }}>
              <div><strong>Tiêu đề:</strong> {details.subject}</div>
              <div><strong>Từ:</strong> {details.fromEmail} ➔ <strong>Đến:</strong> {details.toEmail}</div>
              {details.bodySnippet && (
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)'
                }}>
                  {details.bodySnippet}
                </div>
              )}
            </div>
          )}

          {/* Attachments Section if any */}
          {details.attachments && details.attachments.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Tệp đính kèm ({details.attachments.length}):
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {details.attachments.map((att, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.78rem'
                  }}>
                    <Paperclip size={14} style={{ color: '#38bdf8' }} />
                    <span>{att.name}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>({att.size})</span>
                    <button 
                      style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', marginLeft: '0.25rem' }}
                      title="Tải về tệp mô phỏng"
                      onClick={() => alert(`Đang tải file: ${att.name}`)}
                    >
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
