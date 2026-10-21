import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CustomerHeroCard from './components/CustomerHeroCard';
import TimelineFiltersBar from './components/TimelineFiltersBar';
import TimelineView from './components/TimelineView';
import FiveMinuteBriefingDrawer from './components/FiveMinuteBriefingDrawer';
import EventDetailModal from './components/EventDetailModal';
import NewInteractionModal from './components/NewInteractionModal';
import JiraTicketModal from './components/JiraTicketModal';
import Toast from './components/Toast';

import { mockCustomers } from './data/mockCustomers';
import { mockTeamMembers } from './data/mockTeamMembers';
import { mockTimelineEvents } from './data/mockTimelineEvents';
import { filterAndSortTimelineEvents } from './utils/timelineUtils';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState('dark');

  // Core Data States
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUST-1021'); // Viettel Post default
  const [teamMembers] = useState(mockTeamMembers);
  const [timelineEvents, setTimelineEvents] = useState(mockTimelineEvents);

  // Current User Persona (CSKH: Hoàng Kim Ngân)
  const currentPersona = useMemo(() => {
    return teamMembers.find(m => m.isCurrentPersona) || teamMembers[0];
  }, [teamMembers]);

  // Selected Customer Object
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  // Filters State
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedActor, setSelectedActor] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC'); // DESC = Newest first
  const [onlyMilestones, setOnlyMilestones] = useState(false);

  // Modals & Drawers State
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isNewInteractionOpen, setIsNewInteractionOpen] = useState(false);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Filtered Events Calculation
  const filteredEvents = useMemo(() => {
    return filterAndSortTimelineEvents({
      events: timelineEvents,
      customerId: selectedCustomerId,
      selectedType,
      selectedActor,
      searchQuery,
      timeRange,
      sortOrder,
      onlyMilestones
    });
  }, [timelineEvents, selectedCustomerId, selectedType, selectedActor, searchQuery, timeRange, sortOrder, onlyMilestones]);

  const totalEventsForCustomer = useMemo(() => {
    return timelineEvents.filter(e => e.customerId === selectedCustomerId).length;
  }, [timelineEvents, selectedCustomerId]);

  // Handlers
  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    setSelectedType('ALL');
    setSelectedActor('ALL');
    setSearchQuery('');
    setTimeRange('ALL');
    setOnlyMilestones(false);
    const cust = customers.find(c => c.id === id);
    addToast(`Đã chuyển sang xem dòng thời gian: ${cust?.name || id}`, 'info');
  };

  const handleResetFilters = () => {
    setSelectedType('ALL');
    setSelectedActor('ALL');
    setSearchQuery('');
    setTimeRange('ALL');
    setOnlyMilestones(false);
    addToast('Đã đặt lại tất cả bộ lọc', 'info');
  };

  const handleAcceptHandover = () => {
    // 1. Update customer status
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        return {
          ...c,
          status: 'HANDOVER_ACCEPTED',
          statusLabel: 'Đã hoàn tất tiếp nhận bàn giao',
          statusColor: '#10b981'
        };
      }
      return c;
    }));

    // 2. Add an official Takeover Event into the timeline
    const handoverEvent = {
      id: `EVT-TAKEOVER-${Date.now()}`,
      customerId: selectedCustomerId,
      type: 'HANDOVER',
      typeLabel: 'Tiếp nhận bàn giao thành công',
      category: 'HANDOVER',
      timestamp: new Date().toISOString(),
      actorId: currentPersona.id,
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorAvatar: currentPersona.avatar,
      title: '🎉 Hoàng Kim Ngân (CSKH) chính thức xác nhận tiếp nhận bàn giao',
      summary: `Đã nắm rõ toàn bộ bối cảnh thương vụ trong 5 phút từ ${currentCustomer.handoverInfo?.fromMemberName}. Sẵn sàng làm việc trực tiếp với khách hàng.`,
      isKeyMilestone: true,
      details: {
        fromMember: currentCustomer.handoverInfo?.fromMemberName,
        toMember: currentPersona.name,
        reason: 'Xác nhận tiếp quản hồ sơ sau khi đọc hiểu bối cảnh và các lưu ý nhạy cảm.',
        personalAdvice: 'Đã lưu danh bạ anh Long và lên kế hoạch gọi điện chào hỏi trước 11:30 sáng nay.'
      }
    };

    setTimelineEvents(prev => [handoverEvent, ...prev]);
    addToast(`🎉 CSKH ${currentPersona.name} đã tiếp nhận thành công hồ sơ ${currentCustomer.shortName}!`, 'success');
  };

  const handleAddEvent = (newEvent) => {
    setTimelineEvents(prev => [newEvent, ...prev]);

    // If Quote was sent, update latestQuote in customer state
    if (newEvent.type === 'QUOTE_SENT' && newEvent.details?.finalAmount) {
      setCustomers(prev => prev.map(c => {
        if (c.id === newEvent.customerId) {
          return {
            ...c,
            latestQuote: {
              id: `QUOTE-${Date.now()}`,
              code: newEvent.details.quoteCode,
              title: newEvent.title,
              totalAmount: newEvent.details.finalAmount,
              discountPercent: 0,
              sentDate: newEvent.timestamp,
              validUntil: '2026-11-30',
              status: 'SENT',
              statusLabel: 'Mới gửi báo giá'
            }
          };
        }
        return c;
      }));
    }

    // If Opportunity changed, update stage
    if (newEvent.type === 'OPPORTUNITY_CHANGE' && newEvent.details?.newStageLabel) {
      setCustomers(prev => prev.map(c => {
        if (c.id === newEvent.customerId) {
          return {
            ...c,
            activeOpportunity: {
              ...c.activeOpportunity,
              stageLabel: newEvent.details.newStageLabel
            }
          };
        }
        return c;
      }));
    }

    addToast(`Đã thêm tương tác mới: "${newEvent.title}"`, 'success');
  };

  return (
    <div className="app-container">
      {/* Header Topbar */}
      <Header 
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={handleSelectCustomer}
        currentPersona={currentPersona}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenNewInteraction={() => setIsNewInteractionOpen(true)}
        onOpenJiraModal={() => setIsJiraModalOpen(true)}
      />

      {/* Customer Hero Overview Card */}
      <CustomerHeroCard 
        customer={currentCustomer}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onAcceptHandover={handleAcceptHandover}
      />

      {/* Timeline Filters Bar (AC2: Lọc theo loại hoạt động & Người thực hiện) */}
      <TimelineFiltersBar 
        teamMembers={teamMembers}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        selectedActor={selectedActor}
        onSelectActor={setSelectedActor}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        sortOrder={sortOrder}
        onToggleSortOrder={() => setSortOrder(prev => (prev === 'DESC' ? 'ASC' : 'DESC'))}
        onlyMilestones={onlyMilestones}
        onToggleOnlyMilestones={() => setOnlyMilestones(prev => !prev)}
        filteredCount={filteredEvents.length}
        totalCount={totalEventsForCustomer}
      />

      {/* Chronological Unified Timeline Feed (AC1: Gộp toàn bộ hoạt động theo thứ tự thời gian) */}
      <TimelineView 
        events={filteredEvents}
        onSelectEvent={(evt) => setSelectedEventDetail(evt)}
        onResetFilters={handleResetFilters}
      />

      {/* Drawer: 5-Minute Handover Briefing (Nắm bắt bối cảnh trong 5 phút) */}
      <FiveMinuteBriefingDrawer 
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        customer={currentCustomer}
        onAcceptHandover={handleAcceptHandover}
      />

      {/* Modal: Event Detail Modal */}
      <EventDetailModal 
        event={selectedEventDetail}
        onClose={() => setSelectedEventDetail(null)}
      />

      {/* Modal: New Interaction Form */}
      <NewInteractionModal 
        isOpen={isNewInteractionOpen}
        onClose={() => setIsNewInteractionOpen(false)}
        customer={currentCustomer}
        teamMembers={teamMembers}
        currentPersona={currentPersona}
        onAddEvent={handleAddEvent}
      />

      {/* Modal: Jira Ticket Tra cứu SCRUM-102 */}
      <JiraTicketModal 
        isOpen={isJiraModalOpen}
        onClose={() => setIsJiraModalOpen(false)}
      />

      {/* Floating Toasts */}
      <Toast 
        toasts={toasts}
      />
    </div>
  );
}
