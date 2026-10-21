import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../utils/formatters';
import { generateExecutiveAnswer } from '../utils/forecastCalculations';

export const ExecutiveAnswerBox = ({ stats, periodFilter, periodLabel }) => {
  const answer = generateExecutiveAnswer(stats, periodLabel);

  const isExceeded = stats.gapToTarget <= 0;
  const attainmentFormatted = formatPercent(stats.projectedAttainmentRate);

  return (
    <section className="executive-answer-box">
      <div className="answer-header">
        <div className="answer-title-group">
          <span className="badge-ai">
            <Sparkles size={12} />
            AI Executive Answer
          </span>
          <span className="answer-question">
            Câu hỏi của Giám đốc kinh doanh: <strong>"{periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1)} về bao nhiêu bằng số liệu?"</strong>
          </span>
        </div>
        <div className="confidence-chip">
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
          {answer.confidenceBadge}
        </div>
      </div>

      <div className="answer-headline">
        <span>{answer.headline}</span>
      </div>

      <div className="answer-detail-grid">
        <div className="answer-paragraphs">
          <p>{answer.statusSentence}</p>
          <p>{answer.adviceSentence}</p>
        </div>

        <div className="answer-quick-stats">
          <div className="quick-stat-card">
            <div className="quick-stat-label">Đã Chốt Thực Tế</div>
            <div className="quick-stat-val highlight-green">
              {formatCompactCurrency(stats.actualClosedWon)}
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-label">Dự Báo Trọng Số</div>
            <div className="quick-stat-val highlight-indigo">
              {formatCompactCurrency(stats.weightedForecast)}
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-label">Khoảng Cách Chỉ Tiêu</div>
            <div className={`quick-stat-val ${isExceeded ? 'highlight-green' : 'highlight-amber'}`}>
              {isExceeded ? `+${formatCompactCurrency(Math.abs(stats.gapToTarget))}` : `-${formatCompactCurrency(stats.gapToTarget)}`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
