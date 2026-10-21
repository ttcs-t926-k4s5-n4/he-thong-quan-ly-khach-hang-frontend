import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isDanger = toast.type === 'danger';

        return (
          <div 
            key={toast.id} 
            className={`toast ${isSuccess ? 'toast-success' : isWarning ? 'toast-warning' : isDanger ? 'toast-danger' : ''}`}
          >
            {isSuccess && <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />}
            {isWarning && <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />}
            {isDanger && <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
            {!isSuccess && !isWarning && !isDanger && <Info size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />}

            <div style={{ flex: 1, fontSize: '0.82rem', lineHeight: 1.4 }}>
              {toast.message}
            </div>

            <button 
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
