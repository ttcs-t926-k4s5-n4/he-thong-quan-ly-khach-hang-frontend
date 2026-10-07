const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function notifySessionExpired(message){
  // Chỉ chuyển về đăng nhập nếu trước đó người dùng đã đăng nhập trong phiên tab này.
  // Xóa cờ trước khi phát sự kiện để nhiều request song song không phát lặp thông báo.
  if(sessionStorage.getItem('crm_logged_in') !== '1') return
  sessionStorage.removeItem('crm_logged_in')
  window.dispatchEvent(new CustomEvent('crm:session-expired',{
    detail:{message:message || 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.'}
  }))
}

export async function api(path, options={}){
  let res
  try {
    res = await fetch(BASE+path,{
      credentials:'include',
      headers:{'Content-Type':'application/json',...(options.headers||{})},
      ...options
    })
  } catch {
    throw new Error('Không thể kết nối tới máy chủ. Hãy kiểm tra Backend đang chạy tại http://localhost:8000.')
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
  return data
}
export const API_BASE=BASE
