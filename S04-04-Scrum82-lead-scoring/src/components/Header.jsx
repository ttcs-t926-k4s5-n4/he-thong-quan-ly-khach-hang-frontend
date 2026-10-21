import React from 'react';
import { 
  Flame, 
  Sun, 
  Moon, 
  BookOpen, 
  Sliders, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onOpenJiraGuide,
  isConfigOpen,
  onToggleConfig
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="brand-icon-box">
            <Flame size={24} />
          </div>
          <div className="brand-text">
            <h1>
              CRM Enterprise 
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d97706', background: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                Hệ Thống Chấm Điểm Lead
              </span>
            </h1>
            <div className="brand-subtitle">
              Khai báo tiêu chí &bull; Tự động tính lại &bull; Phân loại Nóng/Ấm/Lạnh &bull; Ưu tiên cuộc gọi
            </div>
          </div>
        </div>

        {/* Actions & Role */}
        <div className="header-actions">
          {/* Role Pill - Sales Director */}
          <div className="role-badge" title="Tài khoản đang đăng nhập">
            <span className="role-pulse" />
            <span>👤 Giám Đốc Kinh Doanh: <strong>Nguyễn Hoàng Long</strong></span>
          </div>

          {/* Toggle Config Panel Button */}
          <button 
            className={`btn btn-sm ${isConfigOpen ? 'btn-warning' : 'btn-secondary'}`}
            onClick={onToggleConfig}
            title="Đóng / mở bảng cấu hình tiêu chí và số điểm"
          >
            <Sliders size={16} />
            <span>{isConfigOpen ? 'Thu Gọn Cấu Hình' : '⚙️ Cấu Hình Tiêu Chí'}</span>
          </button>

          {/* Guide Modal Trigger */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenJiraGuide}
            title="Xem bảng đối chiếu 4 tiêu chí nghiệm thu đề bài"
          >
            <BookOpen size={16} />
            <span>Tiêu Chí Đề Bài</span>
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
