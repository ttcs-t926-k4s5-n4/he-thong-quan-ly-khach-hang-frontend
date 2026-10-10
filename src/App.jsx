import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownUp, ArrowRight, Bell, Building2, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clock3, Download, Filter, Flame, LayoutDashboard, ListFilter, Mail, Menu,
  MoreHorizontal, Phone, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal,
  Sparkles, Target, TrendingUp, UserRound, Users, X, Zap,
} from 'lucide-react';
import { CURRENT_USER, initialContacts, initialCustomers, initialLeads, initialOpportunities, initialSavedViews } from './data.js';
import { applyLeadFilters, convertLead, formatCurrency, isOverdue, logContact, qualifyLead, receiveLead, rejectLead, STATUS } from './logic.js';

const STORE_KEY = 'novacrm-lead-demo-v1';
const EMPTY_FILTERS = { query: '', status: '', source: '', temperature: '', owner: '', overdueOnly: false, startDate: '', endDate: '' };
const STATUS_OPTIONS = [STATUS.ASSIGNED, STATUS.WORKING, STATUS.WAITING, STATUS.CONVERTED];
const SOURCES = ['Website', 'Hội thảo', 'Giới thiệu', 'Facebook', 'Sự kiện', 'LinkedIn'];
const TEMPERATURES = ['Nóng', 'Ấm', 'Lạnh'];

function readStore() {
  try {
    const value = localStorage.getItem(STORE_KEY);
    if (!value) return null;
    const stored = JSON.parse(value);
    return { ...seedStore(), ...stored, contacts: stored.contacts || initialContacts };
  } catch {
    return null;
  }
}

function seedStore() {
  return {
    leads: initialLeads,
    customers: initialCustomers,
    opportunities: initialOpportunities,
    contacts: initialContacts,
    savedViews: initialSavedViews,
  };
}

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase();
const fullDate = (date) => date ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date)) : '—';
const shortDate = (date) => date ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(date)) : '—';

function App() {
  const [store, setStore] = useState(() => readStore() || seedStore());
  const [activeSection, setActiveSection] = useState('leads');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeSavedView, setActiveSavedView] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [rejectingLeadId, setRejectingLeadId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [showSaveView, setShowSaveView] = useState(false);
  const [viewName, setViewName] = useState('');
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertSentAt, setAlertSentAt] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectedLead = store.leads.find((lead) => lead.id === selectedLeadId) || null;
  const overdueLeads = store.leads.filter((lead) => isOverdue(lead));
  const filteredLeads = useMemo(() => applyLeadFilters(store.leads, filters), [store.leads, filters]);
  const assignedCount = store.leads.filter((lead) => lead.status === STATUS.ASSIGNED).length;
  const workingCount = store.leads.filter((lead) => lead.status === STATUS.WORKING).length;
  const convertedCount = store.leads.filter((lead) => lead.status === STATUS.CONVERTED).length;
  const potentialValue = store.leads.filter((lead) => lead.status !== STATUS.CONVERTED && lead.status !== STATUS.WAITING).reduce((sum, lead) => sum + Number(lead.potentialValue || 0), 0);

  const updateLead = (id, updater) => {
    setStore((current) => ({ ...current, leads: current.leads.map((lead) => lead.id === id ? updater(lead) : lead) }));
  };

  const notify = (message, tone = 'success') => setToast({ message, tone });

  const handleReceive = (lead) => {
    if (lead.status === STATUS.CONVERTED) return;
    updateLead(lead.id, (current) => receiveLead(current, CURRENT_USER));
    notify(`Đã nhận lead ${lead.name}. Trạng thái chuyển sang Đang chăm sóc.`);
  };

  const openReject = (lead) => {
    setRejectingLeadId(lead.id);
    setRejectReason('');
    setRejectError('');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setRejectError('Vui lòng nhập lý do từ chối để đưa lead về hàng chờ phân bổ.');
      return;
    }
    const lead = store.leads.find((item) => item.id === rejectingLeadId);
    if (!lead) return;
    updateLead(lead.id, (current) => rejectLead(current, rejectReason));
    setRejectingLeadId(null);
    setSelectedLeadId(null);
    notify('Đã từ chối lead và chuyển về hàng chờ phân bổ.');
  };

  const handleContact = (lead) => {
    if (lead.status === STATUS.CONVERTED) return;
    updateLead(lead.id, (current) => logContact(current));
    notify('Đã ghi nhận liên hệ. Cảnh báo SLA của lead này được gỡ.');
  };

  const handleQualify = (lead) => {
    if (lead.status === STATUS.CONVERTED) return;
    updateLead(lead.id, (current) => qualifyLead(current));
    notify('Lead đã được đánh dấu đủ điều kiện chuyển đổi.');
  };

  const handleConvert = (lead) => {
    try {
      const result = convertLead(lead);
      setStore((current) => ({
        ...current,
        leads: current.leads.map((item) => item.id === lead.id ? result.lead : item),
        customers: [result.customer, ...current.customers],
        contacts: [result.contact, ...current.contacts],
        opportunities: [result.opportunity, ...current.opportunities],
      }));
      notify(`Đã tạo khách hàng ${result.customer.id} và cơ hội ${result.opportunity.id}.`);
      setActiveSection('leads');
      setSelectedLeadId(lead.id);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setActiveSavedView('');
  };

  const applySavedView = (viewId) => {
    setActiveSavedView(viewId);
    const view = store.savedViews.find((item) => item.id === viewId);
    setFilters(view ? { ...EMPTY_FILTERS, ...view.filters } : EMPTY_FILTERS);
  };

  const saveCurrentView = () => {
    if (!viewName.trim()) return;
    const view = { id: `sv-${Date.now()}`, name: viewName.trim(), filters: { ...filters } };
    setStore((current) => ({ ...current, savedViews: [...current.savedViews, view] }));
    setActiveSavedView(view.id);
    setShowSaveView(false);
    setViewName('');
    notify(`Đã lưu bộ lọc “${view.name}”.`);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setActiveSavedView('');
  };

  const exportLeads = () => {
    const rows = [
      ['Mã lead', 'Tên liên hệ', 'Công ty', 'Email', 'Số điện thoại', 'Nguồn', 'Phân loại', 'Trạng thái', 'Người phụ trách', 'Giá trị tiềm năng', 'SLA quá hạn'],
      ...filteredLeads.map((lead) => [lead.id, lead.name, lead.company, lead.email, lead.phone, lead.source, lead.temperature, lead.status, lead.owner || '', lead.potentialValue || 0, isOverdue(lead) ? 'Có' : 'Không']),
    ];
    const csv = '\uFEFF' + rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'novacrm-leads.csv';
    link.click();
    URL.revokeObjectURL(url);
    notify('Đã xuất danh sách lead ra CSV.');
  };

  const sendManagerAlert = () => {
    setAlertSentAt(new Date().toISOString());
    notify(`Đã ghi nhận gửi cảnh báo cho trưởng nhóm về ${overdueLeads.length} lead quá SLA.`);
  };

  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'leads', label: 'Quản lý lead', icon: Target, count: store.leads.length },
    { id: 'customers', label: 'Khách hàng', icon: Building2, count: store.customers.length },
    { id: 'contacts', label: 'Người liên hệ', icon: UserRound, count: store.contacts.length },
    { id: 'opportunities', label: 'Cơ hội bán hàng', icon: TrendingUp, count: store.opportunities.length },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={21} strokeWidth={2.4} /></div>
          <span className="brand-name">nova<span>CRM</span></span>
          <button className="icon-button mobile-menu-close" aria-label="Đóng menu" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-logo">N</div>
          <div className="workspace-copy"><strong>Nova Solutions</strong><span>Không gian làm việc</span></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>
        <div className="nav-caption">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="main-nav" aria-label="Điều hướng chính">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button key={id} className={`nav-item ${activeSection === id ? 'active' : ''}`} onClick={() => { setActiveSection(id); setMenuOpen(false); }}>
              <Icon size={18} strokeWidth={1.9} /><span>{label}</span>{count !== undefined && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-caption nav-caption-spaced">CÁ NHÂN</div>
        <button className={`nav-item ${activeSection === 'my-tasks' ? 'active' : ''}`} onClick={() => { setActiveSection('my-tasks'); setFilters({ ...EMPTY_FILTERS, owner: 'Tôi' }); setActiveSavedView(''); setMenuOpen(false); }}>
          <CheckCircle2 size={18} /><span>Công việc của tôi</span><span className="nav-count">{assignedCount}</span>
        </button>
        <button className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`} onClick={() => { setActiveSection('reports'); setMenuOpen(false); }}><Activity size={18} /><span>Báo cáo</span></button>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Cần trợ giúp?</strong><span>Khám phá hướng dẫn sử dụng NovaCRM.</span><button onClick={() => notify('Trung tâm trợ giúp demo: hãy xem README trong project.')}>Mở trung tâm trợ giúp <ArrowRight size={13} /></button></div>
          <button className="nav-item settings-item" onClick={() => notify('Phần thiết lập sẽ được kết nối khi có backend.')}><Settings2 size={18} /><span>Thiết lập</span></button>
          <div className="profile-row"><div className="avatar avatar-purple">MA</div><div className="profile-copy"><strong>{CURRENT_USER}</strong><span>Nhân viên kinh doanh</span></div><MoreHorizontal size={19} className="muted-icon" /></div>
        </div>
      </aside>

      {menuOpen && <button className="mobile-backdrop" aria-label="Đóng menu" onClick={() => setMenuOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" aria-label="Mở menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Không gian làm việc</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === activeSection)?.label || (activeSection === 'my-tasks' ? 'Công việc của tôi' : 'Báo cáo')}</strong></div>
          <div className="topbar-right"><div className="top-search"><Search size={16} /><input aria-label="Tìm nhanh" placeholder="Tìm kiếm mọi thứ..." onKeyDown={(event) => { if (event.key === 'Enter') { setActiveSection('leads'); setFilter('query', event.currentTarget.value); } }} /></div><button className="icon-button notification-button" aria-label="Cảnh báo SLA" onClick={() => { setActiveSection('leads'); setFilter('overdueOnly', true); }}><Bell size={18} />{overdueLeads.length > 0 && <i>{overdueLeads.length}</i>}</button><div className="avatar avatar-purple top-avatar">MA</div></div>
        </header>

        <div className="page-content">
          {activeSection === 'leads' || activeSection === 'my-tasks' ? (
            <>
              <div className="page-heading-row">
                <div><div className="eyebrow"><span className="eyebrow-dot" /> BÁN HÀNG <span className="eyebrow-slash">/</span> LEAD</div><h1>Quản lý lead</h1><p className="page-subtitle">Theo dõi, phản hồi và chuyển đổi khách hàng tiềm năng của bạn.</p></div>
                <div className="heading-actions"><button className="button button-secondary" onClick={exportLeads}><Download size={16} /> Xuất danh sách</button><button className="button button-primary" onClick={() => notify('Tạo lead mới cần kết nối API backend.', 'info')}><Plus size={17} /> Thêm lead</button></div>
              </div>

              {overdueLeads.length > 0 && (
                <section className="sla-alert" role="status">
                  <div className="sla-alert-icon"><AlertCircle size={19} /></div>
                  <div className="sla-alert-content"><strong>{overdueLeads.length} lead đang quá SLA phản hồi</strong><span>Chưa ghi nhận liên hệ sau thời hạn cam kết. Lead đã được gắn cờ để trưởng nhóm theo dõi.</span>{alertSentAt && <small>Lần gửi cảnh báo gần nhất: {fullDate(alertSentAt)}</small>}</div>
                  <button className="alert-view-button" onClick={() => setFilter('overdueOnly', true)}>Xem lead quá SLA <ArrowRight size={15} /></button>
                  <button className="button button-alert" onClick={sendManagerAlert}><Bell size={15} /> Báo trưởng nhóm</button>
                </section>
              )}

              <section className="stats-grid" aria-label="Tổng quan lead">
                <StatCard icon={Users} label="Tổng lead" value={store.leads.length} helper="Trong danh sách hiện tại" tone="blue" trend="Tất cả nguồn" />
                <StatCard icon={Clock3} label="Chờ tiếp nhận" value={assignedCount} helper="Cần xác nhận phân bổ" tone="amber" trend="Phản hồi đúng SLA" />
                <StatCard icon={AlertCircle} label="Quá SLA" value={overdueLeads.length} helper="Chưa liên hệ khách hàng" tone="red" trend={overdueLeads.length ? 'Cần xử lý ngay' : 'Đang trong kiểm soát'} />
                <StatCard icon={TrendingUp} label="Đã chuyển đổi" value={convertedCount} helper="Lead → khách hàng + cơ hội" tone="green" trend={`${store.customers.length} khách hàng`} />
              </section>

              <section className="lead-workspace panel">
                <div className="workspace-header"><div><h2>Danh sách lead</h2><p>Quản lý lead theo trạng thái, mức độ tiềm năng và SLA phản hồi.</p></div><div className="workspace-header-right"><span className="last-updated"><span /> Dữ liệu demo cập nhật trực tiếp</span><button className="icon-button filters-icon" title="Đặt lại bộ lọc" aria-label="Đặt lại bộ lọc" onClick={clearFilters}><SlidersHorizontal size={17} /></button></div></div>
                <div className="view-tabs" role="tablist" aria-label="Lối tắt danh sách lead">
                  <button role="tab" aria-selected={!filters.overdueOnly && !filters.status} className={!filters.overdueOnly && !filters.status ? 'selected' : ''} onClick={() => { setFilters(EMPTY_FILTERS); setActiveSavedView(''); }}>Tất cả lead <span>{store.leads.length}</span></button>
                  <button role="tab" aria-selected={filters.status === STATUS.ASSIGNED} className={filters.status === STATUS.ASSIGNED ? 'selected' : ''} onClick={() => { setFilters({ ...EMPTY_FILTERS, status: STATUS.ASSIGNED }); setActiveSavedView(''); }}>Chờ tiếp nhận <span>{assignedCount}</span></button>
                  <button role="tab" aria-selected={filters.overdueOnly} className={filters.overdueOnly ? 'selected tab-overdue' : ''} onClick={() => setFilter('overdueOnly', !filters.overdueOnly)}><AlertCircle size={14} /> Quá SLA <span>{overdueLeads.length}</span></button>
                </div>

                <div className="filter-toolbar">
                  <div className="filter-search"><Search size={16} /><input aria-label="Tìm theo tên, công ty, email hoặc số điện thoại" placeholder="Tìm tên, công ty, email..." value={filters.query} onChange={(event) => setFilter('query', event.target.value)} /></div>
                  <div className="filter-select-wrap"><Filter size={15} /><select aria-label="Lọc trạng thái" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">Tất cả trạng thái</option>{STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14} /></div>
                  <div className="filter-select-wrap"><select aria-label="Lọc nguồn lead" value={filters.source} onChange={(event) => setFilter('source', event.target.value)}><option value="">Tất cả nguồn</option>{SOURCES.map((source) => <option key={source}>{source}</option>)}</select><ChevronDown size={14} /></div>
                  <div className="filter-select-wrap"><select aria-label="Lọc phân loại" value={filters.temperature} onChange={(event) => setFilter('temperature', event.target.value)}><option value="">Mọi phân loại</option>{TEMPERATURES.map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={14} /></div>
                  <div className="filter-select-wrap owner-filter"><select aria-label="Lọc người phụ trách" value={filters.owner} onChange={(event) => setFilter('owner', event.target.value)}><option value="">Mọi nhân viên</option><option value="Tôi">Lead của tôi</option><option value="Trần Quốc Bảo">Trần Quốc Bảo</option></select><ChevronDown size={14} /></div>
                  <button className={`save-view-button ${activeSavedView ? 'has-view' : ''}`} onClick={() => setShowSaveView(true)}><Plus size={15} /> Lưu bộ lọc</button>
                </div>
                <div className="advanced-filters"><span className="advanced-label"><CalendarDays size={14} /> Ngày tạo</span><label>Từ <input aria-label="Ngày tạo từ" type="date" value={filters.startDate} onChange={(event) => setFilter('startDate', event.target.value)} /></label><label>Đến <input aria-label="Ngày tạo đến" type="date" value={filters.endDate} onChange={(event) => setFilter('endDate', event.target.value)} /></label><span className="filter-divider" /><span className="saved-views-label"><ListFilter size={14} /> Bộ lọc đã lưu</span><select aria-label="Bộ lọc đã lưu" className="saved-view-select" value={activeSavedView} onChange={(event) => applySavedView(event.target.value)}><option value="">Chọn bộ lọc</option>{store.savedViews.map((view) => <option key={view.id} value={view.id}>{view.name}</option>)}</select>{(Object.entries(filters).some(([key, value]) => key !== 'query' && value) || filters.query) && <button className="clear-filters" onClick={clearFilters}>Xóa bộ lọc <X size={13} /></button>}</div>

                <LeadTable leads={filteredLeads} onOpen={(lead) => setSelectedLeadId(lead.id)} onReceive={handleReceive} onReject={openReject} onClear={clearFilters} />
                <div className="table-footer"><span>Hiển thị <strong>{filteredLeads.length ? 1 : 0}–{filteredLeads.length}</strong> trong tổng số <strong>{filteredLeads.length}</strong> lead phù hợp</span><div className="pagination"><button disabled aria-label="Trang trước"><ChevronLeft size={16} /></button><button className="current-page">1</button><button disabled aria-label="Trang sau"><ChevronRight size={16} /></button></div></div>
              </section>
              <div className="bottom-note"><ShieldCheck size={15} /> <span>SLA phản hồi giúp đảm bảo lead được chăm sóc đúng thời điểm.</span><button onClick={() => notify('SLA demo: thời hạn phản hồi được thể hiện theo từng lead; quá hạn sẽ gắn cờ khi chưa ghi nhận liên hệ.', 'info')}>Tìm hiểu SLA <ArrowRight size={13} /></button></div>
            </>
          ) : activeSection === 'customers' ? (
            <EntityPage title="Khách hàng" subtitle="Thông tin khách hàng được tạo từ các lead đã chuyển đổi." count={store.customers.length} icon={Building2} columns={['Mã khách hàng', 'Tên doanh nghiệp', 'Người liên hệ', 'Email', 'Số điện thoại', 'Hoạt động', 'Ngày tạo']} rows={store.customers.map((item) => [item.id, item.name, item.contactName, item.email, item.phone, `${(item.activities || []).length} hoạt động`, shortDate(item.createdAt)])} empty="Chưa có khách hàng." />
          ) : activeSection === 'contacts' ? (
            <EntityPage title="Người liên hệ" subtitle="Danh bạ người liên hệ được tạo cùng khách hàng khi chuyển đổi lead." count={store.contacts.length} icon={UserRound} columns={['Mã liên hệ', 'Họ và tên', 'Doanh nghiệp', 'Mã khách hàng', 'Email', 'Số điện thoại', 'Ngày tạo']} rows={store.contacts.map((item) => [item.id, item.name, item.company, item.customerId, item.email, item.phone, shortDate(item.createdAt)])} empty="Chưa có người liên hệ." />
          ) : activeSection === 'opportunities' ? (
            <EntityPage title="Cơ hội bán hàng" subtitle="Theo dõi giá trị và giai đoạn của cơ hội được tạo từ lead." count={store.opportunities.length} icon={TrendingUp} columns={['Mã cơ hội', 'Tên cơ hội', 'Mã khách hàng', 'Giá trị tiềm năng', 'Giai đoạn', 'Ngày tạo']} rows={store.opportunities.map((item) => [item.id, item.name, item.customerId, formatCurrency(item.value), item.stage, shortDate(item.createdAt)])} empty="Chưa có cơ hội bán hàng." />
          ) : activeSection === 'overview' ? (
            <OverviewPage leads={store.leads} customers={store.customers} opportunities={store.opportunities} overdueCount={overdueLeads.length} onGoLeads={() => setActiveSection('leads')} />
          ) : activeSection === 'reports' ? (
            <OverviewPage leads={store.leads} customers={store.customers} opportunities={store.opportunities} overdueCount={overdueLeads.length} onGoLeads={() => setActiveSection('leads')} reportMode />
          ) : (
            <OverviewPage leads={store.leads.filter((lead) => lead.owner === CURRENT_USER)} customers={store.customers} opportunities={store.opportunities} overdueCount={overdueLeads.length} onGoLeads={() => setActiveSection('leads')} />
          )}
        </div>
      </main>

      {selectedLead && <LeadDetail lead={selectedLead} onClose={() => setSelectedLeadId(null)} onReceive={handleReceive} onReject={openReject} onContact={handleContact} onQualify={handleQualify} onConvert={handleConvert} />}

      {rejectingLeadId && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRejectingLeadId(null); }}><section className="modal reject-modal" role="dialog" aria-modal="true" aria-labelledby="reject-title"><div className="modal-header"><div className="modal-title-icon danger"><X size={20} /></div><button className="icon-button" aria-label="Đóng" onClick={() => setRejectingLeadId(null)}><X size={18} /></button></div><h2 id="reject-title">Từ chối lead</h2><p className="modal-subtitle">Lead sẽ quay lại hàng chờ phân bổ. Vui lòng ghi rõ lý do để nhóm có thể phân bổ phù hợp hơn.</p><label className="field-label" htmlFor="reject-reason">Lý do từ chối <span>* Bắt buộc</span></label><textarea id="reject-reason" autoFocus rows={4} placeholder="Ví dụ: Không đúng khu vực phụ trách, thông tin không hợp lệ..." value={rejectReason} onChange={(event) => { setRejectReason(event.target.value); setRejectError(''); }} />{rejectError && <p className="field-error" role="alert">{rejectError}</p>}<div className="modal-actions"><button className="button button-secondary" onClick={() => setRejectingLeadId(null)}>Hủy</button><button className="button button-danger" onClick={handleReject}><X size={15} /> Xác nhận từ chối</button></div></section></div>}

      {showSaveView && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSaveView(false); }}><section className="modal save-view-modal" role="dialog" aria-modal="true" aria-labelledby="save-view-title"><div className="modal-header"><div className="modal-title-icon purple"><ListFilter size={20} /></div><button className="icon-button" aria-label="Đóng" onClick={() => setShowSaveView(false)}><X size={18} /></button></div><h2 id="save-view-title">Lưu bộ lọc hiện tại</h2><p className="modal-subtitle">Lưu bộ lọc này để mở nhanh danh sách lead bạn thường theo dõi.</p><label className="field-label" htmlFor="view-name">Tên bộ lọc</label><input id="view-name" className="modal-input" autoFocus placeholder="Ví dụ: Lead cần gọi trong hôm nay" value={viewName} onChange={(event) => setViewName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveCurrentView(); }} /><div className="modal-actions"><button className="button button-secondary" onClick={() => setShowSaveView(false)}>Hủy</button><button className="button button-primary" disabled={!viewName.trim()} onClick={saveCurrentView}><Check size={15} /> Lưu bộ lọc</button></div></section></div>}

      {toast && <div className={`toast toast-${toast.tone}`} role="status"><span className="toast-symbol">{toast.tone === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}</span><span>{toast.message}</span><button aria-label="Đóng thông báo" onClick={() => setToast(null)}><X size={15} /></button></div>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper, tone, trend }) {
  return <article className="stat-card"><div className="stat-top"><div className={`stat-icon stat-${tone}`}><Icon size={18} /></div><span className={`stat-trend trend-${tone}`}>{tone === 'red' ? <AlertCircle size={12} /> : tone === 'green' ? <TrendingUp size={12} /> : <Zap size={12} />}{trend}</span></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-helper">{helper}</div></article>;
}

function StatusPill({ status }) {
  const tone = status === STATUS.ASSIGNED ? 'status-assigned' : status === STATUS.WORKING ? 'status-working' : status === STATUS.WAITING ? 'status-waiting' : 'status-converted';
  return <span className={`status-pill ${tone}`}><i />{status}</span>;
}

function TemperaturePill({ temperature }) {
  const cls = temperature === 'Nóng' ? 'temperature-hot' : temperature === 'Ấm' ? 'temperature-warm' : 'temperature-cold';
  return <span className={`temperature-pill ${cls}`}>{temperature === 'Nóng' ? <Flame size={12} fill="currentColor" /> : temperature === 'Ấm' ? <span className="temperature-dot" /> : <span className="temperature-dot" />}{temperature}</span>;
}

function LeadTable({ leads, onOpen, onReceive, onReject, onClear }) {
  return <div className="table-scroll"><table className="lead-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả lead" onChange={() => {}} /></th><th>LEAD / KHÁCH HÀNG</th><th>NGUỒN</th><th>TRẠNG THÁI</th><th>PHỤ TRÁCH</th><th>SLA PHẢN HỒI</th><th>TIỀM NĂNG</th><th></th></tr></thead><tbody>{leads.map((lead) => {
    const overdue = isOverdue(lead);
    return <tr key={lead.id} className={overdue ? 'row-overdue' : ''} data-testid={`lead-row-${lead.id}`}>
      <td><input type="checkbox" aria-label={`Chọn ${lead.name}`} /></td>
      <td><button className="lead-person-cell" onClick={() => onOpen(lead)}><div className={`avatar lead-avatar avatar-${lead.temperature === 'Nóng' ? 'coral' : lead.temperature === 'Ấm' ? 'blue' : 'gray'}`}>{initials(lead.name)}</div><span className="lead-primary"><strong>{lead.name}</strong><small>{lead.company}</small><span className="lead-subline"><span>{lead.id}</span><TemperaturePill temperature={lead.temperature} /></span></span></button></td>
      <td><span className="source-label">{lead.source}</span><small className="cell-subtext">{shortDate(lead.createdAt)}</small></td>
      <td><StatusPill status={lead.status} />{lead.qualified && <span className="qualified-mini"><Check size={10} /> Đủ điều kiện</span>}</td>
      <td><div className="owner-cell">{lead.owner ? <><div className="avatar owner-avatar">{initials(lead.owner)}</div><span>{lead.owner === CURRENT_USER ? 'Bạn' : lead.owner}</span></> : <span className="unassigned"><Users size={13} /> Chưa phân công</span>}</div></td>
      <td>{overdue ? <div className="sla-cell sla-overdue"><span><AlertCircle size={14} /> Quá SLA</span><small>Chưa ghi nhận liên hệ</small></div> : lead.firstContactAt ? <div className="sla-cell sla-done"><span><CheckCircle2 size={14} /> Đã phản hồi</span><small>{shortDate(lead.firstContactAt)}</small></div> : <div className="sla-cell sla-pending"><span><Clock3 size={14} /> {new Date(lead.slaDueAt) < new Date() ? 'Đang theo dõi' : 'Còn thời hạn'}</span><small>Hạn {fullDate(lead.slaDueAt).split(', ').slice(-1)[0]}</small></div>}</td>
      <td><strong className="potential-value">{formatCurrency(lead.potentialValue)}</strong></td>
      <td><div className="row-actions">{lead.status === STATUS.ASSIGNED ? <><button className="table-action action-accept" aria-label={`Nhận lead ${lead.name}`} title="Nhận lead" onClick={() => onReceive(lead)}><Check size={15} /></button><button className="table-action action-reject" aria-label={`Từ chối lead ${lead.name}`} title="Từ chối lead" onClick={() => onReject(lead)}><X size={15} /></button></> : <button className="table-action action-open" aria-label={`Xem chi tiết ${lead.name}`} title="Xem chi tiết" onClick={() => onOpen(lead)}><ArrowRight size={15} /></button>}<button className="table-action action-more" aria-label={`Mở lead ${lead.name}`} onClick={() => onOpen(lead)}><MoreHorizontal size={16} /></button></div></td>
    </tr>;
  })}{leads.length === 0 && <tr><td colSpan="8"><div className="empty-state"><div className="empty-icon"><Search size={22} /></div><strong>Không tìm thấy lead phù hợp</strong><span>Thử đổi từ khóa hoặc xóa bớt bộ lọc.</span><button className="button button-secondary" onClick={onClear}>Xóa bộ lọc</button></div></td></tr>}</tbody></table></div>;
}

function LeadDetail({ lead, onClose, onReceive, onReject, onContact, onQualify, onConvert }) {
  const overdue = isOverdue(lead);
  const isConverted = lead.status === STATUS.CONVERTED;
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="lead-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="drawer-header"><div className="drawer-heading-label"><span>CHI TIẾT LEAD</span><span className="lead-id-tag">{lead.id}</span></div><button className="icon-button" aria-label="Đóng chi tiết" onClick={onClose}><X size={19} /></button></div><div className="drawer-content"><div className="detail-identity"><div className={`avatar detail-avatar avatar-${lead.temperature === 'Nóng' ? 'coral' : lead.temperature === 'Ấm' ? 'blue' : 'gray'}`}>{initials(lead.name)}</div><div className="detail-name-group"><h2 id="detail-title">{lead.name}</h2><span><Building2 size={14} /> {lead.company}</span></div><button className="icon-button detail-more" aria-label="Tùy chọn khác"><MoreHorizontal size={18} /></button></div><div className="detail-status-row"><StatusPill status={lead.status} /><TemperaturePill temperature={lead.temperature} />{lead.qualified && <span className="qualified-badge"><CheckCircle2 size={13} /> Đủ điều kiện</span>}</div>
    {overdue && <div className="detail-sla-alert"><AlertCircle size={17} /><div><strong>Đã quá SLA phản hồi</strong><span>Chưa ghi nhận lần liên hệ đầu tiên. Lead được gắn cờ cho trưởng nhóm.</span></div></div>}
    {isConverted && <div className="converted-banner"><CheckCircle2 size={18} /><div><strong>Lead đã chuyển đổi</strong><span>Mã khách hàng: {lead.customerId} · Mã liên hệ: {lead.contactId} · Mã cơ hội: {lead.opportunityId}</span><small>Dữ liệu lead đã khóa để tránh chỉnh sửa sau chuyển đổi.</small></div></div>}
    <div className="detail-actions">{lead.status === STATUS.ASSIGNED && <><button className="button button-primary" onClick={() => onReceive(lead)}><Check size={16} /> Nhận lead</button><button className="button button-secondary" onClick={() => onReject(lead)}><X size={16} /> Từ chối</button></>}{lead.status === STATUS.WORKING && !isConverted && <><button className="button button-secondary" onClick={() => onContact(lead)}><Phone size={16} /> Ghi nhận liên hệ</button>{!lead.qualified && <button className="button button-secondary" onClick={() => onQualify(lead)}><CheckCircle2 size={16} /> Đánh dấu đủ điều kiện</button>}{lead.qualified && <button className="button button-primary" onClick={() => onConvert(lead)}><Sparkles size={16} /> Chuyển đổi lead</button>}</>}</div>
    <section className="detail-section"><div className="detail-section-title"><h3>Thông tin liên hệ</h3><span>Thông tin từ lead</span></div><div className="detail-info-grid"><InfoItem icon={Mail} label="Email" value={lead.email} /><InfoItem icon={Phone} label="Số điện thoại" value={lead.phone} /><InfoItem icon={UserRound} label="Người phụ trách" value={lead.owner || 'Chưa phân công'} /><InfoItem icon={Target} label="Nguồn lead" value={lead.source} /><InfoItem icon={CalendarDays} label="Ngày tạo" value={fullDate(lead.createdAt)} /><InfoItem icon={Clock3} label="Hạn SLA phản hồi" value={fullDate(lead.slaDueAt)} danger={overdue} /><InfoItem icon={TrendingUp} label="Giá trị tiềm năng" value={formatCurrency(lead.potentialValue)} /><InfoItem icon={Building2} label="Phân khúc" value={lead.segment || 'Chưa phân loại'} /></div></section>
    <section className="detail-section note-section"><div className="detail-section-title"><h3>Ghi chú nhu cầu</h3></div><p>{lead.note || 'Chưa có ghi chú.'}</p></section>
    <section className="detail-section activity-section"><div className="detail-section-title"><h3>Lịch sử hoạt động</h3><span>{(lead.activities || []).length} hoạt động</span></div><div className="activity-timeline">{[...(lead.activities || [])].sort((a, b) => new Date(b.at) - new Date(a.at)).map((item) => <div className="timeline-item" key={item.id}><div className={`timeline-dot timeline-${item.type}`}><Activity size={12} /></div><div className="timeline-copy"><strong>{item.title}</strong><p>{item.detail}</p><small>{fullDate(item.at)}</small></div></div>)}</div></section>
    {isConverted && <section className="locked-note"><ShieldCheck size={16} /><span>Hồ sơ lead đã khóa. Hoạt động trước và trong lúc chuyển đổi được giữ lại đầy đủ.</span></section>}
    </div><div className="drawer-footer"><span><ShieldCheck size={15} /> Hoạt động được lưu trong lịch sử lead</span><button className="button button-secondary" onClick={onClose}>Đóng chi tiết</button></div></aside></div>;
}

function InfoItem({ icon: Icon, label, value, danger }) {
  return <div className="info-item"><span className="info-icon"><Icon size={14} /></span><div><label>{label}</label><strong className={danger ? 'text-danger' : ''}>{value || '—'}</strong></div></div>;
}

function EntityPage({ title, subtitle, count, icon: Icon, columns, rows, empty }) {
  return <><div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> BÁN HÀNG</div><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></div><div className="heading-actions"><button className="button button-secondary" onClick={() => window.print()}><Download size={16} /> In / xuất trang</button></div></div><section className="entity-panel panel"><div className="entity-panel-head"><div className="entity-title-icon"><Icon size={20} /></div><div><h2>{title}</h2><p>{count} bản ghi</p></div><div className="entity-head-spacer" /><span className="entity-live"><span /> Đồng bộ trong phiên</span></div>{rows.length ? <div className="table-scroll"><table className="entity-table"><thead><tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((value, cellIndex) => <td key={cellIndex}>{cellIndex === 0 ? <strong className="entity-id">{value}</strong> : value}</td>)}</tr>)}</tbody></table></div> : <div className="empty-state"><div className="empty-icon"><Icon size={22} /></div><strong>{empty}</strong><span>Hãy chuyển đổi một lead đủ điều kiện để bắt đầu.</span></div>}<div className="table-footer"><span>Đang hiển thị <strong>{rows.length}</strong> bản ghi</span></div></section></>;
}

function OverviewPage({ leads, customers, opportunities, overdueCount, onGoLeads, reportMode = false }) {
  const converted = leads.filter((lead) => lead.status === STATUS.CONVERTED).length;
  const active = leads.filter((lead) => lead.status === STATUS.WORKING).length;
  const rate = leads.length ? Math.round(converted / leads.length * 100) : 0;
  return <><div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> BÁN HÀNG</div><h1>{reportMode ? 'Báo cáo bán hàng' : 'Tổng quan'}</h1><p className="page-subtitle">{reportMode ? 'Các chỉ số cơ bản về pipeline lead và chuyển đổi.' : 'Bức tranh tổng thể về lead, tốc độ phản hồi và cơ hội bán hàng.'}</p></div><button className="button button-primary" onClick={onGoLeads}><Target size={16} /> Đi đến quản lý lead</button></div><section className="stats-grid overview-stats"><StatCard icon={Users} label="Tổng lead" value={leads.length} helper="Tất cả lead đã ghi nhận" tone="blue" trend="Pipeline" /><StatCard icon={Clock3} label="Đang chăm sóc" value={active} helper="Lead đang được theo dõi" tone="amber" trend="Đang hoạt động" /><StatCard icon={Building2} label="Khách hàng" value={customers.length} helper="Hồ sơ khách hàng đã tạo" tone="green" trend="Đã đồng bộ" /><StatCard icon={AlertCircle} label="Quá SLA" value={overdueCount} helper="Chưa có lần liên hệ đầu tiên" tone="red" trend="Cần kiểm tra" /></section><div className="overview-grid"><section className="panel overview-chart-panel"><div className="overview-card-head"><div><h2>Hiệu quả chuyển đổi</h2><p>Tỷ lệ lead đã hoàn tất chuyển đổi</p></div><span className="period-pill">Tất cả thời gian <ChevronDown size={13} /></span></div><div className="conversion-display"><div className="conversion-donut" style={{ '--progress': `${rate}%` }}><div><strong>{rate}%</strong><span>chuyển đổi</span></div></div><div className="conversion-legend"><div><span className="legend-dot legend-blue" /><div><strong>{leads.length - converted}</strong><small>Lead chưa chuyển đổi</small></div></div><div><span className="legend-dot legend-green" /><div><strong>{converted}</strong><small>Lead đã chuyển đổi</small></div></div><div><span className="legend-dot legend-red" /><div><strong>{overdueCount}</strong><small>Lead quá SLA</small></div></div></div></div><div className="chart-foot"><span><Activity size={14} /> Tỷ lệ được tính trên danh sách lead hiện tại.</span><button onClick={onGoLeads}>Xem danh sách <ArrowRight size={14} /></button></div></section><section className="panel pipeline-panel"><div className="overview-card-head"><div><h2>Pipeline hiện tại</h2><p>Phân bổ lead theo trạng thái</p></div><Target size={18} className="panel-head-icon" /></div>{[{ name: 'Chờ tiếp nhận', amount: leads.filter((lead) => lead.status === STATUS.ASSIGNED).length, style: 'pipeline-blue' }, { name: 'Đang chăm sóc', amount: active, style: 'pipeline-purple' }, { name: 'Chờ phân bổ', amount: leads.filter((lead) => lead.status === STATUS.WAITING).length, style: 'pipeline-gray' }, { name: 'Đã chuyển đổi', amount: converted, style: 'pipeline-green' }].map((item) => <div className="pipeline-item" key={item.name}><div><span>{item.name}</span><strong>{item.amount}</strong></div><div className="pipeline-track"><span className={item.style} style={{ width: `${leads.length ? item.amount / leads.length * 100 : 0}%` }} /></div></div>)}<div className="pipeline-footer"><span><TrendingUp size={15} /> {opportunities.length} cơ hội đang được ghi nhận</span><strong>{formatCurrency(opportunities.reduce((sum, item) => sum + item.value, 0))}</strong></div></section></div></>;
}

export default App;
