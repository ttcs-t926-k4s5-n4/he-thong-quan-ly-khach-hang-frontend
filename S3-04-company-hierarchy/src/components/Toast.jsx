import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let color = '#10b981';

        if (toast.type === 'danger') {
          Icon = AlertCircle;
          color = '#ef4444';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          color = '#f59e0b';
        } else if (toast.type === 'info') {
          Icon = Info;
          color = '#3b82f6';
        }

        return (
          <div key={toast.id} className={`toast toast-${toast.type || 'success'}`}>
            <Icon size={20} color={color} style={{ flexShrink: 0 }} />
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-msg">{toast.message}</div>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
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
