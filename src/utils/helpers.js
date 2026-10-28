/**
 * General helper utilities, constants and mapping for categories, conditions, and localities
 */

export const CATEGORIES = [
  'Tools',
  'Books',
  'Electronics',
  'Gardening',
  'Household Items',
  'Other'
]

export const LOCALITIES = [
  'Maplewood Heights',
  'Oakridge Park',
  'Pinecrest Valley',
  'Downtown Commons',
  'Riverside Walk',
  'Cedar Glen'
]

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

export function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'available':
    case 'approved':
    case 'confirmed':
    case 'active':
    case 'resolved':
      return 'badge-success'
    case 'pending':
    case 'investigating':
      return 'badge-warning'
    case 'rejected':
    case 'cancelled':
    case 'archived':
    case 'dismissed':
      return 'badge-danger'
    case 'overdue':
      return 'badge-overdue'
    case 'returned':
    case 'completed':
    case 'borrowed':
    case 'maintenance':
    default:
      return 'badge-info'
  }
}

export function getConditionBadgeClass(condition) {
  switch (condition?.toLowerCase()) {
    case 'new':
      return 'badge-success'
    case 'like new':
      return 'badge-info'
    case 'good':
      return 'badge-neutral'
    case 'fair':
      return 'badge-warning'
    default:
      return 'badge-neutral'
  }
}

export function truncateText(text, maxLength = 80) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
