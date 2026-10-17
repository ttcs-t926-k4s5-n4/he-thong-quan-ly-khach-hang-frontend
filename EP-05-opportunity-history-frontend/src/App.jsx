import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Download,
  FileClock, Filter, Handshake, History, LayoutDashboard, ListFilter, Plus,
  Search, Settings2, SlidersHorizontal, Sparkles, Users2, Wallet, X, Layers3,
  UserRound, Building2, ExternalLink, CheckCircle2, AlertCircle, RotateCcw,
} from 'lucide-react';
import { ACTORS, FIELD_META, SEED_HISTORY, SEED_OPPORTUNITIES, STAGES } from './data/seed';
import {
  createHistoryEntries, filterHistory, formatCurrency, formatDateTime,
  formatFieldValue, getInitials, toCsv,
} from './utils/history';

const STORAGE_KEY = 'northstar-opportunity-history-v1';
const DEFAULT_FILTERS = { query: '', opportunityId: '', field: '', actor: '', from: '', to: '' };

function readSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.opportunities) && Array.isArray(parsed.history)) return parsed;
    }
  } catch (error) {
    console.warn('Không thể đọc dữ liệu đã lưu:', error);
  }
  return { opportunities: SEED_OPPORTUNITIES, history: SEED_HISTORY };
}

function IconBadge({ field }) {
  const Icon = field === 'stage' ? Layers3 : field === 'value' ? Wallet : field === 'closeDate' ? CalendarDays : UserRound;
  return <span className={`field-icon field-icon--${field}`}><Icon size={17} strokeWidth={2} /></span>;
}

function Avatar({ name, size = 'normal' }) {
  return <span className={`avatar ${size === 'small' ? 'avatar--small' : ''}`} aria-label={name}>{getInitials(name)}</span>;
}

function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`modal ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            <h2 id="modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" type="button" aria-label="Đóng" onClick={onClose}><X size={19} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function OpportunityForm({ mode, opportunity, opportunities, defaultActor, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: opportunity?.name ?? '',
    company: opportunity?.company ?? '',
    stage: opportunity?.stage ?? 'Khám phá',
    value: opportunity?.value ?? 0,
    closeDate: opportunity?.closeDate ?? '2026-11-30',
    owner: opportunity?.owner ?? ACTORS[0],
    actor: defaultActor ?? ACTORS[0],
    note: '',
  }));
  const [error, setError] = useState('');
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.company.trim()) {
      setError('Vui lòng nhập tên cơ hội và tên công ty.');
      return;
    }
    if (!form.closeDate) {
      setError('Vui lòng chọn ngày chốt dự kiến.');
      return;
    }
    const numericValue = Number(form.value);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setError('Giá trị cơ hội phải là số không âm.');
      return;
    }
    if (mode === 'create' && opportunities.some((item) => item.name.trim().toLowerCase() === form.name.trim().toLowerCase() && item.company.trim().toLowerCase() === form.company.trim().toLowerCase())) {
      setError('Cơ hội này đã tồn tại trong danh sách.');
      return;
    }
    onSave({ ...form, name: form.name.trim(), company: form.company.trim(), value: numericValue });
  };

  return (
    <Modal
      title={mode === 'create' ? 'Thêm cơ hội mới' : 'Cập nhật cơ hội'}
      subtitle={mode === 'create' ? 'Tạo cơ hội và tự động ghi nhận các giá trị khởi tạo.' : 'Mọi trường có thay đổi sẽ được ghi thành một dòng lịch sử riêng.'}
      onClose={onClose}
      wide
    >
      <form className="opportunity-form" onSubmit={handleSubmit}>
        <div className="form-section-label"><span>Thông tin cơ hội</span><span className="required-note">* Bắt buộc</span></div>
        {mode === 'create' && <div className="form-grid form-grid--two">
          <label className="field-control"><span>Tên cơ hội <b>*</b></span><input autoFocus value={form.name} onChange={update('name')} placeholder="VD: Triển khai hệ thống CRM" /></label>
          <label className="field-control"><span>Tên công ty <b>*</b></span><input value={form.company} onChange={update('company')} placeholder="VD: Công ty ABC" /></label>
        </div>}
        {mode === 'edit' && <div className="editing-opportunity"><span className="company-mark"><Building2 size={18} /></span><div><strong>{opportunity?.name}</strong><small>{opportunity?.company}</small></div><Pill tone="blue">Đang cập nhật</Pill></div>}
        <div className="form-grid form-grid--two">
          <label className="field-control"><span>Giai đoạn</span><select value={form.stage} onChange={update('stage')}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
          <label className="field-control"><span>Giá trị cơ hội (VNĐ)</span><div className="input-with-suffix"><input aria-label="Giá trị cơ hội (VNĐ)" type="number" min="0" step="1000000" value={form.value} onChange={update('value')} /><span>VNĐ</span></div></label>
          <label className="field-control"><span>Ngày chốt dự kiến</span><input type="date" value={form.closeDate} onChange={update('closeDate')} /></label>
          <label className="field-control"><span>Người sở hữu</span><select value={form.owner} onChange={update('owner')}>{ACTORS.map((actor) => <option key={actor}>{actor}</option>)}</select></label>
        </div>
        <div className="form-section-label form-section-label--spaced"><span>Thông tin ghi nhận</span></div>
        <div className="form-grid form-grid--two">
          <label className="field-control"><span>Người thực hiện thay đổi</span><select value={form.actor} onChange={update('actor')}>{ACTORS.map((actor) => <option key={actor}>{actor}</option>)}</select></label>
          <label className="field-control"><span>Ghi chú / lý do thay đổi</span><input value={form.note} onChange={update('note')} placeholder="VD: Khách hàng đổi lịch phê duyệt..." /></label>
        </div>
        {error && <div className="inline-error" role="alert"><AlertCircle size={16} />{error}</div>}
        <div className="modal-footer">
          <p><History size={15} /> Lịch sử được lưu ngay trên trình duyệt này.</p>
          <div><button type="button" className="button button--secondary" onClick={onClose}>Hủy</button><button type="submit" className="button button--primary"><Check size={16} />{mode === 'create' ? 'Tạo cơ hội' : 'Lưu thay đổi'}</button></div>
        </div>
      </form>
    </Modal>
  );
}

function HistoryDetail({ entry, opportunity }) {
  return (
    <div className="expanded-detail">
      <div className="expanded-detail__top"><div className="detail-note-icon"><FileClock size={17} /></div><div><strong>Chi tiết thay đổi</strong><p>{entry.note || 'Không có ghi chú cho lần cập nhật này.'}</p></div></div>
      <div className="detail-grid">
        <div><span>Cơ hội</span><strong>{opportunity?.name ?? 'Cơ hội đã xóa'}</strong></div>
        <div><span>Công ty</span><strong>{opportunity?.company ?? '—'}</strong></div>
        <div><span>Trường dữ liệu</span><strong>{FIELD_META[entry.field]?.label ?? entry.field}</strong></div>
        <div><span>Thời điểm chính xác</span><strong>{new Date(entry.timestamp).toLocaleString('vi-VN')}</strong></div>
      </div>
    </div>
  );
}

export default function App() {
  const [saved, setSaved] = useState(readSavedState);
  const { opportunities, history } = saved;
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modal, setModal] = useState(null);
  const [expandedId, setExpandedId] = useState('');
  const [toast, setToast] = useState(null);
  const [actorMenuOpen, setActorMenuOpen] = useState(false);
  const [currentActor, setCurrentActor] = useState(ACTORS[0]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }
    catch (error) { console.warn('Không thể lưu dữ liệu:', error); }
  }, [saved]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  const filteredHistory = useMemo(() => filterHistory(history, opportunities, filters), [history, opportunities, filters]);
  const opportunityMap = useMemo(() => new Map(opportunities.map((item) => [item.id, item])), [opportunities]);
  const selectedOpportunity = opportunities.find((item) => item.id === filters.opportunityId) ?? opportunities[0];
  const changesThisWeek = history.filter((entry) => {
    const elapsed = Date.now() - new Date(entry.timestamp).getTime();
    return elapsed >= 0 && elapsed <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const valueChanges = history.filter((entry) => entry.field === 'value').length;
  const activeActors = new Set(history.map((entry) => entry.actor)).size;

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const handleSaveOpportunity = (form) => {
    const timestamp = new Date().toISOString();
    if (modal.mode === 'create') {
      const newOpportunity = {
        id: `opp-${Date.now()}`,
        name: form.name,
        company: form.company,
        stage: form.stage,
        value: Number(form.value),
        closeDate: form.closeDate,
        owner: form.owner,
      };
      const initialValues = { stage: '', value: '', closeDate: '', owner: '' };
      const entries = createHistoryEntries({ opportunityId: newOpportunity.id, before: initialValues, after: newOpportunity, actor: form.actor, note: form.note || 'Khởi tạo cơ hội mới.', timestamp });
      setSaved((current) => ({ opportunities: [newOpportunity, ...current.opportunities], history: [...entries.reverse(), ...current.history] }));
      setToast({ type: 'success', message: `Đã tạo cơ hội “${newOpportunity.name}” và ghi ${entries.length} thay đổi vào lịch sử.` });
    } else {
      const previous = opportunities.find((item) => item.id === modal.opportunityId);
      if (!previous) return;
      const updated = { ...previous, stage: form.stage, value: Number(form.value), closeDate: form.closeDate, owner: form.owner };
      const entries = createHistoryEntries({ opportunityId: previous.id, before: previous, after: updated, actor: form.actor, note: form.note, timestamp });
      setSaved((current) => ({
        opportunities: current.opportunities.map((item) => item.id === previous.id ? updated : item),
        history: [...entries.reverse(), ...current.history],
      }));
      setToast(entries.length
        ? { type: 'success', message: `Đã lưu ${entries.length} thay đổi cho “${previous.name}”.` }
        : { type: 'info', message: 'Không có trường nào thay đổi nên lịch sử chưa phát sinh dòng mới.' });
    }
    setModal(null);
  };

  const exportCsv = () => {
    const csv = toCsv(filteredHistory, opportunities);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `lich-su-co-hoi-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setToast({ type: 'success', message: `Đã xuất ${filteredHistory.length} dòng lịch sử ra file CSV.` });
  };

  const openEditModal = () => {
    if (!selectedOpportunity) {
      setToast({ type: 'info', message: 'Hãy thêm một cơ hội trước khi cập nhật.' });
      return;
    }
    setModal({ mode: 'edit', opportunityId: selectedOpportunity.id });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Activity size={21} strokeWidth={2.7} /></span><span>northstar<span className="brand-dot">.</span><small>SALES WORKSPACE</small></span></div>
        <div className="workspace-switcher"><div className="workspace-icon">N</div><div><strong>Northstar Vietnam</strong><small>Không gian làm việc</small></div><ChevronDown size={16} /></div>
        <div className="sidebar-section-title">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          <div className="side-nav-item"><LayoutDashboard size={18} /><span>Tổng quan</span></div>
          <div className="side-nav-item"><Handshake size={18} /><span>Cơ hội kinh doanh</span><span className="nav-count">{opportunities.length}</span></div>
          <div className="side-nav-item side-nav-item--active"><History size={18} /><span>Lịch sử thay đổi</span><span className="active-nav-dot" /></div>
          <div className="side-nav-item"><Users2 size={18} /><span>Khách hàng</span></div>
        </nav>
        <div className="sidebar-section-title sidebar-section-title--bottom">CÔNG CỤ</div>
        <nav className="side-nav"><div className="side-nav-item"><SlidersHorizontal size={18} /><span>Báo cáo</span></div><div className="side-nav-item"><Settings2 size={18} /><span>Cài đặt</span></div></nav>
        <div className="sidebar-spacer" />
        <div className="help-card"><div className="help-card-icon"><CircleHelp size={18} /></div><strong>Cần hỗ trợ?</strong><p>Khám phá cách theo dõi mọi thay đổi trong quy trình bán hàng.</p><button type="button" onClick={() => setToast({ type: 'info', message: 'Trợ giúp: lọc lịch sử, mở từng dòng để xem ghi chú, hoặc cập nhật cơ hội để tự động ghi nhận thay đổi.' })}>Xem hướng dẫn <ArrowRight size={14} /></button></div>
        <div className="sidebar-user"><Avatar name="Nguyễn Minh Anh" /><div><strong>Nguyễn Minh Anh</strong><small>Trưởng nhóm kinh doanh</small></div><button className="sidebar-user-menu" type="button" aria-label="Chọn người thực hiện" onClick={() => setActorMenuOpen((open) => !open)}><ChevronDown size={16} /></button>{actorMenuOpen && <div className="actor-popover"><span>Người thực hiện mặc định</span>{ACTORS.map((actor) => <button type="button" key={actor} onClick={() => { setCurrentActor(actor); setActorMenuOpen(false); setToast({ type: 'success', message: `Người thực hiện mặc định: ${actor}` }); }}>{actor}{currentActor === actor && <Check size={14} />}</button>)}</div>}</div>
      </aside>

      <main className="main-panel">
        <header className="topbar"><div className="breadcrumbs"><span>Không gian làm việc</span><ChevronRight size={14} /><strong>Lịch sử thay đổi</strong></div><div className="topbar-actions"><button className="topbar-icon" type="button" aria-label="Thông báo" onClick={() => setToast({ type: 'info', message: 'Bạn đã xem tất cả thông báo mới.' })}><Bell size={18} /><i /></button><span className="topbar-divider" /><div className="topbar-user"><Avatar name={currentActor} size="small" /><span>{currentActor}</span><ChevronDown size={15} /></div></div></header>

        <div className="page-content">
          <div className="page-intro">
            <div><div className="eyebrow"><span className="eyebrow-mark"><Sparkles size={13} /></span> SALES OPERATIONS <span className="eyebrow-line" /> CẬP NHẬT THEO THỜI GIAN THỰC</div><h1>Lịch sử thay đổi cơ hội</h1><p>Theo dõi mọi cập nhật về giai đoạn, giá trị, ngày chốt và người sở hữu — tất cả trong một nơi.</p></div>
            <div className="intro-actions"><button className="button button--secondary" type="button" onClick={exportCsv}><Download size={16} />Xuất báo cáo <ChevronDown size={14} /></button><button className="button button--primary" type="button" onClick={openEditModal}><Plus size={17} />Cập nhật cơ hội</button><button className="button button--primary button--square" type="button" aria-label="Thêm cơ hội mới" onClick={() => setModal({ mode: 'create' })}><Plus size={19} /></button></div>
          </div>

          <section className="stats-grid" aria-label="Tổng quan lịch sử">
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Tổng thay đổi</span><span className="stat-icon stat-icon--purple"><FileClock size={18} /></span></div><div className="stat-number">{history.length.toLocaleString('vi-VN')}<span className="stat-unit">lần cập nhật</span></div><div className="stat-foot"><span className="stat-context"><span className="tiny-dot tiny-dot--purple" />Toàn bộ cơ hội</span><span className="stat-trend stat-trend--neutral">Đang theo dõi</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Cập nhật giá trị</span><span className="stat-icon stat-icon--blue"><Wallet size={18} /></span></div><div className="stat-number">{valueChanges}<span className="stat-unit">lần điều chỉnh</span></div><div className="stat-foot"><span className="stat-context"><span className="tiny-dot tiny-dot--blue" />Giá trị cơ hội</span><span className="stat-trend stat-trend--blue"><ArrowUpRight size={14} /> Theo dõi</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Hoạt động 7 ngày</span><span className="stat-icon stat-icon--green"><Activity size={18} /></span></div><div className="stat-number">{changesThisWeek}<span className="stat-unit">thay đổi gần đây</span></div><div className="stat-foot"><span className="stat-context"><span className="tiny-dot tiny-dot--green" />Trong 7 ngày qua</span><span className="stat-trend stat-trend--green">Đang hoạt động</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Người tham gia</span><span className="stat-icon stat-icon--orange"><Users2 size={18} /></span></div><div className="stat-number">{activeActors}<span className="stat-unit">thành viên</span></div><div className="stat-foot"><span className="stat-context"><span className="tiny-dot tiny-dot--orange" />Có hoạt động ghi nhận</span><div className="avatar-stack">{[...new Set(history.map((entry) => entry.actor))].slice(0, 3).map((actor) => <Avatar key={actor} name={actor} size="small" />)}{activeActors > 3 && <span className="avatar-more">+{activeActors - 3}</span>}</div></div></article>
          </section>

          <section className="history-panel">
            <div className="panel-heading"><div><div className="panel-title-line"><h2>Dòng thời gian hoạt động</h2><Pill tone="green"><span className="live-dot" />Đang đồng bộ</Pill></div><p>Mỗi thay đổi được lưu riêng cùng giá trị trước, sau, người thực hiện và thời điểm.</p></div><button className="button button--text" type="button" onClick={() => setModal({ mode: 'create' })}><Plus size={16} /> Tạo cơ hội</button></div>
            <div className="filter-toolbar">
              <label className="search-box"><Search size={17} /><input ref={searchInputRef} aria-label="Tìm kiếm lịch sử" value={filters.query} onChange={(event) => setFilter('query', event.target.value)} placeholder="Tìm cơ hội, công ty, người thực hiện..." />{filters.query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setFilter('query', '')}><X size={15} /></button>}<kbd>⌘ K</kbd></label>
              <div className="filter-select-wrap"><ListFilter size={16} /><select aria-label="Lọc theo trường thay đổi" value={filters.field} onChange={(event) => setFilter('field', event.target.value)}><option value="">Tất cả thay đổi</option>{Object.entries(FIELD_META).map(([key, meta]) => <option value={key} key={key}>{meta.label}</option>)}</select><ChevronDown size={14} /></div>
              <div className="filter-select-wrap filter-select-wrap--opportunity"><Building2 size={16} /><select aria-label="Lọc theo cơ hội" value={filters.opportunityId} onChange={(event) => setFilter('opportunityId', event.target.value)}><option value="">Tất cả cơ hội</option>{opportunities.map((opportunity) => <option value={opportunity.id} key={opportunity.id}>{opportunity.name}</option>)}</select><ChevronDown size={14} /></div>
              <button className={`filter-button ${filters.actor || filters.from || filters.to ? 'filter-button--active' : ''}`} type="button" onClick={() => setModal({ mode: 'filters' })}><Filter size={16} />Bộ lọc{(filters.actor || filters.from || filters.to) && <span className="filter-count">{[filters.actor, filters.from, filters.to].filter(Boolean).length}</span>}</button>
            </div>
            <div className="active-filters">{filters.field && <button type="button" onClick={() => setFilter('field', '')}>{FIELD_META[filters.field]?.label}<X size={13} /></button>}{filters.opportunityId && <button type="button" onClick={() => setFilter('opportunityId', '')}>{opportunityMap.get(filters.opportunityId)?.name}<X size={13} /></button>}{filters.actor && <button type="button" onClick={() => setFilter('actor', '')}>{filters.actor}<X size={13} /></button>}{filters.from && <button type="button" onClick={() => setFilter('from', '')}>Từ {filters.from}<X size={13} /></button>}{filters.to && <button type="button" onClick={() => setFilter('to', '')}>Đến {filters.to}<X size={13} /></button>}{(filters.field || filters.opportunityId || filters.actor || filters.from || filters.to) && <button className="clear-filters" type="button" onClick={resetFilters}><RotateCcw size={12} /> Xóa bộ lọc</button>}</div>

            <div className="table-wrap">
              <table className="history-table">
                <thead><tr><th className="th-activity">THAY ĐỔI</th><th>CƠ HỘI</th><th>GIÁ TRỊ TRƯỚC <ArrowRight size={12} /> SAU</th><th>NGƯỜI THỰC HIỆN</th><th>THỜI ĐIỂM</th><th><span className="sr-only">Chi tiết</span></th></tr></thead>
                <tbody>
                  {filteredHistory.map((entry) => {
                    const opportunity = opportunityMap.get(entry.opportunityId);
                    const expanded = expandedId === entry.id;
                    return <tr key={entry.id} className={expanded ? 'history-row history-row--expanded' : 'history-row'}>
                      <td colSpan="6" className="history-row-cell">
                        <div className="history-row-grid">
                          <div className="activity-cell"><IconBadge field={entry.field} /><div><strong>{FIELD_META[entry.field]?.label ?? entry.field}</strong><span>{entry.field === 'stage' ? 'Chuyển giai đoạn' : entry.field === 'value' ? 'Điều chỉnh giá trị' : entry.field === 'closeDate' ? 'Dời ngày chốt' : 'Bàn giao sở hữu'}</span></div></div>
                          <div className="opportunity-cell"><span className="opp-logo">{(opportunity?.company ?? 'C').slice(0, 1).toUpperCase()}</span><div><strong>{opportunity?.name ?? 'Cơ hội không tồn tại'}</strong><span>{opportunity?.company ?? '—'}</span></div></div>
                          <div className="value-cell"><span className="value-before">{formatFieldValue(entry.field, entry.before)}</span><ArrowRight size={14} /><span className={`value-after ${entry.field === 'value' ? 'value-after--money' : ''}`}>{formatFieldValue(entry.field, entry.after)}</span></div>
                          <div className="actor-cell"><Avatar name={entry.actor} size="small" /><div><strong>{entry.actor}</strong><span>{entry.actor === 'Nguyễn Minh Anh' ? 'Trưởng nhóm kinh doanh' : 'Nhóm kinh doanh'}</span></div></div>
                          <div className="time-cell"><strong>{formatDateTime(entry.timestamp).split(' · ')[0]}</strong><span><Clock3 size={12} />{formatDateTime(entry.timestamp).split(' · ')[1] ?? ''}</span></div>
                          <div className="row-action-cell"><button type="button" className={`row-expand ${expanded ? 'row-expand--open' : ''}`} aria-label={`${expanded ? 'Ẩn' : 'Xem'} chi tiết ${FIELD_META[entry.field]?.label}`} aria-expanded={expanded} onClick={() => setExpandedId(expanded ? '' : entry.id)}>{expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}</button></div>
                        </div>
                        {expanded && <HistoryDetail entry={entry} opportunity={opportunity} />}
                      </td>
                    </tr>;
                  })}
                  {filteredHistory.length === 0 && <tr><td colSpan="6"><div className="empty-state"><span className="empty-state-icon"><Search size={23} /></span><strong>Không tìm thấy lịch sử phù hợp</strong><p>Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm kết quả.</p><button className="button button--secondary" type="button" onClick={resetFilters}>Xóa tất cả bộ lọc</button></div></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Hiển thị <strong>{filteredHistory.length ? 1 : 0}–{filteredHistory.length}</strong> trong tổng số <strong>{history.length}</strong> thay đổi</span><div className="pagination"><button type="button" disabled aria-label="Trang trước"><ChevronLeft size={16} /></button><button type="button" className="pagination-current" aria-current="page">1</button><button type="button" disabled aria-label="Trang tiếp theo"><ChevronRight size={16} /></button></div><span className="updated-label"><span className="tiny-dot tiny-dot--green" />Dữ liệu được lưu tự động</span></div>
          </section>
          <footer className="page-footer"><span>© 2026 Northstar CRM <span className="footer-separator">·</span> Sales Workspace</span><span><span className="footer-status"><i />Hệ thống hoạt động ổn định</span><a href="mailto:support@example.com" onClick={(event) => { event.preventDefault(); setToast({ type: 'info', message: 'Liên hệ quản trị viên workspace để được hỗ trợ.' }); }}>Trợ giúp <ExternalLink size={12} /></a></span></footer>
        </div>
      </main>

      {modal && (modal.mode === 'edit' || modal.mode === 'create') && <OpportunityForm mode={modal.mode} opportunity={modal.mode === 'edit' ? opportunityMap.get(modal.opportunityId) : null} opportunities={opportunities} defaultActor={currentActor} onClose={() => setModal(null)} onSave={handleSaveOpportunity} />}
      {modal?.mode === 'filters' && <Modal title="Bộ lọc nâng cao" subtitle="Thu hẹp lịch sử theo người thực hiện và khoảng thời gian." onClose={() => setModal(null)}><div className="advanced-filters"><label className="field-control"><span>Người thực hiện</span><select value={filters.actor} onChange={(event) => setFilter('actor', event.target.value)}><option value="">Tất cả thành viên</option>{ACTORS.map((actor) => <option key={actor}>{actor}</option>)}</select></label><div className="form-grid form-grid--two"><label className="field-control"><span>Từ ngày</span><input type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => setFilter('from', event.target.value)} /></label><label className="field-control"><span>Đến ngày</span><input type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => setFilter('to', event.target.value)} /></label></div><div className="modal-footer"><p><Filter size={15} /> Kết quả cập nhật tức thì khi thay đổi bộ lọc.</p><div><button type="button" className="button button--secondary" onClick={resetFilters}>Xóa bộ lọc</button><button type="button" className="button button--primary" onClick={() => setModal(null)}><Check size={16} />Áp dụng</button></div></div></div></Modal>}
      {toast && <div role="status" className={`toast toast--${toast.type}`}><span className="toast-icon">{toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}</span><span>{toast.message}</span><button type="button" aria-label="Đóng thông báo" onClick={() => setToast(null)}><X size={15} /></button></div>}
    </div>
  );
}
