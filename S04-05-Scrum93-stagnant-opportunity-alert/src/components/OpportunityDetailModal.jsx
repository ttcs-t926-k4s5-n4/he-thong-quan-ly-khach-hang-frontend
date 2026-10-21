import React from 'react';
import { 
  Eye, 
  X, 
  Building2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  User, 
  FileText, 
  PhoneCall, 
  Users, 
  Mail, 
  Presentation, 
  ShieldAlert,
  Flame,
  ThermometerSnowflake,
  ShieldCheck
} from 'lucide-react';
import { formatVND, formatDateVN } from '../utils/formatters.js';

export const OpportunityDetailModal = ({
  isOpen,
  onClose,
  opportunity,
  stageThresholds,
  onOpenIntervention,
  onOpenLogActivity,
  onOpenExtendClose
}) => {
  if (!isOpen || !opportunity) return null;

  const stageInfo = stageThresholds[opportunity.stage] || {};
  const thresholdN = stageInfo.thresholdDays || 7;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Eye size={20} style={{ color: '#38bdf8' }} />
            <span>Hồ Sơ Chi Tiết Cơ Hội: {opportunity.id}</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header thông tin cơ hội */}
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span className={`badge ${stageInfo.badgeClass || 'badge-qualification'}`} style={{ marginBottom: '0.4rem' }}>
                  {stageInfo.label || opportunity.stage}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {opportunity.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>🏢 {opportunity.customerName}</span>
                  <span>•</span>
                  <span>{opportunity.industry}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá trị thương vụ</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                  {formatVND(opportunity.value)}
                </div>
              </div>
            </div>

            {/* Cảnh báo lý do gắn cờ */}
            {opportunity.hasFlag && (
              <div style={{ marginTop: '1rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>
                  <AlertTriangle size={16} />
                  <span>Cảnh Báo Rủi Ro Đình Trệ ({opportunity.severityLabel}):</span>
                </div>
                <ul style={{ margin: '0.4rem 0 0 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {opportunity.flagReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                  💡 Khuyến nghị cho Trưởng nhóm: {opportunity.recommendedAction}
                </div>
              </div>
            )}
          </div>

          {/* Grid thông tin phân tích */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nhân viên phụ trách:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <img src={opportunity.salesRepAvatar} alt={opportunity.salesRepName} className="rep-avatar" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{opportunity.salesRepName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{opportunity.teamId}</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hoạt động cuối (AC1):</span>
              <div style={{ marginTop: '0.25rem', fontWeight: 700, fontSize: '0.85rem', color: opportunity.isInactivityBreached ? '#ef4444' : '#10b981' }}>
                📅 {formatDateVN(opportunity.lastActivityDate)} ({opportunity.daysSinceLastActivity} ngày trước)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Ngưỡng N giai đoạn: {thresholdN} ngày
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dự kiến chốt hợp đồng (AC2):</span>
              <div style={{ marginTop: '0.25rem', fontWeight: 700, fontSize: '0.85rem', color: opportunity.isCloseDateOverdue ? '#ec4899' : '#10b981' }}>
                🎯 {formatDateVN(opportunity.expectedCloseDate)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {opportunity.isCloseDateOverdue ? `Đã quá hạn ${opportunity.daysOverdue} ngày` : 'Trong kế hoạch'}
              </div>
            </div>
          </div>

          {/* Dòng thời gian lịch sử hoạt động */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} />
              <span>Dòng Thời Gian Tương Tác Bán Hàng ({opportunity.activities?.length || 0}):</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
              {opportunity.activities && opportunity.activities.length > 0 ? (
                opportunity.activities.map((act, i) => (
                  <div key={i} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <strong>{act.type} • {act.author}</strong>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{formatDateVN(act.date)}</span>
                    </div>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{act.content}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chưa có hoạt động tương tác nào được ghi nhận.</div>
              )}
            </div>
          </div>

          {/* Lịch sử can thiệp của Trưởng nhóm */}
          {opportunity.interventions && opportunity.interventions.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
                <ShieldCheck size={16} />
                <span>Nhật Ký Can Thiệp Của Trưởng Nhóm ({opportunity.interventions.length}):</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {opportunity.interventions.map((itv, i) => (
                  <div key={i} style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                      <span>{itv.title}</span>
                      <span>{itv.date}</span>
                    </div>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{itv.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-warning btn-sm"
              onClick={() => { onClose(); onOpenIntervention(opportunity); }}
            >
              <ShieldAlert size={14} />
              <span>Can Thiệp Sớm</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => { onClose(); onOpenLogActivity(opportunity); }}
            >
              <PhoneCall size={14} />
              <span>Ghi Hoạt Động</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => { onClose(); onOpenExtendClose(opportunity); }}
            >
              <Calendar size={14} />
              <span>Gia Hạn Ngày Chốt</span>
            </button>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
