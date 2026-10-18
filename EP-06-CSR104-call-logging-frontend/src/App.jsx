import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowUpRight, Bell, CalendarClock, CalendarCheck, Check, CheckCircle2,
  ChevronDown, CircleMinus, Clock3, History, MessageCircle, Phone, PhoneCall,
  PhoneMissed, Search, Send, Sparkles, Target, X, Zap, Building2, NotebookPen,
} from 'lucide-react';
import { CALL_OUTCOMES, demoCallLogs, demoCustomers, demoOpportunities } from './data/demoData.js';
import {
  createCallLog, findLatestOpenOpportunity, formatDateTime, formatVnd,
  getCallSummary, getDefaultCallbackDateTime, matchesCallLogSearch, toLocalDateTimeInput,
} from './lib/callLog.js';

const STORAGE_KEYS = {
  calls: 'ep06-csr104-call-logs-v1',
  customer: 'ep06-csr104-selected-customer-v1',
};

const outcomeIcons = {
  connected: MessageCircle,
  no_answer: PhoneMissed,
  busy: Phone,
  callback: CalendarClock,
  meeting: CalendarCheck,
  not_interested: CircleMinus,
};

function readStoredJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getOutcomeMeta(outcomeId) {
  return CALL_OUTCOMES.find((item) => item.id === outcomeId) ?? CALL_OUTCOMES[0];
}

function formatTime(value) {
  if (!value) return 'Chưa đặt lịch';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function getCallbackHint(value, now = new Date()) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const delta = date.getTime() - now.getTime();
  if (delta < 0) return { label: 'Đã quá giờ gọi lại', className: 'overdue' };
  if (delta < 60 * 60 * 1000) return { label: 'Trong vòng 1 giờ tới', className: 'soon' };
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return { label: 'Ngày mai', className: 'upcoming' };
  return { label: 'Đã lên lịch', className: 'upcoming' };
}

function Avatar({ initials, color = 'violet', size = 'md' }) {
  return <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span>;
}

function StatCard({ icon: Icon, label, value, foot, tone = 'violet' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}><Icon size={18} strokeWidth={2.1} /></div>
      <div className="stat-copy">
        <span className="stat-label">{label}</span>
        <strong>{value}</strong>
        <span className="stat-foot">{foot}</span>
      </div>
    </div>
  );
}

function App() {
  const [calls, setCalls] = useState(() => readStoredJson(STORAGE_KEYS.calls, demoCallLogs));
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => readStoredJson(STORAGE_KEYS.customer, 'cus-001'));
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [note, setNote] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [callbackAt, setCallbackAt] = useState('');
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState('');
  const [mobilePanel, setMobilePanel] = useState('form');
  const [showAllCalls, setShowAllCalls] = useState(false);

  const currentCustomer = demoCustomers.find((item) => item.id === selectedCustomerId) ?? demoCustomers[0];
  const linkedOpportunity = useMemo(
    () => findLatestOpenOpportunity(currentCustomer?.id, demoOpportunities),
    [currentCustomer?.id],
  );
  const summary = useMemo(() => getCallSummary(calls), [calls]);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEYS.calls, JSON.stringify(calls)); } catch { /* Storage may be disabled. */ }
  }, [calls]);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(selectedCustomerId)); } catch { /* Storage may be disabled. */ }
  }, [selectedCustomerId]);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !isTyping) {
        event.preventDefault();
        document.querySelector('[aria-label=\"Tìm kiếm cuộc gọi\"]')?.focus();
      }
    };
    document.addEventListener('keydown', handleSearchShortcut);
    return () => document.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleCalls = useMemo(() => {
    let result = [...calls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (activityFilter === 'scheduled') result = result.filter((call) => Boolean(call.callbackAt));
    if (activityFilter === 'linked') result = result.filter((call) => Boolean(call.opportunityId));
    if (search.trim()) result = result.filter((call) => matchesCallLogSearch(call, search));
    return result;
  }, [calls, activityFilter, search]);

  const selectedOutcomeMeta = CALL_OUTCOMES.find((item) => item.id === selectedOutcome);

  function handleOutcomeSelect(outcomeId) {
    setSelectedOutcome(outcomeId);
    setFormError('');
    if (outcomeId === 'callback') {
      setShowSchedule(true);
      setCallbackAt((current) => current || getDefaultCallbackDateTime());
    }
  }

  function handleScheduleToggle() {
    const next = !showSchedule;
    setShowSchedule(next);
    setFormError('');
    if (next && !callbackAt) setCallbackAt(getDefaultCallbackDateTime());
    if (!next) {
      setCallbackAt('');
      if (selectedOutcome === 'callback') setSelectedOutcome('');
    }
  }

  function handleSaveCall(event) {
    event.preventDefault();
    setFormError('');
    try {
      const log = createCallLog({
        customerId: selectedCustomerId,
        outcome: selectedOutcome,
        note,
        callbackAt: showSchedule || selectedOutcome === 'callback' ? callbackAt : '',
        customers: demoCustomers,
        opportunities: demoOpportunities,
        createdBy: 'Phạm Ngọc Anh',
      });
      setCalls((current) => [log, ...current]);
      setNote('');
      setSelectedOutcome('');
      setShowSchedule(false);
      setCallbackAt('');
      setToast({ type: 'success', message: log.opportunityName
        ? `Đã lưu cuộc gọi và tự động gắn vào “${log.opportunityName}”.`
        : 'Đã lưu cuộc gọi vào hồ sơ khách hàng.' });
      setMobilePanel('history');
    } catch (error) {
      setFormError(error.message || 'Chưa thể lưu cuộc gọi. Vui lòng thử lại.');
    }
  }

  function handleResetForm() {
    setSelectedOutcome('');
    setNote('');
    setShowSchedule(false);
    setCallbackAt('');
    setFormError('');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark"><PhoneCall size={20} strokeWidth={2.5} /></div>
          <div className="brand-name"><strong>pulse<span>crm</span></strong><small>SALES WORKSPACE</small></div>
        </div>
        <div className="topbar-right">
          <span className="secure-pill"><span className="secure-dot" /> Không gian bán hàng</span>
          <button className="icon-button notification-button" type="button" aria-label="Thông báo" onClick={() => setToast({ type: 'info', message: 'Bạn đang xem bản demo thông báo.' })}>
            <Bell size={18} /><i />
          </button>
          <div className="profile-pill"><Avatar initials="NA" color="violet" /><span><strong>Phạm Ngọc Anh</strong><small>Nhân viên kinh doanh</small></span><ChevronDown size={15} /></div>
        </div>
      </header>

      <main className="page-shell">
        <div className="breadcrumb"><span>Không gian bán hàng</span><span className="crumb-separator">/</span><span>Hoạt động</span><span className="crumb-separator">/</span><strong>Ghi nhanh cuộc gọi</strong></div>

        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> NHẬT KÝ CHĂM SÓC KHÁCH HÀNG</div>
            <h1>Ghi nhanh cuộc gọi <span className="heading-spark"><Sparkles size={22} /></span></h1>
            <p>Ghi lại kết quả khi cuộc gọi vừa kết thúc — không bỏ lỡ bất kỳ cơ hội nào.</p>
          </div>
          <div className="quick-badge"><Zap size={17} fill="currentColor" /><span><strong>Chỉ 3 thao tác</strong><small>Chọn kết quả · Ghi chú · Lưu</small></span></div>
        </section>

        <section className="stats-grid" aria-label="Tổng quan cuộc gọi">
          <StatCard icon={PhoneCall} label="Cuộc gọi hôm nay" value={summary.callsToday} foot="Lượt đã ghi nhận" tone="violet" />
          <StatCard icon={MessageCircle} label="Đã kết nối" value={summary.connectedToday} foot="Trao đổi hoặc đặt hẹn" tone="green" />
          <StatCard icon={CalendarClock} label="Lịch gọi lại" value={summary.callbacksDue} foot={`${summary.overdueCallbacks} lịch đã quá giờ`} tone="orange" />
        </section>

        <div className="mobile-tabs" role="tablist" aria-label="Khu vực cuộc gọi">
          <button type="button" className={mobilePanel === 'form' ? 'active' : ''} onClick={() => setMobilePanel('form')} role="tab" aria-selected={mobilePanel === 'form'}><Phone size={16} /> Ghi cuộc gọi</button>
          <button type="button" className={mobilePanel === 'history' ? 'active' : ''} onClick={() => setMobilePanel('history')} role="tab" aria-selected={mobilePanel === 'history'}><History size={16} /> Hoạt động gần đây</button>
        </div>

        <div className="content-grid">
          <section className={`panel call-panel ${mobilePanel === 'history' ? 'mobile-hidden' : ''}`}>
            <div className="panel-header">
              <div className="panel-title-icon purple"><PhoneCall size={19} /></div>
              <div className="panel-title-wrap"><h2>Cuộc gọi mới</h2><p>Thông tin ngắn gọn để bạn không mất thời gian nhập liệu.</p></div>
              <span className="live-tag"><span /> ĐANG GHI NHANH</span>
            </div>

            <form onSubmit={handleSaveCall}>
              <div className="form-block customer-block">
                <div className="field-heading"><label htmlFor="customer">Khách hàng</label><span className="field-required">* Bắt buộc</span></div>
                <div className="customer-select-wrap">
                  <div className={`customer-avatar-holder color-${currentCustomer.color}`}><Avatar initials={currentCustomer.initials} color={currentCustomer.color} size="lg" /></div>
                  <div className="customer-fields">
                    <select id="customer" value={selectedCustomerId} onChange={(event) => { setSelectedCustomerId(event.target.value); setFormError(''); }} aria-label="Chọn khách hàng">
                      {demoCustomers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.company}</option>)}
                    </select>
                    <div className="customer-subline"><Building2 size={13} /><span>{currentCustomer.company}</span><span className="subline-dot">·</span><Phone size={12} /><span>{currentCustomer.phone}</span></div>
                  </div>
                  <button className="subtle-icon-button" type="button" aria-label="Đổi khách hàng" onClick={() => document.getElementById('customer')?.focus()}><ChevronDown size={16} /></button>
                </div>
              </div>

              <div className="form-block">
                <div className="field-heading"><label>Kết quả cuộc gọi</label><span className="field-required">* Chọn 1 kết quả</span></div>
                <div className="outcome-grid">
                  {CALL_OUTCOMES.map((outcome) => {
                    const Icon = outcomeIcons[outcome.id] ?? Phone;
                    const active = selectedOutcome === outcome.id;
                    return (
                      <button className={`outcome-option ${active ? 'selected' : ''} outcome-${outcome.id}`} key={outcome.id} type="button" aria-pressed={active} onClick={() => handleOutcomeSelect(outcome.id)}>
                        <span className="outcome-icon"><Icon size={18} strokeWidth={2.1} /></span>
                        <span className="outcome-text"><strong>{outcome.label}</strong><small>{outcome.description}</small></span>
                        {active && <span className="outcome-check"><Check size={12} /></span>}
                      </button>
                    );
                  })}
                </div>
                {selectedOutcomeMeta && <div className="selection-hint"><CheckCircle2 size={14} /> Đã chọn: <strong>{selectedOutcomeMeta.label}</strong>{selectedOutcome === 'callback' && <span> — lịch gọi lại được bật tự động</span>}</div>}
              </div>

              <div className="form-block note-block">
                <div className="field-heading"><label htmlFor="call-note">Ghi chú ngắn</label><span className="optional-label">Không bắt buộc</span></div>
                <div className="textarea-wrap"><NotebookPen size={17} /><textarea id="call-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} placeholder="Ví dụ: Khách quan tâm gói Pro, cần gửi báo giá trước thứ Sáu..." rows={3} /><span className="character-count">{note.length}/280</span></div>
                <div className="field-footnote">Gợi ý: ghi nhu cầu chính và bước tiếp theo để lần chăm sóc sau dễ dàng hơn.</div>
              </div>

              <div className={`callback-block ${showSchedule ? 'expanded' : ''}`}>
                <button className="callback-toggle" type="button" onClick={handleScheduleToggle} aria-expanded={showSchedule}>
                  <span className="callback-icon"><CalendarClock size={19} /></span>
                  <span className="callback-toggle-copy"><strong>{showSchedule ? 'Đã bật lịch gọi lại' : 'Đặt lịch gọi lại'}</strong><small>{showSchedule ? 'Chọn ngày giờ phù hợp với khách hàng' : 'Nhắc bạn liên hệ khách hàng vào thời điểm khác'}</small></span>
                  <span className={`toggle-switch ${showSchedule ? 'on' : ''}`}><i /></span>
                </button>
                {showSchedule && (
                  <div className="callback-date-row">
                    <label htmlFor="callback-time">Ngày và giờ gọi lại</label>
                    <input id="callback-time" type="datetime-local" value={callbackAt} min={toLocalDateTimeInput(new Date())} onChange={(event) => setCallbackAt(event.target.value)} required={selectedOutcome === 'callback'} />
                    <small><Clock3 size={13} /> {callbackAt ? `Dự kiến ${formatDateTime(callbackAt)}` : 'Chưa chọn thời gian'}</small>
                  </div>
                )}
              </div>

              {formError && <div className="form-error" role="alert"><X size={15} /> {formError}</div>}

              <div className="form-footer">
                <span className="autosave-note"><CheckCircle2 size={15} /> Lưu tự động trên thiết bị</span>
                <div className="form-actions"><button className="text-button" type="button" onClick={handleResetForm}>Xóa nhập</button><button className="primary-button" type="submit"><Send size={16} /> Ghi cuộc gọi <span className="button-shortcut">↵</span></button></div>
              </div>
            </form>
          </section>

          <aside className={`side-column ${mobilePanel === 'form' ? 'mobile-hidden' : ''}`}>
            <section className="panel opportunity-panel">
              <div className="side-panel-heading"><div className="panel-title-icon blue"><Target size={18} /></div><div><h2>Cơ hội liên quan</h2><p>Tự động gắn theo khách hàng</p></div><span className="auto-chip"><Sparkles size={12} /> Tự động</span></div>
              {linkedOpportunity ? (
                <div className="opportunity-card">
                  <div className="opp-top-line"><span className="opp-stage"><span />{linkedOpportunity.stage}</span><span className="opp-updated"><Activity size={12} /> Cập nhật gần nhất</span></div>
                  <h3>{linkedOpportunity.name}</h3>
                  <div className="opp-value">{formatVnd(linkedOpportunity.value)}</div>
                  <div className="opp-bottom"><span><Building2 size={13} /> {currentCustomer.company}</span><span className="opp-linked"><CheckCircle2 size={13} /> Sẽ tự gắn khi lưu</span></div>
                </div>
              ) : (
                <div className="empty-opportunity"><Target size={23} /><strong>Chưa có cơ hội đang mở</strong><span>Cuộc gọi vẫn được lưu trong hồ sơ khách hàng.</span></div>
              )}
              <div className="automation-note"><Sparkles size={15} /><span>Hệ thống tự chọn cơ hội đang mở được cập nhật gần nhất của khách hàng này.</span></div>
            </section>

            <section className="panel recent-panel">
              <div className="recent-header">
                <div className="side-panel-heading recent-heading"><div className="panel-title-icon mint"><History size={18} /></div><div><h2>Hoạt động gần đây</h2><p>Lịch sử chăm sóc khách hàng</p></div></div>
                <span className="count-pill">{visibleCalls.length}</span>
              </div>
              <div className="recent-tools">
                <div className="search-box"><Search size={15} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, ghi chú..." aria-label="Tìm kiếm cuộc gọi" /><kbd>/</kbd></div>
                <div className="filter-row" aria-label="Lọc hoạt động">
                  <button type="button" className={activityFilter === 'all' ? 'active' : ''} onClick={() => setActivityFilter('all')}>Tất cả</button>
                  <button type="button" className={activityFilter === 'scheduled' ? 'active' : ''} onClick={() => setActivityFilter('scheduled')}><CalendarClock size={13} /> Có lịch gọi lại</button>
                  <button type="button" className={activityFilter === 'linked' ? 'active' : ''} onClick={() => setActivityFilter('linked')}><Target size={13} /> Có cơ hội</button>
                </div>
              </div>
              {visibleCalls.length > 0 ? (
                <div className="activity-list">
                  {visibleCalls.slice(0, showAllCalls ? visibleCalls.length : 6).map((call) => {
                    const customer = demoCustomers.find((item) => item.id === call.customerId) ?? { initials: call.customerName?.slice(0, 2) ?? 'KH', color: 'violet' };
                    const meta = getOutcomeMeta(call.outcome);
                    const Icon = outcomeIcons[call.outcome] ?? Phone;
                    const callbackHint = getCallbackHint(call.callbackAt);
                    return (
                      <article className="activity-item" key={call.id}>
                        <div className={`activity-outcome-icon tone-${call.outcome}`}><Icon size={16} /></div>
                        <div className="activity-main">
                          <div className="activity-title-row"><strong>{call.customerName}</strong><span className="activity-time">{formatTime(call.createdAt)}</span></div>
                          <div className="activity-company">{call.company}</div>
                          <div className="activity-result"><span className={`result-dot result-${call.outcome}`} />{call.outcomeLabel}</div>
                          {call.note && <p className="activity-note">{call.note}</p>}
                          {call.opportunityName && <div className="linked-opportunity-line"><Target size={12} /><span>{call.opportunityName}</span></div>}
                          {call.callbackAt && <div className={`callback-reminder ${callbackHint?.className ?? ''}`}><CalendarClock size={12} /><span>{formatDateTime(call.callbackAt)}</span><b>{callbackHint?.label}</b></div>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-activity"><Search size={21} /><strong>Không tìm thấy cuộc gọi</strong><span>Thử từ khóa hoặc bộ lọc khác nhé.</span><button type="button" onClick={() => { setSearch(''); setActivityFilter('all'); }}>Xóa bộ lọc</button></div>
              )}
              {visibleCalls.length > 6 && <button className="view-all-button" type="button" onClick={() => setShowAllCalls((current) => !current)}>{showAllCalls ? 'Thu gọn danh sách' : `Xem tất cả ${visibleCalls.length} hoạt động`} <ArrowUpRight size={14} /></button>}
            </section>
          </aside>
        </div>

        <footer className="page-footer"><span>© 2026 Pulse CRM</span><span><span className="footer-green-dot" /> Dữ liệu được lưu trên thiết bị của bạn</span><span>CSR104 · Ghi nhanh cuộc gọi</span></footer>
      </main>

      {toast && <div className={`toast toast-${toast.type}`} role="status"><span className="toast-icon">{toast.type === 'success' ? <CheckCircle2 size={19} /> : <Bell size={18} />}</span><span>{toast.message}</span><button type="button" aria-label="Đóng thông báo" onClick={() => setToast(null)}><X size={16} /></button></div>}
    </div>
  );
}

export default App;
