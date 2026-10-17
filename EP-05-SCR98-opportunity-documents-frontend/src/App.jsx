import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, ArrowLeft, ArrowUpDown, BadgeCheck, Bell, BookOpen,
  BriefcaseBusiness, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3,
  CloudUpload, Download, File, FileArchive, FileImage, FileSpreadsheet, FileText,
  FileType2, FolderClosed, FolderOpen, HardDrive, Info, LayoutDashboard,
  LockKeyhole, Menu, MoreHorizontal, Paperclip, Plus, Search, ShieldCheck,
  SlidersHorizontal, Sparkles, Trash2, UploadCloud, Users, X,
} from 'lucide-react';
import { DEMO_ATTACHMENTS, OPPORTUNITIES, USERS } from './data.js';
import {
  canAccessOpportunity, canDownloadAttachment, canUploadAttachment, classifyFile,
  filterAttachments, formatBytes, formatDateTime, makeAttachmentRecord, sortAttachments,
  validateFiles,
} from './utils/attachments.js';
import { ensureDemoAttachments, getAllAttachments, removeAttachment, saveAttachment } from './utils/attachmentStore.js';

const CURRENT_USER_KEY = 'salesflow-docs-current-user';

function readInitialUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return USERS.some((user) => user.id === saved) ? saved : 'linh.tran';
  } catch { return 'linh.tran'; }
}

function initialsFor(user) {
  return user?.initials || String(user?.name || '?').split(' ').slice(-2).map((part) => part[0]).join('').toUpperCase();
}

function Avatar({ user, size = 'md', className = '' }) {
  if (!user) return <span className={`avatar ${size} ${className}`}>?</span>;
  return <span className={`avatar ${size} avatar-${user.color || 'violet'} ${className}`} title={user.name}>{initialsFor(user)}</span>;
}

function FileGlyph({ attachment, size = 21 }) {
  const kind = classifyFile(attachment?.name, attachment?.type);
  const common = { size, strokeWidth: 1.8 };
  const icon = {
    pdf: <FileText {...common} />, word: <FileType2 {...common} />, sheet: <FileSpreadsheet {...common} />,
    slides: <FileText {...common} />, image: <FileImage {...common} />, archive: <FileArchive {...common} />,
    text: <FileText {...common} />, other: <File {...common} />,
  }[kind];
  return <span className={`file-glyph file-${kind}`}>{icon}</span>;
}

function StageBadge({ opportunity }) {
  return <span className={`stage-badge stage-${opportunity.stageKey}`}>{opportunity.stage}</span>;
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 5200);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);
  if (!toast) return null;
  const Icon = toast.type === 'error' ? AlertCircle : toast.type === 'success' ? CheckCircle2 : Info;
  return <div className={`toast toast-${toast.type || 'info'}`} role="status"><Icon size={19} /><div className="toast-copy"><strong>{toast.title}</strong>{toast.message && <span>{toast.message}</span>}</div><button className="icon-button toast-close" onClick={onClose} aria-label="Đóng thông báo"><X size={16} /></button></div>;
}

function EmptyFiles({ canUpload, onBrowse }) {
  return <div className="empty-files"><div className="empty-icon"><FolderOpen size={29} strokeWidth={1.6} /></div><h3>Chưa có tài liệu nào</h3><p>Thêm hồ sơ thầu, báo giá hoặc biên bản họp để cả nhóm tìm thấy ngay trong cơ hội này.</p>{canUpload ? <button className="button button-primary button-small" onClick={onBrowse}><Plus size={16} /> Tải tài liệu đầu tiên</button> : <span className="muted-note"><LockKeyhole size={14} /> Chỉ thành viên được chia sẻ mới có thể thêm tệp</span>}</div>;
}

function formatCurrency(value) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ ₫`;
  return `${(value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} triệu ₫`;
}

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(readInitialUser);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('OPP-2418');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState('');
  const [opportunityQuery, setOpportunityQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const currentUser = USERS.find((user) => user.id === currentUserId) || USERS[0];
  const selectedOpportunity = OPPORTUNITIES.find((opportunity) => opportunity.id === selectedOpportunityId) || OPPORTUNITIES[0];
  const owner = USERS.find((user) => user.id === selectedOpportunity.ownerId);
  const sharedUsers = selectedOpportunity.sharedUserIds.map((id) => USERS.find((user) => user.id === id)).filter(Boolean);
  const hasAccess = canAccessOpportunity(currentUserId, selectedOpportunity);
  const isOwner = currentUserId === selectedOpportunity.ownerId;
  const canUpload = canUploadAttachment(currentUserId, selectedOpportunity);
  const canDownload = canDownloadAttachment(currentUserId, selectedOpportunity);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await ensureDemoAttachments(DEMO_ATTACHMENTS);
        if (active) { setAttachments(all); setPersistenceAvailable(true); }
      } catch (error) {
        console.error('Unable to load attachment storage:', error);
        if (active) {
          setAttachments(DEMO_ATTACHMENTS.map(({ demoContent, ...item }) => ({ ...item, blob: new Blob([demoContent || 'Tài liệu demo'], { type: item.type || 'text/plain' }), isDemo: true })));
          setPersistenceAvailable(false);
          setToast({ type: 'error', title: 'Không thể mở kho lưu trữ', message: 'Bạn vẫn có thể xem dữ liệu mẫu, nhưng file mới có thể không được lưu sau khi đóng trình duyệt.' });
        }
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => { try { localStorage.setItem(CURRENT_USER_KEY, currentUserId); } catch { /* local storage is optional */ } }, [currentUserId]);
  const closeToast = useCallback(() => setToast(null), []);

  const opportunityAttachments = useMemo(() => attachments.filter((attachment) => attachment.opportunityId === selectedOpportunity.id), [attachments, selectedOpportunity.id]);
  const filteredAttachments = useMemo(() => sortAttachments(filterAttachments(opportunityAttachments, query, typeFilter), sortOrder), [opportunityAttachments, query, typeFilter, sortOrder]);
  const matchingOpportunities = useMemo(() => {
    const q = opportunityQuery.trim().toLocaleLowerCase('vi');
    if (!q) return OPPORTUNITIES;
    return OPPORTUNITIES.filter((opportunity) => `${opportunity.id} ${opportunity.name} ${opportunity.company}`.toLocaleLowerCase('vi').includes(q));
  }, [opportunityQuery]);
  const totalSize = opportunityAttachments.reduce((sum, attachment) => sum + (Number(attachment.size) || 0), 0);
  const totalFilesAcrossApp = attachments.length;

  const setSelectedUser = (value) => {
    setCurrentUserId(value);
    const nextUser = USERS.find((user) => user.id === value);
    setToast({ type: 'info', title: `Đang xem với vai trò: ${nextUser?.name || 'Người dùng'}`, message: 'Bộ chọn người dùng chỉ dùng để mô phỏng phân quyền trên frontend.' });
  };

  const refreshAttachments = async () => {
    try { setAttachments(await getAllAttachments()); } catch (error) { console.error(error); }
  };

  const uploadFiles = async (fileList) => {
    const fileArray = Array.from(fileList || []);
    if (!fileArray.length) return;
    if (!canUpload) {
      setToast({ type: 'error', title: 'Không có quyền tải lên', message: 'Bạn chưa phải chủ sở hữu hoặc thành viên được chia sẻ của cơ hội này.' });
      return;
    }
    const { accepted, rejected } = validateFiles(fileArray);
    if (!accepted.length) {
      setToast({ type: 'error', title: 'Không có tệp hợp lệ', message: rejected.map((item) => `${item.file?.name || 'Tệp'}: ${item.reason}`).join(' ') });
      return;
    }
    setUploading(true);
    let savedCount = 0;
    const failures = [];
    for (const file of accepted) {
      try {
        await saveAttachment(makeAttachmentRecord({ file, opportunity: selectedOpportunity, user: currentUser }));
        savedCount += 1;
      } catch (error) {
        console.error(error);
        failures.push(`${file.name}: không thể lưu (có thể đã hết dung lượng trình duyệt).`);
      }
    }
    await refreshAttachments();
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (savedCount > 0 && !failures.length && !rejected.length) {
      setToast({ type: 'success', title: `Đã tải lên ${savedCount} tệp`, message: 'Tài liệu đã được lưu kèm người tải lên và thời điểm.' });
    } else {
      const details = [savedCount ? `Tải lên thành công ${savedCount} tệp.` : '', rejected.length ? `${rejected.length} tệp bị từ chối: ${rejected.map(({ file, reason }) => `${file?.name || 'Tệp'} (${reason})`).join('; ')}.` : '', ...failures].filter(Boolean).join(' ');
      setToast({ type: failures.length || (!savedCount && rejected.length) ? 'error' : 'info', title: 'Kết quả tải lên', message: details });
    }
  };

  const handleDownload = (attachment) => {
    if (!canDownloadAttachment(currentUserId, selectedOpportunity)) {
      setToast({ type: 'error', title: 'Tải xuống bị từ chối', message: 'Chỉ chủ sở hữu và thành viên được chia sẻ mới được tải tài liệu của cơ hội này.' });
      return;
    }
    if (!attachment.blob) {
      setToast({ type: 'error', title: 'Không tìm thấy dữ liệu tệp', message: 'Tệp này chỉ còn thông tin metadata. Hãy tải lên lại tệp gốc.' });
      return;
    }
    try {
      const blob = attachment.blob instanceof Blob ? attachment.blob : new Blob([attachment.blob], { type: attachment.type || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = attachment.name;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setToast({ type: 'success', title: 'Đã bắt đầu tải xuống', message: attachment.name });
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', title: 'Tải xuống thất bại', message: 'Trình duyệt không thể tạo bản tải xuống cho tệp này.' });
    }
  };

  const handleRemove = async (attachment) => {
    if (!isOwner) {
      setToast({ type: 'error', title: 'Chỉ chủ sở hữu được xóa tệp', message: 'Hãy chuyển sang người sở hữu cơ hội để quản lý tài liệu.' });
      return;
    }
    if (!window.confirm(`Xóa tài liệu “${attachment.name}” khỏi cơ hội?`)) return;
    try {
      await removeAttachment(attachment.id);
      setAttachments((items) => items.filter((item) => item.id !== attachment.id));
      setToast({ type: 'success', title: 'Đã xóa tài liệu', message: attachment.name });
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', title: 'Không thể xóa tệp', message: 'Vui lòng thử lại.' });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault(); setDragging(false);
    if (canUpload) uploadFiles(event.dataTransfer.files);
  };
  const openFilePicker = () => {
    if (!canUpload) {
      setToast({ type: 'error', title: 'Bạn không có quyền tải lên', message: 'Cơ hội này chưa được chia sẻ với bạn.' });
      return;
    }
    fileInputRef.current?.click();
  };
  const getUser = (id) => USERS.find((user) => user.id === id);
  const recentActivity = [...opportunityAttachments].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
  const allStorageBytes = attachments.reduce((sum, item) => sum + (Number(item.size) || 0), 0);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark"><span /><span /><span /><span /></div><div className="brand-name">sales<span>flow</span><small>WORKSPACE</small></div><button className="icon-button sidebar-menu" aria-label="Thu gọn menu"><Menu size={18} /></button></div>
        <div className="workspace-switcher"><div className="workspace-icon"><BriefcaseBusiness size={17} /></div><div className="workspace-copy"><strong>Đội ngũ kinh doanh</strong><span>Workspace nội bộ</span></div><ChevronDown size={15} className="subtle-icon" /></div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          <span className="nav-label">KHÔNG GIAN LÀM VIỆC</span>
          <button className="nav-item"><LayoutDashboard size={18} /> Tổng quan</button>
          <button className="nav-item"><BriefcaseBusiness size={18} /> Cơ hội <span className="nav-count">24</span></button>
          <button className="nav-item nav-item-active"><FolderOpen size={18} /> Tài liệu <span className="nav-dot" /></button>
          <button className="nav-item"><Activity size={18} /> Hoạt động</button>
          <button className="nav-item"><Users size={18} /> Đội ngũ</button>
          <span className="nav-label nav-label-spaced">LỐI TẮT</span>
          <button className="nav-item"><Clock3 size={18} /> Tài liệu gần đây</button>
          <button className="nav-item"><FolderClosed size={18} /> Được chia sẻ với tôi</button>
        </nav>
        <div className="sidebar-storage"><div className="storage-heading"><span><HardDrive size={15} /> Kho tài liệu demo</span><span>Đang hoạt động</span></div><div className="storage-meter"><span style={{ width: `${Math.min((allStorageBytes / (300 * 1024 * 1024)) * 100, 100)}%` }} /></div><p>{formatBytes(allStorageBytes)} đã sử dụng <span>/ 300 MB*</span></p><small>*Mức minh họa cho giao diện</small></div>
        <div className="sidebar-profile"><Avatar user={currentUser} size="lg" /><div className="profile-copy"><strong>{currentUser.name}</strong><span>{currentUser.title}</span></div><button className="icon-button" aria-label="Cài đặt tài khoản"><MoreHorizontal size={18} /></button></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>CRM</span><span className="crumb-sep">/</span><span>Cơ hội kinh doanh</span><span className="crumb-sep">/</span><strong>Tài liệu đính kèm</strong></div>
          <div className="topbar-actions"><div className="search-shell global-search"><Search size={16} /><input value={opportunityQuery} onChange={(event) => setOpportunityQuery(event.target.value)} placeholder="Tìm cơ hội..." aria-label="Tìm cơ hội" /><kbd>⌘ K</kbd></div><button className="icon-button top-icon" aria-label="Trợ giúp"><CircleHelp size={19} /></button><button className="icon-button top-icon notification-button" aria-label="Thông báo"><Bell size={19} /><i /></button><div className="user-switch"><span className="demo-indicator" /><label htmlFor="demo-user">Người dùng demo</label><select id="demo-user" value={currentUserId} onChange={(event) => setSelectedUser(event.target.value)} aria-label="Chọn người dùng mô phỏng">{USERS.map((user) => <option value={user.id} key={user.id}>{user.name}{user.id === selectedOpportunity.ownerId ? ' · Chủ sở hữu' : selectedOpportunity.sharedUserIds.includes(user.id) ? ' · Được chia sẻ' : ''}</option>)}</select><ChevronDown size={14} /></div></div>
        </header>

        <div className="page-content">
          <div className="page-heading-row"><div><div className="eyebrow"><span className="eyebrow-icon"><Paperclip size={14} /></span> QUẢN LÝ HỒ SƠ THƯƠNG VỤ</div><h1>Tài liệu cơ hội</h1><p className="page-subtitle">Tập trung hồ sơ thầu, báo giá và biên bản họp tại một nơi.</p></div><button className="button button-primary" onClick={openFilePicker} disabled={!canUpload || uploading}><UploadCloud size={17} /> Tải tài liệu lên</button></div>
          {!persistenceAvailable && <div className="inline-warning"><AlertCircle size={17} /><span>Kho lưu trữ không khả dụng. Các tệp mới có thể không tồn tại sau khi tải lại trang.</span></div>}

          <section className="stats-grid" aria-label="Tổng quan tài liệu">
            <div className="stat-card"><div className="stat-icon stat-icon-violet"><FolderOpen size={19} /></div><div className="stat-main"><span>Tài liệu của cơ hội</span><strong>{opportunityAttachments.length}<small> tệp</small></strong><em><span className="stat-accent">{formatBytes(totalSize)}</span> dung lượng</em></div><div className="stat-corner"><FileText size={34} /></div></div>
            <div className="stat-card"><div className="stat-icon stat-icon-blue"><Users size={19} /></div><div className="stat-main"><span>Người có quyền truy cập</span><strong>{1 + sharedUsers.length}<small> người</small></strong><em>1 chủ sở hữu · {sharedUsers.length} được chia sẻ</em></div><div className="stat-corner"><ShieldCheck size={34} /></div></div>
            <div className="stat-card"><div className="stat-icon stat-icon-mint"><HardDrive size={19} /></div><div className="stat-main"><span>Giới hạn mỗi tệp</span><strong>20<small> MB</small></strong><em>Hỗ trợ tải lên nhiều tệp</em></div><div className="stat-corner"><CloudUpload size={34} /></div></div>
          </section>

          <div className="content-grid">
            <section className="panel opportunity-panel">
              <div className="panel-heading opportunity-panel-heading"><div><h2>Cơ hội kinh doanh</h2><p>Chọn thương vụ để xem tài liệu</p></div><span className="soft-count">{matchingOpportunities.length}</span></div>
              <div className="panel-search"><Search size={16} /><input value={opportunityQuery} onChange={(event) => setOpportunityQuery(event.target.value)} placeholder="Tên cơ hội, công ty..." aria-label="Tìm trong danh sách cơ hội" /><SlidersHorizontal size={15} className="subtle-icon" /></div>
              <div className="opportunity-list">
                {matchingOpportunities.map((opportunity) => {
                  const active = selectedOpportunity.id === opportunity.id;
                  const access = canAccessOpportunity(currentUserId, opportunity);
                  const count = attachments.filter((item) => item.opportunityId === opportunity.id).length;
                  return <button className={`opportunity-card ${active ? 'opportunity-card-active' : ''}`} key={opportunity.id} onClick={() => { setSelectedOpportunityId(opportunity.id); setQuery(''); setTypeFilter('all'); }}>
                    <div className={`company-monogram monogram-${opportunity.companyColor}`}>{opportunity.initials}</div><div className="opportunity-card-copy"><div className="opportunity-company-line"><strong>{opportunity.company}</strong>{active && <span className="selected-check"><Check size={12} /></span>}</div><span className="opportunity-name">{opportunity.name}</span><div className="opportunity-meta"><span>{opportunity.id}</span><i /><span>{formatCurrency(opportunity.value)}</span></div><div className="opportunity-foot"><StageBadge opportunity={opportunity} /><span className={`access-mini ${access ? 'access-ok' : 'access-locked'}`} title={access ? 'Bạn có quyền truy cập' : 'Chưa được chia sẻ'}>{access ? <ShieldCheck size={13} /> : <LockKeyhole size={12} />}</span><span className="file-mini"><Paperclip size={12} /> {count}</span></div></div>
                  </button>;
                })}
                {matchingOpportunities.length === 0 && <div className="list-empty"><Search size={23} /><span>Không tìm thấy cơ hội phù hợp.</span></div>}
              </div>
              <div className="opportunity-panel-footer"><span><span className="legend-dot legend-access" /> Có quyền truy cập</span><span><span className="legend-dot legend-no-access" /> Chưa chia sẻ</span></div>
            </section>

            <section className="panel documents-panel">
              <div className="selected-opportunity-header"><div className={`company-monogram company-monogram-lg monogram-${selectedOpportunity.companyColor}`}>{selectedOpportunity.initials}</div><div className="selected-opp-copy"><div className="selected-opp-topline"><span className="opportunity-code">{selectedOpportunity.id}</span><StageBadge opportunity={selectedOpportunity} /></div><h2>{selectedOpportunity.name}</h2><div className="selected-opp-subtitle"><BriefcaseBusiness size={14} /> {selectedOpportunity.company}<span className="detail-dot" /><span>{formatCurrency(selectedOpportunity.value)}</span><span className="detail-dot" /><span>Chốt {new Date(`${selectedOpportunity.closingDate}T12:00:00`).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span></div></div><button className="icon-button selected-more" aria-label="Tùy chọn cơ hội"><MoreHorizontal size={20} /></button></div>

              {!hasAccess && <div className="permission-notice permission-notice-warning"><LockKeyhole size={17} /><div><strong>Bạn chưa được chia sẻ cơ hội này</strong><p>Bạn có thể xem thông tin tệp, nhưng không được tải xuống hoặc tải lên. Hãy chuyển sang người sở hữu/thành viên được chia sẻ để kiểm thử quyền.</p></div></div>}
              {hasAccess && <div className="permission-notice"><ShieldCheck size={17} /><div><strong>{isOwner ? 'Bạn là chủ sở hữu cơ hội' : 'Bạn được chia sẻ cơ hội này'}</strong><p>{isOwner ? 'Bạn có thể tải lên, tải xuống và quản lý tài liệu đính kèm.' : 'Bạn có thể tải lên và tải xuống tài liệu. Quyền sở hữu cơ hội không thay đổi.'}</p></div><span className="verified-pill"><BadgeCheck size={13} /> Có quyền</span></div>}

              <div className={`upload-zone ${dragging ? 'upload-zone-dragging' : ''} ${!canUpload ? 'upload-zone-disabled' : ''}`} onDragOver={(event) => { event.preventDefault(); if (canUpload) setDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={handleDrop}>
                <input ref={fileInputRef} type="file" multiple className="visually-hidden" onChange={(event) => uploadFiles(event.target.files)} aria-label="Chọn nhiều tệp để tải lên" /><div className="upload-zone-icon"><CloudUpload size={26} strokeWidth={1.7} /></div><div className="upload-zone-copy"><strong>{dragging ? 'Thả tệp vào đây' : 'Kéo thả tài liệu vào đây'}</strong><span>Hoặc chọn từ thiết bị của bạn · Có thể tải lên nhiều tệp cùng lúc</span></div><button className="button button-outline button-small" onClick={openFilePicker} disabled={!canUpload || uploading}>{uploading ? <span className="spinner" /> : <Plus size={15} />}{uploading ? 'Đang tải lên...' : 'Chọn tệp'}</button><div className="upload-zone-foot"><span><ShieldCheck size={13} /> Quyền tải xuống được kiểm soát theo cơ hội</span><span className="upload-limit">Tối đa 20 MB / tệp</span></div>
              </div>

              <div className="attachment-section-heading"><div><h3>Tài liệu đính kèm <span>{opportunityAttachments.length}</span></h3><p>Hồ sơ được lưu cùng lịch sử người tải lên</p></div><button className="button button-outline button-small" onClick={() => { setQuery(''); setTypeFilter('all'); setSortOrder('newest'); }}><ArrowUpDown size={14} /> Đặt lại lọc</button></div>
              <div className="attachment-toolbar"><div className="search-shell attachment-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên tệp, người tải lên..." aria-label="Tìm tài liệu" />{query && <button className="inline-clear" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm"><X size={14} /></button>}</div><select className="filter-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Lọc theo loại tài liệu"><option value="all">Tất cả loại tệp</option><option value="pdf">PDF</option><option value="word">Word</option><option value="sheet">Excel / CSV</option><option value="slides">PowerPoint</option><option value="image">Hình ảnh</option><option value="text">Văn bản</option><option value="archive">Tệp nén</option><option value="other">Khác</option></select><select className="filter-select filter-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sắp xếp tài liệu"><option value="newest">Mới nhất</option><option value="oldest">Cũ nhất</option><option value="name">Tên tệp A–Z</option></select></div>

              <div className="attachment-list-header"><span>TÊN TÀI LIỆU</span><span>NGƯỜI TẢI LÊN</span><span>NGÀY TẢI LÊN</span><span className="attachment-header-actions">THAO TÁC</span></div>
              <div className="attachment-list">
                {loading ? <div className="loading-state"><span className="spinner spinner-large" /> Đang tải tài liệu...</div> : filteredAttachments.map((attachment) => {
                  const uploader = getUser(attachment.uploaderId) || { name: attachment.uploaderName, initials: initialsFor({ name: attachment.uploaderName }), color: 'slate' };
                  return <div className="attachment-row" key={attachment.id}><div className="file-cell"><FileGlyph attachment={attachment} /><div className="file-details"><strong title={attachment.name}>{attachment.name}</strong><span>{formatBytes(attachment.size)} <i /> {classifyFile(attachment.name, attachment.type).toUpperCase()}{attachment.isDemo && <em className="demo-file-tag">DEMO</em>}</span></div></div><div className="uploader-cell"><Avatar user={uploader} size="sm" /><div><strong>{attachment.uploaderName || uploader.name}</strong><span>Người tải lên</span></div></div><div className="date-cell"><Clock3 size={14} /><span>{formatDateTime(attachment.uploadedAt)}</span></div><div className="attachment-actions"><button className={`row-action ${canDownload ? 'row-action-download' : 'row-action-disabled'}`} disabled={!canDownload} onClick={() => handleDownload(attachment)} title={canDownload ? 'Tải xuống tài liệu' : 'Bạn chưa có quyền tải xuống'} aria-label={`Tải xuống ${attachment.name}`}>{canDownload ? <Download size={16} /> : <LockKeyhole size={15} />}</button>{isOwner && <button className="row-action row-action-delete" onClick={() => handleRemove(attachment)} title="Xóa tài liệu" aria-label={`Xóa ${attachment.name}`}><Trash2 size={15} /></button>}</div></div>;
                })}
                {!loading && filteredAttachments.length === 0 && (opportunityAttachments.length ? <div className="empty-filter"><div className="empty-filter-icon"><Search size={22} /></div><strong>Không tìm thấy tài liệu</strong><span>Thử từ khóa khác hoặc điều chỉnh bộ lọc loại tệp.</span><button className="button button-outline button-small" onClick={() => { setQuery(''); setTypeFilter('all'); }}>Xóa bộ lọc</button></div> : <EmptyFiles canUpload={canUpload} onBrowse={openFilePicker} />)}
              </div>
              <div className="attachment-list-footer"><span>Đang hiển thị <strong>{filteredAttachments.length}</strong> / {opportunityAttachments.length} tài liệu</span><span><LockKeyhole size={13} /> Tài liệu chỉ tải được khi có quyền truy cập</span></div>
            </section>

            <aside className="right-column">
              <section className="panel access-panel"><div className="panel-heading"><div><h2>Quyền truy cập</h2><p>Người có thể tải tài liệu</p></div><span className="access-shield"><ShieldCheck size={18} /></span></div>
                <div className="owner-card"><Avatar user={owner} size="lg" /><div className="member-copy"><strong>{owner?.name}</strong><span>Chủ sở hữu</span></div><span className="owner-tag">OWNER</span></div>
                {sharedUsers.length > 0 ? sharedUsers.map((user) => <div className="member-row" key={user.id}><Avatar user={user} size="md" /><div className="member-copy"><strong>{user.name}</strong><span>{user.title}</span></div><span className="member-check"><Check size={14} /></span></div>) : <div className="no-shared-members"><Users size={18} /><span>Chưa có thành viên được chia sẻ.</span></div>}
                <div className="access-divider" /><div className="access-rule"><div className="rule-icon"><LockKeyhole size={15} /></div><div><strong>Kiểm soát tải xuống</strong><p>Chỉ chủ sở hữu và thành viên đang được chia sẻ mới được tải tệp từ cơ hội.</p></div></div><div className="access-rule"><div className="rule-icon rule-icon-blue"><Clock3 size={15} /></div><div><strong>Lưu lịch sử tài liệu</strong><p>Mỗi tệp ghi nhận người tải lên và thời điểm chính xác.</p></div></div>
              </section>
              <section className="panel details-panel"><div className="panel-heading"><div><h2>Thông tin cơ hội</h2><p>Tóm tắt thương vụ đang chọn</p></div><button className="icon-button tiny-icon" aria-label="Tùy chọn thông tin"><MoreHorizontal size={17} /></button></div><div className="detail-line"><span>Giá trị dự kiến</span><strong>{selectedOpportunity.value.toLocaleString('vi-VN')} ₫</strong></div><div className="detail-line"><span>Ngày chốt dự kiến</span><strong>{new Date(`${selectedOpportunity.closingDate}T12:00:00`).toLocaleDateString('vi-VN')}</strong></div><div className="detail-line"><span>Giai đoạn</span><StageBadge opportunity={selectedOpportunity} /></div><div className="detail-line"><span>Mã cơ hội</span><strong className="mono-code">{selectedOpportunity.id}</strong></div><div className="detail-divider" /><div className="recent-label"><Sparkles size={14} /> HOẠT ĐỘNG GẦN NHẤT</div>
                {recentActivity ? <div className="recent-activity"><span className="recent-activity-dot" /><div><strong>{recentActivity.uploaderName} đã tải lên tài liệu</strong><span>{recentActivity.name}</span><small>{formatDateTime(recentActivity.uploadedAt)}</small></div></div> : <div className="recent-empty">Chưa có hoạt động tài liệu.</div>}
              </section>
              <div className="help-card"><div className="help-card-icon"><BookOpen size={18} /></div><div><strong>Mẹo quản lý hồ sơ</strong><p>Đặt tên tệp rõ ràng như “Bao-gia-v2.pdf” hoặc “Bien-ban-hop-16-10.pdf” để cả nhóm dễ tìm kiếm.</p><button onClick={() => setToast({ type: 'info', title: 'Quy tắc tài liệu', message: 'Nên dùng tên ngắn, có phiên bản và ngày tháng; tránh tải lên bản nháp có thông tin nhạy cảm khi chưa được duyệt.' })}>Xem hướng dẫn <ArrowLeft size={13} className="arrow-rotated" /></button></div></div>
            </aside>
          </div>
          <footer className="page-footer"><span>© 2026 SalesFlow CRM <i /> EP-07 · Tài liệu cơ hội</span><span><span className="footer-status-dot" /> Dữ liệu demo được lưu trên trình duyệt <span className="footer-separator">·</span> {totalFilesAcrossApp} tệp trong workspace</span></footer>
        </div>
      </main>
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
