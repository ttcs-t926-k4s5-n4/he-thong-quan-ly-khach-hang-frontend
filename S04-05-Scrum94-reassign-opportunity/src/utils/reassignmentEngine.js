// =====================================================================
// SCRUM-94: Động cơ tính toán phân bổ cơ hội & Ghi nhật ký kiểm toán
// (Reassignment Engine & Audit Logger)
// Đảm bảo 100% tiêu chí chấp nhận AC1, AC2, AC3
// =====================================================================

import { formatDateTime } from './formatters';

/**
 * Tính toán khối lượng công việc hiện tại của toàn bộ đội ngũ bán hàng
 */
export const calculateTeamWorkload = (users, opportunities) => {
  return users.map((user) => {
    // Chỉ tính các deal chưa đóng thất bại hoặc thành công (pipeline đang mở)
    const activeDeals = opportunities.filter(
      (opp) => opp.salesRepId === user.id && opp.stage !== 'CLOSED_LOST'
    );

    const totalValue = activeDeals.reduce((sum, opp) => sum + (opp.value || 0), 0);
    const dealCount = activeDeals.length;
    const maxCap = user.maxCapacity || 5;
    const workloadPercent = Math.min(Math.round((dealCount / maxCap) * 100), 150);

    // Xác định trạng thái động: Nếu đang nghỉ thì giữ nguyên, nếu không thì dựa trên số lượng deal
    let dynamicStatus = user.status;
    if (user.status !== 'ON_LEAVE_SICK' && user.status !== 'ON_LEAVE_MATERNITY') {
      if (dealCount >= 6) {
        dynamicStatus = 'OVERLOADED';
      } else if (dealCount <= 2) {
        dynamicStatus = 'ACTIVE_CAPACITY';
      } else {
        dynamicStatus = 'ACTIVE_NORMAL';
      }
    }

    return {
      ...user,
      activeDealCount: dealCount,
      totalPipelineValue: totalValue,
      workloadPercent,
      activeDeals,
      dynamicStatus,
      isOverloaded: dynamicStatus === 'OVERLOADED',
      isOnLeave: dynamicStatus === 'ON_LEAVE_SICK' || dynamicStatus === 'ON_LEAVE_MATERNITY',
      canAcceptMore: dynamicStatus === 'ACTIVE_CAPACITY' || dynamicStatus === 'ACTIVE_NORMAL'
    };
  });
};

/**
 * Thực hiện phân bổ lại 1 hoặc nhiều cơ hội (Single or Bulk Reassignment) - AC1, AC2, AC3
 */
export const executeReassignment = ({
  opportunities,
  selectedDealIds,
  targetRep,
  reasonData,
  customReasonText = '',
  handoverNotes = '',
  checklist = [],
  initiator = { name: 'Trần Đình Trọng (Trưởng nhóm)', role: 'TEAM_LEAD', id: 'USR-LEAD-01' },
  systemDate = '2026-10-18 09:30'
}) => {
  if (!selectedDealIds || selectedDealIds.length === 0) {
    throw new Error('Chưa chọn cơ hội nào để phân bổ lại.');
  }
  if (!targetRep) {
    throw new Error('Chưa chọn người nhận bàn giao mới.');
  }

  const nowStr = systemDate;
  const timestampId = Date.now().toString().slice(-4);
  const transferId = `TRF-94${timestampId}`;

  const reasonLabel = reasonData.id === 'CUSTOM' && customReasonText.trim()
    ? `Khác: ${customReasonText.trim()}`
    : reasonData.label;

  const notesText = handoverNotes.trim() || reasonData.defaultNotes || 'Không có ghi chú thêm.';

  // Tìm danh sách cơ hội bị tác động
  const affectedDeals = opportunities.filter((opp) => selectedDealIds.includes(opp.id));
  const totalValue = affectedDeals.reduce((sum, opp) => sum + (opp.value || 0), 0);

  // Tập hợp danh sách người cũ (fromReps)
  const fromRepMap = {};
  affectedDeals.forEach((deal) => {
    fromRepMap[deal.salesRepId] = deal.salesRepName;
  });
  const fromRepNames = Object.values(fromRepMap).join(', ');
  const primaryFromRepId = affectedDeals[0]?.salesRepId || 'UNKNOWN';

  // 1. Cập nhật từng cơ hội: Đổi người phụ trách, gắn nhãn MỚI NHẬN BÀN GIAO, giữ nguyên 100% lịch sử cũ (AC2)
  const updatedOpportunities = opportunities.map((opp) => {
    if (!selectedDealIds.includes(opp.id)) {
      return opp;
    }

    const previousRepName = opp.salesRepName;
    const previousRepId = opp.salesRepId;

    // Sự kiện bàn giao đính kèm vào timeline hoạt động của deal (AC2 & AC3)
    const newActivityEvent = {
      id: `ACT-TRF-${Date.now()}-${opp.id}`,
      date: nowStr,
      type: 'REASSIGNMENT',
      author: `${initiator.name}`,
      isSystemEvent: true,
      content: `🔄 [BÀN GIAO QUYỀN SỞ HỮU] Chuyển từ ${previousRepName} ➔ ${targetRep.name}. Lý do: ${reasonLabel}. Ghi chú: ${notesText}`
    };

    // Chi tiết ghi vào lịch sử phân bổ riêng của deal (AC3)
    const newReassignmentRecord = {
      id: `REC-${transferId}-${opp.id}`,
      transferId,
      timestamp: nowStr,
      transferredBy: initiator.name,
      transferredByRole: initiator.role,
      fromRepId: previousRepId,
      fromRepName: previousRepName,
      toRepId: targetRep.id,
      toRepName: targetRep.name,
      reasonId: reasonData.id,
      reasonLabel,
      handoverNotes: notesText,
      checklist: [...checklist]
    };

    return {
      ...opp,
      salesRepId: targetRep.id,
      salesRepName: targetRep.name,
      salesRepAvatar: targetRep.avatar,
      assigneeStatus: targetRep.status || 'ACTIVE_NORMAL',
      isNewlyReassigned: true, // AC2: Người nhận thấy ngay cơ hội trong danh sách của mình kèm huy hiệu
      reassignedAt: nowStr,
      reassignedFromId: previousRepId,
      reassignedFromName: previousRepName,
      reassignCount: (opp.reassignCount || 0) + 1,
      // Bảo tồn 100% activities cũ và thêm sự kiện mới lên đầu
      activities: [newActivityEvent, ...(opp.activities || [])],
      // Thêm vào lịch sử bàn giao của deal
      reassignmentHistory: [newReassignmentRecord, ...(opp.reassignmentHistory || [])]
    };
  });

  // 2. Tạo bản ghi nhật ký chuyển nhượng toàn hệ thống (AC3)
  const newAuditLogEntry = {
    id: transferId,
    batchId: `BATCH-${Date.now()}`,
    timestamp: nowStr,
    dealCount: affectedDeals.length,
    totalValue,
    initiatorId: initiator.id,
    initiatorName: initiator.name,
    initiatorRole: initiator.role,
    fromRepId: primaryFromRepId,
    fromRepName: fromRepNames,
    toRepId: targetRep.id,
    toRepName: targetRep.name,
    reasonId: reasonData.id,
    reasonCategory: reasonData.category || 'GENERAL',
    reasonLabel,
    handoverNotes: notesText,
    checklist: [...checklist],
    deals: affectedDeals.map((d) => ({
      id: d.id,
      title: d.title,
      customerName: d.customerName,
      value: d.value,
      stage: d.stage
    }))
  };

  return {
    updatedOpportunities,
    newAuditLogEntry,
    affectedDealsCount: affectedDeals.length,
    totalValue
  };
};

/**
 * Tự động cân bằng tải cho các cơ hội được chọn (Smart Auto-Balance Distribution)
 * Chia đều các deal cho những người có tải ít nhất
 */
export const executeAutoBalanceDistribution = ({
  opportunities,
  selectedDealIds,
  candidateReps,
  reasonData,
  customReasonText = '',
  handoverNotes = '',
  checklist = [],
  initiator = { name: 'Trần Đình Trọng (Trưởng nhóm)', role: 'TEAM_LEAD', id: 'USR-LEAD-01' },
  systemDate = '2026-10-18 09:35'
}) => {
  if (!selectedDealIds || selectedDealIds.length === 0) {
    throw new Error('Chưa chọn cơ hội nào để phân bổ.');
  }
  // Lọc các ứng viên có thể nhận (không nghỉ, không quá tải)
  const availableReps = candidateReps.filter(
    (r) => r.status !== 'ON_LEAVE_SICK' && r.status !== 'ON_LEAVE_MATERNITY' && r.status !== 'OVERLOADED'
  );

  if (availableReps.length === 0) {
    throw new Error('Không có nhân sự nào đủ điều kiện nhận deal (Tất cả đều đang nghỉ hoặc quá tải).');
  }

  // Clone danh sách ứng viên và đếm deal giả định để chia cân bằng
  const repsWithCapacity = availableReps.map((r) => ({
    ...r,
    virtualCount: opportunities.filter((o) => o.salesRepId === r.id).length
  }));

  const nowStr = systemDate;
  const reasonLabel = reasonData.id === 'CUSTOM' && customReasonText.trim()
    ? `Khác: ${customReasonText.trim()}`
    : reasonData.label;
  const notesText = handoverNotes.trim() || 'Tự động phân bổ cân bằng tải theo khối lượng công việc.';

  let tempOpps = [...opportunities];
  const auditLogs = [];

  selectedDealIds.forEach((dealId, idx) => {
    // Sắp xếp người có ít deal nhất lên đầu
    repsWithCapacity.sort((a, b) => a.virtualCount - b.virtualCount);
    const chosenRep = repsWithCapacity[0];
    chosenRep.virtualCount += 1;

    const deal = tempOpps.find((o) => o.id === dealId);
    if (!deal) return;

    const previousRepName = deal.salesRepName;
    const previousRepId = deal.salesRepId;
    const transferId = `TRF-AUTO-${Date.now().toString().slice(-4)}-${idx + 1}`;

    const newActivityEvent = {
      id: `ACT-TRF-AUTO-${Date.now()}-${deal.id}`,
      date: nowStr,
      type: 'REASSIGNMENT',
      author: `${initiator.name}`,
      isSystemEvent: true,
      content: `⚡ [CÂN BẰNG TẢI TỰ ĐỘNG] Chuyển từ ${previousRepName} ➔ ${chosenRep.name}. Lý do: ${reasonLabel}. Ghi chú: ${notesText}`
    };

    const newReassignmentRecord = {
      id: `REC-${transferId}-${deal.id}`,
      transferId,
      timestamp: nowStr,
      transferredBy: initiator.name,
      transferredByRole: initiator.role,
      fromRepId: previousRepId,
      fromRepName: previousRepName,
      toRepId: chosenRep.id,
      toRepName: chosenRep.name,
      reasonId: reasonData.id,
      reasonLabel: `Cân bằng tải: ${reasonLabel}`,
      handoverNotes: notesText,
      checklist: [...checklist]
    };

    tempOpps = tempOpps.map((o) => {
      if (o.id !== dealId) return o;
      return {
        ...o,
        salesRepId: chosenRep.id,
        salesRepName: chosenRep.name,
        salesRepAvatar: chosenRep.avatar,
        assigneeStatus: chosenRep.status || 'ACTIVE_NORMAL',
        isNewlyReassigned: true,
        reassignedAt: nowStr,
        reassignedFromId: previousRepId,
        reassignedFromName: previousRepName,
        reassignCount: (o.reassignCount || 0) + 1,
        activities: [newActivityEvent, ...(o.activities || [])],
        reassignmentHistory: [newReassignmentRecord, ...(o.reassignmentHistory || [])]
      };
    });

    auditLogs.push({
      id: transferId,
      batchId: `BATCH-AUTO-${Date.now()}`,
      timestamp: nowStr,
      dealCount: 1,
      totalValue: deal.value,
      initiatorId: initiator.id,
      initiatorName: initiator.name,
      initiatorRole: initiator.role,
      fromRepId: previousRepId,
      fromRepName: previousRepName,
      toRepId: chosenRep.id,
      toRepName: chosenRep.name,
      reasonId: reasonData.id,
      reasonCategory: 'WORKLOAD_BALANCE',
      reasonLabel: `Cân bằng tải: ${reasonLabel}`,
      handoverNotes: notesText,
      checklist: [...checklist],
      deals: [{
        id: deal.id,
        title: deal.title,
        customerName: deal.customerName,
        value: deal.value,
        stage: deal.stage
      }]
    });
  });

  return {
    updatedOpportunities: tempOpps,
    auditLogs
  };
};
