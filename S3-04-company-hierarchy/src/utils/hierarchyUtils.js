/**
 * TIỆN ÍCH NGHIỆP VỤ & THUẬT TOÁN QUẢN LÝ QUAN HỆ CÔNG TY MẸ - CON
 * SCRUM-18 / SCRUM-73
 */

/**
 * Định dạng tiền tệ VNĐ đầy đủ (ví dụ: 45.000.000.000 đ)
 */
export function formatCurrencyVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount).replace('₫', 'đ');
}

/**
 * Định dạng tiền tệ VNĐ rút gọn (ví dụ: 197 Tỷ đ, 24.5 Tỷ đ, 850 Tr đ)
 */
export function formatShortVND(amount) {
  if (!amount || isNaN(amount)) return '0 đ';
  const absAmount = Math.abs(amount);
  if (absAmount >= 1_000_000_000_000) {
    return (amount / 1_000_000_000_000).toFixed(1).replace('.0', '') + ' Nghìn tỷ đ';
  }
  if (absAmount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1).replace('.0', '') + ' Tỷ đ';
  }
  if (absAmount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace('.0', '') + ' Tr đ';
  }
  return formatCurrencyVND(amount);
}

/**
 * Lấy danh sách các công ty con trực tiếp (Direct Subsidiaries)
 */
export function getDirectSubsidiaries(parentId, allCustomers) {
  if (!parentId || !allCustomers) return [];
  return allCustomers.filter((c) => c.parentId === parentId);
}

/**
 * Lấy toàn bộ công ty con và cháu đệ quy (All Descendants)
 */
export function getAllDescendants(parentId, allCustomers) {
  const direct = getDirectSubsidiaries(parentId, allCustomers);
  let all = [...direct];
  for (const child of direct) {
    all = all.concat(getAllDescendants(child.id, allCustomers));
  }
  return all;
}

/**
 * Lấy chuỗi công ty mẹ và tổ tiên (All Ancestors)
 */
export function getAllAncestors(customerId, allCustomers) {
  const current = allCustomers.find((c) => c.id === customerId);
  if (!current || !current.parentId) return [];
  const parent = allCustomers.find((c) => c.id === current.parentId);
  if (!parent) return [];
  return [parent, ...getAllAncestors(parent.id, allCustomers)];
}

/**
 * Tìm công ty mẹ tối cao (Ultimate Root Parent)
 */
export function getRootParent(customerId, allCustomers) {
  const current = allCustomers.find((c) => c.id === customerId);
  if (!current) return null;
  if (!current.parentId) return current;
  const ancestors = getAllAncestors(customerId, allCustomers);
  return ancestors.length > 0 ? ancestors[ancestors.length - 1] : current;
}

/**
 * Kiểm tra xem khách hàng có phải là công ty mẹ không (có ít nhất 1 công ty con)
 */
export function isParentCompany(customer, allCustomers) {
  if (!customer) return false;
  return allCustomers.some((c) => c.parentId === customer.id);
}

/**
 * Kiểm tra xem khách hàng có phải công ty con không
 */
export function isSubsidiary(customer) {
  return Boolean(customer && customer.parentId);
}

/**
 * Kiểm tra xem khách hàng có phải độc lập không (không có mẹ và không có con)
 */
export function isIndependent(customer, allCustomers) {
  if (!customer) return false;
  return !isSubsidiary(customer) && !isParentCompany(customer, allCustomers);
}

/**
 * Tính tổng hợp đồng cá nhân của 1 khách hàng cụ thể
 */
export function getIndividualContractValue(customerId, allContracts) {
  if (!customerId || !allContracts) return 0;
  return allContracts
    .filter((ct) => ct.customerId === customerId)
    .reduce((sum, ct) => sum + (ct.value || 0), 0);
}

/**
 * Đếm số hợp đồng cá nhân của 1 khách hàng
 */
export function getIndividualContractCount(customerId, allContracts) {
  if (!customerId || !allContracts) return 0;
  return allContracts.filter((ct) => ct.customerId === customerId).length;
}

/**
 * TÍNH TOÁN TỔNG GIÁ TRỊ HỢP NHẤT CỦA CẢ TẬP ĐOÀN (TIÊU CHÍ 2 JIRA)
 * Trang công ty mẹ hiển thị tổng giá trị hợp đồng của cả nhóm công ty
 */
export function calculateGroupTotals(parentCustomerId, allCustomers, allContracts, allDeals = []) {
  const parent = allCustomers.find((c) => c.id === parentCustomerId);
  if (!parent) {
    return {
      parent,
      totalGroupValue: 0,
      parentDirectValue: 0,
      subsidiariesValue: 0,
      totalContractsCount: 0,
      parentContractsCount: 0,
      subsidiariesContractsCount: 0,
      subsidiariesCount: 0,
      totalEntitiesCount: 1,
      totalPipelineValue: 0,
      breakdown: []
    };
  }

  // Toàn bộ công ty thành viên trong tập đoàn (Mẹ + các con, cháu)
  const descendants = getAllDescendants(parentCustomerId, allCustomers);
  const groupEntities = [parent, ...descendants];
  const groupEntityIds = groupEntities.map((e) => e.id);

  // Hợp đồng của riêng mẹ
  const parentContracts = allContracts.filter((ct) => ct.customerId === parentCustomerId);
  const parentDirectValue = parentContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);

  // Hợp đồng của các con
  const subContracts = allContracts.filter(
    (ct) => ct.customerId !== parentCustomerId && groupEntityIds.includes(ct.customerId)
  );
  const subsidiariesValue = subContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);

  // Tổng toàn tập đoàn
  const totalGroupValue = parentDirectValue + subsidiariesValue;
  const totalContractsCount = parentContracts.length + subContracts.length;

  // Pipeline deals của cả tập đoàn
  const groupDeals = allDeals.filter((d) => groupEntityIds.includes(d.customerId));
  const totalPipelineValue = groupDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  // Phân bổ tỷ trọng từng pháp nhân (Breakdown list)
  const breakdown = groupEntities.map((entity) => {
    const entityContracts = allContracts.filter((ct) => ct.customerId === entity.id);
    const value = entityContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);
    const percent = totalGroupValue > 0 ? (value / totalGroupValue) * 100 : 0;

    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      shortName: entity.shortName,
      isParent: entity.id === parentCustomerId,
      relationType: entity.relationType,
      ownershipPercent: entity.ownershipPercent,
      salesOwner: entity.salesOwner,
      contractCount: entityContracts.length,
      contractValue: value,
      percentOfGroup: Number(percent.toFixed(1)),
      color: entity.avatarBg || '#3b82f6'
    };
  });

  // Sắp xếp breakdown: Công ty mẹ đầu tiên, sau đó theo giá trị hợp đồng giảm dần
  breakdown.sort((a, b) => {
    if (a.isParent) return -1;
    if (b.isParent) return 1;
    return b.contractValue - a.contractValue;
  });

  return {
    parent,
    groupEntities,
    totalGroupValue,
    parentDirectValue,
    subsidiariesValue,
    totalContractsCount,
    parentContractsCount: parentContracts.length,
    subsidiariesContractsCount: subContracts.length,
    subsidiariesCount: descendants.length,
    totalEntitiesCount: groupEntities.length,
    totalPipelineValue,
    breakdown
  };
}

/**
 * XÂY DỰNG CÂY TẬP ĐOÀN ĐỆ QUY ĐỂ HIỂN THỊ TRỰC QUAN (Corporate Tree Hierarchy)
 */
export function buildCorporateTree(rootId, allCustomers, allContracts) {
  const nodeCustomer = allCustomers.find((c) => c.id === rootId);
  if (!nodeCustomer) return null;

  const directChildren = getDirectSubsidiaries(rootId, allCustomers);
  const nodeContracts = allContracts.filter((ct) => ct.customerId === rootId);
  const nodeValue = nodeContracts.reduce((sum, ct) => sum + (ct.value || 0), 0);

  return {
    ...nodeCustomer,
    isRoot: !nodeCustomer.parentId,
    contractsCount: nodeContracts.length,
    individualValue: nodeValue,
    children: directChildren.map((child) => buildCorporateTree(child.id, allCustomers, allContracts))
  };
}

/**
 * KIỂM TRA HỢP LỆ KHI GẮN QUAN HỆ MẸ - CON (TIÊU CHÍ 1 JIRA)
 * Chống tự gán chính mình (Self-parenting) & Chống vòng lặp tuần hoàn (Circular loop)
 */
export function validateParentChildRelation(childId, proposedParentId, allCustomers) {
  if (!childId) {
    return { isValid: false, message: 'Vui lòng chọn công ty con cần gắn!' };
  }
  if (!proposedParentId) {
    return { isValid: false, message: 'Vui lòng chọn công ty mẹ quản lý!' };
  }

  // 1. Không thể tự gắn chính mình làm mẹ của mình
  if (childId === proposedParentId) {
    return {
      isValid: false,
      isSelf: true,
      message: 'Không thể chọn cùng một công ty: Một pháp nhân không thể tự làm công ty mẹ của chính mình!'
    };
  }

  // 2. Chống vòng lặp tuần hoàn:
  // Nếu công ty mẹ được đề xuất (proposedParentId) lại là con hoặc cháu của childId
  const childDescendants = getAllDescendants(childId, allCustomers);
  const isParentInChildDescendants = childDescendants.some((d) => d.id === proposedParentId);

  if (isParentInChildDescendants) {
    const parentCustomer = allCustomers.find((c) => c.id === proposedParentId);
    const childCustomer = allCustomers.find((c) => c.id === childId);
    return {
      isValid: false,
      isCircular: true,
      message: `Phát hiện xung đột vòng lặp tuần hoàn (Circular Loop): Công ty "${parentCustomer?.shortName || proposedParentId}" hiện đang là công ty con trực thuộc của "${childCustomer?.shortName || childId}". Do đó không thể đảo ngược quan hệ này!`
    };
  }

  // 3. Kiểm tra xem công ty con hiện tại đã có công ty mẹ khác chưa
  const childCustomer = allCustomers.find((c) => c.id === childId);
  if (childCustomer && childCustomer.parentId && childCustomer.parentId !== proposedParentId) {
    const currentParent = allCustomers.find((c) => c.id === childCustomer.parentId);
    return {
      isValid: true,
      hasExistingParent: true,
      currentParent,
      message: `Lưu ý: "${childCustomer.shortName}" hiện đang thuộc Tập đoàn "${currentParent?.shortName || 'Khác'}". Thao tác này sẽ chuyển đổi sang Tập đoàn mới.`
    };
  }

  return {
    isValid: true,
    hasExistingParent: false,
    message: 'Quan hệ công ty mẹ - con hoàn toàn hợp lệ.'
  };
}
