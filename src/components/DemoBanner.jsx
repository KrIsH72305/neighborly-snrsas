import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { RotateCcw, ShieldCheck, Database, UserCheck, AlertCircle } from 'lucide-react'
import { INITIAL_PROFILES } from '../services/mockData'

export default function DemoBanner() {
  const { user, isDemo, switchDemoUser, resetDemoData } = useAuth()
  const { showToast } = useToast()

  const handleUserChange = (e) => {
    const val = e.target.value
    if (val === 'guest') {
      switchDemoUser(null)
      showToast('Switched to Guest mode (logged out)', 'info')
    } else {
      switchDemoUser(val)
      const found = INITIAL_PROFILES.find(p => p.id === val)
      showToast(`Switched account to: ${found?.full_name}`, 'success')
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
              Demo Prototype (LocalStorage)
            </span>
            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
              No Supabase keys detected — running in full offline prototype mode with persistent local storage.
            </span>
          </>
        ) : (
          <span className="demo-pill-badge" style={{ backgroundColor: '#2563eb' }}>
            <Database size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Supabase Cloud Connected
          </span>
        )}
      </div>

      <div className="demo-banner-right">
        {isDemo && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={14} color="#94a3b8" />
              <label htmlFor="demo-user-selector" className="demo-select-label">
                Test Account:
              </label>
              <select
                id="demo-user-selector"
                className="demo-select"
                value={user ? user.id : 'guest'}
                onChange={handleUserChange}
                title="Switch between borrower, owner, and admin accounts to test workflows"
              >
                <option value="user-1">Sarah Jenkins (Owner / Borrower - Maplewood)</option>
                <option value="user-2">David Chen (Owner / Borrower - Maplewood)</option>
                <option value="user-3">Maria Rodriguez (Neighbor - Oakridge)</option>
                <option value="user-admin">Alex Rivera (System Administrator)</option>
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
          </>
        )}
      </div>
    </div>
  )
}
