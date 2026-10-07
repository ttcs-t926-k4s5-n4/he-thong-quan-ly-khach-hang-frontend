import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  AlertTriangle,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  GitMerge,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { checkDuplicateForCandidate } from '../utils/duplicateDetector';

export function NewCustomerModal({
  existingCustomers,
  currentUser,
  onClose,
  onCreateCustomer,
  onOpenMergeWithExisting
}) {
  const [formData, setFormData] = useState({
    name: '',
    taxCode: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    industry: 'Công nghệ thông tin',
    ownerName: currentUser.name,
    ownerTeam: currentUser.team
  });

  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Quét thời gian thực mỗi khi người dùng thay đổi Tên, MST hoặc Website
  useEffect(() => {
    if (!formData.name && !formData.taxCode && !formData.website) {
      setDuplicateWarning(null);
      return;
    }

    const candidate = {
      name: formData.name,
      taxCode: formData.taxCode,
      website: formData.website
    };

    const result = checkDuplicateForCandidate(candidate, existingCustomers);
    setDuplicateWarning(result);
  }, [formData.name, formData.taxCode, formData.website, existingCustomers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newCustomer = {
      id: `KH-${String(Date.now()).slice(-3)}`,
      code: formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8),
      name: formData.name,
      taxCode: formData.taxCode,
      website: formData.website,
      phone: formData.phone || '024 1234 5678',
      email: formData.email || 'contact@company.com',
      address: formData.address || 'Hà Nội, Việt Nam',
      industry: formData.industry,
      employeeCount: 50,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerTeam: currentUser.team,
      status: 'Mới tiếp cận',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      lastContactDate: new Date().toLocaleDateString('vi-VN'),
      contacts: [
        {
          id: `CT-${Date.now()}`,
          name: 'Đầu mối liên hệ ban đầu',
          title: 'Đại diện doanh nghiệp',
          email: formData.email,
          phone: formData.phone,
          isPrimary: true,
          sourceCustomerId: `KH-${String(Date.now()).slice(-3)}`
        }
      ],
      deals: [],
      activities: [
        {
          id: `ACT-${Date.now()}`,
          type: 'NOTE',
          title: 'Khởi tạo hồ sơ khách hàng mới',
          content: `Nhân viên ${currentUser.name} khởi tạo hồ sơ vào hệ thống CRM.`,
          date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          creatorName: currentUser.name,
          sourceCustomerId: `KH-${String(Date.now()).slice(-3)}`
        }
      ]
    };

    onCreateCustomer(newCustomer);
  };

  // Nạp nhanh dữ liệu thử nghiệm để demo phát hiện trùng tức thì
  const handleLoadSampleDuplicate = () => {
    setFormData({
      name: 'Công ty Cổ phần Công nghệ FPT (Chi nhánh mới)',
      taxCode: '0101248141',
      website: 'www.fpt.com.vn',
      phone: '024 7300 8888',
      email: 'fpt-branch@fpt.com.vn',
      address: 'Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
      industry: 'Công nghệ thông tin & Viễn thông',
      ownerName: currentUser.name,
      ownerTeam: currentUser.team
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h3>
              <UserPlus size={20} style={{ color: 'var(--primary)' }} />
              <span>Thêm Khách Hàng Mới & Kiểm Tra Trùng Tức Thì</span>
            </h3>
            <p>Hệ thống tự động quét MST, Tên công ty và Website ngay khi nhập liệu để ngăn chặn hai nhân viên cùng chào một công ty.</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Nút giả lập nạp dữ liệu trùng */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-pill"
                onClick={handleLoadSampleDuplicate}
                style={{ fontSize: '0.75rem', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.4)' }}
              >
                ⚡ Nhập nhanh dữ liệu mẫu để thử cảnh báo trùng (FPT)
              </button>
            </div>

            {/* CẢNH BÁO TRÙNG THỜI GIAN THỰC (LIVE DEDUPLICATION ALERT) */}
            {duplicateWarning && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 700 }}>
                  <AlertTriangle size={18} />
                  <span>CẢNH BÁO: Phát hiện khách hàng có thể đã tồn tại ({duplicateWarning.report.score}% Trùng khớp)!</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Trùng với khách hàng:{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    [{duplicateWarning.matchedCustomer.id}] {duplicateWarning.matchedCustomer.name}
                  </strong>
                  <br />
                  Người đang phụ trách:{' '}
                  <strong style={{ color: '#60a5fa' }}>
                    {duplicateWarning.matchedCustomer.ownerName} ({duplicateWarning.matchedCustomer.ownerTeam})
                  </strong>
                  <br />
                  Lý do cảnh báo: <em>{duplicateWarning.report.reasons.join(', ')}</em>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    className="btn-pill btn-primary"
                    style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => {
                      onOpenMergeWithExisting(
                        duplicateWarning.matchedCustomer,
                        {
                          ...formData,
                          id: 'KH-NEW',
                          contacts: [],
                          deals: [],
                          activities: []
                        },
                        duplicateWarning.report
                      );
                    }}
                  >
                    <GitMerge size={14} />
                    <span>Xem so sánh & Đề xuất gộp hồ sơ</span>
                  </button>
                </div>
              </div>
            )}

            {/* Trường Tên Doanh Nghiệp */}
            <div>
              <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                Tên Công Ty / Doanh Nghiệp *
              </label>
              <input
                type="text"
                className="role-select"
                style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                placeholder="Ví dụ: Công ty Cổ phần Công nghệ Thông tin FPT"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Hàng 2: Mã số thuế & Website */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                  Mã Số Thuế (MST) *
                </label>
                <input
                  type="text"
                  className="role-select mono"
                  style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                  placeholder="Ví dụ: 0101248141"
                  value={formData.taxCode}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                  Website Doanh Nghiệp
                </label>
                <input
                  type="text"
                  className="role-select"
                  style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                  placeholder="Ví dụ: fpt.com.vn"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            {/* Hàng 3: Điện thoại & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                  Số Điện Thoại Trụ Sở
                </label>
                <input
                  type="text"
                  className="role-select"
                  style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                  placeholder="Ví dụ: 024 7300 7300"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                  Email Doanh Nghiệp
                </label>
                <input
                  type="email"
                  className="role-select"
                  style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Địa chỉ trụ sở */}
            <div>
              <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                Địa Chỉ Trụ Sở
              </label>
              <input
                type="text"
                className="role-select"
                style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Ngành nghề */}
            <div>
              <label className="field-label" style={{ marginBottom: '0.3rem', display: 'block' }}>
                Lĩnh Vực / Ngành Nghề
              </label>
              <select
                className="role-select"
                style={{ width: '100%', padding: '0.6rem 0.85rem' }}
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="Công nghệ thông tin & Viễn thông">Công nghệ thông tin & Viễn thông</option>
                <option value="Sản xuất & Tiêu dùng nhanh (FMCG)">Sản xuất & Tiêu dùng nhanh (FMCG)</option>
                <option value="Tài chính & Ngân hàng">Tài chính & Ngân hàng</option>
                <option value="Bất động sản & Xây dựng">Bất động sản & Xây dựng</option>
                <option value="Y tế & Dược phẩm">Y tế & Dược phẩm</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-pill" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn-pill btn-primary">
              <CheckCircle size={15} />
              <span>Xác nhận tạo hồ sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
