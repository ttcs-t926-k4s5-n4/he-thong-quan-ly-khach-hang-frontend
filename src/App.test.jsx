import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

const openLead = async (user, name) => {
  await user.click(screen.getByRole('button', { name: new RegExp(`Xem chi tiết ${name}|Mở lead ${name}`) }));
};

describe('NovaCRM lead frontend journeys', () => {
  it('renders the lead list and visually flags overdue leads', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Quản lý lead' })).toBeInTheDocument();
    expect(screen.getByText('Danh sách lead')).toBeInTheDocument();
    expect(screen.getByText(/lead đang quá SLA phản hồi/i)).toBeInTheDocument();
    expect(screen.getAllByText('Quá SLA').length).toBeGreaterThan(0);
  });

  it('filters leads by company or contact name', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('textbox', { name: /tìm theo tên, công ty/i });
    await user.type(search, 'Sao Việt');
    expect(screen.getByText('Trần Hoàng Nam')).toBeInTheDocument();
    expect(screen.queryByText('An Phát Logistics')).not.toBeInTheDocument();
  });

  it('accepts a lead and changes its status to in-care', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Nhận lead Trần Hoàng Nam' }));
    expect(screen.getByText(/Đã nhận lead Trần Hoàng Nam/)).toBeInTheDocument();
    expect(within(screen.getByTestId('lead-row-LD-1001')).getByText('Đang chăm sóc')).toBeInTheDocument();
  });

  it('requires a reason before rejecting and returns the lead to queue', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Từ chối lead Trần Hoàng Nam' }));
    await user.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng nhập lý do từ chối');
    await user.type(screen.getByLabelText('Lý do từ chối'), 'Sai khu vực phụ trách');
    await user.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }));
    expect(screen.getByText(/chuyển về hàng chờ phân bổ/i)).toBeInTheDocument();
    expect(within(screen.getByTestId('lead-row-LD-1001')).getByText('Chờ phân bổ')).toBeInTheDocument();
  });

  it('marks contact, qualifies and converts a lead, creating customer, contact and opportunity while preserving history', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openLead(user, 'Lê Thị Thu Hà');
    expect(screen.getByRole('heading', { name: 'Lê Thị Thu Hà' })).toBeInTheDocument();
    expect(screen.getByText('Lịch sử hoạt động')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Đánh dấu đủ điều kiện/i }));
    await user.click(screen.getByRole('button', { name: 'Chuyển đổi lead' }));
    expect(screen.getByText('Lead đã chuyển đổi')).toBeInTheDocument();
    expect(screen.getByText(/Mã khách hàng: CUS-1002/i)).toBeInTheDocument();
    expect(screen.getByText('Đã chuyển đổi thành công')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Đóng chi tiết' }));
    await user.click(screen.getByRole('button', { name: /Khách hàng/ }));
    expect(screen.getByText('An Phát Logistics')).toBeInTheDocument();
    expect(screen.getByText('4 hoạt động')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Người liên hệ/ }));
    expect(screen.getByText('Lê Thị Thu Hà')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Cơ hội bán hàng/ }));
    expect(screen.getByText('Cơ hội An Phát Logistics')).toBeInTheDocument();
  });

  it('saves a named filter and can reapply it', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc phân loại' }), 'Nóng');
    await user.click(screen.getByRole('button', { name: /Lưu bộ lọc/ }));
    await user.type(screen.getByLabelText('Tên bộ lọc'), 'Lead ưu tiên test');
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Lưu bộ lọc', exact: true }));
    expect(screen.getByText(/Đã lưu bộ lọc “Lead ưu tiên test”/)).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc phân loại' }), '');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Bộ lọc đã lưu' }), { name: 'Lead ưu tiên test' });
    expect(screen.getByRole('combobox', { name: 'Lọc phân loại' })).toHaveValue('Nóng');
  });
});
