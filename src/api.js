// Mặc định dùng relative path ('') để đi qua Vite proxy (http://localhost:3000 -> proxy tới http://127.0.0.1:8000).
// Nhờ đó cookie crm_session luôn là Same-Origin, tránh việc trình duyệt chặn cookie giữa localhost và 127.0.0.1.
const BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : ''

function notifySessionExpired(message){
  // Chỉ chuyển về đăng nhập nếu trước đó người dùng đã đăng nhập trong phiên tab này.
  // Xóa cờ trước khi phát sự kiện để nhiều request song song không phát lặp thông báo.
  if(sessionStorage.getItem('crm_logged_in') !== '1') return
  sessionStorage.removeItem('crm_logged_in')
  window.dispatchEvent(new CustomEvent('crm:session-expired',{
    detail:{message:message || 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.'}
  }))
}

export function translateMessage(msg) {
  if (!msg || typeof msg !== 'string') return 'Yêu cầu không thành công. Vui lòng thử lại.'
  const m = msg.trim()
  if (/Input should be a valid integer/i.test(m) || /unable to parse string as an integer/i.test(m)) {
    return 'Dữ liệu ID hoặc số phải là số nguyên hợp lệ.'
  }
  if (/Field required/i.test(m) || /Missing required/i.test(m)) {
    return 'Vui lòng điền đầy đủ các thông tin bắt buộc.'
  }
  if (/Input should be a valid number/i.test(m)) {
    return 'Dữ liệu nhập vào phải là định dạng số hợp lệ.'
  }
  if (/String should have at least/i.test(m)) {
    return 'Độ dài ký tự chưa đạt mức tối thiểu.'
  }
  if (/Internal Server Error/i.test(m)) {
    return 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
  }
  if (/Not Found/i.test(m)) {
    return 'Không tìm thấy dữ liệu yêu cầu.'
  }
  if (/Unauthorized/i.test(m)) {
    return 'Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập.'
  }
  if (/Forbidden/i.test(m)) {
    return 'Bạn không có quyền thực hiện thao tác này.'
  }
  if (/value is not a valid email/i.test(m)) {
    return 'Địa chỉ email không đúng định dạng.'
  }
  return m
}

export async function api(path, options={}){
  let res
  const target = (BASE || '') + path
  const defaultHeaders = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
  try {
    res = await fetch(target,{
      credentials:'include',
      headers:{...defaultHeaders,...(options.headers||{})},
      ...options
    })
  } catch {
    // Retry trực tiếp tới port 8000 theo hostname trình duyệt nếu proxy không bắt được
    const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'
    const directBase = `http://${host}:8000`
    try {
      res = await fetch(directBase+path,{
        credentials:'include',
        headers:{...defaultHeaders,...(options.headers||{})},
        ...options
      })
    } catch {
      throw new Error('Không thể kết nối tới máy chủ. Hãy kiểm tra Backend đang chạy tại http://127.0.0.1:8000.')
    }
  }

  let data={}
  const type=res.headers.get('content-type')||''
  if(type.includes('application/json')) data=await res.json()

  if(!res.ok) {
    const raw=data.detail ?? data.message
    let message='Yêu cầu không thành công. Vui lòng thử lại.'
    if(typeof raw==='string') message=translateMessage(raw)
    else if(Array.isArray(raw)) {
      const texts=raw.map(x=>translateMessage(x?.msg || x?.message)).filter(Boolean)
      if(texts.length) message=texts.join(' ')
    } else if(raw && typeof raw==='object') {
      message=translateMessage(raw.msg || raw.message || message)
    }
    // 401 từ màn hình đăng nhập là sai thông tin đăng nhập, không phải hết phiên.
    if(res.status===401 && path!=='/api/auth/login') notifySessionExpired(message)
    throw new Error(message)
  }
  return data
}
export const API_BASE=BASE
