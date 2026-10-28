import { supabase, isConfigured } from './supabase'
import { LocalStore } from './localStorageStore'

/**
 * Unified Database and Auth Service for Neighborly (SNRSAS)
 *
 * When Supabase environment variables are provided:
 *   Communicates with Supabase PostgreSQL and Supabase Auth.
 * When in Demo Mode:
 *   Uses LocalStore (localStorage) with sample neighbor data.
 */

export const dbService = {
  isDemoMode() {
    return !isConfigured
  },

  // ---------------- AUTHENTICATION ----------------
  async getCurrentUser() {
    if (!isConfigured) {
      return LocalStore.getCurrentUser()
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) return null

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        return {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || 'Neighbor',
          locality: session.user.user_metadata?.locality || 'Maplewood Heights',
          role: session.user.user_metadata?.role || 'user'
        }
      }
      return profile
    } catch (err) {
      console.warn('Supabase auth check failed, falling back to local demo user:', err)
      return LocalStore.getCurrentUser()
    }
  },

  async login(email, password) {
    if (!isConfigured) {
      const profiles = LocalStore.getProfiles()
      const found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase())
      if (found) {
        LocalStore.setCurrentUser(found)
        return { user: found, error: null }
      }
      // If email doesn't match a seeded profile, create a demo session safely
      const newProfile = LocalStore.createProfile({
        full_name: email.split('@')[0],
        email: email,
        locality: 'Maplewood Heights'
      })
      return { user: newProfile, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { user: null, error: error.message }

      const profile = await this.getCurrentUser()
      return { user: profile, error: null }
    } catch (err) {
      return { user: null, error: err.message }
    }
  },

  async register({ full_name, email, password, locality, phone }) {
    if (!isConfigured) {
      const newProfile = LocalStore.createProfile({
        full_name,
        email,
        locality: locality || 'Maplewood Heights',
        phone: phone || ''
      })
      return { user: newProfile, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            locality: locality || 'Maplewood Heights',
            role: 'user'
          }
        }
      })
      if (error) return { user: null, error: error.message }
      return { user: data.user, error: null }
    } catch (err) {
      return { user: null, error: err.message }
    }
  },

  async logout() {
    if (!isConfigured) {
      LocalStore.setCurrentUser(null)
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error ? error.message : null }
    } catch (err) {
      return { error: err.message }
    }
  },

  // Switch demo user quickly for examiner testing
  switchDemoUser(userId) {
    const profile = LocalStore.getProfileById(userId)
    if (profile) {
      LocalStore.setCurrentUser(profile)
    }
  },

  resetDemoData() {
    LocalStore.resetAll()
  },

  // ---------------- RESOURCES ----------------
  async getResources() {
    if (!isConfigured) {
      return LocalStore.getResources()
    }
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          owner:profiles!resources_owner_id_fkey(id, full_name, locality, avatar_url),
          ratings(score)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(item => {
        const scores = item.ratings?.map(r => r.score) || []
        const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null
        return {
          ...item,
          average_rating: avg ? parseFloat(avg) : null,
          review_count: scores.length
        }
      })
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err.message)
      return LocalStore.getResources()
    }
  },

  async getResourceById(id) {
    if (!isConfigured) {
      return LocalStore.getResourceById(id)
    }
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          owner:profiles!resources_owner_id_fkey(id, full_name, locality, avatar_url, phone, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      return LocalStore.getResourceById(id)
    }
  },

  async createResource(data, ownerId) {
    if (!isConfigured) {
      return LocalStore.createResource(data, ownerId)
    }
    const { data: item, error } = await supabase
      .from('resources')
      .insert([{ ...data, owner_id: ownerId }])
      .select()
      .single()

    if (error) throw error
    return item
  },

  async updateResource(id, data, ownerId) {
    if (!isConfigured) {
      return LocalStore.updateResource(id, data, ownerId)
    }
    const { data: updated, error } = await supabase
      .from('resources')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return updated
  },

  async deleteResource(id, currentUserId) {
    if (!isConfigured) {
      return LocalStore.deleteResource(id, currentUserId)
    }
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // ---------------- BORROW REQUESTS ----------------
  async getBorrowRequests() {
    if (!isConfigured) {
      return LocalStore.getRequests()
    }
    try {
      const { data, error } = await supabase
        .from('borrow_requests')
        .select(`
          *,
          resource:resources(*),
          borrower:profiles!borrow_requests_borrower_id_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      return LocalStore.getRequests()
    }
  },

  async createBorrowRequest(requestData) {
    if (!isConfigured) {
      return LocalStore.createRequest(requestData)
    }
    const { data, error } = await supabase
      .from('borrow_requests')
      .insert([requestData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async approveBorrowRequest(requestId, responseNote) {
    if (!isConfigured) {
      return LocalStore.approveRequest(requestId, responseNote)
    }
    // Update request
    const { data: req, error: reqErr } = await supabase
      .from('borrow_requests')
      .update({ status: 'approved', response_note: responseNote })
      .eq('id', requestId)
      .select('*, resource:resources(*)')
      .single()

    if (reqErr) throw reqErr

    // Create reservation
    const { data: resv, error: resvErr } = await supabase
      .from('reservations')
      .insert([{
        request_id: req.id,
        resource_id: req.resource_id,
        borrower_id: req.borrower_id,
        owner_id: req.resource.owner_id,
        start_date: req.start_date,
        end_date: req.end_date,
        status: 'confirmed',
        notes: responseNote || 'Approved by owner'
      }])
      .select()
      .single()

    if (resvErr) throw resvErr
    return { request: req, reservation: resv }
  },

  async rejectBorrowRequest(requestId, responseNote) {
    if (!isConfigured) {
      return LocalStore.rejectRequest(requestId, responseNote)
    }
    const { data, error } = await supabase
      .from('borrow_requests')
      .update({ status: 'rejected', response_note: responseNote })
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ---------------- RESERVATIONS & RETURNS ----------------
  async getReservations() {
    if (!isConfigured) {
      return LocalStore.getReservations()
    }
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          resource:resources(*),
          borrower:profiles!reservations_borrower_id_fkey(*),
          owner:profiles!reservations_owner_id_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      return LocalStore.getReservations()
    }
  },

  async markReservationReturned(reservationId, notes) {
    if (!isConfigured) {
      return LocalStore.markAsReturned(reservationId, notes)
    }
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('reservations')
      .update({
        status: 'returned',
        actual_return_date: today,
        notes: notes || 'Item returned safely'
      })
      .eq('id', reservationId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ---------------- RATINGS ----------------
  async getRatings(resourceId) {
    if (!isConfigured) {
      const all = LocalStore.getRatings()
      return resourceId ? all.filter(r => r.resource_id === resourceId) : all
    }
    try {
      let query = supabase.from('ratings').select('*, reviewer:profiles(*)')
      if (resourceId) query = query.eq('resource_id', resourceId)
      const { data, error } = await query
      if (error) throw error
      return data
    } catch (err) {
      const all = LocalStore.getRatings()
      return resourceId ? all.filter(r => r.resource_id === resourceId) : all
    }
  },

  async createRating(ratingData) {
    if (!isConfigured) {
      return LocalStore.createRating(ratingData)
    }
    const { data, error } = await supabase
      .from('ratings')
      .insert([ratingData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ---------------- REPORTS ----------------
  async getReports() {
    if (!isConfigured) {
      return LocalStore.getReports()
    }
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey(*),
          resource:resources(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      return LocalStore.getReports()
    }
  },

  async createReport(reportData) {
    if (!isConfigured) {
      return LocalStore.createReport(reportData)
    }
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateReportStatus(reportId, status, adminNotes) {
    if (!isConfigured) {
      return LocalStore.updateReportStatus(reportId, status, adminNotes)
    }
    const { data, error } = await supabase
      .from('reports')
      .update({ status, admin_notes: adminNotes })
      .eq('id', reportId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
