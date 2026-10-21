import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Package, 
  Repeat, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { formatVND, formatPercent, calculateMargin } from '../utils/formatters';

export default function AnalyticsDashboard({ products, quotes, currentRole }) {
  const oneTimeProducts = products.filter(p => p.type === 'one_time');
  const subscriptionProducts = products.filter(p => p.type === 'subscription');

  const approvedQuotes = quotes.filter(q => q.status === 'approved');
  const pendingQuotes = quotes.filter(q => q.status === 'pending_approval');
  const rejectedQuotes = quotes.filter(q => q.status === 'rejected');

  // Count which products appear most in quotes
  const productFrequency = {};
  quotes.forEach(q => {
    q.items.forEach(it => {
      productFrequency[it.productId] = (productFrequency[it.productId] || 0) + 1;
    });
  });

  const sortedTopProducts = [...products]
    .map(p => ({ ...p, quoteCount: productFrequency[p.id] || 0 }))
    .sort((a, b) => b.quoteCount - a.quoteCount);

  return (
    <div className="catalog-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Card 1: Product Structure */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-header">
            <span className="stat-title">Cơ Cấu Danh Mục Sản Phẩm</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Package size={14} color="#38bdf8" />
                  <span>Sản phẩm một lần ({oneTimeProducts.length})</span>
                </span>
                <span style={{ fontWeight: 700 }}>
                  {formatPercent((oneTimeProducts.length / (products.length || 1)) * 100)}
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#38bdf8', width: `${(oneTimeProducts.length / (products.length || 1)) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Repeat size={14} color="#c084fc" />
                  <span>Dịch vụ thuê bao ({subscriptionProducts.length})</span>
                </span>
                <span style={{ fontWeight: 700 }}>
                  {formatPercent((subscriptionProducts.length / (products.length || 1)) * 100)}
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#c084fc', width: `${(subscriptionProducts.length / (products.length || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="stat-footer" style={{ marginTop: '1.25rem' }}>
            <span>Định hướng đẩy mạnh tỷ trọng Dịch vụ thuê bao để tạo dòng tiền MRR bền vững.</span>
          </div>
        </div>

        {/* Card 2: Quote Approval Compliance */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-header">
            <span className="stat-title">Tuân Thủ Ngưỡng Giá Sàn Báo Giá</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span style={{ fontSize: '0.85rem' }}>Báo giá tự duyệt (&ge; Giá sàn)</span>
              </div>
              <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{approvedQuotes.length}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#f59e0b" />
                <span style={{ fontSize: '0.85rem' }}>Báo giá cần GĐ duyệt (&lt; Giá sàn)</span>
              </div>
              <strong style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{pendingQuotes.length}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#ef4444" />
                <span style={{ fontSize: '0.85rem' }}>Bị Giám đốc từ chối chiết khấu</span>
              </div>
              <strong style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{rejectedQuotes.length}</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Top Referenced Products */}
        <div className="stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-header">
            <span className="stat-title">Sản Phẩm Đang Báo Giá Nhiều Nhất</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
            {sortedTopProducts.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <div>
                  <span className="sku-badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', marginRight: '0.35rem' }}>{p.code}</span>
                  <span>{p.name.length > 25 ? `${p.name.substring(0, 25)}...` : p.name}</span>
                </div>
                <span className="quote-ref-badge has-quotes" style={{ fontSize: '0.7rem' }}>
                  {p.quoteCount} báo giá
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
