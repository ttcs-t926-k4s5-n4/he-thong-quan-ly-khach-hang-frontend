import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function KpiSummaryCards({ summary, activeFilter, onFilterChange }) {
  const cards = [
    {
      id: 'ALL',
      label: 'Tổng Số Dòng Trong Tệp',
      value: summary.total,
      subtext: 'Bao gồm toàn bộ dữ liệu vừa đọc',
      icon: FileText,
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3b82f6'
    },
    {
      id: 'VALID',
      label: 'Dòng Hợp Lệ Sẵn Sàng Nhập',
      value: summary.valid,
      subtext: 'Dữ liệu chuẩn, không lỗi, không trùng',
      icon: CheckCircle2,
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#10b981'
    },
    {
      id: 'DUPLICATE',
      label: 'Bản Ghi Trùng Lặp Cần Xử Lý',
      value: summary.duplicate,
      subtext: 'Trùng MST/Email: Chọn Bỏ qua / Cập nhật',
      icon: AlertTriangle,
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#f59e0b'
    },
    {
      id: 'INVALID',
      label: 'Dòng Có Lỗi Cần Sửa Hoặc Loại Trừ',
      value: summary.invalid,
      subtext: 'Thiếu tên, sai MST, email, số điện thoại',
      icon: XCircle,
      iconBg: 'rgba(239, 68, 68, 0.15)',
      iconColor: '#ef4444'
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map(card => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <div
            key={card.id}
            className={`kpi-card ${isActive ? 'active' : ''}`}
            onClick={() => onFilterChange(card.id)}
            title={`Nhấn để chỉ lọc xem các dòng: ${card.label}`}
          >
            <div className="kpi-card-icon" style={{ backgroundColor: card.iconBg, color: card.iconColor }}>
              <Icon size={24} />
            </div>
            <div className="kpi-card-info">
              <div className="kpi-label">{card.label}</div>
              <div className="kpi-value">{card.value}</div>
              <div className="kpi-subtext">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
