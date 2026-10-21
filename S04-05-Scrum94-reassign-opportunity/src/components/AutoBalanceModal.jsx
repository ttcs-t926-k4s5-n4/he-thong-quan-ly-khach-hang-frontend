import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Sparkles, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { REASSIGNMENT_REASONS } from '../data/mockReassignmentReasons';
import { formatCurrency } from '../utils/formatters';

export const AutoBalanceModal = ({
  isOpen,
  onClose,
  dealIds = [],
  opportunities = [],
  teamWorkload = [],
  currentPersona,
  onConfirmAutoBalance
}) => {
  if (!isOpen || dealIds.length === 0) return null;

  const selectedDeals = opportunities.filter((o) => dealIds.includes(o.id));
  const totalValue = selectedDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  // Lọc các nhân sự có thể nhận deal (không nghỉ, không quá tải)
  const availableReps = teamWorkload.filter(
    (u) => u.role === 'SALES_REP' && !u.isOnLeave && u.dynamicStatus !== 'OVERLOADED'
  );

  const [selectedReasonId, setSelectedReasonId] = useState('OVERLOAD');
  const [handoverNotes, setHandoverNotes] = useState(
    'Tự động phân bổ lại để cân bằng khối lượng công việc, giải phóng áp lực cho nhân sự quá tải hoặc đang nghỉ phép.'
  );

  const handleConfirm = () => {
    const reasonData = REASSIGNMENT_REASONS.find((r) => r.id === selectedReasonId) || REASSIGNMENT_REASONS[2];
    onConfirmAutoBalance({
      dealIds,
      candidateReps: availableReps,
      reasonData,
      handoverNotes,
      checklist: [
        'Hệ thống tự động phân bổ theo thuật toán chia đều cơ hội (Round-robin / Workload-minimized)',
        'Đã gửi thông báo cho từng người nhận mới',
        'Lịch sử tương tác và ghi chú được bảo toàn nguyên vẹn'
      ],
      initiator: currentPersona
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Zap size={20} color="#10b981" />
            <span>Cân Bằng Tải Tự Động (Smart Workload Balancing)</span>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <Sparkles size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Thuật toán phân bổ thông minh:</strong> Hệ thống sẽ tự động phân bổ 
              <strong> {selectedDeals.length} cơ hội</strong> (Tổng trị giá: <strong>{formatCurrency(totalValue)}</strong>) 
              lần lượt cho các thành viên có khối lượng công việc thấp nhất hiện tại nhằm đạt trạng thái cân bằng tải tối ưu.
            </div>
          </div>

          {/* Danh sách người nhận dự kiến */}
          <div className="form-group">
            <label className="form-label">
              Các nhân viên sẵn sàng tiếp nhận ({availableReps.length} nhân sự):
            </label>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: 'var(--bg-tertiary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              {availableReps.map((rep) => (
                <div 
                  key={rep.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={rep.avatar} 
                      alt={rep.name} 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <span><strong>{rep.name}</strong> ({rep.roleTitle.split(' (')[0]})</span>
                  </div>
                  <span style={{ color: '#10b981' }}>
                    Đang giữ {rep.activeDealCount} deals (Tải {rep.workloadPercent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lý do chuyển nhượng */}
          <div className="form-group">
            <label className="form-label">
              Lý do phân bổ (Ghi vào nhật ký kiểm toán):
            </label>
            <select 
              className="form-select"
              value={selectedReasonId}
              onChange={(e) => setSelectedReasonId(e.target.value)}
            >
              <option value="OVERLOAD">⚡ San sẻ khối lượng công việc do nhân viên quá tải</option>
              <option value="LEAVE_EXTENDED">🚨 Phân tán rủi ro do nhân viên nghỉ phép dài ngày</option>
              <option value="SKILL_FIT">🎯 Tối ưu hóa phân bổ theo tỷ lệ thắng của nhóm</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú chỉ đạo chung:</label>
            <textarea 
              className="form-textarea"
              rows={2}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Hủy Bỏ
          </button>
          <button className="btn btn-success" onClick={handleConfirm}>
            <Zap size={16} />
            <span>Tiến Hành Phân Bổ Tự Động ({selectedDeals.length} Deals)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
