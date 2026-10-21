
import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, BarChart3, Bell, Building2, CalendarDays,
  Check, ChevronDown, CircleDollarSign, ClipboardList, Clock3,
  FileText, Filter, GripVertical, LayoutDashboard, MoreHorizontal,
  Pencil, Plus, Search, Target, Trash2, TrendingUp, Users, X
} from "lucide-react";
import "./App.css";

const STORAGE_KEY = "ep05-opportunities";

const STAGES = [
  { id: "lead", name: "Tiềm năng", probability: 20, className: "stage-lead" },
  { id: "qualified", name: "Đủ điều kiện", probability: 40, className: "stage-qualified" },
  { id: "proposal", name: "Đề xuất", probability: 60, className: "stage-proposal" },
  { id: "negotiation", name: "Đàm phán", probability: 80, className: "stage-negotiation" },
  { id: "won", name: "Thành công", probability: 100, className: "stage-won" },
];

const PRODUCTS = [
  { id: "p1", name: "Phần mềm CRM", price: 12000000 },
  { id: "p2", name: "Dịch vụ triển khai", price: 8000000 },
  { id: "p3", name: "Đào tạo sử dụng", price: 5000000 },
  { id: "p4", name: "Gói hỗ trợ kỹ thuật", price: 3000000 },
];

const SAMPLE_OPPORTUNITIES = [
  {
    id: "OP-001", name: "Triển khai hệ thống CRM",
    customer: "Công ty ABC", contact: "Nguyễn Minh Anh",
    stage: "proposal", value: 65000000, probability: 60,
    owner: "Nguyễn Văn Nam", team: "Kinh doanh",
    closeDate: "2026-10-25", source: "Website",
    note: "Đã gửi báo giá cho khách hàng.",
    products: [{ productId: "p1", quantity: 3, unitPrice: 12000000 }, { productId: "p2", quantity: 2, unitPrice: 14500000 }]
  },
  {
    id: "OP-002", name: "Hợp đồng dịch vụ phần mềm",
    customer: "Công ty Minh Phát", contact: "Trần Hoàng Long",
    stage: "negotiation", value: 42000000, probability: 80,
    owner: "Nguyễn Văn Nam", team: "Kinh doanh",
    closeDate: "2026-10-20", source: "Giới thiệu",
    note: "Đang thương lượng điều khoản.",
    products: [{ productId: "p1", quantity: 2, unitPrice: 12000000 }, { productId: "p3", quantity: 2, unitPrice: 9000000 }]
  },
  {
    id: "OP-003", name: "Nâng cấp hệ thống quản lý",
    customer: "Công ty Đông Á", contact: "Lê Thu Hà",
    stage: "lead", value: 38000000, probability: 20,
    owner: "Trần Minh Đức", team: "Kinh doanh",
    closeDate: "2026-10-10", source: "Sự kiện",
    note: "Cần liên hệ để xác nhận nhu cầu.",
    products: [{ productId: "p1", quantity: 2, unitPrice: 12000000 }, { productId: "p2", quantity: 1, unitPrice: 14000000 }]
  },
  {
    id: "OP-004", name: "Gói đào tạo nhân viên",
    customer: "Công ty Sao Việt", contact: "Phạm Ngọc Mai",
    stage: "qualified", value: 16000000, probability: 40,
    owner: "Nguyễn Văn Nam", team: "Kinh doanh",
    closeDate: "2026-11-12", source: "Điện thoại",
    note: "",
    products: [{ productId: "p3", quantity: 2, unitPrice: 5000000 }, { productId: "p4", quantity: 2, unitPrice: 3000000 }]
  },
  {
    id: "OP-005", name: "Gia hạn dịch vụ hỗ trợ",
    customer: "Công ty Tài chính Việt Nam", contact: "Đỗ Quốc Bảo",
    stage: "won", value: 15000000, probability: 100,
    owner: "Nguyễn Văn Nam", team: "Kinh doanh",
    closeDate: "2026-10-05", source: "Khách hàng cũ",
    note: "Đã xác nhận hợp đồng.",
    products: [{ productId: "p4", quantity: 5, unitPrice: 3000000 }]
  },
];

function readSavedOpportunities() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return SAMPLE_OPPORTUNITIES;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : SAMPLE_OPPORTUNITIES;
  } catch {
    return SAMPLE_OPPORTUNITIES;
  }
}

function money(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value) || 0) + " ₫";
}

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createEmptyOpportunity() {
  return {
    id: `OP-${Date.now()}`,
    name: "",
    customer: "",
    contact: "",
    stage: "lead",
    value: 0,
    probability: 20,
    owner: "Nguyễn Văn Nam",
    team: "Kinh doanh",
    closeDate: "",
    source: "Website",
    note: "",
    products: [{ productId: "p1", quantity: 1, unitPrice: 12000000 }],
  };
}

function calculateValue(products = []) {
  return products.reduce(
    (total, product) =>
      total + Math.max(0, Number(product.quantity) || 0) *
      Math.max(0, Number(product.unitPrice) || 0),
    0
  );
}

export default function App() {
  const [opportunities, setOpportunities] = useState(readSavedOpportunities);
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyOpportunity);
  const [notice, setNotice] = useState("");
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
    } catch {
      setNotice("Không thể lưu dữ liệu vào trình duyệt.");
    }
  }, [opportunities]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const owners = useMemo(
    () => [...new Set(opportunities.map((item) => item.owner).filter(Boolean))],
    [opportunities]
  );

  const teams = useMemo(
    () => [...new Set(opportunities.map((item) => item.team).filter(Boolean))],
    [opportunities]
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return opportunities.filter((item) => {
      const matchesSearch =
        !keyword ||
        [item.name, item.customer, item.contact, item.id]
          .some((value) => String(value || "").toLowerCase().includes(keyword));
      const matchesOwner = ownerFilter === "all" || item.owner === ownerFilter;
      const matchesTeam = teamFilter === "all" || item.team === teamFilter;
      const matchesStage = stageFilter === "all" || item.stage === stageFilter;
      const matchesFrom = !fromDate || (item.closeDate && item.closeDate >= fromDate);
      const matchesTo = !toDate || (item.closeDate && item.closeDate <= toDate);
      return matchesSearch && matchesOwner && matchesTeam &&
        matchesStage && matchesFrom && matchesTo;
    });
  }, [opportunities, search, ownerFilter, teamFilter, stageFilter, fromDate, toDate]);

  const totalValue = opportunities.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const wonValue = opportunities
    .filter((item) => item.stage === "won")
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
  const openValue = totalValue - wonValue;
  const overdueCount = opportunities.filter(
    (item) => item.stage !== "won" && item.closeDate && item.closeDate < todayString()
  ).length;

  function openCreate() {
    setEditingId(null);
    setForm(createEmptyOpportunity());
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      ...item,
      products: Array.isArray(item.products) && item.products.length
        ? item.products.map((product) => ({ ...product }))
        : [{ productId: "p1", quantity: 1, unitPrice: 12000000 }],
    });
    setModalOpen(true);
  }

  function updateForm(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "stage") {
        const selectedStage = STAGES.find((stage) => stage.id === value);
        next.probability = selectedStage ? selectedStage.probability : 20;
      }
      if (field === "products") next.value = calculateValue(value);
      return next;
    });
  }

  function updateProduct(index, field, value) {
    const nextProducts = form.products.map((product, i) => {
      if (i !== index) return product;
      if (field === "productId") {
        const selected = PRODUCTS.find((item) => item.id === value);
        return { ...product, productId: value, unitPrice: selected?.price ?? 0 };
      }
      return { ...product, [field]: value };
    });
    setForm((current) => ({
      ...current,
      products: nextProducts,
      value: calculateValue(nextProducts),
    }));
  }

  function addProduct() {
    setForm((current) => ({
      ...current,
      products: [...current.products, { productId: "p1", quantity: 1, unitPrice: 12000000 }],
    }));
  }

  function removeProduct(index) {
    const nextProducts = form.products.filter((_, i) => i !== index);
    setForm((current) => ({
      ...current,
      products: nextProducts,
      value: calculateValue(nextProducts),
    }));
  }

  function saveOpportunity(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.customer.trim() || !form.contact.trim()) {
      setNotice("Vui lòng nhập tên cơ hội, khách hàng và người liên hệ.");
      return;
    }

    if (form.closeDate && !editingId && form.closeDate < todayString()) {
      setNotice("Ngày dự kiến chốt không được ở quá khứ khi tạo mới.");
      return;
    }

    const stage = STAGES.find((item) => item.id === form.stage);
    const finalOpportunity = {
      ...form,
      id: editingId || form.id || `OP-${Date.now()}`,
      name: form.name.trim(),
      customer: form.customer.trim(),
      contact: form.contact.trim(),
      value: calculateValue(form.products),
      probability: Math.min(100, Math.max(0, Number(form.probability) || 0)),
      stage: stage ? stage.id : "lead",
    };

    setOpportunities((current) =>
      editingId
        ? current.map((item) => item.id === editingId ? finalOpportunity : item)
        : [finalOpportunity, ...current]
    );
    setModalOpen(false);
    setNotice(editingId ? "Đã cập nhật cơ hội." : "Đã tạo cơ hội mới.");
  }

  function deleteOpportunity(id) {
    const item = opportunities.find((opportunity) => opportunity.id === id);
    if (!item) return;
    if (!window.confirm(`Bạn có chắc muốn xóa cơ hội "${item.name}"?`)) return;
    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
    setNotice("Đã xóa cơ hội.");
  }

  function moveOpportunity(id, stageId) {
    const stage = STAGES.find((item) => item.id === stageId);
    if (!stage) return;
    setOpportunities((current) => current.map((item) =>
      item.id === id
        ? { ...item, stage: stageId, probability: stage.probability }
        : item
    ));
    setNotice(`Đã chuyển cơ hội sang giai đoạn "${stage.name}".`);
  }

  function resetFilters() {
    setSearch("");
    setOwnerFilter("all");
    setTeamFilter("all");
    setStageFilter("all");
    setFromDate("");
    setToDate("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">N</div>
          <div><b>NOVA CRM</b><small>SALES WORKSPACE</small></div>
        </div>

        <div className="workspace-label">KHÔNG GIAN LÀM VIỆC</div>
        <div className="side-link"><LayoutDashboard size={19} /> Tổng quan</div>
        <div className="side-link"><Building2 size={19} /> Khách hàng</div>
        <div className="side-link"><Users size={19} /> Người liên hệ</div>
        <div className="side-link active"><Target size={19} /> Pipeline bán hàng
          <span className="side-count">{opportunities.length}</span>
        </div>
        <div className="side-link"><BarChart3 size={19} /> Báo cáo</div>

        <div className="sidebar-bottom">
          <div className="side-link"><Activity size={19} /> Cài đặt</div>
          <div className="user-profile">
            <div className="avatar">NV</div>
            <div><b>Nguyễn Văn Nam</b><small>Nhân viên kinh doanh</small></div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Bán hàng <span>/</span> <b>Pipeline cơ hội</b></div>
          <div className="top-actions">
            <div className="period"><CalendarDays size={17} /> Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()} <ChevronDown size={15} /></div>
            <button className="icon-button" aria-label="Thông báo"><Bell size={20} /></button>
            <div className="avatar small-avatar">NV</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow">QUẢN LÝ BÁN HÀNG</div>
            <h1>Pipeline cơ hội</h1>
            <p>Theo dõi và quản lý toàn bộ cơ hội bán hàng của bạn.</p>
          </div>
          <button className="primary-button" onClick={openCreate}><Plus size={19} /> Tạo cơ hội</button>
        </section>

        {notice && (
          <div className="notice" role="status">
            <Check size={17} /> {notice}
            <button onClick={() => setNotice("")} aria-label="Đóng thông báo"><X size={16} /></button>
          </div>
        )}

        <section className="stats-grid">
          <StatCard title="Tổng giá trị cơ hội" value={money(totalValue)} note={`${opportunities.length} cơ hội trong pipeline`} icon={<CircleDollarSign size={23} />} color="purple" />
          <StatCard title="Giá trị đang mở" value={money(openValue)} note="Cơ hội chưa thành công" icon={<Target size={23} />} color="blue" />
          <StatCard title="Đã thành công" value={money(wonValue)} note="Giá trị cơ hội thành công" icon={<BarChart3 size={23} />} color="green" />
          <StatCard title="Cơ hội quá hạn" value={overdueCount} note="Cần được theo dõi" icon={<CalendarDays size={23} />} color="orange" />
        </section>

        <section className="pipeline-panel">
          <div className="panel-heading">
            <div>
              <h2><ClipboardList size={21} /> Bảng Pipeline</h2>
              <p>Kéo thả thẻ cơ hội để cập nhật giai đoạn.</p>
            </div>
            <div className="panel-tools">
              <span className="live-dot">Dữ liệu đã lưu trên trình duyệt</span>
              <button className="secondary-button" onClick={openCreate}><Plus size={17} /> Thêm cơ hội</button>
            </div>
          </div>

          <div className="filter-bar">
            <label className="search-box">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm cơ hội, khách hàng..." />
            </label>
            <label className="filter-control">
              <Users size={16} />
              <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                <option value="all">Tất cả người sở hữu</option>
                {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
              </select>
            </label>
            <label className="filter-control">
              <Filter size={16} />
              <select value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)}>
                <option value="all">Tất cả nhóm</option>
                {teams.map((team) => <option key={team} value={team}>{team}</option>)}
              </select>
            </label>
            <label className="filter-control">
              <Target size={16} />
              <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                <option value="all">Tất cả giai đoạn</option>
                {STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
              </select>
            </label>
            <label className="date-filter"><span>Từ ngày</span><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label>
            <label className="date-filter"><span>Đến ngày</span><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></label>
            <button className="clear-filter" onClick={resetFilters}>Xóa lọc</button>
          </div>

          <div className="kanban-board">
            {STAGES.map((stage) => {
              const stageItems = filtered.filter((item) => item.stage === stage.id);
              const stageTotal = stageItems.reduce((sum, item) => sum + Number(item.value || 0), 0);
              return (
                <div
                  key={stage.id}
                  className={`kanban-column ${stage.className}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggingId) moveOpportunity(draggingId, stage.id);
                    setDraggingId(null);
                  }}
                >
                  <div className="column-heading">
                    <div><span className="stage-dot" /><b>{stage.name}</b></div>
                    <span className="count-badge">{stageItems.length}</span>
                  </div>
                  <div className="column-total">{money(stageTotal)}</div>
                  <div className="column-progress"><span style={{ width: `${Math.min(100, stageItems.length / Math.max(1, filtered.length) * 100)}%` }} /></div>

                  <div className="cards-list">
                    {stageItems.map((item) => {
                      const overdue = item.stage !== "won" && item.closeDate && item.closeDate < todayString();
                      return (
                        <article
                          className="opportunity-card"
                          key={item.id}
                          draggable
                          onDragStart={() => setDraggingId(item.id)}
                          onDragEnd={() => setDraggingId(null)}
                        >
                          <div className="card-top">
                            <span className="card-id">{item.id}</span>
                            <button className="more-button" onClick={() => openEdit(item)} aria-label="Sửa cơ hội"><Pencil size={14} /></button>
                          </div>
                          <h3>{item.name}</h3>
                          <div className="customer-name"><Building2 size={14} /> {item.customer}</div>
                          <div className="card-value">{money(item.value)}</div>
                          <div className="card-meta">
                            <span><Users size={13} /> {item.owner}</span>
                            <span className={overdue ? "overdue" : ""}><CalendarDays size={13} /> {item.closeDate || "Chưa đặt ngày chốt"}</span>
                          </div>
                          {overdue && <div className="overdue-warning"><AlertCircle size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Quá hạn chốt</div>}
                          <div className="card-footer">
                            <span className="probability">{item.probability}% xác suất</span>
                            <button className="delete-button" onClick={() => deleteOpportunity(item.id)} aria-label="Xóa cơ hội"><Trash2 size={14} /></button>
                          </div>
                          <div className="card-drag"><GripVertical size={13} /> Kéo sang cột khác</div>
                        </article>
                      );
                    })}
                    {stageItems.length === 0 && <div className="empty-column">Chưa có cơ hội ở giai đoạn này</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="board-footer">
            <span>Hiển thị {filtered.length}/{opportunities.length} cơ hội</span>
            <span><Clock3 size={13} style={{ display: "inline", verticalAlign: "middle" }} /> Dữ liệu được lưu trong trình duyệt hiện tại.</span>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="opportunity-modal" onSubmit={saveOpportunity}>
            <div className="modal-heading">
              <div>
                <div className="eyebrow">{editingId ? "CẬP NHẬT CƠ HỘI" : "CƠ HỘI BÁN HÀNG MỚI"}</div>
                <h2>{editingId ? "Sửa cơ hội" : "Tạo cơ hội"}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setModalOpen(false)} aria-label="Đóng"><X size={21} /></button>
            </div>

            <div className="form-grid">
              <Field label="Tên cơ hội" required>
                <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Ví dụ: Triển khai hệ thống CRM" required />
              </Field>
              <Field label="Khách hàng" required>
                <input value={form.customer} onChange={(event) => updateForm("customer", event.target.value)} placeholder="Tên khách hàng" required />
              </Field>
              <Field label="Người liên hệ chính" required>
                <input value={form.contact} onChange={(event) => updateForm("contact", event.target.value)} placeholder="Tên người liên hệ" required />
              </Field>
              <Field label="Người sở hữu">
                <input value={form.owner} onChange={(event) => updateForm("owner", event.target.value)} required />
              </Field>
              <Field label="Giai đoạn">
                <select value={form.stage} onChange={(event) => updateForm("stage", event.target.value)}>
                  {STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
                </select>
              </Field>
              <Field label="Xác suất thắng (%)">
                <input type="number" min="0" max="100" value={form.probability} onChange={(event) => updateForm("probability", event.target.value)} />
              </Field>
              <Field label="Nguồn cơ hội">
                <select value={form.source} onChange={(event) => updateForm("source", event.target.value)}>
                  {["Website", "Giới thiệu", "Điện thoại", "Email", "Sự kiện", "Khách hàng cũ", "Khác"].map((source) => <option key={source}>{source}</option>)}
                </select>
              </Field>
              <Field label="Nhóm">
                <input value={form.team} onChange={(event) => updateForm("team", event.target.value)} />
              </Field>
              <Field label="Ngày dự kiến chốt">
                <input type="date" min={!editingId ? todayString() : undefined} value={form.closeDate} onChange={(event) => updateForm("closeDate", event.target.value)} />
              </Field>
              <Field label="Giá trị cơ hội">
                <input value={money(calculateValue(form.products))} readOnly />
              </Field>
            </div>

            <section className="product-section">
              <div className="product-heading">
                <div><FileText size={18} /><b>Sản phẩm / dịch vụ</b></div>
                <button type="button" className="text-button" onClick={addProduct}><Plus size={15} /> Thêm dòng</button>
              </div>
              <div className="product-table">
                <div className="product-row product-header">
                  <span>Sản phẩm</span><span>Số lượng</span><span>Đơn giá (₫)</span><span>Thành tiền</span><span />
                </div>
                {form.products.map((product, index) => (
                  <div className="product-row" key={`${index}-${product.productId}`}>
                    <select aria-label="Sản phẩm" value={product.productId} onChange={(event) => updateProduct(index, "productId", event.target.value)}>
                      {PRODUCTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                    <input aria-label="Số lượng" type="number" min="1" value={product.quantity} onChange={(event) => updateProduct(index, "quantity", event.target.value)} required />
                    <input aria-label="Đơn giá" type="number" min="0" value={product.unitPrice} onChange={(event) => updateProduct(index, "unitPrice", event.target.value)} required />
                    <b>{money((Number(product.quantity) || 0) * (Number(product.unitPrice) || 0))}</b>
                    <button type="button" className="delete-line" onClick={() => removeProduct(index)} aria-label="Xóa dòng sản phẩm"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="calculated-total"><span>Tổng giá trị tự động tính</span><strong>{money(calculateValue(form.products))}</strong></div>
              <p className="form-hint">Đơn giá mặc định được lấy từ danh mục mẫu. Bạn có thể sửa đơn giá trực tiếp trong biểu mẫu.</p>
            </section>

            <Field label="Ghi chú">
              <textarea value={form.note} onChange={(event) => updateForm("note", event.target.value)} rows="3" placeholder="Nhập ghi chú về cơ hội..." />
            </Field>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Hủy</button>
              <button type="submit" className="primary-button"><Check size={17} /> {editingId ? "Lưu thay đổi" : "Tạo cơ hội"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, note, icon, color }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{title}</span><span className={`stat-icon ${color}`}>{icon}</span></div>
      <strong>{value}</strong>
      <small><TrendingUp size={13} /> {note}</small>
    </article>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="field">
      <span>{label}{required && <i> *</i>}</span>
      {children}
    </label>
  );
}
