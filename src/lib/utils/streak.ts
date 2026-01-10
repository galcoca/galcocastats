import type { ContributionDay, StreakStats } from '@/lib/github/types'

// Get ISO week number
function getWeekNumber(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { year: d.getUTCFullYear(), week: weekNo }
}

// Get week key for grouping
function getWeekKey(date: Date): string {
  const { year, week } = getWeekNumber(date)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

// Get the Monday of a given week
function getWeekStart(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4)
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7)
  return monday
}

export function calculateStreaks(contributionDays: ContributionDay[]): StreakStats {
  if (contributionDays.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
      currentStreakStart: null,
      currentStreakEnd: null,
      longestStreakStart: null,
      longestStreakEnd: null,
    }
  }

  // Group contributions by week
  const weekMap = new Map<string, { contributions: number; firstDay: string; lastDay: string }>()
  let totalContributions = 0

  for (const day of contributionDays) {
    totalContributions += day.contributionCount
    const weekKey = getWeekKey(new Date(day.date))

    const existing = weekMap.get(weekKey)
    if (existing) {
      existing.contributions += day.contributionCount
      if (day.date < existing.firstDay) {
        existing.firstDay = day.date
      }
      if (day.date > existing.lastDay) {
        existing.lastDay = day.date
      }
    } else {
      weekMap.set(weekKey, {
        contributions: day.contributionCount,
        firstDay: day.date,
        lastDay: day.date,
      })
    }
  }

  // Sort weeks chronologically
  const sortedWeeks = Array.from(weekMap.entries())
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => a.key.localeCompare(b.key))

  // Filter weeks with at least 1 contribution
  const activeWeeks = sortedWeeks.filter(w => w.contributions > 0)

  if (activeWeeks.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions,
      currentStreakStart: null,
      currentStreakEnd: null,
      longestStreakStart: null,
      longestStreakEnd: null,
    }
  }

  // Calculate longest streak (consecutive weeks)
  let longestStreak = 0
  let longestStreakStart: string | null = null
  let longestStreakEnd: string | null = null
  let tempStreak = 1
  let tempStartWeek = activeWeeks[0]

  for (let i = 1; i < activeWeeks.length; i++) {
    const prevWeek = activeWeeks[i - 1].key
    const currWeek = activeWeeks[i].key

    // Parse week keys and get Monday dates to compare
    const [prevYear, prevW] = prevWeek.split('-W').map(Number)
    const [currYear, currW] = currWeek.split('-W').map(Number)

    const prevMonday = getWeekStart(prevYear, prevW)
    const currMonday = getWeekStart(currYear, currW)

    // Check if consecutive (exactly 7 days apart)
    const daysDiff = (currMonday.getTime() - prevMonday.getTime()) / (1000 * 60 * 60 * 24)
    const isConsecutive = daysDiff === 7

    if (isConsecutive) {
      tempStreak++
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
        longestStreakStart = tempStartWeek.firstDay
        longestStreakEnd = activeWeeks[i - 1].lastDay
      }
      tempStreak = 1
      tempStartWeek = activeWeeks[i]
    }
  }

  // Check last streak
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak
    longestStreakStart = tempStartWeek.firstDay
    longestStreakEnd = activeWeeks[activeWeeks.length - 1].lastDay
  }

  // Calculate current streak (from current week backwards)
  const today = new Date()
  const currentWeekKey = getWeekKey(today)
  getWeekNumber(today) // Used for week key calculation

  let currentStreak = 0
  let currentStreakStart: string | null = null
  let currentStreakEnd: string | null = null

  // Check if current week or last week has contributions
  const lastWeekDate = new Date(today)
  lastWeekDate.setDate(lastWeekDate.getDate() - 7)
  const lastWeekKey = getWeekKey(lastWeekDate)

  const currentWeekData = weekMap.get(currentWeekKey)
  const lastWeekData = weekMap.get(lastWeekKey)

  let startWeekKey: string | null = null
  if (currentWeekData && currentWeekData.contributions > 0) {
    startWeekKey = currentWeekKey
    currentStreakEnd = currentWeekData.lastDay
  } else if (lastWeekData && lastWeekData.contributions > 0) {
    startWeekKey = lastWeekKey
    currentStreakEnd = lastWeekData.lastDay
  }

  if (startWeekKey) {
    // Count backwards from start week
    let checkYear = parseInt(startWeekKey.split('-W')[0])
    let checkWeek = parseInt(startWeekKey.split('-W')[1])

    while (true) {
      const checkKey = `${checkYear}-W${checkWeek.toString().padStart(2, '0')}`
      const weekData = weekMap.get(checkKey)

      if (weekData && weekData.contributions > 0) {
        currentStreak++
        currentStreakStart = weekData.firstDay

        // Go to previous week
        checkWeek--
        if (checkWeek < 1) {
          checkYear--
          checkWeek = 52
        }
      } else {
        break
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalContributions,
    currentStreakStart,
    currentStreakEnd,
    longestStreakStart,
    longestStreakEnd,
  }
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) {
    return 'N/A'
  }

  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) {
    return 'N/A'
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  const startOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const endOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }

  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', startOptions)} - ${endDate.toLocaleDateString('en-US', endOptions)}`
  }

  return `${startDate.toLocaleDateString('en-US', endOptions)} - ${endDate.toLocaleDateString('en-US', endOptions)}`
}
