import {
  INITIAL_PROFILES,
  INITIAL_RESOURCES,
  INITIAL_REQUESTS,
  INITIAL_RESERVATIONS,
  INITIAL_RATINGS,
  INITIAL_REPORTS
} from './mockData'
import { isDateOverlap, isOverdue, getTodayString } from '../utils/dateUtils'

const STORAGE_KEYS = {
  PROFILES: 'snrsas_demo_profiles_v2',
  RESOURCES: 'snrsas_demo_resources_v2',
  REQUESTS: 'snrsas_demo_requests_v2',
  RESERVATIONS: 'snrsas_demo_reservations_v2',
  RATINGS: 'snrsas_demo_ratings_v2',
  REPORTS: 'snrsas_demo_reports_v2',
  CURRENT_USER: 'snrsas_demo_current_user_v2'
}

// Helper to safely load data
function getStored(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultValue
    return JSON.parse(raw)
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e)
    return defaultValue
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e)
  }
}

export const LocalStore = {
  // Initialize storage with seeds if first run
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      setStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
      setStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      setStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      setStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS)
    }
    if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
      setStored(STORAGE_KEYS.RATINGS, INITIAL_RATINGS)
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      setStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS)
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to Sarah Jenkins for initial experience
      setStored(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[0])
    }
  },

  resetAll() {
    setStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)
    setStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    setStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    setStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS)
    setStored(STORAGE_KEYS.RATINGS, INITIAL_RATINGS)
    setStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS)
    setStored(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[0])
    window.dispatchEvent(new Event('snrsas_data_changed'))
  },

  // ---------------- AUTH / USERS ----------------
  getCurrentUser() {
    this.init()
    return getStored(STORAGE_KEYS.CURRENT_USER, INITIAL_PROFILES[0])
  },

  setCurrentUser(user) {
    setStored(STORAGE_KEYS.CURRENT_USER, user)
    window.dispatchEvent(new Event('snrsas_auth_changed'))
  },

  getProfiles() {
    this.init()
    return getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)
  },

  getProfileById(id) {
    const profiles = this.getProfiles()
    return profiles.find(p => p.id === id) || null
  },

  createProfile(profileData) {
    const profiles = this.getProfiles()
    const newProfile = {
      id: `user-${Date.now()}`,
      role: 'user',
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + (profiles.length * 10000)}?w=150&auto=format&fit=crop&q=80`,
      bio: 'Neighbor in the community',
      ...profileData
    }
    profiles.push(newProfile)
    setStored(STORAGE_KEYS.PROFILES, profiles)
    this.setCurrentUser(newProfile)
    return newProfile
  },

  updateProfile(id, data) {
    const profiles = this.getProfiles()
    const idx = profiles.findIndex(p => p.id === id)
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...data }
      setStored(STORAGE_KEYS.PROFILES, profiles)
      const currentUser = this.getCurrentUser()
      if (currentUser?.id === id) {
        this.setCurrentUser(profiles[idx])
      }
      return profiles[idx]
    }
    return null
  },

  // ---------------- RESOURCES ----------------
  getResources() {
    this.init()
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const profiles = this.getProfiles()
    const ratings = this.getRatings()
    const reservations = this.getReservations()

    // Attach owner info and calculated rating
    return resources.map(res => {
      const owner = profiles.find(p => p.id === res.owner_id) || {
        full_name: 'Community Member',
        locality: res.locality
      }
      const itemRatings = ratings.filter(r => r.resource_id === res.id)
      const avgRating = itemRatings.length > 0
        ? (itemRatings.reduce((sum, r) => sum + r.score, 0) / itemRatings.length).toFixed(1)
        : null

      // Check dynamic status based on active reservations
      const activeRes = reservations.find(r =>
        r.resource_id === res.id &&
        (r.status === 'confirmed' || r.status === 'active' || r.status === 'overdue')
      )

      return {
        ...res,
        owner,
        average_rating: avgRating ? parseFloat(avgRating) : null,
        review_count: itemRatings.length,
        is_currently_reserved: !!activeRes
      }
    })
  },

  getResourceById(id) {
    const list = this.getResources()
    return list.find(r => r.id === id) || null
  },

  createResource(data, ownerId) {
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const newResource = {
      id: `res-${Date.now()}`,
      owner_id: ownerId,
      status: 'available',
      created_at: getTodayString(),
      image_url: data.image_url || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
      ...data
    }
    resources.unshift(newResource)
    setStored(STORAGE_KEYS.RESOURCES, resources)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return newResource
  },

  updateResource(id, data, currentUserId) {
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const idx = resources.findIndex(r => r.id === id)
    if (idx === -1) throw new Error('Resource not found')

    const user = this.getCurrentUser()
    const isAdmin = user?.role === 'admin'
    if (resources[idx].owner_id !== currentUserId && !isAdmin) {
      throw new Error('Unauthorized: You can only edit your own listings.')
    }

    resources[idx] = { ...resources[idx], ...data }
    setStored(STORAGE_KEYS.RESOURCES, resources)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return resources[idx]
  },

  deleteResource(id, currentUserId) {
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const res = resources.find(r => r.id === id)
    if (!res) throw new Error('Resource not found')

    const user = this.getCurrentUser()
    const isAdmin = user?.role === 'admin'
    if (res.owner_id !== currentUserId && !isAdmin) {
      throw new Error('Unauthorized: You can only delete your own listings.')
    }

    const filtered = resources.filter(r => r.id !== id)
    setStored(STORAGE_KEYS.RESOURCES, filtered)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return true
  },

  // ---------------- BORROW REQUESTS ----------------
  getRequests() {
    this.init()
    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const resources = this.getResources()
    const profiles = this.getProfiles()

    return requests.map(req => {
      const resource = resources.find(r => r.id === req.resource_id)
      const borrower = profiles.find(p => p.id === req.borrower_id)
      return {
        ...req,
        resource,
        borrower
      }
    })
  },

  createRequest({ resource_id, borrower_id, start_date, end_date, message }) {
    const resource = this.getResourceById(resource_id)
    if (!resource) throw new Error('Resource not found')

    // Rule: Cannot borrow own item
    if (resource.owner_id === borrower_id) {
      throw new Error('You cannot submit a borrow request for your own resource.')
    }

    // Rule: Date validation
    if (start_date > end_date) {
      throw new Error('Start date must be before or equal to the end date.')
    }

    // Check date bounds of availability
    if (resource.available_from && start_date < resource.available_from) {
      throw new Error(`This item is only available starting ${resource.available_from}.`)
    }
    if (resource.available_to && end_date > resource.available_to) {
      throw new Error(`This item is only available until ${resource.available_to}.`)
    }

    // Check overlapping existing confirmed or active reservations
    const reservations = this.getReservations()
    const hasConflict = reservations.some(resv =>
      resv.resource_id === resource_id &&
      (resv.status === 'confirmed' || resv.status === 'active') &&
      isDateOverlap(start_date, end_date, resv.start_date, resv.end_date)
    )

    if (hasConflict) {
      throw new Error('Scheduling conflict: This item already has a confirmed reservation during these dates.')
    }

    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const newRequest = {
      id: `req-${Date.now()}`,
      resource_id,
      borrower_id,
      start_date,
      end_date,
      message,
      status: 'pending',
      response_note: null,
      created_at: getTodayString()
    }

    requests.unshift(newRequest)
    setStored(STORAGE_KEYS.REQUESTS, requests)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return newRequest
  },

  approveRequest(requestId, responseNote = '') {
    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const reqIndex = requests.findIndex(r => r.id === requestId)
    if (reqIndex === -1) throw new Error('Request not found')

    const req = requests[reqIndex]
    const resource = this.getResourceById(req.resource_id)
    if (!resource) throw new Error('Resource not found')

    // Check if dates conflict with an already confirmed reservation
    const reservations = getStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS)
    const conflict = reservations.some(resv =>
      resv.resource_id === req.resource_id &&
      (resv.status === 'confirmed' || resv.status === 'active') &&
      isDateOverlap(req.start_date, req.end_date, resv.start_date, resv.end_date)
    )

    if (conflict) {
      throw new Error('Cannot approve: Overlaps with an already confirmed reservation for this item.')
    }

    // 1. Mark request approved
    requests[reqIndex] = {
      ...req,
      status: 'approved',
      response_note: responseNote || 'Request approved! Please coordinate pickup details.'
    }
    setStored(STORAGE_KEYS.REQUESTS, requests)

    // 2. Create Confirmed Reservation
    const newReservation = {
      id: `resv-${Date.now()}`,
      request_id: req.id,
      resource_id: req.resource_id,
      borrower_id: req.borrower_id,
      owner_id: resource.owner_id,
      start_date: req.start_date,
      end_date: req.end_date,
      actual_return_date: null,
      status: 'confirmed',
      notes: responseNote || 'Pickup confirmed by owner',
      created_at: getTodayString()
    }
    reservations.unshift(newReservation)
    setStored(STORAGE_KEYS.RESERVATIONS, reservations)

    // 3. Mark resource status as borrowed if start_date is today or passed
    const today = getTodayString()
    if (req.start_date <= today && req.end_date >= today) {
      const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
      const resIndex = resources.findIndex(r => r.id === req.resource_id)
      if (resIndex !== -1) {
        resources[resIndex].status = 'borrowed'
        setStored(STORAGE_KEYS.RESOURCES, resources)
      }
    }

    // 4. Automatically reject any other pending requests that now conflict!
    for (let i = 0; i < requests.length; i++) {
      if (
        requests[i].id !== requestId &&
        requests[i].resource_id === req.resource_id &&
        requests[i].status === 'pending' &&
        isDateOverlap(requests[i].start_date, requests[i].end_date, req.start_date, req.end_date)
      ) {
        requests[i].status = 'rejected'
        requests[i].response_note = 'Automatically declined due to conflicting confirmed reservation.'
      }
    }
    setStored(STORAGE_KEYS.REQUESTS, requests)

    window.dispatchEvent(new Event('snrsas_data_changed'))
    return { request: requests[reqIndex], reservation: newReservation }
  },

  rejectRequest(requestId, responseNote = 'Sorry, not available at this time.') {
    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const idx = requests.findIndex(r => r.id === requestId)
    if (idx === -1) throw new Error('Request not found')

    requests[idx] = {
      ...requests[idx],
      status: 'rejected',
      response_note: responseNote
    }
    setStored(STORAGE_KEYS.REQUESTS, requests)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return requests[idx]
  },

  // ---------------- RESERVATIONS & RETURNS ----------------
  getReservations() {
    this.init()
    const reservations = getStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS)
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const profiles = this.getProfiles()
    const ratings = this.getRatings()
    const today = getTodayString()

    return reservations.map(resv => {
      const resource = resources.find(r => r.id === resv.resource_id)
      const borrower = profiles.find(p => p.id === resv.borrower_id)
      const owner = profiles.find(p => p.id === resv.owner_id)

      // Calculate overdue flag
      const overdue = isOverdue(resv.end_date, resv.status, resv.actual_return_date)
      const dynamicStatus = overdue && resv.status !== 'returned' ? 'overdue' : resv.status

      // Check if user has rated this transaction
      const hasRated = ratings.some(r => r.reservation_id === resv.id)

      return {
        ...resv,
        status: dynamicStatus,
        is_overdue: overdue,
        resource,
        borrower,
        owner,
        has_rated: hasRated
      }
    })
  },

  markAsReturned(reservationId, returnNotes = 'Item returned in good condition') {
    const reservations = getStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS)
    const idx = reservations.findIndex(r => r.id === reservationId)
    if (idx === -1) throw new Error('Reservation not found')

    const resv = reservations[idx]
    const today = getTodayString()

    reservations[idx] = {
      ...resv,
      status: 'returned',
      actual_return_date: today,
      notes: returnNotes
    }
    setStored(STORAGE_KEYS.RESERVATIONS, reservations)

    // Mark resource status back to 'available' if no other active reservation today
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const rIdx = resources.findIndex(r => r.id === resv.resource_id)
    if (rIdx !== -1) {
      resources[rIdx].status = 'available'
      setStored(STORAGE_KEYS.RESOURCES, resources)
    }

    window.dispatchEvent(new Event('snrsas_data_changed'))
    return reservations[idx]
  },

  // ---------------- RATINGS ----------------
  getRatings() {
    this.init()
    const ratings = getStored(STORAGE_KEYS.RATINGS, INITIAL_RATINGS)
    const profiles = this.getProfiles()
    return ratings.map(r => ({
      ...r,
      reviewer: profiles.find(p => p.id === r.reviewer_id)
    }))
  },

  createRating({ reservation_id, resource_id, reviewer_id, reviewee_id, score, comment }) {
    const ratings = getStored(STORAGE_KEYS.RATINGS, INITIAL_RATINGS)

    // Rule: Duplicate prevention
    const exists = ratings.some(
      r => r.reservation_id === reservation_id && r.reviewer_id === reviewer_id
    )
    if (exists) {
      throw new Error('You have already submitted a rating for this completed transaction.')
    }

    const newRating = {
      id: `rate-${Date.now()}`,
      reservation_id,
      resource_id,
      reviewer_id,
      reviewee_id,
      score: Number(score),
      comment: comment || '',
      created_at: getTodayString()
    }

    ratings.unshift(newRating)
    setStored(STORAGE_KEYS.RATINGS, ratings)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return newRating
  },

  // ---------------- REPORTS ----------------
  getReports() {
    this.init()
    const reports = getStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS)
    const profiles = this.getProfiles()
    const resources = this.getResources()

    return reports.map(rep => ({
      ...rep,
      reporter: profiles.find(p => p.id === rep.reporter_id),
      reported_user: profiles.find(p => p.id === rep.reported_user_id),
      resource: resources.find(r => r.id === rep.resource_id)
    }))
  },

  createReport({ reporter_id, resource_id, reported_user_id, reason, description }) {
    const reports = getStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS)
    const newReport = {
      id: `rep-${Date.now()}`,
      reporter_id,
      resource_id: resource_id || null,
      reported_user_id: reported_user_id || null,
      reason,
      description,
      status: 'open',
      admin_notes: '',
      created_at: getTodayString()
    }
    reports.unshift(newReport)
    setStored(STORAGE_KEYS.REPORTS, reports)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return newReport
  },

  updateReportStatus(reportId, status, adminNotes = '') {
    const reports = getStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS)
    const idx = reports.findIndex(r => r.id === reportId)
    if (idx === -1) throw new Error('Report not found')

    reports[idx] = {
      ...reports[idx],
      status,
      admin_notes: adminNotes || reports[idx].admin_notes
    }
    setStored(STORAGE_KEYS.REPORTS, reports)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return reports[idx]
  }
}
