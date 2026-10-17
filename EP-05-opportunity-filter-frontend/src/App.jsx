import { useEffect, useMemo, useState } from 'react';
import { OPPORTUNITIES, OWNERS, PRODUCTS, STAGES } from './data/opportunities.js';
import {
  EMPTY_FILTERS,
  FILTER_STORAGE_KEY,
  filterOpportunities,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  hasActiveFilters,
  makeSavedFilter,
  parseSavedFilters,
  sortOpportunities,
  toCsv,
  validateFilters,
} from './utils/opportunityFilters.js';

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.8-.7a8 8 0 0 1-1.7 1l-.3 1.9h-2.8l-.3-1.9a8 8 0 0 1-1.7-1l-1.8.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.8.7a8 8 0 0 1 1.7-1l.3-1.9h2.8l.3 1.9a8 8 0 0 1 1.7 1l1.8-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    sliders: <><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3"/><path d="M2 14h4m4-6h4m4 8h4"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></>,
    bookmark: <><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    left: <path d="m15 18-6-6 6-6"/>,
    right: <path d="m9 18 6-6-6-6"/>,
    sort: <><path d="m8 9 4-4 4 4M16 15l-4 4-4-4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    filter: <><path d="M4 5h16M7 12h10m-7 7h4"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2"/></>,
    sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1 1-2.5Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.1.9-1.8 1.3-1.8 2.7M12 17h.01"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.sparkles}</svg>;
}

function initials(name) {
  return String(name).split(' ').filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase();
}

function safeReadSavedFilters() {
  try {
    return parseSavedFilters(window.localStorage.getItem(FILTER_STORAGE_KEY));
  } catch {
    return [];
  }
}

function stageClass(stage) {
  const map = {
    'Mới tiếp nhận': 'stage-new',
    'Đủ điều kiện': 'stage-qualified',
    'Đang tư vấn': 'stage-consult',
    'Đề xuất giải pháp': 'stage-proposal',
    'Đàm phán': 'stage-negotiation',
    'Thành công': 'stage-won',
    'Thất bại': 'stage-lost',
  };
  return map[stage] || 'stage-new';
}

function App() {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [savedFilters, setSavedFilters] = useState(safeReadSavedFilters);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedFilterName, setSavedFilterName] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState('');
  const [sortKey, setSortKey] = useState('closeDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [activeNav, setActiveNav] = useState('Cơ hội');

  const validationErrors = useMemo(() => validateFilters(filters), [filters]);
  const isValid = Object.keys(validationErrors).length === 0;
  const filteredItems = useMemo(() => {
    const found = filterOpportunities(OPPORTUNITIES, filters);
    return sortOpportunities(found, sortKey, sortDirection);
  }, [filters, sortKey, sortDirection]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pageItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = Object.entries(filters).filter(([key, value]) => key !== 'search' && String(value).trim() !== '').length;
  const openOpportunities = OPPORTUNITIES.filter((item) => !['Thành công', 'Thất bại'].includes(item.stage));
  const pipelineValue = openOpportunities.reduce((sum, item) => sum + item.value, 0);
  const oneWeekFromNow = new Date('2026-10-24T23:59:59');
  const weekStart = new Date('2026-10-17T00:00:00');
  const closingThisWeek = openOpportunities.filter((item) => {
    const d = new Date(`${item.closeDate}T12:00:00`);
    return d >= weekStart && d <= oneWeekFromNow;
  }).length;

  useEffect(() => {
    try {
      window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(savedFilters));
    } catch {
      // The current session still works even when browser storage is unavailable.
    }
  }, [savedFilters]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    function handleSearchShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('opportunity-search')?.focus();
      }
    }
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  function updateFilter(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({ ...EMPTY_FILTERS });
    setPage(1);
    setToast('Đã xóa tất cả điều kiện lọc.');
  }

  function saveCurrentFilter(event) {
    event.preventDefault();
    const name = savedFilterName.trim();
    if (!name) {
      setFormError('Vui lòng nhập tên bộ lọc.');
      return;
    }
    if (!hasActiveFilters(filters)) {
      setFormError('Hãy chọn ít nhất một điều kiện trước khi lưu.');
      return;
    }
    if (!isValid) {
      setFormError('Vui lòng sửa các điều kiện lọc chưa hợp lệ.');
      return;
    }
    const duplicate = savedFilters.some((item) => item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'));
    if (duplicate) {
      setFormError('Tên bộ lọc này đã tồn tại. Hãy chọn tên khác.');
      return;
    }
    const entry = makeSavedFilter(name, filters);
    setSavedFilters((previous) => [entry, ...previous]);
    setSaveDialogOpen(false);
    setSavedFilterName('');
    setFormError('');
    setToast(`Đã lưu bộ lọc “${name}”.`);
  }

  function applySavedFilter(entry) {
    setFilters({ ...EMPTY_FILTERS, ...entry.filters });
    setPage(1);
    setToast(`Đã áp dụng bộ lọc “${entry.name}”.`);
  }

  function deleteSavedFilter(id, name) {
    setSavedFilters((previous) => previous.filter((entry) => entry.id !== id));
    setToast(`Đã xóa bộ lọc “${name}”.`);
  }

  function exportCsv() {
    const csv = toCsv(filteredItems);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `co-hoi-kinh-doanh-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setToast(`Đã xuất ${filteredItems.length} cơ hội ra CSV.`);
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDirection(key === 'value' ? 'desc' : 'asc');
    }
    setPage(1);
  }

  function selectNav(label) {
    setActiveNav(label);
    if (label !== 'Cơ hội') setToast(`Bản demo này tập trung vào màn hình lọc Cơ hội. Mục “${label}” là điều hướng minh họa.`);
  }

  const activeChips = [
    filters.stage && { key: 'stage', text: filters.stage },
    (filters.minValue || filters.maxValue) && { key: 'value', text: `${filters.minValue ? formatCompactCurrency(Number(filters.minValue)) : '0 ₫'} – ${filters.maxValue ? formatCompactCurrency(Number(filters.maxValue)) : 'Không giới hạn'}` },
    (filters.closeFrom || filters.closeTo) && { key: 'date', text: `${filters.closeFrom ? formatDate(filters.closeFrom) : 'Bất kỳ'} – ${filters.closeTo ? formatDate(filters.closeTo) : 'Bất kỳ'}` },
    filters.product && { key: 'product', text: filters.product },
    filters.owner && { key: 'owner', text: filters.owner },
  ].filter(Boolean);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Icon name="layers" size={22} strokeWidth={2.2} /></div>
          <div className="brand-copy"><strong>northstar</strong><span>SALES WORKSPACE</span></div>
          <button className="icon-button sidebar-toggle" aria-label="Thu gọn menu" onClick={() => setToast('Menu được tối ưu theo khung demo hiện tại.')}><Icon name="chevron" size={16}/></button>
        </div>
        <div className="workspace-switcher"><div className="workspace-avatar">N</div><div><strong>Northstar Việt Nam</strong><span>Sales workspace</span></div><Icon name="chevron" size={15}/></div>
        <div className="nav-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <button className={`nav-item ${activeNav === 'Tổng quan' ? 'active' : ''}`} onClick={() => selectNav('Tổng quan')}><Icon name="grid"/><span>Tổng quan</span></button>
          <button className={`nav-item ${activeNav === 'Khách hàng' ? 'active' : ''}`} onClick={() => selectNav('Khách hàng')}><Icon name="users"/><span>Khách hàng</span></button>
          <button className={`nav-item ${activeNav === 'Cơ hội' ? 'active' : ''}`} onClick={() => selectNav('Cơ hội')}><Icon name="briefcase"/><span>Cơ hội</span><span className="nav-count">14</span></button>
          <button className={`nav-item ${activeNav === 'Báo cáo' ? 'active' : ''}`} onClick={() => selectNav('Báo cáo')}><Icon name="chart"/><span>Báo cáo</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Icon name="sparkles" size={18}/></div><strong>Tập trung vào điều quan trọng</strong><p>Lưu các bộ lọc yêu thích để tìm thương vụ nhanh hơn.</p><button onClick={() => { setSaveDialogOpen(true); setFormError(''); }}>Tạo bộ lọc <Icon name="arrow" size={14}/></button></div>
          <button className={`nav-item ${activeNav === 'Cài đặt' ? 'active' : ''}`} onClick={() => selectNav('Cài đặt')}><Icon name="settings"/><span>Cài đặt</span></button>
          <div className="profile-row"><div className="profile-avatar">PA</div><div className="profile-copy"><strong>Phạm Anh</strong><span>Nhân viên kinh doanh</span></div><button className="icon-button profile-more" aria-label="Tùy chọn tài khoản" onClick={() => setToast('Tài khoản demo: Phạm Anh.')}><span>···</span></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>CRM</span><span className="breadcrumb-slash">/</span><strong>Cơ hội</strong></div>
          <div className="topbar-actions"><div className="sync-label"><span className="sync-dot"/> Dữ liệu mới nhất</div><button className="top-icon-button" aria-label="Trợ giúp" onClick={() => setToast('Mẹo: kết hợp nhiều điều kiện để thu hẹp danh sách cơ hội.')}><Icon name="help" size={19}/></button><button className="top-icon-button notification-button" aria-label="Thông báo" onClick={() => setToast('Bạn đã xem tất cả thông báo mới.')}><Icon name="bell" size={19}/><i/></button><div className="top-avatar">PA</div></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line"/> SALES PIPELINE</div>
              <h1>Cơ hội kinh doanh</h1>
              <p className="page-subtitle">Tìm đúng thương vụ, tập trung đúng ưu tiên trong tuần.</p>
            </div>
            <div className="page-actions"><button className="button button-secondary" onClick={clearFilters}><Icon name="refresh" size={17}/> Đặt lại</button><button className="button button-primary" onClick={exportCsv}><Icon name="download" size={17}/> Xuất CSV</button></div>
          </div>

          <section className="stat-grid" aria-label="Tổng quan cơ hội">
            <div className="stat-card"><div className="stat-top"><span className="stat-icon purple"><Icon name="briefcase" size={18}/></span><span className="stat-caption">Toàn bộ cơ hội</span></div><div className="stat-value">{OPPORTUNITIES.length}<span className="stat-unit"> thương vụ</span></div><div className="stat-foot"><span className="trend-up"><Icon name="arrow" size={13}/> 12%</span><span>so với tháng trước</span></div></div>
            <div className="stat-card"><div className="stat-top"><span className="stat-icon blue"><Icon name="layers" size={18}/></span><span className="stat-caption">Tổng pipeline mở</span></div><div className="stat-value">{formatCompactCurrency(pipelineValue)}</div><div className="stat-foot"><span className="stat-foot-neutral">Chưa gồm thành công / thất bại</span></div></div>
            <div className="stat-card"><div className="stat-top"><span className="stat-icon orange"><Icon name="calendar" size={18}/></span><span className="stat-caption">Chốt trong 7 ngày</span></div><div className="stat-value">{closingThisWeek}<span className="stat-unit"> thương vụ</span></div><div className="stat-foot"><span className="stat-foot-highlight">Cần ưu tiên theo dõi</span></div></div>
            <div className="stat-card"><div className="stat-top"><span className="stat-icon green"><Icon name="filter" size={18}/></span><span className="stat-caption">Kết quả hiện tại</span></div><div className="stat-value">{filteredItems.length}<span className="stat-unit"> / {OPPORTUNITIES.length}</span></div><div className="stat-foot"><span>{activeCount + (filters.search.trim() ? 1 : 0)} điều kiện lọc đang dùng</span></div></div>
          </section>

          <section className="filter-card" aria-labelledby="filters-heading">
            <div className="filter-card-header"><div className="filter-title-wrap"><div className="filter-symbol"><Icon name="sliders" size={19}/></div><div><h2 id="filters-heading">Tìm kiếm & bộ lọc</h2><p>Kết hợp nhiều điều kiện để tìm đúng danh sách thương vụ.</p></div></div><span className="filter-count"><Icon name="filter" size={14}/>{activeCount} bộ lọc nâng cao</span></div>
            <div className="search-field"><Icon name="search" size={19}/><input id="opportunity-search" aria-label="Tìm kiếm cơ hội" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Tìm theo tên cơ hội, công ty, sản phẩm, người sở hữu..."/><kbd>⌘ K</kbd>{filters.search && <button className="search-clear" aria-label="Xóa tìm kiếm" onClick={() => updateFilter('search', '')}><Icon name="close" size={15}/></button>}</div>
            <div className="filters-grid">
              <label className="field"><span>Giai đoạn</span><div className="select-wrap"><select aria-label="Lọc theo giai đoạn" value={filters.stage} onChange={(event) => updateFilter('stage', event.target.value)}><option value="">Tất cả giai đoạn</option>{STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select><Icon name="chevron" size={16}/></div></label>
              <div className="field"><span>Khoảng giá trị (VND)</span><div className="range-fields"><div className="input-with-prefix"><span>₫</span><input aria-label="Giá trị tối thiểu" inputMode="numeric" type="number" min="0" placeholder="Từ" value={filters.minValue} onChange={(event) => updateFilter('minValue', event.target.value)}/></div><span className="range-dash">—</span><div className="input-with-prefix"><span>₫</span><input aria-label="Giá trị tối đa" inputMode="numeric" type="number" min="0" placeholder="Đến" value={filters.maxValue} onChange={(event) => updateFilter('maxValue', event.target.value)}/></div></div>{validationErrors.minValue && <small className="field-error">{validationErrors.minValue}</small>}{validationErrors.maxValue && <small className="field-error">{validationErrors.maxValue}</small>}</div>
              <div className="field"><span>Ngày chốt dự kiến</span><div className="range-fields date-range"><div className="date-input"><Icon name="calendar" size={15}/><input aria-label="Ngày chốt từ" type="date" value={filters.closeFrom} onChange={(event) => updateFilter('closeFrom', event.target.value)}/></div><span className="range-dash">—</span><div className="date-input"><Icon name="calendar" size={15}/><input aria-label="Ngày chốt đến" type="date" value={filters.closeTo} onChange={(event) => updateFilter('closeTo', event.target.value)}/></div></div>{validationErrors.closeTo && <small className="field-error">{validationErrors.closeTo}</small>}</div>
              <label className="field"><span>Sản phẩm</span><div className="select-wrap"><select aria-label="Lọc theo sản phẩm" value={filters.product} onChange={(event) => updateFilter('product', event.target.value)}><option value="">Tất cả sản phẩm</option>{PRODUCTS.map((product) => <option key={product} value={product}>{product}</option>)}</select><Icon name="chevron" size={16}/></div></label>
              <label className="field"><span>Người sở hữu</span><div className="select-wrap"><select aria-label="Lọc theo người sở hữu" value={filters.owner} onChange={(event) => updateFilter('owner', event.target.value)}><option value="">Tất cả nhân viên</option>{OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select><Icon name="chevron" size={16}/></div></label>
              <div className="filter-submit-cell"><button className="button button-primary apply-button" onClick={() => { setPage(1); setToast(`Đã cập nhật ${filteredItems.length} kết quả phù hợp.`); }} disabled={!isValid}><Icon name="search" size={16}/> Áp dụng bộ lọc</button><button className="text-button" onClick={clearFilters}>Xóa điều kiện</button></div>
            </div>
            <div className="filter-card-footer"><div className="privacy-note"><Icon name="sparkles" size={15}/><span>Mẹo: lưu bộ lọc thường dùng để mở lại chỉ với một lần nhấn.</span></div><button className="save-filter-button" onClick={() => { setSaveDialogOpen(true); setSavedFilterName(''); setFormError(''); }} disabled={!hasActiveFilters(filters) || !isValid}><Icon name="bookmark" size={16}/> Lưu bộ lọc này</button></div>
          </section>

          <section className="saved-section" aria-labelledby="saved-heading"><div className="section-heading"><div><h2 id="saved-heading">Bộ lọc đã lưu</h2><p>Các cách xem bạn sử dụng thường xuyên</p></div><span className="saved-count">{savedFilters.length} bộ lọc</span></div>
            {savedFilters.length ? <div className="saved-filters-row">{savedFilters.map((entry) => <div className="saved-filter-pill" key={entry.id}><button className="saved-filter-main" onClick={() => applySavedFilter(entry)}><span className="saved-filter-icon"><Icon name="bookmark" size={15}/></span><span className="saved-filter-name">{entry.name}</span><span className="saved-filter-arrow"><Icon name="arrow" size={13}/></span></button><button className="saved-filter-delete" aria-label={`Xóa bộ lọc ${entry.name}`} title="Xóa bộ lọc" onClick={() => deleteSavedFilter(entry.id, entry.name)}><Icon name="close" size={14}/></button></div>)}</div> : <div className="saved-empty"><div className="saved-empty-icon"><Icon name="bookmark" size={18}/></div><div><strong>Chưa có bộ lọc nào được lưu</strong><p>Chọn điều kiện ở trên rồi nhấn “Lưu bộ lọc này” để tạo lối tắt của riêng bạn.</p></div><button className="button button-small button-secondary" onClick={() => { updateFilter('closeFrom', '2026-10-17'); updateFilter('closeTo', '2026-10-24'); setFilters((prev) => ({ ...prev, closeFrom: '2026-10-17', closeTo: '2026-10-24' })); setToast('Đã chọn khoảng ngày chốt trong 7 ngày tới.'); }}>Thử lọc tuần này</button></div>}
          </section>

          <section className="results-section" aria-labelledby="results-heading"><div className="results-header"><div><div className="results-title-row"><h2 id="results-heading">Danh sách cơ hội</h2><span className="results-badge">{filteredItems.length}</span></div><p>{filters.search || activeChips.length ? 'Kết quả phù hợp với điều kiện tìm kiếm của bạn.' : 'Theo dõi và ưu tiên các thương vụ trong pipeline.'}</p></div><div className="results-tools"><label className="page-size-select"><span>Hiển thị</span><select aria-label="Số kết quả mỗi trang" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option value={7}>7</option><option value={10}>10</option><option value={14}>14</option></select></label><button className="button button-secondary results-export" onClick={exportCsv}><Icon name="download" size={16}/> Xuất kết quả</button></div></div>
            {activeChips.length > 0 && <div className="active-chips"><span>Đang lọc:</span>{activeChips.map((chip) => <button key={chip.key} className="active-chip" onClick={() => { if (chip.key === 'value') { updateFilter('minValue', ''); updateFilter('maxValue', ''); } else if (chip.key === 'date') { updateFilter('closeFrom', ''); updateFilter('closeTo', ''); } else updateFilter(chip.key, ''); }}><span>{chip.text}</span><Icon name="close" size={12}/></button>)}<button className="clear-chips" onClick={clearFilters}>Xóa tất cả</button></div>}
            <div className="table-shell"><table className="opportunity-table"><thead><tr><th className="opportunity-col">CƠ HỘI / CÔNG TY</th><th>GIAI ĐOẠN</th><th><button className="sort-button" onClick={() => toggleSort('value')}>GIÁ TRỊ <Icon name="sort" size={13}/></button></th><th><button className="sort-button" onClick={() => toggleSort('closeDate')}>NGÀY CHỐT <Icon name="sort" size={13}/></button></th><th>SẢN PHẨM</th><th>NGƯỜI SỞ HỮU</th></tr></thead><tbody>
              {pageItems.map((item) => <tr key={item.id}><td><div className="opportunity-cell"><div className={`company-logo company-${item.id.slice(-1)}`}>{item.company.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase()}</div><div className="opportunity-info"><div className="opportunity-name">{item.name}</div><div className="company-meta"><span>{item.company}</span><span className="meta-dot">·</span><span>{item.id}</span></div></div></div></td><td><span className={`stage-badge ${stageClass(item.stage)}`}><span className="stage-dot"/>{item.stage}</span></td><td><div className="value-cell"><strong>{formatCurrency(item.value)}</strong><div className="probability-line"><span><i style={{ width: `${item.probability}%` }} className={item.probability >= 70 ? 'prob-high' : item.probability >= 40 ? 'prob-mid' : 'prob-low'}/></span><small>{item.probability}%</small></div></div></td><td><div className={`date-cell ${item.closeDate < '2026-10-17' && !['Thành công', 'Thất bại'].includes(item.stage) ? 'date-overdue' : ''}`}><Icon name="calendar" size={14}/><span>{formatDate(item.closeDate)}</span></div>{item.closeDate >= '2026-10-17' && item.closeDate <= '2026-10-24' && !['Thành công', 'Thất bại'].includes(item.stage) && <span className="due-soon">Chốt trong tuần</span>}</td><td><span className="product-label"><span className="product-dot"/>{item.product}</span></td><td><div className="owner-cell"><div className={`owner-avatar owner-${OWNERS.indexOf(item.owner)}`}>{initials(item.owner)}</div><span>{item.owner}</span></div></td></tr>)}
            </tbody></table>
              {pageItems.length === 0 && <div className="empty-results"><div className="empty-illustration"><Icon name="search" size={27}/></div><h3>Chưa tìm thấy cơ hội phù hợp</h3><p>Thử thay đổi hoặc bỏ bớt một vài điều kiện lọc để xem thêm kết quả.</p><button className="button button-secondary" onClick={clearFilters}>Xóa tất cả bộ lọc</button></div>}
              <div className="table-footer"><span>Hiển thị <strong>{filteredItems.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredItems.length)}</strong> trong tổng số <strong>{filteredItems.length}</strong> cơ hội</span><div className="pagination"><button className="page-arrow" aria-label="Trang trước" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><Icon name="left" size={16}/></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} className={`page-number ${pageNumber === page ? 'selected' : ''}`} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}<button className="page-arrow" aria-label="Trang sau" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><Icon name="right" size={16}/></button></div></div>
            </div>
          </section>
          <footer className="page-footer"><span>© 2026 Northstar CRM</span><span><span className="footer-dot"/> Bản demo frontend · Dữ liệu mẫu</span></footer>
        </div>
      </main>

      {saveDialogOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSaveDialogOpen(false); }}><section className="save-modal" role="dialog" aria-modal="true" aria-labelledby="save-modal-title"><div className="modal-heading"><div className="modal-icon"><Icon name="bookmark" size={20}/></div><button className="icon-button modal-close" aria-label="Đóng" onClick={() => setSaveDialogOpen(false)}><Icon name="close" size={18}/></button></div><h2 id="save-modal-title">Lưu bộ lọc thường dùng</h2><p>Đặt tên dễ nhớ để mở lại đúng danh sách cơ hội này chỉ với một lần nhấn.</p><form onSubmit={saveCurrentFilter}><label className="modal-label" htmlFor="saved-filter-name">Tên bộ lọc</label><input id="saved-filter-name" autoFocus maxLength={48} placeholder="Ví dụ: Cần chốt trong tuần" value={savedFilterName} onChange={(event) => { setSavedFilterName(event.target.value); setFormError(''); }}/><div className="modal-condition-summary"><Icon name="filter" size={15}/><span>{activeCount + (filters.search.trim() ? 1 : 0)} điều kiện sẽ được lưu cùng bộ lọc này</span></div>{formError && <div className="form-error" role="alert">{formError}</div>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setSaveDialogOpen(false)}>Hủy</button><button type="submit" className="button button-primary"><Icon name="bookmark" size={16}/> Lưu bộ lọc</button></div></form></section></div>}
      {toast && <div className="toast-message" role="status"><span className="toast-check"><Icon name="check" size={15}/></span>{toast}<button aria-label="Đóng thông báo" onClick={() => setToast('')}><Icon name="close" size={14}/></button></div>}
    </div>
  );
}

export default App;
