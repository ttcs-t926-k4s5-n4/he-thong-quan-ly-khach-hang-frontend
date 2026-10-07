import React, { useState } from 'react';
import {
  X,
  GitMerge,
  ArrowRightLeft,
  Check,
  AlertTriangle,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  ShieldCheck,
  Lock,
  Send,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

export function SideBySideComparisonModal({
  customerA: initialA,
  customerB: initialB,
  report,
  currentUser,
  onClose,
  onConfirmMerge,
  onRequestApproval
}) {
  // Trạng thái hoán đổi Master vs Duplicate
  const [isSwapped, setIsSwapped] = useState(false);

  const masterCustomer = isSwapped ? initialB : initialA;
  const secondaryCustomer = isSwapped ? initialA : initialB;

  // Lựa chọn trường giữ lại (Field conflict resolution state)
  // Mặc định chọn các trường từ Master Record
  const [fieldSelections, setFieldSelections] = useState({
    name: 'MASTER',
    taxCode: 'MASTER',
    website: 'MASTER',
    phone: 'MASTER',
    email: 'MASTER',
    address: 'MASTER',
    industry: 'MASTER',
    primaryOwner: 'MASTER'
  });

  const handleSelectField = (fieldKey, source) => {
    setFieldSelections((prev) => ({
      ...prev,
      [fieldKey]: source
    }));
  };

  // Tính toán dữ liệu hợp nhất bảo toàn 100%
  const preservedContacts = [
    ...masterCustomer.contacts.map((c) => ({ ...c, originRecord: masterCustomer.id })),
    ...secondaryCustomer.contacts.map((c) => ({ ...c, originRecord: secondaryCustomer.id }))
  ];

  const preservedDeals = [
    ...masterCustomer.deals.map((d) => ({ ...d, originRecord: masterCustomer.id })),
    ...secondaryCustomer.deals.map((d) => ({ ...d, originRecord: secondaryCustomer.id }))
  ];

  const totalPreservedPipeline = preservedDeals.reduce((sum, d) => sum + d.amount, 0);

  const preservedActivities = [
    ...masterCustomer.activities.map((a) => ({ ...a, originRecord: masterCustomer.id })),
    ...secondaryCustomer.activities.map((a) => ({ ...a, originRecord: secondaryCustomer.id }))
  ].sort((a, b) => new Date(b.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')) - new Date(a.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')));

  // Xác định người phụ trách chính & người đồng phụ trách
  const chosenPrimaryOwner =
    fieldSelections.primaryOwner === 'MASTER' ? masterCustomer.ownerName : secondaryCustomer.ownerName;
  const chosenCoOwner =
    fieldSelections.primaryOwner === 'MASTER' ? secondaryCustomer.ownerName : masterCustomer.ownerName;

  // Xử lý xác nhận gộp
  const handleExecuteMerge = () => {
    const finalRecord = {
      ...masterCustomer,
      name: fieldSelections.name === 'MASTER' ? masterCustomer.name : secondaryCustomer.name,
      taxCode: fieldSelections.taxCode === 'MASTER' ? masterCustomer.taxCode : secondaryCustomer.taxCode,
      website: fieldSelections.website === 'MASTER' ? masterCustomer.website : secondaryCustomer.website,
      phone: fieldSelections.phone === 'MASTER' ? masterCustomer.phone : secondaryCustomer.phone,
      email: fieldSelections.email === 'MASTER' ? masterCustomer.email : secondaryCustomer.email,
      address: fieldSelections.address === 'MASTER' ? masterCustomer.address : secondaryCustomer.address,
      industry: fieldSelections.industry === 'MASTER' ? masterCustomer.industry : secondaryCustomer.industry,
      ownerName: chosenPrimaryOwner,
      coOwnerName: chosenCoOwner,
      contacts: preservedContacts,
      deals: preservedDeals,
      activities: [
        {
          id: `ACT-MERGE-${Date.now()}`,
          type: 'MERGE',
          title: `Hợp nhất hồ sơ từ [${secondaryCustomer.id}]`,
          content: `Trưởng nhóm ${currentUser.name} đã thực hiện gộp khách hàng [${secondaryCustomer.id} - ${secondaryCustomer.name}] vào bản ghi này. Toàn bộ ${preservedContacts.length} liên hệ, ${preservedDeals.length} cơ hội và ${preservedActivities.length} nhật ký chăm sóc đã được hợp nhất thành công. Chỉ định ${chosenPrimaryOwner} là phụ trách chính, ${chosenCoOwner} là đồng phụ trách.`,
          date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          creatorName: currentUser.name,
          sourceCustomerId: masterCustomer.id
        },
        ...preservedActivities
      ],
      mergedAt: new Date().toISOString(),
      mergedBy: currentUser.name,
      mergedSecondaryId: secondaryCustomer.id
    };

    onConfirmMerge(masterCustomer.id, secondaryCustomer.id, finalRecord);
  };

  const formatCurrency = (val) => {
    return (val || 0).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <h3>
              <GitMerge size={22} style={{ color: 'var(--primary)' }} />
              <span>Đối Chiếu Song Song & Gộp Khách Hàng Trùng Lặp</span>
            </h3>
            <p>
              So sánh từng trường thông tin giữa 2 bản ghi, giải quyết xung đột và gom toàn bộ người liên hệ, cơ hội & hoạt động.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} title="Đóng cửa sổ">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* 1. Thanh Chỉ Số Độ Trùng Lặp & Lý Do */}
          <div className="confidence-box">
            <div className="confidence-left">
              <div className="confidence-gauge">{report.score}%</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f87171' }}>
                  Mức độ xung đột: {report.confidence === 'CRITICAL' ? 'RẤT NGUY CẤP (100% Trùng MST/Website)' : 'CAO (Trùng thông tin cốt lõi)'}
                </div>
                <div className="confidence-reasons">
                  {report.reasons.map((r, idx) => (
                    <span key={idx} className="reason-tag">
                      <AlertTriangle size={13} style={{ color: '#f87171' }} />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
                <Users size={13} />
                2 Nhân viên đang cùng chào hàng
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {masterCustomer.ownerName} ({masterCustomer.ownerTeam}) <br />
                và {secondaryCustomer.ownerName} ({secondaryCustomer.ownerTeam})
              </div>
            </div>
          </div>

          {/* 2. Lưới So Sánh Cạnh Nhau (Dual-Pane Side-by-Side Comparison) */}
          <div className="dual-pane-grid">
            {/* Cột Trái: BẢN GHI GỐC (MASTER RECORD) */}
            <div className="pane-card master-card">
              <div className="pane-header-tag">
                <span className="pane-role-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                  <ShieldCheck size={14} />
                  Bản ghi Chính (Master Record)
                </span>
                <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#93c5fd' }}>
                  Mã: {masterCustomer.id}
                </span>
              </div>

              {/* Tên công ty */}
              <div
                className={`field-row field-chip-select ${fieldSelections.name === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('name', 'MASTER')}
              >
                <div className="field-label">Tên Doanh Nghiệp (Giữ bản này)</div>
                <div className="field-value" style={{ fontWeight: 700 }}>
                  {masterCustomer.name}
                </div>
              </div>

              {/* Mã số thuế */}
              <div
                className={`field-row field-chip-select ${fieldSelections.taxCode === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('taxCode', 'MASTER')}
              >
                <div className="field-label">Mã Số Thuế (MST)</div>
                <div className="field-value mono">{masterCustomer.taxCode || '—'}</div>
              </div>

              {/* Website */}
              <div
                className={`field-row field-chip-select ${fieldSelections.website === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('website', 'MASTER')}
              >
                <div className="field-label">Website</div>
                <div className="field-value">{masterCustomer.website || '—'}</div>
              </div>

              {/* Điện thoại & Email */}
              <div
                className={`field-row field-chip-select ${fieldSelections.phone === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('phone', 'MASTER')}
              >
                <div className="field-label">Số Điện Thoại & Email</div>
                <div className="field-value">
                  {masterCustomer.phone} • {masterCustomer.email}
                </div>
              </div>

              {/* Địa chỉ trụ sở */}
              <div
                className={`field-row field-chip-select ${fieldSelections.address === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('address', 'MASTER')}
              >
                <div className="field-label">Địa Chỉ Trụ Sở</div>
                <div className="field-value">{masterCustomer.address}</div>
              </div>

              {/* Ngành nghề */}
              <div
                className={`field-row field-chip-select ${fieldSelections.industry === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('industry', 'MASTER')}
              >
                <div className="field-label">Ngành Nghề / Quy Mô</div>
                <div className="field-value">
                  {masterCustomer.industry} ({masterCustomer.employeeCount?.toLocaleString()} nhân sự)
                </div>
              </div>

              {/* Nhân viên phụ trách */}
              <div
                className={`field-row field-chip-select ${fieldSelections.primaryOwner === 'MASTER' ? 'selected' : ''}`}
                onClick={() => handleSelectField('primaryOwner', 'MASTER')}
              >
                <div className="field-label">Chọn làm Người Phụ Trách Chính</div>
                <div className="field-value" style={{ color: '#34d399', fontWeight: 600 }}>
                  {masterCustomer.ownerName} ({masterCustomer.ownerTeam})
                </div>
              </div>
            </div>

            {/* Cột Giữa: Nút Hoán Đổi (Swap Master <-> Duplicate) */}
            <div className="swap-btn-col">
              <button
                className="btn-swap"
                onClick={() => setIsSwapped(!isSwapped)}
                title="Bấm để hoán đổi bản ghi Chính và bản ghi Sáp nhập"
              >
                <ArrowRightLeft size={20} />
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                Đổi vai trò
              </span>
            </div>

            {/* Cột Phải: BẢN GHI SÁP NHẬP (SECONDARY RECORD) */}
            <div className="pane-card secondary-card">
              <div className="pane-header-tag">
                <span className="pane-role-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                  <AlertTriangle size={14} />
                  Bản ghi Sáp nhập (Sẽ gộp vào Master)
                </span>
                <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fde68a' }}>
                  Mã: {secondaryCustomer.id}
                </span>
              </div>

              {/* Tên công ty */}
              <div
                className={`field-row field-chip-select ${fieldSelections.name === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('name', 'SECONDARY')}
              >
                <div className="field-label">Tên Doanh Nghiệp (Giữ bản này)</div>
                <div className="field-value" style={{ fontWeight: 700 }}>
                  {secondaryCustomer.name}
                </div>
              </div>

              {/* Mã số thuế */}
              <div
                className={`field-row field-chip-select ${fieldSelections.taxCode === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('taxCode', 'SECONDARY')}
              >
                <div className="field-label">Mã Số Thuế (MST)</div>
                <div className="field-value mono">{secondaryCustomer.taxCode || '—'}</div>
              </div>

              {/* Website */}
              <div
                className={`field-row field-chip-select ${fieldSelections.website === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('website', 'SECONDARY')}
              >
                <div className="field-label">Website</div>
                <div className="field-value">{secondaryCustomer.website || '—'}</div>
              </div>

              {/* Điện thoại & Email */}
              <div
                className={`field-row field-chip-select ${fieldSelections.phone === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('phone', 'SECONDARY')}
              >
                <div className="field-label">Số Điện Thoại & Email</div>
                <div className="field-value">
                  {secondaryCustomer.phone} • {secondaryCustomer.email}
                </div>
              </div>

              {/* Địa chỉ trụ sở */}
              <div
                className={`field-row field-chip-select ${fieldSelections.address === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('address', 'SECONDARY')}
              >
                <div className="field-label">Địa Chỉ Trụ Sở</div>
                <div className="field-value">{secondaryCustomer.address}</div>
              </div>

              {/* Ngành nghề */}
              <div
                className={`field-row field-chip-select ${fieldSelections.industry === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('industry', 'SECONDARY')}
              >
                <div className="field-label">Ngành Nghề / Quy Mô</div>
                <div className="field-value">
                  {secondaryCustomer.industry} ({secondaryCustomer.employeeCount?.toLocaleString()} nhân sự)
                </div>
              </div>

              {/* Nhân viên phụ trách */}
              <div
                className={`field-row field-chip-select ${fieldSelections.primaryOwner === 'SECONDARY' ? 'selected' : ''}`}
                onClick={() => handleSelectField('primaryOwner', 'SECONDARY')}
              >
                <div className="field-label">Chọn làm Người Phụ Trách Chính</div>
                <div className="field-value" style={{ color: '#34d399', fontWeight: 600 }}>
                  {secondaryCustomer.ownerName} ({secondaryCustomer.ownerTeam})
                </div>
              </div>
            </div>
          </div>

          {/* 3. Khối Xem Trước Dữ Liệu Bảo Toàn 100% (Tiêu Chí 3) */}
          <div className="entities-summary-box">
            <div className="entities-summary-title">
              <Sparkles size={18} />
              <span>Tiêu chí 3: Toàn bộ Người liên hệ, Cơ hội và Hoạt động của cả hai bản ghi được giữ nguyên vẹn 100%</span>
            </div>

            <div className="entities-grid">
              {/* Người liên hệ gộp */}
              <div className="entity-subcard">
                <div className="entity-subcard-title">
                  <Users size={14} style={{ color: '#60a5fa' }} />
                  <span>Danh Bạ Liên Hệ ({preservedContacts.length} Người)</span>
                </div>
                <div className="entity-pill-list">
                  {preservedContacts.map((c, i) => (
                    <div key={i} className="entity-pill-item">
                      <div>
                        <strong>{c.name}</strong> - {c.title}
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{c.phone}</div>
                      </div>
                      <span className="mono" style={{ fontSize: '0.65rem', color: '#93c5fd' }}>
                        Nguồn: {c.originRecord}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cơ hội bán hàng gộp */}
              <div className="entity-subcard">
                <div className="entity-subcard-title">
                  <Briefcase size={14} style={{ color: '#34d399' }} />
                  <span>Cơ Hội Kinh Doanh ({preservedDeals.length} Deal — Tổng: {formatCurrency(totalPreservedPipeline)})</span>
                </div>
                <div className="entity-pill-list">
                  {preservedDeals.map((d, i) => (
                    <div key={i} className="entity-pill-item" style={{ borderLeftColor: '#10b981' }}>
                      <div>
                        <strong>{d.name}</strong>
                        <div style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
                          {formatCurrency(d.amount)} ({d.stage})
                        </div>
                      </div>
                      <span className="mono" style={{ fontSize: '0.65rem', color: '#86efac' }}>
                        Nguồn: {d.originRecord}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lịch sử hoạt động gộp */}
              <div className="entity-subcard">
                <div className="entity-subcard-title">
                  <Calendar size={14} style={{ color: '#f59e0b' }} />
                  <span>Dòng Thời Gian Chăm Sóc ({preservedActivities.length} Hoạt động)</span>
                </div>
                <div className="entity-pill-list">
                  {preservedActivities.slice(0, 4).map((a, i) => (
                    <div key={i} className="entity-pill-item" style={{ borderLeftColor: '#f59e0b' }}>
                      <div>
                        <strong>{a.title}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                          {a.date} • {a.creatorName}
                        </div>
                      </div>
                      <span className="mono" style={{ fontSize: '0.65rem', color: '#fde68a' }}>
                        {a.originRecord}
                      </span>
                    </div>
                  ))}
                  {preservedActivities.length > 4 && (
                    <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      + {preservedActivities.length - 4} hoạt động khác được lưu đầy đủ vào lịch sử
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mô hình phối hợp giữa 2 nhân viên */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.825rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} style={{ color: '#60a5fa' }} />
                <span>
                  <strong>Mô hình hợp tác sau gộp:</strong> Bạn <strong>{chosenPrimaryOwner}</strong> làm đầu mối chính, bạn{' '}
                  <strong>{chosenCoOwner}</strong> làm đồng phụ trách (Co-Owner) — Cả 2 cùng chăm sóc và tính KPI, chấm dứt tình trạng chào giá chồng chéo!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer: Kiểm soát phân quyền (Tiêu chí 4) & Nút Gộp */}
        <div className="modal-footer">
          {/* Cảnh báo phân quyền nếu là Sales Rep */}
          {!currentUser.canMerge ? (
            <div className="rbac-warning-box">
              <Lock size={18} style={{ color: '#ef4444' }} />
              <div>
                <strong>Tiêu chí 4 - Giới hạn phân quyền:</strong> Bạn đang đăng nhập với vai trò{' '}
                <em>{currentUser.roleLabel}</em>. Chỉ <strong>Trưởng nhóm kinh doanh</strong> trở lên mới có quyền gộp khách hàng.
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Đang thao tác với quyền: <strong>{currentUser.name}</strong> ({currentUser.roleLabel})
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn-pill" onClick={onClose}>
              Hủy bỏ
            </button>

            {/* Nếu là Sales Rep: Nút Gộp bị Disabled + Có nút Gửi yêu cầu gộp */}
            {!currentUser.canMerge ? (
              <>
                <button
                  className="btn-pill btn-primary"
                  onClick={() => onRequestApproval(masterCustomer, secondaryCustomer, report)}
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderColor: '#8b5cf6' }}
                >
                  <Send size={15} />
                  <span>Gửi yêu cầu gộp cho Trưởng nhóm</span>
                </button>
                <button
                  className="btn-pill btn-disabled-rbac"
                  disabled
                  title="Chỉ Trưởng nhóm trở lên được thực hiện gộp"
                >
                  <Lock size={15} />
                  <span>Xác nhận gộp (Bị khóa)</span>
                </button>
              </>
            ) : (
              /* Nếu là Team Lead hoặc Director: Có toàn quyền bấm gộp */
              <button
                className="btn-pill btn-primary"
                onClick={handleExecuteMerge}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderColor: '#10b981',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <GitMerge size={16} />
                <span>Xác nhận gộp khách hàng ({masterCustomer.id} ← {secondaryCustomer.id})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
