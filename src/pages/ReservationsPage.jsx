import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { normalizeUserId } from '../services/mockData'
import { formatDate, isOverdue } from '../utils/dateUtils'
import { getStatusBadgeClass } from '../utils/helpers'
import {
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  User,
  Package
} from 'lucide-react'

export default function ReservationsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  // Return item modal state
  const [returningTarget, setReturningTarget] = useState(null)
  const [returnNotes, setReturnNotes] = useState('Item received back in good condition.')
  const [processingReturn, setProcessingReturn] = useState(false)

  const loadReservations = async () => {
    try {
      setLoading(true)
      const all = await dbService.getReservations()
      // Filter active or confirmed or overdue reservations for the current user
      const normUserId = normalizeUserId(user?.id)
      const userActive = all.filter(r =>
        (normalizeUserId(r.borrower_id) === normUserId || normalizeUserId(r.owner_id) === normUserId) &&
        r.status !== 'returned' &&
        r.status !== 'cancelled'
      )
      setReservations(userActive)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadReservations()
    }
  }, [user])

  const handleConfirmReturn = async (e) => {
    e.preventDefault()
    if (!returningTarget) return

    try {
      setProcessingReturn(true)
      await dbService.markReservationReturned(returningTarget.id, returnNotes)
      showToast(`"${returningTarget.resource?.title}" marked as returned! Transaction recorded in history.`, 'success')
      setReturningTarget(null)
      loadReservations()
    } catch (err) {
      showToast(err.message || 'Failed to mark return', 'error')
    } finally {
      setProcessingReturn(false)
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Active Reservations</h1>
          <p className="dashboard-subtitle">
            Track confirmed bookings, active borrowings, and log item returns on schedule
          </p>
        </div>

        <Link to="/dashboard/history" className="btn btn-outline">
          <span>View Past Completed Sharings</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          Loading active reservations...
        </div>
      ) : reservations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reservations.map(resv => {
            const isOwner = normalizeUserId(user?.id) === normalizeUserId(resv.owner_id)
            const overdue = resv.is_overdue || isOverdue(resv.end_date, resv.status, resv.actual_return_date)

            return (
              <div
                key={resv.id}
                className="card"
                style={{
                  padding: '24px',
                  borderLeft: overdue ? '4px solid #ef4444' : '4px solid var(--color-primary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {resv.resource?.image_url && (
                      <img
                        src={resv.resource.image_url}
                        alt={resv.resource.title}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
                        <Link to={`/resource/${resv.resource?.id}`} style={{ color: 'inherit' }}>
                          {resv.resource?.title || 'Shared Item'}
                        </Link>
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {isOwner ? (
                          <>
                            Borrower: <strong>{resv.borrower?.full_name || 'Neighbor'}</strong> ({resv.borrower?.locality})
                          </>
                        ) : (
                          <>
                            Owner: <strong>{resv.owner?.full_name || 'Lender'}</strong> ({resv.owner?.locality})
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {overdue && (
                      <span className="badge badge-overdue" style={{ padding: '6px 12px' }}>
                        <AlertTriangle size={14} />
                        Overdue Return
                      </span>
                    )}
                    <span className={`badge ${getStatusBadgeClass(resv.status)}`} style={{ padding: '6px 12px' }}>
                      {resv.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Box */}
                <div
                  style={{
                    background: overdue ? '#fef2f2' : 'var(--color-bg-subtle)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    border: overdue ? '1px solid #fecaca' : '1px solid var(--color-border)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                      Pickup / Start Date
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {formatDate(resv.start_date)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: overdue ? '#b91c1c' : '#64748b', fontWeight: 600 }}>
                      Expected Return Date
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: overdue ? '#b91c1c' : 'inherit' }}>
                      {formatDate(resv.end_date)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                      Sharing Role
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                      {isOwner ? 'Resource Owner (Lender)' : 'Active Borrower'}
                    </div>
                  </div>
                </div>

                {resv.notes && (
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
                    <strong>Booking Notes:</strong> {resv.notes}
                  </div>
                )}

                {/* Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Reservation ID: <code>{resv.id}</code>
                  </div>

                  <button
                    onClick={() => {
                      setReturningTarget(resv)
                      setReturnNotes(isOwner ? 'Item received back in good working condition.' : 'Item returned back to lender safely.')
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <RotateCcw size={15} />
                    <span>{isOwner ? 'Confirm & Log Return' : 'Log Item as Returned'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CalendarCheck size={32} />
          </div>
          <h3 className="empty-state-title">No active reservations right now</h3>
          <p className="empty-state-text">
            Confirmed borrowing requests turn into active reservations automatically.
            Explore neighborhood items or check your pending requests.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/explore" className="btn btn-primary">
              Explore Resources
            </Link>
            <Link to="/dashboard/borrow-requests" className="btn btn-outline">
              View Borrow Requests
            </Link>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {returningTarget && (
        <div className="modal-overlay" onClick={() => setReturningTarget(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Resource Return</h2>
            </div>

            <form onSubmit={handleConfirmReturn}>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
                  {normalizeUserId(user?.id) === normalizeUserId(returningTarget.owner_id) ? (
                    <>Confirm that <strong>{returningTarget.borrower?.full_name || 'Neighbor'}</strong> has returned <strong>"{returningTarget.resource?.title}"</strong> to you.</>
                  ) : (
                    <>Log that you have handed back <strong>"{returningTarget.resource?.title}"</strong> to lender <strong>{returningTarget.owner?.full_name || 'Lender'}</strong>.</>
                  )}
                  {' '}This records today as the actual return date and completes the borrowing transaction.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="return-notes">
                    Return Condition & Notes (Optional)
                  </label>
                  <textarea
                    id="return-notes"
                    className="form-textarea"
                    rows={3}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. Returned clean and on time. Ready for next neighbor..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setReturningTarget(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingReturn}
                  className="btn btn-primary"
                >
                  {processingReturn ? 'Saving...' : 'Confirm Return & Complete Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
