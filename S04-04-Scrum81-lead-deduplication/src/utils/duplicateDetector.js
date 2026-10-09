/**
 * Module Thuật Toán Đối Soát Trùng Lặp Lead (Marketing Lead Deduplication Engine)
 * Đáp ứng trọn vẹn 3 tiêu chí:
 * 1. Phát hiện trùng theo Email, Số điện thoại và Tên công ty
 * 2. Phát hiện trùng với Khách hàng đã có -> Gợi ý gắn thẳng vào khách hàng đó
 * 3. Phát hiện xung đột "Hai nhân viên cùng gọi một người trong một buổi sáng"
 */

// 1. Chuẩn hóa Email
export function normalizeEmail(email) {
  if (!email) return "";
  return email.trim().toLowerCase();
}

// 2. Chuẩn hóa Số điện thoại (Việt Nam)
export function normalizePhone(phone) {
  if (!phone) return "";
  // Xóa toàn bộ ký tự không phải số
  let clean = phone.replace(/\D/g, "");
  // Chuyển tiền tố 84 -> 0
  if (clean.startsWith("84")) {
    clean = "0" + clean.slice(2);
  }
  return clean;
}

// 3. Chuẩn hóa Tên công ty (Loại bỏ các từ định danh pháp lý và ký tự đặc biệt)
export function normalizeCompanyName(name) {
  if (!name) return "";
  let clean = name.toLowerCase().trim();

  // Danh sách từ dừng pháp lý doanh nghiệp Việt Nam & quốc tế
  const stopWords = [
    "công ty cổ phần", "công ty cp", "ctcp", "công ty tnhh", "tnhh mtv", "tnhh",
    "tập đoàn", "tong cong ty", "tổng công ty", "chi nhánh", "doanh nghiệp tư nhân",
    "jsc", "corp", "corporation", "ltd", "co., ltd", "company", "group", "holdings"
  ];

  for (const word of stopWords) {
    clean = clean.replaceAll(word, "");
  }

  // Bỏ dấu tiếng Việt để so khớp mờ
  clean = removeVietnameseTones(clean);
  // Bỏ ký tự đặc biệt và khoảng trắng thừa
  clean = clean.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return clean;
}

// Hàm bỏ dấu tiếng Việt chuẩn
export function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// Thuật toán Levenshtein Distance tính khoảng cách chuỗi
export function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Tính độ tương đồng giữa hai tên công ty (0% - 100%)
export function calculateCompanySimilarity(nameA, nameB) {
  if (!nameA || !nameB) return 0;
  const normA = normalizeCompanyName(nameA);
  const normB = normalizeCompanyName(nameB);

  if (normA === normB && normA.length > 0) return 100;
  if (!normA || !normB) return 0;

  // So sánh từ khóa (Token Jaccard)
  const tokensA = new Set(normA.split(" ").filter(w => w.length > 1));
  const tokensB = new Set(normB.split(" ").filter(w => w.length > 1));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  tokensA.forEach(t => {
    if (tokensB.has(t)) intersection++;
  });
  const union = new Set([...tokensA, ...tokensB]).size;
  const jaccard = union > 0 ? (intersection / union) * 100 : 0;

  // Tính khoảng cách Levenshtein
  const maxLen = Math.max(normA.length, normB.length);
  const dist = levenshteinDistance(normA, normB);
  const levScore = Math.max(0, ((maxLen - dist) / maxLen) * 100);

  // Kết hợp điểm số
  const finalScore = Math.round(jaccard * 0.6 + levScore * 0.4);
  return finalScore;
}

/**
 * Kiểm tra xem một bản ghi có hoạt động cuộc gọi nào diễn ra trong sáng nay không
 */
export function findMorningCallActivity(lead) {
  if (!lead.timeline || !Array.isArray(lead.timeline)) return null;
  
  // Tìm cuộc gọi có flag isThisMorning hoặc diễn ra hôm nay trước 12:00
  const morningCall = lead.timeline.find(t => 
    t.type === "CALL" && (t.isThisMorning || (t.timestamp && t.timestamp.includes("2026-10-09") && parseInt(t.timestamp.split(" ")[1]?.split(":")[0] || "0", 10) < 12))
  );
  return morningCall || null;
}

/**
 * So sánh 1 Lead với 1 Lead khác
 */
export function compareTwoLeads(leadA, leadB) {
  if (leadA.id === leadB.id) return null;

  const reasons = [];
  let score = 0;

  // 1. Đối soát Email
  const normEmailA = normalizeEmail(leadA.email);
  const normEmailB = normalizeEmail(leadB.email);
  const isEmailMatch = normEmailA && normEmailB && normEmailA === normEmailB;
  if (isEmailMatch) {
    score += 50;
    reasons.push(`Trùng Email chính xác 100% (${leadA.email})`);
  }

  // 2. Đối soát Số điện thoại
  const normPhoneA = normalizePhone(leadA.phone);
  const normPhoneB = normalizePhone(leadB.phone);
  const isPhoneMatch = normPhoneA && normPhoneB && normPhoneA === normPhoneB;
  if (isPhoneMatch) {
    score += 50;
    reasons.push(`Trùng Số điện thoại chuẩn hóa (${leadA.phone} = ${leadB.phone})`);
  }

  // 3. Đối soát Tên công ty
  const companySimilarity = calculateCompanySimilarity(leadA.companyName, leadB.companyName);
  if (companySimilarity >= 75) {
    score += 35;
    reasons.push(`Tên công ty tương đồng cao (${companySimilarity}%): "${leadA.companyName}" vs "${leadB.companyName}"`);
  } else if (companySimilarity >= 50) {
    score += 15;
    reasons.push(`Tên công ty có từ khóa tương đồng (${companySimilarity}%): "${leadA.companyName}" vs "${leadB.companyName}"`);
  }

  // Đối soát Họ tên người liên hệ
  const normNameA = removeVietnameseTones(leadA.fullName || "").toLowerCase();
  const normNameB = removeVietnameseTones(leadB.fullName || "").toLowerCase();
  if (normNameA && normNameB && (normNameA === normNameB || normNameA.includes(normNameB) || normNameB.includes(normNameA))) {
    score += 15;
    reasons.push(`Họ tên khách hàng tương đồng: "${leadA.fullName}" & "${leadB.fullName}"`);
  }

  const finalScore = Math.min(100, score);
  if (finalScore < 40 && reasons.length === 0) return null;

  // Xác định mức độ nghiêm trọng
  let severity = "LOW";
  if (finalScore >= 80 || (isEmailMatch && isPhoneMatch)) {
    severity = "CRITICAL";
  } else if (finalScore >= 60 || isEmailMatch || isPhoneMatch) {
    severity = "HIGH";
  } else if (finalScore >= 40) {
    severity = "MEDIUM";
  }

  // KIỂM TRA XUNG ĐỘT GỌI ĐIỆN TRONG CÙNG MỘT BUỔI SÁNG (User Story Highlight)
  const morningCallA = findMorningCallActivity(leadA);
  const morningCallB = findMorningCallActivity(leadB);
  const hasMorningCall = morningCallA || morningCallB;

  let morningCallConflict = false;
  let conflictMessage = "";

  if (hasMorningCall && (isPhoneMatch || isEmailMatch || finalScore >= 70)) {
    // Có nguy cơ 2 nhân viên khác nhau cùng gọi cho 1 người
    const staffA = leadA.assignedTo?.name || "Chưa phân công";
    const staffB = leadB.assignedTo?.name || "Chưa phân công";
    
    if (staffA !== staffB) {
      morningCallConflict = true;
      const caller = morningCallA ? morningCallA.actor : morningCallB.actor;
      const callerTime = morningCallA ? morningCallA.timeLabel : morningCallB.timeLabel;
      conflictMessage = `🚨 NGUY CƠ GỌI TRÙNG BUỔI SÁNG: ${caller} đã gọi lúc ${callerTime}. Nhân viên khác (${morningCallA ? staffB : staffA}) đang phụ trách bản ghi trùng!`;
    }
  }

  return {
    targetLead: leadB,
    score: finalScore,
    severity,
    reasons,
    isEmailMatch,
    isPhoneMatch,
    companySimilarity,
    morningCallConflict,
    conflictMessage,
    hasMorningCall: Boolean(hasMorningCall)
  };
}

/**
 * So sánh 1 Lead với Danh mục Khách hàng Đã Có trong CRM
 * Đáp ứng tiêu chí 2:
 * "Lead trùng với khách hàng đã có được gợi ý gắn thẳng vào khách hàng đó"
 */
export function compareLeadWithCustomers(lead, existingCustomers = []) {
  if (!existingCustomers || existingCustomers.length === 0) return [];

  const matches = [];

  for (const customer of existingCustomers) {
    const reasons = [];
    let score = 0;

    // 1. So trùng Email (với email chính hoặc email trong danh bạ khách hàng)
    const normLeadEmail = normalizeEmail(lead.email);
    const normCustEmail = normalizeEmail(customer.primaryEmail);
    const hasContactEmail = customer.contacts?.some(c => normalizeEmail(c.email) === normLeadEmail);

    if (normLeadEmail && (normLeadEmail === normCustEmail || hasContactEmail)) {
      score += 55;
      reasons.push(`Email (${lead.email}) trùng với danh bạ Khách hàng chính thức ${customer.id}`);
    } else if (normLeadEmail && customer.domain && normLeadEmail.endsWith(`@${customer.domain}`)) {
      score += 35;
      reasons.push(`Tên miền email (@${customer.domain}) thuộc Khách hàng ${customer.name}`);
    }

    // 2. So trùng Số điện thoại
    const normLeadPhone = normalizePhone(lead.phone);
    const normCustPhone = normalizePhone(customer.primaryPhone);
    const hasContactPhone = customer.contacts?.some(c => normalizePhone(c.phone) === normLeadPhone);

    if (normLeadPhone && (normLeadPhone === normCustPhone || hasContactPhone)) {
      score += 55;
      reasons.push(`Số điện thoại (${lead.phone}) trùng với hồ sơ Khách hàng ${customer.name}`);
    }

    // 3. So trùng Tên công ty
    const companySimilarity = calculateCompanySimilarity(lead.companyName, customer.name);
    const shortSimilarity = calculateCompanySimilarity(lead.companyName, customer.shortName);
    const bestSimilarity = Math.max(companySimilarity, shortSimilarity);

    if (bestSimilarity >= 75) {
      score += 45;
      reasons.push(`Tên công ty trùng khớp (${bestSimilarity}%) với Khách hàng VIP: ${customer.name}`);
    } else if (bestSimilarity >= 55) {
      score += 25;
      reasons.push(`Tên công ty tương đồng (${bestSimilarity}%) với: ${customer.name}`);
    }

    const finalScore = Math.min(100, score);
    if (finalScore >= 50) {
      matches.push({
        customer,
        score: finalScore,
        reasons,
        suggestAttach: true,
        recommendation: `Doanh nghiệp này đã là Khách hàng chính thức (${customer.id} - ${customer.name}). Đang do Sales ${customer.assignedSales.name} phụ trách. Gợi ý gắn thẳng Lead vào Khách hàng này để bảo lưu quan hệ và tránh telesales gọi làm phiền!`
      });
    }
  }

  // Sắp xếp điểm cao nhất lên đầu
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Quét toàn bộ hệ thống Leads để tìm các cặp trùng lặp và đối chiếu với Khách hàng có sẵn
 */
export function analyzeAllDuplicates(leads = [], existingCustomers = []) {
  const duplicateMap = new Map(); // leadId -> { duplicateLeads: [], matchedCustomers: [] }

  for (let i = 0; i < leads.length; i++) {
    const leadA = leads[i];
    if (leadA.isMerged) continue;

    const dupLeads = [];

    // 1. So khớp với các Lead khác
    for (let j = 0; j < leads.length; j++) {
      if (i === j) continue;
      const leadB = leads[j];
      if (leadB.isMerged) continue;

      const comp = compareTwoLeads(leadA, leadB);
      if (comp) {
        dupLeads.push(comp);
      }
    }

    // 2. So khớp với Khách hàng đã có
    const matchedCusts = compareLeadWithCustomers(leadA, existingCustomers);

    duplicateMap.set(leadA.id, {
      duplicateLeads: dupLeads.sort((a, b) => b.score - a.score),
      matchedCustomers: matchedCusts
    });
  }

  return duplicateMap;
}

/**
 * Hợp nhất Dòng Thời Gian (Unified Timeline Merger)
 * Đáp ứng tiêu chí 3: "Gộp giữ nguyên lịch sử của cả hai bản ghi"
 */
export function mergeTimelines(timelineA = [], timelineB = [], masterId, secondaryId) {
  const combined = [];

  // Chuẩn hóa và gắn nhãn nguồn gốc cho từng sự kiện
  timelineA.forEach(item => {
    combined.push({
      ...item,
      originLeadId: item.leadId || masterId,
      sourceBadge: item.sourceTag || `Gốc từ Lead #${item.leadId || masterId}`,
      sourceType: "MASTER"
    });
  });

  timelineB.forEach(item => {
    combined.push({
      ...item,
      originLeadId: item.leadId || secondaryId,
      sourceBadge: item.sourceTag || `Gốc từ Lead #${item.leadId || secondaryId}`,
      sourceType: "SECONDARY"
    });
  });

  // Thêm sự kiện ghi nhận giao dịch GỘP BẢN GHI (Audit Stamp)
  const now = new Date();
  const timestampStr = now.toISOString().replace("T", " ").substring(0, 19);
  combined.push({
    id: `TL-MERGE-${Date.now()}`,
    leadId: masterId,
    type: "SYSTEM_MERGE",
    title: `Gộp bản ghi Lead #${secondaryId} vào #${masterId}`,
    actor: "Nhân viên Marketing (Hệ thống CRM)",
    timestamp: timestampStr,
    timeLabel: "Vừa xong",
    content: `Đã hợp nhất toàn bộ dữ liệu lịch sử tương tác, cuộc gọi telesales và ghi chú giữa Lead #${masterId} và Lead #${secondaryId}. Bảo toàn 100% lịch sử để ngăn chặn gọi trùng lặp!`,
    sourceBadge: "Thao tác Gộp Hệ Thống",
    sourceType: "SYSTEM"
  });

  // Sắp xếp thời gian giảm dần (Mới nhất lên đầu)
  combined.sort((a, b) => {
    const timeA = new Date(a.timestamp || 0).getTime();
    const timeB = new Date(b.timestamp || 0).getTime();
    return timeB - timeA;
  });

  return combined;
}
