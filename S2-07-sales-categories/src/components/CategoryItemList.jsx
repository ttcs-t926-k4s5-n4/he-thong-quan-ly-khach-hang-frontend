import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpDown, 
  Check, 
  X, 
  Eye, 
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function CategoryItemList({
  category,
  items,
  usageMap,
  onAddNew,
  onEdit,
  onDeleteRequest,
  onToggleActive,
  onReorderItems,
  onSortAlphabetical,
  onSortByUsage,
  onResetOrder,
  onInspectReferences
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [refFilter, setRefFilter] = useState('ALL'); // 'ALL' | 'REFERENCED' | 'ZERO_REF'

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Filtered Items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && item.isActive) ||
      (statusFilter === 'INACTIVE' && !item.isActive);

    const refCount = usageMap[item.id] || 0;
    const matchesRef =
      refFilter === 'ALL' ||
      (refFilter === 'REFERENCED' && refCount > 0) ||
      (refFilter === 'ZERO_REF' && refCount === 0);

    return matchesSearch && matchesStatus && matchesRef;
  });

  // Reorder single item up/down
  const handleMove = (indexInCurrentList, direction) => {
    const itemToMove = filteredItems[indexInCurrentList];
    const originalIndex = items.findIndex(i => i.id === itemToMove.id);
    if (originalIndex === -1) return;

    const newIndex = direction === 'up' ? originalIndex - 1 : originalIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(originalIndex, 1);
    reordered.splice(newIndex, 0, moved);

    // Update sortOrder values to 1..N
    const updated = reordered.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1
    }));

    onReorderItems(category.id, updated);
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent ghost image style
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    // Keep clean
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1
    }));

    onReorderItems(category.id, updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="content-box">
      {/* Box Header */}
      <div className="content-box-header">
        <div className="box-header-info">
          <div className="box-title-row">
            <h2 className="box-title">Danh Sách: {category.name}</h2>
            <span 
              className="brand-badge" 
              style={{ background: `${category.color}20`, color: category.color }}
            >
              Mã: {category.code}
            </span>
          </div>
          <p className="box-desc">
            {category.description} &bull; Áp dụng chuẩn hóa cho toàn bộ biểu mẫu CRM và báo cáo gộp.
          </p>
        </div>

        <button 
          id="btn-add-category-item"
          className="btn btn-primary"
          onClick={() => onAddNew(category.id)}
        >
          <Plus size={16} />
          <span>Thêm Mục Mới</span>
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="content-box-toolbar">
        <div className="toolbar-search">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text"
            placeholder="Tìm theo tên, mã code, mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="toolbar-filters">
          {/* Lọc Trạng thái */}
          <select 
            className="select-custom" 
            style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Chỉ mục Đang áp dụng</option>
            <option value="INACTIVE">Chỉ mục Tạm ngưng</option>
          </select>

          {/* Lọc Tham chiếu */}
          <select 
            className="select-custom" 
            style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
            value={refFilter}
            onChange={(e) => setRefFilter(e.target.value)}
          >
            <option value="ALL">Tất cả tình trạng dữ liệu</option>
            <option value="REFERENCED">🔒 Đang được tham chiếu (Khóa xóa)</option>
            <option value="ZERO_REF">✓ Chưa tham chiếu (Cho phép xóa)</option>
          </select>
        </div>
      </div>

      {/* Thanh công cụ hỗ trợ sắp xếp thứ tự hiển thị (Tiêu chí 3) */}
      <div className="sorting-helper-bar">
        <div className="sorting-instructions">
          <GripVertical size={16} />
          <span>Tiêu chí 3: Kéo thả các dòng hoặc dùng mũi tên Lên/Xuống để sắp xếp thứ tự hiển thị trên CRM</span>
        </div>

        <div className="sorting-actions-group">
          <button 
            id="btn-sort-az"
            className="btn btn-outline btn-sm"
            onClick={() => onSortAlphabetical(category.id)}
            title="Sắp xếp danh sách theo bảng chữ cái A-Z"
          >
            <ArrowUpDown size={13} />
            <span>Sắp xếp A-Z</span>
          </button>

          <button 
            id="btn-sort-usage"
            className="btn btn-outline btn-sm"
            onClick={() => onSortByUsage(category.id)}
            title="Đưa các mục được sử dụng nhiều nhất lên đầu"
          >
            <Sparkles size={13} />
            <span>Xếp theo Phổ biến</span>
          </button>

          <button 
            id="btn-reset-order"
            className="btn btn-outline btn-sm"
            onClick={() => onResetOrder(category.id)}
            title="Khôi phục về thứ tự sắp xếp chuẩn ban đầu"
          >
            <RotateCcw size={13} />
            <span>Thứ tự chuẩn</span>
          </button>
        </div>
      </div>

      {/* Bảng Danh mục & Kéo thả sắp xếp */}
      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Thứ Tự</th>
              <th style={{ width: '130px' }}>Mã Danh Mục</th>
              <th>Tên Mục & Nhận Diện</th>
              <th style={{ width: '130px' }}>Trạng Thái</th>
              <th style={{ width: '190px' }}>Ràng Buộc Dữ Liệu</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy mục nào phù hợp với bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const refCount = usageMap[item.id] || 0;
                const isLocked = refCount > 0;
                const isDraggingThis = draggedIndex === index;
                const isDragOverThis = dragOverIndex === index;

                return (
                  <tr
                    key={item.id}
                    id={`category-row-${item.id}`}
                    className={`category-row ${isDraggingThis ? 'is-dragging' : ''} ${isDragOverThis ? 'drag-over-above' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Cột Thứ tự & Kéo thả */}
                    <td>
                      <div className="order-badge-box">
                        <span 
                          className="drag-handle" 
                          title="Giữ chuột và kéo để thay đổi thứ tự"
                        >
                          <GripVertical size={16} />
                        </span>
                        <span className="order-number">{item.sortOrder}</span>
                        <div className="order-arrows">
                          <button
                            className="arrow-btn"
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'up')}
                            title="Di chuyển lên trên"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            className="arrow-btn"
                            disabled={index === filteredItems.length - 1}
                            onClick={() => handleMove(index, 'down')}
                            title="Di chuyển xuống dưới"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Mã Code */}
                    <td>
                      <span className="code-tag">{item.code}</span>
                      {item.isDefault && (
                        <div style={{ marginTop: '3px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                            ★ Mặc định
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Tên mục & Mô tả */}
                    <td>
                      <div className="item-identity">
                        <span 
                          className="item-color-dot"
                          style={{ backgroundColor: item.color || category.color, color: item.color || category.color }}
                        />
                        <div>
                          <div className="item-name-bold">{item.name}</div>
                          {item.description && (
                            <div className="item-desc-sub">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái Áp dụng */}
                    <td>
                      <button
                        className={`status-pill ${item.isActive ? 'status-active' : 'status-inactive'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => onToggleActive(category.id, item.id)}
                        title="Bấm để chuyển đổi Đang áp dụng / Tạm ngưng"
                      >
                        {item.isActive ? (
                          <>
                            <Check size={12} />
                            <span>Đang áp dụng</span>
                          </>
                        ) : (
                          <>
                            <X size={12} />
                            <span>Tạm ngưng</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Tiêu chí 2: Ràng buộc tham chiếu dữ liệu */}
                    <td>
                      {isLocked ? (
                        <div 
                          className="ref-badge ref-badge-locked"
                          onClick={() => onInspectReferences(category.id, item)}
                          title="Giá trị đang được sử dụng trong CRM - Không thể xóa! Bấm để xem chi tiết"
                        >
                          <Lock size={13} />
                          <span>Đang tham chiếu ({refCount})</span>
                        </div>
                      ) : (
                        <div 
                          className="ref-badge ref-badge-zero"
                          title="Chưa có dữ liệu nào liên kết - Có thể xóa an toàn"
                        >
                          <ShieldCheck size={13} />
                          <span>0 tham chiếu (Xóa an toàn)</span>
                        </div>
                      )}
                    </td>

                    {/* Thao tác Sửa / Xóa */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          id={`btn-edit-${item.id}`}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => onEdit(category.id, item)}
                          title="Chỉnh sửa thông tin mục danh mục"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          id={`btn-delete-${item.id}`}
                          className={`btn btn-icon ${isLocked ? 'btn-outline' : 'btn-danger-outline'}`}
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => onDeleteRequest(category.id, item, isLocked, refCount)}
                          title={isLocked ? 'Khóa xóa: Đang được tham chiếu trong CRM' : 'Xóa mục danh mục này'}
                        >
                          {isLocked ? (
                            <Lock size={14} color="#ef4444" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Widget Xem trước Dropdown CRM tương tác trực tiếp (Live Dropdown Preview) */}
      <div className="live-preview-box">
        <div className="preview-info">
          <div className="preview-title">
            <Eye size={16} color="var(--primary)" />
            <span>Mô Phỏng Trực Tiếp Trên Giao Diện Bán Hàng (Live CRM Preview)</span>
          </div>
          <p className="preview-desc">
            Trình đơn chọn "{category.crmFieldLabel}" bên dưới hiển thị đúng theo <strong>thứ tự sắp xếp ({items.length} mục)</strong> vừa thiết lập ở trên. Khi bạn đổi thứ tự hoặc tạm ngưng mục nào, danh sách này cập nhật ngay lập tức:
          </p>
        </div>

        <div className="preview-dropdown-control">
          <select className="select-custom">
            <option value="">-- Chọn {category.name.toLowerCase()} --</option>
            {items
              .filter(i => i.isActive)
              .map(item => (
                <option key={item.id} value={item.id}>
                  {item.sortOrder}. {item.name} {item.isDefault ? '(Mặc định)' : ''}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
