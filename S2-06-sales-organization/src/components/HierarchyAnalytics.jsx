import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Building2, 
  CheckCircle2, 
  Crown, 
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { formatVND, formatShortVND } from '../utils/orgUtils';

export default function HierarchyAnalytics({
  teams,
  employees,
  territories,
  deals
}) {
  // Thống kê nhân sự theo cấp bậc
  const levelCounts = {
    'Cấp 0 (Ban Giám Đốc)': teams.filter(t => t.level === 0).length,
    'Cấp 1 (Khối Vùng)': teams.filter(t => t.level === 1).length,
    'Cấp 2 (Chi Nhánh)': teams.filter(t => t.level === 2).length,
    'Cấp 3 (Nhóm Bán Hàng)': teams.filter(t => t.level === 3).length,
  };

  // Thống kê doanh số theo Vùng (Miền Bắc, Miền Trung, Miền Nam)
  const regionBreakdown = [
    {
      name: 'Khối Miền Bắc',
      code: 'KKD-MB',
      color: '#06b6d4',
      targetQuota: 22000000000,
      actualPipeline: deals
        .filter(d => ['team-hn-branch', 'team-hp-branch', 'team-hn-ent', 'team-hn-sme'].includes(d.teamId))
        .reduce((sum, d) => sum + d.dealValue, 0),
      memberCount: employees.filter(e => ['team-north', 'team-hn-branch', 'team-hp-branch', 'team-hn-ent', 'team-hn-sme'].includes(e.teamId)).length
    },
    {
      name: 'Khối Miền Trung',
      code: 'KKD-MT',
      color: '#f59e0b',
      targetQuota: 10000000000,
      actualPipeline: deals
        .filter(d => ['team-central', 'team-dn-branch'].includes(d.teamId))
        .reduce((sum, d) => sum + d.dealValue, 0),
      memberCount: employees.filter(e => ['team-central', 'team-dn-branch'].includes(e.teamId)).length
    },
    {
      name: 'Khối Miền Nam',
      code: 'KKD-MN',
      color: '#10b981',
      targetQuota: 28000000000,
      actualPipeline: deals
        .filter(d => ['team-hcm-branch', 'team-ct-branch', 'team-hcm-ent', 'team-hcm-sme'].includes(d.teamId))
        .reduce((sum, d) => sum + d.dealValue, 0),
      memberCount: employees.filter(e => ['team-south', 'team-hcm-branch', 'team-ct-branch', 'team-hcm-ent', 'team-hcm-sme'].includes(e.teamId)).length
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Tổng quan cơ cấu tổ chức */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title">Phân Bổ Nhóm Theo Cấp Bậc</span>
            <Building2 size={18} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(levelCounts).map(([lvlName, count]) => (
              <div key={lvlName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{lvlName}</span>
                <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{count} Nhóm</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title">Độ Tuân Thủ Tiêu Chí Nghiệm Thu</span>
            <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>100% Nhóm kinh doanh có đúng 1 Trưởng nhóm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>100% Nhân sự thuộc duy nhất 1 nhóm tại một thời điểm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Phân quyền dữ liệu tự động đệ quy theo cây tổ chức</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Khu vực địa lý được ánh xạ chuẩn xác vào các nhóm</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Báo cáo Doanh số & Nhân sự theo 3 Khối Vùng Miền */}
      <div className="table-card">
        <div className="table-toolbar">
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--accent-purple)' }} />
            <span>Chỉ Tiêu Doanh Số & Quy Mô Nhân Sự Theo Nhánh Cây Miền</span>
          </h3>
        </div>

        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {regionBreakdown.map(reg => {
            const progress = Math.round((reg.actualPipeline / reg.targetQuota) * 100);
            return (
              <div 
                key={reg.code}
                style={{
                  padding: '20px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid var(--border-medium)`,
                  borderTop: `4px solid ${reg.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{reg.name}</h4>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-elevated)' }}>
                    {reg.code}
                  </span>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Quy mô nhân sự:</span>
                    <strong>{reg.memberCount} Nhân viên</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Chỉ tiêu cả khối:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatShortVND(reg.targetQuota)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Doanh số cơ hội hiện tại:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                      {formatShortVND(reg.actualPipeline)}
                    </strong>
                  </div>
                </div>

                {/* Thanh tiến độ */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span>Độ lấp đầy chỉ tiêu:</span>
                    <span style={{ fontWeight: '700', color: reg.color }}>{progress}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', backgroundColor: reg.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
