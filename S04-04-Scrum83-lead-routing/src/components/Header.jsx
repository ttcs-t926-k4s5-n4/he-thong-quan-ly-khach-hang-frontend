import React from 'react';
import { 
  GitFork, 
  Sun, 
  Moon, 
  BookOpen, 
  Plus, 
  Clock, 
  SlidersHorizontal,
  Zap
} from 'lucide-react';

export default function Header({
  theme,
  onToggleTheme,
  onOpenJiraGuide,
  isRulesOpen,
  onToggleRules,
  onSimulateNewLead
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="brand-icon-box">
            <GitFork size={24} />
          </div>
          <div className="brand-text">
            <h1>
              CRM Enterprise 
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                Phân Bổ Lead Tự Động
              </span>
            </h1>
            <div className="brand-subtitle">
              Định tuyến khu vực, ngành nghề & xoay vòng &bull; First-match-wins &bull; Chạy nền &lt; 5 phút
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

          {/* Toggle Rules Manager */}
          <button 
            className={`btn btn-sm ${isRulesOpen ? 'btn-success' : 'btn-secondary'}`}
            onClick={onToggleRules}
            title="Đóng / mở danh sách quy tắc phân bổ"
          >
            <SlidersHorizontal size={15} />
            <span>{isRulesOpen ? 'Thu Gọn Quy Tắc' : '⚙️ Quản Lý Quy Tắc'}</span>
          </button>

          {/* Quick Simulation Button */}
          <button 
            className="btn btn-primary btn-sm"
            onClick={onSimulateNewLead}
            title="Mô phỏng 1 Lead mới đổ về từ Marketing và kiểm tra tốc độ phân bổ tự động"
          >
            <Zap size={15} />
            <span>+ Nạp Lead Mới & Chạy Nền</span>
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
