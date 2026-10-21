import React from 'react';
import { Building2, Sparkles, Moon, Sun, BookOpen, Layers } from 'lucide-react';

export function Header({
  currentUser,
  onUserChange,
  currentUsers,
  theme,
  onToggleTheme,
  onOpenJiraGuide,
  activeView,
  onNavigateHome
}) {
  return (
    <header className="header-wrapper">
      <div className="header-content">
        {/* Logo & Brand */}
        <div className="brand-section" style={{ cursor: 'pointer' }} onClick={onNavigateHome}>
          <div className="brand-logo-badge">
            <Building2 size={24} />
          </div>
          <div className="brand-info">
            <div className="brand-title">
              CRM Enterprise
              <span className="badge badge-parent" style={{ fontSize: '0.7rem' }}>
                <Layers size={12} /> Tập Đoàn Đa Pháp Nhân
              </span>
            </div>
            <div className="brand-subtitle">
              Khai Báo Quan Hệ Công Ty Mẹ - Con & Tổng Hợp Doanh Số Nhóm
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Ticket Badge */}
          <button
            className="jira-pill-btn"
            onClick={onOpenJiraGuide}
            title="Xem yêu cầu và tiêu chí nghiệm thu Jira Ticket"
          >
            <Sparkles size={14} />
            <span>SCRUM-18 / SCRUM-73</span>
          </button>

          {/* Quick Guide Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenJiraGuide}
            title="Hướng dẫn kiểm thử tiêu chí nghiệm thu"
          >
            <BookOpen size={14} />
            <span>Tiêu Chí Nghiệm Thu</span>
          </button>

          {/* Role Switcher */}
          <div className="role-badge-select" title="Chuyển đổi vai trò người dùng">
            <span className="role-avatar">{currentUser.avatar}</span>
            <select
              className="role-select"
              value={currentUser.id}
              onChange={(e) => {
                const user = currentUsers.find((u) => u.id === e.target.value);
                if (user) onUserChange(user);
              }}
            >
              {currentUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.roleTitle})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
