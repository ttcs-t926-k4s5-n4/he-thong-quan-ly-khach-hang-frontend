import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  Lock, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck 
} from 'lucide-react';

export const JiraTicketModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '780px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="jira-badge-pill">
              <Sparkles size={14} />
              SCRUM-20 / SCRUM-91
            </span>
            <span className="badge badge-proposal">Status: review</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* User story box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              User Story
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "Là Nhân viên kinh doanh, tôi muốn đóng một cơ hội với kết quả thắng hoặc thua, để công ty học được từ cả thương vụ thắng lẫn thua."
            </p>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
            Bảng Đối Chiếu 4 Tiêu Chí Chấp Nhận (Acceptance Criteria)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* AC1 */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--success)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} className="text-emerald-400" />
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                  Tiêu chí 1: Đóng Thắng bắt buộc nhập giá trị chốt thực tế và ngày ký
                </strong>
              </div>
              <ul style={{ paddingLeft: '1.6rem', fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Form bắt buộc nhập <code>Giá trị chốt thực tế (&gt; 0 VNĐ)</code> và <code>Ngày ký hợp đồng</code>.</li>
                <li>Tự động đối chiếu chênh lệch độ lệch (Δ Tăng/Giảm) so với giá trị dự kiến ban đầu.</li>
                <li>Cho phép nhập mã hợp đồng và ghi nhận bài học thành công (Win Lessons) chia sẻ cho team.</li>
              </ul>
            </div>

            {/* AC2 */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--danger)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} className="text-rose-400" />
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                  Tiêu chí 2: Đóng Thua bắt buộc chọn lý do thua và đối thủ thắng thầu nếu có
                </strong>
              </div>
              <ul style={{ paddingLeft: '1.6rem', fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Bắt buộc chọn <code>Lý do thua</code> từ danh mục chuẩn (Giá quá cao, Thiếu tính năng, Đối thủ quan hệ tốt hơn...).</li>
                <li>Bắt buộc/chọn <code>Đối thủ thắng thầu</code> (Viettel, FPT, CMC, MISA, Base.vn...) kèm giá trúng thầu ước tính.</li>
                <li>Phân tích bài học rút ra (Loss Post-Mortem) để bộ phận R&D/Sản phẩm cải tiến.</li>
              </ul>
            </div>

            {/* AC3 */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--purple)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} className="text-purple-400" />
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                  Tiêu chí 3: Cơ hội đã đóng không sửa được, chỉ Trưởng nhóm trở lên mở lại được kèm lý do
                </strong>
              </div>
              <ul style={{ paddingLeft: '1.6rem', fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Cơ hội sau khi đóng lập tức kích hoạt cờ <code>isLocked = true</code>, khóa hoàn toàn quyền sửa đổi của Sales Rep.</li>
                <li>Persona Switcher trên Topbar cho phép đóng vai <strong>Nhân viên kinh doanh</strong> (thấy nút Mở lại bị khóa) vs <strong>Trưởng nhóm / Giám đốc</strong> (có nút Mở lại cơ hội).</li>
                <li>Khi mở lại: Bắt buộc nhập <code>Lý do mở lại</code> và lưu lại toàn bộ vào Nhật ký kiểm toán (Audit Trail).</li>
              </ul>
            </div>

            {/* AC4 */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--info)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} className="text-blue-400" />
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                  Tiêu chí 4: Cơ hội thắng được tính vào chỉ tiêu của người sở hữu
                </strong>
              </div>
              <ul style={{ paddingLeft: '1.6rem', fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Doanh số chốt thực tế của cơ hội Thắng được cộng dồn theo thời gian thực vào KPI của Sales Rep sở hữu.</li>
                <li>Thanh tiến độ % hoàn thành chỉ tiêu, trạng thái Đạt/Chưa đạt, và tự động hoàn trừ nếu cơ hội bị mở lại.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
