import {
  Eye,
  Pencil,
  Trash2,
  Building2,
  MoreHorizontal,
} from "lucide-react";

function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onView,
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Tiềm năng":
        return "status-potential";

      case "Đang giao dịch":
        return "status-trading";

      case "Khách hàng":
        return "status-customer";

      case "Ngừng hợp tác":
        return "status-stopped";

      default:
        return "";
    }
  };

  return (
    <div className="customer-table-wrapper">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Mã số thuế</th>
            <th>Ngành nghề</th>
            <th>Quy mô</th>
            <th>Người sở hữu</th>
            <th>Trạng thái</th>
            <th className="action-column">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-table">
                <div className="empty-state">
                  <Building2 size={40} />
                  <strong>Chưa có khách hàng</strong>
                  <span>
                    Hãy thêm khách hàng mới để bắt đầu quản lý.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-name-cell">
                    <div className="company-avatar">
                      <Building2 size={18} />
                    </div>

                    <div>
                      <strong>{customer.companyName}</strong>

                      <span>
                        {customer.website || "Chưa cập nhật website"}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="tax-code">
                    {customer.taxCode}
                  </span>
                </td>

                <td>{customer.industry}</td>

                <td>{customer.scale}</td>

                <td>
                  <div className="owner-cell">
                    <div className="owner-avatar">
                      {customer.owner
                        ?.split(" ")
                        .map((word) => word[0])
                        .slice(-2)
                        .join("")}
                    </div>

                    <span>{customer.owner}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`status-badge ${getStatusClass(
                      customer.status
                    )}`}
                  >
                    <span className="status-dot"></span>
                    {customer.status}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="icon-button"
                      title="Xem chi tiết"
                      onClick={() => onView(customer)}
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      className="icon-button"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(customer)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="icon-button danger"
                      title="Xóa"
                      onClick={() => onDelete(customer.id)}
                    >
                      <Trash2 size={17} />
                    </button>

                    <button
                      className="icon-button"
                      title="Thêm thao tác"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;