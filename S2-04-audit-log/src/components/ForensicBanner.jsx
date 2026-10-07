import React from 'react';
import { AlertOctagon, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export function ForensicBanner({ isInvestigating, onToggleInvestigation }) {
  return (
    <div className={`forensic-alert-box ${isInvestigating ? 'investigating-active' : ''}`}>
      <div className="forensic-left">
        <div className="forensic-icon-wrap">
          <AlertOctagon size={24} className="forensic-icon" />
        </div>
        <div className="forensic-content">
          <div className="forensic-title-row">
            <h3 className="forensic-title">
              Cảnh Báo Đối Soát Cuối Quý 3/2024: Số liệu doanh thu không khớp 6.3 Tỷ VNĐ
            </h3>
            <span className="forensic-badge">Vụ việc kiểm toán</span>
          </div>
          <p className="forensic-desc">
            Phòng Kế toán & Kiểm soát tài chính phát hiện chênh lệch lớn giữa báo cáo sơ bộ ngày 28/09 và chốt sổ ngày 30/09. 
            Hệ thống tự động phát hiện <strong>4 hành vi can thiệp bất thường</strong> (sửa chiết khấu &gt; 25%, hạ chỉ tiêu 4.5 tỷ vào đêm 30/09, cấp quyền đặc cách).
          </p>
        </div>
      </div>

      <div className="forensic-right">
        <button
          type="button"
          className={`btn ${isInvestigating ? 'btn-warning-active' : 'btn-warning'}`}
          onClick={onToggleInvestigation}
        >
          {isInvestigating ? (
            <>
              <ShieldCheck size={16} />
              <span>Đang bật bộ lọc điều tra (Tắt)</span>
            </>
          ) : (
            <>
              <span>Truy vết sai lệch ngay</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
