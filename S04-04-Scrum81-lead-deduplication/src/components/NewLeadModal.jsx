import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  CheckCircle, 
  Zap, 
  Search, 
  PhoneCall, 
  Mail, 
  Building 
} from 'lucide-react';
import { compareTwoLeads, compareLeadWithCustomers } from '../utils/duplicateDetector';

export default function NewLeadModal({
  existingLeads = [],
  existingCustomers = [],
  onClose,
  onSubmitNewLead,
  onFastTrackMerge,
  onFastTrackAttach
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    phone: '',
    email: '',
    companyName: '',
    industry: 'Công nghệ thông tin',
    leadSource: 'Landing Page Form Q4',
    budget: '300.000.000 đ',
    assignedStaffName: 'Nguyễn Hoàng Tuấn'
  });

  // Quét đối soát trùng lặp thời gian thực (Live Deduplication Scanner)
  const scanResults = useMemo(() => {
    if (!formData.email && !formData.phone && !formData.companyName) {
      return { duplicateLeads: [], matchedCustomers: [] };
    }

    const tempLead = {
      id: 'TEMP-SCAN',
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      companyName: formData.companyName
    };

    const dupLeads = [];
    for (const lead of existingLeads) {
      if (lead.isMerged) continue;
      const comp = compareTwoLeads(tempLead, lead);
      if (comp) {
        dupLeads.push(comp);
      }
    }

    const matchedCusts = compareLeadWithCustomers(tempLead, existingCustomers);

    return {
      duplicateLeads: dupLeads.sort((a, b) => b.score - a.score),
      matchedCustomers: matchedCusts
    };
  }, [formData.email, formData.phone, formData.companyName, formData.fullName, existingLeads, existingCustomers]);

  // Các nút nạp nhanh dữ liệu mẫu
  const handleLoadSample = (sampleType) => {
    if (sampleType === 'DUP_LEAD') {
      setFormData({
        fullName: 'Phạm Bình',
        jobTitle: 'Giám đốc Công nghệ (CTO)',
        phone: '0912 345 678', // Trùng LD-101
        email: 'binh.pv@fpt.com.vn', // Trùng LD-101
        companyName: 'FPT Software & Technology',
        industry: 'Công nghệ thông tin',
        leadSource: 'Facebook Lead Ads - Ebook CRM',
        budget: '500.000.000 đ',
        assignedStaffName: 'Trần Thị Mai Linh'
      });
    } else if (sampleType === 'DUP_CUSTOMER') {
      setFormData({
        fullName: 'Lê Hoàng Minh',
        jobTitle: 'Phó Phòng Kế Hoạch',
        phone: '02854155555', // Trùng KH-003 Vinamilk
        email: 'minh.lh@vinamilk.com.vn', // Trùng domain vinamilk.com.vn
        companyName: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
        industry: 'Hàng tiêu dùng nhanh (FMCG)',
        leadSource: 'Hội thảo Đổi mới sáng tạo',
        budget: '700.000.000 đ',
        assignedStaffName: 'Phạm Thu Hương'
      });
    } else if (sampleType === 'CLEAN') {
      setFormData({
        fullName: 'Võ Minh Trí',
        jobTitle: 'Trưởng Phòng Mua Hàng',
        phone: '0978112233',
        email: 'tri.vm@greentechcorp.vn',
        companyName: 'Công ty Cổ phần Năng Lượng Xanh GreenTech',
        industry: 'Năng lượng tái tạo',
        leadSource: 'Google Search Ads',
        budget: '350.000.000 đ',
        assignedStaffName: 'Lê Văn Hùng'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập tối thiểu Họ tên và Số điện thoại!');
      return;
    }

    onSubmitNewLead({
      ...formData,
      code: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: '2026-10-09 09:30:00',
      status: 'NEW',
      leadScore: 80,
      assignedTo: {
        id: 'STAFF-AUTO',
        name: formData.assignedStaffName,
        role: 'Chuyên viên Telesales',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
      },
      timeline: [
        {
          id: `TL-INIT-${Date.now()}`,
          type: 'SYSTEM',
          title: 'Thu nhận Lead từ Marketing Form',
          actor: 'Marketing Specialist (Lê Thảo Vy)',
          timestamp: '2026-10-09 09:30:00',
          timeLabel: 'Vừa xong',
          content: `Tạo Lead mới từ kênh ${formData.leadSource}. Dự kiến ngân sách: ${formData.budget}.`,
          sourceTag: 'Bản ghi ban đầu'
        }
      ]
    });
  };

  const topDupLead = scanResults.duplicateLeads[0];
  const topMatchedCust = scanResults.matchedCustomers[0];

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon">
              <Plus size={20} />
            </div>
            <div>
              <div className="modal-title">Thêm Khách Hàng Tiềm Năng (Marketing Lead)</div>
              <div className="modal-subtitle">
                Tích hợp Live Deduplication Scanner - Tự động đối soát thời gian thực khi gõ phím
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Quick Sample Buttons Bar */}
        <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={14} color="#f59e0b" />
            Nạp mẫu kiểm thử nhanh:
          </span>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleLoadSample('DUP_LEAD')}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
          >
            ⚡ Trùng Lead khác (FPT - Đã có cuộc gọi 08:30)
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleLoadSample('DUP_CUSTOMER')}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', color: '#7c3aed' }}
          >
            ⚡ Trùng Khách hàng đã có (Vinamilk)
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleLoadSample('CLEAN')}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', color: 'var(--success-600)' }}
          >
            ⚡ Lead mới hợp lệ 100%
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Họ tên */}
              <div className="form-group">
                <label className="form-label">Họ và tên khách hàng (*):</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Phạm Văn Bình"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {/* Chức danh */}
              <div className="form-group">
                <label className="form-label">Chức danh / Vị trí:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Giám đốc Công nghệ"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>

              {/* SĐT */}
              <div className="form-group">
                <label className="form-label">Số điện thoại (* - Quét trùng):</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: 0912 345 678"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email (* - Quét trùng):</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Ví dụ: binh.pv@fpt.com.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Tên công ty */}
              <div className="form-group full-width">
                <label className="form-label">Tên doanh nghiệp / Cơ quan (* - Quét trùng):</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Công ty Cổ phần Công nghệ FPT"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              {/* Kênh Marketing */}
              <div className="form-group">
                <label className="form-label">Kênh tiếp thị (Marketing Source):</label>
                <select 
                  className="form-select"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                >
                  <option value="Landing Page Form Q4">Landing Page Form Q4</option>
                  <option value="Google Ads - Chiến dịch CRM Enterprise">Google Ads - CRM Enterprise</option>
                  <option value="Facebook Lead Ads - Ebook CRM">Facebook Lead Ads - Ebook CRM</option>
                  <option value="Hội thảo Triển lãm Tech Expo 2026">Hội thảo Triển lãm Tech Expo 2026</option>
                  <option value="Zalo OA Marketing">Zalo OA Marketing</option>
                  <option value="Hotline Tiếp Nhận Trực Tiếp">Hotline Tiếp Nhận Trực Tiếp</option>
                </select>
              </div>

              {/* Phân bổ Telesales */}
              <div className="form-group">
                <label className="form-label">Phân bổ nhân viên Telesales:</label>
                <select 
                  className="form-select"
                  value={formData.assignedStaffName}
                  onChange={(e) => setFormData({ ...formData, assignedStaffName: e.target.value })}
                >
                  <option value="Nguyễn Hoàng Tuấn">Nguyễn Hoàng Tuấn (Telesales 1)</option>
                  <option value="Trần Thị Mai Linh">Trần Thị Mai Linh (Telesales 2)</option>
                  <option value="Lê Văn Hùng">Lê Văn Hùng (Chuyên viên tư vấn)</option>
                  <option value="Phạm Thu Hương">Phạm Thu Hương (Telesales 3)</option>
                </select>
              </div>
            </div>

            {/* LIVE DEDUPLICATION SCANNER RESULT BOX */}
            {(topDupLead || topMatchedCust) && (
              <div className="scanner-box">
                <div className="scanner-title">
                  <ShieldAlert size={16} />
                  <span>KẾT QUẢ ĐỐI SOÁT TRÙNG LẶP THỜI GIAN THỰC (LIVE SCANNER):</span>
                </div>

                {/* Conflict with Morning Call */}
                {topDupLead?.morningCallConflict && (
                  <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '6px', padding: '0.6rem 0.8rem', color: '#991b1b', fontSize: '0.8rem', fontWeight: 700 }}>
                    {topDupLead.conflictMessage}
                  </div>
                )}

                {/* Duplicate with another lead */}
                {topDupLead && (
                  <div className="scanner-item">
                    <div>
                      <strong>⚠️ Trùng với Lead #{topDupLead.targetLead.code} ({topDupLead.targetLead.fullName}):</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {topDupLead.reasons.join(' • ')} (Đang giao cho: {topDupLead.targetLead.assignedTo?.name})
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-warning btn-sm"
                      onClick={() => onFastTrackMerge(topDupLead.targetLead, formData)}
                      style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                    >
                      Gộp Với #{topDupLead.targetLead.code}
                    </button>
                  </div>
                )}

                {/* Match with existing Customer */}
                {topMatchedCust && (
                  <div className="scanner-item" style={{ borderColor: '#ddd6fe' }}>
                    <div>
                      <strong style={{ color: '#6d28d9' }}>🏢 Trùng với Khách hàng VIP: {topMatchedCust.customer.name} ({topMatchedCust.customer.id})</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {topMatchedCust.recommendation}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm"
                      style={{ background: '#7c3aed', color: 'white', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                      onClick={() => onFastTrackAttach(topMatchedCust.customer, formData)}
                    >
                      Gắn Vào {topMatchedCust.customer.id}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Đóng
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Lưu Lead Vào CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
