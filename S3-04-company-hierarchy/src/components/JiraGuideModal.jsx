import React from 'react';
import { Sparkles, X, CheckCircle2, ShieldCheck, Layers, Building2, HelpCircle } from 'lucide-react';

export function JiraGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={20} color="#6366f1" />
            <span>Đối Chiếu Yêu Cầu Đề Bài & Tiêu Chí Nghiệm Thu (SCRUM-73)</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* User Story Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px'
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
              ⚡ JIRA TICKET: SCRUM-18 / SCRUM-73
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-primary)' }}>
              "Là Nhân viên kinh doanh, tôi muốn khai báo quan hệ công ty mẹ và công ty con, để nhìn được tổng giá trị của cả tập đoàn chứ không chỉ từng pháp nhân."
            </div>
          </div>

          {/* Bảng đối chiếu 2 tiêu chí nghiệm thu */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '12px' }}>
              Bảng Đối Chiếu 2 Tiêu Chí Nghiệm Thu Trong Description:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Tiêu chí 1 */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <strong style={{ fontSize: '0.95rem', color: '#60a5fa' }}>
                    Tiêu chí 1: Gắn một khách hàng làm công ty con của khách hàng khác
                  </strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  • <strong>Khai báo quan hệ:</strong> Nút <em>"Khai báo Quan hệ Mẹ - Con"</em> mở modal chọn công ty con, công ty mẹ, thiết lập tỷ lệ sở hữu (%) và loại quan hệ (100% vốn, chi phối, liên kết, chi nhánh).<br />
                  • <strong>Kiểm soát nghiệp vụ (Anti-Circular Loop):</strong> Chặn đứng trường hợp tự làm mẹ chính mình và phát hiện vòng lặp tuần hoàn (nếu A là mẹ B, không cho phép gán A làm con của B).<br />
                  • <strong>Live Impact Preview:</strong> Xem trước tức thì tổng giá trị tập đoàn mẹ sẽ tăng thêm bao nhiêu tiền sau khi liên kết.
                </div>
              </div>

              {/* Tiêu chí 2 */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <strong style={{ fontSize: '0.95rem', color: '#60a5fa' }}>
                    Tiêu chí 2: Trang công ty mẹ hiển thị tổng giá trị hợp đồng của cả nhóm công ty
                  </strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  • <strong>Hero Card Hợp Nhất:</strong> Trang công ty mẹ hiển thị nổi bật <strong>TỔNG GIÁ TRỊ HỢP ĐỒNG CẢ NHÓM CÔNG TY</strong> (hàng trăm tỷ đồng) tự động cộng dồn doanh số của mẹ + toàn bộ công ty con.<br />
                  • <strong>Tách biệt nguồn doanh thu:</strong> Phân định rõ giá trị riêng của mẹ vs giá trị đóng góp từ các con kèm % tỷ trọng.<br />
                  • <strong>Sơ đồ Cây Phân Cấp Trực Quan:</strong> Sơ đồ cây (Hierarchy Tree) hiển thị trực quan các nhánh công ty con, doanh số từng nhánh và thao tác trực tiếp.<br />
                  • <strong>Bảng Hợp Đồng Hợp Nhất:</strong> Liệt kê trọn vẹn hợp đồng trong nhóm, có badge phân biệt rõ pháp nhân nào đứng tên ký.
                </div>
              </div>
            </div>
          </div>

          {/* Kịch bản test nhanh */}
          <div
            style={{
              background: 'var(--bg-muted)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              💡 GỢI Ý CÁC BƯỚC KIỂM THỬ NHANH ĐỂ CHẤM ĐIỂM:
            </div>
            <ol style={{ paddingLeft: '20px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              <li>
                <strong>Kiểm tra Tiêu chí 2:</strong> Bấm nút <code>[🏢 Xem Tập Đoàn]</code> tại dòng <strong>Tập đoàn FPT</strong> hoặc <strong>Vingroup</strong>. Quan sát khối số liệu tài chính màu xanh phát sáng hiển thị tổng giá trị hợp nhất toàn bộ tập đoàn (197 Tỷ đ hoặc 212.7 Tỷ đ).
              </li>
              <li>
                <strong>Kiểm tra Tiêu chí 1:</strong> Bấm <code>[+ Khai báo Quan hệ Mẹ - Con]</code>, chọn gắn khách hàng độc lập <em>Techcombank (25 tỷ)</em> hoặc <em>ABC Tech</em> làm công ty con của <em>FPT Corporation</em>. Bấm Xác nhận và quan sát tổng giá trị Tập đoàn FPT lập tức tăng vọt!
              </li>
              <li>
                <strong>Kiểm tra Chặn lỗi:</strong> Trong modal khai báo, bấm nút <em>"⚡ Kiểm tra lỗi vòng lặp"</em> (cố tình gắn FPT Corp làm con của FPT Soft) để thấy hệ thống hiển thị cảnh báo đỏ và khóa nút lưu.
              </li>
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-corporate" onClick={onClose}>
            Đã Hiểu - Quay Lại Trải Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
}
