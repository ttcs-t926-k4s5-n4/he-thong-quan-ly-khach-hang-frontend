import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Smartphone, 
  Bookmark, 
  Moon, 
  Sun, 
  ChevronDown,
  Users
} from 'lucide-react';
import { MOCK_USERS, USER_ROLES } from '../data/mockUsers';

export default function Header({
  currentUser,
  onSelectUser,
  onOpenNewEvent,
  onOpenJira,
  isMobileSimOpen,
  onToggleMobileSim,
  theme,
  onToggleTheme
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-badge">
          <CalendarIcon size={18} />
          <span>SCRUM-101</span>
        </div>
        <div className="brand-title-wrap">
          <h1 className="brand-title">
            Lịch Làm Việc & Xếp Lịch Nhóm Kinh Doanh
          </h1>
          <span className="brand-subtitle">
            Hệ thống quản lý cuộc gặp & công việc có hạn • Chống chồng chéo lịch nhóm
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Nút tra cứu đề bài Jira Ticket */}
        <button 
          className="btn btn-jira" 
          onClick={onOpenJira}
          title="Xem chi tiết đề bài SCRUM-101 và 4 tiêu chí chấp nhận"
        >
          <Bookmark size={15} />
          <span>Jira: SCRUM-101</span>
        </button>

        {/* Nút giả lập giao diện di động (Mobile Simulator) */}
        <button 
          className={`btn ${isMobileSimOpen ? 'btn-primary' : 'btn-mobile-sim'}`}
          onClick={onToggleMobileSim}
          title="Chế độ giả lập hiển thị trên màn hình Smartphone"
        >
          <Smartphone size={15} />
          <span>{isMobileSimOpen ? 'Thoát ĐT' : 'Xem Điện Thoại'}</span>
        </button>

        {/* Nút chuyển đổi Dark/Light mode */}
        <button 
          className="btn btn-secondary" 
          onClick={onToggleTheme}
          title="Chuyển chế độ Sáng / Tối"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Bộ chuyển đổi Persona (Vai trò: Nhân viên kinh doanh vs Trưởng nhóm) */}
        <div className="persona-picker" title="Đổi vai trò người dùng">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="persona-avatar"
            style={{ borderColor: currentUser.color }}
          />
          <div className="persona-info">
            <span className="persona-name">{currentUser.name}</span>
            <span className="persona-role-badge">
              {currentUser.role === 'TEAM_LEAD' ? '👑 Trưởng Nhóm' : '💼 Sales Rep'}
            </span>
          </div>

          <select 
            className="form-select"
            value={currentUser.id}
            onChange={(e) => {
              const u = MOCK_USERS.find(usr => usr.id === e.target.value);
              if (u) onSelectUser(u);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px 6px',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                {u.name} ({u.role === 'TEAM_LEAD' ? 'Trưởng nhóm' : 'Sales Rep'})
              </option>
            ))}
          </select>
        </div>

        {/* Nút tạo sự kiện mới */}
        <button 
          className="btn btn-primary"
          onClick={onOpenNewEvent}
        >
          <Plus size={16} />
          <span>Đặt Lịch / Việc Mới</span>
        </button>
      </div>
    </header>
  );
}
