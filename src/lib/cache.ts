import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Calculate seconds until next 3:00 AM Colombia time (GMT-5)
 * Cache revalidates daily at 3:00 AM
 */
export function getSecondsUntil3AM(): number {
  const now = dayjs().tz('America/Bogota')
  let next3AM = now.startOf('day').add(3, 'hour')

  // If it's already past 3:00 AM today, target tomorrow's 3:00 AM
  if (now.isAfter(next3AM)) {
    next3AM = next3AM.add(1, 'day')
  }

  const secondsUntil = next3AM.diff(now, 'second')
  return Math.max(secondsUntil, 60) // Minimum 60 seconds
}

/**
 * Get cache control headers for daily refresh at 3:00 AM Colombia
 */
export function getCacheHeaders(): HeadersInit {
  const maxAge = getSecondsUntil3AM()
  return {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=3600`,
  }
}
