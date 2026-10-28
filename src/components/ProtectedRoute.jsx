import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldAlert } from 'lucide-react'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-navy-muted)', fontWeight: 600 }}>
          Loading your session...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <div className="empty-state" style={{ maxWidth: '540px', margin: '0 auto', borderColor: '#fca5a5' }}>
          <div className="empty-state-icon" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            <ShieldAlert size={32} />
          </div>
          <h2 className="empty-state-title" style={{ color: '#991b1b' }}>Administrator Access Required</h2>
          <p className="empty-state-text">
            This section is restricted to neighborhood board administrators.
            Your current logged in account (<strong>{user.full_name}</strong>) does not have administrative privileges.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            Tip for Examiners: Use the test account selector in the top bar to switch to <strong>Alex Rivera (System Administrator)</strong>.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Return to User Dashboard
          </a>
        </div>
      </div>
    )
  }

  return children
}
