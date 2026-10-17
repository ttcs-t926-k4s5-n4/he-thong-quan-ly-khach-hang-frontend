import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  SlidersHorizontal, 
  Inbox, 
  Clock, 
  Zap, 
  PlayCircle 
} from 'lucide-react';

export default function JiraGuideModal({
  onClose,
  onRunTest1,
  onRunTest2,
  onRunTest3,
  onRunTest4
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '980px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div className="modal-title">Bảng Đối Chiếu 4 Tiêu Chí Nghiệm Thu (Acceptance Criteria)</div>
              <div className="modal-subtitle">
                User Story: Cấu Hình Quy Tắc Phân Bổ Lead Tự Động (Routing Rules Engine)
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* User Story Quote */}
          <div style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(37,99,235,0.08))', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              🎯 ĐỀ BÀI USER STORY CHÍNH THỨC (JIRA TICKET):
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              "Là Giám đốc kinh doanh, tôi muốn cấu hình quy tắc phân bổ lead tự động, để lead tới tay người phụ trách trong vài phút thay vì chờ họp giao ban."
            </div>
          </div>

          {/* Table of 4 Acceptance Criteria */}
          <div style={{ overflowX: 'auto' }}>
            <table className="leads-table" style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                  <th style={{ width: '220px' }}>Tiêu Chí Trong Jira Ticket</th>
                  <th>Giải Pháp Kỹ Thuật Đã Triển Khai Trong React</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Thử Nghiệm Nhanh</th>
                </tr>
              </thead>
              <tbody>
                {/* 1 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>1</td>
                  <td>
                    <strong style={{ color: '#059669' }}>
                      Phân bổ theo khu vực, theo ngành nghề, hoặc xoay vòng đều trong nhóm
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • <strong>Theo khu vực (Region-based):</strong> Tự động phân bổ khách Miền Bắc cho Nhóm Miền Bắc, khách Miền Nam cho Nhóm Miền Nam.<br />
                    • <strong>Theo ngành nghề (Industry-based):</strong> Khách ngành CNTT hoặc Ngân hàng chuyển thẳng cho Đội Enterprise VIP Sales.<br />
                    • <strong>Xoay vòng đều (Round-Robin):</strong> Tự động chia đều lần lượt cho từng thành viên trong nhóm, bảo đảm khối lượng công việc cân bằng.
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => { onClose(); onRunTest1(); }}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Tiêu Chí 1</span>
                    </button>
                  </td>
                </tr>

                {/* 2 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>2</td>
                  <td>
                    <strong style={{ color: '#2563eb' }}>
                      Nhiều quy tắc xếp theo thứ tự ưu tiên, quy tắc đầu tiên khớp sẽ thắng
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • Quản lý danh sách quy tắc với các mức ưu tiên `#1, #2, #3, #4...`<br />
                    • Cung cấp nút <strong>"Lên ⬆" / "Xuống ⬇"</strong> để Giám đốc tùy chỉnh thứ tự ưu tiên.<br />
                    • <strong>Cơ chế First-Match-Wins:</strong> Lead duyệt lần lượt từ Rule #1. Khi khớp (ví dụ: Lead LD-301 vừa ở Miền Bắc vừa thuộc ngành CNTT, nhưng Rule #1 ưu tiên ngành CNTT cao hơn Rule #2 Miền Bắc), Rule #1 thắng ngay lập tức và giao cho Enterprise Sales!
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => { onClose(); onRunTest2(); }}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Tiêu Chí 2</span>
                    </button>
                  </td>
                </tr>

                {/* 3 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>3</td>
                  <td>
                    <strong style={{ color: '#d97706' }}>
                      Lead không khớp quy tắc nào rơi vào hàng chờ để trưởng nhóm phân tay
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • <strong>Hàng Chờ Phân Bổ (Unassigned Fallback Queue):</strong> Các Lead thuộc ngành mới (Năng lượng, Vận tải quốc tế...) không khớp bất kỳ Rule nào sẽ tự động rơi vào Hàng chờ.<br />
                    • <strong>Giao diện cho Trưởng nhóm:</strong> Nút <em>"Phân Bổ Tay"</em> mở modal <code>ManualAssignModal.jsx</code> cho phép Trưởng nhóm chọn nhân viên tiếp nhận, nhập ghi chú chỉ đạo và giao việc ngay.
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => { onClose(); onRunTest3(); }}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Tiêu Chí 3</span>
                    </button>
                  </td>
                </tr>

                {/* 4 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>4</td>
                  <td>
                    <strong style={{ color: '#16a34a' }}>
                      Phân bổ chạy nền, hoàn tất trong vòng 5 phút kể từ khi lead vào
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • Hệ thống giả lập <strong>Worker Chạy Nền (Background Routing Worker)</strong> hoạt động liên tục.<br />
                    • Mỗi Lead sau khi phân bổ đều có huy hiệu: <code>✓ Hoàn tất trong 45s (SLA &lt; 5 phút)</code>.<br />
                    • Có nút bấm <em>"+ Nạp Lead Mới & Chạy Nền"</em> để người dùng kiểm chứng tốc độ phân bổ tự động đến tay nhân viên chỉ trong tích tắc, không cần chờ họp giao ban!
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-sm"
                      style={{ background: '#16a34a', color: 'white', fontSize: '0.75rem', width: '100%' }}
                      onClick={() => { onClose(); onRunTest4(); }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Tiêu Chí 4</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
}
