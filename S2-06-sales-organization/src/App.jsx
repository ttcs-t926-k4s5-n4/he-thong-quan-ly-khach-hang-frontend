import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import OrgTreeView from './components/OrgTreeView';
import TeamModal from './components/TeamModal';
import EmployeeManagement from './components/EmployeeManagement';
import EmployeeModal from './components/EmployeeModal';
import TransferModal from './components/TransferModal';
import TerritoryManagement from './components/TerritoryManagement';
import TerritoryModal from './components/TerritoryModal';
import AssignTerritoryModal from './components/AssignTerritoryModal';
import DataScopeSimulator from './components/DataScopeSimulator';
import HierarchyAnalytics from './components/HierarchyAnalytics';
import ScrumGuideModal from './components/ScrumGuideModal';

import { 
  INITIAL_TEAMS, 
  INITIAL_EMPLOYEES, 
  INITIAL_TERRITORIES, 
  INITIAL_DEALS, 
  INITIAL_TRANSFERS 
} from './data/mockData';

import { 
  getEmployeesInScope, 
  getTeamsInScope, 
  getDealsInScope 
} from './utils/orgUtils';

import { 
  FolderTree, 
  Users, 
  MapPin, 
  Eye, 
  BarChart3, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scrum64_theme') || 'dark';
  });

  // Current Impersonated User (Default: Nguyễn Văn An - Giám Đốc Toàn Quốc)
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('scrum64_user_id') || 'NV-001';
  });

  // Active Tab: 'tree' | 'employees' | 'territories' | 'scope' | 'analytics'
  const [activeTab, setActiveTab] = useState('tree');

  // Teams state
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('scrum64_teams');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TEAMS;
  });

  // Employees state
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('scrum64_employees');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EMPLOYEES;
  });

  // Territories state
  const [territories, setTerritories] = useState(() => {
    const saved = localStorage.getItem('scrum64_territories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TERRITORIES;
  });

  // Deals state
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('scrum64_deals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_DEALS;
  });

  // Transfers audit history state
  const [transfers, setTransfers] = useState(() => {
    const saved = localStorage.getItem('scrum64_transfers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TRANSFERS;
  });

  // Modals state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [parentTeamId, setParentTeamId] = useState(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [defaultTeamId, setDefaultTeamId] = useState('');

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferringEmployee, setTransferringEmployee] = useState(null);

  const [isTerritoryModalOpen, setIsTerritoryModalOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState(null);

  const [isAssignTerritoryModalOpen, setIsAssignTerritoryModalOpen] = useState(false);
  const [assigningTerritory, setAssigningTerritory] = useState(null);

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrum64_theme', theme);
  }, [theme]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('scrum64_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('scrum64_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('scrum64_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('scrum64_territories', JSON.stringify(territories));
  }, [territories]);

  useEffect(() => {
    localStorage.setItem('scrum64_transfers', JSON.stringify(transfers));
  }, [transfers]);

  // DYNAMIC COMPUTED DATA SCOPE (TIÊU CHÍ CỐT LÕI 3)
  const accessibleEmployees = getEmployeesInScope(currentUserId, employees, teams);
  const accessibleTeams = getTeamsInScope(currentUserId, employees, teams);
  const accessibleDeals = getDealsInScope(currentUserId, deals, employees, teams);

  // Current active employee
  const currentEmp = employees.find(e => e.id === currentUserId) || employees[0];

  // 1. Team CRUD Handlers
  const handleOpenAddTeam = (parentId = null) => {
    setEditingTeam(null);
    setParentTeamId(parentId);
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeam = (team) => {
    setEditingTeam(team);
    setParentTeamId(team.parentId);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = (teamData) => {
    if (editingTeam) {
      setTeams(prev => prev.map(t => t.id === editingTeam.id ? { ...t, ...teamData } : t));
    } else {
      const newTeam = {
        ...teamData,
        id: `team-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTeams(prev => [...prev, newTeam]);
    }
  };

  const handleDeleteTeam = (team) => {
    // Ràng buộc 1: Không thể xoá nếu đang có nhóm con
    const hasChildren = teams.some(t => t.parentId === team.id);
    if (hasChildren) {
      alert(`⚠️ Không thể xoá nhóm "${team.name}" vì đang có các nhóm kinh doanh con trực thuộc. Vui lòng di chuyển hoặc xoá các nhóm con trước.`);
      return;
    }

    // Ràng buộc 2: Không thể xoá nếu đang có nhân viên
    const hasEmployees = employees.some(e => e.teamId === team.id);
    if (hasEmployees) {
      alert(`⚠️ Không thể xoá nhóm "${team.name}" vì vẫn còn nhân viên đang trực thuộc nhóm này. Vui lòng điều chuyển toàn bộ nhân viên sang nhóm khác trước.`);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xoá nhóm kinh doanh "${team.name}" (${team.code}) không?`)) {
      setTeams(prev => prev.filter(t => t.id !== team.id));
    }
  };

  // 2. Employee CRUD Handlers
  const handleOpenAddEmployee = (teamId = '') => {
    setDefaultTeamId(teamId);
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (empData) => {
    setEmployees(prev => [empData, ...prev]);
  };

  // 3. Employee Transfer Handler (Tiêu chí 2: Mỗi nhân viên thuộc đúng 1 nhóm)
  const handleOpenTransferModal = (emp) => {
    setTransferringEmployee(emp);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = (transferData) => {
    // 1. Cập nhật nhóm mới cho nhân viên (đảm bảo duy nhất 1 nhóm)
    setEmployees(prev => prev.map(e => {
      if (e.id === transferData.employeeId) {
        return {
          ...e,
          teamId: transferData.toTeamId,
          // Nếu nhân viên đang là trưởng nhóm ở nhóm cũ, hạ xuống thành viên thường khi chuyển
          isLeader: false
        };
      }
      return e;
    }));

    // 2. Ghi nhận vào nhật ký điều chuyển
    const newTransferLog = {
      ...transferData,
      id: `TF-${Date.now().toString().slice(-4)}`
    };
    setTransfers(prev => [newTransferLog, ...prev]);
  };

  // 4. Territory CRUD & Assignment Handlers (Tiêu chí 4)
  const handleOpenAddTerritory = () => {
    setEditingTerritory(null);
    setIsTerritoryModalOpen(true);
  };

  const handleOpenEditTerritory = (tr) => {
    setEditingTerritory(tr);
    setIsTerritoryModalOpen(true);
  };

  const handleSaveTerritory = (trData) => {
    if (editingTerritory) {
      setTerritories(prev => prev.map(t => t.id === editingTerritory.id ? { ...t, ...trData } : t));
    } else {
      setTerritories(prev => [...prev, trData]);
    }
  };

  const handleDeleteTerritory = (tr) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá khu vực địa lý "${tr.name}" (${tr.code})?`)) {
      setTerritories(prev => prev.filter(t => t.id !== tr.id));
      // Xoá tham chiếu trong teams
      setTeams(prev => prev.map(team => ({
        ...team,
        territoryIds: (team.territoryIds || []).filter(id => id !== tr.id)
      })));
    }
  };

  const handleOpenAssignModal = (tr) => {
    setAssigningTerritory(tr);
    setIsAssignTerritoryModalOpen(true);
  };

  const handleSaveTerritoryAssignments = (territoryId, assignedTeamIds) => {
    setTeams(prev => prev.map(team => {
      const shouldHave = assignedTeamIds.includes(team.id);
      const currentList = team.territoryIds || [];
      const hasIt = currentList.includes(territoryId);

      if (shouldHave && !hasIt) {
        return { ...team, territoryIds: [...currentList, territoryId] };
      }
      if (!shouldHave && hasIt) {
        return { ...team, territoryIds: currentList.filter(id => id !== territoryId) };
      }
      return team;
    }));
  };

  // Reset to sample initial data
  const handleResetData = () => {
    if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu về cây tổ chức, nhân sự, khu vực và cơ hội kinh doanh?')) {
      localStorage.removeItem('scrum64_teams');
      localStorage.removeItem('scrum64_employees');
      localStorage.removeItem('scrum64_territories');
      localStorage.removeItem('scrum64_deals');
      localStorage.removeItem('scrum64_transfers');
      setTeams(INITIAL_TEAMS);
      setEmployees(INITIAL_EMPLOYEES);
      setTerritories(INITIAL_TERRITORIES);
      setDeals(INITIAL_DEALS);
      setTransfers(INITIAL_TRANSFERS);
      setCurrentUserId('NV-001');
    }
  };

  return (
    <div className="app-container">
      {/* 1. Thanh tiêu đề & Bộ chọn người dùng mô phỏng */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
        employees={employees}
        teams={teams}
        deals={deals}
        accessibleEmployees={accessibleEmployees}
        accessibleTeams={accessibleTeams}
        accessibleDeals={accessibleDeals}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      <main className="main-content">
        {/* 2. Thẻ chỉ số tổng quan */}
        <StatsOverview 
          teams={teams}
          employees={employees}
          territories={territories}
          accessibleDeals={accessibleDeals}
          currentEmp={currentEmp}
        />

        {/* 3. Thanh chuyển Tab chức năng */}
        <div className="tabs-nav-bar">
          <button 
            className={`tab-btn ${activeTab === 'tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('tree')}
          >
            <FolderTree size={16} />
            <span>1. Sơ Đồ Cây Tổ Chức</span>
            <span className="tab-badge">{teams.length}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <Users size={16} />
            <span>2. Quản Lý Nhân Sự & Đơn Nhóm</span>
            <span className="tab-badge">{employees.length}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'territories' ? 'active' : ''}`}
            onClick={() => setActiveTab('territories')}
          >
            <MapPin size={16} />
            <span>3. Khai Báo Khu Vực Địa Lý</span>
            <span className="tab-badge">{territories.length}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'scope' ? 'active' : ''}`}
            onClick={() => setActiveTab('scope')}
          >
            <Eye size={16} />
            <span>4. Mô Phỏng Phạm Vi Dữ Liệu</span>
            <span className="tab-badge" style={{ background: 'var(--accent-emerald)', color: '#fff' }}>
              Core
            </span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} />
            <span>5. Phân Cấp & KPI Tổ Chức</span>
          </button>

          <div style={{ marginLeft: 'auto' }}>
            <button 
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              onClick={handleResetData}
              title="Khôi phục lại toàn bộ dữ liệu mẫu ban đầu"
            >
              <RotateCcw size={14} />
              <span>Dữ Liệu Mẫu</span>
            </button>
          </div>
        </div>

        {/* 4. Nội dung theo từng Tab */}
        {activeTab === 'tree' && (
          <OrgTreeView 
            teams={teams}
            employees={employees}
            territories={territories}
            onAddChildTeam={handleOpenAddTeam}
            onEditTeam={handleOpenEditTeam}
            onDeleteTeam={handleDeleteTeam}
            onAssignTerritory={(team) => {
              setActiveTab('territories');
            }}
            onViewTeamEmployees={(teamId) => {
              setSelectedTeamFilter(teamId);
              setActiveTab('employees');
            }}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeManagement 
            employees={employees}
            teams={teams}
            transfers={transfers}
            onOpenAddEmployee={() => handleOpenAddEmployee('')}
            onOpenTransferModal={handleOpenTransferModal}
            selectedTeamFilter={selectedTeamFilter}
            setSelectedTeamFilter={setSelectedTeamFilter}
          />
        )}

        {activeTab === 'territories' && (
          <TerritoryManagement 
            territories={territories}
            teams={teams}
            onOpenAddTerritory={handleOpenAddTerritory}
            onOpenEditTerritory={handleOpenEditTerritory}
            onDeleteTerritory={handleDeleteTerritory}
            onOpenAssignModal={handleOpenAssignModal}
          />
        )}

        {activeTab === 'scope' && (
          <DataScopeSimulator 
            currentUserId={currentUserId}
            setCurrentUserId={setCurrentUserId}
            employees={employees}
            teams={teams}
            deals={deals}
            accessibleEmployees={accessibleEmployees}
            accessibleTeams={accessibleTeams}
            accessibleDeals={accessibleDeals}
          />
        )}

        {activeTab === 'analytics' && (
          <HierarchyAnalytics 
            teams={teams}
            employees={employees}
            territories={territories}
            deals={deals}
          />
        )}
      </main>

      {/* 5. Modals */}
      <TeamModal 
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSave={handleSaveTeam}
        editingTeam={editingTeam}
        parentTeamId={parentTeamId}
        teams={teams}
        employees={employees}
        territories={territories}
      />

      <EmployeeModal 
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        teams={teams}
        defaultTeamId={defaultTeamId}
      />

      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        employee={transferringEmployee}
        teams={teams}
        employees={employees}
        onConfirmTransfer={handleConfirmTransfer}
      />

      <TerritoryModal 
        isOpen={isTerritoryModalOpen}
        onClose={() => setIsTerritoryModalOpen(false)}
        onSave={handleSaveTerritory}
        editingTerritory={editingTerritory}
      />

      <AssignTerritoryModal 
        isOpen={isAssignTerritoryModalOpen}
        onClose={() => setIsAssignTerritoryModalOpen(false)}
        territory={assigningTerritory}
        teams={teams}
        onSaveAssignments={handleSaveTerritoryAssignments}
      />

      <ScrumGuideModal 
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
