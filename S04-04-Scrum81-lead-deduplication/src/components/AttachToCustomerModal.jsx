import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  ArrowRight, 
  UserPlus, 
  TrendingUp, 
  CheckCircle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Building,
  UserCheck
} from 'lucide-react';

export default function AttachToCustomerModal({
  lead,
  customer,
  onClose,
  onConfirmAttach
}) {
  const [attachType, setAttachType] = useState('CONTACT_AND_OPPORTUNITY'); // 'CONTACT_ONLY' | 'OPPORTUNITY_ONLY' | 'CONTACT_AND_OPPORTUNITY'
  const [notifySales, setNotifySales] = useState(true);
  const [transferNotes, setTransferNotes] = useState(
    `Lead mới từ chiến dịch "${lead?.leadSource}". Khách quan tâm mở rộng giải pháp. Chuyển giao cho Sales phụ trách tài khoản chăm sóc tiếp.`
  );

  if (!lead || !customer) return null;

  const handleConfirm = () => {
    onConfirmAttach({
      lead,
      customer,
      attachType,
      notifySales,
      transferNotes
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Building2 size={20} />
            </div>
            <div>
              <div className="modal-title">Gợi Ý Gắn Lead Vào Khách Hàng Doanh Nghiệp Đã Có</div>
              <div className="modal-subtitle">
                Đáp ứng tiêu chí 2: Phát hiện trùng với Khách hàng VIP trong CRM và chuyển đổi liền mạch
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Top Info Banner */}
          <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={22} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#4c1d95', lineHeight: 1.5 }}>
              <strong>Tại sao nên gắn vào Khách hàng đã có?</strong><br />
              Doanh nghiệp <strong>{customer.name}</strong> đã là Khách hàng chính thức trong CRM và đang được Sales <strong>{customer.assignedSales?.name}</strong> phụ trách. 
              Việc gắn thẳng Lead này vào hồ sơ Khách hàng sẽ giúp tránh Telesales gọi làm phiền, đồng thời mở ra cơ hội Bán thêm (Upsell / Cross-sell) cho Sales phụ trách!
            </div>
          </div>

          {/* Side-by-side Overview: Lead vs Customer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Box 1: Lead Information */}
            <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                1. Thông Tin Lead Mới Từ Marketing
              </span>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                {lead.fullName} ({lead.code})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Chức vụ: <strong>{lead.jobTitle || 'Chưa cập nhật'}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Công ty: <strong>{lead.companyName}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                SĐT: <strong>{lead.phone}</strong> &bull; Email: <strong>{lead.email}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                Kênh thu thập: {lead.leadSource}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Lịch sử: <strong>{lead.timeline?.length || 0} hoạt động</strong> (Sẽ chuyển vào KH)
              </div>
            </div>

            {/* Box 2: Customer Information */}
            <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                2. Hồ Sơ Khách Hàng Đã Có Trong CRM
              </span>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#581c87' }}>
                {customer.name} ({customer.id})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Mã số thuế: <strong>{customer.taxCode}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Hạng khách hàng: <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>{customer.accountTier}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Sales phụ trách: <strong>{customer.assignedSales?.name}</strong> ({customer.assignedSales?.role})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--success-600)', fontWeight: 700 }}>
                Tổng giá trị hợp đồng: {(customer.totalContractValue || 0).toLocaleString('vi-VN')} đ ({customer.activeContractsCount} HĐ)
              </div>
            </div>
          </div>

          {/* Attachment Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="field-label">Chọn Phương Thức Chuyển Đổi Vào Khách Hàng:</span>
            
            <div 
              className={`field-option-card ${attachType === 'CONTACT_AND_OPPORTUNITY' ? 'selected' : ''}`}
              onClick={() => setAttachType('CONTACT_AND_OPPORTUNITY')}
              style={{ padding: '0.85rem' }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <TrendingUp size={20} color="var(--primary-600)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    Tạo Người liên hệ mới & Mở Cơ hội Tái mua (Upsell Opportunity) - Khuyên dùng
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Thêm {lead.fullName} vào danh bạ của {customer.shortName || customer.name}, đồng thời tạo Deal cơ hội mua thêm module.
                  </div>
                </div>
              </div>
              {attachType === 'CONTACT_AND_OPPORTUNITY' && <CheckCircle size={18} color="var(--primary-600)" />}
            </div>

            <div 
              className={`field-option-card ${attachType === 'CONTACT_ONLY' ? 'selected' : ''}`}
              onClick={() => setAttachType('CONTACT_ONLY')}
              style={{ padding: '0.85rem' }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <UserPlus size={20} color="var(--primary-600)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    Chỉ thêm vào Danh bạ Người liên hệ (New Contact)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Bổ sung thông tin đầu mối liên hệ mới vào hồ sơ doanh nghiệp đã có.
                  </div>
                </div>
              </div>
              {attachType === 'CONTACT_ONLY' && <CheckCircle size={18} color="var(--primary-600)" />}
            </div>
          </div>

          {/* Transfer Note & Notification */}
          <div className="form-group">
            <label className="form-label">Ghi Chú Bàn Giao Nội Bộ Cho Key Account Manager:</label>
            <textarea 
              className="form-textarea"
              rows={2}
              value={transferNotes}
              onChange={(e) => setTransferNotes(e.target.value)}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={notifySales} 
              onChange={(e) => setNotifySales(e.target.checked)} 
            />
            <span>
              Gửi thông báo tức thì đến Sales <strong>{customer.assignedSales?.name}</strong> qua Email & Thông báo hệ thống CRM
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Hủy Bỏ
          </button>
          <button 
            className="btn btn-sm" 
            style={{ background: '#7c3aed', color: 'white' }}
            onClick={handleConfirm}
          >
            <Building2 size={16} />
            <span>Xác Nhận Gắn Thẳng Vào Khách Hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
