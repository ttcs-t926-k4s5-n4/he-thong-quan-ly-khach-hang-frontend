import { useState } from "react";
import * as XLSX from "xlsx";
import {
  AlertCircle,
  Download,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

function ExcelLeadImport({ leads, onImportLeads, onNotify }) {
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState([]);

  function downloadTemplate() {
    const sample = [
      {
        "Họ tên": "Nguyễn Văn A",
        Email: "vana@example.com",
        "Số điện thoại": "0912345678",
        "Công ty": "Công ty ABC",
        "Nhu cầu quan tâm": "Phần mềm CRM",
        "Chiến dịch": "Chiến dịch tháng 10",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "lead_import_template.xlsx");

    onNotify("Đã tạo file Excel mẫu.");
  }

  function readExcel(event) {
    const file = event.target.files?.[0];

    setErrors([]);
    setPreviewRows([]);
    setFileName("");

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      onNotify("Vui lòng chọn file .xlsx hoặc .xls.", "error");
      event.target.value = "";
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, {
          type: "array",
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(firstSheet, {
          defval: "",
          raw: false,
        });

        if (!rows.length) {
          onNotify("File Excel chưa có dữ liệu.", "error");
          return;
        }

        const existingEmails = new Set(
          leads.map((lead) => lead.email.toLowerCase())
        );

        const batchEmails = new Set();
        const validRows = [];
        const rowErrors = [];

        rows.forEach((row, index) => {
          const name = String(row["Họ tên"] || "").trim();
          const email = String(row["Email"] || "").trim().toLowerCase();
          const phone = String(row["Số điện thoại"] || "").trim();
          const company = String(row["Công ty"] || "").trim();
          const interest = String(row["Nhu cầu quan tâm"] || "").trim();
          const campaign = String(row["Chiến dịch"] || "").trim();

          if (!name || !email || !phone || !company || !interest) {
            rowErrors.push(
              `Dòng ${index + 2}: Thiếu trường thông tin bắt buộc.`
            );
            return;
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            rowErrors.push(`Dòng ${index + 2}: Email không hợp lệ.`);
            return;
          }

          if (existingEmails.has(email) || batchEmails.has(email)) {
            rowErrors.push(
              `Dòng ${index + 2}: Email đã tồn tại hoặc bị trùng.`
            );
            return;
          }

          existingEmails.add(email);
          batchEmails.add(email);

          validRows.push({
            name,
            email,
            phone,
            company,
            interest,
            campaign: campaign || "Chưa phân chiến dịch",
            source: "Excel",
            status: "Mới",
          });
        });

        setPreviewRows(validRows);
        setErrors(rowErrors);

        if (validRows.length) {
          onNotify(
            `Đọc được ${validRows.length} Lead hợp lệ. Hãy kiểm tra trước khi nhập.`
          );
        } else {
          onNotify("Không có dòng dữ liệu hợp lệ.", "error");
        }
      } catch {
        onNotify("Không thể đọc file Excel. Hãy kiểm tra lại file.", "error");
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = "";
  }

  function confirmImport() {
    if (!previewRows.length) {
      onNotify("Không có dữ liệu để nhập.", "error");
      return;
    }

    const imported = previewRows.map((row, index) => ({
      ...row,
      id: Date.now() + index,
    }));

    onImportLeads(imported);
    setPreviewRows([]);
    setErrors([]);

    onNotify(`Đã nhập thành công ${imported.length} Lead.`);
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Nhập Lead từ Excel</h3>
          <p>Tải file mẫu, chọn file và xem trước dữ liệu trước khi nhập</p>
        </div>
        <button className="btn secondary" onClick={downloadTemplate}>
          <Download size={17} />
          Tải file mẫu
        </button>
      </div>

      <label className="upload-area">
        <Upload size={34} />
        <strong>Chọn file Excel để nhập dữ liệu</strong>
        <span>Hỗ trợ định dạng .xlsx và .xls</span>
        <span className="btn primary">Chọn file</span>
        <input type="file" accept=".xlsx,.xls" onChange={readExcel} />
      </label>

      {fileName && (
        <p className="file-name">
          <FileSpreadsheet size={17} />
          {fileName}
        </p>
      )}

      <div className="info-box">
        <AlertCircle size={19} />
        <div>
          <strong>Định dạng file yêu cầu</strong>
          <p>
            Các cột bắt buộc: Họ tên, Email, Số điện thoại, Công ty, Nhu cầu
            quan tâm. Cột Chiến dịch là tùy chọn.
          </p>
        </div>
      </div>

      {previewRows.length > 0 && (
        <section className="preview-section">
          <div className="panel-heading">
            <div>
              <h3>Xem trước dữ liệu hợp lệ</h3>
              <p>{previewRows.length} dòng sẵn sàng nhập</p>
            </div>
            <button className="btn primary" onClick={confirmImport}>
              Xác nhận nhập
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Công ty</th>
                  <th>Chiến dịch</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => (
                  <tr key={`${row.email}-${index}`}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.company}</td>
                    <td>{row.campaign}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {errors.length > 0 && (
        <div className="error-list">
          <strong>Các dòng chưa được nhập ({errors.length})</strong>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </section>
  );
}

export default ExcelLeadImport;