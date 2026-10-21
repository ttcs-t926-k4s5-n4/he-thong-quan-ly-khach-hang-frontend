import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import Header from './components/Header';
import KpiSummaryCards from './components/KpiSummaryCards';
import FileUploadZone from './components/FileUploadZone';
import PreviewTable from './components/PreviewTable';
import DuplicateCompareModal from './components/DuplicateCompareModal';
import ImportSummaryModal from './components/ImportSummaryModal';
import CustomerSystemView from './components/CustomerSystemView';
import JiraGuideModal from './components/JiraGuideModal';
import Toast from './components/Toast';

import { initialExistingCustomers } from './data/mockExistingCustomers';
import { mockPresetFiles } from './data/mockPresetFiles';
import {
  parseUploadedFile,
  validateRow,
  detectDuplicates
} from './utils/excelParser';
import {
  downloadExcelTemplate,
  downloadCsvTemplate
} from './utils/templateDownloader';

export default function App() {
  // Theme & User Settings
  const [theme, setTheme] = useState('dark');
  const [currentRole, setCurrentRole] = useState('SALES_REP');
  const [activeView, setActiveView] = useState('import'); // 'import' | 'customers'

  // CRM Customer Database State (Khách hàng hiện có trong hệ thống)
  const [existingCustomers, setExistingCustomers] = useState(initialExistingCustomers);

  // File Upload & Preview State
  const [currentFileName, setCurrentFileName] = useState('');
  const [previewRows, setPreviewRows] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Modal States
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedDuplicateRow, setSelectedDuplicateRow] = useState(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [isJiraGuideOpen, setIsJiraGuideOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Khởi tạo giao diện Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Helper
  const addToast = (message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Tải preset mặc định khi mới mở ứng dụng để giao diện sinh động ngay
  useEffect(() => {
    // Mặc định nạp tệp "Có bản ghi trùng" để thỏa mãn đề bài ngay khi vừa bật app
    handleSelectPreset(mockPresetFiles[0]);
  }, []);

  // Xử lý nạp kịch bản mẫu có sẵn
  const handleSelectPreset = preset => {
    setCurrentFileName(preset.name);
    // Tính toán kiểm tra trùng và validate
    const validated = preset.rows.map(r => {
      const { isValid, errors } = validateRow(r);
      return { ...r, isValid, errors };
    });
    const withDuplicates = detectDuplicates(validated, existingCustomers);
    setPreviewRows(withDuplicates);
    setActiveFilter('ALL');
    addToast(
      `Đã nạp tệp: ${preset.name} (${withDuplicates.length} dòng dữ liệu)`,
      'info',
      preset.badge
    );
  };

  // Xử lý tải file thực tế từ máy (.xlsx, .xls, .csv)
  const handleFileUpload = async file => {
    try {
      const result = await parseUploadedFile(file, existingCustomers);
      setCurrentFileName(result.fileName);
      setPreviewRows(result.rows);
      setActiveFilter('ALL');
      addToast(
        `Đã đọc thành công tệp ${result.fileName} với ${result.rows.length} dòng dữ liệu!`,
        'success',
        'Phân Tích Excel Thành Công'
      );
    } catch (err) {
      addToast(err.message, 'error', 'Lỗi Đọc Tệp Excel');
    }
  };

  // Reset file hiện tại
  const handleResetFile = () => {
    setCurrentFileName('');
    setPreviewRows([]);
    setActiveFilter('ALL');
    addToast('Đã làm mới bảng xem trước', 'info');
  };

  // Xử lý sửa trực tiếp một ô trên bảng xem trước (Inline Quick Edit)
  const handleRowChange = (rowNumber, field, newValue) => {
    setPreviewRows(prev => {
      const updated = prev.map(row => {
        if (row.rowNumber === rowNumber) {
          const modRow = { ...row, [field]: newValue };
          const { isValid, errors } = validateRow(modRow);
          return {
            ...modRow,
            isValid,
            errors
          };
        }
        return row;
      });

      // Tái tính toán kiểm tra trùng lặp
      const reChecked = detectDuplicates(updated, existingCustomers);
      const targetRow = reChecked.find(r => r.rowNumber === rowNumber);

      if (targetRow && targetRow.isValid) {
        addToast(
          `Dòng #${rowNumber} đã được sửa thành công và chuyển sang trạng thái Hợp Lệ!`,
          'success',
          'Sửa Trực Tiếp Thành Công'
        );
      }
      return reChecked;
    });
  };

  // Đổi hành động xử lý trùng trên 1 dòng ('skip' hoặc 'update')
  const handleDuplicateActionChange = (rowNumber, action) => {
    setPreviewRows(prev =>
      prev.map(row => {
        if (row.rowNumber === rowNumber) {
          return { ...row, duplicateAction: action };
        }
        return row;
      })
    );
    addToast(
      `Dòng #${rowNumber}: Đã chuyển hành động thành [${action === 'skip' ? 'BỎ QUA' : 'CẬP NHẬT'}]`,
      'info'
    );
  };

  // Thao tác hàng loạt cho toàn bộ các bản ghi trùng
  const handleBulkDuplicateAction = action => {
    let affected = 0;
    setPreviewRows(prev =>
      prev.map(row => {
        if (row.isDuplicate) {
          affected++;
          return { ...row, duplicateAction: action };
        }
        return row;
      })
    );
    addToast(
      `Đã chuyển toàn bộ ${affected} bản ghi trùng sang chế độ: ${action === 'skip' ? 'BỎ QUA' : 'CẬP NHẬT'}`,
      action === 'skip' ? 'warning' : 'success',
      'Thao Tác Hàng Loạt'
    );
  };

  // Mở modal so sánh bản ghi trùng
  const handleOpenCompareModal = row => {
    setSelectedDuplicateRow(row);
    setIsCompareModalOpen(true);
  };

  // Thực hiện nhập dữ liệu vào CSDL CRM
  const handleExecuteImport = () => {
    if (previewRows.length === 0) {
      addToast('Không có dữ liệu để nhập!', 'error');
      return;
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    let updatedExisting = [...existingCustomers];

    previewRows.forEach(row => {
      // 1. Dòng có lỗi -> Loại trừ
      if (!row.isValid) {
        errorCount++;
        return;
      }

      // 2. Dòng trùng lặp
      if (row.isDuplicate) {
        if (row.duplicateAction === 'skip') {
          skippedCount++;
        } else if (row.duplicateAction === 'update') {
          updatedCount++;
          // Cập nhật vào CSDL hiện có nếu có khách hàng khớp
          if (row.matchedCustomer) {
            updatedExisting = updatedExisting.map(existing => {
              if (existing.id === row.matchedCustomer.id) {
                return {
                  ...existing,
                  name: row.name || existing.name,
                  phone: row.phone || existing.phone,
                  email: row.email || existing.email,
                  address: row.address || existing.address,
                  city: row.city || existing.city,
                  assignedSales: row.assignedSales || existing.assignedSales,
                  isRecentlyUpdated: true,
                  updatedAt: new Date().toISOString().split('T')[0]
                };
              }
              return existing;
            });
          }
        }
        return;
      }

      // 3. Dòng hợp lệ không trùng -> Tạo mới khách hàng
      createdCount++;
      const newCustomer = {
        id: row.code || `KH-${String(updatedExisting.length + 1).padStart(3, '0')}`,
        code: row.code || `KH-${String(updatedExisting.length + 1).padStart(3, '0')}`,
        name: row.name,
        taxCode: row.taxCode || '',
        email: row.email || '',
        phone: row.phone || '',
        address: row.address || '',
        city: row.city || 'Chưa cập nhật',
        industry: row.industry || 'Chung',
        assignedSales: row.assignedSales || 'Nguyễn Hoàng Nam',
        status: 'ACTIVE',
        dealsCount: 0,
        totalValue: 0,
        contactPerson: row.contactPerson || '',
        isNewlyImported: true,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      updatedExisting.unshift(newCustomer);
    });

    // Cập nhật CSDL
    setExistingCustomers(updatedExisting);

    // Chuẩn bị kết quả nghiệm thu
    const summary = {
      createdCount,
      updatedCount,
      skippedCount,
      errorCount,
      totalProcessed: previewRows.length,
      fileName: currentFileName || 'Danh_sach_khach_hang.xlsx'
    };

    setImportResult(summary);
    setIsSummaryModalOpen(true);

    addToast(
      `Đã nhập thành công ${createdCount} khách hàng mới và cập nhật ${updatedCount} khách hàng trùng!`,
      'success',
      'Nhập Excel Hoàn Tất'
    );
  };

  // Tính toán KPI tổng quan
  const summary = {
    total: previewRows.length,
    valid: previewRows.filter(r => r.isValid && !r.isDuplicate).length,
    duplicate: previewRows.filter(r => r.isDuplicate).length,
    invalid: previewRows.filter(r => !r.isValid).length
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenJiraGuide={() => setIsJiraGuideOpen(true)}
        onDownloadTemplate={downloadExcelTemplate}
        customerCount={existingCustomers.length}
      />

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'import' ? (
          <>
            {/* Banner User Story Đề Bài */}
            <div className="story-banner">
              <div>
                <div className="story-header">
                  <span className="story-badge">JIRA SCRUM-193 (FRONTEND) / SCRUM-74</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    • Phân hệ: Quản Lý Khách Hàng (Customer Management)
                  </span>
                </div>
                <div className="story-quote">
                  "Là Nhân viên kinh doanh, tôi muốn nhập danh sách khách hàng hàng loạt từ Excel, để đưa danh mục khách đang có vào hệ thống mà không gõ lại."
                </div>
                <div className="story-criteria-list">
                  <div className="story-criteria-item">
                    <CheckCircle2 size={15} />
                    <span>
                      <strong>Tiêu chí 1:</strong> Tải được tệp mẫu, xem trước và báo lỗi theo từng dòng (kèm sửa lỗi trực tiếp trên ô).
                    </span>
                  </div>
                  <div className="story-criteria-item">
                    <CheckCircle2 size={15} />
                    <span>
                      <strong>Tiêu chí 2:</strong> Bản ghi trùng được đánh dấu rõ trong bản xem trước để chọn bỏ qua hoặc cập nhật (hỗ trợ thao tác hàng loạt).
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsJiraGuideOpen(true)}
                style={{ alignSelf: 'center', flexShrink: 0 }}
              >
                <Sparkles size={14} style={{ color: 'var(--primary)' }} /> Xem Đối Chiếu Jira
              </button>
            </div>

            {/* 4 Thẻ KPI Thống Kê Dữ Liệu Tệp */}
            <KpiSummaryCards
              summary={summary}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Vùng Tải Tệp Lên & Chọn Kịch Bản Mẫu 1-Click */}
            <FileUploadZone
              currentFileName={currentFileName}
              onFileUpload={handleFileUpload}
              onSelectPreset={handleSelectPreset}
              onDownloadTemplate={downloadExcelTemplate}
              onDownloadCsvTemplate={downloadCsvTemplate}
              onResetFile={handleResetFile}
              totalRows={previewRows.length}
            />

            {/* Bảng Dữ Liệu Xem Trước (Preview Table) */}
            {previewRows.length > 0 && (
              <PreviewTable
                rows={previewRows}
                onRowChange={handleRowChange}
                onDuplicateActionChange={handleDuplicateActionChange}
                onBulkDuplicateAction={handleBulkDuplicateAction}
                onOpenCompareModal={handleOpenCompareModal}
                onExecuteImport={handleExecuteImport}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            )}
          </>
        ) : (
          /* Màn hình xem Danh Mục Khách Hàng Hệ Thống CRM Sau Khi Nhập */
          <CustomerSystemView
            customers={existingCustomers}
            onBackToImport={() => setActiveView('import')}
          />
        )}
      </main>

      {/* Modal So Sánh Bản Ghi Trùng */}
      <DuplicateCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        row={selectedDuplicateRow}
        onDuplicateActionChange={handleDuplicateActionChange}
      />

      {/* Modal Báo Cáo Kết Quả Nghiệm Thu Sau Khi Nhập */}
      <ImportSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summaryResult={importResult}
        onViewCustomers={() => {
          setIsSummaryModalOpen(false);
          setActiveView('customers');
        }}
        onImportAnother={() => {
          setIsSummaryModalOpen(false);
          setActiveView('import');
          handleResetFile();
        }}
      />

      {/* Modal Hướng Dẫn & Đối Chiếu Nghiệm Thu Jira */}
      <JiraGuideModal
        isOpen={isJiraGuideOpen}
        onClose={() => setIsJiraGuideOpen(false)}
      />

      {/* Thông Báo Toast */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
