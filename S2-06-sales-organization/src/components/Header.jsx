import React from 'react';
import { 
  Network, 
  Sun, 
  Moon, 
  HelpCircle, 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  Users, 
  DollarSign,
  Building2,
  FolderTree
} from 'lucide-react';
import { formatShortVND } from '../utils/orgUtils';

export default function Header({
  theme,
  setTheme,
  currentUserId,
  setCurrentUserId,
  employees,
  teams,
  deals,
  accessibleEmployees,
  accessibleTeams,
  accessibleDeals,
  onOpenGuide
}) {
  const currentEmp = employees.find(e => e.id === currentUserId) || employees[0];
  const currentTeam = teams.find(t => t.id === currentEmp?.teamId);
  const totalScopeRevenue = accessibleDeals.reduce((sum, d) => sum + d.dealValue, 0);

  return (
    <header className="app-header">
      <div className="header-top">
        {/* Brand & Ticket Info */}
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Network size={24} />
          </div>
          <div>
            <div className="ticket-tag">
              <FolderTree size={12} />
              <span>SCRUM-17 / SCRUM-64</span>
            </div>
            <h1 className="brand-title">Cơ Cấu Tổ Chức Kinh Doanh & Phân Quyền Dữ Liệu</h1>
          </div>
        </div>

        {/* Impersonation Selector & Actions */}
        <div className="header-actions">
          {/* User Impersonation: Cho phép trải nghiệm góc nhìn của từng cấp bậc */}
          <div className="impersonator-box">
            <span className="impersonator-label">
              <UserCheck size={16} className="text-accent-blue" />
              <span>Góc nhìn người dùng:</span>
            </span>
            <select 
              className="impersonator-select"
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
              title="Chọn người dùng để mô phỏng phạm vi dữ liệu"
            >
              <optgroup label="1. Cấp Ban Giám Đốc (Toàn Quyền / Root)">
                <option value="NV-001">👔 Nguyễn Văn An - Giám Đốc Kinh Doanh Toàn Quốc</option>
              </optgroup>
              <optgroup label="2. Cấp Lãnh Đạo Vùng / Miền (Regional Heads)">
                <option value="NV-002">🏢 Trần Thị Bình - Giám Đốc Vùng Miền Bắc</option>
                <option value="NV-003">🏢 Hoàng Đình Trọng - Giám Đốc Vùng Miền Trung</option>
                <option value="NV-004">🏢 Vũ Mai Phương - Giám Đốc Vùng Miền Nam</option>
              </optgroup>
              <optgroup label="3. Cấp Trưởng Chi Nhánh (Branch Managers)">
                <option value="NV-005">🏬 Phạm Minh Đức - Trưởng Chi Nhánh Hà Nội</option>
                <option value="NV-006">🏬 Lê Thanh Vân - Trưởng Chi Nhánh Hải Phòng</option>
                <option value="NV-008">🏬 Đặng Quốc Hưng - Trưởng Chi Nhánh TP.HCM</option>
              </optgroup>
              <optgroup label="4. Cấp Trưởng Nhóm Bán Hàng (Team Leaders)">
                <option value="NV-010">👥 Bùi Gia Huy - Trưởng Nhóm Enterprise Hà Nội</option>
                <option value="NV-011">👥 Đỗ Thu Hằng - Trưởng Nhóm SME Hà Nội</option>
                <option value="NV-012">👥 Trịnh Bá Thông - Trưởng Nhóm Enterprise TP.HCM</option>
                <option value="NV-013">👥 Lâm Mỹ Uyên - Trưởng Nhóm SME TP.HCM</option>
              </optgroup>
              <optgroup label="5. Cấp Chuyên Viên Kinh Doanh (Sales Reps - My Data Only)">
                <option value="NV-014">💼 Dương Văn Khôi - Chuyên Viên Enterprise HN</option>
                <option value="NV-016">💼 Hoàng Minh Tuấn - Chuyên Viên SME HN</option>
                <option value="NV-020">💼 Trần Bảo Anh - Key Account Manager HCM</option>
              </optgroup>
            </select>
          </div>

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Chuyển sang chế độ ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Guide Modal Trigger */}
          <button 
            className="btn btn-primary"
            onClick={onOpenGuide}
            title="Xem hướng dẫn chi tiết kiểm thử 4 tiêu chí SCRUM-64"
          >
            <HelpCircle size={16} />
            <span>Nghiệm Thu SCRUM-64</span>
          </button>
        </div>
      </div>

      {/* Scope Banner: Minh chứng thời gian thực cho Tiêu chí 3 */}
      <div className="scope-banner">
        <div className="scope-banner-text">
          <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
          <span>
            Đang đăng nhập: <strong>{currentEmp.name}</strong> ({currentEmp.position}) &bull; Thuộc nhóm: <strong>{currentTeam?.name || 'Chưa gán nhóm'}</strong>
          </span>
        </div>
        <div className="scope-pills">
          <span className="scope-pill teams" title="Số nhóm trong tầm nhìn dữ liệu">
            <Building2 size={13} />
            {accessibleTeams.length} Nhóm trực thuộc
          </span>
          <span className="scope-pill employees" title="Số nhân sự trong tầm nhìn dữ liệu">
            <Users size={13} />
            {accessibleEmployees.length} Nhân sự trong phạm vi
          </span>
          <span className="scope-pill deals" title="Tổng doanh số cơ hội kinh doanh nhìn thấy">
            <DollarSign size={13} />
            {accessibleDeals.length} Cơ hội ({formatShortVND(totalScopeRevenue)})
          </span>
        </div>
      </div>
    </header>
  );
}
