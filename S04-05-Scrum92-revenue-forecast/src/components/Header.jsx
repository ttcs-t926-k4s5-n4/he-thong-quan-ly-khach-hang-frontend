import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Sun, 
  Moon, 
  Plus, 
  Sliders, 
  Download, 
  CheckCircle2, 
  Users 
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';

export const Header = ({
  theme,
  toggleTheme,
  currentUser,
  setCurrentUser,
  onOpenJira,
  onOpenSimulator,
  onOpenAddOpp,
  onOpenExport
}) => {
  return (
    <header className="topbar">
      <div className="brand-wrapper">
        <div className="brand-logo-box">
          <TrendingUp size={22} />
        </div>
        <div className="brand-info">
          <h1>
            Dự Báo Doanh Số Bán Hàng (Revenue Forecast)
            <span 
              className="ticket-tag" 
              onClick={onOpenJira}
              title="Nhấp để xem chi tiết Ticket SCRUM-92 & 4 Tiêu chí nghiệm thu"
            >
              <CheckCircle2 size={13} />
              SCRUM-20 / SCRUM-92
            </span>
          </h1>
          <div className="brand-subtitle">
            Hệ thống tính toán trọng số xác suất giai đoạn & phân rã đa chiều cho Giám đốc kinh doanh
          </div>
        </div>
      </div>

      <div className="topbar-actions">
        {/* What-If Simulator Button */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenSimulator}
          title="Mở bộ giả lập What-If tinh chỉnh xác suất giai đoạn"
        >
          <Sliders size={16} />
          Mô Phỏng What-If
        </button>

        {/* Add Opportunity Button */}
        <button 
          className="btn btn-primary" 
          onClick={onOpenAddOpp}
          title="Thêm cơ hội bán hàng mới vào Pipeline"
        >
          <Plus size={16} />
          Thêm Cơ Hội
        </button>

        {/* Export Report Button */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenExport}
          title="Xuất bảng số liệu dự báo doanh số"
        >
          <Download size={16} />
          Xuất Báo Cáo
        </button>

        {/* Persona Switcher */}
        <div className="persona-picker" title="Chuyển đổi góc nhìn vai trò người dùng">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="persona-avatar" 
          />
          <select 
            className="persona-select"
            value={currentUser.id}
            onChange={(e) => {
              const selected = MOCK_USERS.find(u => u.id === e.target.value);
              if (selected) setCurrentUser(selected);
            }}
          >
            {MOCK_USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.roleTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button 
          className="btn-icon" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
