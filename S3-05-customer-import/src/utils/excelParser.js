import * as XLSX from 'xlsx';

/**
 * Bản đồ chuẩn hóa tên cột từ các biến thể tiếng Việt và tiếng Anh sang khóa chuẩn
 */
const COLUMN_ALIASES = {
  code: ['makhachhang', 'makh', 'code', 'customercode', 'madoanhnghiep', 'id'],
  name: ['tencongty', 'tenkhachhang', 'tenkh', 'companyname', 'customername', 'company', 'name', 'tendoanhnghiep'],
  taxCode: ['masothue', 'mst', 'taxcode', 'taxid', 'vatnumber', 'masothuedoanhnghiep'],
  email: ['email', 'emailcongty', 'emailkhachhang', 'homthu', 'contactemail'],
  phone: ['sodienthoai', 'sdt', 'dienthoai', 'phone', 'phonenumber', 'hotline', 'mobile'],
  address: ['diachi', 'diachitruso', 'address', 'diachicongty'],
  city: ['tinhthanhpho', 'tinh', 'thanhpho', 'city', 'province'],
  industry: ['nganhnghe', 'linhvuc', 'industry', 'sector'],
  contactPerson: ['nguoilienhe', 'nguoilienhechinh', 'contactperson', 'daidien', 'nguoidaidien'],
  assignedSales: ['nhanvienphutrach', 'salesrep', 'nhanvienkinhdoanh', 'nguoiphutrach', 'sales', 'owner']
};

/**
 * Chuẩn hóa chuỗi header để so khớp (bỏ dấu tiếng Việt, ký tự đặc biệt, khoảng trắng)
 */
function normalizeHeaderKey(key) {
  if (!key) return '';
  return String(key)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Tìm khóa chuẩn từ tên cột thô trong Excel
 */
function mapHeaderToKey(rawHeader) {
  const norm = normalizeHeaderKey(rawHeader);
  for (const [standardKey, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.includes(norm)) return standardKey;
  }
  return null;
}

/**
 * Kiểm tra định dạng Email hợp lệ
 */
export function isValidEmail(email) {
  if (!email) return true; // Cho phép rỗng nếu không bắt buộc
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim());
}

/**
 * Kiểm tra định dạng Mã số thuế (MST Việt Nam: 10 số hoặc 13 số, cho phép dấu gạch ngang phân tách chi nhánh)
 */
export function isValidTaxCode(taxCode) {
  if (!taxCode) return true;
  const clean = String(taxCode).replace(/[\s-]/g, '');
  return /^\d{10}(\d{3})?$/.test(clean);
}

/**
 * Kiểm tra định dạng Số điện thoại (9 đến 11 chữ số)
 */
export function isValidPhone(phone) {
  if (!phone) return true;
  const clean = String(phone).replace(/[\s().+-]/g, '');
  return /^\d{9,11}$/.test(clean);
}

/**
 * Kiểm tra tính hợp lệ của từng dòng và phát hiện lỗi theo từng ô
 */
export function validateRow(row) {
  const errors = {};

  // 1. Tên công ty: Bắt buộc, tối thiểu 3 ký tự
  if (!row.name || String(row.name).trim().length === 0) {
    errors.name = 'Tên công ty là thông tin bắt buộc, không được để trống';
  } else if (String(row.name).trim().length < 3) {
    errors.name = 'Tên công ty quá ngắn (tối thiểu 3 ký tự)';
  }

  // 2. Email: Nếu có thì phải đúng cú pháp
  if (row.email && !isValidEmail(row.email)) {
    errors.email = `Email không đúng định dạng chuẩn (ví dụ: contact@congty.com)`;
  }

  // 3. Số điện thoại: Nếu có thì phải là 9-11 chữ số
  if (row.phone && !isValidPhone(row.phone)) {
    errors.phone = `Số điện thoại không hợp lệ (yêu cầu từ 9 đến 11 chữ số)`;
  }

  // 4. Mã số thuế: Nếu có thì phải là 10 hoặc 13 số
  if (row.taxCode && !isValidTaxCode(row.taxCode)) {
    errors.taxCode = `Mã số thuế không hợp lệ (yêu cầu 10 hoặc 13 chữ số)`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Chuẩn hóa MST để so khớp (bỏ gạch ngang và khoảng trắng)
 */
function cleanTax(val) {
  if (!val) return '';
  return String(val).replace(/[\s-]/g, '').trim();
}

/**
 * Thuật toán phát hiện trùng lặp giữa dòng Excel và CSDL hiện có + trùng lặp nội bộ trong file
 */
export function detectDuplicates(rows, existingCustomers) {
  // Tạo Map tra cứu nhanh từ CSDL hiện có
  const taxMap = new Map();
  const emailMap = new Map();
  const phoneMap = new Map();
  const codeMap = new Map();
  const nameMap = new Map();

  existingCustomers.forEach(c => {
    if (c.taxCode) taxMap.set(cleanTax(c.taxCode), c);
    if (c.email) emailMap.set(String(c.email).toLowerCase().trim(), c);
    if (c.phone) phoneMap.set(String(c.phone).replace(/\D/g, ''), c);
    if (c.code) codeMap.set(String(c.code).toUpperCase().trim(), c);
    if (c.name) nameMap.set(String(c.name).toLowerCase().trim(), c);
  });

  // Track trùng lặp nội bộ trong file
  const fileTaxes = new Map();
  const fileEmails = new Map();

  return rows.map((row, index) => {
    const reasons = [];
    let matchedCustomer = null;
    let isInternalDuplicate = false;

    const rowCleanTax = cleanTax(row.taxCode);
    const rowCleanEmail = row.email ? String(row.email).toLowerCase().trim() : '';
    const rowCleanPhone = row.phone ? String(row.phone).replace(/\D/g, '') : '';
    const rowCleanCode = row.code ? String(row.code).toUpperCase().trim() : '';
    const rowCleanName = row.name ? String(row.name).toLowerCase().trim() : '';

    // 1. Kiểm tra trùng lặp với CSDL hiện có:
    // Trùng MST
    if (rowCleanTax && taxMap.has(rowCleanTax)) {
      matchedCustomer = taxMap.get(rowCleanTax);
      reasons.push(`Trùng Mã số thuế (${row.taxCode}) với [${matchedCustomer.id}] ${matchedCustomer.name}`);
    }
    // Trùng Email
    if (rowCleanEmail && emailMap.has(rowCleanEmail)) {
      const existing = emailMap.get(rowCleanEmail);
      if (!matchedCustomer) matchedCustomer = existing;
      reasons.push(`Trùng Email (${row.email}) với [${existing.id}] ${existing.name}`);
    }
    // Trùng Mã khách hàng
    if (rowCleanCode && codeMap.has(rowCleanCode)) {
      const existing = codeMap.get(rowCleanCode);
      if (!matchedCustomer) matchedCustomer = existing;
      reasons.push(`Trùng Mã khách hàng (${row.code}) với [${existing.id}] ${existing.name}`);
    }
    // Trùng Tên công ty 100%
    if (rowCleanName && nameMap.has(rowCleanName)) {
      const existing = nameMap.get(rowCleanName);
      if (!matchedCustomer) matchedCustomer = existing;
      reasons.push(`Trùng Tên công ty 100% với [${existing.id}] ${existing.name}`);
    }

    // 2. Kiểm tra trùng lặp nội bộ trong cùng tệp Excel
    if (rowCleanTax) {
      if (fileTaxes.has(rowCleanTax)) {
        isInternalDuplicate = true;
        reasons.push(`Trùng MST với dòng #${fileTaxes.get(rowCleanTax)} trong chính tệp này`);
      } else {
        fileTaxes.set(rowCleanTax, row.rowNumber || index + 2);
      }
    }

    if (rowCleanEmail) {
      if (fileEmails.has(rowCleanEmail)) {
        isInternalDuplicate = true;
        reasons.push(`Trùng Email với dòng #${fileEmails.get(rowCleanEmail)} trong chính tệp này`);
      } else {
        fileEmails.set(rowCleanEmail, row.rowNumber || index + 2);
      }
    }

    const isDuplicate = reasons.length > 0;

    return {
      ...row,
      isDuplicate,
      duplicateReasons: reasons,
      duplicateReason: reasons.join('; '),
      matchedCustomer,
      isInternalDuplicate,
      // Hành động mặc định cho bản ghi trùng: 'skip' (Bỏ qua) hoặc 'update' (Cập nhật)
      duplicateAction: row.duplicateAction || (isDuplicate ? 'skip' : 'create')
    };
  });
}

/**
 * Xử lý dữ liệu bảng thô sau khi đọc file (JSON object list)
 */
export function processRawExcelData(rawJson, existingCustomers) {
  if (!rawJson || rawJson.length === 0) return [];

  // 1. Phát hiện dòng tiêu đề
  const firstRow = rawJson[0];
  const headerMapping = {};

  Object.keys(firstRow).forEach(col => {
    const mapped = mapHeaderToKey(col);
    if (mapped) headerMapping[col] = mapped;
  });

  // 2. Chuyển đổi dữ liệu từng dòng
  const parsedRows = rawJson.map((row, idx) => {
    const standardized = {
      rowNumber: idx + 2, // Dòng tính từ dòng 2 (sau Header dòng 1 trong Excel)
      code: '',
      name: '',
      taxCode: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      industry: '',
      contactPerson: '',
      assignedSales: ''
    };

    Object.entries(row).forEach(([colKey, val]) => {
      const mappedKey = headerMapping[colKey] || mapHeaderToKey(colKey);
      if (mappedKey) {
        standardized[mappedKey] = val !== undefined && val !== null ? String(val).trim() : '';
      }
    });

    // Nếu không có mã thì tự sinh mã tạm
    if (!standardized.code) {
      standardized.code = `KH-IMP-${String(idx + 1).padStart(3, '0')}`;
    }

    // Validate dòng này
    const { isValid, errors } = validateRow(standardized);

    return {
      ...standardized,
      isValid,
      errors
    };
  });

  // 3. Chạy phát hiện trùng lặp
  return detectDuplicates(parsedRows, existingCustomers);
}

/**
 * Đọc file thực tế tải lên từ trình duyệt (.xlsx, .xls, .csv)
 */
export async function parseUploadedFile(file, existingCustomers) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Đọc sang dạng JSON header tự động
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          reject(new Error('Tệp không chứa dữ liệu hoặc bảng tính trống.'));
          return;
        }

        const processed = processRawExcelData(rawJson, existingCustomers);
        resolve({
          fileName: file.name,
          sheetName: firstSheetName,
          totalRows: processed.length,
          rows: processed
        });
      } catch (err) {
        reject(new Error(`Không thể phân tích tệp Excel/CSV: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Lỗi khi đọc tệp từ thiết bị.'));
    reader.readAsArrayBuffer(file);
  });
}
