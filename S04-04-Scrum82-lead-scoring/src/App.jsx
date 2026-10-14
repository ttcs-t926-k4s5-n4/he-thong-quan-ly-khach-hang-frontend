import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ScoringConfigPanel from './components/ScoringConfigPanel';
import KpiSummaryCards from './components/KpiSummaryCards';
import LeadPriorityQueue from './components/LeadPriorityQueue';
import QuickEditLeadModal from './components/QuickEditLeadModal';
import ScoreBreakdownModal from './components/ScoreBreakdownModal';
import JiraGuideModal from './components/JiraGuideModal';
import Toast from './components/Toast';

import { defaultScoringConfig } from './data/defaultScoringConfig';
import { initialMockLeads } from './data/mockLeads';
import { scoreAndRankAllLeads } from './utils/scoreCalculator';
import { CheckCircle2, Flame, Sliders, ShieldCheck } from 'lucide-react';

export default function App() {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lead_scoring_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lead_scoring_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Data States
  const [scoringConfig, setScoringConfig] = useState(defaultScoringConfig);
  const [leads, setLeads] = useState(initialMockLeads);

  // 3. UI States
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'HOT' | 'WARM' | 'COLD'
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Modal States
  const [quickEditLead, setQuickEditLead] = useState(null);
  const [breakdownLead, setBreakdownLead] = useState(null);
  const [isJiraGuideOpen, setIsJiraGuideOpen] = useState(false);

  // 5. Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 6. Tính toán điểm số và thứ tự ưu tiên (Tự động tính lại khi Leads hoặc Config thay đổi)
  const scoredLeads = useMemo(() => {
    return scoreAndRankAllLeads(leads, scoringConfig);
  }, [leads, scoringConfig]);

  // Đếm theo phân loại
  const hotCount = useMemo(() => scoredLeads.filter(l => l.scoreResult.classification === 'HOT').length, [scoredLeads]);
  const warmCount = useMemo(() => scoredLeads.filter(l => l.scoreResult.classification === 'WARM').length, [scoredLeads]);
  const coldCount = useMemo(() => scoredLeads.filter(l => l.scoreResult.classification === 'COLD').length, [scoredLeads]);

  // 7. Thay đổi ngưỡng điểm (Tiêu chí 3)
  const handleChangeThreshold = (key, value) => {
    setScoringConfig(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: value
      }
    }));
    addToast(
      'Cập Nhật Ngưỡng Điểm Thành Công',
      `Đã thay đổi ${key === 'hotMin' ? 'ngưỡng Nóng' : 'ngưỡng Ấm'} thành ${value} điểm. Danh sách Lead đã được tự động tái phân loại!`,
      'info'
    );
  };

  // 8. Thay đổi số điểm của từng tiêu chí (Tiêu chí 1)
  const handleChangeOptionPoints = (groupKey, optionKey, points) => {
    setScoringConfig(prev => {
      const group = prev.criteriaGroups[groupKey];
      const newOptions = group.options.map(opt => {
        if (opt.key === optionKey) {
          return { ...opt, points };
        }
        return opt;
      });

      return {
        ...prev,
        criteriaGroups: {
          ...prev.criteriaGroups,
          [groupKey]: {
            ...group,
            options: newOptions
          }
        }
      };
    });
  };

  // 9. Khôi phục mặc định
  const handleResetDefaults = () => {
    setScoringConfig(defaultScoringConfig);
    addToast('Khôi Phục Thành Công', 'Đã đặt lại bộ tiêu chí và ngưỡng điểm về mặc định.');
  };

  // 10. Lưu Lead sau khi sửa (Tiêu chí 2)
  const handleSaveLead = (updatedLead) => {
    setLeads(prev => prev.map(l => (l.id === updatedLead.id ? updatedLead : l)));
    setQuickEditLead(null);
    addToast(
      'Cập Nhật Lead Thành Công',
      `Lead #${updatedLead.code} (${updatedLead.fullName}) đã được tính lại điểm tự động và cập nhật thứ tự ưu tiên cuộc gọi!`
    );
  };

  // 11. Mô phỏng gọi điện
  const handleSimulateCall = (lead) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          callStatus: 'CALLED',
          lastCallTime: timeStr
        };
      }
      return l;
    }));

    addToast(
      'Ghi Nhận Cuộc Gọi Ưu Tiên',
      `Telesales ${lead.assignedTo?.name} đã kết nối cuộc gọi cho Lead #${lead.code} (${lead.fullName}) lúc ${timeStr}.`
    );
  };

  // 12. Kịch bản chạy nhanh kiểm thử (Từ Jira Guide Modal)
  const handleRunTest1 = () => {
    setIsConfigOpen(true);
    addToast('Kịch bản 1: Khai Báo Tiêu Chí & Điểm', 'Xem bảng cấu hình bên dưới: Bạn có thể chỉnh sửa điểm số của bất kỳ tiêu chí nào!', 'info');
  };

  const handleRunTest2 = () => {
    const coldLead = scoredLeads.find(l => l.scoreResult.classification === 'COLD') || scoredLeads[scoredLeads.length - 1];
    setQuickEditLead(coldLead);
    addToast('Kịch bản 2: Điểm Tính Lại Tự Động', `Đã mở Lead #${coldLead.code}. Hãy thử đổi Mức độ quan tâm sang 'Rất cao' để thấy điểm nhảy vọt!`, 'info');
  };

  const handleRunTest3 = () => {
    setIsConfigOpen(true);
    handleChangeThreshold('hotMin', 80);
  };

  const handleRunTest4 = () => {
    setActiveFilter('COLD');
    addToast('Kịch bản 4: Không Tự Động Loại Lead', 'Quan sát các Lead Lạnh: Vẫn hiển thị đầy đủ, không hề bị xóa khỏi CRM!', 'info');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header 
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJiraGuide={() => setIsJiraGuideOpen(true)}
        isConfigOpen={isConfigOpen}
        onToggleConfig={() => setIsConfigOpen(prev => !prev)}
      />

      {/* Main Container */}
      <main className="app-main">
        {/* Jira Ticket Header */}
        <div className="jira-story-card">
          <div className="jira-story-content">
            <div className="jira-tag-group">
              <span className="jira-badge">JIRA TICKET SCRUM</span>
              <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                IN PROGRESS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                &bull; Vai trò: <strong>Giám đốc kinh doanh (Sales Director)</strong>
              </span>
            </div>

            <div className="jira-story-title">
              "Là Giám đốc kinh doanh, tôi muốn cấu hình chấm điểm lead theo tiêu chí khai báo được, để nhân viên gọi những lead có khả năng nhất trước."
            </div>

            <div className="jira-story-bullets">
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Khai báo tiêu chí & điểm: ngành nghề, quy mô, nguồn, mức độ quan tâm</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Điểm được tính lại tự động khi thông tin lead thay đổi</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Phân loại Nóng, Ấm, Lạnh theo ngưỡng điểm khai báo được</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Điểm chỉ để sắp xếp ưu tiên, không tự động loại lead</span>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsJiraGuideOpen(true)}
            style={{ whiteSpace: 'nowrap' }}
          >
            <span>Đối Chiếu Nghiệm Thu</span>
          </button>
        </div>

        {/* 1. SCORING CONFIGURATION PANEL (Tiêu chí 1 & Tiêu chí 3) */}
        {isConfigOpen && (
          <ScoringConfigPanel 
            config={scoringConfig}
            onChangeThreshold={handleChangeThreshold}
            onChangeOptionPoints={handleChangeOptionPoints}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {/* 2. KPI Summary Cards */}
        <KpiSummaryCards 
          totalLeads={leads.length}
          hotCount={hotCount}
          warmCount={warmCount}
          coldCount={coldCount}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          hotThreshold={scoringConfig.thresholds.hotMin}
          warmThreshold={scoringConfig.thresholds.warmMin}
        />

        {/* 3. Telesales Lead Priority Queue (Tiêu chí 4) */}
        <LeadPriorityQueue 
          scoredLeads={scoredLeads}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickEdit={(lead) => setQuickEditLead(lead)}
          onOpenBreakdown={(lead) => setBreakdownLead(lead)}
          onSimulateCall={handleSimulateCall}
        />
      </main>

      {/* MODALS */}
      {/* Quick Edit Lead Modal (Tiêu chí 2) */}
      {quickEditLead && (
        <QuickEditLeadModal 
          lead={quickEditLead}
          config={scoringConfig}
          onClose={() => setQuickEditLead(null)}
          onSaveLead={handleSaveLead}
        />
      )}

      {/* Score Breakdown Modal */}
      {breakdownLead && (
        <ScoreBreakdownModal 
          lead={breakdownLead}
          onClose={() => setBreakdownLead(null)}
        />
      )}

      {/* Jira Guide Modal */}
      {isJiraGuideOpen && (
        <JiraGuideModal 
          onClose={() => setIsJiraGuideOpen(false)}
          onRunTest1={handleRunTest1}
          onRunTest2={handleRunTest2}
          onRunTest3={handleRunTest3}
          onRunTest4={handleRunTest4}
        />
      )}

      {/* Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
