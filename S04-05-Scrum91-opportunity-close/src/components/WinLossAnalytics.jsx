import React from 'react';
import { 
  Trophy, 
  XCircle, 
  BarChart3, 
  Lightbulb, 
  Building, 
  TrendingUp, 
  BookOpen,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const WinLossAnalytics = ({ opportunities }) => {
  const wonDeals = opportunities.filter((o) => o.stage === 'CLOSED_WON');
  const lostDeals = opportunities.filter((o) => o.stage === 'CLOSED_LOST');
  const totalClosed = wonDeals.length + lostDeals.length;

  // Aggregate loss reasons
  const lossReasonCounts = {};
  lostDeals.forEach((d) => {
    const reason = d.closedData?.lossReason || 'Chưa phân loại';
    lossReasonCounts[reason] = (lossReasonCounts[reason] || 0) + 1;
  });

  const sortedLossReasons = Object.entries(lossReasonCounts).sort((a, b) => b[1] - a[1]);

  // Aggregate competitors
  const competitorCounts = {};
  lostDeals.forEach((d) => {
    const comp = d.closedData?.competitorName || 'Không rõ đối thủ';
    competitorCounts[comp] = (competitorCounts[comp] || 0) + 1;
  });

  const sortedCompetitors = Object.entries(competitorCounts).sort((a, b) => b[1] - a[1]);

  // Key win reasons
  const winReasonCounts = {};
  wonDeals.forEach((d) => {
    const reasons = d.closedData?.winReasons || [];
    reasons.forEach((r) => {
      winReasonCounts[r] = (winReasonCounts[r] || 0) + 1;
    });
  });

  const sortedWinReasons = Object.entries(winReasonCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Intro Banner for Learning Objective */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="kpi-icon-wrap quota" style={{ width: '42px', height: '42px' }}>
            <Lightbulb size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Trung Tâm Phân Tích & Bài Học Kinh Nghiệm (Win/Loss Hub)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Đáp ứng trọn vẹn mục tiêu User Story: <em>"để công ty học được từ cả thương vụ thắng lẫn thua"</em>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tổng đã đóng</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800' }}>{totalClosed}</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Thắng (Won)</div>
            <div className="font-mono text-emerald-400" style={{ fontSize: '1.2rem', fontWeight: '800' }}>{wonDeals.length}</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Thua (Lost)</div>
            <div className="font-mono text-rose-400" style={{ fontSize: '1.2rem', fontWeight: '800' }}>{lostDeals.length}</div>
          </div>
        </div>
      </div>

      {/* Grid of Analytical Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Top Loss Reasons */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <XCircle size={18} className="text-rose-400" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Top Nguyên Nhân Thua Thầu Phổ Biến (AC2)
            </h4>
          </div>

          {sortedLossReasons.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có thương vụ thua nào được ghi nhận.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sortedLossReasons.map(([reason, count]) => {
                const percent = Math.round((count / (lostDeals.length || 1)) * 100);
                return (
                  <div key={reason}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{reason}</span>
                      <span className="font-mono" style={{ color: 'var(--danger)', fontWeight: '700' }}>
                        {count} vụ ({percent}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percent}%`, 
                          background: 'linear-gradient(90deg, #f87171, #ef4444)',
                          borderRadius: '3px'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 2: Competitor Intelligence */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Building size={18} className="text-amber-400" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Đối Thủ Thắng Thầu Trực Tiếp (AC2)
            </h4>
          </div>

          {sortedCompetitors.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa ghi nhận đối thủ thắng thầu.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sortedCompetitors.map(([comp, count]) => {
                const percent = Math.round((count / (lostDeals.length || 1)) * 100);
                return (
                  <div key={comp}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{comp}</span>
                      <span className="font-mono text-amber-400" style={{ fontWeight: '700' }}>
                        {count} thương vụ ({percent}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percent}%`, 
                          background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                          borderRadius: '3px'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Top Win Reasons */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Trophy size={18} className="text-emerald-400" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Yếu Tố Quyết Định Thắng Thầu (AC1)
            </h4>
          </div>

          {sortedWinReasons.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa ghi nhận thương vụ thắng.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sortedWinReasons.map(([reason, count]) => {
                const percent = Math.round((count / (wonDeals.length || 1)) * 100);
                return (
                  <div key={reason}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{reason}</span>
                      <span className="font-mono text-emerald-400" style={{ fontWeight: '700' }}>
                        {count} lần ({percent}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percent}%`, 
                          background: 'linear-gradient(90deg, #34d399, #10b981)',
                          borderRadius: '3px'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 4: Actionable Feed / Lessons Learned */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BookOpen size={18} className="text-purple-400" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Bài Học Kinh Nghiệm Thực Chiến (Post-Mortem)
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
            {opportunities
              .filter((o) => o.closedData?.lessonsLearned)
              .map((o) => {
                const isWon = o.stage === 'CLOSED_WON';
                return (
                  <div 
                    key={o.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: `1px solid ${isWon ? 'var(--success-border)' : 'var(--danger-border)'}`,
                      borderLeft: `3px solid ${isWon ? 'var(--success)' : 'var(--danger)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.82rem', color: isWon ? 'var(--success)' : 'var(--danger)' }}>
                        {isWon ? '🏆 BÀI HỌC THẮNG' : '💡 BÀI HỌC THUA'}: {o.customerName}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {o.ownerName}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{o.closedData.lessonsLearned}"
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
