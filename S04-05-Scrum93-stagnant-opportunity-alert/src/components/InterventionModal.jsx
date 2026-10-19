import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MessageSquare, 
  Users, 
  UserCheck, 
  FileText, 
  X, 
  Check, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { formatVND, formatDateVN } from '../utils/formatters.js';

export const InterventionModal = ({
  isOpen,
  onClose,
  opportunity,
  onSaveIntervention
}) => {
  if (!isOpen || !opportunity) return null;

  const [interventionType, setInterventionType] = useState('PING_REP');
  const [noteContent, setNoteContent] = useState('');
  const [selectedNewRep, setSelectedNewRep] = useState('USR-REP-01');

  // Mẫu câu chỉ đạo nhanh (Quick Templates)
  const quickTemplates = {
    PING_REP: `Deal ${opportunity.id} (${opportunity.customerName}) đã đình trệ ${opportunity.daysSinceLastActivity} ngày. Yêu cầu bạn liên hệ trực tiếp với người có quyền quyết định trong hôm nay và báo cáo lại kết quả trước 17h00.`,
    DEAL_RESCUE_MEETING: `Trưởng nhóm sẽ cùng bạn tham gia cuộc họp 3 bên với Ban Giám Đốc ${opportunity.customerName} vào 9h00 sáng mai để tháo gỡ điểm nghẽn về giá và tiến độ triển khai.`,
    REASSIGN_REP: `Chuyển giao thương vụ này cho nhân sự có kinh nghiệm ngành y tế/dược phẩm để tăng tốc chốt hợp đồng trước cuối tháng.`,
    STRATEGY_NOTE: `Đồng ý phê duyệt mức chiết khấu thêm 5% và tặng thêm 6 tháng bảo trì nếu khách hàng đồng ý ký hợp đồng và thanh toán đợt 1 trước ngày 25/10.`
  };

  const handleSelectType = (type) => {
    setInterventionType(type);
    setNoteContent(quickTemplates[type]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      alert('Vui lòng nhập nội dung chỉ đạo can thiệp.');
      return;
    }

    const newIntervention = {
      id: `INT-${Date.now()}`,
      type: interventionType,
      title: 
        interventionType === 'PING_REP' ? 'Nhắc nhở Sales Rep cập nhật' :
        interventionType === 'DEAL_RESCUE_MEETING' ? 'Họp giải cứu thương vụ 3 bên' :
        interventionType === 'REASSIGN_REP' ? 'Chuyển giao người phụ trách' : 'Chỉ đạo chiến lược Trưởng nhóm',
      author: 'Trần Đình Trọng (Trưởng nhóm)',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content: noteContent.trim(),
      newRepId: interventionType === 'REASSIGN_REP' ? selectedNewRep : null
    };

    onSaveIntervention(opportunity.id, newIntervention);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ShieldAlert size={20} style={{ color: '#f59e0b' }} />
            <span>Trưởng Nhóm Can Thiệp Sớm Vào Thương Vụ (AC3)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Tóm tắt tình trạng thương vụ cần can thiệp */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {opportunity.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Khách hàng: <strong>{opportunity.customerName}</strong> • Phụ trách: <strong>{opportunity.salesRepName}</strong>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>
                    {formatVND(opportunity.value)}
                  </div>
                  <span className="badge badge-flag-dual" style={{ marginTop: '0.25rem' }}>
                    {opportunity.flagReasons[0] || 'Cảnh báo đình trệ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chọn hình thức can thiệp sớm */}
            <div className="form-group">
              <label className="form-label">Chọn Hành Động Can Thiệp Sớm Của Trưởng Nhóm:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                <button
                  type="button"
                  className={`btn ${interventionType === 'PING_REP' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
                  onClick={() => handleSelectType('PING_REP')}
                >
                  <MessageSquare size={16} />
                  <span>1. Nhắc nhở khẩn Rep</span>
                </button>

                <button
                  type="button"
                  className={`btn ${interventionType === 'DEAL_RESCUE_MEETING' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
                  onClick={() => handleSelectType('DEAL_RESCUE_MEETING')}
                >
                  <Users size={16} />
                  <span>2. Họp cứu deal 3 bên</span>
                </button>

                <button
                  type="button"
                  className={`btn ${interventionType === 'STRATEGY_NOTE' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
                  onClick={() => handleSelectType('STRATEGY_NOTE')}
                >
                  <FileText size={16} />
                  <span>3. Chỉ đạo chiến lược</span>
                </button>

                <button
                  type="button"
                  className={`btn ${interventionType === 'REASSIGN_REP' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
                  onClick={() => handleSelectType('REASSIGN_REP')}
                >
                  <UserCheck size={16} />
                  <span>4. Chuyển người phụ trách</span>
                </button>
              </div>
            </div>

            {/* Nếu chuyển người phụ trách */}
            {interventionType === 'REASSIGN_REP' && (
              <div className="form-group">
                <label className="form-label">Chuyển Giao Cơ Hội Cho Chuyên Viên:</label>
                <select 
                  className="form-control"
                  value={selectedNewRep}
                  onChange={(e) => setSelectedNewRep(e.target.value)}
                >
                  <option value="USR-REP-01">Nguyễn Văn An (Senior Account Executive - Enterprise)</option>
                  <option value="USR-REP-02">Trần Thị Mai (Enterprise AE)</option>
                  <option value="USR-REP-03">Lê Quốc Hưng (Account Executive - Miền Bắc)</option>
                  <option value="USR-REP-04">Hoàng Kim Chi (Account Executive - Bán lẻ)</option>
                </select>
              </div>
            )}

            {/* Nội dung chỉ đạo */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Nội Dung Can Thiệp &amp; Chỉ Đạo Chi Tiết:</label>
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary"
                  onClick={() => setNoteContent(quickTemplates[interventionType])}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  <Sparkles size={12} /> Áp dụng văn bản mẫu
                </button>
              </div>
              <textarea 
                className="form-control"
                rows="4"
                placeholder="Nhập hướng dẫn, yêu cầu cụ thể hoặc phương án hỗ trợ từ Trưởng nhóm..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            {/* Lịch sử can thiệp trước đó nếu có */}
            {opportunity.interventions && opportunity.interventions.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Lịch sử các lần can thiệp trước ({opportunity.interventions.length}):
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {opportunity.interventions.map((itv, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <strong>{itv.title} ({itv.author})</strong>
                        <span>{itv.date}</span>
                      </div>
                      <p style={{ marginTop: '0.2rem', color: 'var(--text-secondary)' }}>{itv.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Gửi Can Thiệp &amp; Lưu Chỉ Đạo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
