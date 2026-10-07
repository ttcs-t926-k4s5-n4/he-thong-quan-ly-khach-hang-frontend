import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialCustomers = [
  { id: 1, name: 'Công ty TNHH Minh Phát', tax: '0109234512', contact: 'Nguyễn Minh Phát', phone: '0901 234 567', industry: 'Thương mại', size: 'Lớn', area: 'Hà Nội', owner: 'Phạm Quang Huy', status: 'Đang hoạt động', contract: 850000000, lastContact: '2026-10-06', nextCare: '2026-10-10', risk: 'low', supportCount: 0 },
  { id: 2, name: 'CTCP Công nghệ An Việt', tax: '0108123987', contact: 'Lê Thu Hà', phone: '0912 567 890', industry: 'Công nghệ', size: 'Vừa', area: 'Hà Nội', owner: 'Nguyễn Lan Anh', status: 'Đang hoạt động', contract: 620000000, lastContact: '2026-09-18', nextCare: '2026-10-08', risk: 'medium', supportCount: 2 },
  { id: 3, name: 'Công ty Dược Hoàng Gia', tax: '0107345621', contact: 'Trần Hoàng Nam', phone: '0987 456 321', industry: 'Dược phẩm', size: 'Lớn', area: 'Hải Phòng', owner: 'Phạm Quang Huy', status: 'Có nguy cơ rời bỏ', contract: 980000000, lastContact: '2026-08-29', nextCare: '2026-10-07', risk: 'high', supportCount: 4 },
  { id: 4, name: 'Hộ kinh doanh Thành Công', tax: '0106654321', contact: 'Vũ Thành Công', phone: '0933 765 432', industry: 'Bán lẻ', size: 'Nhỏ', area: 'Bắc Ninh', owner: 'Lê Quốc Bảo', status: 'Đang hoạt động', contract: 210000000, lastContact: '2026-09-22', nextCare: '2026-10-12', risk: 'low', supportCount: 0 },
  { id: 5, name: 'CTCP Xây dựng Đông Đô', tax: '0105543219', contact: 'Đỗ Hoàng Long', phone: '0966 882 111', industry: 'Xây dựng', size: 'Vừa', area: 'Hà Nội', owner: 'Nguyễn Lan Anh', status: 'Đang hoạt động', contract: 540000000, lastContact: '2026-08-31', nextCare: '2026-10-09', risk: 'medium', supportCount: 1 },
  { id: 6, name: 'Công ty Nội thất Hưng Thịnh', tax: '0104987213', contact: 'Phan Hương Giang', phone: '0909 332 114', industry: 'Nội thất', size: 'Nhỏ', area: 'Hưng Yên', owner: 'Lê Quốc Bảo', status: 'Đang hoạt động', contract: 175000000, lastContact: '2026-09-05', nextCare: '2026-10-11', risk: 'medium', supportCount: 1 },
  { id: 7, name: 'CTCP Logistics Việt Hưng', tax: '0108712365', contact: 'Bùi Việt Hưng', phone: '0977 120 450', industry: 'Logistics', size: 'Lớn', area: 'Hà Nội', owner: 'Phạm Quang Huy', status: 'Có nguy cơ rời bỏ', contract: 760000000, lastContact: '2026-08-20', nextCare: '2026-10-07', risk: 'high', supportCount: 5 },
  { id: 8, name: 'Công ty Giáo dục Sao Mai', tax: '0109463128', contact: 'Đinh Mai Phương', phone: '0888 321 998', industry: 'Giáo dục', size: 'Vừa', area: 'Hà Nội', owner: 'Nguyễn Lan Anh', status: 'Đang hoạt động', contract: 450000000, lastContact: '2026-09-30', nextCare: '2026-10-15', risk: 'low', supportCount: 0 }
];

const initialTickets = [
  { id: 'HT-2026-015', customerId: 3, customer: 'Công ty Dược Hoàng Gia', title: 'Lỗi đồng bộ báo giá trên portal', priority: 'Cao', assignee: 'Trần Đức Minh', status: 'Đang xử lý', created: '2026-10-06', risk: true },
  { id: 'HT-2026-014', customerId: 7, customer: 'CTCP Logistics Việt Hưng', title: 'Yêu cầu hỗ trợ kết nối API', priority: 'Cao', assignee: 'Nguyễn Hoài Nam', status: 'Chờ khách phản hồi', created: '2026-10-05', risk: true },
  { id: 'HT-2026-013', customerId: 2, customer: 'CTCP Công nghệ An Việt', title: 'Đề nghị cấp lại tài khoản quản trị', priority: 'Trung bình', assignee: 'Trần Đức Minh', status: 'Mới', created: '2026-10-05', risk: false },
  { id: 'HT-2026-012', customerId: 5, customer: 'CTCP Xây dựng Đông Đô', title: 'Kiểm tra thông tin hợp đồng', priority: 'Thấp', assignee: 'Nguyễn Hoài Nam', status: 'Hoàn tất', created: '2026-10-04', risk: false }
];

const savedFiltersSeed = [
  { id: 1, name: 'Khách có nguy cơ rời bỏ', meta: 'Risk = Cao · Khu vực = Tất cả' },
  { id: 2, name: 'Khách lớn tại Hà Nội', meta: 'Quy mô = Lớn · Khu vực = Hà Nội' },
  { id: 3, name: 'Cần gọi trong tuần', meta: 'Chưa tương tác ≥ 7 ngày' }
];

const navItems = [
  ['dashboard', 'Tổng quan'],
  ['customers', 'Khách hàng'],
  ['support', 'Hỗ trợ sau bán'],
  ['care', 'Chăm sóc định kỳ']
];

function App() {
  const [tab, setTab] = useState('customers');
  const [customers, setCustomers] = useState(initialCustomers);
  const [tickets, setTickets] = useState(initialTickets);
  const [savedFilters, setSavedFilters] = useState(savedFiltersSeed);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState({ search: '', status: 'Tất cả', industry: 'Tất cả', size: 'Tất cả', area: 'Tất cả', owner: 'Tất cả', risk: 'Tất cả' });
  const [careDays, setCareDays] = useState(7);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [ticketForm, setTicketForm] = useState({ customerId: '3', title: '', priority: 'Trung bình' });
  const [showNewFilter, setShowNewFilter] = useState(false);
  const [filterName, setFilterName] = useState('');

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => setToast(''), 2600);
  };

  const applySavedFilter = (item) => {
    if (item.id === 1) setFilter((f) => ({ ...f, risk: 'Cao' }));
    if (item.id === 2) setFilter((f) => ({ ...f, size: 'Lớn', area: 'Hà Nội' }));
    if (item.id === 3) setTab('care');
    notify(`Đã áp dụng bộ lọc “${item.name}”`);
  };

  const filteredCustomers = useMemo(() => customers.filter((c) => {
    const q = filter.search.toLowerCase().trim();
    const hitSearch = !q || [c.name, c.tax, c.contact, c.phone].some((v) => String(v).toLowerCase().includes(q));
    return hitSearch
      && (filter.status === 'Tất cả' || c.status === filter.status)
      && (filter.industry === 'Tất cả' || c.industry === filter.industry)
      && (filter.size === 'Tất cả' || c.size === filter.size)
      && (filter.area === 'Tất cả' || c.area === filter.area)
      && (filter.owner === 'Tất cả' || c.owner === filter.owner)
      && (filter.risk === 'Tất cả' || riskLabel(c.risk) === filter.risk);
  }), [customers, filter]);

  const careCustomers = useMemo(() => customers
    .map((c) => ({ ...c, daysSinceContact: diffDays(c.lastContact, '2026-10-07'), daysToCare: diffDays('2026-10-07', c.nextCare) }))
    .filter((c) => c.daysSinceContact >= careDays || c.daysToCare <= 0)
    .sort((a, b) => b.contract - a.contract), [customers, careDays]);

  const stats = useMemo(() => ({
    total: customers.length,
    highRisk: customers.filter((c) => c.risk === 'high').length,
    due: careCustomers.length,
    openTickets: tickets.filter((t) => t.status !== 'Hoàn tất').length
  }), [customers, careCustomers, tickets]);

  const setCustomerStatus = (id, status) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, status, risk: status === 'Có nguy cơ rời bỏ' ? 'high' : c.risk === 'high' ? 'medium' : c.risk } : c));
  };

  const addTicket = () => {
    if (!ticketForm.title.trim()) return notify('Vui lòng nhập nội dung yêu cầu hỗ trợ.');
    const customer = customers.find((c) => c.id === Number(ticketForm.customerId));
    const id = `HT-2026-${String(tickets.length + 16).padStart(3, '0')}`;
    setTickets((prev) => [{ id, customerId: customer.id, customer: customer.name, title: ticketForm.title, priority: ticketForm.priority, assignee: 'Chưa phân công', status: 'Mới', created: '2026-10-07', risk: false }, ...prev]);
    setCustomers((prev) => prev.map((c) => c.id === customer.id ? { ...c, supportCount: c.supportCount + 1, risk: c.supportCount + 1 >= 3 ? 'high' : 'medium' } : c));
    setTicketForm((f) => ({ ...f, title: '' }));
    notify(`Đã tạo ${id} cho ${customer.name}`);
  };

  const markContacted = (id) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, lastContact: '2026-10-07', nextCare: '2026-10-14' } : c));
    notify('Đã ghi nhận liên hệ và đặt lịch chăm sóc tiếp theo.');
  };

  const saveFilter = () => {
    if (!filterName.trim()) return notify('Vui lòng đặt tên cho bộ lọc.');
    setSavedFilters((prev) => [{ id: Date.now(), name: filterName.trim(), meta: summarizeFilter(filter) }, ...prev]);
    setFilterName('');
    setShowNewFilter(false);
    notify('Đã lưu bộ lọc hay dùng.');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">C</div><div><strong>CoreCRM</strong><span>Customer Workspace</span></div></div>
        <div className="workspace-pill"><span className="dot" /> EP-03 · Sales & Care</div>
        <div className="nav-title">WORKSPACE</div>
        <nav>
          {navItems.map(([key, label]) => <button key={key} className={`nav-item ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}><span className="nav-icon">{iconFor(key)}</span>{label}</button>)}
        </nav>
        <div className="saved-box">
          <div className="saved-head"><span>Bộ lọc hay dùng</span><button onClick={() => setShowNewFilter(true)}>＋</button></div>
          {savedFilters.map((item) => <button className="saved-filter" key={item.id} onClick={() => applySavedFilter(item)}><span className="filter-pin">◈</span><span><b>{item.name}</b><small>{item.meta}</small></span></button>)}
        </div>
        <div className="sidebar-footer"><div className="avatar">PV</div><div><b>Phương Vũ</b><small>Nhân viên kinh doanh</small></div><button className="more">•••</button></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="eyebrow">EP-03 · CRM</span><h1>{tab === 'customers' ? 'Tìm kiếm & lọc khách hàng' : tab === 'support' ? 'Yêu cầu hỗ trợ sau bán' : tab === 'care' ? 'Danh sách chăm sóc định kỳ' : 'Trung tâm chăm sóc khách hàng'}</h1><p>{tab === 'customers' ? 'Dựng nhanh danh sách khách cần gọi trong tuần.' : tab === 'support' ? 'Theo dõi mức độ ưu tiên, người xử lý và tín hiệu rủi ro rời bỏ.' : tab === 'care' ? 'Không để khách đã ký hợp đồng bị bỏ quên tới lúc gia hạn.' : 'Tổng hợp tín hiệu bán hàng, hỗ trợ và chăm sóc khách hàng.'}</p></div>
          <div className="top-actions"><button className="icon-btn">⌕</button><button className="icon-btn">◔</button><div className="profile-mini">PV</div></div>
        </header>

        <section className="content">
          {tab === 'customers' && <CustomersView {...{filter, setFilter, filteredCustomers, stats, setSelectedCustomer, setCustomerStatus, notify, setShowNewFilter}} />}
          {tab === 'support' && <SupportView {...{tickets, ticketForm, setTicketForm, addTicket, setSelectedCustomer, notify}} />}
          {tab === 'care' && <CareView {...{careCustomers, careDays, setCareDays, markContacted, setSelectedCustomer}} />}
          {tab === 'dashboard' && <DashboardView {...{stats, customers, tickets, setTab}} />}
        </section>
      </main>

      {selectedCustomer && <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onNotify={notify} />}
      {showNewFilter && <Modal title="Lưu bộ lọc hay dùng" onClose={() => setShowNewFilter(false)}><div className="modal-copy">Lưu tiêu chí hiện tại để lần sau mở danh sách gọi nhanh hơn.</div><label className="field-label">Tên bộ lọc<input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="VD: Khách lớn cần gọi" autoFocus /></label><div className="modal-actions"><button className="btn ghost" onClick={() => setShowNewFilter(false)}>Huỷ</button><button className="btn primary" onClick={saveFilter}>Lưu bộ lọc</button></div></Modal>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function CustomersView({ filter, setFilter, filteredCustomers, stats, setSelectedCustomer, setCustomerStatus, notify, setShowNewFilter }) {
  const update = (key, value) => setFilter((prev) => ({ ...prev, [key]: value }));
  return <>
    <div className="stat-grid">
      <Stat label="Tổng khách hàng" value={stats.total} suffix="KH" icon="◉" />
      <Stat label="Nguy cơ rời bỏ" value={stats.highRisk} suffix="KH" icon="!" tone="danger" />
      <Stat label="Cần chăm sóc" value={stats.due} suffix="KH" icon="◷" tone="warn" />
      <Stat label="Yêu cầu đang mở" value={stats.openTickets} suffix="case" icon="↗" tone="info" />
    </div>
    <div className="panel filter-panel">
      <div className="panel-top"><div><h2>Bộ lọc khách hàng</h2><span>Tìm theo tên, mã số thuế, người liên hệ hoặc số điện thoại.</span></div><button className="btn soft" onClick={() => setShowNewFilter(true)}>＋ Lưu bộ lọc</button></div>
      <div className="search-row"><div className="search-input"><span>⌕</span><input value={filter.search} onChange={(e) => update('search', e.target.value)} placeholder="Tìm tên công ty, MST, người liên hệ, SĐT..." /></div><button className="btn primary search-btn" onClick={() => notify(`Đã lọc ${filteredCustomers.length} khách hàng`)}>Lọc khách hàng</button></div>
      <div className="filters-grid">
        <Select label="Trạng thái" value={filter.status} onChange={(v) => update('status', v)} options={['Tất cả', 'Đang hoạt động', 'Có nguy cơ rời bỏ']} />
        <Select label="Ngành nghề" value={filter.industry} onChange={(v) => update('industry', v)} options={['Tất cả', 'Thương mại', 'Công nghệ', 'Dược phẩm', 'Bán lẻ', 'Xây dựng', 'Nội thất', 'Logistics', 'Giáo dục']} />
        <Select label="Quy mô" value={filter.size} onChange={(v) => update('size', v)} options={['Tất cả', 'Nhỏ', 'Vừa', 'Lớn']} />
        <Select label="Khu vực" value={filter.area} onChange={(v) => update('area', v)} options={['Tất cả', 'Hà Nội', 'Hải Phòng', 'Bắc Ninh', 'Hưng Yên']} />
        <Select label="Người sở hữu" value={filter.owner} onChange={(v) => update('owner', v)} options={['Tất cả', 'Phạm Quang Huy', 'Nguyễn Lan Anh', 'Lê Quốc Bảo']} />
        <Select label="Mức rủi ro" value={filter.risk} onChange={(v) => update('risk', v)} options={['Tất cả', 'Thấp', 'Trung bình', 'Cao']} />
      </div>
      <div className="chips"><span className="result-count">{filteredCustomers.length} khách phù hợp</span><button onClick={() => setFilter({ search: '', status: 'Tất cả', industry: 'Tất cả', size: 'Tất cả', area: 'Tất cả', owner: 'Tất cả', risk: 'Tất cả' })}>↺ Xoá bộ lọc</button></div>
    </div>

    <div className="panel table-panel">
      <div className="panel-top"><div><h2>Danh sách khách hàng</h2><span>Ưu tiên khách có tín hiệu rủi ro cao và hợp đồng giá trị lớn.</span></div><div className="legend"><span><i className="legend-dot high" /> Rủi ro cao</span><span><i className="legend-dot medium" /> Cần theo dõi</span></div></div>
      <div className="table-wrap"><table><thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Ngành / Quy mô</th><th>Khu vực</th><th>Chủ sở hữu</th><th>Giá trị HĐ</th><th>Rủi ro</th><th></th></tr></thead>
        <tbody>{filteredCustomers.map((c) => <tr key={c.id}>
          <td><button className="customer-link" onClick={() => setSelectedCustomer(c)}><b>{c.name}</b><small>MST {c.tax}</small></button></td>
          <td><div>{c.contact}</div><small>{c.phone}</small></td>
          <td><div>{c.industry}</div><small>{c.size}</small></td>
          <td>{c.area}</td><td>{c.owner}</td><td><b>{money(c.contract)}</b></td>
          <td><RiskBadge level={c.risk} /></td>
          <td><div className="row-actions"><button title="Mở hồ sơ" onClick={() => setSelectedCustomer(c)}>↗</button><button title="Đánh dấu nguy cơ" onClick={() => setCustomerStatus(c.id, c.status === 'Có nguy cơ rời bỏ' ? 'Đang hoạt động' : 'Có nguy cơ rời bỏ')}>⚑</button></div></td>
        </tr>)}</tbody></table></div>
    </div>
  </>;
}

function SupportView({ tickets, ticketForm, setTicketForm, addTicket, notify }) {
  return <>
    <div className="two-col">
      <div className="panel ticket-form"><div className="panel-top"><div><h2>Ghi nhận yêu cầu hỗ trợ</h2><span>Gắn mức ưu tiên, người xử lý và trạng thái.</span></div><span className="pill blue">Sau bán</span></div>
        <label className="field-label">Khách hàng<SelectPlain value={ticketForm.customerId} onChange={(e) => setTicketForm((f) => ({ ...f, customerId: e.target.value }))} options={initialCustomers.map((c) => ({ value: String(c.id), label: c.name }))} /></label>
        <label className="field-label">Nội dung hỗ trợ<textarea rows="4" value={ticketForm.title} onChange={(e) => setTicketForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ví dụ: khách cần hỗ trợ kết nối API..." /></label>
        <label className="field-label">Mức ưu tiên<SelectPlain value={ticketForm.priority} onChange={(e) => setTicketForm((f) => ({ ...f, priority: e.target.value }))} options={['Thấp', 'Trung bình', 'Cao']} /></label>
        <button className="btn primary full" onClick={addTicket}>＋ Tạo yêu cầu hỗ trợ</button>
      </div>
      <div className="panel risk-card"><div className="risk-card-title"><div className="risk-orbit">!</div><div><h2>Cờ rủi ro rời bỏ</h2><span>Tự động khi khách có nhiều case chưa xử lý hoặc ít tương tác.</span></div></div><div className="risk-number">{tickets.filter((t) => t.risk && t.status !== 'Hoàn tất').length}<span> khách cần chú ý</span></div><div className="risk-list">{initialCustomers.filter((c) => c.risk === 'high').map((c) => <div className="risk-item" key={c.id}><div><b>{c.name}</b><small>{c.supportCount} yêu cầu · HĐ {money(c.contract)}</small></div><button className="btn tiny" onClick={() => notify(`Đã nhắc ${c.owner} chăm sóc ${c.name}`)}>Nhắc sales</button></div>)}</div></div>
    </div>
    <div className="panel table-panel"><div className="panel-top"><div><h2>Danh sách yêu cầu hỗ trợ</h2><span>Rủi ro hiển thị xuyên suốt trên trang chăm sóc 360°.</span></div><div className="legend"><span><i className="legend-dot danger" /> Cần xử lý</span></div></div>
      <div className="table-wrap"><table><thead><tr><th>Mã case</th><th>Khách hàng</th><th>Nội dung</th><th>Ưu tiên</th><th>Người xử lý</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr></thead><tbody>{tickets.map((t) => <tr key={t.id}><td><b>{t.id}</b></td><td>{t.customer}</td><td>{t.title}</td><td><Priority value={t.priority} /></td><td>{t.assignee}</td><td><StatusPill value={t.status} /></td><td>{formatDate(t.created)}</td><td>{t.risk ? <span className="risk-flag">⚑ Rủi ro</span> : <button className="row-link" onClick={() => notify('Case đã được mở trong luồng xử lý.')}>Xem</button>}</td></tr>)}</tbody></table></div>
    </div>
  </>;
}

function CareView({ careCustomers, careDays, setCareDays, markContacted, setSelectedCustomer }) {
  return <>
    <div className="care-toolbar"><div><h2>Khách cần chăm sóc</h2><span>Đang ưu tiên theo giá trị hợp đồng giảm dần.</span></div><div className="care-control"><label>Chưa tương tác ≥</label><select value={careDays} onChange={(e) => setCareDays(Number(e.target.value))}><option value="3">3 ngày</option><option value="7">7 ngày</option><option value="14">14 ngày</option><option value="30">30 ngày</option></select><button className="btn soft">⌗ Xuất danh sách</button></div></div>
    <div className="care-grid">{careCustomers.map((c, index) => <article className={`care-card ${c.risk === 'high' ? 'danger-card' : ''}`} key={c.id}><div className="card-top"><span className="rank">#{index + 1}</span><RiskBadge level={c.risk} /></div><button className="customer-link large" onClick={() => setSelectedCustomer(c)}><b>{c.name}</b><small>{c.contact} · {c.phone}</small></button><div className="care-meta"><div><span>Hợp đồng</span><b>{money(c.contract)}</b></div><div><span>Lần cuối liên hệ</span><b>{formatDate(c.lastContact)}</b></div><div><span>Ngày chăm sóc</span><b>{c.daysToCare <= 0 ? 'Đã đến hạn' : `Còn ${c.daysToCare} ngày`}</b></div></div><div className="card-footer"><span className="interaction">{c.daysSinceContact} ngày chưa tương tác</span><button className="btn primary small" onClick={() => markContacted(c.id)}>✓ Đã liên hệ</button></div></article>)}</div>
  </>;
}

function DashboardView({ stats, customers, tickets, setTab }) {
  const top = [...customers].sort((a, b) => b.contract - a.contract).slice(0, 5);
  return <>
    <div className="hero-panel"><div><span className="pill dark">Tuần 41 · 07/10/2026</span><h2>Danh sách gọi tuần này đã sẵn sàng.</h2><p>EP-03 gom dữ liệu tìm kiếm, hỗ trợ sau bán và lịch chăm sóc thành một luồng làm việc cho nhân viên kinh doanh.</p></div><button className="btn primary" onClick={() => setTab('care')}>Mở danh sách cần gọi →</button></div>
    <div className="stat-grid compact"><Stat label="Tổng khách hàng" value={stats.total} suffix="KH" icon="◉" /><Stat label="Risk cao" value={stats.highRisk} suffix="KH" icon="!" tone="danger" /><Stat label="Cần chăm sóc" value={stats.due} suffix="KH" icon="◷" tone="warn" /><Stat label="Case mở" value={stats.openTickets} suffix="case" icon="↗" tone="info" /></div>
    <div className="two-col"><div className="panel"><div className="panel-top"><div><h2>Top khách theo giá trị hợp đồng</h2><span>Ưu tiên để sales cân đối thời gian chăm sóc.</span></div></div>{top.map((c, i) => <div className="top-customer" key={c.id}><span className="rank">0{i + 1}</span><div><b>{c.name}</b><small>{c.owner} · {c.area}</small></div><strong>{money(c.contract)}</strong></div>)}</div><div className="panel"><div className="panel-top"><div><h2>Tín hiệu hôm nay</h2><span>Những việc nên xử lý trước khi kết thúc ngày.</span></div></div><ActionBox icon="⚑" title={`${stats.highRisk} khách có nguy cơ rời bỏ`} text="Mở danh sách rủi ro để nhắc người phụ trách." onClick={() => setTab('support')} /><ActionBox icon="◷" title={`${stats.due} khách đến lịch chăm sóc`} text="Sắp xếp cuộc gọi và ghi nhận tương tác." onClick={() => setTab('care')} /><ActionBox icon="↗" title={`${tickets.filter(t => t.status !== 'Hoàn tất').length} case đang mở`} text="Kiểm tra case ưu tiên cao." onClick={() => setTab('support')} /></div></div>
  </>;
}

function CustomerDrawer({ customer, onClose, onNotify }) {
  return <div className="overlay" onClick={onClose}><aside className="drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">HỒ SƠ KHÁCH HÀNG</span><h2>{customer.name}</h2><span>MST {customer.tax}</span></div><button className="close" onClick={onClose}>×</button></div><div className="drawer-risk"><RiskBadge level={customer.risk} /><span>{customer.supportCount} yêu cầu hỗ trợ trong lịch sử gần đây</span></div><section><h3>Thông tin liên hệ</h3><div className="info-grid"><Info label="Người liên hệ" value={customer.contact} /><Info label="Điện thoại" value={customer.phone} /><Info label="Ngành nghề" value={customer.industry} /><Info label="Quy mô" value={customer.size} /><Info label="Khu vực" value={customer.area} /><Info label="Chủ sở hữu" value={customer.owner} /></div></section><section><h3>Giá trị & chăm sóc</h3><div className="big-number">{money(customer.contract)}</div><div className="timeline"><div><span className="tl-dot" /><p><b>Liên hệ gần nhất</b><small>{formatDate(customer.lastContact)}</small></p></div><div><span className="tl-dot" /><p><b>Chăm sóc tiếp theo</b><small>{formatDate(customer.nextCare)}</small></p></div></div></section><button className="btn primary full" onClick={() => onNotify(`Đã tạo lịch gọi cho ${customer.name}`)}>☎ Tạo lịch gọi</button></aside></div>;
}

function Stat({ label, value, suffix, icon, tone = '' }) { return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}<em>{suffix}</em></strong></div></div>; }
function Select({ label, value, onChange, options }) { return <label className="select-field"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>; }
function SelectPlain({ value, onChange, options }) { return <select value={value} onChange={onChange}>{options.map((o) => typeof o === 'string' ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}</select>; }
function RiskBadge({ level }) { return <span className={`risk-badge ${level}`}>{level === 'high' ? 'Cao' : level === 'medium' ? 'Trung bình' : 'Thấp'}</span>; }
function Priority({ value }) { return <span className={`priority ${value === 'Cao' ? 'high' : value === 'Trung bình' ? 'medium' : 'low'}`}>{value}</span>; }
function StatusPill({ value }) { return <span className={`status-pill ${statusClass(value)}`}>{value}</span>; }
function Info({ label, value }) { return <div className="info-item"><span>{label}</span><b>{value}</b></div>; }
function ActionBox({ icon, title, text, onClick }) { return <button className="action-box" onClick={onClick}><span>{icon}</span><div><b>{title}</b><small>{text}</small></div><strong>›</strong></button>; }
function Modal({ title, onClose, children }) { return <div className="overlay center" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="close" onClick={onClose}>×</button></div>{children}</div></div>; }

function riskLabel(r) { return r === 'high' ? 'Cao' : r === 'medium' ? 'Trung bình' : 'Thấp'; }
function statusClass(s) { return s === 'Hoàn tất' ? 'done' : s === 'Chờ khách phản hồi' ? 'waiting' : s === 'Đang xử lý' ? 'processing' : 'new'; }
function money(n) { return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n) + ' ₫'; }
function formatDate(s) { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; }
function diffDays(a, b) { const aa = new Date(a + 'T00:00:00'); const bb = new Date(b + 'T00:00:00'); return Math.round((bb - aa) / 86400000); }
function summarizeFilter(f) { const parts = []; if (f.status !== 'Tất cả') parts.push(`Trạng thái = ${f.status}`); if (f.industry !== 'Tất cả') parts.push(`Ngành = ${f.industry}`); if (f.size !== 'Tất cả') parts.push(`Quy mô = ${f.size}`); if (f.area !== 'Tất cả') parts.push(`KV = ${f.area}`); if (f.owner !== 'Tất cả') parts.push(`Owner = ${f.owner}`); if (f.risk !== 'Tất cả') parts.push(`Risk = ${f.risk}`); return parts.length ? parts.join(' · ') : 'Tất cả khách hàng'; }
function iconFor(key) { return key === 'dashboard' ? '▦' : key === 'customers' ? '♙' : key === 'support' ? '◈' : '◷'; }

createRoot(document.getElementById('root')).render(<App />);
