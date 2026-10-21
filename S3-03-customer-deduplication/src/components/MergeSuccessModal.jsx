import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  GitMerge,
  Users,
  Briefcase,
  Calendar,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function MergeSuccessModal({
  mergedMasterCustomer,
  mergedSecondaryId,
  onClose,
  onViewDetail
}) {
  if (!mergedMasterCustomer) return null;

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  const totalDealsAmount = mergedMasterCustomer.deals.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body" style={{ textAlign: 'center', padding: '2.5rem 2rem 1.5rem' }}>
          {/* Animated Success Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Gộp Hồ Sơ Khách Hàng Thành Công!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.4rem', maxWidth: '480px', margin: '0.4rem auto 0' }}>
            Bản ghi phụ <strong>[{mergedSecondaryId}]</strong> đã được sáp nhập hoàn toàn vào bản ghi chính{' '}
            <strong>[{mergedMasterCustomer.id} - {mergedMasterCustomer.name}]</strong>.
          </p>

          {/* Hộp Thống Kê Dữ Liệu Bảo Toàn */}
          <div
            style={{
              marginTop: '1.75rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ color: '#60a5fa', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                <Users size={22} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {mergedMasterCustomer.contacts.length}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Người liên hệ giữ lại</div>
            </div>

            <div>
              <div style={{ color: '#34d399', display: 'center', justifyContent: 'center', marginBottom: '0.3rem' }}>
                <Briefcase size={22} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                {mergedMasterCustomer.deals.length} Deal
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                {formatCurrency(totalDealsAmount)}
              </div>
            </div>

            <div>
              <div style={{ color: '#f59e0b', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                <Calendar size={22} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {mergedMasterCustomer.activities.length}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Hoạt động & Nhật ký</div>
            </div>
          </div>

          {/* Phân công phối hợp */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              fontSize: '0.825rem',
              color: '#93c5fd',
              textAlign: 'left'
            }}
          >
            <strong>Phân công chăm sóc sau gộp:</strong>
            <br />
            • Đầu mối chính: <strong>{mergedMasterCustomer.ownerName}</strong>
            <br />
            • Đồng phụ trách (Co-Owner): <strong>{mergedMasterCustomer.coOwnerName}</strong> (Hai nhân viên cùng nhận hoa hồng và phối hợp, tránh cạnh tranh nội bộ).
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', gap: '1rem' }}>
          <button
            className="btn-pill"
            onClick={() => {
              onClose();
              onViewDetail(mergedMasterCustomer);
            }}
          >
            <Sparkles size={15} />
            <span>Xem hồ sơ sau gộp</span>
          </button>
          <button className="btn-pill btn-primary" onClick={onClose}>
            <span>Hoàn tất & Quay lại danh sách</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
