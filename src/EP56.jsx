import React, { useEffect, useState } from 'react'
import { api } from './api'
import {
  OpportunityTools,
  SavedOpportunityFilters,
  CalendarPanel,
  RemindersPanel,
  QuickCallPanel,
  CustomerTimelinePanel
} from './EP56Extras'
import {
  TrendingUp,
  Target,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Clock,
  Briefcase,
  X,
  Package,
  PhoneCall,
  ChevronRight,
  RefreshCw,
  Award,
  Activity,
  CheckSquare,
  Search,
  Filter,
  Phone,
  Mail,
  Building2
} from 'lucide-react'

const formatMoney = n => Number(n || 0).toLocaleString('vi-VN') + ' ₫'
const fmt = d => (d ? String(d).slice(0, 10) : '')
const notify = e => e?.message || 'Không thể xử lý yêu cầu'

const KANBAN_AVATAR_COLORS = [
  '#4f46e5', '#0284c7', '#059669', '#d97706', '#dc2626', '#db2777',
  '#8b5cf6', '#3b82f6', '#14b8a6', '#f97316', '#64748b'
]

function getKanbanInitials(name) {
  if (!name) return 'KH'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function getKanbanAvatarColor(name) {
  if (!name) return KANBAN_AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return KANBAN_AVATAR_COLORS[Math.abs(hash) % KANBAN_AVATAR_COLORS.length]
}

function formatKanbanCurrencyCompact(val) {
  const n = Number(val || 0)
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace('.0', '') + 'T'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + ' Tr'
  return n.toLocaleString('vi-VN') + ' ₫'
}

const STAGE_BAR_COLORS = ['#6366f1', '#0284c7', '#8b5cf6', '#f59e0b', '#10b981', '#059669', '#ec4899', '#3b82f6']

export function OpportunityPage({ user }) {
  const [criteria, setCriteria] = useState({})
  const [rows, setRows] = useState([])
  const [stages, setStages] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('')
  const [filterTab, setFilterTab] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    title: '',
    customer_id: '',
    stage: '',
    expected_close_date: '',
    value: 0,
    source: 'Website',
    probability: '',
    probability_note: ''
  })
  const [selected, setSelected] = useState(null)
  const [lines, setLines] = useState([])
  const [history, setHistory] = useState([])
  const [product, setProduct] = useState({ product_id: '', quantity: 1, periods: 1 })
  const [meeting, setMeeting] = useState({ subject: '', description: '', started_at: '' })

  const refresh = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      Object.entries(criteria).forEach(([k, v]) => {
        if (v !== '' && v != null) q.append(k, v)
      })
      const [a, b, cList, pList] = await Promise.all([
        api('/api/ep56/opportunities?limit=200&' + q.toString()),
        api('/api/ep56/stages'),
        api('/api/customers').catch(() => ({ items: [] })),
        api('/api/s2/products').catch(() => [])
      ])
      setRows(a.items || [])
      setStages(b || [])
      setCustomers(cList.items || cList || [])
      setProducts(pList || [])
      setError('')
    } catch (e) {
      setError(notify(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const run = async (path, body, method = 'POST') => {
    try {
      await api(path, { method, body: JSON.stringify(body) })
      await refresh()
      setError('')
      setSuccess('Thao tác thành công!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (e) {
      setError(notify(e))
    }
  }

  const select = async o => {
    setSelected(o)
    try {
      const [a, b] = await Promise.all([
        api(`/api/ep56/opportunities/${o.id}/lines`),
        api(`/api/ep56/opportunities/${o.id}/history`)
      ])
      setLines(a || [])
      setHistory(b || [])
    } catch (e) {
      setError(notify(e))
    }
  }

  const change = async (o, stage) => {
    await run(`/api/ep56/opportunities/${o.id}/stage`, { stage })
    setSelected(null)
  }

  const openCreateWithStage = stageName => {
    const s = stages.find(x => x.name === stageName)
    setForm({
      title: '',
      customer_id: customers[0]?.id ? String(customers[0].id) : '',
      stage: stageName || stages[0]?.name || '',
      expected_close_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      value: 0,
      source: 'Website',
      probability: s ? s.win_probability : '',
      probability_note: ''
    })
    setShowCreate(true)
  }

  const handleDragStart = (e, o) => {
    setDraggingId(o.id)
    e.dataTransfer.setData('text/plain', String(o.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e, stageName) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverStage !== stageName) {
      setDragOverStage(stageName)
    }
  }

  const handleDragLeave = (e, stageName) => {
    if (dragOverStage === stageName) {
      setDragOverStage(null)
    }
  }

  const handleDrop = async (e, stageName) => {
    e.preventDefault()
    setDragOverStage(null)
    setDraggingId(null)
    const id = Number(e.dataTransfer.getData('text/plain'))
    const o = rows.find(x => x.id === id)
    if (o && o.stage !== stageName) {
      await change(o, stageName)
    }
  }

  const filteredRows = rows.filter(x => {
    if (filter) {
      const q = filter.toLowerCase()
      const searchTarget = `${x.title || ''} ${x.customer_name || ''} ${x.customer_phone || ''} ${x.customer_email || ''} ${x.contact_name || ''} ${x.contact_phone || ''} ${x.contact_email || ''} ${x.owner_name || ''}`.toLowerCase()
      if (!searchTarget.includes(q)) return false
    }
    if (filterTab === 'mine' && user) {
      return x.owner_id === user.id
    }
    if (filterTab === 'high') {
      return Number(x.value || 0) >= 100_000_000
    }
    if (filterTab === 'won') {
      return x.stage === 'Chốt' || x.closed_at != null
    }
    return true
  })

  const totalValue = rows.reduce((n, o) => n + Number(o.value || 0), 0)

  return (
    <div className="pipeline-kanban-container" style={{ padding: '16px 20px', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Top Header */}
      <div className="pipeline-kanban-header">
        <div>
          <h2>
            <Layers size={22} color="#4f46e5" /> Cơ hội bán hàng & Pipeline
          </h2>
          <div className="pipeline-kanban-subtitle">
            <span><b>{filteredRows.length}</b> thẻ đang hiển thị</span>
            <span>·</span>
            <span>Tổng giá trị Pipeline: <b>{formatKanbanCurrencyCompact(totalValue)}</b> ({formatMoney(totalValue)})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setForm({
                title: '',
                customer_id: customers[0]?.id ? String(customers[0].id) : '',
                stage: stages[0]?.name || '',
                expected_close_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
                value: 0,
                source: 'Website',
                probability: stages[0]?.win_probability || '',
                probability_note: ''
              })
              setShowCreate(true)
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}
          >
            <Plus size={16} /> Tạo cơ hội mới
          </button>
        </div>
      </div>

      {error && (
        <div className="notice-bar danger" style={{ margin: '8px 0' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="notice-bar success" style={{ margin: '8px 0' }}>
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Toolbar: Search input, Filter Tabs & Quick Actions */}
      <div className="pipeline-kanban-toolbar">
        <div className="pipeline-search-box">
          <Search size={15} />
          <input
            type="text"
            className="pipeline-search-input"
            placeholder="Tìm tên, email, điện thoại, cơ hội..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          {filter && (
            <button
              type="button"
              className="quick-search-clear"
              onClick={() => setFilter('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="pipeline-filter-tabs">
          <button
            type="button"
            className={`pipeline-filter-pill ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            Tất cả ({rows.length})
          </button>
          <button
            type="button"
            className={`pipeline-filter-pill ${filterTab === 'mine' ? 'active' : ''}`}
            onClick={() => setFilterTab('mine')}
          >
            Của tôi ({rows.filter(o => user && o.owner_id === user.id).length})
          </button>
          <button
            type="button"
            className={`pipeline-filter-pill ${filterTab === 'high' ? 'active' : ''}`}
            onClick={() => setFilterTab('high')}
          >
            Giá trị cao (≥100Tr)
          </button>
          <button
            type="button"
            className={`pipeline-filter-pill ${filterTab === 'won' ? 'active' : ''}`}
            onClick={() => setFilterTab('won')}
          >
            Đã chốt ({rows.filter(o => o.stage === 'Chốt' || o.closed_at != null).length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <button
            type="button"
            className={`pipeline-filter-pill ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Bộ lọc nâng cao"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Filter size={13} /> Bộ lọc nâng cao
          </button>
          <button
            type="button"
            className="pipeline-filter-pill"
            onClick={refresh}
            title="Làm mới dữ liệu"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {showFilters && (
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', margin: '8px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <b style={{ fontSize: 13, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={14} color="#4f46e5" /> Tiêu chí lọc nâng cao
            </b>
            <button
              type="button"
              className="secondary small-btn"
              onClick={() => setShowFilters(false)}
              style={{ padding: '2px 8px', fontSize: 11 }}
            >
              <X size={12} style={{ marginRight: 2 }} /> Đóng bộ lọc
            </button>
          </div>
          <SavedOpportunityFilters
            onApply={next => {
              setCriteria(next)
              const q = new URLSearchParams()
              Object.entries(next).forEach(([k, v]) => {
                if (v !== '' && v != null) q.append(k, v)
              })
              api('/api/ep56/opportunities?limit=200&' + q.toString())
                .then(r => setRows(r.items || []))
                .catch(e => setError(notify(e)))
            }}
          />
        </div>
      )}

      {loading && <p style={{ color: '#4f46e5', fontWeight: 500, fontSize: 13, margin: '8px 0' }}>Đang tải dữ liệu Pipeline...</p>}

      {/* Bảng Kanban Pipeline Cột chuẩn hiện đại */}
      <div className="pipeline-kanban-board">
        {stages.map((stage, idx) => {
          const stageOpps = filteredRows.filter(o => o.stage === stage.name)
          const stageSum = stageOpps.reduce((sum, o) => sum + Number(o.value || 0), 0)
          const barColor = STAGE_BAR_COLORS[idx % STAGE_BAR_COLORS.length]
          const isOver = dragOverStage === stage.name

          return (
            <div
              key={stage.id || `${stage.name}-${idx}`}
              className={`pipeline-kanban-col ${isOver ? 'drag-over' : ''}`}
            >
              {/* Column Header */}
              <div className="pipeline-col-header" style={{ borderBottomColor: barColor }}>
                <div className="pipeline-col-top">
                  <div className="pipeline-col-title-wrap">
                    <span className="pipeline-col-title">{stage.name}</span>
                    <span className="pipeline-col-count">{stageOpps.length}</span>
                  </div>
                  <button
                    type="button"
                    className="pipeline-col-add-btn"
                    title={`Thêm cơ hội vào ${stage.name}`}
                    onClick={() => openCreateWithStage(stage.name)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="pipeline-col-meta">
                  <span className="pipeline-col-sum" title={formatMoney(stageSum)}>
                    {formatKanbanCurrencyCompact(stageSum)}
                  </span>
                  <span className={`pipeline-col-prob ${Number(stage.win_probability || 0) >= 70 ? 'high' : Number(stage.win_probability || 0) >= 40 ? 'mid' : 'low'}`}>
                    {stage.win_probability ?? 0}%
                  </span>
                </div>
              </div>

              {/* Column Body / Drop Zone */}
              <div
                className="pipeline-col-body"
                onDragOver={e => handleDragOver(e, stage.name)}
                onDragLeave={e => handleDragLeave(e, stage.name)}
                onDrop={e => handleDrop(e, stage.name)}
              >
                {stageOpps.map(o => {
                  const isOverdue = o.expected_close_date && new Date(o.expected_close_date) < new Date()
                  const contactOrCustomer = o.contact_name || o.customer_name || 'Khách hàng'
                  const companyDisplay = o.customer_name ? `@ ${o.customer_name}` : ''
                  const phoneDisplay = o.contact_phone || o.customer_phone
                  const emailDisplay = o.contact_email || o.customer_email

                  return (
                    <div
                      key={o.id}
                      className={`pipeline-deal-card ${draggingId === o.id ? 'is-dragging' : ''}`}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, o)}
                      onDragEnd={handleDragEnd}
                      onClick={() => select(o)}
                    >
                      <div className="pipeline-card-top">
                        <div
                          className="pipeline-card-avatar"
                          style={{ background: getKanbanAvatarColor(contactOrCustomer) }}
                        >
                          {getKanbanInitials(contactOrCustomer)}
                        </div>
                        <div className="pipeline-card-info">
                          <div className="pipeline-card-customer-name" title={contactOrCustomer}>
                            {contactOrCustomer}
                          </div>
                          {companyDisplay && (
                            <div className="pipeline-card-title" title={companyDisplay}>
                              {companyDisplay}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pipeline-card-meta">
                        {phoneDisplay && (
                          <div className="pipeline-meta-row" title={`Số điện thoại: ${phoneDisplay}`}>
                            <Phone size={12} />
                            <span>{phoneDisplay}</span>
                          </div>
                        )}
                        {emailDisplay && (
                          <div className="pipeline-meta-row" title={`Email: ${emailDisplay}`}>
                            <Mail size={12} />
                            <span>{emailDisplay}</span>
                          </div>
                        )}
                        <div className="pipeline-meta-row" title={`Cơ hội: ${o.title}`}>
                          <Briefcase size={12} />
                          <span>{o.title}</span>
                        </div>
                      </div>

                      <div className="pipeline-card-bottom">
                        <div className="pipeline-card-value" title={formatMoney(o.value)}>
                          {formatMoney(o.value)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {isOverdue && (
                            <span className="badge badge-danger" style={{ fontSize: 9.5, padding: '1px 5px' }}>
                              Quá hạn
                            </span>
                          )}
                          <span className={`pipeline-col-prob ${Number(o.win_probability ?? stage.win_probability ?? 0) >= 70 ? 'high' : Number(o.win_probability ?? stage.win_probability ?? 0) >= 40 ? 'mid' : 'low'}`}>
                            {o.win_probability ?? stage.win_probability ?? 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {stageOpps.length === 0 && (
                  <div className="pipeline-col-empty">
                    Kéo thẻ vào đây hoặc bấm + để tạo
                  </div>
                )}
              </div>

              {/* Column Footer */}
              <div className="pipeline-col-footer">
                <button
                  type="button"
                  className="pipeline-col-footer-btn"
                  title={`Thêm cơ hội mới vào ${stage.name}`}
                  onClick={() => openCreateWithStage(stage.name)}
                >
                  <Plus size={14} /> Thêm cơ hội
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Tạo cơ hội mới */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, fontSize: 17 }}>
                <Briefcase size={19} color="#4f46e5" /> Tạo cơ hội bán hàng mới
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowCreate(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async e => {
                e.preventDefault()
                const payload = {
                  title: form.title,
                  customer_id: Number(form.customer_id),
                  stage: form.stage,
                  value: Number(form.value || 0),
                  expected_close_date: form.expected_close_date,
                  source: form.source || 'Website'
                }
                if (form.probability !== '') {
                  payload.probability = Number(form.probability)
                  payload.probability_note = form.probability_note
                }
                await run('/api/ep56/opportunities', payload)
                setShowCreate(false)
                setForm({
                  title: '',
                  customer_id: '',
                  stage: '',
                  expected_close_date: '',
                  value: 0,
                  source: 'Website',
                  probability: '',
                  probability_note: ''
                })
              }}
              style={{ padding: '16px 0 4px 0' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>Tên cơ hội *</label>
                  <input
                    placeholder="VD: Triển khai CRM cho Công ty ABC"
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>Khách hàng *</label>
                  <select
                    required
                    value={form.customer_id}
                    onChange={e => setForm({ ...form, customer_id: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (#{c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>Giai đoạn ban đầu *</label>
                  <select
                    required
                    value={form.stage}
                    onChange={e => {
                      const sName = e.target.value
                      const found = stages.find(s => s.name === sName)
                      setForm({
                        ...form,
                        stage: sName,
                        probability: found ? found.win_probability : form.probability
                      })
                    }}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  >
                    <option value="">-- Chọn giai đoạn --</option>
                    {stages.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.win_probability}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>Giá trị dự kiến (₫)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.value}
                    onChange={e => setForm({ ...form, value: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>Ngày dự kiến chốt *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={form.expected_close_date}
                    onChange={e => setForm({ ...form, expected_close_date: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>Xác suất chốt (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Tự động theo giai đoạn"
                    value={form.probability}
                    onChange={e => setForm({ ...form, probability: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>

                {form.probability !== '' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                      Ghi chú điều chỉnh xác suất * (Bắt buộc khi đổi xác suất)
                    </label>
                    <input
                      placeholder="Lý do tăng/giảm xác suất so với mặc định..."
                      required
                      value={form.probability_note}
                      onChange={e => setForm({ ...form, probability_note: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="secondary" onClick={() => setShowCreate(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="primary">
                  Tạo cơ hội
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chi tiết cơ hội & Điều hướng giai đoạn */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 840, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="badge badge-info">#{selected.id}</span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{selected.stage}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>{selected.title}</h3>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                  Khách hàng: <b>{selected.customer_name}</b> · Giá trị: <b style={{ color: '#059669' }}>{formatMoney(selected.value)}</b> · Người phụ trách: <b>{selected.owner_name}</b>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Chuyển giai đoạn và Đóng Won/Lost */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '16px 0', padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                Chuyển giai đoạn:
                <select
                  value={selected.stage}
                  onChange={e => change(selected, e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontWeight: 600, fontSize: 13 }}
                >
                  {stages.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.win_probability}%)
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button
                  type="button"
                  className="primary small-btn"
                  style={{ background: '#059669', borderColor: '#059669' }}
                  onClick={() => {
                    const value = prompt('Nhập giá trị chốt hợp đồng thực tế (₫):', String(selected.value || ''))
                    const signed = prompt('Nhập ngày ký hợp đồng (YYYY-MM-DD):', new Date().toISOString().slice(0, 10))
                    if (value && signed) {
                      run(`/api/ep56/opportunities/${selected.id}/close`, {
                        result: 'won',
                        actual_value: Number(value),
                        signed_at: signed
                      })
                    }
                  }}
                >
                  <Award size={14} style={{ marginRight: 4 }} /> Đóng thắng (Won)
                </button>

                <button
                  type="button"
                  className="secondary small-btn"
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  onClick={() => {
                    const reason = prompt('Nhập lý do thua thương vụ:')
                    if (reason) {
                      run(`/api/ep56/opportunities/${selected.id}/close`, {
                        result: 'lost',
                        reason
                      })
                    }
                  }}
                >
                  <X size={14} style={{ marginRight: 4 }} /> Đóng thua (Lost)
                </button>
              </div>
            </div>

            {/* Sản phẩm trong cơ hội */}
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#1e293b' }}>
                <Package size={16} color="#4f46e5" /> Sản phẩm & Báo giá dòng hàng
              </h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
                <select
                  value={product.product_id}
                  onChange={e => setProduct({ ...product, product_id: e.target.value })}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 220, fontSize: 13 }}
                >
                  <option value="">-- Chọn sản phẩm trong danh mục --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatMoney(p.list_price)} {p.product_type ? `(${p.product_type})` : ''}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Số lượng"
                  value={product.quantity}
                  onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 90, fontSize: 13 }}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Số kỳ"
                  value={product.periods}
                  onChange={e => setProduct({ ...product, periods: Number(e.target.value) })}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 100, fontSize: 13 }}
                />
                <button
                  type="button"
                  className="primary small-btn"
                  disabled={!product.product_id}
                  onClick={async () => {
                    await run(`/api/ep56/opportunities/${selected.id}/lines`, {
                      product_id: Number(product.product_id),
                      quantity: product.quantity,
                      periods: product.periods
                    })
                    select(selected)
                  }}
                >
                  Thêm sản phẩm
                </button>
              </div>

              {lines.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, fontStyle: 'italic' }}>Chưa có sản phẩm nào được gán cho cơ hội này.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '6px 10px' }}>Sản phẩm</th>
                      <th style={{ padding: '6px 10px' }}>Số lượng</th>
                      <th style={{ padding: '6px 10px' }}>Đơn giá</th>
                      <th style={{ padding: '6px 10px' }}>Số kỳ</th>
                      <th style={{ padding: '6px 10px', textAlign: 'right' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 10px' }}><b>{l.description}</b></td>
                        <td style={{ padding: '6px 10px' }}>{l.quantity}</td>
                        <td style={{ padding: '6px 10px' }}>{formatMoney(l.unit_price)}</td>
                        <td style={{ padding: '6px 10px' }}>{l.periods} kỳ</td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                          {formatMoney(l.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Ghi nhận cuộc gặp */}
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#1e293b' }}>
                <Calendar size={16} color="#4f46e5" /> Ghi nhận cuộc gặp khách hàng (Điều kiện giai đoạn)
              </h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  placeholder="Nội dung cuộc gặp / thảo luận..."
                  value={meeting.subject}
                  onChange={e => setMeeting({ ...meeting, subject: e.target.value })}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', flex: 1, minWidth: 200, fontSize: 13 }}
                />
                <input
                  type="datetime-local"
                  value={meeting.started_at}
                  onChange={e => setMeeting({ ...meeting, started_at: e.target.value })}
                  style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
                <button
                  type="button"
                  className="primary small-btn"
                  disabled={!meeting.subject || !meeting.started_at}
                  onClick={async () => {
                    await run('/api/ep56/activities', {
                      ...meeting,
                      activity_type: 'meeting',
                      opportunity_id: selected.id,
                      customer_id: selected.customer_id
                    })
                    setMeeting({ subject: '', description: '', started_at: '' })
                  }}
                >
                  Lưu cuộc gặp
                </button>
              </div>
            </div>

            {/* Tools nâng cao (Chia sẻ, Bàn giao, Tệp đính kèm 20MB, Lịch sử) */}
            <OpportunityTools opportunity={selected} onRefresh={refresh} user={user} />
          </div>
        </div>
      )}
    </div>
  )
}

export function ForecastPage({ user }) {
  const [d, setD] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [period, setPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  })
  const [usersList, setUsersList] = useState([])
  const [targetForm, setTargetForm] = useState({ owner_id: '', target_value: '' })

  const loadForecast = () => {
    api(`/api/ep56/forecast?year=${period.year}&month=${period.month}`)
      .then(setD)
      .catch(e => setError(notify(e)))
  }

  useEffect(() => {
    loadForecast()
    api('/api/users')
      .then(res => setUsersList(res.items || res || []))
      .catch(() => {})
  }, [period])

  const saveTarget = async e => {
    e.preventDefault()
    if (!targetForm.owner_id || targetForm.target_value === '') return
    try {
      await api('/api/ep56/sales-targets', {
        method: 'POST',
        body: JSON.stringify({
          owner_id: Number(targetForm.owner_id),
          year: period.year,
          month: period.month,
          target_value: Number(targetForm.target_value)
        })
      })
      setSuccess('Đã lưu chỉ tiêu thành công!')
      setTargetForm({ owner_id: '', target_value: '' })
      setTimeout(() => setSuccess(''), 4000)
      loadForecast()
    } catch (err) {
      setError(notify(err))
    }
  }

  const isManager = user?.roles?.some(r => ['ADMIN', 'DIRECTOR', 'TEAM_LEADER'].includes(r))

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, margin: 0 }}>
            <TrendingUp size={26} color="#2563eb" /> Dự báo doanh số theo trọng số & Chỉ tiêu
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 14 }}>
            So sánh dự báo trọng số cơ hội bán hàng với doanh số thực tế và chỉ tiêu kinh doanh theo tháng.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            aria-label="Tháng"
            value={period.month}
            onChange={e => setPeriod({ ...period, month: Number(e.target.value) })}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 600 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option value={i + 1} key={i}>{`Tháng ${i + 1}`}</option>
            ))}
          </select>
          <input
            aria-label="Năm"
            type="number"
            value={period.year}
            onChange={e => setPeriod({ ...period, year: Number(e.target.value) })}
            style={{ width: 90, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 600 }}
          />
        </div>
      </div>

      {error && <div className="notice-bar danger" style={{ marginBottom: 16 }}><AlertCircle size={18} /><span>{error}</span></div>}
      {success && <div className="notice-bar success" style={{ marginBottom: 16 }}><CheckCircle2 size={18} /><span>{success}</span></div>}

      {/* KPI Cards */}
      {d && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#eff6ff', padding: 18, borderRadius: 12, border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 13, color: '#1e40af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={16} /> Dự báo có trọng số
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1d4ed8', marginTop: 6 }}>
              {formatMoney(d.weighted_total)}
            </div>
            <small style={{ color: '#64748b', fontSize: 12 }}>∑ (Giá trị × Xác suất chốt)</small>
          </div>

          <div style={{ background: '#ecfdf5', padding: 18, borderRadius: 12, border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: 13, color: '#065f46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={16} /> Doanh thu thắng thực tế (Won)
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#047857', marginTop: 6 }}>
              {formatMoney(d.actual_total)}
            </div>
            <small style={{ color: '#64748b', fontSize: 12 }}>Hợp đồng đã ký thành công</small>
          </div>

          <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 13, color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={16} /> Chỉ tiêu tháng {d.month}/{d.year}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
              {formatMoney(d.target_total)}
            </div>
            <small style={{ color: '#64748b', fontSize: 12 }}>Tổng mục tiêu giao nhân viên</small>
          </div>

          <div style={{ background: '#fffbeb', padding: 18, borderRadius: 12, border: '1px solid #fde68a' }}>
            <div style={{ fontSize: 13, color: '#92400e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarSign size={16} /> Chênh lệch (Dự báo - Chỉ tiêu)
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: (d.weighted_total - d.target_total) >= 0 ? '#15803d' : '#b91c1c',
                marginTop: 6
              }}
            >
              {formatMoney(d.weighted_total - d.target_total)}
            </div>
            <small style={{ color: '#64748b', fontSize: 12 }}>
              {d.target_total > 0
                ? `Tỷ lệ đạt: ${Math.round((d.weighted_total / d.target_total) * 100)}%`
                : 'Chưa đặt chỉ tiêu'}
            </small>
          </div>
        </div>
      )}

      {/* Form Thiết lập chỉ tiêu (Dành cho Quản lý) */}
      {isManager && (
        <div className="panel" style={{ background: '#ffffff', borderRadius: 12, padding: 18, marginBottom: 20, border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={18} color="#2563eb" /> Thiết lập chỉ tiêu kinh doanh cho nhân viên ({period.month}/{period.year})
          </h4>
          <form onSubmit={saveTarget} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={targetForm.owner_id}
              onChange={e => setTargetForm({ ...targetForm, owner_id: e.target.value })}
              required
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 220 }}
            >
              <option value="">-- Chọn nhân viên bán hàng --</option>
              {usersList.map(u => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.email})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="1000000"
              placeholder="Chỉ tiêu doanh số (₫)"
              required
              value={targetForm.target_value}
              onChange={e => setTargetForm({ ...targetForm, target_value: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 200 }}
            >
            </input>
            <button type="submit" className="primary small-btn">
              <CheckCircle2 size={14} style={{ marginRight: 4 }} /> Lưu chỉ tiêu
            </button>
          </form>
        </div>
      )}

      {/* Bảng Chi tiết theo Nhân viên */}
      {d && (
        <div className="panel" style={{ background: '#ffffff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: 16 }}>Bảng đối chiếu dự báo theo từng nhân viên</h3>
          {d.items.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Không có dữ liệu cơ hội hoặc chỉ tiêu cho tháng này.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Nhân viên</th>
                  <th style={{ padding: '10px 12px' }}>Dự báo có trọng số</th>
                  <th style={{ padding: '10px 12px' }}>Doanh số chốt (Won)</th>
                  <th style={{ padding: '10px 12px' }}>Chỉ tiêu tháng</th>
                  <th style={{ padding: '10px 12px' }}>Chênh lệch</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Đạt chỉ tiêu</th>
                </tr>
              </thead>
              <tbody>
                {d.items.map((x, i) => {
                  const rate = x.target > 0 ? Math.round((Number(x.weighted || 0) / Number(x.target)) * 100) : null
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px' }}><b>{x.owner_name}</b></td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#2563eb' }}>{formatMoney(x.weighted)}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#059669' }}>{formatMoney(x.actual)}</td>
                      <td style={{ padding: '10px 12px' }}>{formatMoney(x.target)}</td>
                      <td style={{ padding: '10px 12px', color: (x.gap >= 0 ? '#15803d' : '#b91c1c'), fontWeight: 600 }}>
                        {formatMoney(x.gap)}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        {rate !== null ? (
                          <span className={`badge ${rate >= 100 ? 'badge-success' : rate >= 70 ? 'badge-info' : 'badge-danger'}`}>
                            {rate}%
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export function TasksPage({ user }) {
  const [tasks, setTasks] = useState([])
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    title: '',
    due_at: '',
    priority: 'normal',
    customer_id: '',
    description: ''
  })

  const refresh = () =>
    api('/api/ep56/tasks')
      .then(setTasks)
      .catch(e => setError(notify(e)))

  useEffect(() => {
    refresh()
    api('/api/customers')
      .then(res => setCustomers(res.items || res || []))
      .catch(() => {})
  }, [])

  const send = async (path, body) => {
    try {
      await api(path, { method: 'POST', body: JSON.stringify(body) })
      refresh()
      setError('')
      setSuccess('Thao tác thành công!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (e) {
      setError(notify(e))
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, margin: 0 }}>
          <Clock size={26} color="#2563eb" /> Công việc, Lịch biểu & Nhắc việc
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 14 }}>
          Giao việc, nhắc việc sắp hạn/quá hạn, xem lịch ngày/tuần/tháng và ghi nhận cuộc gọi nhanh.
        </p>
      </div>

      {error && <div className="notice-bar danger" style={{ marginBottom: 16 }}><AlertCircle size={18} /><span>{error}</span></div>}
      {success && <div className="notice-bar success" style={{ marginBottom: 16 }}><CheckCircle2 size={18} /><span>{success}</span></div>}

      {/* Form Tạo công việc */}
      <div className="panel" style={{ background: '#ffffff', borderRadius: 12, padding: 18, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} color="#2563eb" /> Tạo công việc mới
        </h3>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!form.due_at) return
            send('/api/ep56/tasks', {
              title: form.title,
              due_at: new Date(form.due_at).toISOString(),
              priority: form.priority,
              customer_id: form.customer_id ? Number(form.customer_id) : null,
              description: form.description
            })
            setForm({ title: '', due_at: '', priority: 'normal', customer_id: '', description: '' })
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, alignItems: 'flex-end' }}
        >
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tiêu đề công việc *</label>
            <input
              placeholder="VD: Gửi bản đề xuất báo giá..."
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Hạn hoàn thành *</label>
            <input
              type="datetime-local"
              required
              value={form.due_at}
              onChange={e => setForm({ ...form, due_at: e.target.value })}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Khách hàng liên quan</label>
            <select
              value={form.customer_id}
              onChange={e => setForm({ ...form, customer_id: e.target.value })}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="">-- Không bắt buộc --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Mức độ ưu tiên</label>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="low">Thấp</option>
              <option value="normal">Bình thường</option>
              <option value="high">Cao</option>
            </select>
          </div>

          <div>
            <button type="submit" className="primary" style={{ width: '100%', padding: '8px 14px' }}>
              Tạo công việc
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách công việc */}
      <div className="panel" style={{ background: '#ffffff', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: 16 }}>Danh sách công việc đang quản lý ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Chưa có công việc nào.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map(t => {
              const isOverdue = t.status === 'open' && new Date(t.due_at) < new Date()
              return (
                <div
                  key={t.id}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    background: t.status === 'done' ? '#f8fafc' : isOverdue ? '#fff1f2' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <b style={{ fontSize: 14, color: t.status === 'done' ? '#64748b' : '#0f172a' }}>{t.title}</b>
                      <span className={`badge ${t.status === 'done' ? 'badge-success' : t.status === 'postponed' ? 'badge-warning' : isOverdue ? 'badge-danger' : 'badge-info'}`}>
                        {t.status === 'done' ? 'Đã hoàn thành' : t.status === 'postponed' ? 'Đã hoãn' : isOverdue ? 'Quá hạn' : 'Đang xử lý'}
                      </span>
                      <span className={`badge ${t.priority === 'high' ? 'badge-danger' : t.priority === 'low' ? 'badge-info' : 'badge-warning'}`}>
                        {t.priority === 'high' ? 'Cao' : t.priority === 'low' ? 'Thấp' : 'Bình thường'}
                      </span>
                    </div>
                    <small style={{ color: '#64748b', display: 'block', marginTop: 4 }}>
                      Hạn: {String(t.due_at || '').slice(0, 16).replace('T', ' ')}
                      {t.postpone_reason && ` · Lý do hoãn: ${t.postpone_reason}`}
                    </small>
                  </div>

                  {t.status !== 'done' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="primary small-btn"
                        onClick={() => send(`/api/ep56/tasks/${t.id}/status`, { status: 'done' })}
                      >
                        <CheckCircle2 size={14} style={{ marginRight: 4 }} /> Hoàn thành
                      </button>
                      <button
                        type="button"
                        className="secondary small-btn"
                        onClick={() => {
                          const reason = prompt('Nhập lý do hoãn công việc:')
                          if (reason) send(`/api/ep56/tasks/${t.id}/status`, { status: 'postponed', reason })
                        }}
                      >
                        Hoãn lại
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Nhắc việc sắp hạn & quá hạn */}
      <RemindersPanel />

      {/* Lịch làm việc */}
      <CalendarPanel />

      {/* Ghi cuộc gọi nhanh */}
      <QuickCallPanel />

      {/* Dòng thời gian tương tác khách hàng */}
      <CustomerTimelinePanel />
    </div>
  )
}

export function CustomerTimelinePage({ user }) {
  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, margin: 0 }}>
          <Activity size={26} color="#2563eb" /> Hoạt động khách hàng
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 14 }}>
          Tra cứu dòng thời gian tương tác (Timeline), cuộc gọi, cuộc gặp, email và ghi nhận cuộc gọi nhanh.
        </p>
      </div>

      {/* Ghi cuộc gọi nhanh */}
      <QuickCallPanel />

      {/* Dòng thời gian tương tác khách hàng */}
      <CustomerTimelinePanel />
    </div>
  )
}

export function CalendarPage({ user }) {
  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, margin: 0 }}>
          <Calendar size={26} color="#2563eb" /> Lịch làm việc
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 14 }}>
          Xem lịch làm việc theo ngày, tuần, tháng và theo dõi lịch họp, cuộc gặp đã xếp lịch của cá nhân & đội nhóm.
        </p>
      </div>

      {/* Nhắc việc sắp hạn & quá hạn */}
      <RemindersPanel />

      {/* Lịch làm việc */}
      <CalendarPanel />
    </div>
  )
}

