import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { formatDate, getDurationDays } from '../utils/dateUtils'
import { getStatusBadgeClass } from '../utils/helpers'
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare,
  Clock,
  AlertCircle,
  User,
  Package
} from 'lucide-react'

export default function BorrowRequestsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('incoming') // 'incoming' or 'outgoing'
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // Response Modal State (for Approving or Rejecting)
  const [actionTarget, setActionTarget] = useState(null) // { request, action: 'approve' | 'reject' }
  const [responseNote, setResponseNote] = useState('')
  const [processing, setProcessing] = useState(false)
  const [actionError, setActionError] = useState(null)

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await dbService.getBorrowRequests()
      setRequests(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadRequests()
    }
  }, [user])

  // Filter incoming vs outgoing
  const incomingRequests = requests.filter(req => req.resource?.owner_id === user?.id)
  const outgoingRequests = requests.filter(req => req.borrower_id === user?.id)

  const openActionModal = (request, action) => {
    setActionTarget({ request, action })
    setResponseNote(
      action === 'approve'
        ? 'Approved! Item is ready for pickup. Please reach out to coordinate time.'
        : 'Sorry, not available during those dates.'
    )
    setActionError(null)
  }

  const handleConfirmAction = async (e) => {
    e.preventDefault()
    if (!actionTarget) return

    try {
      setProcessing(true)
      setActionError(null)

      if (actionTarget.action === 'approve') {
        await dbService.approveBorrowRequest(actionTarget.request.id, responseNote)
        showToast('Borrow request approved and confirmed reservation created!', 'success')
      } else {
        await dbService.rejectBorrowRequest(actionTarget.request.id, responseNote)
        showToast('Borrow request declined.', 'info')
      }

      setActionTarget(null)
      loadRequests()
    } catch (err) {
      setActionError(err.message || 'Action failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Borrow Requests</h1>
          <p className="dashboard-subtitle">
            Review incoming requests for your items and track your outgoing borrowing proposals
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          className="btn"
          style={{
            borderBottom: activeTab === 'incoming' ? '3px solid var(--color-primary)' : '3px solid transparent',
            borderRadius: '0',
            color: activeTab === 'incoming' ? 'var(--color-primary)' : 'var(--color-navy-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            backgroundColor: 'transparent'
          }}
        >
          <Inbox size={16} />
          <span>Incoming Requests ({incomingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className="btn"
          style={{
            borderBottom: activeTab === 'outgoing' ? '3px solid var(--color-primary)' : '3px solid transparent',
            borderRadius: '0',
            color: activeTab === 'outgoing' ? 'var(--color-primary)' : 'var(--color-navy-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            backgroundColor: 'transparent'
          }}
        >
          <Send size={16} />
          <span>My Outgoing Requests ({outgoingRequests.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          Loading requests...
        </div>
      ) : activeTab === 'incoming' ? (
        incomingRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {incomingRequests.map(req => {
              const days = getDurationDays(req.start_date, req.end_date)
              return (
                <div key={req.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      {req.resource?.image_url && (
                        <img
                          src={req.resource.image_url}
                          alt={req.resource.title}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                          Item Requested
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                          <Link to={`/resource/${req.resource?.id}`} style={{ color: 'inherit' }}>
                            {req.resource?.title || 'Resource'}
                          </Link>
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                          Requester: <strong>{req.borrower?.full_name || 'Neighbor'}</strong> ({req.borrower?.locality || 'Local'})
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${getStatusBadgeClass(req.status)}`} style={{ padding: '6px 12px' }}>
                      {req.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--color-bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Calendar size={16} color="var(--color-primary)" />
                      <span>
                        Dates: <strong>{formatDate(req.start_date)}</strong> to <strong>{formatDate(req.end_date)}</strong> ({days} days)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                      <Clock size={16} />
                      <span>Requested on {formatDate(req.created_at)}</span>
                    </div>
                  </div>

                  {req.message && (
                    <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#334155', background: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)' }}>
                      <strong>Borrower's Message:</strong> "{req.message}"
                    </div>
                  )}

                  {req.response_note && (
                    <div style={{ marginBottom: '14px', fontSize: '0.85rem', color: '#64748b' }}>
                      <strong>Your Response:</strong> {req.response_note}
                    </div>
                  )}

                  {req.status === 'pending' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                      <button
                        onClick={() => openActionModal(req, 'reject')}
                        className="btn btn-danger-outline btn-sm"
                      >
                        <XCircle size={15} />
                        <span>Decline Request</span>
                      </button>

                      <button
                        onClick={() => openActionModal(req, 'approve')}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle2 size={15} />
                        <span>Accept & Confirm Booking</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox size={32} />
            </div>
            <h3 className="empty-state-title">No incoming borrow requests</h3>
            <p className="empty-state-text">
              When neighbors in your area request to borrow your listed items, their proposals will appear here for your approval.
            </p>
          </div>
        )
      ) : (
        outgoingRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {outgoingRequests.map(req => {
              const days = getDurationDays(req.start_date, req.end_date)
              return (
                <div key={req.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      {req.resource?.image_url && (
                        <img
                          src={req.resource.image_url}
                          alt={req.resource.title}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                          Item You Requested
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                          <Link to={`/resource/${req.resource?.id}`} style={{ color: 'inherit' }}>
                            {req.resource?.title || 'Resource'}
                          </Link>
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                          Offered by neighbor in: <strong>{req.resource?.locality}</strong>
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${getStatusBadgeClass(req.status)}`} style={{ padding: '6px 12px' }}>
                      {req.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--color-bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Calendar size={16} color="var(--color-primary)" />
                      <span>
                        Dates: <strong>{formatDate(req.start_date)}</strong> to <strong>{formatDate(req.end_date)}</strong> ({days} days)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                      <Clock size={16} />
                      <span>Sent on {formatDate(req.created_at)}</span>
                    </div>
                  </div>

                  {req.response_note && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: req.status === 'approved' ? '#ecfdf5' : '#fef2f2',
                        border: req.status === 'approved' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                        color: req.status === 'approved' ? '#065f46' : '#991b1b',
                        fontSize: '0.875rem'
                      }}
                    >
                      <strong>Owner Note:</strong> {req.response_note}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Send size={32} />
            </div>
            <h3 className="empty-state-title">You haven't requested any items</h3>
            <p className="empty-state-text">
              Browse our neighborhood catalog to find power tools, lawn care equipment, or books to borrow.
            </p>
            <Link to="/explore" className="btn btn-primary">
              Browse Resource Catalog
            </Link>
          </div>
        )
      )}

      {/* Response Action Modal */}
      {actionTarget && (
        <div className="modal-overlay" onClick={() => setActionTarget(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {actionTarget.action === 'approve' ? 'Approve Borrow Request' : 'Decline Borrow Request'}
              </h2>
            </div>

            <form onSubmit={handleConfirmAction}>
              <div className="modal-body">
                {actionError && (
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
                    <span>{actionError}</span>
                  </div>
                )}

                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
                  {actionTarget.action === 'approve'
                    ? `You are confirming the booking for ${actionTarget.request.resource?.title} from ${formatDate(actionTarget.request.start_date)} to ${formatDate(actionTarget.request.end_date)}. This will lock these dates to prevent double-booking.`
                    : `You are declining this request. You can provide a friendly reason to your neighbor below.`}
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="action-note">
                    Note to Borrower
                  </label>
                  <textarea
                    id="action-note"
                    className="form-textarea"
                    rows={3}
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setActionTarget(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`btn ${actionTarget.action === 'approve' ? 'btn-primary' : 'btn-danger'}`}
                >
                  {processing
                    ? 'Processing...'
                    : actionTarget.action === 'approve'
                    ? 'Confirm Approval'
                    : 'Decline Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
