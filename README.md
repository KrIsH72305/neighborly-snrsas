# Neighborly - Smart Neighborhood Resource Sharing & Allocation System (SNRSAS)

> **College Software Engineering Capstone Project**  
> A full-stack web application designed for residential communities to list household resources, discover neighborhood gear, coordinate borrow requests, prevent double-bookings, track returns, and exchange trust ratings.

---

## 🌟 Overview & Objectives

In modern residential neighborhoods, countless high-value tools (drills, ladders, pressure washers), garden machinery (lawn mowers, hedge trimmers), electronics (movie projectors, cameras), and camping equipment sit unused in garages for 95% of their lifespan.

**Neighborly (SNRSAS)** provides a transparent peer-to-peer sharing ecosystem that:
- **Reduces Consumer Waste**: Encourages sharing before purchasing single-use items.
- **Saves Household Costs**: Allows residents to borrow expensive gear from nearby neighbors for free.
- **Strengthens Community Bonds**: Fosters neighborhood trust through 1-5 star peer ratings and verified residential profiles.
- **Eliminates Scheduling Conflicts**: Programmatically enforces date-overlap constraints and reservation tracking.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 with Vite for lightning-fast HMR and bundling
- **Routing**: React Router v6 (`react-router-dom`)
- **Styling**: Pure modern CSS using custom design tokens, CSS variables, responsive grid & flexbox (light navy text `#0f172a` with emerald green accents `#059669` / `#10b981`)
- **Icons**: Lucide React (`lucide-react`)
- **Backend & Database**: Supabase PostgreSQL + Supabase Auth
- **Fallback / Prototype Mode**: Offline-first LocalStorage engine with simulated relational integrity, dynamic date adjustments, and 1-click demo role switching

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your machine.

### 2. Installation
Open your terminal in the project root directory and run:
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The application will launch immediately at:
```
http://localhost:5173/
```

---

## 🧪 Demo Mode (Zero-Config Testing)

The application includes an **instant offline Demo Mode**. You **do not** need a Supabase account or API keys to test all features immediately!

### Pre-Seeded Test Accounts (1-Click Switcher)
Use the selector bar at the top of the screen to switch identities in real time:

| Account Name | Locality | Role | Testing Purpose |
| :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | Maplewood Heights | Resident / Owner | Owns power tools (DeWalt drill, Werner ladder, camping tent). Test approving incoming requests! |
| **David Chen** | Maplewood Heights | Resident / Borrower | Owns lawn mower and projector. Test requesting to borrow Sarah's ladder! |
| **Maria Rodriguez** | Oakridge Park | Resident / Neighbor | Owns pressure washer and Harry Potter book set. Test borrowing across localities! |
| **Alex Rivera** | Maplewood Heights | Administrator | **System Administrator**. Access the protected `/admin` console, moderate reports, and remove inappropriate listings! |

### Resetting Demo Data
Click the **"Reset Demo Data"** button in the top banner anytime to restore all resources, bookings, ratings, and reports back to their initial seed state.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

When you are ready to connect to a live Supabase PostgreSQL database:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase Project Dashboard, navigate to **Project Settings -> API**.
3. Copy your **Project URL** and **Project Anon (Publishable) Key**.

### 2. Configure Environment Variables
Create a file named `.env` in the project root (copied from `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key-here
```
> **Security Note:** Never expose the `service_role` secret key on the frontend! The client only requires the public `anon` key.

### 3. Run the SQL Migration Schema
1. In the Supabase Dashboard, go to **SQL Editor**.
2. Open the file [`supabase_schema.sql`](./supabase_schema.sql) in this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. This will set up:
   - `profiles` table with automatic triggers linked to `auth.users`
   - `resources` table with constraints (`available_from <= available_to`)
   - `borrow_requests` table with status workflow
   - `reservations` table with **trigger-enforced double-booking prevention**
   - `ratings` table with duplicate rating prevention (`UNIQUE(reservation_id, reviewer_id)`)
   - `reports` table for content moderation
   - Comprehensive **Row Level Security (RLS)** policies for all tables

---

## 📐 System Architecture & Business Logic

```
   ┌────────────────────────────────────────────────────────┐
   │                    Neighborly UI                       │
   │    Home  •  Explore  •  Dashboard  •  Admin Console    │
   └───────────────────────────┬────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [ Supabase Mode ]               [ Demo Mode ]
     Supabase Client (@supabase)      LocalStorage Store
       PostgreSQL + RLS + Triggers     Client-Side Relational Engine
               │                               │
               └───────────────┬───────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                     Core Modules                       │
   │  • Overlap & Double-Booking Prevention Engine          │
   │  • Rule-Based Category & Locality Recommendation       │
   │  • Overdue Return Detection & Status Recalculation     │
   │  • Peer Trust & 5-Star Community Rating Aggregation    │
   │  • Role-Based Administrator Access Control (RBAC)      │
   └────────────────────────────────────────────────────────┘
```

### 1. Double-Booking Prevention
- When a user submits a borrow request for a resource, the system verifies `[start_date, end_date]` against all existing `confirmed` or `active` reservations for that resource.
- On approval, the reservation is created and any other pending requests with overlapping date intervals are automatically flagged/declined.
- The SQL trigger `check_reservation_conflict()` enforces this constraint at the database layer.

### 2. Prevention of Self-Borrowing
- Users cannot borrow their own listings. If an owner views their own item, the request form is replaced with owner management options.
- The database schema enforces `CONSTRAINT self_borrowing_prohibited CHECK (borrower_id <> owner_id)`.

### 3. Overdue Return Tracking
- Overdue status is computed dynamically based on the current date:
  $$\text{isOverdue} = (\text{status} \in \{\text{'confirmed'}, \text{'active'}\}) \land (\text{endDate} < \text{today}) \land (\text{actualReturnDate} == \text{null})$$
- When overdue, the item displays a pulsing red badge in the dashboard, alerting the owner to follow up.

### 4. Rule-Based Recommendations
- When viewing resources, deterministic matching rules prioritize items sharing:
  1. Identical Category + Same Locality + Available Status ($+10$ score)
  2. Identical Category + Different Locality ($+5$ score)
  3. Same Locality ($+2$ score)
- If an item is currently borrowed, the system suggests available alternatives nearby. No unpredictable AI/ML models are used.

### 5. Role-Based Access Control (RBAC)
- Admin privileges are restricted to accounts where `role === 'admin'`.
- Non-admin users attempting to open `/admin` are blocked by `<ProtectedRoute requireAdmin={true}>` and redirected.

---

## 📂 Project Directory Structure

```
software project/
├── index.html                   # HTML entry point with modern typography
├── vite.config.js               # Vite bundler configuration
├── package.json                 # Project dependencies & scripts
├── supabase_schema.sql          # Complete PostgreSQL schema, triggers & RLS policies
├── .env.example                 # Example Supabase configuration
├── README.md                    # Project documentation
├── public/
│   └── favicon.svg              # Brand SVG favicon
└── src/
    ├── main.jsx                 # React root render with providers
    ├── App.jsx                  # Main routing & layout structure
    ├── index.css                # Global CSS variables, buttons, badges, typography
    ├── App.css                  # Component & page layouts, navbar, hero, cards, sidebar
    ├── components/
    │   ├── Navbar.jsx           # Responsive top header with role indicator
    │   ├── Footer.jsx           # Footer with project metadata & links
    │   ├── DemoBanner.jsx       # 1-Click test account switcher & data reset
    │   ├── ProtectedRoute.jsx   # Auth guard & admin role verifier
    │   ├── ResourceCard.jsx     # Reusable card with status badges & rating stars
    │   ├── RequestModal.jsx     # Borrowing date selector with duration calculation
    │   ├── RatingModal.jsx      # 1-5 star review modal with duplicate check
    │   ├── ReportModal.jsx      # Item/member dispute moderation modal
    │   ├── EditResourceModal.jsx# Owner listing editor modal
    │   └── ConfirmDialog.jsx    # Action confirmation dialog
    ├── context/
    │   ├── AuthContext.jsx      # Authentication & session manager
    │   └── ToastContext.jsx     # Dynamic toast notifications
    ├── services/
    │   ├── supabase.js          # Supabase client initializer
    │   ├── dbService.js         # Unified dual-mode repository service
    │   ├── mockData.js          # Realistic pre-seeded items, users, and bookings
    │   ├── localStorageStore.js # Client storage manager with conflict logic
    │   └── recommendationEngine.js # Explainable rule-based recommendation logic
    ├── pages/
    │   ├── HomePage.jsx         # Hero, search bar, category cards, featured items
    │   ├── ExplorePage.jsx      # Search, multi-criteria filters & recommendations
    │   ├── ResourceDetailPage.jsx # Item media, owner card, request form & reviews
    │   ├── LoginPage.jsx        # Login with quick 1-click demo test accounts
    │   ├── RegisterPage.jsx     # Resident registration with locality selection
    │   ├── DashboardLayout.jsx  # Sidebar navigation layout
    │   ├── DashboardOverview.jsx# Metric cards & recent activity widgets
    │   ├── MyResourcesPage.jsx  # Owner resource management table (edit/delete)
    │   ├── AddResourcePage.jsx  # New listing form with preset image helpers
    │   ├── BorrowRequestsPage.jsx # Incoming (accept/reject) & outgoing requests
    │   ├── ReservationsPage.jsx # Active bookings, overdue alerts & mark returned
    │   ├── BorrowingHistoryPage.jsx # Past completed transactions & rating prompts
    │   ├── AdminDashboardPage.jsx # Moderation reports, user list & catalog removal
    │   ├── HowItWorksPage.jsx   # Platform guide & FAQ
    │   └── NotFoundPage.jsx     # 404 error page
    └── utils/
        ├── dateUtils.js         # Date formatting, overlap check, overdue detection
        └── helpers.js           # Categories, conditions, badge class mappings
```

---

## 🧪 Testing Checklist for Examiners

1. **Borrow Workflow**:
   - In the top banner, select **"David Chen (Borrower)"**.
   - Browse **Explore Items** and select **"Werner 16ft Aluminum Extension Ladder"** (owned by Sarah).
   - Click **"Borrow Item"**, pick dates (e.g. 3 days), enter a note, and submit.
   - Switch account to **"Sarah Jenkins (Owner)"**.
   - Navigate to **Dashboard -> Borrow Requests**. See David's pending request.
   - Click **"Accept & Confirm Booking"**.
   - Navigate to **Active Reservations** to see the confirmed booking.
2. **Double-Booking Validation**:
   - Try submitting another borrow request for the same ladder during overlapping dates; note the scheduling conflict prevention.
3. **Return & Rating Flow**:
   - As Sarah, click **"Mark Item as Returned"** on a completed reservation.
   - Go to **Borrowing History**.
   - Click **"Rate This Transaction"**, select 5 stars, write feedback, and submit.
4. **Admin Moderation**:
   - Switch account to **"Alex Rivera (System Administrator)"**.
   - Click **"Admin Panel"** in the top navigation.
   - Review reported items, resolve reports, or remove listings from the master catalog.
5. **Role Check Security**:
   - Switch to **"David Chen"** and attempt to navigate to `/admin`. Notice the system blocks access and prompts for administrator authorization.

---

## 📜 License
Developed as an academic software engineering capstone project. Open for community learning and educational deployment.
