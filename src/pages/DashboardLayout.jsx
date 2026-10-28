import React from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Inbox,
  CalendarCheck,
  History,
  ShieldAlert,
  User
} from 'lucide-react'

export default function DashboardLayout() {
  const { user } = useAuth()

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '0 12px 16px', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Logged in as:</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-navy)' }}>
            {user?.full_name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            {user?.locality} {user?.role === 'admin' ? '• Admin' : '• Resident'}
          </div>
        </div>

        <div className="sidebar-heading">Sharing Hub</div>
        <ul className="sidebar-nav">
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/my-resources"
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <Package size={18} />
              <span>My Resources</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/add-resource"
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <PlusCircle size={18} />
              <span>List New Item</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-heading">Transactions</div>
        <ul className="sidebar-nav">
          <li>
            <NavLink
              to="/dashboard/borrow-requests"
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <Inbox size={18} />
              <span>Borrow Requests</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/reservations"
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <CalendarCheck size={18} />
              <span>Active Reservations</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/history"
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <History size={18} />
              <span>Borrowing History</span>
            </NavLink>
          </li>
        </ul>

        {user?.role === 'admin' && (
          <>
            <div className="sidebar-heading" style={{ color: '#b91c1c' }}>Administration</div>
            <ul className="sidebar-nav">
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
                  style={{ color: '#b91c1c' }}
                >
                  <ShieldAlert size={18} />
                  <span>Admin Console</span>
                </NavLink>
              </li>
            </ul>
          </>
        )}
      </aside>

      {/* Main Outlet Area */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}
