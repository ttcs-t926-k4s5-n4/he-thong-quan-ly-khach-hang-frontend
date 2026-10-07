// Các thuật toán duyệt cây tổ chức và tính toán phạm vi dữ liệu (SCRUM-64)

/**
 * Lấy danh sách toàn bộ ID nhóm con cháu (subtree) của một nhóm cha theo đệ quy
 */
export function getSubtreeTeamIds(rootTeamId, teams) {
  if (!rootTeamId) return [];
  const result = [rootTeamId];

  function collectChildren(parentId) {
    const directChildren = teams.filter(t => t.parentId === parentId);
    for (const child of directChildren) {
      result.push(child.id);
      collectChildren(child.id);
    }
  }

  collectChildren(rootTeamId);
  return result;
}

/**
 * Xây dựng cấu trúc cây lồng nhau từ mảng phẳng các nhóm
 */
export function buildNestedTree(teams, parentId = null) {
  return teams
    .filter(t => t.parentId === parentId)
    .map(team => ({
      ...team,
      children: buildNestedTree(teams, team.id)
    }));
}

/**
 * Tính toán phạm vi nhân sự mà một nhân viên (Trưởng nhóm / Giám đốc / Nhân viên thường) có quyền xem
 * Tiêu chí cốt lõi 3: Cây tổ chức quyết định phạm vi dữ liệu mà Trưởng nhóm nhìn thấy!
 */
export function getEmployeesInScope(currentEmployeeId, employees, teams) {
  const currentEmp = employees.find(e => e.id === currentEmployeeId);
  if (!currentEmp) return [];

  // Tìm nhóm của nhân viên hiện tại
  const myTeam = teams.find(t => t.id === currentEmp.teamId);

  // 1. Nếu là Trưởng nhóm của Ban Giám Đốc (Root) -> Toàn quyền xem 100% nhân sự công ty
  if (myTeam && myTeam.parentId === null && myTeam.leaderId === currentEmp.id) {
    return employees;
  }

  // 2. Nếu là Trưởng nhóm của một cấp bất kỳ trong cây (Vùng, Chi nhánh, Nhóm chuyên trách)
  // Sẽ nhìn thấy toàn bộ nhân sự thuộc nhóm mình VÀ tất cả các nhóm con trực thuộc (sub-teams)
  if (myTeam && myTeam.leaderId === currentEmp.id) {
    const accessibleTeamIds = getSubtreeTeamIds(myTeam.id, teams);
    return employees.filter(e => accessibleTeamIds.includes(e.teamId));
  }

  // 3. Nếu là Nhân viên kinh doanh thông thường (không phải Trưởng nhóm)
  // Chỉ nhìn thấy dữ liệu của chính bản thân mình (My data only)
  return [currentEmp];
}

/**
 * Tính toán danh sách cơ hội kinh doanh / hợp đồng nằm trong phạm vi truy cập
 */
export function getDealsInScope(currentEmployeeId, deals, employees, teams) {
  const accessibleEmployees = getEmployeesInScope(currentEmployeeId, employees, teams);
  const accessibleEmpIds = accessibleEmployees.map(e => e.id);

  return deals.filter(deal => accessibleEmpIds.includes(deal.assignedEmployeeId));
}

/**
 * Lấy danh sách các nhóm mà người dùng có quyền quản lý/quan sát
 */
export function getTeamsInScope(currentEmployeeId, employees, teams) {
  const currentEmp = employees.find(e => e.id === currentEmployeeId);
  if (!currentEmp) return [];

  const myTeam = teams.find(t => t.id === currentEmp.teamId);
  if (!myTeam) return [];

  // Nếu là Giám đốc toàn quốc (Root Leader)
  if (myTeam.parentId === null && myTeam.leaderId === currentEmp.id) {
    return teams;
  }

  // Nếu là Trưởng nhóm
  if (myTeam.leaderId === currentEmp.id) {
    const accessibleTeamIds = getSubtreeTeamIds(myTeam.id, teams);
    return teams.filter(t => accessibleTeamIds.includes(t.id));
  }

  // Nhân viên thường: Chỉ nhóm của mình
  return [myTeam];
}

/**
 * Format tiền tệ VNĐ chuẩn định dạng
 */
export function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format số rút gọn tiền tỷ / triệu (ví dụ: 15.8 Tỷ ₫)
 */
export function formatShortVND(amount) {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} Tỷ ₫`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)} Tr ₫`;
  }
  return formatVND(amount);
}

/**
 * Kiểm tra ràng buộc điều chuyển: Mỗi nhân viên thuộc đúng một nhóm tại một thời điểm
 */
export function validateSingleTeamAssignment(employeeId, newTeamId, employees) {
  const emp = employees.find(e => e.id === employeeId);
  if (!emp) return { valid: false, message: 'Nhân viên không tồn tại trong hệ thống.' };
  if (emp.teamId === newTeamId) {
    return { valid: false, message: 'Nhân viên đã và đang thuộc nhóm này rồi.' };
  }
  return { valid: true };
}
