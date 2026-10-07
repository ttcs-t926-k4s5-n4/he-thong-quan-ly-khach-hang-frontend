import {
  LayoutDashboard,
  Users,
  UserCircle,
  UserRound,
} from "lucide-react";

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">CRM</div>

        <div>
          <strong>CRM System</strong>
          <span>Customer Management</span>
        </div>
      </div>

      <div className="menu-section">TỔNG QUAN</div>

      <button
        className={`menu-item ${
          currentPage === "dashboard" ? "active" : ""
        }`}
        onClick={() => setCurrentPage("dashboard")}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </button>

      <button className="menu-item">
        <Users size={18} />
        <span>Khách hàng</span>
      </button>

      <div className="menu-section">QUẢN TRỊ</div>

      <button
        className={`menu-item ${
          currentPage === "users" ? "active" : ""
        }`}
        onClick={() => setCurrentPage("users")}
      >
        <UserRound size={18} />
        <span>Người dùng</span>
      </button>

      <button
        className={`menu-item ${
          currentPage === "profile" ? "active" : ""
        }`}
        onClick={() => setCurrentPage("profile")}
      >
        <UserCircle size={18} />
        <span>Hồ sơ cá nhân</span>
      </button>
    </aside>
  );
}

export default Sidebar;