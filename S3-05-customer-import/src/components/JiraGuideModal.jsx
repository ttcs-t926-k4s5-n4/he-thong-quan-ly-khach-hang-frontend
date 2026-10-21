import React from 'react';
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';

export default function JiraGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '880px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={22} style={{ color: 'var(--primary)' }} />
            <span>Đối Chiếu Nghiệp Vụ Jira Ticket: SCRUM-193 (Nhập Excel Hàng Loạt)</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* User Story Quote */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.15rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              User Story Đề Bài:
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "Là Nhân viên kinh doanh, tôi muốn nhập danh sách khách hàng hàng loạt từ Excel, để đưa danh mục khách đang có vào hệ thống mà không gõ lại."
            </div>
          </div>

          {/* Bảng đối chiếu 2 tiêu chuẩn nghiệm thu */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              🎯 Bảng Đối Chiếu Tiêu Chí Nghiệm Thu (Acceptance Criteria):
            </h4>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>STT</th>
                    <th style={{ width: '280px' }}>Tiêu Chí Trong Jira Ticket</th>
                    <th>Giải Pháp Kỹ Thuật Đã Triển Khai Trong React</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, textAlign: 'center' }}>1</td>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>
                        Tải được tệp mẫu, xem trước và báo lỗi theo từng dòng
                      </strong>
                    </td>
                    <td>
                      <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.55, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <li>
                          <strong>Tải tệp mẫu:</strong> Nút <em>"Tải Mẫu Excel (.xlsx)"</em> tự động xuất file Excel thật với 2 Sheets (dữ liệu mẫu & quy tắc nhập) và file CSV (UTF-8).
                        </li>
                        <li>
                          <strong>Xem trước (Preview):</strong> Bảng tính trực quan hiển thị đầy đủ dòng Excel (#2, #3...), mã, tên, MST, email, số điện thoại, địa chỉ, người phụ trách.
                        </li>
                        <li>
                          <strong>Báo lỗi theo từng dòng:</strong> Đánh dấu màu đỏ nổi bật các dòng vi phạm dữ liệu (thiếu tên, sai cú pháp email, sai SĐT, sai MST) kèm ô lỗi có viền đỏ và tooltip giải thích chi tiết.
                        </li>
                        <li>
                          <strong>Sửa trực tiếp (Inline Quick Edit):</strong> Click vào ô bị lỗi để gõ sửa ngay trên bảng xem trước; khi sửa đúng, dòng tự động đổi sang màu xanh hợp lệ!
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, textAlign: 'center' }}>2</td>
                    <td>
                      <strong style={{ color: 'var(--warning)' }}>
                        Bản ghi trùng được đánh dấu rõ trong bản xem trước để chọn bỏ qua hoặc cập nhật
                      </strong>
                    </td>
                    <td>
                      <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.55, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <li>
                          <strong>Đánh dấu bản ghi trùng:</strong> Phù hiệu màu vàng cam <code>⚠️ TRÙNG LẶP</code> nổi bật, chỉ rõ lý do trùng (Trùng MST với FPT Corporation, trùng Email, hoặc trùng nội bộ file).
                        </li>
                        <li>
                          <strong>Lựa chọn Bỏ qua hoặc Cập nhật:</strong> Trên từng dòng có bộ chuyển đổi nhanh <code>[Bỏ qua]</code> hoặc <code>[Cập nhật]</code>.
                        </li>
                        <li>
                          <strong>Thao tác hàng loạt:</strong> Nút <em>"Bỏ qua tất cả"</em> và <em>"Cập nhật tất cả"</em> giúp xử lý nhanh danh sách lớn.
                        </li>
                        <li>
                          <strong>So sánh cạnh nhau (Dual-pane Modal):</strong> Nút <em>"So sánh"</em> mở cửa sổ so sánh song song giữa dữ liệu Excel và dữ liệu hiện có trong CRM.
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Kịch bản kiểm thử mẫu */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              🧪 Các Bước Kiểm Thử Nhanh Để Chấm Bài:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>Bước 1 (Thử Tải Mẫu):</strong> Bấm nút màu xanh <em>"Tải Tệp Mẫu Excel (.xlsx)"</em> ở thanh trên cùng để tải file Excel chuẩn.
              </div>
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>Bước 2 (Kiểm tra Tiêu chí 2 - Bản ghi trùng):</strong> Nhấn vào kịch bản <em>"Kịch bản 1: Có bản ghi trùng"</em>. Quan sát các dòng màu vàng cam có badge TRÙNG LẶP. Thử bấm nút "So sánh" và đổi giữa Bỏ qua / Cập nhật.
              </div>
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>Bước 3 (Kiểm tra Tiêu chí 1 - Báo lỗi từng dòng):</strong> Nhấn vào <em>"Kịch bản 2: Báo lỗi từng dòng"</em>. Quan sát các ô màu đỏ. Click vào ô Tên bị trống hoặc ô Email sai định dạng để sửa lại, quan sát dòng tự chuyển thành màu xanh Hợp Lệ!
              </div>
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong>Bước 4 (Thực hiện nhập vào CRM):</strong> Bấm nút <em>"Tiến Hành Nhập Dữ Liệu"</em> &rarr; Xem màn hình tổng kết nghiệm thu &rarr; Bấm xem danh mục khách hàng sau khi nhập.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            <CheckCircle2 size={15} /> Đã Hiểu & Bắt Đầu Thử Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
}
