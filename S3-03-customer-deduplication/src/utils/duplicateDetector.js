// =============================================================================
// THUẬT TOÁN PHÁT HIỆN TRÙNG LẶP KHÁCH HÀNG (SCRUM-18 / SCRUM-72)
// Tiêu chí: Mã số thuế, Tên công ty gần giống, Website
// =============================================================================

/**
 * Chuẩn hóa mã số thuế (bỏ dấu gạch ngang, dấu cách, khoảng trắng)
 */
export function normalizeTaxCode(tax) {
  if (!tax) return '';
  return String(tax).replace(/[\s\.\-_]/g, '').trim().toUpperCase();
}

/**
 * Chuẩn hóa địa chỉ Website về tên miền gốc
 */
export function normalizeWebsite(url) {
  if (!url) return '';
  let cleaned = String(url).toLowerCase().trim();
  // Bỏ protocol
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  // Bỏ www.
  cleaned = cleaned.replace(/^www\./i, '');
  // Bỏ trailing slash và path
  cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0];
  return cleaned;
}

/**
 * Loại bỏ dấu tiếng Việt để so khớp chuỗi không phân biệt dấu
 */
export function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str);
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

/**
 * Chuẩn hóa tên doanh nghiệp: Loại bỏ các từ định danh pháp lý phổ biến
 */
export function normalizeCompanyName(name) {
  if (!name) return '';
  let str = removeVietnameseTones(name).toLowerCase();

  // Danh sách các từ dừng pháp lý doanh nghiệp Việt Nam
  const stopWords = [
    'cong ty co phan',
    'cong ty tnhh mtv',
    'cong ty tnhh',
    'tong cong ty',
    'tap doan',
    'doanh nghiep tu nhan',
    'chi nhanh',
    'van phong dai dien',
    'cong ty',
    'ctcp',
    'tnhh',
    'jsc',
    'corp',
    'corporation',
    'ltd',
    'limited',
    'group',
    'holding',
    'viet nam',
    'vn'
  ];

  for (const word of stopWords) {
    const reg = new RegExp(`\\b${word}\\b`, 'gi');
    str = str.replace(reg, ' ');
  }

  // Bỏ ký tự đặc biệt, giữ lại chữ và số
  str = str.replace(/[^a-z0-9\s]/g, ' ');
  // Chuẩn hóa khoảng trắng
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Tính khoảng cách Levenshtein giữa 2 chuỗi
 */
function levenshteinDistance(s1, s2) {
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

/**
 * Tính độ tương đồng giữa 2 tên công ty (0 - 100%)
 */
export function computeNameSimilarity(nameA, nameB) {
  const normA = normalizeCompanyName(nameA);
  const normB = normalizeCompanyName(nameB);

  if (!normA || !normB) return 0;
  if (normA === normB) return 100;

  // Nếu một bên chứa trọn vẹn bên kia
  if (normA.includes(normB) || normB.includes(normA)) {
    const minLen = Math.min(normA.length, normB.length);
    const maxLen = Math.max(normA.length, normB.length);
    return Math.round((minLen / maxLen) * 95);
  }

  // So khớp token từ ngữ (Token Jaccard)
  const tokensA = new Set(normA.split(' ').filter(t => t.length > 1));
  const tokensB = new Set(normB.split(' ').filter(t => t.length > 1));

  if (tokensA.size > 0 && tokensB.size > 0) {
    let intersection = 0;
    for (const t of tokensA) {
      if (tokensB.has(t)) intersection++;
    }
    const union = new Set([...tokensA, ...tokensB]).size;
    const jaccard = (intersection / union) * 100;

    // Khoảng cách Levenshtein
    const maxLen = Math.max(normA.length, normB.length);
    const dist = levenshteinDistance(normA, normB);
    const levRatio = ((maxLen - dist) / maxLen) * 100;

    // Trung bình có trọng số giữa Jaccard và Levenshtein
    const combined = Math.round(jaccard * 0.6 + levRatio * 0.4);
    return Math.max(0, Math.min(100, combined));
  }

  const maxLen = Math.max(normA.length, normB.length);
  const dist = levenshteinDistance(normA, normB);
  return Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
}

/**
 * Kiểm tra so sánh 2 khách hàng và xuất báo cáo đối soát trùng lặp
 */
export function compareCustomersForDuplicate(custA, custB) {
  if (!custA || !custB || custA.id === custB.id) {
    return { isDuplicate: false, score: 0, reasons: [] };
  }

  const reasons = [];
  let score = 0;

  // 1. So khớp Mã số thuế (Trọng số cao nhất - 55 điểm)
  const taxA = normalizeTaxCode(custA.taxCode);
  const taxB = normalizeTaxCode(custB.taxCode);
  let taxMatched = false;

  if (taxA && taxB) {
    if (taxA === taxB) {
      reasons.push(`Trùng mã số thuế 100%: ${custA.taxCode}`);
      score += 55;
      taxMatched = true;
    } else if (
      // So khớp chi nhánh: 10 số đầu của mã số thuế 13 số
      (taxA.length >= 10 && taxB.length >= 10 && taxA.substring(0, 10) === taxB.substring(0, 10))
    ) {
      reasons.push(`Trùng mã số thuế doanh nghiệp gốc (10 số đầu): ${taxA.substring(0, 10)} (Chi nhánh / Đơn vị thành viên)`);
      score += 45;
      taxMatched = true;
    }
  }

  // 2. So khớp Website (Trọng số 25 điểm)
  const webA = normalizeWebsite(custA.website);
  const webB = normalizeWebsite(custB.website);
  let websiteMatched = false;

  if (webA && webB && webA === webB) {
    reasons.push(`Trùng địa chỉ website: ${webA}`);
    score += 25;
    websiteMatched = true;
  }

  // 3. So khớp Tên công ty gần giống (Trọng số 20 - 35 điểm)
  const nameSim = computeNameSimilarity(custA.name, custB.name);
  if (nameSim >= 85) {
    reasons.push(`Tên công ty tương đồng rất cao (${nameSim}%)`);
    score += Math.round(nameSim * 0.35);
  } else if (nameSim >= 70) {
    reasons.push(`Tên công ty gần giống nhau (${nameSim}%)`);
    score += Math.round(nameSim * 0.25);
  }

  // Xác định mức độ tin cậy
  score = Math.min(100, score);
  const isDuplicate = score >= 50 || taxMatched || (websiteMatched && nameSim >= 50);

  let confidence = 'NONE';
  if (score >= 85) confidence = 'CRITICAL';
  else if (score >= 70) confidence = 'HIGH';
  else if (score >= 50) confidence = 'MEDIUM';
  else if (score >= 30) confidence = 'LOW';

  return {
    isDuplicate,
    confidence,
    score,
    reasons,
    taxMatched,
    websiteMatched,
    nameSimilarity: nameSim
  };
}

/**
 * Quét toàn bộ danh sách khách hàng để tìm các nhóm khách hàng trùng nhau
 */
export function detectAllDuplicates(customerList) {
  const duplicatePairs = [];
  const processedPairKeys = new Set();

  for (let i = 0; i < customerList.length; i++) {
    for (let j = i + 1; j < customerList.length; j++) {
      const a = customerList[i];
      const b = customerList[j];
      const pairKey = [a.id, b.id].sort().join('_');

      if (processedPairKeys.has(pairKey)) continue;

      const report = compareCustomersForDuplicate(a, b);
      if (report.isDuplicate) {
        processedPairKeys.add(pairKey);
        duplicatePairs.push({
          customerA: a,
          customerB: b,
          report
        });
      }
    }
  }

  return duplicatePairs;
}

/**
 * Quét theo thời gian thực khi người dùng nhập khách hàng mới
 */
export function checkDuplicateForCandidate(candidate, existingCustomers) {
  if (!candidate || !existingCustomers || existingCustomers.length === 0) return null;

  const matches = [];

  for (const existing of existingCustomers) {
    if (candidate.id && candidate.id === existing.id) continue;
    const report = compareCustomersForDuplicate(candidate, existing);
    if (report.isDuplicate) {
      matches.push({
        matchedCustomer: existing,
        report
      });
    }
  }

  // Sắp xếp theo score giảm dần
  matches.sort((x, y) => y.report.score - x.report.score);
  return matches.length > 0 ? matches[0] : null;
}
