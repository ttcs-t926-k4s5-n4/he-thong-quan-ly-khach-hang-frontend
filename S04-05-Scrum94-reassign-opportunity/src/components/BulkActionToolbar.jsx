import React from 'react';
import { 
  CheckSquare, 
  ArrowLeftRight, 
  Sparkles, 
  X,
  Zap,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const BulkActionToolbar = ({
  selectedDealIds,
  selectedDeals,
  onOpenBulkReassignModal,
  onOpenAutoBalanceModal,
  onClearSelection
}) => {
  if (!selectedDealIds || selectedDealIds.length === 0) {
    return null;
  }

  const totalValue = selectedDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="bulk-toolbar">
      <div className="bulk-toolbar-info">
        <div className="bulk-count-badge">
          <CheckSquare size={16} />
          <span>Đã chọn {selectedDealIds.length} cơ hội</span>
        </div>
        <div className="bulk-value-text">
          Tổng giá trị chuyển giao: <strong>{formatCurrency(totalValue)}</strong>
        </div>
      </div>

      <div className="bulk-toolbar-actions">
        {/* Nút Phân bổ chỉ định 1 người */}
        <button 
          className="btn btn-primary"
          onClick={onOpenBulkReassignModal}
        >
          <ArrowLeftRight size={16} />
          <span>Phân bổ lại cho 1 người</span>
        </button>

        {/* Nút Cân bằng tải tự động cho nhiều người */}
        <button 
          className="btn btn-success"
          onClick={onOpenAutoBalanceModal}
          title="Tự động chia đều các deal cho những thành viên còn rảnh tải"
        >
          <Zap size={16} />
          <span>Cân bằng tải tự động</span>
        </button>

        {/* Nút Hủy chọn */}
        <button 
          className="btn btn-outline"
          onClick={onClearSelection}
          title="Bỏ chọn tất cả"
        >
          <X size={16} />
          <span>Bỏ chọn</span>
        </button>
      </div>
    </div>
  );
};
