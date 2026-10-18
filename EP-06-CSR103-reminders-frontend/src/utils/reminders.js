export function startOfLocalDay(value = new Date()) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function dayDifference(dueDate, now = new Date()) {
  if (!dueDate) return null
  const target = startOfLocalDay(`${dueDate}T12:00:00`)
  const today = startOfLocalDay(now)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export function isOverdue(task, now = new Date()) {
  return !task.completed && dayDifference(task.dueDate, now) < 0
}

export function isDueSoon(task, settings, now = new Date()) {
  if (task.completed || !settings.enabled) return false
  const difference = dayDifference(task.dueDate, now)
  if (difference === 0) return settings.remindOnDueDate
  return difference > 0 && settings.reminderDays.includes(difference)
}

export function getReminderKind(task, settings, now = new Date()) {
  if (task.completed) return 'completed'
  const difference = dayDifference(task.dueDate, now)
  if (difference < 0) return 'overdue'
  if (!settings.enabled) return 'none'
  if (difference === 0 && settings.remindOnDueDate) return 'today'
  if (difference > 0 && settings.reminderDays.includes(difference)) return 'upcoming'
  return 'none'
}

export function getPersonalTasks(tasks, userId) {
  return tasks.filter((task) => task.assigneeId === userId)
}

export function countOverdueByMember(tasks, users, now = new Date()) {
  return users.map((user) => {
    const userTasks = tasks.filter((task) => task.assigneeId === user.id && !task.completed)
    const overdueTasks = userTasks.filter((task) => isOverdue(task, now))
    return { ...user, overdueCount: overdueTasks.length, totalOpen: userTasks.length }
  }).sort((a, b) => b.overdueCount - a.overdueCount || a.name.localeCompare(b.name, 'vi'))
}

export function filterTasks(tasks, filter, now = new Date()) {
  const query = (filter.query || '').trim().toLocaleLowerCase('vi-VN')
  return tasks.filter((task) => {
    const difference = dayDifference(task.dueDate, now)
    const haystack = `${task.title} ${task.deal} ${task.customer}`.toLocaleLowerCase('vi-VN')
    if (query && !haystack.includes(query)) return false
    if (filter.assigneeId && task.assigneeId !== filter.assigneeId) return false
    if (filter.status === 'overdue' && !isOverdue(task, now)) return false
    if (filter.status === 'upcoming' && (task.completed || difference < 0 || difference > (filter.maxDays ?? 7))) return false
    if (filter.status === 'today' && (task.completed || difference !== 0)) return false
    if (filter.status === 'completed' && !task.completed) return false
    if (filter.status === 'open' && task.completed) return false
    return true
  })
}

export function sortTasks(tasks, sort = 'dueDate') {
  return [...tasks].sort((a, b) => {
    if (sort === 'priority') {
      const ranks = { high: 0, medium: 1, low: 2 }
      return ranks[a.priority] - ranks[b.priority] || a.dueDate.localeCompare(b.dueDate)
    }
    if (sort === 'title') return a.title.localeCompare(b.title, 'vi')
    return a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title, 'vi')
  })
}

export function validateTask(task) {
  const errors = {}
  if (!task.title?.trim()) errors.title = 'Vui lòng nhập tên công việc.'
  if (!task.dueDate) errors.dueDate = 'Vui lòng chọn hạn hoàn thành.'
  if (!task.assigneeId) errors.assigneeId = 'Vui lòng chọn người phụ trách.'
  if (!['high', 'medium', 'low'].includes(task.priority)) errors.priority = 'Mức ưu tiên không hợp lệ.'
  return errors
}

export function toggleReminderDay(days, day) {
  return days.includes(day) ? days.filter((value) => value !== day) : [...days, day].sort((a, b) => b - a)
}
