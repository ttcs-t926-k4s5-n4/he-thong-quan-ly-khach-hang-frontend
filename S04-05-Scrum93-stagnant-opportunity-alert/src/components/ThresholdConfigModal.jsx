import React, { useState } from 'react';
import { Settings, Sliders, RotateCcw, Check, X, AlertTriangle, Info } from 'lucide-react';
import { DEFAULT_STAGE_THRESHOLDS } from '../data/mockStages.js';

export const ThresholdConfigModal = ({
  isOpen,
  onClose,
  currentThresholds,
  onSaveThresholds,
  opportunities
}) => {
  if (!isOpen) return null;

  // Local state for editing
  const [thresholds, setThresholds] = useState({ ...currentThresholds });

  const handleSliderChange = (stageId, newDays) => {
    setThresholds(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        thresholdDays: parseInt(newDays, 10) || 1
      }
    }));
  };

  const handleReset = () => {
    setThresholds(DEFAULT_STAGE_THRESHOLDS);
  };

  const handleSave = () => {
    onSaveThresholds(thresholds);
    onClose();
  };

  // Tính thử nghiệm số lượng deal bị gắn cờ theo ngưỡng hiện tại
  const countDealsInStage = (stageId) => {
    return opportunities.filter(o => o.stage === stageId && !o.isClosed).length;
  };

  const countFlaggedUnderCurrentDraft = (stageId, thresholdN) => {
    return opportunities.filter(o => {
      if (o.stage !== stageId || o.isClosed) return false;
      return (o.daysSinceLastActivity || 0) >= thresholdN;
    }).length;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sliders size={20} style={{ color: '#f59e0b' }} />
            <span>Cấu Hình Ngưỡng N Ngày Đình Trệ Theo Từng Giai Đoạn (AC1)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Info size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Quy tắc nghiệp vụ:</strong> Nếu cơ hội không có bất kỳ hoạt động tương tác nào (gọi điện, họp, gửi email, cập nhật tài liệu) trong <strong>N ngày</strong>, hệ thống sẽ tự động gắn cờ cảnh báo đình trệ. Trưởng nhóm có toàn quyền điều chỉnh ngưỡng N này phù hợp với chu kỳ bán hàng thực tế của từng giai đoạn.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.keys(thresholds).filter(key => !thresholds[key].isClosed).map((stageKey) => {
              const stage = thresholds[stageKey];
              const totalOpenInStage = countDealsInStage(stageKey);
              const flaggedUnderDraft = countFlaggedUnderCurrentDraft(stageKey, stage.thresholdDays);

              return (
                <div 
                  key={stageKey}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${stage.badgeClass}`}>
                        {stage.label}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ({totalOpenInStage} deal đang mở)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ngưỡng N =</span>
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '1.2rem', 
                        fontWeight: 800, 
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.15)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        {stage.thresholdDays} ngày
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    {stage.description}
                  </p>

                  {/* Thanh kéo Slider & Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="range"
                      min="1"
                      max="30"
                      value={stage.thresholdDays}
                      onChange={(e) => handleSliderChange(stageKey, e.target.value)}
                      style={{ flex: 1, accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                    <input 
                      type="number"
                      min="1"
                      max="60"
                      value={stage.thresholdDays}
                      onChange={(e) => handleSliderChange(stageKey, e.target.value)}
                      className="form-control"
                      style={{ width: '80px', textAlign: 'center', fontWeight: 700 }}
                    />
                  </div>

                  {/* Minh chứng tác động thời gian thực */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>
                      Khuyến nghị chuẩn: <strong>{DEFAULT_STAGE_THRESHOLDS[stageKey]?.thresholdDays} ngày</strong>
                    </span>
                    <span style={{ color: flaggedUnderDraft > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                      ⚡ Có <strong>{flaggedUnderDraft} / {totalOpenInStage}</strong> cơ hội sẽ bị gắn cờ đình trệ ở ngưỡng này
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleReset} title="Khôi phục về ngưỡng chuẩn mặc định">
            <RotateCcw size={15} />
            <span>Khôi Phục Mặc Định</span>
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            <span>Hủy Bỏ</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            <span>Lưu &amp; Cập Nhật Toàn Bộ Cờ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
