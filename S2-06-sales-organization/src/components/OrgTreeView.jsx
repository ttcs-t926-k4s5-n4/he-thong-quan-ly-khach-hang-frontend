import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  Users, 
  Crown, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  ShieldCheck,
  Search,
  Maximize2,
  Minimize2,
  FolderTree
} from 'lucide-react';
import { buildNestedTree } from '../utils/orgUtils';

export default function OrgTreeView({
  teams,
  employees,
  territories,
  onAddChildTeam,
  onEditTeam,
  onDeleteTeam,
  onAssignTerritory,
  onViewTeamEmployees
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const toggleCollapse = (teamId) => {
    setCollapsedNodes(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const expandAll = () => setCollapsedNodes({});
  const collapseAll = () => {
    const all = {};
    teams.forEach(t => { all[t.id] = true; });
    setCollapsedNodes(all);
  };

  // Build the hierarchical tree
  const nestedTree = buildNestedTree(teams, null);

  // Render a single tree node recursively
  const renderTreeNode = (teamNode, depth = 0) => {
    const isCollapsed = !!collapsedNodes[teamNode.id];
    const hasChildren = teamNode.children && teamNode.children.length > 0;

    // Tìm thông tin Trưởng nhóm (Mỗi nhóm có đúng 1 trưởng nhóm)
    const leader = employees.find(e => e.id === teamNode.leaderId);

    // Tìm danh sách nhân viên thuộc nhóm này (Mỗi nhân viên thuộc đúng 1 nhóm)
    const teamMembers = employees.filter(e => e.teamId === teamNode.id);

    // Lấy thông tin khu vực địa lý đã gán
    const assignedTerritories = territories.filter(tr => (teamNode.territoryIds || []).includes(tr.id));

    // Lọc theo search
    const matchesSearch = !searchQuery || 
      teamNode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teamNode.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leader?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const levelNames = ['Cấp 0: Ban Giám Đốc', 'Cấp 1: Khối Vùng / Miền', 'Cấp 2: Chi Nhánh / Tỉnh', 'Cấp 3: Nhóm Bán Hàng'];
    const levelColor = teamNode.level === 0 ? '#3b82f6' : teamNode.level === 1 ? '#06b6d4' : teamNode.level === 2 ? '#f59e0b' : '#8b5cf6';

    return (
      <div 
        key={teamNode.id} 
        className={`tree-node-wrapper ${matchesSearch ? '' : 'opacity-40'}`}
        style={{ display: matchesSearch || hasChildren ? 'block' : 'none' }}
      >
        <div className="tree-card" style={{ borderLeft: `4px solid ${teamNode.color || levelColor}` }}>
          {/* Header nhóm */}
          <div className="tree-card-header">
            <div className="tree-card-title-group">
              {hasChildren && (
                <button 
                  onClick={() => toggleCollapse(teamNode.id)}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '28px', height: '28px', padding: 0 }}
                  title={isCollapsed ? "Mở rộng nhánh con" : "Thu gọn nhánh con"}
                >
                  {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                </button>
              )}

              <div className="team-badge-icon" style={{ backgroundColor: teamNode.color || levelColor }}>
                <Building2 size={20} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 className="team-name">{teamNode.name}</h3>
                  <span className="team-code">{teamNode.code}</span>
                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: '700', 
                      padding: '2px 8px', 
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-surface-elevated)',
                      color: levelColor,
                      border: `1px solid ${levelColor}40`
                    }}
                  >
                    {levelNames[teamNode.level] || `Cấp ${teamNode.level}`}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {teamNode.description}
                </p>
              </div>
            </div>

            {/* Thao tác CRUD nhóm */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                onClick={() => onAddChildTeam(teamNode.id)}
                title="Thêm nhóm kinh doanh con trực thuộc"
              >
                <Plus size={14} />
                <span>Thêm nhóm con</span>
              </button>
              <button 
                className="btn btn-secondary btn-icon"
                onClick={() => onEditTeam(teamNode)}
                title="Chỉnh sửa thông tin nhóm"
              >
                <Edit3 size={15} />
              </button>
              {teamNode.parentId !== null && (
                <button 
                  className="btn btn-danger btn-icon"
                  onClick={() => onDeleteTeam(teamNode)}
                  title="Xoá nhóm (chỉ khi không có nhóm con và không có nhân viên)"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Hàng giữa: Trưởng nhóm (Tiêu chí 1) & Số lượng nhân viên */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* THẺ TRƯỞNG NHÓM (Leader Card) - TIÊU CHÍ 1 */}
            <div className="leader-card-badge">
              <div 
                className="leader-avatar" 
                style={{ backgroundColor: leader?.avatarColor || 'var(--accent-amber)' }}
              >
                {leader ? leader.name.split(' ').map(n => n[0]).slice(-2).join('') : '?'}
              </div>
              <div className="leader-details">
                <span className="leader-label">
                  <Crown size={12} />
                  <span>Trưởng Nhóm Chính Thức (Duy nhất)</span>
                </span>
                <span className="leader-name">
                  {leader ? leader.name : <em style={{ color: 'var(--accent-rose)' }}>Chưa bổ nhiệm Trưởng nhóm</em>}
                </span>
                <span className="leader-sub">
                  {leader ? `${leader.position} • ${leader.email}` : 'Vui lòng gán 1 nhân viên làm trưởng nhóm'}
                </span>
              </div>
            </div>

            {/* THẺ THÀNH VIÊN TRỰC THUỘC (Tiêu chí 2: Mỗi nhân viên thuộc 1 nhóm) */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Quy mô nhân sự nhóm
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <Users size={16} style={{ color: 'var(--accent-blue)' }} />
                  <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {teamMembers.length} Nhân viên
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    (Thuộc duy nhất nhóm này)
                  </span>
                </div>
              </div>
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                onClick={() => onViewTeamEmployees(teamNode.id)}
              >
                Xem DS thành viên
              </button>
            </div>
          </div>

          {/* Hàng dưới: Khu vực địa lý phụ trách (Tiêu chí 4) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="team-territories">
              <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} />
                <span>Khu vực phụ trách:</span>
              </span>
              {assignedTerritories.length > 0 ? (
                assignedTerritories.map(tr => (
                  <span key={tr.id} className="territory-tag" title={tr.provinces.join(', ')}>
                    {tr.name}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontStyle: 'italic' }}>
                  ⚠️ Chưa phân bổ khu vực địa lý
                </span>
              )}
            </div>
            <button 
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={() => onAssignTerritory(teamNode)}
            >
              <MapPin size={12} />
              <span>Gán địa bàn</span>
            </button>
          </div>
        </div>

        {/* Render nhóm con theo đệ quy nếu không bị thu gọn */}
        {hasChildren && !isCollapsed && (
          <div className="tree-branch">
            {teamNode.children.map(childNode => renderTreeNode(childNode, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree-container">
      {/* Thanh công cụ quản lý cây */}
      <div className="tree-toolbar">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderTree size={20} style={{ color: 'var(--accent-blue)' }} />
            <span>Sơ Đồ Cây Tổ Chức Kinh Doanh Đa Cấp Bậc</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Mỗi nhóm kinh doanh có đúng 1 trưởng nhóm, liên kết chặt chẽ với cây quản trị và phân quyền dữ liệu.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Ô tìm kiếm nhanh */}
          <div className="search-input-box">
            <Search size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Tìm theo tên nhóm, mã SKU, tên trưởng nhóm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary" onClick={expandAll} title="Mở rộng toàn bộ cây">
            <Maximize2 size={15} />
            <span>Mở rộng tất cả</span>
          </button>
          <button className="btn btn-secondary" onClick={collapseAll} title="Thu gọn toàn bộ cây">
            <Minimize2 size={15} />
            <span>Thu gọn tất cả</span>
          </button>
        </div>
      </div>

      {/* Vùng vẽ Cây Tổ Chức */}
      <div className="tree-root">
        {nestedTree.map(rootNode => renderTreeNode(rootNode, 0))}
      </div>
    </div>
  );
}
