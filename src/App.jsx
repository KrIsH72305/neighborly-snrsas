import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DemoBanner from './components/DemoBanner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import HowItWorksPage from './pages/HowItWorksPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

// Protected Dashboard Pages
import DashboardLayout from './pages/DashboardLayout'
import DashboardOverview from './pages/DashboardOverview'
import MyResourcesPage from './pages/MyResourcesPage'
import AddResourcePage from './pages/AddResourcePage'
import BorrowRequestsPage from './pages/BorrowRequestsPage'
import ReservationsPage from './pages/ReservationsPage'
import BorrowingHistoryPage from './pages/BorrowingHistoryPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

export default function App() {
  return (
    <div className="app-container">
      {/* Top Demo / Cloud Status Banner */}
      <DemoBanner />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Main Content Router */}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/resource/:id" element={<ResourceDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Dashboard Routes (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="my-resources" element={<MyResourcesPage />} />
            <Route path="add-resource" element={<AddResourcePage />} />
            <Route path="borrow-requests" element={<BorrowRequestsPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="history" element={<BorrowingHistoryPage />} />
          </Route>

          {/* Admin Route (Protected with actual role check) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Site Footer */}
      <Footer />
    </div>
  )
}
