// =====================================================================
// SCRUM-101: Calendar Utilities, Conflict Detection & Slot Finder
// =====================================================================

/**
 * Chuyển đổi chuỗi giờ 'HH:mm' thành số phút trong ngày
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Chuyển số phút thành chuỗi 'HH:mm'
 */
export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Kiểm tra xem 2 chuỗi ngày YYYY-MM-DD có trùng nhau không
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === 'string' ? date1 : formatDateISO(date1);
  const d2 = typeof date2 === 'string' ? date2 : formatDateISO(date2);
  return d1 === d2;
}

/**
 * Định dạng Date object thành chuỗi 'YYYY-MM-DD'
 */
export function formatDateISO(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Định dạng ngày sang tiếng Việt: "Thứ Hai, 19/10/2026"
 */
export function formatDateVietnamese(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[date.getDay()];
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${dayName}, ${d}/${m}/${y}`;
}

/**
 * Định dạng tiêu đề tuần: "19/10 - 25/10/2026"
 */
export function formatWeekRange(startDate, endDate) {
  const d1 = String(startDate.getDate()).padStart(2, '0');
  const m1 = String(startDate.getMonth() + 1).padStart(2, '0');
  const d2 = String(endDate.getDate()).padStart(2, '0');
  const m2 = String(endDate.getMonth() + 1).padStart(2, '0');
  const y = endDate.getFullYear();
  return `${d1}/${m1} - ${d2}/${m2}/${y}`;
}

/**
 * Lấy danh sách 7 ngày trong tuần chứa `targetDate` (bắt đầu từ Thứ Hai)
 */
export function getWeekDays(targetDate) {
  const current = new Date(targetDate);
  const dayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday...
  // Chuẩn hóa Thứ Hai là ngày đầu tiên (offset 0)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

/**
 * Lấy ma trận các ngày hiển thị trong lưới Tháng (Month View Grid)
 * Bao gồm các ngày đệm từ tháng trước và tháng sau để đủ số tuần
 */
export function getMonthDays(year, monthIndex) {
  // Ngày đầu tiên của tháng
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  // Ngày cuối cùng của tháng
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Thứ của ngày đầu tháng (0 = CN, 1 = T2, ...)
  const startDay = firstDayOfMonth.getDay();
  // Đổi sang hệ quy chiếu bắt đầu từ Thứ Hai (0 = T2, 6 = CN)
  const prefixDays = startDay === 0 ? 6 : startDay - 1;

  const days = [];

  // Các ngày đệm từ tháng trước
  for (let i = prefixDays; i > 0; i--) {
    const prevDate = new Date(year, monthIndex, 1 - i);
    days.push({
      date: prevDate,
      dateString: formatDateISO(prevDate),
      isCurrentMonth: false,
      isToday: isSameDay(prevDate, new Date('2026-10-18'))
    });
  }

  // Các ngày trong tháng hiện tại
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const curDate = new Date(year, monthIndex, day);
    days.push({
      date: curDate,
      dateString: formatDateISO(curDate),
      isCurrentMonth: true,
      isToday: isSameDay(curDate, new Date('2026-10-18'))
    });
  }

  // Các ngày đệm của tháng sau để hoàn thiện lưới 35 hoặc 42 ô
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, monthIndex + 1, i);
    days.push({
      date: nextDate,
      dateString: formatDateISO(nextDate),
      isCurrentMonth: false,
      isToday: isSameDay(nextDate, new Date('2026-10-18'))
    });
  }

  return days;
}

/**
 * ====================================================================
 * THUẬT TOÁN PHÁT HIỆN XUNG ĐỘT & CHỒNG CHÉO LỊCH (CONFLICT DETECTION)
 * ====================================================================
 * Phát hiện khi nào 2 cuộc họp diễn ra cùng ngày, cùng khung giờ và
 * có ít nhất 1 thành viên bị xếp trùng lịch (Double-booked).
 */
export function detectConflicts(events) {
  const conflictsMap = new Map(); // eventId -> Array of conflict details
  const meetings = events.filter(e => e.type === 'MEETING' && e.status !== 'CANCELLED');

  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      const e1 = meetings[i];
      const e2 = meetings[j];

      // Phải cùng ngày
      if (e1.date !== e2.date) continue;

      // Tính phút bắt đầu và kết thúc
      const start1 = timeToMinutes(e1.startTime);
      const end1 = timeToMinutes(e1.endTime);
      const start2 = timeToMinutes(e2.startTime);
      const end2 = timeToMinutes(e2.endTime);

      // Điều kiện chồng chéo thời gian: start1 < end2 && end1 > start2
      const timeOverlaps = start1 < end2 && end1 > start2;

      if (timeOverlaps) {
        // Tìm các thành viên bị trùng lịch
        const commonAttendees = (e1.attendees || []).filter(uId => 
          (e2.attendees || []).includes(uId)
        );

        if (commonAttendees.length > 0) {
          // Ghi nhận xung đột cho cả 2 sự kiện
          if (!conflictsMap.has(e1.id)) conflictsMap.set(e1.id, []);
          if (!conflictsMap.has(e2.id)) conflictsMap.set(e2.id, []);

          const conflictInfo1 = {
            targetEventId: e2.id,
            targetTitle: e2.title,
            targetTime: `${e2.startTime} - ${e2.endTime}`,
            commonUserIds: commonAttendees,
            overlapMinutes: Math.min(end1, end2) - Math.max(start1, start2)
          };

          const conflictInfo2 = {
            targetEventId: e1.id,
            targetTitle: e1.title,
            targetTime: `${e1.startTime} - ${e1.endTime}`,
            commonUserIds: commonAttendees,
            overlapMinutes: Math.min(end1, end2) - Math.max(start1, start2)
          };

          conflictsMap.get(e1.id).push(conflictInfo1);
          conflictsMap.get(e2.id).push(conflictInfo2);
        }
      }
    }
  }

  return conflictsMap;
}

/**
 * ====================================================================
 * THUẬT TOÁN ĐỀ XUẤT KHUNG GIỜ TRỐNG KHÔNG TRÙNG (SMART FREE SLOT FINDER)
 * ====================================================================
 * Dành cho Trưởng nhóm và Sales Rep:
 * Nhập danh sách nhân sự cần tham gia + ngày họp + thời lượng (phút).
 * Hệ thống quét các khung giờ làm việc và trả về các khoảng thời gian
 * mà TẤT CẢ nhân sự đều hoàn toàn rảnh rỗi.
 */
export function findAvailableSlots({
  events,
  attendeeIds,
  date,
  durationMinutes = 60,
  workStartHour = 8.5, // 08:30
  workEndHour = 17.5,  // 17:30
  lunchStartHour = 12.0, // 12:00
  lunchEndHour = 13.5    // 13:30
}) {
  if (!attendeeIds || attendeeIds.length === 0 || !date) return [];

  // Lọc các cuộc họp trong ngày của các nhân sự liên quan
  const dayMeetings = events.filter(e => 
    e.date === date &&
    e.type === 'MEETING' &&
    e.status !== 'CANCELLED' &&
    (e.attendees || []).some(uid => attendeeIds.includes(uid))
  );

  const startMinutes = Math.round(workStartHour * 60);
  const endMinutes = Math.round(workEndHour * 60);
  const lunchStartMinutes = Math.round(lunchStartHour * 60);
  const lunchEndMinutes = Math.round(lunchEndHour * 60);

  const availableSlots = [];
  const stepMinutes = 30; // Quét mỗi 30 phút

  for (let slotStart = startMinutes; slotStart + durationMinutes <= endMinutes; slotStart += stepMinutes) {
    const slotEnd = slotStart + durationMinutes;

    // Bỏ qua khung giờ nghỉ trưa
    const overlapsLunch = slotStart < lunchEndMinutes && slotEnd > lunchStartMinutes;
    if (overlapsLunch) continue;

    // Kiểm tra xem khung giờ này có bị trùng với bất kỳ cuộc họp nào không
    let isBusy = false;
    for (const m of dayMeetings) {
      const mStart = timeToMinutes(m.startTime);
      const mEnd = timeToMinutes(m.endTime);

      if (slotStart < mEnd && slotEnd > mStart) {
        isBusy = true;
        break;
      }
    }

    if (!isBusy) {
      availableSlots.push({
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
        formatted: `${minutesToTime(slotStart)} - ${minutesToTime(slotEnd)}`,
        durationMinutes
      });
    }
  }

  return availableSlots;
}
