import React from 'react'
import { Link } from 'react-router-dom'
import { Share2, Heart, Shield, Sparkles, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Share2 size={18} />
              </div>
              <h3 style={{ margin: 0 }}>Neighborly</h3>
            </div>
            <p>
              Smart Neighborhood Resource Sharing & Allocation System (SNRSAS).
              Empowering local communities to reduce waste, save money, and foster sustainable peer-to-peer neighborhood sharing.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#10b981', fontSize: '0.85rem' }}>
              <Shield size={16} />
              <span>Verified local residential network</span>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Resource Categories</h4>
            <ul className="footer-links">
              <li><Link to="/explore?category=Tools" className="footer-link">Tools & Hardware</Link></li>
              <li><Link to="/explore?category=Gardening" className="footer-link">Lawn & Garden</Link></li>
              <li><Link to="/explore?category=Electronics" className="footer-link">Electronics & Audio</Link></li>
              <li><Link to="/explore?category=Books" className="footer-link">Books & Media</Link></li>
              <li><Link to="/explore?category=Household%20Items" className="footer-link">Household & Outdoor</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home Page</Link></li>
              <li><Link to="/explore" className="footer-link">Browse Catalog</Link></li>
              <li><Link to="/how-it-works" className="footer-link">How Sharing Works</Link></li>
              <li><Link to="/dashboard" className="footer-link">User Dashboard</Link></li>
              <li><Link to="/dashboard/add-resource" className="footer-link">List an Item</Link></li>
            </ul>
          </div>

          {/* Neighborhoods */}
          <div className="footer-col">
            <h4>Active Neighborhoods</h4>
            <ul className="footer-links" style={{ fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#10b981" /> Maplewood Heights</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#10b981" /> Oakridge Park</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#10b981" /> Pinecrest Valley</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#10b981" /> Downtown Commons</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Neighborly SNRSAS. College Software Engineering Capstone Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Built with React + Vite + Supabase PostgreSQL</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Designed with <Heart size={14} color="#ef4444" fill="#ef4444" /> for community impact
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
