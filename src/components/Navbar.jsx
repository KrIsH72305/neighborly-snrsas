import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  Share2,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Compass,
  HelpCircle,
  Home,
  User
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    showToast('You have been logged out.', 'info')
    navigate('/')
    setMobileMenuOpen(false)
  }

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="brand-icon">
            <Share2 size={20} />
          </div>
          <span>Neighborly</span>
          <span className="brand-badge">SNRSAS</span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
            end
          >
            <Home size={17} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            <Compass size={17} />
            <span>Explore Items</span>
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            <HelpCircle size={17} />
            <span>How It Works</span>
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
          )}

          {user && user.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
              style={{ color: '#b91c1c' }}
            >
              <ShieldAlert size={17} />
              <span>Admin Panel</span>
            </NavLink>
          )}

          {/* Action buttons inside mobile nav or right header */}
          <div className="nav-actions" style={{ marginLeft: '12px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  to="/dashboard/add-resource"
                  className="btn btn-primary btn-sm"
                  onClick={closeMenu}
                >
                  <PlusCircle size={16} />
                  <span>Share Item</span>
                </Link>

                <div className="user-pill" title={`${user.full_name} (${user.locality})`}>
                  <div className="user-avatar">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="user-meta-name">{user.full_name}</div>
                    <div className="user-meta-locality">{user.locality || 'Neighbor'}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                  title="Log out of current account"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                  <User size={15} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
