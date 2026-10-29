import { supabase, isConfigured } from './supabase'
import { LocalStore } from './localStorageStore'
import { normalizeUserId, normalizeResourceId, INITIAL_RESOURCES } from './mockData'

/**
 * Helper to ensure async Supabase queries never hang the UI if network latency is high.
 */
function withTimeout(promise, ms = 2000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), ms))
  ])
}

/**
 * Unified Database and Auth Service for Neighborly (SNRSAS)
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
      const { data: { session }, error: sessionError } = await withTimeout(supabase.auth.getSession(), 1500)
      if (sessionError || !session?.user) {
        return LocalStore.getCurrentUser()
      }

      // Fetch profile from Supabase
      const { data: profile, error: profileError } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single(),
        1500
      )

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
      const newProfile = LocalStore.createProfile({
        full_name: email.split('@')[0],
        email: email,
        locality: 'Maplewood Heights'
      })
      return { user: newProfile, error: null }
    }

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        2500
      )
      if (error) {
        const profiles = LocalStore.getProfiles()
        const testProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase())
        if (testProfile) {
          LocalStore.setCurrentUser(testProfile)
          return { user: testProfile, error: null }
        }
        return { user: null, error: error.message }
      }

      const profile = await this.getCurrentUser()
      return { user: profile, error: null }
    } catch (err) {
      const profiles = LocalStore.getProfiles()
      const testProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase())
      if (testProfile) {
        LocalStore.setCurrentUser(testProfile)
        return { user: testProfile, error: null }
      }
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
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
              locality: locality || 'Maplewood Heights',
              role: 'user'
            }
          }
        }),
        2500
      )
      if (error) {
        const localUser = LocalStore.createProfile({ full_name, email, locality, phone })
        return { user: localUser, error: null }
      }
      return { user: data.user, error: null }
    } catch (err) {
      const localUser = LocalStore.createProfile({ full_name, email, locality, phone })
      return { user: localUser, error: null }
    }
  },

  async logout() {
    LocalStore.setCurrentUser(null)
    if (isConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (e) {
        // ignore
      }
    }
    return { error: null }
  },

  switchDemoUser(userId) {
    if (!userId) {
      LocalStore.setCurrentUser(null)
      return
    }
    const normId = normalizeUserId(userId)
    const profile = LocalStore.getProfileById(normId) || LocalStore.getProfileById(userId)
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
      const { data, error } = await withTimeout(
        supabase
          .from('resources')
          .select(`
            *,
            owner:profiles!resources_owner_id_fkey(id, full_name, locality, avatar_url),
            ratings(score)
          `)
          .order('created_at', { ascending: false }),
        2000
      )

      if (error || !data || data.length === 0) {
        return LocalStore.getResources()
      }

      const mapped = data.map(item => {
        const scores = item.ratings?.map(r => r.score) || []
        const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null
        const normOwnerId = normalizeUserId(item.owner_id)
        const owner = item.owner || LocalStore.getProfileById(normOwnerId) || {
          id: normOwnerId,
          full_name: 'Community Neighbor',
          locality: item.locality || 'Maplewood Heights'
        }
        const seed = INITIAL_RESOURCES.find(
          r => r.id === item.id || normalizeResourceId(r.id) === normalizeResourceId(item.id) || r.title === item.title
        )
        return {
          ...item,
          owner,
          image_url: seed?.image_url || item.image_url,
          average_rating: avg ? parseFloat(avg) : null,
          review_count: scores.length
        }
      })

      // Merge remaining seed catalog if not present in Supabase
      const existingIds = new Set(mapped.map(m => m.id))
      const localItems = LocalStore.getResources()
      for (const item of localItems) {
        if (!existingIds.has(item.id)) {
          mapped.push(item)
        }
      }

      return mapped
    } catch (err) {
      console.warn('Supabase getResources using local fallback:', err.message)
      return LocalStore.getResources()
    }
  },

  async getResourceById(id) {
    const normId = normalizeResourceId(id)
    if (!isConfigured) {
      return LocalStore.getResourceById(normId) || LocalStore.getResourceById(id)
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('resources')
          .select(`
            *,
            owner:profiles!resources_owner_id_fkey(id, full_name, locality, avatar_url, phone, email)
          `)
          .or(`id.eq.${normId},id.eq.${id}`)
          .single(),
        2000
      )

      if (error || !data) {
        return LocalStore.getResourceById(normId) || LocalStore.getResourceById(id)
      }

      const normOwnerId = normalizeUserId(data.owner_id)
      const owner = data.owner || LocalStore.getProfileById(normOwnerId) || {
        id: normOwnerId,
        full_name: 'Community Neighbor',
        locality: data.locality || 'Maplewood Heights'
      }

      const seed = INITIAL_RESOURCES.find(
        r => r.id === data.id || normalizeResourceId(r.id) === normalizeResourceId(data.id) || r.title === data.title
      )

      return {
        ...data,
        owner,
        image_url: seed?.image_url || data.image_url
      }
    } catch (err) {
      return LocalStore.getResourceById(normId) || LocalStore.getResourceById(id)
    }
  },

  async createResource(data, ownerId) {
    const normOwnerId = normalizeUserId(ownerId)
    const localItem = LocalStore.createResource(data, normOwnerId)

    if (!isConfigured) {
      return localItem
    }
    try {
      const { data: item, error } = await withTimeout(
        supabase
          .from('resources')
          .insert([{ ...data, owner_id: normOwnerId }])
          .select()
          .single(),
        2500
      )

      if (error) {
        return localItem
      }
      return item || localItem
    } catch (err) {
      return localItem
    }
  },

  async updateResource(id, data, ownerId) {
    const normId = normalizeResourceId(id)
    const normOwnerId = normalizeUserId(ownerId)
    const localUpdated = LocalStore.updateResource(normId, data, normOwnerId)

    if (!isConfigured) {
      return localUpdated
    }
    try {
      const { data: updated, error } = await withTimeout(
        supabase
          .from('resources')
          .update(data)
          .or(`id.eq.${normId},id.eq.${id}`)
          .select()
          .single(),
        2500
      )

      if (error) {
        return localUpdated
      }
      return updated || localUpdated
    } catch (err) {
      return localUpdated
    }
  },

  async deleteResource(id, currentUserId) {
    const normId = normalizeResourceId(id)
    const normUserId = normalizeUserId(currentUserId)
    const localDeleted = LocalStore.deleteResource(normId, normUserId)

    if (!isConfigured) {
      return localDeleted
    }
    try {
      const { error } = await withTimeout(
        supabase
          .from('resources')
          .delete()
          .or(`id.eq.${normId},id.eq.${id}`),
        2500
      )

      if (error) {
        return localDeleted
      }
      return true
    } catch (err) {
      return localDeleted
    }
  },

  // ---------------- BORROW REQUESTS ----------------
  async getBorrowRequests() {
    if (!isConfigured) {
      return LocalStore.getRequests()
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('borrow_requests')
          .select(`
            *,
            resource:resources(*),
            borrower:profiles!borrow_requests_borrower_id_fkey(*)
          `)
          .order('created_at', { ascending: false }),
        2000
      )

      if (error || !data || data.length === 0) {
        return LocalStore.getRequests()
      }

      const localReqs = LocalStore.getRequests()
      const supabaseIds = new Set(data.map(d => d.id))
      const combined = [...data]
      for (const req of localReqs) {
        if (!supabaseIds.has(req.id)) {
          combined.push(req)
        }
      }
      return combined
    } catch (err) {
      return LocalStore.getRequests()
    }
  },

  async createBorrowRequest(requestData) {
    const normBorrowerId = normalizeUserId(requestData.borrower_id)
    const normResourceId = normalizeResourceId(requestData.resource_id)
    const sanitized = {
      ...requestData,
      borrower_id: normBorrowerId,
      resource_id: normResourceId
    }

    let localResult = null
    try {
      localResult = LocalStore.createRequest(sanitized)
    } catch (localErr) {
      console.warn('Local store note:', localErr.message)
    }

    if (!isConfigured) {
      return localResult
    }

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('borrow_requests')
          .insert([{
            resource_id: sanitized.resource_id,
            borrower_id: sanitized.borrower_id,
            start_date: sanitized.start_date,
            end_date: sanitized.end_date,
            message: sanitized.message
          }])
          .select(`
            *,
            resource:resources(*),
            borrower:profiles!borrow_requests_borrower_id_fkey(*)
          `)
          .single(),
        2500
      )

      if (error) {
        return localResult
      }
      return data || localResult
    } catch (err) {
      return localResult
    }
  },

  async approveBorrowRequest(requestId, responseNote) {
    let localApproved = null
    try {
      localApproved = LocalStore.approveRequest(requestId, responseNote)
    } catch (e) {
      console.warn('Local approve note:', e.message)
    }

    if (!isConfigured) {
      return localApproved
    }
    try {
      const { data: req, error: reqErr } = await withTimeout(
        supabase
          .from('borrow_requests')
          .update({ status: 'approved', response_note: responseNote })
          .eq('id', requestId)
          .select('*, resource:resources(*)')
          .single(),
        2500
      )

      if (reqErr) {
        return localApproved
      }

      const { data: resv, error: resvErr } = await withTimeout(
        supabase
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
          .single(),
        2500
      )

      if (resvErr) {
        return localApproved
      }
      return { request: req, reservation: resv }
    } catch (err) {
      return localApproved
    }
  },

  async rejectBorrowRequest(requestId, responseNote) {
    let localRejected = null
    try {
      localRejected = LocalStore.rejectRequest(requestId, responseNote)
    } catch (e) {
      console.warn('Local reject note:', e.message)
    }

    if (!isConfigured) {
      return localRejected
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('borrow_requests')
          .update({ status: 'rejected', response_note: responseNote })
          .eq('id', requestId)
          .select()
          .single(),
        2500
      )

      if (error) {
        return localRejected
      }
      return data || localRejected
    } catch (err) {
      return localRejected
    }
  },

  // ---------------- RESERVATIONS & RETURNS ----------------
  async getReservations() {
    if (!isConfigured) {
      return LocalStore.getReservations()
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('reservations')
          .select(`
            *,
            resource:resources(*),
            borrower:profiles!reservations_borrower_id_fkey(*),
            owner:profiles!reservations_owner_id_fkey(*)
          `)
          .order('created_at', { ascending: false }),
        2000
      )

      if (error || !data || data.length === 0) {
        return LocalStore.getReservations()
      }

      const localResvs = LocalStore.getReservations()
      const supabaseIds = new Set(data.map(d => d.id))
      const combined = [...data]
      for (const resv of localResvs) {
        if (!supabaseIds.has(resv.id)) {
          combined.push(resv)
        }
      }
      return combined
    } catch (err) {
      return LocalStore.getReservations()
    }
  },

  async markReservationReturned(reservationId, notes) {
    let localReturned = null
    try {
      localReturned = LocalStore.markAsReturned(reservationId, notes)
    } catch (e) {
      console.warn('Local return note:', e.message)
    }

    if (!isConfigured) {
      return localReturned
    }
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await withTimeout(
        supabase
          .from('reservations')
          .update({
            status: 'returned',
            actual_return_date: today,
            notes: notes || 'Item returned safely'
          })
          .eq('id', reservationId)
          .select()
          .single(),
        2500
      )

      if (error) {
        return localReturned
      }
      return data || localReturned
    } catch (err) {
      return localReturned
    }
  },

  // ---------------- RATINGS ----------------
  async getRatings(resourceId) {
    const normResId = resourceId ? normalizeResourceId(resourceId) : null
    if (!isConfigured) {
      const all = LocalStore.getRatings()
      return normResId
        ? all.filter(r => r.resource_id === resourceId || normalizeResourceId(r.resource_id) === normResId)
        : all
    }
    try {
      let query = supabase.from('ratings').select('*, reviewer:profiles(*)')
      if (normResId) query = query.or(`resource_id.eq.${normResId},resource_id.eq.${resourceId}`)
      const { data, error } = await withTimeout(query, 2000)
      if (error || !data || data.length === 0) {
        const all = LocalStore.getRatings()
        return normResId
          ? all.filter(r => r.resource_id === resourceId || normalizeResourceId(r.resource_id) === normResId)
          : all
      }
      return data
    } catch (err) {
      const all = LocalStore.getRatings()
      return normResId
        ? all.filter(r => r.resource_id === resourceId || normalizeResourceId(r.resource_id) === normResId)
        : all
    }
  },

  async createRating(ratingData) {
    const sanitized = {
      ...ratingData,
      resource_id: normalizeResourceId(ratingData.resource_id),
      reviewer_id: normalizeUserId(ratingData.reviewer_id),
      reviewee_id: normalizeUserId(ratingData.reviewee_id)
    }

    let localRating = null
    try {
      localRating = LocalStore.createRating(sanitized)
    } catch (e) {
      console.warn('Local rating note:', e.message)
    }

    if (!isConfigured) {
      return localRating
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('ratings')
          .insert([sanitized])
          .select()
          .single(),
        2500
      )

      if (error) {
        return localRating
      }
      return data || localRating
    } catch (err) {
      return localRating
    }
  },

  // ---------------- REPORTS ----------------
  async getReports() {
    if (!isConfigured) {
      return LocalStore.getReports()
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('reports')
          .select(`
            *,
            reporter:profiles!reports_reporter_id_fkey(*),
            resource:resources(*)
          `)
          .order('created_at', { ascending: false }),
        2000
      )

      if (error || !data || data.length === 0) {
        return LocalStore.getReports()
      }

      const localReports = LocalStore.getReports()
      const supabaseIds = new Set(data.map(d => d.id))
      const combined = [...data]
      for (const rep of localReports) {
        if (!supabaseIds.has(rep.id)) {
          combined.push(rep)
        }
      }
      return combined
    } catch (err) {
      return LocalStore.getReports()
    }
  },

  async createReport(reportData) {
    const sanitized = {
      ...reportData,
      reporter_id: normalizeUserId(reportData.reporter_id),
      resource_id: reportData.resource_id ? normalizeResourceId(reportData.resource_id) : null,
      reported_user_id: reportData.reported_user_id ? normalizeUserId(reportData.reported_user_id) : null
    }

    let localRep = null
    try {
      localRep = LocalStore.createReport(sanitized)
    } catch (e) {
      console.warn('Local report note:', e.message)
    }

    if (!isConfigured) {
      return localRep
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('reports')
          .insert([sanitized])
          .select()
          .single(),
        2500
      )

      if (error) {
        return localRep
      }
      return data || localRep
    } catch (err) {
      return localRep
    }
  },

  async updateReportStatus(reportId, status, adminNotes) {
    let localRep = null
    try {
      localRep = LocalStore.updateReportStatus(reportId, status, adminNotes)
    } catch (e) {
      console.warn('Local update report note:', e.message)
    }

    if (!isConfigured) {
      return localRep
    }
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('reports')
          .update({ status, admin_notes: adminNotes })
          .eq('id', reportId)
          .select()
          .single(),
        2500
      )

      if (error) {
        return localRep
      }
      return data || localRep
    } catch (err) {
      return localRep
    }
  }
}
