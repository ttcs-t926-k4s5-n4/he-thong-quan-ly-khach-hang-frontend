import React from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  GitMerge, 
  ArrowRight,
  Building2,
  Clock
} from 'lucide-react';

export default function DuplicateAlertBanner({ 
  morningConflictCount = 0,
  duplicateLeadCount = 0,
  customerMatchCount = 0,
  conflictPair = null,
  onResolveConflict,
  onFilterDuplicates,
  onFilterCustomerMatches
}) {
  if (morningConflictCount === 0 && duplicateLeadCount === 0 && customerMatchCount === 0) {
    return null;
  }

  return (
    <div className="conflict-alert-banner" role="alert">
      <div className="alert-content-left">
        <div className="alert-icon-box">
          <PhoneCall size={20} />
        </div>
        <div>
          <div className="alert-title">
            <ShieldAlert size={18} />
            <span>
              {morningConflictCount > 0 
                ? "CẢNH BÁO NGUY CẤP: NGUY CƠ 2 NHÂN VIÊN CÙNG GỌI MỘT NGƯỜI TRONG BUỔI SÁNG!"
                : "PHÁT HIỆN DỮ LIỆU LEAD TRÙNG LẶP CẦN XỬ LÝ GỘP"}
            </span>
          </div>

          <div className="alert-description">
            {morningConflictCount > 0 && conflictPair ? (
              <span>
                Phát hiện <strong>{conflictPair.leadB.fullName} ({conflictPair.leadB.code})</strong> trùng SĐT/Email với <strong>{conflictPair.leadA.fullName} ({conflictPair.leadA.code})</strong>. 
                Nhân viên <strong>{conflictPair.callerName}</strong> đã thực hiện cuộc gọi lúc <strong>{conflictPair.callTime}</strong>! 
                Nhân viên <strong>{conflictPair.secondStaff}</strong> đang được phân công Lead trùng và chuẩn bị gọi lại. 
                Hãy gộp ngay để bảo vệ trải nghiệm khách hàng!
              </span>
            ) : (
              <span>
                Hệ thống phát hiện có <strong>{duplicateLeadCount}</strong> cặp Lead trùng thông tin liên hệ và <strong>{customerMatchCount}</strong> Lead trùng với Khách hàng doanh nghiệp đã có trong CRM.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="alert-actions">
        {morningConflictCount > 0 && conflictPair && (
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onResolveConflict(conflictPair.leadA, conflictPair.leadB)}
            title="Mở màn hình so sánh và gộp ngay cặp lead xung đột này"
          >
            <GitMerge size={15} />
            <span>Gộp Ngay Cặp Xung Đột</span>
          </button>
        )}

        {duplicateLeadCount > 0 && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onFilterDuplicates}
          >
            <span>Xem {duplicateLeadCount} Lead Trùng</span>
          </button>
        )}

        {customerMatchCount > 0 && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onFilterCustomerMatches}
            style={{ color: '#7c3aed', borderColor: '#ddd6fe' }}
          >
            <Building2 size={14} />
            <span>{customerMatchCount} Trùng KH Đã Có</span>
          </button>
        )}
      </div>
    </div>
  );
}
