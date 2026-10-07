/**
 * Bộ dữ liệu mẫu tích hợp sẵn để kiểm thử nhanh 1-Click
 * Giúp người kiểm thử/giảng viên/khách hàng kiểm tra ngay lập tức các kịch bản của đề bài
 */

export const mockPresetFiles = [
  {
    id: 'preset-duplicates',
    name: 'Danh_sach_khach_hang_co_ban_ghi_trung.xlsx',
    badge: 'Kịch bản 1: Có bản ghi trùng',
    description: 'Bao gồm 8 dòng: 4 khách hàng mới và 4 khách hàng trùng lặp với CSDL hiện có (FPT, Viettel, Vinamilk và trùng nội bộ file).',
    rows: [
      {
        rowNumber: 2,
        code: 'KH-NEW-001',
        name: 'Công ty Cổ phần Chứng khoán SSI',
        taxCode: '0101495108',
        email: 'contact@ssi.com.vn',
        phone: '02439366390',
        address: '1C Ngô Quyền, Hoàn Kiếm',
        city: 'Hà Nội',
        industry: 'Dịch vụ Tài chính & Chứng khoán',
        contactPerson: 'Nguyễn Duy Hưng',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 3,
        code: 'KH-DUP-FPT',
        name: 'FPT Information System (FPT IS)',
        taxCode: '0101248141', // Trùng MST với FPT Corporation (KH-001)
        email: 'contact.fptis@fpt.com.vn',
        phone: '02473007373',
        address: 'Tòa nhà Keangnam Landmark 72, Nam Từ Liêm',
        city: 'Hà Nội',
        industry: 'Tích hợp Hệ thống & CNTT',
        contactPerson: 'Nguyễn Văn Khoa',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 4,
        code: 'KH-NEW-002',
        name: 'Tập đoàn Dệt May Việt Nam (Vinatex)',
        taxCode: '0100100127',
        email: 'info@vinatex.com.vn',
        phone: '02438257008',
        address: '25 Bà Triệu, Hàng Bài, Hoàn Kiếm',
        city: 'Hà Nội',
        industry: 'Dệt may & Xuất khẩu',
        contactPerson: 'Lê Tiến Trường',
        assignedSales: 'Trần Thị Mai Linh'
      },
      {
        rowNumber: 5,
        code: 'KH-DUP-VTL',
        name: 'Tổng Công ty Viễn thông Viettel',
        taxCode: '0100109106', // Trùng MST với Viettel (KH-002)
        email: 'cskh_vietteltelecom@viettel.com.vn',
        phone: '02462556789',
        address: 'Số 1 Giang Văn Minh, Ba Đình',
        city: 'Hà Nội',
        industry: 'Viễn thông di động',
        contactPerson: 'Hoàng Sơn',
        assignedSales: 'Trần Thị Mai Linh'
      },
      {
        rowNumber: 6,
        code: 'KH-NEW-003',
        name: 'Công ty Cổ phần Hàng không Vietjet',
        taxCode: '0102325379',
        email: 'info@vietjetair.com',
        phone: '02835471866',
        address: '302 Kim Mã, Ngọc Khánh, Ba Đình',
        city: 'Hà Nội',
        industry: 'Hàng không',
        contactPerson: 'Nguyễn Thị Phương Thảo',
        assignedSales: 'Lê Hồng Quân'
      },
      {
        rowNumber: 7,
        code: 'KH-DUP-VNM',
        name: 'Nhà máy Sữa Thống Nhất - Chi nhánh Vinamilk',
        taxCode: '0300588569', // Trùng MST và Email với Vinamilk (KH-004)
        email: 'vinamilk@vinamilk.com.vn',
        phone: '02854155555',
        address: '12 Đặng Văn Bi, Thủ Đức',
        city: 'TP. Hồ Chí Minh',
        industry: 'Sản xuất thực phẩm',
        contactPerson: 'Nguyễn Quốc Khánh',
        assignedSales: 'Đặng Thùy Dung'
      },
      {
        rowNumber: 8,
        code: 'KH-NEW-004',
        name: 'Công ty Cổ phần Tập đoàn Gelex',
        taxCode: '0100100514',
        email: 'gelex@gelex.vn',
        phone: '02439364440',
        address: '52 Lê Đại Hành, Hai Bà Trưng',
        city: 'Hà Nội',
        industry: 'Thiết bị điện & Hạ tầng',
        contactPerson: 'Nguyễn Văn Tuấn',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 9,
        code: 'KH-DUP-INFILE',
        name: 'Công ty Cổ phần Chứng khoán SSI - Chi nhánh miền Nam',
        taxCode: '0101495108', // Trùng lặp nội bộ trong file với dòng 2 (SSI)
        email: 'contact_hcm@ssi.com.vn',
        phone: '02838218619',
        address: '72 Nguyễn Huệ, Bến Nghé, Quận 1',
        city: 'TP. Hồ Chí Minh',
        industry: 'Dịch vụ Tài chính',
        contactPerson: 'Nguyễn Hồng Nam',
        assignedSales: 'Lê Hồng Quân'
      }
    ]
  },
  {
    id: 'preset-errors',
    name: 'Danh_sach_khach_hang_co_loi_dinh_dang.xlsx',
    badge: 'Kịch bản 2: Báo lỗi từng dòng',
    description: 'Bao gồm 7 dòng: Có các dòng lỗi thiếu tên công ty, sai định dạng email, sai định dạng SĐT, mã số thuế không hợp lệ để kiểm thử báo lỗi theo từng dòng và sửa trực tiếp.',
    rows: [
      {
        rowNumber: 2,
        code: 'KH-ERR-001',
        name: '', // LỖI: Tên công ty bị trống (Bắt buộc)
        taxCode: '0108923411',
        email: 'info@congtyabc.vn',
        phone: '0988123456',
        address: 'Số 15 Lê Văn Lương, Thanh Xuân',
        city: 'Hà Nội',
        industry: 'Thương mại điện tử',
        contactPerson: 'Trần Văn An',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 3,
        code: 'KH-ERR-002',
        name: 'Công ty TNHH Đầu tư Thương mại Khang Điền',
        taxCode: '0303651234',
        email: 'khangdien.corp@gmail', // LỖI: Sai định dạng Email (thiếu đuôi domain .com/.vn)
        phone: '0912345678',
        address: 'Phòng 602, Tòa nhà Centre Point, Phú Nhuận',
        city: 'TP. Hồ Chí Minh',
        industry: 'Bất động sản',
        contactPerson: 'Lý Điền Sơn',
        assignedSales: 'Trần Thị Mai Linh'
      },
      {
        rowNumber: 4,
        code: 'KH-ERR-003',
        name: 'Công ty Cổ phần Công nghệ CyberSoft',
        taxCode: '0109988776',
        email: 'contact@cybersoft.edu.vn',
        phone: '0981234', // LỖI: SĐT chỉ có 7 số (cần 10 chữ số hợp lệ)
        address: '112 Cao Thắng, Quận 3',
        city: 'TP. Hồ Chí Minh',
        industry: 'Đào tạo công nghệ',
        contactPerson: 'Phạm Minh Tuấn',
        assignedSales: 'Lê Hồng Quân'
      },
      {
        rowNumber: 5,
        code: 'KH-ERR-004',
        name: 'Tập đoàn Năng lượng Xanh Global Green',
        taxCode: 'MST-12345', // LỖI: Mã số thuế chứa chữ cái, không đúng quy chuẩn 10 hoặc 13 số
        email: 'green@energy.vn',
        phone: '0903888999',
        address: 'Tòa nhà Landmark 81, Bình Thạnh',
        city: 'TP. Hồ Chí Minh',
        industry: 'Năng lượng tái tạo',
        contactPerson: 'David Miller',
        assignedSales: 'Đặng Thùy Dung'
      },
      {
        rowNumber: 6,
        code: 'KH-VALID-001',
        name: 'Ngân hàng TMCP Quân đội (MBBank)',
        taxCode: '0100283873',
        email: 'mb247@mbbank.com.vn',
        phone: '02437674050',
        address: 'Số 18 Lê Văn Lương, Cầu Giấy',
        city: 'Hà Nội',
        industry: 'Tài chính - Ngân hàng',
        contactPerson: 'Lưu Trung Thái',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 7,
        code: 'KH-ERR-005',
        name: 'AB', // LỖI: Tên quá ngắn (< 3 ký tự)
        taxCode: '0103456789',
        email: 'sai-email-khong-co-a-cong', // LỖI: Email không có @
        phone: '0900ABCXYZ', // LỖI: SĐT chứa ký tự chữ cái
        address: 'Chưa cập nhật',
        city: 'Đà Nẵng',
        industry: 'Chưa phân loại',
        contactPerson: '',
        assignedSales: 'Lê Hồng Quân'
      },
      {
        rowNumber: 8,
        code: 'KH-VALID-002',
        name: 'Công ty Cổ phần Dược Hậu Giang (DHG Pharma)',
        taxCode: '1800156801',
        email: 'dhgpharma@dhgpharma.com.vn',
        phone: '02923891433',
        address: '288 Nguyễn Văn Cừ, An Hòa, Ninh Kiều',
        city: 'Cần Thơ',
        industry: 'Dược phẩm & Y tế',
        contactPerson: 'Đoàn Đình Duy Khương',
        assignedSales: 'Đặng Thùy Dung'
      }
    ]
  },
  {
    id: 'preset-perfect',
    name: 'Danh_sach_khach_hang_chuan_100.xlsx',
    badge: 'Kịch bản 3: Tệp chuẩn 100%',
    description: 'Bao gồm 6 khách hàng mới hoàn toàn, thông tin đầy đủ, chuẩn định dạng 100%, không trùng lặp, sẵn sàng bấm Nhập ngay.',
    rows: [
      {
        rowNumber: 2,
        code: 'KH-PERF-001',
        name: 'Tập đoàn Điện lực Việt Nam (EVN)',
        taxCode: '0100100079',
        email: 'evn@evn.com.vn',
        phone: '02466946666',
        address: 'Số 11 Cửa Bắc, Trúc Bạch, Ba Đình',
        city: 'Hà Nội',
        industry: 'Năng lượng & Điện lực',
        contactPerson: 'Đặng Hoàng An',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 3,
        code: 'KH-PERF-002',
        name: 'Tập đoàn Dầu khí Quốc gia Việt Nam (PetroVietnam)',
        taxCode: '0100779796',
        email: 'contact@pvn.vn',
        phone: '02438252526',
        address: 'Số 18 Láng Hạ, Thành Công, Ba Đình',
        city: 'Hà Nội',
        industry: 'Dầu khí & Năng lượng',
        contactPerson: 'Lê Mạnh Hùng',
        assignedSales: 'Trần Thị Mai Linh'
      },
      {
        rowNumber: 4,
        code: 'KH-PERF-003',
        name: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
        taxCode: '0100112437',
        email: 'contact@vietcombank.com.vn',
        phone: '02439343137',
        address: '198 Trần Quang Khải, Hoàn Kiếm',
        city: 'Hà Nội',
        industry: 'Tài chính - Ngân hàng',
        contactPerson: 'Nguyễn Thanh Tùng',
        assignedSales: 'Lê Hồng Quân'
      },
      {
        rowNumber: 5,
        code: 'KH-PERF-004',
        name: 'Công ty Cổ phần Vàng bạc Đá quý Phú Nhuận (PNJ)',
        taxCode: '0300521758',
        email: 'pnj@pnj.com.vn',
        phone: '02839951703',
        address: '170E Phan Đăng Lưu, Phường 3, Phú Nhuận',
        city: 'TP. Hồ Chí Minh',
        industry: 'Bán lẻ trang sức & Thời trang',
        contactPerson: 'Cao Thị Ngọc Dung',
        assignedSales: 'Đặng Thùy Dung'
      },
      {
        rowNumber: 6,
        code: 'KH-PERF-005',
        name: 'Công ty Cổ phần Tập đoàn Hoa Sen',
        taxCode: '3700381324',
        email: 'info@hoasengroup.vn',
        phone: '02839990111',
        address: 'Số 9 Đại lộ Thống Nhất, KCN Sóng Thần II, Dĩ An',
        city: 'Bình Dương',
        industry: 'Sản xuất tôn thép & Vật liệu',
        contactPerson: 'Lê Phước Vũ',
        assignedSales: 'Nguyễn Hoàng Nam'
      },
      {
        rowNumber: 7,
        code: 'KH-PERF-006',
        name: 'Công ty Cổ phần Tập đoàn Sun Group',
        taxCode: '0400600007',
        email: 'contact@sungroup.com.vn',
        phone: '02363890899',
        address: 'Tòa nhà Sun City, 13 Hai Bà Trưng, Tràng Tiền',
        city: 'Đà Nẵng',
        industry: 'Du lịch nghỉ dưỡng & Bất động sản',
        contactPerson: 'Đặng Minh Trường',
        assignedSales: 'Trần Thị Mai Linh'
      }
    ]
  }
];
