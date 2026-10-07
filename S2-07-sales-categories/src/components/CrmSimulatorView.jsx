import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Building, 
  Users, 
  Briefcase, 
  Calendar, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { formatVND } from '../utils/referenceUtils';

export default function CrmSimulatorView({
  categoryItems,
  operationalData,
  onAddNewLead,
  onAddNewCustomer,
  onSwitchToCategories
}) {
  const [activeFormType, setActiveFormType] = useState('LEAD'); // 'LEAD' | 'CUSTOMER'

  const { industries = [], company_sizes = [], lead_sources = [], activity_types = [] } = categoryItems;

  // Active items sorted by sortOrder
  const activeIndustries = industries.filter(i => i.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeCompanySizes = company_sizes.filter(i => i.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeLeadSources = lead_sources.filter(i => i.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  // Form Lead State
  const [leadForm, setLeadForm] = useState({
    name: '',
    title: 'Trưởng phòng Mua hàng',
    company: '',
    industryId: activeIndustries[0]?.id || '',
    companySizeId: activeCompanySizes[0]?.id || '',
    leadSourceId: activeLeadSources[0]?.id || '',
    estimatedValue: 500000000,
    assignedTo: 'Nguyễn Văn An (Giám Đốc)'
  });

  const [createdSuccessMsg, setCreatedSuccessMsg] = useState('');

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.company) {
      alert('Vui lòng nhập họ tên người liên hệ và tên doanh nghiệp!');
      return;
    }

    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: leadForm.name,
      title: leadForm.title,
      company: leadForm.company,
      industryId: leadForm.industryId,
      companySizeId: leadForm.companySizeId,
      leadSourceId: leadForm.leadSourceId,
      estimatedValue: Number(leadForm.estimatedValue),
      status: 'Qualified',
      assignedTo: leadForm.assignedTo,
      createdDate: new Date().toISOString().split('T')[0]
    };

    onAddNewLead(newLead);
    setCreatedSuccessMsg(`Đã tạo thành công Lead "${leadForm.name} - ${leadForm.company}"! Danh mục được chọn vừa tăng +1 tham chiếu và được hệ thống tự động khóa xóa để bảo vệ toàn vẹn.`);
    setLeadForm({
      name: '',
      title: 'Trưởng phòng Mua hàng',
      company: '',
      industryId: activeIndustries[0]?.id || '',
      companySizeId: activeCompanySizes[0]?.id || '',
      leadSourceId: activeLeadSources[0]?.id || '',
      estimatedValue: 500000000,
      assignedTo: 'Nguyễn Văn An (Giám Đốc)'
    });

    setTimeout(() => setCreatedSuccessMsg(''), 8000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div className="content-box" style={{ padding: '1.5rem 1.75rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', marginBottom: '0.4rem' }}>
              Mô Phỏng Nhập Liệu Thực Tế
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Kiểm Chứng Dropdown Bán Hàng & Ràng Buộc Khóa Xóa</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.2rem' }}>
              Thử tạo một bản ghi bán hàng mới để kiểm tra: (1) Thứ tự các lựa chọn trong dropdown tuân thủ đúng thứ tự sắp xếp; (2) Khi một mục danh mục được chọn, số lượng tham chiếu tăng lên và nút Xóa của mục đó sẽ lập tức bị khóa!
            </p>
          </div>

          <button 
            className="btn btn-outline"
            onClick={onSwitchToCategories}
          >
            <span>Quay lại Quản Lý Danh Mục →</span>
          </button>
        </div>
      </div>

      {createdSuccessMsg && (
        <div className="alert-box alert-success" style={{ animation: 'slideUp 0.3s ease' }}>
          <Check size={20} style={{ flexShrink: 0 }} />
          <div style={{ fontWeight: 600 }}>{createdSuccessMsg}</div>
        </div>
      )}

      {/* Main Grid: Form on Left, Current Records on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem' }}>
        {/* Form nhập liệu */}
        <div className="content-box">
          <div className="content-box-header">
            <div className="box-title-row">
              <Users size={20} color="var(--primary)" />
              <h3 className="box-title">Form Đăng Ký Đầu Mối Bán Hàng (Lead Intake)</h3>
            </div>
            <span className="code-tag">CRM Sandbox</span>
          </div>

          <form onSubmit={handleCreateLead} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Họ và tên người liên hệ <span style={{ color: 'var(--danger)' }}>*</span></span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Trần Đình Trọng"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Tên công ty / Doanh nghiệp <span style={{ color: 'var(--danger)' }}>*</span></span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Tập đoàn Thủy sản Minh Phú"
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Dropdown 1: Ngành nghề khách hàng (Tiêu chí 1 & 3) */}
            <div className="form-group">
              <label className="form-label">
                <span>Ngành nghề khách hàng (Sắp xếp theo cấu hình) <span style={{ color: 'var(--danger)' }}>*</span></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Cập nhật theo thứ tự Sort Order</span>
              </label>
              <select 
                className="select-custom"
                value={leadForm.industryId}
                onChange={(e) => setLeadForm({ ...leadForm, industryId: e.target.value })}
              >
                {activeIndustries.map(ind => (
                  <option key={ind.id} value={ind.id}>
                    {ind.sortOrder}. {ind.name} ({ind.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown 2 & 3: Quy mô DN & Nguồn Lead */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Quy mô doanh nghiệp <span style={{ color: 'var(--danger)' }}>*</span></span>
                </label>
                <select 
                  className="select-custom"
                  value={leadForm.companySizeId}
                  onChange={(e) => setLeadForm({ ...leadForm, companySizeId: e.target.value })}
                >
                  {activeCompanySizes.map(size => (
                    <option key={size.id} value={size.id}>
                      {size.sortOrder}. {size.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Nguồn lead tiếp cận <span style={{ color: 'var(--danger)' }}>*</span></span>
                </label>
                <select 
                  className="select-custom"
                  value={leadForm.leadSourceId}
                  onChange={(e) => setLeadForm({ ...leadForm, leadSourceId: e.target.value })}
                >
                  {activeLeadSources.map(src => (
                    <option key={src.id} value={src.id}>
                      {src.sortOrder}. {src.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Giá trị tiềm năng */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Doanh số dự kiến (VNĐ)</span>
                </label>
                <input 
                  type="number" 
                  step="50000000"
                  className="form-input"
                  value={leadForm.estimatedValue}
                  onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Chuyên viên phụ trách</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={leadForm.assignedTo}
                  disabled
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>

            <button 
              id="btn-submit-lead"
              type="submit" 
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.75rem' }}
            >
              <Plus size={18} />
              <span>Ghi Nhận Lead & Kích Hoạt Ràng Buộc Tham Chiếu</span>
            </button>
          </form>
        </div>

        {/* Danh sách bản ghi hiện có */}
        <div className="content-box">
          <div className="content-box-header">
            <div className="box-title-row">
              <Eye size={20} color="var(--primary)" />
              <h3 className="box-title">Đầu Mối Bán Hàng Mới Nhất ({operationalData.leads?.length || 0})</h3>
            </div>
            <span className="code-tag">Dữ Liệu Đang Tham Chiếu</span>
          </div>

          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '460px', overflowY: 'auto' }}>
            {operationalData.leads?.slice(-6).reverse().map(l => {
              const ind = industries.find(i => i.id === l.industryId);
              const src = lead_sources.find(s => s.id === l.leadSourceId);

              return (
                <div key={l.id} style={{ background: 'var(--bg-muted)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {l.name} &bull; <span style={{ color: 'var(--text-secondary)' }}>{l.company}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {ind && (
                        <span className="code-tag" style={{ color: ind.color, borderColor: ind.color }}>
                          {ind.name}
                        </span>
                      )}
                      {src && (
                        <span className="code-tag" style={{ color: src.color }}>
                          {src.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.85rem' }}>
                      {formatVND(l.estimatedValue)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      🔒 Khóa xóa danh mục
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
