import React from 'react';
import { 
  Trophy, 
  Users, 
  ShieldCheck, 
  Moon, 
  Sun, 
  FileText, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MOCK_USERS, USER_ROLES } from '../data/mockUsers';

export const Header = ({ 
  currentUser, 
  onSelectUser, 
  theme, 
  onToggleTheme, 
  onOpenJiraModal 
}) => {
  const currentRole = USER_ROLES[currentUser.role] || USER_ROLES.SALES_REP;

  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* Brand & Jira Ticket Pill */}
        <div className="brand-section">
          <div 
            className="jira-badge-pill" 
            onClick={onOpenJiraModal}
            title="Bấm để xem chi tiết Đề bài Jira Ticket & Tiêu chí nghiệm thu"
          >
            <Sparkles size={14} className="text-indigo-400" />
            <span>SCRUM-20 / SCRUM-91</span>
            <ExternalLink size={12} className="opacity-70" />
          </div>

          <div>
            <h1 className="brand-title">
              <Trophy size={20} className="text-emerald-400" />
              <span>Đóng Cơ Hội Bán Hàng & Quản Lý KPI Sales</span>
            </h1>
            <p className="user-story-summary" title="Là Nhân viên kinh doanh, tôi muốn đóng một cơ hội với kết quả thắng hoặc thua, để công ty học được từ cả thương vụ thắng lẫn thua.">
              User Story: Đóng cơ hội Thắng / Thua &bull; Khóa sửa đổi &bull; Tính KPI người sở hữu
            </p>
          </div>
        </div>

        {/* Right side: Persona Switcher & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Persona Switcher */}
          <div className="persona-switcher">
            <Users size={16} className="text-indigo-400" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="persona-label">Người dùng thử nghiệm</span>
              <select 
                className="persona-select"
                value={currentUser.id}
                onChange={(e) => {
                  const user = MOCK_USERS.find((u) => u.id === e.target.value);
                  if (user) onSelectUser(user);
                }}
              >
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({USER_ROLES[user.role]?.name})
                  </option>
                ))}
              </select>
            </div>
            <span className={`role-badge ${currentRole.badgeColor}`}>
              <ShieldCheck size={12} />
              {currentRole.name}
            </span>
          </div>

          {/* Theme Toggle */}
          <button 
            className="btn btn-ghost" 
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};
