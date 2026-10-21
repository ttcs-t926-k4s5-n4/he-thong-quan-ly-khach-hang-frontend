import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  X, 
  Eye, 
  PauseCircle, 
  ArrowRightLeft, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function IntegrityDeleteModal({
  isOpen,
  onClose,
  item,
  category,
  referenceDetails,
  onDeactivateItem,
  onOpenReassignModal,
  onInspectRecords
}) {
  if (!isOpen || !item) return null;

  const { totalReferences, breakdown } = referenceDetails;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div className="modal-title" style={{ color: 'var(--danger)' }}>
            <ShieldAlert size={22} color="var(--danger)" />
            <span>Ràng Buộc Dữ Liệu: Không Thể Xóa Mục Này!</span>
          </div>
          <button 
            className="btn btn-outline btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Cảnh báo tiêu chuẩn nghiệp vụ */}
          <div className="alert-box alert-danger">
            <Lock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, marginBottom: '0.2rem' }}>
                Tuân thủ Tiêu chí nghiệm thu SCRUM-65:
              </div>
              <div>
                <em>"Giá trị đang được tham chiếu thì không xoá được."</em><br />
                Mục <strong>"{item.name}"</strong> (Mã: <code>{item.code}</code>) hiện đang được liên kết trong hệ thống CRM bởi <strong>{totalReferences} bản ghi thực tế</strong>. Nếu xóa, toàn bộ dữ liệu lịch sử và báo cáo gộp của công ty sẽ bị hỏng liên kết (Foreign Key violation).
              </div>
            </div>
          </div>

          {/* Chi tiết phân bổ các bản ghi đang tham chiếu */}
          <div style={{ background: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Phân bổ {totalReferences} bản ghi đang sử dụng giá trị này:
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Khách hàng doanh nghiệp:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {breakdown.customers?.length || 0} khách hàng
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Đầu mối tiềm năng (Leads):</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>
                  {breakdown.leads?.length || 0} leads
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cơ hội kinh doanh (Deals):</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                  {breakdown.deals?.length || 0} cơ hội
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hoạt động bán hàng:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple)' }}>
                  {breakdown.activities?.length || 0} hoạt động
                </div>
              </div>
            </div>
          </div>

          {/* Các giải pháp xử lý nghiệp vụ chuẩn */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Các giải pháp thay thế hợp lệ dành cho Giám đốc kinh doanh:
            </span>

            {/* Giải pháp 1: Chuyển sang Tạm ngưng */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem 1rem', 
              background: 'var(--bg-card)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>1. Chuyển sang trạng thái "Tạm ngưng" (Khuyến nghị)</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Giữ nguyên toàn vẹn báo cáo lịch sử, đồng thời ẩn mục này khỏi form CRM để không ai chọn mới.
                </div>
              </div>
              <button 
                id="btn-modal-deactivate"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onDeactivateItem(category.id, item.id);
                  onClose();
                }}
              >
                <PauseCircle size={14} />
                <span>Tạm Ngưng</span>
              </button>
            </div>

            {/* Giải pháp 2: Gộp & Chuyển dữ liệu sang mục khác */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem 1rem', 
              background: 'var(--bg-card)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>2. Gộp & Chuyển dữ liệu sang mục khác</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Di chuyển toàn bộ {totalReferences} bản ghi sang một danh mục khác. Sau đó mục này sẽ có 0 tham chiếu và có thể xóa.
                </div>
              </div>
              <button 
                id="btn-modal-reassign"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenReassignModal(item);
                }}
              >
                <ArrowRightLeft size={14} />
                <span>Gộp Dữ Liệu</span>
              </button>
            </div>

            {/* Giải pháp 3: Xem chi tiết bản ghi */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem 1rem', 
              background: 'var(--bg-card)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>3. Tra cứu danh sách bản ghi đang dùng</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Xem danh sách chi tiết các tên khách hàng, mã hợp đồng cụ thể đang trỏ đến mục này.
                </div>
              </div>
              <button 
                id="btn-modal-inspect"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onInspectRecords(category.id, item);
                }}
              >
                <Eye size={14} />
                <span>Xem Bản Ghi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
