import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Printer, 
  User, 
  Building, 
  ShieldCheck, 
  Check, 
  X,
  MessageSquare
} from 'lucide-react';
import { formatVND, formatPercent } from '../utils/formatters';

export default function QuoteApprovalList({ 
  quotes, 
  currentRole, 
  onApproveQuote, 
  onRejectQuote 
}) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [actioningQuoteId, setActioningQuoteId] = useState(null);

  const handleOpenDetail = (quote) => {
    setSelectedQuote(quote);
    setApprovalComment('');
  };

  const handleApprove = (quoteId) => {
    onApproveQuote(quoteId, approvalComment || 'Giám đốc kinh doanh đồng ý phê duyệt mức chiết khấu ngoại lệ.');
    setActioningQuoteId(null);
    setApprovalComment('');
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote(null);
    }
  };

  const handleReject = (quoteId) => {
    onRejectQuote(quoteId, approvalComment || 'Giám đốc kinh doanh từ chối mức chiết khấu này vì không đảm bảo biên lợi nhuận.');
    setActioningQuoteId(null);
    setApprovalComment('');
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote(null);
    }
  };

  return (
    <div className="catalog-section">
      <div className="table-card">
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" />
              <span>Quản Lý Báo Giá & Phê Duyệt Ngưỡng Giá Sàn (SCRUM-63)</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Kiểm soát các báo giá có sản phẩm dưới giá sàn cần Giám đốc kinh doanh xét duyệt.
            </p>
          </div>
          <span className="security-pill">
            Tổng: {quotes.length} báo giá lưu trữ
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Báo Giá</th>
                <th>Khách Hàng & Liên Hệ</th>
                <th>Người Lập</th>
                <th>Ngày Lập</th>
                <th>Số Lượng SP</th>
                <th>Tổng Giá Trị</th>
                <th>Kiểm Soát Giá Sàn</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(quote => {
                const hasFloorBreach = quote.items.some(it => it.requiresApproval);
                const grandTotal = quote.items.reduce((acc, it) => acc + (it.offeredPrice * it.quantity), 0) * 1.1;

                return (
                  <tr key={quote.id}>
                    {/* Code */}
                    <td>
                      <span className="sku-badge">{quote.code}</span>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="product-name-cell">
                        <span className="product-name">{quote.customerName}</span>
                        <span className="product-desc">{quote.contactPerson}</span>
                      </div>
                    </td>

                    {/* Sales Rep */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem' }}>
                        <User size={13} color="var(--text-muted)" />
                        <span>{quote.salesRep}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {quote.createdAt}
                      </span>
                    </td>

                    {/* Item count */}
                    <td>
                      <span className="quote-ref-badge has-quotes">
                        {quote.items.length} mặt hàng
                      </span>
                    </td>

                    {/* Grand Total */}
                    <td>
                      <div className="price-display price-listed">
                        {formatVND(grandTotal)}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Đã gồm 10% VAT</span>
                    </td>

                    {/* Floor Price Compliance Check */}
                    <td>
                      {hasFloorBreach ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.775rem', fontWeight: 600 }}>
                          <AlertTriangle size={14} color="#f59e0b" />
                          <span>Dưới Giá Sàn (Cần Duyệt)</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.775rem', fontWeight: 600 }}>
                          <CheckCircle size={14} color="#10b981" />
                          <span>Trên Giá Sàn (Hợp Lệ)</span>
                        </div>
                      )}
                    </td>

                    {/* Approval Status */}
                    <td>
                      {quote.status === 'approved' && (
                        <span className="status-badge active">
                          <CheckCircle size={12} />
                          <span>Đã Phê Duyệt</span>
                        </span>
                      )}
                      {quote.status === 'pending_approval' && (
                        <span className="status-badge" style={{ background: 'var(--amber-bg)', color: '#fbbf24', border: '1px solid var(--amber-border)' }}>
                          <Clock size={12} />
                          <span>Chờ GĐ Duyệt</span>
                        </span>
                      )}
                      {quote.status === 'rejected' && (
                        <span className="status-badge" style={{ background: 'var(--rose-bg)', color: '#f87171', border: '1px solid var(--rose-border)' }}>
                          <XCircle size={12} />
                          <span>Từ Chối Chiết Khấu</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        {/* Director quick approve if pending */}
                        {currentRole === 'director' && quote.status === 'pending_approval' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                              title="Giám đốc phê duyệt chiết khấu"
                              onClick={() => handleApprove(quote.id)}
                            >
                              <Check size={13} />
                              <span>Duyệt</span>
                            </button>
                            <button
                              type="button"
                              className="icon-btn btn-danger"
                              style={{ width: '28px', height: '28px' }}
                              title="Từ chối chiết khấu"
                              onClick={() => handleReject(quote.id)}
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}

                        {/* View Detail & Print */}
                        <button
                          type="button"
                          className="icon-btn"
                          title="Xem chi tiết báo giá"
                          onClick={() => handleOpenDetail(quote)}
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="modal-backdrop">
          <div className="modal-box modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <FileText size={22} color="var(--primary)" />
                <span>Chi Tiết Báo Giá: {selectedQuote.code}</span>
              </div>
              <button type="button" className="icon-btn" onClick={() => setSelectedQuote(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer & Info bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Khách hàng:</span>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedQuote.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LH: {selectedQuote.contactPerson}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Người lập:</span>
                  <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{selectedQuote.salesRep}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ngày tạo: {selectedQuote.createdAt}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trạng thái phê duyệt:</span>
                  <div style={{ marginTop: '0.2rem' }}>
                    {selectedQuote.status === 'approved' && <span className="status-badge active">Đã Phê Duyệt</span>}
                    {selectedQuote.status === 'pending_approval' && <span className="status-badge" style={{ background: 'var(--amber-bg)', color: '#fbbf24' }}>Chờ Giám Đốc Duyệt</span>}
                    {selectedQuote.status === 'rejected' && <span className="status-badge" style={{ background: 'var(--rose-bg)', color: '#f87171' }}>Bị Từ Chối</span>}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Các Sản Phẩm Trong Báo Giá:</h4>
                <table className="quote-items-table" style={{ border: '1px solid var(--border-subtle)' }}>
                  <thead>
                    <tr>
                      <th>Mã & Tên Sản Phẩm</th>
                      <th>ĐVT</th>
                      <th>SL</th>
                      <th>Giá Niêm Yết</th>
                      <th>Giá Sàn</th>
                      <th>Đơn Giá Báo</th>
                      <th>Đánh Giá Ngưỡng Sàn</th>
                      <th style={{ textAlign: 'right' }}>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map((it, i) => (
                      <tr key={i}>
                        <td>
                          <strong>[{it.productCode}]</strong> {it.productName}
                        </td>
                        <td>{it.unit}</td>
                        <td>{it.quantity}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{formatVND(it.listedPrice)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>{formatVND(it.floorPrice)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{formatVND(it.offeredPrice)}</td>
                        <td>
                          {it.requiresApproval ? (
                            <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.75rem' }}>
                              ⚠️ Dưới giá sàn ({formatVND(it.floorPrice - it.offeredPrice)})
                            </span>
                          ) : (
                            <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>
                              ✅ Đạt chuẩn sàn
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {formatVND(it.offeredPrice * it.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note */}
              {selectedQuote.note && (
                <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.825rem' }}>
                  <strong>Ghi chú / Giải trình chiết khấu:</strong>
                  <p style={{ marginTop: '0.2rem', color: 'var(--text-secondary)' }}>{selectedQuote.note}</p>
                </div>
              )}

              {/* Approval History */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lịch Sử Phê Duyệt Kiểm Toán:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedQuote.approvalHistory && selectedQuote.approvalHistory.map((h, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{h.action}</strong> • <span style={{ color: 'var(--text-muted)' }}>{h.by}</span>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{h.comment}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Director Action Form inside modal */}
              {currentRole === 'director' && selectedQuote.status === 'pending_approval' && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--amber-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>
                    <ShieldCheck size={18} />
                    <span>Quyết Định Phê Duyệt Của Giám Đốc Kinh Doanh</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ý kiến phản hồi / Chỉ đạo:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập lý do duyệt hoặc từ chối chiết khấu..."
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => handleApprove(selectedQuote.id)}
                    >
                      <Check size={16} />
                      <span>Đồng Ý Phê Duyệt Chiết Khấu</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleReject(selectedQuote.id)}
                    >
                      <X size={16} />
                      <span>Từ Chối Chiết Khấu</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>In / Xuất Bản In Báo Giá</span>
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setSelectedQuote(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
