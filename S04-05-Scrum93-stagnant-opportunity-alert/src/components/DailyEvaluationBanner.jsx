import React from 'react';
import { Clock, RefreshCw, CheckCircle, AlertTriangle, History, Calendar, Sparkles } from 'lucide-react';

export const DailyEvaluationBanner = ({
  lastRunInfo,
  onTriggerDailyEvaluation,
  onOpenJobModal,
  isEvaluating,
  metrics
}) => {
  return (
    <div className="daily-job-banner">
      <div className="banner-left">
        <div className="banner-icon-box">
          <Clock size={24} />
        </div>
        <div className="banner-content">
          <h3>
            <span>Tác Vụ Đánh Giá Đình Trệ Tự Động: Chạy Mỗi Ngày Một Lần (AC4)</span>
            <span className="badge badge-safe">
              <CheckCircle size={12} />
              Đang hoạt động (06:00 AM)
            </span>
          </h3>
          <div className="banner-meta">
            <div className="banner-meta-item">
              <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
              <span>Lần chạy gần nhất: <strong>{lastRunInfo.executionTime || '18/10/2026 06:00:00'}</strong></span>
            </div>
            <div className="banner-meta-item">
              <CheckCircle size={13} style={{ color: '#10b981' }} />
              <span>Đã quét: <strong>{metrics.totalDeals} cơ hội</strong></span>
            </div>
            <div className="banner-meta-item">
              <AlertTriangle size={13} style={{ color: '#f59e0b' }} />
              <span>Phát hiện cờ đình trệ: <strong>{metrics.flaggedDealsCount} thương vụ</strong></span>
            </div>
            <div className="banner-meta-item">
              <Clock size={13} style={{ color: 'var(--text-muted)' }} />
              <span>Lần quét tự động tiếp theo: <strong>19/10/2026 06:00:00</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="banner-right">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenJobModal}
          title="Xem bảng nhật ký lịch sử các lần chạy đánh giá hàng ngày"
        >
          <History size={14} />
          <span>Nhật Ký Chạy</span>
        </button>

        <button 
          className="btn btn-primary btn-sm"
          onClick={onTriggerDailyEvaluation}
          disabled={isEvaluating}
          title="Kích hoạt quét và đánh giá lại toàn bộ cơ hội ngay lập tức"
        >
          <RefreshCw size={14} className={isEvaluating ? 'spin' : ''} />
          <span>{isEvaluating ? 'Đang phân tích...' : '⚡ Quét Đánh Giá Ngay'}</span>
        </button>
      </div>
    </div>
  );
};
