import React from 'react';
import { 
  Building2, 
  Users2, 
  Compass, 
  CalendarCheck2, 
  Layers
} from 'lucide-react';

const ICON_MAP = {
  Building2,
  Users2,
  Compass,
  CalendarCheck2,
  Layers
};

export default function CategoryNavCards({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory, 
  categoryItems,
  usageMaps
}) {
  return (
    <div className="category-subnav-grid">
      {categories.map((cat, idx) => {
        const IconComponent = ICON_MAP[cat.iconName] || Layers;
        const items = categoryItems[cat.id] || [];
        const activeCount = items.filter(i => i.isActive).length;
        const isSelected = selectedCategoryId === cat.id;

        return (
          <div
            key={cat.id}
            id={`category-card-${cat.id}`}
            className={`category-subnav-card ${isSelected ? 'active' : ''}`}
            style={{ '--cat-accent': cat.color }}
            onClick={() => onSelectCategory(cat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectCategory(cat.id); }}
          >
            <div className="cat-card-header">
              <div 
                className="cat-card-icon" 
                style={{ background: cat.color }}
              >
                <IconComponent size={20} />
              </div>
              <span className="cat-card-badge">
                STT 0{idx + 1}
              </span>
            </div>

            <div className="cat-card-title">{cat.name}</div>
            <div className="cat-card-desc">{cat.description}</div>

            <div className="cat-card-footer">
              <span><strong>{items.length}</strong> mục ({activeCount} áp dụng)</span>
              <span style={{ color: cat.color, fontWeight: 700 }}>
                {isSelected ? 'Đang chọn ●' : 'Xem & Sắp xếp →'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
