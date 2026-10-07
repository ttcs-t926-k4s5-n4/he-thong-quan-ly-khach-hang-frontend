import React from 'react';
import {
  GitMerge,
  Users,
  ShieldCheck,
  BookOpen,
  History,
  Sun,
  Moon,
  AlertTriangle,
  Building2,
  Lock
} from 'lucide-react';
import { CURRENT_USERS } from '../data/mockCustomers';

export function Header({
  currentUser,
  onUserChange,
  duplicatePairsCount,
  onOpenJiraGuide,
  onOpenHistory,
  onOpenDuplicatesOnly,
  theme,
  onToggleTheme
}) {
  return (
    <header className="header-wrapper">
      <div className="header-inner">
        {/* Brand & User Story Title */}
        <div className="brand-section">
          <div className="brand-icon-box">
            <GitMerge size={24} />
          </div>
          <div className="brand-info">
            <h1>
              <span>CRM Deduplication & Customer Merge</span>
              <span className="jira-badge">
                <ShieldCheck size={12} />
                SCRUM-18 / SCRUM-72
              </span>
            </h1>
            <p>Cảnh báo và gộp khách hàng trùng lặp — Bảo toàn 100% người liên hệ, cơ hội & dòng thời gian</p>
          </div>
        </div>

        {/* Controls: Role Switcher & Action Modals */}
        <div className="header-controls">
          {/* Cảnh báo số cặp trùng */}
          {duplicatePairsCount > 0 && (
            <button
              className="btn-pill"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#f87171'
              }}
              onClick={onOpenDuplicatesOnly}
              title="Nhấp để lọc nhanh các khách hàng đang bị trùng lặp"
            >
              <AlertTriangle size={15} className="animate-pulse" />
              <span>{duplicatePairsCount} Cặp trùng lặp cần xử lý</span>
            </button>
          )}

          {/* Phân quyền vai trò (Role Switcher - Tiêu chí 4) */}
          <div className="role-switcher-box">
            <span className="role-switcher-label">Vai trò:</span>
            <select
              className="role-select"
              value={currentUser.id}
              onChange={(e) => {
                const selected = CURRENT_USERS.find((u) => u.id === e.target.value);
                if (selected) onUserChange(selected);
              }}
            >
              {CURRENT_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.role === 'TEAM_LEAD' ? '⭐ ' : user.role === 'SALES_DIRECTOR' ? '🏢 ' : '👤 '}
                  {user.name} ({user.roleLabel})
                </option>
              ))}
            </select>
            {currentUser.canMerge ? (
              <span title="Có thẩm quyền gộp khách hàng" style={{ color: 'var(--success)', display: 'flex' }}>
                <ShieldCheck size={16} />
              </span>
            ) : (
              <span title="Chỉ được xem & gửi yêu cầu, không có quyền gộp" style={{ color: 'var(--danger)', display: 'flex' }}>
                <Lock size={16} />
              </span>
            )}
          </div>

          {/* Nút Xem Lịch Sử Gộp */}
          <button className="btn-pill" onClick={onOpenHistory} title="Xem nhật ký lịch sử các bản ghi đã gộp">
            <History size={16} />
            <span>Lịch sử gộp</span>
          </button>

          {/* Nút Hướng Dẫn Nghiệm Thu Jira */}
          <button className="btn-pill" onClick={onOpenJiraGuide} title="Xem 4 tiêu chí nghiệm thu đề bài">
            <BookOpen size={16} />
            <span>Tiêu chí Jira</span>
          </button>

          {/* Nút Đổi Theme */}
          <button className="btn-icon" onClick={onToggleTheme} title="Chuyển chế độ Sáng / Tối">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
