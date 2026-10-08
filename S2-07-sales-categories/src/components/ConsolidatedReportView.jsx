import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  PieChart, 
  Compass, 
  Building2, 
  DollarSign,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { formatVND, formatCompactVND } from '../utils/referenceUtils';
import { LEGACY_FRAGMENTED_DATA_ANALYSIS } from '../data/categoryData';

export default function ConsolidatedReportView({
  categoryItems,
  operationalData
}) {
  const [activeReportTab, setActiveReportTab] = useState('STANDARD'); // 'STANDARD' | 'COMPARISON'

  const { industries = [], company_sizes = [], lead_sources = [], activity_types = [] } = categoryItems;
  const { customers = [], leads = [], deals = [], activities = [] } = operationalData;

  // 1. Phân tích Báo cáo theo Nguồn Lead
  const leadSourceStats = lead_sources.map(src => {
    const matchedLeads = leads.filter(l => l.leadSourceId === src.id);
    const matchedDeals = deals.filter(d => d.leadSourceId === src.id);
    const matchedCustomers = customers.filter(c => c.leadSourceId === src.id);
    const totalPotential = matchedLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
    const totalRevenue = matchedDeals.reduce((acc, d) => acc + (d.amount || 0), 0);

    return {
      id: src.id,
      name: src.name,
      code: src.code,
      color: src.color,
      leadCount: matchedLeads.length,
      dealCount: matchedDeals.length,
      customerCount: matchedCustomers.length,
      totalPotential,
      totalRevenue
    };
  });

  const maxLeadCount = Math.max(...leadSourceStats.map(s => s.leadCount), 1);

  // 2. Phân tích Báo cáo theo Ngành Nghề Khách Hàng
  const industryStats = industries.map(ind => {
    const matchedCustomers = customers.filter(c => c.industryId === ind.id);
    const matchedDeals = deals.filter(d => d.industryId === ind.id);
    const totalRevenue = matchedDeals.reduce((acc, d) => acc + (d.amount || 0), 0);

    return {
      id: ind.id,
      name: ind.name,
      code: ind.code,
      color: ind.color,
      customerCount: matchedCustomers.length,
      dealCount: matchedDeals.length,
      totalRevenue
    };
  });

  const maxIndustryRevenue = Math.max(...industryStats.map(s => s.totalRevenue), 1);

  // 3. Phân tích theo Quy mô Doanh nghiệp
  const sizeStats = company_sizes.map(size => {
    const matchedCustomers = customers.filter(c => c.companySizeId === size.id);
    const matchedDeals = deals.filter(d => d.companySizeId === size.id);
    const totalRevenue = matchedDeals.reduce((acc, d) => acc + (d.amount || 0), 0);

    return {
      id: size.id,
      name: size.name,
      code: size.code,
      color: size.color,
      customerCount: matchedCustomers.length,
      totalRevenue,
      avgDealSize: matchedDeals.length > 0 ? totalRevenue / matchedDeals.length : 0
    };
  });

  // 4. Phân tích theo Loại Hoạt Động
  const activityStats = activity_types.map(act => {
    const matched = activities.filter(a => a.activityTypeId === act.id);
    return {
      id: act.id,
      name: act.name,
      code: act.code,
      color: act.color,
      count: matched.length
    };
  });

  const maxActivityCount = Math.max(...activityStats.map(s => s.count), 1);

  const totalClosedRevenue = deals.reduce((acc, d) => acc + (d.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner Giám Đốc Kinh Doanh */}
      <div className="content-box" style={{ padding: '1.5rem 1.75rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="brand-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', marginBottom: '0.4rem' }}>
              Mục Tiêu Cốt Lõi Của SCRUM-65
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Báo Cáo Gộp Bán Hàng Toàn Khối (Consolidated Sales BI)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '780px', marginTop: '0.2rem' }}>
              Khi toàn bộ các chi nhánh miền Bắc, miền Trung, miền Nam cùng sử dụng danh mục dùng chung đã khai báo, Giám đốc kinh doanh có thể tổng hợp báo cáo tự động 100% không bị sai lệch số liệu.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              id="btn-report-standard"
              className={`btn btn-sm ${activeReportTab === 'STANDARD' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveReportTab('STANDARD')}
            >
              <BarChart3 size={15} />
              <span>Báo Cáo Gộp Đã Chuẩn Hóa</span>
            </button>

            <button 
              id="btn-report-comparison"
              className={`btn btn-sm ${activeReportTab === 'COMPARISON' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveReportTab('COMPARISON')}
            >
              <TrendingUp size={15} />
              <span>Đối Chiếu Trước & Sau Chuẩn Hóa</span>
            </button>
          </div>
        </div>
      </div>

      {activeReportTab === 'STANDARD' ? (
        <div className="report-grid">
          {/* Card 1: Báo cáo Nguồn Lead */}
          <div className="report-card">
            <div className="report-card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} color="var(--primary)" />
                <span>Báo Cáo Gộp: Đầu Mối Theo Nguồn Lead</span>
              </div>
              <span className="code-tag">{leads.length} Leads Toàn Quốc</span>
            </div>

            <div>
              {leadSourceStats.filter(s => s.leadCount > 0 || s.dealCount > 0).map(stat => {
                const percent = Math.round((stat.leadCount / maxLeadCount) * 100);
                return (
                  <div key={stat.id} className="bar-chart-row">
                    <div className="bar-chart-header">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="item-color-dot" style={{ backgroundColor: stat.color, color: stat.color }} />
                        <span>{stat.name}</span>
                      </span>
                      <span>
                        <strong>{stat.leadCount} Leads</strong> &bull; {formatCompactVND(stat.totalPotential)}
                      </span>
                    </div>
                    <div className="bar-chart-track">
                      <div 
                        className="bar-chart-fill" 
                        style={{ width: `${percent}%`, backgroundColor: stat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Báo cáo Doanh số theo Ngành nghề */}
          <div className="report-card">
            <div className="report-card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} color="var(--success)" />
                <span>Báo Cáo Gộp: Doanh Thu Theo Ngành Nghề</span>
              </div>
              <span className="code-tag" style={{ color: 'var(--success)' }}>
                {formatCompactVND(totalClosedRevenue)}
              </span>
            </div>

            <div>
              {industryStats.filter(s => s.totalRevenue > 0 || s.customerCount > 0).map(stat => {
                const percent = Math.round((stat.totalRevenue / maxIndustryRevenue) * 100);
                return (
                  <div key={stat.id} className="bar-chart-row">
                    <div className="bar-chart-header">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="item-color-dot" style={{ backgroundColor: stat.color, color: stat.color }} />
                        <span>{stat.name}</span>
                      </span>
                      <span>
                        <strong>{formatCompactVND(stat.totalRevenue)}</strong> ({stat.customerCount} KH)
                      </span>
                    </div>
                    <div className="bar-chart-track">
                      <div 
                        className="bar-chart-fill" 
                        style={{ width: `${percent}%`, backgroundColor: stat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Phân Bổ Quy Mô Doanh Nghiệp */}
          <div className="report-card">
            <div className="report-card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--warning)" />
                <span>Phân Khúc Khách Hàng Theo Quy Mô</span>
              </div>
              <span className="code-tag">{customers.length} Doanh Nghiệp</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sizeStats.map(stat => (
                <div key={stat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="item-color-dot" style={{ backgroundColor: stat.color, color: stat.color }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{stat.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mã: {stat.code}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{stat.customerCount} Khách hàng</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Giá trị TB: {formatCompactVND(stat.avgDealSize)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Tần Suất Hoạt Động Bán Hàng */}
          <div className="report-card">
            <div className="report-card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} color="var(--purple)" />
                <span>Năng Suất Bán Hàng Theo Loại Hoạt Động</span>
              </div>
              <span className="code-tag">{activities.length} Hoạt Động</span>
            </div>

            <div>
              {activityStats.map(stat => {
                const percent = Math.round((stat.count / maxActivityCount) * 100);
                return (
                  <div key={stat.id} className="bar-chart-row">
                    <div className="bar-chart-header">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="item-color-dot" style={{ backgroundColor: stat.color, color: stat.color }} />
                        <span>{stat.name}</span>
                      </span>
                      <span>
                        <strong>{stat.count} lượt tương tác</strong>
                      </span>
                    </div>
                    <div className="bar-chart-track">
                      <div 
                        className="bar-chart-fill" 
                        style={{ width: `${percent}%`, backgroundColor: stat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Tab So sánh Trước và Sau khi chuẩn hóa */
        <div className="comparison-container">
          {/* Cột Trái: Trước khi có SCRUM-65 (Dữ liệu phân mảnh) */}
          <div className="comparison-box comparison-before">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 800, fontSize: '1.1rem' }}>
              <AlertTriangle size={20} />
              <span>TRƯỚC KHI CHUẨN HÓA (Chưa có SCRUM-65)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Nhân viên các chi nhánh nhập tự do vào ô text. Kết quả: 1 nguồn lead duy nhất bị gõ thành 6-8 biến thể khác nhau!
            </p>

            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Phân mảnh nguồn Lead (Không gộp được):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {LEGACY_FRAGMENTED_DATA_ANALYSIS.leadSourceFragmentation.slice(0, 6).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.35rem 0.5rem', background: 'var(--bg-muted)', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>"{item.rawName}"</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.count} leads</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="alert-box alert-danger">
              <span>Hậu quả: Giám đốc kinh doanh mất 3-4 ngày mỗi cuối tháng để gộp thủ công bằng Excel, sai số hơn 30% do viết sai chính tả.</span>
            </div>
          </div>

          {/* Cột Phải: Sau khi có SCRUM-65 (Chuẩn hóa tự động) */}
          <div className="comparison-box comparison-after">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 800, fontSize: '1.1rem' }}>
              <CheckCircle2 size={20} />
              <span>SAU KHI CHUẨN HÓA (Đã áp dụng SCRUM-65)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Toàn khối bán hàng thống nhất 1 bộ danh mục chung duy nhất với mã chuẩn hóa và thứ tự hiển thị đồng bộ.
            </p>

            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Dữ liệu gom nhóm chính xác 100%:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.35rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>Website / Inbound Form (SRC_WEBSITE)</span>
                  <span style={{ fontWeight: 800 }}>67 leads gộp (100% tự động)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.35rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>Khách cũ giới thiệu (SRC_REFERRAL)</span>
                  <span style={{ fontWeight: 800 }}>46 leads gộp (100% tự động)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.35rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>Quảng cáo số (SRC_DIGITAL_ADS)</span>
                  <span style={{ fontWeight: 800 }}>43 leads gộp (100% tự động)</span>
                </div>
              </div>
            </div>

            <div className="alert-box alert-success">
              <span>Lợi ích: Báo cáo gộp thời gian thực (Real-time BI), tiết kiệm 100% thời gian xử lý thủ công, hỗ trợ ra quyết định phân bổ ngân sách chính xác!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
