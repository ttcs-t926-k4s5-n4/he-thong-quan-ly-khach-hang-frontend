/**
 * API client cho module Hoạt động & Công việc (EP-06-CRM-Activities-Tasks-Nam)
 * Tích hợp chuẩn REST API với Backend Flask tại cổng 5000.
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''

export function getToken() {
  return sessionStorage.getItem('crm_token') || localStorage.getItem('crm_token') || ''
}

export function setToken(token) {
  if (token) {
    sessionStorage.setItem('crm_token', token)
    localStorage.setItem('crm_token', token)
  } else {
    sessionStorage.removeItem('crm_token')
    localStorage.removeItem('crm_token')
  }
}

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem('crm_user') || localStorage.getItem('crm_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  if (user) {
    const text = JSON.stringify(user)
    sessionStorage.setItem('crm_user', text)
    localStorage.setItem('crm_user', text)
  } else {
    sessionStorage.removeItem('crm_user')
    localStorage.removeItem('crm_user')
  }
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.detail || data.message || 'Đăng nhập không thành công'
    const error = new Error(msg)
    error.status = res.status
    throw error
  }
  setToken(data.access_token)
  setStoredUser(data.user)
  return data
}

export function logout() {
  setToken('')
  setStoredUser(null)
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch (netErr) {
    const err = new Error('Không thể kết nối đến máy chủ Backend (http://127.0.0.1:5000). Vui lòng kiểm tra lại dịch vụ.')
    err.status = 0
    err.cause = netErr
    throw err
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => ({})) : {}

  if (!res.ok) {
    let msg = data.detail || data.message
    if (!msg && Array.isArray(data.errors) && data.errors.length > 0) {
      msg = data.errors.map(e => e.message || e.msg).filter(Boolean).join('. ')
    }
    if (!msg) {
      if (res.status === 401) msg = 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.'
      else if (res.status === 403) msg = 'Bạn không có quyền thực hiện thao tác này.'
      else if (res.status === 404) msg = 'Không tìm thấy dữ liệu yêu cầu.'
      else msg = `Yêu cầu thất bại với mã lỗi HTTP ${res.status}.`
    }
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

// ----------------- Lookups -----------------
export async function fetchCustomers() {
  const data = await apiFetch('/api/lookups/customers')
  return data.items || []
}

export async function fetchUsers() {
  const data = await apiFetch('/api/lookups/users')
  return data.items || []
}

// ----------------- Activities (SCRUM-99) -----------------
export async function fetchActivities() {
  const data = await apiFetch('/api/activities')
  return data.items || []
}

export async function createActivity(payload) {
  return await apiFetch('/api/activities', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ----------------- Tasks (SCRUM-100) -----------------
export async function fetchTasks(status = 'all') {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  const data = await apiFetch(`/api/tasks${query}`)
  return data.items || []
}

export async function createTask(payload) {
  return await apiFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function completeTask(taskId, note = '') {
  return await apiFetch(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  })
}

export async function postponeTask(taskId, newDueDate, reason) {
  return await apiFetch(`/api/tasks/${taskId}/postpone`, {
    method: 'POST',
    body: JSON.stringify({ new_due_date: newDueDate, reason }),
  })
}
