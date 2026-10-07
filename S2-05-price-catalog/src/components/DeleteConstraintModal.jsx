import React from 'react';
import { ShieldAlert, AlertOctagon, Ban, ArrowRight, X, FileText, CheckCircle2 } from 'lucide-react';
import { formatVND } from '../utils/formatters';

export default function DeleteConstraintModal({ 
  product, 
  referencingQuotes, 
  onClose, 
  onDiscontinue 
}) {
  if (!product) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: '640px' }}>
        <div className="modal-header" style={{ borderColor: 'var(--rose-border)' }}>
          <div className="modal-title" style={{ color: '#ef4444' }}>
            <ShieldAlert size={24} />
            <span>Ràng Buộc Nghiệp Vụ Toàn Vẹn Dữ Liệu (SCRUM-63)</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="integrity-box">
            <div className="integrity-header">
              <AlertOctagon size={24} />
              <div>
                <h3>Không Được Phép Xoá Sản Phẩm Này!</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Sản phẩm: <strong>{product.code} - {product.name}</strong>
                </p>
              </div>
            </div>

            <div className="rule-highlight">
              <strong>Quy tắc nghiệp vụ cốt lõi:</strong>
              <p style={{ marginTop: '0.25rem' }}>
                <em>"Sản phẩm đã xuất hiện trong báo giá thì không xoá được, chỉ ngừng kinh doanh."</em>
              </p>
              <p style={{ fontSize: '0.775rem', marginTop: '0.35rem', opacity: 0.9 }}>
                Hành động xoá cứng (hard delete) sẽ làm hỏng tính toàn vẹn của hồ sơ báo giá lịch sử, vi phạm nguyên tắc kiểm toán và lưu trữ chứng từ kế toán - kinh doanh.
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#3b82f6" />
                <span>Danh sách báo giá đang sử dụng sản phẩm này ({referencingQuotes.length} báo giá):</span>
              </div>
              <div className="referenced-quotes-list">
                {referencingQuotes.map(q => (
                  <div key={q.id} className="quote-ref-item">
                    <div>
                      <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{q.code}</strong>
                      <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>•</span>
                      <span>{q.customerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.createdAt}</span>
                      <span className={`status-badge ${q.status === 'approved' ? 'active' : 'discontinued'}`} style={{ fontSize: '0.7rem' }}>
                        {q.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--emerald-border)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', color: '#6ee7b7' }}>
              <strong>💡 Giải pháp chuẩn theo thiết kế hệ thống:</strong>
              <p style={{ marginTop: '0.2rem' }}>
                Bạn hãy chuyển sản phẩm sang trạng thái <strong>"Ngừng kinh doanh"</strong>. Sản phẩm sẽ không thể chọn trong các báo giá mới, nhưng toàn bộ lịch sử báo giá cũ vẫn được bảo lưu vẹn toàn.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Đóng Lại
          </button>
          <button 
            type="button" 
            className="btn btn-warning"
            onClick={() => {
              onDiscontinue(product.id);
              onClose();
            }}
          >
            <Ban size={16} />
            <span>Chuyển Sang "Ngừng Kinh Doanh" Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
