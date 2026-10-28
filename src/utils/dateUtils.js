/**
 * Date utility functions for Neighborly
 */

export function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const [year, month, day] = dateString.split('-').map(Number)
    if (!year || !month || !day) {
      const d = new Date(dateString)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch (e) {
    return dateString
  }
}

export function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(dateString, days) {
  const d = new Date(dateString)
  d.setDate(d.getDate() + days)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Checks if two date ranges overlap.
 * Both ranges are inclusive: [start1, end1] and [start2, end2]
 */
export function isDateOverlap(start1, end1, start2, end2) {
  if (!start1 || !end1 || !start2 || !end2) return false
  return start1 <= end2 && end1 >= start2
}

/**
 * Check if a reservation is overdue.
 * Overdue if status is 'confirmed' or 'active' and end_date < today
 */
export function isOverdue(endDate, status, actualReturnDate) {
  if (status === 'returned' || actualReturnDate) return false
  if (status !== 'confirmed' && status !== 'active' && status !== 'overdue') return false
  const today = getTodayString()
  return endDate < today
}

/**
 * Calculate human-readable duration
 */
export function getDurationDays(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const d1 = new Date(startDate)
  const d2 = new Date(endDate)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
