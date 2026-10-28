import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/dbService'
import { formatDate } from '../utils/dateUtils'
import { getStatusBadgeClass } from '../utils/helpers'
import {
  Package,
  Inbox,
  CalendarCheck,
  CheckCircle2,
  PlusCircle,
  Compass,
  ArrowRight,
  Clock,
  AlertTriangle,
  User
} from 'lucide-react'

export default function DashboardOverview() {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [requests, setRequests] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [resList, reqList, resvList] = await Promise.all([
        dbService.getResources(),
        dbService.getBorrowRequests(),
        dbService.getReservations()
      ])
      setResources(resList)
      setRequests(reqList)
      setReservations(resvList)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  // Compute metrics for current user
  const myResources = resources.filter(r => r.owner_id === user?.id && r.status !== 'archived')

  // Incoming pending requests for items owned by current user
  const pendingIncomingRequests = requests.filter(req =>
    req.resource?.owner_id === user?.id && req.status === 'pending'
  )

  // Active reservations (borrower OR owner)
  const activeReservations = reservations.filter(resv =>
    (resv.borrower_id === user?.id || resv.owner_id === user?.id) &&
    (resv.status === 'confirmed' || resv.status === 'active' || resv.status === 'overdue')
  )

  // Completed transactions
  const completedTransactions = reservations.filter(resv =>
    (resv.borrower_id === user?.id || resv.owner_id === user?.id) &&
    resv.status === 'returned'
  )

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Neighbor'}!
          </h1>
          <p className="dashboard-subtitle">
            Community Hub: <strong>{user?.locality}</strong> • Manage your household resources and borrowings
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/dashboard/add-resource" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>List Item</span>
          </Link>
          <Link to="/explore" className="btn btn-outline btn-sm">
            <Compass size={16} />
            <span>Browse Items</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="metric-value">{myResources.length}</div>
            <div className="metric-label">My Listed Resources</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Inbox size={24} />
          </div>
          <div>
            <div className="metric-value">{pendingIncomingRequests.length}</div>
            <div className="metric-label">Pending Requests</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="metric-value">{activeReservations.length}</div>
            <div className="metric-label">Active Borrowings</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="metric-value">{completedTransactions.length}</div>
            <div className="metric-label">Completed Sharings</div>
          </div>
        </div>
      </div>

      {/* Action alert if pending incoming requests exist */}
      {pendingIncomingRequests.length > 0 && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} color="#d97706" />
            <div>
              <strong style={{ color: '#92400e' }}>
                You have {pendingIncomingRequests.length} pending borrow request(s) waiting for approval!
              </strong>
              <div style={{ fontSize: '0.825rem', color: '#b45309' }}>
                Neighbors are hoping to borrow your items. Review and confirm their dates.
              </div>
            </div>
          </div>

          <Link to="/dashboard/borrow-requests" className="btn btn-sm btn-primary">
            Review Requests
          </Link>
        </div>
      )}

      {/* Two-column layout for recent items & active reservations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Active Reservations Widget */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Active Reservations</h3>
            <Link to="/dashboard/reservations" style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {activeReservations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeReservations.slice(0, 4).map(resv => (
                <div
                  key={resv.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {resv.resource?.title || 'Shared Resource'}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px' }}>
                      {resv.borrower_id === user?.id ? (
                        <>Borrowing from: <strong>{resv.owner?.full_name}</strong></>
                      ) : (
                        <>Lent to: <strong>{resv.borrower?.full_name}</strong></>
                      )}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-primary)', marginTop: '2px' }}>
                      {formatDate(resv.start_date)} — {formatDate(resv.end_date)}
                    </div>
                  </div>

                  <span className={`badge ${getStatusBadgeClass(resv.status)}`}>
                    {resv.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '28px 12px', color: '#64748b' }}>
              <CalendarCheck size={28} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
              <p style={{ fontSize: '0.875rem' }}>No active borrowings at this moment.</p>
            </div>
          )}
        </div>

        {/* My Resources Summary */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>My Listed Resources</h3>
            <Link to="/dashboard/my-resources" style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Manage
            </Link>
          </div>

          {myResources.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myResources.slice(0, 4).map(res => (
                <div
                  key={res.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {res.image_url && (
                      <img
                        src={res.image_url}
                        alt={res.title}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{res.title}</div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                        {res.category} • {res.condition}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${getStatusBadgeClass(res.status)}`}>
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '28px 12px', color: '#64748b' }}>
              <Package size={28} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
              <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>
                You haven't listed any items for neighbors yet.
              </p>
              <Link to="/dashboard/add-resource" className="btn btn-outline btn-sm">
                <PlusCircle size={14} />
                <span>List an Item</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
