import { useState } from "react";

import Sidebar from "./components/Sidebar";
import CustomersPage from "./pages/CustomersPage";
import ContactsPage from "./pages/ContactsPage";
import { initialCustomers } from "./data/mockData";

function App() {
  /*
   * Người dùng hiện tại dùng để mô phỏng phân quyền CRM.
   *
   * employee:
   * - Nhân viên kinh doanh
   * - Chỉ xem khách hàng do mình sở hữu
   *
   * team_leader:
   * - Trưởng nhóm kinh doanh
   * - Xem toàn bộ khách hàng trong team
   */
  const [currentUser, setCurrentUser] = useState({
    name: "Nguyễn Văn Nam",
    role: "employee",
    team: "Kinh doanh",
  });

  /*
   * customers là nguồn dữ liệu chung của toàn bộ CRM.
   *
   * CustomersPage và ContactsPage đều sử dụng cùng state này.
   */
  const [customers, setCustomers] = useState(initialCustomers);

  const [activePage, setActivePage] = useState("customers");

  const handleRoleChange = (role) => {
    if (role === "team_leader") {
      setCurrentUser({
        name: "Trưởng nhóm Kinh doanh",
        role: "team_leader",
        team: "Kinh doanh",
      });
    } else {
      setCurrentUser({
        name: "Nguyễn Văn Nam",
        role: "employee",
        team: "Kinh doanh",
      });
    };

    /*
     * Khi đổi quyền, quay về trang khách hàng
     * để tránh đang xem một màn hình không còn phù hợp.
     */
    setActivePage("customers");
  };

  const renderPage = () => {
    switch (activePage) {
      case "customers":
        return (
          <CustomersPage
            customers={customers}
            setCustomers={setCustomers}
            currentUser={currentUser}
          />
        );

      case "contacts":
        return (
          <ContactsPage
            customers={customers}
            setCustomers={setCustomers}
            currentUser={currentUser}
          />
        );

      case "reports":
        return (
          <div className="coming-soon">
            <h2>Báo cáo</h2>

            <p>
              Chức năng báo cáo sẽ được xây dựng sau.
            </p>
          </div>
        );

      default:
        return (
          <CustomersPage
            customers={customers}
            setCustomers={setCustomers}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;