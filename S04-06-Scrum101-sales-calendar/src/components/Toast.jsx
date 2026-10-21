import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--success-border)" />}
          {t.type === 'danger' && <AlertTriangle size={18} color="var(--danger-border)" />}
          {(!t.type || t.type === 'info') && <Info size={18} color="var(--primary)" />}

          <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
            {t.message}
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
