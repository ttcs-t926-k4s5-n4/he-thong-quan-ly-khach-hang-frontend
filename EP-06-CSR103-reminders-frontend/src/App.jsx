import { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlertCircle, AlertTriangle, Bell, BellRing, CalendarClock, CalendarDays,
  Check, CheckCheck, CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, FileText,
  Filter, Flag, LayoutDashboard, ListTodo, Menu, MoreHorizontal, Plus, Search, Settings2,
  ShieldCheck, SlidersHorizontal, Sparkles, Target, Users, X, Zap,
} from 'lucide-react'
import { createSeedTasks, DEFAULT_SETTINGS, USERS } from './data/seed.js'
import { countOverdueByMember, dayDifference, filterTasks, getPersonalTasks, getReminderKind, isOverdue, sortTasks, toggleReminderDay, validateTask } from './utils/reminders.js'
import './styles.css'

const TASKS_KEY = 'csr103_tasks_v1'
const SETTINGS_KEY = 'csr103_settings_v1'
const USER_KEY = 'csr103_current_user_v1'

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function formatDate(value, options = {}) {
  if (!value) return 'Chưa đặt hạn'
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', ...options }).format(new Date(`${value}T12:00:00`))
}

function formatFullDate(value) {
  if (!value) return 'Chưa đặt hạn'
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
}

function formatToday() {
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())
}

function relativeDue(task) {
  const diff = dayDifference(task.dueDate)
  if (task.completed) return 'Đã hoàn thành'
  if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`
  if (diff === 0) return 'Hạn hôm nay'
  if (diff === 1) return 'Còn 1 ngày'
  return `Còn ${diff} ngày`
}

function getUser(id) {
  return USERS.find((user) => user.id === id) || USERS[0]
}

function Avatar({ user, size = 'normal' }) {
  return <span className={`avatar avatar-${user.color} avatar-${size}`}>{user.initials}</span>
}

function App() {
  const [tasks, setTasks] = useState(() => readStored(TASKS_KEY, createSeedTasks()))
  const [settings, setSettings] = useState(() => readStored(SETTINGS_KEY, DEFAULT_SETTINGS))
  const [currentUserId, setCurrentUserId] = useState(() => readStored(USER_KEY, 'minh'))
  const [page, setPage] = useState('reminders')
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [showOnlyMine, setShowOnlyMine] = useState(false)

  const currentUser = getUser(currentUserId)
  const isManager = currentUser.id === 'lan'

  useEffect(() => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)), [tasks])
  useEffect(() => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)), [settings])
  useEffect(() => localStorage.setItem(USER_KEY, JSON.stringify(currentUserId)), [currentUserId])
  useEffect(() => {
    const handleSettingsUpdated = (event) => {
      setSettings(event.detail)
      setToast('Đã lưu cấu hình nhắc việc')
    }
    window.addEventListener('csr103-settings-updated', handleSettingsUpdated)
    return () => window.removeEventListener('csr103-settings-updated', handleSettingsUpdated)
  }, [])
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const overdueTasks = useMemo(() => {
    const visible = isManager ? tasks : getPersonalTasks(tasks, currentUserId)
    return visible.filter((task) => isOverdue(task))
  }, [tasks, currentUserId, isManager])
  const upcomingReminders = useMemo(() => {
    const visible = isManager ? tasks : getPersonalTasks(tasks, currentUserId)
    return visible.filter((task) => ['today', 'upcoming'].includes(getReminderKind(task, settings)))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [tasks, currentUserId, isManager, settings])
  const allVisibleTasks = useMemo(() => {
    const list = isManager ? tasks : getPersonalTasks(tasks, currentUserId)
    return sortTasks(filterTasks(list, {
      query,
      status: statusFilter,
      assigneeId: isManager && showOnlyMine ? currentUserId : '',
      maxDays: Math.max(7, ...settings.reminderDays, 0),
    }), sortBy)
  }, [tasks, currentUserId, isManager, query, statusFilter, sortBy, settings.reminderDays, showOnlyMine])
  const completedCount = (isManager ? tasks : getPersonalTasks(tasks, currentUserId)).filter((task) => task.completed).length
  const teamStats = useMemo(() => countOverdueByMember(tasks, USERS.filter((user) => user.id !== 'lan')), [tasks])
  const totalTeamOverdue = teamStats.reduce((sum, item) => sum + item.overdueCount, 0)

  const changeSettings = (next) => {
    setSettings((previous) => ({ ...previous, ...next }))
    setToast('Đã lưu cấu hình nhắc việc')
  }

  const handleComplete = (task) => {
    setTasks((previous) => previous.map((item) => item.id === task.id ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : null } : item))
    setToast(task.completed ? 'Đã mở lại công việc' : 'Tuyệt vời! Công việc đã hoàn thành')
  }

  const handleCreateTask = (draft) => {
    const errors = validateTask(draft)
    if (Object.keys(errors).length) return errors
    const task = {
      ...draft,
      id: `task-${Date.now()}`,
      customer: draft.customer?.trim() || 'Khách hàng mới',
      deal: draft.deal?.trim() || 'Cơ hội chưa phân loại',
      description: draft.description?.trim() || '',
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((previous) => [task, ...previous])
    setShowCreate(false)
    setStatusFilter('all')
    setQuery('')
    setToast('Đã tạo công việc mới')
    return {}
  }

  const changePage = (nextPage) => {
    setPage(nextPage)
    setMobileNavOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Zap size={21} fill="currentColor" /></div>
          <div><div className="brand-name">sales<span>desk</span></div><div className="brand-caption">WORKSPACE</div></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileNavOpen(false)} aria-label="Đóng menu"><X size={18} /></button>
        </div>
        <div className="workspace-switch"><span className="workspace-icon"><Target size={17} /></span><span className="workspace-text"><b>Đội ngũ kinh doanh</b><small>Không gian làm việc</small></span><ChevronDown size={15} /></div>
        <div className="nav-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="primary-nav" aria-label="Điều hướng chính">
          <NavItem icon={<LayoutDashboard size={18} />} label="Tổng quan cá nhân" active={page === 'home'} onClick={() => changePage('home')} />
          <NavItem icon={<ListTodo size={18} />} label="Công việc của tôi" active={page === 'tasks'} onClick={() => changePage('tasks')} />
          <NavItem icon={<BellRing size={18} />} label="Nhắc việc" active={page === 'reminders'} onClick={() => changePage('reminders')} count={overdueTasks.length} />
          {isManager && <NavItem icon={<Users size={18} />} label="Tình hình đội nhóm" active={page === 'team'} onClick={() => changePage('team')} />}
        </nav>
        <div className="nav-label second-label">CÁ NHÂN</div>
        <div className="sidebar-mini-card">
          <div className="mini-card-icon"><CalendarClock size={17} /></div>
          <div><strong>{overdueTasks.length} việc quá hạn</strong><p>{overdueTasks.length ? 'Cần ưu tiên xử lý hôm nay' : 'Bạn đang bắt nhịp tốt!'}</p></div>
        </div>
        <div className="sidebar-bottom">
          <div className="help-row"><CircleHelp size={17} /><span>Trung tâm trợ giúp</span><MoreHorizontal size={17} /></div>
          <div className="signed-user"><Avatar user={currentUser} /><div className="signed-user-text"><strong>{currentUser.name}</strong><span>{currentUser.role}</span></div><ChevronDown size={15} /></div>
        </div>
      </aside>
      {mobileNavOpen && <button className="nav-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Đóng menu" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Mở menu"><Menu size={20} /></button><span className="breadcrumb-muted">Không gian làm việc</span><span className="breadcrumb-slash">/</span><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <div className="search-global"><Search size={16} /><input aria-label="Tìm công việc" placeholder="Tìm công việc, khách hàng..." value={query} onChange={(event) => { setQuery(event.target.value); if (page === 'home') setPage('tasks') }} /><kbd><Command size={10} /> K</kbd></div>
            <button className={`top-icon ${overdueTasks.length ? 'has-alert' : ''}`} aria-label="Thông báo" onClick={() => changePage('reminders')}><Bell size={19} />{overdueTasks.length > 0 && <i />}</button>
            <div className="profile-switch"><Avatar user={currentUser} size="small"/><select aria-label="Mô phỏng người dùng" value={currentUserId} onChange={(event) => { setCurrentUserId(event.target.value); setToast(`Đang xem với vai trò ${getUser(event.target.value).shortName}`) }}>{USERS.filter((user) => ['minh', 'lan', 'huy', 'ha', 'an'].includes(user.id)).map((user) => <option key={user.id} value={user.id}>{user.shortName} · {user.id === 'lan' ? 'Trưởng nhóm' : 'Nhân viên'}</option>)}</select><ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-content">
          {page === 'home' && <DashboardPage currentUser={currentUser} isManager={isManager} tasks={isManager ? tasks : getPersonalTasks(tasks, currentUserId)} overdueTasks={overdueTasks} upcomingReminders={upcomingReminders} teamStats={teamStats} settings={settings} onGoTasks={() => changePage('tasks')} onGoReminders={() => changePage('reminders')} onComplete={handleComplete} onCreate={() => setShowCreate(true)} />}
          {page === 'reminders' && <RemindersPage currentUser={currentUser} isManager={isManager} overdueTasks={overdueTasks} upcomingReminders={upcomingReminders} tasks={isManager ? tasks : getPersonalTasks(tasks, currentUserId)} settings={settings} teamStats={teamStats} onGoTasks={() => changePage('tasks')} onComplete={handleComplete} onCreate={() => setShowCreate(true)} />}
          {page === 'tasks' && <TasksPage tasks={allVisibleTasks} allCount={(isManager ? tasks : getPersonalTasks(tasks, currentUserId)).length} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortBy={sortBy} setSortBy={setSortBy} isManager={isManager} showOnlyMine={showOnlyMine} setShowOnlyMine={setShowOnlyMine} currentUser={currentUser} onComplete={handleComplete} onCreate={() => setShowCreate(true)} />}
          {page === 'team' && (isManager ? <TeamPage teamStats={teamStats} tasks={tasks} onGoTasks={() => { setStatusFilter('overdue'); setShowOnlyMine(false); changePage('tasks') }} /> : <NoTeamAccess onGoHome={() => changePage('home')} />)}
        </div>
        <footer className="app-footer"><span>© 2026 SalesDesk</span><span><span className="status-dot" /> Dữ liệu được lưu trên thiết bị của bạn</span><span>EP-06 · CSR103</span></footer>
      </main>

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onSave={handleCreateTask} currentUserId={currentUserId} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')} aria-label="Đóng thông báo"><X size={15} /></button></div>}
    </div>
  )
}

function NoTeamAccess({ onGoHome }) {
  return <section className="panel no-access-panel"><div className="no-access-icon"><ShieldCheck size={25} /></div><h2>Khu vực dành cho trưởng nhóm</h2><p>Thống kê việc quá hạn theo từng thành viên chỉ hiển thị khi đăng nhập bằng vai trò trưởng nhóm.</p><button className="button button-primary" onClick={onGoHome}>Quay về trang cá nhân</button></section>
}

function pageTitle(page) {
  return ({ home: 'Tổng quan cá nhân', tasks: 'Công việc của tôi', reminders: 'Nhắc việc', team: 'Tình hình đội nhóm' })[page] || 'Nhắc việc'
}

function NavItem({ icon, label, active, onClick, count }) {
  return <button className={`nav-item ${active ? 'nav-item-active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{count > 0 && <span className="nav-count">{count}</span>}</button>
}

function PageHeading({ eyebrow = 'TRUNG TÂM NHẮC VIỆC', title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow"><Sparkles size={13} />{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function StatCard({ icon, label, value, caption, tone, onClick }) {
  return <button className={`stat-card stat-${tone}`} onClick={onClick}><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-caption">{caption}</span><span className="stat-arrow">↗</span></button>
}

function DashboardPage({ currentUser, isManager, tasks, overdueTasks, upcomingReminders, teamStats, settings, onGoTasks, onGoReminders, onComplete, onCreate }) {
  const openTasks = tasks.filter((task) => !task.completed)
  return <>
    <PageHeading title={`Chào ${currentUser.shortName}, hôm nay thế nào?`} description={`${formatToday()} · Đây là những việc cần bạn lưu tâm.`} action={<button className="button button-primary" onClick={onCreate}><Plus size={17} /> Tạo công việc</button>} />
    {settings.showOverdueOnHome && overdueTasks.length > 0 ? <div className="overdue-hero"><div className="overdue-hero-icon"><AlertTriangle size={24} /></div><div className="overdue-hero-copy"><span className="overdue-kicker">CẦN CHÚ Ý NGAY</span><h2>Bạn có {overdueTasks.length} công việc đang quá hạn</h2><p>Hãy ưu tiên xử lý để không làm chậm tiến độ thương vụ.</p></div><button className="button button-light-red" onClick={onGoReminders}>Xem việc quá hạn <span>→</span></button><div className="hero-decoration" /></div> : <div className="clear-hero"><div className="clear-icon"><CheckCheck size={22} /></div><div><h2>{overdueTasks.length ? 'Đã ẩn cảnh báo quá hạn trên trang cá nhân' : 'Bạn đang kiểm soát tiến độ rất tốt!'}</h2><p>{overdueTasks.length ? 'Bật lại mục hiển thị việc quá hạn trong phần cấu hình nhắc việc.' : 'Khi có việc gần đến hạn, nhắc việc sẽ xuất hiện ở đây.'}</p></div></div>}
    <div className="stat-grid">
      <StatCard icon={<AlertCircle size={20} />} label="Việc quá hạn" value={overdueTasks.length} caption={overdueTasks.length ? 'Cần được xử lý' : 'Không có việc tồn'} tone="red" onClick={onGoReminders} />
      <StatCard icon={<BellRing size={20} />} label="Nhắc trong hôm nay" value={upcomingReminders.filter((task) => dayDifference(task.dueDate) === 0).length} caption="Đến hạn hôm nay" tone="purple" onClick={onGoReminders} />
      <StatCard icon={<CalendarClock size={20} />} label="Sắp đến hạn" value={upcomingReminders.filter((task) => dayDifference(task.dueDate) > 0).length} caption="Theo mốc nhắc đã chọn" tone="blue" onClick={onGoReminders} />
      <StatCard icon={<CheckCircle2 size={20} />} label="Việc đã hoàn thành" value={tasks.filter((task) => task.completed).length} caption={`Trong ${tasks.length} công việc`} tone="green" onClick={onGoTasks} />
    </div>
    <div className="dashboard-columns">
      <section className="panel task-preview-panel"><div className="panel-heading"><div><h2>Ưu tiên xử lý</h2><p>Các đầu việc cần được chú ý trước</p></div><button className="text-button" onClick={onGoTasks}>Tất cả công việc <span>→</span></button></div>
        {overdueTasks.length ? <div className="preview-list">{overdueTasks.slice(0, 3).map((task) => <TaskRow key={task.id} task={task} compact onComplete={onComplete} />)}</div> : <EmptyState icon={<CheckCheck size={24} />} title="Không có công việc quá hạn" text="Bạn đã theo sát các mốc công việc của mình." />}
        {upcomingReminders.length > 0 && <><div className="panel-subheading"><span>NHẮC SẮP ĐẾN HẠN</span><button className="text-button" onClick={onGoReminders}>Xem tất cả</button></div><div className="preview-list">{upcomingReminders.slice(0, 3).map((task) => <TaskRow key={task.id} task={task} compact onComplete={onComplete} />)}</div></>}
      </section>
      <section className="panel personal-insight"><div className="panel-heading"><div><h2>{isManager ? 'Sức khỏe đội nhóm' : 'Nhịp làm việc'}</h2><p>{isManager ? 'Tình hình việc quá hạn của nhân viên' : 'Tổng quan đầu việc cá nhân'}</p></div><span className="insight-icon"><Activity size={18} /></span></div>
        {isManager ? <><div className="team-mini-total"><strong>{teamStats.reduce((sum, item) => sum + item.overdueCount, 0)}</strong><span>việc quá hạn<br />trong đội</span></div><div className="mini-member-list">{teamStats.slice(0, 4).map((member) => <div className="mini-member" key={member.id}><Avatar user={member} size="small"/><span>{member.shortName}</span><div className="mini-track"><i style={{ width: `${Math.min(100, member.overdueCount * 34)}%` }} /></div><b className={member.overdueCount ? 'text-danger' : ''}>{member.overdueCount}</b></div>)}</div></> : <><div className="completion-visual"><div className="completion-ring" style={{ '--completion': `${tasks.length ? Math.round(tasks.filter((task) => task.completed).length / tasks.length * 100) : 0}%` }}><div><strong>{tasks.length ? Math.round(tasks.filter((task) => task.completed).length / tasks.length * 100) : 0}%</strong><span>hoàn thành</span></div></div><div className="completion-details"><div><span className="legend-dot legend-done" />Đã hoàn thành <b>{tasks.filter((task) => task.completed).length}</b></div><div><span className="legend-dot legend-open" />Đang thực hiện <b>{openTasks.length}</b></div><div><span className="legend-dot legend-late" />Quá hạn <b>{overdueTasks.length}</b></div></div></div><div className="insight-tip"><Sparkles size={16} /><span>Mẹo nhỏ: dành 10 phút đầu ngày để xử lý việc quá hạn trước khi bắt đầu các thương vụ mới.</span></div></>}
      </section>
    </div>
  </>
}

function RemindersPage({ currentUser, isManager, overdueTasks, upcomingReminders, tasks, settings, teamStats, onGoTasks, onComplete, onCreate }) {
  const reminderTasks = [...overdueTasks, ...upcomingReminders.filter((task) => !isOverdue(task))]
  return <>
    <PageHeading title="Nhắc việc của bạn" description={isManager ? 'Theo dõi các mốc cần xử lý trong đội kinh doanh.' : 'Theo dõi việc sắp đến hạn và xử lý việc quá hạn kịp thời.'} action={<button className="button button-primary" onClick={onCreate}><Plus size={17} /> Tạo công việc</button>} />
    <div className="reminder-summary-strip"><div className="strip-item"><span className="strip-icon strip-red"><AlertTriangle size={18} /></span><div><strong>{overdueTasks.length}</strong><span>Đang quá hạn</span></div></div><div className="strip-divider"/><div className="strip-item"><span className="strip-icon strip-purple"><BellRing size={18} /></span><div><strong>{upcomingReminders.filter((task) => dayDifference(task.dueDate) === 0).length}</strong><span>Đến hạn hôm nay</span></div></div><div className="strip-divider"/><div className="strip-item"><span className="strip-icon strip-blue"><CalendarDays size={18} /></span><div><strong>{upcomingReminders.filter((task) => dayDifference(task.dueDate) > 0).length}</strong><span>Sắp đến hạn</span></div></div><div className="strip-context"><span className="status-dot"/> Nhắc việc {settings.enabled ? 'đang bật' : 'đang tắt'}</div></div>
    <div className="reminders-layout">
      <div className="reminder-main-column">
        {overdueTasks.length > 0 && <section className="reminder-section"><div className="section-heading"><div className="section-symbol section-symbol-red"><AlertTriangle size={18} /></div><div><h2>Đã quá hạn <span className="count-pill count-red">{overdueTasks.length}</span></h2><p>Hãy xử lý hoặc cập nhật lại lịch cho các việc này.</p></div></div><div className="task-card-list">{overdueTasks.map((task) => <TaskRow key={task.id} task={task} onComplete={onComplete} />)}</div></section>}
        <section className="reminder-section"><div className="section-heading"><div className="section-symbol section-symbol-purple"><BellRing size={18} /></div><div><h2>Sắp đến hạn <span className="count-pill count-purple">{upcomingReminders.length}</span></h2><p>Những mốc việc nằm trong cấu hình nhắc của bạn.</p></div></div>
          {upcomingReminders.length ? <div className="task-card-list">{upcomingReminders.map((task) => <TaskRow key={task.id} task={task} onComplete={onComplete} />)}</div> : <EmptyState icon={<Bell size={23} />} title="Chưa có nhắc việc mới" text="Khi công việc gần đến mốc đã cấu hình, nhắc việc sẽ xuất hiện ở đây." />}
        </section>
        {!overdueTasks.length && !upcomingReminders.length && <div className="all-clear-card"><div className="all-clear-icon"><CheckCheck size={25} /></div><h2>Không có việc cần nhắc lúc này</h2><p>Bạn đã cập nhật tiến độ. Hãy tiếp tục giữ nhịp làm việc nhé!</p><button className="button button-secondary" onClick={onGoTasks}>Xem toàn bộ công việc</button></div>}
      </div>
      <aside className="reminders-side-column">
        <ReminderSettings settings={settings} />
        {isManager && <TeamOverdueCard teamStats={teamStats} />}
        <div className="quick-tip-card"><div className="tip-header"><span><Sparkles size={16} /></span><strong>Mẹo quản lý thời gian</strong></div><p>Chia công việc lớn thành các đầu việc nhỏ có hạn cụ thể. Nhắc việc ngắn hạn giúp bạn không bỏ lỡ các bước quan trọng trong quy trình bán hàng.</p></div>
        <button className="side-link-button" onClick={onGoTasks}><ListTodo size={17} /> Xem toàn bộ {tasks.length} công việc <span>→</span></button>
      </aside>
    </div>
  </>
}

function ReminderSettings({ settings }) {
  const [expanded, setExpanded] = useState(true)
  const [localSettings, setLocalSettings] = useState(settings)
  const [saved, setSaved] = useState(false)
  useEffect(() => setLocalSettings(settings), [settings])
  const update = (next) => {
    const updated = { ...localSettings, ...next }
    setLocalSettings(updated)
    setSaved(false)
  }
  const save = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(localSettings))
    window.dispatchEvent(new CustomEvent('csr103-settings-updated', { detail: localSettings }))
    setSaved(true)
  }
  return <section className="panel settings-panel"><button className="panel-heading settings-heading" onClick={() => setExpanded((value) => !value)}><div className="settings-title-icon"><Settings2 size={18} /></div><div className="settings-heading-copy"><h2>Cấu hình nhắc việc</h2><p>Tùy chỉnh thời điểm nhận nhắc</p></div><ChevronDown size={17} className={expanded ? '' : 'rotate-left'} /></button>
    {expanded && <div className="settings-body"><div className="setting-row setting-main-toggle"><div><strong>Nhắc việc trong ứng dụng</strong><span>Hiển thị việc sắp đến hạn</span></div><Toggle checked={localSettings.enabled} onChange={(checked) => update({ enabled: checked })} label="Bật nhắc việc" /></div>
      <div className={`setting-block ${!localSettings.enabled ? 'setting-disabled' : ''}`}><div className="setting-label">Nhắc trước hạn</div><p className="setting-hint">Chọn các mốc bạn muốn được nhắc.</p><div className="reminder-day-options">{[{ day: 7, label: '7 ngày trước' }, { day: 3, label: '3 ngày trước' }, { day: 1, label: '1 ngày trước' }].map(({ day, label }) => <button key={day} disabled={!localSettings.enabled} className={`day-option ${localSettings.reminderDays.includes(day) ? 'day-option-selected' : ''}`} onClick={() => update({ reminderDays: toggleReminderDay(localSettings.reminderDays, day) })}>{localSettings.reminderDays.includes(day) && <Check size={13} />}{label}</button>)}</div><div className="setting-row due-today-row"><div><strong>Nhắc vào đúng ngày hạn</strong><span>Thông báo khi việc đến hạn hôm nay</span></div><Toggle checked={localSettings.remindOnDueDate} onChange={(checked) => update({ remindOnDueDate: checked })} label="Nhắc ngày đến hạn" disabled={!localSettings.enabled} /></div></div>
      <div className="setting-row home-toggle"><div><strong>Hiện việc quá hạn ở trang cá nhân</strong><span>Đưa cảnh báo lên đầu trang tổng quan</span></div><Toggle checked={localSettings.showOverdueOnHome} onChange={(checked) => update({ showOverdueOnHome: checked })} label="Hiện việc quá hạn" /></div>
      <button className="button button-primary button-full" onClick={save}>{saved ? <><Check size={16} /> Đã lưu cấu hình</> : 'Lưu cấu hình'}</button>
      <p className="setting-footnote"><ShieldCheck size={13} /> Cấu hình được lưu trên trình duyệt này.</p>
    </div>}
  </section>
}

function Toggle({ checked, onChange, label, disabled = false }) {
  return <button role="switch" aria-checked={checked} aria-label={label} disabled={disabled} className={`toggle ${checked ? 'toggle-on' : ''}`} onClick={() => onChange(!checked)}><span /></button>
}

function TeamOverdueCard({ teamStats = [] }) {
  const [show, setShow] = useState(true)
  return <section className="panel team-overdue-card"><button className="panel-heading team-card-heading" onClick={() => setShow((value) => !value)}><div><h2>Quá hạn theo thành viên</h2><p>Tổng hợp dành cho trưởng nhóm</p></div><ChevronDown size={16} className={show ? '' : 'rotate-left'} /></button>{show && <div className="team-overdue-list">{teamStats.map((user) => <div key={user.id} className="team-overdue-member"><Avatar user={user} size="small"/><div className="member-overdue-info"><strong>{user.name}</strong><span>{user.totalOpen} việc đang mở</span></div><span className={`member-overdue-count ${user.overdueCount ? 'member-count-alert' : ''}`}>{user.overdueCount}</span></div>)}<div className="team-card-foot"><Users size={14} /> Số lượng việc quá hạn cập nhật theo dữ liệu hiện có</div></div>}</section>
}

function TasksPage({ tasks, allCount, query, setQuery, statusFilter, setStatusFilter, sortBy, setSortBy, isManager, showOnlyMine, setShowOnlyMine, currentUser, onComplete, onCreate }) {
  const options = [{ value: 'all', label: 'Tất cả' }, { value: 'overdue', label: 'Quá hạn' }, { value: 'today', label: 'Hôm nay' }, { value: 'upcoming', label: 'Sắp đến hạn' }, { value: 'completed', label: 'Đã hoàn thành' }]
  return <>
    <PageHeading title="Công việc của tôi" description="Sắp xếp đầu việc, cập nhật tiến độ và theo dõi hạn hoàn thành." action={<button className="button button-primary" onClick={onCreate}><Plus size={17} /> Tạo công việc</button>} />
    <div className="task-toolbar panel"><div className="task-search"><Search size={17} /><input aria-label="Tìm trong công việc" placeholder="Tìm tên việc, cơ hội hoặc khách hàng..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm"><X size={14} /></button>}</div><div className="toolbar-right"><label className="select-wrap"><SlidersHorizontal size={15} /><select aria-label="Sắp xếp công việc" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="dueDate">Hạn gần nhất</option><option value="priority">Mức ưu tiên</option><option value="title">Tên công việc</option></select><ChevronDown size={14} /></label>{isManager && <label className="manager-scope"><input type="checkbox" checked={!showOnlyMine} onChange={(event) => setShowOnlyMine(!event.target.checked)} /> Toàn đội</label>}</div></div>
    <div className="task-filter-tabs" role="tablist" aria-label="Lọc trạng thái">{options.map((option) => <button key={option.value} role="tab" aria-selected={statusFilter === option.value} className={statusFilter === option.value ? 'filter-tab-active' : ''} onClick={() => setStatusFilter(option.value)}>{option.label}{option.value === 'overdue' && <span className="tab-small-count">{tasks.filter((task) => isOverdue(task)).length}</span>}</button>)}</div>
    <div className="panel tasks-table-panel"><div className="table-panel-heading"><div><h2>Danh sách công việc</h2><p>Hiển thị {tasks.length} trong số {allCount} công việc {isManager && !showOnlyMine ? 'của đội nhóm' : `của ${currentUser.shortName}`}</p></div><div className="table-heading-icon"><Filter size={16} /></div></div>
      {tasks.length ? <div className="tasks-table-wrap"><table className="tasks-table"><thead><tr><th>CÔNG VIỆC</th><th>HẠN HOÀN THÀNH</th><th>ƯU TIÊN</th><th>NGƯỜI PHỤ TRÁCH</th><th>TRẠNG THÁI</th><th></th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className={isOverdue(task) ? 'table-row-overdue' : ''}><td><div className="table-task-name"><button className={`complete-circle ${task.completed ? 'complete-circle-done' : ''}`} onClick={() => onComplete(task)} aria-label={task.completed ? 'Mở lại công việc' : 'Đánh dấu hoàn thành'}>{task.completed && <Check size={13} />}</button><div><strong>{task.title}</strong><span>{task.customer} · {task.deal}</span></div></div></td><td><div className={`table-due ${isOverdue(task) ? 'due-red' : ''}`}>{formatDate(task.dueDate, { year: 'numeric' })}<span>{relativeDue(task)}</span></div></td><td><PriorityPill priority={task.priority} /></td><td><div className="assignee-cell"><Avatar user={getUser(task.assigneeId)} size="small"/><span>{getUser(task.assigneeId).shortName}</span></div></td><td><TaskStatus task={task} /></td><td><button className="icon-button table-more" title="Đánh dấu hoàn thành" onClick={() => onComplete(task)}>{task.completed ? <CheckCheck size={17} /> : <Check size={17} />}</button></td></tr>)}</tbody></table></div> : <EmptyState icon={<Search size={22} />} title="Không tìm thấy công việc phù hợp" text="Thử thay đổi từ khóa hoặc bộ lọc trạng thái." />}
    </div>
  </>
}

function TeamPage({ teamStats, tasks, onGoTasks }) {
  const total = teamStats.reduce((sum, member) => sum + member.overdueCount, 0)
  return <>
    <PageHeading eyebrow="TỔNG QUAN QUẢN LÝ" title="Sức khỏe công việc đội nhóm" description="Phát hiện sớm các đầu việc bị trễ để hỗ trợ thành viên kịp thời." action={<button className="button button-primary" onClick={onGoTasks}><ListTodo size={17} /> Xem danh sách việc</button>} />
    <div className="team-hero"><div className="team-hero-pattern"/><div><span className="team-hero-label"><Users size={14}/> TEAM PULSE</span><h2>{total ? `${total} đầu việc đang cần chú ý` : 'Đội nhóm đang đúng tiến độ'}</h2><p>{total ? 'Chủ động trao đổi với người phụ trách để thống nhất bước xử lý tiếp theo.' : 'Hiện chưa có đầu việc quá hạn theo dữ liệu đang lưu.'}</p></div><div className="team-hero-number"><strong>{total}</strong><span>việc quá hạn</span></div></div>
    <div className="team-stats-grid">{teamStats.map((member) => <section className="panel team-member-card" key={member.id}><div className="team-member-top"><Avatar user={member}/><div><h3>{member.name}</h3><p>{member.role}</p></div><span className={`member-overdue-count ${member.overdueCount ? 'member-count-alert' : ''}`}>{member.overdueCount}</span></div><div className="member-card-stats"><div><span>Việc đang mở</span><strong>{member.totalOpen}</strong></div><div><span>Quá hạn</span><strong className={member.overdueCount ? 'text-danger' : ''}>{member.overdueCount}</strong></div></div><div className="member-progress-track"><i style={{ width: `${member.totalOpen ? Math.min(100, member.overdueCount / member.totalOpen * 100) : 0}%` }}/></div><p className="member-card-foot">{member.overdueCount ? 'Cần trao đổi về tiến độ' : 'Không có việc quá hạn'}</p></section>)}</div>
    <section className="panel team-detail-panel"><div className="panel-heading"><div><h2>Phân bổ việc quá hạn</h2><p>Thống kê theo người phụ trách hiện tại</p></div><span className="detail-total">{tasks.filter((task) => isOverdue(task)).length} việc</span></div><div className="team-bars">{teamStats.map((member) => <div className="team-bar-row" key={member.id}><div className="team-bar-user"><Avatar user={member} size="small"/><span>{member.shortName}</span></div><div className="team-bar-track"><i style={{ width: `${Math.max(member.overdueCount ? 8 : 0, total ? member.overdueCount / Math.max(...teamStats.map((item) => item.overdueCount), 1) * 100 : 0)}%` }}/></div><strong>{member.overdueCount}</strong></div>)}</div></section>
  </>
}

function TaskRow({ task, onComplete, compact = false }) {
  const overdue = isOverdue(task)
  const diff = dayDifference(task.dueDate)
  return <article className={`task-row ${overdue ? 'task-row-overdue' : ''} ${task.completed ? 'task-row-completed' : ''} ${compact ? 'task-row-compact' : ''}`}>
    <button className={`complete-circle ${task.completed ? 'complete-circle-done' : ''}`} onClick={() => onComplete(task)} aria-label={task.completed ? 'Mở lại công việc' : 'Đánh dấu hoàn thành'}>{task.completed && <Check size={13} />}</button>
    <div className="task-row-main"><div className="task-row-title-line"><h3>{task.title}</h3><PriorityPill priority={task.priority} /></div><div className="task-meta-line"><span><Target size={13}/>{task.deal}</span><span><Users size={13}/>{task.customer}</span></div>{!compact && task.description && <p className="task-row-description">{task.description}</p>}</div>
    <div className="task-row-due"><span className={`due-date ${overdue ? 'due-date-overdue' : diff === 0 ? 'due-date-today' : ''}`}><CalendarDays size={14}/>{formatDate(task.dueDate, { year: 'numeric' })}</span><span className={`due-relative ${overdue ? 'due-relative-overdue' : diff === 0 ? 'due-relative-today' : ''}`}>{relativeDue(task)}</span></div>
    {!compact && <button className="icon-button task-row-more" aria-label="Đánh dấu hoàn thành" title={task.completed ? 'Mở lại công việc' : 'Đánh dấu hoàn thành'} onClick={() => onComplete(task)}>{task.completed ? <CheckCheck size={17} /> : <Check size={17}/>}</button>}
  </article>
}

function PriorityPill({ priority }) {
  const labels = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' }
  return <span className={`priority-pill priority-${priority}`}><i />{labels[priority] || 'Trung bình'}</span>
}

function TaskStatus({ task }) {
  if (task.completed) return <span className="status-pill status-completed"><CheckCircle2 size={13}/>Hoàn thành</span>
  if (isOverdue(task)) return <span className="status-pill status-overdue"><AlertCircle size={13}/>Quá hạn</span>
  if (dayDifference(task.dueDate) === 0) return <span className="status-pill status-today"><Clock3 size={13}/>Hôm nay</span>
  return <span className="status-pill status-progress"><Activity size={13}/>Đang mở</span>
}

function EmptyState({ icon, title, text }) {
  return <div className="empty-state"><div className="empty-state-icon">{icon}</div><strong>{title}</strong><p>{text}</p></div>
}

function CreateTaskModal({ onClose, onSave, currentUserId }) {
  const [draft, setDraft] = useState({ title: '', deal: '', customer: '', dueDate: '', assigneeId: currentUserId, priority: 'medium', type: 'task', description: '' })
  const [errors, setErrors] = useState({})
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    const found = onSave(draft)
    setErrors(found || {})
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><form className="task-modal" onSubmit={submit} noValidate><div className="modal-heading"><div><span className="modal-eyebrow">THÊM ĐẦU VIỆC MỚI</span><h2>Tạo công việc</h2><p>Đặt hạn rõ ràng để nhắc việc có thể theo dõi đúng lúc.</p></div><button type="button" className="icon-button" aria-label="Đóng" onClick={onClose}><X size={19}/></button></div>
    <div className="modal-form-grid"><label className="form-field field-full"><span>Tên công việc <b>*</b></span><input autoFocus value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="Ví dụ: Gửi báo giá cho khách hàng" />{errors.title && <small className="field-error">{errors.title}</small>}</label>
      <label className="form-field"><span>Ngày đến hạn <b>*</b></span><input type="date" value={draft.dueDate} onChange={(event) => update('dueDate', event.target.value)} />{errors.dueDate && <small className="field-error">{errors.dueDate}</small>}</label>
      <label className="form-field"><span>Người phụ trách <b>*</b></span><select value={draft.assigneeId} onChange={(event) => update('assigneeId', event.target.value)}>{USERS.filter((user) => user.id !== 'lan').map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>{errors.assigneeId && <small className="field-error">{errors.assigneeId}</small>}</label>
      <label className="form-field"><span>Tên cơ hội</span><input value={draft.deal} onChange={(event) => update('deal', event.target.value)} placeholder="Tên thương vụ liên quan" /></label>
      <label className="form-field"><span>Khách hàng</span><input value={draft.customer} onChange={(event) => update('customer', event.target.value)} placeholder="Tên công ty / khách hàng" /></label>
      <label className="form-field"><span>Mức ưu tiên</span><select value={draft.priority} onChange={(event) => update('priority', event.target.value)}><option value="high">Cao</option><option value="medium">Trung bình</option><option value="low">Thấp</option></select></label>
      <label className="form-field"><span>Loại công việc</span><select value={draft.type} onChange={(event) => update('type', event.target.value)}><option value="task">Công việc</option><option value="call">Cuộc gọi</option><option value="meeting">Cuộc họp</option><option value="email">Email</option><option value="document">Tài liệu</option></select></label>
      <label className="form-field field-full"><span>Mô tả</span><textarea rows="3" value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="Ghi chú ngắn về kết quả cần hoàn thành..." /></label></div>
      <div className="modal-reminder-note"><BellRing size={16}/><span>Công việc sẽ được nhắc theo cấu hình nhắc việc hiện tại khi đến các mốc đã chọn.</span></div>
      <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Hủy</button><button type="submit" className="button button-primary"><Plus size={16}/> Tạo công việc</button></div>
    </form></div>
}

export default App
