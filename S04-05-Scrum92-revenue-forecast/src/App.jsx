import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ExecutiveAnswerBox } from './components/ExecutiveAnswerBox';
import { PeriodBar } from './components/PeriodBar';
import { KpiScorecards } from './components/KpiScorecards';
import { ProgressGauge } from './components/ProgressGauge';
import { ScenariosComparison } from './components/ScenariosComparison';
import { TeamBreakdown } from './components/TeamBreakdown';
import { OpportunityTable } from './components/OpportunityTable';
import { JiraTicketModal } from './components/JiraTicketModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { OpportunityModal } from './components/OpportunityModal';
import { ExportReportModal } from './components/ExportReportModal';
import { Toast } from './components/Toast';

import { INITIAL_OPPORTUNITIES } from './data/mockOpportunities';
import { OPPORTUNITY_STAGES } from './data/mockStages';
import { MOCK_USERS, SALES_TEAMS } from './data/mockUsers';
import { 
  calculateForecastStats, 
  calculateTeamBreakdown, 
  calculateRepBreakdown 
} from './utils/forecastCalculations';

export const App = () => {
  // Theme state
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // State
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); // Mặc định: Giám đốc kinh doanh Lê Hoàng Nam
  const [stageConfig, setStageConfig] = useState(OPPORTUNITY_STAGES);

  // Filters
  const [periodFilter, setPeriodFilter] = useState('THIS_MONTH'); // 'THIS_MONTH' | 'NEXT_MONTH' | 'THIS_QUARTER' | 'ALL'
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [repFilter, setRepFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  // Modals
  const [isJiraOpen, setIsJiraOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAddOppOpen, setIsAddOppOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persona synchronization: If persona is a Sales Rep or Team Lead, adapt filters
  useEffect(() => {
    if (currentUser.role === 'SALES_REP') {
      setRepFilter(currentUser.id);
      setTeamFilter(currentUser.teamId || 'ALL');
    } else if (currentUser.role === 'TEAM_LEAD') {
      setRepFilter('ALL');
      setTeamFilter(currentUser.teamId || 'ALL');
    } else {
      // SALES_DIRECTOR -> Full view
      setRepFilter('ALL');
      setTeamFilter('ALL');
    }
  }, [currentUser]);

  // Calculations
  const stats = useMemo(() => {
    return calculateForecastStats({
      opportunities,
      periodFilter,
      teamFilter,
      repFilter,
      stageConfig
    });
  }, [opportunities, periodFilter, teamFilter, repFilter, stageConfig]);

  const baseStats = useMemo(() => {
    return calculateForecastStats({
      opportunities,
      periodFilter,
      teamFilter,
      repFilter,
      stageConfig: OPPORTUNITY_STAGES
    });
  }, [opportunities, periodFilter, teamFilter, repFilter]);

  const teamStats = useMemo(() => {
    return calculateTeamBreakdown(opportunities, periodFilter, stageConfig);
  }, [opportunities, periodFilter, stageConfig]);

  const repStats = useMemo(() => {
    return calculateRepBreakdown(opportunities, periodFilter, teamFilter, stageConfig);
  }, [opportunities, periodFilter, teamFilter, stageConfig]);

  // Human-readable Period Label
  const periodLabel = useMemo(() => {
    if (periodFilter === 'THIS_MONTH') return 'tháng này (10/2026)';
    if (periodFilter === 'NEXT_MONTH') return 'tháng sau (11/2026)';
    if (periodFilter === 'THIS_QUARTER') return 'quý này (Q4/2026)';
    return 'toàn bộ các kỳ';
  }, [periodFilter]);

  // Opportunity handlers
  const handleSaveOpportunity = (deal) => {
    setOpportunities((prev) => {
      const exists = prev.some((o) => o.id === deal.id);
      if (exists) {
        addToast('success', 'Đã Cập Nhật Deal', `Đã lưu thay đổi cho cơ hội ${deal.id} - ${deal.title}`);
        return prev.map((o) => (o.id === deal.id ? deal : o));
      } else {
        addToast('success', 'Thêm Cơ Hội Thành Công', `Cơ hội ${deal.id} đã được thêm vào Pipeline ${periodLabel}`);
        return [deal, ...prev];
      }
    });
    setEditingOpp(null);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenJira={() => setIsJiraOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenAddOpp={() => setIsAddOppOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <main className="main-content">
        {/* Executive AI Answer Box */}
        <ExecutiveAnswerBox
          stats={stats}
          periodFilter={periodFilter}
          periodLabel={periodLabel}
        />

        {/* Period Horizon & Scope Selectors (Tiêu chí 2 & 4) */}
        <PeriodBar
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
          repFilter={repFilter}
          setRepFilter={setRepFilter}
        />

        {/* Triple Metric Comparison Scorecards (Tiêu chí 3) */}
        <KpiScorecards stats={stats} />

        {/* Progress Gauge (Dual Bar vs Target) */}
        <ProgressGauge stats={stats} />

        {/* 3 Scenarios Comparison (Worst / Most Likely / Best Case) */}
        <ScenariosComparison stats={stats} />

        {/* Team & Sales Rep Breakdown (Tiêu chí 4) */}
        <TeamBreakdown
          teamStats={teamStats}
          repStats={repStats}
          selectedTeam={teamFilter}
          selectedRep={repFilter}
          onSelectTeam={(teamId) => {
            setTeamFilter(teamId);
            setRepFilter('ALL');
          }}
          onSelectRep={(repId) => setRepFilter(repId)}
        />

        {/* Opportunities List Contributing to Weighted Forecast (Tiêu chí 1) */}
        <OpportunityTable
          opportunities={stats.filteredOpportunities}
          onEditOpportunity={(opp) => {
            setEditingOpp(opp);
            setIsAddOppOpen(true);
          }}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
        />
      </main>

      {/* Modals */}
      <JiraTicketModal
        isOpen={isJiraOpen}
        onClose={() => setIsJiraOpen(false)}
      />

      <WhatIfSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        stageConfig={stageConfig}
        setStageConfig={setStageConfig}
        stats={stats}
        baseForecastValue={baseStats.weightedForecast}
      />

      <OpportunityModal
        isOpen={isAddOppOpen}
        onClose={() => {
          setIsAddOppOpen(false);
          setEditingOpp(null);
        }}
        onSave={handleSaveOpportunity}
        initialOpportunity={editingOpp}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        stats={stats}
        opportunities={stats.filteredOpportunities}
        periodLabel={periodLabel}
        teamStats={teamStats}
        repStats={repStats}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
