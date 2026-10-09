import React from 'react';
import { 
  Users, 
  AlertOctagon, 
  Building2, 
  ShieldCheck, 
  PhoneOff 
} from 'lucide-react';

export default function KpiSummaryCards({ 
  totalLeads = 0,
  duplicateLeadsCount = 0,
  customerMatchesCount = 0,
  protectedCallsCount = 0,
  activeFilter = 'ALL',
  onSelectFilter
}) {
  return (
    <div className="kpi-grid">
      {/* 1. Tổng Lead */}
      <div 
        className={`kpi-card ${activeFilter === 'ALL' ? 'active' : ''}`}
        onClick={() => onSelectFilter('ALL')}
      >
        <div className="kpi-info">
          <span className="kpi-label">Tổng Leads Đang Quản Lý</span>
          <span className="kpi-value">{totalLeads}</span>
          <span className="kpi-subtext">Thu thập từ đa kênh Marketing</span>
        </div>
        <div className="kpi-icon-wrap kpi-icon-blue">
          <Users size={24} />
        </div>
      </div>

      {/* 2. Cảnh báo trùng Lead */}
      <div 
        className={`kpi-card ${activeFilter === 'DUPLICATES' ? 'active' : ''}`}
        onClick={() => onSelectFilter('DUPLICATES')}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: 'var(--danger-600)' }}>Cần Xử Lý Trùng Lặp</span>
          <span className="kpi-value" style={{ color: 'var(--danger-600)' }}>{duplicateLeadsCount}</span>
          <span className="kpi-subtext">Trùng Email, SĐT hoặc Tên công ty</span>
        </div>
        <div className="kpi-icon-wrap kpi-icon-red">
          <AlertOctagon size={24} />
        </div>
      </div>

      {/* 3. Trùng Khách hàng đã có */}
      <div 
        className={`kpi-card ${activeFilter === 'CUSTOMER_MATCHES' ? 'active' : ''}`}
        onClick={() => onSelectFilter('CUSTOMER_MATCHES')}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: '#7c3aed' }}>Trùng KH Doanh Nghiệp</span>
          <span className="kpi-value" style={{ color: '#7c3aed' }}>{customerMatchesCount}</span>
          <span className="kpi-subtext">Gợi ý gắn thẳng vào Khách hàng</span>
        </div>
        <div className="kpi-icon-wrap" style={{ background: '#ede9fe', color: '#7c3aed' }}>
          <Building2 size={24} />
        </div>
      </div>

      {/* 4. Bảo vệ cuộc gọi sáng nay */}
      <div 
        className={`kpi-card ${activeFilter === 'MERGED' ? 'active' : ''}`}
        onClick={() => onSelectFilter('MERGED')}
      >
        <div className="kpi-info">
          <span className="kpi-label" style={{ color: 'var(--success-600)' }}>Cuộc Gọi Đã Bảo Vệ</span>
          <span className="kpi-value" style={{ color: 'var(--success-600)' }}>
            {protectedCallsCount}
          </span>
          <span className="kpi-subtext">Tránh gọi trùng trong buổi sáng</span>
        </div>
        <div className="kpi-icon-wrap kpi-icon-green">
          <ShieldCheck size={24} />
        </div>
      </div>
    </div>
  );
}
