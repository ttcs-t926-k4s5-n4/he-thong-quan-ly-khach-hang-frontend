// =====================================================================
// SCRUM-93: Cấu hình & Lịch sử tác vụ đánh giá hàng ngày (AC4)
// Tác vụ đánh giá tự động (Daily Evaluation Batch Job) chạy mỗi ngày 1 lần
// =====================================================================

export const DEFAULT_JOB_CONFIG = {
  jobName: 'Đánh Giá & Quét Cảnh Báo Cơ Hội Đình Trệ (Daily Stagnancy Evaluator)',
  cronSchedule: '0 6 * * *', // Chạy lúc 06:00 AM mỗi ngày
  scheduleDescription: 'Chạy tự động mỗi ngày một lần vào lúc 06:00:00 sáng',
  autoNotifyTeamLead: true,
  notifyChannels: ['IN_APP_ALERT', 'EMAIL_DIGEST', 'SLACK_WEBHOOK'],
  stagnantThresholdMultiplierCritical: 1.5
};

export const INITIAL_JOB_HISTORY = [
  {
    id: 'JOB-LOG-20261018-01',
    executionTime: '2026-10-18 06:00:00',
    triggerType: 'CRON_SCHEDULED',
    triggeredBy: 'Hệ thống tự động (Daily Cron)',
    status: 'SUCCESS',
    durationMs: 385,
    scannedCount: 15,
    flaggedCount: 8,
    newlyFlagged: 2,
    unflagged: 1,
    note: 'Đã hoàn tất đánh giá hàng ngày. Phát hiện 2 cơ hội mới vi phạm ngưỡng N ngày và 1 cơ hội quá hạn chốt.'
  },
  {
    id: 'JOB-LOG-20261017-01',
    executionTime: '2026-10-17 06:00:00',
    triggerType: 'CRON_SCHEDULED',
    triggeredBy: 'Hệ thống tự động (Daily Cron)',
    status: 'SUCCESS',
    durationMs: 412,
    scannedCount: 15,
    flaggedCount: 7,
    newlyFlagged: 1,
    unflagged: 0,
    note: 'Quét tự động định kỳ 06:00 AM. Gửi email tóm tắt 7 cơ hội đình trệ đến Trưởng nhóm Trần Đình Trọng.'
  },
  {
    id: 'JOB-LOG-20261016-01',
    executionTime: '2026-10-16 06:00:00',
    triggerType: 'CRON_SCHEDULED',
    triggeredBy: 'Hệ thống tự động (Daily Cron)',
    status: 'SUCCESS',
    durationMs: 390,
    scannedCount: 14,
    flaggedCount: 6,
    newlyFlagged: 2,
    unflagged: 2,
    note: 'Quét tự động định kỳ 06:00 AM. 2 cơ hội được gỡ cờ do Sales Rep ghi nhận cuộc gọi và họp trực tiếp.'
  },
  {
    id: 'JOB-LOG-20261015-01',
    executionTime: '2026-10-15 06:00:00',
    triggerType: 'CRON_SCHEDULED',
    triggeredBy: 'Hệ thống tự động (Daily Cron)',
    status: 'SUCCESS',
    durationMs: 440,
    scannedCount: 14,
    flaggedCount: 6,
    newlyFlagged: 1,
    unflagged: 0,
    note: 'Quét tự động định kỳ 06:00 AM. Hoàn thành 100% pipeline.'
  }
];
