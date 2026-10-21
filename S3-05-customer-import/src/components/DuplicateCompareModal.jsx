import React from 'react';
import {
  AlertTriangle,
  X,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  SkipForward,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function DuplicateCompareModal({
  isOpen,
  onClose,
  row,
  onDuplicateActionChange
}) {
  if (!isOpen || !row) return null;

  const existing = row.matchedCustomer;
  const action = row.duplicateAction;

  const handleSelectAction = newAction => {
    onDuplicateActionChange(row.rowNumber, newAction);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <AlertTriangle size={22} style={{ color: 'var(--warning)' }} />
            <span>So Sánh Bản Ghi Trùng Lặp (Dòng #{row.rowNumber})</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Lý do trùng */}
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}
          >
            <AlertTriangle size={18} flexShrink={0} style={{ marginTop: '2px' }} />
            <div>
              <strong>Lý do phát hiện trùng lặp:</strong>
              <div style={{ marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                {row.duplicateReason || 'Trùng thông tin định danh doanh nghiệp'}
              </div>
            </div>
          </div>

          {/* Lưới so sánh 2 cột cạnh nhau */}
          <div className="compare-grid">
            {/* Cột trái: Bản ghi mới trong Excel */}
            <div className="compare-card incoming">
              <div className="compare-header" style={{ color: 'var(--warning)' }}>
                <FileSpreadsheet size={18} />
                <span>Bản Ghi Trong Excel (Dòng #{row.rowNumber})</span>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Tên công ty / Khách hàng:</div>
                <div className="compare-field-val" style={{ color: 'var(--warning)' }}>
                  {row.name}
                </div>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Mã số thuế:</div>
                <div className="compare-field-val" style={{ fontFamily: 'var(--font-mono)' }}>
                  {row.taxCode || '—'}
                </div>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Email:</div>
                <div className="compare-field-val">{row.email || '—'}</div>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Số điện thoại:</div>
                <div className="compare-field-val">{row.phone || '—'}</div>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Địa chỉ:</div>
                <div className="compare-field-val">{row.address || '—'}</div>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Tỉnh / Thành phố:</div>
                <div className="compare-field-val">{row.city || '—'}</div>
              </div>

              <div className="compare-field">
                <div className="compare-field-label">Nhân viên phụ trách mới:</div>
                <div className="compare-field-val">{row.assignedSales || '—'}</div>
              </div>
            </div>

            {/* Cột phải: Bản ghi đang có trong CSDL CRM */}
            <div className="compare-card existing">
              <div className="compare-header" style={{ color: 'var(--primary)' }}>
                <Database size={18} />
                <span>Bản Ghi Đã Có Trong CRM ({existing ? existing.id : 'Nội bộ'})</span>
              </div>

              {existing ? (
                <>
                  <div className="compare-field">
                    <div className="compare-field-label">Tên công ty hiện tại:</div>
                    <div className="compare-field-val" style={{ color: 'var(--primary)' }}>
                      {existing.name}
                    </div>
                  </div>

                  <div className="compare-field">
                    <div className="compare-field-label">Mã số thuế:</div>
                    <div className="compare-field-val" style={{ fontFamily: 'var(--font-mono)' }}>
                      {existing.taxCode || '—'}
                    </div>
                  </div>

                  <div className="compare-field">
                    <div className="compare-field-label">Email:</div>
                    <div className="compare-field-val">{existing.email || '—'}</div>
                  </div>

                  <div className="compare-field">
                    <div className="compare-field-label">Số điện thoại:</div>
                    <div className="compare-field-val">{existing.phone || '—'}</div>
                  </div>

                  <div className="compare-field">
                    <div className="compare-field-label">Địa chỉ:</div>
                    <div className="compare-field-val">{existing.address || '—'}</div>
                  </div>

                  <div className="compare-field">
                    <div className="compare-field-label">Tỉnh / Thành phố:</div>
                    <div className="compare-field-val">{existing.city || '—'}</div>
                  </div>

                  <div className="compare-field">
                    <div className="compare-field-label">Nhân viên đang phụ trách:</div>
                    <div className="compare-field-val">{existing.assignedSales || '—'}</div>
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>
                  Đây là bản ghi bị trùng lặp nội bộ trong cùng tệp Excel với một dòng khác.
                </div>
              )}
            </div>
          </div>

          {/* Khối quyết định hành động cho bản ghi này */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1.15rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Quyết định hành động xử lý bản ghi trùng này:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                style={{
                  border: `2px solid ${action === 'skip' ? 'var(--warning)' : 'var(--border-color)'}`,
                  backgroundColor: action === 'skip' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
                onClick={() => handleSelectAction('skip')}
              >
                <input
                  type="radio"
                  name="actionModal"
                  checked={action === 'skip'}
                  onChange={() => handleSelectAction('skip')}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--warning)' }}>
                    Bỏ Qua (Skip)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Giữ nguyên thông tin trong CRM hiện tại, không nhập bản ghi này từ file Excel.
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: `2px solid ${action === 'update' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: action === 'update' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
                onClick={() => handleSelectAction('update')}
              >
                <input
                  type="radio"
                  name="actionModal"
                  checked={action === 'update'}
                  onChange={() => handleSelectAction('update')}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>
                    Cập Nhật (Update / Overwrite)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Ghi đè, cập nhật thông tin mới nhất từ tệp Excel vào hồ sơ khách hàng hiện có.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            <CheckCircle2 size={14} /> Áp Dụng & Quay Lại Bảng
          </button>
        </div>
      </div>
    </div>
  );
}
