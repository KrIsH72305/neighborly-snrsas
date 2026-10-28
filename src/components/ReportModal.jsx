import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { X, ShieldAlert, AlertCircle } from 'lucide-react'

const REPORT_REASONS = [
  'Inappropriate Item',
  'Misleading Description',
  'Damaged / Unusable',
  'Unresponsive Member',
  'Harassment',
  'Other'
]

export default function ReportModal({ resource, onClose, onSuccess }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [reason, setReason] = useState(REPORT_REASONS[0])
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be signed in to submit a report.')
      return
    }

    if (!description.trim()) {
      setError('Please provide specific details explaining the issue.')
      return
    }

    try {
      setSubmitting(true)
      await dbService.createReport({
        reporter_id: user.id,
        resource_id: resource?.id || null,
        reported_user_id: resource?.owner_id || null,
        reason,
        description: description.trim()
      })

      showToast('Report submitted. A neighborhood moderator will review this.', 'info')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="#b91c1c" />
            <h2 className="modal-title">Report Item or Concern</h2>
          </div>
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
            {resource && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '0.85rem'
                }}
              >
                Reporting listing: <strong>{resource.title}</strong>
              </div>
            )}

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

            <div className="form-group">
              <label className="form-label" htmlFor="report-reason">
                Reason for Reporting *
              </label>
              <select
                id="report-reason"
                className="form-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="report-description">
                Explain what happened *
              </label>
              <textarea
                id="report-description"
                className="form-textarea"
                rows={4}
                placeholder="Describe why this listing violates neighborhood trust guidelines or is inaccurate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <span className="form-hint">
                Reports are treated confidentially and reviewed by the neighborhood admin team.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-danger">
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
