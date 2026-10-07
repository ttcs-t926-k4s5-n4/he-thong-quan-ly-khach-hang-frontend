import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SecurityBanner from './components/SecurityBanner';
import StatsCards from './components/StatsCards';
import ProductCatalog from './components/ProductCatalog';
import ProductModal from './components/ProductModal';
import QuoteSimulator from './components/QuoteSimulator';
import QuoteApprovalList from './components/QuoteApprovalList';
import DeleteConstraintModal from './components/DeleteConstraintModal';
import DirectorGuideModal from './components/DirectorGuideModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { INITIAL_PRODUCTS, INITIAL_QUOTES } from './data/mockData';
import { 
  Package, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scrum63_theme') || 'dark';
  });

  // Current Role: 'director' (Giám đốc kinh doanh) | 'sales_rep' (Nhân viên kinh doanh)
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('scrum63_role') || 'director';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'create_quote' | 'quotes_list' | 'analytics'

  // Products state
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('scrum63_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Quotes state
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('scrum63_quotes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_QUOTES;
  });

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteAttemptProduct, setDeleteAttemptProduct] = useState(null);
  const [referencingQuotes, setReferencingQuotes] = useState([]);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Sync theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrum63_theme', theme);
  }, [theme]);

  // Persist role
  useEffect(() => {
    localStorage.setItem('scrum63_role', currentRole);
  }, [currentRole]);

  // Persist products
  useEffect(() => {
    localStorage.setItem('scrum63_products', JSON.stringify(products));
  }, [products]);

  // Persist quotes
  useEffect(() => {
    localStorage.setItem('scrum63_quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Handle Save Product (Create or Edit)
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      const newProduct = {
        ...productData,
        id: `PRD-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setEditingProduct(null);
  };

  // Handle Delete Attempt - THE CORE BUSINESS RULE OF SCRUM-63
  const handleDeleteAttempt = (product) => {
    // Find all quotes referencing this product
    const matchingQuotes = quotes.filter(q => 
      q.items.some(item => item.productId === product.id)
    );

    if (matchingQuotes.length > 0) {
      // RULE VIOLATION: Product is in quotes -> BLOCK DELETE and open Constraint Modal
      setDeleteAttemptProduct(product);
      setReferencingQuotes(matchingQuotes);
    } else {
      // OK TO DELETE: Product has never been quoted
      const confirmDelete = window.confirm(
        `Xác nhận xoá sản phẩm "${product.code} - ${product.name}"?\n(Sản phẩm này chưa từng xuất hiện trong báo giá nào nên được phép xoá).`
      );
      if (confirmDelete) {
        setProducts(prev => prev.filter(p => p.id !== product.id));
      }
    }
  };

  // Switch product to Discontinued
  const handleDiscontinue = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'discontinued' };
      }
      return p;
    }));
  };

  // Toggle active / discontinued status
  const handleToggleStatus = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          status: p.status === 'active' ? 'discontinued' : 'active'
        };
      }
      return p;
    }));
  };

  // Create new quote
  const handleCreateQuote = (newQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
  };

  // Director approve quote
  const handleApproveQuote = (quoteId, comment) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'approved',
          approvalHistory: [
            ...(q.approvalHistory || []),
            {
              date: new Date().toLocaleString('vi-VN'),
              action: 'Giám đốc kinh doanh phê duyệt chiết khấu',
              by: 'Lê Quốc Hùng (Giám đốc kinh doanh)',
              comment: comment || 'Đã đồng ý cho áp dụng đơn giá dưới giá sàn.'
            }
          ]
        };
      }
      return q;
    }));
  };

  // Director reject quote
  const handleRejectQuote = (quoteId, comment) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'rejected',
          approvalHistory: [
            ...(q.approvalHistory || []),
            {
              date: new Date().toLocaleString('vi-VN'),
              action: 'Giám đốc kinh doanh từ chối chiết khấu',
              by: 'Lê Quốc Hùng (Giám đốc kinh doanh)',
              comment: comment || 'Không chấp thuận mức giá dưới giá sàn.'
            }
          ]
        };
      }
      return q;
    }));
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Khôi phục dữ liệu mẫu ban đầu của SCRUM-63?')) {
      setProducts(INITIAL_PRODUCTS);
      setQuotes(INITIAL_QUOTES);
      localStorage.removeItem('scrum63_products');
      localStorage.removeItem('scrum63_quotes');
    }
  };

  const pendingQuoteCount = quotes.filter(q => q.status === 'pending_approval').length;

  return (
    <div className="app-container">
      <div className="ambient-glow"></div>

      {/* Header with Role Switcher */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenProductModal={() => {
          setEditingProduct(null);
          setIsProductModalOpen(true);
        }}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* Dynamic Security Notice Banner */}
      <SecurityBanner currentRole={currentRole} />

      {/* Key Metric Stats Cards */}
      <StatsCards 
        products={products}
        quotes={quotes}
        currentRole={currentRole}
      />

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <Package size={17} />
          <span>Danh Mục SP & Bảng Giá Chuẩn</span>
          <span className="tab-badge">{products.length}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'create_quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('create_quote')}
        >
          <FileText size={17} />
          <span>Lập Báo Giá Chuẩn</span>
          <span className="tab-badge" style={{ color: '#10b981' }}>Trình tạo</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'quotes_list' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotes_list')}
        >
          <ClipboardCheck size={17} />
          <span>Danh Sách Báo Giá & Phê Duyệt</span>
          {pendingQuoteCount > 0 ? (
            <span className="tab-badge" style={{ background: 'var(--amber-bg)', color: '#fbbf24', fontWeight: 700 }}>
              {pendingQuoteCount} cần duyệt
            </span>
          ) : (
            <span className="tab-badge">{quotes.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={17} />
          <span>Báo Cáo & Phân Tích</span>
        </button>

        <button
          type="button"
          className="tab-btn"
          style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.8rem' }}
          onClick={handleResetData}
          title="Khôi phục lại bộ dữ liệu kiểm thử gốc"
        >
          <RotateCcw size={14} />
          <span>Đặt Lại Dữ Liệu Mẫu</span>
        </button>
      </nav>

      {/* Main Content Area based on Tab */}
      <main>
        {activeTab === 'catalog' && (
          <ProductCatalog
            products={products}
            quotes={quotes}
            currentRole={currentRole}
            onEditProduct={(prod) => {
              setEditingProduct(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteAttempt={handleDeleteAttempt}
            onToggleStatus={handleToggleStatus}
            onOpenProductModal={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
          />
        )}

        {activeTab === 'create_quote' && (
          <QuoteSimulator
            products={products}
            currentRole={currentRole}
            onCreateQuote={handleCreateQuote}
            onSuccessSwitchTab={() => setActiveTab('quotes_list')}
          />
        )}

        {activeTab === 'quotes_list' && (
          <QuoteApprovalList
            quotes={quotes}
            currentRole={currentRole}
            onApproveQuote={handleApproveQuote}
            onRejectQuote={handleRejectQuote}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            products={products}
            quotes={quotes}
            currentRole={currentRole}
          />
        )}
      </main>

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        currentRole={currentRole}
        existingProducts={products}
      />

      {/* Constraint Modal: Prohibits deletion of products used in quotes */}
      {deleteAttemptProduct && (
        <DeleteConstraintModal
          product={deleteAttemptProduct}
          referencingQuotes={referencingQuotes}
          onClose={() => {
            setDeleteAttemptProduct(null);
            setReferencingQuotes([]);
          }}
          onDiscontinue={handleDiscontinue}
        />
      )}

      {/* Guide Modal: Maps SCRUM-63 acceptance criteria */}
      <DirectorGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
