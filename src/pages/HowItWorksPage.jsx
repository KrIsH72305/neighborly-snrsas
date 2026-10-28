import React from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  CalendarCheck,
  RotateCcw,
  Star,
  ShieldCheck,
  Users,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="container" style={{ padding: '48px 20px 80px', maxWidth: '980px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.85rem', marginBottom: '14px' }}>
          Platform Guide
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          How Neighborly Works
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
          Smart Neighborhood Resource Sharing & Allocation System (SNRSAS) is engineered to make borrowing and lending household resources safe, predictable, and simple.
        </p>
      </div>

      {/* 4-Step Deep Dive */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px' }}>
        {/* Step 1 */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px', alignItems: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800
            }}
          >
            1
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Explore & Select Available Dates
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Residents can browse by category (Tools, Lawn & Garden, Electronics, Books, Household) and filter by neighborhood locality. When you find an item, pick your start date and expected return date. The system automatically verifies that your requested window falls within the lender's availability bounds.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px', alignItems: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800
            }}
          >
            2
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Lender Approval & Automatic Conflict Prevention
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              The resource owner receives your borrow request and proposed duration. When the owner clicks <strong>"Accept"</strong>, the request transforms into a confirmed reservation. The booking engine locks the calendar, preventing double-bookings.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px', alignItems: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800
            }}
          >
            3
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Pickup, Use, and Track Returns
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Borrowers pick up items locally following the lender's instructions (e.g. charging batteries or clean-off guidelines). Both parties can see the active countdown on their dashboard. If the expected return date passes without return confirmation, the system highlights the transaction with an overdue badge.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px', alignItems: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800
            }}
          >
            4
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Log Return & Submit Community Trust Ratings
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Once the item is safely returned, the owner marks it as returned, which updates the resource back to "Available". Neighbors then exchange 1-5 star ratings and feedback. Ratings build a verified trust score for each resident.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              How does the system prevent double-booking?
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: '1.6' }}>
              Neighborly uses date-overlap algorithm checks. When an owner accepts a borrow request for a date range, that window is immediately reserved. Conflicting requests for overlapping dates cannot be confirmed and are automatically declined to maintain calendar integrity.
            </p>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              Can a resident borrow their own listed items?
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: '1.6' }}>
              No. Both the client interface and the backend database enforce a strict constraint (<code>borrower_id &lt;&gt; owner_id</code>) prohibiting self-borrowing.
            </p>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              What happens if an item is returned late?
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: '1.6' }}>
              When a reservation's expected return date passes without an owner return record, the system automatically flags the transaction with an <strong>"Overdue"</strong> indicator and notifies the dashboard.
            </p>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              How are inappropriate listings or disputes handled?
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: '1.6' }}>
              Residents can file confidential reports directly from any item card. Designated neighborhood administrators review the reports in the Admin Panel and have elevated permissions to remove listings or resolve disputes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <Link to="/explore" className="btn btn-primary btn-lg">
          <span>Explore Neighborhood Resources Now</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
