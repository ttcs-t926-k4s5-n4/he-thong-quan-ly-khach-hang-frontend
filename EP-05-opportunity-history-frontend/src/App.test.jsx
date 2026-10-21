import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Opportunity history UI', () => {
  it('filters the history table by search text', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('textbox', { name: 'Tìm kiếm lịch sử' });
    await user.type(search, 'An Phát');
    expect(screen.getAllByText('An Phát Group').length).toBeGreaterThan(0);
    expect(screen.queryByText('Blue Ocean Logistics')).not.toBeInTheDocument();
  });

  it('records each changed field when saving an opportunity', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Cập nhật cơ hội/ }));
    expect(screen.getByRole('dialog', { name: 'Cập nhật cơ hội' })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Giai đoạn'), 'Đã thắng');
    await user.clear(screen.getByLabelText('Giá trị cơ hội (VNĐ)'));
    await user.type(screen.getByLabelText('Giá trị cơ hội (VNĐ)'), '500000000');
    await user.selectOptions(screen.getByLabelText('Người sở hữu'), 'Trần Hoàng Nam');
    await user.type(screen.getByLabelText('Ghi chú / lý do thay đổi'), 'Khách hàng đồng ý phạm vi mới');
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Đã lưu 3 thay đổi');
    expect(screen.getAllByRole('button', { name: /Xem chi tiết/ })).toHaveLength(13);
  });

  it('creates a new opportunity and records its initial fields', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Thêm cơ hội mới' }));
    await user.type(screen.getByLabelText(/Tên cơ hội/), 'Cơ hội thử nghiệm');
    await user.type(screen.getByLabelText(/Tên công ty/), 'Công ty Demo');
    await user.click(screen.getByRole('button', { name: 'Tạo cơ hội' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Đã tạo cơ hội');
    expect(screen.getAllByRole('button', { name: /Xem chi tiết/ })).toHaveLength(14);
  });
});
