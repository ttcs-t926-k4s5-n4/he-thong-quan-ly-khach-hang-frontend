import React from 'react';
import { 
  FolderKanban, 
  Sun, 
  Moon, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onResetData, 
  onOpenGuideModal 
}) {
  return (
    <header className="header-glass">
      <div className="brand-section">
        <div className="brand-icon-box">
          <FolderKanban size={26} strokeWidth={2.2} />
        </div>
        <div className="brand-meta">
          <div className="brand-badge">
            <Sparkles size={12} />
            <span>SCRUM-17 / SCRUM-65</span>
          </div>
          <h1 className="brand-title">Khai Báo Danh Mục Dùng Chung Bán Hàng</h1>
          <p className="brand-subtitle">
            Dành cho Giám đốc kinh doanh: Chuẩn hóa tên Nguồn Lead, Ngành nghề, Quy mô DN & Hoạt động để báo cáo gộp toàn khối
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Nút xem hướng dẫn nghiệm thu 3 tiêu chí Jira */}
        <button 
          id="btn-scrum-guide"
          className="btn btn-primary"
          onClick={onOpenGuideModal}
          title="Xem hướng dẫn chi tiết kiểm tra 3 tiêu chí nghiệm thu của SCRUM-65"
        >
          <CheckCircle2 size={16} />
          <span>Tiêu Chí Nghiệm Thu (Jira)</span>
        </button>

        {/* Khôi phục dữ liệu mặc định */}
        <button 
          id="btn-reset-data"
          className="btn btn-secondary"
          onClick={onResetData}
          title="Khôi phục lại toàn bộ danh mục và dữ liệu CRM về trạng thái ban đầu"
        >
          <RotateCcw size={15} />
          <span>Khôi Phục Dữ Liệu</span>
        </button>

        {/* Chuyển đổi giao diện Sáng / Tối */}
        <button 
          id="btn-toggle-theme"
          className="btn btn-outline btn-icon"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
