import { useState } from "react";
import Sidebar from "./components/Sidebar";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [currentPage, setCurrentPage] = useState("users");

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-content">
        {currentPage === "users" && <UsersPage />}

        {currentPage === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}

export default App;