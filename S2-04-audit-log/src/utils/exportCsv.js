// Xuất nhật ký kiểm toán sang file CSV với UTF-8 BOM để mở tiếng Việt trong Excel chuẩn 100%
export function exportLogsToCSV(logs, filename = 'Nhat_Ky_Kiem_Toan_Du_Lieu_Nhay_Cam_SCRUM62.csv') {
  if (!logs || logs.length === 0) {
    alert('Không có dữ liệu nhật ký để xuất!');
    return;
  }

  const headers = [
    'Mã bản ghi',
    'Thời điểm',
    'Người thực hiện',
    'Email',
    'Vai trò người sửa',
    'Địa chỉ IP',
    'Loại đối tượng',
    'Mã đối tượng',
    'Tên đối tượng',
    'Trường dữ liệu',
    'Giá trị trước (Cũ)',
    'Giá trị sau (Mới)',
    'Hành động',
    'Mức độ rủi ro',
    'Dấu hiệu lệch cuối quý',
    'Lý do điều chỉnh',
    'Người phê duyệt',
    'Mã băm SHA256'
  ];

  const rows = logs.map((log) => [
    `"${log.id}"`,
    `"${log.timestamp}"`,
    `"${log.user?.name || ''}"`,
    `"${log.user?.email || ''}"`,
    `"${log.user?.role || ''}"`,
    `"${log.ipAddress || ''}"`,
    `"${log.objectType}"`,
    `"${log.targetId}"`,
    `"${(log.targetName || '').replace(/"/g, '""')}"`,
    `"${log.fieldName}"`,
    `"${(log.oldValue || '').replace(/"/g, '""')}"`,
    `"${(log.newValue || '').replace(/"/g, '""')}"`,
    `"${log.changeType}"`,
    `"${log.severity}"`,
    `"${log.isAnomalous ? 'CÓ (BẤT THƯỜNG)' : 'Bình thường'}"`,
    `"${(log.reason || '').replace(/"/g, '""')}"`,
    `"${(log.approvedBy || '').replace(/"/g, '""')}"`,
    `"${log.integrityHash}"`
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
