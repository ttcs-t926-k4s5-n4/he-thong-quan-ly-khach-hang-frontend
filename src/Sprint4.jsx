import React, { useEffect, useMemo, useState } from 'react'
import { api, API_BASE } from './api'
import {
  Users, Plus, Search, Flame, ThermometerSun, Snowflake, Clock3, Check, X, RefreshCw,
  FileSpreadsheet, Download, Upload, Megaphone, Code2, Copy, Merge, Target, Settings2,
  GitBranch, Save, Trash2, UserCheck, ArrowRightLeft, AlertTriangle, Filter, CalendarDays,
  BarChart3, Link2, ShieldCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, ChevronUp, Zap
} from 'lucide-react'
import './sprint4.css'

const msg = e => e?.message || 'Có lỗi xảy ra.'
const money = v => Number(v || 0).toLocaleString('vi-VN') + ' ₫'
const clsVi = { hot:'Nóng', warm:'Ấm', cold:'Lạnh' }
const sourceVi = { web_form:'Biểu mẫu website', website:'Website', danh_thiep:'Danh thiếp', hoi_thao:'Hội thảo', su_kien:'Sự kiện', facebook:'Facebook', google_ads:'Google Ads', zalo:'Zalo', email:'Email', khac:'Khác' }
const channelVi = { website:'Website', facebook:'Facebook', google_ads:'Google Ads', email:'Email', zalo:'Zalo', su_kien:'Sự kiện', hoi_thao:'Hội thảo', khac:'Khác' }
const isErrorMessage = text => !!text && /không|lỗi|thiếu|bắt buộc|hãy|vui lòng|sai|không thể|không tồn tại|hết hạn|từ chối/i.test(String(text))

export const QUICK_SOURCES = [
  { id: 'danh_thiep', label: 'Danh thiếp / Gọi', icon: '📇' },
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'zalo', label: 'Zalo', icon: '💬' },
  { id: 'hoi_thao', label: 'Hội thảo / Event', icon: '🎯' },
  { id: 'google_ads', label: 'Google Ads', icon: '🔍' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'khac', label: 'Khác', icon: '➕' }
]

export const QUICK_INTERESTS = [
  { id: 'Cao', label: 'Nóng (Cao)', desc: '🔥 Cần gọi ngay', cls: 'hot' },
  { id: 'Trung bình', label: 'Ấm (Vừa)', desc: '⚡ Đang tìm hiểu', cls: 'warm' },
  { id: 'Thấp', label: 'Lạnh (Thấp)', desc: '❄️ Chưa cấp bách', cls: 'cold' }
]


function Notice({text,type='ok'}){if(!text)return null;return <div className={`s4-notice ${type}`}>{type==='err'?<AlertTriangle size={17}/>:<Check size={17}/>}<span>{text}</span></div>}
function Card({title,subtitle='',icon:Icon=Target,children,actions=null}){return <section className="s4-card"><header className="s4-card-head"><div className="s4-title-wrap"><span className="s4-icon"><Icon size={20}/></span><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div></div>{actions&&<div className="s4-head-actions">{actions}</div>}</header>{children}</section>}
function Field({label,children}){return <label className="s4-field"><span>{label}</span>{children}</label>}
function Btn({children,onClick,kind='primary',disabled=false,type='button'}){return <button type={type} disabled={disabled} onClick={onClick} className={`s4-btn ${kind}`}>{children}</button>}
function Badge({children,tone='blue'}){return <span className={`s4-badge ${tone}`}>{children}</span>}
function Empty({text='Chưa có dữ liệu.'}){return <div className="s4-empty">{text}</div>}

async function upload(path,form){const r=await fetch(API_BASE+path,{method:'POST',credentials:'include',body:form});let d={};try{d=await r.json()}catch{};if(!r.ok)throw new Error(typeof d.detail==='string'?d.detail:(d.message||'Yêu cầu không thành công.'));return d}

function Classification({value}){const Icon=value==='hot'?Flame:value==='warm'?ThermometerSun:Snowflake;return <Badge tone={value==='hot'?'red':value==='warm'?'amber':'blue'}><Icon size={13}/>{clsVi[value]||value}</Badge>}
function SLA({value}){return value==='breached'?<Badge tone="red"><AlertTriangle size={13}/>Quá SLA</Badge>:value==='warning'?<Badge tone="amber"><Clock3 size={13}/>Sắp quá SLA</Badge>:value==='not_assigned'?<Badge tone="gray">Chưa phân</Badge>:<Badge tone="green"><Check size={13}/>Trong SLA</Badge>}

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
    <div className="s4-pagination-bar">
      <div className="s4-pagination-info">
        <span>Hiển thị <b>{startItem}</b> - <b>{endItem}</b> trong tổng số <b>{totalItems}</b> Lead</span>
        {onPageSizeChange && (
          <div className="s4-page-size-selector">
            <span>Hiển thị:</span>
            <div className="s4-page-size-pills">
              {pageSizeOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`s4-size-pill ${opt === pageSize ? 'active' : ''}`}
                  onClick={() => onPageSizeChange(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="s4-pagination-controls">
        <button 
          type="button"
          className="s4-page-btn" 
          disabled={currentPage <= 1} 
          onClick={() => onPageChange(1)}
          title="Trang đầu"
        >
          <ChevronsLeft size={15} />
        </button>
        <button 
          type="button"
          className="s4-page-btn" 
          disabled={currentPage <= 1} 
          onClick={() => onPageChange(currentPage - 1)}
          title="Trang trước"
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map(p => (
          <button
            key={p}
            type="button"
            className={`s4-page-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button 
          type="button"
          className="s4-page-btn" 
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
          title="Trang sau"
        >
          <ChevronRight size={15} />
        </button>
        <button 
          type="button"
          className="s4-page-btn" 
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange(totalPages)}
          title="Trang cuối"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  )
}

export function QuickLeadModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('single')
  const [opts, setOpts] = useState({ users: [], campaigns: [] })
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    company: '',
    interest: '',
    source: 'danh_thiep',
    source_detail: '',
    industry: '',
    company_size: '',
    region: '',
    interest_level: 'Cao',
    campaign_id: ''
  })
  const [showDetails, setShowDetails] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [m, setM] = useState('')
  const [err, setErr] = useState(false)

  // Excel quick import inside modal
  const [file, setFile] = useState(null)
  const [sourceExcel, setSourceExcel] = useState('danh_thiep')
  const [campaignExcel, setCampaignExcel] = useState('')
  const [preview, setPreview] = useState(null)
  const [importing, setImporting] = useState(false)

  // Web forms list inside modal
  const [formsList, setFormsList] = useState([])
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    if (isOpen) {
      api('/api/s4/lead-options').then(setOpts).catch(() => {})
      api('/api/s4/forms').then(d => setFormsList(d.items || [])).catch(() => {})
      setM('')
      setErr(false)
    }
  }, [isOpen])

  function setFormF(k, v) { setForm(x => ({ ...x, [k]: v })) }

  async function createLead(e) {
    if (e) e.preventDefault()
    if (!form.full_name?.trim()) {
      setM('Vui lòng nhập Họ tên Lead.')
      setErr(true)
      return
    }
    if (!form.phone?.trim() && !form.email?.trim()) {
      setM('Vui lòng nhập Số điện thoại hoặc Email.')
      setErr(true)
      return
    }
    setSubmitting(true)
    setM('')
    try {
      await api('/api/s4/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          campaign_id: form.campaign_id ? Number(form.campaign_id) : null
        })
      })
      window.dispatchEvent(new CustomEvent('crm:lead-created'))
      onSuccess?.()
      onClose?.()
      setForm({
        full_name: '',
        phone: '',
        email: '',
        company: '',
        interest: '',
        source: 'danh_thiep',
        source_detail: '',
        industry: '',
        company_size: '',
        region: '',
        interest_level: 'Cao',
        campaign_id: ''
      })
      setShowDetails(false)
    } catch (er) {
      setM(msg(er))
      setErr(true)
    } finally {
      setSubmitting(false)
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      createLead()
    }
  }

  async function handleExcelPreview() {
    if (!file) return
    setImporting(true)
    setM('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('source_default', sourceExcel)
      fd.append('campaign_id', campaignExcel)
      const prevData = await upload('/api/s4/leads/import-preview', fd)
      setPreview(prevData)
      setM(`Đã kiểm tra: ${prevData.valid} dòng hợp lệ, ${prevData.invalid} dòng lỗi.`)
      setErr(false)
    } catch (er) {
      setM(msg(er))
      setErr(true)
    } finally {
      setImporting(false)
    }
  }

  async function handleExcelConfirm() {
    if (!preview?.token) return
    setImporting(true)
    try {
      await api('/api/s4/leads/import-confirm', {
        method: 'POST',
        body: JSON.stringify({ token: preview.token, mode: 'valid_only' })
      })
      window.dispatchEvent(new CustomEvent('crm:lead-created'))
      onSuccess?.()
      onClose?.()
    } catch (er) {
      setM(msg(er))
      setErr(true)
    } finally {
      setImporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="s4-modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="s4-modal-card" onClick={e => e.stopPropagation()}>
        <div className="s4-modal-head">
          <div className="s4-modal-title-wrap">
            <div className="s4-modal-icon">
              <Zap size={20} />
            </div>
            <div>
              <h3>Tạo Lead nhanh (Quick Create)</h3>
              <p>Chọn Option 1 chạm · Ngắn gọn · Không cần tạo trang mới</p>
            </div>
          </div>
          <button type="button" className="s4-modal-close" onClick={onClose} title="Đóng (Esc)">
            <X size={18} />
          </button>
        </div>

        <div className="s4-modal-body">
          <div className="s4-modal-tabs">
            <button
              type="button"
              className={`s4-modal-tab-btn ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              <Zap size={15} /> 1. Tạo 1 Lead nhanh (5s)
            </button>
            <button
              type="button"
              className={`s4-modal-tab-btn ${activeTab === 'excel' ? 'active' : ''}`}
              onClick={() => setActiveTab('excel')}
            >
              <FileSpreadsheet size={15} /> 2. Nhập file Excel nhanh
            </button>
            <button
              type="button"
              className={`s4-modal-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <Link2 size={15} /> 3. Biểu mẫu Website
            </button>
          </div>

          <Notice text={m} type={err ? 'err' : 'ok'} />

          {activeTab === 'single' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="s4-grid cols-2" style={{ gap: '10px' }}>
                <Field label="Họ tên Lead *">
                  <input
                    autoFocus
                    placeholder="Nguyễn Văn A..."
                    value={form.full_name}
                    onChange={e => setFormF('full_name', e.target.value)}
                  />
                </Field>
                <Field label="Số điện thoại *">
                  <input
                    placeholder="0912 345 678..."
                    value={form.phone}
                    onChange={e => setFormF('phone', e.target.value)}
                  />
                </Field>
              </div>

              {/* Lưới chọn Nguồn Lead (Option Card 1 chạm) */}
              <div className="s4-opt-section">
                <div className="s4-opt-label">
                  <span>Nguồn Lead *</span>
                  <small>Chọn 1 chạm</small>
                </div>
                <div className="s4-opt-grid">
                  {QUICK_SOURCES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className={`s4-opt-card ${form.source === s.id ? 'active' : ''}`}
                      onClick={() => setFormF('source', s.id)}
                    >
                      <span className="s4-opt-card-icon">{s.icon}</span>
                      <span className="s4-opt-card-text">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mức độ quan tâm / Nhiệt độ Lead */}
              <div className="s4-opt-section">
                <div className="s4-opt-label">
                  <span>Mức độ quan tâm / Nhiệt độ Lead *</span>
                  <small>Hệ thống tự động tính điểm & phân bổ</small>
                </div>
                <div className="s4-interest-grid">
                  {QUICK_INTERESTS.map(i => (
                    <button
                      key={i.id}
                      type="button"
                      className={`s4-interest-card ${i.cls} ${form.interest_level === i.id ? 'active' : ''}`}
                      onClick={() => setFormF('interest_level', i.id)}
                    >
                      <span className="s4-interest-name">{i.label}</span>
                      <span className="s4-interest-desc">{i.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhu cầu tóm tắt */}
              <Field label="Nhu cầu tóm tắt / Ghi chú nhanh">
                <input
                  placeholder="Ví dụ: Cần tư vấn gói CRM 15 người, gọi lại trong buổi sáng..."
                  value={form.interest}
                  onChange={e => setFormF('interest', e.target.value)}
                />
              </Field>

              {/* Accordion mở rộng chi tiết khác */}
              <div>
                <button
                  type="button"
                  className="s4-details-toggle"
                  onClick={() => setShowDetails(v => !v)}
                >
                  {showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  <span>{showDetails ? 'Thu gọn chi tiết nâng cao' : '+ Thêm chi tiết khác (Công ty, Email, Chiến dịch, Ngành nghề...)'}</span>
                </button>

                {showDetails && (
                  <div className="s4-details-panel" style={{ marginTop: '8px' }}>
                    <div className="s4-grid cols-2" style={{ gap: '10px' }}>
                      <Field label="Tên công ty">
                        <input
                          placeholder="Công ty TNHH..."
                          value={form.company}
                          onChange={e => setFormF('company', e.target.value)}
                        />
                      </Field>
                      <Field label="Email liên hệ">
                        <input
                          placeholder="email@example.com..."
                          value={form.email}
                          onChange={e => setFormF('email', e.target.value)}
                        />
                      </Field>
                      <Field label="Gắn vào Chiến dịch">
                        <select
                          value={form.campaign_id}
                          onChange={e => setFormF('campaign_id', e.target.value)}
                        >
                          <option value="">-- Không gắn chiến dịch --</option>
                          {opts.campaigns?.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Ngành nghề">
                        <input
                          placeholder="Bất động sản, Bán lẻ, Sản xuất..."
                          value={form.industry}
                          onChange={e => setFormF('industry', e.target.value)}
                        />
                      </Field>
                      <Field label="Quy mô nhân sự">
                        <input
                          placeholder="10-50 người, >100 người..."
                          value={form.company_size}
                          onChange={e => setFormF('company_size', e.target.value)}
                        />
                      </Field>
                      <Field label="Khu vực">
                        <input
                          placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                          value={form.region}
                          onChange={e => setFormF('region', e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'excel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  Kéo thả file Excel hoặc chọn file (.xlsx, .xls, .csv):
                </span>
                <a
                  href={`${API_BASE}/api/s4/leads/import-template`}
                  download="mau-nhap-lead.xlsx"
                  className="s4-inline-btn"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Download size={13} /> Tải tệp mẫu
                </a>
              </div>

              <div className="s4-grid cols-2" style={{ gap: '10px' }}>
                <Field label="Nguồn mặc định *">
                  <select value={sourceExcel} onChange={e => setSourceExcel(e.target.value)}>
                    <option value="danh_thiep">Danh thiếp / Gọi</option>
                    <option value="website">Website</option>
                    <option value="facebook">Facebook</option>
                    <option value="zalo">Zalo</option>
                    <option value="hoi_thao">Hội thảo / Sự kiện</option>
                    <option value="khac">Khác</option>
                  </select>
                </Field>
                <Field label="Chiến dịch">
                  <select value={campaignExcel} onChange={e => setCampaignExcel(e.target.value)}>
                    <option value="">Không gắn</option>
                    {opts.campaigns?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </div>

              <div className="s4-upload-box" style={{ padding: '12px' }}>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={e => { setFile(e.target.files?.[0] || null); setPreview(null); }}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn kind="soft" onClick={handleExcelPreview} disabled={!file || importing}>
                  <Search size={14} /> {importing ? 'Đang kiểm tra...' : 'Xem trước'}
                </Btn>
                {preview && (
                  <Btn onClick={handleExcelConfirm} disabled={importing || preview.valid === 0}>
                    <Check size={14} /> Nhập {preview.valid} dòng hợp lệ
                  </Btn>
                )}
              </div>

              {preview && (
                <div style={{ fontSize: '12.5px', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <b>Kết quả kiểm tra:</b> {preview.valid} hợp lệ · {preview.invalid} lỗi
                </div>
              )}
            </div>
          )}

          {activeTab === 'form' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#475569' }}>
                Các biểu mẫu nhúng website tự động thu thập Lead:
              </span>
              {!formsList.length ? (
                <Empty text="Chưa có biểu mẫu website nào. Hãy tạo tại mục Biểu mẫu nhúng." />
              ) : (
                formsList.map(formItem => (
                  <div key={formItem.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', background: '#fafbfc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <b>{formItem.name}</b>
                      <a
                        href={`${API_BASE}/embed/${formItem.public_key}/page`}
                        target="_blank"
                        rel="noreferrer"
                        className="s4-inline-btn"
                        style={{ textDecoration: 'none' }}
                      >
                        Mở form demo ↗
                      </a>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                      Nguồn: <b>{formItem.source_name}</b> · Đã thu thập: <b>{formItem.lead_count} Lead</b>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        readOnly
                        value={`<script src="${API_BASE}/embed/${formItem.public_key}.js"></script>`}
                        style={{ fontSize: '11px', background: '#fff' }}
                      />
                      <button
                        type="button"
                        className="s4-inline-btn"
                        onClick={() => {
                          navigator.clipboard?.writeText(`<script src="${API_BASE}/embed/${formItem.public_key}.js"></script>`)
                          setCopiedCode(true)
                          setTimeout(() => setCopiedCode(false), 2000)
                        }}
                      >
                        {copiedCode ? 'Đã chép!' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {activeTab === 'single' && (
          <div className="s4-modal-foot">
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Mẹo: Nhấn <b>Ctrl + Enter</b> để tạo ngay
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn kind="soft" onClick={onClose}>Hủy bỏ</Btn>
              <Btn onClick={createLead} disabled={submitting}>
                <Zap size={16} /> {submitting ? 'Đang tạo...' : '⚡ Tạo Lead ngay'}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function RejectLeadModal({ isOpen, lead, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const QUICK_REASONS = [
    '📞 Gọi 3 lần không liên lạc được',
    '❌ Sai số điện thoại / Không đúng người',
    '🚫 Không có nhu cầu sử dụng',
    '🏢 Đã mua của đối thủ cạnh tranh',
    '💰 Ngân sách chưa phù hợp'
  ]

  useEffect(() => {
    if (isOpen) setReason(QUICK_REASONS[0])
  }, [isOpen])

  if (!isOpen || !lead) return null

  async function submit() {
    if (!reason.trim()) return
    setSubmitting(true)
    try {
      await onConfirm(lead.id, reason)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="s4-modal-backdrop" onClick={onClose}>
      <div className="s4-modal-card sm" onClick={e => e.stopPropagation()}>
        <div className="s4-modal-head">
          <div className="s4-modal-title-wrap">
            <div className="s4-modal-icon red">
              <X size={20} />
            </div>
            <div>
              <h3>Từ chối tiếp nhận Lead</h3>
              <p>{lead.full_name} · {lead.phone || lead.email}</p>
            </div>
          </div>
          <button type="button" className="s4-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="s4-modal-body">
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            Lead sẽ được chuyển về <b>Hàng chờ phân bổ</b> để trưởng nhóm phân cho nhân viên khác. Vui lòng chọn lý do:
          </div>

          <div className="s4-opt-section">
            <div className="s4-opt-label"><span>Lý do nhanh:</span></div>
            <div className="s4-tag-selector">
              {QUICK_REASONS.map(r => (
                <button
                  key={r}
                  type="button"
                  className={`s4-tag-pill ${reason === r ? 'active' : ''}`}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Field label="Chi tiết lý do từ chối:">
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập hoặc chỉnh sửa lý do từ chối..."
            />
          </Field>
        </div>

        <div className="s4-modal-foot">
          <Btn kind="soft" onClick={onClose}>Hủy</Btn>
          <button
            type="button"
            className="s4-btn"
            style={{ background: '#ef4444', color: '#fff' }}
            onClick={submit}
            disabled={submitting || !reason.trim()}
          >
            {submitting ? 'Đang gửi...' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ConvertLeadModal({ isOpen, lead, onClose, onConfirm }) {
  const [val, setVal] = useState('50000000')
  const [submitting, setSubmitting] = useState(false)
  const QUICK_VALUES = [
    { label: '20 Triệu', value: '20000000' },
    { label: '50 Triệu', value: '50000000' },
    { label: '100 Triệu', value: '100000000' },
    { label: '200 Triệu', value: '200000000' }
  ]

  if (!isOpen || !lead) return null

  async function submit() {
    setSubmitting(true)
    try {
      await onConfirm(lead.id, Number(val) || 0)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="s4-modal-backdrop" onClick={onClose}>
      <div className="s4-modal-card sm" onClick={e => e.stopPropagation()}>
        <div className="s4-modal-head">
          <div className="s4-modal-title-wrap">
            <div className="s4-modal-icon green">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h3>Chuyển đổi thành Khách hàng & Cơ hội</h3>
              <p>{lead.full_name} · {lead.company || 'Cá nhân'}</p>
            </div>
          </div>
          <button type="button" className="s4-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="s4-modal-body">
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            🎉 <b>Hệ thống tự động tạo:</b>
            <ul style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
              <li>Khách hàng doanh nghiệp: <b>{lead.company || lead.full_name}</b></li>
              <li>Người liên hệ: <b>{lead.full_name}</b> ({lead.phone || lead.email})</li>
              <li>Cơ hội bán hàng với giá trị dự kiến dưới đây.</li>
            </ul>
          </div>

          <div className="s4-opt-section">
            <div className="s4-opt-label"><span>Chọn nhanh giá trị dự kiến:</span></div>
            <div className="s4-tag-selector">
              {QUICK_VALUES.map(v => (
                <button
                  key={v.value}
                  type="button"
                  className={`s4-tag-pill ${val === v.value ? 'active' : ''}`}
                  onClick={() => setVal(v.value)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Giá trị cơ hội dự kiến (VND):">
            <input
              type="number"
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="50000000"
            />
          </Field>
          <div style={{ fontSize: '12.5px', color: '#4f46e5', fontWeight: 700 }}>
            Tương đương: {Number(val || 0).toLocaleString('vi-VN')} ₫
          </div>
        </div>

        <div className="s4-modal-foot">
          <Btn kind="soft" onClick={onClose}>Hủy</Btn>
          <Btn onClick={submit} disabled={submitting}>
            {submitting ? 'Đang chuyển đổi...' : 'Chuyển đổi ngay'}
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function LeadPage({user}){
  const [data,setData]=useState({items:[],total:0});const [m,setM]=useState('');const [err,setErr]=useState(false);const [loadingLeads,setLoadingLeads]=useState(true)
  const [filters,setFilters]=useState({q:'',status:'',source:'',classification:'',assigned_to:'',date_from:'',date_to:'',sla_breached_only:false})
  const [page,setPage]=useState(1)
  const [perPage,setPerPage]=useState(7)
  const [saved,setSaved]=useState([]);const [saveName,setSaveName]=useState('');const [opts,setOpts]=useState({users:[],campaigns:[]})
  const [showAddModal,setShowAddModal]=useState(false)
  const [showFilters,setShowFilters]=useState(false)
  const [rejectLeadTarget,setRejectLeadTarget]=useState(null)
  const [convertLeadTarget,setConvertLeadTarget]=useState(null)

  const roles=new Set(user?.roles||[]);const privileged=roles.has('ADMIN')||roles.has('DIRECTOR');const canCreateLead=privileged||roles.has('MARKETING');const canWorkLead=privileged||roles.has('SALES')||roles.has('TEAM_LEADER')
  const canHandleLead=x=>canWorkLead&&x.status!=='Đã chuyển đổi'&&(privileged||Number(x.assigned_to)===Number(user?.id))
  const hasActiveFilter = Boolean(filters.q || filters.status || filters.source || filters.classification || filters.assigned_to || filters.date_from || filters.date_to || filters.sla_breached_only)

  async function load(custom=filters, pageOverride=page, perPageOverride=perPage){
    setLoadingLeads(true);
    try{
      const q=new URLSearchParams();
      Object.entries(custom).forEach(([k,v])=>{if(v!==''&&v!==false&&v!=null)q.set(k,String(v))});
      q.set('page', String(pageOverride));
      q.set('per_page', String(perPageOverride));
      const d=await api('/api/s4/leads?'+q);
      setData(d);
      setErr(false)
    }catch(e){
      setM(msg(e));
      setErr(true)
    }finally{
      setLoadingLeads(false)
    }
  }

  async function loadSaved(){try{setSaved((await api('/api/s4/saved-filters')).items||[])}catch{}}
  async function loadOpts(){try{setOpts(await api('/api/s4/lead-options'))}catch{}}

  useEffect(()=>{
    load();loadSaved();loadOpts();
    const handleLeadCreated = () => { load(filters, 1, perPage); setPage(1); }
    window.addEventListener('crm:lead-created', handleLeadCreated)
    return () => window.removeEventListener('crm:lead-created', handleLeadCreated)
  },[])

  function setF(k,v){setFilters(x=>({...x,[k]:v}))}

  async function accept(id){try{setM((await api(`/api/s4/leads/${id}/accept`,{method:'POST'})).message);load(filters,page,perPage)}catch(e){setM(msg(e));setErr(true)}}

  async function handleRejectConfirm(id, reason){
    try{
      const res = await api(`/api/s4/leads/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) });
      setM(res.message);
      setErr(false);
      load(filters, page, perPage);
    }catch(e){
      setM(msg(e));
      setErr(true);
    }
  }

  async function handleConvertConfirm(id, opportunityValue){
    try{
      const d = await api(`/api/s4/leads/${id}/convert`, { method: 'POST', body: JSON.stringify({ opportunity_value: opportunityValue }) });
      setM(`${d.message} Khách hàng #${d.customer_id}, cơ hội #${d.opportunity_id}.`);
      setErr(false);
      load(filters, page, perPage);
    }catch(e){
      setM(msg(e));
      setErr(true);
    }
  }

  async function saveFilter(){if(!saveName.trim())return setM('Hãy nhập tên bộ lọc.');try{await api('/api/s4/saved-filters',{method:'POST',body:JSON.stringify({name:saveName,criteria:filters})});setSaveName('');setM('Đã lưu bộ lọc.');loadSaved()}catch(e){setM(msg(e));setErr(true)}}
  async function delSaved(id){try{await api('/api/s4/saved-filters/'+id,{method:'DELETE'});loadSaved()}catch(e){setM(msg(e));setErr(true)}}

  return <div className="s4-page">
    <div className="s4-hero">
      <div>
        <h1>Danh sách Lead</h1>
        <p>Một nơi để ưu tiên, nhận/từ chối, theo dõi SLA và chuyển đổi lead thành khách hàng.</p>
      </div>
      <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
        {canCreateLead && (
          <Btn onClick={()=>setShowAddModal(true)}>
            <Zap size={16}/>+ Thêm Lead nhanh
          </Btn>
        )}
        <Btn kind={showFilters ? 'primary' : 'soft'} onClick={()=>setShowFilters(v=>!v)}>
          <Filter size={15}/>{showFilters ? 'Đóng bộ lọc' : '🔍 Bộ lọc Lead'}{hasActiveFilter && !showFilters ? ' (Đang lọc)' : ''}
        </Btn>
        {hasActiveFilter && (
          <Btn kind="soft" onClick={()=>{const empty={q:'',status:'',source:'',classification:'',assigned_to:'',date_from:'',date_to:'',sla_breached_only:false};setFilters(empty);setPage(1);load(empty,1,perPage)}}>
            <X size={14}/>Xóa lọc
          </Btn>
        )}
        <div className="s4-hero-stat">
          <b>{data.total||0}</b><span>Lead theo bộ lọc</span>
        </div>
      </div>
    </div>

    <Notice text={m} type={err?'err':'ok'}/>

    {/* Modal Tạo Lead Nhanh - Không tạo trang mới, Option 1 chạm */}
    <QuickLeadModal
      isOpen={showAddModal}
      onClose={()=>setShowAddModal(false)}
      onSuccess={()=>{
        setM('Tạo Lead thành công! Hệ thống đã tự động chấm điểm và phân bổ.');
        setErr(false);
        load(filters, 1, perPage);
        setPage(1);
      }}
    />

    {/* Modal Từ chối Lead với lý do nhanh */}
    <RejectLeadModal
      isOpen={!!rejectLeadTarget}
      lead={rejectLeadTarget}
      onClose={()=>setRejectLeadTarget(null)}
      onConfirm={handleRejectConfirm}
    />

    {/* Modal Chuyển đổi Lead với giá trị cơ hội */}
    <ConvertLeadModal
      isOpen={!!convertLeadTarget}
      lead={convertLeadTarget}
      onClose={()=>setConvertLeadTarget(null)}
      onConfirm={handleConvertConfirm}
    />

    {/* Khối Bộ lọc Lead: Mặc định thu gọn, khi bấm vào nút 'Bộ lọc Lead' mới hiện lên */}
    {showFilters && (
      <Card
        title="Bộ lọc Lead"
        subtitle="Lọc theo trạng thái, nguồn, Nóng/Ấm/Lạnh, người phụ trách, thời gian và SLA."
        icon={Filter}
        actions={
          <div style={{display:'flex',gap:'8px'}}>
            <Btn kind="primary" onClick={()=>{setPage(1);load(filters,1,perPage)}}><Search size={15}/>Áp dụng</Btn>
            <Btn kind="soft" onClick={()=>{const empty={q:'',status:'',source:'',classification:'',assigned_to:'',date_from:'',date_to:'',sla_breached_only:false};setFilters(empty);setPage(1);load(empty,1,perPage)}}><RefreshCw size={14}/>Đặt lại</Btn>
            <Btn kind="soft" onClick={()=>setShowFilters(false)}><X size={15}/>Đóng</Btn>
          </div>
        }
      >
        <div className="s4-grid cols-4">
          <Field label="Tìm kiếm"><input placeholder="Tên, email, SĐT, công ty..." value={filters.q} onChange={e=>setF('q',e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){setPage(1);load(filters,1,perPage)}}} /></Field>
          <Field label="Trạng thái"><select value={filters.status} onChange={e=>setF('status',e.target.value)}><option value="">Tất cả</option><option>Mới</option><option>Đã phân công</option><option>Đang chăm sóc</option><option>Chờ phân bổ</option><option>Đã chuyển đổi</option></select></Field>
          <Field label="Nguồn"><select value={filters.source} onChange={e=>setF('source',e.target.value)}><option value="">Tất cả</option>{Object.entries(sourceVi).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field>
          <Field label="Phân loại"><select value={filters.classification} onChange={e=>setF('classification',e.target.value)}><option value="">Tất cả</option><option value="hot">Nóng</option><option value="warm">Ấm</option><option value="cold">Lạnh</option></select></Field>
          <Field label="Người phụ trách"><select value={filters.assigned_to} onChange={e=>setF('assigned_to',e.target.value)}><option value="">Tất cả</option>{opts.users.map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}</select></Field>
          <Field label="Từ ngày"><input type="date" value={filters.date_from} onChange={e=>setF('date_from',e.target.value)}/></Field>
          <Field label="Đến ngày"><input type="date" value={filters.date_to} onChange={e=>setF('date_to',e.target.value)}/></Field>
          <label className="s4-check"><input type="checkbox" checked={filters.sla_breached_only} onChange={e=>setF('sla_breached_only',e.target.checked)}/><span>Chỉ Lead quá SLA</span></label>
        </div>
        <div className="s4-saved">
          <input placeholder="Tên bộ lọc hay dùng..." value={saveName} onChange={e=>setSaveName(e.target.value)}/>
          <Btn kind="soft" onClick={saveFilter}><Save size={15}/>Lưu bộ lọc</Btn>
          {saved.map(x=><span key={x.id} className="s4-saved-chip"><button onClick={()=>{setFilters(x.criteria||{});setPage(1);setTimeout(()=>load(x.criteria||{},1,perPage),0)}}>{x.name}</button><button onClick={()=>delSaved(x.id)}><X size={12}/></button></span>)}
        </div>
      </Card>
    )}

    {/* Bảng danh sách Lead: NẰM NGAY TRÊN CÙNG ĐỂ THẤY NGAY DỮ LIỆU */}
    <Card
      title="Lead cần xử lý"
      subtitle="Lead quá SLA được tô nổi bật; điểm chỉ dùng để sắp xếp ưu tiên, không tự động loại."
      icon={Users}
      actions={
        <div style={{display:'flex',gap:'8px'}}>
          {canCreateLead && (
            <Btn kind="primary" onClick={()=>setShowAddModal(true)}>
              <Zap size={14}/>+ Tạo Lead nhanh
            </Btn>
          )}
          {!showFilters && (
            <Btn kind="soft" onClick={()=>setShowFilters(true)}>
              <Filter size={14}/>{hasActiveFilter ? 'Đang lọc' : 'Lọc Lead'}
            </Btn>
          )}
          <Btn kind="soft" onClick={()=>{setPage(1);load(filters,1,perPage)}}>
            <RefreshCw size={14}/>Tải lại
          </Btn>
        </div>
      }
    >
      {loadingLeads?<Empty text="Đang tải danh sách Lead..."/>:err?<Empty text="Không tải được danh sách Lead. Kiểm tra thông báo lỗi phía trên và kết nối Backend."/>:!data.items?.length?<div className="s4-empty"><p>Không có Lead phù hợp với bộ lọc hoặc quyền xem dữ liệu hiện tại.</p><Btn kind="soft" onClick={()=>{const empty={q:'',status:'',source:'',classification:'',assigned_to:'',date_from:'',date_to:'',sla_breached_only:false};setFilters(empty);setPage(1);load(empty,1,perPage)}}><RefreshCw size={15}/>Xóa bộ lọc và tải lại</Btn></div>:<><div className="s4-table-wrap"><table className="s4-table"><thead><tr><th>Lead</th><th>Nguồn</th><th>Điểm</th><th>Trạng thái</th><th>Phụ trách</th><th>SLA</th><th>Thao tác</th></tr></thead><tbody>{data.items.map(x=><tr key={x.id} className={x.sla_status==='breached'?'s4-row-danger':''}><td><b>{x.full_name}</b><small>{x.company||'-'} · {x.phone||x.email||'-'}</small></td><td>{sourceVi[x.source]||x.source}</td><td><div className="s4-score"><b>{x.score}</b><Classification value={x.classification}/></div></td><td>{x.status}</td><td>{x.assigned_name||'Chưa phân'}</td><td><SLA value={x.sla_status}/></td><td>{canHandleLead(x)?<div className="s4-mini-actions">{x.status==='Đã phân công'&&<button type="button" title="Nhận Lead" onClick={()=>accept(x.id)}><UserCheck size={15}/></button>}<button type="button" title="Từ chối Lead" onClick={()=>setRejectLeadTarget(x)}><X size={15}/></button><button type="button" title="Chuyển thành khách hàng & cơ hội" onClick={()=>setConvertLeadTarget(x)}><ArrowRightLeft size={15}/></button></div>:<Badge tone={x.status==='Đã chuyển đổi'?'green':'gray'}>{x.status==='Đã chuyển đổi'?'Đã chuyển đổi':'Chỉ xem'}</Badge>}</td></tr>)}</tbody></table></div><Pagination currentPage={page} totalItems={data.total||0} pageSize={perPage} pageSizeOptions={[7, 15, 30, 50, 100]} onPageChange={p=>{setPage(p);load(filters,p,perPage)}} onPageSizeChange={ps=>{setPerPage(ps);setPage(1);load(filters,1,ps)}}/></>}
    </Card>
  </div>
}

export function LeadImportPage(){
  const[file,setFile]=useState(null),[fileInputKey,setFileInputKey]=useState(0),[source,setSource]=useState('hoi_thao'),[campaign,setCampaign]=useState(''),[opts,setOpts]=useState({campaigns:[]}),[preview,setPreview]=useState(null),[m,setM]=useState(''),[err,setErr]=useState(false)
  useEffect(()=>{api('/api/s4/lead-options').then(setOpts).catch(()=>{})},[])
  const fileSize = n => {const v=Number(n||0);return v>=1024*1024?`${(v/1024/1024).toFixed(2)} MB`:`${Math.max(1,Math.round(v/1024))} KB`}
  async function download(){const r=await fetch(API_BASE+'/api/s4/leads/import-template',{credentials:'include'});if(!r.ok){setErr(true);return setM('Không tải được tệp mẫu.')}const b=await r.blob(),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='mau-nhap-lead.xlsx';a.click();URL.revokeObjectURL(u);setErr(false);setM('Đã tải tệp mẫu Lead.')}
  function chooseFile(e){
    const f=e.target.files?.[0]||null
    if(!f)return
    const ext=(f.name.split('.').pop()||'').toLowerCase()
    if(!['xlsx','xls','csv'].includes(ext)){setFile(null);setPreview(null);setErr(true);setM('Chỉ hỗ trợ tệp Excel (.xlsx, .xls) hoặc CSV.');setFileInputKey(x=>x+1);return}
    setFile(f);setPreview(null);setErr(false);setM(`Đã chọn tệp ${f.name}. Bấm Xem trước để kiểm tra từng dòng trước khi nhập.`)
  }
  function clearFile(){setFile(null);setPreview(null);setM('');setErr(false);setFileInputKey(x=>x+1)}
  async function prev(){if(!file){setErr(true);setM('Hãy chọn tệp Excel/CSV.');return}try{const fd=new FormData();fd.append('file',file);fd.append('source_default',source);fd.append('campaign_id',campaign);setPreview(await upload('/api/s4/leads/import-preview',fd));setM('Đã xem trước dữ liệu. Chưa ghi vào CSDL.');setErr(false)}catch(e){setM(msg(e));setErr(true)}}
  async function confirm(mode='valid_only'){try{const d=await api('/api/s4/leads/import-confirm',{method:'POST',body:JSON.stringify({token:preview.token,mode})});setM(d.message);setErr(false);setPreview(null)}catch(e){setM(msg(e));setErr(true)}}
  return <div className="s4-page">
    <div className="s4-hero"><div><h1>Nhập Lead từ Excel</h1><p>Tải mẫu, xem trước từng dòng, sửa lỗi trước khi xác nhận nhập.</p></div></div>
    <Notice text={m} type={err?'err':'ok'}/>
    <Card title="Tải lên dữ liệu" icon={FileSpreadsheet} actions={<Btn kind="soft" onClick={download}><Download size={15}/>Tải tệp mẫu</Btn>}>
      <div className="s4-grid cols-2 s4-import-meta">
        <Field label="Nguồn mặc định *"><select value={source} onChange={e=>setSource(e.target.value)}><option value="hoi_thao">Hội thảo</option><option value="su_kien">Sự kiện</option><option value="danh_thiep">Danh thiếp</option><option value="facebook">Facebook</option><option value="khac">Khác</option></select></Field>
        <Field label="Chiến dịch"><select value={campaign} onChange={e=>setCampaign(e.target.value)}><option value="">Không gắn</option>{opts.campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      </div>
      <div className={`s4-upload-box ${file?'has-file':''}`}>
        <input key={fileInputKey} id="lead-import-file" className="s4-upload-input" type="file" accept=".xlsx,.xls,.csv" onChange={chooseFile}/>
        <div className="s4-upload-icon"><FileSpreadsheet size={27}/></div>
        <div className="s4-upload-copy">
          <b>{file?file.name:'Chọn tệp Lead để tải lên'}</b>
          <span>{file?`${fileSize(file.size)} · Sẵn sàng xem trước`:'Hỗ trợ Excel (.xlsx, .xls) và CSV · Dữ liệu chưa được ghi vào hệ thống ở bước này'}</span>
        </div>
        <div className="s4-upload-actions">
          <label htmlFor="lead-import-file" className="s4-upload-choose"><Upload size={15}/>{file?'Đổi tệp':'Chọn tệp'}</label>
          {file&&<button type="button" className="s4-upload-clear" onClick={clearFile} title="Bỏ tệp đã chọn"><X size={15}/>Bỏ tệp</button>}
        </div>
      </div>
      <div className="s4-import-hint"><ShieldCheck size={16}/><span>Hệ thống sẽ kiểm tra định dạng, dữ liệu trùng và lỗi từng dòng trước khi cho phép nhập chính thức.</span></div>
      <div className="s4-actions"><Btn onClick={prev} disabled={!file}><Search size={16}/>Xem trước dữ liệu</Btn></div>
    </Card>
    {preview&&<Card title={`Kết quả xem trước · Hợp lệ ${preview.valid} · Lỗi ${preview.invalid}`} icon={Search}><div className="s4-table-wrap"><table className="s4-table"><thead><tr><th>Dòng</th><th>Họ tên</th><th>Liên hệ</th><th>Nguồn</th><th>Kết quả</th></tr></thead><tbody>{preview.items.map(x=><tr key={x.row}><td>{x.row}</td><td>{x.full_name}</td><td>{x.email||x.phone}</td><td>{sourceVi[x.source]||x.source}</td><td>{x.errors?.length?<Badge tone="red">{x.errors.join('; ')}</Badge>:<Badge tone="green">Hợp lệ</Badge>}</td></tr>)}</tbody></table></div><div className="s4-actions"><Btn onClick={()=>confirm('valid_only')}>Nhập dòng hợp lệ</Btn><Btn kind="soft" onClick={()=>confirm('all_or_nothing')}>Tất cả hoặc không nhập</Btn></div></Card>}
  </div>
}

export function CampaignPage(){const[i,setI]=useState([]),[f,setF]=useState({name:'',channel:'website',budget:'',start_date:'',end_date:'',description:''}),[m,setM]=useState('');async function load(){try{setI((await api('/api/s4/campaigns')).items||[])}catch(e){setM(msg(e))}}useEffect(()=>{load()},[]);async function add(){try{setM((await api('/api/s4/campaigns',{method:'POST',body:JSON.stringify({...f,budget:Number(f.budget)||0})})).message);setF({name:'',channel:'website',budget:'',start_date:'',end_date:'',description:''});load()}catch(e){setM(msg(e))}}return <div className="s4-page"><div className="s4-hero"><div><h1>Chiến dịch Marketing</h1><p>Đo số Lead, cơ hội và giá trị đã chốt theo từng chiến dịch.</p></div></div><Notice text={m} type={isErrorMessage(m)?'err':'ok'}/><Card title="Khai báo chiến dịch" icon={Megaphone}><div className="s4-grid cols-3"><Field label="Tên chiến dịch"><input value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></Field><Field label="Kênh"><select value={f.channel} onChange={e=>setF({...f,channel:e.target.value})}><option value="website">Website</option><option value="facebook">Facebook</option><option value="google_ads">Google Ads</option><option value="email">Email</option><option value="zalo">Zalo</option><option value="su_kien">Sự kiện</option><option value="hoi_thao">Hội thảo</option><option value="khac">Khác</option></select></Field><Field label="Ngân sách"><input type="number" value={f.budget} onChange={e=>setF({...f,budget:e.target.value})}/></Field><Field label="Ngày bắt đầu"><input type="date" value={f.start_date} onChange={e=>setF({...f,start_date:e.target.value})}/></Field><Field label="Ngày kết thúc"><input type="date" value={f.end_date} onChange={e=>setF({...f,end_date:e.target.value})}/></Field><Field label="Mô tả"><input value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></Field></div><div className="s4-actions"><Btn onClick={add}><Plus size={16}/>Tạo chiến dịch</Btn></div></Card>{!i.length?<Empty text="Chưa có chiến dịch Marketing. Hãy tạo chiến dịch đầu tiên ở biểu mẫu phía trên."/>:<div className="s4-stat-grid">{i.map(x=><div className="s4-stat-card" key={x.id}><div className="s4-stat-top"><Megaphone size={18}/><Badge tone={x.status==='Đang chạy'?'green':x.status==='Đã kết thúc'?'gray':'blue'}>{x.status}</Badge></div><h3>{x.name}</h3><p>{channelVi[x.channel]||x.channel} · {x.start_date||'-'} → {x.end_date||'-'}</p><div className="s4-metrics"><span><b>{x.lead_count}</b> Lead</span><span><b>{x.opportunity_count}</b> Cơ hội</span><span><b>{money(x.closed_value)}</b> Đã chốt</span></div><small>Ngân sách: {money(x.budget)}</small></div>)}</div>}</div>}

export function LeadFormsPage(){const[i,setI]=useState([]),[c,setC]=useState([]),[f,setF]=useState({name:'',source_name:'Website',campaign_id:'',allowed_domains:''}),[m,setM]=useState(''),[code,setCode]=useState(null),[page,setPage]=useState(1);async function load(){try{setI((await api('/api/s4/forms')).items||[]);setC((await api('/api/s4/campaigns')).items||[])}catch(e){setM(msg(e))}}useEffect(()=>{load()},[]);async function add(){try{const d=await api('/api/s4/forms',{method:'POST',body:JSON.stringify({name:f.name,source_name:f.source_name,campaign_id:f.campaign_id?Number(f.campaign_id):null,allowed_domains:f.allowed_domains.split(',').map(x=>x.trim()).filter(Boolean),is_active:true})});setCode(d);setM(d.message);load()}catch(e){setM(msg(e))}}function copy(t){navigator.clipboard?.writeText(t);setM('Đã sao chép mã nhúng.')}async function toggle(id){try{setM((await api(`/api/s4/forms/${id}/toggle`,{method:'POST'})).message);load()}catch(e){setM(msg(e))}}return <div className="s4-page"><div className="s4-hero"><div><h1>Biểu mẫu nhúng Website</h1><p>Tạo form có chống spam, giới hạn IP và gắn đúng nguồn/chiến dịch.</p></div></div><Notice text={m} type={isErrorMessage(m)?'err':'ok'}/><Card title="Tạo biểu mẫu" icon={Code2}><div className="s4-grid cols-3"><Field label="Tên biểu mẫu"><input value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></Field><Field label="Nguồn"><input value={f.source_name} onChange={e=>setF({...f,source_name:e.target.value})}/></Field><Field label="Chiến dịch"><select value={f.campaign_id} onChange={e=>setF({...f,campaign_id:e.target.value})}><option value="">Không gắn</option>{c.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></Field><Field label="Tên miền cho phép (cách nhau dấu phẩy)"><input placeholder="example.com, landing.example.com" value={f.allowed_domains} onChange={e=>setF({...f,allowed_domains:e.target.value})}/></Field></div><div className="s4-actions"><Btn onClick={add}><Plus size={16}/>Sinh mã nhúng</Btn></div>{code&&<div className="s4-code-grid"><div><b>Script</b><code>{code.script}</code><Btn kind="soft" onClick={()=>copy(code.script)}><Copy size={14}/>Sao chép</Btn></div><div><b>Iframe</b><code>{code.iframe}</code><Btn kind="soft" onClick={()=>copy(code.iframe)}><Copy size={14}/>Sao chép</Btn></div></div>}</Card><Card title="Biểu mẫu đã tạo" icon={Link2}>{!i.length?<Empty/>:<><div className="s4-table-wrap"><table className="s4-table"><thead><tr><th>Tên</th><th>Nguồn</th><th>Chiến dịch</th><th>Lead</th><th>Trạng thái</th><th>Trang demo</th><th>Thao tác</th></tr></thead><tbody>{i.slice((page-1)*7,page*7).map(x=><tr key={x.id}><td><b>{x.name}</b><small>{x.public_key}</small></td><td>{x.source_name}</td><td>{x.campaign_name||'-'}</td><td>{x.lead_count}</td><td><Badge tone={x.is_active?'green':'gray'}>{x.is_active?'Đang bật':'Đã tắt'}</Badge></td><td><a className="s4-link" target="_blank" rel="noreferrer" href={`${API_BASE}/embed/${x.public_key}/page`}>Mở form</a></td><td><button className="s4-inline-btn" onClick={()=>toggle(x.id)}>{x.is_active?'Tắt':'Bật'}</button></td></tr>)}</tbody></table></div>{i.length>7&&<Pagination currentPage={page} totalItems={i.length} pageSize={7} onPageChange={setPage}/>}</>}</Card></div>}

export function LeadDuplicatesPage(){const[d,setD]=useState({pairs:[],customer_suggestions:[]}),[m,setM]=useState('');async function load(){try{setD(await api('/api/s4/leads/duplicates'))}catch(e){setM(msg(e))}}useEffect(()=>{load()},[]);async function merge(a,b){if(!confirm(`Gộp lead #${b} vào #${a}?`))return;try{setM((await api('/api/s4/leads/merge',{method:'POST',body:JSON.stringify({keep_id:a,merge_id:b})})).message);load()}catch(e){setM(msg(e))}}async function linkCustomer(lid,cid){try{setM((await api(`/api/s4/leads/${lid}/link-customer/${cid}`,{method:'POST'})).message);load()}catch(e){setM(msg(e))}}return <div className="s4-page"><div className="s4-hero"><div><h1>Phát hiện & gộp Lead trùng</h1><p>Đối chiếu email, số điện thoại, tên công ty và gợi ý khách hàng đã tồn tại.</p></div></div><Notice text={m} type={isErrorMessage(m)?'err':'ok'}/><Card title="Cặp Lead nghi trùng" icon={Merge}>{!d.pairs?.length?<Empty text="Chưa phát hiện cặp Lead trùng."/>:<div className="s4-duplicate-grid">{d.pairs.map((p,n)=><div className="s4-compare" key={n}><div><Badge tone="blue">Bản giữ lại A</Badge><h3>{p.a.full_name}</h3><p>{p.a.email||'-'} · {p.a.phone||'-'}</p><small>{p.a.company||'-'}</small></div><div className="s4-merge-arrow"><Merge size={22}/><span>{p.reasons.join(', ')}</span></div><div><Badge tone="amber">Bản gộp B</Badge><h3>{p.b.full_name}</h3><p>{p.b.email||'-'} · {p.b.phone||'-'}</p><small>{p.b.company||'-'}</small></div><Btn onClick={()=>merge(p.a.id,p.b.id)}><Merge size={15}/>Gộp</Btn></div>)}</div>}</Card><Card title="Lead trùng với khách hàng đã có" icon={ShieldCheck}>{!d.customer_suggestions?.length?<Empty text="Chưa có gợi ý liên kết khách hàng."/>:<div className="s4-table-wrap"><table className="s4-table"><thead><tr><th>Lead</th><th>Khách hàng hiện có</th><th>Thao tác</th></tr></thead><tbody>{d.customer_suggestions.map((x,n)=><tr key={n}><td>{x.lead.full_name} · {x.lead.company}</td><td>#{x.customer.id} {x.customer.name}</td><td><button className="s4-inline-btn" onClick={()=>linkCustomer(x.lead.id,x.customer.id)}>Gắn khách hàng</button></td></tr>)}</tbody></table></div>}</Card></div>}

export function LeadScoringPage(){const[d,setD]=useState({rules:[],hot_min:70,warm_min:40}),[m,setM]=useState('');async function load(){try{setD(await api('/api/s4/scoring'))}catch(e){setM(msg(e))}}useEffect(()=>{load()},[]);function addRule(){setD(x=>({...x,rules:[...x.rules,{criterion:'industry',match_value:'',points:10,sort_order:x.rules.length+1}]}))}function upd(n,k,v){setD(x=>({...x,rules:x.rules.map((r,i)=>i===n?{...r,[k]:v}:r)}))}async function save(){try{setM((await api('/api/s4/scoring',{method:'PUT',body:JSON.stringify({hot_min:Number(d.hot_min),warm_min:Number(d.warm_min),rules:d.rules.map(r=>({...r,points:Number(r.points),sort_order:Number(r.sort_order)}))})})).message);load()}catch(e){setM(msg(e))}}return <div className="s4-page"><div className="s4-hero"><div><h1>Chấm điểm Lead</h1><p>Cấu hình tiêu chí và ngưỡng Nóng / Ấm / Lạnh; điểm chỉ quyết định thứ tự ưu tiên.</p></div></div><Notice text={m} type={isErrorMessage(m)?'err':'ok'}/><Card title="Ngưỡng phân loại" icon={Target}><div className="s4-grid cols-3"><Field label="Nóng từ"><input type="number" value={d.hot_min} onChange={e=>setD({...d,hot_min:e.target.value})}/></Field><Field label="Ấm từ"><input type="number" value={d.warm_min} onChange={e=>setD({...d,warm_min:e.target.value})}/></Field></div></Card><Card title="Tiêu chí tính điểm" icon={Settings2} actions={<Btn kind="soft" onClick={addRule}><Plus size={15}/>Thêm tiêu chí</Btn>}><div className="s4-rule-list">{d.rules.map((r,n)=><div className="s4-rule" key={n}><select value={r.criterion} onChange={e=>upd(n,'criterion',e.target.value)}><option value="industry">Ngành nghề</option><option value="company_size">Quy mô</option><option value="source">Nguồn</option><option value="interest_level">Mức quan tâm</option></select><input placeholder="Giá trị khớp" value={r.match_value} onChange={e=>upd(n,'match_value',e.target.value)}/><input type="number" value={r.points} onChange={e=>upd(n,'points',e.target.value)}/><button type="button" onClick={()=>setD(x=>({...x,rules:x.rules.filter((_,i)=>i!==n)}))}><Trash2 size={16}/></button></div>)}</div><div className="s4-actions"><Btn onClick={save}><Save size={16}/>Lưu & tính lại toàn bộ Lead</Btn></div></Card></div>}

export function LeadAssignmentPage({user}){
  const roles=new Set(user?.roles||[])
  const canConfigure=roles.has('ADMIN')||roles.has('DIRECTOR')
  const isTeamLeader=roles.has('TEAM_LEADER')&&!canConfigure
  const [d,setD]=useState({items:[],users:[],groups:[]})
  const [queue,setQueue]=useState([])
  const [sel,setSel]=useState({})
  const [m,setM]=useState('')
  const [loading,setLoading]=useState(true)
  const [queuePage,setQueuePage]=useState(1)

  async function load(){
    setLoading(true)
    try{
      const q=await api('/api/s4/assignment-queue')
      setQueue(q.items||[])
      if(canConfigure){
        const cfg=await api('/api/s4/assignment-rules')
        setD(cfg)
      }else{
        const opts=await api('/api/s4/lead-options')
        const users=(opts.users||[]).filter(x=>!user?.group_name||x.group_name===user.group_name)
        setD({items:[],users,groups:[]})
      }
    }catch(e){setM(msg(e))}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[canConfigure,user?.group_name])

  async function assign(id){
    const uid=Number(sel[id])
    if(!uid)return setM('Hãy chọn người nhận Lead.')
    try{
      setM((await api(`/api/s4/leads/${id}/assign`,{method:'POST',body:JSON.stringify({user_id:uid})})).message)
      setSel(x=>({...x,[id]:''}))
      await load()
    }catch(e){setM(msg(e))}
  }
  async function checkSla(){
    try{setM((await api('/api/s4/leads/check-sla',{method:'POST'})).message);await load()}catch(e){setM(msg(e))}
  }
  function add(){
    if(!canConfigure)return
    setD(x=>({...x,items:[...x.items,{name:'Quy tắc mới',priority:x.items.length+1,region:'',industry:'',mode:'round_robin',business_group_id:'',fixed_user_id:'',member_ids:[],is_active:true}]}))
  }
  function upd(n,k,v){setD(x=>({...x,items:x.items.map((r,i)=>i===n?{...r,[k]:v}:r)}))}
  async function save(){
    if(!canConfigure)return
    try{
      const rules=d.items.map((r,i)=>({name:r.name,priority:Number(r.priority)||i+1,region:r.region||null,industry:r.industry||null,mode:r.mode,business_group_id:r.business_group_id?Number(r.business_group_id):null,fixed_user_id:r.fixed_user_id?Number(r.fixed_user_id):null,member_ids:(r.member_ids||[]).map(Number),is_active:r.is_active!==false}))
      setM((await api('/api/s4/assignment-rules',{method:'PUT',body:JSON.stringify({rules})})).message)
      await load()
    }catch(e){setM(msg(e))}
  }

  return <div className="s4-page">
    <div className="s4-hero"><div>
      
      <h1>{canConfigure?'Quy tắc phân bổ Lead':'Hàng chờ phân bổ Lead'}</h1>
      <p>{canConfigure?'Ưu tiên từ trên xuống; quy tắc đầu tiên khớp sẽ thắng. Lead không khớp sẽ vào hàng chờ để trưởng nhóm phân tay.':'Lead không khớp quy tắc tự động sẽ xuất hiện tại đây. Bạn chỉ có thể phân Lead cho thành viên thuộc nhóm của mình và theo dõi SLA phản hồi.'}</p>
    </div></div>
    <Notice text={m} type={isErrorMessage(m)?'err':'ok'}/>

    {canConfigure&&<Card title="Danh sách quy tắc" icon={GitBranch} actions={<Btn kind="soft" onClick={add}><Plus size={15}/>Thêm quy tắc</Btn>}>
      {!d.items.length?<Empty text="Chưa có quy tắc phân bổ. Hãy tạo quy tắc đầu tiên."/>:<div className="s4-rule-list">{d.items.map((r,n)=><div className="s4-rule assignment" key={r.id||n}>
        <input value={r.name} onChange={e=>upd(n,'name',e.target.value)} placeholder="Tên quy tắc"/>
        <input type="number" min="1" value={r.priority} onChange={e=>upd(n,'priority',e.target.value)} title="Ưu tiên" aria-label="Thứ tự ưu tiên"/>
        <input value={r.region||''} onChange={e=>upd(n,'region',e.target.value)} placeholder="Khu vực (tùy chọn)"/>
        <input value={r.industry||''} onChange={e=>upd(n,'industry',e.target.value)} placeholder="Ngành nghề (tùy chọn)"/>
        <select value={r.mode} onChange={e=>upd(n,'mode',e.target.value)} aria-label="Cách phân bổ"><option value="round_robin">Xoay vòng</option><option value="fixed">Cố định</option></select>
        {r.mode==='fixed'?<select value={r.fixed_user_id||''} onChange={e=>upd(n,'fixed_user_id',e.target.value)} aria-label="Nhân viên cố định"><option value="">Chọn nhân viên</option>{d.users.map(u=><option key={u.id} value={u.id}>{u.full_name}{u.group_name?` · ${u.group_name}`:''}</option>)}</select>:<select value={r.business_group_id||''} onChange={e=>upd(n,'business_group_id',e.target.value)} aria-label="Nhóm xoay vòng"><option value="">Chọn nhóm</option>{d.groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select>}
        <button type="button" aria-label={`Xóa quy tắc ${r.name}`} onClick={()=>setD(x=>({...x,items:x.items.filter((_,i)=>i!==n)}))}><Trash2 size={16}/></button>
      </div>)}</div>}
      <div className="s4-actions"><Btn onClick={save}><Save size={16}/>Lưu quy tắc</Btn><Btn kind="soft" onClick={checkSla}><Clock3 size={15}/>Kiểm tra SLA</Btn></div>
    </Card>}

    <Card title="Hàng chờ phân bổ thủ công" subtitle={isTeamLeader?(user?.group_name?`Chỉ được phân cho thành viên của ${user.group_name}.`:'Bạn cần được gán nhóm kinh doanh trước khi phân Lead.'):'Lead không khớp quy tắc nào sẽ rơi vào đây để trưởng nhóm phân tay.'} icon={Users} actions={!canConfigure?<Btn kind="soft" onClick={checkSla}><Clock3 size={15}/>Kiểm tra SLA</Btn>:null}>
      {loading?<Empty text="Đang tải hàng chờ..."/>:!queue.length?<Empty text="Không có Lead chờ phân bổ."/>:<><div className="s4-table-wrap"><table className="s4-table"><thead><tr><th>Lead</th><th>Ngành / Khu vực</th><th>Người nhận</th><th>Thao tác</th></tr></thead><tbody>{queue.slice((queuePage-1)*7,queuePage*7).map(x=><tr key={x.id}>
        <td><b>{x.full_name}</b><small>{x.company||'Chưa có công ty'}</small></td>
        <td>{x.industry||'Chưa xác định'} · {x.region||'Chưa xác định'}</td>
        <td><select value={sel[x.id]||''} onChange={e=>setSel(v=>({...v,[x.id]:e.target.value}))} aria-label={`Người nhận ${x.full_name}`}><option value="">Chọn nhân viên</option>{d.users.map(u=><option key={u.id} value={u.id}>{u.full_name}{u.group_name?` · ${u.group_name}`:''}</option>)}</select></td>
        <td><Btn kind="soft" disabled={!sel[x.id]} onClick={()=>assign(x.id)}>Phân công</Btn></td>
      </tr>)}</tbody></table></div>{queue.length>7&&<Pagination currentPage={queuePage} totalItems={queue.length} pageSize={7} onPageChange={setQueuePage}/>}</>}
    </Card>
  </div>
}

