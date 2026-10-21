import React, { useState } from 'react';
import { Clock, RefreshCw, CheckCircle, AlertTriangle, Calendar, FileText, X, Check, Bell } from 'lucide-react';
import { DEFAULT_JOB_CONFIG } from '../data/mockEvaluationJob.js';

export const DailyEvaluationJobModal = ({
  isOpen,
  onClose,
  jobHistory,
  onTriggerDailyEvaluation,
  isEvaluating,
  metrics
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Clock size={20} style={{ color: '#f59e0b' }} />
            <span>Tác Vụ Đánh Giá Cơ Hội Đình Trệ Chạy Mỗi Ngày Một Lần (AC4)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Thông tin cấu hình tác vụ */}
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {DEFAULT_JOB_CONFIG.jobName}
                  </span>
                  <span className="badge badge-safe">
                    <CheckCircle size={12} /> Đang chạy định kỳ
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {DEFAULT_JOB_CONFIG.scheduleDescription}
                </p>
              </div>

              <button 
                className="btn btn-primary"
                onClick={onTriggerDailyEvaluation}
                disabled={isEvaluating}
                title="Kích hoạt chạy ngay lập tức tác vụ đánh giá hàng ngày"
              >
                <RefreshCw size={15} className={isEvaluating ? 'spin' : ''} />
                <span>{isEvaluating ? 'Đang thực hiện quét...' : '⚡ Chạy Đánh Giá Thủ Công Ngay'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mã Cron Biểu Thức:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>
                  {DEFAULT_JOB_CONFIG.cronSchedule} (06:00:00 AM)
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cơ Hội Quét Được:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {metrics.totalDeals} deal
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Đang Có Cờ Cảnh Báo:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>
                  {metrics.flaggedDealsCount} deal
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kênh Gửi Báo Cáo:</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Email Digest, Slack, In-App
                </div>
              </div>
            </div>
          </div>

          {/* Bảng nhật ký lịch sử các lần chạy quét hàng ngày (Execution Log) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} />
                <span>Nhật Ký Các Lần Chạy Quét Đánh Giá (Daily Execution History):</span>
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Lưu trữ lịch sử 30 ngày gần nhất
              </span>
            </div>

            <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <table className="data-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Thời Điểm Chạy</th>
                    <th>Hình Thức Kích Hoạt</th>
                    <th>Thời Lượng</th>
                    <th>Đã Quét</th>
                    <th>Có Cờ</th>
                    <th>Biến Động</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistory.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                        {log.executionTime}
                      </td>
                      <td>
                        <span style={{ color: log.triggerType === 'MANUAL' ? '#38bdf8' : 'var(--text-secondary)' }}>
                          {log.triggeredBy}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {log.durationMs} ms
                      </td>
                      <td>
                        <strong>{log.scannedCount}</strong> deal
                      </td>
                      <td style={{ color: log.flaggedCount > 0 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                        {log.flaggedCount} deal
                      </td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {log.newlyFlagged > 0 && <span style={{ color: '#ef4444' }}>+{log.newlyFlagged} mới </span>}
                        {log.unflagged > 0 && <span style={{ color: '#10b981' }}>-{log.unflagged} gỡ cờ</span>}
                        {log.newlyFlagged === 0 && log.unflagged === 0 && <span style={{ color: 'var(--text-muted)' }}>Ổn định</span>}
                      </td>
                      <td>
                        <span className="badge badge-safe" style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}>
                          ✓ {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
