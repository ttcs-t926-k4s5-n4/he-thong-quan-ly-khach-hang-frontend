import React from 'react';
import { Database, AlertTriangle, Percent, Users, TrendingDown, ArrowUpRight } from 'lucide-react';

export function KpiMetrics({ logs, onFilterDiscrepancy, onFilterDiscountTarget, currentFilters }) {
  const total = logs.length;
  const discountAndTargetCount = logs.filter(
    (l) => l.objectType === 'DISCOUNT' || l.objectType === 'SALES_TARGET'
  ).length;
  const anomalousCount = logs.filter((l) => l.isAnomalous).length;
  const uniqueUsersCount = new Set(logs.map((l) => l.user.id)).size;

  const isAnomalousActive = currentFilters.discrepancyOnly;
  const isDiscountTargetActive = 
    currentFilters.selectedObjectType === 'DISCOUNT_TARGET';

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Tổng Bản Ghi Nhạy Cảm</span>
          <div className="kpi-icon-badge bg-blue">
            <Database size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <span className="kpi-value">{total}</span>
          <span className="kpi-subtext">Được mã hóa & băm SHA-256</span>
        </div>
        <div className="kpi-footer text-emerald">
          <ArrowUpRight size={14} /> 100% thay đổi được ghi nhận
        </div>
      </div>

      <div 
        className={`kpi-card clickable ${isDiscountTargetActive ? 'active-kpi' : ''}`}
        onClick={onFilterDiscountTarget}
        role="button"
        tabIndex={0}
        title="Bấm để lọc nhanh Chiết khấu & Chỉ tiêu"
      >
        <div className="kpi-header">
          <span className="kpi-title">Sửa Chiết Khấu & Chỉ Tiêu</span>
          <div className="kpi-icon-badge bg-purple">
            <Percent size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <span className="kpi-value">{discountAndTargetCount}</span>
          <span className="kpi-subtext">Trọng tâm đối soát cuối quý</span>
        </div>
        <div className="kpi-footer text-purple">
          {isDiscountTargetActive ? 'Đang lọc xem 2 loại này' : 'Bấm để lọc nhanh'}
        </div>
      </div>

      <div 
        className={`kpi-card clickable alert-border ${isAnomalousActive ? 'active-kpi' : ''}`}
        onClick={onFilterDiscrepancy}
        role="button"
        tabIndex={0}
        title="Bấm để lọc các giao dịch khả nghi gây lệch số liệu cuối quý"
      >
        <div className="kpi-header">
          <span className="kpi-title">Bất Thường Cuối Quý ⚠️</span>
          <div className="kpi-icon-badge bg-amber pulse-amber">
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <span className="kpi-value text-amber">{anomalousCount}</span>
          <span className="kpi-subtext">Giao dịch giờ chót cần thanh tra</span>
        </div>
        <div className="kpi-footer text-amber">
          <TrendingDown size={14} /> 
          {isAnomalousActive ? 'Đang bật chế độ điều tra' : 'Phát hiện lệch 6.3 Tỷ Quý 3'}
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Người Dùng Thực Hiện</span>
          <div className="kpi-icon-badge bg-cyan">
            <Users size={18} />
          </div>
        </div>
        <div className="kpi-body">
          <span className="kpi-value">{uniqueUsersCount}</span>
          <span className="kpi-subtext">Tài khoản có quyền can thiệp</span>
        </div>
        <div className="kpi-footer text-slate">
          Quản trị viên, GĐKD, Trưởng phòng
        </div>
      </div>
    </div>
  );
}
