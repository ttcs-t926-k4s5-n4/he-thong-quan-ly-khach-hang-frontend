import React from 'react';
import { FileText, CheckCircle2, X, ExternalLink, ShieldCheck, Clock, Sliders, AlertTriangle } from 'lucide-react';

export const JiraTicketModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} style={{ color: '#818cf8' }} />
            <span>⚡ SCRUM-20 / ☑ SCRUM-93: Cảnh Báo Cơ Hội Đình Trệ</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* User Story Card */}
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              User Story:
            </span>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              "Là Trưởng nhóm kinh doanh, tôi muốn được cảnh báo khi cơ hội đình trệ, để can thiệp sớm thay vì phát hiện khi thương vụ đã nguội."
            </p>
          </div>

          {/* Bảng đối chiếu 4 Acceptance Criteria */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
              <span>Bảng Đối Chiếu 4 Tiêu Chí Chấp Nhận (Acceptance Criteria):</span>
            </h4>

            <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <table className="data-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Tiêu Chí</th>
                    <th style={{ width: '35%' }}>Mô Tả Trong Jira Đề Bài</th>
                    <th>Giải Pháp Kỹ Thuật Trong Ứng Dụng React</th>
                    <th>Kiểm Thử</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="badge badge-flag-inactivity">AC1</span>
                    </td>
                    <td>
                      <strong>Cơ hội không có hoạt động nào trong N ngày được gắn cờ, N cấu hình theo từng giai đoạn</strong>
                    </td>
                    <td>
                      • Động cơ <code>evaluateOpportunity</code> so sánh <code>daysSinceLastActivity</code> với ngưỡng $N$ của giai đoạn.<br/>
                      • Modal <code>ThresholdConfigModal</code> cho phép Trưởng nhóm điều chỉnh số ngày $N$ cho từng giai đoạn (Khảo sát: 7, Demo: 10, Báo giá: 5, Thương thảo: 3) kèm thanh kéo slider và xem trước số deal bị ảnh hưởng thời gian thực.
                    </td>
                    <td>
                      <span className="badge badge-safe">✓ Hoàn tất 100%</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="badge badge-flag-overdue">AC2</span>
                    </td>
                    <td>
                      <strong>Cơ hội quá ngày dự kiến chốt mà chưa đóng cũng được gắn cờ</strong>
                    </td>
                    <td>
                      • Kiểm tra <code>expectedCloseDate &lt; currentDate</code> đối với tất cả cơ hội đang mở.<br/>
                      • Gắn cờ <code>OVERDUE_CLOSE</code> (hoặc cờ kép <code>DUAL</code> nếu vừa quá hạn chốt vừa im ắng &gt; N ngày).<br/>
                      • Cung cấp Modal gia hạn ngày chốt (<code>ExtendCloseDateModal</code>) có lý do để giải tỏa cờ quá hạn khi cần.
                    </td>
                    <td>
                      <span className="badge badge-safe">✓ Hoàn tất 100%</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="badge badge-flag-dual">AC3</span>
                    </td>
                    <td>
                      <strong>Danh sách cơ hội có cờ hiển thị riêng cho trưởng nhóm</strong>
                    </td>
                    <td>
                      • Chế độ xem mặc định cho Trưởng nhóm (<code>FLAGGED_ONLY</code>) tách biệt hẳn với toàn bộ pipeline.<br/>
                      • Hiển thị lý do gắn cờ, nhiệt độ thương vụ (Lạnh cóng ❄️, Đang nguội 🌡️).<br/>
                      • Cung cấp 4 hành động can thiệp sớm (<code>InterventionModal</code>): Nhắc nhở Rep, Lên lịch họp cứu deal 3 bên, Chuyển giao cơ hội, Chỉ đạo chiến lược.
                    </td>
                    <td>
                      <span className="badge badge-safe">✓ Hoàn tất 100%</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>AC4</span>
                    </td>
                    <td>
                      <strong>Tác vụ đánh giá chạy mỗi ngày một lần</strong>
                    </td>
                    <td>
                      • Banner &amp; Modal hiển thị Cron Job <code>0 6 * * *</code> (06:00:00 sáng mỗi ngày).<br/>
                      • Nút <strong>⚡ Chạy Đánh Giá Ngay</strong> để kích hoạt quét và cập nhật lại toàn bộ cờ tức thì.<br/>
                      • Bảng nhật ký ghi lại lịch sử từng lần chạy tự động/thủ công kèm thời lượng ms và biến động số cờ.
                    </td>
                    <td>
                      <span className="badge badge-safe">✓ Hoàn tất 100%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
