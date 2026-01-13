import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import {
  PROFILE_STATS_QUERY,
  LANGUAGES_QUERY,
  CONTRIBUTION_CALENDAR_QUERY,
  CONTRIBUTION_YEARS_QUERY,
  USER_REPOS_QUERY,
  COMMIT_TIMES_QUERY,
} from './queries'
import type {
  GitHubUser,
  ProfileStats,
  LanguageStats,
  ContributionDay,
  ActivityData,
  CodeQualityStats,
  ExperienceStats,
  ProductivityStats,
  ProfessionalSummary,
  StreakStats,
} from './types'

import { calculateStreaks } from '@/lib/utils/streak'

dayjs.extend(utc)
dayjs.extend(timezone)

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql'

async function fetchGitHub<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN is not set')
  }

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 86400 }, // Cache for 24 hours
  })

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GitHub API error')
  }

  return json.data
}

export async function getProfileStats(): Promise<ProfileStats> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{ user: GitHubUser }>(PROFILE_STATS_QUERY, {
    login: username,
  })

  const user = data.user
  const totalStars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0)

  return {
    name: user.name || user.login,
    username: user.login,
    totalStars,
    totalCommits:
      user.contributionsCollection.totalCommitContributions +
      user.contributionsCollection.restrictedContributionsCount,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    followers: user.followers.totalCount,
    contributedTo: user.contributionsCollection.totalPullRequestContributions,
  }
}

export async function getLanguageStats(): Promise<LanguageStats[]> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: { repositoriesContributedTo: GitHubUser['repositories'] }
  }>(LANGUAGES_QUERY, { login: username })

  const languageMap = new Map<string, { size: number; color: string }>()

  for (const repo of data.user.repositoriesContributedTo.nodes) {
    if (repo.languages?.edges) {
      for (const edge of repo.languages.edges) {
        const existing = languageMap.get(edge.node.name)
        if (existing) {
          existing.size += edge.size
        } else {
          languageMap.set(edge.node.name, {
            size: edge.size,
            color: edge.node.color || '#858585',
          })
        }
      }
    }
  }

  const languages = Array.from(languageMap.entries())
    .map(([name, data]) => ({ name, ...data, percentage: 0 }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 6)

  const totalSize = languages.reduce((sum, lang) => sum + lang.size, 0)

  return languages.map(lang => ({
    ...lang,
    percentage: totalSize > 0 ? (lang.size / totalSize) * 100 : 0,
  }))
}

export async function getContributionCalendar(from: Date, to: Date): Promise<ContributionDay[]> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: {
      contributionsCollection: GitHubUser['contributionsCollection']
    }
  }>(CONTRIBUTION_CALENDAR_QUERY, {
    login: username,
    from: from.toISOString(),
    to: to.toISOString(),
  })

  const days: ContributionDay[] = []
  const calendar = data.user.contributionsCollection.contributionCalendar

  if (calendar) {
    for (const week of calendar.weeks) {
      days.push(...week.contributionDays)
    }
  }

  return days
}

export async function getContributionYears(): Promise<number[]> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: { contributionsCollection: { contributionYears: number[] } }
  }>(CONTRIBUTION_YEARS_QUERY, { login: username })

  return data.user.contributionsCollection.contributionYears
}

export async function getActivityData(): Promise<{
  activity: ActivityData[]
  currentMonthDays: number
  previousMonthSameDays: number
  comparedToDate: string
  last12Months: { month: number; year: number; total: number }[]
}> {
  // Use Colombia timezone (GMT-5) for date boundaries
  const nowColombia = dayjs().tz('America/Bogota')
  const todayColombia = nowColombia.format('YYYY-MM-DD')
  const fromColombia = nowColombia.subtract(30, 'day').format('YYYY-MM-DD')

  // Current month boundaries (1st to today)
  const currentMonthStart = nowColombia.startOf('month').format('YYYY-MM-DD')

  // Previous month same days (1st to same day of previous month)
  const previousMonthStart = nowColombia.subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
  const previousMonthSameDay = nowColombia.subtract(1, 'month').format('YYYY-MM-DD')

  // 11 months ago for best month calculation (to stay within GitHub's 1 year limit)
  const twelveMonthsAgo = nowColombia.subtract(11, 'month').startOf('month').format('YYYY-MM-DD')

  // Fetch ~12 months (staying within GitHub's 1 year limit)
  const from = nowColombia.subtract(11, 'month').startOf('month').toDate()
  const to = nowColombia.add(1, 'day').toDate()

  const days = await getContributionCalendar(from, to)

  // Current period (last 31 days for the graph)
  const activity = days
    .filter(day => day.date >= fromColombia && day.date <= todayColombia)
    .map(day => ({
      date: day.date,
      count: day.contributionCount,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Current month contributions (1st to today)
  const currentMonthDays = days
    .filter(day => day.date >= currentMonthStart && day.date <= todayColombia)
    .reduce((sum, day) => sum + day.contributionCount, 0)

  // Previous month same days (1st to same day number)
  const previousMonthSameDays = days
    .filter(day => day.date >= previousMonthStart && day.date <= previousMonthSameDay)
    .reduce((sum, day) => sum + day.contributionCount, 0)

  // Calculate monthly totals for last 12 months
  const monthlyTotals: Record<string, { month: number; year: number; total: number }> = {}
  for (const day of days.filter(d => d.date >= twelveMonthsAgo && d.date <= todayColombia)) {
    const [year, month] = day.date.split('-').map(Number)
    const key = `${year}-${month}`
    if (!monthlyTotals[key]) {
      monthlyTotals[key] = { month, year, total: 0 }
    }
    monthlyTotals[key].total += day.contributionCount
  }

  const last12Months = Object.values(monthlyTotals).sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year
    }
    return a.month - b.month
  })

  // Format compared to date (e.g., "December 13")
  const prevMonth = nowColombia.subtract(1, 'month')
  const comparedToDate = `${prevMonth.format('MMMM')} ${prevMonth.date()}`

  return { activity, currentMonthDays, previousMonthSameDays, comparedToDate, last12Months }
}

export async function getActiveDaysThisYear(): Promise<{
  activeDays: number
  totalDays: number
}> {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const days = await getContributionCalendar(startOfYear, now)
  const activeDays = days.filter(d => d.contributionCount > 0).length

  // Days elapsed this year
  const totalDays = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return { activeDays, totalDays }
}

export async function getCommitTimes(): Promise<{ hour: number; day: number }[]> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  // First get user's repos
  const reposData = await fetchGitHub<{
    user: {
      repositories: {
        nodes: Array<{ name: string; owner: { login: string } }>
      }
    }
  }>(USER_REPOS_QUERY, { login: username })

  const commits: { hour: number; day: number }[] = []

  // Fetch commits from top 5 repos
  for (const repo of reposData.user.repositories.nodes.slice(0, 5)) {
    try {
      const commitData = await fetchGitHub<{
        repository: {
          defaultBranchRef: {
            target: {
              history: {
                nodes: Array<{
                  committedDate: string
                  author: {
                    user: { login: string } | null
                  } | null
                }>
              }
            }
          } | null
        } | null
      }>(COMMIT_TIMES_QUERY, {
        login: username,
        owner: repo.owner.login,
        name: repo.name,
      })

      const history = commitData.repository?.defaultBranchRef?.target?.history?.nodes
      if (history) {
        for (const commit of history) {
          if (commit.author?.user?.login === username) {
            const date = new Date(commit.committedDate)
            commits.push({
              hour: date.getUTCHours(),
              day: date.getUTCDay(),
            })
          }
        }
      }
    } catch {
      // Skip repos that fail
    }
  }

  return commits
}

export async function getCodeQualityStats(streakDays: number): Promise<CodeQualityStats> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 31)

  const data = await fetchGitHub<{
    user: {
      mergedPRs: { totalCount: number }
      openPRs: { totalCount: number }
      closedPRs: { totalCount: number }
      contributionsCollection: {
        totalPullRequestReviewContributions: number
        totalPullRequestContributions: number
      }
    }
  }>(
    `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        mergedPRs: pullRequests(states: [MERGED]) { totalCount }
        openPRs: pullRequests(states: [OPEN]) { totalCount }
        closedPRs: pullRequests(states: [CLOSED]) { totalCount }
        contributionsCollection(from: $from, to: $to) {
          totalPullRequestReviewContributions
          totalPullRequestContributions
        }
      }
    }
  `,
    { login: username, from: from.toISOString(), to: to.toISOString() }
  )

  const merged = data.user.mergedPRs.totalCount
  const closed = data.user.closedPRs.totalCount
  const total = merged + closed

  return {
    mergedPRs: data.user.contributionsCollection.totalPullRequestContributions,
    openPRs: data.user.openPRs.totalCount,
    closedPRs: closed,
    mergeRate: total > 0 ? (merged / total) * 100 : 0,
    codeReviews: data.user.contributionsCollection.totalPullRequestReviewContributions,
    streakWeeks: Math.floor(streakDays / 7),
  }
}

export async function getExperienceStats(): Promise<ExperienceStats> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: {
      repositoriesContributedTo: { totalCount: number }
      pullRequests: { totalCount: number }
      contributionsCollection: {
        totalCommitContributions: number
        restrictedContributionsCount: number
      }
      openIssues: { totalCount: number }
      closedIssues: { totalCount: number }
    }
  }>(
    `
    query($login: String!) {
      user(login: $login) {
        repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST]) {
          totalCount
        }
        pullRequests { totalCount }
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
        }
        openIssues: issues(states: [OPEN]) { totalCount }
        closedIssues: issues(states: [CLOSED]) { totalCount }
      }
    }
  `,
    { login: username }
  )

  return {
    activeProjects: data.user.repositoriesContributedTo.totalCount,
    totalPRs: data.user.pullRequests.totalCount,
    totalCommits:
      data.user.contributionsCollection.totalCommitContributions +
      data.user.contributionsCollection.restrictedContributionsCount,
    totalIssues: data.user.openIssues.totalCount + data.user.closedIssues.totalCount,
    closedIssues: data.user.closedIssues.totalCount,
  }
}

export async function getProductivityStats(
  activeDays: { activeDays: number; totalDays: number },
  totalWeeksActive: number
): Promise<ProductivityStats> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: {
      contributionsCollection: {
        totalCommitContributions: number
        restrictedContributionsCount: number
      }
      pullRequests: { totalCount: number }
    }
  }>(
    `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
        }
        pullRequests { totalCount }
      }
    }
  `,
    { login: username }
  )

  const totalCommits =
    data.user.contributionsCollection.totalCommitContributions +
    data.user.contributionsCollection.restrictedContributionsCount
  const totalPRs = data.user.pullRequests.totalCount

  // Calculate averages based on weeks active
  const weeksActive = Math.max(totalWeeksActive, 1)
  const monthsActive = weeksActive / 4.33

  return {
    avgCommitsPerWeek: Math.round((totalCommits / weeksActive) * 10) / 10,
    avgPRsPerMonth: Math.round((totalPRs / monthsActive) * 10) / 10,
    activeDaysPercent: Math.round((activeDays.activeDays / activeDays.totalDays) * 100),
    totalWeeksActive,
  }
}

export async function getDevOpsIndicators(): Promise<{
  activeRepos: number
  codeReviews: number
  hasMultipleOrgs: boolean
  crossRepoWork: number
}> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: {
      repositoriesContributedTo: {
        totalCount: number
        nodes: Array<{ owner: { login: string } }>
      }
      contributionsCollection: {
        totalPullRequestReviewContributions: number
        totalRepositoriesWithContributedCommits: number
      }
    }
  }>(
    `
    query($login: String!) {
      user(login: $login) {
        repositoriesContributedTo(first: 50, contributionTypes: [COMMIT, PULL_REQUEST]) {
          totalCount
          nodes {
            owner { login }
          }
        }
        contributionsCollection {
          totalPullRequestReviewContributions
          totalRepositoriesWithContributedCommits
        }
      }
    }
  `,
    { login: username }
  )

  // Count unique organizations
  const orgs = new Set(data.user.repositoriesContributedTo.nodes.map(r => r.owner.login))
  orgs.delete(username) // Remove own repos

  return {
    activeRepos: data.user.repositoriesContributedTo.totalCount,
    codeReviews: data.user.contributionsCollection.totalPullRequestReviewContributions,
    hasMultipleOrgs: orgs.size > 1,
    crossRepoWork: data.user.contributionsCollection.totalRepositoriesWithContributedCommits,
  }
}

export async function getProfessionalSummary(
  streakWeeks: number,
  mergeRate: number,
  activeProjects: number
): Promise<ProfessionalSummary> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const data = await fetchGitHub<{
    user: {
      contributionsCollection: {
        totalCommitContributions: number
        restrictedContributionsCount: number
        totalPullRequestContributions: number
        totalIssueContributions: number
        totalPullRequestReviewContributions: number
      }
    }
  }>(
    `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
        }
      }
    }
  `,
    { login: username }
  )

  const cc = data.user.contributionsCollection
  const totalContributions =
    cc.totalCommitContributions +
    cc.restrictedContributionsCount +
    cc.totalPullRequestContributions +
    cc.totalIssueContributions +
    cc.totalPullRequestReviewContributions

  return {
    streakWeeks,
    mergeRate,
    activeProjects,
    totalContributions,
  }
}

export async function getStreakStats(): Promise<StreakStats> {
  const years = await getContributionYears()

  const allDays: ContributionDay[] = []

  for (const year of years) {
    const from = new Date(year, 0, 1)
    const to = new Date(year, 11, 31)
    const days = await getContributionCalendar(from, to)
    allDays.push(...days)
  }

  return calculateStreaks(allDays)
}

// Get all stats from the last 31 days
export async function getLast31DaysStats(): Promise<{
  commits: number
  prs: number
  reviews: number
  issues: number
  contributedTo: number
  activeDays: number
  currentStreak: number
  avgCommitsPerDay: number
  avgPRsPerWeek: number
}> {
  const username = process.env.GITHUB_USERNAME || 'galcoca'

  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 31)

  const data = await fetchGitHub<{
    user: {
      contributionsCollection: {
        totalCommitContributions: number
        restrictedContributionsCount: number
        totalPullRequestContributions: number
        totalPullRequestReviewContributions: number
        totalIssueContributions: number
        totalRepositoriesWithContributedCommits: number
      }
    }
  }>(
    `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          restrictedContributionsCount
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions
          totalRepositoriesWithContributedCommits
        }
      }
    }
  `,
    { login: username, from: from.toISOString(), to: to.toISOString() }
  )

  const cc = data.user.contributionsCollection
  const commits = cc.totalCommitContributions + cc.restrictedContributionsCount

  // Get contribution days for streak calculation
  const days = await getContributionCalendar(from, to)
  const activeDays = days.filter(d => d.contributionCount > 0).length

  // Calculate current streak from the last 31 days
  const sortedDays = [...days].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  let currentStreak = 0
  for (const day of sortedDays) {
    if (day.contributionCount > 0) {
      currentStreak++
    } else {
      break
    }
  }

  return {
    commits,
    prs: cc.totalPullRequestContributions,
    reviews: cc.totalPullRequestReviewContributions,
    issues: cc.totalIssueContributions,
    contributedTo: cc.totalRepositoriesWithContributedCommits,
    activeDays,
    currentStreak,
    avgCommitsPerDay: Math.round((commits / 31) * 10) / 10,
    avgPRsPerWeek: Math.round((cc.totalPullRequestContributions / 4.43) * 10) / 10,
  }
}
