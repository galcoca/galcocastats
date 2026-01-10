import satori from 'satori'
import type { Theme } from '@/lib/themes'

// Font cache
let fontDataRegular: ArrayBuffer | null = null
let fontDataBold: ArrayBuffer | null = null

async function loadFonts() {
  if (!fontDataRegular) {
    // Load Inter font from Google Fonts
    const regularRes = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.woff'
    )
    fontDataRegular = await regularRes.arrayBuffer()
  }

  if (!fontDataBold) {
    const boldRes = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_0ew.woff'
    )
    fontDataBold = await boldRes.arrayBuffer()
  }

  return [
    { name: 'Inter', data: fontDataRegular, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: fontDataBold, weight: 700 as const, style: 'normal' as const },
  ]
}

export interface RenderOptions {
  width: number
  height: number
  theme: Theme
}

export async function renderToSvg(
  element: React.ReactElement,
  options: RenderOptions
): Promise<string> {
  const fonts = await loadFonts()

  return await satori(element, {
    width: options.width,
    height: options.height,
    fonts,
  })
}

// Base card wrapper component
export function Card({
  children,
  theme,
  title,
  width,
  height,
}: {
  children: React.ReactNode
  theme: Theme
  title?: string
  width: number
  height: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 24,
        background: theme.backgroundGradient || theme.background,
        borderRadius: 16,
        border: `1px solid ${theme.border}`,
        fontFamily: 'Inter',
        color: theme.text,
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            fontSize: 18,
            fontWeight: 600,
            color: theme.title,
            marginBottom: 16,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

// Stat row component
export function StatRow({
  icon,
  label,
  value,
  theme,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  theme: Theme
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', marginRight: 12, color: theme.icon }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flex: 1, fontSize: 14, color: theme.text }}>
        {label}
      </div>
      <div style={{ display: 'flex', fontSize: 14, fontWeight: 700, color: theme.text }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

// Progress ring component
export function ProgressRing({
  progress,
  size,
  strokeWidth,
  color,
  bgColor,
  children,
}: {
  progress: number // 0-1
  size: number
  strokeWidth: number
  color: string
  bgColor: string
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ position: 'absolute' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {children}
        </div>
      )}
    </div>
  )
}
