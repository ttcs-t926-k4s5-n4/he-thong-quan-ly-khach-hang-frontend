import React, { useState } from 'react';
import {
  X,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  GitMerge,
  ShieldCheck,
  Tag
} from 'lucide-react';

export function CustomerDetailModal({ customer, onClose }) {
  const [activeTab, setActiveTab] = useState('CONTACTS');

  if (!customer) return null;

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  const totalDealsAmount = customer.deals.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <h3>
              <Building size={22} style={{ color: 'var(--primary)' }} />
              <span>Hồ Sơ Chi Tiết: {customer.name}</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
                [{customer.id}]
              </span>
            </h3>
            <p>
              Mã số thuế: <strong className="mono">{customer.taxCode || 'Chưa có'}</strong> • Website:{' '}
              <strong>{customer.website || 'Chưa có'}</strong>
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Thông tin hồ sơ & người phụ trách */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div className="field-label">Người phụ trách chính</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {customer.ownerName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.ownerTeam}</div>
            </div>

            <div>
              <div className="field-label">Đồng phụ trách (Co-Owner)</div>
              <div style={{ fontWeight: 700, color: customer.coOwnerName ? '#60a5fa' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                {customer.coOwnerName || 'Chưa phân công'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {customer.coOwnerName ? 'Được chuyển giao sau khi gộp' : 'Không có xung đột'}
              </div>
            </div>

            <div>
              <div className="field-label">Tổng giá trị Pipeline</div>
              <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.1rem', marginTop: '0.2rem' }}>
                {formatCurrency(totalDealsAmount)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.deals.length} Cơ hội đang triển khai</div>
            </div>
          </div>

          {/* Badge nếu hồ sơ này từng được gộp */}
          {customer.mergedSecondaryId && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.825rem',
                color: '#6ee7b7'
              }}
            >
              <GitMerge size={16} />
              <span>
                Hồ sơ này đã hợp nhất thành công với bản ghi <strong>[{customer.mergedSecondaryId}]</strong> vào lúc{' '}
                <em>{new Date(customer.mergedAt).toLocaleString('vi-VN')}</em> bởi Trưởng nhóm <strong>{customer.mergedBy}</strong>.
              </span>
            </div>
          )}

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`btn-pill ${activeTab === 'CONTACTS' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('CONTACTS')}
            >
              <Users size={14} />
              <span>Người Liên Hệ ({customer.contacts.length})</span>
            </button>

            <button
              className={`btn-pill ${activeTab === 'DEALS' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('DEALS')}
            >
              <Briefcase size={14} />
              <span>Cơ Hội Bán Hàng ({customer.deals.length})</span>
            </button>

            <button
              className={`btn-pill ${activeTab === 'ACTIVITIES' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('ACTIVITIES')}
            >
              <Calendar size={14} />
              <span>Nhật Ký Chăm Sóc ({customer.activities.length})</span>
            </button>
          </div>

          {/* Tab 1: Contacts */}
          {activeTab === 'CONTACTS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {customer.contacts.map((contact, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.85rem 1.1rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {contact.name}{' '}
                      {contact.isPrimary && (
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          Đầu mối chính
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {contact.title} • SĐT: {contact.phone} • Email: {contact.email}
                    </div>
                  </div>
                  {contact.originRecord && (
                    <span className="mono" style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                      Nguồn: {contact.originRecord}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Deals */}
          {activeTab === 'DEALS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {customer.deals.map((deal, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.85rem 1.1rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{deal.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Giai đoạn: <strong>{deal.stage}</strong> • Xác suất: {deal.probability}% • Ngày chốt:{' '}
                      {deal.expectedCloseDate} • Phụ trách: {deal.ownerName}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>
                      {formatCurrency(deal.amount)}
                    </div>
                    {deal.originRecord && (
                      <span className="mono" style={{ fontSize: '0.7rem', color: '#93c5fd' }}>
                        Nguồn: {deal.originRecord}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Activities Timeline */}
          {activeTab === 'ACTIVITIES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {customer.activities.map((act, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.85rem 1.1rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    borderLeft: act.type === 'MERGE' ? '4px solid #10b981' : '3px solid var(--primary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: act.type === 'MERGE' ? '#34d399' : 'var(--text-primary)' }}>
                      {act.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {act.date} • do {act.creatorName}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                    {act.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Địa chỉ: {customer.address}
          </div>
          <button className="btn-pill" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
