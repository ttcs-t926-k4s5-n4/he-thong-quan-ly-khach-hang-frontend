import React, { useState } from 'react';
import { X, Copy, Download, Check, Printer, FileSpreadsheet } from 'lucide-react';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';

export const ExportReportModal = ({
  isOpen,
  onClose,
  stats,
  opportunities,
  periodLabel,
  teamStats,
  repStats
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateReportText = () => {
    return `=== BÁO CÁO DỰ BÁO DOANH SỐ THEO TRỌNG SỐ XÁC SUẤT (SCRUM-92) ===
Kỳ báo cáo: ${periodLabel.toUpperCase()}
Ngày lập: ${new Date().toLocaleDateString('vi-VN')}

1. CHỈ SỐ TỔNG HỢP:
- Chỉ tiêu giao (Quota): ${formatCurrency(stats.targetQuota)}
- Đã chốt thực tế (Won): ${formatCurrency(stats.actualClosedWon)} (${formatPercent(stats.actualAttainmentRate)})
- Dự báo trọng số (Weighted): ${formatCurrency(stats.weightedForecast)}
- Tổng doanh số kỳ vọng (Projected): ${formatCurrency(stats.totalProjectedRevenue)} (${formatPercent(stats.projectedAttainmentRate)})
- Khoảng cách chỉ tiêu (Gap): ${stats.gapToTarget <= 0 ? 'VƯỢT' : 'THIẾU'} ${formatCurrency(Math.abs(stats.gapToTarget))}

2. PHÂN TÍCH 3 KỊCH BẢN:
- Kịch bản Tối thiểu (Worst Case): ${formatCurrency(stats.scenarios.worstCase)}
- Kịch bản Kỳ vọng (Most Likely): ${formatCurrency(stats.scenarios.mostLikely)}
- Kịch bản Tối đa (Best Case): ${formatCurrency(stats.scenarios.bestCase)}

3. DỰ BÁO THEO NHÓM KINH DOANH:
${teamStats.map(t => `- ${t.teamName}: Chỉ tiêu ${formatCurrency(t.quota)} | Đã chốt ${formatCurrency(t.actualWon)} | Dự báo ${formatCurrency(t.weighted)} | Tổng kỳ vọng ${formatCurrency(t.totalProjected)} (${formatPercent(t.attainment)})`).join('\n')}

4. TOP NHÂN VIÊN KINH DOANH:
${repStats.map((r, i) => `${i + 1}. ${r.name} (${r.teamName}): ${formatCurrency(r.totalProjected)} (${formatPercent(r.attainment)} quota)`).join('\n')}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = ['Mã cơ hội', 'Tên cơ hội', 'Khách hàng', 'Phụ trách', 'Nhóm', 'Giai đoạn', 'Xác suất (%)', 'Giá trị (VNĐ)', 'Dự kiến chốt'];
    const rows = opportunities.map(o => [
      o.id,
      `"${o.title.replace(/"/g, '""')}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.ownerName,
      o.teamName,
      o.stage,
      o.probability,
      o.expectedValue,
      o.expectedCloseDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_Du_Bao_Doanh_So_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: 700 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileSpreadsheet size={18} color="var(--accent-primary)" />
            <h2 className="modal-title">Xuất Báo Cáo Dự Báo Doanh Số</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Sao chép bản tóm tắt số liệu điều hành cho Giám đốc kinh doanh hoặc tải danh sách chi tiết các cơ hội bán hàng dưới dạng file CSV/Excel.
          </div>

          <pre style={{ 
            background: 'var(--bg-primary)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.78rem',
            lineHeight: 1.5,
            maxHeight: 260,
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {generateReportText()}
          </pre>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={handleDownloadCsv}>
            <Download size={14} />
            Tải CSV / Excel ({opportunities.length} deal)
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={handleCopy}>
              {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              {copied ? 'Đã Sao Chép!' : 'Sao Chép Báo Cáo'}
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
