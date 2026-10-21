import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
          {t.type === 'error' && <AlertCircle size={18} color="var(--danger)" />}
          {t.type === 'info' && <Info size={18} color="var(--info)" />}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.message}</div>
          </div>
          <button 
            className="btn-icon" 
            style={{ width: 24, height: 24, border: 'none', background: 'transparent' }}
            onClick={() => onDismiss(t.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
