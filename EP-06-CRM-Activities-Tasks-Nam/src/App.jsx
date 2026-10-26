import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  completeTask,
  createActivity,
  createTask,
  fetchActivities,
  fetchCustomers,
  fetchTasks,
  fetchUsers,
  getStoredUser,
  getToken,
  login,
  logout,
  postponeTask,
} from './api'

function App() {
  const [page, setPage] = useState('activities')
  const [activities, setActivities] = useState([])
  const [tasks, setTasks] = useState([])
  const [customers, setCustomers] = useState([])
  const [users, setUsers] = useState([])

  const [token, setTokenState] = useState(() => getToken())
  const [currentUser, setCurrentUserState] = useState(() => getStoredUser())

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')

  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [delayTask, setDelayTask] = useState(null)
  const [delayNewDue, setDelayNewDue] = useState('')
  const [delayReason, setDelayReason] = useState('')

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: 'quantri', password: '123456' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [activityForm, setActivityForm] = useState({
    activity_type: 'call',
    customer_id: '',
    occurred_at: '',
    duration_minutes: 15,
    subject: '',
    content: '',
    outcome: '',
  })

  const [taskForm, setTaskForm] = useState({
    title: '',
    customer_id: '',
    due_date: '',
    priority: 'medium',
    assignee_id: '',
    description: '',
  })

  // Tải toàn bộ dữ liệu từ Backend API
  const loadAllData = useCallback(async () => {
    if (!getToken()) {
      setShowLoginModal(true)
      return
    }
    setLoading(true)
    setError('')
    try {
      const [actList, tskList, custList, usrList] = await Promise.all([
        fetchActivities().catch(err => {
          if (err.status === 401) throw err
          console.warn('Lỗi tải activities:', err)
          return []
        }),
        fetchTasks('all').catch(err => {
          if (err.status === 401) throw err
          console.warn('Lỗi tải tasks:', err)
          return []
        }),
        fetchCustomers().catch(err => {
          if (err.status === 401) throw err
          console.warn('Lỗi tải customers:', err)
          return []
        }),
        fetchUsers().catch(err => {
          if (err.status === 401) throw err
          console.warn('Lỗi tải users:', err)
          return []
        }),
      ])
      setActivities(actList)
      setTasks(tskList)
      setCustomers(custList)
      setUsers(usrList)
    } catch (err) {
      if (err.status === 401) {
        setTokenState('')
        setCurrentUserState(null)
        setShowLoginModal(true)
        setError('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.')
      } else {
        setError(err.message || 'Lỗi khi kết nối đến API backend.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Tự động kiểm tra token hoặc tự đăng nhập tài khoản kiểm thử nếu chưa có token
    async function initAuth() {
      const existingToken = getToken()
      if (!existingToken) {
        try {
          const authRes = await login('quantri', '123456')
          setTokenState(authRes.access_token)
          setCurrentUserState(authRes.user)
          setShowLoginModal(false)
          loadAllData()
        } catch {
          setShowLoginModal(true)
        }
      } else {
        loadAllData()
      }
    }
    initAuth()
  }, [loadAllData])

  async function handleLogin(e) {
    if (e) e.preventDefault()
    setLoginLoading(true)
    setError('')
    try {
      const res = await login(loginForm.username, loginForm.password)
      setTokenState(res.access_token)
      setCurrentUserState(res.user)
      setShowLoginModal(false)
      setNotice(`Đăng nhập thành công với tài khoản ${res.user?.full_name || res.user?.username}.`)
      loadAllData()
    } catch (err) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.')
    } finally {
      setLoginLoading(false)
    }
  }

  function handleLogout() {
    logout()
    setTokenState('')
    setCurrentUserState(null)
    setActivities([])
    setTasks([])
    setShowLoginModal(true)
    setNotice('Đã đăng xuất khỏi hệ thống.')
  }

  // Thêm hoạt động (POST /api/activities)
  async function handleAddActivity(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        activity_type: activityForm.activity_type,
        customer_id: activityForm.customer_id ? Number(activityForm.customer_id) : undefined,
        subject: activityForm.subject || undefined,
        content: activityForm.content,
        outcome: activityForm.outcome || undefined,
        duration_minutes: Number(activityForm.duration_minutes) || 15,
        occurred_at: activityForm.occurred_at ? new Date(activityForm.occurred_at).toISOString().replace('.000Z', '') : undefined,
      }
      const res = await createActivity(payload)
      setNotice(res.message || 'Đã thêm hoạt động thành công vào cơ sở dữ liệu.')
      setShowActivityForm(false)
      setActivityForm({
        activity_type: 'call',
        customer_id: '',
        occurred_at: '',
        duration_minutes: 15,
        subject: '',
        content: '',
        outcome: '',
      })
      await loadAllData()
    } catch (err) {
      setError(err.message || 'Không thể tạo hoạt động. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSubmitting(false)
    }
  }

  // Thêm công việc (POST /api/tasks)
  async function handleAddTask(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        title: taskForm.title,
        due_date: taskForm.due_date,
        priority: taskForm.priority,
        customer_id: taskForm.customer_id ? Number(taskForm.customer_id) : undefined,
        assignee_id: taskForm.assignee_id ? Number(taskForm.assignee_id) : (currentUser?.id || undefined),
        description: taskForm.description || undefined,
      }
      const res = await createTask(payload)
      setNotice(res.message || 'Đã tạo công việc thành công trong cơ sở dữ liệu.')
      setShowTaskForm(false)
      setTaskForm({
        title: '',
        customer_id: '',
        due_date: '',
        priority: 'medium',
        assignee_id: '',
        description: '',
      })
      await loadAllData()
    } catch (err) {
      setError(err.message || 'Không thể tạo công việc. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSubmitting(false)
    }
  }

  // Hoàn thành công việc (POST /api/tasks/:id/complete)
  async function handleCompleteTask(taskId) {
    setError('')
    try {
      const res = await completeTask(taskId, 'Hoàn thành từ giao diện CRM')
      setNotice(res.message || 'Đã cập nhật công việc hoàn thành trong cơ sở dữ liệu.')
      await loadAllData()
    } catch (err) {
      setError(err.message || 'Không thể hoàn thành công việc.')
    }
  }

  // Mở modal hoãn công việc
  function openPostponeModal(task) {
    setDelayTask(task)
    setDelayReason('')
    // Đặt hạn mới mặc định là ngày mai hoặc sau ngày hạn hiện tại
    const currentDue = task.due_date ? new Date(task.due_date) : new Date()
    currentDue.setDate(currentDue.getDate() + 1)
    const yyyy = currentDue.getFullYear()
    const mm = String(currentDue.getMonth() + 1).padStart(2, '0')
    const dd = String(currentDue.getDate()).padStart(2, '0')
    setDelayNewDue(`${yyyy}-${mm}-${dd}`)
  }

  // Hoãn công việc (POST /api/tasks/:id/postpone)
  async function handlePostponeTask(event) {
    event.preventDefault()
    if (!delayTask) return
    setSubmitting(true)
    setError('')
    try {
      const res = await postponeTask(delayTask.id, delayNewDue, delayReason)
      setNotice(res.message || 'Đã ghi nhận lý do hoãn công việc vào cơ sở dữ liệu.')
      setDelayTask(null)
      setDelayReason('')
      setDelayNewDue('')
      await loadAllData()
    } catch (err) {
      setError(err.message || 'Không thể hoãn công việc.')
    } finally {
      setSubmitting(false)
    }
  }

  // Lọc hoạt động theo từ khoá
  const filteredActivities = useMemo(() => {
    return activities.filter(item => {
      const searchTarget = `${item.customer?.name || ''} ${item.contact?.full_name || ''} ${item.activity_type_label || item.activity_type || ''} ${item.content || ''} ${item.subject || ''}`.toLowerCase()
      return searchTarget.includes(search.toLowerCase())
    })
  }, [activities, search])

  // Lọc công việc theo từ khoá
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchTarget = `${task.title || ''} ${task.customer?.name || ''} ${task.assignee?.full_name || ''} ${task.status_label || task.status || ''}`.toLowerCase()
      return searchTarget.includes(search.toLowerCase())
    })
  }, [tasks, search])

  const doneTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'done').length
  }, [tasks])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>CRM Portal</h2>
            <span>EP-06 · Quản lý khách hàng</span>
          </div>
        </div>

        <p className="nav-label">KHÔNG GIAN LÀM VIỆC</p>

        <button
          className={`nav-item ${page === 'activities' ? 'active' : ''}`}
          onClick={() => {
            setPage('activities')
            setSearch('')
          }}
        >
          <span>◷</span> Hoạt động khách hàng
        </button>

        <button
          className={`nav-item ${page === 'tasks' ? 'active' : ''}`}
          onClick={() => {
            setPage('tasks')
            setSearch('')
          }}
        >
          <span>▤</span> Quản lý công việc
        </button>

        <div className="sidebar-bottom">
          <div className="avatar">{currentUser?.full_name?.charAt(0) || 'N'}</div>
          <div>
            <strong>{currentUser?.full_name || 'Người dùng CRM'}</strong>
            <span>{currentUser?.role_label || currentUser?.role || 'Nhân viên'}</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">CRM / EP-06</span>
            <h1>
              {page === 'activities'
                ? 'Hoạt động khách hàng'
                : 'Quản lý công việc'}
            </h1>
          </div>
          <div className="user-chip" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="avatar small">{currentUser?.full_name?.charAt(0) || 'U'}</div>
            <span>{currentUser?.full_name || 'Chưa đăng nhập'}</span>
            {token ? (
              <button
                type="button"
                className="secondary-btn"
                style={{ padding: '4px 8px', fontSize: '12px', marginLeft: '8px' }}
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            ) : (
              <button
                type="button"
                className="primary-btn"
                style={{ padding: '4px 8px', fontSize: '12px', marginLeft: '8px' }}
                onClick={() => setShowLoginModal(true)}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <h2>
                {page === 'activities'
                  ? 'Theo dõi lịch sử trao đổi'
                  : 'Theo dõi tiến độ công việc'}
              </h2>
              <p>
                {page === 'activities'
                  ? 'Dữ liệu kết nối trực tiếp với Backend REST API và lưu trữ vào cơ sở dữ liệu SQLite test.'
                  : 'Quản lý hạn hoàn thành, mức ưu tiên, người thực hiện và lịch sử hoãn công việc.'}
              </p>
            </div>
            <div className="welcome-icon">
              {page === 'activities' ? '☎' : '✓'}
            </div>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span>Tổng hoạt động</span>
              <strong>{activities.length}</strong>
              <small>Lịch sử ghi nhận từ API</small>
            </div>
            <div className="stat-card">
              <span>Tổng công việc</span>
              <strong>{tasks.length}</strong>
              <small>Công việc từ Backend</small>
            </div>
            <div className="stat-card">
              <span>Đã hoàn thành</span>
              <strong>{doneTasks}</strong>
              <small>Trên tổng số {tasks.length} công việc</small>
            </div>
          </div>

          {error && (
            <div className="notice" style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b' }}>
              <span>⚠️ {error}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={loadAllData} style={{ fontWeight: 'bold' }}>Thử lại</button>
                <button type="button" onClick={() => setError('')}>Đóng</button>
              </div>
            </div>
          )}

          {notice && (
            <div className="notice">
              <span>✓ {notice}</span>
              <button type="button" onClick={() => setNotice('')}>Đóng</button>
            </div>
          )}

          <section className="panel">
            <div className="panel-toolbar">
              <div>
                <h2>
                  {page === 'activities'
                    ? 'Danh sách hoạt động'
                    : 'Danh sách công việc'}
                </h2>
                <p>
                  {loading
                    ? 'Đang tải dữ liệu từ máy chủ...'
                    : page === 'activities'
                      ? `${filteredActivities.length} hoạt động thực tế`
                      : `${filteredTasks.length} công việc thực tế`}
                </p>
              </div>

              <div className="toolbar-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  title="Tải lại dữ liệu từ Backend"
                  onClick={loadAllData}
                  disabled={loading}
                >
                  {loading ? 'Đang tải...' : '⟳ Làm mới'}
                </button>
                <input
                  className="search"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    setShowActivityForm(page === 'activities')
                    setShowTaskForm(page === 'tasks')
                  }}
                >
                  + {page === 'activities' ? 'Thêm hoạt động' : 'Tạo công việc'}
                </button>
              </div>
            </div>

            {page === 'activities' ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Loại hoạt động</th>
                      <th>Khách hàng / Liên hệ</th>
                      <th>Thời gian</th>
                      <th>Nội dung</th>
                      <th>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map(item => (
                      <tr key={item.id}>
                        <td>
                          <span className="type-badge">
                            {item.activity_type_label || item.activity_type}
                          </span>
                        </td>
                        <td>
                          <strong>{item.customer?.name || 'Khách hàng #' + item.customer_id}</strong>
                          {item.contact && (
                            <small className="subtext">{item.contact.full_name}</small>
                          )}
                        </td>
                        <td>
                          {item.occurred_at_display || (item.occurred_at ? new Date(item.occurred_at).toLocaleString('vi-VN') : 'Chưa nhập')}
                          <small className="subtext">{item.duration_minutes || 0} phút</small>
                        </td>
                        <td>
                          {item.subject && <div><strong>{item.subject}</strong></div>}
                          {item.content}
                        </td>
                        <td>
                          <span className="status done">{item.outcome || item.status_label || 'Đã ghi nhận'}</span>
                        </td>
                      </tr>
                    ))}
                    {filteredActivities.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="empty">
                          Không tìm thấy hoạt động phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tên công việc</th>
                      <th>Khách hàng</th>
                      <th>Hạn hoàn thành</th>
                      <th>Ưu tiên</th>
                      <th>Người thực hiện</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={task.id}>
                        <td><strong>{task.title}</strong></td>
                        <td>{task.customer?.name || 'Chưa liên kết'}</td>
                        <td>
                          {task.due_date_display || (task.due_date ? new Date(`${task.due_date}T00:00:00`).toLocaleDateString('vi-VN') : 'Chưa đặt hạn')}
                          {task.due_state_label && task.status !== 'done' && (
                            <small className="subtext" style={{ color: task.is_overdue ? '#ef4444' : '#64748b' }}>
                              {task.due_state_label}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={`priority ${(task.priority || 'medium').toLowerCase()}`}>
                            {task.priority_label || task.priority}
                          </span>
                        </td>
                        <td>{task.assignee?.full_name || 'Chưa phân công'}</td>
                        <td>
                          <span className={`status ${task.status === 'done' ? 'done' : task.postpone_count > 0 ? 'delayed' : 'pending'}`}>
                            {task.status === 'done' ? 'Hoàn thành' : task.postpone_count > 0 ? `Hoãn (${task.postpone_count} lần)` : 'Chưa hoàn thành'}
                          </span>
                          {task.last_postpone_reason && (
                            <small className="subtext">Lý do: {task.last_postpone_reason}</small>
                          )}
                        </td>
                        <td>
                          {task.status !== 'done' && (
                            <div className="row-actions">
                              <button
                                type="button"
                                className="action-btn"
                                title="Đánh dấu hoàn thành"
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                className="action-btn"
                                title="Ghi lý do hoãn"
                                onClick={() => openPostponeModal(task)}
                              >
                                …
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredTasks.length === 0 && !loading && (
                      <tr>
                        <td colSpan="7" className="empty">
                          Không tìm thấy công việc phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Modal Thêm Hoạt Động (SCRUM-99) */}
          {showActivityForm && (
            <div className="modal-backdrop">
              <form className="modal" onSubmit={handleAddActivity}>
                <div className="modal-header">
                  <div>
                    <h2>Thêm hoạt động</h2>
                    <p>Ghi nhận tương tác với khách hàng vào API Backend</p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setShowActivityForm(false)}>×</button>
                </div>

                <div className="form-grid">
                  <label>
                    Loại hoạt động *
                    <select
                      required
                      value={activityForm.activity_type}
                      onChange={e => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                    >
                      <option value="call">Cuộc gọi</option>
                      <option value="meeting">Cuộc gặp</option>
                      <option value="email">Email</option>
                      <option value="note">Ghi chú</option>
                    </select>
                  </label>
                  <label>
                    Khách hàng *
                    <select
                      required
                      value={activityForm.customer_id}
                      onChange={e => setActivityForm({ ...activityForm, customer_id: e.target.value })}
                    >
                      <option value="">-- Chọn khách hàng --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Tiêu đề
                    <input
                      value={activityForm.subject}
                      onChange={e => setActivityForm({ ...activityForm, subject: e.target.value })}
                      placeholder="Tiêu đề trao đổi (tuỳ chọn)"
                    />
                  </label>
                  <label>
                    Thời điểm
                    <input
                      type="datetime-local"
                      value={activityForm.occurred_at}
                      onChange={e => setActivityForm({ ...activityForm, occurred_at: e.target.value })}
                    />
                  </label>
                  <label>
                    Thời lượng (phút)
                    <input
                      type="number"
                      min="0"
                      max="1440"
                      value={activityForm.duration_minutes}
                      onChange={e => setActivityForm({ ...activityForm, duration_minutes: e.target.value })}
                    />
                  </label>
                  <label>
                    Kết quả
                    <input
                      value={activityForm.outcome}
                      onChange={e => setActivityForm({ ...activityForm, outcome: e.target.value })}
                      placeholder="Kết quả trao đổi..."
                    />
                  </label>
                  <label className="full-width">
                    Nội dung trao đổi *
                    <textarea
                      required
                      rows="3"
                      value={activityForm.content}
                      onChange={e => setActivityForm({ ...activityForm, content: e.target.value })}
                      placeholder="Nhập nội dung chi tiết cuộc trao đổi..."
                    />
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setShowActivityForm(false)}>Hủy</button>
                  <button className="primary-btn" type="submit" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu hoạt động'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal Tạo Công Việc (SCRUM-100) */}
          {showTaskForm && (
            <div className="modal-backdrop">
              <form className="modal" onSubmit={handleAddTask}>
                <div className="modal-header">
                  <div>
                    <h2>Tạo công việc mới</h2>
                    <p>Thiết lập thông tin và người thực hiện</p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setShowTaskForm(false)}>×</button>
                </div>

                <div className="form-grid">
                  <label className="full-width">
                    Tiêu đề công việc *
                    <input
                      required
                      value={taskForm.title}
                      onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="Ví dụ: Gửi báo giá cho khách hàng"
                    />
                  </label>
                  <label>
                    Khách hàng
                    <select
                      value={taskForm.customer_id}
                      onChange={e => setTaskForm({ ...taskForm, customer_id: e.target.value })}
                    >
                      <option value="">-- Chưa liên kết --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Hạn hoàn thành *
                    <input
                      required
                      type="date"
                      value={taskForm.due_date}
                      onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    />
                  </label>
                  <label>
                    Mức ưu tiên
                    <select
                      value={taskForm.priority}
                      onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                    >
                      <option value="urgent">Khẩn cấp</option>
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </label>
                  <label>
                    Người thực hiện *
                    <select
                      required
                      value={taskForm.assignee_id}
                      onChange={e => setTaskForm({ ...taskForm, assignee_id: e.target.value })}
                    >
                      <option value="">-- Chọn thành viên --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.full_name} ({u.role_label || u.role})</option>
                      ))}
                    </select>
                  </label>
                  <label className="full-width">
                    Mô tả công việc
                    <textarea
                      rows="2"
                      value={taskForm.description}
                      onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                      placeholder="Mô tả chi tiết công việc..."
                    />
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setShowTaskForm(false)}>Hủy</button>
                  <button className="primary-btn" type="submit" disabled={submitting}>
                    {submitting ? 'Đang tạo...' : 'Tạo công việc'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal Hoãn Công Việc (SCRUM-100) */}
          {delayTask !== null && (
            <div className="modal-backdrop">
              <form className="modal small-modal" onSubmit={handlePostponeTask}>
                <div className="modal-header">
                  <div>
                    <h2>Hoãn công việc</h2>
                    <p>Công việc: &quot;{delayTask.title}&quot; (Hạn cũ: {delayTask.due_date})</p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setDelayTask(null)}>×</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0' }}>
                  <label>
                    Hạn mới (phải sau hạn cũ) *
                    <input
                      required
                      type="date"
                      value={delayNewDue}
                      onChange={e => setDelayNewDue(e.target.value)}
                    />
                  </label>
                  <label>
                    Lý do hoãn (tối thiểu 5 ký tự) *
                    <textarea
                      required
                      rows="3"
                      value={delayReason}
                      onChange={e => setDelayReason(e.target.value)}
                      placeholder="Nhập lý do hoãn chi tiết..."
                    />
                  </label>
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setDelayTask(null)}>Hủy</button>
                  <button type="submit" className="primary-btn" disabled={submitting}>
                    {submitting ? 'Đang xử lý...' : 'Lưu lý do hoãn'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal Đăng nhập / Chuyển tài khoản kiểm thử */}
          {showLoginModal && (
            <div className="modal-backdrop">
              <form className="modal small-modal" onSubmit={handleLogin}>
                <div className="modal-header">
                  <div>
                    <h2>Đăng nhập CRM Backend</h2>
                    <p>Kết nối tới API Backend (http://127.0.0.1:5000)</p>
                  </div>
                  {token && (
                    <button type="button" className="close-btn" onClick={() => setShowLoginModal(false)}>×</button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0' }}>
                  <label>
                    Tên đăng nhập
                    <input
                      required
                      value={loginForm.username}
                      onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder="Tên tài khoản..."
                    />
                  </label>
                  <label>
                    Mật khẩu
                    <input
                      required
                      type="password"
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Mật khẩu..."
                    />
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="secondary-btn"
                      style={{ fontSize: '11px', flex: 1 }}
                      onClick={() => setLoginForm({ username: 'quantri', password: '123456' })}
                    >
                      Quản trị (Admin)
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      style={{ fontSize: '11px', flex: 1 }}
                      onClick={() => setLoginForm({ username: 'nhanvien1', password: '123456' })}
                    >
                      Nhân viên kinh doanh
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  {token && (
                    <button type="button" className="secondary-btn" onClick={() => setShowLoginModal(false)}>Đóng</button>
                  )}
                  <button type="submit" className="primary-btn" disabled={loginLoading}>
                    {loginLoading ? 'Đang xác thực...' : 'Đăng nhập'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
