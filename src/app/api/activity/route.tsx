import { getActivityData } from '@/lib/github/client'
import { renderToSvg } from '@/lib/satori/renderer'
import { ActivityCard } from '@/lib/satori/cards/activity'
import { getTheme } from '@/lib/themes'
import { getCacheHeaders } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeName = searchParams.get('theme') || 'radical'
    const theme = getTheme(themeName)

    const activity = await getActivityData()

    const svg = await renderToSvg(
      <ActivityCard activity={activity} theme={theme} />,
      { width: 900, height: 320, theme }
    )

    return new Response(svg, { headers: getCacheHeaders() })
  } catch (error) {
    console.error('Activity API error:', error)
    return new Response(`Error: ${error}`, { status: 500 })
  }
}
