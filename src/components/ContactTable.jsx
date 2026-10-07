import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Star,
  MoreHorizontal,
} from "lucide-react";

function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onView,
}) {
  const getRoleClass = (role) => {
    switch (role) {
      case "người quyết định":
        return "contact-role-decision";

      case "người ảnh hưởng":
        return "contact-role-influence";

      case "người dùng cuối":
        return "contact-role-user";

      case "người cản trở":
        return "contact-role-blocker";

      default:
        return "";
    }
  };

  return (
    <div className="customer-table-wrapper">
      <table className="customer-table contact-table">
        <thead>
          <tr>
            <th>Người liên hệ</th>
            <th>Khách hàng</th>
            <th>Chức danh</th>
            <th>Liên hệ</th>
            <th>Vai trò</th>
            <th>Người liên hệ chính</th>
            <th className="action-column">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-table">
                <div className="empty-state">
                  <Mail size={40} />

                  <strong>Chưa có người liên hệ</strong>

                  <span>
                    Hãy thêm người liên hệ mới để bắt đầu quản lý.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <div className="contact-name-cell">
                    <div className="contact-avatar">
                      {contact.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .slice(-2)
                        .join("")}
                    </div>

                    <div className="contact-name-info">
                      <strong>{contact.name}</strong>

                      {contact.email && (
                        <span>{contact.email}</span>
                      )}
                    </div>
                  </div>
                </td>

                <td>
                  <span className="contact-company">
                    {contact.companyName}
                  </span>
                </td>

                <td>
                  {contact.position || "Chưa cập nhật"}
                </td>

                <td>
                  <div className="contact-info-cell">
                    {contact.email && (
                      <div>
                        <Mail size={14} />
                        <span>{contact.email}</span>
                      </div>
                    )}

                    {contact.phone && (
                      <div>
                        <Phone size={14} />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td>
                  <span
                    className={`contact-role ${getRoleClass(
                      contact.role
                    )}`}
                  >
                    {contact.role}
                  </span>
                </td>

                <td>
                  {contact.isPrimary ? (
                    <span className="primary-contact">
                      <Star size={14} fill="currentColor" />
                      Chính
                    </span>
                  ) : (
                    <span className="secondary-contact">
                      Phụ
                    </span>
                  )}
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="icon-button"
                      title="Xem chi tiết"
                      onClick={() => onView(contact)}
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      className="icon-button"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(contact)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="icon-button danger"
                      title="Xóa"
                      onClick={() => onDelete(contact.id)}
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

export default ContactTable;