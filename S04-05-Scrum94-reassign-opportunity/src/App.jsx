import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { WorkloadSummaryCards } from './components/WorkloadSummaryCards';
import { TeamWorkloadBoard } from './components/TeamWorkloadBoard';
import { BulkActionToolbar } from './components/BulkActionToolbar';
import { RecipientWelcomeBanner } from './components/RecipientWelcomeBanner';
import { OpportunitiesTable } from './components/OpportunitiesTable';
import { ReassignModal } from './components/ReassignModal';
import { AutoBalanceModal } from './components/AutoBalanceModal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { ReassignmentAuditLogModal } from './components/ReassignmentAuditLogModal';
import { JiraTicketModal } from './components/JiraTicketModal';
import { Toast } from './components/Toast';

import { MOCK_USERS } from './data/mockUsers';
import { INITIAL_OPPORTUNITIES, INITIAL_AUDIT_LOGS, CURRENT_SYSTEM_DATE } from './data/mockOpportunities';
import { calculateTeamWorkload, executeReassignment, executeAutoBalanceDistribution } from './utils/reassignmentEngine';
import { RotateCcw } from 'lucide-react';

export const App = () => {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('scrum94_theme') || 'dark');

  // Opportunities & Audit Logs (Stored in localStorage for persistence)
  const [opportunities, setOpportunities] = useState(() => {
    try {
      const saved = localStorage.getItem('scrum94_opportunities');
      return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('scrum94_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Current Persona (Default: Trần Đình Trọng - Trưởng nhóm kinh doanh)
  const [currentPersona, setCurrentPersona] = useState(MOCK_USERS[0]);

  // Selected deals for bulk actions (AC1)
  const [selectedDealIds, setSelectedDealIds] = useState([]);

  // Active Filter Tab & Filter by Rep
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');
  const [selectedRepFilter, setSelectedRepFilter] = useState(null);

  // Modals state
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignTargetDealIds, setReassignTargetDealIds] = useState([]);
  const [isAutoBalanceModalOpen, setIsAutoBalanceModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDetailDeal, setActiveDetailDeal] = useState(null);
  const [isAuditLogModalOpen, setIsAuditLogModalOpen] = useState(false);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  // Sync Theme to HTML data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrum94_theme', theme);
  }, [theme]);

  // Save Opportunities & Audit Logs to localStorage
  useEffect(() => {
    localStorage.setItem('scrum94_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('scrum94_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Tính toán workload động cho đội ngũ
  const teamWorkload = useMemo(() => {
    return calculateTeamWorkload(MOCK_USERS, opportunities);
  }, [opportunities]);

  // Lọc danh sách deal mới nhận bàn giao của Persona hiện tại (AC2)
  const newlyAssignedDealsForCurrentPersona = useMemo(() => {
    return opportunities.filter(
      (o) => o.salesRepId === currentPersona.id && o.isNewlyReassigned
    );
  }, [opportunities, currentPersona]);

  // Selected deals objects
  const selectedDeals = useMemo(() => {
    return opportunities.filter((o) => selectedDealIds.includes(o.id));
  }, [opportunities, selectedDealIds]);

  // Handlers for Selection
  const handleToggleSelectDeal = (dealId) => {
    setSelectedDealIds((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
    );
  };

  const handleSelectAllDeals = (dealIds) => {
    setSelectedDealIds(dealIds);
  };

  const handleClearSelection = () => {
    setSelectedDealIds([]);
  };

  // Mở modal phân bổ cho 1 hoặc nhiều deal (AC1)
  const handleOpenReassignModal = (dealIds) => {
    setReassignTargetDealIds(dealIds);
    setIsReassignModalOpen(true);
  };

  const handleOpenBulkReassignModal = () => {
    if (selectedDealIds.length > 0) {
      setReassignTargetDealIds(selectedDealIds);
      setIsReassignModalOpen(true);
    }
  };

  const handleOpenAutoBalanceModal = () => {
    if (selectedDealIds.length > 0) {
      setReassignTargetDealIds(selectedDealIds);
      setIsAutoBalanceModalOpen(true);
    }
  };

  // Nút phân bổ nhanh toàn bộ deal của 1 nhân sự từ bảng Workload
  const handleQuickReassignRep = (rep) => {
    const repDeals = opportunities.filter((o) => o.salesRepId === rep.id);
    if (repDeals.length === 0) {
      setToast({
        type: 'info',
        title: 'Không có thương vụ',
        message: `${rep.name} hiện không phụ trách thương vụ nào cần bàn giao.`
      });
      return;
    }
    const repDealIds = repDeals.map((d) => d.id);
    setSelectedDealIds(repDealIds);
    setReassignTargetDealIds(repDealIds);
    setIsReassignModalOpen(true);
  };

  // Xử lý xác nhận phân bổ (AC1, AC2, AC3)
  const handleConfirmReassign = ({
    dealIds,
    targetRep,
    reasonData,
    customReasonText,
    handoverNotes,
    checklist,
    initiator
  }) => {
    try {
      const result = executeReassignment({
        opportunities,
        selectedDealIds: dealIds,
        targetRep,
        reasonData,
        customReasonText,
        handoverNotes,
        checklist,
        initiator
      });

      setOpportunities(result.updatedOpportunities);
      setAuditLogs([result.newAuditLogEntry, ...auditLogs]);
      setSelectedDealIds([]);

      // Cập nhật deal đang mở trong modal chi tiết nếu có
      if (activeDetailDeal && dealIds.includes(activeDetailDeal.id)) {
        const updatedDetail = result.updatedOpportunities.find((o) => o.id === activeDetailDeal.id);
        if (updatedDetail) setActiveDetailDeal(updatedDetail);
      }

      setToast({
        type: 'success',
        title: 'Phân bổ thành công!',
        message: `Đã chuyển giao ${result.affectedDealsCount} cơ hội sang ${targetRep.name}. Dữ liệu và lịch sử đã được cập nhật tức thì (AC1 & AC2).`
      });
    } catch (err) {
      setToast({
        type: 'danger',
        title: 'Lỗi phân bổ',
        message: err.message || 'Không thể hoàn tất quá trình phân bổ.'
      });
    }
  };

  // Xử lý xác nhận cân bằng tải tự động (AC1)
  const handleConfirmAutoBalance = ({
    dealIds,
    candidateReps,
    reasonData,
    handoverNotes,
    checklist,
    initiator
  }) => {
    try {
      const result = executeAutoBalanceDistribution({
        opportunities,
        selectedDealIds: dealIds,
        candidateReps,
        reasonData,
        handoverNotes,
        checklist,
        initiator
      });

      setOpportunities(result.updatedOpportunities);
      setAuditLogs([...result.auditLogs, ...auditLogs]);
      setSelectedDealIds([]);

      setToast({
        type: 'success',
        title: 'Cân bằng tải hoàn tất!',
        message: `Hệ thống đã tự động chia đều ${dealIds.length} cơ hội cho các nhân sự còn rảnh tải.`
      });
    } catch (err) {
      setToast({
        type: 'danger',
        title: 'Lỗi cân bằng tải',
        message: err.message || 'Không thể hoàn tất cân bằng tải.'
      });
    }
  };

  // Người nhận xác nhận đã xem toàn bộ deal mới (AC2)
  const handleAcknowledgeAllNewDeals = () => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.salesRepId === currentPersona.id ? { ...o, isNewlyReassigned: false } : o
      )
    );
    setToast({
      type: 'success',
      title: 'Đã xác nhận tiếp nhận',
      message: 'Bạn đã hoàn tất tiếp nhận danh sách cơ hội bàn giao.'
    });
  };

  // Reset dữ liệu mẫu về ban đầu
  const handleResetData = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục lại dữ liệu mẫu ban đầu của SCRUM-94?')) {
      setOpportunities(INITIAL_OPPORTUNITIES);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setSelectedDealIds([]);
      setActiveFilterTab('ALL');
      setSelectedRepFilter(null);
      localStorage.removeItem('scrum94_opportunities');
      localStorage.removeItem('scrum94_audit_logs');
      setToast({
        type: 'info',
        title: 'Khôi phục dữ liệu',
        message: 'Dữ liệu mẫu ban đầu đã được thiết lập lại thành công.'
      });
    }
  };

  return (
    <div className="app-container">
      {/* Topbar điều hành */}
      <Header 
        users={MOCK_USERS}
        currentPersona={currentPersona}
        onPersonaChange={setCurrentPersona}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJiraTicket={() => setIsJiraModalOpen(true)}
        onOpenAuditLog={() => setIsAuditLogModalOpen(true)}
        auditLogCount={auditLogs.length}
      />

      <main className="main-content">
        {/* Banner chào mừng người nhận mới khi có deal bàn giao (AC2) */}
        <RecipientWelcomeBanner 
          currentPersona={currentPersona}
          newlyAssignedDeals={newlyAssignedDealsForCurrentPersona}
          onViewNewDeals={() => setActiveFilterTab('NEWLY_RECEIVED')}
          onAcknowledgeAll={handleAcknowledgeAllNewDeals}
        />

        {/* 4 Thẻ KPI khối lượng & Phân bổ */}
        <WorkloadSummaryCards 
          opportunities={opportunities}
          teamWorkload={teamWorkload}
          auditLogs={auditLogs}
          activeFilterTab={activeFilterTab}
          onSelectTab={setActiveFilterTab}
        />

        {/* Bảng giám sát tải nhân viên (Capacity & Workload Board) */}
        <TeamWorkloadBoard 
          teamWorkload={teamWorkload}
          selectedRepFilter={selectedRepFilter}
          onSelectRepFilter={setSelectedRepFilter}
          onQuickReassignRep={handleQuickReassignRep}
        />

        {/* Thanh công cụ thao tác hàng loạt (Bulk Action Toolbar - AC1) */}
        <BulkActionToolbar 
          selectedDealIds={selectedDealIds}
          selectedDeals={selectedDeals}
          onOpenBulkReassignModal={handleOpenBulkReassignModal}
          onOpenAutoBalanceModal={handleOpenAutoBalanceModal}
          onClearSelection={handleClearSelection}
        />

        {/* Bảng danh sách cơ hội chính */}
        <OpportunitiesTable 
          opportunities={opportunities}
          currentPersona={currentPersona}
          users={MOCK_USERS}
          selectedDealIds={selectedDealIds}
          onToggleSelectDeal={handleToggleSelectDeal}
          onSelectAllDeals={handleSelectAllDeals}
          onClearSelection={handleClearSelection}
          onOpenReassignModal={handleOpenReassignModal}
          onOpenDetailModal={(deal) => {
            setActiveDetailDeal(deal);
            setIsDetailModalOpen(true);
          }}
          activeFilterTab={activeFilterTab}
          onSelectTab={setActiveFilterTab}
          selectedRepFilter={selectedRepFilter}
          onSelectRepFilter={setSelectedRepFilter}
        />

        {/* Nút Reset Dữ Liệu ở Chân Trang */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button 
            className="btn btn-sm btn-outline"
            onClick={handleResetData}
            style={{ color: 'var(--text-muted)' }}
          >
            <RotateCcw size={14} />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            SCRUM-94: Phân bổ lại cơ hội khi người phụ trách nghỉ dài hoặc quá tải • React 19 + Vite
          </div>
        </div>
      </main>

      {/* Modal Phân Bổ (AC1, AC3) */}
      <ReassignModal 
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        dealIds={reassignTargetDealIds}
        opportunities={opportunities}
        teamWorkload={teamWorkload}
        currentPersona={currentPersona}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* Modal Cân Bằng Tải Tự Động */}
      <AutoBalanceModal 
        isOpen={isAutoBalanceModalOpen}
        onClose={() => setIsAutoBalanceModalOpen(false)}
        dealIds={reassignTargetDealIds}
        opportunities={opportunities}
        teamWorkload={teamWorkload}
        currentPersona={currentPersona}
        onConfirmAutoBalance={handleConfirmAutoBalance}
      />

      {/* Modal Xem Toàn Bộ Lịch Sử & Hồ Sơ Deal (AC2) */}
      <OpportunityDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        deal={activeDetailDeal}
        onReassignDeal={(dealIds) => {
          setIsDetailModalOpen(false);
          handleOpenReassignModal(dealIds);
        }}
      />

      {/* Modal Nhật Ký Phân Bổ Toàn Hệ Thống (AC3) */}
      <ReassignmentAuditLogModal 
        isOpen={isAuditLogModalOpen}
        onClose={() => setIsAuditLogModalOpen(false)}
        auditLogs={auditLogs}
      />

      {/* Modal Đề Bài Jira Ticket SCRUM-94 */}
      <JiraTicketModal 
        isOpen={isJiraModalOpen}
        onClose={() => setIsJiraModalOpen(false)}
      />

      {/* Thông báo Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
