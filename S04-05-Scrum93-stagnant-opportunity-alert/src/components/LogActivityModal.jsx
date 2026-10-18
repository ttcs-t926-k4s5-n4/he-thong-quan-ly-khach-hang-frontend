import React, { useState } from 'react';
import { PhoneCall, Users, Mail, Presentation, FileCheck, X, Check, Calendar } from 'lucide-react';
import { CURRENT_SYSTEM_DATE } from '../data/mockOpportunities.js';

export const LogActivityModal = ({
  isOpen,
  onClose,
  opportunity,
  onSaveActivity
}) => {
  if (!isOpen || !opportunity) return null;

  const [activityType, setActivityType] = useState('CALL');
  const [activityDate, setActivityDate] = useState(CURRENT_SYSTEM_DATE);
  const [content, setContent] = useState('');

  const activityOptions = [
    { id: 'CALL', label: 'Cuộc gọi điện thoại', icon: PhoneCall },
    { id: 'MEETING', label: 'Họp trực tiếp / Trực tuyến', icon: Users },
    { id: 'EMAIL', label: 'Gửi Email trao đổi / Báo giá', icon: Mail },
    { id: 'DEMO', label: 'Demo tính năng / Trình diễn POC', icon: Presentation },
    { id: 'CONTRACT', label: 'Đàm phán & Ký kết hợp đồng', icon: FileCheck }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung tóm tắt tương tác vừa thực hiện.');
      return;
    }

    const typeObj = activityOptions.find(o => o.id === activityType);
    const newActivity = {
      date: activityDate,
      type: activityType,
      typeLabel: typeObj ? typeObj.label : activityType,
      author: opportunity.salesRepName,
      content: content.trim()
    };

    onSaveActivity(opportunity.id, newActivity, activityDate);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <PhoneCall size={20} style={{ color: '#10b981' }} />
            <span>Ghi Nhận Hoạt Động Mới (Hâm Nóng Thương Vụ)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              ⚡ <strong>Tác động hệ thống:</strong> Ghi nhận hoạt động tương tác mới sẽ cập nhật <strong>Ngày hoạt động cuối cùng</strong> về ngày mới, qua đó <strong>tự động gỡ cờ đình trệ hoạt động &gt; N ngày</strong> nếu thương vụ không còn im ắng!
            </div>

            <div className="form-group">
              <label className="form-label">Thương Vụ:</label>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {opportunity.title} ({opportunity.customerName})
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hình Thức Tương Tác Vừa Thực Hiện:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
                {activityOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = activityType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'flex-start', padding: '0.5rem 0.65rem' }}
                      onClick={() => setActivityType(opt.id)}
                    >
                      <Icon size={14} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ngày Thực Hiện Hoạt Động:</label>
              <input 
                type="date"
                className="form-control"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nội Dung Tóm Tắt Tương Tác:</label>
              <textarea 
                className="form-control"
                rows="3"
                placeholder="Ví dụ: Đã gọi điện trao đổi với Giám đốc tài chính, thống nhất điều khoản bảo hành 24 tháng..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: '#10b981' }}>
              <Check size={16} />
              <span>Lưu Hoạt Động &amp; Cập Nhật Cờ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
