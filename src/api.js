const BASE = import.meta.env.VITE_API_URL || ''

function notifySessionExpired(message){
  // Chỉ chuyển về đăng nhập nếu trước đó người dùng đã đăng nhập trong phiên tab này.
  // Xóa cờ trước khi phát sự kiện để nhiều request song song không phát lặp thông báo.
  sessionStorage.removeItem('crm_token')
  if(sessionStorage.getItem('crm_logged_in') !== '1') return
  sessionStorage.removeItem('crm_logged_in')
  window.dispatchEvent(new CustomEvent('crm:session-expired',{
    detail:{message:message || 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.'}
  }))
}

export async function api(path, options={}){
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('crm_token') : null
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {}
  const reqHeaders = { 'Content-Type': 'application/json', ...authHeaders, ...(options.headers || {}) }

  let res
  try {
    res = await fetch((BASE || '') + path, {
      credentials: 'include',
      headers: reqHeaders,
      ...options
    })
  } catch {
    // Retry with direct 127.0.0.1:5000 if proxy or initial fetch failed
    const directBase = 'http://127.0.0.1:5000'
    try {
      res = await fetch(directBase + path, {
        credentials: 'include',
        headers: reqHeaders,
        ...options
      })
    } catch {
      // Fallback to active backend port 8000 if port 5000 is unreachable
      try {
        res = await fetch('http://127.0.0.1:8000' + path, {
          credentials: 'include',
          headers: reqHeaders,
          ...options
        })
      } catch {
        throw new Error('Không thể kết nối tới máy chủ. Hãy kiểm tra Backend đang chạy tại http://127.0.0.1:5000 hoặc http://127.0.0.1:8000.')
      }
    }
  }

  let data={}
  const type=res.headers.get('content-type')||''
  if(type.includes('application/json')) data=await res.json()

  if(!res.ok) {
    const raw=data.detail ?? data.message
    let message='Yêu cầu không thành công. Vui lòng thử lại.'
    if(typeof raw==='string') message=raw
    else if(Array.isArray(raw)) {
      const texts=raw.map(x=>x?.msg || x?.message).filter(Boolean)
      if(texts.length) message=texts.join(' ')
    } else if(raw && typeof raw==='object') {
      message=raw.msg || raw.message || message
    }
    // 401 từ màn hình đăng nhập là sai thông tin đăng nhập, không phải hết phiên.
    if(res.status===401 && path!=='/api/auth/login') notifySessionExpired(message)
    throw new Error(message)
  }
  if(path==='/api/auth/login' && data.access_token) {
    sessionStorage.setItem('crm_token', data.access_token)
    sessionStorage.setItem('crm_logged_in', '1')
  }
  return data
}
export const API_BASE=BASE
