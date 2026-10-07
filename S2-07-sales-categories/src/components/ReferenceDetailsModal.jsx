import React, { useState } from 'react';
import { Eye, X, Building, Users, Briefcase, Calendar, Lock } from 'lucide-react';
import { formatVND } from '../utils/referenceUtils';

export default function ReferenceDetailsModal({
  isOpen,
  onClose,
  item,
  category,
  referenceDetails
}) {
  const [activeSubTab, setActiveSubTab] = useState('ALL');

  if (!isOpen || !item) return null;

  const { totalReferences, breakdown } = referenceDetails;
  const { customers = [], leads = [], deals = [], activities = [] } = breakdown;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Eye size={20} color="var(--primary)" />
            <span>Chi Tiết {totalReferences} Bản Ghi Đang Tham Chiếu</span>
          </div>
          <button 
            className="btn btn-outline btn-icon" 
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-muted)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <span 
              className="item-color-dot" 
              style={{ backgroundColor: item.color || category?.color, color: item.color || category?.color }}
            />
            <div>
              <div style={{ fontWeight: 800 }}>Mục: {item.name} ({item.code})</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Thuộc danh mục: {category?.name} &bull; Khóa xóa vĩnh viễn cho đến khi không còn bản ghi nào trỏ tới.
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button 
              className={`btn btn-sm ${activeSubTab === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveSubTab('ALL')}
            >
              Tất cả ({totalReferences})
            </button>
            {customers.length > 0 && (
              <button 
                className={`btn btn-sm ${activeSubTab === 'CUSTOMERS' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveSubTab('CUSTOMERS')}
              >
                Khách hàng ({customers.length})
              </button>
            )}
            {leads.length > 0 && (
              <button 
                className={`btn btn-sm ${activeSubTab === 'LEADS' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveSubTab('LEADS')}
              >
                Leads ({leads.length})
              </button>
            )}
            {deals.length > 0 && (
              <button 
                className={`btn btn-sm ${activeSubTab === 'DEALS' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveSubTab('DEALS')}
              >
                Cơ hội ({deals.length})
              </button>
            )}
            {activities.length > 0 && (
              <button 
                className={`btn btn-sm ${activeSubTab === 'ACTIVITIES' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveSubTab('ACTIVITIES')}
              >
                Hoạt động ({activities.length})
              </button>
            )}
          </div>

          {/* Records List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
            {/* Customers */}
            {(activeSubTab === 'ALL' || activeSubTab === 'CUSTOMERS') && customers.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Building size={16} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mã: {c.code} &bull; Khu vực: {c.city} &bull; Liên hệ: {c.contactPerson}</div>
                  </div>
                </div>
                <span className="code-tag" style={{ color: 'var(--primary)' }}>Khách Hàng</span>
              </div>
            ))}

            {/* Leads */}
            {(activeSubTab === 'ALL' || activeSubTab === 'LEADS') && leads.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Users size={16} color="var(--warning)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{l.name} - {l.company}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tiềm năng: {formatVND(l.estimatedValue)} &bull; Phụ trách: {l.assignedTo}</div>
                  </div>
                </div>
                <span className="code-tag" style={{ color: 'var(--warning)' }}>Đầu Mối Lead</span>
              </div>
            ))}

            {/* Deals */}
            {(activeSubTab === 'ALL' || activeSubTab === 'DEALS') && deals.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Briefcase size={16} color="var(--success)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{d.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Khách: {d.customer} &bull; Doanh số: {formatVND(d.amount)} &bull; Giai đoạn: {d.stage}</div>
                  </div>
                </div>
                <span className="code-tag" style={{ color: 'var(--success)' }}>Cơ Hội Deal</span>
              </div>
            ))}

            {/* Activities */}
            {(activeSubTab === 'ALL' || activeSubTab === 'ACTIVITIES') && activities.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Calendar size={16} color="var(--purple)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ngày: {a.date} &bull; Sales: {a.salesRep} &bull; {a.duration}</div>
                  </div>
                </div>
                <span className="code-tag" style={{ color: 'var(--purple)' }}>Hoạt Động</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
