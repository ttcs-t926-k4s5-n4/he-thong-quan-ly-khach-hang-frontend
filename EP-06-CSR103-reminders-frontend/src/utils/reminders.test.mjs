import test from 'node:test'
import assert from 'node:assert/strict'
import { countOverdueByMember, dayDifference, filterTasks, getReminderKind, getPersonalTasks, isDueSoon, isOverdue, sortTasks, toggleReminderDay, validateTask } from './reminders.js'

const now = new Date('2026-10-18T10:00:00')
const users = [{ id: 'a', name: 'An' }, { id: 'b', name: 'Bình' }]
const tasks = [
  { id: '1', title: 'Quá hạn', deal: 'ERP', customer: 'Acme', dueDate: '2026-10-16', assigneeId: 'a', priority: 'high', completed: false },
  { id: '2', title: 'Đến hạn hôm nay', deal: 'CRM', customer: 'Beta', dueDate: '2026-10-18', assigneeId: 'a', priority: 'medium', completed: false },
  { id: '3', title: 'Nhắc sau 3 ngày', deal: 'POS', customer: 'Gamma', dueDate: '2026-10-21', assigneeId: 'b', priority: 'low', completed: false },
  { id: '4', title: 'Đã hoàn thành', deal: 'CRM', customer: 'Beta', dueDate: '2026-10-15', assigneeId: 'b', priority: 'low', completed: true },
]
const settings = { enabled: true, reminderDays: [3, 1], remindOnDueDate: true }

test('tính số ngày giữa hạn và hôm nay theo ngày lịch', () => {
  assert.equal(dayDifference('2026-10-21', now), 3)
  assert.equal(dayDifference('2026-10-16', now), -2)
  assert.equal(dayDifference('2026-10-18', now), 0)
})

test('nhận diện quá hạn và bỏ qua việc đã hoàn thành', () => {
  assert.equal(isOverdue(tasks[0], now), true)
  assert.equal(isOverdue(tasks[3], now), false)
})

test('nhắc đúng mốc 3 ngày và ngày đến hạn', () => {
  assert.equal(isDueSoon(tasks[2], settings, now), true)
  assert.equal(isDueSoon(tasks[1], settings, now), true)
  assert.equal(isDueSoon(tasks[0], settings, now), false)
})

test('phân loại nhắc việc chính xác', () => {
  assert.equal(getReminderKind(tasks[0], settings, now), 'overdue')
  assert.equal(getReminderKind(tasks[1], settings, now), 'today')
  assert.equal(getReminderKind(tasks[2], settings, now), 'upcoming')
  assert.equal(getReminderKind(tasks[3], settings, now), 'completed')
})

test('không phát nhắc sắp hạn khi tắt nhắc', () => {
  assert.equal(isDueSoon(tasks[2], { ...settings, enabled: false }, now), false)
})

test('khi tắt nhắc thì không hiện nhắc hạn hôm nay, nhưng việc quá hạn vẫn được phân loại', () => {
  const disabled = { ...settings, enabled: false }
  assert.equal(getReminderKind(tasks[1], disabled, now), 'none')
  assert.equal(getReminderKind(tasks[0], disabled, now), 'overdue')
})

test('lọc nhiệm vụ cá nhân theo người phụ trách', () => {
  assert.deepEqual(getPersonalTasks(tasks, 'a').map((task) => task.id), ['1', '2'])
})

test('trưởng nhóm nhận thống kê quá hạn theo thành viên', () => {
  const counts = countOverdueByMember(tasks, users, now)
  assert.equal(counts.find((user) => user.id === 'a').overdueCount, 1)
  assert.equal(counts.find((user) => user.id === 'b').overdueCount, 0)
})

test('lọc theo trạng thái và từ khóa', () => {
  assert.deepEqual(filterTasks(tasks, { status: 'overdue' }, now).map((task) => task.id), ['1'])
  assert.deepEqual(filterTasks(tasks, { query: 'acme', status: 'open' }, now).map((task) => task.id), ['1'])
})

test('sắp xếp theo mức ưu tiên', () => {
  assert.deepEqual(sortTasks(tasks, 'priority').map((task) => task.id), ['1', '2', '4', '3'])
})

test('xác thực biểu mẫu và bật/tắt mốc nhắc', () => {
  assert.equal(Object.keys(validateTask({ title: '', dueDate: '', assigneeId: '', priority: 'urgent' })).length, 4)
  assert.deepEqual(toggleReminderDay([3, 1], 1), [3])
  assert.deepEqual(toggleReminderDay([3], 7), [7, 3])
})
