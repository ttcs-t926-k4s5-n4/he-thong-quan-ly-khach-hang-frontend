import React, { useEffect, useState, useRef } from 'react'
import { api, API_BASE } from './api'
import { LeadPage, LeadImportPage, CampaignPage, LeadFormsPage, LeadDuplicatesPage, LeadScoringPage, LeadAssignmentPage, QuickLeadModal } from './Sprint4'
import {
  LayoutDashboard, Users, LogOut, KeyRound, BriefcaseBusiness, Menu, X, Upload, BookOpen, Search,
  ShieldCheck, Package, GitBranch, ListTree, FileClock, UserCircle, HeartHandshake, Merge, Building2,
  Tags, Settings2, ContactRound, AlertCircle, CheckCircle2, FileSpreadsheet, Filter, Plus, Edit,
  Lock, Unlock, Download, RefreshCw, ChevronDown, ChevronRight, ChevronUp, TrendingUp, DollarSign,
  Award, Clock, CheckSquare, Calendar, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Activity, Target,
  ArrowLeft, Eye, Zap
} from 'lucide-react'

const route = () => window.location.pathname
const go = p => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate')) }
const errText = e => e?.message || 'Có lỗi xảy ra.'
const isErrorNotice = text => !!text && /không|lỗi|sai|thất bại|bắt buộc|vui lòng|hãy|hết hạn|từ chối|khóa|không thể|không tồn tại/i.test(String(text))
const roleVi = { ADMIN: 'Quản trị hệ thống', DIRECTOR: 'Giám đốc kinh doanh', TEAM_LEADER: 'Trưởng nhóm', SALES: 'Nhân viên kinh doanh', MARKETING: 'Nhân viên Marketing', REPORT_VIEWER: 'Xem báo cáo' }
const scopeVi = { self: 'Cá nhân', group: 'Nhóm', all: 'Toàn bộ' }
const PATH_TITLES = {
  '/': 'Tổng quan', '/dashboard': 'Tổng quan', '/tong-quan': 'Tổng quan', '/profile': 'Hồ sơ cá nhân', '/change-password': 'Đổi mật khẩu',
  '/customers': 'Dữ liệu kinh doanh', '/crm-customers': 'Khách hàng doanh nghiệp', '/customer-360': 'Khách hàng 360°',
  '/customer-import': 'Nhập khách hàng Excel', '/customer-filter': 'Tìm & lọc khách hàng', '/duplicates': 'Gộp khách trùng',
  '/support': 'Hỗ trợ & rủi ro', '/care': 'Chăm sóc định kỳ', '/products': 'Sản phẩm & bảng giá', '/org': 'Cơ cấu kinh doanh',
  '/categories': 'Danh mục bán hàng', '/pipeline': 'Pipeline', '/reasons': 'Lý do thắng/thua', '/users': 'Quản lý người dùng',
  '/roles': 'Vai trò & nhóm', '/account-lock': 'Khóa & bàn giao', '/user-import': 'Nhập người dùng Excel',
  '/custom-fields': 'Trường tùy chỉnh', '/audit': 'Nhật ký thay đổi', '/outbox': 'Email demo', '/leads': 'Danh sách Lead',
  '/lead-import': 'Nhập Lead Excel', '/campaigns': 'Chiến dịch Marketing', '/lead-forms': 'Biểu mẫu nhúng',
  '/lead-duplicates': 'Gộp Lead trùng', '/lead-scoring': 'Chấm điểm Lead', '/lead-assignment': 'Phân bổ Lead'
}
const IMPLEMENTED_MENU_PATHS = new Set([
  '/', '/profile', '/change-password',
  '/customers', '/crm-customers', '/customer-360', '/customer-import', '/customer-filter', '/duplicates',
  '/support', '/care',
  '/products', '/org', '/categories', '/pipeline', '/reasons',
  '/users', '/roles', '/account-lock', '/user-import', '/custom-fields', '/audit', '/outbox',
  '/leads', '/lead-import', '/campaigns', '/lead-forms', '/lead-duplicates', '/lead-scoring', '/lead-assignment'
])
const cleanMenu = items => (items || []).filter(item => IMPLEMENTED_MENU_PATHS.has(item.path))

// Đồng bộ menu phía client theo vai trò để Sprint 4 luôn xuất hiện đúng quyền,
// kể cả khi trình duyệt còn giữ response menu cũ từ một backend trước đó.
// Backend vẫn là lớp phân quyền cuối cùng cho mọi API.
const STATIC_MENU_ITEMS = [
  {key:'home',label:'Tổng quan',path:'/',group:'Tổng quan & Cá nhân'},
  {key:'profile',label:'Hồ sơ cá nhân',path:'/profile',group:'Tổng quan & Cá nhân'},
  {key:'change-password',label:'Đổi mật khẩu',path:'/change-password',group:'Tổng quan & Cá nhân'},
  {key:'crm-customers',label:'Khách hàng doanh nghiệp',path:'/crm-customers',group:'Quản lý khách hàng'},
  {key:'customer360',label:'Khách hàng 360°',path:'/customer-360',group:'Quản lý khách hàng'},
  {key:'customer-filter',label:'Tìm & lọc khách hàng',path:'/customer-filter',group:'Quản lý khách hàng'},
  {key:'customer-import',label:'Nhập khách hàng Excel',path:'/customer-import',group:'Quản lý khách hàng'},
  {key:'customers',label:'Dữ liệu kinh doanh',path:'/customers',group:'Quản lý khách hàng'},
  {key:'duplicates',label:'Gộp khách trùng',path:'/duplicates',group:'Quản lý khách hàng'},
  {key:'care',label:'Chăm sóc định kỳ',path:'/care',group:'Chăm sóc & Hỗ trợ'},
  {key:'support',label:'Hỗ trợ & rủi ro',path:'/support',group:'Chăm sóc & Hỗ trợ'},
  {key:'leads',label:'Danh sách Lead',path:'/leads',group:'Lead & Marketing'},
  {key:'lead-forms',label:'Biểu mẫu nhúng',path:'/lead-forms',group:'Lead & Marketing'},
  {key:'lead-import',label:'Nhập Lead Excel',path:'/lead-import',group:'Lead & Marketing'},
  {key:'campaigns',label:'Chiến dịch Marketing',path:'/campaigns',group:'Lead & Marketing'},
  {key:'lead-duplicates',label:'Gộp Lead trùng',path:'/lead-duplicates',group:'Lead & Marketing'},
  {key:'lead-scoring',label:'Chấm điểm Lead',path:'/lead-scoring',group:'Lead & Marketing'},
  {key:'lead-assignment',label:'Phân bổ Lead',path:'/lead-assignment',group:'Lead & Marketing'},
  {key:'products',label:'Sản phẩm & bảng giá',path:'/products',group:'Cấu hình kinh doanh'},
  {key:'categories',label:'Danh mục bán hàng',path:'/categories',group:'Cấu hình kinh doanh'},
  {key:'pipeline',label:'Pipeline',path:'/pipeline',group:'Cấu hình kinh doanh'},
  {key:'reasons',label:'Lý do thắng/thua',path:'/reasons',group:'Cấu hình kinh doanh'},
  {key:'org',label:'Cơ cấu kinh doanh',path:'/org',group:'Cấu hình kinh doanh'},
  {key:'users',label:'Quản lý người dùng',path:'/users',group:'Quản trị hệ thống'},
  {key:'roles',label:'Vai trò & nhóm',path:'/roles',group:'Quản trị hệ thống'},
  {key:'lock',label:'Khóa & bàn giao',path:'/account-lock',group:'Quản trị hệ thống'},
  {key:'user-import',label:'Nhập người dùng Excel',path:'/user-import',group:'Quản trị hệ thống'},
  {key:'custom-fields',label:'Trường tùy chỉnh',path:'/custom-fields',group:'Quản trị hệ thống'},
  {key:'audit',label:'Nhật ký thay đổi',path:'/audit',group:'Quản trị hệ thống'},
  {key:'outbox',label:'Email demo',path:'/outbox',group:'Quản trị hệ thống'},
]

function menuForUserFrontend(items, user) {
  const roles = new Set(user?.roles || [])
  const customerRoles = ['ADMIN','DIRECTOR','TEAM_LEADER','SALES'].some(r => roles.has(r))
  const manager = ['ADMIN','DIRECTOR','TEAM_LEADER'].some(r => roles.has(r))
  const leadUser = ['ADMIN','DIRECTOR','MARKETING','TEAM_LEADER','SALES'].some(r => roles.has(r))
  const marketing = ['ADMIN','DIRECTOR','MARKETING'].some(r => roles.has(r))
  const director = roles.has('ADMIN') || roles.has('DIRECTOR')
  const admin = roles.has('ADMIN')

  const allowed = new Set(['/','/profile','/change-password'])
  if (customerRoles) ['/crm-customers','/customer-360','/customer-filter','/customer-import','/customers','/care','/support'].forEach(x => allowed.add(x))
  if (manager) allowed.add('/duplicates')
  if (leadUser) allowed.add('/leads')
  if (marketing) ['/lead-forms','/lead-import','/campaigns','/lead-duplicates'].forEach(x => allowed.add(x))
  if (director) ['/lead-scoring','/lead-assignment','/products','/categories','/pipeline','/reasons','/org'].forEach(x => allowed.add(x))
  if (roles.has('TEAM_LEADER')) allowed.add('/lead-assignment')
  if (admin) ['/users','/roles','/account-lock','/user-import','/custom-fields','/audit','/outbox'].forEach(x => allowed.add(x))

  const existing = new Map(cleanMenu(items).filter(x => allowed.has(x.path)).map(x => [x.path, x]))
  for (const item of STATIC_MENU_ITEMS) {
    if (allowed.has(item.path) && IMPLEMENTED_MENU_PATHS.has(item.path) && !existing.has(item.path)) existing.set(item.path, item)
  }
  // Giữ thứ tự chuẩn để nhóm Lead & Marketing luôn nằm đúng vị trí trên sidebar.
  return STATIC_MENU_ITEMS.filter(x => existing.has(x.path)).map(x => ({...x, ...existing.get(x.path)}))
}

const viRoles = r => (r || []).map(x => roleVi[x] || x).join(', ')

function Notice({ text, type = 'ok' }) {
  if (!text) return null
  return (
    <div className={'notice ' + type}>
      {type === 'err' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{text}</span>
    </div>
  )
}

function Field({ label, ...p }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...p} />
    </label>
  )
}

function Select({ label, children, ...p }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...p}>{children}</select>
    </label>
  )
}

function formatDateVi(val) {
  if (!val) return '-'
  if (typeof val === 'string' && val.includes('T') && val.includes(':')) {
    try {
      const d = new Date(val)
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      }
    } catch (e) {}
  }
  return val
}

function formatTableCell(val) {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'string') {
    if (val.includes('T') && val.includes(':')) {
      const formatted = formatDateVi(val)
      if (formatted !== val) return formatted
    }
    const t = val.trim()
    if (['active', 'Đang hoạt động', 'Có', 'Thắng', 'Khách hàng', 'Đã đóng', 'Đã duyệt', 'Bắt buộc'].includes(t)) {
      return <span className="badge badge-success">{t === 'active' ? 'Đang hoạt động' : t}</span>
    }
    if (['pending', 'Chờ kích hoạt', 'Đang giao dịch', 'Tiềm năng', 'Thấp', 'Trung bình', 'Nháp', 'Chờ duyệt chiết khấu'].includes(t)) {
      return <span className="badge badge-warning">{t === 'pending' ? 'Chờ kích hoạt' : t}</span>
    }
    if (['locked', 'Đã khóa', 'Thua', 'Ngừng hợp tác', 'Không', 'Cao', 'Người cản trở'].includes(t)) {
      return <span className="badge badge-danger">{t === 'locked' ? 'Đã khóa' : t}</span>
    }
    if (['Cá nhân', 'Nhóm', 'Toàn bộ', 'Quản trị hệ thống', 'Giám đốc kinh doanh', 'Trưởng nhóm', 'Nhân viên kinh doanh', 'Nhân viên Marketing', 'Xem báo cáo'].includes(t)) {
      return <span className="badge badge-info">{t}</span>
    }
  }
  return val
}

function Pagination({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange, pageSizeOptions = [7, 15, 30, 50, 100] }) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (totalItems === 0) return null

  return (
    <div className="table-pagination-bar">
      <div className="pagination-info">
        <span>Hiển thị <b>{startItem}</b> - <b>{endItem}</b> trong tổng số <b>{totalItems}</b> bản ghi</span>
        {onPageSizeChange && (
          <div className="page-size-selector">
            <span>Hiển thị:</span>
            <div className="page-size-pills">
              {pageSizeOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`size-pill-btn ${opt === pageSize ? 'active' : ''}`}
                  onClick={() => onPageSizeChange(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button 
          type="button"
          className="pagination-btn" 
          disabled={currentPage <= 1} 
          onClick={() => onPageChange(1)}
          title="Trang đầu"
        >
          «
        </button>
        <button 
          type="button"
          className="pagination-btn" 
          disabled={currentPage <= 1} 
          onClick={() => onPageChange(currentPage - 1)}
          title="Trang trước"
        >
          ‹
        </button>

        {getPageNumbers().map(p => (
          <button
            key={p}
            type="button"
            className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button 
          type="button"
          className="pagination-btn" 
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
          title="Trang sau"
        >
          ›
        </button>
        <button 
          type="button"
          className="pagination-btn" 
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange(totalPages)}
          title="Trang cuối"
        >
          »
        </button>
      </div>
    </div>
  )
}

function Table({ 
  headers, 
  rows, 
  defaultPageSize = 7, 
  enablePagination = true, 
  enableSearch = false,
  searchPlaceholder = 'Tìm nhanh trong bảng...'
}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setPage(1)
  }, [rows.length, searchTerm])

  const filteredRows = React.useMemo(() => {
    if (!searchTerm.trim()) return rows
    const term = searchTerm.toLowerCase().trim()
    return rows.filter(row => {
      return row.some(cell => {
        if (cell === null || cell === undefined) return false
        if (typeof cell === 'string' || typeof cell === 'number') {
          return String(cell).toLowerCase().includes(term)
        }
        if (React.isValidElement(cell)) {
          const text = String(cell.props?.children || '').toLowerCase()
          return text.includes(term)
        }
        return false
      })
    })
  }, [rows, searchTerm])

  const shouldPaginate = enablePagination && filteredRows.length > 0
  const displayedRows = shouldPaginate 
    ? filteredRows.slice((page - 1) * pageSize, page * pageSize) 
    : filteredRows

  return (
    <div className="table-wrap-container">
      {enableSearch && rows.length > 5 && (
        <div className="table-top-bar">
          <div className="table-search-box">
            <Search size={15} className="table-search-icon" />
            <input 
              type="text" 
              className="table-search-input"
              placeholder={searchPlaceholder} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="table-search-clear" onClick={() => setSearchTerm('')} title="Xóa tìm kiếm">
                <X size={14} />
              </button>
            )}
          </div>
          {searchTerm && (
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Tìm thấy <b>{filteredRows.length}</b> / {rows.length} bản ghi
            </span>
          )}
        </div>
      )}

      <div className="table-wrap" style={{ marginTop: 0 }}>
        <table>
          <thead>
            <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {displayedRows.length ? (
              displayedRows.map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => <td key={j}>{formatTableCell(v)}</td>)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 24px', fontSize: '14px' }}>
                  {searchTerm ? 'Không tìm thấy dữ liệu phù hợp với từ khóa.' : 'Chưa có dữ liệu.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {shouldPaginate && (
        <Pagination 
          currentPage={page}
          totalItems={filteredRows.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  )
}

function StatCard({ title, value, subtext, icon: Icon, color = '#4f46e5', bgLight = '#eef2ff' }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <div className="stat-card-title">{title}</div>
        {Icon && (
          <div style={{ background: bgLight, color: color, padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="stat-card-val" style={{ color }}>{value}</div>
      {subtext && <div style={{ fontSize: '12.5px', color, fontWeight: 600 }}>{subtext}</div>}
    </div>
  )
}

function Modal({ isOpen, onClose, title, icon: Icon, children, maxWidth = '650px' }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth }}>
        <div className="modal-header">
          <h3>
            {Icon && <Icon size={20} color="#4f46e5" />}
            {title}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

function download(url, name) {
  fetch(API_BASE + url, { credentials: 'include' })
    .then(async r => {
      if (!r.ok) throw new Error('Không thể tải tệp')
      const b = await r.blob()
      const u = URL.createObjectURL(b)
      const a = document.createElement('a')
      a.href = u
      a.download = name
      a.click()
      URL.revokeObjectURL(u)
    })
    .catch(e => alert(e.message))
}

function Login({ onLogin, initialMessage = '' }) {
  const [e, setE] = useState('admin@crm.local')
  const [p, setP] = useState('Admin@123')
  const [m, setM] = useState(initialMessage)

  async function submit(x) {
    x.preventDefault()
    try {
      const d = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: e, password: p }) })
      onLogin(d.user, d.menu)
    } catch (er) {
      setM(errText(er))
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-container">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-header">
            <div className="logo"><Building2 size={32} /></div>
            <h1>Hệ thống quản lý khách hàng</h1>
            <p>Đăng nhập tài khoản để làm việc</p>
          </div>

          <Notice text={m} type="err" />

          <div className="login-rule">
            <ShieldCheck size={18} />
            <div>
              <b>Quy định đăng nhập:</b> Sai 5 lần liên tiếp sẽ khóa tạm 15 phút.
            </div>
          </div>

          <Field label="Email đăng nhập" value={e} onChange={x => setE(x.target.value)} placeholder="admin@crm.local" required />
          <Field label="Mật khẩu" type="password" value={p} onChange={x => setP(x.target.value)} placeholder="••••••••" required />

          <button type="submit" className="primary auth-submit">Đăng nhập</button>
          <button type="button" className="link" onClick={() => go('/forgot-password')}>Quên mật khẩu?</button>
        </form>
      </div>
    </div>
  )
}

function Forgot() {
  const [e, setE] = useState('')
  const [m, setM] = useState('')

  return (
    <div className="auth-shell">
      <div className="auth-container">
        <form className="auth-card" onSubmit={async x => {
          x.preventDefault()
          try {
            setM((await api('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: e }) })).message)
          } catch (er) {
            setM(errText(er))
          }
        }}>
          <div className="auth-header">
            <div className="logo sm"><KeyRound size={24} /></div>
            <h1>Quên mật khẩu</h1>
            <p>Nhập email để nhận liên kết khôi phục mật khẩu</p>
          </div>

          <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
          <Field label="Email đăng ký" value={e} onChange={x => setE(x.target.value)} placeholder="email@crm.local" required />
          <button type="submit" className="primary auth-submit">Gửi liên kết khôi phục</button>
          <button type="button" className="link" onClick={() => go('/')}>Quay lại đăng nhập</button>
        </form>
      </div>
    </div>
  )
}

function Reset() {
  const t = new URLSearchParams(location.search).get('token') || ''
  const [p, setP] = useState('')
  const [c, setC] = useState('')
  const [m, setM] = useState('')

  return (
    <div className="auth-shell">
      <div className="auth-container">
        <form className="auth-card" onSubmit={async x => {
          x.preventDefault()
          try {
            setM((await api('/api/auth/reset-password/' + t, { method: 'POST', body: JSON.stringify({ password: p, password_confirmation: c }) })).message)
          } catch (er) {
            setM(errText(er))
          }
        }}>
          <div className="auth-header">
            <div className="logo sm"><KeyRound size={24} /></div>
            <h1>Đặt lại mật khẩu</h1>
            <p>Tạo mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
          <Field label="Mật khẩu mới" type="password" value={p} onChange={e => setP(e.target.value)} placeholder="••••••••" required />
          <Field label="Xác nhận mật khẩu" type="password" value={c} onChange={e => setC(e.target.value)} placeholder="••••••••" required />
          <button type="submit" className="primary auth-submit">Lưu mật khẩu mới</button>
          <button type="button" className="link" onClick={() => go('/')}>Về đăng nhập</button>
        </form>
      </div>
    </div>
  )
}

function Activate() {
  const t = new URLSearchParams(location.search).get('token') || ''
  const [m, setM] = useState('Đang kích hoạt tài khoản...')

  useEffect(() => {
    api('/api/auth/activate/' + t, { method: 'POST' })
      .then(d => setM(d.message))
      .catch(e => setM(errText(e)))
  }, [])

  return (
    <div className="auth-shell">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo sm"><ShieldCheck size={24} /></div>
            <h1>Kích hoạt tài khoản</h1>
          </div>
          <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
          <button className="primary auth-submit" onClick={() => go('/')}>Đăng nhập ngay</button>
        </div>
      </div>
    </div>
  )
}

function ErrorPage({ code = '404', title = 'Không tìm thấy trang' }) {
  const description = code === '403'
    ? 'Tài khoản hiện tại không được cấp quyền sử dụng chức năng này. Mục này cũng sẽ không xuất hiện trên thanh công cụ.'
    : 'Đường dẫn bạn mở không tồn tại hoặc chức năng chưa được triển khai.'
  return (
    <div className="error-page">
      <div className="error-box">
        <div className="error-code">{code}</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <button type="button" className="primary" style={{ margin: '0 auto' }} onClick={() => go('/')}>Về trang Tổng quan</button>
      </div>
    </div>
  )
}

const icons = {
  home: <LayoutDashboard size={17} />,
  customers: <BriefcaseBusiness size={17} />,
  profile: <UserCircle size={17} />,
  users: <Users size={17} />,
  products: <Package size={17} />,
  org: <ListTree size={17} />,
  categories: <Tags size={17} />,
  pipeline: <GitBranch size={17} />,
  reasons: <BookOpen size={17} />,
  audit: <FileClock size={17} />,
  'custom-fields': <Settings2 size={17} />,
  'user-import': <Upload size={17} />,
  'crm-customers': <Building2 size={17} />,
  customer360: <ContactRound size={17} />,
  'customer-import': <Upload size={17} />,
  'customer-filter': <Search size={17} />,
  support: <HeartHandshake size={17} />,
  care: <HeartHandshake size={17} />,
  duplicates: <Merge size={17} />,
  'change-password': <KeyRound size={17} />,
  roles: <ShieldCheck size={17} />,
  lock: <Lock size={17} />,
  outbox: <FileClock size={17} />,
  leads: <Target size={17} />,
  'lead-forms': <FileSpreadsheet size={17} />,
  'lead-import': <Upload size={17} />,
  campaigns: <BarChart3 size={17} />,
  'lead-duplicates': <Merge size={17} />,
  'lead-scoring': <TrendingUp size={17} />,
  'lead-assignment': <GitBranch size={17} />
}

function UserFooter({ user, onLogout, onNavigate, currentPath }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="user-footer-wrap" ref={ref}>
      {open && (
        <div className="user-popover-menu">
          <div className="user-popover-header">
            <strong>{user.full_name}</strong>
            <small>{user.email || 'Tài khoản cá nhân'}</small>
          </div>
          <div className="user-popover-divider" />
          <button 
            type="button"
            className={`user-popover-item ${currentPath === '/profile' ? 'active' : ''}`}
            onClick={() => { onNavigate('/profile'); setOpen(false); }}
          >
            <UserCircle size={17} />
            <span>Hồ sơ cá nhân</span>
          </button>
          <button 
            type="button"
            className={`user-popover-item ${currentPath === '/change-password' ? 'active' : ''}`}
            onClick={() => { onNavigate('/change-password'); setOpen(false); }}
          >
            <KeyRound size={17} />
            <span>Đổi mật khẩu</span>
          </button>
          <div className="user-popover-divider" />
          <button 
            type="button"
            className="user-popover-item logout-item"
            onClick={() => { setOpen(false); onLogout(); }}
          >
            <LogOut size={17} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}

      <button type="button" className={`user-footer-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <div className="user-avatar-badge">
          {user.avatar_thumb_path ? (
            <img 
              className="user-avatar-badge-img" 
              src={`${API_BASE}/api/s2/profile/avatar/thumb?x=${user._ts || 1}`} 
              alt="Avatar" 
            />
          ) : (
            user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'
          )}
        </div>
        <div className="user-info">
          <b>{user.full_name}</b>
          <span>{viRoles(user.roles)}</span>
          {user.group_name && <small>Nhóm: {user.group_name}</small>}
        </div>
        <ChevronUp size={16} className={`user-chevron ${open ? 'rotated' : ''}`} />
      </button>
    </div>
  )
}

function SidebarNav({ menu, currentPath, onNavigate }) {
  const [search, setSearch] = useState('')

  const keyToGroup = {
    home: 'Bàn làm việc',
    'crm-customers': 'Quản lý khách hàng',
    customer360: 'Quản lý khách hàng',
    'customer-filter': 'Quản lý khách hàng',
    'customer-import': 'Quản lý khách hàng',
    customers: 'Quản lý khách hàng',
    duplicates: 'Quản lý khách hàng',
    care: 'Chăm sóc & Hỗ trợ',
    support: 'Chăm sóc & Hỗ trợ',
    products: 'Cấu hình kinh doanh',
    categories: 'Cấu hình kinh doanh',
    pipeline: 'Cấu hình kinh doanh',
    reasons: 'Cấu hình kinh doanh',
    users: 'Quản trị hệ thống',
    roles: 'Quản trị hệ thống',
    org: 'Quản trị hệ thống',
    lock: 'Quản trị hệ thống',
    'user-import': 'Quản trị hệ thống',
    'custom-fields': 'Quản trị hệ thống',
    audit: 'Quản trị hệ thống',
    outbox: 'Quản trị hệ thống',
    leads: 'Lead & Marketing',
    'lead-forms': 'Lead & Marketing',
    'lead-import': 'Lead & Marketing',
    campaigns: 'Lead & Marketing',
    'lead-duplicates': 'Lead & Marketing',
    'lead-scoring': 'Lead & Marketing',
    'lead-assignment': 'Lead & Marketing'
  }

  const groupOf = item => {
    if (!item) return 'Bàn làm việc'
    const raw = item.group || keyToGroup[item.key] || 'Bàn làm việc'
    return raw === 'Tổng quan & Cá nhân' ? 'Bàn làm việc' : raw
  }

  // Chỉ dựng các module mà menu từ backend thực sự cho phép.
  // Điều này ngăn Marketing/Sales nhìn thấy module không thuộc quyền rồi mới gặp 403.
  const moduleDefs = [
    { key: 'home', label: 'Bàn làm việc', preferredPath: '/', group: 'Bàn làm việc', icon: <LayoutDashboard size={20} />, subtext: 'Tổng quan & cá nhân' },
    { key: 'crm-customers', label: 'Quản lý khách hàng', preferredPath: '/crm-customers', group: 'Quản lý khách hàng', icon: <Building2 size={20} />, subtext: 'Khách hàng, 360°, lọc & dữ liệu' },
    { key: 'leads', label: 'Lead & Marketing', preferredPath: '/leads', group: 'Lead & Marketing', icon: <Target size={20} />, subtext: 'Thu thập, chấm điểm & phân bổ Lead' },
    { key: 'care', label: 'Chăm sóc & Hỗ trợ', preferredPath: '/care', group: 'Chăm sóc & Hỗ trợ', icon: <HeartHandshake size={20} />, subtext: 'Lịch chăm sóc & hỗ trợ' },
    { key: 'products', label: 'Cấu hình kinh doanh', preferredPath: '/products', group: 'Cấu hình kinh doanh', icon: <Settings2 size={20} />, subtext: 'Sản phẩm, Pipeline & cơ cấu' },
    { key: 'users', label: 'Quản trị hệ thống', preferredPath: '/users', group: 'Quản trị hệ thống', icon: <ShieldCheck size={20} />, subtext: 'Người dùng & phân quyền' },
  ]
  const availableGroups = new Set(menu.map(groupOf))
  const mainModules = moduleDefs
    .filter(mod => availableGroups.has(mod.group))
    .map(mod => {
      const groupItems = menu.filter(item => groupOf(item) === mod.group)
      const preferred = groupItems.find(item => item.path === mod.preferredPath)
      return { ...mod, path: preferred?.path || groupItems[0]?.path || '/' }
    })

  const getCurrentGroup = (path) => {
    const item = menu.find(m => m.path === path)
    return groupOf(item)
  }

  const activeGroup = getCurrentGroup(currentPath)

  const filteredMenu = menu.filter(m => {
    if (m.key === 'profile' || m.key === 'change-password') return false
    if (!search.trim()) return false
    const q = search.toLowerCase()
    return m.label.toLowerCase().includes(q) || m.key.toLowerCase().includes(q)
  })

  return (
    <div className="nav-container">
      <div className="nav-search-wrap">
        <Search size={15} className="nav-search-icon" />
        <input 
          type="text" 
          placeholder="Gõ để tìm nhanh chức năng..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="nav-search-input"
        />
        {search && (
          <button type="button" className="nav-search-clear" onClick={() => setSearch('')}>
            <X size={14} />
          </button>
        )}
      </div>

      {search ? (
        <div className="nav-search-results">
          {filteredMenu.map(m => (
            <button
              key={m.key}
              className={`nav-item ${currentPath === m.path ? 'active' : ''}`}
              onClick={() => { setSearch(''); onNavigate(m.path); }}
            >
              <span className="nav-icon">{icons[m.key] || <BriefcaseBusiness size={18} />}</span>
              <span className="nav-label">{m.label}</span>
            </button>
          ))}
          {filteredMenu.length === 0 && (
            <div className="nav-no-results">Không tìm thấy chức năng phù hợp.</div>
          )}
        </div>
      ) : (
        <nav className="main-modules-nav">
          {mainModules.map(mod => {
            const isActive = activeGroup === mod.group
            return (
              <button
                key={mod.key}
                className={`module-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(mod.path)}
              >
                <div className="module-nav-icon">{mod.icon}</div>
                <div className="module-nav-text">
                  <div className="module-nav-title">{mod.label}</div>
                  <div className="module-nav-sub">{mod.subtext}</div>
                </div>
                {isActive && <ChevronRight size={18} className="module-nav-arrow" />}
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}

function GroupSubNav({ menu, currentPath, onNavigate }) {
  const keyToGroup = {
    home: 'Bàn làm việc',
    profile: 'Bàn làm việc',
    'change-password': 'Bàn làm việc',
    'crm-customers': 'Quản lý khách hàng',
    customer360: 'Quản lý khách hàng',
    'customer-filter': 'Quản lý khách hàng',
    'customer-import': 'Quản lý khách hàng',
    customers: 'Quản lý khách hàng',
    duplicates: 'Quản lý khách hàng',
    care: 'Chăm sóc & Hỗ trợ',
    support: 'Chăm sóc & Hỗ trợ',
    products: 'Cấu hình kinh doanh',
    categories: 'Cấu hình kinh doanh',
    pipeline: 'Cấu hình kinh doanh',
    reasons: 'Cấu hình kinh doanh',
    users: 'Quản trị hệ thống',
    roles: 'Quản trị hệ thống',
    org: 'Quản trị hệ thống',
    lock: 'Quản trị hệ thống',
    'user-import': 'Quản trị hệ thống',
    'custom-fields': 'Quản trị hệ thống',
    audit: 'Quản trị hệ thống',
    outbox: 'Quản trị hệ thống',
    leads: 'Lead & Marketing',
    'lead-forms': 'Lead & Marketing',
    'lead-import': 'Lead & Marketing',
    campaigns: 'Lead & Marketing',
    'lead-duplicates': 'Lead & Marketing',
    'lead-scoring': 'Lead & Marketing',
    'lead-assignment': 'Lead & Marketing'
  }

  const normalizeGroup = item => {
    if (!item) return 'Bàn làm việc'
    const raw = item.group || keyToGroup[item.key] || 'Khác'
    return raw === 'Tổng quan & Cá nhân' ? 'Bàn làm việc' : raw
  }

  const currentItem = menu.find(m => m.path === currentPath) || 
    (['/dashboard','/tong-quan'].includes(currentPath) ? (menu.find(m=>m.path==='/') || { key:'home', label:'Tổng quan', path:'/', group:'Tổng quan & Cá nhân' }) :
     currentPath === '/profile' ? { key: 'profile', label: 'Hồ sơ cá nhân', path: '/profile', group:'Tổng quan & Cá nhân' } :
     currentPath === '/change-password' ? { key: 'change-password', label: 'Đổi mật khẩu', path: '/change-password', group:'Tổng quan & Cá nhân' } : null)

  if (!currentItem) return null

  const groupName = normalizeGroup(currentItem)

  const allNavItems = [...menu]
  if (!allNavItems.some(m => m.path === '/profile')) {
    allNavItems.push({ key: 'profile', label: 'Hồ sơ cá nhân', path: '/profile', group: 'Bàn làm việc' })
  }
  if (!allNavItems.some(m => m.path === '/change-password')) {
    allNavItems.push({ key: 'change-password', label: 'Đổi mật khẩu', path: '/change-password', group: 'Bàn làm việc' })
  }

  const groupItems = allNavItems.filter(m => normalizeGroup(m) === groupName)

  if (groupItems.length <= 1) return null

  return (
    <div className="top-group-sub-nav">
      <div className="top-sub-nav-header">
        <div className="top-sub-nav-title">
          <span className="top-sub-nav-badge">NHÓM CHỨC NĂNG</span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>{groupName}</h2>
          <span className="top-sub-nav-count">{groupItems.length} công cụ</span>
        </div>
      </div>
      <div className="top-sub-nav-tabs">
        {groupItems.map(item => {
          const isActive = item.path === currentPath
          return (
            <button
              key={item.key}
              type="button"
              className={`top-sub-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              <span className="tab-icon">{icons[item.key] || <BriefcaseBusiness size={18} />}</span>
              <span className="tab-label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Shell({ user, menu, onLogout, children }) {
  const [o, setO] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [showGlobalQuickLead, setShowGlobalQuickLead] = useState(false)
  useEffect(() => { api('/api/notifications').then(d => setAlerts(d.items || [])).catch(() => {}) }, [user?.id])
  const currentNav = menu.find(m => route() === m.path)
  const currentTitle = currentNav?.label || PATH_TITLES[route()] || (route() === '/' ? 'Tổng quan' : 'Trang không xác định')
  const unreadAlerts = alerts.filter(x => !x.is_read)
  const canOpenSupport = menu.some(x => x.path === '/support')
  const roles = new Set(user?.roles || [])
  const canCreateLead = roles.has('ADMIN') || roles.has('DIRECTOR') || roles.has('MARKETING')


  return (
    <div className="app">
      {o && <div className="sidebar-backdrop" onClick={() => setO(false)} />}
      <aside className={'sidebar ' + (o ? 'open' : '')}>
        <div className="side-head">
          <div className="brand">
            <div className="brand-icon"><Building2 size={22} /></div>
            <div className="brand-text">
              <strong>CRM ENTERPRISE</strong>
              <small>Quản lý khách hàng</small>
            </div>
          </div>
          <button className="icon mobile close-sidebar" onClick={() => setO(false)}><X size={20} /></button>
        </div>

        <SidebarNav 
          menu={menu} 
          currentPath={route()} 
          onNavigate={(p) => { go(p); setO(false); }} 
        />

        <UserFooter 
          user={user} 
          onLogout={onLogout} 
          onNavigate={(p) => { go(p); setO(false); }} 
          currentPath={route()} 
        />
      </aside>

      <main>
        <header>
          <div className="header-left">
            <button className="icon mobile" onClick={() => setO(true)}><Menu size={22} /></button>
            <div className="header-title-box">
              <span className="header-badge">CRM System</span>
              <h1 className="header-current-page">{currentTitle}</h1>
            </div>
          </div>
          <div className="header-right">
            {canCreateLead && (
              <button
                type="button"
                className="s4-header-quick-btn"
                onClick={() => setShowGlobalQuickLead(true)}
                title="Tạo nhanh 1 Lead mới ngay tại đây mà không cần chuyển trang"
              >
                <Zap size={14} /> + Tạo Lead nhanh
              </button>
            )}
            {unreadAlerts.length > 0 && canOpenSupport && <button type="button" className="secondary small-btn risk-alert-btn" onClick={() => go('/support')} title={unreadAlerts.map(x=>x.message).join('\n')}>⚠ {unreadAlerts.length} cảnh báo rủi ro</button>}
            <div className="header-user-pill">
              <span className="user-online-dot" title="Đang hoạt động"></span>
              {user.avatar_thumb_path ? (
                <img 
                  className="header-avatar-img" 
                  src={`${API_BASE}/api/s2/profile/avatar/thumb?x=${user._ts || 1}`} 
                  alt="Avatar" 
                />
              ) : (
                <UserCircle size={18} color="#2563eb" />
              )}
              <span>{user.full_name}</span>
              <span className="scope-tag">{scopeVi[user.data_scope] || user.data_scope}</span>
            </div>
          </div>
        </header>
        <div className="content">
          <GroupSubNav menu={menu} currentPath={route()} onNavigate={go} />
          {children}
        </div>
        <QuickLeadModal
          isOpen={showGlobalQuickLead}
          onClose={() => setShowGlobalQuickLead(false)}
          onSuccess={() => {}}
        />
      </main>
    </div>
  )
}

function Home({ user, menu }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [err, setErr] = useState('')
  const [timeRange, setTimeRange] = useState('month')
  const [activeTab, setActiveTab] = useState('revenue')
  const [checkedTasks, setCheckedTasks] = useState({})

  const allowedPaths = React.useMemo(() => new Set((menu || []).map(x => x.path)), [menu])
  const can = path => allowedPaths.has(path)
  const roles = new Set(user?.roles || [])
  const canSeeTeamRanking = roles.has('ADMIN') || roles.has('DIRECTOR') || roles.has('TEAM_LEADER')
  const hasBusinessDashboard = can('/crm-customers') || can('/customers') || can('/care') || can('/support') || can('/pipeline')
  const marketingOnly = roles.has('MARKETING') && !hasBusinessDashboard

  const fetchStats = (isSilent = false) => {
    if (!hasBusinessDashboard) {
      setStats({})
      setErr('')
      setLoading(false)
      setRefreshing(false)
      return
    }
    if (!isSilent) setLoading(true)
    else setRefreshing(true)
    setErr('')

    api('/api/dashboard/stats')
      .then(d => setStats(d))
      .catch(e => {
        setErr(errText(e))
        // Fallback gracefully to demo state if API fails
        setStats({
          total_customers: 128,
          total_opportunities: 42,
          pipeline_value: 3850000000,
          won_value: 1420000000,
          won_count: 14,
          open_tickets: 2,
          care_due_count: 5,
          conversion_rate: 33.3,
          stages: [
            { stage: 'Mới tạo', count: 12, value: 950000000 },
            { stage: 'Tiếp cận', count: 10, value: 820000000 },
            { stage: 'Báo giá', count: 8, value: 740000000 },
            { stage: 'Thương lượng', count: 6, value: 680000000 },
            { stage: 'Chốt hợp đồng', count: 6, value: 660000000 }
          ],
          top_opportunities: [
            { id: 1, title: 'Hợp đồng ERP Tập đoàn Alpha', customer_name: 'Tập đoàn Alpha', value: 850000000, stage: 'Thương lượng', win_probability: 80, owner_name: user.full_name },
            { id: 2, title: 'Triển khai CRM cho Beta Corp', customer_name: 'Công ty Beta', value: 620000000, stage: 'Báo giá', win_probability: 65, owner_name: 'Nguyễn Văn A' },
            { id: 3, title: 'Gói bảo trì hệ thống Gamma', customer_name: 'Tập đoàn Gamma', value: 450000000, stage: 'Chốt', win_probability: 95, owner_name: 'Trần Thị B' },
            { id: 4, title: 'Nâng cấp Hạ tầng Cloud Delta', customer_name: 'Delta Tech', value: 380000000, stage: 'Tiếp cận', win_probability: 40, owner_name: user.full_name },
            { id: 5, title: 'Tư vấn Chuyển đổi số Epsilon', customer_name: 'Epsilon Group', value: 290000000, stage: 'Mới tạo', win_probability: 30, owner_name: 'Lê Văn C' }
          ],
          recent_activities: [
            { id: 101, subject: 'Họp chốt hợp đồng dự án ERP', activity_type: 'Cuộc họp', customer_name: 'Tập đoàn Alpha', owner_name: user.full_name, created_at: new Date().toISOString() },
            { id: 102, subject: 'Gửi báo giá dịch vụ CRM 2026', activity_type: 'Email', customer_name: 'Công ty Beta', owner_name: 'Nguyễn Văn A', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
            { id: 103, subject: 'Gọi điện xác nhận lịch hẹn demo', activity_type: 'Cuộc gọi', customer_name: 'Delta Tech', owner_name: user.full_name, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
            { id: 104, subject: 'Tải tài liệu giới thiệu giải pháp', activity_type: 'Ghi chú', customer_name: 'Tập đoàn Gamma', owner_name: 'Trần Thị B', created_at: new Date(Date.now() - 3600000 * 24).toISOString() }
          ],
          recent_customers: [
            { id: 201, name: 'Công ty Cổ phần Công nghệ Alpha', email: 'contact@alpha.vn', phone: '0901234567', owner_name: user.full_name, created_at: new Date().toISOString() },
            { id: 202, name: 'Tập đoàn Bất động sản Horizon', email: 'info@horizon.com', phone: '0988776655', owner_name: 'Nguyễn Văn A', created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 203, name: 'Công ty TNHH Giải pháp Phần mềm Việt', email: 'sales@vsoft.vn', phone: '0912348899', owner_name: 'Trần Thị B', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
          ],
          team_performance: [
            { full_name: user.full_name, total_deals: 18, won_val: 850000000, pipe_val: 1650000000 },
            { full_name: 'Nguyễn Văn A', total_deals: 14, won_val: 620000000, pipe_val: 1200000000 },
            { full_name: 'Trần Thị B', total_deals: 10, won_val: 450000000, pipe_val: 900000000 }
          ]
        })
      })
      .finally(() => {
        setLoading(false)
        setRefreshing(false)
      })
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) return <div className="loading">Đang tải bảng tổng quan kinh doanh...</div>

  const totalCust = stats?.total_customers || 0
  const totalOppVal = stats?.pipeline_value || 0
  const wonVal = stats?.won_value || 0
  const wonCount = stats?.won_count || 0
  const openTickets = stats?.open_tickets || 0
  const careDue = stats?.care_due_count || 0
  const convRate = stats?.conversion_rate || 0
  const stages = stats?.stages || []
  const topOpps = stats?.top_opportunities || []
  const recentActivities = stats?.recent_activities || []
  const recentCust = stats?.recent_customers || []
  const teamPerf = stats?.team_performance || []

  // Monthly Revenue Chart Data
  const monthlyData = [
    { month: 'Thg 5', target: 800, actual: 750 },
    { month: 'Thg 6', target: 900, actual: 920 },
    { month: 'Thg 7', target: 1000, actual: 1100 },
    { month: 'Thg 8', target: 1100, actual: 1050 },
    { month: 'Thg 9', target: 1200, actual: 1350 },
    { month: 'Thg 10', target: 1400, actual: Math.round(wonVal / 1000000) || 1420 }
  ]
  const maxMonthly = Math.max(...monthlyData.map(x => Math.max(x.target, x.actual)), 1)

  const defaultTasks = [
    { id: 1, title: 'Gửi báo giá dự án ERP cho Tập đoàn Alpha', tag: 'Ưu tiên cao', due: 'Hôm nay' },
    { id: 2, title: 'Gọi điện chăm sóc 5 khách hàng quá hạn 30 ngày', tag: 'Chăm sóc', due: 'Hôm nay' },
    { id: 3, title: 'Phê duyệt hợp đồng cung cấp phần mềm CRM', tag: 'Hợp đồng', due: 'Ngày mai' },
    { id: 4, title: 'Rà soát và gộp trùng 2 hồ sơ khách hàng doanh nghiệp', tag: 'Hệ thống', due: 'Tuần này' }
  ]

  const toggleTask = id => {
    setCheckedTasks(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleTab = tabKey => {
    setActiveTab(prev => (prev === tabKey ? 'none' : tabKey))
  }

  return (
    <div className="dashboard-container">
      {/* Dynamic Header Hero Banner */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <h2>
            <LayoutDashboard size={28} />
            {marketingOnly ? 'Tổng quan Lead & Marketing' : hasBusinessDashboard ? 'Tổng quan Kinh doanh Enterprise' : 'Bàn làm việc cá nhân'}
          </h2>
          <p>
            {marketingOnly ? 'Truy cập nhanh các công cụ thu thập, chiến dịch và quản lý Lead' : hasBusinessDashboard ? 'Báo cáo thời gian thực theo phạm vi dữ liệu được cấp' : 'Các chức năng cá nhân và thông tin tài khoản'} · <b>{user.full_name}</b> ({viRoles(user.roles)}) · Phạm vi: <b>{scopeVi[user.data_scope] || user.data_scope}</b>
          </p>
          <div className="hero-badge-pill">
            <Activity size={13} color="#818cf8" />
            <span>Hệ thống CRM hoạt động ổn định · Cập nhật mới nhất lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="hero-actions">
          {can('/crm-customers') && <button type="button" className="primary" onClick={() => go('/crm-customers')}>
            <Plus size={16} /> Thêm khách hàng
          </button>}
          {!can('/crm-customers') && can('/leads') && <button type="button" className="primary" onClick={() => go('/leads')}>
            <Target size={16} /> Mở danh sách Lead
          </button>}
          {can('/customers') && <button type="button" className="secondary" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }} onClick={() => download('/api/data/export', 'bao-cao-tong-quan.xlsx')}>
            <Download size={16} /> Xuất Excel
          </button>}
        </div>
      </div>

      {err && (
        <div className="notice err" style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c' }}>
          <AlertCircle size={18} />
          <span><b>Chế độ xem demo</b>: Không thể lấy dữ liệu trực tiếp từ API ({err}). Đã tự động kích hoạt dữ liệu mô phỏng.</span>
          <button className="refresh-btn" style={{ marginLeft: 'auto', background: '#fff' }} onClick={() => fetchStats()}>
            <RefreshCw size={13} /> Thử kết nối lại
          </button>
        </div>
      )}

      {/* TOP PLACEMENT: Interactive Module Overview Quick Navigator */}
      <div className="panel quick-actions-panel" style={{ margin: '16px 0 0', borderTop: '4px solid #4f46e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3><Search size={18} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#4f46e5' }} /> Chọn danh mục bên dưới để xem nhanh nội dung được phép sử dụng</h3>
          {activeTab !== 'none' && (
            <button className="secondary small-btn" onClick={() => setActiveTab('none')}>
              ✖ Thu gọn nội dung
            </button>
          )}
        </div>

        <div className="quick-buttons">
          {hasBusinessDashboard && <button type="button" className={`quick-btn ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => toggleTab('revenue')}>
            <BarChart3 size={16} color="#4f46e5" /> Xu hướng doanh số
          </button>}
          {(can('/crm-customers') || can('/pipeline')) && <button type="button" className={`quick-btn ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => toggleTab('pipeline')}>
            <GitBranch size={16} color="#a855f7" /> Quy trình bán hàng
          </button>}
          {can('/customer-360') && <button type="button" className={`quick-btn ${activeTab === 'top-deals' ? 'active' : ''}`} onClick={() => toggleTab('top-deals')}>
            <BriefcaseBusiness size={16} color="#0284c7" /> Cơ hội giá trị cao
          </button>}
          {canSeeTeamRanking && <button type="button" className={`quick-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => toggleTab('leaderboard')}>
            <Award size={16} color="#f59e0b" /> Hiệu suất nhóm kinh doanh
          </button>}
          {can('/crm-customers') && <button type="button" className={`quick-btn ${activeTab === 'crm-customers' ? 'active' : ''}`} onClick={() => toggleTab('crm-customers')}>
            <Building2 size={16} color="#10b981" /> Khách hàng doanh nghiệp
          </button>}
          {can('/customer-360') && <button type="button" className={`quick-btn ${activeTab === 'customer-360' ? 'active' : ''}`} onClick={() => toggleTab('customer-360')}>
            <ContactRound size={16} color="#0284c7" /> Khách hàng 360°
          </button>}
          {can('/care') && <button type="button" className={`quick-btn ${activeTab === 'care' ? 'active' : ''}`} onClick={() => toggleTab('care')}>
            <HeartHandshake size={16} color="#ec4899" /> Chăm sóc định kỳ
          </button>}
          {can('/support') && <button type="button" className={`quick-btn ${activeTab === 'support' ? 'active' : ''}`} onClick={() => toggleTab('support')}>
            <AlertCircle size={16} color="#f43f5e" /> Yêu cầu hỗ trợ
          </button>}
          {can('/duplicates') && <button type="button" className={`quick-btn ${activeTab === 'duplicates' ? 'active' : ''}`} onClick={() => toggleTab('duplicates')}>
            <Merge size={16} color="#8b5cf6" /> Gộp khách trùng
          </button>}
          {can('/leads') && <button type="button" className="quick-btn" onClick={() => go('/leads')}>
            <Target size={16} color="#0ea5e9" /> Danh sách Lead
          </button>}
          {can('/campaigns') && <button type="button" className="quick-btn" onClick={() => go('/campaigns')}>
            <BarChart3 size={16} color="#7c3aed" /> Chiến dịch Marketing
          </button>}
          {can('/lead-forms') && <button type="button" className="quick-btn" onClick={() => go('/lead-forms')}><Target size={16} color="#6366f1" /> Biểu mẫu nhúng</button>}
          {can('/lead-import') && <button type="button" className="quick-btn" onClick={() => go('/lead-import')}><Upload size={16} color="#0ea5e9" /> Nhập Lead Excel</button>}
          {can('/lead-duplicates') && <button type="button" className="quick-btn" onClick={() => go('/lead-duplicates')}><Merge size={16} color="#8b5cf6" /> Gộp Lead trùng</button>}
          {can('/lead-scoring') && <button type="button" className="quick-btn" onClick={() => go('/lead-scoring')}><TrendingUp size={16} color="#f59e0b" /> Chấm điểm Lead</button>}
          {can('/lead-assignment') && <button type="button" className="quick-btn" onClick={() => go('/lead-assignment')}><GitBranch size={16} color="#10b981" /> Phân bổ Lead</button>}
          {can('/profile') && <button type="button" className="quick-btn" onClick={() => go('/profile')}><UserCircle size={16} color="#64748b" /> Hồ sơ cá nhân</button>}
          {can('/change-password') && <button type="button" className="quick-btn" onClick={() => go('/change-password')}><KeyRound size={16} color="#64748b" /> Đổi mật khẩu</button>}
        </div>
      </div>

      {/* Chỉ hiển thị KPI kinh doanh cho vai trò có module khách hàng/bán hàng. */}
      {hasBusinessDashboard && <div className="dashboard-cards">
        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">Khách hàng CRM</div>
              <div className="stat-card-val">{totalCust.toLocaleString('vi-VN')}</div>
            </div>
            <div className="icon-box indigo">
              <Building2 size={24} />
            </div>
          </div>
          <div className="stat-card-bottom">
            <span className="trend-badge up">
              <ArrowUpRight size={14} /> +12.5%
            </span>
            <span style={{ color: careDue > 0 ? '#d97706' : '#10b981', fontWeight: 600 }}>
              {careDue > 0 ? `⚠️ ${careDue} cần chăm sóc` : '✓ Đã tương tác gần đây'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">Doanh số Pipeline</div>
              <div className="stat-card-val">{totalOppVal.toLocaleString('vi-VN')} ₫</div>
            </div>
            <div className="icon-box purple">
              <GitBranch size={24} />
            </div>
          </div>
          <div className="stat-card-bottom">
            <span className="trend-badge up">
              <ArrowUpRight size={14} /> {stats?.total_opportunities || 0} cơ hội
            </span>
            <span style={{ color: '#64748b' }}>Tỷ lệ thắng: <b>{convRate}%</b></span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">Hợp đồng đã chốt</div>
              <div className="stat-card-val">{wonVal.toLocaleString('vi-VN')} ₫</div>
            </div>
            <div className="icon-box emerald">
              <Award size={24} />
            </div>
          </div>
          <div className="stat-card-bottom">
            <span className="trend-badge up">
              🏆 {wonCount} Hợp đồng
            </span>
            <span style={{ color: '#059669', fontWeight: 700 }}>Chỉ tiêu: 88%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">Hỗ trợ & Cảnh báo</div>
              <div className="stat-card-val">{openTickets}</div>
            </div>
            <div className="icon-box rose">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="stat-card-bottom">
            <span className={`trend-badge ${openTickets > 0 ? 'down' : 'up'}`}>
              {openTickets > 0 ? '🔥 Cần xử lý ngay' : '✓ 0 tồn đọng'}
            </span>
            <span style={{ color: '#64748b' }}>CSKH & Rủi ro</span>
          </div>
        </div>
      </div>}

      {/* Filter & Refresh Bar */}
      {hasBusinessDashboard && <div className="dashboard-filter-bar" style={{ marginTop: '12px' }}>
        <div className="time-pills">
          <button className={`time-pill ${timeRange === 'today' ? 'active' : ''}`} onClick={() => setTimeRange('today')}>Hôm nay</button>
          <button className={`time-pill ${timeRange === 'week' ? 'active' : ''}`} onClick={() => setTimeRange('week')}>7 ngày qua</button>
          <button className={`time-pill ${timeRange === 'month' ? 'active' : ''}`} onClick={() => setTimeRange('month')}>Tháng này</button>
          <button className={`time-pill ${timeRange === 'quarter' ? 'active' : ''}`} onClick={() => setTimeRange('quarter')}>Quý 4/2026</button>
          <button className={`time-pill ${timeRange === 'year' ? 'active' : ''}`} onClick={() => setTimeRange('year')}>Cả năm 2026</button>
        </div>
        <div className="filter-right-info">
          <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Kỳ báo cáo: Q4/2026</span>
          <button type="button" className="refresh-btn" onClick={() => fetchStats(true)} disabled={refreshing}>
            <RefreshCw size={13} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
        </div>
      </div>}



      {/* DYNAMIC CONTENT LOAD: XU HƯỚNG DOANH SỐ */}
      {hasBusinessDashboard && (activeTab === 'revenue' || activeTab === 'all') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #4f46e5' }}>
          <div className="chart-panel-header">
            <div className="chart-panel-title">
              <div>
                <h3><BarChart3 size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#4f46e5' }} />Xu hướng Doanh số & Chỉ tiêu (Triệu ₫)</h3>
                <p>So sánh chỉ tiêu kế hoạch và doanh số thực tế 6 tháng gần nhất</p>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item"><div className="legend-dot target" />Chỉ tiêu</div>
              <div className="legend-item"><div className="legend-dot actual" />Thực tế</div>
            </div>
          </div>

          <div className="visual-bar-chart">
            {monthlyData.map((d, i) => (
              <div key={i} className="chart-bar-group">
                <div className="chart-bars-wrap">
                  <div className="chart-bar target-bar" style={{ height: `${Math.round((d.target / maxMonthly) * 100)}%` }}>
                    <span className="bar-tooltip">Chỉ tiêu: {d.target}M</span>
                  </div>
                  <div className="chart-bar actual-bar" style={{ height: `${Math.round((d.actual / maxMonthly) * 100)}%` }}>
                    <span className="bar-tooltip">Đạt: {d.actual}M</span>
                  </div>
                </div>
                <span className="chart-x-label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DYNAMIC CONTENT LOAD: QUY TRÌNH BÁN HÀNG */}
      {(activeTab === 'pipeline' || activeTab === 'all') && (can('/crm-customers') || can('/pipeline')) && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #a855f7' }}>
          <div className="panel-head">
            <div>
              <h3><GitBranch size={20} style={{ color: '#a855f7' }} /> Quy trình bán hàng</h3>
              <p className="panel-desc">Phân bổ giá trị và số lượng cơ hội theo các bước tiến độ</p>
            </div>
            {can('/pipeline') ? <button type="button" className="secondary small-btn" onClick={() => go('/pipeline')}>
              <Settings2 size={14} /> Cấu hình Pipeline
            </button> : <span className="badge badge-info">Chế độ xem</span>}
          </div>

          <div className="pipeline-stage-list">
            {stages.map((s, idx) => {
              const maxVal = Math.max(...stages.map(x => x.value), 1)
              const pct = Math.round((s.value / maxVal) * 100)
              const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
              const color = colors[idx % colors.length]
              return (
                <div key={idx} className="stage-progress-item">
                  <div className="stage-meta">
                    <span className="stage-name">
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                      {s.stage}
                    </span>
                    <span className="stage-info">
                      <b>{s.count}</b> cơ hội · <strong style={{ color: '#0f172a' }}>{s.value.toLocaleString('vi-VN')} ₫</strong>
                    </span>
                  </div>
                  <div className="stage-bar-track">
                    <div className="stage-bar-fill" style={{ width: `${Math.max(pct, 10)}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* DYNAMIC CONTENT LOAD: TOP CƠ HỘI GIÁ TRỊ */}
      {(activeTab === 'top-deals' || activeTab === 'all') && can('/customer-360') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #0284c7' }}>
          <div className="panel-head">
            <h3><BriefcaseBusiness size={20} style={{ color: '#0284c7' }} /> Cơ hội kinh doanh giá trị nhất</h3>
            {can('/customer-360') && <button type="button" className="secondary small-btn" onClick={() => go('/customer-360')}>Khách hàng 360°</button>}
          </div>
          <Table 
            headers={['Tên cơ hội', 'Khách hàng', 'Giá trị (₫)', 'Giai đoạn', 'Xác suất']} 
            rows={topOpps.map(x => [
              <b>{x.title}</b>,
              x.customer_name || 'Khách hàng',
              <strong style={{ color: '#4f46e5' }}>{Number(x.value).toLocaleString('vi-VN')} ₫</strong>,
              <span className="badge badge-info">{x.stage}</span>,
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${x.win_probability}%`, height: '100%', background: x.win_probability > 70 ? '#10b981' : '#f59e0b' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700' }}>{x.win_probability}%</span>
              </div>
            ])} 
          />
        </div>
      )}

      {/* DYNAMIC CONTENT LOAD: BẢNG XẾP HẠNG NVKD */}
      {(activeTab === 'leaderboard' || activeTab === 'all') && canSeeTeamRanking && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #f59e0b' }}>
          <div className="panel-head">
            <h3><Award size={20} style={{ color: '#f59e0b' }} /> Bảng xếp hạng Hiệu suất Nhóm kinh doanh</h3>
            {can('/users') && <button type="button" className="secondary small-btn" onClick={() => go('/users')}>Quản lý đội ngũ</button>}
          </div>
          <div className="leaderboard-list">
            {teamPerf.map((t, idx) => {
              const rankClasses = ['gold', 'silver', 'bronze']
              return (
                <div key={idx} className="leaderboard-item">
                  <div className={`rank-badge ${rankClasses[idx] || ''}`}>{idx + 1}</div>
                  <div className="leaderboard-user">
                    <b>{t.full_name}</b>
                    <span>{t.total_deals} cơ hội · Pipeline {Number(t.pipe_val).toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="leaderboard-val">
                    <strong>{Number(t.won_val).toLocaleString('vi-VN')} ₫</strong>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>Đã chốt hợp đồng</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* DYNAMIC TAB VIEW: KHÁCH HÀNG DOANH NGHIỆP OVERVIEW */}
      {activeTab === 'crm-customers' && can('/crm-customers') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #10b981' }}>
          <div className="panel-head">
            <div>
              <h3><Building2 size={20} color="#10b981" /> Tổng Quan Phân Vùng: Khách hàng Doanh nghiệp</h3>
              <p className="panel-desc">Thống kê tóm tắt dữ liệu công ty, phân bổ ngành nghề và danh sách tài khoản mới tiếp nhận</p>
            </div>
            <button type="button" className="primary" onClick={() => go('/crm-customers')}>
              Mở trang Khách hàng Doanh nghiệp đầy đủ →
            </button>
          </div>

          <div className="cards dashboard-cards" style={{ margin: '16px 0 20px' }}>
            <div className="stat-card">
              <div className="stat-card-title">Tổng Công ty / Doanh nghiệp</div>
              <div className="stat-card-val">{totalCust}</div>
              <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>✓ +18 tài khoản mới tháng này</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Đang giao dịch tích cực</div>
              <div className="stat-card-val">123</div>
              <div style={{ fontSize: '12.5px', color: '#4f46e5', fontWeight: 600 }}>Tỷ lệ hoạt động 96.1%</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Cần tương tác chăm sóc</div>
              <div className="stat-card-val" style={{ color: careDue > 0 ? '#d97706' : '#0f172a' }}>{careDue}</div>
              <div style={{ fontSize: '12.5px', color: '#d97706', fontWeight: 600 }}>⚠️ Quá hạn 30 ngày chưa tương tác</div>
            </div>
          </div>

          <h4>Danh sách Doanh nghiệp Mới cập nhật</h4>
          <Table 
            headers={['ID', 'Tên Doanh nghiệp', 'Email liên hệ', 'Số điện thoại', 'Người phụ trách', 'Thời gian tạo']}
            rows={recentCust.map(c => [
              `#${c.id}`,
              <b>{c.name}</b>,
              c.email || 'N/A',
              c.phone || 'N/A',
              <span className="badge badge-info">{c.owner_name}</span>,
              new Date(c.created_at).toLocaleDateString('vi-VN')
            ])}
          />
        </div>
      )}

      {/* DYNAMIC TAB VIEW: KHÁCH HÀNG 360 OVERVIEW */}
      {activeTab === 'customer-360' && can('/customer-360') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #0284c7' }}>
          <div className="panel-head">
            <div>
              <h3><ContactRound size={20} color="#0284c7" /> Tổng Quan Phân Vùng: Khách hàng 360°</h3>
              <p className="panel-desc">Góc nhìn 360° tổng thể hợp đồng, công ty mẹ/con và đầu mối người liên hệ chính</p>
            </div>
            <button type="button" className="primary" onClick={() => go('/customer-360')}>
              Mở trang Khách hàng 360° đầy đủ →
            </button>
          </div>

          <div className="cards dashboard-cards" style={{ margin: '16px 0 20px' }}>
            <div className="stat-card">
              <div className="stat-card-title">Tổng hợp đồng Đã ký</div>
              <div className="stat-card-val">{wonVal.toLocaleString('vi-VN')} ₫</div>
              <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>🏆 14 Hợp đồng thành công</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Giá trị Cơ hội Đang mở</div>
              <div className="stat-card-val">{totalOppVal.toLocaleString('vi-VN')} ₫</div>
              <div style={{ fontSize: '12.5px', color: '#a855f7', fontWeight: 600 }}>42 dự án đang triển khai</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Đầu mối Người liên hệ chính</div>
              <div className="stat-card-val">48</div>
              <div style={{ fontSize: '12.5px', color: '#0284c7', fontWeight: 600 }}>Người quyết định & Người ảnh hưởng</div>
            </div>
          </div>

          <h4>Top Cơ hội Tiềm năng 360° Giá trị nhất</h4>
          <Table 
            headers={['Dự án', 'Khách hàng', 'Giá trị hợp đồng', 'Tiến độ', 'Tỷ lệ thắng']}
            rows={topOpps.map(x => [
              <b>{x.title}</b>,
              x.customer_name || 'Khách hàng',
              <strong style={{ color: '#0284c7' }}>{Number(x.value).toLocaleString('vi-VN')} ₫</strong>,
              <span className="badge badge-info">{x.stage}</span>,
              <span className="badge badge-success">{x.win_probability}%</span>
            ])}
          />
        </div>
      )}

      {/* DYNAMIC TAB VIEW: LỊCH CHĂM SÓC OVERVIEW */}
      {activeTab === 'care' && can('/care') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #ec4899' }}>
          <div className="panel-head">
            <div>
              <h3><HeartHandshake size={20} color="#ec4899" /> Tổng Quan Phân Vùng: Lịch Chăm sóc định kỳ</h3>
              <p className="panel-desc">Theo dõi nhật ký gặp mặt, cuộc gọi CSKH và việc cần làm định kỳ trong tháng</p>
            </div>
            <button type="button" className="primary" onClick={() => go('/care')}>
              Mở trang Lịch Chăm sóc định kỳ đầy đủ →
            </button>
          </div>

          <div className="grid2" style={{ marginTop: '16px' }}>
            <div>
              <h4>Nhật ký Tương tác CSKH Gần nhất</h4>
              <div className="activity-timeline" style={{ marginTop: '12px' }}>
                {recentActivities.map((a, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-icon"><Activity size={14} /></div>
                    <div className="timeline-body">
                      <div className="timeline-header">
                        <b>{a.subject}</b>
                        <small>{new Date(a.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</small>
                      </div>
                      <span className="timeline-sub">
                        <span className="badge badge-info" style={{ marginRight: '6px' }}>{a.activity_type}</span>
                        {a.customer_name} ({a.owner_name})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4>Danh sách Việc cần Chăm sóc Hôm nay</h4>
              <div className="task-checklist" style={{ marginTop: '12px' }}>
                {defaultTasks.map(t => (
                  <div key={t.id} className="task-check-item">
                    <div className="custom-checkbox"><CheckCircle2 size={14} /></div>
                    <span className="task-title">{t.title}</span>
                    <span className="task-tag">{t.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC TAB VIEW: TICKET HỖ TRỢ OVERVIEW */}
      {activeTab === 'support' && can('/support') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #f43f5e' }}>
          <div className="panel-head">
            <div>
              <h3><AlertCircle size={20} color="#f43f5e" /> Tổng quan: Yêu cầu hỗ trợ tồn đọng</h3>
              <p className="panel-desc">Giám sát các yêu cầu hỗ trợ kỹ thuật, xử lý rủi ro và cam kết SLA cho khách hàng</p>
            </div>
            <button type="button" className="primary" onClick={() => go('/support')}>
              Mở trang Hỗ trợ & rủi ro đầy đủ →
            </button>
          </div>

          <div className="cards dashboard-cards" style={{ margin: '16px 0 20px' }}>
            <div className="stat-card">
              <div className="stat-card-title">Yêu cầu đang mở</div>
              <div className="stat-card-val" style={{ color: '#f43f5e' }}>{openTickets}</div>
              <div style={{ fontSize: '12.5px', color: '#f43f5e', fontWeight: 600 }}>🔥 Cần xử lý trong ngày</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Thời gian phản hồi SLA</div>
              <div className="stat-card-val">1.2h</div>
              <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>✓ Đạt chuẩn SLA (&lt; 2h)</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Đã giải quyết tháng này</div>
              <div className="stat-card-val">18</div>
              <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>Tỷ lệ hài lòng 98%</div>
            </div>
          </div>

          <h4>Danh sách yêu cầu đang phản hồi</h4>
          <Table 
            headers={['Mã yêu cầu', 'Khách hàng', 'Vấn đề hỗ trợ', 'Mức độ', 'Trạng thái', 'Phân công']}
            rows={[
              ['#TK-108', 'Tập đoàn Alpha', 'Lỗi kết nối cổng API thanh toán', <span className="badge badge-danger">Ưu tiên Cao</span>, <span className="badge badge-warning">Đang xử lý</span>, 'Nguyễn Văn A'],
              ['#TK-105', 'Công ty Beta', 'Hướng dẫn xuất báo cáo định dạng Excel', <span className="badge badge-info">Trung bình</span>, <span className="badge badge-warning">Chờ phản hồi</span>, user.full_name]
            ]}
          />
        </div>
      )}

      {/* DYNAMIC TAB VIEW: GỘP TRÙNG DỮ LIỆU OVERVIEW */}
      {activeTab === 'duplicates' && can('/duplicates') && (
        <div className="panel" style={{ margin: '16px 0 0', borderTop: '4px solid #8b5cf6' }}>
          <div className="panel-head">
            <div>
              <h3><Merge size={20} color="#8b5cf6" /> Tổng Quan Phân Vùng: Gộp trùng dữ liệu & Sức khỏe Data</h3>
              <p className="panel-desc">Phát hiện hồ sơ trùng lặp tên/MST/SĐT và nhật ký bàn giao công việc giữa các tài khoản</p>
            </div>
            <button type="button" className="primary" onClick={() => go('/duplicates')}>
              Mở công cụ Gộp trùng dữ liệu đầy đủ →
            </button>
          </div>

          <div className="cards dashboard-cards" style={{ margin: '16px 0 20px' }}>
            <div className="stat-card">
              <div className="stat-card-title">Cặp hồ sơ nghi trùng</div>
              <div className="stat-card-val" style={{ color: '#8b5cf6' }}>2</div>
              <div style={{ fontSize: '12.5px', color: '#8b5cf6', fontWeight: 600 }}>Cần rà soát gộp dữ liệu</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Chỉ số Sức khỏe Dữ liệu</div>
              <div className="stat-card-val">98.4%</div>
              <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>✓ Dữ liệu chuẩn mực</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Hồ sơ đã gộp thành công</div>
              <div className="stat-card-val">8</div>
              <div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>Đã chuẩn hóa lịch sử giao dịch</div>
            </div>
          </div>

          <h4>Danh sách Cặp dữ liệu Nghi trùng</h4>
          <Table 
            headers={['Mã nhóm', 'Tên Doanh nghiệp trùng', 'Tiêu chí trùng', 'Độ tin cậy', 'Đề xuất']}
            rows={[
              ['#DUP-01', 'Công ty Cổ phần Alpha Tech / Alpha Technology JS', 'MST & Tên tương tự', <span className="badge badge-danger">95% Trùng khớp</span>, <button className="primary small-btn" onClick={() => go('/duplicates')}>Tiến hành gộp</button>],
              ['#DUP-02', 'Tập đoàn Bất động sản Horizon / Horizon RealEstate', 'Số điện thoại & Website', <span className="badge badge-warning">88% Trùng khớp</span>, <button className="secondary small-btn" onClick={() => go('/duplicates')}>Xem chi tiết</button>]
            ]}
          />
        </div>
      )}
    </div>
  )
}

function LegacyCustomers() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [scope, setScope] = useState('')
  const [m, setM] = useState('')

  async function load() {
    try {
      const d = await api('/api/customers?q=' + encodeURIComponent(q))
      setItems(d.items)
      setScope(d.scope)
    } catch (e) {
      setM(errText(e))
    }
  }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-title">
        <h2>Dữ liệu kinh doanh</h2>
        <p>Phạm vi áp dụng: <b>{scopeVi[scope] || scope}</b></p>
      </div>
      <Notice text={m} type="err" />
      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm tên, số điện thoại, email..." />
        </div>
        <button onClick={load}><Search size={16} />Tìm kiếm</button>
        <button className="secondary" onClick={() => download('/api/data/export', 'du-lieu-theo-pham-vi.xlsx')}>
          <Download size={16} />Xuất Excel
        </button>
      </div>
      <div className="panel">
        <Table headers={['ID', 'Tên', 'Điện thoại', 'Email', 'Chủ sở hữu', 'Nhóm']} rows={items.map(x => [x.id, x.name, x.phone, x.email, x.owner_name, x.group_name])} />
      </div>
    </>
  )
}

function ChangePassword() {
  const [f, setF] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
  const [m, setM] = useState('')

  async function save(e) {
    e.preventDefault()
    try {
      setM((await api('/api/auth/change-password', { method: 'POST', body: JSON.stringify(f) })).message)
      setF({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (er) {
      setM(errText(er))
    }
  }

  return (
    <form className="panel narrow" onSubmit={save}>
      <h2><KeyRound size={20} /> Đổi mật khẩu</h2>
      <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
      <Field label="Mật khẩu hiện tại" type="password" value={f.current_password} onChange={e => setF({ ...f, current_password: e.target.value })} required />
      <Field label="Mật khẩu mới" type="password" value={f.new_password} onChange={e => setF({ ...f, new_password: e.target.value })} required />
      <Field label="Xác nhận mật khẩu mới" type="password" value={f.new_password_confirmation} onChange={e => setF({ ...f, new_password_confirmation: e.target.value })} required />
      <button type="submit" className="primary" style={{ marginTop: '10px' }}>Cập nhật mật khẩu</button>
    </form>
  )
}

function ProfilePage() {
  const [f, setF] = useState(null)
  const [m, setM] = useState('')
  const [file, setFile] = useState(null)

  async function load() {
    try { setF(await api('/api/s2/profile')) } catch (e) { setM(errText(e)) }
  }
  useEffect(() => { load() }, [])

  if (!f) return <Notice text={m || 'Đang tải hồ sơ...'} />

  async function save() {
    try {
      setM((await api('/api/s2/profile', { method: 'PUT', body: JSON.stringify({ full_name: f.full_name, phone: f.phone, email_signature: f.email_signature }) })).message)
      load()
      window.dispatchEvent(new CustomEvent('crm:user-updated'))
    } catch (e) { setM(errText(e)) }
  }

  async function avatar() {
    if (!file) { setM('Hãy chọn ảnh trước khi tải lên.'); return }
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch(API_BASE + '/api/s2/profile/avatar', { method: 'POST', credentials: 'include', body: fd })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail)
      setM(d.message)
      setFile(null)
      load()
      window.dispatchEvent(new CustomEvent('crm:user-updated'))
    } catch (e) { setM(errText(e)) }
  }

  return (
    <div className="profile-layout">
      <div className="panel profile-card avatar-card">
        <div className="profile-head">
          <div className="profile-icon"><UserCircle size={22} /></div>
          <div>
            <h2>Ảnh đại diện</h2>
            <p>Cập nhật ảnh đại diện chuyên nghiệp của bạn</p>
          </div>
        </div>
        <div className="profile-avatar-wrap">
          {f.avatar_thumb_path ? (
            <img className="profile-avatar-large" src={API_BASE + '/api/s2/profile/avatar/thumb?x=' + Date.now()} alt="Ảnh đại diện" />
          ) : (
            <div className="profile-avatar-empty"><UserCircle size={80} /></div>
          )}
        </div>
        <label className="upload-dropzone">
          <Upload size={28} />
          <strong>{file ? file.name : 'Chọn file ảnh từ máy tính'}</strong>
          <span>Định dạng JPG, PNG ≤ 2MB</span>
          <input type="file" accept="image/jpeg,image/png" onChange={e => setFile(e.target.files[0] || null)} />
        </label>
        <div className="profile-actions">
          <button className="primary" onClick={avatar} disabled={!file}><Upload size={16} /> Tải ảnh lên</button>
          <button type="button" className="secondary" onClick={() => setFile(null)} disabled={!file}>Xóa tệp chọn</button>
        </div>
      </div>

      <div className="panel profile-card info-card">
        <div className="profile-head">
          <div className="profile-icon"><Settings2 size={22} /></div>
          <div>
            <h2>Thông tin cá nhân</h2>
            <p>Cập nhật thông tin chi tiết và chữ ký email</p>
          </div>
        </div>
        <Notice text={m} type={m && /Hãy|lỗi|không/i.test(m) ? 'err' : 'ok'} />
        <div className="grid2">
          <Field label="Họ tên" value={f.full_name || ''} onChange={e => setF({ ...f, full_name: e.target.value })} />
          <Field label="Email (không tự đổi)" value={f.email || ''} disabled />
          <Field label="Số điện thoại" value={f.phone || ''} onChange={e => setF({ ...f, phone: e.target.value })} />
          <Field label="Nhóm làm việc (không tự đổi)" value={f.group_name || ''} disabled />
        </div>
        <label className="field" style={{ marginTop: '12px' }}>
          <span>Chữ ký email</span>
          <textarea value={f.email_signature || ''} onChange={e => setF({ ...f, email_signature: e.target.value })} placeholder="Nhập chữ ký email sử dụng khi tương tác với khách hàng..." />
        </label>
        <div className="profile-actions">
          <button className="primary" onClick={save}>Lưu thông tin</button>
        </div>
      </div>
    </div>
  )
}

function ExcelImport({ kind }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [step, setStep] = useState(1) // 1: Select, 2: Uploaded, 3: Dedicated Preview Page, 4: Complete
  const [m, setM] = useState('')
  const [previewSearch, setPreviewSearch] = useState('')
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'valid' | 'invalid'
  const [showRawJson, setShowRawJson] = useState(false)
  const [duplicateAction, setDuplicateAction] = useState('skip')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRowDetail, setSelectedRowDetail] = useState(null)
  const fileInputRef = useRef(null)

  const base = kind === 'users' ? '/api/s2/users' : '/api/s3/customers'
  const isUsers = kind === 'users'
  const title = isUsers ? 'Nhập dữ liệu Người dùng hàng loạt (Excel)' : 'Nhập dữ liệu Khách hàng hàng loạt (Excel)'
  const templateName = isUsers ? 'tep-mau-nguoi-dung.xlsx' : 'tep-mau-khach-hang.xlsx'

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0]
      if (!selected.name.endsWith('.xlsx') && !selected.name.endsWith('.xls')) {
        setM('Vui lòng chọn tệp Excel định dạng .xlsx hoặc .xls.')
        return
      }
      setFile(selected)
      setM('')
      setStep(2)
    }
  }

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setM('')
      setStep(2)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setStep(1)
    setFilterTab('all')
    setPreviewSearch('')
    setPage(1)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function send(path) {
    if (!file) { setM('Vui lòng chọn tệp Excel trước khi tải lên.'); return }
    setLoading(true)
    setM('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const targetUrl = API_BASE + base + path + (!isUsers && path === '/import' ? `?duplicate_action=${duplicateAction}` : '')
      const r = await fetch(targetUrl, { method: 'POST', credentials: 'include', body: fd })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Có lỗi xảy ra khi tải lên tệp')
      if (path === '/import-preview') {
        setPreview(d)
        setStep(3)
        setFilterTab('all')
        setPage(1)
      } else {
        setM(d.message || 'Đã nhập thành công dữ liệu vào hệ thống!')
        setPreview(d)
        setStep(4)
      }
    } catch (e) {
      setM(errText(e))
    } finally {
      setLoading(false)
    }
  }

  const rawRows = preview ? (preview.items || preview.skipped || preview.created || []) : []
  const validCount = preview ? (preview.valid ?? preview.created?.length ?? (rawRows.filter(x => x.valid ?? !x.errors?.length)?.length || 0)) : 0
  const invalidCount = preview ? (preview.invalid ?? preview.skipped?.length ?? (rawRows.filter(x => !x.valid && x.errors?.length > 0)?.length || 0)) : 0
  const totalCount = validCount + invalidCount
  const successPct = totalCount > 0 ? Math.round((validCount / totalCount) * 100) : 100

  // Filter preview rows by quick filter tab and search keyword
  const filteredRows = rawRows.filter(x => {
    const isValid = x.valid ?? !(x.errors && x.errors.length > 0)
    if (filterTab === 'valid' && !isValid) return false
    if (filterTab === 'invalid' && isValid) return false

    if (!previewSearch.trim()) return true
    const q = previewSearch.toLowerCase().trim()
    const dataStr = JSON.stringify(x.data || x).toLowerCase()
    const errStr = (x.errors || []).join(' ').toLowerCase()
    const rowStr = String(x.row || x.id || '')
    return dataStr.includes(q) || errStr.includes(q) || rowStr.includes(q)
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1
  const displayedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [filterTab, previewSearch, pageSize, preview])

  const formatFileSize = bytes => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // =========================================================================
  // STEP 4: HOÀN TẤT NHẬP DỮ LIỆU (TRANG RIÊNG BÁO CÁO KẾT QUẢ)
  // =========================================================================
  if (step === 4) {
    return (
      <div className="excel-dedicated-page">
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '680px', margin: '30px auto', borderRadius: '16px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={38} color="#059669" />
          </div>
          <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '8px', fontWeight: 800 }}>Hoàn tất nhập dữ liệu thành công!</h2>
          <p style={{ color: '#64748b', fontSize: '14.5px', marginBottom: '24px', lineHeight: 1.5 }}>
            {m || 'Toàn bộ dữ liệu hợp lệ từ tệp Excel đã được lưu trữ thành công vào hệ thống CRM.'}
          </p>

          {preview && (preview.created?.length > 0 || preview.updated?.length > 0 || preview.skipped?.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '0 auto 28px', maxWidth: '480px' }}>
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Đã thêm mới</div>
                <b style={{ fontSize: '20px', color: '#15803d' }}>{preview.created?.length || 0}</b>
              </div>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>Đã cập nhật</div>
                <b style={{ fontSize: '20px', color: '#1d4ed8' }}>{preview.updated?.length || 0}</b>
              </div>
              <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600 }}>Đã bỏ qua / Lỗi</div>
                <b style={{ fontSize: '20px', color: '#b91c1c' }}>{preview.skipped?.length || 0}</b>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="primary" 
              onClick={() => go(isUsers ? '/users' : '/crm-customers')}
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              Xem danh sách {isUsers ? 'Người dùng' : 'Khách hàng'}
            </button>
            <button 
              type="button" 
              className="secondary" 
              onClick={removeFile}
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              Tiếp tục nhập tệp Excel khác
            </button>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // STEP 3: TRANG RIÊNG HOÀN TOÀN MỚI - KIỂM TRA & XEM TRƯỚC DỮ LIỆU EXCEL
  // =========================================================================
  if (preview && step === 3) {
    return (
      <div className="excel-dedicated-page">
        {/* Dedicated Page Topbar Header */}
        <div className="excel-page-topbar">
          <div className="excel-page-topbar-left">
            <div className="excel-page-breadcrumbs">
              <button 
                type="button" 
                className="excel-breadcrumb-btn" 
                onClick={() => setStep(2)}
                title="Quay lại trang chọn tệp"
              >
                <ArrowLeft size={14} /> Quay lại tải tệp
              </button>
              <span>/</span>
              <span>{isUsers ? 'Người dùng' : 'Khách hàng'}</span>
              <span>/</span>
              <b style={{ color: '#0f172a' }}>Trang kiểm tra dữ liệu Excel</b>
            </div>

            <div className="excel-page-title-row">
              <h2>
                <FileSpreadsheet size={22} color="#4f46e5" />
                Kết quả kiểm tra dữ liệu: {file?.name || 'Tệp Excel'}
              </h2>
              <span className="excel-file-chip">
                Dung lượng: {formatFileSize(file?.size)}
              </span>
              <div className="preview-pct-pill" style={{ margin: 0 }}>
                <span>Độ sẵn sàng:</span>
                <b>{successPct}%</b>
              </div>
            </div>
          </div>

          <div className="excel-page-topbar-right">
            <button 
              type="button" 
              className="secondary small-btn" 
              onClick={() => download(base + '/import-template', templateName)}
              title="Tải tệp mẫu định dạng chuẩn .xlsx"
            >
              <Download size={14} /> Tệp mẫu chuẩn
            </button>
            <button 
              type="button" 
              className="primary small-btn" 
              onClick={() => send('/import')} 
              disabled={validCount === 0 || loading}
              style={{ fontWeight: 700 }}
              title={validCount === 0 ? "Không có dòng hợp lệ nào để nhập" : `Nhập ${validCount} dòng hợp lệ vào hệ thống`}
            >
              <Upload size={14} className={loading ? 'spin' : ''} />
              {loading ? 'Đang nhập...' : `Nhập ngay ${validCount} dòng hợp lệ`}
            </button>
          </div>
        </div>

        {/* Notice Message if any */}
        <Notice text={m} type={m.includes('lỗi') || m.includes('Vui lòng') ? 'err' : 'ok'} />

        {/* Clickable Interactive Stat Cards */}
        <div className="cards import-validation-cards" style={{ margin: '0 0 16px' }}>
          <div 
            className={`stat-card clickable-stat-card ${filterTab === 'valid' ? 'card-active-valid' : ''}`}
            onClick={() => setFilterTab('valid')}
            title="Bấm để lọc chỉ các dòng Hợp lệ (Không lỗi)"
          >
            <div className="stat-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Dòng dữ liệu Hợp lệ</span>
              {filterTab === 'valid' && <span className="active-tag tag-success">Đang lọc</span>}
            </div>
            <div className="stat-card-val" style={{ color: '#059669' }}>{validCount}</div>
            <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
              {validCount > 0 ? '✓ Đủ điều kiện lưu vào CRM' : '⚠️ 0 dòng hợp lệ (Bấm để xem thông báo)'}
            </div>
          </div>

          <div 
            className={`stat-card clickable-stat-card ${filterTab === 'invalid' ? 'card-active-invalid' : ''}`}
            onClick={() => setFilterTab('invalid')}
            title="Bấm để lọc chỉ các dòng Bị lỗi / Bỏ qua"
          >
            <div className="stat-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Dòng Lỗi / Bỏ qua</span>
              {filterTab === 'invalid' && <span className="active-tag tag-danger">Đang lọc</span>}
            </div>
            <div className="stat-card-val" style={{ color: invalidCount > 0 ? '#ef4444' : '#64748b' }}>{invalidCount}</div>
            <div style={{ fontSize: '12.5px', color: invalidCount > 0 ? '#ef4444' : '#059669', fontWeight: 600 }}>
              {invalidCount > 0 ? '⚠️ Cần kiểm tra lại định dạng' : '✓ 0 lỗi phát hiện'}
            </div>
          </div>

          <div 
            className={`stat-card clickable-stat-card ${filterTab === 'all' ? 'card-active-all' : ''}`}
            onClick={() => setFilterTab('all')}
            title="Bấm để xem tất cả các dòng"
          >
            <div className="stat-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Tổng số dòng xử lý</span>
              {filterTab === 'all' && <span className="active-tag tag-all">Tất cả</span>}
            </div>
            <div className="stat-card-val">{totalCount}</div>
            <div style={{ fontSize: '12.5px', color: '#4f46e5', fontWeight: 600 }}>Tệp: {file?.name || 'Excel'}</div>
          </div>
        </div>

        {/* =========================================================================
            THÔNG BÁO TỨC THÌ KHI LỌC DÒNG KHÔNG LỖI HOẶC CÓ LỖI (BÁO LUÔN)
            ========================================================================= */}
        {filterTab === 'valid' && validCount === 0 && (
          <div className="preview-alert-banner alert-banner-danger">
            <div className="alert-banner-icon">
              <AlertCircle size={24} color="#dc2626" />
            </div>
            <div className="alert-banner-body">
              <strong>⚠️ Không có dòng dữ liệu nào không lỗi trong tệp!</strong>
              <p>
                Tệp Excel vừa tải lên có <b>0 / {totalCount} dòng hợp lệ</b>. Toàn bộ <b>{invalidCount} dòng đều đang gặp lỗi</b> định dạng hoặc không hợp lệ (ví dụ: trạng thái không hợp lệ, thiếu cột bắt buộc, hoặc lệch thứ tự cột).
              </p>
            </div>
            <button 
              type="button" 
              className="secondary small-btn" 
              onClick={() => setFilterTab('invalid')}
              style={{ whiteSpace: 'nowrap', borderColor: '#f87171', color: '#b91c1c', background: '#ffffff', fontWeight: 700 }}
            >
              <AlertCircle size={14} /> Xem {invalidCount} dòng lỗi ngay
            </button>
          </div>
        )}

        {filterTab === 'valid' && validCount > 0 && (
          <div className="preview-alert-banner alert-banner-success">
            <div className="alert-banner-icon">
              <CheckCircle2 size={22} color="#059669" />
            </div>
            <div className="alert-banner-body">
              <strong>✓ Đang hiển thị {validCount} dòng dữ liệu hợp lệ (không có lỗi)</strong>
              <p>Tất cả các dòng này đều đáp ứng tiêu chuẩn CRM và sẵn sàng để nhập chính thức vào hệ thống.</p>
            </div>
          </div>
        )}

        {filterTab === 'invalid' && invalidCount === 0 && (
          <div className="preview-alert-banner alert-banner-success">
            <div className="alert-banner-icon">
              <CheckCircle2 size={22} color="#059669" />
            </div>
            <div className="alert-banner-body">
              <strong>✓ Tuyệt vời! Không phát hiện dòng lỗi nào</strong>
              <p>Toàn bộ 100% dòng dữ liệu trong tệp ({totalCount} dòng) đều hợp lệ và đạt chuẩn CRM.</p>
            </div>
          </div>
        )}

        {filterTab === 'invalid' && invalidCount > 0 && (
          <div className="preview-alert-banner alert-banner-warning">
            <div className="alert-banner-icon">
              <AlertCircle size={22} color="#d97706" />
            </div>
            <div className="alert-banner-body">
              <strong>⚠️ Đang hiển thị {invalidCount} dòng dữ liệu có lỗi ({totalCount > 0 ? Math.round((invalidCount / totalCount) * 100) : 0}% tổng số dòng)</strong>
              <p>Kiểm tra cột "Chi tiết lỗi / Ghi chú" bên dưới để biết thông tin cần chỉnh sửa lại trong tệp Excel hoặc bấm "Chi tiết" để xem toàn bộ dòng.</p>
            </div>
          </div>
        )}

        {/* Main Content Table Panel */}
        <div className="panel" style={{ borderTop: '4px solid #4f46e5', padding: '18px 20px' }}>
          {/* =========================================================================
              BỘ LỌC NHANH ĐƯA XUỐNG DƯỚI NGAY TRÊN ĐẦU BẢNG (QUICK FILTER TOOLBAR)
              ========================================================================= */}
          <div className="table-quick-filter-bar">
            <div className="quick-filter-tabs">
              <button 
                type="button" 
                className={`quick-filter-btn ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                <ListTree size={14} /> Tất cả <span className="tab-count">{totalCount}</span>
              </button>
              <button 
                type="button" 
                className={`quick-filter-btn filter-btn-success ${filterTab === 'valid' ? 'active' : ''}`}
                onClick={() => setFilterTab('valid')}
              >
                <CheckCircle2 size={14} /> Không lỗi / Hợp lệ <span className="tab-count">{validCount}</span>
              </button>
              <button 
                type="button" 
                className={`quick-filter-btn filter-btn-danger ${filterTab === 'invalid' ? 'active' : ''}`}
                onClick={() => setFilterTab('invalid')}
              >
                <AlertCircle size={14} /> Dòng có lỗi <span className="tab-count">{invalidCount}</span>
              </button>
            </div>

            <div className="quick-filter-tools">
              <div className="quick-search-box">
                <Search size={14} className="quick-search-icon" />
                <input 
                  type="text" 
                  className="quick-search-input"
                  placeholder="Tìm tên, MST, SĐT, lỗi..." 
                  value={previewSearch} 
                  onChange={e => setPreviewSearch(e.target.value)} 
                />
                {previewSearch && (
                  <button type="button" className="quick-search-clear" onClick={() => setPreviewSearch('')} title="Xóa tìm kiếm">
                    <X size={12} />
                  </button>
                )}
              </div>

              <button 
                type="button"
                className="secondary small-btn" 
                onClick={() => setShowRawJson(!showRawJson)}
                style={{ fontSize: '12px', height: '36px', padding: '0 12px', whiteSpace: 'nowrap' }}
                title={showRawJson ? "Xem dạng bảng" : "Xem dạng JSON thô"}
              >
                {showRawJson ? '📋 Dạng bảng' : '{ } JSON thô'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>
              Danh sách chi tiết các dòng ({filteredRows.length}/{totalCount})
            </h4>
            {previewSearch && (
              <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600 }}>
                Đang lọc theo từ khóa: "{previewSearch}"
              </span>
            )}
          </div>

          {/* =========================================================================
              EMPTY STATE KHI LỌC KHÔNG CÓ DÒNG NÀO
              ========================================================================= */}
          {filteredRows.length === 0 ? (
            <div className="preview-empty-state">
              <div className="preview-empty-state-icon">
                <AlertCircle size={32} />
              </div>
              <h3>
                {filterTab === 'valid' ? 'Không có dòng dữ liệu hợp lệ nào' : 'Không tìm thấy dòng dữ liệu phù hợp'}
              </h3>
              <p>
                {filterTab === 'valid' 
                  ? `Toàn bộ ${totalCount} dòng dữ liệu trong tệp đều gặp lỗi định dạng hoặc không hợp lệ. Hãy chuyển sang xem danh sách lỗi để chỉnh sửa tệp.`
                  : (previewSearch ? `Không tìm thấy dòng nào chứa từ khóa "${previewSearch}".` : 'Chưa có dữ liệu.')
                }
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {filterTab === 'valid' && invalidCount > 0 && (
                  <button type="button" className="primary small-btn" onClick={() => setFilterTab('invalid')}>
                    Xem {invalidCount} dòng có lỗi cần sửa
                  </button>
                )}
                {filterTab !== 'all' && (
                  <button type="button" className="secondary small-btn" onClick={() => setFilterTab('all')}>
                    Xem tất cả các dòng
                  </button>
                )}
                {previewSearch && (
                  <button type="button" className="secondary small-btn" onClick={() => setPreviewSearch('')}>
                    Xóa từ khóa tìm kiếm
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* =========================================================================
               BẢNG CHI TIẾT CÁC DÒNG DỮ LIỆU
               ========================================================================= */
            <div className="table-wrap" style={{ marginTop: 0, overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>STT Dòng</th>
                    <th style={{ width: '110px' }}>Trạng thái</th>
                    <th>{isUsers ? 'Thông tin Người dùng' : 'Thông tin Doanh nghiệp'}</th>
                    <th style={{ width: '200px' }}>Liên hệ (SĐT / Email)</th>
                    <th style={{ width: '280px' }}>Chi tiết lỗi / Ghi chú</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((x, idx) => {
                    const isValid = x.valid ?? !(x.errors && x.errors.length > 0)
                    const d = x.data || x

                    return (
                      <tr key={x.row || x.id || idx}>
                        <td>
                          <b style={{ color: '#475569', fontSize: '13px' }}>
                            Dòng {x.row || x.id || idx + 1}
                          </b>
                        </td>
                        <td>
                          {isValid ? (
                            <span className="badge badge-success">✓ Hợp lệ</span>
                          ) : (
                            <span className="badge badge-danger">⚠️ Lỗi</span>
                          )}
                        </td>
                        <td>
                          {showRawJson ? (
                            <pre style={{ fontSize: '11px', margin: 0, whiteSpace: 'pre-wrap', color: '#334155', maxHeight: '120px', overflowY: 'auto' }}>
                              {JSON.stringify(d, null, 2)}
                            </pre>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <b style={{ fontSize: '14px', color: '#0f172a' }}>
                                {d.name || d.full_name || 'Chưa có tên'}
                              </b>
                              {d.tax_code && (
                                <span style={{ fontSize: '12px', color: '#475569' }}>
                                  Mã số thuế: <b style={{ color: '#0f172a' }}>{d.tax_code}</b>
                                </span>
                              )}
                              {!isUsers && (d.industry || d.company_size || d.address) && (
                                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                                  {d.industry && `Ngành: ${d.industry}`}
                                  {d.company_size && ` · Quy mô: ${d.company_size}`}
                                  {d.address && ` · ĐC: ${d.address}`}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          {showRawJson ? '—' : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12.5px' }}>
                              {d.phone && <span style={{ color: '#0284c7', fontWeight: 600 }}>📞 {d.phone}</span>}
                              {d.email && <span style={{ color: '#475569' }}>✉️ {d.email}</span>}
                              {!d.phone && !d.email && <span style={{ color: '#94a3b8' }}>Chưa có liên hệ</span>}
                            </div>
                          )}
                        </td>
                        <td>
                          {((x.errors || []).length > 0 || (x.warnings || []).length > 0) ? (
                            <div style={{ color: '#dc2626', fontWeight: 600, fontSize: '12px', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fecdd3', lineHeight: 1.4 }}>
                              ⚠️ {[...(x.errors || []), ...(x.warnings || [])].join('; ')}
                            </div>
                          ) : (
                            <span style={{ color: '#059669', fontWeight: 600, fontSize: '12.5px' }}>
                              ✓ Dữ liệu đạt chuẩn CRM
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className="secondary small-btn" 
                            onClick={() => setSelectedRowDetail(x)}
                            title="Xem chi tiết dữ liệu dòng này"
                            style={{ padding: '4px 8px', fontSize: '11.5px' }}
                          >
                            <Eye size={13} /> Xem
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* =========================================================================
              PHÂN TRANG KHI NHIỀU DỮ LIỆU ("Cái nào nhiều dữ liệu quá thì cho qua 1 trang riêng")
              ========================================================================= */}
          {filteredRows.length > 0 && (
            <div className="table-pagination-bar" style={{ marginTop: '14px' }}>
              <div className="pagination-info">
                <span>
                  Hiển thị <b>{(page - 1) * pageSize + 1}</b> - <b>{Math.min(page * pageSize, filteredRows.length)}</b> trong tổng số <b>{filteredRows.length}</b> dòng
                  {totalPages > 1 && ` · Trang ${page} / ${totalPages}`}
                </span>
                <div className="page-size-selector">
                  <span>Hiển thị mỗi trang:</span>
                  <div className="page-size-pills">
                    {[10, 20, 50, 100].map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`size-pill-btn ${pageSize === s ? 'active' : ''}`}
                        onClick={() => { setPageSize(s); setPage(1); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pagination-controls">
                <button 
                  type="button" 
                  className="pagination-btn" 
                  disabled={page <= 1} 
                  onClick={() => setPage(1)}
                  title="Trang đầu"
                >
                  «
                </button>
                <button 
                  type="button" 
                  className="pagination-btn" 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  title="Trang trước"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`pagination-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))
                }
                <button 
                  type="button" 
                  className="pagination-btn" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  title="Trang sau"
                >
                  ›
                </button>
                <button 
                  type="button" 
                  className="pagination-btn" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(totalPages)}
                  title="Trang cuối"
                >
                  »
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div style={{ marginTop: '20px', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="secondary" 
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={16} /> Quay lại tải tệp
              </button>
              {!isUsers && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Trùng MST:</span>
                  <select 
                    value={duplicateAction} 
                    onChange={e => setDuplicateAction(e.target.value)}
                    style={{ height: '36px', padding: '0 10px', fontSize: '13px', borderRadius: '7px', border: '1px solid #cbd5e1', background: '#fff' }}
                  >
                    <option value="skip">Bỏ qua bản ghi trùng</option>
                    <option value="update">Cập nhật bản ghi trùng</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button" 
                className="primary" 
                onClick={() => send('/import')} 
                disabled={validCount === 0 || loading}
                style={{ minHeight: '42px', padding: '0 20px', fontSize: '14px', fontWeight: 700 }}
              >
                <Upload size={16} className={loading ? 'spin' : ''} />
                {loading ? 'Đang tiến hành nhập dữ liệu...' : `Tiến hành Nhập ngay ${validCount} dòng hợp lệ vào CRM`}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ROW DETAIL MODAL (CHO DÒNG CÓ NHIỀU DỮ LIỆU HOẶC NHIỀU LỖI)
            ========================================================================= */}
        {selectedRowDetail && (
          <div className="modal-backdrop" onClick={() => setSelectedRowDetail(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
              <div className="modal-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                  <FileSpreadsheet size={20} color="#4f46e5" />
                  Chi tiết dữ liệu Dòng {selectedRowDetail.row || selectedRowDetail.id || 'N/A'}
                </h3>
                <button type="button" className="icon close-btn" onClick={() => setSelectedRowDetail(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Trạng thái xác thực:</span>
                  {(selectedRowDetail.valid ?? !(selectedRowDetail.errors && selectedRowDetail.errors.length > 0)) ? (
                    <span className="badge badge-success" style={{ fontSize: '13px' }}>✓ Đạt chuẩn - Hợp lệ</span>
                  ) : (
                    <span className="badge badge-danger" style={{ fontSize: '13px' }}>⚠️ Có lỗi định dạng</span>
                  )}
                </div>

                {(selectedRowDetail.errors?.length > 0 || selectedRowDetail.warnings?.length > 0) && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '12px 14px' }}>
                    <b style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '6px' }}>
                      <AlertCircle size={15} /> Danh sách lỗi / cảnh báo cần sửa:
                    </b>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#dc2626', fontSize: '13px' }}>
                      {[...(selectedRowDetail.errors || []), ...(selectedRowDetail.warnings || [])].map((err, i) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {Object.entries(selectedRowDetail.data || selectedRowDetail)
                    .filter(([k]) => !['errors', 'warnings', 'valid', 'duplicate', 'existing_id'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <small style={{ color: '#64748b', textTransform: 'capitalize', display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                          {k.replace(/_/g, ' ')}
                        </small>
                        <b style={{ fontSize: '13px', color: '#0f172a', wordBreak: 'break-word' }}>
                          {String(v ?? '—')}
                        </b>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="modal-foot" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button type="button" className="secondary" onClick={() => setSelectedRowDetail(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // =========================================================================
  // STEP 1 & 2: TRANG TẢI LÊN TỆP EXCEL & QUY ĐỊNH CỘT
  // =========================================================================
  return (
    <div className="excel-import-container">
      {/* Step Wizard Header */}
      <div className="excel-import-stepper">
        <div className={`stepper-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? <CheckCircle2 size={16} /> : '1'}</div>
          <div className="step-label">
            <b>Bước 1</b>
            <span>Tải tệp mẫu</span>
          </div>
        </div>
        <div className="stepper-line" />
        <div className={`stepper-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? <CheckCircle2 size={16} /> : '2'}</div>
          <div className="step-label">
            <b>Bước 2</b>
            <span>Tải lên tệp Excel</span>
          </div>
        </div>
        <div className="stepper-line" />
        <div className={`stepper-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 3 ? <CheckCircle2 size={16} /> : '3'}</div>
          <div className="step-label">
            <b>Bước 3</b>
            <span>Kiểm tra & Xem trước</span>
          </div>
        </div>
        <div className="stepper-line" />
        <div className={`stepper-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-circle">{step >= 4 ? <CheckCircle2 size={16} /> : '4'}</div>
          <div className="step-label">
            <b>Bước 4</b>
            <span>Hoàn tất nhập dữ liệu</span>
          </div>
        </div>
      </div>

      {/* Main Control Panel */}
      <div className="panel excel-import-main-panel">
        <div className="panel-head" style={{ marginBottom: '16px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
              <FileSpreadsheet size={26} color="#4f46e5" />
              {title}
            </h2>
            <p className="panel-desc">
              Hệ thống hỗ trợ nhập tự động hàng loạt tệp Excel (.xlsx). Dữ liệu được kiểm tra cú pháp và cảnh báo lỗi trước khi lưu trữ.
            </p>
          </div>
          <button 
            type="button"
            className="secondary"
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}
            onClick={() => download(base + '/import-template', templateName)}
          >
            <Download size={16} color="#4f46e5" /> Tải tệp Excel mẫu (.xlsx)
          </button>
        </div>

        <Notice text={m} type={step === 4 ? 'ok' : (m.includes('lỗi') || m.includes('Vui lòng') ? 'err' : 'ok')} />

        {/* Existing preview shortcut banner if already checked */}
        {preview && (
          <div style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '12px 16px', margin: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3730a3', fontSize: '13.5px' }}>
              <CheckCircle2 size={18} color="#4338ca" />
              <span>Tệp hiện tại đã được kiểm tra: <b>{validCount}</b> dòng hợp lệ, <b>{invalidCount}</b> dòng có lỗi.</span>
            </div>
            <button 
              type="button" 
              className="primary small-btn" 
              onClick={() => setStep(3)}
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
            >
              Mở trang kiểm tra chi tiết (Trang riêng) →
            </button>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div 
          className={`excel-upload-dropzone ${dragActive ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />

          {!file ? (
            <div className="dropzone-content">
              <div className="dropzone-icon">
                <Upload size={36} color="#4f46e5" />
              </div>
              <h3>Kéo & thả tệp Excel vào đây</h3>
              <p>hoặc <b>bấm để chọn tệp từ máy tính</b> của bạn</p>
              <div className="dropzone-badges">
                <span className="format-badge">Định dạng hỗ trợ: .XLSX, .XLS</span>
                <span className="format-badge">Dung lượng tối đa: 10 MB</span>
              </div>
            </div>
          ) : (
            <div className="file-status-card">
              <div className="file-status-icon">
                <FileSpreadsheet size={32} color="#10b981" />
              </div>
              <div className="file-status-info">
                <b className="file-name">{file.name}</b>
                <span className="file-meta">
                  Dung lượng: {formatFileSize(file.size)} · Định dạng hợp lệ .XLSX
                </span>
              </div>
              <div className="file-status-actions">
                <button type="button" className="secondary small-btn" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                  Đổi tệp khác
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Template Instructions Banner */}
        <div className="excel-template-guidance">
          <h4><CheckSquare size={16} color="#4f46e5" /> Quy định định dạng cột dữ liệu:</h4>
          <div className="guidance-grid">
            {isUsers ? (
              <>
                <div className="guidance-item"><b>Họ và tên:</b> Chuỗi văn bản (Bắt buộc)</div>
                <div className="guidance-item"><b>Email:</b> Email chuẩn (Bắt buộc, không trùng)</div>
                <div className="guidance-item"><b>Số điện thoại:</b> Định dạng 10-11 chữ số</div>
                <div className="guidance-item"><b>Mật khẩu mặc định:</b> Tối thiểu 8 ký tự</div>
              </>
            ) : (
              <>
                <div className="guidance-item"><b>Tên doanh nghiệp:</b> Chuỗi văn bản (Bắt buộc)</div>
                <div className="guidance-item"><b>Số điện thoại:</b> Chuẩn 10 chữ số</div>
                <div className="guidance-item"><b>Mã số thuế:</b> 10 hoặc 13 chữ số MST</div>
                <div className="guidance-item"><b>Email liên hệ:</b> Email doanh nghiệp chính</div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="excel-action-bar">
          <button 
            type="button" 
            className="secondary" 
            disabled={!file || loading}
            onClick={() => send('/import-preview')}
          >
            <Search size={16} /> 1. Kiểm tra & Xem trước (Mở trang riêng)
          </button>
          <button 
            type="button" 
            className="primary" 
            disabled={!file || loading}
            onClick={() => send('/import')}
          >
            <Upload size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Đang xử lý dữ liệu...' : '2. Nhập dữ liệu chính thức'}
          </button>
        </div>
      </div>
    </div>
  )
}



function Audit() {
  const [items, setItems] = useState([])
  const [m, setM] = useState('')
  const [filters, setFilters] = useState({ user_id: '', entity_type: '', date_from: '', date_to: '' })
  const [users, setUsers] = useState([])
  const [target, setTarget] = useState({ user_id: '', period: new Date().toISOString().slice(0,7), target_amount: 0 })

  async function load() {
    try {
      const q = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) q.set(k, v) })
      const [d, u] = await Promise.all([api('/api/s2/audit-logs?' + q), api('/api/users?page=1&per_page=100')])
      setItems(d.items)
      setUsers(u.items)
    } catch (e) { setM(errText(e)) }
  }

  async function saveTarget() {
    if (!target.user_id) { setM('Hãy chọn nhân viên cần cập nhật chỉ tiêu.'); return }
    try {
      setM((await api('/api/s2/sales-targets/' + target.user_id, { method: 'PUT', body: JSON.stringify({ period: target.period, target_amount: Number(target.target_amount) }) })).message)
      await load()
    } catch (e) { setM(errText(e)) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className="panel">
        <h2><FileClock size={20} /> Nhật ký thay đổi dữ liệu nhạy cảm</h2>
        <Notice text={m} type={m && /Hãy|lỗi|không|thất bại/i.test(m) ? 'err' : 'ok'} />
        <div className="grid3">
          <Select label="Người thực hiện" value={filters.user_id} onChange={e => setFilters({ ...filters, user_id: e.target.value })}>
            <option value="">Tất cả người dùng</option>
            {users.map(x => <option key={x.id} value={x.id}>{x.full_name}</option>)}
          </Select>
          <Field label="Loại đối tượng" placeholder="User / Product / Customer..." value={filters.entity_type} onChange={e => setFilters({ ...filters, entity_type: e.target.value })} />
          <Field label="Từ ngày" type="date" value={filters.date_from} onChange={e => setFilters({ ...filters, date_from: e.target.value })} />
          <Field label="Đến ngày" type="date" value={filters.date_to} onChange={e => setFilters({ ...filters, date_to: e.target.value })} />
        </div>
        <button className="primary" onClick={load} style={{ margin: '12px 0 16px' }}><Filter size={16} /> Lọc nhật ký</button>
        <Table headers={['Người dùng', 'Hành động', 'Đối tượng', 'ID', 'Trường', 'Giá trị trước', 'Giá trị mới', 'Thời gian']} rows={items.map(x => [x.user_name, x.action, x.entity_type, x.entity_id, x.field_name, x.old_value, x.new_value, new Date(x.created_at).toLocaleString('vi-VN')])} />
      </div>
      <div className="panel">
        <h3><Target size={18}/> Cập nhật chỉ tiêu bán hàng (được ghi Audit Log)</h3>
        <div className="grid3">
          <Select label="Nhân viên" value={target.user_id} onChange={e => setTarget({ ...target, user_id: e.target.value })}>
            <option value="">-- Chọn --</option>{users.map(x => <option key={x.id} value={x.id}>{x.full_name}</option>)}
          </Select>
          <Field label="Kỳ (YYYY-MM)" value={target.period} onChange={e => setTarget({ ...target, period: e.target.value })} />
          <Field label="Chỉ tiêu (VND)" type="number" value={target.target_amount} onChange={e => setTarget({ ...target, target_amount: Number(e.target.value) })} />
        </div>
        <button className="primary" onClick={saveTarget}>Lưu chỉ tiêu & ghi log</button>
      </div>
    </>
  )
}

function GenericAdmin({ type }) {
  const cfg = {
    products: { title: 'Sản phẩm & Bảng giá', url: '/api/s2/products', fields: [['code', 'Mã'], ['name', 'Tên sản phẩm'], ['product_type', 'Loại'], ['unit', 'Đơn vị'], ['list_price', 'Giá niêm yết', 'number'], ['floor_price', 'Giá sàn', 'number'], ['cost_price', 'Giá vốn (chỉ GĐKD)', 'number']], defaults: { code:'', name:'', product_type: 'Sản phẩm một lần', unit: 'Gói', list_price: 0, floor_price: 0, cost_price:0, is_active: true } },
    categories: { title: 'Danh mục bán hàng', url: '/api/s2/categories', fields: [['category_type', 'Loại danh mục'], ['value', 'Giá trị'], ['sort_order', 'Thứ tự', 'number']], defaults: { category_type: 'Ngành nghề', value:'', sort_order: 0, is_active: true } },
    pipeline: { title: 'Cấu hình quy trình bán hàng (Pipeline)', url: '/api/s2/pipeline-stages', fields: [['name', 'Tên giai đoạn'], ['sort_order', 'Thứ tự', 'number'], ['win_probability', 'Xác suất thắng %', 'number'], ['exit_condition', 'Điều kiện chuyển']], defaults: { name:'', sort_order: 1, win_probability: 10, exit_condition:'', exit_condition_code:'', is_active: true } },
    reasons: { title: 'Lý do Thắng / Thua & Đối thủ', url: '/api/s2/win-loss-reasons', fields: [['result_type', 'Kết quả'], ['reason', 'Lý do chi tiết'], ['sort_order', 'Thứ tự', 'number']], defaults: { result_type: 'Thắng', reason:'', sort_order: 0, is_active: true } },
    'custom-fields': { title: 'Trường dữ liệu tùy chỉnh', url: '/api/s2/custom-fields', fields: [['entity_type', 'Đối tượng'], ['field_name', 'Tên trường'], ['field_type', 'Kiểu dữ liệu'], ['sort_order', 'Thứ tự', 'number']], defaults: { entity_type: 'customer', field_name:'', field_type: 'text', sort_order: 0, is_required: false, options: [] } }
  }[type]

  const [f, setF] = useState(cfg.defaults)
  const [items, setItems] = useState([])
  const [m, setM] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [competitors, setCompetitors] = useState([])
  const [competitor, setCompetitor] = useState({ name:'', sort_order:0 })
  const [customers, setCustomers] = useState([])
  const [quotes, setQuotes] = useState([])
  const [quote, setQuote] = useState({ customer_id:'', product_id:'', quantity:1, discount_percent:0 })
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  async function load() {
    try {
      const base = await api(cfg.url)
      setItems(base.items || [])
      if (type === 'reasons') setCompetitors((await api('/api/s2/competitors')).items || [])
      if (type === 'products') {
        const [customerResult, quoteResult] = await Promise.allSettled([
          api('/api/s3/customers'),
          api('/api/s2/quotations-standard')
        ])
        if (customerResult.status === 'fulfilled') setCustomers(customerResult.value.items || [])
        else setM('Không thể tải danh sách khách hàng. Hãy thử tải lại trang.')
        if (quoteResult.status === 'fulfilled') setQuotes(quoteResult.value.items || [])
        else setM('Không thể tải danh sách báo giá. Hãy thử tải lại trang.')
      }
    } catch (e) { setM(errText(e)) }
  }
  useEffect(() => { setF(cfg.defaults); setEditingId(null); load() }, [type])

  async function submit(e) {
    e.preventDefault()
    let payload = { ...f }
    if (type === 'custom-fields' && typeof payload.options === 'string') payload.options = payload.options.split(',').map(x => x.trim()).filter(Boolean)
    try {
      const canEdit = editingId && ['products','categories','pipeline'].includes(type)
      const url = canEdit ? `${cfg.url}/${editingId}` : cfg.url
      setM((await api(url, { method: canEdit ? 'PUT' : 'POST', body: JSON.stringify(payload) })).message)
      setF(cfg.defaults); setEditingId(null); await load()
    } catch (e) { setM(errText(e)) }
  }

  function editItem(x) {
    setEditingId(x.id)
    const next={...cfg.defaults}
    Object.keys(next).forEach(k => { if (x[k] !== undefined && x[k] !== null) next[k]=x[k] })
    if (type==='custom-fields') next.options=(x.options||[]).join(', ')
    setF(next); window.scrollTo({top:0,behavior:'smooth'})
  }

  async function removeItem(x) {
    if (!confirm(`Xác nhận xóa ${x.name || x.value || x.code}?`)) return
    try { setM((await api(`${cfg.url}/${x.id}`, { method:'DELETE' })).message); await load() } catch(e){ setM(errText(e)) }
  }

  async function createQuote(e) {
    e?.preventDefault?.()
    if (!quote.customer_id || !quote.product_id) { setM('Hãy chọn khách hàng và sản phẩm để tạo báo giá.'); return }
    try {
      const res = await api('/api/s2/quotations-standard',{method:'POST',body:JSON.stringify({...quote,customer_id:Number(quote.customer_id),product_id:Number(quote.product_id)})})
      setM(res.message)
      setShowQuoteModal(false)
      setQuote({ customer_id:'', product_id:'', quantity:1, discount_percent:0 })
      await load()
    } catch(e){ setM(errText(e)) }
  }

  async function approveQuote(id) { try { setM((await api(`/api/s2/quotations-standard/${id}/approve`,{method:'POST'})).message); await load() } catch(e){ setM(errText(e)) } }
  async function updateQuoteDiscount(q) { const raw=prompt('Nhập chiết khấu mới từ 0 đến 100 (%)',String(q.discount_percent??0)); if(raw===null)return; const value=Number(raw); if(!Number.isFinite(value)||value<0||value>100){setM('Chiết khấu phải từ 0 đến 100%.');return} try{setM((await api(`/api/s2/quotations-standard/${q.id}/discount`,{method:'PUT',body:JSON.stringify({discount_percent:value})})).message);await load()}catch(e){setM(errText(e))} }
  async function addCompetitor() { if(!competitor.name.trim()) return; try { setM((await api('/api/s2/competitors',{method:'POST',body:JSON.stringify(competitor)})).message); setCompetitor({name:'',sort_order:0}); await load() } catch(e){setM(errText(e))} }

  return (
    <>
      <form className="panel" onSubmit={submit}>
        <h2>{cfg.title}</h2>
        <Notice text={m} type={m && /không|lỗi|Hãy|chưa/i.test(m) ? 'err' : 'ok'} />
        <div className="grid3">
          {cfg.fields.map(([k,l,t]) => {
            if (type==='products' && k==='product_type') return <Select key={k} label={l} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}><option>Sản phẩm một lần</option><option>Dịch vụ thuê bao</option></Select>
            if (type==='categories' && k==='category_type') return <Select key={k} label={l} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}>{['Ngành nghề','Quy mô','Nguồn lead','Loại hoạt động'].map(v=><option key={v}>{v}</option>)}</Select>
            if (type==='reasons' && k==='result_type') return <Select key={k} label={l} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}><option>Thắng</option><option>Thua</option></Select>
            if (type==='custom-fields' && k==='entity_type') return <Select key={k} label={l} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}><option value="customer">Khách hàng</option><option value="opportunity">Cơ hội</option></Select>
            if (type==='custom-fields' && k==='field_type') return <Select key={k} label={l} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}><option value="text">Văn bản</option><option value="number">Số</option><option value="date">Ngày</option><option value="select">Danh sách chọn</option></Select>
            return <Field key={k} label={l} type={t||'text'} value={f[k] ?? ''} onChange={e=>setF({...f,[k]:t==='number'?Number(e.target.value):e.target.value})}/>
          })}
          {type==='pipeline' && <Select label="Điều kiện máy kiểm tra" value={f.exit_condition_code||''} onChange={e=>setF({...f,exit_condition_code:e.target.value})}><option value="">Tự suy luận từ mô tả</option><option value="activity">Có hoạt động/liên hệ</option><option value="meeting">Có ít nhất một cuộc gặp</option><option value="need_note">Có ghi chú nhu cầu</option><option value="proposal">Đã gửi đề xuất</option><option value="quote">Có báo giá</option><option value="terms">Đã xác nhận điều khoản</option></Select>}
        </div>
        {type === 'custom-fields' && <div style={{margin:'10px 0'}}><label className="checks"><label><input type="checkbox" checked={!!f.is_required} onChange={e=>setF({...f,is_required:e.target.checked})}/> Bắt buộc nhập</label></label><Field label="Các lựa chọn (phân cách bằng dấu phẩy nếu kiểu select)" value={typeof f.options==='string'?f.options:(f.options||[]).join(', ')} onChange={e=>setF({...f,options:e.target.value})}/></div>}
        {type === 'products' && <div className="checks" style={{margin:'10px 0'}}><label><input type="checkbox" checked={!!f.is_active} onChange={e=>setF({...f,is_active:e.target.checked})}/> Đang kinh doanh (bỏ chọn để chuyển sang Ngừng kinh doanh)</label></div>}
        {type === 'pipeline' && <div className="checks" style={{margin:'10px 0'}}><label><input type="checkbox" checked={!!f.is_active} onChange={e=>setF({...f,is_active:e.target.checked})}/> Giai đoạn đang được sử dụng</label></div>}
        <div className="toolbar"><button type="submit" className="primary"><Plus size={16}/>{editingId?'Lưu cập nhật':'Thêm mới'}</button>{editingId&&<button type="button" className="secondary" onClick={()=>{setEditingId(null);setF(cfg.defaults)}}>Hủy sửa</button>}</div>
      </form>

      <div className="panel">
        <Table
          headers={type==='custom-fields'
            ? ['Đối tượng','Tên trường','Kiểu dữ liệu','Bắt buộc','Lựa chọn','Thứ tự']
            : [...cfg.fields.map(x=>x[1]), ...(type==='products'?['Biên lợi nhuận','Trạng thái']:[]), ...(['products','categories','pipeline'].includes(type)?['Thao tác']:[])]}
          rows={items.map(x=>{
            if(type==='custom-fields') {
              const entityLabel=x.entity_type==='customer'?'Khách hàng':'Cơ hội'
              const typeLabel={text:'Văn bản',number:'Số',date:'Ngày',select:'Danh sách chọn'}[x.field_type]||x.field_type
              const optionText=(x.options||[]).length?(x.options||[]).join(', '):'—'
              return [entityLabel,x.field_name,typeLabel,x.is_required?'Có':'Không',optionText,x.sort_order]
            }
            const base=cfg.fields.map(([k])=>x[k])
            if(type==='products') base.push(`${x.gross_margin_percent ?? 0}%`, x.is_active?'Đang kinh doanh':'Ngừng kinh doanh')
            if(['products','categories','pipeline'].includes(type)) base.push(<span style={{display:'flex',gap:6}}><button className="secondary small-btn" onClick={()=>editItem(x)}>Sửa</button>{['products','categories'].includes(type)&&<button className="secondary small-btn" onClick={()=>removeItem(x)}>Xóa</button>}</span>)
            return base
          })}
        />
      </div>

      {type==='pipeline' && <div className="panel pipeline-preview-panel">
        <div className="pipeline-preview-heading">
          <div>
            <span className="eyebrow-label">BẢN XEM NHANH</span>
            <h3>Pipeline bán hàng theo giai đoạn</h3>
            <p>Xem trực quan thứ tự giai đoạn, xác suất thắng và điều kiện chuyển trước khi áp dụng cho cơ hội bán hàng.</p>
          </div>
          <span className="pipeline-preview-count">{items.filter(x=>x.is_active !== false).length} giai đoạn đang dùng</span>
        </div>
        <div className="pipeline-board-preview">
          {[...items].sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)).map((stage,index)=><div className="pipeline-preview-column" key={stage.id || `${stage.name}-${index}`}>
            <div className="pipeline-preview-column-head">
              <div className="pipeline-stage-index">{String(index+1).padStart(2,'0')}</div>
              <div className="pipeline-stage-title">
                <b>{stage.name}</b>
                <small>Thứ tự {stage.sort_order ?? index+1}</small>
              </div>
              <span className={`pipeline-probability ${Number(stage.win_probability||0)>=70?'high':Number(stage.win_probability||0)>=40?'mid':'low'}`}>{stage.win_probability ?? 0}%</span>
            </div>
            <div className="pipeline-preview-card">
              <span>Điều kiện chuyển</span>
              <p>{stage.exit_condition || 'Không yêu cầu điều kiện bắt buộc.'}</p>
            </div>
            <div className="pipeline-preview-status">
              <span className={`pipeline-dot ${stage.is_active===false?'off':''}`}></span>
              {stage.is_active===false?'Đang tạm ngừng':'Đang sử dụng'}
            </div>
          </div>)}
          {items.length===0 && <div className="pipeline-preview-empty">Chưa có giai đoạn Pipeline. Hãy tạo giai đoạn đầu tiên ở biểu mẫu phía trên.</div>}
        </div>
      </div>}

      {type==='products' && <>
        <div className="panel quotation-list-panel">
          <div className="quotation-panel-head">
            <div>
              <span className="eyebrow-label">BẢNG GIÁ CHUẨN</span>
              <h3>Danh sách báo giá</h3>
              <p className="panel-desc">Báo giá lấy trực tiếp từ giá niêm yết; hệ thống tự kiểm tra giá sau chiết khấu có thấp hơn giá sàn hay không.</p>
            </div>
            <button type="button" className="primary quotation-add-btn" onClick={()=>{setM('');setQuote({ customer_id:'', product_id:'', quantity:1, discount_percent:0 });setShowQuoteModal(true)}}>
              <Plus size={17}/> Tạo báo giá
            </button>
          </div>
          <div className="quotation-summary-row">
            <span><b>{quotes.length}</b> báo giá</span>
            <span><b>{quotes.filter(q=>q.approval_required).length}</b> chờ duyệt chiết khấu</span>
            <span><b>{quotes.filter(q=>q.status==='Đã duyệt').length}</b> đã duyệt</span>
          </div>
          <Table headers={['Số BG','Khách hàng','Sản phẩm','Chiết khấu','Đơn giá sau CK','Tổng','Trạng thái','Thao tác']} rows={quotes.map(q=>[q.quote_no,q.customer_name||'Báo giá dữ liệu cũ',q.product_name||'-',`${Number(q.discount_percent||0)}%`,Number(q.unit_price||0).toLocaleString('vi-VN')+'₫',Number(q.total_amount||0).toLocaleString('vi-VN')+'₫',q.status,<span style={{display:'flex',gap:6,flexWrap:'wrap'}}><button className="secondary small-btn" onClick={()=>updateQuoteDiscount(q)}>Sửa CK</button>{q.approval_required&&<button className="secondary small-btn" onClick={()=>approveQuote(q.id)}>Duyệt</button>}</span>])}/>
        </div>

        <Modal isOpen={showQuoteModal} onClose={()=>setShowQuoteModal(false)} title="Tạo báo giá từ bảng giá chuẩn" icon={FileSpreadsheet} maxWidth="820px">
          <form onSubmit={createQuote} className="quotation-modal-form">
            <p className="panel-desc">Chọn khách hàng và sản phẩm. Giá bán được tính từ bảng giá chuẩn, không nhập tay.</p>
            <Notice text={m} type={isErrorNotice(m)?'err':'ok'} />
            <div className="grid2">
              <Select label="Khách hàng" value={quote.customer_id} onChange={e=>setQuote({...quote,customer_id:e.target.value})} required>
                <option value="">-- Chọn khách hàng --</option>
                {customers.map(x=><option key={x.id} value={x.id}>{x.name}{x.tax_code?` · MST ${x.tax_code}`:''}</option>)}
              </Select>
              <Select label="Sản phẩm / dịch vụ" value={quote.product_id} onChange={e=>setQuote({...quote,product_id:e.target.value})} required>
                <option value="">-- Chọn sản phẩm --</option>
                {items.filter(x=>x.is_active).map(x=><option key={x.id} value={x.id}>{x.name} — {Number(x.list_price).toLocaleString('vi-VN')}₫/{x.unit||'đơn vị'}</option>)}
              </Select>
              <Field label="Số lượng" type="number" min="1" value={quote.quantity} onChange={e=>setQuote({...quote,quantity:Math.max(1,Number(e.target.value)||1)})}/>
              <Field label="Chiết khấu %" type="number" min="0" max="100" value={quote.discount_percent} onChange={e=>setQuote({...quote,discount_percent:Math.min(100,Math.max(0,Number(e.target.value)||0))})}/>
            </div>
            {quote.product_id && (()=>{
              const p=items.find(x=>String(x.id)===String(quote.product_id))
              if(!p)return null
              const after=Number(p.list_price||0)*(1-Number(quote.discount_percent||0)/100)
              const total=after*Number(quote.quantity||1)
              const needApproval=after<Number(p.floor_price||0)
              return <div className={`quotation-price-preview ${needApproval?'warning':''}`}>
                <div><span>Giá niêm yết</span><b>{Number(p.list_price||0).toLocaleString('vi-VN')}₫</b></div>
                <div><span>Giá sàn</span><b>{Number(p.floor_price||0).toLocaleString('vi-VN')}₫</b></div>
                <div><span>Đơn giá sau CK</span><b>{after.toLocaleString('vi-VN')}₫</b></div>
                <div><span>Tổng báo giá</span><b>{total.toLocaleString('vi-VN')}₫</b></div>
                <p>{needApproval?'Giá sau chiết khấu thấp hơn giá sàn — báo giá sẽ chuyển sang Chờ duyệt chiết khấu.':'Giá sau chiết khấu vẫn đạt giá sàn — có thể tạo báo giá nháp ngay.'}</p>
              </div>
            })()}
            <div className="modal-footer">
              <button type="button" className="secondary" onClick={()=>setShowQuoteModal(false)}>Hủy</button>
              <button type="submit" className="primary"><Plus size={16}/> Tạo báo giá</button>
            </div>
          </form>
        </Modal>
      </>}

      {type==='reasons' && <div className="panel"><h3>Đối thủ cạnh tranh</h3><div className="grid2"><Field label="Tên đối thủ" value={competitor.name} onChange={e=>setCompetitor({...competitor,name:e.target.value})}/><Field label="Thứ tự" type="number" value={competitor.sort_order} onChange={e=>setCompetitor({...competitor,sort_order:Number(e.target.value)})}/></div><button className="primary" onClick={addCompetitor}>Thêm đối thủ</button><div style={{marginTop:16}}><Table headers={['Tên đối thủ','Thứ tự','Trạng thái']} rows={competitors.map(x=>[x.name,x.sort_order,x.is_active?'Đang dùng':'Ngừng dùng'])}/></div></div>}
    </>
  )
}

function Org() {
  const [items,setItems]=useState([]),[users,setUsers]=useState([]),[f,setF]=useState({name:'',parent_id:'',leader_id:'',region:''}),[m,setM]=useState(''),[editingId,setEditingId]=useState(null)
  async function load(){try{const[a,b]=await Promise.all([api('/api/s2/org-groups'),api('/api/users?page=1&per_page=100')]);setItems(a.items);setUsers(b.items)}catch(e){setM(errText(e))}}
  useEffect(()=>{load()},[])
  async function save(e){e.preventDefault();try{const payload={...f,parent_id:f.parent_id?Number(f.parent_id):null,leader_id:f.leader_id?Number(f.leader_id):null};const url=editingId?`/api/s2/org-groups/${editingId}`:'/api/s2/org-groups';setM((await api(url,{method:editingId?'PUT':'POST',body:JSON.stringify(payload)})).message);setF({name:'',parent_id:'',leader_id:'',region:''});setEditingId(null);await load()}catch(e){setM(errText(e))}}
  function edit(x){setEditingId(x.id);setF({name:x.name||'',parent_id:x.parent_id||'',leader_id:x.leader_id||'',region:x.region||''});window.scrollTo({top:0,behavior:'smooth'})}
  return <><form className="panel" onSubmit={save}><h2><ListTree size={20}/> Cơ cấu tổ chức kinh doanh</h2><Notice text={m} type={m&&/không|Hãy|phải/i.test(m)?'err':'ok'}/><div className="grid2"><Field label="Tên nhóm / Phòng ban" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/><Field label="Khu vực địa lý" value={f.region} onChange={e=>setF({...f,region:e.target.value})} required/><Select label="Nhóm cấp trên" value={f.parent_id} onChange={e=>setF({...f,parent_id:e.target.value})}><option value="">-- Nhóm cấp cao nhất --</option>{items.filter(x=>x.id!==editingId).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</Select><Select label="Trưởng nhóm (bắt buộc)" value={f.leader_id} onChange={e=>setF({...f,leader_id:e.target.value})} required><option value="">-- Chọn trưởng nhóm --</option>{users.map(x=><option key={x.id} value={x.id}>{x.full_name} - {x.email}</option>)}</Select></div><div className="toolbar"><button type="submit" className="primary"><Plus size={16}/>{editingId?'Lưu thay đổi':'Tạo nhóm mới'}</button>{editingId&&<button type="button" className="secondary" onClick={()=>{setEditingId(null);setF({name:'',parent_id:'',leader_id:'',region:''})}}>Hủy sửa</button>}</div><p className="hint">Phạm vi Trưởng nhóm bao gồm nhóm hiện tại và toàn bộ nhóm con trong cây tổ chức.</p></form><div className="panel"><Table headers={['Tên nhóm','Nhóm cấp trên','Trưởng nhóm','Khu vực','Thao tác']} rows={items.map(x=>[x.name,x.parent_name||'-',x.leader_name||'Chưa gán',x.region||'-',<button className="secondary small-btn" onClick={()=>edit(x)}>Sửa / gán trưởng nhóm</button>])}/></div></>
}

function CrmCustomers({ filterMode = false }) {
  const emptyForm = { name:'', tax_code:'', industry:'', company_size:'', website:'', address:'', phone:'', email:'', status:'Tiềm năng', lead_source:'', parent_customer_id:'', custom_fields:{} }
  const emptyFilter = { q:'', status:'', industry:'', company_size:'', region:'', owner_id:'' }
  const [items,setItems]=useState([]), [m,setM]=useState(''), [loading,setLoading]=useState(false)
  const [saved,setSaved]=useState([]), [filterName,setFilterName]=useState(''), [flt,setFlt]=useState(emptyFilter), [customFlt,setCustomFlt]=useState({})
  const [customDefs,setCustomDefs]=useState([]), [categories,setCategories]=useState([]), [showAddForm,setShowAddForm]=useState(false), [editingId,setEditingId]=useState(null), [f,setF]=useState(emptyForm)

  async function load(next=flt, nextCustom=customFlt){
    setLoading(true)
    try{
      const q=new URLSearchParams(); Object.entries(next).forEach(([k,v])=>{if(v)q.set(k,v)}); if(Object.values(nextCustom).some(v=>String(v||'').trim()))q.set('custom_filters',JSON.stringify(nextCustom))
      const [res,defs,sv,cats]=await Promise.all([api('/api/s3/customers?'+q),api('/api/s2/custom-fields?entity_type=customer'),api('/api/s3/customer-filters'),api('/api/s2/categories')])
      setItems(res.items||[]);setCustomDefs(defs.items||[]);setSaved(sv.items||[]);setCategories((cats.items||[]).filter(x=>x.is_active))
    }catch(e){setM(errText(e))}finally{setLoading(false)}
  }
  useEffect(()=>{load()},[])

  async function saveCustomer(e){
    e.preventDefault()
    try{
      const payload={...f,parent_customer_id:f.parent_customer_id?Number(f.parent_customer_id):null}
      const url=editingId?`/api/s3/customers/${editingId}`:'/api/s3/customers'; const method=editingId?'PUT':'POST'
      setM((await api(url,{method,body:JSON.stringify(payload)})).message); setF(emptyForm);setEditingId(null);setShowAddForm(false);await load()
    }catch(e){setM(errText(e))}
  }
  function editItem(x){setEditingId(x.id);setF({name:x.name||'',tax_code:x.tax_code||'',industry:x.industry||'',company_size:x.company_size||'',website:x.website||'',address:x.address||'',phone:x.phone||'',email:x.email||'',status:x.status||'Tiềm năng',lead_source:x.lead_source||'',parent_customer_id:x.parent_customer_id||'',custom_fields:x.custom_fields||{}});setShowAddForm(true);window.scrollTo({top:0,behavior:'smooth'})}
  async function saveFilter(){if(!filterName.trim()){setM('Vui lòng nhập tên cho bộ lọc cần lưu.');return}try{setM((await api('/api/s3/customer-filters',{method:'POST',body:JSON.stringify({name:filterName,filters:{...flt,custom_fields:customFlt}})})).message);setFilterName('');await load()}catch(e){setM(errText(e))}}
  function applySaved(x){const all=x.filters||{};const cf=all.custom_fields||{};const base={...emptyFilter,...all};delete base.custom_fields;setFlt(base);setCustomFlt(cf);load(base,cf)}
  function resetFilters(){setFlt(emptyFilter);setCustomFlt({});load(emptyFilter,{})}
  const ownerOptions=Array.from(new Map(items.filter(x=>x.owner_id).map(x=>[x.owner_id,{id:x.owner_id,name:x.owner_name}])).values())
  const catValues=t=>categories.filter(x=>x.category_type===t).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(x=>x.value)
  const renderCustomInput=(d,values,setValues)=>{const val=values[String(d.id)]||'';const update=v=>setValues({...values,[String(d.id)]:v});if(d.field_type==='select')return <Select key={d.id} label={`${d.field_name}${d.is_required?' *':''}`} value={val} onChange={e=>update(e.target.value)}><option value="">-- Chọn --</option>{(d.options||[]).map(o=><option key={o}>{o}</option>)}</Select>;return <Field key={d.id} label={`${d.field_name}${d.is_required?' *':''}`} type={d.field_type==='number'?'number':d.field_type==='date'?'date':'text'} value={val} required={!!d.is_required} onChange={e=>update(e.target.value)}/>}

  return <div className="crm-customers-container" style={{display:'flex',flexDirection:'column',gap:16}}>
    <div className="panel customer-search-panel" style={{borderTop:filterMode?'4px solid #0284c7':'4px solid #4f46e5'}}>
      <div className="panel-head"><div><h2><Search size={23}/> {filterMode?'Tra cứu & Lọc khách hàng chuyên sâu':'Quản lý Hồ sơ Khách hàng Doanh nghiệp'}</h2><p className="panel-desc">Tìm theo tên, MST, email, SĐT người liên hệ; lọc theo trạng thái, ngành nghề, quy mô, khu vực, chủ sở hữu và trường tùy chỉnh.</p></div><div className="toolbar"><button className="primary small-btn" onClick={()=>{setF(emptyForm);setEditingId(null);setShowAddForm(true)}}><Plus size={15}/> Thêm khách hàng</button><button className="secondary small-btn" onClick={()=>download('/api/data/export','du-lieu-khach-hang.xlsx')}><Download size={14}/> Xuất Excel</button></div></div>
      <Notice text={m} type={m&&/không|lỗi|Vui lòng|Hãy/i.test(m)?'err':'ok'}/>
      <div className="grid3"><Field label="Tên / MST / Email / SĐT liên hệ" value={flt.q} onChange={e=>setFlt({...flt,q:e.target.value})}/><Select label="Trạng thái" value={flt.status} onChange={e=>setFlt({...flt,status:e.target.value})}><option value="">Mọi trạng thái</option>{['Tiềm năng','Đang giao dịch','Khách hàng','Ngừng hợp tác'].map(x=><option key={x}>{x}</option>)}</Select><Select label="Ngành nghề" value={flt.industry} onChange={e=>setFlt({...flt,industry:e.target.value})}><option value="">Tất cả ngành nghề</option>{catValues('Ngành nghề').map(x=><option key={x}>{x}</option>)}</Select><Select label="Quy mô" value={flt.company_size} onChange={e=>setFlt({...flt,company_size:e.target.value})}><option value="">Tất cả quy mô</option>{catValues('Quy mô').map(x=><option key={x}>{x}</option>)}</Select><Field label="Khu vực" value={flt.region} onChange={e=>setFlt({...flt,region:e.target.value})}/><Select label="Người sở hữu" value={flt.owner_id} onChange={e=>setFlt({...flt,owner_id:e.target.value})}><option value="">Tất cả trong phạm vi</option>{ownerOptions.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</Select></div>
      {customDefs.length>0&&<div className="grid3" style={{marginTop:8}}>{customDefs.map(d=>renderCustomInput(d,customFlt,setCustomFlt))}</div>}
      <div className="toolbar"><button className="primary" onClick={()=>load()} disabled={loading}><Filter size={16}/> {loading?'Đang lọc...':'Áp dụng bộ lọc'}</button><button className="secondary" onClick={resetFilters}>Xóa lọc</button></div>
      {filterMode&&<div className="toolbar"><input placeholder="Tên bộ lọc hay dùng" value={filterName} onChange={e=>setFilterName(e.target.value)}/><button className="secondary" onClick={saveFilter}>Lưu bộ lọc</button>{saved.map(x=><button key={x.id} className="secondary small-btn" onClick={()=>applySaved(x)}>★ {x.name}</button>)}</div>}
    </div>

    {showAddForm&&<div className="modal-backdrop" onClick={()=>setShowAddForm(false)}><div className="modal-card" onClick={e=>e.stopPropagation()} style={{maxWidth:980,borderTop:'5px solid #4f46e5'}}><div className="modal-header"><h3>{editingId?'Sửa hồ sơ khách hàng':'Thêm khách hàng doanh nghiệp mới'}</h3><button className="modal-close-btn" onClick={()=>setShowAddForm(false)}><X size={18}/></button></div><form onSubmit={saveCustomer}><div className="grid3"><Field label="Tên công ty" required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/><Field label="Mã số thuế" value={f.tax_code} onChange={e=>setF({...f,tax_code:e.target.value})}/><Select label="Ngành nghề" value={f.industry} onChange={e=>setF({...f,industry:e.target.value})}><option value="">-- Chọn ngành nghề --</option>{catValues('Ngành nghề').map(x=><option key={x}>{x}</option>)}</Select><Select label="Quy mô" value={f.company_size} onChange={e=>setF({...f,company_size:e.target.value})}><option value="">-- Chọn quy mô --</option>{catValues('Quy mô').map(x=><option key={x}>{x}</option>)}</Select><Field label="Website" value={f.website} onChange={e=>setF({...f,website:e.target.value})}/><Field label="Địa chỉ" value={f.address} onChange={e=>setF({...f,address:e.target.value})}/><Field label="Điện thoại" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/><Field label="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/><Select label="Nguồn lead" value={f.lead_source} onChange={e=>setF({...f,lead_source:e.target.value})}><option value="">-- Chọn nguồn lead --</option>{catValues('Nguồn lead').map(x=><option key={x}>{x}</option>)}</Select><Select label="Trạng thái" value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{['Tiềm năng','Đang giao dịch','Khách hàng','Ngừng hợp tác'].map(x=><option key={x}>{x}</option>)}</Select><Select label="Công ty mẹ" value={f.parent_customer_id} onChange={e=>setF({...f,parent_customer_id:e.target.value})}><option value="">Không có</option>{items.filter(x=>x.id!==editingId).map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</Select>{customDefs.map(d=>renderCustomInput(d,f.custom_fields||{},v=>setF({...f,custom_fields:v})))}</div><div className="modal-footer"><button type="button" className="secondary" onClick={()=>setShowAddForm(false)}>Hủy</button><button type="submit" className="primary">{editingId?'Lưu thay đổi':'Tạo khách hàng'}</button></div></form></div></div>}

    <div className="panel"><h3>Danh sách khách hàng ({items.length})</h3><Table headers={['ID','Doanh nghiệp','MST','Ngành','Quy mô','Trạng thái','Công ty mẹ','Người phụ trách','Thao tác']} rows={items.map(x=>[`#${x.id}`,<b>{x.name}</b>,x.tax_code||'-',x.industry||'-',x.company_size||'-',formatTableCell(x.status),x.parent_name||'-',x.owner_name,<span style={{display:'flex',gap:6}}><button className="secondary small-btn" onClick={()=>editItem(x)}>Sửa</button><button className="primary small-btn" onClick={()=>go('/customer-360?id='+x.id)}>Xem 360°</button></span>])}/></div>
  </div>
}

function Customer360() {
  const initialCustomerId=new URLSearchParams(window.location.search).get('id')||''
  const [id,setId]=useState(initialCustomerId)
  const [customers,setCustomers]=useState([]),[customersLoading,setCustomersLoading]=useState(true),[d,setD]=useState(null),[m,setM]=useState(''),[file,setFile]=useState(null),[uploadingFile,setUploadingFile]=useState(false),[hier,setHier]=useState(null)
  const attachmentInputRef=useRef(null)
  const [stages,setStages]=useState([]),[reasons,setReasons]=useState([]),[competitors,setCompetitors]=useState([]),[oppDefs,setOppDefs]=useState([]),[oppFlt,setOppFlt]=useState({}),[activityTypes,setActivityTypes]=useState([])
  const [contact,setContact]=useState({full_name:'',title:'',email:'',phone:'',buying_role:'Người quyết định'})
  const [opp,setOpp]=useState({title:'',value:0,stage:'Tiếp cận',custom_fields:{}}),[act,setAct]=useState({subject:'',activity_type:'Ghi chú'})
  const [closing,setClosing]=useState(null),[closeData,setCloseData]=useState({result_type:'Thắng',reason_id:'',competitor_id:''})

  useEffect(()=>{
    let alive=true
    // Danh sách khách hàng phải độc lập với các API cấu hình khác để dropdown luôn dùng được.
    api('/api/s3/customers')
      .then(c=>{if(alive)setCustomers(Array.isArray(c)?c:(c.items||[]))})
      .catch(e=>{if(alive)setM('Không tải được danh sách khách hàng: '+errText(e))})
      .finally(()=>{if(alive)setCustomersLoading(false)})

    Promise.allSettled([
      api('/api/s2/pipeline-stages'),
      api('/api/s2/win-loss-reasons'),
      api('/api/s2/competitors'),
      api('/api/s2/custom-fields?entity_type=opportunity'),
      api('/api/s2/categories?category_type='+encodeURIComponent('Loại hoạt động'))
    ]).then(results=>{
      if(!alive)return
      const [s,r,co,cf,cat]=results
      if(s.status==='fulfilled')setStages((s.value.items||[]).filter(x=>x.is_active))
      if(r.status==='fulfilled')setReasons(r.value.items||[])
      if(co.status==='fulfilled')setCompetitors((co.value.items||[]).filter(x=>x.is_active))
      if(cf.status==='fulfilled')setOppDefs(cf.value.items||[])
      if(cat.status==='fulfilled')setActivityTypes((cat.value.items||[]).filter(x=>x.is_active).map(x=>x.value))
    })

    if(initialCustomerId)setTimeout(()=>load(initialCustomerId),0)
    return()=>{alive=false}
  },[])
  async function load(customerId=id){
    const targetId=String(customerId||'').trim()
    if(!targetId){setM('Hãy chọn một khách hàng để xem hồ sơ 360°.');setD(null);setHier(null);return}
    try{
      const[a,h]=await Promise.all([api('/api/s3/customers/'+targetId+'/360'),api('/api/s3/customers/'+targetId+'/hierarchy')])
      setId(targetId);setD(a);setHier(h);setM('')
      const nextUrl='/customer-360?id='+encodeURIComponent(targetId)
      if(window.location.pathname+window.location.search!==nextUrl)window.history.replaceState({},'',nextUrl)
      // Nếu API danh sách bị giới hạn nhưng hồ sơ hiện tại vẫn đọc được, vẫn đưa khách đó vào dropdown.
      if(a?.customer)setCustomers(prev=>prev.some(x=>String(x.id)===String(a.customer.id))?prev:[a.customer,...prev])
    }catch(e){
      const msg=errText(e)
      setD(null);setHier(null)
      setM(/Not Found|404/i.test(msg)?'Không tìm thấy khách hàng này hoặc bạn không có quyền xem. Hãy chọn khách hàng khác.':msg)
    }
  }
  async function post(path,body,method='POST'){try{setM((await api(path,{method,body:JSON.stringify(body)})).message);await load()}catch(e){setM(errText(e))}}
  async function primary(cid){await post(`/api/s3/contacts/${cid}/primary`,{},'PUT')}
  async function move(cid){const target=prompt('Nhập ID khách hàng mới cho người liên hệ:');if(target)await post(`/api/s3/contacts/${cid}/move`,{customer_id:Number(target)},'PUT')}
  async function changeStage(oid,stage){await post(`/api/s3/opportunities/${oid}/stage`,{stage},'PUT')}
  async function closeOpportunity(){if(!closing||!closeData.reason_id){setM('Hãy chọn kết quả và lý do trước khi đóng cơ hội.');return}if(closeData.result_type==='Thua'&&!closeData.competitor_id){setM('Cơ hội thua phải chọn đối thủ cạnh tranh.');return}await post(`/api/s3/opportunities/${closing}/close`,{result_type:closeData.result_type,reason_id:Number(closeData.reason_id),competitor_id:closeData.competitor_id?Number(closeData.competitor_id):null});setClosing(null)}
  function pickAttachment(nextFile){
    if(!nextFile){setFile(null);return}
    if(nextFile.size>10*1024*1024){
      setM('Tệp đính kèm không được vượt quá 10MB.')
      setFile(null)
      if(attachmentInputRef.current)attachmentInputRef.current.value=''
      return
    }
    setFile(nextFile)
    setM('')
  }
  function clearAttachment(){
    setFile(null)
    if(attachmentInputRef.current)attachmentInputRef.current.value=''
  }
  async function upload(){
    if(!id){setM('Hãy chọn khách hàng trước khi tải tệp đính kèm.');return}
    if(!file){setM('Hãy chọn tệp đính kèm.');return}
    const fd=new FormData();fd.append('file',file)
    try{
      setUploadingFile(true)
      const r=await fetch(API_BASE+`/api/s3/customers/${id}/files`,{method:'POST',credentials:'include',body:fd})
      const x=await r.json()
      if(!r.ok)throw new Error(x.detail||'Không thể tải tệp')
      setM(x.message||'Đã tải tệp đính kèm.')
      clearAttachment()
      await load()
    }catch(e){setM(errText(e))}finally{setUploadingFile(false)}
  }
  const renderOppCustom=(def)=>{const v=(opp.custom_fields||{})[String(def.id)]||'';const set=v2=>setOpp({...opp,custom_fields:{...(opp.custom_fields||{}),[String(def.id)]:v2}});if(def.field_type==='select')return <Select key={def.id} label={`${def.field_name}${def.is_required?' *':''}`} value={v} onChange={e=>set(e.target.value)}><option value="">-- Chọn --</option>{(def.options||[]).map(x=><option key={x}>{x}</option>)}</Select>;return <Field key={def.id} label={`${def.field_name}${def.is_required?' *':''}`} type={def.field_type==='number'?'number':def.field_type==='date'?'date':'text'} value={v} required={!!def.is_required} onChange={e=>set(e.target.value)}/>}
  const filteredOpps=(d?.opportunities||[]).filter(o=>Object.entries(oppFlt).every(([fid,needle])=>{if(String(needle||'').trim()==='')return true;const actual=(o.custom_fields||{})[String(fid)]??'';return String(actual).toLowerCase().includes(String(needle).toLowerCase())}))
  const renderOppFilter=(def)=>{const v=oppFlt[String(def.id)]||'';const set=v2=>setOppFlt({...oppFlt,[String(def.id)]:v2});if(def.field_type==='select')return <Select key={def.id} label={`Lọc: ${def.field_name}`} value={v} onChange={e=>set(e.target.value)}><option value="">Tất cả</option>{(def.options||[]).map(x=><option key={x}>{x}</option>)}</Select>;return <Field key={def.id} label={`Lọc: ${def.field_name}`} type={def.field_type==='number'?'number':def.field_type==='date'?'date':'text'} value={v} onChange={e=>set(e.target.value)}/>}
  const money=v=>Number(v||0).toLocaleString('vi-VN')+' ₫'
  const openOpps=filteredOpps.filter(x=>!x.result_type)
  const closedOpps=filteredOpps.filter(x=>!!x.result_type)
  const primaryContact=(d?.contacts||[]).find(x=>x.is_primary)
  const lastActivity=(d?.activities||[])[0]

  return <div className="customer360-page">
    <div className="panel customer360-selector">
      <div className="panel-head">
        <div>
          <h2><ContactRound size={22}/> Trang 360° hồ sơ khách hàng</h2>
          <p className="panel-desc">Một nơi duy nhất để xem thông tin công ty, người liên hệ, cơ hội, lịch sử tương tác, tệp đính kèm và cảnh báo chăm sóc.</p>
        </div>
      </div>
      <Notice text={m} type={m&&/không|Hãy|lỗi|Chưa|tìm thấy/i.test(m)?'err':'ok'}/>
      <div className="toolbar customer360-selectbar">
        <select
          value={id}
          disabled={customersLoading}
          onChange={e=>{
            const nextId=e.target.value
            setId(nextId);setD(null);setHier(null);setM('')
            if(nextId)load(nextId)
            else window.history.replaceState({},'','/customer-360')
          }}
        >
          <option value="">{customersLoading?'-- Đang tải danh sách khách hàng --':'-- Chọn khách hàng --'}</option>
          {customers.map(x=><option key={x.id} value={String(x.id)}>#{x.id} - {x.name}{x.tax_code?` · MST ${x.tax_code}`:''}</option>)}
        </select>
        <button className="primary" onClick={()=>load(id)} disabled={!id||customersLoading}><Search size={16}/> Xem thông tin 360°</button>
        {!customersLoading&&<span className="hint customer360-select-hint">{customers.length?`${customers.length} khách hàng có thể chọn`:'Không có khách hàng trong phạm vi quyền hiện tại'}</span>}
      </div>
    </div>

    {!d&&<div className="panel customer360-empty">
      <div className="customer360-empty-head">
        <div className="customer360-empty-icon"><ContactRound size={28}/></div>
        <div><h3>Hồ sơ 360° sẽ hiển thị đầy đủ bối cảnh khách hàng</h3><p>Chọn một khách hàng phía trên để xem dữ liệu thực tế. Các nhóm thông tin bên dưới sẽ được tải tự động.</p></div>
      </div>
      <div className="customer360-feature-grid">
        <div className="customer360-feature-card"><Building2 size={21}/><b>Thông tin công ty</b><span>MST, ngành nghề, quy mô, website, địa chỉ, trạng thái, chủ sở hữu.</span></div>
        <div className="customer360-feature-card"><Users size={21}/><b>Người liên hệ</b><span>Chức danh, email, số điện thoại, vai trò mua hàng và đầu mối chính.</span></div>
        <div className="customer360-feature-card"><BriefcaseBusiness size={21}/><b>Cơ hội kinh doanh</b><span>Tách rõ cơ hội đang mở và đã đóng, giá trị, giai đoạn, xác suất và dự báo.</span></div>
        <div className="customer360-feature-card"><Activity size={21}/><b>Dòng thời gian</b><span>Lịch sử cuộc gọi, gặp mặt, email, ghi chú và các hoạt động gần nhất.</span></div>
        <div className="customer360-feature-card"><Upload size={21}/><b>Tệp đính kèm</b><span>Hợp đồng, báo giá và tài liệu liên quan đến khách hàng.</span></div>
        <div className="customer360-feature-card"><HeartHandshake size={21}/><b>Chăm sóc & rủi ro</b><span>Theo dõi yêu cầu hỗ trợ đang mở và cảnh báo nguy cơ rời bỏ.</span></div>
      </div>
    </div>}

    {d&&<>
      {d.churn_risk&&<div className="notice err"><AlertCircle size={20}/><span><b>Cảnh báo rủi ro rời bỏ:</b> khách hàng có {d.open_support_count} yêu cầu hỗ trợ chưa xử lý. Người phụ trách đã được cảnh báo.</span></div>}

      <div className="customer360-hero panel">
        <div className="customer360-company-title">
          <div className="customer360-company-avatar"><Building2 size={27}/></div>
          <div><span className="eyebrow">HỒ SƠ KHÁCH HÀNG</span><h2>{d.customer.name}</h2><p>{d.customer.tax_code?`MST: ${d.customer.tax_code}`:'Chưa có mã số thuế'} · {d.customer.status||'Chưa cập nhật trạng thái'}</p></div>
        </div>
        <div className="customer360-status-row">
          <span className="badge badge-info">{d.customer.owner_name||'Chưa có người phụ trách'}</span>
          {d.customer.group_name&&<span className="badge badge-info">{d.customer.group_name}</span>}
          {d.churn_risk?<span className="badge badge-danger">Rủi ro cao</span>:<span className="badge badge-success">Không có cảnh báo rủi ro</span>}
        </div>
      </div>

      <div className="customer360-kpi-grid">
        <div className="customer360-kpi"><DollarSign size={20}/><span>Tổng giá trị đã ký</span><strong>{money(d.total_signed)}</strong><small>Doanh thu từ cơ hội thắng</small></div>
        <div className="customer360-kpi"><Target size={20}/><span>Giá trị cơ hội đang mở</span><strong>{money(d.total_open)}</strong><small>{openOpps.length} cơ hội đang theo đuổi</small></div>
        <div className="customer360-kpi"><Users size={20}/><span>Người liên hệ</span><strong>{(d.contacts||[]).length}</strong><small>{primaryContact?`Đầu mối: ${primaryContact.full_name}`:'Chưa chọn đầu mối chính'}</small></div>
        <div className="customer360-kpi"><Activity size={20}/><span>Hoạt động đã ghi</span><strong>{(d.activities||[]).length}</strong><small>{lastActivity?`Gần nhất: ${formatDateVi(lastActivity.created_at)}`:'Chưa có tương tác'}</small></div>
        <div className="customer360-kpi"><HeartHandshake size={20}/><span>Yêu cầu hỗ trợ mở</span><strong>{d.open_support_count||0}</strong><small>{d.churn_risk?'Cần ưu tiên xử lý':'Trong ngưỡng an toàn'}</small></div>
        <div className="customer360-kpi"><Building2 size={20}/><span>Giá trị toàn nhóm công ty</span><strong>{money(d.group_contract_value)}</strong><small>{d.customer.parent_name?`Công ty mẹ: ${d.customer.parent_name}`:'Pháp nhân độc lập'}</small></div>
      </div>

      <div className="panel">
        <div className="section-title-row"><div><h3><Building2 size={19}/> Thông tin doanh nghiệp</h3><p className="panel-desc">Thông tin nhận diện, phân loại và người phụ trách khách hàng.</p></div></div>
        <div className="customer360-meta-grid">
          <div><span>Mã số thuế</span><b>{d.customer.tax_code||'-'}</b></div>
          <div><span>Trạng thái</span><b>{formatTableCell(d.customer.status||'-')}</b></div>
          <div><span>Ngành nghề</span><b>{d.customer.industry||'-'}</b></div>
          <div><span>Quy mô</span><b>{d.customer.company_size||'-'}</b></div>
          <div><span>Điện thoại</span><b>{d.customer.phone||'-'}</b></div>
          <div><span>Email</span><b>{d.customer.email||'-'}</b></div>
          <div><span>Website</span><b>{d.customer.website||'-'}</b></div>
          <div><span>Địa chỉ</span><b>{d.customer.address||'-'}</b></div>
          <div><span>Người sở hữu</span><b>{d.customer.owner_name||'-'}</b></div>
          <div><span>Nhóm kinh doanh</span><b>{d.customer.group_name||'-'}</b></div>
          <div><span>Công ty mẹ</span><b>{d.customer.parent_name||'Không có'}</b></div>
          <div><span>Hiệu năng tải 360°</span><b className={d.performance_pass?'text-success':'text-danger'}>{d.load_seconds}s · {d.performance_pass?'Đạt < 1,5s':'Cần tối ưu'}</b></div>
        </div>
        {hier&&<div style={{marginTop:18}}><h4>Công ty con trong hệ thống</h4>{(hier.children||[]).length?<Table headers={['ID','Công ty con','Cấp','Trạng thái']} rows={(hier.children||[]).map(x=>[x.id,x.name,x.depth,formatTableCell(x.status)])}/>:<p className="hint">Chưa có công ty con trực thuộc.</p>}</div>}
      </div>

      <div className="panel">
        <div className="section-title-row"><div><h3><Users size={19}/> Người liên hệ</h3><p className="panel-desc">Theo dõi người quyết định, người ảnh hưởng và đầu mối chính tại doanh nghiệp.</p></div><span className="badge badge-info">{(d.contacts||[]).length} người</span></div>
        <div className="grid3"><Field label="Họ tên" value={contact.full_name} onChange={e=>setContact({...contact,full_name:e.target.value})}/><Field label="Chức danh" value={contact.title} onChange={e=>setContact({...contact,title:e.target.value})}/><Field label="Điện thoại" value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})}/><Field label="Email" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/><Select label="Vai trò mua hàng" value={contact.buying_role} onChange={e=>setContact({...contact,buying_role:e.target.value})}>{['Người quyết định','Người ảnh hưởng','Người dùng cuối','Người cản trở'].map(x=><option key={x}>{x}</option>)}</Select></div>
        <button className="primary" onClick={()=>post(`/api/s3/customers/${id}/contacts`,contact)}><Plus size={16}/> Thêm liên hệ</button>
        {(d.contacts||[]).length?<Table headers={['ID','Tên','Chức danh','Email','SĐT','Vai trò','Đầu mối','Lịch sử công ty','Thao tác']} rows={(d.contacts||[]).map(x=>[x.id,x.full_name,x.title||'-',x.email||'-',x.phone||'-',x.buying_role||'-',x.is_primary?'Có':'Không',(x.company_history||[]).map(h=>h.company_name).join(' → ')||'-',<span style={{display:'flex',gap:6}}><button className="secondary small-btn" disabled={!!x.is_primary} onClick={()=>primary(x.id)}>Đầu mối chính</button><button className="secondary small-btn" onClick={()=>move(x.id)}>Chuyển Cty</button></span>])}/>:<p className="hint">Chưa có người liên hệ. Thêm đầu mối đầu tiên để hoàn thiện hồ sơ khách hàng.</p>}
      </div>

      <div className="panel">
        <div className="section-title-row"><div><h3><BriefcaseBusiness size={19}/> Cơ hội kinh doanh</h3><p className="panel-desc">Quản lý cơ hội đang theo đuổi và lịch sử các cơ hội đã đóng.</p></div><span className="badge badge-info">{filteredOpps.length} cơ hội</span></div>
        <div className="grid3"><Field label="Tên cơ hội" value={opp.title} onChange={e=>setOpp({...opp,title:e.target.value})}/><Field label="Giá trị (₫)" type="number" value={opp.value} onChange={e=>setOpp({...opp,value:Number(e.target.value)})}/><Select label="Giai đoạn" value={opp.stage} onChange={e=>setOpp({...opp,stage:e.target.value})}>{stages.map(x=><option key={x.id}>{x.name}</option>)}</Select>{oppDefs.map(renderOppCustom)}</div>
        <button className="primary" onClick={()=>post(`/api/s3/customers/${id}/opportunities`,opp)}><Plus size={16}/> Thêm cơ hội mới</button>
        {oppDefs.length>0&&<div className="subtle-box" style={{marginTop:16}}><div className="row"><b>Bộ lọc cơ hội theo trường tùy chỉnh</b><button className="secondary small-btn" onClick={()=>setOppFlt({})}>Xóa lọc</button></div><div className="grid3">{oppDefs.map(renderOppFilter)}</div></div>}
        <div className="customer360-opportunity-split">
          <div><h4>Cơ hội đang mở <span className="badge badge-warning">{openOpps.length}</span></h4>{openOpps.length?<Table headers={['Cơ hội','Giá trị','Giai đoạn','Xác suất','Dự báo','Thao tác']} rows={openOpps.map(x=>[x.title,money(x.value),<select value={x.stage} onChange={e=>changeStage(x.id,e.target.value)}>{stages.map(s=><option key={s.id}>{s.name}</option>)}</select>,(x.win_probability||0)+'%',money(x.forecast_value),<button className="secondary small-btn" onClick={()=>{setClosing(x.id);setCloseData({result_type:'Thắng',reason_id:'',competitor_id:''})}}>Đóng cơ hội</button>])}/>:<p className="hint">Không có cơ hội đang mở.</p>}</div>
          <div><h4>Cơ hội đã đóng <span className="badge badge-info">{closedOpps.length}</span></h4>{closedOpps.length?<Table headers={['Cơ hội','Giá trị','Kết quả','Giai đoạn','Xác suất']} rows={closedOpps.map(x=>[x.title,money(x.value),formatTableCell(x.result_type),x.stage||'-',(x.win_probability||0)+'%'])}/>:<p className="hint">Chưa có cơ hội đã đóng.</p>}</div>
        </div>
      </div>

      {closing&&<div className="panel" style={{border:'1px solid #f59e0b'}}><h3>Đóng cơ hội #{closing}</h3><div className="grid3"><Select label="Kết quả" value={closeData.result_type} onChange={e=>setCloseData({...closeData,result_type:e.target.value,reason_id:'',competitor_id:''})}><option>Thắng</option><option>Thua</option></Select><Select label="Lý do bắt buộc" value={closeData.reason_id} onChange={e=>setCloseData({...closeData,reason_id:e.target.value})}><option value="">-- Chọn --</option>{reasons.filter(r=>r.result_type===closeData.result_type&&r.is_active).map(r=><option key={r.id} value={r.id}>{r.reason}</option>)}</Select>{closeData.result_type==='Thua'&&<Select label="Đối thủ cạnh tranh" value={closeData.competitor_id} onChange={e=>setCloseData({...closeData,competitor_id:e.target.value})}><option value="">-- Chọn --</option>{competitors.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select>}</div><div className="toolbar"><button className="primary" onClick={closeOpportunity}>Xác nhận đóng</button><button className="secondary" onClick={()=>setClosing(null)}>Hủy</button></div></div>}

      <div className="panel">
        <div className="section-title-row"><div><h3><Activity size={19}/> Dòng thời gian hoạt động</h3><p className="panel-desc">Tối đa 500 hoạt động gần nhất, phục vụ tra cứu nhanh trước khi liên hệ khách hàng.</p></div><span className="badge badge-info">{(d.activities||[]).length} hoạt động</span></div>
        <div className="grid2"><Field label="Nội dung" value={act.subject} onChange={e=>setAct({...act,subject:e.target.value})}/><Select label="Loại tương tác" value={act.activity_type} onChange={e=>setAct({...act,activity_type:e.target.value})}>{(activityTypes.length?activityTypes:['Ghi chú']).map(x=><option key={x}>{x}</option>)}</Select></div>
        <button className="primary" onClick={()=>post(`/api/s3/customers/${id}/activities`,act)}><Plus size={16}/> Ghi hoạt động</button>
        {(d.activities||[]).length?<div className="timeline-list">{(d.activities||[]).slice(0,30).map((x,i)=><div className="timeline-item" key={x.id||i}><div className="timeline-dot"></div><div><div className="timeline-title"><b>{x.activity_type||'Hoạt động'}</b><span>{formatDateVi(x.created_at)}</span></div><p>{x.subject||'-'}</p></div></div>)}</div>:<p className="hint">Chưa có hoạt động nào được ghi nhận.</p>}
        {(d.activities||[]).length>30&&<p className="hint">Đang hiển thị 30 hoạt động gần nhất trên tổng số {(d.activities||[]).length} hoạt động đã tải.</p>}
      </div>

      <div className="panel">
        <div className="section-title-row"><div><h3><Upload size={19}/> Tệp đính kèm</h3><p className="panel-desc">Lưu hợp đồng, báo giá và tài liệu trao đổi liên quan đến khách hàng.</p></div><span className="badge badge-info">{(d.files||[]).length} tệp</span></div>
        <div className="customer360-attachment-upload">
          <label className={'customer360-file-dropzone '+(file?'has-file':'')}>
            <input
              ref={attachmentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.zip"
              onChange={e=>pickAttachment(e.target.files?.[0]||null)}
            />
            <div className="customer360-file-icon"><Upload size={22}/></div>
            <div className="customer360-file-copy">
              <strong>{file?file.name:'Chọn tệp từ máy tính'}</strong>
              <span>{file?`${Math.max(1,Math.round(file.size/1024))} KB · Sẵn sàng tải lên`:'PDF, Word, Excel, ảnh, TXT, CSV hoặc ZIP · tối đa 10MB'}</span>
            </div>
            <span className="customer360-file-choose">{file?'Đổi tệp':'Chọn tệp'}</span>
          </label>
          <div className="customer360-file-actions">
            <button className="primary" onClick={upload} disabled={!file||uploadingFile}>
              {uploadingFile?<><RefreshCw size={16} className="spin"/> Đang tải...</>:<><Upload size={16}/> Tải tệp lên</>}
            </button>
            {file&&<button type="button" className="secondary" onClick={clearAttachment} disabled={uploadingFile}><X size={15}/> Bỏ tệp đã chọn</button>}
            <span className="customer360-file-note">Tệp được lưu theo khách hàng đang mở và chỉ người có quyền dữ liệu mới tải xuống được.</span>
          </div>
        </div>
        {(d.files||[]).length?<Table headers={['Tên tệp','Dung lượng','Thời gian','Thao tác']} rows={(d.files||[]).map(x=>[<div className="customer360-file-name"><span className="customer360-file-mini-icon"><Upload size={14}/></span><b>{x.file_name}</b></div>,Math.max(1,Math.round(Number(x.file_size||0)/1024))+' KB',formatDateVi(x.created_at),<button className="secondary small-btn" onClick={()=>download('/api/s3/customer-files/'+x.id,x.file_name)}><Download size={14}/> Tải về</button>])}/>:<div className="customer360-files-empty"><Upload size={22}/><div><b>Chưa có tệp đính kèm</b><span>Chọn tệp phía trên để thêm hợp đồng, báo giá hoặc tài liệu trao đổi.</span></div></div>}
      </div>

      <div className="panel customer360-support-summary">
        <div><h3><HeartHandshake size={19}/> Chăm sóc & hỗ trợ</h3><p className="panel-desc">Theo dõi nhanh tình trạng hỗ trợ sau bán của khách hàng này.</p></div>
        <div className="customer360-support-box"><span>Yêu cầu đang mở</span><strong>{d.open_support_count||0}</strong><small>{d.churn_risk?'Đã vượt ngưỡng cảnh báo rời bỏ':'Chưa vượt ngưỡng cảnh báo'}</small></div>
        <button className="secondary" onClick={()=>go('/support')}>Mở trang Hỗ trợ & rủi ro</button>
      </div>
    </>}
  </div>
}

function Duplicates() {
  const [items,setItems]=useState([]),[m,setM]=useState(''),[loading,setLoading]=useState(false),[selected,setSelected]=useState(null)
  async function load(){setLoading(true);try{const r=await api('/api/s3/customers/duplicates');setItems(r.items||[]);setM(r.items?.length?`Đã phát hiện ${r.items.length} cặp khách hàng nghi trùng. Hãy mở phần so sánh trước khi gộp.`:'Không phát hiện cặp khách hàng trùng trong phạm vi dữ liệu hiện tại.')}catch(e){setM(errText(e))}finally{setLoading(false)}}
  useEffect(()=>{load()},[])
  async function merge(keep,dup){if(!confirm(`Giữ "${keep.name}" và gộp toàn bộ dữ liệu của "${dup.name}"?`))return;try{setM((await api('/api/s3/customers/merge',{method:'POST',body:JSON.stringify({keep_id:keep.id,merge_id:dup.id})})).message);setSelected(null);await load()}catch(e){setM(errText(e))}}

  const byTax=items.filter(x=>(x.reasons||[]).some(r=>r.includes('mã số thuế'))).length
  const byWebsite=items.filter(x=>(x.reasons||[]).some(r=>r.includes('website'))).length
  const byName=items.filter(x=>(x.reasons||[]).some(r=>r.includes('tên công ty'))).length

  return <>
    <div className="panel duplicate-hero-panel">
      <div className="section-title-row">
        <div>
          <h2><Merge size={22}/> Phát hiện & Gộp khách hàng trùng lặp</h2>
          <p className="panel-desc">Đối chiếu mã số thuế, website và tên công ty gần giống để tránh hai nhân viên cùng chăm sóc một doanh nghiệp.</p>
        </div>
        <span className="badge badge-info">S3-04 · Trưởng nhóm+</span>
      </div>
      <Notice text={m} type={m&&/không|lỗi|Không/i.test(m)?'err':'ok'}/>
      <div className="toolbar">
        <button className="primary" onClick={load} disabled={loading}><RefreshCw size={16}/> {loading?'Đang quét...':'Quét lại dữ liệu thật'}</button>
        <span className="hint">Chỉ Trưởng nhóm, Giám đốc và Quản trị viên được thực hiện gộp.</span>
      </div>
    </div>

    <div className="duplicate-summary-grid">
      <div className="duplicate-summary-card"><Merge size={20}/><span>Cặp nghi trùng</span><strong>{items.length}</strong><small>Cần kiểm tra trước khi gộp</small></div>
      <div className="duplicate-summary-card"><ShieldCheck size={20}/><span>Trùng mã số thuế</span><strong>{byTax}</strong><small>Độ tin cậy cao nhất</small></div>
      <div className="duplicate-summary-card"><Building2 size={20}/><span>Trùng website</span><strong>{byWebsite}</strong><small>Cùng tên miền doanh nghiệp</small></div>
      <div className="duplicate-summary-card"><Search size={20}/><span>Tên gần giống</span><strong>{byName}</strong><small>So khớp tên đã chuẩn hóa</small></div>
    </div>

    <div className="panel duplicate-guide-panel">
      <div className="section-title-row">
        <div><h3><ShieldCheck size={19}/> Cách hệ thống xử lý bản ghi trùng</h3><p className="panel-desc">Quy trình gộp giữ nguyên dữ liệu nghiệp vụ của cả hai hồ sơ.</p></div>
      </div>
      <div className="duplicate-guide-grid">
        <div><span className="duplicate-step">1</span><b>Phát hiện</b><p>Quét theo MST, website và tên doanh nghiệp gần giống.</p></div>
        <div><span className="duplicate-step">2</span><b>So sánh</b><p>Đặt hai hồ sơ cạnh nhau trước khi quyết định bản ghi nào được giữ.</p></div>
        <div><span className="duplicate-step">3</span><b>Gộp dữ liệu</b><p>Chuyển người liên hệ, cơ hội, hoạt động, tệp và yêu cầu hỗ trợ sang bản ghi được giữ.</p></div>
        <div><span className="duplicate-step">4</span><b>Lưu vết</b><p>Hành động gộp được ghi nhật ký để có thể truy vết người thao tác.</p></div>
      </div>
    </div>

    <div className="panel">
      <div className="section-title-row"><div><h3>Danh sách khách hàng nghi trùng</h3><p className="panel-desc">Bấm “So sánh cạnh nhau” để xem chi tiết hai hồ sơ trước khi gộp.</p></div><span className="badge badge-warning">{items.length} cặp</span></div>
      <Table headers={['Bản ghi gốc (A)','Bản ghi nghi trùng (B)','Lý do trùng','So sánh / Gộp']} rows={items.map(x=>[
        <div><b>#{x.a.id} {x.a.name}</b><br/><small>MST: {x.a.tax_code||'-'} · Website: {x.a.website||'-'}<br/>Chủ sở hữu: {x.a.owner_name||'-'}</small></div>,
        <div><b>#{x.b.id} {x.b.name}</b><br/><small>MST: {x.b.tax_code||'-'} · Website: {x.b.website||'-'}<br/>Chủ sở hữu: {x.b.owner_name||'-'}</small></div>,
        <div className="duplicate-reasons">{(x.reasons||[]).map((r,i)=><span key={i} className="badge badge-warning">{r}</span>)}</div>,
        <button className="secondary small-btn" onClick={()=>setSelected(x)}>So sánh cạnh nhau</button>
      ])}/>
      {!items.length&&<div className="duplicate-empty-help"><b>Chưa có cặp trùng để xử lý.</b><span>Bản demo đi kèm sẽ tạo một cặp Alpha Tech khi backend khởi động lại. Sau đó bấm “Quét lại dữ liệu thật”.</span></div>}
    </div>

    {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="modal-card duplicate-compare-modal" onClick={e=>e.stopPropagation()}><div className="modal-header"><div><h3>So sánh trước khi gộp</h3><p className="panel-desc">Chọn hồ sơ chính cần giữ. Hồ sơ còn lại sẽ được hợp nhất vào hồ sơ chính.</p></div><button className="modal-close-btn" onClick={()=>setSelected(null)}><X size={18}/></button></div><div className="grid2"><div className="panel duplicate-record-card"><span className="badge badge-info">Bản ghi A</span><h3>{selected.a.name}</h3><p><b>MST:</b> {selected.a.tax_code||'-'}</p><p><b>Website:</b> {selected.a.website||'-'}</p><p><b>Điện thoại:</b> {selected.a.phone||'-'}</p><p><b>Email:</b> {selected.a.email||'-'}</p><p><b>Chủ sở hữu:</b> {selected.a.owner_name||'-'}</p><button className="primary" onClick={()=>merge(selected.a,selected.b)}>Giữ A, gộp B vào A</button></div><div className="panel duplicate-record-card"><span className="badge badge-warning">Bản ghi B</span><h3>{selected.b.name}</h3><p><b>MST:</b> {selected.b.tax_code||'-'}</p><p><b>Website:</b> {selected.b.website||'-'}</p><p><b>Điện thoại:</b> {selected.b.phone||'-'}</p><p><b>Email:</b> {selected.b.email||'-'}</p><p><b>Chủ sở hữu:</b> {selected.b.owner_name||'-'}</p><button className="primary" onClick={()=>merge(selected.b,selected.a)}>Giữ B, gộp A vào B</button></div></div><div className="duplicate-merge-note"><CheckCircle2 size={18}/><span>Khi gộp, toàn bộ người liên hệ, cơ hội, hoạt động, tệp đính kèm và yêu cầu hỗ trợ của bản ghi bị gộp sẽ được chuyển sang bản ghi được giữ.</span></div></div></div>}
  </>
}

function Support() {
  const [d, setD] = useState({ items: [], churn_risks: [] })
  const [customers, setCustomers] = useState([])
  const [assignees, setAssignees] = useState([])
  const [cid, setCid] = useState('')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Trung bình')
  const [assigneeId, setAssigneeId] = useState('')
  const [m, setM] = useState('')

  async function load() {
    setM('')

    const [supportResult, contextResult] = await Promise.allSettled([
      api('/api/s3/support'),
      api('/api/s3/support-context')
    ])

    let supportData = { items: [], churn_risks: [] }
    if (supportResult.status === 'fulfilled') {
      supportData = {
        items: supportResult.value?.items || [],
        churn_risks: supportResult.value?.churn_risks || []
      }
      setD(supportData)
    } else {
      setD(supportData)
      setM(errText(supportResult.reason) || 'Không tải được dữ liệu Hỗ trợ & rủi ro.')
    }

    let customerItems = []
    let assigneeItems = []

    if (contextResult.status === 'fulfilled') {
      customerItems = contextResult.value?.customers || []
      assigneeItems = contextResult.value?.assignees || []
    } else {
      // Tương thích với backend/bản dữ liệu cũ: thử endpoint khách hàng đơn giản hơn.
      try {
        customerItems = (await api('/api/customers')).items || []
      } catch {}

      // Nếu endpoint danh mục người xử lý lỗi, tận dụng ID/người xử lý đang có trong ticket.
      const assigneeMap = new Map()
      for (const x of supportData.items || []) {
        if (x.assignee_id && x.assignee_name) {
          assigneeMap.set(String(x.assignee_id), {
            id: x.assignee_id,
            full_name: x.assignee_name,
            email: ''
          })
        }
      }
      assigneeItems = Array.from(assigneeMap.values())
    }

    // Fallback cuối: ticket/risk hiện có vẫn đủ để populate danh sách khách hàng.
    if (!customerItems.length) {
      const customerMap = new Map()
      for (const x of supportData.items || []) {
        if (x.customer_id && x.customer_name) customerMap.set(String(x.customer_id), { id: x.customer_id, name: x.customer_name })
      }
      for (const x of supportData.churn_risks || []) {
        if (x.id && x.name) customerMap.set(String(x.id), { id: x.id, name: x.name })
      }
      customerItems = Array.from(customerMap.values())
    }

    setCustomers(customerItems)
    setAssignees(assigneeItems)

    // Tự chọn sẵn giá trị đầu tiên để người dùng có thể tạo ticket ngay.
    setCid(prev => prev && customerItems.some(x => String(x.id) === String(prev)) ? prev : (customerItems[0]?.id ? String(customerItems[0].id) : ''))
    setAssigneeId(prev => prev && assigneeItems.some(x => String(x.id) === String(prev)) ? prev : (assigneeItems[0]?.id ? String(assigneeItems[0].id) : ''))

    if (supportResult.status === 'fulfilled' && (!customerItems.length || !assigneeItems.length)) {
      setM('Dữ liệu yêu cầu đã tải. Danh mục khách hàng/người xử lý chưa đầy đủ; hãy bấm Tải lại dữ liệu sau khi backend khởi động xong.')
    }
  }
  useEffect(() => { load() }, [])

  async function add() {
    if (!cid || !title.trim()) { setM('Hãy chọn khách hàng và nhập nội dung hỗ trợ.'); return }
    if (!assigneeId) { setM('Hãy chọn người xử lý yêu cầu hỗ trợ.'); return }
    try {
      setM((await api(`/api/s3/customers/${cid}/support`, {
        method: 'POST',
        body: JSON.stringify({ title, priority, assignee_id: Number(assigneeId) })
      })).message)
      setTitle('')
      await load()
    } catch (e) { setM(errText(e)) }
  }

  async function close(id) {
    try {
      setM((await api(`/api/s3/support/${id}/close`, { method: 'PUT' })).message)
      await load()
    } catch (e) { setM(errText(e)) }
  }

  return (
    <>
      <div className="panel support-create-panel">
        <div className="section-title-row">
          <div>
            <h2><HeartHandshake size={20} /> Yêu cầu hỗ trợ & Rủi ro rời bỏ</h2>
            <p className="panel-desc">Ghi nhận yêu cầu sau bán, phân công người xử lý và tự động cảnh báo khách có nguy cơ rời bỏ.</p>
          </div>
          <button type="button" className="secondary small-btn" onClick={load}>Tải lại dữ liệu</button>
        </div>
        <Notice text={m} type={m && /Hãy|lỗi|không|chưa tải/i.test(m) ? 'err' : 'ok'} />
        <div className="support-overview-grid">
          <div className="support-overview-card"><span>Yêu cầu hỗ trợ</span><strong>{d.items.length}</strong><small>Tổng số yêu cầu đang hiển thị</small></div>
          <div className="support-overview-card danger"><span>Khách rủi ro cao</span><strong>{d.churn_risks.length}</strong><small>Từ 3 yêu cầu chưa xử lý</small></div>
          <div className="support-overview-card info"><span>Đang mở / xử lý</span><strong>{d.items.filter(x => x.status !== 'Đã đóng').length}</strong><small>Cần tiếp tục theo dõi</small></div>
        </div>
        <div className="grid2">
          <Select label="Khách hàng" value={cid} onChange={e => setCid(e.target.value)}>
            <option value="">-- Chọn khách hàng --</option>
            {customers.map(x => <option key={x.id} value={x.id}>#{x.id} - {x.name}</option>)}
          </Select>
          <Select label="Người xử lý" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
            <option value="">-- Chọn người xử lý --</option>
            {assignees.map(x => <option key={x.id} value={x.id}>{x.full_name}{x.email ? ` - ${x.email}` : ''}</option>)}
          </Select>
          <Field label="Nội dung yêu cầu hỗ trợ" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ví dụ: Khách báo lỗi khi sử dụng dịch vụ..." />
          <Select label="Mức độ ưu tiên" value={priority} onChange={e => setPriority(e.target.value)}>
            <option>Thấp</option>
            <option>Trung bình</option>
            <option>Cao</option>
          </Select>
        </div>
        <button className="primary" onClick={add}><Plus size={16} /> Tạo yêu cầu</button>
        <p className="hint">Khi một khách hàng có từ 3 yêu cầu chưa xử lý, hệ thống tự gắn cờ rủi ro trên trang 360° và tạo cảnh báo cho nhân viên kinh doanh đang sở hữu khách hàng.</p>
      </div>

      <div className="panel support-risk-panel">
        <div className="section-title-row">
          <div>
            <h3><AlertCircle size={18} color="#ef4444" /> Khách hàng có rủi ro cao (≥3 yêu cầu chưa xử lý)</h3>
            <p className="panel-desc">Các khách hàng cần ưu tiên chăm sóc để giảm nguy cơ rời bỏ.</p>
          </div>
          <span className="badge badge-danger">{d.churn_risks.length} khách</span>
        </div>
        <Table headers={['ID', 'Tên khách hàng', 'Số yêu cầu đang mở']} rows={d.churn_risks.map(x => [
          '#' + x.id,
          <div><b>{x.name}</b><br/><small>Cần ưu tiên liên hệ và xử lý các yêu cầu tồn đọng.</small></div>,
          <span className="badge badge-danger">{x.open_count} yêu cầu</span>
        ])} />
        {!d.churn_risks.length && <div className="support-empty-state"><CheckCircle2 size={20}/><div><b>Chưa có khách hàng vượt ngưỡng rủi ro.</b><span>Sau khi backend khởi động lại, bộ dữ liệu demo sẽ tạo sẵn khách hàng có từ 3 yêu cầu đang mở để kiểm thử.</span></div></div>}
      </div>

      <div className="panel support-list-panel">
        <div className="section-title-row">
          <div><h3>Danh sách yêu cầu hỗ trợ</h3><p className="panel-desc">Theo dõi nội dung, độ ưu tiên, trạng thái và người đang chịu trách nhiệm xử lý.</p></div>
          <span className="badge badge-info">{d.items.length} yêu cầu</span>
        </div>
        <Table headers={['Khách hàng', 'Nội dung', 'Mức ưu tiên', 'Trạng thái', 'Người xử lý', 'Thao tác']} rows={d.items.map(x => [
          <b>{x.customer_name}</b>,
          <div><b>{x.title}</b><br/><small>#{x.id}</small></div>,
          <span className={`badge ${x.priority === 'Cao' ? 'badge-danger' : x.priority === 'Trung bình' ? 'badge-warning' : 'badge-info'}`}>{x.priority}</span>,
          <span className={`badge ${x.status === 'Đã đóng' ? 'badge-success' : x.status === 'Đang xử lý' ? 'badge-warning' : 'badge-info'}`}>{x.status}</span>,
          x.assignee_name || '-',
          x.status === 'Đã đóng' ? <span className="muted-text">Hoàn tất</span> : <button className="secondary small-btn" onClick={() => close(x.id)}>Đóng yêu cầu</button>
        ])} />
        {!d.items.length && <div className="support-empty-state"><HeartHandshake size={20}/><div><b>Chưa có yêu cầu hỗ trợ để hiển thị.</b><span>Hãy khởi động lại Backend để nạp dữ liệu mẫu hoặc tạo một yêu cầu mới ở biểu mẫu phía trên.</span></div></div>}
      </div>
    </>
  )
}

function Care() {
  const [days, setDays] = useState(30)
  const [items, setItems] = useState([])
  const [m, setM] = useState('')

  async function load() {
    try { setItems((await api('/api/s3/care-list?days=' + days)).items) } catch (e) { setM(errText(e)) }
  }
  useEffect(() => { load() }, [])

  async function done(id) {
    try {
      setM((await api(`/api/s3/customers/${id}/care-done`, { method: 'POST', body: JSON.stringify({ note: 'Đã liên hệ định kỳ' }) })).message)
      load()
    } catch (e) { setM(errText(e)) }
  }

  return (
    <div className="panel">
      <h2><HeartHandshake size={20} /> Danh sách chăm sóc khách hàng định kỳ</h2>
      <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
      <div className="toolbar">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          Số ngày chưa tương tác:
          <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} style={{ width: '90px' }} />
        </label>
        <button className="primary" onClick={load}><Filter size={16} /> Lọc danh sách</button>
      </div>
      <Table headers={['ID', 'Khách hàng', 'Trạng thái', 'Lần tương tác cuối', 'Giá trị HĐ', 'Chủ sở hữu', 'Thao tác']} rows={items.map(x => [x.id, x.name, x.status, x.last_interaction_at, Number(x.contract_value).toLocaleString('vi-VN') + ' ₫', x.owner_name, <button className="secondary small-btn" onClick={() => done(x.id)}>Đã chăm sóc hôm nay</button>])} />
    </div>
  )
}

function UsersPage() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ roles: [], groups: [] })
  const [m, setM] = useState('')
  const [f, setF] = useState({ full_name: '', email: '', business_group_id: '', role_ids: [] })
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [editing, setEditing] = useState(null)

  async function load(p = page) {
    try {
      const qs = new URLSearchParams({ page: String(p), per_page: '20', q })
      if (group) qs.set('group', group)
      if (role) qs.set('role', role)
      if (status) qs.set('status', status)
      const [u, me] = await Promise.all([api('/api/users?' + qs), api('/api/meta')])
      setItems(u.items)
      setPages(u.pages)
      setPage(u.page)
      setMeta(me)
    } catch (e) { setM(errText(e)) }
  }

  useEffect(() => { load(1) }, [])

  async function create(e) {
    e.preventDefault()
    try {
      setM((await api('/api/users', { method: 'POST', body: JSON.stringify({ ...f, business_group_id: f.business_group_id ? Number(f.business_group_id) : null, role_ids: f.role_ids.map(Number) }) })).message)
      setF({ full_name: '', email: '', business_group_id: '', role_ids: [] })
      load(1)
    } catch (e) { setM(errText(e)) }
  }

  async function saveEdit(e) {
    e.preventDefault()
    try {
      const body = { full_name: editing.full_name, email: editing.email, business_group_id: editing.business_group_id ? Number(editing.business_group_id) : null, data_scope: editing.data_scope, status: editing.status }
      setM((await api('/api/users/' + editing.id, { method: 'PUT', body: JSON.stringify(body) })).message)
      setEditing(null)
      load()
    } catch (e) { setM(errText(e)) }
  }

  return (
    <>
      <div className="panel">
        <h2><Users size={20} /> Quản lý người dùng hệ thống</h2>
        <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
        <div className="grid3">
          <Field label="Tìm kiếm tên / email" value={q} onChange={e => setQ(e.target.value)} placeholder="Nhập từ khóa..." />
          <Select label="Nhóm kinh doanh" value={group} onChange={e => setGroup(e.target.value)}>
            <option value="">Tất cả các nhóm</option>
            {meta.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Select>
          <Select label="Vai trò" value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Tất cả vai trò</option>
            {meta.roles.map(r => <option key={r.id} value={r.code}>{r.name}</option>)}
          </Select>
          <Select label="Trạng thái" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ kích hoạt</option>
            <option value="locked">Đã khóa</option>
          </Select>
        </div>
        <button className="primary" onClick={() => load(1)} style={{ marginTop: '12px' }}><Search size={16} /> Tìm kiếm & Lọc</button>
      </div>

      <form className="panel" onSubmit={create}>
        <h3><Plus size={18} /> Tạo tài khoản người dùng mới</h3>
        <div className="grid2">
          <Field label="Họ tên" required value={f.full_name} onChange={e => setF({ ...f, full_name: e.target.value })} />
          <Field label="Email đăng nhập" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
          <Select label="Nhóm kinh doanh" value={f.business_group_id} onChange={e => setF({ ...f, business_group_id: e.target.value })}>
            <option value="">Không phân nhóm</option>
            {meta.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Select>
          <div className="field">
            <span>Gán vai trò hệ thống</span>
            <div className="checks">
              {meta.roles.map(r => (
                <label key={r.id}>
                  <input type="checkbox" checked={f.role_ids.includes(String(r.id))} onChange={e => setF({ ...f, role_ids: e.target.checked ? [...f.role_ids, String(r.id)] : f.role_ids.filter(x => x !== String(r.id)) })} />
                  {r.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className="primary" style={{ marginTop: '12px' }}><Plus size={16} /> Tạo tài khoản & Gửi mail kích hoạt</button>
      </form>

      {editing && (
        <form className="panel" onSubmit={saveEdit}>
          <h3><Edit size={18} /> Chỉnh sửa tài khoản #{editing.id}</h3>
          <div className="grid2">
            <Field label="Họ tên" value={editing.full_name} onChange={e => setEditing({ ...editing, full_name: e.target.value })} />
            <Field label="Email" value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} />
            <Select label="Nhóm kinh doanh" value={editing.business_group_id || ''} onChange={e => setEditing({ ...editing, business_group_id: e.target.value })}>
              <option value="">Không nhóm</option>
              {meta.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
            <Select label="Trạng thái" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
              <option value="active">Đang hoạt động</option>
              <option value="pending">Chờ kích hoạt</option>
              <option value="locked">Đã khóa</option>
            </Select>
          </div>
          <div className="toolbar" style={{ marginTop: '12px' }}>
            <button type="submit" className="primary">Lưu thay đổi</button>
            <button type="button" className="secondary" onClick={() => setEditing(null)}>Hủy bỏ</button>
          </div>
        </form>
      )}

      <div className="panel">
        <Table headers={['ID', 'Tên', 'Email', 'Nhóm', 'Vai trò', 'Trạng thái', 'Phạm vi', 'Thao tác']} rows={items.map(x => [x.id, x.full_name, x.email, x.group_name, viRoles(x.roles), x.status, scopeVi[x.data_scope], <button className="secondary small-btn" onClick={() => setEditing({ ...x })}><Edit size={14} /> Sửa</button>])} />
        <div className="pager">
          <button className="secondary small-btn" disabled={page <= 1} onClick={() => load(page - 1)}>Trang trước</button>
          <span>Trang {page} / {pages}</span>
          <button className="secondary small-btn" disabled={page >= pages} onClick={() => load(page + 1)}>Trang sau</button>
        </div>
      </div>
    </>
  )
}

function RolesPage() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({ roles: [], groups: [] })
  const [uid, setUid] = useState('')
  const [roleIds, setRoleIds] = useState([])
  const [gid, setGid] = useState('')
  const [m, setM] = useState('')

  async function load() {
    try {
      const [a, b] = await Promise.all([api('/api/users?page=1&per_page=100'), api('/api/meta')])
      setUsers(a.items); setMeta(b)
    } catch (e) { setM(errText(e)) }
  }
  useEffect(() => { load() }, [])

  const selected = users.find(x => x.id === Number(uid))
  useEffect(() => {
    if (selected) {
      setRoleIds(meta.roles.filter(r => selected.roles.includes(r.code)).map(r => r.id))
      setGid(selected.business_group_id || '')
    }
  }, [uid, users, meta.roles])

  async function save() {
    try {
      setM((await api('/api/users/' + uid + '/roles', { method: 'PUT', body: JSON.stringify({ role_ids: roleIds, business_group_id: gid ? Number(gid) : null }) })).message)
      load()
    } catch (e) { setM(errText(e)) }
  }

  return (
    <div className="panel narrow">
      <h2><ShieldCheck size={20} /> Phân quyền vai trò & Nhóm làm việc</h2>
      <Notice text={m} type={isErrorNotice(m) ? 'err' : 'ok'} />
      <Select label="Chọn người dùng" value={uid} onChange={e => setUid(e.target.value)}>
        <option value="">-- Chọn tài khoản --</option>
        {users.map(x => <option key={x.id} value={x.id}>{x.full_name} - ({x.email})</option>)}
      </Select>
      {uid && (
        <div style={{ marginTop: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Chọn các vai trò:</span>
          <div className="checks" style={{ margin: '8px 0 16px' }}>
            {meta.roles.map(r => (
              <label key={r.id}>
                <input type="checkbox" checked={roleIds.includes(r.id)} onChange={e => setRoleIds(e.target.checked ? [...roleIds, r.id] : roleIds.filter(x => x !== r.id))} />
                {r.name}
              </label>
            ))}
          </div>
          <Select label="Gán nhóm kinh doanh" value={gid} onChange={e => setGid(e.target.value)}>
            <option value="">-- Không phân nhóm --</option>
            {meta.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Select>
          <button className="primary" style={{ marginTop: '12px' }} onClick={save}>Lưu cấu hình phân quyền</button>
        </div>
      )}
    </div>
  )
}

function LockPage() {
  const [users, setUsers] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [logs, setLogs] = useState([])
  const [m, setM] = useState('')

  async function load() {
    try {
      const [u, l] = await Promise.all([api('/api/users?page=1&per_page=100'), api('/api/handover-logs')])
      setUsers(u.items); setLogs(l.items)
    } catch (e) { setM(errText(e)) }
  }
  useEffect(() => { load() }, [])

  const targets = users.filter(x => x.is_active && x.status === 'active' && !x.roles.includes('ADMIN'))
  const receivers = users.filter(x => x.is_active && x.status === 'active' && String(x.id) !== String(from) && !x.roles.includes('ADMIN'))

  useEffect(() => {
    if (to && !receivers.some(x => String(x.id) === String(to))) setTo('')
  }, [from, users])

  async function lock() {
    if (!from) { setM('Hãy chọn tài khoản cần khóa.'); return }
    if (!to) { setM('Hãy chọn người nhận dữ liệu trước khi khóa.'); return }
    if (String(from) === String(to)) { setM('Người nhận phải khác người bị khóa.'); return }
    if (!confirm('Xác nhận bàn giao toàn bộ khách hàng/cơ hội và khóa tài khoản này?')) return
    try {
      setM((await api(`/api/users/${from}/lock-and-handover`, { method: 'POST', body: JSON.stringify({ receiver_user_id: Number(to) }) })).message)
      setFrom(''); setTo(''); await load()
    } catch (e) { setM(errText(e)) }
  }

  async function unlock(id) {
    if (!confirm('Mở khóa tài khoản này? Dữ liệu đã bàn giao trước đó sẽ không tự chuyển ngược lại.')) return
    try {
      setM((await api(`/api/users/${id}/unlock`, { method: 'POST' })).message)
      await load()
    } catch (e) { setM(errText(e)) }
  }

  return (
    <>
      <div className="panel">
        <h2><Lock size={20} /> Khóa tài khoản & Bàn giao dữ liệu</h2>
        <Notice text={m} type={m && /Hãy|không|lỗi/i.test(m) ? 'err' : 'ok'} />
        <div className="grid2">
          <Select label="Tài khoản cần khóa" value={from} onChange={e => { setFrom(e.target.value); setTo('') }}>
            <option value="">-- Chọn tài khoản bị khóa --</option>
            {targets.map(x => <option key={x.id} value={x.id}>{x.full_name} - {x.email}</option>)}
          </Select>
          <Select label="Người tiếp nhận dữ liệu bàn giao" value={to} onChange={e => setTo(e.target.value)} disabled={!from}>
            <option value="">{from ? '-- Chọn người nhận --' : '-- Hãy chọn tài khoản bị khóa trước --'}</option>
            {receivers.map(x => <option key={x.id} value={x.id}>{x.full_name} - {x.email} ({viRoles(x.roles)})</option>)}
          </Select>
        </div>
        {from && receivers.length === 0 && (
          <Notice text="Không có người nhận hợp lệ đang hoạt động. Hãy mở khóa/kích hoạt một nhân viên khác trước." type="err" />
        )}
        <button className="danger" disabled={!from || !to} onClick={lock} style={{ marginTop: '12px' }}>
          <Lock size={16} /> Bàn giao toàn bộ & Khóa tài khoản
        </button>

        <h3 style={{ marginTop: '28px' }}>Tài khoản đang bị khóa</h3>
        <Table headers={['Tên nhân viên', 'Email', 'Trạng thái', 'Thao tác']} rows={users.filter(x => !x.is_active || x.status === 'locked').map(x => [x.full_name, x.email, x.status, <button className="secondary small-btn" onClick={() => unlock(x.id)}><Unlock size={14} /> Mở khóa</button>])} />
      </div>

      <div className="panel">
        <h3>Nhật ký bàn giao công việc</h3>
        <Table headers={['Từ nhân viên', 'Đến nhân viên', 'Người duyệt', 'Số khách bàn giao', 'Số cơ hội bàn giao', 'Thời gian']} rows={logs.map(x => [x.from_user, x.to_user, x.admin_user, x.customer_count, x.opportunity_count, new Date(x.created_at).toLocaleString('vi-VN')])} />
      </div>
    </>
  )
}

function Outbox() {
  const [i, setI] = useState([])
  useEffect(() => {
    api('/api/outbox').then(d => setI(d.items)).catch(() => {})
  }, [])
  return (
    <div className="panel">
      <h2><FileClock size={20} /> Hòm thư hệ thống (Outbox Demo)</h2>
      {i.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Chưa có email nào trong hòm thư gửi đi.</p>
      ) : (
        i.map((x, idx) => (
          <div key={idx} className="mail">
            <b>{x.subject}</b>
            <span>Người nhận: {x.recipient}</span>
            <pre>{x.body}</pre>
          </div>
        ))
      )}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [menu, setMenu] = useState([])
  const [path, setPath] = useState(route())
  const [loading, setLoading] = useState(true)
  const [loginMessage, setLoginMessage] = useState('')

  useEffect(() => {
    const h = () => setPath(route())
    const ex = e => {
      setUser(null)
      setMenu([])
      setLoginMessage(e.detail?.message || 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.')
      go('/')
    }
    const handleUserUpdate = () => {
      api('/api/auth/me')
        .then(d => {
          setUser({ ...d.user, _ts: Date.now() })
          setMenu(menuForUserFrontend(d.menu, d.user))
        })
        .catch(() => {})
    }
    addEventListener('popstate', h)
    addEventListener('crm:session-expired', ex)
    addEventListener('crm:user-updated', handleUserUpdate)
    api('/api/auth/me')
      .then(d => {
        sessionStorage.setItem('crm_logged_in', '1')
        setUser(d.user)
        setMenu(menuForUserFrontend(d.menu, d.user))
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => {
      removeEventListener('popstate', h)
      removeEventListener('crm:session-expired', ex)
      removeEventListener('crm:user-updated', handleUserUpdate)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    let timer
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => dispatchEvent(new CustomEvent('crm:session-expired', { detail: { message: 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.' } })), 15 * 60 * 1000)
      api('/api/auth/me').catch(() => {})
    }
    ;['pointerdown', 'keydown', 'touchstart'].forEach(x => addEventListener(x, reset))
    reset()
    return () => {
      clearTimeout(timer)
      ;['pointerdown', 'keydown', 'touchstart'].forEach(x => removeEventListener(x, reset))
    }
  }, [user])

  async function logout() {
    try { await api('/api/auth/logout', { method: 'POST' }) } catch {}
    sessionStorage.removeItem('crm_logged_in')
    setUser(null)
    setMenu([])
    go('/')
  }

  if (path === '/forgot-password') return <Forgot />
  if (path === '/reset-password') return <Reset />
  if (path === '/activate') return <Activate />
  if (loading) return <div className="loading">Đang tải hệ thống...</div>
  if (!user) return <Login initialMessage={loginMessage} onLogin={(u, m) => { sessionStorage.setItem('crm_logged_in', '1'); setUser(u); setMenu(menuForUserFrontend(m, u)); setLoginMessage(''); go('/') }} />

  const pages = {
    '/': <Home user={user} menu={menu} />,
    '/dashboard': <Home user={user} menu={menu} />,
    '/tong-quan': <Home user={user} menu={menu} />,
    '/customers': <LegacyCustomers />,
    '/profile': <ProfilePage />,
    '/change-password': <ChangePassword />,
    '/user-import': <ExcelImport kind="users" />,
    '/audit': <Audit />,
    '/products': <GenericAdmin type="products" />,
    '/org': <Org />,
    '/categories': <GenericAdmin type="categories" />,
    '/custom-fields': <GenericAdmin type="custom-fields" />,
    '/pipeline': <GenericAdmin type="pipeline" />,
    '/reasons': <GenericAdmin type="reasons" />,
    '/crm-customers': <CrmCustomers />,
    '/customer-360': <Customer360 />,
    '/customer-import': <ExcelImport kind="customers" />,
    '/customer-filter': <CrmCustomers filterMode />,
    '/duplicates': <Duplicates />,
    '/support': <Support />,
    '/care': <Care />,
    '/users': <UsersPage />,
    '/roles': <RolesPage />,
    '/account-lock': <LockPage />,
    '/outbox': <Outbox />,
    '/leads': <LeadPage user={user} />,
    '/lead-import': <LeadImportPage />,
    '/campaigns': <CampaignPage />,
    '/lead-forms': <LeadFormsPage />,
    '/lead-duplicates': <LeadDuplicatesPage />,
    '/lead-scoring': <LeadScoringPage />,
    '/lead-assignment': <LeadAssignmentPage user={user} />
  }

  const allowed = new Set(menu.map(x => x.path))
  let page = pages[path]
  if (!page) page = <ErrorPage />
  else if (!['/','/dashboard','/tong-quan'].includes(path) && !allowed.has(path)) page = <ErrorPage code="403" title="Bạn không có quyền truy cập" />

  return <Shell user={user} menu={menu} onLogout={logout}>{page}</Shell>
}
