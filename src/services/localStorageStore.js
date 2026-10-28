import {
  INITIAL_PROFILES,
  INITIAL_RESOURCES,
  INITIAL_REQUESTS,
  INITIAL_RESERVATIONS,
  INITIAL_RATINGS,
  INITIAL_REPORTS,
  normalizeUserId,
  normalizeResourceId
} from './mockData'
import { isDateOverlap, isOverdue, getTodayString } from '../utils/dateUtils'

const STORAGE_KEYS = {
  PROFILES: 'snrsas_demo_profiles_v4',
  RESOURCES: 'snrsas_demo_resources_v4',
  REQUESTS: 'snrsas_demo_requests_v4',
  RESERVATIONS: 'snrsas_demo_reservations_v4',
  RATINGS: 'snrsas_demo_ratings_v4',
  REPORTS: 'snrsas_demo_reports_v4',
  CURRENT_USER: 'snrsas_demo_current_user_v4'
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
    if (!id) return null
    const norm = normalizeUserId(id)
    const profiles = this.getProfiles()
    return (
      profiles.find(p => p.id === id || p.id === norm || p.legacy_id === id) ||
      INITIAL_PROFILES.find(p => p.id === id || p.id === norm || p.legacy_id === id) ||
      null
    )
  },

  createProfile(profileData) {
    const profiles = this.getProfiles()
    const newProfile = {
      id: `a${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
    const norm = normalizeUserId(id)
    const profiles = this.getProfiles()
    const idx = profiles.findIndex(p => p.id === id || p.id === norm || p.legacy_id === id)
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...data }
      setStored(STORAGE_KEYS.PROFILES, profiles)
      const currentUser = this.getCurrentUser()
      if (currentUser?.id === id || currentUser?.id === norm) {
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

    return resources.map(res => {
      const normOwnerId = normalizeUserId(res.owner_id)
      const owner =
        profiles.find(p => p.id === res.owner_id || p.id === normOwnerId || p.legacy_id === res.owner_id) || {
          id: normOwnerId,
          full_name: 'Community Neighbor',
          locality: res.locality || 'Maplewood Heights'
        }

      const itemRatings = ratings.filter(
        r => r.resource_id === res.id || normalizeResourceId(r.resource_id) === normalizeResourceId(res.id)
      )
      const avgRating = itemRatings.length > 0
        ? (itemRatings.reduce((sum, r) => sum + r.score, 0) / itemRatings.length).toFixed(1)
        : null

      const activeRes = reservations.find(
        r =>
          (r.resource_id === res.id || normalizeResourceId(r.resource_id) === normalizeResourceId(res.id)) &&
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
    if (!id) return null
    const norm = normalizeResourceId(id)
    const list = this.getResources()
    const found = list.find(r => r.id === id || r.id === norm || r.legacy_id === id)
    if (found) return found

    const seedFound = INITIAL_RESOURCES.find(r => r.id === id || r.id === norm || r.legacy_id === id)
    if (seedFound) {
      const owner = this.getProfileById(seedFound.owner_id)
      return {
        ...seedFound,
        owner: owner || { full_name: 'Community Member', locality: seedFound.locality }
      }
    }
    return list[0] || null
  },

  createResource(data, ownerId) {
    const normOwnerId = normalizeUserId(ownerId)
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const newResource = {
      id: `b${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      owner_id: normOwnerId,
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
    const normId = normalizeResourceId(id)
    const normUserId = normalizeUserId(currentUserId)
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const idx = resources.findIndex(r => r.id === id || r.id === normId || r.legacy_id === id)
    if (idx === -1) throw new Error('Resource not found')

    const user = this.getCurrentUser()
    const isAdmin = user?.role === 'admin'
    const ownerId = normalizeUserId(resources[idx].owner_id)
    if (ownerId !== normUserId && !isAdmin) {
      throw new Error('Unauthorized: You can only edit your own listings.')
    }

    resources[idx] = { ...resources[idx], ...data }
    setStored(STORAGE_KEYS.RESOURCES, resources)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return resources[idx]
  },

  deleteResource(id, currentUserId) {
    const normId = normalizeResourceId(id)
    const normUserId = normalizeUserId(currentUserId)
    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const res = resources.find(r => r.id === id || r.id === normId || r.legacy_id === id)
    if (!res) throw new Error('Resource not found')

    const user = this.getCurrentUser()
    const isAdmin = user?.role === 'admin'
    const ownerId = normalizeUserId(res.owner_id)
    if (ownerId !== normUserId && !isAdmin) {
      throw new Error('Unauthorized: You can only delete your own listings.')
    }

    const filtered = resources.filter(r => r.id !== id && r.id !== normId && r.legacy_id !== id)
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
      const normResId = normalizeResourceId(req.resource_id)
      const normBorrowerId = normalizeUserId(req.borrower_id)

      const resource =
        resources.find(r => r.id === req.resource_id || r.id === normResId || r.legacy_id === req.resource_id) ||
        INITIAL_RESOURCES.find(r => r.id === req.resource_id || r.id === normResId || r.legacy_id === req.resource_id) ||
        null

      const borrower =
        profiles.find(p => p.id === req.borrower_id || p.id === normBorrowerId || p.legacy_id === req.borrower_id) ||
        INITIAL_PROFILES.find(p => p.id === req.borrower_id || p.id === normBorrowerId || p.legacy_id === req.borrower_id) ||
        null

      return {
        ...req,
        resource,
        borrower
      }
    })
  },

  createRequest({ resource_id, borrower_id, start_date, end_date, message }) {
    const normResId = normalizeResourceId(resource_id)
    const normBorrowerId = normalizeUserId(borrower_id)

    let resource = this.getResourceById(resource_id)
    if (!resource) {
      resource = {
        id: normResId,
        title: 'Community Household Equipment',
        owner_id: 'a1111111-1111-1111-1111-111111111111',
        locality: 'Maplewood Heights',
        category: 'Tools',
        status: 'available'
      }
    }

    // Rule: Cannot borrow own item
    const normOwnerId = normalizeUserId(resource.owner_id)
    if (normOwnerId === normBorrowerId) {
      throw new Error('You cannot submit a borrow request for your own resource.')
    }

    // Rule: Date validation
    if (start_date && end_date && start_date > end_date) {
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
      (resv.resource_id === resource_id || normalizeResourceId(resv.resource_id) === normResId) &&
      (resv.status === 'confirmed' || resv.status === 'active') &&
      isDateOverlap(start_date, end_date, resv.start_date, resv.end_date)
    )

    if (hasConflict) {
      throw new Error('Scheduling conflict: This item already has a confirmed reservation during these dates.')
    }

    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const newRequest = {
      id: `c${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      resource_id: normResId,
      borrower_id: normBorrowerId,
      start_date,
      end_date,
      message: message || 'Hi! I would love to borrow this item.',
      status: 'pending',
      response_note: null,
      created_at: getTodayString()
    }

    requests.unshift(newRequest)
    setStored(STORAGE_KEYS.REQUESTS, requests)
    window.dispatchEvent(new Event('snrsas_data_changed'))
    return {
      ...newRequest,
      resource,
      borrower: this.getProfileById(normBorrowerId)
    }
  },

  approveRequest(requestId, responseNote = '') {
    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const reqIndex = requests.findIndex(r => r.id === requestId || r.legacy_id === requestId)
    if (reqIndex === -1) throw new Error('Request not found')

    const req = requests[reqIndex]
    const resource = this.getResourceById(req.resource_id) || {
      id: req.resource_id,
      owner_id: 'a1111111-1111-1111-1111-111111111111',
      title: 'Community Item'
    }

    // 1. Mark request approved
    requests[reqIndex] = {
      ...req,
      status: 'approved',
      response_note: responseNote || 'Request approved! Please coordinate pickup details.'
    }
    setStored(STORAGE_KEYS.REQUESTS, requests)

    // 2. Create Confirmed Reservation
    const reservations = getStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS)
    const newReservation = {
      id: `d${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
      const resIndex = resources.findIndex(
        r => r.id === req.resource_id || normalizeResourceId(r.id) === normalizeResourceId(req.resource_id)
      )
      if (resIndex !== -1) {
        resources[resIndex].status = 'borrowed'
        setStored(STORAGE_KEYS.RESOURCES, resources)
      }
    }

    window.dispatchEvent(new Event('snrsas_data_changed'))
    return { request: requests[reqIndex], reservation: newReservation }
  },

  rejectRequest(requestId, responseNote = 'Sorry, not available at this time.') {
    const requests = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
    const idx = requests.findIndex(r => r.id === requestId || r.legacy_id === requestId)
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

    return reservations.map(resv => {
      const normResId = normalizeResourceId(resv.resource_id)
      const normBorrowerId = normalizeUserId(resv.borrower_id)
      const normOwnerId = normalizeUserId(resv.owner_id)

      const resource =
        resources.find(r => r.id === resv.resource_id || r.id === normResId || r.legacy_id === resv.resource_id) ||
        INITIAL_RESOURCES.find(r => r.id === resv.resource_id || r.id === normResId || r.legacy_id === resv.resource_id) ||
        null

      const borrower =
        profiles.find(p => p.id === resv.borrower_id || p.id === normBorrowerId || p.legacy_id === resv.borrower_id) ||
        INITIAL_PROFILES.find(p => p.id === resv.borrower_id || p.id === normBorrowerId || p.legacy_id === resv.borrower_id) ||
        null

      const owner =
        profiles.find(p => p.id === resv.owner_id || p.id === normOwnerId || p.legacy_id === resv.owner_id) ||
        INITIAL_PROFILES.find(p => p.id === resv.owner_id || p.id === normOwnerId || p.legacy_id === resv.owner_id) ||
        null

      const overdue = isOverdue(resv.end_date, resv.status, resv.actual_return_date)
      const dynamicStatus = overdue && resv.status !== 'returned' ? 'overdue' : resv.status
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

    const resources = getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
    const rIdx = resources.findIndex(
      r => r.id === resv.resource_id || normalizeResourceId(r.id) === normalizeResourceId(resv.resource_id)
    )
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
      reviewer:
        profiles.find(p => p.id === r.reviewer_id || normalizeUserId(p.id) === normalizeUserId(r.reviewer_id)) || null
    }))
  },

  createRating({ reservation_id, resource_id, reviewer_id, reviewee_id, score, comment }) {
    const normResId = normalizeResourceId(resource_id)
    const normReviewerId = normalizeUserId(reviewer_id)
    const normRevieweeId = normalizeUserId(reviewee_id)
    const ratings = getStored(STORAGE_KEYS.RATINGS, INITIAL_RATINGS)

    const exists = ratings.some(
      r =>
        r.reservation_id === reservation_id &&
        (r.reviewer_id === reviewer_id || normalizeUserId(r.reviewer_id) === normReviewerId)
    )
    if (exists) {
      throw new Error('You have already submitted a rating for this completed transaction.')
    }

    const newRating = {
      id: `e${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      reservation_id,
      resource_id: normResId,
      reviewer_id: normReviewerId,
      reviewee_id: normRevieweeId,
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
      reporter:
        profiles.find(p => p.id === rep.reporter_id || normalizeUserId(p.id) === normalizeUserId(rep.reporter_id)) || null,
      reported_user:
        profiles.find(p => p.id === rep.reported_user_id || normalizeUserId(p.id) === normalizeUserId(rep.reported_user_id)) || null,
      resource:
        resources.find(r => r.id === rep.resource_id || normalizeResourceId(r.id) === normalizeResourceId(rep.resource_id)) || null
    }))
  },

  createReport({ reporter_id, resource_id, reported_user_id, reason, description }) {
    const reports = getStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS)
    const newReport = {
      id: `f${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      reporter_id: normalizeUserId(reporter_id),
      resource_id: resource_id ? normalizeResourceId(resource_id) : null,
      reported_user_id: reported_user_id ? normalizeUserId(reported_user_id) : null,
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
