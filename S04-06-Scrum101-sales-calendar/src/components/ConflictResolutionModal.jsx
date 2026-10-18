import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  Check, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';

export default function ConflictResolutionModal({
  conflictsMap,
  events,
  onClose,
  onResolveConflict
}) {
  const conflictEventIds = Array.from(conflictsMap.keys());
  if (conflictEventIds.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Xử Lý Xung Đột Lịch</h3>
            <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Check size={40} color="var(--success-border)" style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tuyệt vời! Không còn xung đột lịch nào trong nhóm.</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    );
  }

  // Lấy cặp sự kiện xung đột đầu tiên
  const firstEventId = conflictEventIds[0];
  const e1 = events.find(e => e.id === firstEventId);
  const conflictInfo = conflictsMap.get(firstEventId)?.[0];
  const e2 = conflictInfo ? events.find(e => e.id === conflictInfo.targetEventId) : null;

  const overlappingUsers = conflictInfo?.commonUserIds?.map(uId => MOCK_USERS.find(u => u.id === uId))?.filter(Boolean) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--danger-bg)', color: 'var(--danger-border)' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="modal-title">Trung Tâm Điều Phối & Giải Quyết Xung Đột Lịch</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Bố trí lại thời gian hoặc nhân sự tham gia để lịch làm việc nhóm không bị chồng chéo
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Thân Modal */}
        <div className="modal-body">
          {/* Nhân viên bị trùng lịch */}
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-border)', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="var(--danger-border)" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fca5a5' }}>
                Thành viên bị trùng 2 lịch cùng lúc:{' '}
                {overlappingUsers.map(u => u.name).join(', ')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '2px' }}>
                Khung giờ chồng chéo {conflictInfo?.overlapMinutes || 60} phút vào ngày {e1?.date}
              </div>
            </div>
          </div>

          {/* So sánh 2 sự kiện xung đột */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '8px' }}>
            {/* Sự kiện 1 */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--meeting-color)' }}>
                SỰ KIỆN 1 (ƯU TIÊN KHÁCH HÀNG)
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{e1?.title}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{e1?.startTime} - {e1?.endTime}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                🏢 {e1?.company} ({e1?.clientName})
              </div>
            </div>

            {/* Sự kiện 2 */}
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--danger-border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger-border)' }}>
                SỰ KIỆN 2 (ĐANG BỊ TRÙNG GIỜ)
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{e2?.title}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{e2?.startTime} - {e2?.endTime}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                🏢 {e2?.company || 'Nội bộ'}
              </div>
            </div>
          </div>

          {/* Các phương án giải quyết 1-Click */}
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              🎯 Các Phương Án Giải Quyết Khuyến Nghị (1-Click Action):
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {/* Phương án 1: Dời sang buổi chiều */}
              <div 
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Phương án 1: Dời Sự kiện 2 sang 14:00 - 15:30 (Khung giờ rảnh chiều)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Cả nhóm đều rảnh, không làm ảnh hưởng đến buổi gặp khách hàng Techcombank.
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    onResolveConflict({
                      action: 'RESCHEDULE',
                      targetEventId: e2.id,
                      newStartTime: '14:00',
                      newEndTime: '15:30'
                    });
                    onClose();
                  }}
                >
                  <Sparkles size={14} />
                  <span>Áp Dụng Dời Giờ</span>
                </button>
              </div>

              {/* Phương án 2: Chuyển giao người thay thế */}
              <div 
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Phương án 2: Chuyển giao Nguyễn Văn An sang cho Trần Thị Mai thay thế
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Mai đang rảnh trong khung giờ này và đủ năng lực phụ trách thay An.
                  </div>
                </div>

                <button 
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                  onClick={() => {
                    onResolveConflict({
                      action: 'REASSIGN_ATTENDEE',
                      targetEventId: e2.id,
                      removeUserId: 'USR-REP-01',
                      addUserId: 'USR-REP-02'
                    });
                    onClose();
                  }}
                >
                  <UserCheck size={14} />
                  <span>Đổi Nhân Sự Thay Thế</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
