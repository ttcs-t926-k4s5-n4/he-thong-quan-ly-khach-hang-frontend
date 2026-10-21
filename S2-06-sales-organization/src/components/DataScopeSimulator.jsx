import React, { useState } from 'react';
import { 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  DollarSign, 
  Building2, 
  Users, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  FolderTree,
  Filter,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatVND, formatShortVND } from '../utils/orgUtils';

export default function DataScopeSimulator({
  currentUserId,
  setCurrentUserId,
  employees,
  teams,
  deals,
  accessibleEmployees,
  accessibleTeams,
  accessibleDeals
}) {
  const [stageFilter, setStageFilter] = useState('all');

  const currentEmp = employees.find(e => e.id === currentUserId) || employees[0];
  const currentTeam = teams.find(t => t.id === currentEmp?.teamId);

  // Tính tổng doanh số công ty vs Doanh số trong tầm nhìn
  const totalCompanyRevenue = deals.reduce((sum, d) => sum + d.dealValue, 0);
  const totalScopeRevenue = accessibleDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const revenuePercent = Math.round((totalScopeRevenue / totalCompanyRevenue) * 100);

  // Lọc cơ hội
  const filteredDeals = accessibleDeals.filter(d => {
    return stageFilter === 'all' || d.stage === stageFilter;
  });

  // Danh sách các nhân sự mẫu đại diện cho 5 cấp bậc để test nhanh
  const quickTestRoles = [
    {
      id: 'NV-001',
      name: 'Nguyễn Văn An',
      role: 'Giám Đốc Kinh Doanh Toàn Quốc',
      level: 'Cấp 0 (Root)',
      scopeText: 'Toàn bộ công ty (100% cây)',
      color: '#3b82f6'
    },
    {
      id: 'NV-002',
      name: 'Trần Thị Bình',
      role: 'Giám Đốc Khối Miền Bắc',
      level: 'Cấp 1 (Vùng)',
      scopeText: 'Nhánh Miền Bắc (Hà Nội, Hải Phòng, SME, ENT)',
      color: '#06b6d4'
    },
    {
      id: 'NV-005',
      name: 'Phạm Minh Đức',
      role: 'Trưởng Chi Nhánh Hà Nội',
      level: 'Cấp 2 (Chi Nhánh)',
      scopeText: 'Chi Nhánh HN + 2 nhóm con (ENT HN, SME HN)',
      color: '#f59e0b'
    },
    {
      id: 'NV-011',
      name: 'Đỗ Thu Hằng',
      role: 'Trưởng Nhóm SME Hà Nội',
      level: 'Cấp 3 (Trưởng Nhóm)',
      scopeText: 'Chỉ các nhân viên thuộc Nhóm SME Hà Nội',
      color: '#ec4899'
    },
    {
      id: 'NV-016',
      name: 'Hoàng Minh Tuấn',
      role: 'Chuyên Viên Kinh Doanh SME',
      level: 'Cấp 4 (Nhân Viên Thường)',
      scopeText: 'Chỉ dữ liệu do chính mình tạo (My Data)',
      color: '#64748b'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header giải thích nghiệp vụ cốt lõi của Tiêu chí 3 */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span>TIÊU CHÍ NGHIỆP VỤ 3 (CORE FEATURE)</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              Mô Phỏng Phân Quyền Dữ Liệu Theo Cây Tổ Chức Thời Gian Thực
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '850px' }}>
              Quy tắc cốt lõi: <strong>Cây tổ chức quyết định phạm vi dữ liệu mà Trưởng nhóm nhìn thấy</strong>. 
              Trưởng nhóm cấp trên tự động nhìn thấy toàn bộ nhánh con (subtree); Trưởng nhóm cấp dưới chỉ nhìn thấy nhóm mình; Nhân viên thường chỉ thấy dữ liệu cá nhân.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Tỷ lệ dữ liệu nhìn thấy
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {revenuePercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Bộ nút chuyển nhanh người dùng để test ngay lập tức */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
            ⚡ Thử nghiệm ngay góc nhìn qua 5 cấp bậc trong cây tổ chức:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {quickTestRoles.map(role => {
              const isActive = currentUserId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentUserId(role.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isActive ? role.color : 'var(--border-subtle)'}`,
                    background: isActive ? `${role.color}25` : 'var(--bg-surface-elevated)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isActive ? `0 0 16px ${role.color}40` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: role.color }}>
                      {role.level}
                    </span>
                    {isActive && <CheckCircle2 size={14} style={{ color: role.color }} />}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {role.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {role.role}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '4px' }}>
                    Phạm vi: {role.scopeText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Thống kê & Ma trận thẩm quyền */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Thẻ Thẩm quyền của người dùng hiện tại */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="emp-avatar" style={{ backgroundColor: currentEmp.avatarColor || '#3b82f6', width: '44px', height: '44px' }}>
              {currentEmp.name.split(' ').map(n => n[0]).slice(-2).join('')}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{currentEmp.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {currentEmp.position} &bull; Nhóm: <strong>{currentTeam?.name}</strong>
              </p>
            </div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vị trí vai trò:</span>
              <strong>{currentEmp.isLeader ? '⭐ Trưởng Nhóm / Cấp Quản Lý' : 'Chuyên Viên Kinh Doanh'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Số nhóm được duyệt:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{accessibleTeams.length} / {teams.length} Nhóm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Số nhân sự thuộc quyền:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>{accessibleEmployees.length} / {employees.length} Nhân sự</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cơ hội bán hàng nhìn thấy:</span>
              <strong style={{ color: 'var(--accent-amber)' }}>{accessibleDeals.length} / {deals.length} Cơ hội</strong>
            </div>
          </div>
        </div>

        {/* Trực quan hóa Cây Quyền Hạn (Access Tree Status) */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
          <span className="stat-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FolderTree size={16} />
            <span>Trạng Thái Quyền Truy Cập Các Nhánh Cây</span>
          </span>
          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {teams.map(t => {
              const isAllowed = accessibleTeams.some(at => at.id === t.id);
              return (
                <div 
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: isAllowed ? 'var(--accent-emerald-bg)' : 'var(--bg-surface-elevated)',
                    border: `1px solid ${isAllowed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isAllowed ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <XCircle size={14} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <span style={{ fontWeight: isAllowed ? '700' : '400', color: isAllowed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {'— '.repeat(t.level)} {t.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isAllowed ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: '600' }}>
                    {isAllowed ? 'ĐƯỢC XEM' : 'BỊ KHÓA'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bảng Dữ Liệu Bán Hàng Thực Tế Trong Tầm Nhìn */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} style={{ color: 'var(--accent-blue)' }} />
              <span>Dữ Liệu Khách Hàng & Cơ Hội Bán Hàng Trong Phạm Vi Quyền Hạn</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Đang hiển thị <strong>{filteredDeals.length}</strong> cơ hội kinh doanh mà <strong>{currentEmp.name}</strong> được phép xem theo cây tổ chức.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select 
              className="form-select"
              style={{ fontSize: '0.82rem', padding: '6px 10px' }}
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="all">Tất cả giai đoạn bán hàng</option>
              <option value="Khảo sát nhu cầu">Khảo sát nhu cầu</option>
              <option value="Đàm phán báo giá">Đàm phán báo giá</option>
              <option value="Ký hợp đồng">Ký hợp đồng</option>
              <option value="Thành công">Thành công</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Cơ Hội & Dự Án</th>
                <th>Khách Hàng Mục Tiêu</th>
                <th>Nhóm Kinh Doanh Sở Hữu</th>
                <th>Nhân Viên Phụ Trách (Owner)</th>
                <th>Giá Trị Cơ Hội</th>
                <th>Giai Đoạn</th>
                <th>Xác Suất</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length > 0 ? (
                filteredDeals.map(deal => {
                  const owner = employees.find(e => e.id === deal.assignedEmployeeId);
                  const dealTeam = teams.find(t => t.id === deal.teamId);

                  return (
                    <tr key={deal.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{deal.title}</div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {deal.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{deal.clientName}</strong>
                      </td>
                      <td>
                        <div className="single-team-badge">
                          <Building2 size={12} />
                          <span>{dealTeam?.name || 'Chưa gán'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="emp-avatar" style={{ width: '28px', height: '28px', fontSize: '0.72rem', backgroundColor: owner?.avatarColor || '#3b82f6' }}>
                            {owner?.name.split(' ').map(n => n[0]).slice(-2).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{owner?.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{owner?.code}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                          {formatVND(deal.dealValue)}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: deal.stage === 'Thành công' ? 'var(--accent-emerald-bg)' : deal.stage === 'Ký hợp đồng' ? 'var(--accent-blue-bg)' : 'var(--accent-amber-bg)',
                          color: deal.stage === 'Thành công' ? 'var(--accent-emerald)' : deal.stage === 'Ký hợp đồng' ? 'var(--accent-blue)' : 'var(--accent-amber)'
                        }}>
                          {deal.stage}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '45px', height: '6px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
                            <div style={{ width: `${deal.probability}%`, height: '100%', background: 'var(--accent-blue)' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                            {deal.probability}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Không có cơ hội kinh doanh nào phù hợp với bộ lọc trong phạm vi dữ liệu hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
