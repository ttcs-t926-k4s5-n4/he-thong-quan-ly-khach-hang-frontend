import React from 'react';
import { AlertTriangle, GitMerge, ArrowRight, ShieldAlert, Users } from 'lucide-react';

export function DuplicateAlertBanner({ duplicatePairs, onQuickMerge, currentUser }) {
  if (!duplicatePairs || duplicatePairs.length === 0) {
    return null;
  }

  // Lấy cặp trùng lặp có điểm cao nhất
  const topPair = duplicatePairs[0];
  const { customerA, customerB, report } = topPair;

  return (
    <div className="alert-banner">
      <div className="alert-banner-left">
        <div className="alert-icon-pulse">
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="alert-title">
            ⚠️ Cảnh báo xung đột: Phát hiện {duplicatePairs.length} cặp khách hàng trùng lặp đang bị hai nhân viên cùng chào hàng!
          </div>
          <div className="alert-desc">
            Ví dụ điển hình: <strong>{customerA.name}</strong> (do bạn <em>{customerA.ownerName}</em> phụ trách) và{' '}
            <strong>{customerB.name}</strong> (do bạn <em>{customerB.ownerName}</em> phụ trách).
            <span style={{ display: 'block', marginTop: '0.2rem', color: '#fca5a5' }}>
              • Lý do: {report.reasons.join(' | ')}
            </span>
          </div>
        </div>
      </div>

      <div className="alert-actions">
        <button
          className="btn-pill btn-primary"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}
          onClick={() => onQuickMerge(customerA, customerB, report)}
        >
          <GitMerge size={16} />
          <span>So sánh cạnh nhau & Gộp</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
