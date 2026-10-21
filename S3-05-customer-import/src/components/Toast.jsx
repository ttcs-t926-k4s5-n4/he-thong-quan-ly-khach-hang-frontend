import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let toastClass = 'toast-success';
        let iconColor = 'var(--primary)';

        if (toast.type === 'error') {
          Icon = XCircle;
          toastClass = 'toast-error';
          iconColor = 'var(--danger)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          toastClass = 'toast-warning';
          iconColor = 'var(--warning)';
        } else if (toast.type === 'info') {
          Icon = Info;
          toastClass = '';
          iconColor = 'var(--info)';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass}`}>
            <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
