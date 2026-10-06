import React from 'react';
import { 
  Package, 
  Repeat, 
  AlertTriangle, 
  TrendingUp, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { formatVND, formatPercent } from '../utils/formatters';

export default function StatsCards({ products, quotes, currentRole }) {
  // Count active vs discontinued
  const activeProducts = products.filter(p => p.status === 'active');
  const discontinuedProducts = products.filter(p => p.status === 'discontinued');
  
  // Count subscription vs one-time
  const subscriptionServices = products.filter(p => p.type === 'subscription' && p.status === 'active');
  
  // Count quotes pending discount approval
  const pendingQuotes = quotes.filter(q => q.status === 'pending_approval');
  
  // Calculate average margin for Director
  let avgMargin = 0;
  if (currentRole === 'director' && activeProducts.length > 0) {
    const totalMargin = activeProducts.reduce((acc, p) => {
      const margin = p.listedPrice > 0 ? ((p.listedPrice - p.costPrice) / p.listedPrice) * 100 : 0;
      return acc + margin;
    }, 0);
    avgMargin = totalMargin / activeProducts.length;
  }

  return (
    <div className="stats-grid">
      {/* Stat 1: Total Catalog Items */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Danh mục SP / Dịch vụ</span>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Package size={20} />
          </div>
        </div>
        <div className="stat-value">{activeProducts.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {products.length}</span></div>
        <div className="stat-footer">
          <CheckCircle2 size={14} color="#10b981" />
          <span>{activeProducts.length} đang kinh doanh • {discontinuedProducts.length} ngừng kinh doanh</span>
        </div>
      </div>

      {/* Stat 2: Recurring Subscriptions */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Dịch vụ Thuê bao (SaaS)</span>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a855f7' }}>
            <Repeat size={20} />
          </div>
        </div>
        <div className="stat-value">{subscriptionServices.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>gói thuê bao</span></div>
        <div className="stat-footer">
          <span>Doanh thu định kỳ (MRR/ARR) ổn định</span>
        </div>
      </div>

      {/* Stat 3: Floor Price Violations (Pending Approval) */}
      <div className="stat-card" style={{ borderColor: pendingQuotes.length > 0 ? 'var(--amber-border)' : 'var(--border-subtle)' }}>
        <div className="stat-header">
          <span className="stat-title">Báo giá Dưới Giá Sàn</span>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="stat-value" style={{ color: pendingQuotes.length > 0 ? '#f59e0b' : 'inherit' }}>
          {pendingQuotes.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>cần duyệt</span>
        </div>
        <div className="stat-footer">
          <span>{pendingQuotes.length > 0 ? '⚠️ Cần Giám đốc duyệt ngoại lệ' : 'Tất cả báo giá đều trong khung sàn'}</span>
        </div>
      </div>

      {/* Stat 4: Margin (Director Only vs Hidden for Sales Rep) */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Biên Lợi Nhuận TB (GĐKD)</span>
          <div className="stat-icon" style={{ background: currentRole === 'director' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: currentRole === 'director' ? '#10b981' : '#f87171' }}>
            {currentRole === 'director' ? <TrendingUp size={20} /> : <Lock size={20} />}
          </div>
        </div>
        <div className="stat-value">
          {currentRole === 'director' ? (
            <span style={{ color: '#10b981' }}>{formatPercent(avgMargin)}</span>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', letterSpacing: '0.15em' }}>••••••</span>
          )}
        </div>
        <div className="stat-footer">
          {currentRole === 'director' ? (
            <span>Tính dựa trên Giá vốn & Giá niêm yết chuẩn</span>
          ) : (
            <span className="stat-badge-secure">
              <Lock size={12} /> Dữ liệu bảo mật cấp Giám Đốc
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
