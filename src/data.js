import { STATUS } from './logic.js';

const daysAgo = (days, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
const minutesFromNow = (minutes) => new Date(Date.now() + minutes * 60_000).toISOString();
const activity = (id, title, detail, days = 0) => ({ id, type: 'note', title, detail, at: daysAgo(days, 10) });

export const CURRENT_USER = 'Nguyễn Minh Anh';

export const initialLeads = [
  {
    id: 'LD-1001', name: 'Trần Hoàng Nam', company: 'Công ty TNHH Sao Việt', email: 'nam.tran@saoviet.vn', phone: '090 123 4567',
    source: 'Website', temperature: 'Nóng', status: STATUS.ASSIGNED, owner: CURRENT_USER, createdAt: daysAgo(0, 8),
    slaDueAt: minutesFromNow(-95), potentialValue: 180000000, segment: 'Doanh nghiệp', note: 'Đang tìm giải pháp CRM cho đội ngũ 40 người.', qualified: false,
    activities: [activity('a-1001', 'Lead được phân bổ', 'Lead từ biểu mẫu tư vấn website được phân cho bạn.', 0)],
  },
  {
    id: 'LD-1002', name: 'Lê Thị Thu Hà', company: 'An Phát Logistics', email: 'ha.le@anphatlogistics.vn', phone: '091 234 5678',
    source: 'Hội thảo', temperature: 'Ấm', status: STATUS.WORKING, owner: CURRENT_USER, createdAt: daysAgo(1, 14),
    slaDueAt: minutesFromNow(-40), potentialValue: 320000000, segment: 'Doanh nghiệp', note: 'Quan tâm tự động hóa quy trình chăm sóc khách hàng.', qualified: false,
    firstContactAt: null, activities: [activity('a-1002', 'Lead được phân bổ', 'Đăng ký sau hội thảo Chuyển đổi số.', 1), activity('a-1003', 'Gửi email giới thiệu', 'Đã gửi tài liệu tổng quan sản phẩm.', 0)],
  },
  {
    id: 'LD-1003', name: 'Phạm Đức Long', company: 'Blue Ocean Trading', email: 'long.pham@blueocean.vn', phone: '098 345 6789',
    source: 'Giới thiệu', temperature: 'Nóng', status: STATUS.WORKING, owner: CURRENT_USER, createdAt: daysAgo(2, 11),
    slaDueAt: minutesFromNow(-180), potentialValue: 540000000, segment: 'Doanh nghiệp', note: 'Đã trao đổi nhu cầu, đang chờ báo giá.', qualified: true,
    firstContactAt: daysAgo(1, 15), activities: [activity('a-1004', 'Lead được phân bổ', 'Được giới thiệu bởi đối tác Minh Tâm.', 2), activity('a-1005', 'Đã gọi điện', 'Đã xác nhận nhu cầu và ngân sách sơ bộ.', 1)],
  },
  {
    id: 'LD-1004', name: 'Nguyễn Khánh Linh', company: 'Linh Chi Education', email: 'linh.nguyen@linhchi.edu.vn', phone: '093 456 7890',
    source: 'Facebook', temperature: 'Lạnh', status: STATUS.ASSIGNED, owner: CURRENT_USER, createdAt: daysAgo(3, 15),
    slaDueAt: minutesFromNow(-1440), potentialValue: 85000000, segment: 'Giáo dục', note: 'Để lại thông tin từ chiến dịch quảng cáo tháng này.', qualified: false,
    activities: [activity('a-1006', 'Lead được phân bổ', 'Lead đến từ chiến dịch Facebook Ads.', 3)],
  },
  {
    id: 'LD-1005', name: 'Đỗ Minh Quân', company: 'Minh Quân Retail', email: 'quan.do@mqretail.vn', phone: '097 567 8901',
    source: 'Website', temperature: 'Ấm', status: STATUS.WAITING, owner: null, createdAt: daysAgo(4, 9),
    slaDueAt: minutesFromNow(360), potentialValue: 125000000, segment: 'Bán lẻ', note: 'Cần phần mềm quản lý bán hàng đa chi nhánh.', qualified: false,
    activities: [activity('a-1007', 'Lead được đưa về hàng chờ', 'Nhân viên trước đã từ chối vì không đúng khu vực phụ trách.', 2)],
  },
  {
    id: 'LD-1006', name: 'Vũ Ngọc Mai', company: 'Mây Design Studio', email: 'mai.vu@maydesign.vn', phone: '096 678 9012',
    source: 'Sự kiện', temperature: 'Ấm', status: STATUS.WORKING, owner: 'Trần Quốc Bảo', createdAt: daysAgo(5, 10),
    slaDueAt: minutesFromNow(-2200), potentialValue: 210000000, segment: 'Dịch vụ', note: 'Có nhu cầu quản trị pipeline bán hàng.', qualified: false,
    activities: [activity('a-1008', 'Lead được phân bổ', 'Đang được Trần Quốc Bảo chăm sóc.', 5)],
  },
  {
    id: 'LD-1007', name: 'Bùi Anh Tuấn', company: 'GreenFarm Việt Nam', email: 'tuan.bui@greenfarm.vn', phone: '094 789 0123',
    source: 'Giới thiệu', temperature: 'Nóng', status: STATUS.WORKING, owner: CURRENT_USER, createdAt: daysAgo(6, 13),
    slaDueAt: minutesFromNow(-4000), potentialValue: 760000000, segment: 'Nông nghiệp', note: 'Đã thống nhất demo sản phẩm vào tuần tới.', qualified: true,
    firstContactAt: daysAgo(5, 16), activities: [activity('a-1009', 'Lead được phân bổ', 'Đối tác đã xác nhận nhu cầu của khách.', 6), activity('a-1010', 'Demo sơ bộ', 'Khách hàng quan tâm gói doanh nghiệp.', 5)],
  },
  {
    id: 'LD-1008', name: 'Hoàng Gia Bảo', company: 'Gia Bảo Construction', email: 'bao.hoang@giabao.vn', phone: '090 890 1234',
    source: 'LinkedIn', temperature: 'Lạnh', status: STATUS.ASSIGNED, owner: CURRENT_USER, createdAt: daysAgo(8, 9),
    slaDueAt: minutesFromNow(-6500), potentialValue: 430000000, segment: 'Xây dựng', note: 'Tìm hiểu công cụ quản lý khách hàng B2B.', qualified: false,
    activities: [activity('a-1011', 'Lead được phân bổ', 'Đăng ký tư vấn từ LinkedIn.', 8)],
  },
];

export const initialCustomers = [
  { id: 'CUS-0007', name: 'Công ty Hưng Thịnh', contactName: 'Phạm Thu Trang', email: 'trang.pham@hungthinh.vn', phone: '091 111 2233', source: 'Hội thảo', createdAt: daysAgo(20), leadId: 'LD-0990' },
  { id: 'CUS-0008', name: 'Tân Tiến Technology', contactName: 'Ngô Mạnh Hùng', email: 'hung.ngo@tantien.vn', phone: '098 777 6655', source: 'Website', createdAt: daysAgo(12), leadId: 'LD-0991' },
];


export const initialContacts = [
  { id: 'CON-0007', leadId: 'LD-0990', customerId: 'CUS-0007', name: 'Phạm Thu Trang', company: 'Công ty Hưng Thịnh', email: 'trang.pham@hungthinh.vn', phone: '091 111 2233', source: 'Hội thảo', createdAt: daysAgo(20) },
  { id: 'CON-0008', leadId: 'LD-0991', customerId: 'CUS-0008', name: 'Ngô Mạnh Hùng', company: 'Tân Tiến Technology', email: 'hung.ngo@tantien.vn', phone: '098 777 6655', source: 'Website', createdAt: daysAgo(12) },
];

export const initialOpportunities = [
  { id: 'OPP-0007', customerId: 'CUS-0007', name: 'Mở rộng hệ thống CRM', value: 460000000, stage: 'Đàm phán', createdAt: daysAgo(18), leadId: 'LD-0990' },
  { id: 'OPP-0008', customerId: 'CUS-0008', name: 'CRM gói doanh nghiệp', value: 240000000, stage: 'Đề xuất', createdAt: daysAgo(10), leadId: 'LD-0991' },
];

export const initialSavedViews = [
  { id: 'sv-hot', name: 'Lead nóng cần gọi', filters: { temperature: 'Nóng', status: '', source: '', owner: 'Tôi', overdueOnly: false, query: '', startDate: '', endDate: '' } },
  { id: 'sv-overdue', name: 'Lead quá SLA', filters: { temperature: '', status: '', source: '', owner: '', overdueOnly: true, query: '', startDate: '', endDate: '' } },
];
