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
  backgroundGradient:
    'linear-gradient(135deg, rgba(17, 25, 40, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
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
  gridFilled: [
    'rgba(56, 189, 248, 0.3)',
    'rgba(56, 189, 248, 0.5)',
    'rgba(56, 189, 248, 0.7)',
    '#38bdf8',
  ],
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
  gridFilled: [
    'rgba(251, 191, 36, 0.3)',
    'rgba(251, 191, 36, 0.5)',
    'rgba(251, 191, 36, 0.7)',
    '#fbbf24',
  ],
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

// Nord - Arctic, clean, professional
export const nordTheme: Theme = {
  name: 'nord',
  background: '#2e3440',
  backgroundGradient: 'linear-gradient(135deg, #2e3440 0%, #3b4252 100%)',
  border: '#4c566a',
  title: '#eceff4',
  text: '#d8dee9',
  icon: '#88c0d0',
  accent: '#88c0d0',
  ring: '#81a1c1',
  fire: '#bf616a',
  currStreak: '#eceff4',
  sideNums: '#e5e9f0',
  dates: '#d8dee9',
  graphLine: '#88c0d0',
  graphPoint: '#ebcb8b',
  graphArea: 'rgba(136, 192, 208, 0.15)',
  graphGradient: ['#88c0d0', '#81a1c1'],
  gridEmpty: '#3b4252',
  gridFilled: ['#4c566a', '#5e81ac', '#81a1c1', '#88c0d0'],
}

// Dracula - Classic developer theme
export const draculaTheme: Theme = {
  name: 'dracula',
  background: '#282a36',
  backgroundGradient: 'linear-gradient(135deg, #282a36 0%, #1e1f29 100%)',
  border: '#44475a',
  title: '#f8f8f2',
  text: '#f8f8f2',
  icon: '#bd93f9',
  accent: '#bd93f9',
  ring: '#ff79c6',
  fire: '#ffb86c',
  currStreak: '#f8f8f2',
  sideNums: '#f8f8f2',
  dates: '#6272a4',
  graphLine: '#bd93f9',
  graphPoint: '#50fa7b',
  graphArea: 'rgba(189, 147, 249, 0.15)',
  graphGradient: ['#bd93f9', '#ff79c6'],
  gridEmpty: '#44475a',
  gridFilled: ['#6272a4', '#bd93f9', '#ff79c6', '#50fa7b'],
}

// GitHub - Official GitHub dark colors
export const githubTheme: Theme = {
  name: 'github',
  background: '#0d1117',
  border: '#30363d',
  title: '#f0f6fc',
  text: '#c9d1d9',
  icon: '#58a6ff',
  accent: '#58a6ff',
  ring: '#238636',
  fire: '#f78166',
  currStreak: '#f0f6fc',
  sideNums: '#c9d1d9',
  dates: '#8b949e',
  graphLine: '#58a6ff',
  graphPoint: '#238636',
  graphArea: 'rgba(88, 166, 255, 0.15)',
  gridEmpty: '#161b22',
  gridFilled: ['#0e4429', '#006d32', '#26a641', '#39d353'],
}

// Sunset - Warm gradient
export const sunsetTheme: Theme = {
  name: 'sunset',
  background: '#1a1625',
  backgroundGradient: 'linear-gradient(135deg, #1a1625 0%, #2d1f3d 100%)',
  border: '#3d2a54',
  title: '#fcd34d',
  text: '#fde68a',
  icon: '#f97316',
  accent: '#f97316',
  ring: '#ec4899',
  fire: '#ef4444',
  currStreak: '#fcd34d',
  sideNums: '#fde68a',
  dates: '#c4b5a0',
  graphLine: '#f97316',
  graphPoint: '#fcd34d',
  graphArea: 'rgba(249, 115, 22, 0.15)',
  graphGradient: ['#f97316', '#ec4899'],
  gridEmpty: '#2d1f3d',
  gridFilled: ['#7c2d12', '#c2410c', '#f97316', '#fdba74'],
  animation: true,
}

// Ocean - Deep blue professional
export const oceanTheme: Theme = {
  name: 'ocean',
  background: '#0f172a',
  backgroundGradient: 'linear-gradient(180deg, #0f172a 0%, #0c4a6e 100%)',
  border: '#1e3a5f',
  title: '#f0f9ff',
  text: '#bae6fd',
  icon: '#06b6d4',
  accent: '#06b6d4',
  ring: '#0ea5e9',
  fire: '#f97316',
  currStreak: '#f0f9ff',
  sideNums: '#e0f2fe',
  dates: '#7dd3fc',
  graphLine: '#06b6d4',
  graphPoint: '#22d3ee',
  graphArea: 'rgba(6, 182, 212, 0.15)',
  graphGradient: ['#06b6d4', '#0ea5e9'],
  gridEmpty: '#164e63',
  gridFilled: ['#155e75', '#0891b2', '#06b6d4', '#22d3ee'],
}

// Catppuccin Mocha - Trendy pastel theme
export const catppuccinTheme: Theme = {
  name: 'catppuccin',
  background: '#1e1e2e',
  backgroundGradient: 'linear-gradient(135deg, #1e1e2e 0%, #181825 100%)',
  border: '#313244',
  title: '#cdd6f4',
  text: '#bac2de',
  icon: '#cba6f7',
  accent: '#cba6f7',
  ring: '#f5c2e7',
  fire: '#fab387',
  currStreak: '#cdd6f4',
  sideNums: '#cdd6f4',
  dates: '#a6adc8',
  graphLine: '#cba6f7',
  graphPoint: '#94e2d5',
  graphArea: 'rgba(203, 166, 247, 0.15)',
  graphGradient: ['#cba6f7', '#f5c2e7'],
  gridEmpty: '#313244',
  gridFilled: ['#45475a', '#585b70', '#cba6f7', '#f5c2e7'],
}

// Rose Gold - Elegant and modern
export const roseGoldTheme: Theme = {
  name: 'rosegold',
  background: '#1c1917',
  backgroundGradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
  border: '#44403c',
  title: '#fecdd3',
  text: '#fda4af',
  icon: '#f43f5e',
  accent: '#f43f5e',
  ring: '#fb7185',
  fire: '#fbbf24',
  currStreak: '#fecdd3',
  sideNums: '#fecdd3',
  dates: '#a8a29e',
  graphLine: '#f43f5e',
  graphPoint: '#fcd34d',
  graphArea: 'rgba(244, 63, 94, 0.15)',
  graphGradient: ['#f43f5e', '#fbbf24'],
  gridEmpty: '#292524',
  gridFilled: ['#44403c', '#be123c', '#f43f5e', '#fda4af'],
}

// Monokai - Classic editor theme
export const monokaiTheme: Theme = {
  name: 'monokai',
  background: '#272822',
  backgroundGradient: 'linear-gradient(135deg, #272822 0%, #1e1f1c 100%)',
  border: '#49483e',
  title: '#f8f8f2',
  text: '#f8f8f2',
  icon: '#66d9ef',
  accent: '#a6e22e',
  ring: '#f92672',
  fire: '#fd971f',
  currStreak: '#f8f8f2',
  sideNums: '#f8f8f2',
  dates: '#75715e',
  graphLine: '#a6e22e',
  graphPoint: '#f92672',
  graphArea: 'rgba(166, 226, 46, 0.15)',
  graphGradient: ['#a6e22e', '#66d9ef'],
  gridEmpty: '#3e3d32',
  gridFilled: ['#49483e', '#75715e', '#a6e22e', '#e6db74'],
}

// Synthwave - 80s retro aesthetic
export const synthwaveTheme: Theme = {
  name: 'synthwave',
  background: '#1a1a2e',
  backgroundGradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
  border: '#e94560',
  title: '#ff6b9d',
  text: '#c9b1ff',
  icon: '#00fff5',
  accent: '#e94560',
  ring: '#ff6b9d',
  fire: '#ffd700',
  currStreak: '#ff6b9d',
  sideNums: '#c9b1ff',
  dates: '#9d8cff',
  graphLine: '#e94560',
  graphPoint: '#00fff5',
  graphArea: 'rgba(233, 69, 96, 0.15)',
  graphGradient: ['#e94560', '#ff6b9d'],
  gridEmpty: '#16213e',
  gridFilled: ['#2d2d5a', '#e94560', '#ff6b9d', '#00fff5'],
  glowColor: '#e94560',
  animation: true,
}

// Forest - Nature green theme
export const forestTheme: Theme = {
  name: 'forest',
  background: '#1a2f1a',
  backgroundGradient: 'linear-gradient(135deg, #1a2f1a 0%, #0d1f0d 100%)',
  border: '#2d5a2d',
  title: '#90ee90',
  text: '#b8d4b8',
  icon: '#50c878',
  accent: '#50c878',
  ring: '#228b22',
  fire: '#ff8c00',
  currStreak: '#90ee90',
  sideNums: '#b8d4b8',
  dates: '#6b8e6b',
  graphLine: '#50c878',
  graphPoint: '#90ee90',
  graphArea: 'rgba(80, 200, 120, 0.15)',
  graphGradient: ['#228b22', '#50c878'],
  gridEmpty: '#0d1f0d',
  gridFilled: ['#1a3d1a', '#2d5a2d', '#50c878', '#90ee90'],
}

// Gruvbox - Warm retro theme
export const gruvboxTheme: Theme = {
  name: 'gruvbox',
  background: '#282828',
  backgroundGradient: 'linear-gradient(135deg, #282828 0%, #1d2021 100%)',
  border: '#504945',
  title: '#ebdbb2',
  text: '#d5c4a1',
  icon: '#fe8019',
  accent: '#fabd2f',
  ring: '#b8bb26',
  fire: '#fb4934',
  currStreak: '#ebdbb2',
  sideNums: '#d5c4a1',
  dates: '#a89984',
  graphLine: '#fabd2f',
  graphPoint: '#fe8019',
  graphArea: 'rgba(250, 189, 47, 0.15)',
  graphGradient: ['#fabd2f', '#fe8019'],
  gridEmpty: '#1d2021',
  gridFilled: ['#504945', '#b8bb26', '#fabd2f', '#fe8019'],
}

// Tokyo Night - Modern developer theme
export const tokyoNightTheme: Theme = {
  name: 'tokyonight',
  background: '#1a1b26',
  backgroundGradient: 'linear-gradient(135deg, #1a1b26 0%, #16161e 100%)',
  border: '#292e42',
  title: '#c0caf5',
  text: '#a9b1d6',
  icon: '#7aa2f7',
  accent: '#7aa2f7',
  ring: '#bb9af7',
  fire: '#ff9e64',
  currStreak: '#c0caf5',
  sideNums: '#a9b1d6',
  dates: '#565f89',
  graphLine: '#7aa2f7',
  graphPoint: '#bb9af7',
  graphArea: 'rgba(122, 162, 247, 0.15)',
  graphGradient: ['#7aa2f7', '#bb9af7'],
  gridEmpty: '#16161e',
  gridFilled: ['#292e42', '#3d59a1', '#7aa2f7', '#bb9af7'],
}

export const themes: Record<string, Theme> = {
  radical: radicalTheme,
  glass: glassmorphismTheme,
  neon: neonTheme,
  gradient: gradientTheme,
  minimal: minimalTheme,
  aurora: auroraTheme,
  nord: nordTheme,
  dracula: draculaTheme,
  github: githubTheme,
  sunset: sunsetTheme,
  ocean: oceanTheme,
  catppuccin: catppuccinTheme,
  rosegold: roseGoldTheme,
  monokai: monokaiTheme,
  synthwave: synthwaveTheme,
  forest: forestTheme,
  gruvbox: gruvboxTheme,
  tokyonight: tokyoNightTheme,
}

export function getTheme(name: string): Theme {
  return themes[name] || radicalTheme
}

// Helper to apply opacity to any color (hex or rgba)
export function withOpacity(color: string, opacity: number): string {
  // If it's already rgba, replace the alpha value
  if (color.startsWith('rgba')) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`)
  }
  // If it's rgb, convert to rgba
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
  }
  // If it's hex, convert to rgba
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}
