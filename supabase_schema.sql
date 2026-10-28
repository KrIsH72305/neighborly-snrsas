-- =========================================================================
-- Smart Neighborhood Resource Sharing & Allocation System (SNRSAS)
-- Database Schema for Supabase PostgreSQL
-- Database Name: Neighborly
-- =========================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Extends the Supabase auth.users system
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    locality TEXT NOT NULL DEFAULT 'Maplewood Heights',
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. RESOURCES TABLE
-- Stores household items listed by neighbors
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Tools', 'Books', 'Electronics', 'Gardening', 'Household Items', 'Other')),
    description TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('New', 'Like New', 'Good', 'Fair')),
    locality TEXT NOT NULL,
    image_url TEXT,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    guidelines TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'maintenance', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_availability_dates CHECK (available_from <= available_to)
);

-- Index for speedy searching and filtering
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_locality ON public.resources(locality);
CREATE INDEX IF NOT EXISTS idx_resources_owner ON public.resources(owner_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);

-- -------------------------------------------------------------------------
-- 3. BORROW REQUESTS TABLE
-- Tracks borrowing proposals submitted by borrowers
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.borrow_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    response_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_request_dates CHECK (start_date <= end_date)
);

CREATE INDEX IF NOT EXISTS idx_requests_resource ON public.borrow_requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_requests_borrower ON public.borrow_requests(borrower_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.borrow_requests(status);

-- -------------------------------------------------------------------------
-- 4. RESERVATIONS / TRANSACTIONS TABLE
-- Confirmed bookings generated when a borrow request is approved
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES public.borrow_requests(id) ON DELETE SET NULL,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_return_date DATE,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'active', 'returned', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_reservation_dates CHECK (start_date <= end_date),
    CONSTRAINT self_borrowing_prohibited CHECK (borrower_id <> owner_id)
);

CREATE INDEX IF NOT EXISTS idx_reservations_resource ON public.reservations(resource_id);
CREATE INDEX IF NOT EXISTS idx_reservations_borrower ON public.reservations(borrower_id);
CREATE INDEX IF NOT EXISTS idx_reservations_owner ON public.reservations(owner_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);

-- -------------------------------------------------------------------------
-- 5. RATINGS AND REVIEWS TABLE
-- Completed transaction ratings (1-5 stars) and feedback
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_rating_per_reservation_reviewer UNIQUE(reservation_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_resource ON public.ratings(resource_id);
CREATE INDEX IF NOT EXISTS idx_ratings_reviewee ON public.ratings(reviewee_id);

-- -------------------------------------------------------------------------
-- 6. REPORTS TABLE
-- Content moderation and dispute tracking for administrators
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN ('Inappropriate Item', 'Misleading Description', 'Damaged / Unusable', 'Unresponsive Member', 'Harassment', 'Other')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- -------------------------------------------------------------------------
-- 7. DATABASE CONSTRAINTS & DOUBLE-BOOKING PREVENTION
-- -------------------------------------------------------------------------

-- Function to check date overlap on confirmed or active reservations
CREATE OR REPLACE FUNCTION check_reservation_conflict()
RETURNS TRIGGER AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    -- Check if another active or confirmed reservation overlaps for this resource
    SELECT COUNT(*)
    INTO conflict_count
    FROM public.reservations
    WHERE resource_id = NEW.resource_id
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND status IN ('confirmed', 'active')
      AND (
          (NEW.start_date <= end_date AND NEW.end_date >= start_date)
      );

    IF conflict_count > 0 THEN
        RAISE EXCEPTION 'Double-booking conflict: This resource is already reserved during the requested dates.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_reservation_conflict ON public.reservations;
CREATE TRIGGER trigger_check_reservation_conflict
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION check_reservation_conflict();

-- -------------------------------------------------------------------------
-- 8. AUTOMATIC AUTH PROFILE CREATION TRIGGER
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, locality, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Neighbor'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'locality', 'Maplewood Heights'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- RESOURCES POLICIES
CREATE POLICY "Anyone can view resources"
ON public.resources FOR SELECT
TO authenticated, anon
USING (status <> 'archived' OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Authenticated users can create resources"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update resources"
ON public.resources FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete resources"
ON public.resources FOR DELETE
TO authenticated
USING (auth.uid() = owner_id OR public.is_admin());

-- BORROW REQUESTS POLICIES
CREATE POLICY "Borrowers, resource owners, and admins can view borrow requests"
ON public.borrow_requests FOR SELECT
TO authenticated
USING (
    borrower_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.resources r WHERE r.id = borrow_requests.resource_id AND r.owner_id = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Borrowers can create borrow requests"
ON public.borrow_requests FOR INSERT
TO authenticated
WITH CHECK (
    borrower_id = auth.uid()
    AND NOT EXISTS (SELECT 1 FROM public.resources r WHERE r.id = resource_id AND r.owner_id = auth.uid())
);

CREATE POLICY "Owners and borrowers can update borrow requests"
ON public.borrow_requests FOR UPDATE
TO authenticated
USING (
    borrower_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.resources r WHERE r.id = borrow_requests.resource_id AND r.owner_id = auth.uid())
    OR public.is_admin()
);

-- RESERVATIONS POLICIES
CREATE POLICY "Participants and admins can view reservations"
ON public.reservations FOR SELECT
TO authenticated
USING (borrower_id = auth.uid() OR owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Owners and admins can manage reservations"
ON public.reservations FOR UPDATE
TO authenticated
USING (owner_id = auth.uid() OR public.is_admin());

-- RATINGS POLICIES
CREATE POLICY "Anyone can view ratings"
ON public.ratings FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Reservation participants can submit ratings"
ON public.ratings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- REPORTS POLICIES
CREATE POLICY "Admins can view all reports, users can view their own"
ON public.reports FOR SELECT
TO authenticated
USING (reporter_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated users can file reports"
ON public.reports FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Only admins can update reports"
ON public.reports FOR UPDATE
TO authenticated
USING (public.is_admin());
