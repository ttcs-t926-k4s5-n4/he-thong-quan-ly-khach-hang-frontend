import React from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock, 
  MapPin, 
  Video, 
  Building2, 
  User, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink 
} from 'lucide-react';
import { formatDateVietnamese } from '../utils/calendarUtils';
import { MOCK_USERS } from '../data/mockUsers';

export default function EventDetailModal({
  event,
  conflictsMap,
  onClose,
  onDeleteEvent,
  onToggleTaskComplete,
  onOpenSlotFinder
}) {
  if (!event) return null;

  const isMeeting = event.type === 'MEETING';
  const isConflict = conflictsMap.has(event.id);
  const conflictList = isConflict ? conflictsMap.get(event.id) : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`timeline-type-pill ${isMeeting ? 'meeting' : 'task'}`}>
              {isMeeting ? <CalendarIcon size={14} /> : <CheckSquare size={14} />}
              {isMeeting ? 'Chi Tiết Cuộc Gặp' : 'Chi Tiết Công Việc'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã: {event.id}</span>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Thân Modal */}
        <div className="modal-body">
          {/* Cảnh báo xung đột nếu có */}
          {isConflict && (
            <div 
              style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontWeight: 800 }}>
                <AlertTriangle size={16} />
                <span>CẢNH BÁO: Cuộc họp này đang bị trùng giờ với sự kiện khác!</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#f87171' }}>
                Trùng với sự kiện: <strong>"{conflictList[0]?.targetTitle}"</strong> ({conflictList[0]?.targetTime}).
                Vui lòng điều phối lại thời gian để các thành viên không bị chồng chéo lịch.
              </p>
              <button 
                className="btn btn-danger" 
                style={{ width: 'fit-content', marginTop: '4px', fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={() => {
                  onClose();
                  if (onOpenSlotFinder) onOpenSlotFinder();
                }}
              >
                ⚡ Tìm Giờ Rảnh Chung Để Đổi Lịch
              </button>
            </div>
          )}

          {/* Tiêu đề sự kiện */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {event.title}
          </h2>

          {/* Thời gian & Ngày */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <CalendarIcon size={16} color="var(--primary)" />
              <strong>{formatDateVietnamese(event.date)}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <Clock size={16} color="var(--task-color)" />
              <span>{isMeeting ? `${event.startTime} - ${event.endTime}` : `Hạn chót: ${event.dueTime}`}</span>
            </div>
          </div>

          {/* Khách hàng & Công ty */}
          {(event.company || event.clientName) && (
            <div className="form-group">
              <label className="form-label">Khách Hàng / Doanh Nghiệp</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <Building2 size={16} color="var(--primary)" />
                <strong>{event.company}</strong>
                {event.clientName && <span style={{ color: 'var(--text-secondary)' }}>• {event.clientName}</span>}
              </div>
            </div>
          )}

          {/* Địa điểm hoặc Link họp */}
          {event.location && (
            <div className="form-group">
              <label className="form-label">Địa Điểm / Họp Trực Tuyến</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                {event.meetingType === 'ONLINE' ? (
                  <Video size={16} color="var(--meeting-color)" />
                ) : (
                  <MapPin size={16} color="#f43f5e" />
                )}
                <span>{event.location}</span>
                {event.meetingType === 'ONLINE' && (
                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.72rem', marginLeft: 'auto' }}
                    onClick={() => alert(`Đang mở liên kết: ${event.location}`)}
                  >
                    <ExternalLink size={12} />
                    <span>Mở Link</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Người tham gia / Người phụ trách */}
          <div className="form-group">
            <label className="form-label">
              {isMeeting ? 'Thành Viên Tham Gia Cuộc Họp' : 'Người Phụ Trách Công Việc'}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {isMeeting && event.attendees ? (
                event.attendees.map(uId => {
                  const user = MOCK_USERS.find(u => u.id === uId);
                  if (!user) return null;
                  return (
                    <div key={uId} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                      <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${user.color}` }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.roleTitle}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.phone}</span>
                    </div>
                  );
                })
              ) : (
                (() => {
                  const user = MOCK_USERS.find(u => u.id === event.assignedTo);
                  return user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                      <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${user.color}` }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.roleTitle}</div>
                      </div>
                    </div>
                  ) : null;
                })()
              )}
            </div>
          </div>

          {/* Ghi chú chi tiết */}
          {event.notes && (
            <div className="form-group">
              <label className="form-label">Ghi Chú Nội Dung & Yêu Cầu</label>
              <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {event.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Thao tác */}
        <div className="modal-footer">
          <button 
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa lịch này không?')) {
                onDeleteEvent(event.id);
                onClose();
              }
            }}
          >
            <Trash2 size={15} />
            <span>Xóa Lịch</span>
          </button>

          {!isMeeting && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                onToggleTaskComplete(event.id);
                onClose();
              }}
            >
              <CheckCircle2 size={15} />
              <span>{event.status === 'COMPLETED' ? 'Đánh Dấu Chưa Xong' : 'Hoàn Thành Việc'}</span>
            </button>
          )}

          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
