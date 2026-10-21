import { useEffect, useMemo, useState } from 'react';
import { INITIAL_OPPORTUNITIES, TEAM } from './data/seed.js';
import {
  addMembersToOpportunity,
  canLogActivity,
  canManageSharing,
  getActorRole,
  getAvailableMembers,
  recordActivity,
  removeSharedMember,
  transferOwnership,
} from './utils/shareLogic.js';

const OPPORTUNITIES_KEY = 'ep06-opportunity-sharing-opportunities-v1';
const ACTOR_KEY = 'ep06-opportunity-sharing-actor-v1';

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.8-.7a8 8 0 0 1-1.7 1l-.3 1.9h-2.8l-.3-1.9a8 8 0 0 1-1.7-1l-1.8.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.8.7a8 8 0 0 1 1.7-1l.3-1.9h2.8l.3 1.9a8 8 0 0 1 1.7 1l1.8-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    transfer: <><path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3"/></>,
    activity: <><path d="M22 12h-4l-3 9-6-18-3 9H2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z"/></>,
    note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
    meeting: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h3"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.activity}</svg>;
}

function readStored(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function usePersistedState(key, fallback) {
  const [value, setValue] = useState(() => readStored(key, fallback));
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage is optional for this demo */ }
  }, [key, value]);
  return [value, setValue];
}

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(-2).map((chunk) => chunk[0]).join('').toUpperCase();
}

function personById(id) {
  return TEAM.find((person) => person.id === id) || { name: 'Người dùng', shortName: 'U', color: 'blue', role: '' };
}

function Avatar({ person, size = 'normal', ring = false }) {
  return <span aria-label={person.name} title={person.name} className={`avatar avatar-${person.color || 'blue'} avatar-${size}${ring ? ' avatar-ring' : ''}`}>{initials(person.name)}</span>;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0);
}

function formatCompactCurrency(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} triệu`;
  return formatCurrency(value);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function stageClass(stage) {
  const classes = { 'Đàm phán': 'stage-negotiation', 'Đề xuất giải pháp': 'stage-proposal', 'Đang tư vấn': 'stage-consult', 'Đủ điều kiện': 'stage-qualified', 'Thành công': 'stage-won' };
  return classes[stage] || 'stage-new';
}

const ACTIVITY_META = {
  call: { label: 'Cuộc gọi', icon: 'phone', className: 'activity-call' },
  meeting: { label: 'Cuộc họp', icon: 'meeting', className: 'activity-meeting' },
  email: { label: 'Email', icon: 'mail', className: 'activity-email' },
  note: { label: 'Ghi chú', icon: 'note', className: 'activity-note' },
  task: { label: 'Công việc', icon: 'check', className: 'activity-task' },
};

const AUDIT_LABELS = {
  created: 'Khởi tạo cơ hội', member_added: 'Thêm thành viên', member_removed: 'Gỡ thành viên',
  activity_logged: 'Ghi hoạt động', owner_transferred: 'Chuyển quyền sở hữu',
};

export default function App() {
  const [opportunities, setOpportunities] = usePersistedState(OPPORTUNITIES_KEY, INITIAL_OPPORTUNITIES);
  const [actorId, setActorId] = useState(() => {
    try { return window.localStorage.getItem(ACTOR_KEY) || 'u-phong'; } catch { return 'u-phong'; }
  });
  const [selectedId, setSelectedId] = useState(INITIAL_OPPORTUNITIES[0].id);
  const [listSearch, setListSearch] = useState('');
  const [activeTab, setActiveTab] = useState('activities');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [activityForm, setActivityForm] = useState({ type: 'note', title: '', note: '' });
  const [transferForm, setTransferForm] = useState({ newOwnerId: '', reason: '' });

  const selectedOpportunity = useMemo(() => opportunities.find((item) => item.id === selectedId) || opportunities[0], [opportunities, selectedId]);
  const actor = personById(actorId);
  const owner = personById(selectedOpportunity.ownerId);
  const memberPeople = selectedOpportunity.memberIds.map(personById);
  const role = getActorRole(selectedOpportunity, actorId);
  const isOwner = role === 'owner';
  const canWriteActivity = canLogActivity(selectedOpportunity, actorId);
  const canManage = canManageSharing(selectedOpportunity, actorId);
  const availableMembers = useMemo(() => getAvailableMembers(selectedOpportunity, TEAM).filter((person) => `${person.name} ${person.email} ${person.role}`.toLocaleLowerCase('vi').includes(memberSearch.toLocaleLowerCase('vi'))), [selectedOpportunity, memberSearch]);
  const visibleOpportunities = opportunities.filter((item) => `${item.name} ${item.company} ${item.id}`.toLocaleLowerCase('vi').includes(listSearch.toLocaleLowerCase('vi')));
  const totalPipeline = opportunities.reduce((sum, item) => sum + item.value, 0);
  const sharedCount = opportunities.reduce((sum, item) => sum + item.memberIds.length, 0);
  const activityCount = opportunities.reduce((sum, item) => sum + item.activities.length, 0);

  useEffect(() => {
    try { window.localStorage.setItem(ACTOR_KEY, actorId); } catch { /* optional */ }
  }, [actorId]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

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

  function updateSelectedOpportunity(updater) {
    setOpportunities((previous) => previous.map((item) => item.id === selectedOpportunity.id ? updater(item) : item));
  }

  function openModal(type) {
    setFormError('');
    if (type === 'share') { setSelectedMembers([]); setMemberSearch(''); }
    if (type === 'activity') setActivityForm({ type: 'note', title: '', note: '' });
    if (type === 'transfer') setTransferForm({ newOwnerId: '', reason: '' });
    setModal(type);
  }

  function submitAddMembers(event) {
    event.preventDefault();
    try {
      if (!selectedMembers.length) throw new Error('Hãy chọn ít nhất một thành viên để chia sẻ cơ hội.');
      updateSelectedOpportunity((item) => addMembersToOpportunity(item, actorId, selectedMembers, TEAM));
      const added = selectedMembers.filter((id) => id !== selectedOpportunity.ownerId && !selectedOpportunity.memberIds.includes(id)).length;
      setModal(null);
      setToast(added ? `Đã chia sẻ cơ hội với ${added} thành viên mới.` : 'Không có thành viên mới để thêm.');
    } catch (error) { setFormError(error.message); }
  }

  function handleRemoveMember(memberId) {
    const person = personById(memberId);
    if (!window.confirm(`Gỡ quyền chia sẻ của ${person.name} khỏi cơ hội này?`)) return;
    try {
      updateSelectedOpportunity((item) => removeSharedMember(item, actorId, memberId, TEAM));
      setToast(`Đã gỡ ${person.shortName} khỏi danh sách chia sẻ.`);
    } catch (error) { setToast(error.message); }
  }

  function submitActivity(event) {
    event.preventDefault();
    try {
      updateSelectedOpportunity((item) => recordActivity(item, actorId, activityForm, TEAM));
      setModal(null);
      setActiveTab('activities');
      setToast('Hoạt động đã được ghi nhận vào cơ hội.');
    } catch (error) { setFormError(error.message); }
  }

  function submitTransfer(event) {
    event.preventDefault();
    try {
      updateSelectedOpportunity((item) => transferOwnership(item, actorId, transferForm.newOwnerId, transferForm.reason, TEAM));
      setModal(null);
      setActiveTab('audit');
      setToast('Đã chuyển quyền sở hữu và ghi lại nhật ký.');
    } catch (error) { setFormError(error.message); }
  }

  function resetDemo() {
    if (!window.confirm('Đặt lại toàn bộ dữ liệu demo? Các thay đổi đang lưu trên trình duyệt sẽ bị xóa.')) return;
    setOpportunities(structuredClone(INITIAL_OPPORTUNITIES));
    setActorId('u-phong');
    setSelectedId(INITIAL_OPPORTUNITIES[0].id);
    setActiveTab('activities');
    setToast('Đã khôi phục dữ liệu demo ban đầu.');
  }

  const newestActivityFirst = [...selectedOpportunity.activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const newestAuditFirst = [...selectedOpportunity.audit].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Icon name="users" size={20} /></div>
          <div className="brand-copy"><strong>orbit<span>.</span></strong><small>SALES WORKSPACE</small></div>
          <button className="icon-button sidebar-collapse" aria-label="Thu gọn thanh điều hướng"><Icon name="more" /></button>
        </div>
        <div className="workspace-card">
          <div className="workspace-logo">A</div>
          <div className="workspace-label"><strong>Acme Corporation</strong><span>Sales team · Pro</span></div>
          <Icon name="chevron" size={16} />
        </div>
        <div className="nav-section-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          <button className="nav-item"><Icon name="grid" /> Tổng quan</button>
          <button className="nav-item active"><Icon name="briefcase" /> Cơ hội kinh doanh <span className="nav-count">12</span></button>
          <button className="nav-item"><Icon name="users" /> Khách hàng</button>
          <button className="nav-item"><Icon name="activity" /> Hoạt động</button>
          <button className="nav-item"><Icon name="chart" /> Báo cáo</button>
        </nav>
        <div className="nav-section-label team-label">CỘNG TÁC</div>
        <div className="team-mini-list">
          {TEAM.slice(0, 4).map((person) => <div className="team-mini" key={person.id}><Avatar person={person} size="tiny" /><span>{person.shortName}</span><i /></div>)}
          <span className="team-mini-more">+3 thành viên khác</span>
        </div>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><Icon name="shield" size={17} /></div><strong>Quyền truy cập rõ ràng</strong><p>Chia sẻ đúng người, đúng quyền. Nhật ký luôn được lưu lại.</p><button onClick={() => setToast('Chủ sở hữu quản lý thành viên; các thành viên được chia sẻ có thể ghi hoạt động.')}>Tìm hiểu thêm <Icon name="arrow" size={13} /></button></div>
          <div className="profile-row"><Avatar person={personById('u-phong')} /><div className="profile-copy"><strong>Phạm Minh Phong</strong><span>Trưởng nhóm kinh doanh</span></div><button className="icon-button" aria-label="Tùy chọn tài khoản"><Icon name="more" /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Không gian làm việc</span><b>/</b><strong>Cơ hội kinh doanh</strong><b>/</b><strong>Chia sẻ cơ hội</strong></div>
          <div className="topbar-actions"><span className="sync-status"><i /> Đã lưu trên thiết bị</span><button className="icon-button top-action" aria-label="Làm mới dữ liệu" onClick={resetDemo}><Icon name="refresh" /></button><div className="top-avatar-wrap"><Avatar person={personById('u-phong')} size="small" /></div></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div><div className="eyebrow"><span /> QUẢN LÝ NHÓM BÁN HÀNG</div><h1>Chia sẻ cơ hội</h1><p className="page-subtitle">Cùng theo đuổi thương vụ lớn — vẫn rõ người chịu trách nhiệm chính.</p></div>
            <div className="heading-actions"><button className="button button-secondary" onClick={resetDemo}><Icon name="refresh" size={16} /> Đặt lại demo</button><button className="button button-primary" onClick={() => openModal('share')} disabled={!canManage}><Icon name="plus" size={16} /> Thêm thành viên</button></div>
          </div>

          <div className="stat-grid">
            <div className="stat-card"><div className="stat-icon purple"><Icon name="briefcase" size={18} /></div><div className="stat-info"><span>Tổng cơ hội</span><strong>{opportunities.length}</strong><small><i className="tiny-dot purple-dot" /> Đang theo dõi</small></div><div className="stat-spark spark-purple"><span /><span /><span /><span /><span /><span /></div></div>
            <div className="stat-card"><div className="stat-icon blue"><Icon name="chart" size={18} /></div><div className="stat-info"><span>Tổng giá trị pipeline</span><strong>{formatCompactCurrency(totalPipeline)}</strong><small>Giá trị cơ hội mẫu</small></div><div className="stat-spark spark-blue"><span /><span /><span /><span /><span /><span /></div></div>
            <div className="stat-card"><div className="stat-icon green"><Icon name="users" size={18} /></div><div className="stat-info"><span>Lượt chia sẻ thành viên</span><strong>{sharedCount}</strong><small><i className="tiny-dot green-dot" /> Đang cộng tác</small></div><div className="stat-spark spark-green"><span /><span /><span /><span /><span /><span /></div></div>
            <div className="stat-card"><div className="stat-icon orange"><Icon name="activity" size={18} /></div><div className="stat-info"><span>Hoạt động đã ghi</span><strong>{activityCount}</strong><small>Cuộc gọi, họp, ghi chú...</small></div><div className="stat-spark spark-orange"><span /><span /><span /><span /><span /><span /></div></div>
          </div>

          <section className="workspace-grid">
            <aside className="opportunity-panel panel">
              <div className="panel-title-row"><div><h2>Cơ hội của nhóm</h2><p>Chọn thương vụ để quản lý cộng tác</p></div><span className="small-count">{visibleOpportunities.length}</span></div>
              <label className="search-box"><Icon name="search" size={17} /><input id="opportunity-search" value={listSearch} onChange={(event) => setListSearch(event.target.value)} placeholder="Tìm cơ hội, công ty..." aria-label="Tìm cơ hội" /><kbd>⌘ K</kbd></label>
              <div className="opportunity-list">
                {visibleOpportunities.map((item) => {
                  const itemOwner = personById(item.ownerId);
                  const isSelected = item.id === selectedOpportunity.id;
                  return <button key={item.id} className={`opportunity-item${isSelected ? ' selected' : ''}`} onClick={() => { setSelectedId(item.id); setActiveTab('activities'); }}>
                    <div className="opp-item-top"><span className={`stage-dot ${stageClass(item.stage)}`} /><span className="opp-code">{item.id}</span>{isSelected && <span className="selected-mark"><Icon name="check" size={12} /></span>}</div>
                    <strong>{item.name}</strong><span className="opp-company">{item.company}</span>
                    <div className="opp-item-bottom"><strong>{formatCompactCurrency(item.value)}</strong><div className="mini-avatars"><Avatar person={itemOwner} size="tiny" />{item.memberIds.slice(0, 2).map((id) => <Avatar key={id} person={personById(id)} size="tiny" />)}{item.memberIds.length > 2 && <span className="avatar-overflow">+{item.memberIds.length - 2}</span>}</div></div>
                  </button>;
                })}
                {!visibleOpportunities.length && <div className="empty-list"><Icon name="search" size={25} /><strong>Không tìm thấy cơ hội</strong><span>Thử từ khóa khác nhé.</span></div>}
              </div>
              <div className="list-footer"><span><i /> Dữ liệu demo</span><span>{opportunities.length} cơ hội</span></div>
            </aside>

            <section className="detail-column">
              <div className="opportunity-header panel">
                <div className="opp-heading-main"><div className="opp-symbol"><Icon name="briefcase" size={22} /></div><div className="opp-heading-copy"><div className="opp-eyebrow"><span>{selectedOpportunity.id}</span><span className={`stage-pill ${stageClass(selectedOpportunity.stage)}`}>{selectedOpportunity.stage}</span></div><h2>{selectedOpportunity.name}</h2><p>{selectedOpportunity.company}</p></div></div>
                <div className="opp-header-actions"><button className="button button-secondary" onClick={() => openModal('activity')} disabled={!canWriteActivity}><Icon name="plus" size={15} /> Ghi hoạt động</button><button className="icon-button more-large" aria-label="Thêm tùy chọn" onClick={() => setToast('Chọn “Chuyển quyền sở hữu” ở bên dưới để thay đổi người chịu trách nhiệm chính.')}><Icon name="more" /></button></div>
                <div className="opp-metrics-row"><div><span>Giá trị cơ hội</span><strong>{formatCurrency(selectedOpportunity.value)}</strong></div><div><span>Ngày chốt dự kiến</span><strong><Icon name="calendar" size={15} /> {new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${selectedOpportunity.closeDate}T12:00:00`))}</strong></div><div><span>Sản phẩm</span><strong><span className="product-dot" />{selectedOpportunity.product}</strong></div></div>
              </div>

              <section className="team-panel panel">
                <div className="section-heading"><div><div className="section-eyebrow"><span className="heading-rule" /> CỘNG TÁC THƯƠNG VỤ</div><h2>Đội ngũ phụ trách</h2><p>Chủ sở hữu chịu trách nhiệm chính; thành viên hỗ trợ theo dõi và ghi nhận hoạt động.</p></div><span className="team-count"><Icon name="users" size={15} /> {memberPeople.length + 1} người</span></div>
                <div className="owner-card"><div className="owner-card-accent" /><Avatar person={owner} size="large" ring /><div className="owner-details"><div className="owner-name-row"><strong>{owner.name}</strong><span className="owner-badge"><Icon name="shield" size={12} /> CHỦ SỞ HỮU</span></div><span>{owner.role}</span><small><Icon name="check" size={12} /> Chịu trách nhiệm chính về cơ hội</small></div><button className="button button-secondary owner-transfer-btn" disabled={!canManage} onClick={() => openModal('transfer')}><Icon name="transfer" size={15} /> Chuyển quyền sở hữu</button></div>
                <div className="members-heading"><div><strong>Thành viên được chia sẻ <span>{memberPeople.length}</span></strong><p>Có thể ghi hoạt động, không thể tự thay đổi chủ sở hữu.</p></div><button className="button button-soft" disabled={!canManage} onClick={() => openModal('share')}><Icon name="plus" size={15} /> Thêm thành viên</button></div>
                <div className="members-list">
                  {memberPeople.map((person) => <div className="member-row" key={person.id}><Avatar person={person} /><div className="member-details"><strong>{person.name}</strong><span>{person.role}</span></div><span className="member-access"><Icon name="check" size={12} /> Được chia sẻ</span>{canManage && <button className="icon-button remove-member" aria-label={`Gỡ ${person.name}`} title="Gỡ thành viên" onClick={() => handleRemoveMember(person.id)}><Icon name="close" size={15} /></button>}</div>)}
                  {!memberPeople.length && <div className="empty-members"><Icon name="users" size={24} /><span>Chưa có thành viên được chia sẻ.</span>{canManage && <button onClick={() => openModal('share')}>Thêm người cộng tác đầu tiên</button>}</div>}
                </div>
                <div className={`permission-banner permission-${role}`}><div className="permission-icon"><Icon name={role === 'owner' ? 'shield' : role === 'member' ? 'check' : 'lock'} size={17} /></div><div><strong>{role === 'owner' ? 'Bạn là chủ sở hữu cơ hội này' : role === 'member' ? 'Bạn đang là thành viên được chia sẻ' : 'Bạn chưa tham gia cơ hội này'}</strong><p>{role === 'owner' ? 'Bạn có thể quản lý thành viên, ghi hoạt động và chuyển quyền sở hữu.' : role === 'member' ? 'Bạn có thể ghi hoạt động và xem nhật ký. Quyền quản lý thành viên và đổi chủ sở hữu chỉ dành cho chủ sở hữu.' : 'Bạn có thể xem thông tin mẫu; hãy chuyển vai trò mô phỏng sang chủ sở hữu hoặc thành viên để thử các thao tác.'}</p></div></div>
              </section>

              <section className="timeline-panel panel">
                <div className="timeline-header"><div><h2>Hoạt động & nhật ký</h2><p>Theo dõi tiến độ và các thay đổi quyền truy cập.</p></div><div className="tabs" role="tablist" aria-label="Hoạt động và nhật ký"><button role="tab" aria-selected={activeTab === 'activities'} className={activeTab === 'activities' ? 'active' : ''} onClick={() => setActiveTab('activities')}><Icon name="activity" size={15} /> Hoạt động <span>{selectedOpportunity.activities.length}</span></button><button role="tab" aria-selected={activeTab === 'audit'} className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}><Icon name="shield" size={15} /> Nhật ký thay đổi <span>{selectedOpportunity.audit.length}</span></button></div></div>
                {activeTab === 'activities' ? <div className="timeline-content">
                  {newestActivityFirst.map((activity) => { const meta = ACTIVITY_META[activity.type] || ACTIVITY_META.note; const person = personById(activity.actorId); return <article className="timeline-item" key={activity.id}><div className={`timeline-icon ${meta.className}`}><Icon name={meta.icon} size={16} /></div><div className="timeline-item-body"><div className="timeline-item-title"><strong>{activity.title}</strong><span>{meta.label}</span></div><p>{activity.note}</p><div className="timeline-meta"><Avatar person={person} size="tiny" /><span>{person.name}</span><i /> <Icon name="clock" size={12} /><time dateTime={activity.createdAt}>{formatDateTime(activity.createdAt)}</time></div></div></article>; })}
                  {!newestActivityFirst.length && <div className="timeline-empty"><div><Icon name="activity" size={24} /></div><strong>Chưa có hoạt động nào</strong><p>Ghi lại cuộc gọi, cuộc họp hoặc ghi chú đầu tiên cho thương vụ này.</p><button className="button button-primary" onClick={() => openModal('activity')} disabled={!canWriteActivity}><Icon name="plus" size={15} /> Ghi hoạt động</button></div>}
                  {newestActivityFirst.length > 0 && <button className="button button-secondary add-activity-bottom" onClick={() => openModal('activity')} disabled={!canWriteActivity}><Icon name="plus" size={15} /> Thêm hoạt động</button>}
                </div> : <div className="audit-list">
                  {newestAuditFirst.map((entry) => { const person = personById(entry.actorId); const iconName = entry.type === 'owner_transferred' ? 'transfer' : entry.type.includes('member') ? 'users' : entry.type === 'activity_logged' ? 'activity' : 'briefcase'; return <article className={`audit-item audit-${entry.type}`} key={entry.id}><div className="audit-icon"><Icon name={iconName} size={15} /></div><div className="audit-body"><div className="audit-title-line"><strong>{AUDIT_LABELS[entry.type] || 'Cập nhật cơ hội'}</strong><time dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time></div><p>{entry.summary}</p>{entry.details?.reason && <div className="audit-reason"><span>LÝ DO</span>{entry.details.reason}</div>}<div className="audit-actor"><Avatar person={person} size="tiny" /> Thực hiện bởi <strong>{person.name}</strong></div></div></article>; })}
                  {!newestAuditFirst.length && <div className="timeline-empty"><strong>Chưa có nhật ký</strong><p>Các thay đổi quyền truy cập sẽ được ghi lại tại đây.</p></div>}
                </div>}
                <div className="audit-footer"><Icon name="lock" size={14} /><span>Nhật ký thay đổi được lưu cùng dữ liệu cơ hội trên trình duyệt demo.</span></div>
              </section>
            </section>
          </section>
          <footer className="page-footer"><span>ORBIT CRM <b>·</b> Chia sẻ cơ hội</span><span><i /> Giao diện demo · Dữ liệu lưu trên thiết bị</span></footer>
        </div>
      </main>

      <aside className="role-switcher" aria-label="Công cụ mô phỏng quyền"><div className="role-switcher-icon"><Icon name="shield" size={16} /></div><label htmlFor="actor-switch">Mô phỏng người dùng</label><select id="actor-switch" value={actorId} onChange={(event) => setActorId(event.target.value)}>{TEAM.map((person) => <option key={person.id} value={person.id}>{person.name}{person.id === selectedOpportunity.ownerId ? ' · Chủ sở hữu' : selectedOpportunity.memberIds.includes(person.id) ? ' · Thành viên' : ''}</option>)}</select><span className={`role-tag role-${role}`}>{role === 'owner' ? 'Chủ sở hữu' : role === 'member' ? 'Thành viên chia sẻ' : 'Chưa tham gia'}</span></aside>

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div className={`modal-icon modal-icon-${modal}`}><Icon name={modal === 'share' ? 'users' : modal === 'activity' ? 'activity' : 'transfer'} size={21} /></div><div><h2 id="modal-title">{modal === 'share' ? 'Thêm thành viên chia sẻ' : modal === 'activity' ? 'Ghi hoạt động mới' : 'Chuyển quyền sở hữu'}</h2><p>{modal === 'share' ? 'Mời đồng đội cùng theo dõi và hỗ trợ thương vụ.' : modal === 'activity' ? 'Ghi lại trao đổi để mọi người trong nhóm nắm được tiến độ.' : 'Chuyển trách nhiệm chính sang người phụ trách mới.'}</p></div><button className="icon-button modal-close" aria-label="Đóng" onClick={() => setModal(null)}><Icon name="close" /></button></div>
          {modal === 'share' && <form onSubmit={submitAddMembers}>
            <div className="modal-opportunity-summary"><span>CƠ HỘI</span><strong>{selectedOpportunity.name}</strong><small>{selectedOpportunity.company}</small></div>
            <label className="field-label" htmlFor="member-search">Tìm thành viên</label><div className="modal-search"><Icon name="search" size={16} /><input id="member-search" value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Tên, email hoặc vai trò..." /></div>
            <div className="selectable-members">{availableMembers.map((person) => <label className={`selectable-member${selectedMembers.includes(person.id) ? ' selected' : ''}`} key={person.id}><input type="checkbox" checked={selectedMembers.includes(person.id)} onChange={(event) => setSelectedMembers((previous) => event.target.checked ? [...previous, person.id] : previous.filter((id) => id !== person.id))} /><Avatar person={person} /><span className="selectable-person"><strong>{person.name}</strong><small>{person.role}</small><em>{person.email}</em></span><span className="checkbox-custom"><Icon name="check" size={13} /></span></label>)}{!availableMembers.length && <div className="modal-empty">Đã chia sẻ với toàn bộ thành viên phù hợp.</div>}</div>
            <div className="permission-note"><Icon name="shield" size={16} /><span>Thành viên được chia sẻ có thể ghi hoạt động nhưng không thể đổi chủ sở hữu hoặc thêm/gỡ thành viên.</span></div>
            {formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Hủy</button><button type="submit" className="button button-primary" disabled={!availableMembers.length}><Icon name="plus" size={15} /> Thêm {selectedMembers.length ? `${selectedMembers.length} thành viên` : 'thành viên'}</button></div>
          </form>}
          {modal === 'activity' && <form onSubmit={submitActivity}>
            <div className="modal-opportunity-summary"><span>CƠ HỘI</span><strong>{selectedOpportunity.name}</strong><small>{selectedOpportunity.company}</small></div>
            <label className="field-label" htmlFor="activity-type">Loại hoạt động</label><div className="activity-type-grid">{Object.entries(ACTIVITY_META).map(([key, meta]) => <button type="button" key={key} className={`activity-type-option${activityForm.type === key ? ' selected' : ''}`} onClick={() => setActivityForm((previous) => ({ ...previous, type: key }))}><Icon name={meta.icon} size={16} />{meta.label}</button>)}</div>
            <label className="field-label" htmlFor="activity-title">Tiêu đề <span>*</span></label><input className="form-control" id="activity-title" required maxLength={100} value={activityForm.title} onChange={(event) => setActivityForm((previous) => ({ ...previous, title: event.target.value }))} placeholder="VD: Gọi điện trao đổi với khách hàng" />
            <label className="field-label" htmlFor="activity-note">Nội dung <span>*</span></label><textarea className="form-control textarea" id="activity-note" required rows={4} maxLength={1000} value={activityForm.note} onChange={(event) => setActivityForm((previous) => ({ ...previous, note: event.target.value }))} placeholder="Tóm tắt nội dung, kết quả và bước tiếp theo..." />
            <div className="actor-note"><Avatar person={actor} size="tiny" /> Hoạt động sẽ được ghi nhận bởi <strong>{actor.name}</strong>.</div>
            {formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Hủy</button><button type="submit" className="button button-primary"><Icon name="check" size={15} /> Lưu hoạt động</button></div>
          </form>}
          {modal === 'transfer' && <form onSubmit={submitTransfer}>
            <div className="transfer-warning"><Icon name="shield" size={18} /><div><strong>Thao tác quan trọng</strong><p>Việc chuyển chủ sở hữu sẽ được ghi vào nhật ký. Chủ sở hữu cũ được giữ lại làm thành viên chia sẻ để tiếp tục theo dõi.</p></div></div>
            <div className="transfer-route"><div><span>CHỦ SỞ HỮU HIỆN TẠI</span><div className="transfer-person"><Avatar person={owner} /><div><strong>{owner.name}</strong><small>{owner.role}</small></div></div></div><div className="transfer-arrow"><Icon name="transfer" size={18} /></div><div><span>CHỦ SỞ HỮU MỚI</span><label className="select-control"><select required value={transferForm.newOwnerId} onChange={(event) => setTransferForm((previous) => ({ ...previous, newOwnerId: event.target.value }))}><option value="">Chọn người chịu trách nhiệm...</option>{TEAM.filter((person) => person.id !== selectedOpportunity.ownerId).map((person) => <option key={person.id} value={person.id}>{person.name} — {person.role}</option>)}</select><Icon name="chevron" size={15} /></label></div></div>
            <label className="field-label" htmlFor="transfer-reason">Lý do chuyển quyền sở hữu <span>*</span></label><textarea className="form-control textarea" id="transfer-reason" required rows={3} maxLength={500} value={transferForm.reason} onChange={(event) => setTransferForm((previous) => ({ ...previous, reason: event.target.value }))} placeholder="VD: Linh sẽ là đầu mối chính trong giai đoạn đàm phán..." />
            <div className="audit-proof"><Icon name="lock" size={16} /><span>Nhật ký sẽ lưu người chuyển, chủ sở hữu cũ/mới, thời điểm và lý do.</span></div>
            {formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Hủy</button><button type="submit" className="button button-primary"><Icon name="transfer" size={15} /> Xác nhận chuyển quyền</button></div>
          </form>}
        </section>
      </div>}
      {toast && <div className="toast" role="status"><span><Icon name="check" size={16} /></span>{toast}<button aria-label="Đóng thông báo" onClick={() => setToast('')}><Icon name="close" size={14} /></button></div>}
    </div>
  );
}
