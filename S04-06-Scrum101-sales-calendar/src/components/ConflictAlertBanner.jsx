import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export default function ConflictAlertBanner({
  conflictCount,
  conflictEvents,
  onOpenResolutionModal,
  onDismiss
}) {
  if (conflictCount === 0) return null;

  return (
    <div className="conflict-alert-banner">
      <div className="conflict-alert-left">
        <div className="conflict-icon-wrap">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h4 className="conflict-title">
            ⚠️ Phát hiện {conflictCount} xung đột chồng chéo lịch làm việc trong nhóm!
          </h4>
          <p className="conflict-desc">
            Có thành viên bị xếp trùng 2 cuộc hẹn trong cùng một khung giờ. Hãy bố trí lại để đảm bảo công việc không bị gián đoạn.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className="btn btn-danger"
          onClick={onOpenResolutionModal}
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <span>Xem & Xử Lý Xung Đột</span>
          <ArrowRight size={14} />
        </button>

        {onDismiss && (
          <button 
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--danger-border)',
              cursor: 'pointer',
              padding: '4px'
            }}
            title="Đóng cảnh báo"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
