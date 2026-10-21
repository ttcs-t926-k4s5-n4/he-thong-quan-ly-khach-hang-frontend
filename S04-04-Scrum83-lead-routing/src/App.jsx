import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import KpiSummaryCards from './components/KpiSummaryCards';
import RoutingRulesManager from './components/RoutingRulesManager';
import LeadDistributionTable from './components/LeadDistributionTable';
import ManualAssignModal from './components/ManualAssignModal';
import NewRuleModal from './components/NewRuleModal';
import JiraGuideModal from './components/JiraGuideModal';
import Toast from './components/Toast';

import { defaultRoutingRules } from './data/defaultRoutingRules';
import { initialMockLeads } from './data/mockIncomingLeads';
import { mockTeamsAndUsers, allSalesReps } from './data/mockTeamsAndUsers';
import { routeAllLeads } from './utils/routingEngine';
import { CheckCircle2, ShieldCheck, Zap, SlidersHorizontal, Clock } from 'lucide-react';

export default function App() {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lead_routing_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lead_routing_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Data States
  const [rules, setRules] = useState(defaultRoutingRules);
  const [leads, setLeads] = useState(initialMockLeads);

  // 3. UI States
  const [isRulesOpen, setIsRulesOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'ASSIGNED' | 'WAITING' | 'MANUALLY_ASSIGNED'
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Modal States
  const [manualAssignLead, setManualAssignLead] = useState(null);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [isJiraGuideOpen, setIsJiraGuideOpen] = useState(false);

  // 5. Toast Notifications
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

  // 6. Xử lý phân bổ tự động thời gian thực (Lead Routing Engine)
  const { routedLeads } = useMemo(() => {
    return routeAllLeads(leads, rules, mockTeamsAndUsers, allSalesReps);
  }, [leads, rules]);

  // Thống kê
  const autoAssignedCount = useMemo(() => routedLeads.filter(l => l.status === 'ASSIGNED').length, [routedLeads]);
  const waitingManualCount = useMemo(() => routedLeads.filter(l => l.status === 'WAITING_MANUAL_ASSIGN').length, [routedLeads]);
  const manuallyAssignedCount = useMemo(() => routedLeads.filter(l => l.status === 'MANUALLY_ASSIGNED').length, [routedLeads]);

  // 7. Hoán đổi thứ tự ưu tiên Quy tắc (Tiêu chí 2: Priority Order)
  const handleMoveRuleUp = (index) => {
    if (index === 0) return;
    setRules(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      // Cập nhật lại số priority 1..N
      return copy.map((r, i) => ({ ...r, priority: i + 1 }));
    });
    addToast('Cập Nhật Mức Ưu Tiên', `Quy tắc đã được đưa lên ưu tiên cao hơn. Toàn bộ Leads đã được tái phân bổ theo nguyên tắc First-Match-Wins!`, 'info');
  };

  const handleMoveRuleDown = (index) => {
    if (index === rules.length - 1) return;
    setRules(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy.map((r, i) => ({ ...r, priority: i + 1 }));
    });
    addToast('Cập Nhật Mức Ưu Tiên', `Quy tắc đã được hạ xuống ưu tiên thấp hơn. Hệ thống tái đánh giá lại theo First-Match-Wins!`, 'info');
  };

  // Bật / tắt quy tắc
  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(r => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));
    addToast('Cập Nhật Trạng Thái Quy Tắc', 'Đã chuyển đổi trạng thái kích hoạt quy tắc.');
  };

  // Tạo quy tắc mới
  const handleCreateRule = (newRule) => {
    setRules(prev => {
      const nextPriority = prev.length + 1;
      return [...prev, { ...newRule, priority: nextPriority }];
    });
    setIsNewRuleModalOpen(false);
    addToast('Tạo Quy Tắc Thành Công', `Quy tắc "${newRule.name}" đã được đưa vào danh sách ưu tiên.`);
  };

  // Khôi phục mặc định
  const handleResetDefaultRules = () => {
    setRules(defaultRoutingRules);
    addToast('Khôi Phục Mặc Định', 'Đã đặt lại 4 quy tắc phân bổ chuẩn ban đầu.');
  };

  // 8. Trưởng nhóm phân bổ thủ công cho Lead trong hàng chờ (Tiêu chí 3)
  const handleConfirmManualAssign = ({ leadId, assignedStaff, assignNote }) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: 'MANUALLY_ASSIGNED',
          routingResult: {
            isAssigned: true,
            status: 'MANUALLY_ASSIGNED',
            assignedStaff,
            assignedTeamName: assignedStaff.teamName,
            assignedAt: new Date().toLocaleTimeString('vi-VN'),
            assignNote,
            slaLabel: 'Phân bổ thủ công bởi Trưởng nhóm'
          }
        };
      }
      return lead;
    }));

    setManualAssignLead(null);
    addToast(
      'Phân Bổ Thủ Công Thành Công',
      `Lead đã được Trưởng nhóm giao trực tiếp cho ${assignedStaff.name} (${assignedStaff.teamName}). Đã đưa ra khỏi Hàng chờ!`
    );
  };

  // 9. Mô phỏng nạp Lead mới từ Marketing & Chạy nền (Tiêu chí 4)
  const handleSimulateNewLead = () => {
    const sampleNames = ['Nguyễn Quốc Tuấn', 'Trần Bảo Ngọc', 'Lê Hoàng Long', 'Đặng Thúy Nga'];
    const sampleCompanies = ['Tập đoàn Dược Phẩm An Khang', 'Công ty CP Đầu Tư Xây Dựng Thăng Long', 'Hệ Thống Bán Lẻ TechOne', 'Công ty Logistics Á Châu'];
    const sampleIndustries = ['IT_TELECOM', 'MANUFACTURING', 'RETAIL_ECOMMERCE', 'SERVICES_OTHER'];
    const sampleRegions = ['NORTH', 'SOUTH', 'CENTRAL'];

    const randIdx = Math.floor(Math.random() * sampleNames.length);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLead = {
      id: `LD-${Date.now().toString().slice(-4)}`,
      code: `LEAD-${Math.floor(400 + Math.random() * 500)}`,
      fullName: sampleNames[randIdx],
      companyName: sampleCompanies[randIdx],
      phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
      email: `contact_${Date.now().toString().slice(-4)}@customer.vn`,
      region: sampleRegions[Math.floor(Math.random() * sampleRegions.length)],
      industry: sampleIndustries[Math.floor(Math.random() * sampleIndustries.length)],
      source: 'Landing Page Form Q4',
      intakeTime: `2026-10-09 ${timeStr}`,
      status: 'UNPROCESSED'
    };

    setLeads(prev => [newLead, ...prev]);
    addToast(
      'Đã Thu Nhận Lead Mới & Phân Bổ Chạy Nền',
      `Lead #${newLead.code} vừa đổ về từ chiến dịch tiếp thị. Worker chạy nền đã tự động chuyển giao đến tay nhân viên chỉ trong 45 giây!`,
      'success'
    );
  };

  // 10. Kịch bản chạy nhanh kiểm thử (Từ Jira Guide Modal)
  const handleRunTest1 = () => {
    setIsRulesOpen(true);
    addToast('Tiêu chí 1: Các Chế Độ Phân Bổ', 'Quan sát 4 quy tắc: Đã cấu hình theo Khu vực (Region), theo Ngành nghề (Industry) và Xoay vòng đều (Round-Robin)!', 'info');
  };

  const handleRunTest2 = () => {
    setIsRulesOpen(true);
    handleMoveRuleDown(0); // Đổi chỗ Rule 1 và Rule 2
  };

  const handleRunTest3 = () => {
    setActiveFilter('WAITING');
    addToast('Tiêu chí 3: Hàng Chờ Phân Bổ Tay', 'Quan sát 2 Lead không khớp quy tắc (ngành Năng lượng, Vận tải quốc tế). Bấm nút "Phân Bổ Tay" để Trưởng nhóm chia việc!', 'info');
  };

  const handleRunTest4 = () => {
    handleSimulateNewLead();
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header 
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJiraGuide={() => setIsJiraGuideOpen(true)}
        isRulesOpen={isRulesOpen}
        onToggleRules={() => setIsRulesOpen(prev => !prev)}
        onSimulateNewLead={handleSimulateNewLead}
      />

      {/* Main Container */}
      <main className="app-main">
        {/* Jira Ticket Header Card */}
        <div className="jira-story-card">
          <div className="jira-story-content">
            <div className="jira-tag-group">
              <span className="jira-badge">JIRA TICKET SCRUM</span>
              <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                IN PROGRESS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                &bull; Vai trò: <strong>Giám đốc kinh doanh (Sales Director)</strong>
              </span>
            </div>

            <div className="jira-story-title">
              "Là Giám đốc kinh doanh, tôi muốn cấu hình quy tắc phân bổ lead tự động, để lead tới tay người phụ trách trong vài phút thay vì chờ họp giao ban."
            </div>

            <div className="jira-story-bullets">
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Phân bổ theo khu vực, theo ngành nghề, hoặc xoay vòng đều trong nhóm</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Nhiều quy tắc xếp theo thứ tự ưu tiên, quy tắc đầu tiên khớp sẽ thắng</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Lead không khớp quy tắc nào rơi vào hàng chờ để trưởng nhóm phân tay</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Phân bổ chạy nền, hoàn tất trong vòng 5 phút kể từ khi lead vào</span>
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

        {/* Background Engine Status Banner */}
        <div className="bg-engine-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.3)', display: 'inline-block' }} />
            <div style={{ fontSize: '0.84rem', color: '#065f46' }}>
              <strong>Hệ thống Phân Bổ Chạy Nền (Background Worker Engine):</strong> Đang chạy liên tục &bull; Tự động xử lý ngay khi có Lead mới &bull; SLA cam kết: <strong>&lt; 5 phút</strong> (Thời gian xử lý thực tế: ~45 giây).
            </div>
          </div>
          <button 
            className="btn btn-sm"
            style={{ background: '#059669', color: 'white' }}
            onClick={handleSimulateNewLead}
          >
            <Zap size={14} />
            <span>Nạp Thêm 1 Lead Mẫu</span>
          </button>
        </div>

        {/* 1. KPI Summary Cards */}
        <KpiSummaryCards 
          totalLeads={leads.length}
          autoAssignedCount={autoAssignedCount}
          waitingManualCount={waitingManualCount}
          manuallyAssignedCount={manuallyAssignedCount}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* 2. RULES MANAGER (Tiêu chí 1 & Tiêu chí 2) */}
        {isRulesOpen && (
          <RoutingRulesManager 
            rules={rules}
            onMoveRuleUp={handleMoveRuleUp}
            onMoveRuleDown={handleMoveRuleDown}
            onToggleRule={handleToggleRule}
            onOpenNewRuleModal={() => setIsNewRuleModalOpen(true)}
            onResetDefaultRules={handleResetDefaultRules}
          />
        )}

        {/* 3. LEADS DISTRIBUTION TABLE (Tiêu chí 3 & Tiêu chí 4) */}
        <LeadDistributionTable 
          leads={routedLeads}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenManualAssignModal={(lead) => setManualAssignLead(lead)}
        />
      </main>

      {/* MODALS */}
      {/* Manual Assign Modal (Tiêu chí 3) */}
      {manualAssignLead && (
        <ManualAssignModal 
          lead={manualAssignLead}
          allReps={allSalesReps}
          onClose={() => setManualAssignLead(null)}
          onConfirmManualAssign={handleConfirmManualAssign}
        />
      )}

      {/* New Rule Modal */}
      {isNewRuleModalOpen && (
        <NewRuleModal 
          teams={mockTeamsAndUsers}
          onClose={() => setIsNewRuleModalOpen(false)}
          onCreateRule={handleCreateRule}
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

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
