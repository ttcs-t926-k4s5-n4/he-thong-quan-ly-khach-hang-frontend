
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  Users,
  Target,
  FileSpreadsheet,
  Code2,
  Plus,
  Search,
  Upload,
  Download,
  Copy,
  LayoutDashboard,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  Trash2,
  CalendarDays,
  Wallet,
} from "lucide-react";
import "./index.css";

const initialLeads = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    phone: "0912345678",
    company: "ABC Technology",
    interest: "Phần mềm CRM",
    source: "Website",
    campaign: "Chiến dịch tháng 10",
    status: "Mới",
  },
  {
    id: 2,
    name: "Trần Quốc Huy",
    email: "quochuy@example.com",
    phone: "0987654321",
    company: "Huy Phát",
    interest: "Tư vấn phần mềm",
    source: "Hội thảo",
    campaign: "Hội thảo CRM",
    status: "Đã liên hệ",
  },
];

const initialCampaigns = [
  {
    id: 1,
    name: "Chiến dịch tháng 10",
    budget: 10000000,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    channel: "Website",
    opportunities: 0,
    revenue: 0,
  },
  {
    id: 2,
    name: "Hội thảo CRM",
    budget: 15000000,
    startDate: "2026-10-10",
    endDate: "2026-10-20",
    channel: "Sự kiện",
    opportunities: 0,
    revenue: 0,
  },
];

const blankLead = {
  name: "",
  email: "",
  phone: "",
  company: "",
  interest: "",
  campaign: "Chiến dịch tháng 10",
};

const blankCampaign = {
  name: "",
  budget: "",
  startDate: "",
  endDate: "",
  channel: "Website",
};

const navigation = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "leads", label: "Danh sách Lead", icon: Users },
  { id: "manual", label: "Thêm Lead", icon: Plus },
  { id: "excel", label: "Nhập Excel", icon: FileSpreadsheet },
  { id: "embed", label: "Biểu mẫu nhúng", icon: Code2 },
  { id: "campaigns", label: "Chiến dịch", icon: Megaphone },
];

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " đ";

function App() {
  const [page, setPage] = useState("dashboard");
  const [leads, setLeads] = useState(initialLeads);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [form, setForm] = useState(blankLead);
  const [campaignForm, setCampaignForm] = useState(blankCampaign);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState([]);
  const [embedUrl, setEmbedUrl] = useState("");
  const [publicForm, setPublicForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: "",
  });
  const [ipWindow, setIpWindow] = useState({ count: 0, startedAt: 0 });

  function notify(message, type = "success") {
    setNotice(message);
    setNoticeType(type);
  }

  const filteredLeads = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return leads.filter((lead) =>
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.interest,
        lead.source,
        lead.campaign,
      ].some((value) =>
        String(value || "").toLowerCase().includes(keyword)
      )
    );
  }, [leads, search]);

  const totalRevenue = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.revenue || 0),
    0
  );

  const contactedCount = leads.filter(
    (lead) => lead.status === "Đã liên hệ"
  ).length;

  function updateLeadForm(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function addLead(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const company = form.company.trim();
    const interest = form.interest.trim();

    if (!name || !email || !phone || !company || !interest) {
      notify("Vui lòng nhập đầy đủ các trường bắt buộc.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify("Email không đúng định dạng.", "error");
      return;
    }

    if (leads.some((lead) => lead.email.toLowerCase() === email)) {
      notify("Email này đã tồn tại trong danh sách Lead.", "error");
      return;
    }

    const campaignName = form.campaign || "Chưa phân chiến dịch";

    setLeads((previous) => [
      {
        id: Date.now(),
        name,
        email,
        phone,
        company,
        interest,
        campaign: campaignName,
        source: "Nhập thủ công",
        status: "Mới",
      },
      ...previous,
    ]);

    setForm({
      ...blankLead,
      campaign: campaigns[0]?.name || "Chưa phân chiến dịch",
    });

    notify("Thêm Lead thành công.");
  }

  function deleteLead(id) {
    const lead = leads.find((item) => item.id === id);

    setLeads((previous) => previous.filter((item) => item.id !== id));

    if (lead) {
      notify(`Đã xóa Lead ${lead.name}.`);
    }
  }

  function updateLeadStatus(id, status) {
    setLeads((previous) =>
      previous.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      )
    );

    notify("Đã cập nhật trạng thái Lead.");
  }

  function downloadTemplate() {
    const sample = [
      {
        "Họ tên": "Nguyễn Văn A",
        Email: "vana@example.com",
        "Số điện thoại": "0912345678",
        "Công ty": "Công ty ABC",
        "Nhu cầu quan tâm": "Phần mềm CRM",
        "Chiến dịch": "Chiến dịch tháng 10",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "lead_import_template.xlsx");

    notify("Đã tạo file Excel mẫu.");
  }

  function readExcel(event) {
    const file = event.target.files?.[0];

    setErrors([]);
    setPreviewRows([]);
    setFileName("");

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      notify("Vui lòng chọn file .xlsx hoặc .xls.", "error");
      event.target.value = "";
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, {
          type: "array",
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(firstSheet, {
          defval: "",
          raw: false,
        });

        if (!rows.length) {
          notify("File Excel chưa có dữ liệu.", "error");
          return;
        }

        const existingEmails = new Set(
          leads.map((lead) => lead.email.toLowerCase())
        );

        const batchEmails = new Set();
        const validRows = [];
        const rowErrors = [];

        rows.forEach((row, index) => {
          const name = String(row["Họ tên"] || "").trim();
          const email = String(row["Email"] || "").trim().toLowerCase();
          const phone = String(row["Số điện thoại"] || "").trim();
          const company = String(row["Công ty"] || "").trim();
          const interest = String(
            row["Nhu cầu quan tâm"] || ""
          ).trim();

          const campaign = String(row["Chiến dịch"] || "").trim();

          if (!name || !email || !phone || !company || !interest) {
            rowErrors.push(
              `Dòng ${index + 2}: Thiếu trường thông tin bắt buộc.`
            );
            return;
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            rowErrors.push(
              `Dòng ${index + 2}: Email không hợp lệ.`
            );
            return;
          }

          if (
            existingEmails.has(email) ||
            batchEmails.has(email)
          ) {
            rowErrors.push(
              `Dòng ${index + 2}: Email đã tồn tại hoặc bị trùng.`
            );
            return;
          }

          existingEmails.add(email);
          batchEmails.add(email);

          validRows.push({
            name,
            email,
            phone,
            company,
            interest,
            campaign: campaign || "Chưa phân chiến dịch",
            source: "Excel",
            status: "Mới",
          });
        });

        setPreviewRows(validRows);
        setErrors(rowErrors);

        if (validRows.length) {
          notify(
            `Đọc được ${validRows.length} Lead hợp lệ. Hãy kiểm tra trước khi nhập.`
          );
        } else {
          notify("Không có dòng dữ liệu hợp lệ.", "error");
        }
      } catch {
        notify("Không thể đọc file Excel. Hãy kiểm tra lại file.", "error");
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = "";
  }

  function confirmImport() {
    if (!previewRows.length) {
      notify("Không có dữ liệu để nhập.", "error");
      return;
    }

    const imported = previewRows.map((row, index) => ({
      ...row,
      id: Date.now() + index,
    }));

    setLeads((previous) => [...imported, ...previous]);
    setPreviewRows([]);
    setErrors([]);

    notify(`Đã nhập thành công ${imported.length} Lead.`);
  }

  function updateCampaignForm(event) {
    const { name, value } = event.target;

    setCampaignForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function addCampaign(event) {
    event.preventDefault();

    const name = campaignForm.name.trim();
    const budget = Number(campaignForm.budget);

    if (!name) {
      notify("Vui lòng nhập tên chiến dịch.", "error");
      return;
    }

    if (!Number.isFinite(budget) || budget < 0) {
      notify("Ngân sách phải là số không âm.", "error");
      return;
    }

    if (
      campaignForm.startDate &&
      campaignForm.endDate &&
      campaignForm.endDate < campaignForm.startDate
    ) {
      notify("Ngày kết thúc phải sau ngày bắt đầu.", "error");
      return;
    }

    if (
      campaigns.some(
        (campaign) =>
          campaign.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      notify("Tên chiến dịch đã tồn tại.", "error");
      return;
    }

    setCampaigns((previous) => [
      ...previous,
      {
        id: Date.now(),
        name,
        budget,
        startDate: campaignForm.startDate,
        endDate: campaignForm.endDate,
        channel: campaignForm.channel,
        opportunities: 0,
        revenue: 0,
      },
    ]);

    setCampaignForm(blankCampaign);
    notify("Tạo chiến dịch thành công.");
  }

  function updateCampaign(id, field, value) {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
      notify("Giá trị phải là số không âm.", "error");
      return;
    }

    setCampaigns((previous) =>
      previous.map((campaign) =>
        campaign.id === id
          ? { ...campaign, [field]: amount }
          : campaign
      )
    );
  }

  const embedCode = `<iframe src="${embedUrl || "https://your-domain.example/lead-form"}" title="Đăng ký tư vấn" width="100%" height="600"></iframe>`;

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(embedCode);
      notify("Đã sao chép mã nhúng.");
    } catch {
      notify(
        "Trình duyệt không cho phép sao chép tự động. Hãy chọn mã và nhấn Ctrl+C.",
        "error"
      );
    }
  }

  function submitPublicForm(event) {
    event.preventDefault();

    const now = Date.now();
    const windowMs = 60 * 1000;

    const currentWindow =
      now - ipWindow.startedAt > windowMs
        ? { count: 0, startedAt: now }
        : ipWindow;

    if (currentWindow.count >= 3) {
      notify(
        "Đã đạt giới hạn gửi thử. Vui lòng chờ một phút.",
        "error"
      );
      return;
    }

    const { name, email, phone, company, interest } = publicForm;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !company.trim() ||
      !interest.trim()
    ) {
      notify("Vui lòng nhập đầy đủ thông tin biểu mẫu.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify("Email không hợp lệ.", "error");
      return;
    }

    if (
      leads.some(
        (lead) => lead.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      notify("Email này đã được đăng ký.", "error");
      return;
    }

    setIpWindow({
      count: currentWindow.count + 1,
      startedAt: currentWindow.startedAt,
    });

    setLeads((previous) => [
      {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim(),
        interest: interest.trim(),
        source: "Biểu mẫu website",
        campaign: "Chưa phân chiến dịch",
        status: "Mới",
      },
      ...previous,
    ]);

    setPublicForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      interest: "",
    });

    notify("Gửi thông tin thành công!");
  }

  const pageTitle =
    navigation.find((item) => item.id === page)?.label || "Tổng quan";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Target size={25} />
          </div>
          <div>
            <strong>LeadFlow</strong>
            <small>MARKETING CRM</small>
          </div>
        </div>

        <p className="nav-heading">KHÔNG GIAN LÀM VIỆC</p>

        <nav className="navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => {
                setPage(id);
                setNotice("");
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">M</div>
          <div>
            <strong>Marketing</strong>
            <small>Nhân viên Marketing</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Marketing / Quản lý Lead</div>
            <h1>{pageTitle}</h1>
          </div>

          <span className="user-chip">
            <span className="online-dot" />
            Đang làm việc
          </span>
        </header>

        {notice && (
          <div className={`notice ${noticeType === "error" ? "error" : ""}`}>
            {noticeType === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Đóng thông báo">
              ×
            </button>
          </div>
        )}

        {page === "dashboard" && (
          <>
            <section className="welcome">
              <div>
                <span className="eyebrow">MARKETING WORKSPACE</span>
                <h2>Quản lý Lead hiệu quả hơn</h2>
                <p>
                  Thu thập khách hàng tiềm năng và theo dõi hiệu quả
                  chiến dịch Marketing tại một nơi.
                </p>
              </div>
              <button
                className="btn primary"
                onClick={() => setPage("manual")}
              >
                <Plus size={18} />
                Thêm Lead mới
              </button>
            </section>

            <section className="stats">
              <Stat
                icon={Users}
                label="Tổng Lead"
                value={leads.length}
              />
              <Stat
                icon={Target}
                label="Chiến dịch"
                value={campaigns.length}
              />
              <Stat
                icon={CheckCircle2}
                label="Đã liên hệ"
                value={contactedCount}
              />
              <Stat
                icon={Wallet}
                label="Doanh thu đã chốt"
                value={formatMoney(totalRevenue)}
              />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Lead gần đây</h3>
                  <p>Danh sách khách hàng tiềm năng mới nhất</p>
                </div>
                <button
                  className="btn secondary"
                  onClick={() => setPage("leads")}
                >
                  Xem tất cả
                </button>
              </div>

              <LeadTable
                leads={leads.slice(0, 5)}
                onDelete={deleteLead}
                onStatusChange={updateLeadStatus}
              />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Hiệu quả chiến dịch</h3>
                  <p>Số Lead và doanh thu theo từng chiến dịch</p>
                </div>
              </div>
              <CampaignSummary leads={leads} campaigns={campaigns} />
            </section>
          </>
        )}

        {page === "leads" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Danh sách khách hàng tiềm năng</h3>
                <p>Tra cứu, quản lý và cập nhật trạng thái Lead</p>
              </div>
              <button
                className="btn primary"
                onClick={() => setPage("manual")}
              >
                <Plus size={17} />
                Thêm Lead
              </button>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, email, công ty..."
              />
            </div>

            <LeadTable
              leads={filteredLeads}
              onDelete={deleteLead}
              onStatusChange={updateLeadStatus}
            />
          </section>
        )}

        {page === "manual" && (
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h3>Thêm Lead thủ công</h3>
                <p>
                  Nhập thông tin khách hàng từ sự kiện hoặc danh thiếp
                </p>
              </div>
            </div>

            <form onSubmit={addLead} className="form-grid">
              <Field
                label="Họ và tên *"
                name="name"
                value={form.name}
                onChange={updateLeadForm}
                placeholder="Nguyễn Văn A"
                required
              />
              <Field
                label="Email *"
                name="email"
                type="email"
                value={form.email}
                onChange={updateLeadForm}
                placeholder="email@congty.com"
                required
              />
              <Field
                label="Số điện thoại *"
                name="phone"
                value={form.phone}
                onChange={updateLeadForm}
                placeholder="0912345678"
                required
              />
              <Field
                label="Công ty *"
                name="company"
                value={form.company}
                onChange={updateLeadForm}
                placeholder="Tên công ty"
                required
              />
              <Field
                label="Nhu cầu quan tâm *"
                name="interest"
                value={form.interest}
                onChange={updateLeadForm}
                placeholder="Ví dụ: Phần mềm CRM"
                required
              />

              <div className="field">
                <label>Chiến dịch</label>
                <select
                  name="campaign"
                  value={form.campaign}
                  onChange={updateLeadForm}
                >
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.name}>
                      {campaign.name}
                    </option>
                  ))}
                  <option value="Chưa phân chiến dịch">
                    Chưa phân chiến dịch
                  </option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setForm(blankLead)}
                >
                  Làm mới
                </button>
                <button className="btn primary" type="submit">
                  <Plus size={17} />
                  Lưu Lead
                </button>
              </div>
            </form>
          </section>
        )}

        {page === "excel" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Nhập Lead từ Excel</h3>
                <p>
                  Tải file mẫu, chọn file và xem trước dữ liệu trước khi nhập
                </p>
              </div>
              <button className="btn secondary" onClick={downloadTemplate}>
                <Download size={17} />
                Tải file mẫu
              </button>
            </div>

            <label className="upload-area">
              <Upload size={34} />
              <strong>Chọn file Excel để nhập dữ liệu</strong>
              <span>Hỗ trợ định dạng .xlsx và .xls</span>
              <span className="btn primary">Chọn file</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={readExcel}
              />
            </label>

            {fileName && (
              <p className="file-name">
                <FileSpreadsheet size={17} />
                {fileName}
              </p>
            )}

            <div className="info-box">
              <AlertCircle size={19} />
              <div>
                <strong>Định dạng file yêu cầu</strong>
                <p>
                  Các cột bắt buộc: Họ tên, Email, Số điện thoại, Công ty,
                  Nhu cầu quan tâm. Cột Chiến dịch là tùy chọn.
                </p>
              </div>
            </div>

            {previewRows.length > 0 && (
              <section className="preview-section">
                <div className="panel-heading">
                  <div>
                    <h3>Xem trước dữ liệu hợp lệ</h3>
                    <p>{previewRows.length} dòng sẵn sàng nhập</p>
                  </div>
                  <button
                    className="btn primary"
                    onClick={confirmImport}
                  >
                    Xác nhận nhập
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Công ty</th>
                        <th>Chiến dịch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, index) => (
                        <tr key={`${row.email}-${index}`}>
                          <td>{row.name}</td>
                          <td>{row.email}</td>
                          <td>{row.company}</td>
                          <td>{row.campaign}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {errors.length > 0 && (
              <div className="error-list">
                <strong>Các dòng chưa được nhập ({errors.length})</strong>
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "embed" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Biểu mẫu thu thập Lead</h3>
                <p>
                  Tạo mã nhúng và xem trước biểu mẫu đăng ký tư vấn
                </p>
              </div>
            </div>

            <div className="field embed-url-field">
              <label>Địa chỉ biểu mẫu đã triển khai (tùy chọn)</label>
              <input
                value={embedUrl}
                onChange={(event) => setEmbedUrl(event.target.value)}
                placeholder="https://ten-mien-cua-ban.vn/lead-form"
              />
            </div>

            <div className="info-box">
              <Code2 size={20} />
              <div>
                <strong>Mã iframe để nhúng vào website</strong>
                <p>
                  Thay địa chỉ mẫu bằng URL biểu mẫu thực tế đã triển khai.
                </p>
              </div>
            </div>

            <pre className="code-area">{embedCode}</pre>

            <button className="btn primary" onClick={copyEmbed}>
              <Copy size={17} />
              Sao chép mã nhúng
            </button>

            <div className="form-preview">
              <span className="eyebrow">FORM PREVIEW</span>
              <h3>Đăng ký nhận tư vấn</h3>
              <p>Để lại thông tin để đội ngũ Marketing liên hệ với bạn.</p>

              <form className="form-grid" onSubmit={submitPublicForm}>
                <Field
                  label="Họ và tên *"
                  value={publicForm.name}
                  onChange={(event) =>
                    setPublicForm({
                      ...publicForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Nguyễn Văn A"
                  required
                />
                <Field
                  label="Email *"
                  type="email"
                  value={publicForm.email}
                  onChange={(event) =>
                    setPublicForm({
                      ...publicForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="email@congty.com"
                  required
                />
                <Field
                  label="Số điện thoại *"
                  value={publicForm.phone}
                  onChange={(event) =>
                    setPublicForm({
                      ...publicForm,
                      phone: event.target.value,
                    })
                  }
                  placeholder="0912345678"
                  required
                />
                <Field
                  label="Công ty *"
                  value={publicForm.company}
                  onChange={(event) =>
                    setPublicForm({
                      ...publicForm,
                      company: event.target.value,
                    })
                  }
                  placeholder="Tên công ty"
                  required
                />
                <Field
                  label="Nhu cầu quan tâm *"
                  value={publicForm.interest}
                  onChange={(event) =>
                    setPublicForm({
                      ...publicForm,
                      interest: event.target.value,
                    })
                  }
                  placeholder="Nhu cầu tư vấn"
                  required
                />
                <div className="form-actions">
                  <button className="btn primary" type="submit">
                    Gửi thông tin
                  </button>
                </div>
              </form>
              <p className="muted">
                Đây là biểu mẫu thử nghiệm trong ứng dụng React hiện tại.
              </p>
            </div>

            <p className="muted">
              Lưu ý: giới hạn gửi trong bản demo chỉ hoạt động ở trình duyệt
              hiện tại. Khi triển khai thực tế, cần chống spam và giới hạn
              tần suất tại Backend để bảo vệ hệ thống.
            </p>
          </section>
        )}

        {page === "campaigns" && (
          <>
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Tạo chiến dịch Marketing</h3>
                  <p>
                    Khai báo ngân sách, thời gian chạy và kênh triển khai
                  </p>
                </div>
              </div>

              <form className="form-grid" onSubmit={addCampaign}>
                <Field
                  label="Tên chiến dịch *"
                  name="name"
                  value={campaignForm.name}
                  onChange={updateCampaignForm}
                  placeholder="Ví dụ: Chiến dịch tháng 11"
                  required
                />
                <Field
                  label="Ngân sách (VNĐ)"
                  name="budget"
                  type="number"
                  value={campaignForm.budget}
                  onChange={updateCampaignForm}
                  placeholder="10000000"
                  required
                />
                <Field
                  label="Ngày bắt đầu"
                  name="startDate"
                  type="date"
                  value={campaignForm.startDate}
                  onChange={updateCampaignForm}
                />
                <Field
                  label="Ngày kết thúc"
                  name="endDate"
                  type="date"
                  value={campaignForm.endDate}
                  onChange={updateCampaignForm}
                />

                <div className="field">
                  <label>Kênh Marketing</label>
                  <select
                    name="channel"
                    value={campaignForm.channel}
                    onChange={updateCampaignForm}
                  >
                    <option>Website</option>
                    <option>Email</option>
                    <option>Quảng cáo</option>
                    <option>Sự kiện</option>
                    <option>Mạng xã hội</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button className="btn primary" type="submit">
                    <Plus size={17} />
                    Tạo chiến dịch
                  </button>
                </div>
              </form>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Hiệu quả chiến dịch</h3>
                  <p>
                    Theo dõi số Lead, cơ hội và doanh thu đã chốt
                  </p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Chiến dịch</th>
                      <th>Kênh</th>
                      <th>Thời gian</th>
                      <th>Ngân sách</th>
                      <th>Số Lead</th>
                      <th>Cơ hội</th>
                      <th>Doanh thu đã chốt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td><strong>{campaign.name}</strong></td>
                        <td>{campaign.channel}</td>
                        <td>
                          {campaign.startDate || "—"} đến{" "}
                          {campaign.endDate || "—"}
                        </td>
                        <td>{formatMoney(campaign.budget)}</td>
                        <td>
                          {leads.filter(
                            (lead) => lead.campaign === campaign.name
                          ).length}
                        </td>
                        <td>
                          <input
                            className="small-number"
                            type="number"
                            min="0"
                            value={campaign.opportunities}
                            onChange={(event) =>
                              updateCampaign(
                                campaign.id,
                                "opportunities",
                                event.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="small-number revenue"
                            type="number"
                            min="0"
                            value={campaign.revenue}
                            onChange={(event) =>
                              updateCampaign(
                                campaign.id,
                                "revenue",
                                event.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={21} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div className="field">
      <label>
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function LeadTable({ leads, onDelete, onStatusChange }) {
  if (!leads.length) {
    return <div className="empty">Chưa có Lead phù hợp.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Công ty</th>
            <th>Nhu cầu</th>
            <th>Nguồn</th>
            <th>Chiến dịch</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div className="customer">
                  <strong>{lead.name}</strong>
                  <small>{lead.email}</small>
                  <small>{lead.phone}</small>
                </div>
              </td>
              <td>{lead.company}</td>
              <td>{lead.interest}</td>
              <td><span className="source-tag">{lead.source}</span></td>
              <td>{lead.campaign}</td>
              <td>
                <select
                  className={`status-select ${
                    lead.status === "Mới" ? "new" : "contacted"
                  }`}
                  value={lead.status}
                  onChange={(event) =>
                    onStatusChange(lead.id, event.target.value)
                  }
                >
                  <option value="Mới">Mới</option>
                  <option value="Đã liên hệ">Đã liên hệ</option>
                  <option value="Đủ điều kiện">Đủ điều kiện</option>
                </select>
              </td>
              <td>
                <button
                  className="icon-button"
                  title="Xóa Lead"
                  onClick={() => onDelete(lead.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CampaignSummary({ leads, campaigns }) {
  return (
    <div className="campaign-summary">
      {campaigns.map((campaign) => {
        const count = leads.filter(
          (lead) => lead.campaign === campaign.name
        ).length;

        return (
          <div className="campaign-summary-row" key={campaign.id}>
            <div className="campaign-summary-title">
              <div className="campaign-icon"><Megaphone size={18} /></div>
              <div>
                <strong>{campaign.name}</strong>
                <small>
                  <CalendarDays size={13} />
                  {campaign.startDate || "Chưa đặt ngày"}
                  {" – "}
                  {campaign.endDate || "Chưa đặt ngày"}
                </small>
              </div>
            </div>
            <div className="campaign-metric">
              <span>Lead</span>
              <strong>{count}</strong>
            </div>
            <div className="campaign-metric">
              <span>Ngân sách</span>
              <strong>{formatMoney(campaign.budget)}</strong>
            </div>
            <div className="campaign-metric">
              <span>Doanh thu</span>
              <strong>{formatMoney(campaign.revenue)}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
