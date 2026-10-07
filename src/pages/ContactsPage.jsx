import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

import ContactTable from "../components/ContactTable";
import ContactForm from "../components/ContactForm";

function ContactsPage({
  customers,
  setCustomers,
  currentUser,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  /*
   * PHÂN QUYỀN KHÁCH HÀNG
   *
   * Trưởng nhóm:
   *   -> thấy liên hệ của toàn bộ khách hàng.
   *
   * Nhân viên:
   *   -> chỉ thấy liên hệ của khách hàng do mình sở hữu.
   */
  const visibleCustomers = useMemo(() => {
    if (currentUser?.role === "team_leader") {
      return customers;
    }

    return customers.filter(
      (customer) => customer.owner === currentUser?.name
    );
  }, [customers, currentUser]);

  /*
   * Chuyển contacts trong từng khách hàng thành
   * một danh sách phẳng để hiển thị trong bảng.
   */
  const contacts = useMemo(() => {
    return visibleCustomers.flatMap((customer) =>
      (customer.contacts || []).map((contact) => ({
        ...contact,
        customerId: customer.id,
        companyName: customer.companyName,
        customerStatus: customer.status,
      }))
    );
  }, [visibleCustomers]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const keyword = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        !keyword ||
        contact.name
          ?.toLowerCase()
          .includes(keyword) ||
        contact.email
          ?.toLowerCase()
          .includes(keyword) ||
        contact.phone
          ?.toLowerCase()
          .includes(keyword) ||
        contact.companyName
          ?.toLowerCase()
          .includes(keyword);

      const matchesRole =
        roleFilter === "Tất cả" ||
        contact.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [
    contacts,
    searchTerm,
    roleFilter,
  ]);

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSaveContact = (formData) => {
    const targetCustomerId = Number(
      formData.customerId
    );

    const targetCustomer = visibleCustomers.find(
      (customer) =>
        customer.id === targetCustomerId
    );

    if (!targetCustomer) {
      window.alert(
        "Bạn không có quyền thêm người liên hệ vào khách hàng này."
      );
      return;
    }

    /*
     * Thêm người liên hệ mới.
     */
    if (!editingContact) {
      const newContact = {
        id: Date.now(),
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isPrimary: Boolean(formData.isPrimary),
      };

      setCustomers((prev) =>
        prev.map((customer) => {
          if (customer.id !== targetCustomerId) {
            return customer;
          }

          let nextContacts = [
            ...(customer.contacts || []),
          ];

          /*
           * Một khách hàng chỉ có một người liên hệ chính.
           */
          if (newContact.isPrimary) {
            nextContacts = nextContacts.map(
              (contact) => ({
                ...contact,
                isPrimary: false,
              })
            );
          }

          return {
            ...customer,
            contacts: [
              ...nextContacts,
              newContact,
            ],
          };
        })
      );

      setShowForm(false);
      setEditingContact(null);
      return;
    }

    /*
     * Khi chỉnh sửa người liên hệ.
     */
    const oldCustomerId = Number(
      editingContact.customerId
    );

    const contactId = editingContact.id;

    /*
     * Nếu vẫn ở cùng công ty.
     */
    if (oldCustomerId === targetCustomerId) {
      setCustomers((prev) =>
        prev.map((customer) => {
          if (customer.id !== targetCustomerId) {
            return customer;
          }

          let nextContacts = (
            customer.contacts || []
          ).map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  name: formData.name,
                  position: formData.position,
                  email: formData.email,
                  phone: formData.phone,
                  role: formData.role,
                  isPrimary: Boolean(
                    formData.isPrimary
                  ),
                }
              : contact
          );

          /*
           * Nếu contact đang chỉnh sửa được đặt
           * làm contact chính thì bỏ primary của
           * các contact còn lại.
           */
          if (formData.isPrimary) {
            nextContacts = nextContacts.map(
              (contact) => ({
                ...contact,
                isPrimary:
                  contact.id === contactId,
              })
            );
          }

          return {
            ...customer,
            contacts: nextContacts,
          };
        })
      );

      setShowForm(false);
      setEditingContact(null);
      return;
    }

    /*
     * Nếu chuyển người liên hệ sang công ty mới:
     *
     * 1. Xóa khỏi công ty cũ.
     * 2. Thêm vào công ty mới.
     * 3. Giữ lịch sử công ty cũ.
     */
    const oldCustomer = customers.find(
      (customer) => customer.id === oldCustomerId
    );

    const previousCompany =
      editingContact.previousCompany ||
      oldCustomer?.companyName ||
      "";

    const movedContact = {
      id: contactId,
      name: formData.name,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      isPrimary: Boolean(formData.isPrimary),
      previousCompany,
      customerHistory: [
        ...(editingContact.customerHistory || []),
        {
          customerId: oldCustomerId,
          companyName:
            oldCustomer?.companyName ||
            editingContact.companyName ||
            "",
        },
      ],
    };

    setCustomers((prev) =>
      prev.map((customer) => {
        /*
         * Công ty cũ: xóa contact.
         */
        if (customer.id === oldCustomerId) {
          return {
            ...customer,
            contacts: (
              customer.contacts || []
            ).filter(
              (contact) =>
                contact.id !== contactId
            ),
          };
        }

        /*
         * Công ty mới: thêm contact.
         */
        if (customer.id === targetCustomerId) {
          let nextContacts = [
            ...(customer.contacts || []),
          ];

          if (movedContact.isPrimary) {
            nextContacts = nextContacts.map(
              (contact) => ({
                ...contact,
                isPrimary: false,
              })
            );
          }

          return {
            ...customer,
            contacts: [
              ...nextContacts,
              movedContact,
            ],
          };
        }

        return customer;
      })
    );

    setShowForm(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contact) => {
    const customer = visibleCustomers.find(
      (item) => item.id === contact.customerId
    );

    if (!customer) {
      window.alert(
        "Bạn không có quyền xóa người liên hệ này."
      );
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa người liên hệ "${contact.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    setCustomers((prev) =>
      prev.map((item) => {
        if (item.id !== customer.id) {
          return item;
        }

        return {
          ...item,
          contacts: (
            item.contacts || []
          ).filter(
            (itemContact) =>
              itemContact.id !== contact.id
          ),
        };
      })
    );
  };

  const handleViewContact = (contact) => {
    /*
     * Hiện tại bảng liên hệ không mở một màn hình
     * riêng nên giữ chức năng xem ở mức dữ liệu.
     */
    const customer = visibleCustomers.find(
      (item) => item.id === contact.customerId
    );

    if (!customer) {
      return;
    }

    setEditingContact(contact);
    setShowForm(true);
  };

  const handleResetFilter = () => {
    setSearchTerm("");
    setRoleFilter("Tất cả");
  };

  return (
    <div className="contacts-page">
      <div className="page-header">
        <div>
          <p className="breadcrumb">
            CRM / Người liên hệ
          </p>

          <h1>Người liên hệ</h1>

          <p className="page-description">
            Quản lý người liên hệ của các khách hàng doanh nghiệp.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleAddContact}
        >
          <Plus size={18} />
          Thêm người liên hệ
        </button>
      </div>

      {/* Thông tin quyền */}
      <div className="permission-banner">
        <div className="permission-banner-icon">
          <ShieldCheck size={18} />
        </div>

        <div>
          <strong>
            {currentUser?.role === "team_leader"
              ? "Quyền Trưởng nhóm"
              : "Quyền Nhân viên"}
          </strong>

          <span>
            {currentUser?.role === "team_leader"
              ? "Bạn đang xem người liên hệ của toàn bộ khách hàng trong team."
              : `Bạn chỉ đang xem người liên hệ của khách hàng do ${currentUser?.name} sở hữu.`}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={21} />
          </div>

          <div className="stat-content">
            <span>Tổng người liên hệ</span>
            <strong>
              {contacts.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={21} />
          </div>

          <div className="stat-content">
            <span>Khách hàng có liên hệ</span>
            <strong>
              {visibleCustomers.filter(
                (customer) =>
                  (customer.contacts || [])
                    .length > 0
              ).length}
            </strong>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Tìm tên, email, số điện thoại, khách hàng..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="toolbar-actions">
            <div className="filter-box">
              <Filter size={17} />

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
              >
                <option value="Tất cả">
                  Tất cả vai trò
                </option>

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

            <button
              className="btn-outline"
              onClick={handleResetFilter}
              title="Đặt lại bộ lọc"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        <div className="table-info">
          <span>
            Hiển thị{" "}
            <strong>
              {filteredContacts.length}
            </strong>{" "}
            / {contacts.length} người liên hệ
          </span>
        </div>

        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onView={handleViewContact}
        />
      </div>

      {showForm && (
        <ContactForm
          contact={editingContact}
          customers={visibleCustomers}
          contacts={contacts}
          onSave={handleSaveContact}
          onClose={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
        />
      )}
    </div>
  );
}

export default ContactsPage;