import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DuplicateAlertBanner } from './components/DuplicateAlertBanner';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { CustomerListView } from './components/CustomerListView';
import { SideBySideComparisonModal } from './components/SideBySideComparisonModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { MergeSuccessModal } from './components/MergeSuccessModal';
import { MergeHistoryDrawer } from './components/MergeHistoryDrawer';
import { JiraGuideModal } from './components/JiraGuideModal';
import { RequestApprovalModal } from './components/RequestApprovalModal';
import { CURRENT_USERS, INITIAL_CUSTOMERS, INITIAL_MERGE_HISTORY } from './data/mockCustomers';
import { detectAllDuplicates } from './utils/duplicateDetector';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  // 1. Quản lý Theme (Dark / Light)
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Quản lý Người dùng & Phân quyền hiện tại (Tiêu chí 4)
  const [currentUser, setCurrentUser] = useState(CURRENT_USERS[0]); // Mặc định là Trưởng nhóm

  // 3. Quản lý Dữ liệu khách hàng & Lịch sử gộp
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [mergeHistory, setMergeHistory] = useState(INITIAL_MERGE_HISTORY);

  // 4. Bộ lọc hiển thị (ALL / DUPLICATES_ONLY / SAFE_ONLY)
  const [activeFilter, setActiveFilter] = useState('ALL');

  // 5. Quản lý Modal & Drawer
  const [modalState, setModalState] = useState({
    type: null, // 'MERGE_COMPARISON' | 'DETAIL' | 'NEW' | 'SUCCESS' | 'HISTORY' | 'JIRA_GUIDE' | 'APPROVAL'
    data: null
  });

  // 6. Quản lý Thông báo Toast
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 7. Thuật toán quét và phát hiện trùng lặp thời gian thực (Tiêu chí 1)
  const duplicatePairs = useMemo(() => {
    return detectAllDuplicates(customers);
  }, [customers]);

  // Tập hợp các ID khách hàng đang bị trùng
  const duplicateCustomerIds = useMemo(() => {
    const ids = new Set();
    duplicatePairs.forEach((pair) => {
      ids.add(pair.customerA.id);
      ids.add(pair.customerB.id);
    });
    return ids;
  }, [duplicatePairs]);

  // Tổng số tiền deals
  const totalPipelineAmount = useMemo(() => {
    return customers.reduce((sum, c) => {
      return sum + c.deals.reduce((dSum, d) => dSum + d.amount, 0);
    }, 0);
  }, [customers]);

  // Thao tác mở modal so sánh & gộp (Tiêu chí 2)
  const handleOpenMergeModal = (custA, custB, report) => {
    setModalState({
      type: 'MERGE_COMPARISON',
      data: { customerA: custA, customerB: custB, report }
    });
  };

  // Thao tác thực thi gộp dữ liệu (Tiêu chí 3 & 4)
  const handleConfirmMerge = (masterId, secondaryId, finalRecord) => {
    // 1. Cập nhật danh sách: Ghi đè Master và xóa Secondary
    setCustomers((prev) => {
      return prev
        .map((c) => (c.id === masterId ? finalRecord : c))
        .filter((c) => c.id !== secondaryId);
    });

    // 2. Ghi lại lịch sử gộp (Audit Trail)
    const historyItem = {
      id: `MRG-${Date.now().toString().slice(-4)}`,
      mergedAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
      approvedBy: `${currentUser.name} (${currentUser.roleLabel})`,
      primaryCustomer: {
        id: finalRecord.id,
        name: finalRecord.name,
        taxCode: finalRecord.taxCode,
        ownerName: finalRecord.ownerName
      },
      mergedCustomer: {
        id: secondaryId,
        name: modalState.data?.customerB?.name || secondaryId,
        taxCode: modalState.data?.customerB?.taxCode || '',
        ownerName: modalState.data?.customerB?.ownerName || ''
      },
      matchReason: modalState.data?.report?.reasons?.join('; ') || 'Trùng thông tin doanh nghiệp',
      transferredContactsCount: finalRecord.contacts.length,
      transferredDealsCount: finalRecord.deals.length,
      totalPipelineValue: finalRecord.deals.reduce((s, d) => s + d.amount, 0),
      transferredActivitiesCount: finalRecord.activities.length,
      coOwnerAssigned: `${finalRecord.coOwnerName} (Đồng phụ trách)`
    };

    setMergeHistory((prev) => [historyItem, ...prev]);

    // 3. Mở thông báo thành công
    setModalState({
      type: 'SUCCESS',
      data: {
        mergedMasterCustomer: finalRecord,
        mergedSecondaryId: secondaryId
      }
    });

    addToast(
      'success',
      'Gộp khách hàng thành công!',
      `Đã chuyển toàn bộ liên hệ, cơ hội và dòng thời gian từ [${secondaryId}] sang [${masterId}].`
    );
  };

  // Thao tác gửi yêu cầu gộp từ Sales Rep lên Trưởng nhóm
  const handleRequestApproval = (custA, custB, report) => {
    setModalState({
      type: 'APPROVAL',
      data: { customerA: custA, customerB: custB, report }
    });
  };

  const handleSubmitApproval = ({ customerA, customerB, note }) => {
    setModalState({ type: null, data: null });
    addToast(
      'warning',
      'Đã gửi yêu cầu gộp khách hàng!',
      `Phiếu đề xuất gộp [${customerA.name}] và [${customerB.name}] đã được gửi tới Trưởng nhóm Trần Mạnh Hùng.`
    );
  };

  // Thao tác tạo mới khách hàng
  const handleCreateCustomer = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setModalState({ type: null, data: null });
    addToast('success', 'Thêm mới thành công!', `Đã tạo hồ sơ khách hàng [${newCustomer.name}].`);
  };

  return (
    <div className="app-container">
      {/* 1. Header & Thanh điều hướng phân quyền */}
      <Header
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          addToast('info', 'Chuyển đổi vai trò!', `Bạn đang xem hệ thống với quyền: ${user.name} (${user.roleLabel})`);
        }}
        duplicatePairsCount={duplicatePairs.length}
        onOpenJiraGuide={() => setModalState({ type: 'JIRA_GUIDE', data: null })}
        onOpenHistory={() => setModalState({ type: 'HISTORY', data: null })}
        onOpenDuplicatesOnly={() => setActiveFilter('DUPLICATES_ONLY')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main-content">
        {/* 2. Banner Cảnh Báo Trùng Lặp Nổi Bật (Tiêu chí 1) */}
        <DuplicateAlertBanner
          duplicatePairs={duplicatePairs}
          currentUser={currentUser}
          onQuickMerge={(cA, cB, report) => handleOpenMergeModal(cA, cB, report)}
        />

        {/* 3. Thẻ Chỉ Số KPI Thống Kê & Lọc Nhanh */}
        <KpiSummaryCards
          totalCount={customers.length}
          duplicateCount={duplicateCustomerIds.size}
          totalDealsAmount={totalPipelineAmount}
          mergedHistoryCount={mergeHistory.length}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onOpenHistory={() => setModalState({ type: 'HISTORY', data: null })}
        />

        {/* 4. Danh Sách Khách Hàng Doanh Nghiệp */}
        <CustomerListView
          customers={customers}
          duplicatePairs={duplicatePairs}
          onOpenMergeModal={(cA, cB, report) => handleOpenMergeModal(cA, cB, report)}
          onOpenDetailModal={(cust) => setModalState({ type: 'DETAIL', data: { customer: cust } })}
          onOpenNewCustomerModal={() => setModalState({ type: 'NEW', data: null })}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          currentUser={currentUser}
        />
      </main>

      {/* =====================================================================
          CÁC MODAL CHỨC NĂNG
          ===================================================================== */}

      {/* Modal 1: So Sánh Cạnh Nhau & Gộp (Tiêu chí 2, 3, 4) */}
      {modalState.type === 'MERGE_COMPARISON' && (
        <SideBySideComparisonModal
          customerA={modalState.data.customerA}
          customerB={modalState.data.customerB}
          report={modalState.data.report}
          currentUser={currentUser}
          onClose={() => setModalState({ type: null, data: null })}
          onConfirmMerge={handleConfirmMerge}
          onRequestApproval={handleRequestApproval}
        />
      )}

      {/* Modal 2: Thêm Khách Hàng Mới & Kiểm Tra Trùng Live */}
      {modalState.type === 'NEW' && (
        <NewCustomerModal
          existingCustomers={customers}
          currentUser={currentUser}
          onClose={() => setModalState({ type: null, data: null })}
          onCreateCustomer={handleCreateCustomer}
          onOpenMergeWithExisting={(matchedCust, newCustDraft, report) => {
            setModalState({
              type: 'MERGE_COMPARISON',
              data: {
                customerA: matchedCust,
                customerB: {
                  ...newCustDraft,
                  ownerName: currentUser.name,
                  ownerTeam: currentUser.team
                },
                report
              }
            });
          }}
        />
      )}

      {/* Modal 3: Chi Tiết Hồ Sơ Khách Hàng */}
      {modalState.type === 'DETAIL' && (
        <CustomerDetailModal
          customer={modalState.data.customer}
          onClose={() => setModalState({ type: null, data: null })}
        />
      )}

      {/* Modal 4: Thông Báo Thành Công Sau Khi Gộp */}
      {modalState.type === 'SUCCESS' && (
        <MergeSuccessModal
          mergedMasterCustomer={modalState.data.mergedMasterCustomer}
          mergedSecondaryId={modalState.data.mergedSecondaryId}
          onClose={() => setModalState({ type: null, data: null })}
          onViewDetail={(mergedCust) => {
            setModalState({ type: 'DETAIL', data: { customer: mergedCust } });
          }}
        />
      )}

      {/* Modal 5: Lịch Sử Gộp Khách Hàng */}
      {modalState.type === 'HISTORY' && (
        <MergeHistoryDrawer
          history={mergeHistory}
          onClose={() => setModalState({ type: null, data: null })}
        />
      )}

      {/* Modal 6: Đối Chiếu 4 Tiêu Chí Nghiệm Thu Jira */}
      {modalState.type === 'JIRA_GUIDE' && (
        <JiraGuideModal onClose={() => setModalState({ type: null, data: null })} />
      )}

      {/* Modal 7: Gửi Yêu Cầu Gộp Cho Trưởng Nhóm (Sales Rep RBAC) */}
      {modalState.type === 'APPROVAL' && (
        <RequestApprovalModal
          customerA={modalState.data.customerA}
          customerB={modalState.data.customerB}
          report={modalState.data.report}
          currentUser={currentUser}
          onClose={() => setModalState({ type: null, data: null })}
          onSubmitRequest={handleSubmitApproval}
        />
      )}

      {/* Thông Báo Toast */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />}
            {t.type === 'warning' && <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />}
            {t.type === 'info' && <Info size={20} style={{ color: 'var(--primary)' }} />}
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.875rem', display: 'block' }}>{t.title}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
