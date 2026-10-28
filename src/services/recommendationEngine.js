/**
 * Rule-Based Recommendation Engine for Neighborly (SNRSAS)
 *
 * Implements deterministic matching rules based on:
 * 1. Category alignment
 * 2. Locality proximity
 * 3. Real-time availability
 *
 * (No AI / ML models used, ensuring full explainability)
 */

export function getRecommendationsForUser(user, allResources, currentResourceId = null, limit = 4) {
  if (!allResources || allResources.length === 0) return []

  const userLocality = user?.locality || 'Maplewood Heights'
  const userId = user?.id

  return allResources
    .filter(item => {
      // Exclude the current item being viewed
      if (currentResourceId && item.id === currentResourceId) return false
      // Exclude items owned by the user themselves
      if (userId && item.owner_id === userId) return false
      // Only recommend active items
      return item.status !== 'archived'
    })
    .map(item => {
      let score = 0
      let matchReasons = []

      // Category / locality weighting
      if (item.locality === userLocality) {
        score += 5
        matchReasons.push(`In your neighborhood (${item.locality})`)
      }

      if (item.status === 'available') {
        score += 3
        matchReasons.push('Available immediately')
      }

      if (item.average_rating && item.average_rating >= 4.5) {
        score += 2
        matchReasons.push(`Top rated (${item.average_rating}★)`)
      }

      return {
        ...item,
        recommendationScore: score,
        matchReasons
      }
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit)
}

/**
 * Specifically finds available alternatives when an item is unavailable / borrowed
 */
export function getAlternativesForResource(resource, allResources, limit = 3) {
  if (!resource || !allResources) return []

  return allResources
    .filter(item => {
      if (item.id === resource.id) return false
      if (item.status !== 'available') return false
      return item.category === resource.category
    })
    .map(item => {
      let score = 5
      let reason = `Same category: ${item.category}`

      if (item.locality === resource.locality) {
        score += 5
        reason = `Same neighborhood (${item.locality}) & category`
      }

      return {
        ...item,
        recommendationScore: score,
        matchReason: reason
      }
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit)
}
