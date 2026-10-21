/**
 * Danh sách Đội ngũ Bán hàng & Phân quyền tiếp nhận Lead
 */

export const mockTeamsAndUsers = [
  {
    id: "TEAM_NORTH",
    name: "Nhóm Kinh Doanh Miền Bắc",
    region: "NORTH",
    teamLead: { id: "TL-01", name: "Lê Thị Hoa", role: "Trưởng nhóm Miền Bắc" },
    members: [
      { id: "STAFF-01", name: "Nguyễn Văn An", role: "Chuyên viên Telesales", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", activeLeadCount: 14 },
      { id: "STAFF-02", name: "Phạm Thị Bình", role: "Chuyên viên Kinh doanh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", activeLeadCount: 12 },
      { id: "STAFF-03", name: "Trần Mạnh Hùng", role: "Chuyên viên Tư vấn", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", activeLeadCount: 15 }
    ]
  },
  {
    id: "TEAM_SOUTH",
    name: "Nhóm Kinh Doanh Miền Nam",
    region: "SOUTH",
    teamLead: { id: "TL-02", name: "Hoàng Văn Nam", role: "Trưởng nhóm Miền Nam" },
    members: [
      { id: "STAFF-04", name: "Đỗ Minh Châu", role: "Chuyên viên Kinh doanh", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", activeLeadCount: 16 },
      { id: "STAFF-05", name: "Nguyễn Hoàng Tuấn", role: "Chuyên viên Telesales", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", activeLeadCount: 18 },
      { id: "STAFF-06", name: "Trần Thị Mai Linh", role: "Chuyên viên Telesales", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", activeLeadCount: 13 }
    ]
  },
  {
    id: "TEAM_ENTERPRISE",
    name: "Nhóm Khách Hàng Doanh Nghiệp Lớn (Enterprise VIP)",
    region: "NATIONWIDE",
    teamLead: { id: "TL-03", name: "Lê Hải Đăng", role: "Giám đốc Quản lý Khách hàng VIP" },
    members: [
      { id: "STAFF-07", name: "Phạm Quốc Toàn", role: "Senior Enterprise Sales", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", activeLeadCount: 9 },
      { id: "STAFF-08", name: "Nguyễn Thị Phương Thảo", role: "Key Account Manager", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", activeLeadCount: 8 }
    ]
  }
];

export const allSalesReps = mockTeamsAndUsers.flatMap(t => t.members.map(m => ({ ...m, teamName: t.name })));
