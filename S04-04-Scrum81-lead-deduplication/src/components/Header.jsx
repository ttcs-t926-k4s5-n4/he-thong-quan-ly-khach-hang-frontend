import React from 'react';
import { 
  Users2, 
  Sun, 
  Moon, 
  BookOpen, 
  History, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onOpenJiraGuide, 
  onOpenHistory, 
  mergeHistoryCount = 0 
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="brand-icon-box">
            <Users2 size={24} />
          </div>
          <div className="brand-text">
            <h1>
              CRM Marketing 
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--primary-100)' }}>
                Bảo Vệ Cuộc Gọi Trùng
              </span>
            </h1>
            <div className="brand-subtitle">
              Phát hiện trùng đa tiêu chí &bull; Gợi ý gắn vào Khách hàng &bull; Bảo toàn 100% lịch sử
            </div>
          </div>
        </div>

        {/* Actions & Role */}
        <div className="header-actions">
          {/* Role Pill */}
          <div className="role-badge" title="Tài khoản đang đăng nhập">
            <span className="role-pulse" />
            <span>👤 Nhân viên Marketing: <strong>Lê Thảo Vy</strong></span>
          </div>

          {/* Guide Modal Trigger */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenJiraGuide}
            title="Xem bảng tiêu chí nghiệm thu đề bài"
          >
            <BookOpen size={16} />
            <span>Tiêu Chí Đề Bài</span>
          </button>

          {/* Merge History Drawer Trigger */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenHistory}
            title="Xem nhật ký các lần gộp lead"
          >
            <History size={16} />
            <span>Lịch Sử Gộp</span>
            {mergeHistoryCount > 0 && (
              <span className="filter-badge" style={{ background: 'var(--primary-600)', color: 'white', marginLeft: '0.2rem' }}>
                {mergeHistoryCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            style={{ padding: '0.45rem' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
