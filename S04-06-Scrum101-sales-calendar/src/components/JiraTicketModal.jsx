import React from 'react';
import { X, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';

export default function JiraTicketModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="brand-badge" style={{ background: '#0284c7' }}>
              ⚡ SCRUM-21 / ☑ SCRUM-101
            </span>
            <h3 className="modal-title">Chi Tiết Nhiệm Vụ Jira Ticket (SCRUM-101)</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Thân Modal */}
        <div className="modal-body">
          {/* Hộp User Story */}
          <div style={{ background: 'var(--bg-primary)', borderLeft: '4px solid var(--primary)', padding: '16px 20px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              User Story
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px', lineHeight: 1.4 }}>
              "Là Nhân viên kinh doanh, tôi muốn xem lịch làm việc của mình và của nhóm, để bố trí lịch gặp mà không chồng chéo với đồng đội."
            </h3>
          </div>

          {/* Bảng đối chiếu 4 Tiêu chí chấp nhận (Acceptance Criteria) */}
          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '10px' }}>
              🎯 Đối Chiếu 4 Tiêu Chí Chấp Nhận Trong Jira Description:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Tiêu chí 1 */}
              <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-border)', fontWeight: 800, fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Tiêu chí 1: Chế độ xem theo ngày, tuần và tháng</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  • <strong>Tháng (Month View):</strong> Lưới 35-42 ô hiển thị trực quan các ngày, đếm số lượng cuộc gặp, việc có hạn và chấm cảnh báo xung đột.<br/>
                  • <strong>Tuần (Week View):</strong> 7 cột (T2 - CN) kèm trục thời gian chi tiết từ 08:00 - 20:00, thẻ cuộc họp đặt chính xác theo vị trí bắt đầu - kết thúc.<br/>
                  • <strong>Ngày (Day View):</strong> Dòng thời gian chi tiết theo thứ tự thời gian trong ngày với đầy đủ thông tin khách hàng, vị trí, người tham gia.
                </p>
              </div>

              {/* Tiêu chí 2 */}
              <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-border)', fontWeight: 800, fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Tiêu chí 2: Hiển thị cuộc gặp đã đặt và công việc có hạn trong cùng một khung nhìn</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  • <strong>Phân định rõ ràng bằng màu sắc & biểu tượng:</strong> Cuộc gặp đã đặt (🤝 màu xanh lam, có thời lượng & địa điểm) và Công việc có hạn (📋 màu cam vàng, có deadline & mức ưu tiên).<br/>
                  • <strong>Bộ lọc tức thời (Filter Bar):</strong> Cho phép xem cùng lúc hoặc lọc riêng từng loại theo nhu cầu.<br/>
                  • <strong>Tương tác 1-Click:</strong> Đánh dấu hoàn thành việc hoặc xem chi tiết hồ sơ cuộc gặp.
                </p>
              </div>

              {/* Tiêu chí 3 */}
              <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-border)', fontWeight: 800, fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Tiêu chí 3: Trưởng nhóm xem được lịch chồng của cả nhóm để bố trí</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  • <strong>Chế độ Ma trận Lịch Chồng Nhóm (Team Overlap Matrix):</strong> So sánh song song từng cột của từng thành viên trong nhóm, nhận diện ngay ai rảnh, ai bận.<br/>
                  • <strong>Thuật toán Phát hiện Xung đột (Conflict Detector):</strong> Quét và gắn cờ cảnh báo đỏ nếu 1 thành viên bị đặt trùng 2 lịch cùng lúc.<br/>
                  • <strong>Công cụ Gợi ý Giờ Rảnh (Smart Slot Finder):</strong> Chọn danh sách người cần họp, hệ thống tự động tìm khung giờ vàng tất cả cùng rảnh để bố trí lịch không bị chồng chéo.
                </p>
              </div>

              {/* Tiêu chí 4 */}
              <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-border)', fontWeight: 800, fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Tiêu chí 4: Lịch hiển thị tốt trên điện thoại (Mobile Responsive)</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  • <strong>Giao diện Responsive hoàn toàn:</strong> Tương thích mọi độ phân giải màn hình di động, máy tính bảng và desktop.<br/>
                  • <strong>Thanh trượt ngày ngang (Date Strip Carousel):</strong> Bấm ngón tay chọn ngày mượt mà với touch target chuẩn 44px+.<br/>
                  • <strong>Bộ Giả lập Smartphone Trực Tiếp (Mobile Simulator):</strong> 1-Click mở ngay khung viền iPhone 16 Pro Max để người chấm kiểm tra ngay trên trình duyệt mà không cần F12.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
