import { useState } from "react";
import { Code2, Copy } from "lucide-react";

const blankForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  interest: "",
};

function EmbeddedLeadForm({ onSubmitLead, onNotify }) {
  const [embedUrl, setEmbedUrl] = useState("");
  const [publicForm, setPublicForm] = useState(blankForm);
  const embedCode = `<iframe src="${embedUrl || "https://your-domain.example/lead-form"}" title="Đăng ký tư vấn" width="100%" height="600"></iframe>`;

  function updatePublicForm(event) {
    const { name, value } = event.target;
    setPublicForm((previous) => ({ ...previous, [name]: value }));
  }

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(embedCode);
      onNotify("Đã sao chép mã nhúng.");
    } catch {
      onNotify(
        "Trình duyệt không cho phép sao chép tự động. Hãy chọn mã và nhấn Ctrl+C.",
        "error"
      );
    }
  }

  function submitPublicForm(event) {
    event.preventDefault();

    if (onSubmitLead(publicForm)) {
      setPublicForm(blankForm);
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Biểu mẫu thu thập Lead</h3>
          <p>Tạo mã nhúng và xem trước biểu mẫu đăng ký tư vấn</p>
        </div>
      </div>

      <div className="field embed-url-field">
        <label>Địa chỉ biểu mẫu đã triển khai (tùy chọn)</label>
        <input
          value={embedUrl}
          onChange={(event) => setEmbedUrl(event.target.value)}
          placeholder="https://ten-mien-cua-ban.vn/lead-form"
        />
      </div>

      <div className="info-box">
        <Code2 size={20} />
        <div>
          <strong>Mã iframe để nhúng vào website</strong>
          <p>Thay địa chỉ mẫu bằng URL biểu mẫu thực tế đã triển khai.</p>
        </div>
      </div>

      <pre className="code-area">{embedCode}</pre>

      <button className="btn primary" onClick={copyEmbed}>
        <Copy size={17} />
        Sao chép mã nhúng
      </button>

      <div className="form-preview">
        <span className="eyebrow">FORM PREVIEW</span>
        <h3>Đăng ký nhận tư vấn</h3>
        <p>Để lại thông tin để đội ngũ Marketing liên hệ với bạn.</p>

        <form className="form-grid" onSubmit={submitPublicForm}>
          <LeadFormField
            label="Họ và tên *"
            name="name"
            value={publicForm.name}
            onChange={updatePublicForm}
            placeholder="Nguyễn Văn A"
            required
          />
          <LeadFormField
            label="Email *"
            name="email"
            type="email"
            value={publicForm.email}
            onChange={updatePublicForm}
            placeholder="email@congty.com"
            required
          />
          <LeadFormField
            label="Số điện thoại *"
            name="phone"
            value={publicForm.phone}
            onChange={updatePublicForm}
            placeholder="0912345678"
            required
          />
          <LeadFormField
            label="Công ty *"
            name="company"
            value={publicForm.company}
            onChange={updatePublicForm}
            placeholder="Tên công ty"
            required
          />
          <LeadFormField
            label="Nhu cầu quan tâm *"
            name="interest"
            value={publicForm.interest}
            onChange={updatePublicForm}
            placeholder="Nhu cầu tư vấn"
            required
          />
          <div className="form-actions">
            <button className="btn primary" type="submit">
              Gửi thông tin
            </button>
          </div>
        </form>
        <p className="muted">
          Đây là biểu mẫu thử nghiệm trong ứng dụng React hiện tại.
        </p>
      </div>

      <p className="muted">
        Lưu ý: giới hạn gửi trong bản demo chỉ hoạt động ở trình duyệt hiện tại.
        Khi triển khai thực tế, cần chống spam và giới hạn tần suất tại Backend
        để bảo vệ hệ thống.
      </p>
    </section>
  );
}

function LeadFormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default EmbeddedLeadForm;