import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CategoryNavCards from './components/CategoryNavCards';
import CategoryItemList from './components/CategoryItemList';
import CategoryItemModal from './components/CategoryItemModal';
import IntegrityDeleteModal from './components/IntegrityDeleteModal';
import SafeDeleteConfirmModal from './components/SafeDeleteConfirmModal';
import MergeReassignModal from './components/MergeReassignModal';
import ReferenceDetailsModal from './components/ReferenceDetailsModal';
import ConsolidatedReportView from './components/ConsolidatedReportView';
import CrmSimulatorView from './components/CrmSimulatorView';
import Scrum65GuideModal from './components/Scrum65GuideModal';

import { 
  CATEGORY_DEFINITIONS, 
  INITIAL_CATEGORY_ITEMS, 
  INITIAL_OPERATIONAL_DATA 
} from './data/categoryData';

import { 
  getItemReferenceDetails, 
  getCategoryUsageMap, 
  reassignReferences 
} from './utils/referenceUtils';

import { 
  Boxes, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Laptop
} from 'lucide-react';

export default function App() {
  // 1. Theme State (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scrum65_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrum65_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 2. Active Main Navigation Tab: 'categories' | 'reports' | 'simulator'
  const [activeTab, setActiveTab] = useState('categories');

  // 3. Selected Category Sub-tab (default: 'industries')
  const [selectedCategoryId, setSelectedCategoryId] = useState('industries');

  // 4. Category Items State (persisted in localStorage)
  const [categoryItems, setCategoryItems] = useState(() => {
    const saved = localStorage.getItem('scrum65_category_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CATEGORY_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('scrum65_category_items', JSON.stringify(categoryItems));
  }, [categoryItems]);

  // 5. CRM Operational Data State (persisted in localStorage)
  const [operationalData, setOperationalData] = useState(() => {
    const saved = localStorage.getItem('scrum65_operational_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_OPERATIONAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('scrum65_operational_data', JSON.stringify(operationalData));
  }, [operationalData]);

  // 6. Usage Maps (Precomputed for fast rendering)
  const usageMaps = useMemo(() => {
    const maps = {};
    CATEGORY_DEFINITIONS.forEach(cat => {
      maps[cat.id] = getCategoryUsageMap(cat.id, operationalData);
    });
    return maps;
  }, [operationalData]);

  // 7. Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // 8. Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState(false);
  const [isSafeDeleteModalOpen, setIsSafeDeleteModalOpen] = useState(false);
  const [activeItemForDelete, setActiveItemForDelete] = useState(null);
  const [deleteRefDetails, setDeleteRefDetails] = useState({ totalReferences: 0, breakdown: {} });

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignSourceItem, setReassignSourceItem] = useState(null);

  const [isReferenceDetailsModalOpen, setIsReferenceDetailsModalOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState(null);
  const [inspectRefDetails, setInspectRefDetails] = useState({ totalReferences: 0, breakdown: {} });

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Selected Category Definition
  const currentCategory = CATEGORY_DEFINITIONS.find(c => c.id === selectedCategoryId) || CATEGORY_DEFINITIONS[0];
  const currentItems = categoryItems[selectedCategoryId] || [];
  const currentUsageMap = usageMaps[selectedCategoryId] || {};

  // Handlers for Category CRUD
  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (categoryId, item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemFormData) => {
    if (editingItem) {
      // Update existing item
      setCategoryItems(prev => {
        const list = prev[selectedCategoryId] || [];
        const updated = list.map(i => i.id === editingItem.id ? { ...i, ...itemFormData } : i);
        return { ...prev, [selectedCategoryId]: updated };
      });
      addToast(`Đã cập nhật mục "${itemFormData.name}" thành công!`, 'success');
    } else {
      // Create new item
      const newItem = {
        id: `${selectedCategoryId.slice(0, 3)}-${Date.now().toString().slice(-5)}`,
        ...itemFormData,
        sortOrder: currentItems.length + 1,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCategoryItems(prev => ({
        ...prev,
        [selectedCategoryId]: [...(prev[selectedCategoryId] || []), newItem]
      }));
      addToast(`Đã thêm mục mới "${newItem.name}" vào danh mục ${currentCategory.name}!`, 'success');
    }
    setIsItemModalOpen(false);
  };

  // Toggle Active/Inactive
  const handleToggleActive = (categoryId, itemId) => {
    setCategoryItems(prev => {
      const list = prev[categoryId] || [];
      const updated = list.map(i => {
        if (i.id === itemId) {
          const newStatus = !i.isActive;
          addToast(`Đã ${newStatus ? 'kích hoạt áp dụng' : 'tạm ngưng'} mục "${i.name}".`, 'info');
          return { ...i, isActive: newStatus };
        }
        return i;
      });
      return { ...prev, [categoryId]: updated };
    });
  };

  // Handle Delete Request (Criterion 2: "Giá trị đang được tham chiếu thì không xoá được")
  const handleDeleteRequest = (categoryId, item, isLocked, refCount) => {
    const details = getItemReferenceDetails(categoryId, item.id, operationalData);
    setActiveItemForDelete(item);
    setDeleteRefDetails(details);

    if (details.isReferenced) {
      // Strictly BLOCKED from deletion
      setIsIntegrityModalOpen(true);
    } else {
      // Safe to delete
      setIsSafeDeleteModalOpen(true);
    }
  };

  // Execute Safe Delete
  const handleConfirmSafeDelete = (categoryId, itemId) => {
    setCategoryItems(prev => {
      const list = prev[categoryId] || [];
      const filtered = list.filter(i => i.id !== itemId);
      // Re-index sortOrder
      const reindexed = filtered.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
      return { ...prev, [categoryId]: reindexed };
    });
    addToast('Đã xóa mục danh mục an toàn (0 ràng buộc dữ liệu).', 'success');
  };

  // Deactivate item as safe alternative to deletion
  const handleDeactivateItem = (categoryId, itemId) => {
    handleToggleActive(categoryId, itemId);
  };

  // Reassign / Merge References
  const handleOpenReassignModal = (item) => {
    setReassignSourceItem(item);
    setIsReassignModalOpen(true);
  };

  const handleConfirmReassign = (categoryId, fromItemId, toItemId) => {
    const { updatedData, count } = reassignReferences(categoryId, fromItemId, toItemId, operationalData);
    setOperationalData(updatedData);

    const fromItem = currentItems.find(i => i.id === fromItemId);
    const toItem = currentItems.find(i => i.id === toItemId);

    addToast(`Đã gộp thành công ${count} bản ghi từ "${fromItem?.name}" sang "${toItem?.name}"!`, 'success');
  };

  // Inspect references modal
  const handleInspectReferences = (categoryId, item) => {
    const details = getItemReferenceDetails(categoryId, item.id, operationalData);
    setInspectItem(item);
    setInspectRefDetails(details);
    setIsReferenceDetailsModalOpen(true);
  };

  // Handle Reordering (Criterion 3: "Sắp xếp được thứ tự hiển thị")
  const handleReorderItems = (categoryId, updatedItems) => {
    setCategoryItems(prev => ({
      ...prev,
      [categoryId]: updatedItems
    }));
    addToast('Đã lưu thứ tự hiển thị mới thành công!', 'success');
  };

  // Sắp xếp A-Z
  const handleSortAlphabetical = (categoryId) => {
    const list = [...(categoryItems[categoryId] || [])];
    list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    const reindexed = list.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    handleReorderItems(categoryId, reindexed);
    addToast(`Đã sắp xếp danh mục theo bảng chữ cái A-Z!`, 'info');
  };

  // Sắp xếp theo Usage Count (Phổ biến nhất lên đầu)
  const handleSortByUsage = (categoryId) => {
    const list = [...(categoryItems[categoryId] || [])];
    const map = usageMaps[categoryId] || {};
    list.sort((a, b) => (map[b.id] || 0) - (map[a.id] || 0));
    const reindexed = list.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    handleReorderItems(categoryId, reindexed);
    addToast(`Đã sắp xếp theo mức độ sử dụng thực tế trong CRM!`, 'info');
  };

  // Khôi phục thứ tự chuẩn
  const handleResetOrder = (categoryId) => {
    const initialList = INITIAL_CATEGORY_ITEMS[categoryId] || [];
    setCategoryItems(prev => ({
      ...prev,
      [categoryId]: initialList
    }));
    addToast(`Đã khôi phục thứ tự hiển thị chuẩn của ${currentCategory.name}.`, 'info');
  };

  // Reset entire application data
  const handleResetAllData = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ danh mục và dữ liệu mẫu về mặc định ban đầu không?')) {
      localStorage.removeItem('scrum65_category_items');
      localStorage.removeItem('scrum65_operational_data');
      setCategoryItems(INITIAL_CATEGORY_ITEMS);
      setOperationalData(INITIAL_OPERATIONAL_DATA);
      addToast('Đã khôi phục toàn bộ hệ thống về trạng thái ban đầu!', 'success');
    }
  };

  // Add new lead in CRM Simulator
  const handleAddNewLead = (newLead) => {
    setOperationalData(prev => ({
      ...prev,
      leads: [...(prev.leads || []), newLead]
    }));
  };

  return (
    <>
      {/* Decorative Ambient Background */}
      <div className="bg-mesh-pattern" />

      <div className="app-container">
        {/* Top Header */}
        <Header 
          theme={theme}
          onToggleTheme={toggleTheme}
          onResetData={handleResetAllData}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />

        {/* KPI Stats Overview */}
        <StatsCards 
          categoryItems={categoryItems}
          operationalData={operationalData}
          usageMaps={usageMaps}
        />

        {/* Main Navigation Tabs */}
        <div className="nav-tabs-wrapper">
          <button 
            id="tab-categories"
            className={`nav-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Boxes size={18} />
            <span>1. Quản Lý & Sắp Xếp Danh Mục</span>
            <span className="tab-badge">Tiêu chí 1, 2, 3</span>
          </button>

          <button 
            id="tab-reports"
            className={`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 size={18} />
            <span>2. Báo Cáo Gộp Bán Hàng Toàn Khối</span>
            <span className="tab-badge">Mục tiêu User Story</span>
          </button>

          <button 
            id="tab-simulator"
            className={`nav-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Sparkles size={18} />
            <span>3. Mô Phỏng Nhập Liệu CRM & Khóa Xóa</span>
            <span className="tab-badge">Kiểm chứng</span>
          </button>
        </div>

        {/* Tab 1: Category Management (Tiêu chí 1, 2, 3) */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 4 Thẻ danh mục dùng chung chính */}
            <CategoryNavCards 
              categories={CATEGORY_DEFINITIONS}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              categoryItems={categoryItems}
              usageMaps={usageMaps}
            />

            {/* Bảng danh sách mục, Kéo thả & Ràng buộc toàn vẹn */}
            <CategoryItemList 
              category={currentCategory}
              items={currentItems}
              usageMap={currentUsageMap}
              onAddNew={handleAddNewItem}
              onEdit={handleEditItem}
              onDeleteRequest={handleDeleteRequest}
              onToggleActive={handleToggleActive}
              onReorderItems={handleReorderItems}
              onSortAlphabetical={handleSortAlphabetical}
              onSortByUsage={handleSortByUsage}
              onResetOrder={handleResetOrder}
              onInspectReferences={handleInspectReferences}
            />
          </div>
        )}

        {/* Tab 2: Consolidated Sales BI Reporting */}
        {activeTab === 'reports' && (
          <ConsolidatedReportView 
            categoryItems={categoryItems}
            operationalData={operationalData}
          />
        )}

        {/* Tab 3: Interactive CRM Simulator Playground */}
        {activeTab === 'simulator' && (
          <CrmSimulatorView 
            categoryItems={categoryItems}
            operationalData={operationalData}
            onAddNewLead={handleAddNewLead}
            onSwitchToCategories={() => setActiveTab('categories')}
          />
        )}
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
            {toast.type === 'danger' && <AlertCircle size={18} color="var(--danger)" />}
            {toast.type === 'info' && <Sparkles size={18} color="var(--primary)" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      {/* 1. Category Item Form Modal (Add / Edit) */}
      <CategoryItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        category={currentCategory}
        editingItem={editingItem}
        existingItems={currentItems}
      />

      {/* 2. Integrity Delete Block Modal (When references > 0) */}
      <IntegrityDeleteModal 
        isOpen={isIntegrityModalOpen}
        onClose={() => setIsIntegrityModalOpen(false)}
        item={activeItemForDelete}
        category={currentCategory}
        referenceDetails={deleteRefDetails}
        onDeactivateItem={handleDeactivateItem}
        onOpenReassignModal={handleOpenReassignModal}
        onInspectRecords={handleInspectReferences}
      />

      {/* 3. Safe Delete Confirmation Modal (When references === 0) */}
      <SafeDeleteConfirmModal 
        isOpen={isSafeDeleteModalOpen}
        onClose={() => setIsSafeDeleteModalOpen(false)}
        onConfirm={handleConfirmSafeDelete}
        item={activeItemForDelete}
        category={currentCategory}
      />

      {/* 4. Merge / Reassign References Modal */}
      <MergeReassignModal 
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        sourceItem={reassignSourceItem}
        category={currentCategory}
        availableItems={currentItems}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* 5. Reference Details Drill-down Modal */}
      <ReferenceDetailsModal 
        isOpen={isReferenceDetailsModalOpen}
        onClose={() => setIsReferenceDetailsModalOpen(false)}
        item={inspectItem}
        category={currentCategory}
        referenceDetails={inspectRefDetails}
      />

      {/* 6. SCRUM-65 Acceptance Criteria Guide Modal */}
      <Scrum65GuideModal 
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </>
  );
}
