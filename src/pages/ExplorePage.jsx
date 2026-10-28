import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/dbService'
import ResourceCard from '../components/ResourceCard'
import RequestModal from '../components/RequestModal'
import ReportModal from '../components/ReportModal'
import { getRecommendationsForUser } from '../services/recommendationEngine'
import { CATEGORIES, LOCALITIES } from '../utils/helpers'
import {
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  PackageOpen,
  MapPin,
  CheckCircle2,
  Clock
} from 'lucide-react'

export default function ExplorePage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters from query params or defaults
  const querySearch = searchParams.get('search') || ''
  const queryCategory = searchParams.get('category') || 'All'
  const queryLocality = searchParams.get('locality') || 'All'
  const queryAvailability = searchParams.get('availability') || 'All'

  const [search, setSearch] = useState(querySearch)
  const [category, setCategory] = useState(queryCategory)
  const [locality, setLocality] = useState(queryLocality)
  const [availability, setAvailability] = useState(queryAvailability)

  const [selectedResourceForRequest, setSelectedResourceForRequest] = useState(null)
  const [selectedResourceForReport, setSelectedResourceForReport] = useState(null)

  // Sync state when query params change
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search'))
    if (searchParams.get('category') !== null) setCategory(searchParams.get('category'))
    if (searchParams.get('locality') !== null) setLocality(searchParams.get('locality'))
    if (searchParams.get('availability') !== null) setAvailability(searchParams.get('availability'))
  }, [searchParams])

  const loadResources = async () => {
    try {
      setLoading(true)
      const data = await dbService.getResources()
      setResources(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  // Filter logic
  const filteredResources = useMemo(() => {
    return resources.filter(item => {
      if (item.status === 'archived') return false

      // Search match
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchTitle = item.title.toLowerCase().includes(query)
        const matchDesc = item.description.toLowerCase().includes(query)
        const matchOwner = item.owner?.full_name?.toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchOwner) return false
      }

      // Category match
      if (category !== 'All' && item.category !== category) {
        return false
      }

      // Locality match
      if (locality !== 'All' && item.locality !== locality) {
        return false
      }

      // Availability match
      if (availability === 'available' && item.status !== 'available') {
        return false
      }
      if (availability === 'borrowed' && item.status !== 'borrowed') {
        return false
      }

      return true
    })
  }, [resources, search, category, locality, availability])

  // Rule-based recommendations
  const recommendedItems = useMemo(() => {
    return getRecommendationsForUser(user, resources, null, 3)
  }, [user, resources])

  const handleResetFilters = () => {
    setSearch('')
    setCategory('All')
    setLocality('All')
    setAvailability('All')
    setSearchParams({})
  }

  const updateFilters = (newFilters) => {
    const updated = {
      search,
      category,
      locality,
      availability,
      ...newFilters
    }
    const params = {}
    if (updated.search) params.search = updated.search
    if (updated.category !== 'All') params.category = updated.category
    if (updated.locality !== 'All') params.locality = updated.locality
    if (updated.availability !== 'All') params.availability = updated.availability
    setSearchParams(params)
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '8px' }}>
          Explore Shared Resources
        </h1>
        <p style={{ color: 'var(--color-navy-muted)', fontSize: '1.05rem' }}>
          Discover tools, equipment, books, and household appliances available to borrow in your neighborhood.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Search Input */}
        <div className="filter-search">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by keyword, item name, or lender..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              updateFilters({ search: e.target.value })
            }}
          />
        </div>

        {/* Filter Selects */}
        <div className="filter-selects">
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              updateFilters({ category: e.target.value })
            }}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '170px' }}
            value={locality}
            onChange={(e) => {
              setLocality(e.target.value)
              updateFilters({ locality: e.target.value })
            }}
            aria-label="Filter by locality"
          >
            <option value="All">All Neighborhoods</option>
            {LOCALITIES.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value)
              updateFilters({ availability: e.target.value })
            }}
            aria-label="Filter by availability"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available Now</option>
            <option value="borrowed">Currently Borrowed</option>
          </select>

          {(search || category !== 'All' || locality !== 'All' || availability !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
          Showing <strong>{filteredResources.length}</strong> {filteredResources.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          Loading resources...
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="resources-grid">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onRequest={(res) => setSelectedResourceForRequest(res)}
              onReport={(res) => setSelectedResourceForReport(res)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <PackageOpen size={30} />
          </div>
          <h3 className="empty-state-title">No matching resources found</h3>
          <p className="empty-state-text">
            We couldn't find any listings matching your active filters. Try expanding your search terms or resetting filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            Clear All Filters
          </button>
        </div>
      )}

      {/* Rule-Based Recommendations Section */}
      {recommendedItems.length > 0 && (
        <div style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Recommended in {user?.locality || 'Your Neighborhood'}
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            Rule-based suggestions tailored to your residential locality and immediate item availability.
          </p>

          <div className="resources-grid">
            {recommendedItems.map(resource => (
              <ResourceCard
                key={`rec-${resource.id}`}
                resource={resource}
                onRequest={(res) => setSelectedResourceForRequest(res)}
                onReport={(res) => setSelectedResourceForReport(res)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedResourceForRequest && (
        <RequestModal
          resource={selectedResourceForRequest}
          onClose={() => setSelectedResourceForRequest(null)}
          onSuccess={loadResources}
        />
      )}

      {selectedResourceForReport && (
        <ReportModal
          resource={selectedResourceForReport}
          onClose={() => setSelectedResourceForReport(null)}
        />
      )}
    </div>
  )
}
