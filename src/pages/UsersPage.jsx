import ImportUsers from "../components/ImportUsers";

function UsersPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>
            Quản lý tài khoản người dùng trong hệ thống CRM
          </p>
        </div>
      </div>

      <ImportUsers />
    </div>
  );
}

export default UsersPage;