import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { LocalStore } from '../services/localStorageStore'
import { formatDate } from '../utils/dateUtils'
import { getStatusBadgeClass } from '../utils/helpers'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  ShieldAlert,
  Users,
  Package,
  CalendarCheck,
  Flag,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  Database
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  // Enforce actual role check
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const [activeTab, setActiveTab] = useState('reports') // 'reports' | 'resources' | 'users'
  const [profiles, setProfiles] = useState([])
  const [resources, setResources] = useState([])
  const [requests, setRequests] = useState([])
  const [reservations, setReservations] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const [resourceSearch, setResourceSearch] = useState('')
  const [deletingResource, setDeletingResource] = useState(null)
  const [resolvingReport, setResolvingReport] = useState(null)
  const [adminResolutionNote, setAdminResolutionNote] = useState('')

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const [allProfiles, allRes, allReq, allResv, allReps] = await Promise.all([
        LocalStore.getProfiles(),
        dbService.getResources(),
        dbService.getBorrowRequests(),
        dbService.getReservations(),
        dbService.getReports()
      ])
      setProfiles(allProfiles)
      setResources(allRes)
      setRequests(allReq)
      setReservations(allResv)
      setReports(allReps)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // Moderation action
  const handleUpdateReportStatus = async (reportId, status) => {
    try {
      await dbService.updateReportStatus(reportId, status, adminResolutionNote || `Marked as ${status} by admin`)
      showToast(`Report marked as ${status}.`, 'success')
      setResolvingReport(null)
      setAdminResolutionNote('')
      loadAdminData()
    } catch (err) {
      showToast(err.message || 'Failed to update report', 'error')
    }
  }

  // Remove inappropriate listing
  const handleAdminDeleteResource = async () => {
    if (!deletingResource) return
    try {
      await dbService.deleteResource(deletingResource.id, user.id)
      showToast(`Resource "${deletingResource.title}" was removed by administrator.`, 'success')
      setDeletingResource(null)
      loadAdminData()
    } catch (err) {
      showToast(err.message || 'Failed to remove listing', 'error')
    }
  }

  const openReportsCount = reports.filter(r => r.status === 'open' || r.status === 'investigating').length

  const filteredResources = resources.filter(r => {
    if (!resourceSearch.trim()) return true
    const q = resourceSearch.toLowerCase()
    return (
      r.title.toLowerCase().includes(q) ||
      r.owner?.full_name?.toLowerCase().includes(q) ||
      r.locality?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="container" style={{ padding: '36px 20px 80px' }}>
      {/* Admin Mode Label Banner */}
      <div
        style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={22} color="#b91c1c" />
          <div>
            <strong style={{ color: '#991b1b' }}>
              Admin Console — Logged in as: {user.full_name}
            </strong>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
              Authorized Administrator Role (Role: <code>admin</code>) • Neighborhood Board Moderator
            </div>
          </div>
        </div>

        <span className="badge badge-danger" style={{ padding: '6px 12px' }}>
          Elevated Admin Rights Active
        </span>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '6px' }}>
          Neighborhood Administration
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Overview of community activity, dispute reports, and catalog content moderation
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-value">{profiles.length}</div>
            <div className="metric-label">Registered Residents</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="metric-value">{resources.length}</div>
            <div className="metric-label">Catalog Resources</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="metric-value">{reservations.length}</div>
            <div className="metric-label">Total Reservations</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            <Flag size={24} />
          </div>
          <div>
            <div className="metric-value">{openReportsCount}</div>
            <div className="metric-label">Open Reports / Disputes</div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('reports')}
          className="btn"
          style={{
            borderBottom: activeTab === 'reports' ? '3px solid #b91c1c' : '3px solid transparent',
            borderRadius: '0',
            color: activeTab === 'reports' ? '#b91c1c' : 'var(--color-navy-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            backgroundColor: 'transparent'
          }}
        >
          <Flag size={16} />
          <span>Moderation Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className="btn"
          style={{
            borderBottom: activeTab === 'resources' ? '3px solid #b91c1c' : '3px solid transparent',
            borderRadius: '0',
            color: activeTab === 'resources' ? '#b91c1c' : 'var(--color-navy-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            backgroundColor: 'transparent'
          }}
        >
          <Package size={16} />
          <span>All Resources Catalog ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className="btn"
          style={{
            borderBottom: activeTab === 'users' ? '3px solid #b91c1c' : '3px solid transparent',
            borderRadius: '0',
            color: activeTab === 'users' ? '#b91c1c' : 'var(--color-navy-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            backgroundColor: 'transparent'
          }}
        >
          <Users size={16} />
          <span>Resident Directory ({profiles.length})</span>
        </button>
      </div>

      {/* Tab 1: Moderation Reports */}
      {activeTab === 'reports' && (
        <div>
          {reports.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reports.map(rep => (
                <div key={rep.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-danger">
                          {rep.reason}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(rep.status)}`}>
                          Status: {rep.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '8px' }}>
                        {rep.resource ? (
                          <>Reported Listing: <Link to={`/resource/${rep.resource.id}`} style={{ color: 'var(--color-primary)' }}>{rep.resource.title}</Link></>
                        ) : (
                          'General Community Report'
                        )}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                        Filed by: <strong>{rep.reporter?.full_name || 'Anonymous Resident'}</strong> on {formatDate(rep.created_at)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {rep.status !== 'resolved' && (
                        <button
                          onClick={() => {
                            setResolvingReport(rep)
                            setAdminResolutionNote('Issue reviewed and verified by neighborhood administrator.')
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <CheckCircle size={14} color="var(--color-primary)" />
                          <span>Resolve Report</span>
                        </button>
                      )}

                      {rep.resource && (
                        <button
                          onClick={() => setDeletingResource(rep.resource)}
                          className="btn btn-danger-outline btn-sm"
                          title="Permanently remove reported listing from catalog"
                        >
                          <Trash2 size={14} />
                          <span>Remove Listing</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    <strong>Reporter Description:</strong> {rep.description}
                  </div>

                  {rep.admin_notes && (
                    <div style={{ fontSize: '0.85rem', color: '#065f46', background: '#ecfdf5', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Admin Resolution Note:</strong> {rep.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <ShieldCheck size={32} />
              </div>
              <h3 className="empty-state-title">No community reports</h3>
              <p className="empty-state-text">
                Neighborhood trust is healthy! There are no open dispute or moderation tickets.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Resources Catalog */}
      {activeTab === 'resources' && (
        <div className="table-container">
          <div className="table-header-bar">
            <div className="filter-search" style={{ maxWidth: '320px' }}>
              <Search size={16} className="filter-search-icon" />
              <input
                type="text"
                className="filter-search-input"
                placeholder="Search catalog by title or owner..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {filteredResources.length} items total
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Title</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Neighborhood</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(res => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/resource/${res.id}`} style={{ color: 'inherit' }}>
                        {res.title}
                      </Link>
                    </td>
                    <td>{res.owner?.full_name || 'Neighbor'}</td>
                    <td><span className="badge badge-neutral">{res.category}</span></td>
                    <td>{res.locality}</td>
                    <td><span className={`badge ${getStatusBadgeClass(res.status)}`}>{res.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link to={`/resource/${res.id}`} className="btn btn-outline btn-sm" title="View details">
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => setDeletingResource(res)}
                          className="btn btn-danger-outline btn-sm"
                          title="Remove item as administrator"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Resident Directory */}
      {activeTab === 'users' && (
        <div className="table-container">
          <div className="table-header-bar">
            <span style={{ fontWeight: 700 }}>Registered Community Members</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Email</th>
                  <th>Locality</th>
                  <th>Phone</th>
                  <th>Platform Role</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: p.role === 'admin' ? '#ef4444' : 'var(--color-primary)',
                            color: '#ffffff',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem'
                          }}
                        >
                          {p.full_name ? p.full_name[0] : 'U'}
                        </div>
                        <strong>{p.full_name}</strong>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{p.email}</td>
                    <td>{p.locality}</td>
                    <td style={{ color: '#64748b' }}>{p.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${p.role === 'admin' ? 'badge-danger' : 'badge-neutral'}`}>
                        {p.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Resolution Modal */}
      {resolvingReport && (
        <div className="modal-overlay" onClick={() => setResolvingReport(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Resolve Community Report</h2>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '14px' }}>
                Add administrative resolution notes explaining the decision or action taken for this issue:
              </p>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={adminResolutionNote}
                  onChange={(e) => setAdminResolutionNote(e.target.value)}
                  placeholder="e.g. Discussed with owner and clarified listing guidelines..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setResolvingReport(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateReportStatus(resolvingReport.id, 'dismissed')}
                className="btn btn-outline"
              >
                Dismiss Report
              </button>
              <button
                type="button"
                onClick={() => handleUpdateReportStatus(resolvingReport.id, 'resolved')}
                className="btn btn-primary"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Resource Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingResource)}
        title="Admin: Remove Inappropriate Listing"
        message={`Are you sure you want to permanently remove "${deletingResource?.title}" from the catalog? This administrative action is logged.`}
        confirmText="Remove Listing"
        isDanger={true}
        onConfirm={handleAdminDeleteResource}
        onCancel={() => setDeletingResource(null)}
      />
    </div>
  )
}
