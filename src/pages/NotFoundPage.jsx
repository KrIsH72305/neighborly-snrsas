import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <div className="empty-state" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="empty-state-icon">
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
          404
        </h1>
        <h2 className="empty-state-title" style={{ marginBottom: '12px' }}>
          Page Not Found
        </h2>
        <p className="empty-state-text">
          The neighborhood lane you are looking for doesn't exist or has moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/explore" className="btn btn-outline">
            <span>Explore Resources</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
