
import { useState } from 'react'
import './App.css'

const initialActivities = [
  {
    id: 1,
    type: 'Cuộc gọi',
    customer: 'Công ty Minh Anh',
    contact: 'Nguyễn Văn Minh',
    time: '2026-10-19T09:00',
    duration: 15,
    content: 'Trao đổi nhu cầu sử dụng sản phẩm',
    result: 'Khách hàng quan tâm',
    status: 'Đã hoàn thành',
  },
  {
    id: 2,
    type: 'Email',
    customer: 'Công ty Hoàng Gia',
    contact: 'Trần Thu Hà',
    time: '2026-10-19T10:30',
    duration: 10,
    content: 'Gửi thông tin và báo giá',
    result: 'Đã gửi báo giá',
    status: 'Đã hoàn thành',
  },
]

const initialTasks = [
  {
    id: 1,
    title: 'Gửi báo giá cho khách hàng Minh Anh',
    customer: 'Công ty Minh Anh',
    due: '2026-10-23',
    priority: 'Cao',
    assignee: 'Trần Phương Nam',
    status: 'Đang thực hiện',
    reason: '',
  },
  {
    id: 2,
    title: 'Gọi điện xác nhận nhu cầu',
    customer: 'Công ty Hoàng Gia',
    due: '2026-10-21',
    priority: 'Trung bình',
    assignee: 'Lê Thị Hiền',
    status: 'Chưa thực hiện',
    reason: '',
  },
]

function App() {
  const [page, setPage] = useState('activities')
  const [activities, setActivities] = useState(initialActivities)
  const [tasks, setTasks] = useState(initialTasks)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [delayTask, setDelayTask] = useState(null)
  const [delayReason, setDelayReason] = useState('')

  const [activityForm, setActivityForm] = useState({
    type: 'Cuộc gọi',
    customer: '',
    contact: '',
    time: '',
    duration: 15,
    content: '',
    result: '',
  })

  const [taskForm, setTaskForm] = useState({
    title: '',
    customer: '',
    due: '',
    priority: 'Trung bình',
    assignee: '',
  })

  function addActivity(event) {
    event.preventDefault()
    setActivities([
      {
        ...activityForm,
        id: Date.now(),
        duration: Number(activityForm.duration),
        status: 'Đã hoàn thành',
      },
      ...activities,
    ])
    setActivityForm({
      type: 'Cuộc gọi',
      customer: '',
      contact: '',
      time: '',
      duration: 15,
      content: '',
      result: '',
    })
    setShowActivityForm(false)
    setNotice('Đã thêm hoạt động thành công.')
  }

  function addTask(event) {
    event.preventDefault()
    setTasks([
      {
        ...taskForm,
        id: Date.now(),
        status: 'Chưa thực hiện',
        reason: '',
      },
      ...tasks,
    ])
    setTaskForm({
      title: '',
      customer: '',
      due: '',
      priority: 'Trung bình',
      assignee: '',
    })
    setShowTaskForm(false)
    setNotice('Đã tạo công việc thành công.')
  }

  function completeTask(id) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: 'Hoàn thành', reason: '' }
        : task
    ))
    setNotice('Đã cập nhật công việc hoàn thành.')
  }

  function postponeTask(event) {
    event.preventDefault()
    setTasks(tasks.map(task =>
      task.id === delayTask
        ? {
            ...task,
            status: 'Hoãn',
            reason: delayReason,
          }
        : task
    ))
    setDelayTask(null)
    setDelayReason('')
    setNotice('Đã ghi nhận lý do hoãn công việc.')
  }

  const filteredActivities = activities.filter(item =>
    `${item.customer} ${item.contact} ${item.type} ${item.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredTasks = tasks.filter(item =>
    `${item.title} ${item.customer} ${item.assignee} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const doneTasks = tasks.filter(task => task.status === 'Hoàn thành').length

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
          <div className="avatar">N</div>
          <div>
            <strong>Trần Phương Nam</strong>
            <span>Nhân viên kinh doanh</span>
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
          <div className="user-chip">
            <div className="avatar small">N</div>
            <span>Trần Phương Nam</span>
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
                  ? 'Lưu lại các tương tác với khách hàng tại một nơi.'
                  : 'Quản lý hạn hoàn thành, mức ưu tiên và người thực hiện.'}
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
              <small>Lịch sử đã ghi nhận</small>
            </div>
            <div className="stat-card">
              <span>Tổng công việc</span>
              <strong>{tasks.length}</strong>
              <small>Công việc được giao</small>
            </div>
            <div className="stat-card">
              <span>Đã hoàn thành</span>
              <strong>{doneTasks}</strong>
              <small>Trên tổng số công việc</small>
            </div>
          </div>

          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button onClick={() => setNotice('')}>Đóng</button>
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
                  {page === 'activities'
                    ? `${filteredActivities.length} hoạt động`
                    : `${filteredTasks.length} công việc`}
                </p>
              </div>

              <div className="toolbar-actions">
                <input
                  className="search"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
                <button
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
                          <span className="type-badge">{item.type}</span>
                        </td>
                        <td>
                          <strong>{item.customer}</strong>
                          <small className="subtext">{item.contact}</small>
                        </td>
                        <td>
                          {item.time
                            ? new Date(item.time).toLocaleString('vi-VN')
                            : 'Chưa nhập'}
                          <small className="subtext">{item.duration} phút</small>
                        </td>
                        <td>{item.content}</td>
                        <td>
                          <span className="status done">{item.result}</span>
                        </td>
                      </tr>
                    ))}
                    {filteredActivities.length === 0 && (
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
                        <td>{task.customer || 'Chưa liên kết'}</td>
                        <td>
                          {task.due
                            ? new Date(`${task.due}T00:00:00`).toLocaleDateString('vi-VN')
                            : 'Chưa đặt hạn'}
                        </td>
                        <td>
                          <span className={`priority ${task.priority.toLowerCase().replace(' ', '-')}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.assignee}</td>
                        <td>
                          <span className={`status ${task.status === 'Hoàn thành' ? 'done' : task.status === 'Hoãn' ? 'delayed' : 'pending'}`}>
                            {task.status}
                          </span>
                          {task.reason && (
                            <small className="subtext">Lý do: {task.reason}</small>
                          )}
                        </td>
                        <td>
                          {task.status !== 'Hoàn thành' && (
                            <div className="row-actions">
                              <button
                                className="action-btn"
                                title="Đánh dấu hoàn thành"
                                onClick={() => completeTask(task.id)}
                              >
                                ✓
                              </button>
                              <button
                                className="action-btn"
                                title="Ghi lý do hoãn"
                                onClick={() => {
                                  setDelayTask(task.id)
                                  setDelayReason(task.reason || '')
                                }}
                              >
                                …
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredTasks.length === 0 && (
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

          {showActivityForm && (
            <div className="modal-backdrop">
              <form className="modal" onSubmit={addActivity}>
                <div className="modal-header">
                  <div>
                    <h2>Thêm hoạt động</h2>
                    <p>Ghi nhận tương tác với khách hàng</p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setShowActivityForm(false)}>×</button>
                </div>

                <div className="form-grid">
                  <label>
                    Loại hoạt động *
                    <select required value={activityForm.type} onChange={e => setActivityForm({ ...activityForm, type: e.target.value })}>
                      <option>Cuộc gọi</option>
                      <option>Cuộc gặp</option>
                      <option>Email</option>
                      <option>Ghi chú</option>
                    </select>
                  </label>
                  <label>
                    Khách hàng *
                    <input required value={activityForm.customer} onChange={e => setActivityForm({ ...activityForm, customer: e.target.value })} placeholder="Tên khách hàng" />
                  </label>
                  <label>
                    Người liên hệ
                    <input value={activityForm.contact} onChange={e => setActivityForm({ ...activityForm, contact: e.target.value })} placeholder="Tên người liên hệ" />
                  </label>
                  <label>
                    Thời điểm *
                    <input required type="datetime-local" value={activityForm.time} onChange={e => setActivityForm({ ...activityForm, time: e.target.value })} />
                  </label>
                  <label>
                    Thời lượng (phút)
                    <input type="number" min="0" value={activityForm.duration} onChange={e => setActivityForm({ ...activityForm, duration: e.target.value })} />
                  </label>
                  <label>
                    Kết quả
                    <input value={activityForm.result} onChange={e => setActivityForm({ ...activityForm, result: e.target.value })} placeholder="Kết quả trao đổi" />
                  </label>
                  <label className="full-width">
                    Nội dung trao đổi *
                    <textarea required rows="3" value={activityForm.content} onChange={e => setActivityForm({ ...activityForm, content: e.target.value })} placeholder="Nhập nội dung..." />
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setShowActivityForm(false)}>Hủy</button>
                  <button className="primary-btn" type="submit">Lưu hoạt động</button>
                </div>
              </form>
            </div>
          )}

          {showTaskForm && (
            <div className="modal-backdrop">
              <form className="modal" onSubmit={addTask}>
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
                    <input required value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Ví dụ: Gửi báo giá cho khách hàng" />
                  </label>
                  <label>
                    Khách hàng / Cơ hội
                    <input value={taskForm.customer} onChange={e => setTaskForm({ ...taskForm, customer: e.target.value })} placeholder="Tên khách hàng hoặc cơ hội" />
                  </label>
                  <label>
                    Hạn hoàn thành *
                    <input required type="date" value={taskForm.due} onChange={e => setTaskForm({ ...taskForm, due: e.target.value })} />
                  </label>
                  <label>
                    Mức ưu tiên
                    <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} >
                      <option>Cao</option>
                      <option>Trung bình</option>
                      <option>Thấp</option>
                    </select>
                  </label>
                  <label>
                    Người thực hiện *
                    <select required value={taskForm.assignee} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })}>
                      <option value="">Chọn thành viên</option>
                      <option>Trần Phương Nam</option>
                      <option>Lê Thị Hiền</option>
                      <option>Nguyễn Văn An</option>
                    </select>
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setShowTaskForm(false)}>Hủy</button>
                  <button className="primary-btn" type="submit">Tạo công việc</button>
                </div>
              </form>
            </div>
          )}

          {delayTask !== null && (
            <div className="modal-backdrop">
              <form className="modal small-modal" onSubmit={postponeTask}>
                <div className="modal-header">
                  <div>
                    <h2>Hoãn công việc</h2>
                    <p>Hãy ghi rõ lý do hoãn công việc.</p>
                  </div>
                  <button type="button" className="close-btn" onClick={() => setDelayTask(null)}>×</button>
                </div>
                <label>
                  Lý do hoãn *
                  <textarea required rows="4" value={delayReason} onChange={e => setDelayReason(e.target.value)} placeholder="Nhập lý do..." />
                </label>
                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setDelayTask(null)}>Hủy</button>
                  <button type="submit" className="primary-btn">Lưu lý do</button>
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
