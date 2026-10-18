import React from 'react';
import { X, Smartphone } from 'lucide-react';
import MobileAgendaView from './MobileAgendaView';

export default function MobileFrameWrapper({
  currentDate,
  events,
  conflictsMap,
  onSelectDate,
  onSelectEvent,
  onToggleTaskComplete,
  onOpenNewEvent,
  onClose
}) {
  return (
    <div className="device-simulator-backdrop" onClick={onClose}>
      <div className="iphone-frame" onClick={(e) => e.stopPropagation()}>
        {/* Tai thỏ / Dynamic Island iPhone */}
        <div className="iphone-notch">
          <div className="iphone-speaker" />
          <div className="iphone-camera" />
        </div>

        {/* Thanh trạng thái đỉnh máy điện thoại */}
        <div style={{ position: 'absolute', top: '10px', left: '26px', right: '26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 110, fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          <span>09:41</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Nút thoát chế độ giả lập */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '42px',
            right: '16px',
            zIndex: 120,
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Đóng chế độ điện thoại"
        >
          <X size={16} />
        </button>

        {/* Màn hình nội dung di động */}
        <div className="iphone-screen-content">
          <div style={{ padding: '8px 16px 4px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>
              📱 Mobile CRM Calendar
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              SCRUM-101
            </span>
          </div>

          <MobileAgendaView
            currentDate={currentDate}
            events={events}
            conflictsMap={conflictsMap}
            onSelectDate={onSelectDate}
            onSelectEvent={onSelectEvent}
            onToggleTaskComplete={onToggleTaskComplete}
            onOpenNewEvent={onOpenNewEvent}
          />
        </div>

        {/* Thanh Home Bar dưới đáy iPhone */}
        <div className="iphone-home-bar" />
      </div>
    </div>
  );
}
