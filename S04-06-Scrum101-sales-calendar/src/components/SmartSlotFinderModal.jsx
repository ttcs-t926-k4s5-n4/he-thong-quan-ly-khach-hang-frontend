import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { 
  findAvailableSlots, 
  formatDateISO, 
  formatDateVietnamese 
} from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function SmartSlotFinderModal({
  currentDate,
  events,
  onClose,
  onPickSlot
}) {
  const [selectedUserIds, setSelectedUserIds] = useState(['USR-LEAD-01', 'USR-REP-01', 'USR-REP-02']);
  const [targetDate, setTargetDate] = useState(formatDateISO(currentDate));
  const [duration, setDuration] = useState(60); // minutes

  const toggleUser = (uId) => {
    if (selectedUserIds.includes(uId)) {
      if (selectedUserIds.length > 1) {
        setSelectedUserIds(selectedUserIds.filter(id => id !== uId));
      }
    } else {
      setSelectedUserIds([...selectedUserIds, uId]);
    }
  };

  // Tính toán khung giờ rảnh bằng thuật toán
  const availableSlots = findAvailableSlots({
    events,
    attendeeIds: selectedUserIds,
    date: targetDate,
    durationMinutes: duration
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="modal-title">Gợi Ý Khung Giờ Rảnh Chung Cả Nhóm</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Tự động quét lịch và tìm thời gian tất cả thành viên được chọn đều không bị trùng lặp
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Thân Modal */}
        <div className="modal-body">
          {/* Cấu hình: Ngày & Thời lượng */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chọn Ngày Cần Bố Trí Cuộc Gặp</label>
              <input
                type="date"
                className="form-input"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời Lượng Dự Kiến</label>
              <select
                className="form-select"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={30}>30 phút (Họp nhanh / Trao đổi)</option>
                <option value={45}>45 phút</option>
                <option value={60}>60 phút (Demo chuẩn / Ký kết)</option>
                <option value={90}>90 phút (Thuyết trình giải pháp sâu)</option>
                <option value={120}>2 tiếng (Hội thảo / Thẩm định kỹ thuật)</option>
              </select>
            </div>
          </div>

          {/* Chọn thành viên bắt buộc tham gia */}
          <div className="form-group">
            <label className="form-label">
              Thành Viên Cần Tham Gia ({selectedUserIds.length} người được chọn)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {MOCK_USERS.map(u => {
                const isPicked = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUser(u.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      background: isPicked ? 'var(--primary)' : 'var(--bg-tertiary)',
                      color: isPicked ? '#fff' : 'var(--text-primary)',
                      border: `1px solid ${isPicked ? 'var(--primary)' : 'var(--border-light)'}`,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img src={u.avatar} alt={u.name} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                    <span>{u.name}</span>
                    {isPicked && <Check size={14} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kết quả khung giờ rảnh */}
          <div style={{ marginTop: '8px', background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                💡 Các Khung Giờ Rảnh Phù Hợp ({availableSlots.length} khoảng trống)
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Giờ làm việc: 08:30 - 17:30 (Trừ trưa 12:00 - 13:30)
              </span>
            </div>

            {availableSlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 700 }}>Không tìm thấy khung giờ nào tất cả các thành viên đều rảnh trong ngày này.</p>
                <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>Hãy thử giảm thời lượng cuộc họp hoặc đổi sang ngày làm việc khác.</p>
              </div>
            ) : (
              <div className="slots-grid">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="slot-chip"
                    onClick={() => {
                      onPickSlot({
                        date: targetDate,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        attendees: selectedUserIds
                      });
                      onClose();
                    }}
                  >
                    <Clock size={13} style={{ marginBottom: '-2px', marginRight: '4px' }} />
                    <span>{slot.formatted}</span>
                  </button>
                ))}
              </div>
            )}
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
