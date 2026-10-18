import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Eye,
  BellRing
} from 'lucide-react';
import { formatCompactCurrency } from '../utils/formatters';

export const RecipientWelcomeBanner = ({
  currentPersona,
  newlyAssignedDeals,
  onViewNewDeals,
  onAcknowledgeAll
}) => {
  // Chỉ hiển thị cho Sales Rep khi họ có deal mới nhận bàn giao
  if (currentPersona.role !== 'SALES_REP' || newlyAssignedDeals.length === 0) {
    return null;
  }

  const totalValue = newlyAssignedDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const previousReps = Array.from(
    new Set(newlyAssignedDeals.map((d) => d.reassignedFromName).filter(Boolean))
  ).join(', ');

  return (
    <div className="recipient-alert-banner">
      <div className="banner-left">
        <div className="banner-icon-box">
          <BellRing size={24} />
        </div>
        <div>
          <div className="banner-title">
            <span>🎉 Thông báo nhận bàn giao cơ hội mới ({newlyAssignedDeals.length} thương vụ)</span>
            <span className="badge badge-new-reassigned">Cập nhật tức thì (AC2)</span>
          </div>
          <div className="banner-subtitle">
            Xin chào <strong>{currentPersona.name}</strong>! Trưởng nhóm vừa phân bổ thêm <strong>{newlyAssignedDeals.length} cơ hội</strong> 
            {previousReps ? ` (bàn giao từ ${previousReps})` : ''} với tổng giá trị <strong>{formatCompactCurrency(totalValue)}</strong> vào danh mục của bạn. 
            Toàn bộ lịch sử trao đổi, liên hệ và hồ sơ báo giá đã được đồng bộ 100%.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
        <button 
          className="btn btn-sm btn-primary"
          onClick={onViewNewDeals}
        >
          <Eye size={15} />
          <span>Xem ngay</span>
        </button>
        <button 
          className="btn btn-sm btn-outline"
          onClick={onAcknowledgeAll}
          title="Xác nhận đã tiếp nhận và gỡ nhãn Mới nhận bàn giao"
        >
          <CheckCircle2 size={15} color="#10b981" />
          <span>Đã nhận bàn giao</span>
        </button>
      </div>
    </div>
  );
};
