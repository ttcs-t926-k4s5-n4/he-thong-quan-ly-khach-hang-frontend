import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Sparkles,
  RefreshCw,
  FileCheck2,
  AlertTriangle,
  FileX2,
  FileText
} from 'lucide-react';
import { mockPresetFiles } from '../data/mockPresetFiles';

export default function FileUploadZone({
  currentFileName,
  onFileUpload,
  onSelectPreset,
  onDownloadTemplate,
  onDownloadCsvTemplate,
  onResetFile,
  totalRows
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
      e.target.value = null; // Reset để có thể chọn lại cùng file nếu muốn
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-header">
        <div className="upload-title">
          <FileSpreadsheet size={22} style={{ color: 'var(--primary)' }} />
          <span>Tải Lên Tệp Danh Sách Khách Hàng (Excel / CSV)</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-excel btn-sm"
            onClick={onDownloadTemplate}
            title="Tải tệp mẫu Excel có định dạng sẵn cột và hướng dẫn"
          >
            <Download size={14} /> Tải Mẫu Excel (.xlsx)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onDownloadCsvTemplate}
            title="Tải tệp mẫu định dạng CSV (UTF-8)"
          >
            <FileText size={14} /> Tải Mẫu CSV
          </button>
        </div>
      </div>

      {/* Dropzone hoặc Thông tin file hiện tại */}
      {currentFileName ? (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                {currentFileName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Đã phân tích thành công: <strong style={{ color: 'var(--primary)' }}>{totalRows}</strong> dòng dữ liệu khách hàng
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <UploadCloud size={14} /> Tải Tệp Khác
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onResetFile}
              title="Xóa dữ liệu bảng xem trước để chọn lại từ đầu"
            >
              <RefreshCw size={14} /> Làm Mới
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <div className="upload-icon-circle">
            <UploadCloud size={32} />
          </div>
          <div className="upload-instructions-primary">
            Kéo thả tệp Excel (.xlsx, .xls) hoặc CSV vào đây, hoặc nhấn để duyệt tệp từ máy
          </div>
          <div className="upload-instructions-secondary">
            Hỗ trợ tự động nhận diện cột: Mã khách hàng, Tên công ty, MST, Email, Số điện thoại, Địa chỉ, Người liên hệ...
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.35rem' }}
            onClick={e => {
              e.stopPropagation();
              fileInputRef.current && fileInputRef.current.click();
            }}
          >
            <UploadCloud size={15} /> Chọn Tệp Từ Máy Tính
          </button>
        </div>
      )}

      {/* Input File ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Thanh kịch bản mẫu thử nhanh 1-Click (Dành cho kiểm thử) */}
      <div className="preset-scenarios-box">
        <div className="preset-title">
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          <span>Kịch Bản Kiểm Thử Nhanh 1-Click (Dữ Liệu Mẫu Đề Bài Jira):</span>
        </div>

        <div className="preset-chips-grid">
          {mockPresetFiles.map(preset => {
            const isDup = preset.id === 'preset-duplicates';
            const isErr = preset.id === 'preset-errors';

            return (
              <div
                key={preset.id}
                className="preset-chip"
                onClick={() => onSelectPreset(preset)}
                title={`Nhấn để nạp ngay bộ dữ liệu: ${preset.name}`}
              >
                <div style={{ marginTop: '2px' }}>
                  {isDup && <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />}
                  {isErr && <FileX2 size={18} style={{ color: 'var(--danger)' }} />}
                  {!isDup && !isErr && <FileCheck2 size={18} style={{ color: 'var(--primary)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span
                      className="preset-chip-badge"
                      style={{
                        backgroundColor: isDup ? 'var(--warning-bg)' : isErr ? 'var(--danger-bg)' : 'var(--primary-light)',
                        color: isDup ? 'var(--warning)' : isErr ? 'var(--danger)' : 'var(--primary)',
                        border: `1px solid ${isDup ? 'rgba(245, 158, 11, 0.4)' : isErr ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                      }}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <div className="preset-chip-name">{preset.name}</div>
                  <div className="preset-chip-desc">{preset.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
