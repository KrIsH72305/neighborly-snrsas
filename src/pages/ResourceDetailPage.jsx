import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { getAlternativesForResource } from '../services/recommendationEngine'
import { formatDate, getTodayString, addDays, getDurationDays } from '../utils/dateUtils'
import { getStatusBadgeClass, getConditionBadgeClass } from '../utils/helpers'
import RequestModal from '../components/RequestModal'
import ReportModal from '../components/ReportModal'
import EditResourceModal from '../components/EditResourceModal'
import ConfirmDialog from '../components/ConfirmDialog'
import ResourceCard from '../components/ResourceCard'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Shield,
  Star,
  Flag,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  UserCheck
} from 'lucide-react'

export default function ResourceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [resource, setResource] = useState(null)
  const [allResources, setAllResources] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  // Direct borrow request form state
  const today = getTodayString()
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(addDays(today, 2))
  const [message, setMessage] = useState('')
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [requestError, setRequestError] = useState(null)

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedAltForRequest, setSelectedAltForRequest] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const item = await dbService.getResourceById(id)
      setResource(item)

      const all = await dbService.getResources()
      setAllResources(all)

      const itemRatings = await dbService.getRatings(id)
      setRatings(itemRatings)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        Loading resource details...
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Resource Not Found</h2>
        <p style={{ color: '#64748b', margin: '12px 0 24px' }}>
          The item you are looking for may have been removed or does not exist.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Back to Resource Catalog
        </Link>
      </div>
    )
  }

  const isOwner = user && user.id === resource.owner_id
  const durationDays = getDurationDays(startDate, endDate)

  // Check rule-based alternatives if item is not available
  const alternatives = getAlternativesForResource(resource, allResources, 3)

  const handleDirectBorrow = async (e) => {
    e.preventDefault()
    setRequestError(null)

    if (!user) {
      setRequestError('Please sign in or select a demo user account first.')
      return
    }

    if (isOwner) {
      setRequestError('You cannot request to borrow your own listing.')
      return
    }

    if (startDate > endDate) {
      setRequestError('Pickup date must be before or on expected return date.')
      return
    }

    try {
      setSubmittingRequest(true)
      await dbService.createBorrowRequest({
        resource_id: resource.id,
        borrower_id: user.id,
        start_date: startDate,
        end_date: endDate,
        message: message.trim() || 'Hi! I would like to borrow this item.'
      })

      showToast(`Borrow request submitted to ${resource.owner?.full_name || 'owner'}!`, 'success')
      setMessage('')
      loadData()
    } catch (err) {
      setRequestError(err.message || 'Failed to submit request.')
    } finally {
      setSubmittingRequest(false)
    }
  }

  const handleDeleteResource = async () => {
    try {
      await dbService.deleteResource(resource.id, user.id)
      showToast('Resource listing deleted.', 'info')
      navigate('/dashboard/my-resources')
    } catch (err) {
      showToast(err.message || 'Failed to delete listing', 'error')
    }
  }

  return (
    <div className="container" style={{ padding: '32px 20px 80px' }}>
      {/* Back button */}
      <Link
        to="/explore"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#64748b',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Explore Catalog</span>
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '36px', alignItems: 'start' }}>
        {/* Left Column: Media & Details */}
        <div>
          {/* Main Photo Banner */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-bg-subtle)',
              maxHeight: '440px',
              border: '1px solid var(--color-border)',
              marginBottom: '28px'
            }}
          >
            <img
              src={resource.image_url || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'}
              alt={resource.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                gap: '8px'
              }}
            >
              <span className={`badge ${getConditionBadgeClass(resource.condition)}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Condition: {resource.condition}
              </span>
              <span className={`badge ${getStatusBadgeClass(resource.status)}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                {resource.status === 'available' ? 'Available' : resource.status}
              </span>
            </div>

            {isOwner && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn btn-outline btn-sm"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Edit3 size={14} />
                  <span>Edit Listing</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-danger-outline btn-sm"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {resource.category}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-navy)' }}>
              {resource.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', color: '#64748b', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--color-primary)" />
                <span>{resource.locality}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                <span>Available: {formatDate(resource.available_from)} to {formatDate(resource.available_to)}</span>
              </div>

              {resource.average_rating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" />
                  <span>{resource.average_rating} ({resource.review_count || ratings.length} reviews)</span>
                </div>
              ) : (
                <span>No reviews yet</span>
              )}

              {!isOwner && (
                <button
                  onClick={() => setShowReportModal(true)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Flag size={14} />
                  <span>Report</span>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>Description & Features</h3>
            <p style={{ color: 'var(--color-navy-muted)', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
              {resource.description}
            </p>
          </div>

          {/* Usage & Pickup Guidelines */}
          {resource.guidelines && (
            <div className="card" style={{ marginBottom: '24px', backgroundColor: '#f8fafc' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} color="var(--color-primary)" />
                Pickup & Care Guidelines
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {resource.guidelines}
              </p>
            </div>
          )}

          {/* Ratings & Reviews Section */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Borrower Reviews & Trust Scores</h3>
              {resource.average_rating && (
                <div className="stars-display" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <span>{resource.average_rating} / 5</span>
                </div>
              )}
            </div>

            {ratings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ratings.map(r => (
                  <div
                    key={r.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {r.reviewer?.full_name ? r.reviewer.full_name[0] : 'N'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {r.reviewer?.full_name || 'Community Neighbor'}
                        </span>
                      </div>

                      <div className="stars-display">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < r.score ? '#f59e0b' : 'none'}
                            color={i < r.score ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic' }}>
                      "{r.comment || 'Smooth transaction, thank you!'}"
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      Rated on {formatDate(r.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                No completed reviews recorded for this item yet. Be the first neighbor to borrow and review!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Owner Card & Booking Box */}
        <div>
          {/* Owner Profile Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-primary-light)'
                }}
              >
                {resource.owner?.avatar_url ? (
                  <img
                    src={resource.owner.avatar_url}
                    alt={resource.owner.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 700 }}>
                    {resource.owner?.full_name ? resource.owner.full_name[0] : 'U'}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Shared By</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {resource.owner?.full_name || 'Community Member'}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={13} />
                  <span>Verified Resident ({resource.owner?.locality || resource.locality})</span>
                </div>
              </div>
            </div>

            {resource.owner?.bio && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '14px' }}>
                "{resource.owner.bio}"
              </p>
            )}
          </div>

          {/* Borrow Request Form Card */}
          <div className="card" style={{ border: '2px solid var(--color-primary-border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
              Borrow This Resource
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '18px' }}>
              Select pickup and return dates. The lender will review and confirm your reservation.
            </p>

            {isOwner ? (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-info-bg)',
                  border: '1px solid #bfdbfe',
                  color: '#1e40af',
                  fontSize: '0.9rem'
                }}
              >
                <strong>You are the owner of this listing.</strong>
                <p style={{ marginTop: '6px', fontSize: '0.85rem' }}>
                  You cannot borrow your own item. To modify details or view requests from neighbors, visit your dashboard.
                </p>
                <Link to="/dashboard/borrow-requests" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
                  View Borrow Requests
                </Link>
              </div>
            ) : resource.status !== 'available' ? (
              <div>
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    fontSize: '0.9rem',
                    marginBottom: '16px'
                  }}
                >
                  <AlertTriangle size={18} style={{ display: 'inline', marginRight: '6px' }} />
                  <strong>Item is Currently {resource.status}.</strong>
                  <p style={{ marginTop: '4px', fontSize: '0.825rem' }}>
                    Another neighbor is currently utilizing this resource. Check out available alternatives below.
                  </p>
                </div>

                {/* Rule-Based Alternatives */}
                {alternatives.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} color="var(--color-primary)" />
                      Available Alternatives Nearby:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {alternatives.map(alt => (
                        <div
                          key={alt.id}
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{alt.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{alt.locality}</div>
                          </div>
                          <Link to={`/resource/${alt.id}`} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleDirectBorrow}>
                {requestError && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 'var(--radius-sm)',
                      color: '#b91c1c',
                      fontSize: '0.85rem',
                      marginBottom: '14px'
                    }}
                  >
                    {requestError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="detail-start-date">
                    Pickup Date *
                  </label>
                  <input
                    id="detail-start-date"
                    type="date"
                    className="form-input"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="detail-end-date">
                    Return Date *
                  </label>
                  <input
                    id="detail-end-date"
                    type="date"
                    className="form-input"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.825rem',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}
                >
                  <Clock size={14} />
                  <span>Requested duration: {durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="detail-message">
                    Message to Lender
                  </label>
                  <textarea
                    id="detail-message"
                    className="form-textarea"
                    rows={2}
                    placeholder="Briefly state your intended project and pickup time..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  {submittingRequest ? 'Submitting Request...' : 'Submit Borrow Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditResourceModal
          resource={resource}
          onClose={() => setShowEditModal(false)}
          onSuccess={loadData}
        />
      )}

      {showReportModal && (
        <ReportModal
          resource={resource}
          onClose={() => setShowReportModal(false)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Resource Listing"
        message={`Are you sure you want to permanently delete "${resource.title}" from the neighborhood sharing catalog? This action cannot be undone.`}
        confirmText="Yes, Delete Listing"
        isDanger={true}
        onConfirm={handleDeleteResource}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}
