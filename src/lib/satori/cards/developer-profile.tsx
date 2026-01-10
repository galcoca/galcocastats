import { Card } from '../renderer'
import { withOpacity } from '@/lib/themes'
import type { Theme } from '@/lib/themes'

interface DeveloperStats {
  commits: number
  prs: number
  issues: number
  reviews: number
  contributedTo: number
  activeDays: number
  currentStreak: number
  avgCommitsPerDay: number
  avgPRsPerWeek: number
}

const CodeIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill={color}>
    <path d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"/>
  </svg>
)

const PRIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill={color}>
    <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z"/>
  </svg>
)

const IssueIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill={color}>
    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
    <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
  </svg>
)

const ReviewIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
    <path d="M1.5 2.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-3.5a.75.75 0 00-.53.22L3.5 11.44V9.25a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-5.5zM1.75 1A1.75 1.75 0 000 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.457 1.457 0 002.487 1.03L7.061 10h3.189A1.75 1.75 0 0012 8.25v-5.5A1.75 1.75 0 0010.25 1h-8.5z"/>
  </svg>
)

const FlameIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill={color}>
    <path d="M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.788 2.788 0 01-1.436-.874A3.21 3.21 0 003 10c0 2.53 2.164 4.5 4.998 4.5z"/>
  </svg>
)

const ContribIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
  </svg>
)

function getMonthlyRank(stats: DeveloperStats): { rank: string; color: string; score: number } {
  // Monthly score: commits + PRs*3 + reviews*2 + issues*2 + contributedTo*5
  const score = Math.round(
    stats.commits * 1 +
    stats.prs * 3 +
    stats.reviews * 2 +
    stats.issues * 2 +
    stats.contributedTo * 5
  )

  if (score >= 200) return { rank: 'S+', color: '#FFD700', score }
  if (score >= 150) return { rank: 'S', color: '#FFA500', score }
  if (score >= 100) return { rank: 'A+', color: '#FF6B6B', score }
  if (score >= 70) return { rank: 'A', color: '#4ECDC4', score }
  if (score >= 50) return { rank: 'B+', color: '#45B7D1', score }
  if (score >= 30) return { rank: 'B', color: '#96CEB4', score }
  if (score >= 15) return { rank: 'C', color: '#A8E6CF', score }
  return { rank: 'D', color: '#888888', score }
}

export function DeveloperProfileCard({ stats, theme }: { stats: DeveloperStats; theme: Theme }) {
  const { rank, color: rankColor, score } = getMonthlyRank(stats)

  return (
    <Card theme={theme} width={900} height={260}>
      <div style={{ display: 'flex', height: '100%', gap: 30 }}>
        {/* Left - Monthly Score */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 130,
          borderRight: `1px solid ${withOpacity(theme.border, 0.19)}`,
          paddingRight: 30,
        }}>
          <div style={{ display: 'flex', fontSize: 12, color: theme.dates, marginBottom: 8 }}>
            LAST 31 DAYS
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 85,
            height: 85,
            borderRadius: 50,
            background: `${rankColor}20`,
            border: `4px solid ${rankColor}`,
          }}>
            <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: rankColor }}>
              {rank}
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 14, color: theme.accent, marginTop: 8 }}>
            {score} pts
          </div>
        </div>

        {/* Right - 3 Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          {/* Row 1 - Main Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', marginBottom: 6 }}>
                <CodeIcon color={theme.accent} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: theme.title }}>
                {stats.commits}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>Commits</div>
              <div style={{ display: 'flex', fontSize: 12, color: theme.accent }}>~{stats.avgCommitsPerDay}/day</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', marginBottom: 6 }}>
                <PRIcon color={theme.accent} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: theme.title }}>
                {stats.prs}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>Pull Requests</div>
              <div style={{ display: 'flex', fontSize: 12, color: theme.accent }}>~{stats.avgPRsPerWeek}/week</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', marginBottom: 6 }}>
                <IssueIcon color={theme.accent} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: theme.title }}>
                {stats.issues}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>Issues</div>
            </div>
          </div>

          {/* Divider 1 */}
          <div style={{ display: 'flex', height: 1, background: withOpacity(theme.border, 0.19), margin: '14px 0' }} />

          {/* Row 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', marginBottom: 6 }}>
                <ReviewIcon color={theme.accent} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: theme.title }}>
                {stats.reviews}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>Reviews</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', marginBottom: 6 }}>
                <ContribIcon color={theme.accent} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: theme.title }}>
                {stats.contributedTo}
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>Repos</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', marginBottom: 6 }}>
                <FlameIcon color={theme.fire || '#f97316'} />
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: theme.title }}>
                {stats.activeDays}/31
              </div>
              <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>Active Days</div>
            </div>
          </div>

        </div>
      </div>
    </Card>
  )
}
