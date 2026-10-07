import React from 'react';
import {
  FileSpreadsheet,
  Download,
  BookOpen,
  Sun,
  Moon,
  Users,
  Building2,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function Header({
  activeView,
  setActiveView,
  currentRole,
  setCurrentRole,
  theme,
  toggleTheme,
  onOpenJiraGuide,
  onDownloadTemplate,
  customerCount
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Logo & Ticket Info */}
        <div className="brand-section">
          <div className="brand-logo" title="CRM Enterprise Excel Bulk Import">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <div className="brand-title">
              CRM Enterprise
              <span className="ticket-tag">
                <CheckCircle2 size={13} /> SCRUM-193 / SCRUM-74
              </span>
            </div>
            <div className="brand-subtitle">
              Nhập Danh Sách Khách Hàng Hàng Loạt Từ Excel & Xử Lý Trùng Lặp
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeView === 'import' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('import')}
          >
            <FileSpreadsheet size={15} /> Nhập Dữ Liệu Excel
          </button>
          <button
            className={`btn btn-sm ${activeView === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('customers')}
          >
            <Building2 size={15} /> Danh Mục Khách Hàng ({customerCount})
          </button>
        </div>

        {/* Actions & Utilities */}
        <div className="header-actions">
          {/* Download Template Button */}
          <button
            className="btn btn-excel btn-sm"
            onClick={onDownloadTemplate}
            title="Tải tệp mẫu Excel chuẩn có sẵn các cột quy định và hướng dẫn nhập liệu"
          >
            <Download size={15} /> Tải Tệp Mẫu Excel (.xlsx)
          </button>

          {/* Jira Acceptance Criteria Guide */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenJiraGuide}
            title="Xem bảng đối chiếu tiêu chuẩn nghiệm thu đề bài Jira"
          >
            <BookOpen size={15} /> Tiêu Chí Jira
          </button>

          {/* Role Switcher */}
          <div className="role-box" title="Đổi vai trò người dùng">
            <Users size={15} style={{ color: 'var(--text-secondary)' }} />
            <select
              className="role-select"
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value)}
            >
              <option value="SALES_REP">Nguyễn Hoàng Nam (Nhân viên kinh doanh)</option>
              <option value="TEAM_LEAD">Trần Mạnh Hùng (Trưởng nhóm kinh doanh)</option>
              <option value="SALES_DIRECTOR">Lê Văn Cường (Giám đốc kinh doanh)</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
