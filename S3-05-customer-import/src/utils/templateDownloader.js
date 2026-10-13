import * as XLSX from 'xlsx';

/**
 * Tải xuống tệp mẫu Excel chuẩn (.xlsx) với 2 Sheets: Dữ liệu mẫu & Hướng dẫn nhập liệu
 */
export function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Dữ liệu mẫu khách hàng
  const sampleData = [
    {
      'Mã khách hàng': 'KH-EXCEL-001',
      'Tên công ty / Khách hàng (*)': 'Công ty Cổ phần Chứng khoán SSI',
      'Mã số thuế': '0101495108',
      'Email liên hệ': 'contact@ssi.com.vn',
      'Số điện thoại': '02439366390',
      'Địa chỉ trụ sở': '1C Ngô Quyền, Hoàn Kiếm',
      'Tỉnh / Thành phố': 'Hà Nội',
      'Ngành nghề / Lĩnh vực': 'Tài chính & Chứng khoán',
      'Người liên hệ chính': 'Nguyễn Duy Hưng',
      'Nhân viên phụ trách': 'Nguyễn Hoàng Nam'
    },
    {
      'Mã khách hàng': 'KH-EXCEL-002',
      'Tên công ty / Khách hàng (*)': 'Tập đoàn Điện lực Việt Nam (EVN)',
      'Mã số thuế': '0100100079',
      'Email liên hệ': 'evn@evn.com.vn',
      'Số điện thoại': '02466946666',
      'Địa chỉ trụ sở': 'Số 11 Cửa Bắc, Ba Đình',
      'Tỉnh / Thành phố': 'Hà Nội',
      'Ngành nghề / Lĩnh vực': 'Năng lượng & Điện lực',
      'Người liên hệ chính': 'Đặng Hoàng An',
      'Nhân viên phụ trách': 'Trần Thị Mai Linh'
    },
    {
      'Mã khách hàng': 'KH-EXCEL-003',
      'Tên công ty / Khách hàng (*)': 'Công ty Cổ phần Hàng không Vietjet',
      'Mã số thuế': '0102325379',
      'Email liên hệ': 'info@vietjetair.com',
      'Số điện thoại': '02835471866',
      'Địa chỉ trụ sở': '302 Kim Mã, Ngọc Khánh, Ba Đình',
      'Tỉnh / Thành phố': 'Hà Nội',
      'Ngành nghề / Lĩnh vực': 'Hàng không',
      'Người liên hệ chính': 'Nguyễn Thị Phương Thảo',
      'Nhân viên phụ trách': 'Lê Hồng Quân'
    },
    {
      'Mã khách hàng': 'KH-EXCEL-004',
      'Tên công ty / Khách hàng (*)': 'Tập đoàn Dệt May Việt Nam (Vinatex)',
      'Mã số thuế': '0100100127',
      'Email liên hệ': 'info@vinatex.com.vn',
      'Số điện thoại': '02438257008',
      'Địa chỉ trụ sở': '25 Bà Triệu, Hoàn Kiếm',
      'Tỉnh / Thành phố': 'Hà Nội',
      'Ngành nghề / Lĩnh vực': 'Dệt may & Thời trang',
      'Người liên hệ chính': 'Lê Tiến Trường',
      'Nhân viên phụ trách': 'Đặng Thùy Dung'
    },
    {
      'Mã khách hàng': 'KH-EXCEL-005',
      'Tên công ty / Khách hàng (*)': 'Công ty Cổ phần Vàng bạc Đá quý PNJ',
      'Mã số thuế': '0300521758',
      'Email liên hệ': 'pnj@pnj.com.vn',
      'Số điện thoại': '02839951703',
      'Địa chỉ trụ sở': '170E Phan Đăng Lưu, Phú Nhuận',
      'Tỉnh / Thành phố': 'TP. Hồ Chí Minh',
      'Ngành nghề / Lĩnh vực': 'Bán lẻ & Trang sức',
      'Người liên hệ chính': 'Cao Thị Ngọc Dung',
      'Nhân viên phụ trách': 'Nguyễn Hoàng Nam'
    }
  ];

  const wsData = XLSX.utils.json_to_sheet(sampleData);

  // Đặt độ rộng các cột cho đẹp mắt
  wsData['!cols'] = [
    { wch: 18 }, // Mã khách hàng
    { wch: 40 }, // Tên công ty
    { wch: 16 }, // MST
    { wch: 28 }, // Email
    { wch: 18 }, // SĐT
    { wch: 38 }, // Địa chỉ
    { wch: 20 }, // Tỉnh/Thành
    { wch: 26 }, // Ngành nghề
    { wch: 24 }, // Người liên hệ
    { wch: 22 }  // Nhân viên phụ trách
  ];

  XLSX.utils.book_append_sheet(wb, wsData, 'Danh_Sach_Khach_Hang');

  // Sheet 2: Hướng dẫn nhập liệu
  const instructionData = [
    {
      'Tên cột': 'Mã khách hàng',
      'Bắt buộc': 'Không',
      'Định dạng': 'Chuỗi ký tự (Vd: KH-001, SSI-01)',
      'Ghi chú': 'Nếu để trống, hệ thống sẽ tự động cấp mã theo định dạng KH-IMP-xxx'
    },
    {
      'Tên cột': 'Tên công ty / Khách hàng (*)',
      'Bắt buộc': 'CÓ (*)',
      'Định dạng': 'Chuỗi văn bản (Tối thiểu 3 ký tự)',
      'Ghi chú': 'Bắt buộc không được để trống. Dùng để định danh doanh nghiệp trên hệ thống CRM'
    },
    {
      'Tên cột': 'Mã số thuế',
      'Bắt buộc': 'Khuyến nghị',
      'Định dạng': '10 chữ số (công ty) hoặc 13 số (chi nhánh)',
      'Ghi chú': 'Hệ thống dùng MST để phát hiện trùng lặp hồ sơ khách hàng giữa các nhân viên kinh doanh'
    },
    {
      'Tên cột': 'Email liên hệ',
      'Bắt buộc': 'Không',
      'Định dạng': 'Email chuẩn (user@domain.com)',
      'Ghi chú': 'Bắt buộc phải đúng định dạng email nếu có nhập. Dùng để gửi thư chào giá tự động'
    },
    {
      'Tên cột': 'Số điện thoại',
      'Bắt buộc': 'Không',
      'Định dạng': '9 đến 11 chữ số (024..., 028..., 09...)',
      'Ghi chú': 'Chỉ chứa các chữ số, không chứa ký tự chữ cái'
    },
    {
      'Tên cột': 'Địa chỉ trụ sở',
      'Bắt buộc': 'Không',
      'Định dạng': 'Chuỗi văn bản',
      'Ghi chú': 'Địa chỉ đăng ký kinh doanh hoặc văn phòng giao dịch'
    },
    {
      'Tên cột': 'Tỉnh / Thành phố',
      'Bắt buộc': 'Không',
      'Định dạng': 'Hà Nội, TP. Hồ Chí Minh, Đà Nẵng...',
      'Ghi chú': 'Dùng để phân chia địa bàn kinh doanh theo khu vực miền Bắc/Trung/Nam'
    },
    {
      'Tên cột': 'Ngành nghề / Lĩnh vực',
      'Bắt buộc': 'Không',
      'Định dạng': 'Công nghệ, Ngân hàng, Bán lẻ...',
      'Ghi chú': 'Phân loại khách hàng mục tiêu'
    },
    {
      'Tên cột': 'Người liên hệ chính',
      'Bắt buộc': 'Không',
      'Định dạng': 'Họ và tên người đại diện/đầu mối',
      'Ghi chú': 'Giám đốc, Kế toán trưởng, Trưởng phòng mua hàng...'
    },
    {
      'Tên cột': 'Nhân viên phụ trách',
      'Bắt buộc': 'Không',
      'Định dạng': 'Tên nhân viên kinh doanh',
      'Ghi chú': 'Nếu để trống, hệ thống sẽ gán cho nhân viên đang trực tiếp thực hiện import'
    }
  ];

  const wsInstruction = XLSX.utils.json_to_sheet(instructionData);
  wsInstruction['!cols'] = [
    { wch: 30 },
    { wch: 14 },
    { wch: 45 },
    { wch: 60 }
  ];

  XLSX.utils.book_append_sheet(wb, wsInstruction, 'Huong_Dan_Nhap_Lieu');

  // Xuất file và kích hoạt tải về
  XLSX.writeFile(wb, 'Mau_Nhap_Khach_Hang_CRM_Enterprise.xlsx');
}

/**
 * Tải xuống tệp mẫu định dạng CSV có UTF-8 BOM
 */
export function downloadCsvTemplate() {
  const csvContent =
    '\uFEFF' + // UTF-8 BOM để Excel hiển thị đúng tiếng Việt
    'Mã khách hàng,Tên công ty / Khách hàng (*),Mã số thuế,Email liên hệ,Số điện thoại,Địa chỉ trụ sở,Tỉnh / Thành phố,Ngành nghề / Lĩnh vực,Người liên hệ chính,Nhân viên phụ trách\n' +
    'KH-EXCEL-001,Công ty Cổ phần Chứng khoán SSI,0101495108,contact@ssi.com.vn,02439366390,1C Ngô Quyền,Hà Nội,Tài chính & Chứng khoán,Nguyễn Duy Hưng,Nguyễn Hoàng Nam\n' +
    'KH-EXCEL-002,Tập đoàn Điện lực Việt Nam (EVN),0100100079,evn@evn.com.vn,02466946666,Số 11 Cửa Bắc,Hà Nội,Năng lượng & Điện lực,Đặng Hoàng An,Trần Thị Mai Linh\n' +
    'KH-EXCEL-003,Công ty Cổ phần Hàng không Vietjet,0102325379,info@vietjetair.com,02835471866,302 Kim Mã,Hà Nội,Hàng không,Nguyễn Thị Phương Thảo,Lê Hồng Quân\n' +
    'KH-EXCEL-004,Tập đoàn Dệt May Việt Nam (Vinatex),0100100127,info@vinatex.com.vn,02438257008,25 Bà Triệu,Hà Nội,Dệt may & Thời trang,Lê Tiến Trường,Đặng Thùy Dung\n' +
    'KH-EXCEL-005,Công ty Cổ phần Vàng bạc Đá quý PNJ,0300521758,pnj@pnj.com.vn,02839951703,170E Phan Đăng Lưu,TP. Hồ Chí Minh,Bán lẻ & Trang sức,Cao Thị Ngọc Dung,Nguyễn Hoàng Nam\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Mau_Nhap_Khach_Hang_CRM.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
