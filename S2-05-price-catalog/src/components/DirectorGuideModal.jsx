import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Crown, 
  Lock, 
  Ban, 
  AlertTriangle, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function DirectorGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box modal-lg">
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={22} color="var(--primary)" />
            <span>Đối Chiếu Nghiệm Thu Yêu Cầu Kỹ Thuật (SCRUM-63)</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              User Story:
            </h3>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              "Là Giám đốc kinh doanh, tôi muốn quản lý danh mục sản phẩm dịch vụ và bảng giá niêm yết, để mọi báo giá đều xuất phát từ một bảng giá chuẩn thay vì giá tự nghĩ."
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Criteria 1 */}
            <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid var(--border-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={18} color="#60a5fa" />
                <span>Tiêu chí 1: Khai báo đầy đủ các trường thông tin tiêu chuẩn</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                • <strong>Mã SP/SKU, Tên SP, Đơn vị tính:</strong> Khai báo chuẩn hóa, không trùng lặp mã.<br />
                • <strong>Phân loại:</strong> Lựa chọn rõ giữa <em>Sản phẩm một lần</em> (Hardware, License vĩnh viễn...) và <em>Dịch vụ thuê bao</em> (SaaS recurring, SLA...).<br />
                • <strong>Giá niêm yết & Giá sàn:</strong> Xác lập bảng giá gốc tiêu chuẩn cho toàn bộ tổ chức kinh doanh.
              </p>
            </div>

            {/* Criteria 2 */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--amber-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={18} color="#fbbf24" />
                <span>Tiêu chí 2: Giá sàn là ngưỡng xác định báo giá có cần duyệt chiết khấu</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                • <strong>Khi Giá Bán &ge; Giá Sàn:</strong> Hệ thống tự động phê duyệt (Auto-approved). Báo giá có thể ban hành ngay mà không cần xin phép.<br />
                • <strong>Khi Giá Bán &lt; Giá Sàn:</strong> Hệ thống tự động cảnh báo vi phạm thẩm quyền, chuyển trạng thái báo giá sang <em>"Chờ Giám đốc kinh doanh duyệt"</em> và bắt buộc sales nhập lý do giải trình.
              </p>
            </div>

            {/* Criteria 3 */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--emerald-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#34d399', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={18} color="#34d399" />
                <span>Tiêu chí 3: Giá vốn chỉ Giám đốc kinh doanh xem và sửa được</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                • <strong>Vai trò Giám Đốc Kinh Doanh:</strong> Được hiển thị rõ ràng giá trị Giá vốn (Cost Price), phân tích Biên lợi nhuận gộp (Margin %) thời gian thực và được sửa giá vốn trong biểu mẫu.<br />
                • <strong>Vai trò Nhân Viên Kinh Doanh:</strong> Giá vốn bị che hoàn toàn (dạng <code>•••••• 🔒</code>). Input giá vốn trong modal bị vô hiệu hóa với thông báo bảo mật nghiêm ngặt.
              </p>
            </div>

            {/* Criteria 4 */}
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--rose-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#f87171', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={18} color="#f87171" />
                <span>Tiêu chí 4: Sản phẩm đã xuất hiện trong báo giá thì không xoá được, chỉ ngừng kinh doanh</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                • <strong>Chặn Xoá Cứng (Referential Integrity):</strong> Nếu sản phẩm đã được sử dụng trong bất kỳ báo giá nào, bấm "Xoá" sẽ kích hoạt hộp thoại cảnh báo ràng buộc kiểm toán SCRUM-63, liệt kê đích danh các báo giá đang liên kết.<br />
                • <strong>Chuyển Trạng Thái:</strong> Cho phép chuyển sang trạng thái <em>"Ngừng kinh doanh"</em>. Sản phẩm này sẽ bị ẩn/khóa trong Trình lập báo giá mới nhưng toàn bộ dữ liệu lịch sử trong các báo giá cũ vẫn nguyên vẹn.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
