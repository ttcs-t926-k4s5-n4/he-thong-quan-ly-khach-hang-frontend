import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function JiraTicketModal({
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>
            <span className="ticket-tag">
              <span>⚡ SCRUM-21</span>
              <span>/</span>
              <span>☑ SCRUM-102</span>
            </span>
            <span>Chi Tiết Đề Bài & Đối Chiếu Tiêu Chí Chấp Nhận</span>
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* User Story Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem 1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
              User Story trong Jira Ticket:
            </div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>
              "Là Chăm sóc khách hàng, tôi muốn xem dòng thời gian tương tác đầy đủ của một khách hàng, để tiếp nhận khách từ đồng nghiệp mà nắm được bối cảnh trong năm phút."
            </p>
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Nội dung mô tả (Description) trong đề bài:
            </h4>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              <li><strong>Gộp toàn bộ hoạt động, thay đổi cơ hội, báo giá đã gửi theo thứ tự thời gian</strong></li>
              <li><strong>Lọc theo loại hoạt động và theo người thực hiện</strong></li>
            </ul>
          </div>

          {/* Acceptance Criteria Mapping Table */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
              🎯 Bảng Đối Chiếu 3 Tiêu Chí Chấp Nhận & Giải Pháp Kỹ Thuật:
            </h4>
            <div style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.85rem', width: '70px' }}>STT</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Tiêu chí Jira</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Giải pháp kỹ thuật trong React</th>
                    <th style={{ padding: '0.6rem 0.85rem', width: '90px', textAlign: 'center' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#818cf8' }}>AC1</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      Gộp toàn bộ hoạt động, thay đổi cơ hội, báo giá đã gửi theo thứ tự thời gian
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>
                      • Dòng thời gian hợp nhất (Unified Interactive Timeline) với trục dọc trung tâm (glowing spine).<br/>
                      • Tự động nhóm sự kiện theo từng ngày/tháng kèm nhãn thời gian tương đối.<br/>
                      • Hiển thị trực quan 4 nhóm tương tác cốt lõi: Cuộc gọi, Cuộc họp, Email, Thay đổi cơ hội (stage/value), và Báo giá đã gửi (kèm chiết khấu & file PDF).
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#34d399', fontWeight: 700, fontSize: '0.75rem' }}>
                        <CheckCircle2 size={14} /> 100%
                      </span>
                    </td>
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#818cf8' }}>AC2</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      Lọc theo loại hoạt động và theo người thực hiện
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>
                      • <strong>Lọc theo loại hoạt động:</strong> 7 filter chips 1-click (Tất cả, Cuộc gọi, Cuộc họp, Email, Đổi cơ hội, Báo giá, Ghi chú & Bàn giao).<br/>
                      • <strong>Lọc theo người thực hiện:</strong> Dropdown chọn nhân sự (Lê Quốc Hưng - Sales cũ, Trần Thị Mai - Pre-sales, Hoàng Kim Ngân - CSKH, Trưởng nhóm Trọng).<br/>
                      • Ô tìm kiếm thông minh từ khóa tức thời + lọc khoảng thời gian + sắp xếp mới/cũ.
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#34d399', fontWeight: 700, fontSize: '0.75rem' }}>
                        <CheckCircle2 size={14} /> 100%
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#818cf8' }}>AC3</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      Tiếp nhận khách từ đồng nghiệp mà nắm được bối cảnh trong 5 phút
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>
                      • <strong>Thẻ tóm tắt bối cảnh 5 phút (5-Minute Quick Handover Briefing):</strong> Đồng hồ đếm 5 phút, tóm tắt điều hành, chân dung người quyết định chính, 3 lời dặn dò từ đồng nghiệp cũ, cảnh báo nhạy cảm, và danh mục việc cần làm 24h đầu.<br/>
                      • Nút xác nhận tiếp nhận bàn giao chính thức 1-click cập nhật hồ sơ khách hàng.
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#34d399', fontWeight: 700, fontSize: '0.75rem' }}>
                        <CheckCircle2 size={14} /> 100%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Đóng Tra Cứu
          </button>
        </div>
      </div>
    </div>
  );
}
