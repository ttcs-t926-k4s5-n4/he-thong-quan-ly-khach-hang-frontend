import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, ChevronDown, CircleHelp, Database, Download, FileSpreadsheet,
  KanbanSquare, LayoutDashboard, Plus, Search, Settings2, SlidersHorizontal,
  Target, Trash2, Trophy, Users, X, Check, GripVertical, Save, AlertCircle
} from "lucide-react";
import "./styles.css";

const initialFields = [
  { id: 1, name: "Nguồn khách hàng", key: "lead_source", type: "select", required: true, options: ["Website", "Facebook", "Đối tác", "Giới thiệu"] },
  { id: 2, name: "Ngân sách dự kiến", key: "budget", type: "number", required: false, options: [] },
  { id: 3, name: "Ngày dự kiến chốt", key: "expected_close_date", type: "date", required: true, options: [] },
  { id: 4, name: "Loại khách hàng", key: "customer_type", type: "text", required: false, options: [] }
];

const initialStages = [
  { id: 1, name: "Tiếp cận", probability: 10, rule: "Không yêu cầu" },
  { id: 2, name: "Xác định nhu cầu", probability: 25, rule: "Có thông tin nhu cầu" },
  { id: 3, name: "Đề xuất giải pháp", probability: 50, rule: "Đã gửi đề xuất" },
  { id: 4, name: "Báo giá", probability: 65, rule: "Đã gửi báo giá" },
  { id: 5, name: "Đàm phán", probability: 80, rule: "Có ít nhất 1 cuộc gặp" },
  { id: 6, name: "Chốt", probability: 100, rule: "Đã xác nhận mua" }
];

const defaultLossReasons = ["Giá cao", "Không phù hợp nhu cầu", "Mất cho đối thủ", "Không phản hồi", "Sai thời điểm"];
const defaultWinReasons = ["Giá tốt", "Phù hợp nhu cầu", "Quan hệ khách hàng", "Tính năng vượt trội", "Dịch vụ tốt"];
const defaultCompetitors = ["Đối thủ A", "Đối thủ B", "Đối thủ C"];

function usePersisted(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function App() {
  const [tab, setTab] = useState("fields");
  const [fields, setFields] = usePersisted("crm_fields", initialFields);
  const [stages, setStages] = usePersisted("crm_stages", initialStages);
  const [lossReasons, setLossReasons] = usePersisted("crm_loss_reasons", defaultLossReasons);
  const [winReasons, setWinReasons] = usePersisted("crm_win_reasons", defaultWinReasons);
  const [competitors, setCompetitors] = usePersisted("crm_competitors", defaultCompetitors);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const exportConfig = () => {
    const payload = { customFields: fields, pipelineStages: stages, winReasons, lossReasons, competitors };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "crm-configuration.json"; a.click();
    URL.revokeObjectURL(url);
    notify("Đã xuất cấu hình CRM");
  };

  const resetAll = () => {
    if (!confirm("Đặt lại toàn bộ cấu hình về mặc định?")) return;
    setFields(initialFields); setStages(initialStages);
    setWinReasons(defaultWinReasons); setLossReasons(defaultLossReasons); setCompetitors(defaultCompetitors);
    notify("Đã khôi phục cấu hình mặc định");
  };

  return (
    <div className="app-shell">
      <Sidebar tab={tab} setTab={setTab} />
      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Quản trị hệ thống <span>/</span> Cấu hình CRM</div>
            <h1>Cấu hình hệ thống</h1>
            <p>Thiết lập các trường dữ liệu, pipeline và danh mục để đội ngũ bán hàng làm việc thống nhất.</p>
          </div>
          <div className="top-actions">
            <button className="btn secondary" onClick={resetAll}><Settings2 size={16}/> Khôi phục</button>
            <button className="btn primary" onClick={() => notify("Đã lưu toàn bộ cấu hình")}><Save size={16}/> Lưu thay đổi</button>
          </div>
        </header>

        <section className="summary-grid">
          <Summary icon={<Database/>} label="Trường tùy chỉnh" value={fields.length} note="Đang sử dụng"/>
          <Summary icon={<KanbanSquare/>} label="Giai đoạn pipeline" value={stages.length} note="Giai đoạn"/>
          <Summary icon={<Target/>} label="Tỷ lệ chốt dự báo" value={`${stages.at(-1)?.probability ?? 0}%`} note="Mặc định"/>
          <Summary icon={<Trophy/>} label="Danh mục lý do" value={winReasons.length + lossReasons.length} note="Thắng + thua"/>
        </section>

        <nav className="tabs">
          <Tab active={tab==="fields"} onClick={()=>setTab("fields")} icon={<Database size={17}/>} text="Trường tùy chỉnh"/>
          <Tab active={tab==="pipeline"} onClick={()=>setTab("pipeline")} icon={<KanbanSquare size={17}/>} text="Pipeline & xác suất"/>
          <Tab active={tab==="reasons"} onClick={()=>setTab("reasons")} icon={<Trophy size={17}/>} text="Lý do & đối thủ"/>
        </nav>

        {tab === "fields" && <FieldsTab fields={fields} setFields={setFields} notify={notify} />}
        {tab === "pipeline" && <PipelineTab stages={stages} setStages={setStages} notify={notify} />}
        {tab === "reasons" && <ReasonsTab {...{lossReasons,setLossReasons,winReasons,setWinReasons,competitors,setCompetitors,notify}} />}

        <footer className="footer-note">
          <CircleHelp size={15}/> Cấu hình được lưu trên trình duyệt để bạn có thể thử nghiệm frontend trước khi kết nối API/backend.
          <button onClick={exportConfig}><Download size={14}/> Xuất cấu hình JSON</button>
        </footer>
      </main>
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}

function Sidebar({tab,setTab}) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">C</div><div><b>CRM Core</b><small>Admin Console</small></div></div>
    <div className="workspace"><div className="avatar">SA</div><div><b>Sales Admin</b><small>Quản trị hệ thống</small></div><ChevronDown size={15}/></div>
    <div className="nav-label">TỔNG QUAN</div>
    <SideItem icon={<LayoutDashboard/>} text="Dashboard"/>
    <SideItem icon={<Users/>} text="Khách hàng"/>
    <SideItem icon={<BarChart3/>} text="Cơ hội"/>
    <div className="nav-label">CẤU HÌNH</div>
    <SideItem icon={<SlidersHorizontal/>} text="Trường tùy chỉnh" active={tab==="fields"} onClick={()=>setTab("fields")}/>
    <SideItem icon={<KanbanSquare/>} text="Pipeline bán hàng" active={tab==="pipeline"} onClick={()=>setTab("pipeline")}/>
    <SideItem icon={<Trophy/>} text="Lý do & đối thủ" active={tab==="reasons"} onClick={()=>setTab("reasons")}/>
    <div className="sidebar-bottom"><div className="status-dot"></div><span>Hệ thống đang hoạt động</span></div>
  </aside>
}

function SideItem({icon,text,active,onClick}) {
  return <button className={`side-item ${active?"active":""}`} onClick={onClick}>{icon}<span>{text}</span>{active && <div className="active-line"/>}</button>
}

function Summary({icon,label,value,note}) {
  return <div className="summary-card"><div className="summary-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong><span>{note}</span></div></div>
}
function Tab({active,onClick,icon,text}) { return <button className={`tab ${active?"active":""}`} onClick={onClick}>{icon}{text}</button> }

function FieldsTab({fields,setFields,notify}) {
  const [search,setSearch]=useState("");
  const [show,setShow]=useState(false);
  const filtered=fields.filter(f=>(f.name+" "+f.key).toLowerCase().includes(search.toLowerCase()));
  const addField=(data)=>{ setFields([...fields,{...data,id:Date.now()}]); setShow(false); notify("Đã thêm trường tùy chỉnh"); };
  const remove=(id)=>setFields(fields.filter(f=>f.id!==id));
  return <section className="panel">
    <div className="panel-head">
      <div><h2>Trường tùy chỉnh</h2><p>Thêm các cột nhân viên đang tự quản lý trong Excel vào hệ thống CRM.</p></div>
      <button className="btn primary" onClick={()=>setShow(true)}><Plus size={17}/> Thêm trường</button>
    </div>
    <div className="feature-row">
      <div><div className="feature-icon"><FileSpreadsheet/></div><div><b>Đồng bộ tư duy từ Excel sang CRM</b><span>Trường mới có thể xuất hiện trong biểu mẫu, bộ lọc và file Excel.</span></div></div>
      <div className="mini-stat"><b>{fields.length}</b><span>trường đang khai báo</span></div>
    </div>
    <div className="toolbar"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm theo tên hoặc mã trường..."/></div><button className="btn secondary">Tất cả loại <ChevronDown size={15}/></button></div>
    <div className="table-wrap"><table><thead><tr><th style={{width:38}}></th><th>Tên trường</th><th>Mã trường</th><th>Kiểu dữ liệu</th><th>Bắt buộc</th><th>Hiển thị</th><th></th></tr></thead>
      <tbody>{filtered.map((f,i)=><tr key={f.id}><td><GripVertical size={17} className="drag"/></td><td><b>{f.name}</b>{f.options?.length>0&&<small>{f.options.length} lựa chọn</small>}</td><td><code>{f.key}</code></td><td><TypeBadge type={f.type}/></td><td><Toggle checked={f.required} onChange={()=>setFields(fields.map(x=>x.id===f.id?{...x,required:!x.required}:x))}/></td><td><span className="visibility">Form · Lọc · Excel</span></td><td><button className="icon-btn danger" onClick={()=>remove(f.id)}><Trash2 size={16}/></button></td></tr>)}</tbody>
    </table></div>
    {show && <FieldModal onClose={()=>setShow(false)} onSave={addField}/>}
  </section>
}

function TypeBadge({type}) {
  const labels={text:"Văn bản",number:"Số",date:"Ngày",select:"Danh sách chọn"};
  return <span className="type-badge">{labels[type]||type}</span>
}
function Toggle({checked,onChange}) { return <button aria-label="toggle" className={`toggle ${checked?"on":""}`} onClick={onChange}><span/></button> }

function FieldModal({onClose,onSave}) {
  const [name,setName]=useState(""); const [key,setKey]=useState(""); const [type,setType]=useState("text"); const [required,setRequired]=useState(false); const [options,setOptions]=useState("");
  const submit=(e)=>{e.preventDefault(); if(!name||!key)return; onSave({name,key,type,required,options:type==="select"?options.split(",").map(x=>x.trim()).filter(Boolean):[]})};
  return <Modal title="Thêm trường tùy chỉnh" onClose={onClose}>
    <form onSubmit={submit} className="form">
      <Field label="Tên trường" required><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Ví dụ: Ngành nghề"/></Field>
      <Field label="Mã trường" required><input value={key} onChange={e=>setKey(e.target.value.replace(/\s/g,"_").toLowerCase())} placeholder="industry"/></Field>
      <Field label="Kiểu dữ liệu"><select value={type} onChange={e=>setType(e.target.value)}><option value="text">Văn bản</option><option value="number">Số</option><option value="date">Ngày</option><option value="select">Danh sách chọn</option></select></Field>
      {type==="select"&&<Field label="Các lựa chọn"><input value={options} onChange={e=>setOptions(e.target.value)} placeholder="SMB, Enterprise, Startup"/></Field>}
      <label className="checkline"><input type="checkbox" checked={required} onChange={e=>setRequired(e.target.checked)}/><span>Đây là trường bắt buộc</span></label>
      <div className="modal-actions"><button type="button" className="btn secondary" onClick={onClose}>Hủy</button><button className="btn primary" type="submit">Thêm trường</button></div>
    </form>
  </Modal>
}

function PipelineTab({stages,setStages,notify}) {
  const [show,setShow]=useState(false);
  const update=(id,patch)=>setStages(stages.map(s=>s.id===id?{...s,...patch}:s));
  const add=(data)=>{setStages([...stages,{...data,id:Date.now()}]);setShow(false);notify("Đã thêm giai đoạn pipeline")};
  return <section className="panel">
    <div className="panel-head"><div><h2>Pipeline & xác suất thắng</h2><p>Cấu hình chuỗi giai đoạn và xác suất mặc định để dự báo doanh số có cơ sở.</p></div><button className="btn primary" onClick={()=>setShow(true)}><Plus size={17}/> Thêm giai đoạn</button></div>
    <div className="pipeline-preview">{stages.map((s,i)=><div className="stage-chip" key={s.id}><span>{i+1}</span>{s.name}<b>{s.probability}%</b></div>)}</div>
    <div className="info-box"><AlertCircle size={17}/><div><b>Xác suất mặc định</b><span>Giá trị được dùng khi cơ hội chuyển sang giai đoạn mới. Nhân viên vẫn có thể điều chỉnh nếu quyền hệ thống cho phép.</span></div></div>
    <div className="stage-list">{stages.map((s,i)=><div className="stage-row" key={s.id}>
      <div className="stage-number">{i+1}</div><div className="stage-main"><input value={s.name} onChange={e=>update(s.id,{name:e.target.value})}/><small>Điều kiện: {s.rule}</small></div>
      <div className="probability"><input type="number" min="0" max="100" value={s.probability} onChange={e=>update(s.id,{probability:Number(e.target.value)})}/><span>%</span></div>
      <select value={s.rule} onChange={e=>update(s.id,{rule:e.target.value})}><option>Không yêu cầu</option><option>Có thông tin nhu cầu</option><option>Đã gửi đề xuất</option><option>Đã gửi báo giá</option><option>Có ít nhất 1 cuộc gặp</option><option>Đã xác nhận mua</option></select>
      <button className="icon-btn danger" onClick={()=>setStages(stages.filter(x=>x.id!==s.id))}><Trash2 size={16}/></button>
    </div>)}</div>
    {show&&<StageModal onClose={()=>setShow(false)} onSave={add}/>}
  </section>
}
function StageModal({onClose,onSave}) {
  const [name,setName]=useState("");const [prob,setProb]=useState(50);const [rule,setRule]=useState("Không yêu cầu");
  return <Modal title="Thêm giai đoạn pipeline" onClose={onClose}><form className="form" onSubmit={e=>{e.preventDefault();if(name)onSave({name,probability:Number(prob),rule})}}>
    <Field label="Tên giai đoạn" required><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Ví dụ: Demo sản phẩm"/></Field>
    <Field label="Xác suất thắng mặc định"><div className="input-suffix"><input type="number" min="0" max="100" value={prob} onChange={e=>setProb(e.target.value)}/><span>%</span></div></Field>
    <Field label="Điều kiện bắt buộc"><select value={rule} onChange={e=>setRule(e.target.value)}><option>Không yêu cầu</option><option>Có thông tin nhu cầu</option><option>Đã gửi đề xuất</option><option>Đã gửi báo giá</option><option>Có ít nhất 1 cuộc gặp</option><option>Đã xác nhận mua</option></select></Field>
    <div className="modal-actions"><button type="button" className="btn secondary" onClick={onClose}>Hủy</button><button className="btn primary">Thêm giai đoạn</button></div>
  </form></Modal>
}

function ReasonsTab({lossReasons,setLossReasons,winReasons,setWinReasons,competitors,setCompetitors,notify}) {
  const [newLoss,setNewLoss]=useState(""); const [newWin,setNewWin]=useState(""); const [newComp,setNewComp]=useState("");
  const add=(value,setValue,setList,list)=>{if(!value.trim())return;setList([...list,value.trim()]);setValue("");notify("Đã thêm danh mục")};
  const List=({title,items,setItems,value,setValue,placeholder})=><div className="reason-card"><div className="reason-head"><div><h3>{title}</h3><p>Dữ liệu bắt buộc khi đóng một cơ hội.</p></div><span>{items.length}</span></div><div className="tag-list">{items.map((x,i)=><div className="tag" key={x+i}>{x}<button onClick={()=>setItems(items.filter((_,idx)=>idx!==i))}><X size={14}/></button></div>)}</div><div className="add-inline"><input value={value} onChange={e=>setValue(e.target.value)} placeholder={placeholder} onKeyDown={e=>e.key==="Enter"&&add(value,setValue,setItems,items)}/><button className="btn secondary" onClick={()=>add(value,setValue,setItems,items)}><Plus size={15}/> Thêm</button></div></div>;
  return <section className="panel"><div className="panel-head"><div><h2>Lý do thắng, thua & đối thủ</h2><p>Chuẩn hóa dữ liệu để năm sau biết vì sao mất cơ hội và đối thủ nào thường xuất hiện.</p></div></div>
    <div className="mandatory-banner"><Check size={17}/><div><b>Dữ liệu bắt buộc khi đóng cơ hội</b><span>Người dùng phải chọn lý do thắng/thua và đối thủ nếu có trước khi chuyển cơ hội sang trạng thái đóng.</span></div></div>
    <div className="reason-grid">
      <List title="Lý do thắng" items={winReasons} setItems={setWinReasons} value={newWin} setValue={setNewWin} placeholder="Thêm lý do thắng..."/>
      <List title="Lý do thua" items={lossReasons} setItems={setLossReasons} value={newLoss} setValue={setNewLoss} placeholder="Thêm lý do thua..."/>
      <List title="Đối thủ cạnh tranh" items={competitors} setItems={setCompetitors} value={newComp} setValue={setNewComp} placeholder="Thêm đối thủ..."/>
    </div>
  </section>
}

function Modal({title,onClose,children}){return <div className="overlay" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>}
function Field({label,required,children}){return <label className="field"><span>{label}{required&&<em>*</em>}</span>{children}</label>}

createRoot(document.getElementById("root")).render(<App />);
