import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DuplicateAlertBanner from './components/DuplicateAlertBanner';
import KpiSummaryCards from './components/KpiSummaryCards';
import LeadListView from './components/LeadListView';
import SideBySideMergeModal from './components/SideBySideMergeModal';
import AttachToCustomerModal from './components/AttachToCustomerModal';
import NewLeadModal from './components/NewLeadModal';
import LeadDetailModal from './components/LeadDetailModal';
import MergeHistoryDrawer from './components/MergeHistoryDrawer';
import JiraGuideModal from './components/JiraGuideModal';
import Toast from './components/Toast';

import { initialMockLeads } from './data/mockLeads';
import { mockExistingCustomers } from './data/mockExistingCustomers';
import { analyzeAllDuplicates } from './utils/duplicateDetector';
import { CheckCircle2, ShieldCheck, Sparkles, Building2, PhoneCall } from 'lucide-react';

export default function App() {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('crm_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('crm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Data States
  const [leads, setLeads] = useState(initialMockLeads);
  const [customers, setCustomers] = useState(mockExistingCustomers);
  const [mergeHistory, setMergeHistory] = useState([
    {
      id: 'HIST-INIT',
      type: 'MERGE_LEADS',
      masterCode: 'LEAD-090',
      secondaryCode: 'LEAD-091',
      description: 'Gộp thành công bản ghi trùng số điện thoại 0903123456 từ chiến dịch Webinar Q3.',
      performedBy: 'Lê Thảo Vy (Marketing Specialist)',
      timestamp: '2026-10-08 16:30:00',
      preservedActivitiesCount: 4
    }
  ]);
  const [protectedCallsCount, setProtectedCallsCount] = useState(2);

  // 3. Filter & Search State
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'DUPLICATES' | 'CUSTOMER_MATCHES' | 'MERGED'
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Modal States
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [mergeModalPair, setMergeModalPair] = useState(null); // { leadA, leadB }
  const [attachCustomerPair, setAttachCustomerPair] = useState(null); // { lead, customer }
  const [detailModalLead, setDetailModalLead] = useState(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
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

  // 6. Phân tích đối soát trùng lặp toàn hệ thống (Real-time Deduplication Engine)
  const duplicateMap = useMemo(() => {
    return analyzeAllDuplicates(leads, customers);
  }, [leads, customers]);

  // Đếm các loại trùng
  const duplicateLeadsCount = useMemo(() => {
    let count = 0;
    leads.forEach(lead => {
      if (lead.isMerged) return;
      const info = duplicateMap.get(lead.id);
      if (info?.duplicateLeads?.length > 0) count++;
    });
    return count;
  }, [leads, duplicateMap]);

  const customerMatchesCount = useMemo(() => {
    let count = 0;
    leads.forEach(lead => {
      if (lead.isAttachedToCustomer) return;
      const info = duplicateMap.get(lead.id);
      if (info?.matchedCustomers?.length > 0) count++;
    });
    return count;
  }, [leads, duplicateMap]);

  // Tìm cặp xung đột cuộc gọi trong sáng nay
  const morningConflictPair = useMemo(() => {
    for (const lead of leads) {
      if (lead.isMerged) continue;
      const info = duplicateMap.get(lead.id);
      const conflict = info?.duplicateLeads?.find(d => d.morningCallConflict);
      if (conflict) {
        const callerActivity = lead.timeline?.find(t => t.type === 'CALL' && t.isThisMorning)
          || conflict.targetLead.timeline?.find(t => t.type === 'CALL' && t.isThisMorning);

        return {
          leadA: lead,
          leadB: conflict.targetLead,
          callerName: callerActivity ? callerActivity.actor : 'Nguyễn Hoàng Tuấn',
          callTime: callerActivity ? callerActivity.timeLabel : 'Sáng nay 08:30',
          secondStaff: lead.assignedTo?.name || 'Trần Thị Mai Linh'
        };
      }
    }
    return null;
  }, [leads, duplicateMap]);

  // 7. Xử lý Gộp Hai Lead (Tiêu chí 3: Gộp giữ nguyên lịch sử cả 2 bản ghi)
  const handleConfirmMerge = ({ masterLead, secondaryLead, chosenFields, mergedTimeline }) => {
    setLeads(prevLeads => {
      return prevLeads.map(lead => {
        if (lead.id === masterLead.id) {
          // Cập nhật bản ghi chính với các trường đã chọn và DÒNG THỜI GIAN ĐÃ HỢP NHẤT TRỌN VẸN
          return {
            ...lead,
            ...chosenFields,
            timeline: mergedTimeline,
            status: 'QUALIFIED'
          };
        }
        if (lead.id === secondaryLead.id) {
          // Đánh dấu bản ghi phụ là đã gộp
          return {
            ...lead,
            isMerged: true,
            mergedIntoId: masterLead.code || masterLead.id,
            status: 'MERGED'
          };
        }
        return lead;
      });
    });

    // Ghi nhật ký kiểm toán (Audit Trail)
    const newHistoryItem = {
      id: `HIST-${Date.now()}`,
      type: 'MERGE_LEADS',
      masterCode: masterLead.code || masterLead.id,
      secondaryCode: secondaryLead.code || secondaryLead.id,
      description: `Gộp Lead "${secondaryLead.fullName}" vào Lead chính "${masterLead.fullName}". Bảo lưu toàn bộ ${mergedTimeline.length} hoạt động lịch sử.`,
      performedBy: 'Lê Thảo Vy (Marketing Specialist)',
      timestamp: new Date().toLocaleString('vi-VN'),
      preservedActivitiesCount: mergedTimeline.length
    };
    setMergeHistory(prev => [newHistoryItem, ...prev]);

    // Tăng số lượng cuộc gọi được bảo vệ chống trùng lặp
    setProtectedCallsCount(prev => prev + 1);

    // Đóng modal & Bắn Toast
    setMergeModalPair(null);
    addToast(
      'Gộp Lead Thành Công (Bảo Toàn 100% Lịch Sử)',
      `Đã hợp nhất Lead #${secondaryLead.code} vào #${masterLead.code}. Đã ngăn chặn nguy cơ hai nhân viên cùng gọi một người trong sáng nay!`
    );
  };

  // 8. Xử lý Gắn Lead vào Khách Hàng Đã Có (Tiêu chí 2)
  const handleConfirmAttachCustomer = ({ lead, customer, attachType, notifySales, transferNotes }) => {
    // Cập nhật trạng thái Lead
    setLeads(prevLeads => {
      return prevLeads.map(l => {
        if (l.id === lead.id) {
          return {
            ...l,
            isAttachedToCustomer: true,
            attachedCustomerId: customer.id,
            status: 'ATTACHED_TO_CUSTOMER',
            timeline: [
              {
                id: `TL-ATTACH-${Date.now()}`,
                type: 'SYSTEM',
                title: `Gắn vào Khách hàng Doanh nghiệp ${customer.name}`,
                actor: 'Nhân viên Marketing (Lê Thảo Vy)',
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                timeLabel: 'Vừa xong',
                content: transferNotes,
                sourceBadge: 'Chuyển Đổi CRM'
              },
              ...(l.timeline || [])
            ]
          };
        }
        return l;
      });
    });

    // Thêm Người liên hệ vào Khách hàng nếu chọn
    if (attachType.includes('CONTACT')) {
      setCustomers(prevCusts => {
        return prevCusts.map(c => {
          if (c.id === customer.id) {
            return {
              ...c,
              contacts: [
                ...(c.contacts || []),
                {
                  id: `CTC-NEW-${Date.now()}`,
                  name: lead.fullName,
                  role: lead.jobTitle || 'Đầu mối mới từ Marketing',
                  email: lead.email,
                  phone: lead.phone
                }
              ]
            };
          }
          return c;
        });
      });
    }

    // Ghi nhật ký kiểm toán
    const newHistoryItem = {
      id: `HIST-${Date.now()}`,
      type: 'ATTACH_CUSTOMER',
      leadCode: lead.code,
      customerCode: customer.id,
      description: `Gắn Lead "${lead.fullName}" (${lead.code}) vào Khách hàng "${customer.name}". Chuyển giao cho Sales ${customer.assignedSales?.name}.`,
      performedBy: 'Lê Thảo Vy (Marketing Specialist)',
      timestamp: new Date().toLocaleString('vi-VN'),
      preservedActivitiesCount: (lead.timeline?.length || 0) + 1
    };
    setMergeHistory(prev => [newHistoryItem, ...prev]);

    setAttachCustomerPair(null);
    addToast(
      'Gắn Vào Khách Hàng Thành Công',
      `Lead #${lead.code} đã được liên kết trực tiếp vào Khách hàng VIP ${customer.id} (${customer.name}). Đã gửi thông báo cho Sales ${customer.assignedSales?.name}.`
    );
  };

  // 9. Xử lý Thêm Lead Mới
  const handleCreateNewLead = (newLeadData) => {
    const newLead = {
      ...newLeadData,
      id: `LD-${Date.now().toString().slice(-4)}`
    };

    setLeads(prev => [newLead, ...prev]);
    setIsNewLeadModalOpen(false);
    addToast(
      'Tạo Lead Mới Thành Công',
      `Đã thêm Lead #${newLead.code} (${newLead.fullName}) vào danh sách quản lý tiếp thị.`
    );
  };

  // 10. Fast-track gộp từ form thêm lead mới
  const handleFastTrackMergeFromForm = (targetExistingLead, tempFormData) => {
    setIsNewLeadModalOpen(false);
    const simulatedTempLead = {
      id: `LD-TEMP-${Date.now()}`,
      code: `LEAD-NEW`,
      ...tempFormData,
      timeline: [
        {
          id: `TL-FORM-${Date.now()}`,
          type: 'SYSTEM',
          title: 'Điền form tiếp thị Marketing',
          actor: 'Khách hàng tự đăng ký',
          timestamp: '2026-10-09 09:30:00',
          timeLabel: 'Vừa xong',
          content: `Khách đăng ký qua form ${tempFormData.leadSource}. Nhu cầu ngân sách: ${tempFormData.budget}.`,
          sourceTag: 'Bản ghi vừa nhập'
        }
      ]
    };
    setMergeModalPair({
      leadA: targetExistingLead,
      leadB: simulatedTempLead
    });
  };

  // 11. Fast-track gắn vào khách hàng từ form thêm lead mới
  const handleFastTrackAttachFromForm = (targetCustomer, tempFormData) => {
    setIsNewLeadModalOpen(false);
    const simulatedTempLead = {
      id: `LD-TEMP-${Date.now()}`,
      code: `LEAD-NEW`,
      ...tempFormData,
      timeline: [
        {
          id: `TL-FORM-${Date.now()}`,
          type: 'SYSTEM',
          title: 'Đăng ký từ chiến dịch Marketing',
          actor: 'Khách hàng doanh nghiệp',
          timestamp: '2026-10-09 09:30:00',
          timeLabel: 'Vừa xong',
          content: `Đăng ký qua ${tempFormData.leadSource}`,
          sourceTag: 'Bản ghi mới'
        }
      ]
    };
    setAttachCustomerPair({
      lead: simulatedTempLead,
      customer: targetCustomer
    });
  };

  // 12. Mô phỏng Telesales gọi điện sáng nay
  const handleSimulateMorningCall = () => {
    const candidateLead = leads.find(l => !l.isMerged && !l.timeline?.some(t => t.type === 'CALL' && t.isThisMorning));
    if (!candidateLead) {
      addToast('Thông báo', 'Tất cả các Lead phù hợp đều đã có nhật ký cuộc gọi sáng nay!', 'info');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setLeads(prev => prev.map(l => {
      if (l.id === candidateLead.id) {
        return {
          ...l,
          timeline: [
            {
              id: `TL-CALL-${Date.now()}`,
              leadId: l.id,
              type: 'CALL',
              title: `Telesales gọi tư vấn sáng nay (${timeStr})`,
              actor: l.assignedTo?.name || 'Nguyễn Hoàng Tuấn',
              timestamp: `2026-10-09 ${timeStr}:00`,
              timeLabel: `Sáng nay ${timeStr}`,
              isThisMorning: true,
              callDuration: '3 phút 40 giây',
              callStatus: 'CONNECTED',
              content: 'Đã gọi trao đổi nhu cầu giải pháp CRM. Khách hàng đã tiếp nhận thông tin.',
              sourceTag: `Gốc từ Lead #${l.id}`
            },
            ...(l.timeline || [])
          ]
        };
      }
      return l;
    }));

    addToast(
      'Mô Phỏng Cuộc Gọi Thành Công',
      `Nhân viên ${candidateLead.assignedTo?.name} vừa thực hiện cuộc gọi lúc ${timeStr} cho Lead #${candidateLead.code}. Hệ thống lập tức kích hoạt bảo vệ chống gọi trùng!`
    );
  };

  // 13. Test Scenarios Triggers (Từ Hướng Dẫn Jira)
  const handleRunScenario1 = () => {
    setActiveFilter('DUPLICATES');
    setSearchQuery('');
    addToast(
      'Đã kích hoạt Kịch bản 1',
      'Quan sát Banner cảnh báo đỏ và Huy hiệu "NGUY CƠ 2 NV GỌI TRÙNG SÁNG NAY" giữa Lead LD-101 và LD-102!',
      'info'
    );
  };

  const handleRunScenario2 = () => {
    setActiveFilter('CUSTOMER_MATCHES');
    setSearchQuery('');
    addToast(
      'Đã kích hoạt Kịch bản 2',
      'Quan sát các Lead có huy hiệu tím "TRÙNG KHÁCH HÀNG: KH-001 (FPT)" và nút "Gắn Vào KH"!',
      'info'
    );
  };

  const handleRunScenario3 = () => {
    const lead101 = leads.find(l => l.id === 'LD-101');
    const lead102 = leads.find(l => l.id === 'LD-102');
    if (lead101 && lead102) {
      setMergeModalPair({ leadA: lead101, leadB: lead102 });
      addToast(
        'Đã mở Kịch bản 3: So Sánh & Bảo Toàn 100% Lịch Sử',
        'Kiểm tra màn hình Side-by-Side, tính năng Swap và phần "Xem Trước Dòng Thời Gian Lịch Sử Hợp Nhất".',
        'info'
      );
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header 
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJiraGuide={() => setIsJiraGuideOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        mergeHistoryCount={mergeHistory.length}
      />

      {/* Main Container */}
      <main className="app-main">
        {/* Jira Ticket Story Card */}
        <div className="jira-story-card">
          <div className="jira-story-content">
            <div className="jira-tag-group">
              <span className="jira-badge">JIRA TICKET SCRUM</span>
              <span className="jira-status-pill">IN PROGRESS</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                &bull; Vai trò: <strong>Nhân viên Marketing</strong>
              </span>
            </div>

            <div className="jira-story-title">
              "Là Nhân viên Marketing, tôi muốn được cảnh báo và gộp lead trùng, để không để hai nhân viên cùng gọi một người trong một buổi sáng."
            </div>

            <div className="jira-story-bullets">
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Phát hiện trùng theo email, số điện thoại và tên công ty</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Lead trùng với khách hàng đã có được gợi ý gắn thẳng vào khách hàng đó</span>
              </div>
              <div className="jira-story-bullet">
                <CheckCircle2 size={15} />
                <span>Gộp giữ nguyên lịch sử của cả hai bản ghi</span>
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

        {/* Conflict Alert Banner (User Story core highlight) */}
        <DuplicateAlertBanner 
          morningConflictCount={morningConflictPair ? 1 : 0}
          duplicateLeadCount={duplicateLeadsCount}
          customerMatchCount={customerMatchesCount}
          conflictPair={morningConflictPair}
          onResolveConflict={(leadA, leadB) => setMergeModalPair({ leadA, leadB })}
          onFilterDuplicates={() => setActiveFilter('DUPLICATES')}
          onFilterCustomerMatches={() => setActiveFilter('CUSTOMER_MATCHES')}
        />

        {/* KPI Cards */}
        <KpiSummaryCards 
          totalLeads={leads.length}
          duplicateLeadsCount={duplicateLeadsCount}
          customerMatchesCount={customerMatchesCount}
          protectedCallsCount={protectedCallsCount}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Lead Table View */}
        <LeadListView 
          leads={leads}
          duplicateMap={duplicateMap}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
          onOpenMergeModal={(leadA, leadB) => setMergeModalPair({ leadA, leadB })}
          onOpenAttachCustomerModal={(lead, customer) => setAttachCustomerPair({ lead, customer })}
          onOpenDetailModal={(lead) => setDetailModalLead(lead)}
          onSimulateMorningCall={handleSimulateMorningCall}
        />
      </main>

      {/* MODALS */}
      {/* 1. Side-by-side Merge Modal (Criterion 3) */}
      {mergeModalPair && (
        <SideBySideMergeModal 
          leadA={mergeModalPair.leadA}
          leadB={mergeModalPair.leadB}
          onClose={() => setMergeModalPair(null)}
          onConfirmMerge={handleConfirmMerge}
        />
      )}

      {/* 2. Attach to Existing Customer Modal (Criterion 2) */}
      {attachCustomerPair && (
        <AttachToCustomerModal 
          lead={attachCustomerPair.lead}
          customer={attachCustomerPair.customer}
          onClose={() => setAttachCustomerPair(null)}
          onConfirmAttach={handleConfirmAttachCustomer}
        />
      )}

      {/* 3. New Lead Modal with Live Scanner */}
      {isNewLeadModalOpen && (
        <NewLeadModal 
          existingLeads={leads}
          existingCustomers={customers}
          onClose={() => setIsNewLeadModalOpen(false)}
          onSubmitNewLead={handleCreateNewLead}
          onFastTrackMerge={handleFastTrackMergeFromForm}
          onFastTrackAttach={handleFastTrackAttachFromForm}
        />
      )}

      {/* 4. Lead Detail Modal with Unified Timeline */}
      {detailModalLead && (
        <LeadDetailModal 
          lead={detailModalLead}
          onClose={() => setDetailModalLead(null)}
        />
      )}

      {/* 5. Merge History Drawer */}
      <MergeHistoryDrawer 
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={mergeHistory}
      />

      {/* 6. Jira Guide Modal with 1-click test runners */}
      {isJiraGuideOpen && (
        <JiraGuideModal 
          onClose={() => setIsJiraGuideOpen(false)}
          onRunScenario1={handleRunScenario1}
          onRunScenario2={handleRunScenario2}
          onRunScenario3={handleRunScenario3}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
