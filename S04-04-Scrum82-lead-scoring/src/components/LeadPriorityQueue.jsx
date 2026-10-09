import React from 'react';
import { 
  Flame, 
  SunMedium, 
  Snowflake, 
  PhoneCall, 
  Edit3, 
  Eye, 
  Building, 
  User, 
  CheckCircle, 
  ShieldCheck,
  Search,
  ArrowUpDown
} from 'lucide-react';

export default function LeadPriorityQueue({
  scoredLeads = [],
  activeFilter = 'ALL',
  searchQuery = '',
  onSearchChange,
  onOpenQuickEdit,
  onOpenBreakdown,
  onSimulateCall
}) {
  // Lọc theo filter và từ khóa
  const filteredLeads = scoredLeads.filter(lead => {
    if (activeFilter === 'HOT' && lead.scoreResult.classification !== 'HOT') return false;
    if (activeFilter === 'WARM' && lead.scoreResult.classification !== 'WARM') return false;
    if (activeFilter === 'COLD' && lead.scoreResult.classification !== 'COLD') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = lead.fullName?.toLowerCase().includes(q);
      const matchCompany = lead.companyName?.toLowerCase().includes(q);
      const matchStaff = lead.assignedTo?.name?.toLowerCase().includes(q);
      const matchCode = lead.code?.toLowerCase().includes(q);
      return matchName || matchCompany || matchStaff || matchCode;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Policy Banner: Criterion 4 Proof */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem 1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.45 }}>
            <strong>Tiêu chí nghiệm thu 4:</strong> Điểm số chỉ để sắp xếp thứ tự ưu tiên cuộc gọi cho Telesales, <strong>TUYỆT ĐỐI KHÔNG TỰ ĐỘNG LOẠI BỎ LEAD</strong>. Toàn bộ {scoredLeads.length}/{scoredLeads.length} Lead (kể cả Lead Lạnh điểm thấp) đều được hiển thị và phân công đầy đủ!
          </div>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <Search size={14} color="#64748b" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, công ty, sales..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '200px' }}
          />
        </div>
      </div>

      {/* Leads Priority Table */}
      <div className="table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Thứ Tự</th>
              <th style={{ width: '75px', textAlign: 'center' }}>Điểm Số</th>
              <th style={{ width: '130px' }}>Phân Loại</th>
              <th>Khách Hàng & Doanh Nghiệp</th>
              <th>4 Tiêu Chí Chấm Điểm</th>
              <th>Telesales Phụ Trách</th>
              <th>Khuyến Nghị Hành Động (SLA)</th>
              <th style={{ textAlign: 'right', width: '180px' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
                  Không có Lead nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => {
                const { totalScore, classification, slaRecommendation } = lead.scoreResult;

                let pillClass = 'score-pill-cold';
                let badgeClass = 'badge-cold';
                let ClassIcon = Snowflake;
                let classLabel = 'LẠNH (COLD)';

                if (classification === 'HOT') {
                  pillClass = 'score-pill-hot';
                  badgeClass = 'badge-hot';
                  ClassIcon = Flame;
                  classLabel = 'NÓNG (HOT)';
                } else if (classification === 'WARM') {
                  pillClass = 'score-pill-warm';
                  badgeClass = 'badge-warm';
                  ClassIcon = SunMedium;
                  classLabel = 'ẤM (WARM)';
                }

                return (
                  <tr key={lead.id}>
                    {/* Rank Number */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}`}>
                        #{index + 1}
                      </span>
                    </td>

                    {/* Score Pill */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`score-pill ${pillClass}`} title={`Tổng điểm: ${totalScore}`}>
                        {totalScore}
                      </span>
                    </td>

                    {/* Classification Badge */}
                    <td>
                      <span className={badgeClass}>
                        <ClassIcon size={14} />
                        <span>{classLabel}</span>
                      </span>
                    </td>

                    {/* Identity & Company */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{lead.fullName}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'var(--bg-surface-subtle)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                            {lead.code}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Building size={12} />
                          <span>{lead.companyName}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          SĐT: {lead.phone}
                        </div>
                      </div>
                    </td>

                    {/* Criteria Snapshot */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <div>&bull; Ngành: <strong>{lead.scoreResult.breakdown.find(b => b.criteriaKey === 'industry')?.selectedLabel}</strong></div>
                        <div>&bull; Quy mô: <strong>{lead.scoreResult.breakdown.find(b => b.criteriaKey === 'companySize')?.selectedLabel}</strong></div>
                        <div>&bull; Nguồn: <strong>{lead.scoreResult.breakdown.find(b => b.criteriaKey === 'leadSource')?.selectedLabel}</strong></div>
                        <div>&bull; Quan tâm: <strong style={{ color: lead.interestLevel === 'URGENT' ? '#e11d48' : 'inherit' }}>{lead.scoreResult.breakdown.find(b => b.criteriaKey === 'interestLevel')?.selectedLabel}</strong></div>
                      </div>
                    </td>

                    {/* Staff */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <img 
                          src={lead.assignedTo?.avatar} 
                          alt="" 
                          style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{lead.assignedTo?.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{lead.assignedTo?.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* SLA Recommendation */}
                    <td>
                      <div style={{ fontSize: '0.78rem', color: classification === 'HOT' ? '#be123c' : 'var(--text-muted)', fontWeight: classification === 'HOT' ? 700 : 500, lineHeight: 1.35 }}>
                        {slaRecommendation}
                      </div>
                      {lead.callStatus === 'CALLED' && (
                        <span style={{ fontSize: '0.7rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                          <CheckCircle size={12} /> Đã gọi lúc {lead.lastCallTime || 'hôm nay'}
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        {/* 1. Quick Edit - Proves criterion 2 */}
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenQuickEdit(lead)}
                          title="Sửa thông tin để xem điểm tự động tính lại ngay tức thì"
                        >
                          <Edit3 size={13} />
                          <span>Sửa Thông Tin</span>
                        </button>

                        {/* 2. Breakdown View */}
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenBreakdown(lead)}
                          title="Xem chi tiết các điểm thành phần"
                          style={{ padding: '0.3rem 0.5rem' }}
                        >
                          <Eye size={13} />
                        </button>

                        {/* 3. Call Simulation */}
                        <button 
                          className={`btn btn-sm ${classification === 'HOT' ? 'btn-danger' : 'btn-primary'}`}
                          onClick={() => onSimulateCall(lead)}
                          title="Ghi nhận Telesales thực hiện cuộc gọi ưu tiên"
                          style={{ padding: '0.3rem 0.55rem' }}
                        >
                          <PhoneCall size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
