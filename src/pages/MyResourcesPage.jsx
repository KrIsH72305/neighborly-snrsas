import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { formatDate } from '../utils/dateUtils'
import { getStatusBadgeClass, getConditionBadgeClass } from '../utils/helpers'
import EditResourceModal from '../components/EditResourceModal'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  Package,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react'

export default function MyResourcesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  const [editingResource, setEditingResource] = useState(null)
  const [deletingResource, setDeletingResource] = useState(null)

  const loadResources = async () => {
    try {
      setLoading(true)
      const all = await dbService.getResources()
      const mine = all.filter(r => r.owner_id === user?.id && r.status !== 'archived')
      setResources(mine)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadResources()
    }
  }, [user])

  const handleDelete = async () => {
    if (!deletingResource) return
    try {
      await dbService.deleteResource(deletingResource.id, user.id)
      showToast(`"${deletingResource.title}" was removed.`, 'info')
      setDeletingResource(null)
      loadResources()
    } catch (err) {
      showToast(err.message || 'Failed to delete resource', 'error')
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Shared Resources</h1>
          <p className="dashboard-subtitle">
            Manage your listings, update availability dates, and oversee item conditions
          </p>
        </div>

        <Link to="/dashboard/add-resource" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>List New Resource</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          Loading your listings...
        </div>
      ) : resources.length > 0 ? (
        <div className="table-container">
          <div className="table-header-bar">
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Your Active Listings ({resources.length})
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource Item</th>
                  <th>Category</th>
                  <th>Condition</th>
                  <th>Available Dates</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {res.image_url ? (
                          <img
                            src={res.image_url}
                            alt={res.title}
                            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--color-bg-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#94a3b8'
                            }}
                          >
                            <Package size={20} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                            <Link to={`/resource/${res.id}`} style={{ color: 'inherit' }}>
                              {res.title}
                            </Link>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {res.locality}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-neutral">{res.category}</span>
                    </td>

                    <td>
                      <span className={`badge ${getConditionBadgeClass(res.condition)}`}>
                        {res.condition}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      {formatDate(res.available_from)} — {formatDate(res.available_to)}
                    </td>

                    <td>
                      <span className={`badge ${getStatusBadgeClass(res.status)}`}>
                        {res.status}
                      </span>
                    </td>

                    <td>
                      {res.average_rating ? (
                        <div className="stars-display" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{res.average_rating}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            ({res.review_count || 1})
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No ratings</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          to={`/resource/${res.id}`}
                          className="btn btn-outline btn-sm"
                          title="View public listing page"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => setEditingResource(res)}
                          className="btn btn-outline btn-sm"
                          title="Edit resource details"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingResource(res)}
                          className="btn btn-danger-outline btn-sm"
                          title="Delete listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={32} />
          </div>
          <h3 className="empty-state-title">You haven't listed any resources yet</h3>
          <p className="empty-state-text">
            Do you have power tools, camping gear, gardening tools, or books sitting idle?
            Share them with your neighborhood and help your community.
          </p>
          <Link to="/dashboard/add-resource" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>List Your First Resource</span>
          </Link>
        </div>
      )}

      {/* Edit Modal */}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSuccess={loadResources}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingResource)}
        title="Delete Resource Listing"
        message={`Are you sure you want to permanently remove "${deletingResource?.title}"? Any future pending requests for this item will be cancelled.`}
        confirmText="Yes, Delete Listing"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeletingResource(null)}
      />
    </div>
  )
}
