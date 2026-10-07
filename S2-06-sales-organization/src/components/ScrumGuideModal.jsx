import React from 'react';
import { 
  X, 
  CheckCircle2, 
  FolderTree, 
  Users, 
  Eye, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Crown
} from 'lucide-react';

export default function ScrumGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
              <FolderTree size={20} />
            </div>
            <div>
              <h3 className="modal-title">Hướng Dẫn Nghiệm Thu Đề Bài SCRUM-64</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Khai báo cơ cấu tổ chức kinh doanh & phân quyền dữ liệu theo phân cấp cây
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {/* User Story Box */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
              User Story Nghiệp Vụ
            </span>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '4px', fontStyle: 'italic', color: 'var(--text-primary)' }}>
              "Là Giám đốc kinh doanh, tôi muốn khai báo cơ cấu tổ chức kinh doanh, để phạm vi dữ liệu của trưởng nhóm bám đúng cây tổ chức thật."
            </p>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: '800', marginTop: '10px' }}>
            Chi Tiết Nghiệm Thu 4 Tiêu Chí Trong Đề Bài (Description):
          </h4>

          {/* Tiêu chí 1 */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-blue)' }} />
              <h5 style={{ fontSize: '0.92rem', fontWeight: '700' }}>
                1. Nhóm kinh doanh có cấu trúc cây, mỗi nhóm có một trưởng nhóm
              </h5>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '24px', lineHeight: '1.6' }}>
              <li><strong>Cấu trúc cây:</strong> Cấp 0 (Ban Giám Đốc) &rarr; Cấp 1 (Khối Vùng) &rarr; Cấp 2 (Chi Nhánh) &rarr; Cấp 3 (Nhóm Chuyên Trách).</li>
              <li><strong>Trưởng nhóm duy nhất:</strong> Mỗi nhóm hiển thị rõ Trưởng nhóm (⭐ Leader) với thông tin liên hệ. Form tạo/sửa nhóm bắt buộc chọn đúng một trưởng nhóm từ nhân sự.</li>
              <li><strong>Cách test:</strong> Mở Tab <strong>"1. Sơ Đồ Cây Tổ Chức"</strong>, quan sát sơ đồ cây có đường nối trực quan, bấm "Thêm nhóm con" hoặc sửa nhóm để chỉ định trưởng nhóm.</li>
            </ul>
          </div>

          {/* Tiêu chí 2 */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h5 style={{ fontSize: '0.92rem', fontWeight: '700' }}>
                2. Mỗi nhân viên thuộc đúng một nhóm tại một thời điểm
              </h5>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '24px', lineHeight: '1.6' }}>
              <li><strong>Ràng buộc đơn nhóm:</strong> Nhân viên chỉ liên kết với duy nhất 1 <code>teamId</code>. Không bao giờ tồn tại nhân viên thuộc 2 phòng ban cùng lúc.</li>
              <li><strong>Chức năng Điều chuyển (Transfer):</strong> Khi nhân viên chuyển nhóm, hệ thống tự động ngắt kết nối khỏi nhóm cũ, gia nhập nhóm mới và lưu vết vào Lịch sử điều chuyển.</li>
              <li><strong>Cách test:</strong> Mở Tab <strong>"2. Quản Lý Nhân Sự"</strong>, bấm nút <strong>"Điều chuyển"</strong> cạnh bất kỳ nhân viên nào, chọn nhóm mới và xác nhận. Bấm xem sub-tab "Lịch Sử Điều Chuyển" để kiểm tra vết audit log.</li>
            </ul>
          </div>

          {/* Tiêu chí 3 */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
              <h5 style={{ fontSize: '0.92rem', fontWeight: '700' }}>
                3. Cây tổ chức này quyết định phạm vi dữ liệu mà Trưởng nhóm nhìn thấy
              </h5>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '24px', lineHeight: '1.6' }}>
              <li><strong>Quy tắc đệ quy cây con (Subtree Scope):</strong>
                <br />&bull; <strong>Giám đốc toàn quốc (Root):</strong> Thấy 100% dữ liệu toàn công ty (13 cơ hội ~ 15,8 Tỷ ₫).
                <br />&bull; <strong>Giám đốc Vùng Miền Bắc:</strong> Chỉ thấy các cơ hội và nhân viên thuộc nhánh Miền Bắc (Hà Nội, Hải Phòng). Bị khóa dữ liệu Miền Nam và Miền Trung!
                <br />&bull; <strong>Trưởng nhóm SME Hà Nội:</strong> Chỉ thấy cơ hội của nhóm SME Hà Nội.
                <br />&bull; <strong>Nhân viên kinh doanh thường:</strong> Chỉ thấy cơ hội do chính mình phụ trách (My Data Only).
              </li>
              <li><strong>Cách test:</strong> Mở Tab <strong>"4. Mô Phỏng Phạm Vi Dữ Liệu"</strong> (hoặc đổi dropdown "Góc nhìn người dùng" trên thanh Header), bấm chọn lần lượt qua 5 vai trò để chứng kiến bảng dữ liệu Khách hàng và Doanh số tự động co giãn theo cấp bậc.</li>
            </ul>
          </div>

          {/* Tiêu chí 4 */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-amber)' }} />
              <h5 style={{ fontSize: '0.92rem', fontWeight: '700' }}>
                4. Khai báo khu vực địa lý và gán khu vực cho nhóm
              </h5>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '24px', lineHeight: '1.6' }}>
              <li><strong>Khai báo khu vực:</strong> Quản lý danh mục vùng miền, tỉnh thành kinh tế trọng điểm (Mã, Tên, Tỉnh thành, Tiềm năng).</li>
              <li><strong>Gán địa bàn cho nhóm:</strong> Phân công trách nhiệm phát triển doanh số khu vực cho các nhóm kinh doanh. Cảnh báo khu vực chưa có nhóm phụ trách.</li>
              <li><strong>Cách test:</strong> Mở Tab <strong>"3. Quản Lý Khu Vực Địa Lý"</strong>, bấm "Khai Báo Khu Vực Mới" hoặc bấm nút "Gán Nhóm" để phân bổ thêm nhóm kinh doanh cho khu vực đó.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đã Hiểu & Bắt Đầu Trải Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
}
