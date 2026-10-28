import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dbService } from '../services/dbService'
import ResourceCard from '../components/ResourceCard'
import RequestModal from '../components/RequestModal'
import ReportModal from '../components/ReportModal'
import {
  Search,
  Wrench,
  BookOpen,
  Tv,
  Flower2,
  Package,
  ShieldCheck,
  Users,
  Repeat,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResourceForRequest, setSelectedResourceForRequest] = useState(null)
  const [selectedResourceForReport, setSelectedResourceForReport] = useState(null)

  const loadResources = async () => {
    try {
      const data = await dbService.getResources()
      setResources(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  // Count items by category
  const getCategoryCount = (categoryName) => {
    return resources.filter(r => r.category === categoryName && r.status !== 'archived').length
  }

  // Featured resources (first 6 available items)
  const featuredResources = resources
    .filter(r => r.status === 'available')
    .slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-tagline">
                <Sparkles size={16} />
                <span>Peer-to-Peer Neighborhood Sharing Network</span>
              </div>
              <h1 className="hero-title">
                Share more, buy less. Empower your <span>neighborhood</span>.
              </h1>
              <p className="hero-description">
                Borrow power tools, lawn mowers, projectors, and household gear from verified neighbors right on your street. Save money, reduce clutter, and build genuine community ties.
              </p>

              {/* Quick Search */}
              <form onSubmit={handleSearchSubmit} className="hero-search-box">
                <Search size={20} className="hero-search-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="What do you need? (e.g. pressure washer, ladder, projector)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>

              {/* Stats Bar */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <h4>{resources.length}+</h4>
                  <p>Community Resources</p>
                </div>
                <div className="hero-stat-item">
                  <h4>100%</h4>
                  <p>Free Peer Sharing</p>
                </div>
                <div className="hero-stat-item">
                  <h4>6</h4>
                  <p>Active Neighborhoods</p>
                </div>
              </div>
            </div>

            {/* Hero Showcase Card Stack */}
            <div className="hero-card-stack">
              <div className="hero-main-card">
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '260px', marginBottom: '16px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80"
                    alt="Tools Sharing"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    Maplewood Heights Hub
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge badge-success">Available Today</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>4.9 ★ Rating</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  DeWalt 20V Max Cordless Drill Kit
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Lent with 2 batteries and full drill bits by Sarah Jenkins.
                </p>
              </div>

              {/* Floating badges */}
              <div className="hero-floating-badge hero-badge-1">
                <CheckCircle2 size={24} color="var(--color-primary)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Double-Booking Protected</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Conflict-free reservations</div>
                </div>
              </div>

              <div className="hero-floating-badge hero-badge-2">
                <Users size={24} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Verified Residents</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Safe local pickup</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="category-section">
        <div className="container">
          <div className="section-header">
            <div className="section-pretitle">Explore Categories</div>
            <h2 className="section-title">Borrow Everything You Need Locally</h2>
            <p className="section-subtitle">
              Why buy an expensive tool you will only use once a year? Browse household items shared generously by your nearby neighbors.
            </p>
          </div>

          <div className="category-grid">
            <Link to="/explore?category=Tools" className="category-card">
              <div className="category-icon-wrapper">
                <Wrench size={26} />
              </div>
              <div className="category-name">Tools & Hardware</div>
              <div className="category-count">{getCategoryCount('Tools')} items available</div>
            </Link>

            <Link to="/explore?category=Gardening" className="category-card">
              <div className="category-icon-wrapper">
                <Flower2 size={26} />
              </div>
              <div className="category-name">Lawn & Garden</div>
              <div className="category-count">{getCategoryCount('Gardening')} items available</div>
            </Link>

            <Link to="/explore?category=Electronics" className="category-card">
              <div className="category-icon-wrapper">
                <Tv size={26} />
              </div>
              <div className="category-name">Electronics & AV</div>
              <div className="category-count">{getCategoryCount('Electronics')} items available</div>
            </Link>

            <Link to="/explore?category=Books" className="category-card">
              <div className="category-icon-wrapper">
                <BookOpen size={26} />
              </div>
              <div className="category-name">Books & Media</div>
              <div className="category-count">{getCategoryCount('Books')} items available</div>
            </Link>

            <Link to="/explore?category=Household%20Items" className="category-card">
              <div className="category-icon-wrapper">
                <Package size={26} />
              </div>
              <div className="category-name">Household & Outdoor</div>
              <div className="category-count">{getCategoryCount('Household Items')} items available</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="featured-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-pretitle">Featured Listings</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Available Near You Right Now</h2>
            </div>
            <Link to="/explore" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>View All Catalog Items</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="resources-grid">
            {featuredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onRequest={(res) => setSelectedResourceForRequest(res)}
                onReport={(res) => setSelectedResourceForReport(res)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-pretitle">Simple & Transparent</div>
            <h2 className="section-title">How Neighborly Sharing Works</h2>
            <p className="section-subtitle">
              Three simple steps to borrow what you need and share what you have with confidence.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Discover & Request</h3>
              <p className="step-description">
                Search local listings in your neighborhood. Pick your needed dates, check automatic calendar availability, and submit a friendly borrowing request.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Approve & Pick Up</h3>
              <p className="step-description">
                The owner reviews and approves your request. The system automatically confirms your reservation and locks the dates to prevent double bookings.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Return & Rate</h3>
              <p className="step-description">
                Hand the item back in great condition on schedule. The owner marks the return, and both neighbors exchange 5-star trust ratings to strengthen community bonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Have tools sitting idle in your garage or closet?</h2>
            <p className="cta-text">
              Join dozens of neighbors in Maplewood Heights and Oakridge Park. Help a neighbor finish their DIY project, earn community recognition, and build a greener neighborhood.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to={user ? "/dashboard/add-resource" : "/register"} className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: 'var(--color-navy)' }}>
                <span>List Your First Resource</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/explore" className="btn btn-outline btn-lg" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                <span>Browse Neighborhood Items</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
