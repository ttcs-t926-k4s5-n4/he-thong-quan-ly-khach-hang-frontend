import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";
import Customer360Page from "./Customer360Page";

function CustomersPage({
  customers,
  setCustomers,
  currentUser,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  /*
   * PHÂN QUYỀN
   *
   * Trưởng nhóm:
   *   -> xem toàn bộ khách hàng trong team.
   *
   * Nhân viên:
   *   -> chỉ xem khách hàng có owner bằng tên người dùng hiện tại.
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
   * Customer 360 chỉ được mở nếu khách hàng
   * nằm trong danh sách mà người dùng có quyền xem.
   */
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) {
      return null;
    }

    return (
      visibleCustomers.find(
        (customer) => customer.id === selectedCustomerId
      ) || null
    );
  }, [selectedCustomerId, visibleCustomers]);

  /*
   * Tìm kiếm + lọc trạng thái.
   */
  const filteredCustomers = useMemo(() => {
    return visibleCustomers.filter((customer) => {
      const keyword = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        customer.companyName
          .toLowerCase()
          .includes(keyword) ||
        customer.taxCode
          .toLowerCase()
          .includes(keyword) ||
        customer.industry
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "Tất cả" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    visibleCustomers,
    searchTerm,
    statusFilter,
  ]);

  /*
   * Các thống kê cũng chỉ tính trên dữ liệu
   * mà người dùng hiện tại được phép xem.
   */
  const totalCustomers = visibleCustomers.length;

  const activeCustomers = visibleCustomers.filter(
    (customer) => customer.status === "Khách hàng"
  ).length;

  const potentialCustomers = visibleCustomers.filter(
    (customer) => customer.status === "Tiềm năng"
  ).length;

  const totalOpenOpportunity = visibleCustomers.reduce(
    (total, customer) =>
      total + (customer.openOpportunityValue || 0),
    0
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value || 0);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleSaveCustomer = (formData) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                ...formData,
              }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        totalSignedValue: 0,
        openOpportunityValue: 0,
        contacts: [],
        opportunities: [],
        activities: [],
        attachments: [],
      };

      setCustomers((prev) => [
        newCustomer,
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id) => {
    /*
     * Kiểm tra quyền trước khi xóa.
     */
    const customer = visibleCustomers.find(
      (item) => item.id === id
    );

    if (!customer) {
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa khách hàng "${customer.companyName}" không?`
    );

    if (!confirmed) {
      return;
    }

    setCustomers((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (selectedCustomerId === id) {
      setSelectedCustomerId(null);
    }
  };

  const handleViewCustomer = (customer) => {
    /*
     * Chỉ mở Customer 360 nếu người dùng có quyền.
     */
    const hasPermission = visibleCustomers.some(
      (item) => item.id === customer.id
    );

    if (!hasPermission) {
      return;
    }

    setSelectedCustomerId(customer.id);
  };

  const handleBackFromCustomer360 = () => {
    setSelectedCustomerId(null);
  };

  const handleResetFilter = () => {
    setSearchTerm("");
    setStatusFilter("Tất cả");
  };

  /*
   * Nếu đang xem Customer 360.
   */
  if (selectedCustomer) {
    return (
      <Customer360Page
        customer={selectedCustomer}
        onBack={handleBackFromCustomer360}
      />
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <p className="breadcrumb">
            CRM / Quản lý khách hàng
          </p>

          <h1>Khách hàng doanh nghiệp</h1>

          <p className="page-description">
            Quản lý hồ sơ, trạng thái và thông tin khách hàng doanh nghiệp.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleAddCustomer}
        >
          <Plus size={18} />
          Thêm khách hàng
        </button>
      </div>

      {/* Thông tin quyền hiện tại */}
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
              ? "Bạn đang xem toàn bộ khách hàng trong team Kinh doanh."
              : `Bạn chỉ đang xem khách hàng do ${currentUser?.name} sở hữu.`}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={21} />
          </div>

          <div className="stat-content">
            <span>Tổng khách hàng</span>
            <strong>{totalCustomers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <UserCheck size={21} />
          </div>

          <div className="stat-content">
            <span>Khách hàng</span>
            <strong>{activeCustomers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={21} />
          </div>

          <div className="stat-content">
            <span>Khách hàng tiềm năng</span>
            <strong>{potentialCustomers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={21} />
          </div>

          <div className="stat-content">
            <span>Cơ hội đang mở</span>

            <strong>
              {formatCurrency(totalOpenOpportunity)} đ
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
              placeholder="Tìm theo tên công ty, mã số thuế..."
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
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="Tất cả">
                  Tất cả trạng thái
                </option>

                <option value="Tiềm năng">
                  Tiềm năng
                </option>

                <option value="Đang giao dịch">
                  Đang giao dịch
                </option>

                <option value="Khách hàng">
                  Khách hàng
                </option>

                <option value="Ngừng hợp tác">
                  Ngừng hợp tác
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
              {filteredCustomers.length}
            </strong>{" "}
            / {visibleCustomers.length} khách hàng
          </span>
        </div>

        <CustomerTable
          customers={filteredCustomers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onView={handleViewCustomer}
        />
      </div>

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          customers={visibleCustomers}
          currentUser={currentUser}
          onSave={handleSaveCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
}

export default CustomersPage;