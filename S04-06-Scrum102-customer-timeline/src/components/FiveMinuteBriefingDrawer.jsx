import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Send,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { formatVND, formatVNDCompact } from '../utils/timelineUtils';

export default function FiveMinuteBriefingDrawer({
  isOpen,
  onClose,
  customer,
  onAcceptHandover
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes = 300 seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(300);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  if (!isOpen || !customer) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const briefing = customer.fiveMinuteBriefing || {};

  const handleCopySummary = () => {
    const text = `TÓM TẮT BỐI CẢNH 5 PHÚT - KHÁCH HÀNG: ${customer.name}\n` +
      `Người liên hệ: ${customer.primaryContact?.name} (${customer.primaryContact?.phone})\n` +
      `Thương vụ: ${customer.activeOpportunity?.name} - ${formatVND(customer.activeOpportunity?.value)}\n` +
      `Báo giá gần nhất: ${customer.latestQuote?.code} - ${formatVND(customer.latestQuote?.totalAmount)}\n` +
      `Tóm tắt: ${briefing.summary}\n` +
      `Lưu ý: ${briefing.sensitiveNotes}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-icon-box">
              <Sparkles size={24} />
            </div>
            <div>
              <h2>Báo Cáo Tóm Tắt Bối Cảnh Trong 5 Phút</h2>
              <p>Hồ sơ bàn giao & tiếp nhận khách hàng cho Chăm sóc khách hàng</p>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            title="Đóng bản tin"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="drawer-body">
          {/* 5-Minute Timer Widget */}
          <div className="briefing-timer-widget">
            <div className="timer-text">
              <Clock size={18} />
              <span>Thời gian nắm bắt tiêu chuẩn: <strong>5 Phút</strong> (Đọc hiểu trung bình: ~2 phút)</span>
            </div>
            <div className="timer-countdown" title="Thời gian còn lại trong phiên nắm bắt bối cảnh">
              ⏱️ {timeFormatted}
            </div>
          </div>

          {/* Executive Overview */}
          <div className="briefing-section">
            <div className="briefing-section-title">
              <Briefcase size={16} />
              <span>1. Tổng quan thương vụ & Tình trạng bàn giao</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
              {briefing.summary}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.65rem',
              background: 'var(--bg-surface)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Người bàn giao:</span>
                <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                  {customer.handoverInfo?.fromMemberName} ({customer.handoverInfo?.fromMemberRole})
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Giai đoạn hiện tại:</span>
                <div style={{ fontWeight: 700, color: '#fbbf24' }}>
                  {customer.activeOpportunity?.stageLabel} ({formatVNDCompact(customer.activeOpportunity?.value)})
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Báo giá mới nhất:</span>
                <div style={{ fontWeight: 700, color: '#f472b6' }}>
                  {customer.latestQuote?.code} ({formatVNDCompact(customer.latestQuote?.totalAmount)})
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Mục tiêu CSKH:</span>
                <div style={{ fontWeight: 700, color: '#34d399' }}>
                  Tiếp quản, chốt ký kết & Onboarding
                </div>
              </div>
            </div>
          </div>

          {/* Decision Maker Profile */}
          <div className="briefing-section">
            <div className="briefing-section-title">
              <UserCheck size={16} />
              <span>2. Chân dung người quyết định chính (Key Decision Maker)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
              <img 
                src={customer.primaryContact?.avatar} 
                alt={customer.primaryContact?.name} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8b5cf6' }}
              />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {customer.primaryContact?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {customer.primaryContact?.title} • {customer.primaryContact?.phone}
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              fontSize: '0.825rem',
              color: '#c7d2fe',
              lineHeight: 1.5
            }}>
              💡 <strong>Đặc điểm tính cách & Phong cách làm việc:</strong><br/>
              {customer.primaryContact?.personality}
            </div>
          </div>

          {/* 3 Key Takeaways from Previous Colleague */}
          <div className="briefing-section">
            <div className="briefing-section-title">
              <Lightbulb size={16} />
              <span>3. Ba điểm mấu chốt dặn dò từ đồng nghiệp cũ</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {briefing.keyTakeaways?.map((item, idx) => (
                <div key={idx} className="key-takeaway-item">
                  <span className="takeaway-bullet" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sensitive Notes */}
          <div className="sensitive-alert-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <AlertTriangle size={16} />
              <span>LƯU Ý NHẠY CẢM CẦN TRÁNH KHI GIAO TIẾP</span>
            </div>
            {briefing.sensitiveNotes}
          </div>

          {/* Next 24-Hour Actions Checklist */}
          <div className="briefing-section">
            <div className="briefing-section-title">
              <CheckCircle2 size={16} />
              <span>4. Kế hoạch hành động 24h đầu tiên của CSKH</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {briefing.nextActions?.map((act, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  borderLeft: act.priority === 'CRITICAL' ? '3px solid #f43f5e' : '3px solid #f59e0b'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.task}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      Hạn chót: {act.deadline} • Người thực hiện: {act.owner}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    background: act.priority === 'CRITICAL' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: act.priority === 'CRITICAL' ? '#f43f5e' : '#f59e0b'
                  }}>
                    {act.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button 
            className="btn btn-secondary"
            onClick={handleCopySummary}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Tóm Tắt'}</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => {
              onAcceptHandover();
              onClose();
            }}
          >
            <UserCheck size={16} />
            <span>Xác Nhận Đã Nắm Rõ & Tiếp Nhận Khách</span>
          </button>
        </div>
      </div>
    </div>
  );
}
