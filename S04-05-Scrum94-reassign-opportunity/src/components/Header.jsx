import React from 'react';
import { 
  Users, 
  ArrowLeftRight, 
  FileText, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Sparkles,
  ClipboardList
} from 'lucide-react';

export const Header = ({
  users,
  currentPersona,
  onPersonaChange,
  theme,
  onToggleTheme,
  onOpenJiraTicket,
  onOpenAuditLog,
  auditLogCount = 0
}) => {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo & Ticket Info */}
        <div className="logo-section">
          <div className="logo-icon-box">
            <ArrowLeftRight size={22} />
          </div>
          <div className="logo-text">
            <h1>
              <span>Phân Bổ Lại Cơ Hội Kinh Doanh</span>
              <span className="ticket-tag">SCRUM-94</span>
            </h1>
            <p className="logo-subtitle">
              Trưởng nhóm kinh doanh phân bổ lại thương vụ khi nhân viên nghỉ phép dài ngày hoặc quá tải
            </p>
          </div>
        </div>

        {/* Actions & Persona Switcher */}
        <div className="header-actions">
          {/* Persona Switcher */}
          <div className="persona-switcher" title="Chuyển đổi góc nhìn vai trò người dùng">
            <img 
              src={currentPersona.avatar} 
              alt={currentPersona.name} 
              className="persona-avatar"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <select
                className="persona-select"
                value={currentPersona.id}
                onChange={(e) => {
                  const user = users.find((u) => u.id === e.target.value);
                  if (user) onPersonaChange(user);
                }}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.role === 'TEAM_LEAD' ? '⭐ ' : ''}
                    {u.name} ({u.roleTitle.split(' (')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Audit Log Button */}
          <button 
            className="btn btn-outline btn-sm"
            onClick={onOpenAuditLog}
            title="Xem toàn bộ nhật ký phân bổ và biên bản bàn giao"
          >
            <ClipboardList size={16} color="#8b5cf6" />
            <span>Nhật ký ({auditLogCount})</span>
          </button>

          {/* Jira Ticket Modal Button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenJiraTicket}
            title="Xem đề bài Jira ticket SCRUM-94 và đối chiếu 3 tiêu chí AC"
          >
            <FileText size={16} color="#3b82f6" />
            <span>Đề bài SCRUM-94</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button 
            className="btn btn-outline btn-icon"
            onClick={onToggleTheme}
            title={`Chuyển sang giao diện ${theme === 'dark' ? 'sáng' : 'tối'}`}
          >
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
};
