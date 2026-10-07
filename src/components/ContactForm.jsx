import { useEffect, useState } from "react";
import { X, Save, UserRound } from "lucide-react";

const emptyForm = {
  name: "",
  position: "",
  email: "",
  phone: "",
  role: "người quyết định",
  customerId: "",
  isPrimary: false,
};

function ContactForm({
  contact,
  customers,
  contacts,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(contact);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        position: contact.position || "",
        email: contact.email || "",
        phone: contact.phone || "",
        role: contact.role || "người quyết định",
        customerId: String(contact.customerId || ""),
        isPrimary: Boolean(contact.isPrimary),
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [contact]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.customerId ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError(
        "Vui lòng nhập đầy đủ họ tên, khách hàng, email và số điện thoại."
      );

      return;
    }

    const duplicateEmail = contacts.some(
      (item) =>
        item.email.trim().toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        item.id !== contact?.id
    );

    if (duplicateEmail) {
      setError(
        "Email này đã được sử dụng cho một người liên hệ khác."
      );

      return;
    }

    const selectedCustomer = customers.find(
      (customer) =>
        String(customer.id) === String(formData.customerId)
    );

    if (!selectedCustomer) {
      setError("Vui lòng chọn khách hàng.");
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      position: formData.position.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      customerId: Number(formData.customerId),
      companyName: selectedCustomer.companyName,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="customer-modal contact-modal">
        <div className="modal-header">
          <div>
            <h2>
              {isEditing
                ? "Chỉnh sửa người liên hệ"
                : "Thêm người liên hệ"}
            </h2>

            <p>
              {isEditing
                ? "Cập nhật thông tin người liên hệ."
                : "Nhập thông tin người liên hệ của khách hàng."}
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-body">
            <div className="contact-form-icon">
              <UserRound size={28} />
            </div>

            <div className="form-section">
              <h3>Thông tin người liên hệ</h3>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    Họ và tên <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ví dụ: Nguyễn Minh Anh"
                  />
                </div>

                <div className="form-group">
                  <label>Chức danh</label>

                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Ví dụ: Giám đốc"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Khách hàng <span>*</span>
                  </label>

                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                  >
                    <option value="">
                      Chọn khách hàng
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Email <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@company.vn"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Số điện thoại <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0901234567"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Vai trò trong doanh nghiệp</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Vai trò</label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="người quyết định">
                      Người quyết định
                    </option>

                    <option value="người ảnh hưởng">
                      Người ảnh hưởng
                    </option>

                    <option value="người dùng cuối">
                      Người dùng cuối
                    </option>

                    <option value="người cản trở">
                      Người cản trở
                    </option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      checked={formData.isPrimary}
                      onChange={handleChange}
                    />

                    <span>
                      Đặt làm người liên hệ chính
                    </span>
                  </label>

                  <small>
                    Mỗi khách hàng chỉ có một người liên hệ chính.
                  </small>
                </div>
              </div>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>

            <button type="submit" className="btn-primary">
              <Save size={17} />

              {isEditing
                ? "Lưu thay đổi"
                : "Thêm người liên hệ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;