import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  DollarSign, 
  RotateCcw, 
  FileSpreadsheet,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Header } from './components/Header';
import { JiraTicketModal } from './components/JiraTicketModal';
import { KpiQuotaOverview } from './components/KpiQuotaOverview';
import { OpportunityTable } from './components/OpportunityTable';
import { CloseWonModal } from './components/CloseWonModal';
import { CloseLostModal } from './components/CloseLostModal';
import { ReopenModal } from './components/ReopenModal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { WinLossAnalytics } from './components/WinLossAnalytics';
import { Toast } from './components/Toast';

import { INITIAL_OPPORTUNITIES } from './data/mockOpportunities';
import { MOCK_USERS, USER_ROLES } from './data/mockUsers';
import { calculateUserKpis, calculateCompanyStats, formatCurrency } from './utils/formatters';
import { triggerConfetti } from './utils/confetti';

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
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); // Mặc định: Nguyễn Văn An (Sales Rep)
  const [activeTab, setActiveTab] = useState('LIST'); // 'LIST' | 'KPIS' | 'ANALYTICS'

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [ownerFilter, setOwnerFilter] = useState('ALL');

  // Modals state
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [wonModalOpp, setWonModalOpp] = useState(null);
  const [lostModalOpp, setLostModalOpp] = useState(null);
  const [reopenModalOpp, setReopenModalOpp] = useState(null);
  const [detailModalOpp, setDetailModalOpp] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // KPI calculations (AC4)
  const userKpis = calculateUserKpis(opportunities, MOCK_USERS);
  const companyStats = calculateCompanyStats(opportunities);

  // Filtered opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    // Search
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchId = opp.id.toLowerCase().includes(query);
      const matchTitle = opp.title.toLowerCase().includes(query);
      const matchCustomer = opp.customerName.toLowerCase().includes(query);
      if (!matchId && !matchTitle && !matchCustomer) return false;
    }

    // Stage filter
    if (stageFilter === 'OPEN') {
      if (opp.stage === 'CLOSED_WON' || opp.stage === 'CLOSED_LOST') return false;
    } else if (stageFilter !== 'ALL') {
      if (opp.stage !== stageFilter) return false;
    }

    // Owner filter
    if (ownerFilter !== 'ALL') {
      if (opp.ownerId !== ownerFilter) return false;
    }

    return true;
  });

  // Action: Submit Close Won (AC1 & AC4)
  const handleSubmitWon = (oppId, wonData) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === oppId) {
          const newAudit = [
            ...(opp.auditTrail || []),
            {
              id: `LOG-${Date.now()}`,
              action: 'CLOSED_WON',
              timestamp: timeStr,
              actor: currentUser.name,
              details: `Đóng Thắng cơ hội. Giá trị chốt thực tế: ${formatCurrency(wonData.actualValue)}. Ngày ký: ${wonData.signedDate}. Số HĐ: ${wonData.contractNumber}. Tự động cộng vào KPI người sở hữu (${opp.ownerName}).`
            }
          ];

          return {
            ...opp,
            stage: 'CLOSED_WON',
            probability: 100,
            isLocked: true, // Khóa cơ hội theo AC3
            closedData: {
              ...wonData,
              type: 'WON',
              closedAt: timeStr,
              closedBy: currentUser.name
            },
            auditTrail: newAudit
          };
        }
        return opp;
      })
    );

    // Confetti celebration!
    triggerConfetti();

    addToast(
      'success',
      '🎉 Đóng Thắng Cơ Hội Thành Công! (AC1)',
      `Đã cập nhật giá trị chốt ${formatCurrency(wonData.actualValue)}. Doanh số đã được cộng dồn vào chỉ tiêu KPI của người sở hữu (AC4)!`
    );
  };

  // Action: Submit Close Lost (AC2)
  const handleSubmitLost = (oppId, lostData) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === oppId) {
          const newAudit = [
            ...(opp.auditTrail || []),
            {
              id: `LOG-${Date.now()}`,
              action: 'CLOSED_LOST',
              timestamp: timeStr,
              actor: currentUser.name,
              details: `Đóng Thua cơ hội. Lý do: ${lostData.lossReason}. Đối thủ thắng thầu: ${lostData.competitorName}. Đã lưu phân tích nguyên nhân vào Trung tâm học hỏi Win/Loss.`
            }
          ];

          return {
            ...opp,
            stage: 'CLOSED_LOST',
            probability: 0,
            isLocked: true, // Khóa cơ hội theo AC3
            closedData: {
              ...lostData,
              closedAt: timeStr,
              closedBy: currentUser.name
            },
            auditTrail: newAudit
          };
        }
        return opp;
      })
    );

    addToast(
      'warning',
      'Đã Đóng Thua Cơ Hội & Lưu Bài Học (AC2)',
      `Ghi nhận lý do: "${lostData.lossReason}". Dữ liệu được đưa vào Báo cáo học hỏi thất bại thương vụ.`
    );
  };

  // Action: Submit Reopen Opportunity (AC3)
  const handleSubmitReopen = (oppId, reopenData) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === oppId) {
          const wasWon = opp.stage === 'CLOSED_WON';
          const newAudit = [
            ...(opp.auditTrail || []),
            {
              id: `LOG-${Date.now()}`,
              action: 'REOPENED',
              timestamp: timeStr,
              actor: `${reopenData.reopenedBy} (${reopenData.reopenedRole})`,
              details: `Mở lại cơ hội sang giai đoạn [${reopenData.targetStage}]. Lý do mở lại: "${reopenData.reopenReason}". ${wasWon ? 'Đã hoàn trừ số tiền thắng khỏi KPI người sở hữu.' : ''}`
            }
          ];

          return {
            ...opp,
            stage: reopenData.targetStage,
            probability: reopenData.targetStage === 'NEGOTIATION' ? 80 : 50,
            isLocked: false, // Mở khóa cho phép tiếp tục chỉnh sửa
            closedData: null,
            auditTrail: newAudit
          };
        }
        return opp;
      })
    );

    addToast(
      'info',
      'Mở Lại Cơ Hội Thành Công (AC3)',
      `Đã chuyển cơ hội về trạng thái đàm phán và ghi nhận lý do mở lại vào Nhật ký kiểm toán.`
    );
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJiraModal={() => setIsJiraModalOpen(true)}
      />

      <main className="main-content">
        {/* User Story Banner */}
        <section className="user-story-card">
          <div className="user-story-header">
            <div className="user-story-title-group">
              <span className="jira-badge-pill" onClick={() => setIsJiraModalOpen(true)}>
                <Sparkles size={14} /> SCRUM-20 / SCRUM-91
              </span>
              <span className="badge badge-proposal">Sprint 04 &bull; Sales CRM</span>
            </div>
            <button 
              className="btn btn-ghost" 
              onClick={() => setIsJiraModalOpen(true)}
              style={{ fontSize: '0.78rem' }}
            >
              Xem Chi Tiết Đề Bài & Test Cases →
            </button>
          </div>

          <h2 className="user-story-heading">
            Là Nhân viên kinh doanh, tôi muốn đóng một cơ hội với kết quả thắng hoặc thua, để công ty học được từ cả thương vụ thắng lẫn thua.
          </h2>

          <div className="acceptance-criteria-pills">
            <span className="ac-pill active" title="AC1: Đóng Thắng bắt buộc nhập giá trị chốt thực tế và ngày ký">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <strong>AC1:</strong> Đóng Thắng: Bắt buộc giá trị chốt thực tế & ngày ký
            </span>

            <span className="ac-pill active" title="AC2: Đóng Thua bắt buộc chọn lý do thua và đối thủ thắng thầu nếu có">
              <CheckCircle2 size={14} className="text-rose-400" />
              <strong>AC2:</strong> Đóng Thua: Bắt buộc lý do thua & đối thủ trúng thầu
            </span>

            <span className="ac-pill active" title="AC3: Cơ hội đã đóng không sửa được, chỉ Trưởng nhóm trở lên mở lại được kèm lý do">
              <CheckCircle2 size={14} className="text-purple-400" />
              <strong>AC3:</strong> Khóa cơ hội đã đóng; Trưởng nhóm mở lại kèm lý do
            </span>

            <span className="ac-pill active" title="AC4: Cơ hội thắng được tính vào chỉ tiêu của người sở hữu">
              <CheckCircle2 size={14} className="text-blue-400" />
              <strong>AC4:</strong> Thắng tự động cộng vào chỉ tiêu người sở hữu
            </span>
          </div>
        </section>

        {/* View Tabs */}
        <nav className="view-tabs">
          <button
            className={`tab-btn ${activeTab === 'LIST' ? 'active' : ''}`}
            onClick={() => setActiveTab('LIST')}
          >
            <DollarSign size={16} />
            <span>Danh Sách Cơ Hội Bán Hàng</span>
            <span className="tab-badge">{opportunities.length}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'KPIS' ? 'active' : ''}`}
            onClick={() => setActiveTab('KPIS')}
          >
            <Target size={16} />
            <span>Chỉ Tiêu Doanh Số (AC4)</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ANALYTICS')}
          >
            <Lightbulb size={16} />
            <span>Phân Tích & Bài Học Thắng/Thua</span>
            <span className="tab-badge" style={{ background: 'var(--purple-bg)', color: '#c084fc' }}>
              Học Hỏi
            </span>
          </button>
        </nav>

        {/* Tab 1: List View */}
        {activeTab === 'LIST' && (
          <div>
            {/* Quick KPI Quota Strip for Current User */}
            <KpiQuotaOverview
              userKpis={userKpis}
              currentUser={currentUser}
              companyStats={companyStats}
              onFilterByOwner={(ownerId) => setOwnerFilter(ownerId)}
            />

            {/* Opportunity Table */}
            <OpportunityTable
              opportunities={filteredOpportunities}
              currentUser={currentUser}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              stageFilter={stageFilter}
              onStageFilterChange={setStageFilter}
              ownerFilter={ownerFilter}
              onOwnerFilterChange={setOwnerFilter}
              users={MOCK_USERS}
              onOpenCloseWonModal={(opp) => setWonModalOpp(opp)}
              onOpenCloseLostModal={(opp) => setLostModalOpp(opp)}
              onOpenReopenModal={(opp) => setReopenModalOpp(opp)}
              onViewDetail={(opp) => setDetailModalOpp(opp)}
            />
          </div>
        )}

        {/* Tab 2: Detailed KPI Quota View */}
        {activeTab === 'KPIS' && (
          <div>
            <KpiQuotaOverview
              userKpis={userKpis}
              currentUser={currentUser}
              companyStats={companyStats}
              onFilterByOwner={(ownerId) => {
                setOwnerFilter(ownerId);
                setActiveTab('LIST');
              }}
            />
          </div>
        )}

        {/* Tab 3: Win/Loss Analytics Hub */}
        {activeTab === 'ANALYTICS' && (
          <WinLossAnalytics opportunities={opportunities} />
        )}
      </main>

      {/* Modals */}
      <JiraTicketModal
        isOpen={isJiraModalOpen}
        onClose={() => setIsJiraModalOpen(false)}
      />

      <CloseWonModal
        isOpen={!!wonModalOpp}
        opportunity={wonModalOpp}
        onClose={() => setWonModalOpp(null)}
        onSubmitWon={handleSubmitWon}
      />

      <CloseLostModal
        isOpen={!!lostModalOpp}
        opportunity={lostModalOpp}
        onClose={() => setLostModalOpp(null)}
        onSubmitLost={handleSubmitLost}
      />

      <ReopenModal
        isOpen={!!reopenModalOpp}
        opportunity={reopenModalOpp}
        currentUser={currentUser}
        onClose={() => setReopenModalOpp(null)}
        onSubmitReopen={handleSubmitReopen}
      />

      <OpportunityDetailModal
        isOpen={!!detailModalOpp}
        opportunity={detailModalOpp}
        onClose={() => setDetailModalOpp(null)}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
