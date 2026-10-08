// Tiện ích kiểm tra toàn vẹn tham chiếu dữ liệu (SCRUM-65)
// Quy tắc nghiệp vụ: "Giá trị đang được tham chiếu thì không xoá được"

export function getItemReferenceDetails(categoryId, itemId, operationalData) {
  if (!operationalData) {
    return {
      totalReferences: 0,
      isReferenced: false,
      breakdown: { customers: [], leads: [], deals: [], activities: [] }
    };
  }

  const { customers = [], leads = [], deals = [], activities = [] } = operationalData;

  const matchedCustomers = [];
  const matchedLeads = [];
  const matchedDeals = [];
  const matchedActivities = [];

  switch (categoryId) {
    case 'industries':
      customers.forEach(c => {
        if (c.industryId === itemId) matchedCustomers.push(c);
      });
      leads.forEach(l => {
        if (l.industryId === itemId) matchedLeads.push(l);
      });
      deals.forEach(d => {
        if (d.industryId === itemId) matchedDeals.push(d);
      });
      break;

    case 'company_sizes':
      customers.forEach(c => {
        if (c.companySizeId === itemId) matchedCustomers.push(c);
      });
      leads.forEach(l => {
        if (l.companySizeId === itemId) matchedLeads.push(l);
      });
      deals.forEach(d => {
        if (d.companySizeId === itemId) matchedDeals.push(d);
      });
      break;

    case 'lead_sources':
      customers.forEach(c => {
        if (c.leadSourceId === itemId) matchedCustomers.push(c);
      });
      leads.forEach(l => {
        if (l.leadSourceId === itemId) matchedLeads.push(l);
      });
      deals.forEach(d => {
        if (d.leadSourceId === itemId) matchedDeals.push(d);
      });
      break;

    case 'activity_types':
      activities.forEach(a => {
        if (a.activityTypeId === itemId) matchedActivities.push(a);
      });
      break;

    default:
      break;
  }

  const totalReferences =
    matchedCustomers.length +
    matchedLeads.length +
    matchedDeals.length +
    matchedActivities.length;

  return {
    totalReferences,
    isReferenced: totalReferences > 0,
    breakdown: {
      customers: matchedCustomers,
      leads: matchedLeads,
      deals: matchedDeals,
      activities: matchedActivities
    }
  };
}

// Tính toán bảng thống kê số lượng tham chiếu cho toàn bộ danh sách các mục
export function getCategoryUsageMap(categoryId, operationalData) {
  const map = {};
  if (!operationalData) return map;

  const { customers = [], leads = [], deals = [], activities = [] } = operationalData;

  const increment = (id) => {
    if (id) map[id] = (map[id] || 0) + 1;
  };

  switch (categoryId) {
    case 'industries':
      customers.forEach(c => increment(c.industryId));
      leads.forEach(l => increment(l.industryId));
      deals.forEach(d => increment(d.industryId));
      break;
    case 'company_sizes':
      customers.forEach(c => increment(c.companySizeId));
      leads.forEach(l => increment(l.companySizeId));
      deals.forEach(d => increment(d.companySizeId));
      break;
    case 'lead_sources':
      customers.forEach(c => increment(c.leadSourceId));
      leads.forEach(l => increment(l.leadSourceId));
      deals.forEach(d => increment(d.leadSourceId));
      break;
    case 'activity_types':
      activities.forEach(a => increment(a.activityTypeId));
      break;
    default:
      break;
  }

  return map;
}

// Chuyển đổi / Gán lại toàn bộ tham chiếu từ mục cũ sang mục mới (Reassign references)
// Giải pháp an toàn khi muốn dọn dẹp hoặc gộp danh mục mà không làm mất liên kết dữ liệu
export function reassignReferences(categoryId, fromItemId, toItemId, operationalData) {
  const updated = {
    customers: [...operationalData.customers],
    leads: [...operationalData.leads],
    deals: [...operationalData.deals],
    activities: [...operationalData.activities]
  };

  let reassignedCount = 0;

  switch (categoryId) {
    case 'industries':
      updated.customers = updated.customers.map(c => {
        if (c.industryId === fromItemId) {
          reassignedCount++;
          return { ...c, industryId: toItemId };
        }
        return c;
      });
      updated.leads = updated.leads.map(l => {
        if (l.industryId === fromItemId) {
          reassignedCount++;
          return { ...l, industryId: toItemId };
        }
        return l;
      });
      updated.deals = updated.deals.map(d => {
        if (d.industryId === fromItemId) {
          reassignedCount++;
          return { ...d, industryId: toItemId };
        }
        return d;
      });
      break;

    case 'company_sizes':
      updated.customers = updated.customers.map(c => {
        if (c.companySizeId === fromItemId) {
          reassignedCount++;
          return { ...c, companySizeId: toItemId };
        }
        return c;
      });
      updated.leads = updated.leads.map(l => {
        if (l.companySizeId === fromItemId) {
          reassignedCount++;
          return { ...l, companySizeId: toItemId };
        }
        return l;
      });
      updated.deals = updated.deals.map(d => {
        if (d.companySizeId === fromItemId) {
          reassignedCount++;
          return { ...d, companySizeId: toItemId };
        }
        return d;
      });
      break;

    case 'lead_sources':
      updated.customers = updated.customers.map(c => {
        if (c.leadSourceId === fromItemId) {
          reassignedCount++;
          return { ...c, leadSourceId: toItemId };
        }
        return c;
      });
      updated.leads = updated.leads.map(l => {
        if (l.leadSourceId === fromItemId) {
          reassignedCount++;
          return { ...l, leadSourceId: toItemId };
        }
        return l;
      });
      updated.deals = updated.deals.map(d => {
        if (d.leadSourceId === fromItemId) {
          reassignedCount++;
          return { ...d, leadSourceId: toItemId };
        }
        return d;
      });
      break;

    case 'activity_types':
      updated.activities = updated.activities.map(a => {
        if (a.activityTypeId === fromItemId) {
          reassignedCount++;
          return { ...a, activityTypeId: toItemId };
        }
        return a;
      });
      break;

    default:
      break;
  }

  return { updatedData: updated, count: reassignedCount };
}

// Định dạng tiền tệ VNĐ
export function formatVND(amount) {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

// Định dạng số rút gọn (ví dụ 1.2 Tỷ, 450 Tr)
export function formatCompactVND(amount) {
  if (!amount) return '0 ₫';
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1).replace('.0', '') + ' Tỷ ₫';
  }
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + ' Triệu ₫';
  }
  return formatVND(amount);
}
