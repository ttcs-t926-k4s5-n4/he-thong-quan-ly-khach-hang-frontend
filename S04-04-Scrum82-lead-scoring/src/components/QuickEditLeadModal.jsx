import React, { useState, useMemo } from 'react';
import { 
  Edit3, 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Flame, 
  SunMedium, 
  Snowflake,
  TrendingUp
} from 'lucide-react';
import { calculateLeadScore } from '../utils/scoreCalculator';

export default function QuickEditLeadModal({
  lead,
  config,
  onClose,
  onSaveLead
}) {
  const [formData, setFormData] = useState({
    industry: lead?.industry || 'IT_TELECOM',
    companySize: lead?.companySize || 'ENTERPRISE',
    leadSource: lead?.leadSource || 'HOTLINE_DEMO',
    interestLevel: lead?.interestLevel || 'URGENT',
    notes: lead?.notes || ''
  });

  // Điểm ban đầu
  const initialScoreResult = lead?.scoreResult || calculateLeadScore(lead, config);

  // Điểm số mới được tính lại TỰ ĐỘNG THỜI GIAN THỰC (Tiêu chí 2)
  const newScoreResult = useMemo(() => {
    const tempLead = {
      ...lead,
      ...formData
    };
    return calculateLeadScore(tempLead, config);
  }, [formData, lead, config]);

  const scoreDiff = newScoreResult.totalScore - initialScoreResult.totalScore;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveLead({
      ...lead,
      ...formData
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon">
              <Edit3 size={20} />
            </div>
            <div>
              <div className="modal-title">Cập Nhật Thông Tin Lead & Tự Động Tính Lại Điểm</div>
              <div className="modal-subtitle">
                Chứng minh Tiêu chí 2: Điểm số & phân loại tự động tái tính toán ngay khi thông tin thay đổi
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Lead Identity Summary */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{lead.fullName}</strong> ({lead.code})
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{lead.companyName} &bull; SĐT: {lead.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Điểm hiện tại:</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  {initialScoreResult.totalScore} điểm ({initialScoreResult.classification})
                </div>
              </div>
            </div>

            {/* Criteria Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* 1. Ngành nghề */}
              <div className="form-group">
                <label className="form-label">1. Ngành Nghề Phù Hợp:</label>
                <select 
                  className="form-select"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                >
                  {config.criteriaGroups.industry.options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} (+{opt.points}đ)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Quy mô */}
              <div className="form-group">
                <label className="form-label">2. Quy Mô Doanh Nghiệp:</label>
                <select 
                  className="form-select"
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                >
                  {config.criteriaGroups.companySize.options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} (+{opt.points}đ)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Nguồn Lead */}
              <div className="form-group">
                <label className="form-label">3. Nguồn Tiếp Thị (Lead Source):</label>
                <select 
                  className="form-select"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                >
                  {config.criteriaGroups.leadSource.options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} (+{opt.points}đ)
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Mức độ quan tâm */}
              <div className="form-group">
                <label className="form-label">4. Mức Độ Quan Tâm (Intent):</label>
                <select 
                  className="form-select"
                  value={formData.interestLevel}
                  onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value })}
                >
                  {config.criteriaGroups.interestLevel.options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} (+{opt.points}đ)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LIVE SCORE CALCULATION PREVIEW BOX */}
            <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))', border: '1px solid #fcd34d', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} />
                <span>KẾT QUẢ TÍNH TOÁN ĐIỂM SỐ TỰ ĐỘNG THỜI GIAN THỰC (LIVE RECALCULATION):</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Điểm số mới:</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{newScoreResult.totalScore} điểm</span>
                    {scoreDiff !== 0 && (
                      <span style={{ fontSize: '0.9rem', color: scoreDiff > 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                        ({scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff})
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Phân loại mới:</span>
                    <div>
                      {newScoreResult.classification === 'HOT' && (
                        <span className="badge-hot" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                          <Flame size={15} /> 🔥 NÓNG (HOT)
                        </span>
                      )}
                      {newScoreResult.classification === 'WARM' && (
                        <span className="badge-warm" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                          <SunMedium size={15} /> ☀️ ẤM (WARM)
                        </span>
                      )}
                      {newScoreResult.classification === 'COLD' && (
                        <span className="badge-cold" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                          <Snowflake size={15} /> ❄️ LẠNH (COLD)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                SLA khuyến nghị: <strong>{newScoreResult.slaRecommendation}</strong>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Hủy Bỏ
            </button>
            <button type="submit" className="btn btn-warning btn-sm">
              <Check size={16} />
              <span>Lưu & Cập Nhật Hàng Đợi Ưu Tiên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
