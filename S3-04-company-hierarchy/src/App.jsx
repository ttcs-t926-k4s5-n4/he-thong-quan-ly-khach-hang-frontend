import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { CustomerListView } from './components/CustomerListView';
import { ParentCompanyDetailView } from './components/ParentCompanyDetailView';
import { DeclareRelationshipModal } from './components/DeclareRelationshipModal';
import { UnlinkConfirmationModal } from './components/UnlinkConfirmationModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { JiraGuideModal } from './components/JiraGuideModal';
import { ToastContainer } from './components/Toast';
import {
  CURRENT_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_CONTRACTS,
  INITIAL_PIPELINE_DEALS
} from './data/mockData';
import {
  calculateGroupTotals,
  isParentCompany,
  getRootParent,
  formatShortVND
} from './utils/hierarchyUtils';

export default function App() {
  // 1. Quản lý Giao diện Sáng / Tối (Dark / Light Theme)
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Quản lý Người dùng & Vai trò hiện tại (User Role Switcher)
  const [currentUser, setCurrentUser] = useState(CURRENT_USERS[0]); // Mặc định là Nhân viên kinh doanh theo User Story

  // 3. Quản lý Dữ liệu Hệ thống
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [pipelineDeals] = useState(INITIAL_PIPELINE_DEALS);

  // 4. Quản lý Màn hình Điều hướng (View State)
  // 'CUSTOMER_LIST': Màn hình Danh sách Khách hàng & KPI
  // 'PARENT_DETAIL': Màn hình Chi tiết Công ty Mẹ & Hợp nhất Tập đoàn (Tiêu chí 2)
  const [activeView, setActiveView] = useState('CUSTOMER_LIST');
  const [selectedParentId, setSelectedParentId] = useState('KH-FPT-CORP');

  // 5. Bộ lọc danh sách khách hàng
  const [activeListFilter, setActiveListFilter] = useState('ALL');

  // 6. Quản lý Trạng thái Modal
  const [modalState, setModalState] = useState({
    type: null, // 'DECLARE_RELATION' | 'UNLINK_CONFIRM' | 'CUSTOMER_DETAIL' | 'JIRA_GUIDE'
    data: null
  });

  // 7. Quản lý Thông báo Toast
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

  // Công ty mẹ hiện đang được xem chi tiết
  const currentParentCustomer = customers.find((c) => c.id === selectedParentId) || customers[0];

  // ================= CÁC HÀNH ĐỘNG NGHIỆP VỤ (BUSINESS ACTIONS) =================

  /**
   * TIÊU CHÍ 1: GẮN MỘT KHÁCH HÀNG LÀM CÔNG TY CON CỦA KHÁCH HÀNG KHÁC
   */
  const handleSaveRelation = ({ childId, parentId, relationType, ownershipPercent, legalBasis }) => {
    const childObj = customers.find((c) => c.id === childId);
    const parentObj = customers.find((c) => c.id === parentId);

    setCustomers((prevCustomers) =>
      prevCustomers.map((c) => {
        if (c.id === childId) {
          return {
            ...c,
            parentId,
            relationType,
            ownershipPercent,
            notes: legalBasis ? `${c.notes || ''} | ${legalBasis}` : c.notes
          };
        }
        return c;
      })
    );

    setModalState({ type: null, data: null });

    addToast(
      'success',
      'Khai Báo Quan Hệ Thành Công!',
      `Đã gắn "${childObj?.shortName || childId}" làm công ty con của "${parentObj?.shortName || parentId}" (${ownershipPercent}% vốn).`
    );

    // Tự động chuyển đến trang công ty mẹ để người dùng quan sát tổng giá trị được cộng dồn tức thì!
    setSelectedParentId(parentId);
    setActiveView('PARENT_DETAIL');
  };

  /**
   * TÁCH CÔNG TY CON KHỎI TẬP ĐOÀN (HỦY QUAN HỆ)
   */
  const handleConfirmUnlink = (childId) => {
    const childObj = customers.find((c) => c.id === childId);

    setCustomers((prevCustomers) =>
      prevCustomers.map((c) => {
        if (c.id === childId) {
          return {
            ...c,
            parentId: null,
            relationType: null,
            ownershipPercent: null
          };
        }
        return c;
      })
    );

    setModalState({ type: null, data: null });

    addToast(
      'info',
      'Đã Ngắt Liên Kết Tập Đoàn',
      `"${childObj?.shortName || childId}" đã được tách thành Pháp nhân Độc lập. Dữ liệu hợp đồng cá nhân được bảo toàn.`
    );
  };

  /**
   * MỞ TRANG CÔNG TY MẸ (TIÊU CHÍ 2 JIRA)
   */
  const handleSelectParentGroup = (parentCustomer) => {
    // Nếu chọn phải công ty con, tìm công ty mẹ tối cao
    const root = isParentCompany(parentCustomer, customers)
      ? parentCustomer
      : getRootParent(parentCustomer.id, customers) || parentCustomer;

    setSelectedParentId(root.id);
    setActiveView('PARENT_DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Header Điều hướng & Role Switcher */}
      <Header
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        currentUsers={CURRENT_USERS}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJiraGuide={() => setModalState({ type: 'JIRA_GUIDE', data: null })}
        activeView={activeView}
        onNavigateHome={() => setActiveView('CUSTOMER_LIST')}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === 'CUSTOMER_LIST' ? (
          <>
            {/* 4 Thẻ KPI Tổng Hợp */}
            <KpiSummaryCards
              customers={customers}
              contracts={contracts}
              activeFilter={activeListFilter}
              onFilterChange={setActiveListFilter}
            />

            {/* Bảng Danh Sách Khách Hàng Doanh Nghiệp */}
            <CustomerListView
              customers={customers}
              contracts={contracts}
              activeFilter={activeListFilter}
              onFilterChange={setActiveListFilter}
              onSelectParentGroup={handleSelectParentGroup}
              onOpenDeclareRelationModal={(data) =>
                setModalState({ type: 'DECLARE_RELATION', data })
              }
              onOpenDetailModal={(customer) =>
                setModalState({ type: 'CUSTOMER_DETAIL', data: customer })
              }
            />
          </>
        ) : (
          /* TRANG CÔNG TY MẸ HIỂN THỊ TỔNG GIÁ TRỊ HỢP ĐỒNG CẢ NHÓM (TIÊU CHÍ 2) */
          <ParentCompanyDetailView
            parentCustomer={currentParentCustomer}
            allCustomers={customers}
            allContracts={contracts}
            allDeals={pipelineDeals}
            onBack={() => setActiveView('CUSTOMER_LIST')}
            onSelectCustomer={(cust) => setSelectedParentId(cust.id)}
            onOpenDeclareRelationModal={(data) =>
              setModalState({ type: 'DECLARE_RELATION', data })
            }
            onOpenUnlinkModal={(child, parent) =>
              setModalState({
                type: 'UNLINK_CONFIRM',
                data: { childCustomer: child, parentCustomer: parent }
              })
            }
            onOpenDetailModal={(customer) =>
              setModalState({ type: 'CUSTOMER_DETAIL', data: customer })
            }
          />
        )}
      </main>

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* Modal 1: Khai Báo Quan Hệ Mẹ - Con (Tiêu chí 1) */}
      <DeclareRelationshipModal
        isOpen={modalState.type === 'DECLARE_RELATION'}
        onClose={() => setModalState({ type: null, data: null })}
        customers={customers}
        contracts={contracts}
        defaultChildId={modalState.data?.defaultChildId}
        defaultParentId={modalState.data?.defaultParentId}
        onSaveRelation={handleSaveRelation}
      />

      {/* Modal 2: Xác Nhận Tách Công Ty Con */}
      <UnlinkConfirmationModal
        isOpen={modalState.type === 'UNLINK_CONFIRM'}
        onClose={() => setModalState({ type: null, data: null })}
        childCustomer={modalState.data?.childCustomer}
        parentCustomer={modalState.data?.parentCustomer}
        contracts={contracts}
        customers={customers}
        onConfirmUnlink={handleConfirmUnlink}
      />

      {/* Modal 3: Chi Tiết Hồ Sơ Khách Hàng */}
      <CustomerDetailModal
        isOpen={modalState.type === 'CUSTOMER_DETAIL'}
        onClose={() => setModalState({ type: null, data: null })}
        customer={modalState.data}
        allCustomers={customers}
        contracts={contracts}
        onSelectParentGroup={handleSelectParentGroup}
        onOpenDeclareRelationModal={(data) =>
          setModalState({ type: 'DECLARE_RELATION', data })
        }
      />

      {/* Modal 4: Đối Chiếu Tiêu Chí Nghiệm Thu Jira (SCRUM-73) */}
      <JiraGuideModal
        isOpen={modalState.type === 'JIRA_GUIDE'}
        onClose={() => setModalState({ type: null, data: null })}
      />

      {/* Hệ thống Toast Thông báo Phản hồi */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
