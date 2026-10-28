import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/dbService'
import { normalizeUserId } from '../services/mockData'
import { formatDate } from '../utils/dateUtils'
import RatingModal from '../components/RatingModal'
import {
  History,
  CheckCircle2,
  Star,
  MessageSquare,
  Package,
  Calendar,
  Sparkles
} from 'lucide-react'

export default function BorrowingHistoryPage() {
  const { user } = useAuth()
  const [completedReservations, setCompletedReservations] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  // Rating modal target
  const [ratingTarget, setRatingTarget] = useState(null)

  const loadHistory = async () => {
    try {
      setLoading(true)
      const [allResv, allRatings] = await Promise.all([
        dbService.getReservations(),
        dbService.getRatings()
      ])

      // Filter returned / completed transactions for user
      const normUserId = normalizeUserId(user?.id)
      const completed = allResv.filter(r =>
        (normalizeUserId(r.borrower_id) === normUserId || normalizeUserId(r.owner_id) === normUserId) &&
        r.status === 'returned'
      )

      setCompletedReservations(completed)
      setRatings(allRatings)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  // Helper to check if current user rated this transaction
  const getUserRating = (reservationId) => {
    const normUserId = normalizeUserId(user?.id)
    return ratings.find(r => r.reservation_id === reservationId && normalizeUserId(r.reviewer_id) === normUserId)
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Borrowing History</h1>
          <p className="dashboard-subtitle">
            Past completed sharing transactions, logged return dates, and community ratings
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          Loading transaction history...
        </div>
      ) : completedReservations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {completedReservations.map(resv => {
            const isOwner = normalizeUserId(user?.id) === normalizeUserId(resv.owner_id)
            const existingRating = getUserRating(resv.id)

            return (
              <div key={resv.id} className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    {resv.resource?.image_url && (
                      <img
                        src={resv.resource.image_url}
                        alt={resv.resource.title}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>
                        <Link to={`/resource/${resv.resource?.id}`} style={{ color: 'inherit' }}>
                          {resv.resource?.title || 'Shared Resource'}
                        </Link>
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {isOwner ? (
                          <>Lent to: <strong>{resv.borrower?.full_name}</strong> ({resv.borrower?.locality})</>
                        ) : (
                          <>Borrowed from: <strong>{resv.owner?.full_name}</strong> ({resv.owner?.locality})</>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-success" style={{ padding: '6px 12px' }}>
                    <CheckCircle2 size={13} />
                    Returned & Completed
                  </span>
                </div>

                {/* Return Record Box */}
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b' }}>Borrowed Window:</span>{' '}
                    <strong>{formatDate(resv.start_date)}</strong> — <strong>{formatDate(resv.end_date)}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b' }}>Actual Return Date:</span>{' '}
                    <strong style={{ color: 'var(--color-primary)' }}>
                      {formatDate(resv.actual_return_date || resv.end_date)}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b' }}>Role:</span>{' '}
                    <strong>{isOwner ? 'Lender' : 'Borrower'}</strong>
                  </div>
                </div>

                {/* Rating Display or Prompt */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  {existingRating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Your Community Rating:</span>
                      <div className="stars-display">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < existingRating.score ? '#f59e0b' : 'none'}
                            color={i < existingRating.score ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      {existingRating.comment && (
                        <span style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic' }}>
                          "{existingRating.comment}"
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Rate your peer sharing experience to help maintain neighbor trust:
                      </span>
                      <button
                        onClick={() => setRatingTarget(resv)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <Star size={14} />
                        <span>Rate This Transaction</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <History size={32} />
          </div>
          <h3 className="empty-state-title">No completed transactions yet</h3>
          <p className="empty-state-text">
            When you return borrowed items or receive your lent items back, your full history and ratings will be recorded here.
          </p>
          <Link to="/explore" className="btn btn-primary">
            Explore Neighborhood Items
          </Link>
        </div>
      )}

      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          reservation={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onSuccess={loadHistory}
        />
      )}
    </div>
  )
}
