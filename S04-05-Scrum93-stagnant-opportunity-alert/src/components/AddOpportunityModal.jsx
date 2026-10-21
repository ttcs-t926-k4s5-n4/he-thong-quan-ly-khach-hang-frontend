import React, { useState } from 'react';
import { PlusCircle, X, Check } from 'lucide-react';
import { CURRENT_SYSTEM_DATE } from '../data/mockOpportunities.js';
import { MOCK_USERS } from '../data/mockUsers.js';

export const AddOpportunityModal = ({
  isOpen,
  onClose,
  onAddOpportunity,
  stageThresholds
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [industry, setIndustry] = useState('Công nghệ & Phần mềm');
  const [value, setValue] = useState(300000000);
  const [stage, setStage] = useState('PROPOSAL');
  const [expectedCloseDate, setExpectedCloseDate] = useState('2026-10-25');
  const [lastActivityDate, setLastActivityDate] = useState('2026-10-10');
  const [lastActivityType, setLastActivityType] = useState('Gửi Email Báo Giá');
  const [salesRepId, setSalesRepId] = useState('USR-REP-01');

  const reps = MOCK_USERS.filter(u => u.role === 'SALES_REP');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim()) {
      alert('Vui lòng nhập tên thương vụ và tên khách hàng.');
      return;
    }

    const selectedRep = reps.find(r => r.id === salesRepId) || reps[0];

    const newDeal = {
      id: `OPP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      customerName: customerName.trim(),
      industry,
      value: Number(value) || 0,
      stage,
      expectedCloseDate,
      lastActivityDate,
      lastActivityType,
      lastActivityNote: 'Vừa được tạo mới trên hệ thống.',
      salesRepId: selectedRep.id,
      salesRepName: selectedRep.name,
      salesRepAvatar: selectedRep.avatar,
      teamId: selectedRep.teamId,
      createdAt: CURRENT_SYSTEM_DATE,
      interventions: [],
      activities: [
        {
          date: lastActivityDate,
          type: lastActivityType,
          author: selectedRep.name,
          content: 'Khởi tạo cơ hội bán hàng.'
        }
      ]
    };

    onAddOpportunity(newDeal);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <PlusCircle size={20} style={{ color: '#f59e0b' }} />
            <span>Tạo Cơ Hội Mới (Thử Nghiệm Gắn Cờ Đình Trệ)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tên Thương Vụ / Dự Án:</label>
              <input 
                type="text"
                className="form-control"
                placeholder="Ví dụ: Triển khai Cổng thanh toán B2B..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Tên Khách Hàng / Doanh Nghiệp:</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Công ty CP Bán lẻ Á Châu..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ngành Nghề:</label>
                <input 
                  type="text"
                  className="form-control"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Giá Trị Thương Vụ (VNĐ):</label>
                <input 
                  type="number"
                  className="form-control"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  step="10000000"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Giai Đoạn Bán Hàng:</label>
                <select 
                  className="form-control"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  <option value="QUALIFICATION">Khảo sát &amp; Đánh giá nhu cầu</option>
                  <option value="SOLUTION_DEMO">Giải pháp &amp; Demo POC</option>
                  <option value="PROPOSAL">Gửi Báo Giá &amp; Đề Xuất</option>
                  <option value="NEGOTIATION">Thương Thảo Hợp Đồng</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Ngày Hoạt Động Gần Nhất (AC1):</label>
                <input 
                  type="date"
                  className="form-control"
                  value={lastActivityDate}
                  onChange={(e) => setLastActivityDate(e.target.value)}
                  title="Nếu chọn ngày cách đây nhiều hơn ngưỡng N ngày của giai đoạn, deal sẽ bị gắn cờ đình trệ"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Hôm nay: {CURRENT_SYSTEM_DATE}. Nếu ngày này &gt; N ngày trước sẽ bị gắn cờ!
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Ngày Dự Kiến Chốt (AC2):</label>
                <input 
                  type="date"
                  className="form-control"
                  value={expectedCloseDate}
                  onChange={(e) => setExpectedCloseDate(e.target.value)}
                  title="Nếu ngày này trước ngày hôm nay, deal sẽ bị gắn cờ quá hạn chốt"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Nếu chọn ngày trước {CURRENT_SYSTEM_DATE} sẽ bị gắn cờ quá hạn chốt!
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nhân Viên Kinh Doanh Phụ Trách:</label>
              <select 
                className="form-control"
                value={salesRepId}
                onChange={(e) => setSalesRepId(e.target.value)}
              >
                {reps.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} - {r.roleTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Thêm Cơ Hội &amp; Đánh Giá Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
