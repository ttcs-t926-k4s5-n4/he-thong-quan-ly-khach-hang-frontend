import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Thông báo hệ thống">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let toastClass = 'toast-success';

        if (toast.type === 'info') {
          Icon = Info;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass}`}>
            <Icon size={18} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{toast.title}</div>
              {toast.message && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{toast.message}</div>}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn-ghost btn-sm"
              style={{ padding: '0.2rem', cursor: 'pointer', border: 'none', background: 'transparent' }}
              title="Đóng"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
