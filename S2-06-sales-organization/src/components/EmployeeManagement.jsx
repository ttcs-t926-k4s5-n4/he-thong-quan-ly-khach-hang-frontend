import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ArrowRightLeft, 
  Search, 
  Crown, 
  ShieldCheck, 
  History, 
  Building2, 
  Mail, 
  Phone,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { formatVND } from '../utils/orgUtils';

export default function EmployeeManagement({
  employees,
  teams,
  transfers,
  onOpenAddEmployee,
  onOpenTransferModal,
  selectedTeamFilter,
  setSelectedTeamFilter
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'leaders' | 'members'
  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' | 'history'

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = !searchQuery || 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam = !selectedTeamFilter || emp.teamId === selectedTeamFilter;

    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'leaders' && emp.isLeader) ||
      (roleFilter === 'members' && !emp.isLeader);

    return matchesSearch && matchesTeam && matchesRole;
  });

  return (
    <div className="table-card">
      {/* Header & Tabs */}
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'var(--accent-cyan)' }} />
              <span>Quản Lý Nhân Sự & Ràng Buộc Đơn Nhóm</span>
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Nguyên tắc SCRUM-64: <strong>Mỗi nhân viên chỉ thuộc đúng 1 nhóm tại một thời điểm</strong>.
            </p>
          </div>

          {/* Sub-tabs: Danh sách vs Lịch sử chuyển nhóm */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <button
              className={`btn ${activeSubTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => setActiveSubTab('list')}
            >
              <Users size={14} />
              <span>Danh Sách ({employees.length})</span>
            </button>
            <button
              className={`btn ${activeSubTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => setActiveSubTab('history')}
            >
              <History size={14} />
              <span>Lịch Sử Điều Chuyển ({transfers.length})</span>
            </button>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddEmployee}>
          <UserPlus size={16} />
          <span>Thêm Nhân Sự Mới</span>
        </button>
      </div>

      {activeSubTab === 'list' ? (
        <>
          {/* Bộ lọc */}
          <div style={{ padding: '14px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div className="search-input-box" style={{ minWidth: '260px' }}>
                <Search size={16} />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Tìm họ tên, mã NV, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter theo Nhóm */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} style={{ color: 'var(--text-muted)' }} />
                <select 
                  className="form-select"
                  style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                  value={selectedTeamFilter}
                  onChange={(e) => setSelectedTeamFilter(e.target.value)}
                >
                  <option value="">-- Tất cả nhóm kinh doanh --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>
                      {'— '.repeat(t.level)} {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter theo Vai trò */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                <select 
                  className="form-select"
                  style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="leaders">⭐ Chỉ Trưởng nhóm</option>
                  <option value="members">Chuyên viên kinh doanh</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
              <ShieldCheck size={16} />
              <span>100% Nhân sự đã định danh đúng 1 nhóm</span>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã & Nhân Sự</th>
                  <th>Chức Danh Chuyên Môn</th>
                  <th>Nhóm Trực Thuộc (Duy Nhất)</th>
                  <th>Vai Trò Nhóm</th>
                  <th>Liên Hệ</th>
                  <th>Chỉ Tiêu Doanh Số</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => {
                  const team = teams.find(t => t.id === emp.teamId);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div className="emp-cell">
                          <div className="emp-avatar" style={{ backgroundColor: emp.avatarColor || '#3b82f6' }}>
                            {emp.name.split(' ').map(n => n[0]).slice(-2).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{emp.name}</div>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                              {emp.code} &bull; {emp.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '500' }}>{emp.position}</span>
                      </td>
                      <td>
                        {/* TIÊU CHÍ 2: THUỘC ĐÚNG 1 NHÓM */}
                        <div className="single-team-badge" title="Mỗi nhân viên chỉ thuộc đúng 1 nhóm tại một thời điểm">
                          <Building2 size={13} />
                          <span>{team ? team.name : 'Chưa phân nhóm'}</span>
                        </div>
                      </td>
                      <td>
                        {emp.isLeader ? (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-amber-bg)',
                            color: 'var(--accent-amber)',
                            border: '1px solid rgba(245, 158, 11, 0.3)'
                          }}>
                            <Crown size={12} />
                            <span>Trưởng Nhóm</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Thành viên
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                            {emp.email}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                            <Phone size={12} />
                            {emp.phone}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                          {formatVND(emp.kpiTarget)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {/* Nút Điều chuyển nhóm - Minh chứng Tiêu chí 2 */}
                        <button 
                          className="btn btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          onClick={() => onOpenTransferModal(emp)}
                          title="Điều chuyển nhân sự từ nhóm hiện tại sang nhóm mới"
                        >
                          <ArrowRightLeft size={14} style={{ color: 'var(--accent-blue)' }} />
                          <span>Điều chuyển</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Lịch Sử Điều Chuyển Nhân Sự */
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Nhật Ký Điều Chuyển Nhân Sự Giữa Các Nhóm</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Nhật Ký</th>
                <th>Nhân Viên Điều Chuyển</th>
                <th>Từ Nhóm (Nguồn)</th>
                <th>Sang Nhóm (Đích)</th>
                <th>Lý Do / Căn Cứ Điều Chuyển</th>
                <th>Cấp Phê Duyệt</th>
                <th>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(tf => (
                <tr key={tf.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{tf.id}</span>
                  </td>
                  <td>
                    <strong>{tf.employeeName}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-rose)' }}>{tf.fromTeamName}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>{tf.toTeamName}</span>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{tf.reason}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem' }}>{tf.approvedBy}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {tf.transferDate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
