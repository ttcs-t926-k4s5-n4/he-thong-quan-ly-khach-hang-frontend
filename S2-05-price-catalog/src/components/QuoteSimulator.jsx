import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Building, 
  User, 
  ShieldAlert, 
  Sparkles, 
  Send,
  HelpCircle,
  Clock
} from 'lucide-react';
import { formatVND, formatPercent, calculateDiscount } from '../utils/formatters';
import { SAMPLE_CUSTOMERS } from '../data/mockData';

export default function QuoteSimulator({ 
  products, 
  currentRole, 
  onCreateQuote, 
  onSuccessSwitchTab 
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUST-01');
  const [customerName, setCustomerName] = useState('Tập đoàn Công nghệ Viễn thông Phương Nam');
  const [contactPerson, setContactPerson] = useState('Ông Trần Văn Nam');
  const [salesRepName, setSalesRepName] = useState(currentRole === 'director' ? 'Lê Quốc Hùng (Giám đốc kinh doanh)' : 'Trần Minh Quân (Chuyên viên kinh doanh)');
  const [note, setNote] = useState('');
  
  // Selected line items
  const [quoteItems, setQuoteItems] = useState([
    {
      productId: 'PRD-001',
      quantity: 1,
      offeredPrice: 135000000,
      breachReason: ''
    }
  ]);

  // Only products that are "active" can be added to new quotes!
  const activeProducts = products.filter(p => p.status === 'active');

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    const found = SAMPLE_CUSTOMERS.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setContactPerson(found.contact);
    }
  };

  const addItem = () => {
    if (activeProducts.length === 0) return;
    const defaultProduct = activeProducts[0];
    setQuoteItems(prev => [
      ...prev,
      {
        productId: defaultProduct.id,
        quantity: 1,
        offeredPrice: defaultProduct.listedPrice,
        breachReason: ''
      }
    ]);
  };

  const removeItem = (index) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setQuoteItems(prev => prev.map((item, i) => {
      if (i !== index) return item;
      
      if (field === 'productId') {
        const prod = products.find(p => p.id === value);
        return {
          ...item,
          productId: value,
          offeredPrice: prod ? prod.listedPrice : 0
        };
      }
      
      return { ...item, [field]: value };
    }));
  };

  // Quick discount buttons (0%, 5%, 10%, 15%, 25%)
  const applyQuickDiscount = (index, discountPercent) => {
    const item = quoteItems[index];
    const prod = products.find(p => p.id === item.productId);
    if (!prod) return;
    const newPrice = Math.round(prod.listedPrice * (1 - discountPercent / 100));
    updateItem(index, 'offeredPrice', newPrice);
  };

  // Evaluate items against floor price
  let hasFloorBreach = false;
  let totalListed = 0;
  let totalOffered = 0;

  const evaluatedItems = quoteItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const offered = Number(item.offeredPrice) || 0;
    const listed = product.listedPrice;
    const floor = product.floorPrice;

    const isBelowFloor = offered < floor;
    if (isBelowFloor) hasFloorBreach = true;

    const itemListedTotal = listed * quantity;
    const itemOfferedTotal = offered * quantity;

    totalListed += itemListedTotal;
    totalOffered += itemOfferedTotal;

    const discountPct = calculateDiscount(listed, offered);

    return {
      ...item,
      productCode: product.code,
      productName: product.name,
      unit: product.unit,
      quantity,
      listedPrice: listed,
      floorPrice: floor,
      costPrice: product.costPrice,
      offeredPrice: offered,
      isBelowFloor,
      discountPct,
      subtotal: itemOfferedTotal
    };
  }).filter(Boolean);

  const totalDiscount = totalListed - totalOffered;
  const vat = Math.round(totalOffered * 0.1);
  const grandTotal = totalOffered + vat;

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (evaluatedItems.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm vào báo giá!');
      return;
    }

    // Check breach reasons
    for (const item of evaluatedItems) {
      if (item.isBelowFloor && (!item.breachReason || !item.breachReason.trim())) {
        alert(`Sản phẩm "${item.productName}" có giá bán thấp hơn Giá sàn. Bạn bắt buộc phải nhập lý do xin duyệt chiết khấu ngoại lệ!`);
        return;
      }
    }

    const newQuoteCode = `BG-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote = {
      id: newQuoteCode,
      code: newQuoteCode,
      customerName,
      contactPerson,
      salesRep: salesRepName,
      createdAt: new Date().toISOString().split('T')[0],
      status: hasFloorBreach ? 'pending_approval' : 'approved',
      note: note || (hasFloorBreach ? 'Đề xuất Giám đốc duyệt chiết khấu dưới giá sàn' : 'Báo giá chuẩn theo giá niêm yết'),
      items: evaluatedItems.map(it => ({
        productId: it.productId,
        productCode: it.productCode,
        productName: it.productName,
        unit: it.unit,
        quantity: it.quantity,
        listedPrice: it.listedPrice,
        floorPrice: it.floorPrice,
        offeredPrice: it.offeredPrice,
        requiresApproval: it.isBelowFloor,
        breachReason: it.breachReason
      })),
      approvalHistory: [
        {
          date: new Date().toLocaleString('vi-VN'),
          action: hasFloorBreach ? 'Yêu cầu duyệt chiết khấu dưới giá sàn' : 'Tự động duyệt',
          by: salesRepName,
          comment: hasFloorBreach ? 'Đơn giá chào bán vi phạm giá sàn niêm yết.' : 'Tất cả đơn giá chào bán hợp lệ (>= Giá sàn).'
        }
      ]
    };

    onCreateQuote(newQuote);
    alert(`✅ Báo giá ${newQuote.code} đã được tạo thành công!\nTrạng thái: ${hasFloorBreach ? '⚠️ Chờ Giám Đốc Phê Duyệt Chiết Khấu' : '🟢 Tự Động Phê Duyệt'}\n\nLưu ý: Các sản phẩm trong báo giá này đã được khóa, không thể xoá theo quy tắc SCRUM-63!`);
    onSuccessSwitchTab();
  };

  return (
    <div className="quote-builder-container">
      {/* Left Column: Form & Line Items */}
      <div className="quote-main-card">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="var(--primary)" />
            <span>Trình Lập Báo Giá Từ Bảng Giá Chuẩn</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Đảm bảo mọi báo giá đều xuất phát từ <strong>Bảng giá niêm yết chuẩn</strong> thay vì giá tự nghĩ. Kiểm soát ngưỡng Giá sàn tự động.
          </p>
        </div>

        {/* Customer Information */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building size={16} color="var(--primary)" />
            <span>Thông Tin Khách Hàng & Người Lập Báo Giá</span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Chọn khách hàng mẫu</label>
              <select className="form-select" value={selectedCustomerId} onChange={handleCustomerSelect}>
                {SAMPLE_CUSTOMERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Người liên hệ</label>
              <input 
                type="text" 
                className="form-input" 
                value={contactPerson} 
                onChange={(e) => setContactPerson(e.target.value)} 
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label">Tên công ty khách hàng</label>
              <input 
                type="text" 
                className="form-input" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label">Nhân viên phụ trách lập báo giá</label>
              <input 
                type="text" 
                className="form-input" 
                value={salesRepName} 
                onChange={(e) => setSalesRepName(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Products Table in Quote */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span>Danh Sách Sản Phẩm / Dịch Vụ Áp Giá</span>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={addItem}
              disabled={activeProducts.length === 0}
            >
              <Plus size={15} />
              <span>Thêm Hàng Hóa</span>
            </button>
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table className="quote-items-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Sản phẩm / Dịch vụ chuẩn</th>
                  <th style={{ width: '10%' }}>Số lượng</th>
                  <th style={{ width: '18%' }}>Giá niêm yết chuẩn</th>
                  <th style={{ width: '25%' }}>Đơn giá báo (Có chiết khấu)</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Thành tiền</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {evaluatedItems.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <React.Fragment key={idx}>
                      <tr>
                        {/* Select Product */}
                        <td>
                          <select
                            className="form-select"
                            style={{ width: '100%', fontSize: '0.8rem' }}
                            value={item.productId}
                            onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                          >
                            {activeProducts.map(p => (
                              <option key={p.id} value={p.id}>
                                [{p.code}] {p.name} ({p.unit})
                              </option>
                            ))}
                          </select>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem', fontSize: '0.725rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Giá sàn:</span>
                            <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                              {formatVND(item.floorPrice)}
                            </strong>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td>
                          <input
                            type="number"
                            min="1"
                            className="form-input form-input-mono"
                            style={{ padding: '0.4rem 0.5rem', textAlign: 'center' }}
                            value={item.quantity}
                            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          />
                        </td>

                        {/* Listed Price (Read only standard) */}
                        <td>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatVND(item.listedPrice)}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bảng giá niêm yết</span>
                        </td>

                        {/* Offered Price & Quick Discounts */}
                        <td>
                          <input
                            type="number"
                            className="form-input form-input-mono"
                            style={{
                              borderColor: item.isBelowFloor ? '#ef4444' : 'var(--border-subtle)',
                              background: item.isBelowFloor ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-input)'
                            }}
                            value={item.offeredPrice}
                            onChange={(e) => updateItem(idx, 'offeredPrice', e.target.value)}
                          />

                          {/* Quick discount chips */}
                          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.3rem' }}>
                            {[0, 5, 10, 15, 25].map(pct => (
                              <button
                                key={pct}
                                type="button"
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--border-subtle)',
                                  background: 'var(--bg-tertiary)',
                                  color: 'var(--text-secondary)',
                                  cursor: 'pointer'
                                }}
                                onClick={() => applyQuickDiscount(idx, pct)}
                              >
                                -{pct}%
                              </button>
                            ))}
                          </div>

                          {/* Status check against floor */}
                          <div style={{ marginTop: '0.35rem', fontSize: '0.725rem' }}>
                            {item.isBelowFloor ? (
                              <span style={{ color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <AlertTriangle size={12} />
                                <span>Thấp hơn giá sàn {formatVND(item.floorPrice - item.offeredPrice)} (-{formatPercent(item.discountPct)})</span>
                              </span>
                            ) : (
                              <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <CheckCircle size={12} />
                                <span>Trong khung cho phép (-{formatPercent(item.discountPct)})</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Subtotal */}
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {formatVND(item.subtotal)}
                        </td>

                        {/* Delete row */}
                        <td>
                          <button
                            type="button"
                            className="icon-btn btn-danger"
                            onClick={() => removeItem(idx)}
                            disabled={quoteItems.length <= 1}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>

                      {/* Breach explanation row if below floor price */}
                      {item.isBelowFloor && (
                        <tr style={{ background: 'rgba(239, 68, 68, 0.04)' }}>
                          <td colSpan="6" style={{ padding: '0.6rem 0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ShieldAlert size={16} color="#ef4444" />
                              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#f87171' }}>
                                Lý do xin duyệt chiết khấu ngoại lệ (bắt buộc gửi Giám đốc):
                              </span>
                              <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1, padding: '0.3rem 0.6rem', fontSize: '0.775rem' }}
                                placeholder="VD: Khách hàng mua số lượng lớn, cam kết trả trước 100%..."
                                value={item.breachReason || ''}
                                onChange={(e) => updateItem(idx, 'breachReason', e.target.value)}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="form-group">
          <label className="form-label">Ghi chú điều khoản thanh toán & báo giá</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="Điều khoản thanh toán, thời gian bàn giao, chính sách bảo hành..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {/* Right Column: Financial Summary & Approval Status */}
      <div className="quote-summary-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          Tổng Kết Báo Giá & Phê Duyệt
        </h3>

        {/* Floor Rule Status Alert */}
        {hasFloorBreach ? (
          <div className="floor-violation-alert">
            <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} color="#ef4444" />
            <div>
              <strong style={{ color: '#ef4444' }}>CẦN DUYỆT CHIẾT KHẤU NGOẠI LỆ!</strong>
              <p style={{ marginTop: '0.2rem', lineHeight: 1.4 }}>
                Có sản phẩm được báo <strong>dưới Giá sàn quy định</strong>. Theo tiêu chuẩn SCRUM-63, báo giá này sẽ tự động chuyển sang trạng thái <strong>"Chờ Giám đốc kinh doanh duyệt"</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="floor-success-notice">
            <CheckCircle size={20} style={{ flexShrink: 0 }} color="#10b981" />
            <div>
              <strong>TỰ ĐỘNG PHÊ DUYỆT (HỢP LỆ)</strong>
              <p style={{ marginTop: '0.15rem' }}>
                Tất cả đơn giá báo đều <strong>nằm trên hoặc bằng Giá sàn</strong>. Báo giá đủ điều kiện ban hành ngay!
              </p>
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tổng theo Giá Niêm Yết:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatVND(totalListed)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
            <span>Tổng tiền chiết khấu:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>-{formatVND(totalDiscount)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.5rem' }}>
            <span>Thành tiền trước thuế:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatVND(totalOffered)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Thuế VAT (10%):</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatVND(vat)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <span>Tổng cộng thanh toán:</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatVND(grandTotal)}</span>
          </div>
        </div>

        {/* SCRUM-63 Integrity Note */}
        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid var(--border-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#93c5fd' }}>
          <strong>📌 Tác động toàn vẹn dữ liệu SCRUM-63:</strong>
          <p style={{ marginTop: '0.2rem' }}>
            Sau khi phát hành báo giá này, tất cả các sản phẩm đã được chọn sẽ <strong>không thể bị xoá khỏi danh mục</strong>, chỉ có thể chuyển sang "Ngừng kinh doanh".
          </p>
        </div>

        {/* Submit Button */}
        <button 
          type="button" 
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
          onClick={handleSubmitQuote}
        >
          <Send size={18} />
          <span>{hasFloorBreach ? 'Gửi Trình Giám Đốc Duyệt Báo Giá' : 'Phát Hành Báo Giá Chuẩn'}</span>
        </button>
      </div>
    </div>
  );
}
