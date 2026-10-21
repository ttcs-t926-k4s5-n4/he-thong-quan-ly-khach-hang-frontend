import React,{useEffect,useMemo,useState} from 'react'
import {api,API_BASE} from './api'
import {Users,ShieldCheck,LogOut,KeyRound,LockKeyhole,Mail,LayoutDashboard,Search,Download,Menu,X,BriefcaseBusiness} from 'lucide-react'

const route=()=>window.location.pathname
const go=(p)=>{history.pushState({},'',p);window.dispatchEvent(new PopStateEvent('popstate'))}
const errText=e=>e?.message||'Có lỗi xảy ra. Hãy thử lại.'
const roleVi={
  ADMIN:'Quản trị hệ thống',
  DIRECTOR:'Giám đốc kinh doanh',
  TEAM_LEADER:'Trưởng nhóm',
  SALES:'Nhân viên kinh doanh',
  REPORT_VIEWER:'Xem báo cáo'
}
const scopeVi={self:'Cá nhân',group:'Nhóm',all:'Toàn bộ'}
const statusVi={active:'Đang hoạt động',pending:'Chờ kích hoạt',locked:'Đã khóa'}
const viRoles=roles=>(roles||[]).map(r=>roleVi[r]||r).join(', ')

function Notice({text,type='ok'}){if(!text)return null;return <div className={'notice '+type}>{text}</div>}
function Field({label,...p}){return <label className="field"><span>{label}</span><input {...p}/></label>}
function Select({label,children,...p}){return <label className="field"><span>{label}</span><select {...p}>{children}</select></label>}

function Login({onLogin,initialMessage=''}){
 const [email,setEmail]=useState('admin@crm.local'),[password,setPassword]=useState('Admin@123'),[msg,setMsg]=useState(initialMessage),[busy,setBusy]=useState(false)
 useEffect(()=>{setMsg(initialMessage)},[initialMessage])
 async function submit(e){e.preventDefault();setBusy(true);setMsg('');try{const d=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});onLogin(d.user,d.menu)}catch(e){setMsg(errText(e))}finally{setBusy(false)}}
 return <div className="auth-shell"><form className="auth-card" onSubmit={submit}><h1>Hệ thống quản lý khách hàng</h1><Notice text={msg} type="err"/><div className="login-rule"><b>Quy định đăng nhập:</b> Nhập sai mật khẩu 5 lần liên tiếp, tài khoản sẽ bị khóa tạm thời 15 phút.</div><Field label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><Field label="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="primary" disabled={busy}>{busy?'Đang đăng nhập...':'Đăng nhập'}</button><button type="button" className="link" onClick={()=>go('/forgot-password')}>Quên mật khẩu?</button></form></div>
}
function Forgot(){const[email,setEmail]=useState(''),[msg,setMsg]=useState('');async function send(e){e.preventDefault();try{const d=await api('/api/auth/forgot-password',{method:'POST',body:JSON.stringify({email})});setMsg(d.message)}catch(e){setMsg(errText(e))}}return <div className="auth-shell"><form className="auth-card" onSubmit={send}><h1>Quên mật khẩu</h1><Notice text={msg}/><Field label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><button className="primary">Gửi liên kết</button><button type="button" className="link" onClick={()=>go('/')}>Về đăng nhập</button></form></div>}
function Reset(){const token=new URLSearchParams(location.search).get('token')||'';const[p,setP]=useState(''),[c,setC]=useState(''),[msg,setMsg]=useState('');async function save(e){e.preventDefault();try{const d=await api('/api/auth/reset-password/'+token,{method:'POST',body:JSON.stringify({password:p,password_confirmation:c})});setMsg(d.message)}catch(e){setMsg(errText(e))}}return <div className="auth-shell"><form className="auth-card" onSubmit={save}><h1>Đặt lại mật khẩu</h1><Notice text={msg}/><Field label="Mật khẩu mới" type="password" value={p} onChange={e=>setP(e.target.value)}/><Field label="Xác nhận" type="password" value={c} onChange={e=>setC(e.target.value)}/><button className="primary">Lưu mật khẩu</button></form></div>}
function Activate(){const token=new URLSearchParams(location.search).get('token')||'';const[msg,setMsg]=useState('Đang kích hoạt...');useEffect(()=>{api('/api/auth/activate/'+token,{method:'POST'}).then(d=>setMsg(d.message)).catch(e=>setMsg(errText(e)))},[]);return <div className="auth-shell"><div className="auth-card"><h1>Kích hoạt tài khoản</h1><Notice text={msg}/><button className="primary" onClick={()=>go('/')}>Về đăng nhập</button></div></div>}

function ErrorPage({code='404',title='Không tìm thấy trang',message='Trang bạn truy cập không tồn tại hoặc đã được di chuyển.'}){return <div className="error-page"><div className="error-box"><div className="error-code">{code}</div><h2>{title}</h2><p>{message}</p><button className="primary" onClick={()=>go('/')}>Về trang Tổng quan</button></div></div>}

function Shell({user,menu,onLogout,children}){const[open,setOpen]=useState(false);return <div className="app"><aside className={'sidebar '+(open?'open':'')}><div className="side-head"><button className="icon mobile" onClick={()=>setOpen(false)}><X/></button></div><div className="who"><b>{user.full_name}</b><span>{viRoles(user.roles)}</span></div><nav>{menu.map(m=><button key={m.key} className={route()===m.path?'active':''} onClick={()=>{go(m.path);setOpen(false)}}>{icon(m.key)}<span>{m.label}</span></button>)}</nav><button className="logout" onClick={onLogout}><LogOut/>Đăng xuất</button></aside><main><header><button className="icon mobile" onClick={()=>setOpen(true)}><Menu/></button><div><b>HỆ THỐNG QUẢN LÝ KHÁCH HÀNG</b></div></header><div className="content">{children}</div></main></div>}
function icon(k){return k==='home'?<LayoutDashboard/>:k==='users'?<Users/>:k==='roles'?<ShieldCheck/>:k==='lock'?<LockKeyhole/>:k==='outbox'?<Mail/>:k==='change-password'?<KeyRound/>:<BriefcaseBusiness/>}
function Home({user}){return <><div className="page-title"><h2>Tổng quan</h2></div><div className="cards"><div className="card"><b>Vai trò</b><strong>{viRoles(user.roles)}</strong></div><div className="card"><b>Phạm vi dữ liệu</b><strong>{scopeVi[user.data_scope]||user.data_scope}</strong></div><div className="card"><b>Nhóm</b><strong>{user.group_name||'Toàn hệ thống'}</strong></div></div></>}

function Customers(){const[q,setQ]=useState(''),[customers,setCustomers]=useState([]),[opps,setOpps]=useState([]),[acts,setActs]=useState([]),[quotes,setQuotes]=useState([]),[msg,setMsg]=useState(''),[scope,setScope]=useState(''),[kind,setKind]=useState('customers'),[rid,setRid]=useState(''),[check,setCheck]=useState('');async function load(){try{const[c,o,a,qt]=await Promise.all([api('/api/customers?q='+encodeURIComponent(q)),api('/api/opportunities?q='+encodeURIComponent(q)),api('/api/activities?q='+encodeURIComponent(q)),api('/api/quotations?q='+encodeURIComponent(q))]);setCustomers(c.items);setOpps(o.items);setActs(a.items);setQuotes(qt.items);setScope(c.scope);setMsg('')}catch(e){setMsg(errText(e))}}useEffect(()=>{load()},[]);async function checkAccess(){if(!rid){setCheck('Nhập ID bản ghi cần kiểm tra.');return}try{const d=await api(`/api/${kind}/${rid}`);setCheck(`Được phép truy cập: ${JSON.stringify(d.item)}`)}catch(e){setCheck(errText(e))}}return <><div className="page-title row"><div><h2>Dữ liệu kinh doanh</h2><p>Phạm vi hiện tại: <b>{scopeVi[scope]||scope||'Đang tải...'}</b>. Khách hàng, cơ hội, hoạt động và báo giá đều tự lọc theo phạm vi.</p></div><a className="button" href={API_BASE+'/api/data/export'} onClick={async e=>{e.preventDefault();const r=await fetch(API_BASE+'/api/data/export',{credentials:'include'});if(!r.ok){if(r.status===401){sessionStorage.removeItem('crm_logged_in');window.dispatchEvent(new CustomEvent('crm:session-expired',{detail:{message:'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'}}));return}setMsg('Không thể xuất Excel. Hãy kiểm tra quyền và thử lại.');return}const b=await r.blob();const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='du-lieu-theo-pham-vi.xlsx';a.click();URL.revokeObjectURL(u)}}><Download/>Xuất Excel theo phạm vi</a></div><Notice text={msg} type="err"/><div className="toolbar"><div className="search"><Search/><input placeholder="Tìm trong dữ liệu được phép xem..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/></div><button onClick={load}>Tìm kiếm</button></div><div className="panel"><h3>Kiểm tra quyền truy cập bản ghi</h3><p>Nhập ID của bản ghi. Nếu nằm ngoài phạm vi, hệ thống sẽ trả thông báo tiếng Việt rõ ràng.</p><div className="toolbar"><select value={kind} onChange={e=>setKind(e.target.value)}><option value="customers">Khách hàng</option><option value="opportunities">Cơ hội</option><option value="activities">Hoạt động</option><option value="quotations">Báo giá</option></select><input type="number" min="1" placeholder="ID bản ghi" value={rid} onChange={e=>setRid(e.target.value)}/><button onClick={checkAccess}>Kiểm tra</button></div>{check&&<Notice text={check} type={check.startsWith('Được phép')?'ok':'err'}/>}</div><div className="panel"><h3>Khách hàng</h3><Table headers={['ID','Tên','Điện thoại','Email','Chủ sở hữu','Nhóm']} rows={customers.map(x=>[x.id,x.name,x.phone,x.email,x.owner_name,x.group_name])}/></div><div className="panel"><h3>Cơ hội</h3><Table headers={['ID','Tiêu đề','Giá trị','Giai đoạn','Chủ sở hữu','Nhóm']} rows={opps.map(x=>[x.id,x.title,Number(x.value).toLocaleString('vi-VN')+' ₫',x.stage,x.owner_name,x.group_name])}/></div><div className="panel"><h3>Hoạt động</h3><Table headers={['ID','Nội dung','Loại','Chủ sở hữu','Nhóm']} rows={acts.map(x=>[x.id,x.subject,x.activity_type,x.owner_name,x.group_name])}/></div><div className="panel"><h3>Báo giá</h3><Table headers={['ID','Số báo giá','Tổng tiền','Trạng thái','Chủ sở hữu','Nhóm']} rows={quotes.map(x=>[x.id,x.quote_no,Number(x.total_amount).toLocaleString('vi-VN')+' ₫',x.status,x.owner_name,x.group_name])}/></div></>}
function Table({headers,rows}){return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v??'-'}</td>)}</tr>):<tr><td colSpan={headers.length}>Chưa có dữ liệu.</td></tr>}</tbody></table></div>}

function ChangePassword(){const[f,setF]=useState({current_password:'',new_password:'',new_password_confirmation:''}),[msg,setMsg]=useState(''),[bad,setBad]=useState(false);async function save(e){e.preventDefault();try{const d=await api('/api/auth/change-password',{method:'POST',body:JSON.stringify(f)});setMsg(d.message);setBad(false);setF({current_password:'',new_password:'',new_password_confirmation:''})}catch(e){setMsg(errText(e));setBad(true)}}return <div className="panel narrow"><h2>Đổi mật khẩu</h2><Notice text={msg} type={bad?'err':'ok'}/><form onSubmit={save}><Field label="Mật khẩu hiện tại" type="password" value={f.current_password} onChange={e=>setF({...f,current_password:e.target.value})}/><Field label="Mật khẩu mới" type="password" value={f.new_password} onChange={e=>setF({...f,new_password:e.target.value})}/><Field label="Xác nhận mật khẩu mới" type="password" value={f.new_password_confirmation} onChange={e=>setF({...f,new_password_confirmation:e.target.value})}/><button className="primary">Đổi mật khẩu</button></form></div>}

function UsersPage({user}){
 const isAdmin=(user.roles||[]).includes('ADMIN')
 const[items,setItems]=useState([]),[meta,setMeta]=useState({roles:[],groups:[]}),[q,setQ]=useState(''),[msg,setMsg]=useState(''),[bad,setBad]=useState(false),[page,setPage]=useState(1),[pages,setPages]=useState(1)
 const[filters,setFilters]=useState({group:'',role:'',status:''})
 const[form,setForm]=useState({full_name:'',email:'',business_group_id:'',role_ids:[]})
 const[editing,setEditing]=useState(null)
 async function load(p=page){
  try{
   const params=new URLSearchParams({q,page:String(p),per_page:'20'})
   if(filters.group)params.set('group',filters.group)
   if(filters.role)params.set('role',filters.role)
   if(filters.status)params.set('status',filters.status)
   const[m,u]=await Promise.all([api('/api/meta'),api('/api/users?'+params.toString())])
   setMeta(m);setItems(u.items);setPages(u.pages);setPage(u.page);setBad(false)
  }catch(e){setMsg(errText(e));setBad(true)}
 }
 useEffect(()=>{load(1)},[])
 async function create(e){
  e.preventDefault();setMsg('')
  try{
   const d=await api('/api/users',{method:'POST',body:JSON.stringify({...form,business_group_id:form.business_group_id?Number(form.business_group_id):null,role_ids:form.role_ids.map(Number)})})
   setMsg(d.message);setBad(false);setForm({full_name:'',email:'',business_group_id:'',role_ids:[]});load(1)
  }catch(e){setMsg(errText(e));setBad(true)}
 }
 function beginEdit(x){setEditing({id:x.id,full_name:x.full_name,email:x.email,business_group_id:x.business_group_id||'',data_scope:x.data_scope,status:x.status})}
 async function saveEdit(e){
  e.preventDefault()
  try{
   const d=await api('/api/users/'+editing.id,{method:'PUT',body:JSON.stringify({...editing,business_group_id:editing.business_group_id?Number(editing.business_group_id):null})})
   setMsg(d.message);setBad(false);setEditing(null);load(page)
  }catch(e){setMsg(errText(e));setBad(true)}
 }
 async function resetFilters(){setQ('');setFilters({group:'',role:'',status:''});try{const[m,u]=await Promise.all([api('/api/meta'),api('/api/users?q=&page=1&per_page=20')]);setMeta(m);setItems(u.items);setPages(u.pages);setPage(u.page);setBad(false)}catch(e){setMsg(errText(e));setBad(true)}}
 return <>
  <div className="page-title"><h2>Quản lý người dùng</h2></div>
  <Notice text={msg} type={bad?'err':'ok'}/>
  <div className="grid2">
   {isAdmin&&<form className="panel" onSubmit={create}>
    <h3>Tạo tài khoản</h3>
    <Field label="Họ và tên" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} required/>
    <Field label="Email công ty" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
    <Select label="Nhóm" value={form.business_group_id} onChange={e=>setForm({...form,business_group_id:e.target.value})}><option value="">Không nhóm</option>{meta.groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</Select>
    <div className="checks"><span>Vai trò</span>{meta.roles.map(r=><label key={r.id}><input type="checkbox" checked={form.role_ids.includes(r.id)} onChange={e=>setForm({...form,role_ids:e.target.checked?[...form.role_ids,r.id]:form.role_ids.filter(x=>x!==r.id)})}/>{r.name}</label>)}</div>
    <p className="hint">Phạm vi dữ liệu được tự xác định theo vai trò: Quản trị/Giám đốc = tất cả; Trưởng nhóm = nhóm; Nhân viên = cá nhân.</p>
    <button className="primary">Tạo tài khoản & tạo email kích hoạt</button>
   </form>}
   <div className="panel">
    <h3>Tìm kiếm & lọc</h3>
    <Field label="Tên / email / nhóm" value={q} onChange={e=>setQ(e.target.value)} placeholder="Nhập từ khóa..."/>
    <Select label="Nhóm" value={filters.group} onChange={e=>setFilters({...filters,group:e.target.value})}><option value="">Tất cả nhóm</option>{meta.groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</Select>
    <Select label="Vai trò" value={filters.role} onChange={e=>setFilters({...filters,role:e.target.value})}><option value="">Tất cả vai trò</option>{meta.roles.map(r=><option key={r.id} value={r.code}>{r.name}</option>)}</Select>
    <Select label="Trạng thái" value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="pending">Chờ kích hoạt</option><option value="locked">Đã khóa</option></Select>
    <div className="toolbar"><button onClick={()=>load(1)}>Áp dụng bộ lọc</button><button className="secondary" onClick={resetFilters}>Xóa lọc</button></div>
    <p>Trang {page}/{pages} · 20 dòng/trang</p>
   </div>
  </div>
  {editing&&isAdmin&&<form className="panel" onSubmit={saveEdit}>
   <div className="row"><div><h3>Sửa tài khoản #{editing.id}</h3><p>Cập nhật thông tin tài khoản. Vai trò và nhóm phân quyền chi tiết được quản lý tại mục “Vai trò & nhóm”.</p></div><button type="button" className="secondary" onClick={()=>setEditing(null)}>Hủy sửa</button></div>
   <div className="grid2"><Field label="Họ và tên" value={editing.full_name} onChange={e=>setEditing({...editing,full_name:e.target.value})} required/><Field label="Email" type="email" value={editing.email} onChange={e=>setEditing({...editing,email:e.target.value})} required/></div>
   <div className="grid2"><Select label="Nhóm" value={editing.business_group_id} onChange={e=>setEditing({...editing,business_group_id:e.target.value})}><option value="">Không nhóm</option>{meta.groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</Select><Select label="Trạng thái" value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value})}><option value="active">Đang hoạt động</option><option value="pending">Chờ kích hoạt</option><option value="locked">Đã khóa</option></Select></div>
   <p className="hint">Phạm vi dữ liệu hiện tại: <b>{scopeVi[editing.data_scope]||editing.data_scope}</b>. Phạm vi sẽ được đồng bộ tự động theo vai trò khi lưu phân quyền.</p>
   <button className="primary">Lưu thay đổi</button>
  </form>}
  <div className="panel">
   <Table headers={['Tên','Email','Nhóm','Vai trò','Trạng thái','Phạm vi',...(isAdmin?['Thao tác']:[])]} rows={items.map(x=>[x.full_name,x.email,x.group_name,viRoles(x.roles),statusVi[x.status]||x.status,scopeVi[x.data_scope]||x.data_scope,...(isAdmin?[<button className="small-btn" onClick={()=>beginEdit(x)}>Sửa</button>]:[])])}/>
   <div className="pager"><button disabled={page<=1} onClick={()=>load(page-1)}>Trước</button><button disabled={page>=pages} onClick={()=>load(page+1)}>Sau</button></div>
  </div>
 </>
}

function RolesPage(){const[users,setUsers]=useState([]),[meta,setMeta]=useState({roles:[],groups:[]}),[uid,setUid]=useState(''),[roleIds,setRoleIds]=useState([]),[gid,setGid]=useState(''),[msg,setMsg]=useState('');async function load(){try{const[m,u]=await Promise.all([api('/api/meta'),api('/api/users?page=1&per_page=100')]);setMeta(m);setUsers(u.items)}catch(e){setMsg(errText(e))}}useEffect(()=>{load()},[]);const selected=users.find(x=>x.id===Number(uid));useEffect(()=>{if(selected){setRoleIds(meta.roles.filter(r=>selected.roles.includes(r.code)).map(r=>r.id));setGid(selected.business_group_id||'')}},[uid]);async function save(){try{const d=await api('/api/users/'+uid+'/roles',{method:'PUT',body:JSON.stringify({role_ids:roleIds,business_group_id:gid?Number(gid):null})});setMsg(d.message);load()}catch(e){setMsg(errText(e))}}return <div className="panel"><h2>Vai trò & nhóm kinh doanh</h2><Notice text={msg}/><Select label="Người dùng" value={uid} onChange={e=>setUid(e.target.value)}><option value="">-- Chọn --</option>{users.map(u=><option key={u.id} value={u.id}>{u.full_name} - {u.email}</option>)}</Select>{uid&&<><div className="checks"><span>Có thể giữ nhiều vai trò cùng lúc</span>{meta.roles.map(r=><label key={r.id}><input type="checkbox" checked={roleIds.includes(r.id)} onChange={e=>setRoleIds(e.target.checked?[...roleIds,r.id]:roleIds.filter(x=>x!==r.id))}/>{r.name}</label>)}</div><Select label="Nhóm kinh doanh (bắt buộc nếu là Trưởng nhóm)" value={gid} onChange={e=>setGid(e.target.value)}><option value="">Không nhóm</option>{meta.groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</Select><button className="primary" onClick={save}>Lưu phân quyền</button></>}</div>}

function LockPage(){const[users,setUsers]=useState([]),[from,setFrom]=useState(''),[to,setTo]=useState(''),[logs,setLogs]=useState([]),[msg,setMsg]=useState('');async function load(){try{const[u,l]=await Promise.all([api('/api/users?page=1&per_page=100'),api('/api/handover-logs')]);setUsers(u.items);setLogs(l.items)}catch(e){setMsg(errText(e))}}useEffect(()=>{load()},[]);async function lock(){if(!confirm('Khóa tài khoản và bàn giao toàn bộ dữ liệu?'))return;try{const d=await api(`/api/users/${from}/lock-and-handover`,{method:'POST',body:JSON.stringify({receiver_user_id:Number(to)})});setMsg(d.message+` Khách hàng: ${d.customer_count}, cơ hội: ${d.opportunity_count}.`);load()}catch(e){setMsg(errText(e))}}return <><div className="panel"><h2>Khóa tài khoản & bàn giao</h2><Notice text={msg}/><div className="grid2"><Select label="Tài khoản cần khóa" value={from} onChange={e=>setFrom(e.target.value)}><option value="">-- Chọn --</option>{users.filter(u=>u.is_active).map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}</Select><Select label="Người nhận khách hàng/cơ hội" value={to} onChange={e=>setTo(e.target.value)}><option value="">-- Chọn --</option>{users.filter(u=>u.is_active&&String(u.id)!==from).map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}</Select></div><button className="danger" disabled={!from||!to} onClick={lock}>Bàn giao và khóa tài khoản</button></div><div className="panel"><h3>Nhật ký bàn giao</h3><Table headers={['Từ','Đến','Quản trị','Khách hàng','Cơ hội','Thời gian']} rows={logs.map(x=>[x.from_user,x.to_user,x.admin_user,x.customer_count,x.opportunity_count,new Date(x.created_at).toLocaleString('vi-VN')])}/></div></>}
function Outbox(){const[items,setItems]=useState([]),[msg,setMsg]=useState('');useEffect(()=>{api('/api/outbox').then(d=>setItems(d.items)).catch(e=>setMsg(errText(e)))},[]);return <div className="panel"><h2>Thư thử nghiệm</h2><Notice text={msg} type="err"/>{items.map(x=><div className="mail" key={x.id}><b>{x.subject}</b><span>Đến: {x.recipient}</span><pre>{x.body}</pre></div>)}</div>}

export default function App(){const[user,setUser]=useState(null),[menu,setMenu]=useState([]),[path,setPath]=useState(route()),[loading,setLoading]=useState(true),[loginMessage,setLoginMessage]=useState('');useEffect(()=>{const h=()=>setPath(route());const expired=e=>{setUser(null);setMenu([]);setLoginMessage(e.detail?.message||'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');go('/')};addEventListener('popstate',h);addEventListener('crm:session-expired',expired);api('/api/auth/me').then(d=>{setUser(d.user);setMenu(d.menu);sessionStorage.setItem('crm_logged_in','1')}).catch(()=>{}).finally(()=>setLoading(false));return()=>{removeEventListener('popstate',h);removeEventListener('crm:session-expired',expired)}},[]);
 useEffect(()=>{if(!user)return;const idleMinutes=Number(import.meta.env.VITE_SESSION_IDLE_MINUTES||15);const idleMs=Math.max(1,idleMinutes)*60*1000;let lastActivity=Date.now();let lastPing=0;let timer=null;let expired=false;const message='Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.';const expire=()=>{if(expired)return;expired=true;sessionStorage.removeItem('crm_logged_in');window.dispatchEvent(new CustomEvent('crm:session-expired',{detail:{message}}))};const arm=()=>{if(timer)clearTimeout(timer);const remain=idleMs-(Date.now()-lastActivity);if(remain<=0)expire();else timer=setTimeout(expire,remain)};const ping=()=>{const now=Date.now();if(now-lastPing<60000)return;lastPing=now;api('/api/auth/me').catch(()=>{})};const activity=()=>{if(expired)return;lastActivity=Date.now();arm();ping()};const events=['pointerdown','keydown','touchstart','scroll'];events.forEach(name=>window.addEventListener(name,activity,{passive:true}));arm();ping();return()=>{if(timer)clearTimeout(timer);events.forEach(name=>window.removeEventListener(name,activity))}},[user]);
 async function logout(){try{await api('/api/auth/logout',{method:'POST'})}catch{}sessionStorage.removeItem('crm_logged_in');setUser(null);setMenu([]);setLoginMessage('');go('/')}
 if(path==='/forgot-password')return <Forgot/>;if(path==='/reset-password')return <Reset/>;if(path==='/activate')return <Activate/>;if(loading)return <div className="loading">Đang tải...</div>;if(!user)return <Login initialMessage={loginMessage} onLogin={(u,m)=>{sessionStorage.setItem('crm_logged_in','1');setLoginMessage('');setUser(u);setMenu(m);go('/')}}/>;
 const knownPaths=['/','/customers','/change-password','/users','/roles','/account-lock','/outbox'];
 const allowedPaths=new Set(menu.map(m=>m.path));
 let page;
 if(!knownPaths.includes(path)){
   page=<ErrorPage code="404" title="Không tìm thấy trang" message="Đường dẫn bạn truy cập không tồn tại. Hãy quay lại Tổng quan để tiếp tục làm việc."/>;
 }else if(path!=='/' && !allowedPaths.has(path)){
   page=<ErrorPage code="403" title="Bạn không có quyền truy cập" message="Chức năng này không thuộc quyền của tài khoản hiện tại. Hãy quay lại Tổng quan hoặc liên hệ quản trị viên nếu cần được cấp quyền."/>;
 }else{
   page=<Home user={user}/>;
   if(path==='/customers')page=<Customers/>;
   else if(path==='/change-password')page=<ChangePassword/>;
   else if(path==='/users')page=<UsersPage user={user}/>;
   else if(path==='/roles')page=<RolesPage/>;
   else if(path==='/account-lock')page=<LockPage/>;
   else if(path==='/outbox')page=<Outbox/>;
 }
 return <Shell user={user} menu={menu} onLogout={logout}>{page}</Shell>
}
