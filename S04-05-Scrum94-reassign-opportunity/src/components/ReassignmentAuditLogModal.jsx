import React, { useState } from 'react';
import { 
  X, 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ArrowLeftRight, 
  FileText,
  UserCheck
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const ReassignmentAuditLogModal = ({
  isOpen,
  onClose,
  auditLogs = [],
  onUndoTransfer
}) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState('ALL');

  // Lọc nhật ký
  const filteredLogs = auditLogs.filter((log) => {
    if (selectedReasonFilter !== 'ALL' && log.reasonId !== selectedReasonFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchId = log.id.toLowerCase().includes(term);
      const matchFrom = log.fromRepName.toLowerCase().includes(term);
      const matchTo = log.toRepName.toLowerCase().includes(term);
      const matchReason = log.reasonLabel.toLowerCase().includes(term);
      const matchDeals = log.deals?.some((d) => d.title.toLowerCase().includes(term) || d.id.toLowerCase().includes(term));
      if (!matchId && !matchFrom && !matchTo && !matchReason && !matchDeals) {
        return false;
      }
    }
    return true;
  });

  // Xuất file CSV báo cáo kiểm toán
  const handleExportCSV = () => {
    let csv = 'Mã Phiên,Thời Gian,Người Khởi Tạo,Từ Nhân Sự,Sang Nhân Sự,Số Deal,Tổng Giá Trị (VNĐ),Lý Do Chuyển Quyền,Ghi Chú Bàn Giao\n';
    auditLogs.forEach((log) => {
      const cleanReason = `"${log.reasonLabel.replace(/"/g, '""')}"`;
      const cleanNotes = `"${(log.handoverNotes || '').replace(/"/g, '""')}"`;
      csv += `${log.id},${log.timestamp},${log.initiatorName},${log.fromRepName},${log.toRepName},${log.dealCount},${log.totalValue},${cleanReason},${cleanNotes}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCRUM-94_Nhat_Ky_Phan_Bo_Deal_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <ClipboardList size={20} color="#8b5cf6" />
            <span>Nhật Ký Kiểm Toán Phân Bổ Quyền Sở Hữu (Audit Trail)</span>
            <span className="ticket-tag">AC3</span>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Thanh công cụ tìm kiếm & Xuất file */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="filter-search-box" style={{ width: '280px' }}>
                <Search size={15} color="var(--text-muted)" />
                <input 
                  type="text"
                  className="filter-search-input"
                  placeholder="Tìm mã phiên, nhân sự, deal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="filter-select"
                value={selectedReasonFilter}
                onChange={(e) => setSelectedReasonFilter(e.target.value)}
              >
                <option value="ALL">Tất cả lý do phân bổ</option>
                <option value="LEAVE_EXTENDED">Nghỉ phép dài hạn</option>
                <option value="LEAVE_MATERNITY">Nghỉ thai sản 6 tháng</option>
                <option value="OVERLOAD">Nhân viên quá tải</option>
                <option value="SKILL_FIT">Phù hợp chuyên môn ngành</option>
              </select>
            </div>

            <button 
              className="btn btn-sm btn-outline"
              onClick={handleExportCSV}
              title="Tải về file CSV nhật ký phân bổ kiểm toán"
            >
              <Download size={15} />
              <span>Xuất Báo Cáo CSV</span>
            </button>
          </div>

          {/* Danh sách các phiên phân bổ */}
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Không có bản ghi nhật ký phân bổ nào khớp với tìm kiếm.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem'
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="audit-log-badge">{log.id}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        {log.timestamp}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Bởi: <strong>{log.initiatorName}</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                      {formatCurrency(log.totalValue)}
                    </div>
                  </div>

                  {/* Flow bàn giao: Từ ai -> Sang ai */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>
                      Người cũ: {log.fromRepName}
                    </span>
                    <ArrowLeftRight size={16} color="#3b82f6" />
                    <span style={{ color: '#34d399', fontWeight: 700 }}>
                      Người nhận mới: {log.toRepName}
                    </span>
                    <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>
                      {log.dealCount} cơ hội
                    </span>
                  </div>

                  {/* Lý do & Ghi chú (AC3) */}
                  <div style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                    <strong>Lý do phân bổ:</strong> <span style={{ color: '#c084fc' }}>{log.reasonLabel}</span>
                  </div>

                  {log.handoverNotes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', lineHeight: '1.4' }}>
                      <strong>Ghi chú bàn giao:</strong> {log.handoverNotes}
                    </div>
                  )}

                  {/* Danh sách các deal trong phiên */}
                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem'
                  }}>
                    <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Các cơ hội bàn giao ({log.deals?.length || 0}):
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {log.deals?.map((d) => (
                        <span 
                          key={d.id}
                          style={{
                            background: 'var(--bg-tertiary)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {d.id} - {d.title} ({formatCurrency(d.value)})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
