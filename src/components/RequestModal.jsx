import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { X, Calendar, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getTodayString, addDays, getDurationDays, formatDate } from '../utils/dateUtils'

import { normalizeUserId } from '../services/mockData'

export default function RequestModal({ resource, onClose, onSuccess }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const today = getTodayString()
  const defaultStart = resource.available_from > today ? resource.available_from : today
  const defaultEnd = addDays(defaultStart, 2)

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const daysCount = getDurationDays(startDate, endDate)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Please log in or select a demo user account first.')
      return
    }

    if (normalizeUserId(user.id) === normalizeUserId(resource.owner_id)) {
      setError('You cannot request to borrow your own resource.')
      return
    }

    if (startDate > endDate) {
      setError('The start date must be before or on the return date.')
      return
    }

    if (resource.available_from && startDate < resource.available_from) {
      setError(`Item is only available starting from ${formatDate(resource.available_from)}.`)
      return
    }

    if (resource.available_to && endDate > resource.available_to) {
      setError(`Item is only available until ${formatDate(resource.available_to)}.`)
      return
    }

    try {
      setSubmitting(true)
      await dbService.createBorrowRequest({
        resource_id: resource.id,
        borrower_id: user.id,
        start_date: startDate,
        end_date: endDate,
        message: message.trim() || 'Hi! I would love to borrow this item for a local project.'
      })

      showToast(`Borrow request submitted to ${resource.owner?.full_name || 'owner'}!`, 'success')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit borrow request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Request to Borrow</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Resource Summary Header */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                padding: '12px',
                background: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}
            >
              {resource.image_url && (
                <img
                  src={resource.image_url}
                  alt={resource.title}
                  style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
              )}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>
                  {resource.title}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Offered by: <strong>{resource.owner?.full_name || 'Neighbor'}</strong> ({resource.locality})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '2px' }}>
                  Availability: {formatDate(resource.available_from)} to {formatDate(resource.available_to)}
                </div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-sm)',
                  color: '#b91c1c',
                  fontSize: '0.85rem',
                  marginBottom: '16px'
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Date Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="request-start-date">
                  Pickup / Start Date *
                </label>
                <input
                  id="request-start-date"
                  type="date"
                  className="form-input"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="request-end-date">
                  Expected Return Date *
                </label>
                <input
                  id="request-end-date"
                  type="date"
                  className="form-input"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#475569',
                marginBottom: '16px',
                background: '#f8fafc',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Calendar size={15} color="var(--color-primary)" />
              <span>
                Requested borrowing period: <strong>{daysCount} {daysCount === 1 ? 'day' : 'days'}</strong>
              </span>
            </div>

            {/* Purpose / Message */}
            <div className="form-group">
              <label className="form-label" htmlFor="request-message">
                Message to Lender (Optional)
              </label>
              <textarea
                id="request-message"
                className="form-textarea"
                rows={3}
                placeholder="Let your neighbor know how you plan to use this item and arrange convenient pickup/dropoff times..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className="form-hint">
                Respectful communication builds neighborhood trust and speeds up approvals!
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Submitting...' : 'Send Borrow Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
