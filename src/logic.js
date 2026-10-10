export const STATUS = {
  ASSIGNED: 'Chờ tiếp nhận',
  WORKING: 'Đang chăm sóc',
  WAITING: 'Chờ phân bổ',
  CONVERTED: 'Đã chuyển đổi',
};

export const isOverdue = (lead, now = new Date()) => {
  if (!lead || lead.firstContactAt || lead.status === STATUS.CONVERTED || lead.status === STATUS.WAITING) return false;
  if (!lead.slaDueAt) return false;
  return new Date(lead.slaDueAt).getTime() < new Date(now).getTime();
};

export const receiveLead = (lead, currentUser, now = new Date()) => ({
  ...lead,
  status: STATUS.WORKING,
  owner: currentUser,
  acceptedAt: new Date(now).toISOString(),
  updatedAt: new Date(now).toISOString(),
  activities: [...(lead.activities || []), {
    id: `act-${Date.now()}`,
    type: 'received',
    title: 'Đã nhận lead',
    detail: `${currentUser} đã nhận lead và bắt đầu chăm sóc.`,
    at: new Date(now).toISOString(),
  }],
});

export const rejectLead = (lead, reason, now = new Date()) => {
  const cleanReason = String(reason || '').trim();
  if (!cleanReason) throw new Error('Vui lòng nhập lý do từ chối.');
  return {
    ...lead,
    status: STATUS.WAITING,
    owner: null,
    rejectedReason: cleanReason,
    updatedAt: new Date(now).toISOString(),
    activities: [...(lead.activities || []), {
      id: `act-${Date.now()}`,
      type: 'rejected',
      title: 'Đã từ chối lead',
      detail: `Lý do: ${cleanReason}`,
      at: new Date(now).toISOString(),
    }],
  };
};

export const logContact = (lead, note = 'Đã ghi nhận liên hệ với khách hàng.', now = new Date()) => ({
  ...lead,
  firstContactAt: lead.firstContactAt || new Date(now).toISOString(),
  updatedAt: new Date(now).toISOString(),
  activities: [...(lead.activities || []), {
    id: `act-${Date.now()}`,
    type: 'contact',
    title: 'Đã liên hệ khách hàng',
    detail: note,
    at: new Date(now).toISOString(),
  }],
});

export const qualifyLead = (lead, now = new Date()) => ({
  ...lead,
  qualified: true,
  updatedAt: new Date(now).toISOString(),
  activities: [...(lead.activities || []), {
    id: `act-${Date.now()}`,
    type: 'qualified',
    title: 'Lead đủ điều kiện chuyển đổi',
    detail: 'Nhân viên xác nhận lead đã đủ điều kiện trở thành khách hàng và cơ hội.',
    at: new Date(now).toISOString(),
  }],
});

export const convertLead = (lead, now = new Date()) => {
  if (!lead.qualified) throw new Error('Lead cần được đánh dấu đủ điều kiện trước khi chuyển đổi.');
  if (lead.status === STATUS.CONVERTED) throw new Error('Lead này đã được chuyển đổi.');
  const stamp = new Date(now).toISOString();
  const customerId = `CUS-${String(lead.id).replace(/\D/g, '').padStart(4, '0')}`;
  const contactId = `CON-${String(lead.id).replace(/\D/g, '').padStart(4, '0')}`;
  const opportunityId = `OPP-${String(lead.id).replace(/\D/g, '').padStart(4, '0')}`;
  const conversionActivity = {
    id: `act-convert-${lead.id}-${new Date(now).getTime()}`,
    type: 'converted',
    title: 'Đã chuyển đổi thành công',
    detail: `Đã tạo khách hàng ${customerId}, người liên hệ ${contactId} và cơ hội ${opportunityId}. Lịch sử hoạt động được giữ nguyên.`,
    at: stamp,
  };
  const customer = {
    id: customerId,
    leadId: lead.id,
    name: lead.company,
    contactName: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    createdAt: stamp,
    activities: [...(lead.activities || []), conversionActivity],
  };
  const contact = {
    id: contactId,
    leadId: lead.id,
    customerId: customer.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    createdAt: stamp,
  };
  const opportunity = {
    id: opportunityId,
    leadId: lead.id,
    customerId: customer.id,
    name: `Cơ hội ${lead.company}`,
    value: Number(lead.potentialValue || 0),
    stage: 'Mới tạo',
    createdAt: stamp,
  };
  const convertedLead = {
    ...lead,
    status: STATUS.CONVERTED,
    convertedAt: stamp,
    updatedAt: stamp,
    customerId: customer.id,
    contactId: contact.id,
    opportunityId: opportunity.id,
    activities: [...(lead.activities || []), conversionActivity],
  };
  return { lead: convertedLead, customer, contact, opportunity };
};

export const applyLeadFilters = (leads, filters, now = new Date()) => {
  const query = (filters.query || '').trim().toLocaleLowerCase('vi');
  return leads.filter((lead) => {
    const matchesQuery = !query || [lead.name, lead.company, lead.email, lead.phone].some((item) => String(item || '').toLocaleLowerCase('vi').includes(query));
    const matchesStatus = !filters.status || lead.status === filters.status;
    const matchesSource = !filters.source || lead.source === filters.source;
    const matchesTemperature = !filters.temperature || lead.temperature === filters.temperature;
    const matchesOwner = !filters.owner || (filters.owner === 'Tôi' ? lead.owner === 'Nguyễn Minh Anh' : lead.owner === filters.owner);
    const matchesOverdue = !filters.overdueOnly || isOverdue(lead, now);
    const created = new Date(lead.createdAt).getTime();
    const afterStart = !filters.startDate || created >= new Date(`${filters.startDate}T00:00:00`).getTime();
    const beforeEnd = !filters.endDate || created <= new Date(`${filters.endDate}T23:59:59.999`).getTime();
    return matchesQuery && matchesStatus && matchesSource && matchesTemperature && matchesOwner && matchesOverdue && afterStart && beforeEnd;
  });
};

export const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'VND', maximumFractionDigits: 0,
}).format(Number(value || 0));
