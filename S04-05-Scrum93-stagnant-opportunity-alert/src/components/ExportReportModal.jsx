import React from 'react';
import { Download, FileText, Check, X, Printer, Copy } from 'lucide-react';
import { formatVND, formatDateVN } from '../utils/formatters.js';

export const ExportReportModal = ({
  isOpen,
  onClose,
  opportunities,
  metrics,
  onShowToast
}) => {
  if (!isOpen) return null;

  const flaggedDeals = opportunities.filter(o => o.hasFlag);

  const handleDownloadCSV = () => {
    const headers = [
      'Mã Cơ Hội',
      'Tên Thương Vụ',
      'Khách Hàng',
      'Ngành Nghề',
      'Giá Trị (VNĐ)',
      'Giai Đoạn',
      'Nhân Viên Phụ Trách',
      'Ngày Hoạt Động Cuối',
      'Số Ngày Không Hoạt Động',
      'Ngưỡng N Ngày',
      'Ngày Dự Kiến Chốt',
      'Số Ngày Quá Hạn',
      'Loại Cờ Cảnh Báo',
      'Mức Độ Nghiêm Trọng',
      'Đã Can Thiệp'
    ];

    const rows = flaggedDeals.map(o => [
      `"${o.id}"`,
      `"${o.title.replace(/"/g, '""')}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.industry || ''}"`,
      o.value,
      `"${o.stage}"`,
      `"${o.salesRepName}"`,
      `"${o.lastActivityDate}"`,
      o.daysSinceLastActivity,
      o.thresholdDays,
      `"${o.expectedCloseDate}"`,
      o.daysOverdue,
      `"${o.flagType}"`,
      `"${o.severityLabel}"`,
      o.hasIntervention ? '"Đã có chỉ đạo"' : '"Chưa can thiệp"'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Cao_Co_Hoi_Dinh_Tre_SCRUM93_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast('Đã tải xuống file CSV danh sách cơ hội đình trệ thành công!', 'success');
  };

  const handleCopySummary = () => {
    const text = `=== BÁO CÁO CƠ HỘI ĐÌNH TRỆ (SCRUM-93) ===\n` +
      `Thời điểm lập: ${new Date().toLocaleString('vi-VN')}\n` +
      `Tổng số cơ hội có cờ: ${flaggedDeals.length} / ${metrics.openDealsCount} deal\n` +
      `Tổng doanh số đình trệ nguy cơ mất: ${formatVND(metrics.stagnantPipelineValue)}\n` +
      `Số cờ khẩn cấp: ${metrics.criticalCount} thương vụ\n` +
      `Đã can thiệp: ${metrics.intervenedCount} deal (${metrics.rescueRate.toFixed(0)}%)\n\n` +
      `DANH SÁCH CHI TIẾT:\n` +
      flaggedDeals.map((d, i) => `${i + 1}. [${d.id}] ${d.title} - ${d.customerName} | ${formatVND(d.value)} | Phụ trách: ${d.salesRepName} | Cờ: ${d.flagReasons.join('; ')}`).join('\n');

    navigator.clipboard.writeText(text);
    onShowToast('Đã sao chép tóm tắt báo cáo vào bộ nhớ tạm!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Download size={20} style={{ color: '#10b981' }} />
            <span>Xuất Báo Cáo Rủi Ro Cơ Hội Đình Trệ (SCRUM-93)</span>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Tóm Tắt Báo Cáo Can Thiệp Thương Vụ
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cơ hội có cờ:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
                  {flaggedDeals.length} thương vụ
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Doanh số đình trệ:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>
                  {formatVND(metrics.stagnantPipelineValue)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đã chỉ đạo can thiệp:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                  {metrics.intervenedCount} thương vụ
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive" style={{ maxHeight: '250px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <table className="data-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên Thương Vụ</th>
                  <th>Khách Hàng</th>
                  <th>Giá Trị</th>
                  <th>Phụ Trách</th>
                  <th>Lý Do Gắn Cờ</th>
                </tr>
              </thead>
              <tbody>
                {flaggedDeals.map(deal => (
                  <tr key={deal.id}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{deal.id}</td>
                    <td><strong>{deal.title}</strong></td>
                    <td>{deal.customerName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>{formatVND(deal.value)}</td>
                    <td>{deal.salesRepName}</td>
                    <td style={{ color: '#ef4444' }}>{deal.flagReasons[0] || 'Đình trệ'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={handleCopySummary}>
            <Copy size={15} />
            <span>Sao Chép Tóm Tắt</span>
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button className="btn btn-primary" onClick={handleDownloadCSV}>
              <Download size={15} />
              <span>Tải Xuống File CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
