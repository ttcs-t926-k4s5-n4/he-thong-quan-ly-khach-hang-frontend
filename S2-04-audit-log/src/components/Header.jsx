import React from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw, PlusCircle, FileSpreadsheet } from 'lucide-react';

export function Header({ onOpenSimulate, onExportCSV, onRefreshLogs, totalLogs }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="logo-badge">
            <ShieldAlert className="logo-icon" size={24} />
          </div>
          <div>
            <div className="jira-badge-row">
              <span className="jira-badge project-badge">SCRUM-16</span>
              <span className="jira-separator">/</span>
              <span className="jira-badge ticket-badge">SCRUM-62</span>
              <span className="status-pill in-review">Đang nghiệm thu</span>
              <span className="live-pulse">
                <span className="pulse-dot"></span>
                Giám sát thời gian thực (Live Audit Trail)
              </span>
            </div>
            <h1 className="main-title">
              Nhật Ký Thay Đổi Dữ Liệu Nhạy Cảm
            </h1>
          </div>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onRefreshLogs}
            title="Làm mới luồng nhật ký"
          >
            <RefreshCw size={16} />
            <span>Làm mới ({totalLogs})</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onExportCSV}
            title="Xuất file kiểm toán CSV/Excel"
          >
            <FileSpreadsheet size={16} />
            <span>Xuất báo cáo CSV</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onOpenSimulate}
            title="Thực hiện một thay đổi nhạy cảm mới để kiểm tra ghi log"
          >
            <PlusCircle size={17} />
            <span>+ Giả lập sửa dữ liệu nhạy cảm</span>
          </button>
        </div>
      </div>

      <div className="user-story-card">
        <div className="story-label">
          <span className="story-tag">YÊU CẦU NGHIỆP VỤ (USER STORY)</span>
        </div>
        <p className="story-content">
          &ldquo;<strong>Là Quản trị hệ thống</strong>, tôi muốn xem <strong>nhật ký thay đổi trên dữ liệu nhạy cảm</strong>, để truy được <strong>ai đã sửa chiết khấu hoặc chỉ tiêu khi cuối quý số liệu không khớp</strong>.&rdquo;
        </p>
        <div className="story-features">
          <span className="feature-item">
            <CheckCircle2 size={14} className="feature-icon" /> Ghi nhận: Chiết khấu, Chỉ tiêu, Quyền sở hữu, Vai trò
          </span>
          <span className="feature-item">
            <CheckCircle2 size={14} className="feature-icon" /> Đầy đủ: Người thực hiện, Thời điểm, Giá trị Trước & Sau
          </span>
          <span className="feature-item">
            <CheckCircle2 size={14} className="feature-icon" /> Lọc nhanh: Theo Người dùng, Loại đối tượng, Khoảng thời gian
          </span>
        </div>
      </div>
    </header>
  );
}
