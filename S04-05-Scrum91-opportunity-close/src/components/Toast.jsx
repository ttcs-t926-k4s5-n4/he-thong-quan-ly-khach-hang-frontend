import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
            {isDanger && <AlertCircle size={18} className="text-rose-400" />}
            {isWarning && <AlertCircle size={18} className="text-amber-400" />}
            {!isSuccess && !isDanger && !isWarning && <Info size={18} className="text-blue-400" />}

            <div className="toast-message">
              <strong style={{ display: 'block', fontSize: '0.82rem', marginBottom: '0.15rem' }}>
                {toast.title}
              </strong>
              <span>{toast.message}</span>
            </div>

            <button 
              className="modal-close-btn" 
              onClick={() => onDismiss(toast.id)}
              style={{ padding: '0.2rem' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
