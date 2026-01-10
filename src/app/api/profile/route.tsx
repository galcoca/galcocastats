import { getLast31DaysStats } from '@/lib/github/client'
import { renderToSvg } from '@/lib/satori/renderer'
import { DeveloperProfileCard } from '@/lib/satori/cards/developer-profile'
import { getTheme } from '@/lib/themes'
import { getCacheHeaders } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeName = searchParams.get('theme') || 'radical'
    const theme = getTheme(themeName)

    // Get all stats from the last 31 days
    const last31Days = await getLast31DaysStats()

    const stats = {
      commits: last31Days.commits,
      prs: last31Days.prs,
      issues: last31Days.issues,
      reviews: last31Days.reviews,
      contributedTo: last31Days.contributedTo,
      activeDays: last31Days.activeDays,
      currentStreak: last31Days.currentStreak,
      avgCommitsPerDay: last31Days.avgCommitsPerDay,
      avgPRsPerWeek: last31Days.avgPRsPerWeek,
    }

    const svg = await renderToSvg(
      <DeveloperProfileCard stats={stats} theme={theme} />,
      { width: 900, height: 260, theme }
    )

    return new Response(svg, { headers: getCacheHeaders() })
  } catch (error) {
    console.error('Profile API error:', error)
    return new Response(`Error: ${error}`, { status: 500 })
  }
}
