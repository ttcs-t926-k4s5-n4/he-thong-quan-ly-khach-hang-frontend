import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  Repeat, 
  Edit3, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Lock, 
  Unlock, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpDown,
  Plus
} from 'lucide-react';
import { formatVND, calculateMargin, formatPercent } from '../utils/formatters';

export default function ProductCatalog({ 
  products, 
  quotes, 
  currentRole, 
  onEditProduct, 
  onDeleteAttempt, 
  onToggleStatus,
  onOpenProductModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | one_time | subscription
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | discontinued
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('code'); // code | name | listedPrice | margin
  const [sortOrder, setSortOrder] = useState('asc'); // asc | desc

  // Map product references in quotes
  const productQuoteCounts = useMemo(() => {
    const counts = {};
    quotes.forEach(q => {
      q.items.forEach(item => {
        counts[item.productId] = (counts[item.productId] || 0) + 1;
      });
    });
    return counts;
  }, [quotes]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      const matchesSearch = 
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Type filter
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'margin') {
        valA = a.listedPrice > 0 ? calculateMargin(a.listedPrice, a.costPrice) : 0;
        valB = b.listedPrice > 0 ? calculateMargin(b.listedPrice, b.costPrice) : 0;
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [products, searchTerm, typeFilter, statusFilter, categoryFilter, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="catalog-section">
      {/* Toolbar: Search, Filters, Add Button */}
      <div className="toolbar-card">
        <div className="search-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã SKU, tên sản phẩm, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Type Filter */}
          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">📦 Tất cả loại SP/DV</option>
            <option value="one_time">📦 Sản phẩm một lần</option>
            <option value="subscription">🔄 Dịch vụ thuê bao</option>
          </select>

          {/* Status Filter */}
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">⚡ Tất cả trạng thái</option>
            <option value="active">🟢 Đang kinh doanh</option>
            <option value="discontinued">⚪ Ngừng kinh doanh</option>
          </select>

          {/* Category Filter */}
          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">📁 Tất cả ngành hàng</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onOpenProductModal}
          >
            <Plus size={16} />
            <span>Thêm Sản Phẩm</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('code')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Mã SP / SKU</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Tên Sản Phẩm & Dịch Vụ</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th>Phân Loại</th>
                <th>Đơn Vị</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('listedPrice')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Giá Niêm Yết Chuẩn</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('floorPrice')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Giá Sàn (Ngưỡng Duyệt)</span>
                    <ArrowUpDown size={13} />
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Giá Vốn (COGS)</span>
                    {currentRole === 'director' ? <Unlock size={14} color="#10b981" /> : <Lock size={14} color="#f87171" />}
                  </div>
                </th>
                <th>Báo Giá Đã Dùng</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy sản phẩm nào phù hợp với điều kiện tìm kiếm & bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const quoteCount = productQuoteCounts[product.id] || 0;
                  const isDiscontinued = product.status === 'discontinued';
                  const marginListed = product.listedPrice > 0 ? calculateMargin(product.listedPrice, product.costPrice) : 0;
                  
                  return (
                    <tr key={product.id} className={isDiscontinued ? 'row-discontinued' : ''}>
                      {/* Code */}
                      <td>
                        <span className="sku-badge">{product.code}</span>
                      </td>

                      {/* Name & Desc */}
                      <td>
                        <div className="product-name-cell">
                          <span className="product-name">{product.name}</span>
                          <span className="product-desc">{product.description || 'Chưa có mô tả'}</span>
                        </div>
                      </td>

                      {/* Type: One-time vs Subscription */}
                      <td>
                        {product.type === 'one_time' ? (
                          <span className="type-badge one-time">
                            <Package size={13} />
                            <span>SP một lần</span>
                          </span>
                        ) : (
                          <span className="type-badge subscription">
                            <Repeat size={13} />
                            <span>Thuê bao ({product.billingCycle === 'year' ? 'Năm' : 'Tháng'})</span>
                          </span>
                        )}
                      </td>

                      {/* Unit */}
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {product.unit}
                        </span>
                      </td>

                      {/* Listed Price */}
                      <td>
                        <div className="price-display price-listed">
                          {formatVND(product.listedPrice)}
                        </div>
                      </td>

                      {/* Floor Price */}
                      <td>
                        <div className="price-display price-floor">
                          <span>{formatVND(product.floorPrice)}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Chiết khấu tối đa: {formatPercent(((product.listedPrice - product.floorPrice) / product.listedPrice) * 100)}
                        </div>
                      </td>

                      {/* Cost Price - ROLE DEPENDENT */}
                      <td>
                        {currentRole === 'director' ? (
                          <div>
                            <div className="price-display price-cost">
                              {formatVND(product.costPrice)}
                            </div>
                            <span className={`margin-pill ${marginListed >= 40 ? 'high' : marginListed >= 20 ? 'medium' : 'low'}`}>
                              Biên LN: {formatPercent(marginListed)}
                            </span>
                          </div>
                        ) : (
                          <span className="price-masked" title="Giá vốn được bảo mật, chỉ Giám đốc kinh doanh có quyền xem">
                            <Lock size={12} color="#f87171" />
                            <span>•••••• ₫</span>
                          </span>
                        )}
                      </td>

                      {/* Quoted Count */}
                      <td>
                        <span 
                          className={`quote-ref-badge ${quoteCount > 0 ? 'has-quotes' : 'zero'}`}
                          title={quoteCount > 0 ? `Sản phẩm đã xuất hiện trong ${quoteCount} báo giá -> KHÔNG THỂ XOÁ!` : 'Chưa có trong báo giá nào -> Có thể xoá'}
                        >
                          <FileText size={12} />
                          <span>{quoteCount} báo giá</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-badge ${product.status}`}>
                          {product.status === 'active' ? (
                            <>
                              <CheckCircle size={12} />
                              <span>Đang kinh doanh</span>
                            </>
                          ) : (
                            <>
                              <Ban size={12} />
                              <span>Ngừng KD</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          {/* Toggle Active / Discontinued */}
                          <button
                            type="button"
                            className="icon-btn"
                            title={product.status === 'active' ? 'Chuyển sang Ngừng kinh doanh' : 'Kích hoạt lại Kinh doanh'}
                            onClick={() => onToggleStatus(product.id)}
                          >
                            {product.status === 'active' ? <Ban size={15} color="#f59e0b" /> : <CheckCircle size={15} color="#10b981" />}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            className="icon-btn"
                            title="Chỉnh sửa sản phẩm"
                            onClick={() => onEditProduct(product)}
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Delete (Triggers integrity constraint check) */}
                          <button
                            type="button"
                            className="icon-btn btn-danger"
                            title={quoteCount > 0 ? "Sản phẩm đã có báo giá: Bấm để xem cảnh báo ràng buộc SCRUM-63" : "Xoá sản phẩm"}
                            onClick={() => onDeleteAttempt(product)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
