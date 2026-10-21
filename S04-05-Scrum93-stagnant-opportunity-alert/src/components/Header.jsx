import React from 'react';
import { 
  AlertTriangle, 
  Settings, 
  RefreshCw, 
  CheckCircle2, 
  Moon, 
  Sun, 
  UserCheck, 
  FileText,
  Clock,
  PlusCircle,
  Download
} from 'lucide-react';
import { USER_ROLES } from '../data/mockUsers.js';

export const Header = ({
  currentPersona,
  onPersonaChange,
  theme,
  onToggleTheme,
  onOpenThresholdModal,
  onOpenJobModal,
  onOpenJiraModal,
  onOpenAddModal,
  onOpenExportModal,
  onTriggerDailyEvaluation,
  isEvaluating,
  lastJobRunTime
}) => {
  return (
    <header className="topbar">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <AlertTriangle size={24} />
        </div>
        <div className="brand-titles">
          <h1>
            Cảnh Báo Cơ Hội Đình Trệ
            <span className="brand-badge">SCRUM-93</span>
          </h1>
          <p className="brand-subtitle">
            Hệ thống can thiệp sớm & hâm nóng thương vụ nguội dành cho Trưởng nhóm kinh doanh
          </p>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Nút Jira Ticket */}
        <button 
          className="btn btn-jira btn-sm"
          onClick={onOpenJiraModal}
          title="Xem chi tiết Jira Ticket SCRUM-93 và 4 tiêu chí chấp nhận"
        >
          <FileText size={15} />
          <span>Jira: SCRUM-93</span>
        </button>

        {/* Nút Cấu hình ngưỡng N ngày (AC1) */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenThresholdModal}
          title="Cấu hình số ngày N không hoạt động theo từng giai đoạn (AC1)"
        >
          <Settings size={15} />
          <span>Cấu hình Ngưỡng N Ngày</span>
        </button>

        {/* Nút Trạng thái Tác vụ hàng ngày (AC4) */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenJobModal}
          title="Xem thông tin và nhật ký tác vụ đánh giá chạy mỗi ngày một lần (AC4)"
        >
          <Clock size={15} />
          <span>Tác vụ Hàng Ngày</span>
        </button>

        {/* Nút Kích hoạt chạy đánh giá ngay (AC4) */}
        <button 
          className="btn btn-primary btn-sm"
          onClick={onTriggerDailyEvaluation}
          disabled={isEvaluating}
          title="Chạy tác vụ quét và đánh giá cơ hội đình trệ tức thì"
        >
          <RefreshCw size={15} className={isEvaluating ? 'spin' : ''} />
          <span>{isEvaluating ? 'Đang quét...' : 'Chạy Đánh Giá Ngay'}</span>
        </button>

        {/* Nút Thêm cơ hội mới */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenAddModal}
          title="Tạo cơ hội mới để thử nghiệm gắn cờ đình trệ"
        >
          <PlusCircle size={15} />
          <span>Tạo Cơ Hội</span>
        </button>

        {/* Nút Xuất báo cáo */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenExportModal}
          title="Xuất danh sách cơ hội có cờ đình trệ ra file CSV"
        >
          <Download size={15} />
          <span>Xuất Báo Cáo</span>
        </button>

        {/* Bộ chuyển vai trò Persona */}
        <div className="form-group" style={{ margin: 0 }}>
          <select 
            className="filter-select"
            value={currentPersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            style={{ fontWeight: 600, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            title="Chuyển đổi góc nhìn vai trò trong hệ thống"
          >
            <option value="TEAM_LEAD">👤 Trưởng nhóm: Trần Đình Trọng (Chính)</option>
            <option value="SALES_REP">👤 Nhân viên: Nguyễn Văn An</option>
            <option value="SALES_DIRECTOR">👤 Giám đốc: Lê Hoàng Nam</option>
          </select>
        </div>

        {/* Chuyển đổi Theme Dark/Light */}
        <button 
          className="btn btn-icon"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
};
