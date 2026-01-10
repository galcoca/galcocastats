import { Card, ProgressRing } from '../renderer'
import type { Theme } from '@/lib/themes'

interface OverviewStats {
  currentStreak: number
  longestStreak: number
  totalContributions: number
  mergeRate: number
  activeProjects: number
  currentStreakStart: string | null
}

const FireIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill={color}>
    <path d="M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.788 2.788 0 01-1.436-.874A3.21 3.21 0 003 10c0 2.53 2.164 4.5 4.998 4.5z"/>
  </svg>
)

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function OverviewCard({ stats, theme }: { stats: OverviewStats; theme: Theme }) {
  const maxStreak = Math.max(stats.longestStreak, 52)
  const progress = Math.min(stats.currentStreak / maxStreak, 1)
  const mergeRateColor = stats.mergeRate >= 90 ? '#10b981' : stats.mergeRate >= 70 ? '#f59e0b' : '#ef4444'

  return (
    <Card theme={theme} width={900} height={260}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 3 Columns */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: theme.accent }}>
                {stats.totalContributions.toLocaleString()}
              </div>
              <div style={{ display: 'flex', fontSize: 14, color: theme.dates }}>
                Total Contributions
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: theme.sideNums }}>
                {stats.longestStreak}
              </div>
              <div style={{ display: 'flex', fontSize: 14, color: theme.dates }}>
                Longest Streak
              </div>
            </div>
          </div>

          {/* Center - Progress Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProgressRing
              progress={progress}
              size={130}
              strokeWidth={12}
              color={theme.ring}
              bgColor={theme.border}
            >
              <div style={{ display: 'flex' }}>
                <FireIcon color={theme.fire} />
              </div>
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: theme.currStreak, marginTop: 2 }}>
                {stats.currentStreak}
              </div>
              <div style={{ display: 'flex', fontSize: 12, color: theme.dates }}>
                weeks
              </div>
            </ProgressRing>
            {stats.currentStreakStart && (
              <div style={{ display: 'flex', fontSize: 12, color: theme.dates, marginTop: 10 }}>
                Since {formatDate(stats.currentStreakStart)}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: mergeRateColor }}>
                {stats.mergeRate.toFixed(0)}%
              </div>
              <div style={{ display: 'flex', fontSize: 14, color: theme.dates }}>
                Merge Rate
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: theme.sideNums }}>
                {stats.activeProjects}
              </div>
              <div style={{ display: 'flex', fontSize: 14, color: theme.dates }}>
                Active Projects
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
