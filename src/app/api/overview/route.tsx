import { getStreakStats, getCodeQualityStats, getExperienceStats } from '@/lib/github/client'
import { renderToSvg } from '@/lib/satori/renderer'
import { OverviewCard } from '@/lib/satori/cards/overview'
import { getTheme } from '@/lib/themes'
import { getCacheHeaders } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeName = searchParams.get('theme') || 'radical'
    const theme = getTheme(themeName)

    const streak = await getStreakStats()
    const [codeQuality, experience] = await Promise.all([
      getCodeQualityStats(streak.currentStreak),
      getExperienceStats(),
    ])

    const stats = {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalContributions: streak.totalContributions,
      mergeRate: codeQuality.mergeRate,
      activeProjects: experience.activeProjects,
      currentStreakStart: streak.currentStreakStart,
    }

    const svg = await renderToSvg(
      <OverviewCard stats={stats} theme={theme} />,
      { width: 900, height: 260, theme }
    )

    return new Response(svg, { headers: getCacheHeaders() })
  } catch (error) {
    console.error('Overview API error:', error)
    return new Response(`Error: ${error}`, { status: 500 })
  }
}
