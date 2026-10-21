import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { DailyEvaluationBanner } from './components/DailyEvaluationBanner.jsx';
import { RiskKpiScorecards } from './components/RiskKpiScorecards.jsx';
import { StagnantOpportunitiesList } from './components/StagnantOpportunitiesList.jsx';
import { ThresholdConfigModal } from './components/ThresholdConfigModal.jsx';
import { DailyEvaluationJobModal } from './components/DailyEvaluationJobModal.jsx';
import { InterventionModal } from './components/InterventionModal.jsx';
import { LogActivityModal } from './components/LogActivityModal.jsx';
import { ExtendCloseDateModal } from './components/ExtendCloseDateModal.jsx';
import { OpportunityDetailModal } from './components/OpportunityDetailModal.jsx';
import { JiraTicketModal } from './components/JiraTicketModal.jsx';
import { AddOpportunityModal } from './components/AddOpportunityModal.jsx';
import { ExportReportModal } from './components/ExportReportModal.jsx';
import { Toast } from './components/Toast.jsx';

import { DEFAULT_STAGE_THRESHOLDS } from './data/mockStages.js';
import { INITIAL_OPPORTUNITIES, CURRENT_SYSTEM_DATE } from './data/mockOpportunities.js';
import { INITIAL_JOB_HISTORY } from './data/mockEvaluationJob.js';
import { MOCK_USERS } from './data/mockUsers.js';
import { 
  evaluateAllOpportunities, 
  calculateStagnantPipelineMetrics 
} from './utils/stagnantEvaluation.js';

export function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scrum93_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrum93_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // State cơ hội & Cấu hình ngưỡng
  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('scrum93_opportunities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_OPPORTUNITIES;
  });

  const [stageThresholds, setStageThresholds] = useState(() => {
    const saved = localStorage.getItem('scrum93_thresholds');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_STAGE_THRESHOLDS;
  });

  const [jobHistory, setJobHistory] = useState(() => {
    const saved = localStorage.getItem('scrum93_job_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_JOB_HISTORY;
  });

  const [currentDate] = useState(CURRENT_SYSTEM_DATE);
  const [currentPersona, setCurrentPersona] = useState('TEAM_LEAD');

  // Bộ lọc & Điều hướng
  const [activeTab, setActiveTab] = useState('FLAGGED_ONLY'); // AC3: Mặc định hiển thị riêng cơ hội có cờ cho Trưởng nhóm
  const [flagFilter, setFlagFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [repFilter, setRepFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('SEVERITY');

  // Trạng thái quét đánh giá
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals state
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [selectedInterventionDeal, setSelectedInterventionDeal] = useState(null);
  const [selectedLogActivityDeal, setSelectedLogActivityDeal] = useState(null);
  const [selectedExtendCloseDeal, setSelectedExtendCloseDeal] = useState(null);
  const [selectedDetailDeal, setSelectedDetailDeal] = useState(null);

  // Lưu tự động localStorage
  useEffect(() => {
    localStorage.setItem('scrum93_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('scrum93_thresholds', JSON.stringify(stageThresholds));
  }, [stageThresholds]);

  useEffect(() => {
    localStorage.setItem('scrum93_job_history', JSON.stringify(jobHistory));
  }, [jobHistory]);

  // Khi chuyển Persona sang Sales Rep -> tự lọc sang nhân viên đó
  const handlePersonaChange = (newPersona) => {
    setCurrentPersona(newPersona);
    if (newPersona === 'SALES_REP') {
      setRepFilter('USR-REP-01');
      showToast('Đã chuyển sang góc nhìn Nhân viên: Nguyễn Văn An (Chỉ xem cơ hội của mình)', 'info');
    } else if (newPersona === 'SALES_DIRECTOR') {
      setRepFilter('ALL');
      setActiveTab('ALL_PIPELINE');
      showToast('Đã chuyển sang góc nhìn Giám đốc kinh doanh: Xem toàn bộ pipeline', 'info');
    } else {
      setRepFilter('ALL');
      setActiveTab('FLAGGED_ONLY');
      showToast('Đã chuyển sang góc nhìn Trưởng nhóm: Xem cơ hội cần can thiệp', 'info');
    }
  };

  // Động cơ đánh giá toàn bộ cơ hội (AC1, AC2)
  const evaluatedOpportunities = useMemo(() => {
    return evaluateAllOpportunities(opportunities, stageThresholds, currentDate);
  }, [opportunities, stageThresholds, currentDate]);

  // Tính toán bảng điểm KPI
  const metrics = useMemo(() => {
    return calculateStagnantPipelineMetrics(evaluatedOpportunities);
  }, [evaluatedOpportunities]);

  // Hành động AC1: Lưu cấu hình ngưỡng N ngày theo giai đoạn
  const handleSaveThresholds = (newThresholds) => {
    setStageThresholds(newThresholds);
    showToast('Đã cập nhật ngưỡng N ngày thành công! Toàn bộ cơ hội đã được đánh giá lại.', 'success');
  };

  // Hành động AC4: Kích hoạt chạy tác vụ đánh giá hàng ngày
  const handleTriggerDailyEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
      
      const newLog = {
        id: `JOB-LOG-${Date.now()}`,
        executionTime: timeStr,
        triggerType: 'MANUAL',
        triggeredBy: 'Trần Đình Trọng (Trưởng nhóm bấm Quét thủ công)',
        status: 'SUCCESS',
        durationMs: Math.floor(250 + Math.random() * 200),
        scannedCount: evaluatedOpportunities.length,
        flaggedCount: metrics.flaggedDealsCount,
        newlyFlagged: 0,
        unflagged: 0,
        note: `Hoàn tất quét toàn bộ ${evaluatedOpportunities.length} cơ hội. Phát hiện ${metrics.flaggedDealsCount} cơ hội có cờ đình trệ.`
      };

      setJobHistory(prev => [newLog, ...prev]);
      setIsEvaluating(false);
      showToast(`Đã hoàn tất tác vụ đánh giá hàng ngày! Quét ${evaluatedOpportunities.length} cơ hội, phát hiện ${metrics.flaggedDealsCount} deal có cờ.`, 'success');
    }, 600);
  };

  // Hành động AC3: Lưu can thiệp của Trưởng nhóm
  const handleSaveIntervention = (dealId, newIntervention) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id !== dealId) return opp;
      const updatedInterventions = [...(opp.interventions || []), newIntervention];

      let updatedRep = {};
      if (newIntervention.type === 'REASSIGN_REP' && newIntervention.newRepId) {
        const rep = MOCK_USERS.find(u => u.id === newIntervention.newRepId);
        if (rep) {
          updatedRep = {
            salesRepId: rep.id,
            salesRepName: rep.name,
            salesRepAvatar: rep.avatar,
            teamId: rep.teamId
          };
        }
      }

      return {
        ...opp,
        ...updatedRep,
        interventions: updatedInterventions
      };
    }));

    showToast('Đã ghi nhận chỉ đạo can thiệp của Trưởng nhóm thành công!', 'success');
  };

  // Ghi nhận hoạt động mới -> Gỡ cờ đình trệ hoạt động > N ngày (AC1)
  const handleSaveActivity = (dealId, newActivity, activityDate) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id !== dealId) return opp;
      return {
        ...opp,
        lastActivityDate: activityDate,
        lastActivityType: newActivity.typeLabel,
        lastActivityNote: newActivity.content,
        activities: [newActivity, ...(opp.activities || [])]
      };
    }));

    showToast('Đã ghi nhận hoạt động mới! Ngày hoạt động cuối đã được cập nhật.', 'success');
  };

  // Gia hạn ngày chốt -> Gỡ cờ quá hạn chốt (AC2)
  const handleSaveNewCloseDate = (dealId, newCloseDate, reason) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id !== dealId) return opp;
      const activityNote = {
        date: CURRENT_SYSTEM_DATE,
        type: 'GIA_HAN_NGAY_CHOT',
        typeLabel: 'Gia hạn ngày chốt',
        author: 'Trần Đình Trọng (Trưởng nhóm)',
        content: `Gia hạn ngày chốt mới đến ${newCloseDate}. Lý do: ${reason}`
      };
      return {
        ...opp,
        expectedCloseDate: newCloseDate,
        activities: [activityNote, ...(opp.activities || [])]
      };
    }));

    showToast('Đã gia hạn ngày dự kiến chốt thành công! Cờ quá hạn chốt đã được gỡ bỏ.', 'success');
  };

  // Thêm cơ hội mới
  const handleAddOpportunity = (newDeal) => {
    setOpportunities(prev => [newDeal, ...prev]);
    showToast(`Đã tạo cơ hội mới "${newDeal.title}" thành công!`, 'success');
  };

  // Lọc nhanh từ Thẻ KPI
  const handleFilterByFlag = (flagType) => {
    setActiveTab('FLAGGED_ONLY');
    if (flagType === 'ALL_FLAGGED') {
      setFlagFilter('ALL');
    } else if (flagType === 'INACTIVITY') {
      setFlagFilter('INACTIVITY');
    } else if (flagType === 'OVERDUE_CLOSE') {
      setFlagFilter('OVERDUE_CLOSE');
    } else if (flagType === 'INTERVENED') {
      setActiveTab('INTERVENED_ONLY');
    }
  };

  return (
    <div className="app-container">
      {/* 1. Thanh Topbar điều hành */}
      <Header 
        currentPersona={currentPersona}
        onPersonaChange={handlePersonaChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
        onOpenJobModal={() => setIsJobModalOpen(true)}
        onOpenJiraModal={() => setIsJiraModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onTriggerDailyEvaluation={handleTriggerDailyEvaluation}
        isEvaluating={isEvaluating}
        lastJobRunTime={jobHistory[0]?.executionTime}
      />

      {/* 2. Nội dung chính Dashboard */}
      <main className="main-content">
        {/* Banner Tác vụ đánh giá chạy mỗi ngày một lần (AC4) */}
        <DailyEvaluationBanner 
          lastRunInfo={jobHistory[0] || {}}
          onTriggerDailyEvaluation={handleTriggerDailyEvaluation}
          onOpenJobModal={() => setIsJobModalOpen(true)}
          isEvaluating={isEvaluating}
          metrics={metrics}
        />

        {/* 5 Thẻ điểm KPI cảnh báo rủi ro */}
        <RiskKpiScorecards 
          metrics={metrics}
          onFilterByFlag={handleFilterByFlag}
        />

        {/* Danh sách cơ hội có cờ hiển thị riêng cho trưởng nhóm (AC3) */}
        <StagnantOpportunitiesList 
          opportunities={evaluatedOpportunities}
          stageThresholds={stageThresholds}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          flagFilter={flagFilter}
          onFlagFilterChange={setFlagFilter}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          repFilter={repFilter}
          onRepFilterChange={setRepFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onOpenInterventionModal={(opp) => setSelectedInterventionDeal(opp)}
          onOpenLogActivityModal={(opp) => setSelectedLogActivityDeal(opp)}
          onOpenExtendCloseModal={(opp) => setSelectedExtendCloseDeal(opp)}
          onOpenDetailModal={(opp) => setSelectedDetailDeal(opp)}
          onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
          currentPersona={currentPersona}
        />
      </main>

      {/* 3. Các cửa sổ Modal nghiệp vụ */}
      {/* Modal AC1: Cấu hình ngưỡng N ngày theo giai đoạn */}
      <ThresholdConfigModal 
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        currentThresholds={stageThresholds}
        onSaveThresholds={handleSaveThresholds}
        opportunities={evaluatedOpportunities}
      />

      {/* Modal AC4: Nhật ký tác vụ đánh giá hàng ngày */}
      <DailyEvaluationJobModal 
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        jobHistory={jobHistory}
        onTriggerDailyEvaluation={handleTriggerDailyEvaluation}
        isEvaluating={isEvaluating}
        metrics={metrics}
      />

      {/* Modal AC3: Trưởng nhóm can thiệp sớm */}
      <InterventionModal 
        isOpen={Boolean(selectedInterventionDeal)}
        onClose={() => setSelectedInterventionDeal(null)}
        opportunity={selectedInterventionDeal}
        onSaveIntervention={handleSaveIntervention}
      />

      {/* Modal Ghi nhận hoạt động mới -> Gỡ cờ AC1 */}
      <LogActivityModal 
        isOpen={Boolean(selectedLogActivityDeal)}
        onClose={() => setSelectedLogActivityDeal(null)}
        opportunity={selectedLogActivityDeal}
        onSaveActivity={handleSaveActivity}
      />

      {/* Modal Gia hạn ngày chốt -> Gỡ cờ AC2 */}
      <ExtendCloseDateModal 
        isOpen={Boolean(selectedExtendCloseDeal)}
        onClose={() => setSelectedExtendCloseDeal(null)}
        opportunity={selectedExtendCloseDeal}
        onSaveNewCloseDate={handleSaveNewCloseDate}
      />

      {/* Modal Xem chi tiết hồ sơ & Dòng thời gian */}
      <OpportunityDetailModal 
        isOpen={Boolean(selectedDetailDeal)}
        onClose={() => setSelectedDetailDeal(null)}
        opportunity={selectedDetailDeal}
        stageThresholds={stageThresholds}
        onOpenIntervention={(opp) => setSelectedInterventionDeal(opp)}
        onOpenLogActivity={(opp) => setSelectedLogActivityDeal(opp)}
        onOpenExtendClose={(opp) => setSelectedExtendCloseDeal(opp)}
      />

      {/* Modal Jira Ticket SCRUM-93 */}
      <JiraTicketModal 
        isOpen={isJiraModalOpen}
        onClose={() => setIsJiraModalOpen(false)}
      />

      {/* Modal Thêm cơ hội mới */}
      <AddOpportunityModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOpportunity={handleAddOpportunity}
        stageThresholds={stageThresholds}
      />

      {/* Modal Xuất báo cáo CSV */}
      <ExportReportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        opportunities={evaluatedOpportunities}
        metrics={metrics}
        onShowToast={showToast}
      />

      {/* Thông báo Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
