import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { X, Edit3, AlertCircle } from 'lucide-react'
import { CATEGORIES, LOCALITIES, CONDITIONS } from '../utils/helpers'

export default function EditResourceModal({ resource, onClose, onSuccess }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    title: resource.title || '',
    category: resource.category || 'Tools',
    description: resource.description || '',
    condition: resource.condition || 'Good',
    locality: resource.locality || user?.locality || 'Maplewood Heights',
    available_from: resource.available_from || '',
    available_to: resource.available_to || '',
    guidelines: resource.guidelines || '',
    image_url: resource.image_url || ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Item title is required.')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required.')
      return
    }
    if (formData.available_from && formData.available_to && formData.available_from > formData.available_to) {
      setError('Available From date cannot be after Available To date.')
      return
    }

    try {
      setSubmitting(true)
      await dbService.updateResource(resource.id, formData, user.id)
      showToast('Resource updated successfully!', 'success')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update resource.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit3 size={20} color="var(--color-primary)" />
            <h2 className="modal-title">Edit Resource Listing</h2>
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
              <label className="form-label" htmlFor="edit-title">
                Item Title *
              </label>
              <input
                id="edit-title"
                name="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-category">
                  Category *
                </label>
                <select
                  id="edit-category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-condition">
                  Condition *
                </label>
                <select
                  id="edit-condition"
                  name="condition"
                  className="form-select"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-description">
                Description *
              </label>
              <textarea
                id="edit-description"
                name="description"
                className="form-textarea"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-available_from">
                  Available From *
                </label>
                <input
                  id="edit-available_from"
                  name="available_from"
                  type="date"
                  className="form-input"
                  value={formData.available_from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-available_to">
                  Available To *
                </label>
                <input
                  id="edit-available_to"
                  name="available_to"
                  type="date"
                  className="form-input"
                  value={formData.available_to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-locality">
                Neighborhood Locality *
              </label>
              <select
                id="edit-locality"
                name="locality"
                className="form-select"
                value={formData.locality}
                onChange={handleChange}
              >
                {LOCALITIES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-image_url">
                Image URL (Optional)
              </label>
              <input
                id="edit-image_url"
                name="image_url"
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-guidelines">
                Pickup & Usage Guidelines (Optional)
              </label>
              <textarea
                id="edit-guidelines"
                name="guidelines"
                className="form-textarea"
                rows={2}
                placeholder="e.g. Return in clean condition, rechargeable batteries included..."
                value={formData.guidelines}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
