import React from 'react';
import { 
  History, 
  Sparkles, 
  PlusCircle, 
  Sun, 
  Moon, 
  ExternalLink, 
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Header({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  currentPersona,
  theme,
  onToggleTheme,
  onOpenBriefing,
  onOpenNewInteraction,
  onOpenJiraModal
}) {
  const selectedCust = customers.find(c => c.id === selectedCustomerId) || customers[0];

  return (
    <header className="header-topbar">
      <div className="brand-section">
        <div className="brand-logo-badge">
          <History size={22} />
        </div>
        <div className="brand-info">
          <h1>
            Dòng Thời Gian Tương Tác Khách Hàng
            <button 
              className="ticket-tag" 
              onClick={onOpenJiraModal}
              title="Xem chi tiết Jira Ticket SCRUM-102"
            >
              <span>⚡ SCRUM-21</span>
              <span>/</span>
              <span>☑ SCRUM-102</span>
              <ExternalLink size={12} />
            </button>
          </h1>
          <p className="brand-subtitle">
            Hệ thống quản lý lịch sử tương tác đa kênh & Tiếp nhận khách hàng trong 5 phút
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Customer Switcher */}
        <div className="customer-select-box" title="Chọn khách hàng để xem dòng thời gian">
          <Building2 size={16} className="text-secondary" />
          <select 
            value={selectedCustomerId} 
            onChange={(e) => onSelectCustomer(e.target.value)}
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.shortName} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Current Persona Badge */}
        <div className="persona-chip" title="Vai trò hiện tại đang thao tác">
          <img 
            src={currentPersona.avatar} 
            alt={currentPersona.name} 
            className="persona-avatar" 
          />
          <div className="persona-info">
            <span className="persona-name">{currentPersona.name}</span>
            <span className="persona-role">{currentPersona.role}</span>
          </div>
        </div>

        {/* 5-Minute Quick Briefing Button */}
        <button 
          className="btn btn-briefing"
          onClick={onOpenBriefing}
          title="Nắm bắt toàn bộ bối cảnh khách hàng trong 5 phút"
        >
          <Sparkles size={16} />
          <span>⚡ Bối Cảnh 5 Phút</span>
        </button>

        {/* Add New Interaction Button */}
        <button 
          className="btn btn-primary"
          onClick={onOpenNewInteraction}
          title="Ghi nhận hoạt động, báo giá hoặc cuộc gọi mới"
        >
          <PlusCircle size={16} />
          <span>+ Ghi Nhận Tương Tác</span>
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="btn btn-secondary btn-icon"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
