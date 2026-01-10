import { getLanguageStats, getDevOpsIndicators } from '@/lib/github/client'
import { renderToSvg } from '@/lib/satori/renderer'
import { TechSkillsCard } from '@/lib/satori/cards/tech-skills'
import { getTheme } from '@/lib/themes'
import { getCacheHeaders } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeName = searchParams.get('theme') || 'radical'
    const theme = getTheme(themeName)

    const [languages, devops] = await Promise.all([getLanguageStats(), getDevOpsIndicators()])

    const svg = await renderToSvg(
      <TechSkillsCard languages={languages} devops={devops} theme={theme} />,
      { width: 900, height: 340, theme }
    )

    return new Response(svg, { headers: getCacheHeaders() })
  } catch (error) {
    console.error('Tech Skills API error:', error)
    return new Response(`Error: ${error}`, { status: 500 })
  }
}
