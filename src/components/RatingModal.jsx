import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { X, Star, AlertCircle, HeartHandshake } from 'lucide-react'

export default function RatingModal({ reservation, onClose, onSuccess }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [score, setScore] = useState(5)
  const [hoverScore, setHoverScore] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Determine who is being reviewed (if user is borrower -> reviewee is owner, and vice-versa)
  const revieweeId = user?.id === reservation.borrower_id
    ? reservation.owner_id
    : reservation.borrower_id

  const otherPersonName = user?.id === reservation.borrower_id
    ? (reservation.owner?.full_name || 'Lender')
    : (reservation.borrower?.full_name || 'Borrower')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be signed in to submit a rating.')
      return
    }

    try {
      setSubmitting(true)
      await dbService.createRating({
        reservation_id: reservation.id,
        resource_id: reservation.resource_id,
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        score,
        comment: comment.trim()
      })

      showToast('Thank you! Your rating has been recorded.', 'success')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit rating.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartHandshake size={20} color="var(--color-primary)" />
            <h2 className="modal-title">Rate Completed Sharing</h2>
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
            <div
              style={{
                textAlign: 'center',
                padding: '16px',
                background: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                {reservation.resource?.title || 'Shared Resource'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                How was your experience sharing with <strong>{otherPersonName}</strong>?
              </p>
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

            {/* Star Rating Interactive Selector */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ display: 'inline-flex', gap: '8px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverScore || score) >= star
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setScore(star)}
                      onMouseEnter={() => setHoverScore(star)}
                      onMouseLeave={() => setHoverScore(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      aria-label={`${star} Stars`}
                    >
                      <Star
                        size={32}
                        fill={filled ? '#f59e0b' : 'none'}
                        color={filled ? '#f59e0b' : '#cbd5e1'}
                        style={{ transition: 'transform 0.1s ease', transform: filled ? 'scale(1.1)' : 'scale(1)' }}
                      />
                    </button>
                  )
                })}
              </div>
              <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                {score === 5 && 'Outstanding - 5/5 Stars!'}
                {score === 4 && 'Great Experience - 4/5 Stars'}
                {score === 3 && 'Average / Acceptable - 3/5 Stars'}
                {score === 2 && 'Disappointing - 2/5 Stars'}
                {score === 1 && 'Poor Experience - 1/5 Stars'}
              </div>
            </div>

            {/* Review Comment */}
            <div className="form-group">
              <label className="form-label" htmlFor="rating-comment">
                Written Feedback & Experience Note (Optional)
              </label>
              <textarea
                id="rating-comment"
                className="form-textarea"
                rows={3}
                placeholder="Mention condition of the item, punctuality, clear communication, or helpful tips..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Recording Rating...' : 'Submit Community Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
