import {
  Building2,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  currentUser,
  onRoleChange,
}) {
  const menuItems = [
    {
      id: "customers",
      label: "Khách hàng",
      icon: Building2,
    },
    {
      id: "contacts",
      label: "Người liên hệ",
      icon: Users,
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: BarChart3,
    },
  ];

  const isTeamLeader = currentUser?.role === "team_leader";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <Building2 size={22} />
        </div>

        <div className="logo-text">
          <strong>CRM</strong>
          <span>Customer Management</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">QUẢN LÝ</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`sidebar-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-item">
          <Settings size={19} />
          <span>Cài đặt</span>
        </button>

        {/* Khu vực chuyển quyền để demo */}
        <div className="role-switcher">
          <div className="role-switcher-title">
            <ShieldCheck size={16} />
            <span>Quyền demo</span>
          </div>

          <select
            value={currentUser?.role || "employee"}
            onChange={(event) => onRoleChange(event.target.value)}
          >
            <option value="employee">
              Nhân viên kinh doanh
            </option>

            <option value="team_leader">
              Trưởng nhóm kinh doanh
            </option>
          </select>
        </div>

        <div className="user-card">
          <div className="user-avatar">
            {isTeamLeader ? "TL" : "NV"}
          </div>

          <div className="user-info">
            <strong>{currentUser?.name}</strong>

            <span>
              {isTeamLeader
                ? "Trưởng nhóm kinh doanh"
                : "Nhân viên kinh doanh"}
            </span>
          </div>

          <ChevronLeft size={16} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;