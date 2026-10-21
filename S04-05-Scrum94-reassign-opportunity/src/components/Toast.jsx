import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  let icon = <CheckCircle2 size={18} />;
  let className = 'toast-success';
  if (toast.type === 'danger') {
    icon = <AlertCircle size={18} />;
    className = 'toast-danger';
  } else if (toast.type === 'info') {
    icon = <Info size={18} />;
    className = 'toast-info';
  }

  return (
    <div className="toast-container">
      <div className={`toast ${className}`}>
        <div className="toast-icon">{icon}</div>
        <div>
          <div className="toast-title">{toast.title}</div>
          <div className="toast-message">{toast.message}</div>
        </div>
        <button className="toast-close" onClick={onClose}>
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
