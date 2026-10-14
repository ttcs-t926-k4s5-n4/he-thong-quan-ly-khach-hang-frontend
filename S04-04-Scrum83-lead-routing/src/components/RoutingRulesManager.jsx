import React from 'react';
import { 
  SlidersHorizontal, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  Power, 
  Globe, 
  Building2, 
  Repeat,
  Zap
} from 'lucide-react';

export default function RoutingRulesManager({
  rules = [],
  onMoveRuleUp,
  onMoveRuleDown,
  onToggleRule,
  onOpenNewRuleModal,
  onResetDefaultRules
}) {
  return (
    <div className="rules-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <SlidersHorizontal size={20} color="#059669" />
            <span>Cấu Hình Thứ Tự Ưu Tiên Quy Tắc Phân Bổ (Dành Cho Giám Đốc Kinh Doanh)</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Đáp ứng Tiêu chí 1 & 2: Phân bổ theo Khu vực, Ngành nghề, Xoay vòng đều &bull; Cơ chế First-Match-Wins (Ưu tiên cao nhất khớp sẽ thắng).
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onResetDefaultRules}
            title="Khôi phục thứ tự quy tắc mặc định"
          >
            <RotateCcw size={14} />
            <span>Mặc Định</span>
          </button>

          <button 
            className="btn btn-success btn-sm"
            onClick={onOpenNewRuleModal}
            title="Thêm một quy tắc phân bổ mới"
          >
            <Plus size={15} />
            <span>+ Thêm Quy Tắc</span>
          </button>
        </div>
      </div>

      {/* First-Match-Wins Visual Rule Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(37,99,235,0.06))', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={18} color="#059669" />
          <div style={{ fontSize: '0.82rem', color: '#065f46' }}>
            <strong>Cơ chế First-Match-Wins:</strong> Hệ thống duyệt lần lượt từ Quy tắc #1 $\rightarrow$ #2 $\rightarrow$ #3... Quy tắc đầu tiên khớp điều kiện sẽ được gán ngay cho Telesales, các quy tắc phía dưới sẽ tự động bỏ qua!
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#059669', color: 'white', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
          SLA &lt; 5 PHÚT
        </span>
      </div>

      {/* Rules List Ordered by Priority */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {rules.map((rule, index) => {
          let ModeIcon = Globe;
          let modeBadgeStyle = { background: '#e0f2fe', color: '#0369a1' };
          let modeLabel = 'KHU VỰC (REGION)';

          if (rule.mode === 'INDUSTRY') {
            ModeIcon = Building2;
            modeBadgeStyle = { background: '#fef3c7', color: '#b45309' };
            modeLabel = 'NGÀNH NGHỀ (INDUSTRY)';
          } else if (rule.mode === 'ROUND_ROBIN') {
            ModeIcon = Repeat;
            modeBadgeStyle = { background: '#ede9fe', color: '#6d28d9' };
            modeLabel = 'XOAY VÒNG ĐỀU (ROUND-ROBIN)';
          }

          return (
            <div 
              key={rule.id} 
              className={`rule-item-card ${!rule.enabled ? 'disabled' : ''}`}
            >
              {/* Priority Pill & Mode */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="priority-pill" title={`Mức độ ưu tiên #${rule.priority}`}>
                  #{rule.priority}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {rule.name}
                    </strong>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        ...modeBadgeStyle
                      }}
                    >
                      <ModeIcon size={12} />
                      {modeLabel}
                    </span>
                    {!rule.enabled && (
                      <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#64748b', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        TẠM TẮT
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {rule.description}
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                    Đích phân bổ: <strong style={{ color: 'var(--primary-600)' }}>{rule.action.targetName}</strong>
                  </div>
                </div>
              </div>

              {/* Priority Reordering Buttons & Toggle Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {/* Move Up */}
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onMoveRuleUp(index)}
                  disabled={index === 0}
                  title="Nâng mức ưu tiên (Chạy trước)"
                  style={{ padding: '0.35rem 0.55rem' }}
                >
                  <ArrowUp size={14} />
                  <span>Lên</span>
                </button>

                {/* Move Down */}
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onMoveRuleDown(index)}
                  disabled={index === rules.length - 1}
                  title="Hạ mức ưu tiên (Chạy sau)"
                  style={{ padding: '0.35rem 0.55rem' }}
                >
                  <ArrowDown size={14} />
                  <span>Xuống</span>
                </button>

                {/* Toggle Enable / Disable */}
                <button 
                  className={`btn btn-sm ${rule.enabled ? 'btn-ghost' : 'btn-secondary'}`}
                  onClick={() => onToggleRule(rule.id)}
                  title={rule.enabled ? 'Bấm để tạm tắt quy tắc này' : 'Bấm để kích hoạt quy tắc này'}
                  style={{ padding: '0.35rem 0.55rem', color: rule.enabled ? '#16a34a' : '#94a3b8' }}
                >
                  <Power size={14} />
                  <span>{rule.enabled ? 'Bật' : 'Tắt'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
