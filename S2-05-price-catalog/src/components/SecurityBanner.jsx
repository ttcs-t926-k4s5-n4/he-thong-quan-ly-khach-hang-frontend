import React from 'react';
import { Crown, UserCheck, ShieldAlert, Lock, Unlock, CheckCircle } from 'lucide-react';

export default function SecurityBanner({ currentRole }) {
  if (currentRole === 'director') {
    return (
      <div className="security-banner director">
        <div className="security-banner-content">
          <Crown size={20} />
          <div>
            <strong>Quyền Hạn Giám Đốc Kinh Doanh:</strong> Bạn có quyền xem và chỉnh sửa{' '}
            <span className="security-pill">Giá vốn (Cost Price)</span>, theo dõi Biên lợi nhuận gộp (Margin %), và phê duyệt các báo giá có đơn giá dưới{' '}
            <span className="security-pill">Giá sàn (Floor Price)</span>.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem' }}>
          <Unlock size={15} />
          <span>Đã mở khóa Giá vốn</span>
        </div>
      </div>
    );
  }

  return (
    <div className="security-banner sales_rep">
      <div className="security-banner-content">
        <Lock size={19} />
        <div>
          <strong>Quyền Hạn Nhân Viên Kinh Doanh:</strong> Theo chính sách bảo mật nội bộ,{' '}
          <span className="security-pill">Giá vốn được ẩn hoàn toàn</span> (chỉ GĐKD xem & sửa). Mọi báo giá bắt buộc lấy từ{' '}
          <span className="security-pill">Bảng giá niêm yết chuẩn</span> thay vì giá tự nghĩ. Đơn giá dưới Giá sàn sẽ tự động chuyển phê duyệt.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem' }}>
        <ShieldAlert size={15} />
        <span>Bảo mật Giá vốn: ĐANG BẬT</span>
      </div>
    </div>
  );
}
