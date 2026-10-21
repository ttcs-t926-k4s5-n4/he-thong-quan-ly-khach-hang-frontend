import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CalendarControlsBar from './components/CalendarControlsBar';
import ConflictAlertBanner from './components/ConflictAlertBanner';
import CalendarStatsRow from './components/CalendarStatsRow';
import TeamSidebar from './components/TeamSidebar';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import TeamMatrixView from './components/TeamMatrixView';
import MobileAgendaView from './components/MobileAgendaView';
import EventDetailModal from './components/EventDetailModal';
import NewEventModal from './components/NewEventModal';
import SmartSlotFinderModal from './components/SmartSlotFinderModal';
import ConflictResolutionModal from './components/ConflictResolutionModal';
import JiraTicketModal from './components/JiraTicketModal';
import MobileFrameWrapper from './components/MobileFrameWrapper';
import Toast from './components/Toast';

import { MOCK_USERS } from './data/mockUsers';
import { INITIAL_EVENTS } from './data/mockEvents';
import { detectConflicts, formatDateISO } from './utils/calendarUtils';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('scrum101_theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrum101_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Người dùng hiện tại (Persona)
  // Mặc định là Nguyễn Văn An (Sales Rep) theo đúng User Story của ticket
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[1]);

  // Chế độ xem: 'MONTH' | 'WEEK' | 'DAY' | 'TEAM_MATRIX'
  const [viewMode, setViewMode] = useState('WEEK');

  // Ngày hiện tại đang duyệt (Neo tại tuần làm việc mẫu: 19/10/2026)
  const [currentDate, setCurrentDate] = useState(new Date('2026-10-19'));

  // Danh sách sự kiện (Đồng bộ với localStorage)
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('scrum101_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('scrum101_events', JSON.stringify(events));
  }, [events]);

  // Bộ lọc loại sự kiện: 'ALL' | 'MEETING' | 'TASK'
  const [filterType, setFilterType] = useState('ALL');

  // Danh sách thành viên nhóm được chọn hiển thị lịch
  const [selectedUserIds, setSelectedUserIds] = useState(() => {
    // Mặc định hiện cả nhóm để thấy tính năng chồng chéo và phối hợp
    return MOCK_USERS.map(u => u.id);
  });

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Trạng thái các Modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [newEventPrefill, setNewEventPrefill] = useState({ date: null, time: null, userId: null });
  const [isSlotFinderOpen, setIsSlotFinderOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [isJiraOpen, setIsJiraOpen] = useState(false);
  const [isMobileSimOpen, setIsMobileSimOpen] = useState(false);

  // Tính toán xung đột lịch (Conflict Detection Engine)
  const conflictsMap = useMemo(() => {
    return detectConflicts(events);
  }, [events]);

  const conflictCount = Math.floor(Array.from(conflictsMap.keys()).length / 2);

  // Lọc sự kiện theo Loại & Thành viên được chọn
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Lọc theo Loại: Cuộc gặp vs Việc có hạn
      if (filterType === 'MEETING' && e.type !== 'MEETING') return false;
      if (filterType === 'TASK' && e.type !== 'TASK') return false;

      // Lọc theo thành viên được chọn
      if (e.type === 'MEETING') {
        const hasSelectedAttendee = (e.attendees || []).some(uid => selectedUserIds.includes(uid));
        return hasSelectedAttendee;
      } else if (e.type === 'TASK') {
        return selectedUserIds.includes(e.assignedTo);
      }
      return true;
    });
  }, [events, filterType, selectedUserIds]);

  // Điều hướng ngày tháng
  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'MONTH') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'WEEK') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'MONTH') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'WEEK') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-10-19'));
    addToast('Đã chuyển về ngày làm việc hiện tại (19/10/2026)', 'info');
  };

  // Chọn thành viên
  const handleToggleUser = (uId) => {
    if (selectedUserIds.includes(uId)) {
      if (selectedUserIds.length > 1) {
        setSelectedUserIds(selectedUserIds.filter(id => id !== uId));
      }
    } else {
      setSelectedUserIds([...selectedUserIds, uId]);
    }
  };

  const handleSelectAllUsers = () => {
    setSelectedUserIds(MOCK_USERS.map(u => u.id));
    addToast('Đang hiển thị lịch của toàn bộ thành viên nhóm', 'info');
  };

  const handleDeselectAllUsers = () => {
    setSelectedUserIds([currentUser.id]);
    addToast(`Chỉ hiển thị lịch của ${currentUser.name}`, 'info');
  };

  const handleSelectUserPersona = (user) => {
    setCurrentUser(user);
    if (!selectedUserIds.includes(user.id)) {
      setSelectedUserIds(prev => [...prev, user.id]);
    }
    addToast(`Đã chuyển vai trò sang: ${user.name} (${user.role === 'TEAM_LEAD' ? 'Trưởng nhóm' : 'Sales Rep'})`, 'success');
  };

  // CRUD Sự kiện
  const handleCreateEvent = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    addToast(`Đã tạo thành công: "${newEvent.title}"`, 'success');
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addToast('Đã xóa sự kiện khỏi lịch', 'info');
  };

  const handleToggleTaskComplete = (taskId) => {
    setEvents(prev => prev.map(e => {
      if (e.id === taskId) {
        const nextStatus = e.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
        addToast(nextStatus === 'COMPLETED' ? `✓ Đã hoàn thành công việc: "${e.title}"` : `Đã chuyển sang chưa hoàn thành`, 'success');
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  // Mở modal tạo sự kiện tại ô giờ cụ thể
  const handleNewEventAtSlot = (date, time, userId) => {
    setNewEventPrefill({
      date,
      time,
      userId: userId || currentUser.id
    });
    setIsNewEventOpen(true);
  };

  // Giải quyết xung đột (Conflict Resolution)
  const handleResolveConflict = ({ action, targetEventId, newStartTime, newEndTime, removeUserId, addUserId }) => {
    if (action === 'RESCHEDULE') {
      setEvents(prev => prev.map(e => {
        if (e.id === targetEventId) {
          return { ...e, startTime: newStartTime, endTime: newEndTime };
        }
        return e;
      }));
      addToast(`✓ Đã dời lịch sang ${newStartTime} - ${newEndTime}. Xung đột đã được giải quyết!`, 'success');
    } else if (action === 'REASSIGN_ATTENDEE') {
      setEvents(prev => prev.map(e => {
        if (e.id === targetEventId) {
          const updatedAttendees = (e.attendees || [])
            .filter(id => id !== removeUserId)
            .concat(addUserId);
          return { ...e, attendees: updatedAttendees };
        }
        return e;
      }));
      const newRepName = MOCK_USERS.find(u => u.id === addUserId)?.name;
      addToast(`✓ Đã bàn giao quyền tham gia cho ${newRepName}. Xung đột đã được giải quyết!`, 'success');
    }
  };

  return (
    <div className="app-container">
      {/* 1. Header Topbar */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUserPersona}
        onOpenNewEvent={() => {
          setNewEventPrefill({ date: currentDate, time: '09:00', userId: currentUser.id });
          setIsNewEventOpen(true);
        }}
        onOpenJira={() => setIsJiraOpen(true)}
        isMobileSimOpen={isMobileSimOpen}
        onToggleMobileSim={() => setIsMobileSimOpen(!isMobileSimOpen)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Thanh điều hướng, bộ lọc loại lịch & chế độ xem (AC1 & AC2) */}
      <CalendarControlsBar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        currentDate={currentDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
        onToday={handleToday}
        filterType={filterType}
        onChangeFilterType={setFilterType}
        onOpenSlotFinder={() => setIsSlotFinderOpen(true)}
        currentUser={currentUser}
      />

      {/* 3. Banner cảnh báo xung đột nếu có (AC3) */}
      <ConflictAlertBanner
        conflictCount={conflictCount}
        onOpenResolutionModal={() => setIsResolutionOpen(true)}
      />

      {/* 4. Thẻ chỉ số KPI Lịch làm việc */}
      <CalendarStatsRow
        events={filteredEvents}
        conflictsMap={conflictsMap}
      />

      {/* 5. Không gian làm việc chính (Sidebar thành viên + Khung lịch chính) */}
      <main className="calendar-workspace">
        {/* Sidebar thành viên nhóm (AC3) */}
        <TeamSidebar
          selectedUserIds={selectedUserIds}
          onToggleUser={handleToggleUser}
          onSelectAllUsers={handleSelectAllUsers}
          onDeselectAllUsers={handleDeselectAllUsers}
          events={events}
          currentUser={currentUser}
          onOpenSlotFinder={() => setIsSlotFinderOpen(true)}
        />

        {/* Khung hiển thị Calendar chính theo View Mode */}
        <div className="calendar-main-view">
          {viewMode === 'MONTH' && (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              conflictsMap={conflictsMap}
              onSelectDate={(d) => setCurrentDate(d)}
              onSelectEvent={setSelectedEvent}
              onSwitchToDayView={() => setViewMode('DAY')}
            />
          )}

          {viewMode === 'WEEK' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              conflictsMap={conflictsMap}
              onSelectDate={(d) => setCurrentDate(d)}
              onSelectEvent={setSelectedEvent}
              onNewEventAtSlot={handleNewEventAtSlot}
            />
          )}

          {viewMode === 'DAY' && (
            <DayView
              currentDate={currentDate}
              events={filteredEvents}
              conflictsMap={conflictsMap}
              onSelectEvent={setSelectedEvent}
              onToggleTaskComplete={handleToggleTaskComplete}
              onOpenNewEvent={(d) => {
                setNewEventPrefill({ date: d, time: '09:00', userId: currentUser.id });
                setIsNewEventOpen(true);
              }}
            />
          )}

          {viewMode === 'TEAM_MATRIX' && (
            <TeamMatrixView
              currentDate={currentDate}
              events={filteredEvents}
              conflictsMap={conflictsMap}
              selectedUserIds={selectedUserIds}
              onSelectEvent={setSelectedEvent}
              onOpenSlotFinder={() => setIsSlotFinderOpen(true)}
              onNewEventAtSlot={handleNewEventAtSlot}
            />
          )}
        </div>
      </main>

      {/* MODAL CHI TIẾT SỰ KIỆN */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          conflictsMap={conflictsMap}
          onClose={() => setSelectedEvent(null)}
          onDeleteEvent={handleDeleteEvent}
          onToggleTaskComplete={handleToggleTaskComplete}
          onOpenSlotFinder={() => setIsSlotFinderOpen(true)}
        />
      )}

      {/* MODAL TẠO SỰ KIỆN MỚI */}
      {isNewEventOpen && (
        <NewEventModal
          initialDate={newEventPrefill.date}
          initialTime={newEventPrefill.time}
          initialUserId={newEventPrefill.userId}
          existingEvents={events}
          onClose={() => setIsNewEventOpen(false)}
          onCreateEvent={handleCreateEvent}
          onOpenSlotFinder={() => {
            setIsNewEventOpen(false);
            setIsSlotFinderOpen(true);
          }}
        />
      )}

      {/* MODAL GỢI Ý KHUNG GIỜ RẢNH (SMART SLOT FINDER) */}
      {isSlotFinderOpen && (
        <SmartSlotFinderModal
          currentDate={currentDate}
          events={events}
          onClose={() => setIsSlotFinderOpen(false)}
          onPickSlot={({ date, startTime, endTime, attendees }) => {
            setNewEventPrefill({
              date: new Date(date),
              time: startTime,
              userId: attendees[0]
            });
            setIsNewEventOpen(true);
            addToast(`Đã chọn khung giờ ${startTime} - ${endTime}. Hãy hoàn thiện thông tin cuộc gặp!`, 'info');
          }}
        />
      )}

      {/* MODAL GIẢI QUYẾT XUNG ĐỘT */}
      {isResolutionOpen && (
        <ConflictResolutionModal
          conflictsMap={conflictsMap}
          events={events}
          onClose={() => setIsResolutionOpen(false)}
          onResolveConflict={handleResolveConflict}
        />
      )}

      {/* MODAL TRA CỨU ĐỀ BÀI JIRA TICKET */}
      {isJiraOpen && (
        <JiraTicketModal onClose={() => setIsJiraOpen(false)} />
      )}

      {/* CHẾ ĐỘ GIẢ LẬP ĐIỆN THOẠI DI ĐỘNG (MOBILE SIMULATOR) */}
      {isMobileSimOpen && (
        <MobileFrameWrapper
          currentDate={currentDate}
          events={filteredEvents}
          conflictsMap={conflictsMap}
          onSelectDate={(d) => setCurrentDate(d)}
          onSelectEvent={setSelectedEvent}
          onToggleTaskComplete={handleToggleTaskComplete}
          onOpenNewEvent={(d) => {
            setNewEventPrefill({ date: d, time: '09:00', userId: currentUser.id });
            setIsNewEventOpen(true);
          }}
          onClose={() => setIsMobileSimOpen(false)}
        />
      )}

      {/* HỆ THỐNG THÔNG BÁO TOAST */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
