export interface GitHubUser {
  name: string | null
  login: string
  followers: {
    totalCount: number
  }
  repositories: {
    totalCount: number
    nodes: Array<{
      stargazerCount: number
      primaryLanguage: {
        name: string
        color: string
      } | null
      languages?: {
        edges: Array<{
          size: number
          node: {
            name: string
            color: string
          }
        }>
      }
    }>
  }
  contributionsCollection: {
    totalCommitContributions: number
    restrictedContributionsCount: number
    totalIssueContributions: number
    totalPullRequestContributions: number
    totalPullRequestReviewContributions: number
    contributionCalendar?: {
      totalContributions: number
      weeks: Array<{
        contributionDays: ContributionDay[]
      }>
    }
  }
  pullRequests: {
    totalCount: number
  }
  issues: {
    totalCount: number
  }
}

export interface ContributionDay {
  date: string
  contributionCount: number
  weekday: number
}

export interface ProfileStats {
  name: string
  username: string
  totalStars: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  followers: number
  contributedTo: number
}

export interface LanguageStats {
  name: string
  color: string
  size: number
  percentage: number
}

export interface StreakStats {
  currentStreak: number
  longestStreak: number
  totalContributions: number
  currentStreakStart: string | null
  currentStreakEnd: string | null
  longestStreakStart: string | null
  longestStreakEnd: string | null
}

export interface ActivityData {
  date: string
  count: number
}

export interface ProductiveTimeData {
  hour: number
  day: number
  count: number
}

export interface CommitNode {
  committedDate: string
}

export interface CodeQualityStats {
  mergedPRs: number
  openPRs: number
  closedPRs: number
  mergeRate: number
  codeReviews: number
  streakWeeks: number
}

export interface ExperienceStats {
  activeProjects: number
  totalPRs: number
  totalCommits: number
  totalIssues: number
  closedIssues: number
}

export interface ProductivityStats {
  avgCommitsPerWeek: number
  avgPRsPerMonth: number
  activeDaysPercent: number
  totalWeeksActive: number
}

export interface ProfessionalSummary {
  streakWeeks: number
  mergeRate: number
  activeProjects: number
  totalContributions: number
}
