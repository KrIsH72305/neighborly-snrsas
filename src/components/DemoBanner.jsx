import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { RotateCcw, Database, UserCheck } from 'lucide-react'
import { INITIAL_PROFILES, normalizeUserId } from '../services/mockData'

export default function DemoBanner() {
  const { user, isDemo, switchDemoUser, resetDemoData } = useAuth()
  const { showToast } = useToast()

  const currentUserId = user ? normalizeUserId(user.id) : 'guest'

  const handleUserChange = (e) => {
    const val = e.target.value
    if (val === 'guest') {
      switchDemoUser(null)
      showToast('Logged out (Guest Mode)', 'info')
    } else {
      const normVal = normalizeUserId(val)
      switchDemoUser(normVal)
      const found = INITIAL_PROFILES.find(p => p.id === normVal || p.legacy_id === val)
      showToast(`Switched account to: ${found?.full_name || 'Community Member'}`, 'success')
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all demo data (resources, requests, reservations, ratings) back to the initial state?')) {
      resetDemoData()
      showToast('Demo data reset to default seed data!', 'success')
    }
  }

  return (
    <div className="demo-banner">
      <div className="demo-banner-left">
        {isDemo ? (
          <>
            <span className="demo-pill-badge">
              <Database size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Demo Mode (LocalStorage)
            </span>
            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
              Prototype mode with local offline storage.
            </span>
          </>
        ) : (
          <>
            <span className="demo-pill-badge" style={{ backgroundColor: '#2563eb' }}>
              <Database size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Supabase Cloud Connected
            </span>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem' }}>
              Live PostgreSQL Database
            </span>
          </>
        )}
      </div>

      <div className="demo-banner-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UserCheck size={14} color="#94a3b8" />
          <label htmlFor="demo-user-selector" className="demo-select-label">
            Quick Switch Account:
          </label>
          <select
            id="demo-user-selector"
            className="demo-select"
            value={currentUserId}
            onChange={handleUserChange}
            title="Switch between borrower, owner, and admin accounts to test workflows"
          >
            <option value="a1111111-1111-1111-1111-111111111111">Sarah Jenkins (Owner / Borrower - Maplewood)</option>
            <option value="a2222222-2222-2222-2222-222222222222">David Chen (Owner / Borrower - Maplewood)</option>
            <option value="a3333333-3333-3333-3333-333333333333">Maria Rodriguez (Neighbor - Oakridge)</option>
            <option value="a4444444-4444-4444-4444-444444444444">Alex Rivera (System Administrator)</option>
            <option value="guest">Log Out (Guest Mode)</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          className="btn-reset-demo"
          title="Reset all demo listings, requests, and reservations"
        >
          <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Reset Demo Data
        </button>
      </div>
    </div>
  )
}
