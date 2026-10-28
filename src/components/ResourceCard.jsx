import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Wrench,
  BookOpen,
  Tv,
  Flower2,
  Package,
  MapPin,
  Calendar,
  Star,
  Flag,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react'
import { getStatusBadgeClass, getConditionBadgeClass, truncateText } from '../utils/helpers'
import { formatDate } from '../utils/dateUtils'

export default function ResourceCard({ resource, onRequest, onReport }) {
  const { user } = useAuth()
  const [imgError, setImgError] = useState(false)

  const isOwner = user && user.id === resource.owner_id

  // Category Icon Resolver
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Tools': return <Wrench size={14} />
      case 'Books': return <BookOpen size={14} />
      case 'Electronics': return <Tv size={14} />
      case 'Gardening': return <Flower2 size={14} />
      case 'Household Items': return <Package size={14} />
      default: return <Package size={14} />
    }
  }

  return (
    <div className="resource-card">
      <div className="resource-card-media">
        {!imgError && resource.image_url ? (
          <img
            src={resource.image_url}
            alt={resource.title}
            className="resource-card-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="resource-card-placeholder">
            {getCategoryIcon(resource.category)}
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{resource.category}</span>
          </div>
        )}

        <div className="resource-card-badges">
          <span className={`badge ${getConditionBadgeClass(resource.condition)}`}>
            {resource.condition}
          </span>
          <span className={`badge ${getStatusBadgeClass(resource.status)}`}>
            {resource.status === 'available' ? (
              <>
                <CheckCircle size={11} />
                Available
              </>
            ) : (
              <>
                <Clock size={11} />
                {resource.status}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="resource-card-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="resource-card-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {getCategoryIcon(resource.category)}
            {resource.category}
          </span>

          {resource.average_rating ? (
            <div className="stars-display" title={`${resource.average_rating} out of 5 stars`}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                {resource.average_rating}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                ({resource.review_count || 1})
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>No ratings yet</span>
          )}
        </div>

        <h3 className="resource-card-title">
          <Link to={`/resource/${resource.id}`} style={{ color: 'inherit' }}>
            {resource.title}
          </Link>
        </h3>

        <p className="resource-card-desc">
          {truncateText(resource.description, 95)}
        </p>

        <div className="resource-card-meta">
          <div className="resource-meta-row">
            <div className="resource-meta-item">
              <MapPin size={13} color="var(--color-primary)" />
              <span>{resource.locality}</span>
            </div>
            <div className="resource-meta-item" style={{ fontSize: '0.8rem', color: '#64748b' }}>
              <Calendar size={13} />
              <span>Until {formatDate(resource.available_to)}</span>
            </div>
          </div>

          <div className="resource-meta-row" style={{ marginTop: '2px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Lender: <strong>{resource.owner?.full_name || 'Neighbor'}</strong>
            </span>
            {onReport && !isOwner && (
              <button
                onClick={() => onReport(resource)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                title="Report inappropriate listing"
              >
                <Flag size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="resource-card-footer">
        <Link to={`/resource/${resource.id}`} className="btn btn-outline btn-sm">
          <span>Details</span>
        </Link>

        {isOwner ? (
          <Link to={`/dashboard/my-resources`} className="badge badge-info" style={{ padding: '6px 12px' }}>
            Your Listing
          </Link>
        ) : (
          <button
            onClick={() => onRequest(resource)}
            className="btn btn-primary btn-sm"
            disabled={resource.status !== 'available'}
          >
            <span>{resource.status === 'available' ? 'Borrow Item' : 'Currently Borrowed'}</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
