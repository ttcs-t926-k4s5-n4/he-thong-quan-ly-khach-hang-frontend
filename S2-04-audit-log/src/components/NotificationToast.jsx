import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-emerald" />;
      case 'warning':
        return <AlertCircle size={18} className="text-amber" />;
      default:
        return <Info size={18} className="text-cyan" />;
    }
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`} role="status">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
      <button type="button" className="toast-close" onClick={onClose}>
        <X size={15} />
      </button>
    </div>
  );
}
