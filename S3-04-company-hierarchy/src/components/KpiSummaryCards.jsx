import React from 'react';
import { Building2, Layers, TrendingUp, Compass, ArrowUpRight } from 'lucide-react';
import { formatShortVND, calculateGroupTotals, isParentCompany, isIndependent } from '../utils/hierarchyUtils';

export function KpiSummaryCards({
  customers,
  contracts,
  onFilterChange,
  activeFilter
}) {
  // 1. Danh sách công ty mẹ
  const parentCompanies = customers.filter((c) => isParentCompany(c, customers));
  const subsidiaryCount = customers.filter((c) => c.parentId).length;
  const independentCount = customers.filter((c) => isIndependent(c, customers)).length;

  // 2. Tổng giá trị toàn hệ thống
  const totalSystemValue = contracts.reduce((sum, ct) => sum + (ct.value || 0), 0);

  // 3. Tìm tập đoàn có tổng giá trị lớn nhất
  let topGroup = null;
  let maxGroupVal = 0;
  for (const parent of parentCompanies) {
    const totals = calculateGroupTotals(parent.id, customers, contracts);
    if (totals.totalGroupValue > maxGroupVal) {
      maxGroupVal = totals.totalGroupValue;
      topGroup = {
        name: parent.shortName,
        value: totals.totalGroupValue,
        subsidiariesCount: totals.subsidiariesCount
      };
    }
  }

  return (
    <div className="kpi-grid">
      {/* KPI 1: Nhóm Tập đoàn Doanh nghiệp */}
      <div
        className="kpi-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterChange('PARENTS_ONLY')}
      >
        <div className="kpi-info">
          <span className="kpi-label">Hệ Thống Tập Đoàn</span>
          <span className="kpi-value">{parentCompanies.length} Tập đoàn</span>
          <span className="kpi-subtext">
            Bao gồm {subsidiaryCount} công ty con trực thuộc
          </span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: 'var(--corporate-light)', color: '#818cf8' }}>
          <Layers size={22} />
        </div>
      </div>

      {/* KPI 2: Tổng Giá Trị Hợp Đồng Toàn Hệ Thống */}
      <div className="kpi-card">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Giá Trị Hợp Đồng</span>
          <span className="kpi-value" style={{ color: '#60a5fa' }}>
            {formatShortVND(totalSystemValue)}
          </span>
          <span className="kpi-subtext">
            Toàn bộ {contracts.length} hợp đồng có hiệu lực
          </span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: 'var(--primary-light)', color: '#60a5fa' }}>
          <TrendingUp size={22} />
        </div>
      </div>

      {/* KPI 3: Tập đoàn Quy mô Lớn nhất */}
      <div className="kpi-card">
        <div className="kpi-info">
          <span className="kpi-label">Tập Đoàn Lớn Nhất</span>
          <span className="kpi-value" style={{ fontSize: '1.35rem' }}>
            {topGroup ? topGroup.name : 'Chưa có'}
          </span>
          <span className="kpi-subtext">
            {topGroup ? `${formatShortVND(topGroup.value)} (${topGroup.subsidiariesCount} công ty con)` : '...'}
          </span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: 'var(--success-bg)', color: '#34d399' }}>
          <Building2 size={22} />
        </div>
      </div>

      {/* KPI 4: Pháp nhân Độc Lập */}
      <div
        className="kpi-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterChange('INDEPENDENT_ONLY')}
      >
        <div className="kpi-info">
          <span className="kpi-label">Pháp Nhân Độc Lập</span>
          <span className="kpi-value">{independentCount} Doanh nghiệp</span>
          <span className="kpi-subtext" style={{ color: '#38bdf8' }}>
            Sẵn sàng khai báo mẹ - con <ArrowUpRight size={13} />
          </span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: 'var(--info-bg)', color: '#38bdf8' }}>
          <Compass size={22} />
        </div>
      </div>
    </div>
  );
}
