import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { KpiMetrics } from './components/KpiMetrics';
import { ForensicBanner } from './components/ForensicBanner';
import { FilterBar } from './components/FilterBar';
import { AuditLogTable } from './components/AuditLogTable';
import { AuditDetailModal } from './components/AuditDetailModal';
import { SimulateChangeModal } from './components/SimulateChangeModal';
import { NotificationToast } from './components/NotificationToast';
import { INITIAL_AUDIT_LOGS } from './data/mockData';
import { exportLogsToCSV } from './utils/exportCsv';
import './App.css';

export function App() {
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Filters State
  const initialFilters = {
    searchQuery: '',
    selectedUser: 'ALL',
    selectedObjectType: 'ALL',
    startDate: '',
    endDate: '',
    datePreset: 'all',
    discrepancyOnly: false
  };
  const [filters, setFilters] = useState(initialFilters);

  // Modals & UI State
  const [selectedLog, setSelectedLog] = useState(null);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [toast, setToast] = useState(null);

  // Filter logs logic
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // 1. Filter by User
      if (filters.selectedUser !== 'ALL' && log.user.id !== filters.selectedUser) {
        return false;
      }

      // 2. Filter by Object Type
      if (filters.selectedObjectType === 'DISCOUNT_TARGET') {
        if (log.objectType !== 'DISCOUNT' && log.objectType !== 'SALES_TARGET') {
          return false;
        }
      } else if (
        filters.selectedObjectType !== 'ALL' &&
        log.objectType !== filters.selectedObjectType
      ) {
        return false;
      }

      // 3. Filter by Date Range
      const logDate = log.timestamp.split(' ')[0]; // YYYY-MM-DD
      if (filters.startDate && logDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && logDate > filters.endDate) {
        return false;
      }

      // 4. Filter by Discrepancy (Anomalous only)
      if (filters.discrepancyOnly && !log.isAnomalous) {
        return false;
      }

      // 5. Filter by Search Query
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchId = log.id.toLowerCase().includes(query);
        const matchTarget = log.targetName.toLowerCase().includes(query);
        const matchTargetId = log.targetId.toLowerCase().includes(query);
        const matchField = log.fieldName.toLowerCase().includes(query);
        const matchUser = log.user.name.toLowerCase().includes(query);
        const matchReason = (log.reason || '').toLowerCase().includes(query);
        const matchOldVal = (log.oldValue || '').toLowerCase().includes(query);
        const matchNewVal = (log.newValue || '').toLowerCase().includes(query);

        if (
          !matchId &&
          !matchTarget &&
          !matchTargetId &&
          !matchField &&
          !matchUser &&
          !matchReason &&
          !matchOldVal &&
          !matchNewVal
        ) {
          return false;
        }
      }

      return true;
    });
  }, [auditLogs, filters]);

  // Handler: Save simulated audit log
  const handleSaveAuditLog = (newLog) => {
    setAuditLogs([newLog, ...auditLogs]);
    setCurrentPage(1);
    setToast({
      type: 'success',
      title: 'Đã ghi nhận thay đổi thành công!',
      message: `Hệ thống vừa tạo bản ghi kiểm toán ${newLog.id} cho [${newLog.changeType}].`
    });
  };

  // Handler: Toggle Investigation mode
  const handleToggleInvestigation = () => {
    if (filters.discrepancyOnly) {
      setFilters(initialFilters);
      setToast({
        type: 'info',
        title: 'Đã tắt chế độ điều tra',
        message: 'Hiển thị lại toàn bộ nhật ký bình thường.'
      });
    } else {
      setFilters({
        ...initialFilters,
        discrepancyOnly: true,
        datePreset: 'q3_close',
        startDate: '2024-09-28',
        endDate: '2024-09-30'
      });
      setCurrentPage(1);
      setToast({
        type: 'warning',
        title: 'Bật chế độ điều tra lệch số liệu Quý 3!',
        message: 'Đang hiển thị 4 giao dịch nhạy cảm đáng ngờ chốt sổ cuối quý.'
      });
    }
  };

  // Handler: Quick filter Chiết khấu & Chỉ tiêu từ thẻ KPI
  const handleFilterDiscountTarget = () => {
    if (filters.selectedObjectType === 'DISCOUNT_TARGET') {
      setFilters({ ...filters, selectedObjectType: 'ALL' });
    } else {
      setFilters({ ...filters, selectedObjectType: 'DISCOUNT_TARGET' });
      setCurrentPage(1);
    }
  };

  // Handler: Reset all filters
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
    setToast({
      type: 'info',
      title: 'Đã làm mới bộ lọc',
      message: 'Toàn bộ tiêu chí tìm kiếm đã được khôi phục về mặc định.'
    });
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    exportLogsToCSV(filteredLogs);
    setToast({
      type: 'success',
      title: 'Đã xuất dữ liệu thành công',
      message: `Đã tạo file CSV chứa ${filteredLogs.length} bản ghi kiểm toán.`
    });
  };

  // Handler: Refresh logs
  const handleRefreshLogs = () => {
    setToast({
      type: 'info',
      title: 'Đồng bộ nhật ký thành công',
      message: `Tất cả ${auditLogs.length} bản ghi kiểm toán đang ở trạng thái toàn vẹn mới nhất.`
    });
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Main Container */}
      <main className="app-container">
        {/* Header với Jira Ticket & User Story */}
        <Header
          onOpenSimulate={() => setIsSimulateOpen(true)}
          onExportCSV={handleExportCSV}
          onRefreshLogs={handleRefreshLogs}
          totalLogs={auditLogs.length}
        />

        {/* Thẻ KPI & Chỉ số giám sát */}
        <KpiMetrics
          logs={auditLogs}
          currentFilters={filters}
          onFilterDiscrepancy={handleToggleInvestigation}
          onFilterDiscountTarget={handleFilterDiscountTarget}
        />

        {/* Banner Điều tra Sai lệch Cuối Quý */}
        <ForensicBanner
          isInvestigating={filters.discrepancyOnly}
          onToggleInvestigation={handleToggleInvestigation}
        />

        {/* Bộ Lọc (Người dùng, Loại đối tượng, Khoảng thời gian, Từ khóa) */}
        <FilterBar
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
          totalResults={filteredLogs.length}
        />

        {/* Bảng Nhật Ký Thay Đổi (Audit Log Table) */}
        <AuditLogTable
          logs={filteredLogs}
          onSelectLog={(log) => setSelectedLog(log)}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>

      {/* Modal Chi Tiết Bản Ghi */}
      {selectedLog && (
        <AuditDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {/* Modal Giả Lập Sửa Dữ Liệu Nhạy Cảm */}
      <SimulateChangeModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onSaveAuditLog={handleSaveAuditLog}
      />
    </div>
  );
}

export default App;
