import React, { useEffect, useState } from 'react'
import { api } from './api'
import {
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Upload,
  Download,
  Share2,
  UserCheck,
  History,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  RotateCcw,
  Sliders,
  Users
} from 'lucide-react'

const formatMoney = n => Number(n || 0).toLocaleString('vi-VN') + ' ₫'
const formatBytes = bytes => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
const dateOnly = d => new Date(d).toISOString().slice(0, 10)
const firstDay = (d, mode) => {
  const x = new Date(d)
  if (mode === 'month') x.setDate(1)
  if (mode === 'week') x.setDate(x.getDate() - (x.getDay() + 6) % 7)
  return x
}
const lastDay = (d, mode) => {
  const x = firstDay(d, mode)
  if (mode === 'month') x.setMonth(x.getMonth() + 1)
  else x.setDate(x.getDate() + (mode === 'week' ? 7 : 1))
  x.setDate(x.getDate() - 1)
  return x
}

export function OpportunityTools({ opportunity, onRefresh, user }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [documents, setDocuments] = useState([])
  const [members, setMembers] = useState('')
  const [transfer, setTransfer] = useState('')
  const [history, setHistory] = useState([])
  const [usersList, setUsersList] = useState([])

  const id = opportunity?.id

  const refresh = async () => {
    if (!id) return
    try {
      const [d, h] = await Promise.all([
        api(`/api/ep56/opportunities/${id}/documents`),
        api(`/api/ep56/opportunities/${id}/history`)
      ])
      setDocuments(d || [])
      setHistory(h || [])
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    refresh()
    api('/api/users')
      .then(res => setUsersList(res.items || res || []))
      .catch(() => {})
  }, [id])

  const save = async (path, body) => {
    try {
      await api(path, { method: 'POST', body: JSON.stringify(body) })
      setError('')
      setSuccess('Thao tác thành công!')
      setTimeout(() => setSuccess(''), 4000)
      await refresh()
      onRefresh?.()
    } catch (e) {
      setError(e.message)
    }
  }

  const upload = async e => {
    const files = [...e.target.files]
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        setError(`${file.name}: Vượt quá giới hạn 20MB`)
        continue
      }
      try {
        const f = new FormData()
        f.append('file', file)
        await api(`/api/ep56/opportunities/${id}/documents`, { method: 'POST', body: f })
        setError('')
        setSuccess(`Đã tải lên: ${file.name}`)
      } catch (err) {
        setError(err.message)
      }
    }
    await refresh()
    e.target.value = ''
  }

  const download = async d => {
    try {
      const token = sessionStorage.getItem('crm_token') || localStorage.getItem('crm_token')
      const base = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : ''
      const res = await fetch(`${base}/api/ep56/opportunities/${id}/documents/${d.id}`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (!res.ok) throw new Error('Không tải được tài liệu: ' + res.status)
      const url = URL.createObjectURL(await res.blob())
      const a = document.createElement('a')
      a.href = url
      a.download = d.name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 500)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1e293b', marginBottom: 12 }}>
        <Sliders size={18} color="#2563eb" /> Quản lý cơ hội nâng cao & Cộng tác
      </h4>

      {error && <div className="notice-bar danger" style={{ marginBottom: 12 }}><AlertCircle size={16} /><span>{error}</span></div>}
      {success && <div className="notice-bar success" style={{ marginBottom: 12 }}><CheckCircle2 size={16} /><span>{success}</span></div>}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          type="button"
          className="secondary small-btn"
          onClick={() => {
            const reason = prompt('Nhập lý do mở lại cơ hội (Bắt buộc cho Quản lý):')
            if (reason) save(`/api/ep56/opportunities/${id}/reopen?reason=${encodeURIComponent(reason)}`, {})
          }}
        >
          <RotateCcw size={14} style={{ marginRight: 4 }} /> Mở lại cơ hội (Quản lý)
        </button>
        <button
          type="button"
          className="secondary small-btn"
          onClick={() => {
            const stage = prompt('Nhập tên giai đoạn đích:')
            const reason = prompt('Nhập lý do ghi đè điều kiện tiên quyết (Bắt buộc):')
            if (stage && reason) save(`/api/ep56/opportunities/${id}/stage`, { stage, override: true, reason })
          }}
        >
          <AlertCircle size={14} style={{ marginRight: 4 }} /> Chuyển giai đoạn ghi đè
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginBottom: 16 }}>
        {/* Chia sẻ cơ hội */}
        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Share2 size={15} color="#2563eb" /> Chia sẻ cơ hội với đồng nghiệp
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
              value={members}
              onChange={e => setMembers(e.target.value)}
            >
              <option value="">-- Chọn thành viên nhận chia sẻ --</option>
              {usersList.map(u => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.email})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="primary small-btn"
              disabled={!members}
              onClick={() => {
                save(`/api/ep56/opportunities/${id}/members`, { user_ids: [Number(members)] })
                setMembers('')
              }}
            >
              Chia sẻ
            </button>
          </div>
          <small style={{ color: '#64748b', display: 'block', marginTop: 4 }}>
            Thành viên được chia sẻ có quyền xem và tải tài liệu.
          </small>
        </div>

        {/* Chuyển chủ sở hữu */}
        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <UserCheck size={15} color="#059669" /> Bàn giao / Chuyển chủ sở hữu
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
              value={transfer}
              onChange={e => setTransfer(e.target.value)}
            >
              <option value="">-- Chọn người nhận mới --</option>
              {usersList.map(u => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.email})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="secondary small-btn"
              disabled={!transfer}
              onClick={() => {
                const reason = prompt('Nhập lý do chuyển chủ sở hữu:')
                if (reason && Number(transfer)) {
                  save('/api/ep56/transfer', {
                    opportunity_ids: [id],
                    to_user_id: Number(transfer),
                    reason
                  })
                  setTransfer('')
                }
              }}
            >
              Chuyển quyền
            </button>
          </div>
          <small style={{ color: '#64748b', display: 'block', marginTop: 4 }}>
            Lưu lại vết người chuyển, người nhận và lý do trong nhật ký.
          </small>
        </div>
      </div>

      {/* Tài liệu đính kèm */}
      <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Upload size={16} color="#2563eb" /> Tài liệu đính kèm ({documents.length})
          </h5>
          <label className="primary small-btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Upload size={14} /> Thêm tài liệu
            <input type="file" multiple onChange={upload} style={{ display: 'none' }} />
          </label>
        </div>
        <small style={{ color: '#64748b', display: 'block', marginBottom: 10 }}>
          Hỗ trợ nhiều tệp đính kèm (hợp đồng, đề xuất, biên bản). Tối đa 20MB/tệp.
        </small>
        {documents.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0, fontSize: 13 }}>Chưa có tài liệu nào được tải lên cho cơ hội này.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {documents.map(d => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} color="#64748b" />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>({formatBytes(d.file_size)})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {d.uploaded_by} · {String(d.created_at || '').slice(0, 16).replace('T', ' ')}
                  </span>
                  <button type="button" className="secondary small-btn" onClick={() => download(d)} style={{ padding: '3px 8px' }}>
                    <Download size={13} style={{ marginRight: 4 }} /> Tải về
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lịch sử thay đổi */}
      <details style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <History size={16} color="#2563eb" /> Lịch sử kiểm toán & thay đổi chi tiết ({history.length} bản ghi)
        </summary>
        <div style={{ marginTop: 10, maxHeight: 220, overflowY: 'auto' }}>
          {history.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '8px 0' }}>Chưa có thay đổi nào.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: '1.8' }}>
              {history.map(h => (
                <li key={h.id}>
                  <b>{h.field}</b>: <span style={{ color: '#dc2626' }}>{h.old_value || '—'}</span> → <span style={{ color: '#16a34a' }}>{h.new_value || '—'}</span> · <small style={{ color: '#64748b' }}>bởi {h.actor_name} lúc {String(h.created_at || '').slice(0, 16).replace('T', ' ')}</small>
                  {h.reason && <span style={{ color: '#475569', fontStyle: 'italic' }}> — Lý do: {h.reason}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </div>
  )
}

export function SavedOpportunityFilters({ onApply }) {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [stage, setStage] = useState('')
  const [owner, setOwner] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [error, setError] = useState('')

  const load = () =>
    api('/api/ep56/filters')
      .then(setItems)
      .catch(e => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const criteria = () => ({ stage, owner_id: owner, min_value: min, max_value: max })

  const apply = c => onApply(Object.fromEntries(Object.entries(c).filter(([, v]) => v !== '' && v != null)))

  return (
    <div className="panel" style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, border: '1px solid #e2e8f0' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px 0', color: '#1e293b' }}>
        <Filter size={18} color="#2563eb" /> Tìm kiếm & Bộ lọc cơ hội nâng cao
      </h4>
      {error && <p role="alert" style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <input
          placeholder="Giai đoạn"
          value={stage}
          onChange={e => setStage(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 140 }}
        />
        <input
          placeholder="ID chủ sở hữu"
          value={owner}
          type="number"
          onChange={e => setOwner(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 130 }}
        />
        <input
          placeholder="Giá trị từ (₫)"
          type="number"
          value={min}
          onChange={e => setMin(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 140 }}
        />
        <input
          placeholder="Giá trị đến (₫)"
          type="number"
          value={max}
          onChange={e => setMax(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 140 }}
        />
        <button type="button" className="primary small-btn" onClick={() => apply(criteria())}>
          <Search size={14} style={{ marginRight: 4 }} /> Áp dụng lọc
        </button>
        <button
          type="button"
          className="secondary small-btn"
          onClick={() => {
            setStage('')
            setOwner('')
            setMin('')
            setMax('')
            apply({})
          }}
        >
          Xóa lọc
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
        <input
          placeholder="Tên bộ lọc để lưu..."
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', width: 200 }}
        />
        <button
          type="button"
          className="secondary small-btn"
          onClick={async () => {
            if (!name.trim()) return
            try {
              await api('/api/ep56/filters', { method: 'POST', body: JSON.stringify({ name, criteria: criteria() }) })
              setName('')
              load()
            } catch (e) {
              setError(e.message)
            }
          }}
        >
          Lưu bộ lọc này
        </button>
        <select
          defaultValue=""
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', maxWidth: 220 }}
          onChange={e => {
            const f = items.find(i => String(i.id) === e.target.value)
            if (f) apply(typeof f.criteria === 'string' ? JSON.parse(f.criteria) : f.criteria)
          }}
        >
          <option value="">-- Chọn bộ lọc đã lưu ({items.length}) --</option>
          {items.map(i => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function CalendarPanel() {
  const [date, setDate] = useState(dateOnly(new Date()))
  const [mode, setMode] = useState('week')
  const [team, setTeam] = useState(false)
  const [data, setData] = useState({ tasks: [], meetings: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    const d = new Date(date + 'T12:00:00')
    const q = `start=${dateOnly(firstDay(d, mode))}&end=${dateOnly(lastDay(d, mode))}&team=${team}`
    api('/api/ep56/calendar?' + q)
      .then(setData)
      .then(() => setError(''))
      .catch(e => setError(e.message))
  }, [date, mode, team])

  return (
    <div className="panel" style={{ background: '#fff', borderRadius: 10, padding: 18, marginTop: 16, border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarIcon size={20} color="#2563eb" /> Lịch làm việc & Hoạt động
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <option value="day">Theo Ngày</option>
            <option value="week">Theo Tuần</option>
            <option value="month">Theo Tháng</option>
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
            <input type="checkbox" checked={team} onChange={e => setTeam(e.target.checked)} />
            <Users size={15} color="#059669" /> Lịch nhóm (Trưởng nhóm/Giám đốc)
          </label>
        </div>
      </div>

      {error && <p role="alert" style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Công việc đến hạn */}
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} color="#d97706" /> Công việc đến hạn ({data.tasks?.length || 0})
          </h4>
          {(!data.tasks || data.tasks.length === 0) ? (
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Không có công việc nào trong khoảng thời gian này.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.tasks.map(t => (
                <div key={t.id} style={{ padding: '8px 10px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>{t.title}</b>
                    <span className={`badge ${t.status === 'done' ? 'badge-success' : t.status === 'postponed' ? 'badge-warning' : 'badge-info'}`}>
                      {t.status === 'done' ? 'Hoàn thành' : t.status === 'postponed' ? 'Đã hoãn' : 'Đang mở'}
                    </span>
                  </div>
                  <small style={{ color: '#64748b' }}>Hạn: {String(t.due_at || '').slice(0, 16).replace('T', ' ')} · Mức độ: {t.priority}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cuộc gặp / Lịch hẹn */}
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarIcon size={16} color="#2563eb" /> Cuộc gặp đã xếp lịch ({data.meetings?.length || 0})
          </h4>
          {(!data.meetings || data.meetings.length === 0) ? (
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Không có cuộc gặp nào trong khoảng thời gian này.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.meetings.map(a => (
                <div key={a.id} style={{ padding: '8px 10px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <b>{a.subject}</b>
                  <div style={{ color: '#64748b', fontSize: 12 }}>Bắt đầu: {String(a.started_at || '').slice(0, 16).replace('T', ' ')} ({a.duration_minutes || 0} phút)</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function RemindersPanel() {
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/api/ep56/reminders')
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  return (
    <div className="panel" style={{ background: '#fff', borderRadius: 10, padding: 18, marginTop: 16, border: '1px solid #e2e8f0' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px 0', color: '#1e293b' }}>
        <Clock size={18} color="#ef4444" /> Nhắc việc: Sắp đến hạn & Quá hạn ({data.length})
      </h4>
      {error && <p role="alert" style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}
      {data.length === 0 ? (
        <p style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 6, margin: 0, fontSize: 13 }}>
          <CheckCircle2 size={16} /> Tuyệt vời! Bạn không có công việc nào sắp đến hạn hoặc bị quá hạn.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {data.map(t => {
            const isOverdue = new Date(t.due_at) < new Date()
            return (
              <div
                key={t.id}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${isOverdue ? '#fecaca' : '#fed7aa'}`,
                  background: isOverdue ? '#fef2f2' : '#fffbeb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ fontSize: 13, color: isOverdue ? '#991b1b' : '#9a3412' }}>{t.title}</b>
                  <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-warning'}`}>
                    {isOverdue ? 'QUÁ HẠN' : 'SẮP HẠN'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Hạn: {String(t.due_at || '').slice(0, 16).replace('T', ' ')} · Ưu tiên: {t.priority}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function QuickCallPanel() {
  const [customers, setCustomers] = useState([])
  const [customer, setCustomer] = useState('')
  const [result, setResult] = useState('Đã liên hệ')
  const [note, setNote] = useState('')
  const [callback, setCallback] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    api('/api/customers')
      .then(res => setCustomers(res.items || res || []))
      .catch(() => {})
  }, [])

  const submit = async () => {
    try {
      const p = new URLSearchParams({ customer_id: customer, result, note })
      if (callback) p.set('callback_at', new Date(callback).toISOString())
      await api('/api/ep56/quick-call?' + p, { method: 'POST' })
      setStatus('Đã ghi nhận cuộc gọi và liên kết cơ hội thành công!')
      setNote('')
      setCallback('')
      setTimeout(() => setStatus(''), 4000)
    } catch (e) {
      setStatus('Lỗi: ' + e.message)
    }
  }

  return (
    <div className="panel" style={{ background: '#fff', borderRadius: 10, padding: 18, marginTop: 16, border: '1px solid #e2e8f0' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px 0', color: '#1e293b' }}>
        <Phone size={18} color="#059669" /> Ghi cuộc gọi nhanh (3 thao tác chạm)
      </h4>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px 0' }}>
        Tự động liên kết vào cơ hội bán hàng đang mở gần nhất của khách hàng và tự động lên lịch nhắc gọi lại nếu cần.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={customer}
          onChange={e => setCustomer(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 200 }}
        >
          <option value="">-- Chọn khách hàng --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.phone ? `(${c.phone})` : ''}
            </option>
          ))}
        </select>

        <select
          value={result}
          onChange={e => setResult(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1' }}
        >
          <option>Đã liên hệ</option>
          <option>Không nghe máy</option>
          <option>Cần gọi lại</option>
          <option>Quan tâm</option>
        </select>

        <input
          placeholder="Nội dung tóm tắt cuộc gọi..."
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', flex: 1, minWidth: 180 }}
        />

        <label style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Gọi lại:
          <input
            type="datetime-local"
            value={callback}
            onChange={e => setCallback(e.target.value)}
            style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
          />
        </label>

        <button type="button" className="primary small-btn" disabled={!customer} onClick={submit}>
          <Phone size={14} style={{ marginRight: 4 }} /> Lưu cuộc gọi
        </button>
      </div>
      {status && (
        <div style={{ marginTop: 8, fontSize: 13, color: status.startsWith('Lỗi') ? '#dc2626' : '#16a34a', fontWeight: 500 }}>
          {status}
        </div>
      )}
    </div>
  )
}

export function CustomerTimelinePanel() {
  const [customers, setCustomers] = useState([])
  const [cid, setCid] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api('/api/customers')
      .then(res => setCustomers(res.items || res || []))
      .catch(() => {})
  }, [])

  const loadTimeline = async () => {
    if (!cid) return
    setLoading(true)
    try {
      const r = await api(`/api/ep56/customers/${Number(cid)}/timeline`)
      setItems(r.items || [])
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel" style={{ background: '#fff', borderRadius: 10, padding: 18, marginTop: 16, border: '1px solid #e2e8f0' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px 0', color: '#1e293b' }}>
        <History size={18} color="#2563eb" /> Dòng thời gian tương tác khách hàng (Timeline)
      </h4>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px 0' }}>
        Hợp nhất mọi hoạt động (cuộc gọi, cuộc gặp, email, ghi chú) và lịch sử biến động cơ hội bán hàng theo trục thời gian.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <select
          value={cid}
          onChange={e => setCid(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 240 }}
        >
          <option value="">-- Chọn khách hàng cần xem dòng thời gian --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} (#{c.id})
            </option>
          ))}
        </select>
        <button type="button" className="primary small-btn" disabled={!cid || loading} onClick={loadTimeline}>
          <Search size={14} style={{ marginRight: 4 }} /> {loading ? 'Đang tải...' : 'Xem lịch sử'}
        </button>
      </div>

      {error && <p role="alert" style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}

      {items.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, fontStyle: 'italic' }}>
          Chọn một khách hàng và nhấn "Xem lịch sử" để tra cứu.
        </p>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid #e2e8f0', marginLeft: 8 }}>
          {items.map((item, i) => {
            const isActivity = item.type === 'activity'
            return (
              <div key={i} style={{ marginBottom: 14, position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: -27,
                    top: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: isActivity ? '#2563eb' : '#059669'
                  }}
                />
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {item.at.slice(0, 16).replace('T', ' ')} ·{' '}
                  <span className={`badge ${isActivity ? 'badge-info' : 'badge-success'}`}>
                    {isActivity ? (item.data.activity_type || 'Hoạt động') : 'Biến động cơ hội'}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                  {isActivity
                    ? `${item.data.subject || 'Hoạt động'} - Kết quả: ${item.data.result || 'Chưa ghi'}`
                    : `Thay đổi trường [${item.data.field}]: ${item.data.old_value || '—'} → ${item.data.new_value || '—'}`}
                </div>
                {item.data.actor_name && (
                  <small style={{ color: '#94a3b8' }}>Thực hiện bởi: {item.data.actor_name}</small>
                )}
                {item.data.opportunity_title && (
                  <small style={{ color: '#64748b', display: 'block' }}>Cơ hội: {item.data.opportunity_title}</small>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
