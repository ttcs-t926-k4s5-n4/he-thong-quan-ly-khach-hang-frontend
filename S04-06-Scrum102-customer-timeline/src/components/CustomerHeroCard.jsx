import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  Briefcase, 
  FileText, 
  ArrowRightLeft, 
  Sparkles, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { formatVNDCompact, formatVND } from '../utils/timelineUtils';

export default function CustomerHeroCard({
  customer,
  onOpenBriefing,
  onAcceptHandover
}) {
  if (!customer) return null;

  const isPendingHandover = customer.status === 'HANDOVER_PENDING';

  return (
    <div className="customer-hero-card">
      <div className="hero-glow-bg" />

      {/* Top Profile Row */}
      <div className="hero-top-row">
        <div className="hero-left-profile">
          <img 
            src={customer.avatar} 
            alt={customer.name} 
            className="customer-avatar-large" 
          />
          <div className="customer-titles">
            <h2>
              <span>{customer.name}</span>
              <span className="tier-badge">★ {customer.tier}</span>
            </h2>
            <div className="customer-meta-row">
              <span className="customer-meta-item">
                <Building2 size={14} />
                <span>{customer.industry}</span>
              </span>
              <span className="customer-meta-item">
                <MapPin size={14} />
                <span>{customer.address}</span>
              </span>
              <span className="customer-meta-item">
                <Clock size={14} />
                <span>{customer.scale}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill & Handover Status */}
        <div className="hero-right-status">
          {isPendingHandover ? (
            <div className="handover-banner-pill" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
              <AlertCircle size={15} />
              <span>{customer.statusLabel}</span>
              <button 
                className="btn btn-primary"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', marginLeft: '0.4rem' }}
                onClick={onAcceptHandover}
              >
                Xác Nhận Tiếp Nhận
              </button>
            </div>
          ) : (
            <div className="handover-banner-pill" style={{ borderColor: '#10b981', color: '#34d399', background: 'rgba(16, 185, 129, 0.12)' }}>
              <UserCheck size={15} />
              <span>Đã tiếp nhận bàn giao thành công</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Contact Person Highlight Strip */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={customer.primaryContact.avatar} 
            alt={customer.primaryContact.name} 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {customer.primaryContact.name} 
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-tertiary)', marginLeft: '0.4rem' }}>
                ({customer.primaryContact.title})
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
              🎯 {customer.primaryContact.decisionRole}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
          <a href={`tel:${customer.primaryContact.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', textDecoration: 'none' }}>
            <Phone size={14} />
            <span>{customer.primaryContact.phone}</span>
          </a>
          <a href={`mailto:${customer.primaryContact.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', textDecoration: 'none' }}>
            <Mail size={14} />
            <span>{customer.primaryContact.email}</span>
          </a>
        </div>
      </div>

      {/* 4 KPI Metrics Strip */}
      <div className="hero-metrics-grid">
        {/* Deal Value */}
        <div className="metric-card">
          <div className="metric-icon-box amber">
            <Briefcase size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Cơ hội kinh doanh</span>
            <span className="metric-value">
              {formatVNDCompact(customer.activeOpportunity?.value)}
            </span>
            <span className="metric-sub">
              {customer.activeOpportunity?.stageLabel} ({customer.activeOpportunity?.probability}%)
            </span>
          </div>
        </div>

        {/* Latest Quote */}
        <div className="metric-card">
          <div className="metric-icon-box blue">
            <FileText size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Báo giá gần nhất</span>
            <span className="metric-value">
              {customer.latestQuote ? formatVNDCompact(customer.latestQuote.totalAmount) : 'Chưa có'}
            </span>
            <span className="metric-sub">
              {customer.latestQuote?.code} ({customer.latestQuote?.statusLabel})
            </span>
          </div>
        </div>

        {/* Handover Source */}
        <div className="metric-card">
          <div className="metric-icon-box purple">
            <ArrowRightLeft size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Đầu mối bàn giao</span>
            <span className="metric-value" style={{ fontSize: '0.85rem' }}>
              {customer.handoverInfo?.fromMemberName}
            </span>
            <span className="metric-sub">
              ➔ {customer.handoverInfo?.toMemberName} (CSKH)
            </span>
          </div>
        </div>

        {/* 5-Min Context Trigger */}
        <div 
          className="metric-card" 
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          onClick={onOpenBriefing}
        >
          <div className="metric-icon-box green">
            <Sparkles size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label" style={{ color: '#34d399' }}>Bối cảnh khách hàng</span>
            <span className="metric-value" style={{ fontSize: '0.85rem', color: '#fff' }}>
              ⚡ Nắm bắt trong 5 phút
            </span>
            <span className="metric-sub" style={{ color: '#a7f3d0' }}>
              Click mở tóm tắt điều hành ➔
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
