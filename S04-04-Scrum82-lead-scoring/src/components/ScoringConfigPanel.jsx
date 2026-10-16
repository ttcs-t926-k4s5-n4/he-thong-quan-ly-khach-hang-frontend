import React from 'react';
import { 
  Sliders, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  Users, 
  Share2, 
  Target,
  Flame,
  SunMedium,
  Snowflake
} from 'lucide-react';

export default function ScoringConfigPanel({
  config,
  onChangeThreshold,
  onChangeOptionPoints,
  onResetDefaults
}) {
  const { thresholds, criteriaGroups } = config;

  return (
    <div className="config-card">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Sliders size={20} color="#f59e0b" />
            <span>Bảng Cấu Hình Tiêu Chí Chấm Điểm & Phân Loại Lead (Dành Cho Giám Đốc KD)</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Đáp ứng Tiêu chí 1 & Tiêu chí 3: Thay đổi điểm số và ngưỡng điểm sẽ tự động tái tính toán toàn bộ CRM trong thời gian thực.
          </div>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetDefaults}
          title="Khôi phục lại bộ tiêu chí và số điểm tiêu chuẩn"
        >
          <RotateCcw size={14} />
          <span>Khôi Phục Mặc Định</span>
        </button>
      </div>

      {/* 1. KHAI BÁO NGƯỠNG ĐIỂM NÓNG / ẤM / LẠNH (Tiêu chí 3) */}
      <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} color="#d97706" />
          <span>Khai Báo Ngưỡng Điểm Phân Loại Nóng, Ấm, Lạnh:</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* Ngưỡng Nóng */}
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--hot-border)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Flame size={16} />
                <span>Ngưỡng Lead NÓNG (HOT):</span>
              </span>
              <strong style={{ fontSize: '1rem', color: '#e11d48' }}>&ge; {thresholds.hotMin} điểm</strong>
            </div>
            <input 
              type="range" 
              min={50} 
              max={95} 
              step={5} 
              value={thresholds.hotMin}
              onChange={(e) => onChangeThreshold('hotMin', parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#e11d48', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Khuyến nghị gọi ngay trong vòng 15-30 phút sau khi lead đổ về.
            </span>
          </div>

          {/* Ngưỡng Ấm */}
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--warm-border)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <SunMedium size={16} />
                <span>Ngưỡng Lead ẤM (WARM):</span>
              </span>
              <strong style={{ fontSize: '1rem', color: '#d97706' }}>{thresholds.warmMin} - {thresholds.hotMin - 1} điểm</strong>
            </div>
            <input 
              type="range" 
              min={20} 
              max={thresholds.hotMin - 5} 
              step={5} 
              value={thresholds.warmMin}
              onChange={(e) => onChangeThreshold('warmMin', parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Khuyến nghị gọi trong ngày làm việc, gửi thêm tài liệu giải pháp.
            </span>
          </div>

          {/* Lead Lạnh */}
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--cold-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Snowflake size={16} />
              <span>Lead LẠNH (COLD): &lt; {thresholds.warmMin} điểm</span>
            </span>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              🛡️ <strong>Lưu ý nghiệp vụ:</strong> Lead lạnh vẫn được bảo lưu 100% trong CRM, xếp ở cuối hàng đợi, nuôi dưỡng qua Email tự động.
            </div>
          </div>
        </div>
      </div>

      {/* 2. KHAI BÁO 4 NHÓM TIÊU CHÍ VÀ SỐ ĐIỂM (Tiêu chí 1) */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Khai Báo Điểm Cho Từng Nhóm Tiêu Chí (Click để gõ hoặc chỉnh điểm):
        </div>

        <div className="criteria-grid">
          {/* Nhóm 1: Ngành nghề phù hợp */}
          <div className="criteria-card">
            <div className="criteria-card-header">
              <span className="criteria-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)' }}>
                <Building2 size={15} />
                <span>1. Ngành Nghề Phù Hợp</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Trọng số chính</span>
            </div>
            {criteriaGroups.industry.options.map((opt) => (
              <div key={opt.key} className="option-row">
                <span style={{ color: 'var(--text-main)' }}>{opt.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="option-points-input"
                    value={opt.points}
                    onChange={(e) => onChangeOptionPoints('industry', opt.key, parseInt(e.target.value || 0, 10))}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>đ</span>
                </div>
              </div>
            ))}
          </div>

          {/* Nhóm 2: Quy mô doanh nghiệp */}
          <div className="criteria-card">
            <div className="criteria-card-header">
              <span className="criteria-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
                <Users size={15} />
                <span>2. Quy Mô Doanh Nghiệp</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Nhân sự</span>
            </div>
            {criteriaGroups.companySize.options.map((opt) => (
              <div key={opt.key} className="option-row">
                <span style={{ color: 'var(--text-main)' }}>{opt.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="option-points-input"
                    value={opt.points}
                    onChange={(e) => onChangeOptionPoints('companySize', opt.key, parseInt(e.target.value || 0, 10))}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>đ</span>
                </div>
              </div>
            ))}
          </div>

          {/* Nhóm 3: Nguồn Lead */}
          <div className="criteria-card">
            <div className="criteria-card-header">
              <span className="criteria-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6' }}>
                <Share2 size={15} />
                <span>3. Nguồn Tiếp Thị (Lead Source)</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Kênh đến</span>
            </div>
            {criteriaGroups.leadSource.options.map((opt) => (
              <div key={opt.key} className="option-row">
                <span style={{ color: 'var(--text-main)' }}>{opt.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="option-points-input"
                    value={opt.points}
                    onChange={(e) => onChangeOptionPoints('leadSource', opt.key, parseInt(e.target.value || 0, 10))}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>đ</span>
                </div>
              </div>
            ))}
          </div>

          {/* Nhóm 4: Mức độ quan tâm */}
          <div className="criteria-card">
            <div className="criteria-card-header">
              <span className="criteria-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e11d48' }}>
                <Target size={15} />
                <span>4. Mức Độ Quan Tâm (Intent)</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Tín hiệu mua</span>
            </div>
            {criteriaGroups.interestLevel.options.map((opt) => (
              <div key={opt.key} className="option-row">
                <span style={{ color: 'var(--text-main)' }}>{opt.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="option-points-input"
                    value={opt.points}
                    onChange={(e) => onChangeOptionPoints('interestLevel', opt.key, parseInt(e.target.value || 0, 10))}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
