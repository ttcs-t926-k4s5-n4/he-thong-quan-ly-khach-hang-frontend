import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Flame, 
  Sliders, 
  Edit3, 
  ShieldCheck, 
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
            <div className="modal-header-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div className="modal-title">Bảng Đối Chiếu 4 Tiêu Chí Nghiệm Thu (Acceptance Criteria)</div>
              <div className="modal-subtitle">
                User Story: Cấu Hình Chấm Điểm Lead & Ưu Tiên Cuộc Gọi Cho Telesales
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
          <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
              🎯 ĐỀ BÀI USER STORY CHÍNH THỨC (JIRA TICKET):
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              "Là Giám đốc kinh doanh, tôi muốn cấu hình chấm điểm lead theo tiêu chí khai báo được, để nhân viên gọi những lead có khả năng nhất trước."
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
                    <strong style={{ color: '#d97706' }}>
                      Khai báo tiêu chí và số điểm: ngành nghề phù hợp, quy mô doanh nghiệp, nguồn, mức độ quan tâm
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • Cung cấp bảng quản trị <code>ScoringConfigPanel.jsx</code> dành riêng cho Giám đốc kinh doanh.<br />
                    • Khai báo đầy đủ 4 nhóm tiêu chí: <strong>Ngành nghề phù hợp</strong> (+25đ), <strong>Quy mô doanh nghiệp</strong> (+30đ), <strong>Nguồn lead</strong> (+25đ), <strong>Mức độ quan tâm</strong> (+30đ).<br />
                    • Cho phép Giám đốc tùy chỉnh số điểm của từng tùy chọn, thêm hoặc sửa điểm trực tiếp trên giao diện.
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-warning btn-sm"
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
                    <strong style={{ color: '#16a34a' }}>
                      Điểm được tính lại tự động khi thông tin lead thay đổi
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • Thuật toán <code>calculateLeadScore()</code> tự động kích hoạt tính lại trong thời gian thực (Reactive Recalculation).<br />
                    • Khi nhân viên cập nhật thông tin Lead (đổi ngành, đổi quy mô, cập nhật mức quan tâm sau cuộc gọi): Điểm số lập tức thay đổi ngay trong mili-giây!<br />
                    • Cung cấp modal <code>QuickEditLeadModal.jsx</code> hiển thị Live Score Preview (ví dụ: chuyển từ 30đ lên 85đ khi nâng mức quan tâm).
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-sm"
                      style={{ background: '#16a34a', color: 'white', fontSize: '0.75rem', width: '100%' }}
                      onClick={() => { onClose(); onRunTest2(); }}
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
                    <strong style={{ color: '#e11d48' }}>
                      Phân loại Nóng, Ấm, Lạnh theo ngưỡng điểm khai báo được
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • Giám đốc kinh doanh có thể tùy chỉnh ngưỡng điểm trên thanh trượt:<br />
                    &nbsp;&nbsp;- <strong>🔥 NÓNG (HOT):</strong> &ge; 70 điểm (gọi ngay trong 30 phút).<br />
                    &nbsp;&nbsp;- <strong>☀️ ẤM (WARM):</strong> 40 - 69 điểm (gọi trong ngày).<br />
                    &nbsp;&nbsp;- <strong>❄️ LẠNH (COLD):</strong> &lt; 40 điểm (nuôi dưỡng email).<br />
                    • Khi kéo đổi ngưỡng (ví dụ: nâng ngưỡng Nóng lên 80): Toàn bộ danh sách Lead được tự động tái phân loại tương ứng ngay lập tức!
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-sm"
                      style={{ background: '#e11d48', color: 'white', fontSize: '0.75rem', width: '100%' }}
                      onClick={() => { onClose(); onRunTest3(); }}
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
                    <strong style={{ color: '#0284c7' }}>
                      Điểm chỉ để sắp xếp ưu tiên, không tự động loại lead
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    • Bảng danh sách mặc định sắp xếp theo <strong>Hàng đợi cuộc gọi ưu tiên (Rank #1, #2...)</strong> từ điểm cao đến điểm thấp.<br />
                    • <strong>Bảo toàn 100% Leads:</strong> Ngay cả Lead Lạnh (điểm thấp nhất 15-20đ) vẫn hiển thị đầy đủ trên CRM, vẫn có nhân viên phụ trách, nút gọi và nút ghi chú.<br />
                    • Hệ thống tuyệt đối không tự động xóa hay loại bỏ bất kỳ Lead nào khỏi cơ sở dữ liệu!
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-sm"
                      style={{ background: '#0284c7', color: 'white', fontSize: '0.75rem', width: '100%' }}
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
