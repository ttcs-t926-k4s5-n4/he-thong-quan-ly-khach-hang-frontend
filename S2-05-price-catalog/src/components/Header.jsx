import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Crown, 
  Sun, 
  Moon, 
  BookOpen, 
  PlusCircle, 
  FileText 
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  onOpenProductModal, 
  onOpenGuideModal 
}) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Building2 size={26} />
        </div>
        <div className="brand-titles">
          <h1>
            Bảng Giá Chuẩn & Danh Mục SP/DV
            <span className="brand-badge">SCRUM-63</span>
          </h1>
          <div className="brand-sub">
            <span>Hệ thống Quản lý Báo giá & Kiểm soát Giá sàn Tiêu chuẩn</span>
          </div>
        </div>
      </div>

      {/* Role Switcher - Critical Requirement */}
      <div className="role-switcher-container">
        <span className="role-switcher-label">Vai trò:</span>
        <button
          type="button"
          className={`role-btn ${currentRole === 'director' ? 'active director' : ''}`}
          onClick={() => setCurrentRole('director')}
          title="Giám đốc kinh doanh: Toàn quyền xem và sửa giá vốn, duyệt chiết khấu dưới giá sàn"
        >
          <Crown size={15} />
          <span>Giám Đốc Kinh Doanh</span>
        </button>
        <button
          type="button"
          className={`role-btn ${currentRole === 'sales_rep' ? 'active sales_rep' : ''}`}
          onClick={() => setCurrentRole('sales_rep')}
          title="Nhân viên kinh doanh: Giá vốn bị ẩn/bảo mật, lập báo giá theo giá niêm yết chuẩn"
        >
          <UserCheck size={15} />
          <span>Nhân Viên Kinh Doanh</span>
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="header-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenGuideModal}
          title="Xem tài liệu nghiệm thu nghiệp vụ SCRUM-63"
        >
          <BookOpen size={16} />
          <span>Tiêu Chí SCRUM-63</span>
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Chuyển sang giao diện ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenProductModal}
        >
          <PlusCircle size={16} />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>
    </header>
  );
}
