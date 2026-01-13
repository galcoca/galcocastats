import { Card } from '../renderer'

import type { Theme } from '@/lib/themes'
import type { ActivityData } from '@/lib/github/types'

// =============================================================================
// Constants
// =============================================================================

const GRAPH_WIDTH = 680
const GRAPH_HEIGHT = 160
const PADDING = { left: 32, right: 10, top: 10, bottom: 32 }
const CHART_WIDTH = GRAPH_WIDTH - PADDING.left - PADDING.right
const CHART_HEIGHT = GRAPH_HEIGHT - PADDING.top - PADDING.bottom
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// =============================================================================
// Icons
// =============================================================================

const TrendUpIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <path d="M23 6l-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </svg>
)

const TrendDownIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <path d="M23 18l-9.5-9.5-5 5L1 6" />
    <path d="M17 18h6v-6" />
  </svg>
)

// =============================================================================
// Helpers
// =============================================================================

function parseDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month, day }
}

function formatDate(dateStr: string): string {
  const { month, day } = parseDate(dateStr)
  return `${MONTHS_SHORT[month - 1]} ${day}`
}

function calculateStats(
  activity: ActivityData[],
  currentMonthDays: number,
  previousMonthSameDays: number,
  last12Months: { month: number; year: number; total: number }[]
) {
  const maxCount = Math.max(...activity.map(d => d.count), 1)
  const totalContributions = activity.reduce((sum, d) => sum + d.count, 0)
  const avgPerDay = totalContributions / activity.length
  const activeDays = activity.filter(d => d.count > 0).length

  const bestDay = activity.reduce((best, day) => (day.count > best.count ? day : best), activity[0])
  const bestDayIndex = activity.findIndex(d => d.date === bestDay.date)

  // Get current and previous month from last12Months
  const currentMonthData = last12Months[last12Months.length - 1] || {
    total: 0,
    month: 1,
    year: 2024,
  }
  const previousMonthData = last12Months[last12Months.length - 2] || {
    total: 0,
    month: 1,
    year: 2024,
  }

  // Best month from last 12 months
  const bestMonthData = last12Months.reduce(
    (best, m) => (m.total > best.total ? m : best),
    last12Months[0] || { total: 0, month: 1, year: 2024 }
  )

  // Trend: compare current month days vs same days of previous month (equitative comparison)
  const trendPercent =
    previousMonthSameDays > 0
      ? ((currentMonthDays - previousMonthSameDays) / previousMonthSameDays) * 100
      : 0

  return {
    maxCount,
    totalContributions,
    avgPerDay,
    activeDays,
    bestDay,
    bestDayIndex,
    trendPercent,
    currentMonth: currentMonthData.total,
    previousMonth: previousMonthData.total,
    bestMonth: bestMonthData.total,
    currentMonthName: `${MONTHS_FULL[currentMonthData.month - 1]} ${currentMonthData.year}`,
    previousMonthName: `${MONTHS_FULL[previousMonthData.month - 1]} ${previousMonthData.year}`,
    bestMonthName: `${MONTHS_FULL[bestMonthData.month - 1]} ${bestMonthData.year}`,
  }
}

function generateGraphPoints(activity: ActivityData[], maxCount: number) {
  return activity.map((d, i) => ({
    x: PADDING.left + (i / (activity.length - 1)) * CHART_WIDTH,
    y: PADDING.top + CHART_HEIGHT - (d.count / maxCount) * CHART_HEIGHT,
  }))
}

function generateYLabels(maxCount: number) {
  const step = Math.max(1, Math.ceil(maxCount / 4))
  const labels: { value: number; y: number }[] = []

  for (let value = 0; value <= maxCount; value += step) {
    labels.push({
      value,
      y: PADDING.top + CHART_HEIGHT - (value / maxCount) * CHART_HEIGHT,
    })
  }

  return labels
}

// =============================================================================
// Sub-components
// =============================================================================

function Header({
  days,
  trendPercent,
  comparedToDate,
  theme,
}: {
  days: number
  trendPercent: number
  comparedToDate: string
  theme: Theme
}) {
  const isUp = trendPercent >= 0
  const color = isUp ? '#22c55e' : '#ef4444'

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ display: 'flex', fontSize: 18, fontWeight: 600, color: theme.title }}>
        Last {days} Days
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 12,
          padding: '4px 10px',
          background: `${color}20`,
          borderRadius: 6,
          gap: 4,
        }}
      >
        {isUp ? <TrendUpIcon color={color} /> : <TrendDownIcon color={color} />}
        <div style={{ display: 'flex', fontSize: 14, fontWeight: 600, color }}>
          {isUp ? '+' : ''}
          {trendPercent.toFixed(0)}%
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 11,
          color: theme.dates,
          marginLeft: 8,
        }}
      >
        compared to {comparedToDate}
      </div>
    </div>
  )
}

function Graph({
  activity,
  points,
  yLabels,
  bestDayIndex,
  avgPerDay,
  maxCount,
  theme,
}: {
  activity: ActivityData[]
  points: { x: number; y: number }[]
  yLabels: { value: number; y: number }[]
  bestDayIndex: number
  avgPerDay: number
  maxCount: number
  theme: Theme
}) {
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PADDING.top + CHART_HEIGHT} L ${points[0].x} ${PADDING.top + CHART_HEIGHT} Z`

  // Average line Y position
  const avgY = PADDING.top + CHART_HEIGHT - (avgPerDay / maxCount) * CHART_HEIGHT

  // Find month change positions for labels
  const monthChanges: { index: number; month: string }[] = []
  let lastMonth = -1
  activity.forEach((d, i) => {
    const { month } = parseDate(d.date)
    if (month !== lastMonth) {
      monthChanges.push({ index: i, month: MONTHS_SHORT[month - 1] })
      lastMonth = month
    }
  })

  return (
    <div
      style={{ display: 'flex', position: 'relative', width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}
    >
      {/* Y-axis labels */}
      {yLabels.map(label => (
        <div
          key={label.value}
          style={{
            display: 'flex',
            position: 'absolute',
            left: 0,
            top: label.y - 6,
            width: PADDING.left - 6,
            fontSize: 10,
            color: theme.dates,
            justifyContent: 'flex-end',
          }}
        >
          {label.value}
        </div>
      ))}

      {/* SVG Chart */}
      <svg
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        {/* Grid lines */}
        {yLabels.map(label => (
          <line
            key={label.value}
            x1={PADDING.left}
            y1={label.y}
            x2={GRAPH_WIDTH - PADDING.right}
            y2={label.y}
            stroke={theme.border}
            strokeOpacity={0.15}
            strokeDasharray="3,3"
          />
        ))}

        {/* Average line */}
        <line
          x1={PADDING.left}
          y1={avgY}
          x2={GRAPH_WIDTH - PADDING.right}
          y2={avgY}
          stroke={theme.accent}
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeDasharray="6,4"
        />

        {/* Gradient fill */}
        <defs>
          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.graphLine} stopOpacity="0.3" />
            <stop offset="100%" stopColor={theme.graphLine} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#activityGradient)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={theme.graphLine}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Peak point */}
        <circle
          cx={points[bestDayIndex].x}
          cy={points[bestDayIndex].y}
          r={5}
          fill={theme.accent}
          stroke={theme.background}
          strokeWidth={2}
        />
      </svg>

      {/* Avg label */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          right: 12,
          top: avgY - 16,
          fontSize: 9,
          color: theme.accent,
          fontWeight: 600,
        }}
      >
        avg
      </div>

      {/* X-axis: Month labels + day numbers */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: PADDING.left,
          top: GRAPH_HEIGHT - 20,
          width: CHART_WIDTH,
        }}
      >
        {activity.map((d, i) => {
          const { day } = parseDate(d.date)
          const isMonthStart = monthChanges.find(mc => mc.index === i)

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
                left: (i / (activity.length - 1)) * CHART_WIDTH - 8,
              }}
            >
              {isMonthStart && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 8,
                    color: theme.accent,
                    fontWeight: 600,
                    marginBottom: 1,
                  }}
                >
                  {isMonthStart.month}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  fontSize: 9,
                  color: isMonthStart ? theme.title : theme.dates,
                  fontWeight: isMonthStart ? 600 : 400,
                }}
              >
                {day}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MonthComparison({
  currentMonth,
  previousMonth,
  bestMonth,
  currentMonthName,
  previousMonthName,
  bestMonthName,
  theme,
}: {
  currentMonth: number
  previousMonth: number
  bestMonth: number
  currentMonthName: string
  previousMonthName: string
  bestMonthName: string
  theme: Theme
}) {
  const maxMonth = Math.max(currentMonth, previousMonth, bestMonth, 1)
  const isUp = currentMonth >= previousMonth

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
      <div
        style={{
          display: 'flex',
          fontSize: 13,
          color: theme.dates,
          marginBottom: 10,
          fontWeight: 500,
        }}
      >
        Monthly Comparison
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Previous Month */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', fontSize: 11, color: theme.dates }}>
              {previousMonthName}
            </div>
            <div style={{ display: 'flex', fontSize: 12, fontWeight: 600, color: theme.title }}>
              {previousMonth}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              height: 8,
              background: theme.gridEmpty,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: `${(previousMonth / maxMonth) * 100}%`,
                height: '100%',
                background: theme.graphLine,
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Current Month */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', fontSize: 11, color: theme.dates }}>
              {currentMonthName}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 12,
                fontWeight: 600,
                color: isUp ? '#22c55e' : theme.title,
              }}
            >
              {currentMonth}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              height: 8,
              background: theme.gridEmpty,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: `${(currentMonth / maxMonth) * 100}%`,
                height: '100%',
                background: isUp ? '#22c55e' : theme.graphLine,
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Best Month */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', fontSize: 11, color: theme.dates }}>{bestMonthName}</div>
            <div style={{ display: 'flex', fontSize: 12, fontWeight: 600, color: theme.accent }}>
              {bestMonth}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              height: 8,
              background: theme.gridEmpty,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: `${(bestMonth / maxMonth) * 100}%`,
                height: '100%',
                background: theme.accent,
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsPanel({
  totalContributions,
  avgPerDay,
  activeDays,
  totalDays,
  bestDay,
  theme,
}: {
  totalContributions: number
  avgPerDay: number
  activeDays: number
  totalDays: number
  bestDay: ActivityData
  theme: Theme
}) {
  const stats = [
    { label: 'Daily avg', value: avgPerDay.toFixed(1) },
    { label: 'Active days', value: `${activeDays}/${totalDays}` },
    { label: 'Best day', value: bestDay.count.toString() },
    { label: 'Peak on', value: formatDate(bestDay.date), accent: true },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 150,
        background: `${theme.border}15`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      {/* Total */}
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}
      >
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: theme.accent }}>
          {totalContributions}
        </div>
        <div style={{ display: 'flex', fontSize: 12, color: theme.dates }}>contributions</div>
      </div>

      <div
        style={{
          display: 'flex',
          height: 1,
          background: theme.border,
          opacity: 0.2,
          marginBottom: 14,
        }}
      />

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', fontSize: 11, color: theme.dates }}>{stat.label}</div>
            <div
              style={{
                display: 'flex',
                fontSize: stat.accent ? 12 : 14,
                fontWeight: 600,
                color: stat.accent ? theme.accent : theme.title,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ActivityCard({
  activity,
  currentMonthDays,
  previousMonthSameDays,
  comparedToDate,
  last12Months,
  theme,
}: {
  activity: ActivityData[]
  currentMonthDays: number
  previousMonthSameDays: number
  comparedToDate: string
  last12Months: { month: number; year: number; total: number }[]
  theme: Theme
}) {
  if (activity.length === 0) {
    return (
      <Card theme={theme} width={900} height={320}>
        <div style={{ display: 'flex', color: theme.text }}>No activity data available</div>
      </Card>
    )
  }

  const stats = calculateStats(activity, currentMonthDays, previousMonthSameDays, last12Months)
  const points = generateGraphPoints(activity, stats.maxCount)
  const yLabels = generateYLabels(stats.maxCount)

  return (
    <Card theme={theme} width={900} height={320}>
      <div style={{ display: 'flex', gap: 20 }}>
        {/* Left: Graph Section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Header
            days={activity.length}
            trendPercent={stats.trendPercent}
            comparedToDate={comparedToDate}
            theme={theme}
          />
          <Graph
            activity={activity}
            points={points}
            yLabels={yLabels}
            bestDayIndex={stats.bestDayIndex}
            avgPerDay={stats.avgPerDay}
            maxCount={stats.maxCount}
            theme={theme}
          />
          <MonthComparison
            currentMonth={stats.currentMonth}
            previousMonth={stats.previousMonth}
            bestMonth={stats.bestMonth}
            currentMonthName={stats.currentMonthName}
            previousMonthName={stats.previousMonthName}
            bestMonthName={stats.bestMonthName}
            theme={theme}
          />
        </div>

        {/* Right: Stats Panel */}
        <StatsPanel
          totalContributions={stats.totalContributions}
          avgPerDay={stats.avgPerDay}
          activeDays={stats.activeDays}
          totalDays={activity.length}
          bestDay={stats.bestDay}
          theme={theme}
        />
      </div>
    </Card>
  )
}
