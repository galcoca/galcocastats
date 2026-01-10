export interface Theme {
  name: string
  // Base colors
  background: string
  backgroundGradient?: string
  border: string
  borderGlow?: string
  title: string
  text: string
  icon: string
  accent: string
  // Streak-specific
  ring: string
  fire: string
  currStreak: string
  sideNums: string
  dates: string
  // Graph-specific
  graphLine: string
  graphPoint: string
  graphArea: string
  graphGradient?: [string, string]
  // Grid colors for heatmap
  gridEmpty: string
  gridFilled: string[]
  // Effects
  glowColor?: string
  blur?: boolean
  animation?: boolean
}

// Original radical theme
export const radicalTheme: Theme = {
  name: 'radical',
  background: '#141321',
  border: '#e4e2e2',
  title: '#fe428e',
  text: '#a9fef7',
  icon: '#f8d847',
  accent: '#fe428e',
  ring: '#fe428e',
  fire: '#fe428e',
  currStreak: '#fe428e',
  sideNums: '#a9fef7',
  dates: '#a9fef7',
  graphLine: '#fe428e',
  graphPoint: '#f8d847',
  graphArea: 'rgba(254, 66, 142, 0.2)',
  gridEmpty: '#1f1d2e',
  gridFilled: ['#2d1f3d', '#5c2d5c', '#8a3d7c', '#fe428e'],
}

// Glassmorphism theme
export const glassmorphismTheme: Theme = {
  name: 'glass',
  background: 'rgba(17, 25, 40, 0.75)',
  backgroundGradient: 'linear-gradient(135deg, rgba(17, 25, 40, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
  border: 'rgba(255, 255, 255, 0.125)',
  title: '#f8fafc',
  text: '#cbd5e1',
  icon: '#38bdf8',
  accent: '#38bdf8',
  ring: '#38bdf8',
  fire: '#fb923c',
  currStreak: '#38bdf8',
  sideNums: '#f8fafc',
  dates: '#94a3b8',
  graphLine: '#38bdf8',
  graphPoint: '#fb923c',
  graphArea: 'rgba(56, 189, 248, 0.15)',
  graphGradient: ['#38bdf8', '#818cf8'],
  gridEmpty: 'rgba(51, 65, 85, 0.5)',
  gridFilled: ['rgba(56, 189, 248, 0.3)', 'rgba(56, 189, 248, 0.5)', 'rgba(56, 189, 248, 0.7)', '#38bdf8'],
  blur: true,
  animation: true,
}

// Neon Cyberpunk theme
export const neonTheme: Theme = {
  name: 'neon',
  background: '#0a0a0f',
  backgroundGradient: 'linear-gradient(180deg, #0a0a0f 0%, #1a0a2e 100%)',
  border: '#00fff9',
  borderGlow: '0 0 10px #00fff9, 0 0 20px #00fff9, 0 0 30px #00fff9',
  title: '#00fff9',
  text: '#ff00ff',
  icon: '#ffff00',
  accent: '#00fff9',
  ring: '#ff00ff',
  fire: '#ff6b00',
  currStreak: '#00fff9',
  sideNums: '#ff00ff',
  dates: '#00fff9',
  graphLine: '#00fff9',
  graphPoint: '#ff00ff',
  graphArea: 'rgba(0, 255, 249, 0.1)',
  graphGradient: ['#00fff9', '#ff00ff'],
  gridEmpty: '#1a0a2e',
  gridFilled: ['#2d1f5c', '#5c2d8a', '#8a3dba', '#ff00ff'],
  glowColor: '#00fff9',
  animation: true,
}

// Gradient Modern theme
export const gradientTheme: Theme = {
  name: 'gradient',
  background: '#1e1e2e',
  backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'rgba(255, 255, 255, 0.1)',
  title: '#ffffff',
  text: '#e2e8f0',
  icon: '#fbbf24',
  accent: '#a78bfa',
  ring: '#a78bfa',
  fire: '#fb7185',
  currStreak: '#ffffff',
  sideNums: '#e2e8f0',
  dates: '#a5b4fc',
  graphLine: '#ffffff',
  graphPoint: '#fbbf24',
  graphArea: 'rgba(255, 255, 255, 0.1)',
  graphGradient: ['#667eea', '#764ba2'],
  gridEmpty: 'rgba(0, 0, 0, 0.2)',
  gridFilled: ['rgba(251, 191, 36, 0.3)', 'rgba(251, 191, 36, 0.5)', 'rgba(251, 191, 36, 0.7)', '#fbbf24'],
  animation: true,
}

// Minimal Dark theme
export const minimalTheme: Theme = {
  name: 'minimal',
  background: '#000000',
  border: '#27272a',
  title: '#fafafa',
  text: '#a1a1aa',
  icon: '#22c55e',
  accent: '#22c55e',
  ring: '#22c55e',
  fire: '#ef4444',
  currStreak: '#fafafa',
  sideNums: '#fafafa',
  dates: '#71717a',
  graphLine: '#22c55e',
  graphPoint: '#fafafa',
  graphArea: 'rgba(34, 197, 94, 0.1)',
  gridEmpty: '#18181b',
  gridFilled: ['#14532d', '#166534', '#22c55e', '#4ade80'],
}

// Aurora theme (bonus)
export const auroraTheme: Theme = {
  name: 'aurora',
  background: '#0f172a',
  backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
  border: 'rgba(129, 140, 248, 0.3)',
  title: '#c4b5fd',
  text: '#e0e7ff',
  icon: '#67e8f9',
  accent: '#818cf8',
  ring: '#c084fc',
  fire: '#fb7185',
  currStreak: '#c4b5fd',
  sideNums: '#e0e7ff',
  dates: '#a5b4fc',
  graphLine: '#818cf8',
  graphPoint: '#67e8f9',
  graphArea: 'rgba(129, 140, 248, 0.15)',
  graphGradient: ['#818cf8', '#c084fc'],
  gridEmpty: '#1e1b4b',
  gridFilled: ['#3730a3', '#4f46e5', '#818cf8', '#c4b5fd'],
  glowColor: '#818cf8',
  animation: true,
}

export const themes: Record<string, Theme> = {
  radical: radicalTheme,
  glass: glassmorphismTheme,
  neon: neonTheme,
  gradient: gradientTheme,
  minimal: minimalTheme,
  aurora: auroraTheme,
}

export function getTheme(name: string): Theme {
  return themes[name] || radicalTheme
}
