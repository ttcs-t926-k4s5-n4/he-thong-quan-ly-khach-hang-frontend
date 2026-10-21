import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Target,
  User,
  Users,
  BriefcaseBusiness,
  Activity,
  Paperclip,
  ExternalLink,
} from "lucide-react";

function Customer360Page({ customer, onBack }) {
  if (!customer) {
    return (
      <div className="customer360-page">
        <div className="empty-state">
          <Building2 size={42} />

          <h2>Không tìm thấy khách hàng</h2>

          <p>
            Dữ liệu khách hàng không tồn tại hoặc đã bị xóa.
          </p>

          <button
            className="btn-primary"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const contacts = customer.contacts || [];
  const opportunities = customer.opportunities || [];
  const activities = customer.activities || [];
  const attachments = customer.attachments || [];

  const primaryContact =
    contacts.find(
      (contact) => contact.isPrimary
    ) || null;

  const openOpportunities =
    opportunities.filter(
      (opportunity) =>
        opportunity.status === "Đang mở" ||
        opportunity.status === "Mở" ||
        opportunity.status === "Open"
    );

  const closedOpportunities =
    opportunities.filter(
      (opportunity) =>
        opportunity.status !== "Đang mở" &&
        opportunity.status !== "Mở" &&
        opportunity.status !== "Open"
    );

  /*
   * Nếu mockData đã có openOpportunityValue
   * thì ưu tiên giá trị đó.
   *
   * Nếu không có, tự tính từ các cơ hội đang mở.
   */
  const openOpportunityValue =
    customer.openOpportunityValue ??
    openOpportunities.reduce(
      (total, opportunity) =>
        total + (Number(opportunity.value) || 0),
      0
    );

  /*
   * Nếu mockData đã có totalSignedValue
   * thì sử dụng giá trị đó.
   *
   * Nếu không có thì tính từ các cơ hội đã đóng.
   */
  const totalSignedValue =
    customer.totalSignedValue ??
    closedOpportunities.reduce(
      (total, opportunity) =>
        total + (Number(opportunity.value) || 0),
      0
    );

  const formatCurrency = (value) => {
    return `${new Intl.NumberFormat("vi-VN").format(
      Number(value) || 0
    )} đ`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    ).format(parsedDate);
  };

  const getInitials = (name = "") => {
    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return "KH";
    }

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "người quyết định":
        return "Người quyết định";

      case "người ảnh hưởng":
        return "Người ảnh hưởng";

      case "người dùng cuối":
        return "Người dùng cuối";

      case "người cản trở":
        return "Người cản trở";

      default:
        return role || "Chưa xác định";
    }
  };

  const getOpportunityStatusClass = (
    status
  ) => {
    if (
      status === "Đang mở" ||
      status === "Mở" ||
      status === "Open"
    ) {
      return "status-badge status-badge-blue";
    }

    if (
      status === "Đã thắng" ||
      status === "Thành công" ||
      status === "Won"
    ) {
      return "status-badge status-badge-green";
    }

    if (
      status === "Đã đóng" ||
      status === "Đã thua" ||
      status === "Closed" ||
      status === "Lost"
    ) {
      return "status-badge status-badge-gray";
    }

    return "status-badge";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "meeting":
        return <Users size={17} />;

      case "call":
        return <Phone size={17} />;

      case "email":
        return <Mail size={17} />;

      case "task":
        return <CheckCircle2 size={17} />;

      default:
        return <Activity size={17} />;
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "meeting":
        return "Cuộc họp";

      case "call":
        return "Cuộc gọi";

      case "email":
        return "Email";

      case "task":
        return "Công việc";

      default:
        return "Hoạt động";
    }
  };

  return (
    <div className="customer360-page">
      {/* =========================
          HEADER
      ========================== */}
      <div className="customer360-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Quay lại khách hàng
        </button>

        <div className="customer360-header-main">
          <div className="customer360-company-icon">
            <Building2 size={30} />
          </div>

          <div className="customer360-title">
            <div className="customer360-title-row">
              <h1>
                {customer.companyName}
              </h1>

              <span className="customer-status-badge">
                {customer.status}
              </span>
            </div>

            <p>
              Customer 360° · Mã số thuế{" "}
              <strong>
                {customer.taxCode ||
                  "Chưa cập nhật"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          SUMMARY
      ========================== */}
      <div className="customer360-summary">
        <div className="customer360-summary-card">
          <div className="customer360-summary-icon">
            <Target size={20} />
          </div>

          <div>
            <span>
              Tổng giá trị đã ký
            </span>

            <strong>
              {formatCurrency(
                totalSignedValue
              )}
            </strong>
          </div>
        </div>

        <div className="customer360-summary-card">
          <div className="customer360-summary-icon">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <span>
              Cơ hội đang mở
            </span>

            <strong>
              {formatCurrency(
                openOpportunityValue
              )}
            </strong>
          </div>
        </div>

        <div className="customer360-summary-card">
          <div className="customer360-summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>
              Người liên hệ
            </span>

            <strong>
              {contacts.length}
            </strong>
          </div>
        </div>

        <div className="customer360-summary-card">
          <div className="customer360-summary-icon">
            <Activity size={20} />
          </div>

          <div>
            <span>
              Hoạt động
            </span>

            <strong>
              {activities.length}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================
          COMPANY INFORMATION
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <Building2 size={19} />
              Thông tin doanh nghiệp
            </h2>

            <p>
              Thông tin hồ sơ khách hàng
            </p>
          </div>
        </div>

        <div className="customer360-company-grid">
          <div className="customer360-info-item">
            <span>Tên công ty</span>

            <strong>
              {customer.companyName}
            </strong>
          </div>

          <div className="customer360-info-item">
            <span>Mã số thuế</span>

            <strong>
              {customer.taxCode ||
                "Chưa cập nhật"}
            </strong>
          </div>

          <div className="customer360-info-item">
            <span>Ngành nghề</span>

            <strong>
              {customer.industry ||
                "Chưa cập nhật"}
            </strong>
          </div>

          <div className="customer360-info-item">
            <span>Quy mô</span>

            <strong>
              {customer.scale ||
                "Chưa cập nhật"}
            </strong>
          </div>

          <div className="customer360-info-item">
            <span>Website</span>

            {customer.website ? (
              <a
                href={customer.website}
                target="_blank"
                rel="noreferrer"
                className="customer360-link"
              >
                {customer.website}
                <ExternalLink size={14} />
              </a>
            ) : (
              <strong>
                Chưa cập nhật
              </strong>
            )}
          </div>

          <div className="customer360-info-item">
            <span>Người sở hữu</span>

            <strong>
              {customer.owner ||
                "Chưa cập nhật"}
            </strong>
          </div>

          <div className="customer360-info-item customer360-info-full">
            <span>
              <MapPin size={15} />
              Địa chỉ
            </span>

            <strong>
              {customer.address ||
                "Chưa cập nhật"}
            </strong>
          </div>
        </div>
      </section>

      {/* =========================
          PRIMARY CONTACT
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <User size={19} />
              Người liên hệ chính
            </h2>

            <p>
              Đầu mối liên hệ chính của doanh nghiệp
            </p>
          </div>
        </div>

        {primaryContact ? (
          <div className="primary-contact-card">
            <div className="primary-contact-avatar">
              {getInitials(
                primaryContact.name
              )}
            </div>

            <div className="primary-contact-main">
              <div className="primary-contact-name">
                <strong>
                  {primaryContact.name}
                </strong>

                <span className="primary-label">
                  Người liên hệ chính
                </span>
              </div>

              <span>
                {primaryContact.position ||
                  "Chưa cập nhật"}
              </span>
            </div>

            <div className="primary-contact-detail">
              <Mail size={16} />

              <span>
                {primaryContact.email ||
                  "Chưa cập nhật"}
              </span>
            </div>

            <div className="primary-contact-detail">
              <Phone size={16} />

              <span>
                {primaryContact.phone ||
                  "Chưa cập nhật"}
              </span>
            </div>
          </div>
        ) : (
          <div className="customer360-empty-box">
            <User size={24} />

            <span>
              Khách hàng chưa có người liên hệ chính.
            </span>
          </div>
        )}
      </section>

      {/* =========================
          ALL CONTACTS
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <Users size={19} />
              Danh sách người liên hệ
            </h2>

            <p>
              {contacts.length} người liên hệ
            </p>
          </div>
        </div>

        {contacts.length > 0 ? (
          <div className="customer360-contact-list">
            {contacts.map((contact) => (
              <div
                className="customer360-contact-row"
                key={contact.id}
              >
                <div className="customer360-contact-avatar">
                  {getInitials(
                    contact.name
                  )}
                </div>

                <div className="customer360-contact-person">
                  <strong>
                    {contact.name}
                  </strong>

                  <span>
                    {contact.position ||
                      "Chưa cập nhật"}
                  </span>
                </div>

                <div className="customer360-contact-role">
                  <span
                    className={`contact-role-badge ${
                      contact.role ===
                      "người quyết định"
                        ? "contact-role-decision"
                        : contact.role ===
                            "người ảnh hưởng"
                          ? "contact-role-influence"
                          : contact.role ===
                              "người dùng cuối"
                            ? "contact-role-user"
                            : "contact-role-blocker"
                    }`}
                  >
                    {getRoleLabel(
                      contact.role
                    )}
                  </span>

                  {contact.isPrimary && (
                    <span className="primary-label">
                      Chính
                    </span>
                  )}
                </div>

                <div className="customer360-contact-info">
                  <span>
                    <Mail size={14} />
                    {contact.email ||
                      "Chưa cập nhật"}
                  </span>

                  <span>
                    <Phone size={14} />
                    {contact.phone ||
                      "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="customer360-empty-box">
            <Users size={24} />

            <span>
              Chưa có người liên hệ nào.
            </span>
          </div>
        )}
      </section>

      {/* =========================
          CONTACT HISTORY
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <Clock3 size={19} />
              Lịch sử người liên hệ
            </h2>

            <p>
              Theo dõi lịch sử thay đổi khách hàng
              của người liên hệ
            </p>
          </div>
        </div>

        {contacts.some(
          (contact) =>
            contact.previousCompany ||
            contact.customerHistory?.length > 1
        ) ? (
          <div className="customer360-history-list">
            {contacts
              .filter(
                (contact) =>
                  contact.previousCompany ||
                  contact.customerHistory?.length > 1
              )
              .map((contact) => (
                <div
                  className="customer360-history-item"
                  key={`history-${contact.id}`}
                >
                  <div className="customer360-history-avatar">
                    {getInitials(
                      contact.name
                    )}
                  </div>

                  <div className="customer360-history-content">
                    <strong>
                      {contact.name}
                    </strong>

                    {contact.previousCompany && (
                      <p>
                        Công ty trước:{" "}
                        <strong>
                          {
                            contact.previousCompany
                          }
                        </strong>
                      </p>
                    )}

                    {contact.customerHistory &&
                      contact.customerHistory.length >
                        0 && (
                        <div className="customer360-history-events">
                          {contact.customerHistory.map(
                            (
                              history,
                              index
                            ) => (
                              <div
                                key={`${contact.id}-${index}`}
                                className="customer360-history-event"
                              >
                                <span>
                                  {history.action ||
                                    "Cập nhật"}
                                </span>

                                <strong>
                                  {
                                    history.companyName
                                  }
                                </strong>

                                <small>
                                  {formatDate(
                                    history.date
                                  )}
                                </small>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="customer360-empty-box">
            <Clock3 size={24} />

            <span>
              Chưa có lịch sử chuyển đổi người liên hệ.
            </span>
          </div>
        )}
      </section>

      {/* =========================
          OPPORTUNITIES
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <BriefcaseBusiness size={19} />
              Cơ hội kinh doanh
            </h2>

            <p>
              Theo dõi cơ hội và giá trị giao dịch
            </p>
          </div>

          <span className="section-count">
            {opportunities.length} cơ hội
          </span>
        </div>

        {opportunities.length > 0 ? (
          <div className="customer360-opportunity-list">
            {opportunities.map(
              (opportunity) => (
                <div
                  className="customer360-opportunity-row"
                  key={opportunity.id}
                >
                  <div className="opportunity-main">
                    <strong>
                      {opportunity.name}
                    </strong>

                    <span>
                      Cơ hội kinh doanh
                    </span>
                  </div>

                  <div className="opportunity-value">
                    {formatCurrency(
                      opportunity.value
                    )}
                  </div>

                  <span
                    className={getOpportunityStatusClass(
                      opportunity.status
                    )}
                  >
                    {opportunity.status ||
                      "Chưa xác định"}
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="customer360-empty-box">
            <BriefcaseBusiness size={24} />

            <span>
              Khách hàng chưa có cơ hội kinh doanh.
            </span>
          </div>
        )}
      </section>

      {/* =========================
          ACTIVITY TIMELINE
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <Activity size={19} />
              Timeline hoạt động
            </h2>

            <p>
              Lịch sử tương tác với khách hàng
            </p>
          </div>

          <span className="section-count">
            {activities.length} hoạt động
          </span>
        </div>

        {activities.length > 0 ? (
          <div className="customer360-timeline">
            {activities
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.date) -
                  new Date(a.date)
              )
              .map((activity) => (
                <div
                  className="customer360-timeline-item"
                  key={activity.id}
                >
                  <div className="timeline-icon">
                    {getActivityIcon(
                      activity.type
                    )}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-top">
                      <strong>
                        {activity.title ||
                          getActivityTypeLabel(
                            activity.type
                          )}
                      </strong>

                      <span>
                        <CalendarDays
                          size={14}
                        />

                        {formatDate(
                          activity.date
                        )}
                      </span>
                    </div>

                    <span className="timeline-type">
                      {getActivityTypeLabel(
                        activity.type
                      )}
                    </span>

                    {activity.description && (
                      <p>
                        {
                          activity.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="customer360-empty-box">
            <Activity size={24} />

            <span>
              Chưa có hoạt động nào.
            </span>
          </div>
        )}
      </section>

      {/* =========================
          ATTACHMENTS
      ========================== */}
      <section className="customer360-section">
        <div className="customer360-section-header">
          <div>
            <h2>
              <Paperclip size={19} />
              File đính kèm
            </h2>

            <p>
              Tài liệu liên quan đến khách hàng
            </p>
          </div>

          <span className="section-count">
            {attachments.length} file
          </span>
        </div>

        {attachments.length > 0 ? (
          <div className="customer360-attachment-list">
            {attachments.map(
              (attachment) => (
                <div
                  className="customer360-attachment-row"
                  key={attachment.id}
                >
                  <div className="attachment-icon">
                    <FileText size={20} />
                  </div>

                  <div className="attachment-main">
                    <strong>
                      {attachment.name}
                    </strong>

                    <span>
                      {attachment.size ||
                        "Kích thước chưa cập nhật"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="attachment-download"
                    title="Tải file"
                    onClick={() => {
                      /*
                       * Mock data hiện tại chỉ có tên file,
                       * chưa có URL thực tế.
                       *
                       * Khi backend/file storage được tích hợp,
                       * có thể thay phần này bằng URL download.
                       */
                      window.alert(
                        `File: ${attachment.name}`
                      );
                    }}
                  >
                    <Download size={17} />
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="customer360-empty-box">
            <Paperclip size={24} />

            <span>
              Chưa có file đính kèm.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

export default Customer360Page;