import React from 'react';
import { X, BookOpen, CheckCircle, ShieldCheck, GitMerge, Users, Lock, Sparkles } from 'lucide-react';

export function JiraGuideModal({ onClose }) {
  const criteria = [
    {
      num: 1,
      title: 'Phát hiện trùng theo mã số thuế, tên công ty gần giống và website',
      desc: 'Hệ thống áp dụng thuật toán đối soát 3 tiêu chí:',
      points: [
        'Mã số thuế: Chuẩn hóa bỏ khoảng trắng, dấu gạch nối. So khớp 100% hoặc 10 số đầu của chi nhánh.',
        'Tên công ty gần giống: Chuẩn hóa bỏ từ dừng pháp lý (Cổ phần, TNHH, Corp...) và tính khoảng cách Levenshtein + Jaccard tokens (ngưỡng tương đồng >= 70%).',
        'Website: Chuẩn hóa bỏ protocol (http/https), www, trailing slash để so khớp domain gốc.',
        'Tích hợp Live Simulator khi thêm khách hàng mới: Cảnh báo ngay trong lúc người dùng đang gõ phím!'
      ],
      icon: GitMerge,
      color: '#3b82f6'
    },
    {
      num: 2,
      title: 'Hiển thị so sánh cạnh nhau trước khi gộp (Side-by-side)',
      desc: 'Màn hình đối soát song song trực quan 2 cột:',
      points: [
        'Cột trái (Master Record) vs Cột phải (Secondary Record) kèm điểm tin cậy xung đột (%).',
        'Nút hoán đổi (Swap button) 1 chạm để chuyển đổi linh hoạt vai trò giữa 2 hồ sơ.',
        'Bộ giải quyết xung đột từng trường (Field conflict resolution): Người dùng có thể click chọn giữ giá trị của bên A hay bên B cho từng dòng thông tin (Tên, MST, Website, SĐT, Địa chỉ...).',
        'Xem trước trực tiếp kết quả hợp nhất trước khi bấm xác nhận.'
      ],
      icon: Users,
      color: '#8b5cf6'
    },
    {
      num: 3,
      title: 'Gộp giữ lại toàn bộ người liên hệ, cơ hội và hoạt động của cả hai bản ghi',
      desc: 'Bảo toàn tuyệt đối 100% dữ liệu liên đới:',
      points: [
        'Người liên hệ (Contacts): Giữ trọn vẹn toàn bộ danh bạ từ cả 2 bản ghi, gắn nhãn nguồn gốc (Từ [KH-001] / Từ [KH-002]).',
        'Cơ hội bán hàng (Deals): Giữ nguyên mọi Deal đang triển khai, cộng dồn tổng giá trị Pipeline bán hàng.',
        'Hoạt động (Activities): Hợp nhất toàn bộ cuộc gọi, buổi họp, email, báo giá vào dòng thời gian thống nhất (Unified Activity Timeline) có ghi rõ người thực hiện.',
        'Mô hình cộng tác sau gộp: Phân bổ 1 bạn làm Đầu mối chính (Primary Owner) và bạn còn lại làm Đồng phụ trách (Co-Owner) để cùng phối hợp, tránh cạnh tranh nội bộ.'
      ],
      icon: Sparkles,
      color: '#10b981'
    },
    {
      num: 4,
      title: 'Chỉ Trưởng nhóm trở lên được thực hiện gộp',
      desc: 'Cơ chế kiểm soát phân quyền chặt chẽ (RBAC):',
      points: [
        'Bộ chuyển đổi vai trò (Role Switcher) ngay trên thanh Header cho phép kiểm thử tức thì.',
        'Nhân viên kinh doanh (SALES_REP): Được xem cảnh báo, xem so sánh nhưng NÚT GỘP BỊ KHÓA HOÀN TOÀN (Disabled 🔒). Cung cấp tính năng "Gửi yêu cầu gộp cho Trưởng nhóm".',
        'Trưởng nhóm kinh doanh (TEAM_LEAD): Toàn quyền phê duyệt và thực thi gộp.',
        'Giám đốc kinh doanh (SALES_DIRECTOR): Toàn quyền quản trị, có thể xem lại nhật ký kiểm toán (Merge Audit Trail).'
      ],
      icon: Lock,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h3>
              <BookOpen size={22} style={{ color: 'var(--primary)' }} />
              <span>Bảng Đối Chiếu 4 Tiêu Chí Nghiệm Thu Jira (SCRUM-18 / SCRUM-72)</span>
            </h3>
            <p>User Story: "Là Trưởng nhóm kinh doanh, tôi muốn được cảnh báo và gộp khách hàng trùng, để hai nhân viên không cùng chào một công ty mà không biết nhau."</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {criteria.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1.25rem'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${item.color}25`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                      <CheckCircle size={12} />
                      Tiêu chí {item.num}
                    </span>
                    <strong style={{ fontSize: '0.975rem', color: 'var(--text-primary)' }}>{item.title}</strong>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {item.desc}
                  </p>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {item.points.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Đã đáp ứng đầy đủ 100% các tiêu chí trong hình ảnh đề bài yêu cầu.
          </div>
          <button className="btn-pill btn-primary" onClick={onClose}>
            Đã hiểu & Bắt đầu trải nghiệm
          </button>
        </div>
      </div>
    </div>
  );
}
