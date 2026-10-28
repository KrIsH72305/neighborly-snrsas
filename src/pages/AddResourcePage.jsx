import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dbService } from '../services/dbService'
import { getTodayString, addDays } from '../utils/dateUtils'
import { CATEGORIES, LOCALITIES, CONDITIONS } from '../utils/helpers'
import { PlusCircle, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react'

// Sample curated images for instant testing convenience
const SAMPLE_IMAGE_PRESETS = [
  { label: 'Power Drill', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Extension Ladder', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80' },
  { label: 'Movie Projector', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Lawn Mower', url: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?w=600&auto=format&fit=crop&q=80' },
  { label: 'Camping Tent', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80' },
  { label: 'Book Collection', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' }
]

export default function AddResourcePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const today = getTodayString()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Tools',
    description: '',
    condition: 'Good',
    locality: user?.locality || 'Maplewood Heights',
    available_from: today,
    available_to: addDays(today, 60),
    guidelines: '',
    image_url: SAMPLE_IMAGE_PRESETS[0].url
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectPreset = (url) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Please provide a descriptive title for your resource.')
      return
    }

    if (!formData.description.trim()) {
      setError('Please provide a description explaining what the item is and its condition.')
      return
    }

    if (formData.available_from > formData.available_to) {
      setError('Available From date cannot be after Available To date.')
      return
    }

    try {
      setSubmitting(true)
      await dbService.createResource(formData, user.id)
      showToast(`"${formData.title}" is now listed in the neighborhood catalog!`, 'success')
      navigate('/dashboard/my-resources')
    } catch (err) {
      setError(err.message || 'Failed to list resource')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">List a Resource</h1>
          <p className="dashboard-subtitle">
            Share tools, appliances, gear, or books with verified neighbors in your area
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              color: '#b91c1c',
              fontSize: '0.9rem',
              marginBottom: '24px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-title">
              Item Title / Name *
            </label>
            <input
              id="add-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Milwaukee M18 Cordless Saw, 10-ft Step Ladder, Folding Tables"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category & Condition */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-category">
                Resource Category *
              </label>
              <select
                id="add-category"
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
              <label className="form-label" htmlFor="add-condition">
                Item Condition *
              </label>
              <select
                id="add-condition"
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

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-description">
              Detailed Description *
            </label>
            <textarea
              id="add-description"
              name="description"
              className="form-textarea"
              rows={4}
              placeholder="Describe model, what accessories or bits are included, power requirements, and ideal use cases..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Availability Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-from">
                Available From *
              </label>
              <input
                id="add-from"
                name="available_from"
                type="date"
                className="form-input"
                min={today}
                value={formData.available_from}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-to">
                Available Until *
              </label>
              <input
                id="add-to"
                name="available_to"
                type="date"
                className="form-input"
                min={formData.available_from || today}
                value={formData.available_to}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Locality */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-locality">
              Neighborhood Locality *
            </label>
            <select
              id="add-locality"
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

          {/* Image URL & Quick Presets */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-image">
              Image URL (Optional)
            </label>
            <input
              id="add-image"
              name="image_url"
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={handleChange}
            />

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                Quick Sample Images for Demonstration:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="btn btn-outline btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      backgroundColor: formData.image_url === preset.url ? 'var(--color-primary-light)' : '#ffffff',
                      borderColor: formData.image_url === preset.url ? 'var(--color-primary)' : 'var(--color-border)'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-guidelines">
              Pickup & Care Guidelines (Optional)
            </label>
            <textarea
              id="add-guidelines"
              name="guidelines"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Please clean blades after use, return batteries fully charged, arrange pickup between 5 PM and 8 PM..."
              value={formData.guidelines}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-resources')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
            >
              <PlusCircle size={18} />
              <span>{submitting ? 'Listing Resource...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
