import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  GitMerge, 
  PlayCircle,
  ExternalLink
} from 'lucide-react';

export default function JiraGuideModal({ 
  onClose,
  onRunScenario1,
  onRunScenario2,
  onRunScenario3
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div className="modal-title">Bảng Đối Chiếu Tiêu Chí Nghiệm Thu (Acceptance Criteria)</div>
              <div className="modal-subtitle">
                User Story: Marketing Lead Deduplication & Call Conflict Prevention
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
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase' }}>
              🎯 ĐỀ BÀI USER STORY CHÍNH THỨC:
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              "Là Nhân viên Marketing, tôi muốn được cảnh báo và gộp lead trùng, để không để hai nhân viên cùng gọi một người trong một buổi sáng."
            </div>
          </div>

          {/* Table of 3 Acceptance Criteria */}
          <div style={{ overflowX: 'auto' }}>
            <table className="leads-table" style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>STT</th>
                  <th style={{ width: '220px' }}>Tiêu Chí Trong Jira Ticket</th>
                  <th>Giải Pháp Kỹ Thuật Đã Triển Khai Trong React</th>
                  <th style={{ width: '160px', textAlign: 'center' }}>Thử Nghiệm Nhanh</th>
                </tr>
              </thead>
              <tbody>
                {/* Tiêu chí 1 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>1</td>
                  <td>
                    <strong style={{ color: 'var(--danger-600)' }}>
                      Phát hiện trùng theo email, số điện thoại và tên công ty
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • <strong>Email Matcher:</strong> Chuẩn hóa trim, lowercase; so khớp chính xác.<br />
                    • <strong>Phone Matcher:</strong> Chuẩn hóa loại bỏ ký tự lạ, chuyển tiền tố <code>+84</code> → <code>0</code>, đối soát đồng nhất 10 số.<br />
                    • <strong>Company Matcher:</strong> Chuẩn hóa loại bỏ từ dừng pháp lý (Cổ phần, TNHH, Corp...) kết hợp thuật toán so khớp Levenshtein Distance & Token Jaccard Similarity.<br />
                    • <strong>Cảnh Báo Xung Đột Cuộc Gọi Buổi Sáng:</strong> Phát hiện Lead #LD-102 trùng SĐT với Lead #LD-101 (đã có Telesales Hoàng Tuấn gọi lúc 08:30 sáng nay). Lập tức bắn banner và badge đỏ chặn gọi trùng!<br />
                    • <strong>Live Scanner:</strong> Quét tự động ngay khi gõ phím trên form thêm Lead mới.
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => { onClose(); onRunScenario1(); }}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Kịch Bản 1</span>
                    </button>
                  </td>
                </tr>

                {/* Tiêu chí 2 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>2</td>
                  <td>
                    <strong style={{ color: '#7c3aed' }}>
                      Lead trùng với khách hàng đã có được gợi ý gắn thẳng vào khách hàng đó
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • <strong>Đối Soát CSDL Khách Hàng:</strong> Tự động đối chiếu Lead mới với danh mục Khách hàng VIP đã có trong CRM (FPT, Viettel, Vinamilk...).<br />
                    • <strong>Huy Hiệu Gợi Ý:</strong> Gắn nhãn tím <code>🏢 TRÙNG KHÁCH HÀNG: KH-001 (FPT)</code>.<br />
                    • <strong>Modal Gắn Vào Khách Hàng:</strong> Nút <em>"Gắn Vào KH"</em> cho phép chuyển Lead thành Người liên hệ mới (Contact) hoặc Cơ hội mua thêm (Upsell Deal) của Khách hàng hiện tại.<br />
                    • Tự động chuyển giao toàn bộ lịch sử tư vấn và thông báo cho Sales phụ trách tài khoản (Key Account Manager).
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-sm"
                      style={{ background: '#7c3aed', color: 'white', fontSize: '0.75rem', width: '100%' }}
                      onClick={() => { onClose(); onRunScenario2(); }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Kịch Bản 2</span>
                    </button>
                  </td>
                </tr>

                {/* Tiêu chí 3 */}
                <tr>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>3</td>
                  <td>
                    <strong style={{ color: 'var(--primary-600)' }}>
                      Gộp giữ nguyên lịch sử của cả hai bản ghi
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • <strong>Màn Hình So Sánh Song Song:</strong> Dual-Pane Side-by-Side so sánh trực quan Master vs Secondary.<br />
                    • <strong>Hoán Đổi Vai Trò:</strong> Nút <em>"Swap ⇄"</em> cho phép đổi vị trí Master/Duplicate chỉ với 1 click.<br />
                    • <strong>Giải Quyết Xung Đột Trường:</strong> Tự do chọn giữ trường dữ liệu tốt nhất của bên A hoặc bên B.<br />
                    • <strong>Bảo Toàn 100% Lịch Sử (Unified Timeline):</strong> Tích hợp trọn vẹn mọi cuộc gọi, ghi chú, email của cả hai bên theo thứ tự thời gian, gắn nhãn nguồn gốc <code>[Gốc từ Lead #LD-101]</code> và <code>[Gốc từ Lead #LD-102]</code>.
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => { onClose(); onRunScenario3(); }}
                      style={{ fontSize: '0.75rem', width: '100%' }}
                    >
                      <PlayCircle size={14} />
                      <span>Thử Kịch Bản 3</span>
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
