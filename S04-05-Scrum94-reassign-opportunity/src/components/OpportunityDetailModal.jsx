import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Briefcase, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  History, 
  CheckCircle2, 
  FileText,
  Printer,
  Sparkles,
  Award
} from 'lucide-react';
import { PIPELINE_STAGES } from '../data/mockStages';
import { MEMBER_STATUS } from '../data/mockUsers';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';

export const OpportunityDetailModal = ({
  isOpen,
  onClose,
  deal,
  onReassignDeal
}) => {
  if (!isOpen || !deal) return null;

  const [activeTab, setActiveTab] = useState('TIMELINE'); // 'TIMELINE', 'REASSIGN_LOGS', 'RECEIPT'

  const stageConfig = PIPELINE_STAGES[deal.stage] || PIPELINE_STAGES.DISCOVERY;
  const statusConfig = MEMBER_STATUS[deal.assigneeStatus] || MEMBER_STATUS.ACTIVE_NORMAL;

  const handlePrint = () => {
    window.print();
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
            <Briefcase size={20} color="#3b82f6" />
            <span>Hồ Sơ Thương Vụ & Lịch Sử Toàn Diện</span>
            <span className="ticket-tag">{deal.id}</span>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Header Card của Deal */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{deal.title}</h2>
                  {deal.isNewlyReassigned && (
                    <span className="badge badge-new-reassigned">
                      ✨ Mới nhận bàn giao
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={15} />
                  <span>{deal.customerName}</span>
                  <span>•</span>
                  <span>{deal.industry}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                  {formatCurrency(deal.value)}
                </div>
                <div style={{ marginTop: '0.3rem' }}>
                  <span className={`badge ${stageConfig.badgeClass}`}>
                    {stageConfig.name} ({stageConfig.probability}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ & Người phụ trách */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.85rem',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Đầu mối khách hàng:</span>
                <div style={{ fontWeight: 600 }}>{deal.contactPerson}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{deal.contactPhone}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dự kiến ký kết:</span>
                <div style={{ fontWeight: 600 }}>{formatDate(deal.expectedCloseDate)}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Hoạt động cuối: {deal.lastActivityDate}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Người phụ trách hiện tại (AC2):</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <img src={deal.salesRepAvatar} alt={deal.salesRepName} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                  <strong>{deal.salesRepName}</strong>
                </div>
                <span className={`badge ${statusConfig.badgeClass}`} style={{ marginTop: '0.25rem' }}>
                  {statusConfig.shortLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs trong Modal */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button 
              className={`filter-tab ${activeTab === 'TIMELINE' ? 'active' : ''}`}
              onClick={() => setActiveTab('TIMELINE')}
            >
              <Clock size={15} />
              <span>Toàn bộ lịch sử tương tác ({deal.activities?.length || 0})</span>
            </button>

            <button 
              className={`filter-tab ${activeTab === 'REASSIGN_LOGS' ? 'active' : ''}`}
              onClick={() => setActiveTab('REASSIGN_LOGS')}
            >
              <ArrowLeftRight size={15} />
              <span>Nhật ký chuyển quyền ({deal.reassignmentHistory?.length || 0})</span>
            </button>

            <button 
              className={`filter-tab ${activeTab === 'RECEIPT' ? 'active' : ''}`}
              onClick={() => setActiveTab('RECEIPT')}
            >
              <FileText size={15} />
              <span>Biên bản bàn giao</span>
            </button>
          </div>

          {/* TAB 1: TOÀN BỘ LỊCH SỬ HOẠT ĐỘNG (AC2 - Giữ nguyên 100% lịch sử) */}
          {activeTab === 'TIMELINE' && (
            <div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>
                  <strong>Bảo toàn 100% dữ liệu lịch sử (AC2):</strong> Khi người mới tiếp nhận cơ hội, mọi cuộc họp, email, ghi chú đàm phán và mốc chuyển giao đều được lưu giữ nguyên vẹn theo dòng thời gian.
                </span>
              </div>

              <div className="timeline">
                {deal.activities && deal.activities.length > 0 ? (
                  deal.activities.map((act) => {
                    const isTransfer = act.type === 'REASSIGNMENT' || act.isSystemEvent;
                    return (
                      <div key={act.id} className="timeline-item">
                        <div className={`timeline-dot ${isTransfer ? 'transfer' : ''}`} />
                        <div className={`timeline-card ${isTransfer ? 'is-transfer' : ''}`}>
                          <div className="timeline-meta">
                            <span className="timeline-author">
                              {isTransfer ? '⚡ ' : '👤 '} {act.author}
                            </span>
                            <span>{act.date}</span>
                          </div>
                          <div className="timeline-content">
                            {act.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Chưa có hoạt động tương tác nào được ghi nhận.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NHẬT KÝ PHÂN BỔ RIÊNG CỦA DEAL NÀY (AC3) */}
          {activeTab === 'REASSIGN_LOGS' && (
            <div>
              {deal.reassignmentHistory && deal.reassignmentHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {deal.reassignmentHistory.map((rec) => (
                    <div 
                      key={rec.id}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-purple">
                          Mã phiên: {rec.transferId || rec.id}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {rec.timestamp}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', marginBottom: '0.45rem' }}>
                        <strong>Chuyển giao:</strong> Từ <span style={{ color: '#f87171' }}>{rec.fromRepName}</span> ➔ Sang <span style={{ color: '#34d399' }}>{rec.toRepName}</span>
                      </div>

                      <div style={{ fontSize: '0.82rem', marginBottom: '0.45rem' }}>
                        <strong>Lý do phân bổ:</strong> <span style={{ color: '#c084fc' }}>{rec.reasonLabel}</span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                        <strong>Ghi chú bàn giao:</strong> {rec.handoverNotes}
                      </div>

                      {rec.checklist && rec.checklist.length > 0 && (
                        <div style={{ 
                          background: 'rgba(0,0,0,0.2)', 
                          padding: '0.5rem 0.75rem', 
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem'
                        }}>
                          <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Danh mục đã hoàn thành:
                          </strong>
                          {rec.checklist.map((c, i) => (
                            <div key={i} style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              ✓ {c}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  <ArrowLeftRight size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <div>Cơ hội này chưa từng được phân bổ lại. Người phụ trách ban đầu là {deal.salesRepName}.</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BIÊN BẢN BÀN GIAO ĐIỆN TỬ */}
          {activeTab === 'RECEIPT' && (
            <div style={{
              background: 'white',
              color: '#111827',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1f2937' }}>CÔNG TY CỔ PHẦN CÔNG NGHỆ DOANH NGHIỆP</h3>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Hệ Thống Quản Trị Quan Hệ Khách Hàng CRM Enterprise</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>BIÊN BẢN BÀN GIAO THƯƠNG VỤ</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Mã: BB-{deal.id}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <div><strong>Tên thương vụ:</strong> {deal.title}</div>
                <div><strong>Khách hàng:</strong> {deal.customerName} ({deal.industry})</div>
                <div><strong>Giá trị thương vụ:</strong> {formatCurrency(deal.value)}</div>
                <div><strong>Giai đoạn:</strong> {stageConfig.name} ({stageConfig.probability}%)</div>
                <div><strong>Người phụ trách hiện tại:</strong> {deal.salesRepName}</div>
                <div><strong>Ngày lập biên bản:</strong> {deal.reassignedAt || '2026-10-18'}</div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                marginTop: '2rem',
                textAlign: 'center',
                fontSize: '0.78rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2.5rem' }}>Người Bàn Giao Cũ</div>
                  <div>(Ký & ghi rõ họ tên)</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2.5rem' }}>Người Tiếp Nhận Mới</div>
                  <div style={{ fontWeight: 600, color: '#2563eb' }}>{deal.salesRepName}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2.5rem' }}>Trưởng Nhóm Kinh Doanh</div>
                  <div style={{ fontWeight: 600, color: '#16a34a' }}>Trần Đình Trọng (Đã ký điện tử)</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={handlePrint}
                  style={{ color: '#111827', borderColor: '#d1d5db' }}
                >
                  <Printer size={15} />
                  <span>In / Lưu file PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Đóng
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onReassignDeal([deal.id]);
            }}
          >
            <ArrowLeftRight size={16} />
            <span>Phân Bổ Lại Thương Vụ Này</span>
          </button>
        </div>
      </div>
    </div>
  );
};
