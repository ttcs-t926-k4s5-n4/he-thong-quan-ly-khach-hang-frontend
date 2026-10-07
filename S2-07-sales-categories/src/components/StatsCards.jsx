import React from 'react';
import { 
  Boxes, 
  CheckCircle, 
  ShieldCheck, 
  Trash2,
  TrendingUp
} from 'lucide-react';

export default function StatsCards({ 
  categoryItems, 
  operationalData, 
  usageMaps 
}) {
  // Tính tổng số mục
  let totalItemsCount = 0;
  let activeItemsCount = 0;
  let referencedItemsCount = 0;
  let zeroRefItemsCount = 0;

  Object.keys(categoryItems).forEach(catId => {
    const items = categoryItems[catId] || [];
    const usage = usageMaps[catId] || {};

    items.forEach(item => {
      totalItemsCount++;
      if (item.isActive) activeItemsCount++;
      const refs = usage[item.id] || 0;
      if (refs > 0) {
        referencedItemsCount++;
      } else {
        zeroRefItemsCount++;
      }
    });
  });

  const totalCrmRecords = 
    (operationalData.customers?.length || 0) +
    (operationalData.leads?.length || 0) +
    (operationalData.deals?.length || 0) +
    (operationalData.activities?.length || 0);

  return (
    <div className="stats-grid">
      {/* Thẻ 1: 4 Danh mục dùng chung */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
          <Boxes size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Danh mục chuẩn hóa</span>
          <div className="stat-value">4 Khối</div>
          <span className="stat-subtext">Ngành nghề, Quy mô, Nguồn Lead, Hoạt động</span>
        </div>
      </div>

      {/* Thẻ 2: Tổng số mục đang hoạt động */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <CheckCircle size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Tổng số mục khai báo</span>
          <div className="stat-value">{totalItemsCount} Mục</div>
          <span className="stat-subtext">{activeItemsCount} mục đang kích hoạt (Active)</span>
        </div>
      </div>

      {/* Thẻ 3: Toàn vẹn tham chiếu dữ liệu */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
          <ShieldCheck size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Khóa xóa do tham chiếu</span>
          <div className="stat-value">{referencedItemsCount} Mục</div>
          <span className="stat-subtext">Được bảo vệ bởi {totalCrmRecords} bản ghi CRM</span>
        </div>
      </div>

      {/* Thẻ 4: Các mục có thể xóa an toàn (0 tham chiếu) */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
          <Trash2 size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Cho phép xóa an toàn</span>
          <div className="stat-value">{zeroRefItemsCount} Mục</div>
          <span className="stat-subtext">0 tham chiếu (Dùng để kiểm thử xóa tự do)</span>
        </div>
      </div>
    </div>
  );
}
