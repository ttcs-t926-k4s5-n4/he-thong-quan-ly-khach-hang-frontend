import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

function ImportUsers() {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  // Kiểm tra dữ liệu từng dòng
  const validateRow = (row) => {
    const errors = [];

    const fullName = String(row["Họ tên"] || "").trim();
    const email = String(row["Email"] || "").trim();
    const phone = String(row["Số điện thoại"] || "").trim();

    if (!fullName) {
      errors.push("Thiếu họ tên");
    }

    if (!email) {
      errors.push("Thiếu email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Email không hợp lệ");
    }

    if (!phone) {
      errors.push("Thiếu số điện thoại");
    } else if (!/^(03|05|07|08|09)[0-9]{8}$/.test(phone)) {
      errors.push("Số điện thoại không hợp lệ");
    }

    return errors;
  };

  // Tải file Excel mẫu
  const downloadTemplate = () => {
    const templateData = [
      {
        "Họ tên": "Nguyễn Văn A",
        Email: "nguyenvana@gmail.com",
        "Số điện thoại": "0987654321",
      },
      {
        "Họ tên": "Trần Thị B",
        Email: "tranthib@gmail.com",
        "Số điện thoại": "0912345678",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    XLSX.writeFile(
      workbook,
      "mau-import-nguoi-dung.xlsx"
    );
  };

  // Đọc file Excel
  const handleFile = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setMessage("");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(
          e.target.result,
          {
            type: "array",
          }
        );

        const firstSheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[firstSheetName];

        const data =
          XLSX.utils.sheet_to_json(
            worksheet,
            {
              defval: "",
            }
          );

        if (data.length === 0) {
          setRows([]);
          setMessage(
            "File Excel không có dữ liệu."
          );
          return;
        }

        const validatedRows = data.map(
          (row, index) => {
            const errors = validateRow(row);

            return {
              ...row,
              rowNumber: index + 2,
              errors,
              valid: errors.length === 0,
            };
          }
        );

        setRows(validatedRows);
      } catch (error) {
        console.error(error);

        setRows([]);

        setMessage(
          "Không thể đọc file Excel. Vui lòng kiểm tra lại file."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Import các dòng hợp lệ
  const handleImport = () => {
    const validRows = rows.filter(
      (row) => row.valid
    );

    const invalidRows = rows.filter(
      (row) => !row.valid
    );

    if (validRows.length === 0) {
      setMessage(
        "Không có dòng dữ liệu hợp lệ để import."
      );
      return;
    }

    /*
      Tạm thời lưu dữ liệu vào localStorage.
      Sau này khi có backend/API,
      phần này sẽ được thay bằng API POST.
    */
    const existingUsers =
      JSON.parse(
        localStorage.getItem("crmUsers") || "[]"
      );

    const usersToSave = validRows.map(
      (row) => ({
        fullName: row["Họ tên"],
        email: row["Email"],
        phone: String(
          row["Số điện thoại"]
        ),
      })
    );

    localStorage.setItem(
      "crmUsers",
      JSON.stringify([
        ...existingUsers,
        ...usersToSave,
      ])
    );

    setMessage(
      `Import thành công ${validRows.length} dòng. Đã bỏ qua ${invalidRows.length} dòng lỗi.`
    );
  };

  const totalRows = rows.length;

  const validRows = rows.filter(
    (row) => row.valid
  ).length;

  const invalidRows = rows.filter(
    (row) => !row.valid
  ).length;

  return (
    <div className="import-container">

      {/* Hướng dẫn */}
      <div className="card import-card">
        <div className="section-title">
          <div>
            <h2>Import người dùng</h2>

            <p>
              Import danh sách người dùng từ
              file Excel vào hệ thống CRM.
            </p>
          </div>

          <FileSpreadsheet
            size={30}
            className="section-icon"
          />
        </div>

        <div className="import-actions">

          <button
            className="btn btn-secondary"
            onClick={downloadTemplate}
          >
            <Download size={18} />
            Tải file mẫu
          </button>

          <label className="btn btn-primary">
            <Upload size={18} />
            Chọn file Excel

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFile}
              hidden
            />
          </label>

        </div>

        {fileName && (
          <div className="selected-file">
            <FileSpreadsheet size={18} />

            <span>
              File đã chọn:
              <strong> {fileName}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Thống kê */}
      {rows.length > 0 && (
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              <FileSpreadsheet size={20} />
            </div>

            <div>
              <span>Tổng số dòng</span>
              <strong>{totalRows}</strong>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Dữ liệu hợp lệ</span>
              <strong>{validRows}</strong>
            </div>
          </div>

          <div className="stat-card error">
            <div className="stat-icon">
              <XCircle size={20} />
            </div>

            <div>
              <span>Dữ liệu lỗi</span>
              <strong>{invalidRows}</strong>
            </div>
          </div>

        </div>
      )}

      {/* Thông báo */}
      {message && (
        <div className="message-box">
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      {/* Preview */}
      {rows.length > 0 && (
        <div className="card preview-card">

          <div className="section-title">
            <div>
              <h2>Xem trước dữ liệu</h2>

              <p>
                Kiểm tra dữ liệu trước khi
                import vào hệ thống.
              </p>
            </div>
          </div>

          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Dòng</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Lỗi</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.rowNumber}>

                    <td>
                      {row.rowNumber}
                    </td>

                    <td>
                      {row["Họ tên"] || "-"}
                    </td>

                    <td>
                      {row["Email"] || "-"}
                    </td>

                    <td>
                      {row["Số điện thoại"] || "-"}
                    </td>

                    <td>
                      {row.valid ? (
                        <span className="status valid">
                          <CheckCircle2 size={15} />
                          Hợp lệ
                        </span>
                      ) : (
                        <span className="status invalid">
                          <XCircle size={15} />
                          Lỗi
                        </span>
                      )}
                    </td>

                    <td>
                      {row.errors.length > 0 ? (
                        <div className="error-list">
                          {row.errors.map(
                            (error, index) => (
                              <span key={index}>
                                {error}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="no-error">
                          Không có lỗi
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          <div className="preview-footer">

            <div>
              <strong>
                {validRows}
              </strong>{" "}
              dòng hợp lệ sẽ được import.
              {" "}
              <strong>
                {invalidRows}
              </strong>{" "}
              dòng lỗi sẽ được bỏ qua.
            </div>

            <button
              className="btn btn-success"
              onClick={handleImport}
              disabled={validRows === 0}
            >
              <Upload size={18} />
              Import dữ liệu
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ImportUsers;