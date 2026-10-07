import React from 'react';
import {
  Building2,
  X,
  FileText,
  Layers,
  ExternalLink,
  Phone,
  Globe,
  MapPin,
  User,
  Calendar,
  Percent
} from 'lucide-react';
import {
  formatCurrencyVND,
  getDirectSubsidiaries,
  getRootParent,
  isParentCompany,
  isSubsidiary
} from '../utils/hierarchyUtils';

export function CustomerDetailModal({
  customer,
  isOpen,
  onClose,
  allCustomers,
  contracts,
  onSelectParentGroup,
  onOpenDeclareRelationModal
}) {
  if (!isOpen || !customer) return null;

  const isParent = isParentCompany(customer, allCustomers);
  const isChild = isSubsidiary(customer);
  const directChildren = getDirectSubsidiaries(customer.id, allCustomers);
  const rootParent = isChild ? getRootParent(customer.id, allCustomers) : null;
  const parentCompany = isChild ? allCustomers.find((c) => c.id === customer.parentId) : null;

  const customerContracts = contracts.filter((ct) => ct.customerId === customer.id);
  const totalValue = customerContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Building2 size={20} color="#3b82f6" />
            <span>Hồ Sơ Khách Hàng Doanh Nghiệp</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Thông tin cơ bản */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              className="group-avatar"
              style={{
                background: customer.avatarBg || '#3b82f6',
                width: '50px',
                height: '50px',
                fontSize: '1.1rem'
              }}
            >
              {customer.logoInitials || 'DN'}
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{customer.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Mã: <strong>{customer.code}</strong> | MST: <strong>{customer.taxId}</strong> | Năm thành lập: {customer.establishedYear || 'N/A'}
              </div>
            </div>
          </div>

          {/* Vị trí trong Cấu trúc Tập đoàn */}
          <div
            style={{
              background: 'var(--bg-muted)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                VỊ TRÍ TRONG TẬP ĐOÀN:
              </div>
              {isParent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-parent">🏢 Công Ty Mẹ Điều Hành</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    ({directChildren.length} Công ty con trực thuộc)
                  </span>
                </div>
              ) : isChild && parentCompany ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-child">🏬 Công Ty Con Thành Viên</span>
                  <span style={{ fontSize: '0.82rem' }}>
                    Thuộc: <strong>{parentCompany.shortName}</strong> ({customer.ownershipPercent || 100}% vốn)
                  </span>
                </div>
              ) : (
                <span className="badge badge-independent">🌐 Khách Hàng Độc Lập</span>
              )}
            </div>

            {isParent ? (
              <button
                className="btn btn-corporate btn-sm"
                onClick={() => {
                  onClose();
                  onSelectParentGroup(customer);
                }}
              >
                <Layers size={13} /> Mở Trang Tập Đoàn
              </button>
            ) : isChild && rootParent ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  onSelectParentGroup(rootParent);
                }}
              >
                Xem Tập Đoàn Mẹ
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenDeclareRelationModal({ defaultChildId: customer.id });
                }}
              >
                Gắn Vào Tập Đoàn
              </button>
            )}
          </div>

          {/* Chi tiết liên hệ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Ngành nghề:</span>{' '}
              <strong>{customer.industry}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Phụ trách:</span>{' '}
              <strong>{customer.salesOwner}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Điện thoại:</span>{' '}
              <strong>{customer.phone || 'Chưa cập nhật'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Website:</span>{' '}
              <a href={customer.website} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>
                {customer.website}
              </a>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Địa chỉ:</span>{' '}
              <span>{customer.address}</span>
            </div>
          </div>

          {/* Danh sách Hợp đồng riêng lẻ của pháp nhân */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} /> Danh Sách Hợp Đồng Riêng Lẻ ({customerContracts.length})
              </h4>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#60a5fa' }}>
                Tổng: {formatCurrencyVND(totalValue)}
              </span>
            </div>

            {customerContracts.length === 0 ? (
              <div style={{ padding: '18px', textAlign: 'center', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Chưa có hợp đồng nào được ký kết với pháp nhân này.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customerContracts.map((ct) => (
                  <div
                    key={ct.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{ct.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        Số HĐ: {ct.contractNumber} | Thời hạn: {ct.startDate} → {ct.endDate}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '0.88rem' }}>
                        {formatCurrencyVND(ct.value)}
                      </div>
                      <span className={`badge ${ct.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {ct.status === 'ACTIVE' ? 'Hiệu lực' : 'Đã nghiệm thu'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
