import React from 'react';
import { 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ArrowUpDown, 
  Boxes, 
  FileSpreadsheet, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Scrum65GuideModal({
  isOpen,
  onClose,
  onNavigateTab
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <CheckCircle2 size={22} color="var(--success)" />
            <span>Hướng Dẫn Nghiệm Thu 3 Tiêu Chí Jira (SCRUM-65)</span>
          </div>
          <button 
            className="btn btn-outline btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {/* User story banner */}
          <div style={{ background: 'var(--bg-muted)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: 800 }}>
              User Story (SCRUM-17 / SCRUM-65):
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, fontStyle: 'italic', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
              "Là Giám đốc kinh doanh, tôi muốn khai báo các danh mục dùng chung của bán hàng, để cả khối gọi tên nguồn lead và ngành nghề giống nhau để báo cáo gộp được."
            </div>
          </div>

          {/* 3 Acceptance Criteria */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Tiêu chí 1 */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Boxes size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Tiêu chí 1: Ngành nghề khách hàng, quy mô doanh nghiệp, nguồn lead, loại hoạt động
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.45 }}>
                      • <strong>4 Danh mục chuẩn hóa:</strong> Đã khai báo đầy đủ 4 bộ danh mục dùng chung chuẩn cho toàn bộ tổ chức bán hàng.<br />
                      • <strong>Quản lý chi tiết:</strong> Cho phép Thêm mới, Sửa thông tin, Đặt mã code duy nhất, Chọn màu nhận diện trên biểu đồ, Đặt giá trị gợi ý mặc định, Chuyển trạng thái Đang áp dụng / Tạm ngưng.
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onNavigateTab('categories');
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>Kiểm tra →</span>
                </button>
              </div>
            </div>

            {/* Tiêu chí 2 */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Tiêu chí 2: Giá trị đang được tham chiếu thì không xoá được
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.45 }}>
                      • <strong>Bảo vệ toàn vẹn tham chiếu (Referential Integrity):</strong> Khi một mục danh mục đang được gắn với Khách hàng, Lead, Cơ hội hoặc Hoạt động bán hàng trong CRM, nút Xóa bị <strong>Khóa (Lock)</strong> và có badge cảnh báo đỏ.<br />
                      • <strong>Hộp thoại ngăn chặn vi phạm:</strong> Khi bấm vào biểu tượng khóa, hệ thống hiển thị bảng phân tích chi tiết bản ghi nào đang dùng.<br />
                      • <strong>3 Giải pháp hợp lệ:</strong> Tra cứu bản ghi, Chuyển sang "Tạm ngưng", hoặc "Gộp & Chuyển dữ liệu" sang mục khác.<br />
                      • <strong>Xóa an toàn:</strong> Đối với các mục có 0 tham chiếu (như <em>"Mục thử nghiệm ngành nghề mới"</em>), hệ thống cho phép xóa tự do với hộp thoại xác nhận.
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onNavigateTab('categories');
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>Thử xóa 🔒</span>
                </button>
              </div>
            </div>

            {/* Tiêu chí 3 */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ArrowUpDown size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Tiêu chí 3: Sắp xếp được thứ tự hiển thị
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.45 }}>
                      • <strong>Kéo thả (Drag & Drop):</strong> Giữ chuột vào biểu tượng 6 chấm (Grip) để kéo thả thay đổi vị trí trực tiếp.<br />
                      • <strong>Nút bấm Lên / Xuống:</strong> Dễ dàng di chuyển từng bước với nút mũi tên.<br />
                      • <strong>Sắp xếp thông minh:</strong> Nút sắp xếp theo A-Z, sắp xếp theo mức độ sử dụng nhiều nhất.<br />
                      • <strong>Widget Live CRM Preview:</strong> Hộp chọn mẫu ở chân trang phản ánh ngay lập tức thứ tự vừa sắp xếp trong thời gian thực.
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onNavigateTab('categories');
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>Kéo thả ⇅</span>
                </button>
              </div>
            </div>

            {/* Tính năng gia tăng: Báo cáo gộp */}
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Mục Đích Cuối: "...để cả khối gọi tên giống nhau để báo cáo gộp được"
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.45 }}>
                      • <strong>Báo cáo gộp bán hàng:</strong> Dashboard tổng hợp tự động doanh thu theo ngành nghề, số lượng lead theo nguồn, phân khúc quy mô khách hàng.<br />
                      • <strong>Bảng đối chiếu Trước & Sau:</strong> Thấy rõ bài toán dữ liệu bị phân mảnh trước khi chuẩn hóa và sự tiện lợi sau khi có danh mục dùng chung.
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    onClose();
                    onNavigateTab('reports');
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>Xem Báo Cáo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onClose}
          >
            Bắt Đầu Trải Nghiệm Ứng Dụng
          </button>
        </div>
      </div>
    </div>
  );
}
