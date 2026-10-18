import React from 'react';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeftRight,
  Clock,
  Layers
} from 'lucide-react';

export const JiraTicketModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <span className="ticket-tag">SCRUM-20 / SCRUM-94</span>
            <span>Chi Tiết Đề Bài & Đối Chiếu Tiêu Chí Chấp Nhận</span>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* User Story Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.12))',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              User Story (Đề bài gốc):
            </div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: '1.5', color: 'var(--text-primary)' }}>
              "Là Trưởng nhóm kinh doanh, tôi muốn phân bổ lại cơ hội cho người khác trong nhóm, để thương vụ không đứng yên khi người phụ trách nghỉ dài hoặc quá tải."
            </p>
          </div>

          {/* Bảng 3 Tiêu Chí Chấp Nhận AC */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span>Bảng Đối Chiếu 3 Tiêu Chí Chấp Nhận (Acceptance Criteria)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* AC1 */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-blue">AC1</span>
                <strong style={{ fontSize: '0.9rem' }}>Chuyển quyền sở hữu một hoặc nhiều cơ hội cùng lúc</strong>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li><strong>Chuyển giao 1 cơ hội:</strong> Bấm nút "Phân bổ" trên từng dòng để chuyển nhượng trực tiếp cho người khác.</li>
                <li><strong>Chuyển giao hàng loạt (Bulk Transfer):</strong> Tích chọn nhiều checkbox hoặc chọn tất cả ➔ Thanh công cụ nổi xuất hiện với tổng giá trị deal ➔ Bấm "Phân bổ lại" hoặc "Cân bằng tải tự động".</li>
                <li><strong>Bộ lọc thông minh:</strong> Lọc riêng các deal của người đang nghỉ ốm, nghỉ thai sản, hoặc quá tải để xử lý nhanh chóng.</li>
              </ul>
            </div>

            {/* AC2 */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-emerald">AC2</span>
                <strong style={{ fontSize: '0.9rem' }}>Người nhận thấy ngay cơ hội trong danh sách của mình cùng toàn bộ lịch sử</strong>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li><strong>Thấy ngay trong danh sách (Cập nhật thời gian thực):</strong> Khi chuyển sang Persona người nhận (vd: Trần Thị Mai, Vũ Đức Thắng), banner chào mừng lập tức hiển thị thông báo nhận deal mới, và deal xuất hiện ngay trong tab "Cơ hội của tôi" & "Mới nhận".</li>
                <li><strong>Huy hiệu nổi bật:</strong> Gắn nhãn neon pulse <code>✨ Mới nhận bàn giao</code> để người nhận nhận biết tức thì.</li>
                <li><strong>Bảo tồn 100% lịch sử:</strong> Mọi cuộc gọi, email, demo, báo giá trước đây của người cũ được lưu giữ nguyên vẹn, đồng thời đính kèm sự kiện bàn giao mới vào timeline.</li>
              </ul>
            </div>

            {/* AC3 */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-purple">AC3</span>
                <strong style={{ fontSize: '0.9rem' }}>Mỗi lần chuyển được ghi nhật ký kèm lý do</strong>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                <li><strong>Bắt buộc nhập lý do:</strong> Form phân bổ yêu cầu chọn lý do từ danh mục chuẩn (Nghỉ phép dài hạn, Quá tải, Phù hợp chuyên môn...) hoặc nhập lý do khác.</li>
                <li><strong>Ghi chú bàn giao & Checklist:</strong> Lưu vết các nội dung dặn dò và danh mục việc đã hoàn tất.</li>
                <li><strong>Nhật ký kiểm toán toàn diện (Audit Log):</strong> Modal Nhật ký trung tâm lưu trữ toàn bộ các phiên chuyển nhượng, hỗ trợ tìm kiếm, lọc lý do và xuất file báo cáo CSV/In biên bản.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
