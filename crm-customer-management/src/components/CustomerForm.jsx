import { useEffect, useState } from "react";
import { X, UserPlus, UserRound } from "lucide-react";

function ContactForm({
  contact,
  customers,
  contacts = [],
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    role: "người ảnh hưởng",
    customerId:
      customers?.[0]?.id
        ? String(customers[0].id)
        : "",
    isPrimary: false,
  });

  const [error, setError] = useState("");

  /*
   * Khi mở form sửa,
   * nạp dữ liệu của người liên hệ hiện tại.
   *
   * Khi mở form thêm,
   * chọn khách hàng đầu tiên nếu có.
   */
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        position: contact.position || "",
        email: contact.email || "",
        phone: contact.phone || "",
        role:
          contact.role ||
          "người ảnh hưởng",
        customerId:
          contact.customerId != null
            ? String(contact.customerId)
            : customers?.[0]?.id
              ? String(customers[0].id)
              : "",
        isPrimary:
          Boolean(contact.isPrimary),
      });
    } else {
      setFormData({
        name: "",
        position: "",
        email: "",
        phone: "",
        role: "người ảnh hưởng",
        customerId:
          customers?.[0]?.id
            ? String(customers[0].id)
            : "",
        isPrimary: false,
      });
    }

    setError("");
  }, [contact, customers]);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name =
      formData.name.trim();

    const position =
      formData.position.trim();

    const email =
      formData.email.trim();

    const phone =
      formData.phone.trim();

    const customerId =
      formData.customerId;

    /*
     * Kiểm tra dữ liệu bắt buộc.
     */
    if (!name) {
      setError(
        "Vui lòng nhập họ và tên người liên hệ."
      );

      return;
    }

    if (!position) {
      setError(
        "Vui lòng nhập chức danh."
      );

      return;
    }

    if (!email) {
      setError(
        "Vui lòng nhập email."
      );

      return;
    }

    if (!phone) {
      setError(
        "Vui lòng nhập số điện thoại."
      );

      return;
    }

    if (!customerId) {
      setError(
        "Vui lòng chọn khách hàng."
      );

      return;
    }

    /*
     * Kiểm tra email cơ bản.
     */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(
        "Email không đúng định dạng."
      );

      return;
    }

    /*
     * Kiểm tra số điện thoại.
     *
     * Cho phép:
     * 0901234567
     * 091 234 5678
     * +84901234567
     */
    const normalizedPhone =
      phone.replace(/[\s.-]/g, "");

    const phoneRegex =
      /^(\+84|0)\d{8,10}$/;

    if (
      !phoneRegex.test(normalizedPhone)
    ) {
      setError(
        "Số điện thoại không đúng định dạng."
      );

      return;
    }

    /*
     * Kiểm tra email trùng.
     *
     * Khi sửa chính contact hiện tại
     * thì bỏ qua contact đó.
     */
    const duplicateEmail =
      contacts.find((item) => {
        if (
          contact &&
          item.id === contact.id
        ) {
          return false;
        }

        return (
          String(item.email || "")
            .trim()
            .toLowerCase() ===
          email.toLowerCase()
        );
      });

    if (duplicateEmail) {
      setError(
        `Email "${email}" đã được sử dụng cho người liên hệ khác.`
      );

      return;
    }

    /*
     * Kiểm tra khách hàng tồn tại.
     */
    const selectedCustomer =
      customers.find(
        (customer) =>
          String(customer.id) ===
          String(customerId)
      );

    if (!selectedCustomer) {
      setError(
        "Khách hàng được chọn không tồn tại."
      );

      return;
    }

    /*
     * Nếu đang sửa và đổi công ty,
     * vẫn cho phép lưu.
     *
     * ContactsPage sẽ xử lý:
     * - xóa khỏi công ty cũ
     * - thêm vào công ty mới
     * - lưu lịch sử chuyển công ty
     */
    onSave({
      ...formData,

      name,
      position,
      email,
      phone: normalizedPhone,

      customerId:
        Number(customerId),

      role:
        formData.role,

      isPrimary:
        Boolean(formData.isPrimary),
    });
  };

  const selectedCustomer =
    customers.find(
      (customer) =>
        String(customer.id) ===
        String(formData.customerId)
    );

  return (
    <div className="modal-overlay">
      <div className="form-modal contact-form-modal">
        <div className="modal-header">
          <div className="modal-title">
            <div className="form-title-icon">
              {contact ? (
                <UserRound size={20} />
              ) : (
                <UserPlus size={20} />
              )}
            </div>

            <div>
              <h2>
                {contact
                  ? "Chỉnh sửa người liên hệ"
                  : "Thêm người liên hệ"}
              </h2>

              <p>
                {contact
                  ? "Cập nhật thông tin người liên hệ."
                  : "Thêm người liên hệ cho khách hàng."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="customer-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>
                Họ và tên{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Minh Anh"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>
                Chức danh{" "}
                <span>*</span>
              </label>

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
                Email{" "}
                <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
              />
            </div>

            <div className="form-group">
              <label>
                Số điện thoại{" "}
                <span>*</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0901234567"
              />
            </div>

            <div className="form-group">
              <label>
                Khách hàng{" "}
                <span>*</span>
              </label>

              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
              >
                <option value="">
                  -- Chọn khách hàng --
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.companyName}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>
                Vai trò
              </label>

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
          </div>

          {selectedCustomer && (
            <div className="selected-customer-info">
              <div>
                <strong>
                  Khách hàng:
                </strong>

                <span>
                  {selectedCustomer.companyName}
                </span>
              </div>

              <div>
                <strong>
                  Mã số thuế:
                </strong>

                <span>
                  {selectedCustomer.taxCode}
                </span>
              </div>
            </div>
          )}

          <label className="primary-contact-option">
            <input
              type="checkbox"
              name="isPrimary"
              checked={
                formData.isPrimary
              }
              onChange={handleChange}
            />

            <span className="primary-contact-check">
              <strong>
                Người liên hệ chính
              </strong>

              <small>
                Nếu chọn, người này sẽ trở thành
                người liên hệ chính của công ty.
              </small>
            </span>
          </label>

          {contact &&
            contact.previousCompany && (
              <div className="contact-history-info">
                <strong>
                  Lịch sử công ty trước:
                </strong>

                <span>
                  {contact.previousCompany}
                </span>
              </div>
            )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              {contact
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