import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { 
  formatDateISO, 
  timeToMinutes, 
  findAvailableSlots 
} from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function NewEventModal({
  initialDate,
  initialTime,
  initialUserId,
  existingEvents,
  onClose,
  onCreateEvent,
  onOpenSlotFinder
}) {
  const [type, setType] = useState('MEETING'); // 'MEETING' or 'TASK'
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate ? formatDateISO(initialDate) : '2026-10-19');
  const [startTime, setStartTime] = useState(initialTime || '09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState('HIGH');
  const [meetingType, setMeetingType] = useState('CLIENT_OFFICE');
  const [location, setLocation] = useState('Trụ sở khách hàng');
  const [company, setCompany] = useState('');
  const [clientName, setClientName] = useState('');
  const [attendees, setAttendees] = useState(initialUserId ? [initialUserId] : ['USR-REP-01']);
  const [assignedTo, setAssignedTo] = useState(initialUserId || 'USR-REP-01');
  const [notes, setNotes] = useState('');

  // Kiểm tra xung đột thời gian thực (Real-time collision detection)
  const [conflictWarning, setConflictWarning] = useState(null);

  useEffect(() => {
    if (type !== 'MEETING') {
      setConflictWarning(null);
      return;
    }

    const startM = timeToMinutes(startTime);
    const endM = timeToMinutes(endTime);

    if (startM >= endM) {
      setConflictWarning({ type: 'INVALID_TIME', msg: 'Giờ kết thúc phải sau giờ bắt đầu' });
      return;
    }

    // Quét các cuộc họp đã có trong ngày
    const collisions = [];
    for (const m of existingEvents) {
      if (m.date !== date || m.type !== 'MEETING' || m.status === 'CANCELLED') continue;

      const mStart = timeToMinutes(m.startTime);
      const mEnd = timeToMinutes(m.endTime);

      if (startM < mEnd && endM > mStart) {
        // Kiểm tra xem có thành viên nào trùng nhau không
        const overlapUsers = (m.attendees || []).filter(uId => attendees.includes(uId));
        if (overlapUsers.length > 0) {
          collisions.push({
            event: m,
            users: overlapUsers
          });
        }
      }
    }

    if (collisions.length > 0) {
      const collidingUserNames = collisions[0].users
        .map(uId => MOCK_USERS.find(u => u.id === uId)?.name)
        .filter(Boolean)
        .join(', ');

      setConflictWarning({
        type: 'OVERLAP',
        msg: `Trùng lịch! ${collidingUserNames} đã có cuộc họp "${collisions[0].event.title}" (${collisions[0].event.startTime} - ${collisions[0].event.endTime}).`
      });
    } else {
      setConflictWarning(null);
    }
  }, [type, date, startTime, endTime, attendees, existingEvents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề sự kiện');
      return;
    }

    const newEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      type,
      title: title.trim(),
      date,
      company: company.trim(),
      clientName: clientName.trim(),
      notes: notes.trim(),
      ...(type === 'MEETING' ? {
        startTime,
        endTime,
        meetingType,
        location: location.trim(),
        attendees,
        status: 'CONFIRMED'
      } : {
        dueTime,
        priority,
        assignedTo,
        status: 'TODO'
      })
    };

    onCreateEvent(newEvent);
    onClose();
  };

  const toggleAttendee = (uId) => {
    if (attendees.includes(uId)) {
      if (attendees.length > 1) {
        setAttendees(attendees.filter(id => id !== uId));
      }
    } else {
      setAttendees([...attendees, uId]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              SCRUM-101
            </span>
            <h3 className="modal-title">Bố Trí Lịch Gặp & Công Việc Mới</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Chuyển loại: Cuộc gặp vs Việc có hạn */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${type === 'MEETING' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setType('MEETING')}
                style={{ justifyContent: 'center' }}
              >
                <CalendarIcon size={16} />
                <span>Cuộc Gặp Đã Đặt</span>
              </button>

              <button
                type="button"
                className={`btn ${type === 'TASK' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setType('TASK')}
                style={{ justifyContent: 'center' }}
              >
                <CheckSquare size={16} />
                <span>Công Việc Có Hạn</span>
              </button>
            </div>

            {/* Cảnh báo xung đột thời gian thực */}
            {conflictWarning && (
              <div 
                style={{
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontSize: '0.82rem' }}>
                  <AlertTriangle size={18} color="var(--danger-border)" />
                  <span>{conflictWarning.msg}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '4px 8px', borderColor: 'var(--danger-border)', color: '#fca5a5' }}
                  onClick={() => {
                    const freeSlots = findAvailableSlots({
                      events: existingEvents,
                      attendeeIds: attendees,
                      date,
                      durationMinutes: 60
                    });
                    if (freeSlots.length > 0) {
                      setStartTime(freeSlots[0].startTime);
                      setEndTime(freeSlots[0].endTime);
                    } else {
                      alert('Không tìm thấy khung giờ trống trong ngày này. Hãy thử đổi ngày khác.');
                    }
                  }}
                >
                  <Sparkles size={13} />
                  <span>Đổi Sang Giờ Rảnh</span>
                </button>
              </div>
            )}

            {/* Tiêu đề */}
            <div className="form-group">
              <label className="form-label">Tiêu Đề Sự Kiện *</label>
              <input
                type="text"
                className="form-input"
                placeholder={type === 'MEETING' ? 'Vd: Demo giải pháp CRM Cloud cho Viettel' : 'Vd: Soạn báo giá gói 1.8 tỷ cho Techcombank'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Ngày & Thời gian */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ngày Thực Hiện *</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {type === 'MEETING' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">Bắt Đầu</label>
                    <input
                      type="time"
                      className="form-input"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kết Thúc</label>
                    <input
                      type="time"
                      className="form-input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Hạn Chót Hoàn Thành</label>
                  <input
                    type="time"
                    className="form-input"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Khách hàng & Công ty */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên Công Ty / Doanh Nghiệp</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Vd: Viettel Telecom, Vinamilk, Techcombank..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Người Liên Hệ / Đại Diện</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Vd: Anh Vũ Đình Long - Phó GĐ CNTT"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>

            {/* Thông tin riêng cho Cuộc họp: Thành viên tham gia */}
            {type === 'MEETING' ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hình Thức Họp</label>
                    <select
                      className="form-select"
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                    >
                      <option value="CLIENT_OFFICE">Tại trụ sở khách hàng</option>
                      <option value="ONLINE">Họp trực tuyến (Teams/Meet/Zoom)</option>
                      <option value="INTERNAL">Họp nội bộ nhóm</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Địa Điểm / Link Cuộc Họp</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Vd: Tòa nhà Keangnam Hà Nội hoặc meet.google.com/xyz"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Thành Viên Nhóm Tham Gia (Chọn nhiều để phối hợp)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MOCK_USERS.map(u => {
                      const isPicked = attendees.includes(u.id);
                      return (
                        <div
                          key={u.id}
                          onClick={() => toggleAttendee(u.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '999px',
                            background: isPicked ? 'var(--primary)' : 'var(--bg-tertiary)',
                            color: isPicked ? '#fff' : 'var(--text-primary)',
                            border: `1px solid ${isPicked ? 'var(--primary)' : 'var(--border-light)'}`,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <img src={u.avatar} alt={u.name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                          <span>{u.name}</span>
                          {isPicked && <Check size={14} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Thông tin riêng cho Công việc có hạn */
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Mức Độ Ưu Tiên</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="URGENT">Khẩn cấp (Hôm nay)</option>
                    <option value="HIGH">Cao</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="LOW">Thấp</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Giao Cho Thành Viên</label>
                  <select
                    className="form-select"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    {MOCK_USERS.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Ghi chú */}
            <div className="form-group">
              <label className="form-label">Ghi Chú Nội Dung Chuẩn Bị</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Vd: Chuẩn bị slide báo cáo, tài liệu kiến trúc kỹ thuật hoặc báo giá đính kèm..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Xác Nhận Đặt Lịch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
