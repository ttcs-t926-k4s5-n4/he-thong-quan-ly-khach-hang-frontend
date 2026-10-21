export const LOSS_REASONS = [
  {
    id: 'PRICE_TOO_HIGH',
    label: 'Giá quá cao so với ngân sách khách hàng',
    category: 'pricing',
    description: 'Báo giá vượt khung dự toán chi trả của khách hàng, đối thủ chiết khấu sâu hơn'
  },
  {
    id: 'COMPETITOR_BETTER_RELATION',
    label: 'Đối thủ cạnh tranh có quan hệ sâu hơn',
    category: 'competition',
    description: 'Đối thủ có mối quan hệ sẵn có với Ban lãnh đạo hoặc hệ sinh thái đối tác lâu năm'
  },
  {
    id: 'MISSING_CORE_FEATURES',
    label: 'Thiếu tính năng / Không đáp ứng yêu cầu kỹ thuật',
    category: 'product',
    description: 'Sản phẩm chưa có module tùy biến riêng hoặc chưa hỗ trợ chuẩn nghiệp vụ đặc thù của khách'
  },
  {
    id: 'PROJECT_CANCELLED_OR_FROZEN',
    label: 'Khách hàng hủy bỏ hoặc đóng băng dự án',
    category: 'customer',
    description: 'Khách hàng thay đổi chiến lược kinh doanh nội bộ, cắt giảm ngân sách hoặc đổi nhân sự phụ trách'
  },
  {
    id: 'IMPLEMENTATION_TIMELINE_TOO_LONG',
    label: 'Thời gian cam kết triển khai quá dài',
    category: 'delivery',
    description: 'Khách hàng cần gấp hệ thống để chạy kịp mùa vụ nhưng tiến độ triển khai không đáp ứng'
  },
  {
    id: 'PAYMENT_TERMS_UNACCEPTABLE',
    label: 'Điều khoản thanh toán & bảo hành không thống nhất',
    category: 'contract',
    description: 'Bất đồng về tỷ lệ tạm ứng, tiến độ thanh toán theo milestone hoặc điều khoản phạt chậm bàn giao'
  },
  {
    id: 'OTHER_REASON',
    label: 'Lý do khác (Nhập chi tiết)',
    category: 'other',
    description: 'Lý do đặc biệt ngoài danh mục chuẩn'
  }
];

export const WIN_REASONS = [
  'Giải pháp kỹ thuật ưu việt & Demo xuất sắc',
  'Giá thành cạnh tranh và linh hoạt',
  'Quan hệ khách hàng và dịch vụ chăm sóc tốt',
  'Tính năng vượt trội so với các đối thủ trên thị trường',
  'Cam kết tiến độ bàn giao nhanh chóng',
  'Thương hiệu uy tín và nhiều khách hàng tiêu biểu tương đồng'
];
