import React, { useState } from 'react';
import { X, Sliders, RotateCcw, TrendingUp, Sparkles, Check } from 'lucide-react';
import { OPPORTUNITY_STAGES } from '../data/mockStages';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const WhatIfSimulatorModal = ({
  isOpen,
  onClose,
  stageConfig,
  setStageConfig,
  stats,
  baseForecastValue
}) => {
  if (!isOpen) return null;

  const handleSliderChange = (stageId, newProb) => {
    setStageConfig((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        defaultProbability: parseInt(newProb, 10)
      }
    }));
  };

  const handleReset = () => {
    setStageConfig(OPPORTUNITY_STAGES);
  };

  const delta = stats.weightedForecast - baseForecastValue;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="btn-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="modal-title">Bộ Giả Lập Xác Suất Giai Đoạn (What-If Simulation)</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Điều chỉnh xác suất thắng để mô phỏng sự biến thiên của dự báo doanh số
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Delta Impact Alert */}
          <div style={{ 
            background: delta >= 0 ? 'var(--success-bg)' : 'var(--warning-bg)', 
            border: `1px solid ${delta >= 0 ? 'var(--success-border)' : 'var(--warning-border)'}`, 
            padding: '1rem 1.25rem', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: delta >= 0 ? 'var(--success)' : 'var(--warning)' }}>
                {delta >= 0 ? 'Tác động dự báo tăng thêm:' : 'Tác động dự báo suy giảm:'}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {delta >= 0 ? `+${formatCurrency(delta)}` : `-${formatCurrency(Math.abs(delta))}`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Dự báo mới:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                {formatCurrency(stats.weightedForecast)}
              </div>
            </div>
          </div>

          {/* Sliders for Stages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.values(stageConfig)
              .filter((s) => !s.isClosed)
              .map((stage) => (
                <div 
                  key={stage.id} 
                  style={{ 
                    background: 'var(--bg-primary)', 
                    padding: '0.85rem 1rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color }} />
                      <strong style={{ fontSize: '0.88rem' }}>{stage.label}</strong>
                    </div>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 700, 
                      color: stage.color, 
                      fontSize: '0.95rem' 
                    }}>
                      {stage.defaultProbability}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={stage.defaultProbability}
                    onChange={(e) => handleSliderChange(stage.id, e.target.value)}
                    style={{ 
                      width: '100%', 
                      accentColor: stage.color, 
                      cursor: 'pointer' 
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <span>0% (Bi quan)</span>
                    <span>50% (Trung bình)</span>
                    <span>100% (Tối ưu)</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={handleReset}>
            <RotateCcw size={14} />
            Khôi Phục Mặc Định
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            <Check size={14} />
            Áp Dụng Vào Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
};
