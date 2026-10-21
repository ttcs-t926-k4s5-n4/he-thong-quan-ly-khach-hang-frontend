import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  PhoneCall, 
  Users, 
  Mail, 
  Briefcase, 
  FileText, 
  StickyNote, 
  Send 
} from 'lucide-react';
import { ACTIVITY_TYPES } from '../utils/timelineUtils';

export default function NewInteractionModal({
  isOpen,
  onClose,
  customer,
  teamMembers,
  currentPersona,
  onAddEvent
}) {
  const [type, setType] = useState('CALL');
  const [actorId, setActorId] = useState(currentPersona.id);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [quoteCode, setQuoteCode] = useState('BQ-2026-004');
  const [quoteAmount, setQuoteAmount] = useState('850000000');
  const [callDuration, setCallDuration] = useState('15 phút');
  const [oppStage, setOppStage] = useState('NEGOTIATION');
  const [isKeyMilestone, setIsKeyMilestone] = useState(false);

  if (!isOpen || !customer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề tương tác');
      return;
    }

    const actor = teamMembers.find(m => m.id === actorId) || currentPersona;
    const typeObj = ACTIVITY_TYPES.find(t => t.key === type) || ACTIVITY_TYPES[1];

    let details = {};
    if (type === 'CALL') {
      details = {
        contactPerson: customer.primaryContact?.name,
        duration: callDuration,
        callResult: 'SUCCESSFUL',
        notes: summary
      };
    } else if (type === 'QUOTE_SENT') {
      const amt = parseFloat(quoteAmount) || 0;
      details = {
        quoteCode: quoteCode || 'BQ-2026-NEW',
        finalAmount: amt,
        validUntil: '2026-11-30',
        paymentTerms: 'Thanh toán tiêu chuẩn 3 đợt',
        attachments: [{ name: `${quoteCode}.pdf`, size: '2.1 MB' }]
      };
    } else if (type === 'OPPORTUNITY_CHANGE') {
      details = {
        opportunityCode: customer.activeOpportunity?.code,
        oldStageLabel: customer.activeOpportunity?.stageLabel,
        newStageLabel: oppStage === 'CLOSED_WON' ? 'Thắng thầu - Ký hợp đồng' : 'Thương thảo điều khoản',
        dealValue: customer.activeOpportunity?.value,
        changeReason: summary
      };
    } else if (type === 'MEETING') {
      details = {
        location: 'Trực tuyến (Google Meet)',
        duration: '45 phút',
        meetingMinutes: summary,
        attendees: [actor.name, customer.primaryContact?.name]
      };
    } else if (type === 'EMAIL') {
      details = {
        subject: title,
        fromEmail: 'cskh@crm-enterprise.vn',
        toEmail: customer.primaryContact?.email,
        bodySnippet: summary
      };
    } else {
      details = {
        noteContent: summary
      };
    }

    const newEvent = {
      id: `EVT-USER-${Date.now()}`,
      customerId: customer.id,
      type: type,
      typeLabel: typeObj.label.replace(/^[^\s]+\s/, ''),
      category: type === 'QUOTE_SENT' ? 'QUOTATION' : (type === 'OPPORTUNITY_CHANGE' ? 'OPPORTUNITY' : 'ACTIVITY'),
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      actorAvatar: actor.avatar,
      title: title,
      summary: summary,
      isKeyMilestone: isKeyMilestone,
      details: details
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <PlusCircle size={20} style={{ color: '#6366f1' }} />
            <span>Ghi Nhận Tương Tác Mới ({customer.shortName})</span>
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Activity Type Selection */}
            <div className="form-group">
              <label>Loại tương tác:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'CALL', label: '📞 Cuộc gọi' },
                  { key: 'MEETING', label: '🤝 Cuộc họp' },
                  { key: 'EMAIL', label: '✉️ Email' },
                  { key: 'OPPORTUNITY_CHANGE', label: '💼 Đổi cơ hội' },
                  { key: 'QUOTE_SENT', label: '📄 Báo giá' },
                  { key: 'NOTE', label: '📝 Ghi chú' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    className={`btn ${type === item.key ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.45rem' }}
                    onClick={() => {
                      setType(item.key);
                      if (item.key === 'CALL') setTitle(`Cuộc gọi chào hỏi với ${customer.primaryContact?.name}`);
                      else if (item.key === 'QUOTE_SENT') setTitle(`Gửi Báo giá cập nhật ${quoteCode}`);
                      else if (item.key === 'OPPORTUNITY_CHANGE') setTitle('Cập nhật giai đoạn cơ hội kinh doanh');
                      else if (item.key === 'MEETING') setTitle('Họp làm việc trực tuyến với khách hàng');
                      else if (item.key === 'EMAIL') setTitle('Gửi tài liệu Onboarding & Kế hoạch CSKH');
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actor Selection */}
            <div className="form-group">
              <label>Người thực hiện:</label>
              <select 
                className="form-control"
                value={actorId}
                onChange={(e) => setActorId(e.target.value)}
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.role} ({m.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label>Tiêu đề tương tác:</label>
              <input 
                type="text"
                className="form-control"
                placeholder="Ví dụ: Cuộc gọi chào hỏi làm quen và gửi tài liệu Onboarding..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Type Specific Fields */}
            {type === 'QUOTE_SENT' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.15rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Mã báo giá:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={quoteCode}
                    onChange={(e) => setQuoteCode(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Số tiền (VNĐ):</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                  />
                </div>
              </div>
            )}

            {type === 'CALL' && (
              <div className="form-group">
                <label>Thời lượng cuộc gọi:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                />
              </div>
            )}

            {type === 'OPPORTUNITY_CHANGE' && (
              <div className="form-group">
                <label>Giai đoạn mới:</label>
                <select 
                  className="form-control"
                  value={oppStage}
                  onChange={(e) => setOppStage(e.target.value)}
                >
                  <option value="NEGOTIATION">Thương thảo hợp đồng</option>
                  <option value="CLOSED_WON">Thắng thầu - Ký hợp đồng thành công (Closed Won)</option>
                </select>
              </div>
            )}

            {/* Summary / Notes */}
            <div className="form-group">
              <label>Nội dung ghi chép chi tiết:</label>
              <textarea 
                className="form-control"
                rows={3}
                placeholder="Ghi lại các ý chính trao đổi với khách hàng, phản hồi và các bước hành động tiếp theo..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            {/* Milestone Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="chkMilestone"
                checked={isKeyMilestone}
                onChange={(e) => setIsKeyMilestone(e.target.checked)}
              />
              <label htmlFor="chkMilestone" style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                Đánh dấu đây là <strong>Mốc sự kiện quan trọng (Key Milestone)</strong>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={15} />
              <span>Lưu Lên Dòng Thời Gian</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
