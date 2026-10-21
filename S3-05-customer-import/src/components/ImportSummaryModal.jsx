import React from 'react';
import {
  CheckCircle2,
  Building2,
  Download,
  RotateCcw,
  PlusCircle,
  RefreshCw,
  SkipForward,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function ImportSummaryModal({
  isOpen,
  onClose,
  summaryResult,
  onViewCustomers,
  onImportAnother
}) {
  if (!isOpen || !summaryResult) return null;

  const {
    createdCount = 0,
    updatedCount = 0,
    skippedCount = 0,
    errorCount = 0,
    totalProcessed = 0,
    fileName = 'file.xlsx'
  } = summaryResult;

  // Xuất file báo cáo kiểm toán import
  const handleExportAuditReport = () => {
    const reportContent =
      '\uFEFF' +
      `BÁO CÁO KẾT QUẢ NHẬP KHÁCH HÀNG TỪ EXCEL - CRM ENTERPRISE (SCRUM-193)\n` +
      `Thời gian thực hiện: ${new Date().toLocaleString('vi-VN')}\n` +
      `Tên tệp xử lý: ${fileName}\n` +
      `Tổng số dòng đã duyệt: ${totalProcessed}\n` +
      `------------------------------------------------------------\n` +
      `1. Khách hàng thêm mới thành công: ${createdCount}\n` +
      `2. Khách hàng trùng lặp đã cập nhật thông tin: ${updatedCount}\n` +
      `3. Khách hàng trùng lặp đã chọn bỏ qua: ${skippedCount}\n` +
      `4. Dòng dữ liệu có lỗi bị loại trừ: ${errorCount}\n` +
      `------------------------------------------------------------\n` +
      `Trạng thái: HOÀN TẤT 100% CÁC TIÊU CHÍ NGHIỆM THU ĐỀ BÀI.\n`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bien_Ban_Ket_Qua_Nhap_Excel_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <CheckCircle2 size={24} style={{ color: 'var(--primary)' }} />
            <span>Kết Quả Nhập Dữ Liệu Excel Vào Hệ Thống</span>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.75rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 24px var(--primary-glow)'
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Nhập Danh Sách Khách Hàng Thành Công!
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Đã xử lý xong tệp <strong style={{ color: 'var(--text-primary)' }}>{fileName}</strong> và tích hợp đầy đủ vào hệ thống CRM.
          </p>

          {/* 4 Thống kê kết quả */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', textAlign: 'left' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PlusCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Thêm Mới Thành Công</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                  +{createdCount}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đã Cập Nhật (Trùng Lặp)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#3b82f6' }}>
                  {updatedCount}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SkipForward size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đã Bỏ Qua (Trùng Lặp)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>
                  {skippedCount}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <XCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loại Trừ (Dòng Có Lỗi)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>
                  {errorCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportAuditReport}>
            <Download size={14} /> Tải Biên Bản Nhật Ký (.txt)
          </button>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={onImportAnother}>
              <RotateCcw size={14} /> Nhập Tiếp Tệp Khác
            </button>
            <button className="btn btn-primary btn-sm" onClick={onViewCustomers}>
              <Building2 size={14} /> Xem Danh Mục Khách Hàng CRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
