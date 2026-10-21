import React from 'react';
import { Users, Check, Eye, EyeOff, Sparkles, AlertTriangle } from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';

export default function TeamSidebar({
  selectedUserIds,
  onToggleUser,
  onSelectAllUsers,
  onDeselectAllUsers,
  events,
  currentUser,
  onOpenSlotFinder
}) {
  return (
    <aside className="team-sidebar">
      {/* Tiêu đề & Nút thao tác nhanh */}
      <div className="sidebar-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--primary)" />
          <span>Lịch Thành Viên Nhóm</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            className="btn-icon-switch" 
            onClick={onSelectAllUsers}
            title="Hiện tất cả thành viên"
            style={{ fontSize: '0.72rem', color: 'var(--primary)' }}
          >
            Tất cả
          </button>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <button 
            className="btn-icon-switch" 
            onClick={onDeselectAllUsers}
            title="Chỉ hiện mình tôi"
            style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}
          >
            Mình tôi
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Chọn thành viên để xem lịch chồng chéo và phát hiện khung giờ rảnh chung nhằm bố trí cuộc gặp không bị trùng lặp.
      </p>

      {/* Danh sách thành viên với Checkbox & Màu sắc định danh */}
      <div className="team-members-list">
        {MOCK_USERS.map(user => {
          const isSelected = selectedUserIds.includes(user.id);
          const isMe = user.id === currentUser.id;

          // Đếm số sự kiện của user này
          const userEventCount = events.filter(e => 
            (e.type === 'MEETING' && (e.attendees || []).includes(user.id)) ||
            (e.type === 'TASK' && e.assignedTo === user.id)
          ).length;

          return (
            <div 
              key={user.id}
              className={`team-member-item ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleUser(user.id)}
            >
              <div className="member-left">
                {/* Chỉ báo màu lịch riêng của từng nhân viên */}
                <div 
                  className="member-color-indicator" 
                  style={{ 
                    background: user.color,
                    boxShadow: isSelected ? `0 0 8px ${user.color}` : 'none' 
                  }} 
                />
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="member-avatar"
                  style={{ border: isMe ? '2px solid var(--primary)' : '1px solid var(--border-light)' }}
                />
                <div className="member-details">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="member-name">{user.name}</span>
                    {isMe && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                        Tôi
                      </span>
                    )}
                  </div>
                  <span className="member-role">
                    {user.role === 'TEAM_LEAD' ? '👑 Trưởng nhóm' : user.roleTitle}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="member-event-count" title={`${userEventCount} lịch hẹn/công việc`}>
                  {userEventCount}
                </span>
                <div 
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: isSelected ? `2px solid ${user.color}` : '1px solid var(--border-light)',
                    background: isSelected ? user.color : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nút hành động nhanh: Bố trí lịch trống chung */}
      <button 
        className="btn btn-secondary"
        onClick={onOpenSlotFinder}
        style={{
          width: '100%',
          justifyContent: 'center',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          background: 'rgba(59, 130, 246, 0.08)',
          color: 'var(--primary)'
        }}
      >
        <Sparkles size={15} />
        <span>Gợi Ý Giờ Rảnh Cả Nhóm</span>
      </button>

      {/* Bảng chú giải phân loại lịch (Legend) */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Chú Giải Phân Loại
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--meeting-bg)', border: '2px solid var(--meeting-color)' }} />
          <span>Cuộc gặp đã đặt (Khách hàng/Đối tác)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--task-bg)', border: '2px solid var(--task-color)' }} />
          <span>Công việc có hạn (Hạn chót cần nộp)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--danger-bg)', border: '2px solid var(--danger-border)' }} />
          <span>Cảnh báo xung đột (Trùng lịch hẹn)</span>
        </div>
      </div>
    </aside>
  );
}
