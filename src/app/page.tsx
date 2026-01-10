'use client'

import { useState } from 'react'

// Ordered by color spectrum: warm → green → cyan → blue → purple → pink
const themes = [
  'sunset', 'gruvbox', 'monokai',           // Warm (orange/yellow)
  'forest', 'minimal',                       // Green
  'neon', 'ocean', 'glass',                  // Cyan/Teal
  'nord', 'github', 'tokyonight',            // Blue
  'aurora', 'gradient', 'catppuccin', 'dracula',  // Purple
  'synthwave', 'radical', 'rosegold'         // Pink/Magenta
] as const

const themeColors: Record<string, { bg: string; accent: string; text: string; secondary: string }> = {
  radical: { bg: '#141321', accent: '#fe428e', text: '#a9fef7', secondary: '#f8d847' },
  glass: { bg: 'rgba(17, 25, 40, 0.95)', accent: '#38bdf8', text: '#cbd5e1', secondary: '#818cf8' },
  neon: { bg: '#0a0a0f', accent: '#00fff9', text: '#ff00ff', secondary: '#ffff00' },
  gradient: { bg: '#1e1e2e', accent: '#a78bfa', text: '#e2e8f0', secondary: '#fbbf24' },
  minimal: { bg: '#000000', accent: '#22c55e', text: '#a1a1aa', secondary: '#fafafa' },
  aurora: { bg: '#0f172a', accent: '#818cf8', text: '#e0e7ff', secondary: '#c084fc' },
  nord: { bg: '#2e3440', accent: '#88c0d0', text: '#d8dee9', secondary: '#ebcb8b' },
  dracula: { bg: '#282a36', accent: '#bd93f9', text: '#f8f8f2', secondary: '#50fa7b' },
  github: { bg: '#0d1117', accent: '#58a6ff', text: '#c9d1d9', secondary: '#238636' },
  sunset: { bg: '#1a1625', accent: '#f97316', text: '#fde68a', secondary: '#ec4899' },
  ocean: { bg: '#0f172a', accent: '#06b6d4', text: '#bae6fd', secondary: '#0ea5e9' },
  catppuccin: { bg: '#1e1e2e', accent: '#cba6f7', text: '#bac2de', secondary: '#f5c2e7' },
  rosegold: { bg: '#1c1917', accent: '#f43f5e', text: '#fda4af', secondary: '#fbbf24' },
  monokai: { bg: '#272822', accent: '#a6e22e', text: '#f8f8f2', secondary: '#f92672' },
  synthwave: { bg: '#1a1a2e', accent: '#e94560', text: '#c9b1ff', secondary: '#00fff5' },
  forest: { bg: '#1a2f1a', accent: '#50c878', text: '#b8d4b8', secondary: '#90ee90' },
  gruvbox: { bg: '#282828', accent: '#fabd2f', text: '#d5c4a1', secondary: '#fe8019' },
  tokyonight: { bg: '#1a1b26', accent: '#7aa2f7', text: '#a9b1d6', secondary: '#bb9af7' },
}

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ForkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 5.74028 10.5978 6.38663 10 6.73244V14.0396H14V6.73244C13.4022 6.38663 13 5.74028 13 5C13 3.89543 13.8954 3 15 3C16.1046 3 17 3.89543 17 5C17 5.74028 16.5978 6.38663 16 6.73244V14.0396C16 15.1442 15.1046 16.0396 14 16.0396H10V17.2676C10.5978 17.6134 11 18.2597 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 18.2597 7.40221 17.6134 8 17.2676V6.73244C7.40221 6.38663 7 5.74028 7 5Z"/>
  </svg>
)

const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.46 5.64 14.12L2 17.76V19.17Z"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
)

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<string>('tokyonight')
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
  const colors = themeColors[currentTheme]

  const endpoints = [
    { path: '/api/overview', name: 'Overview', desc: 'Contribution streak & stats' },
    { path: '/api/tech-skills', name: 'Tech & Skills', desc: 'Languages & tools' },
    { path: '/api/activity', name: 'Activity', desc: '30-day heatmap' },
    { path: '/api/profile', name: 'Developer Profile', desc: 'Monthly performance' },
  ]

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  return (
    <main style={{
      padding: '0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: colors.bg,
      minHeight: '100vh',
      color: colors.text,
      transition: 'all 0.3s ease'
    }}>
      {/* Hero Section */}
      <header style={{
        borderBottom: `1px solid ${colors.accent}20`,
        padding: '2rem',
        background: `linear-gradient(180deg, ${colors.accent}10 0%, transparent 100%)`
      }}>
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                color: colors.accent,
                marginBottom: '0.5rem',
                fontSize: '2.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}>
                galcocastats
              </h1>
              <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>
                Beautiful GitHub statistics cards for your profile README
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://github.com/galcoca/galcocastats"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: colors.accent,
                  color: colors.bg,
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <GitHubIcon />
                View on GitHub
              </a>
            </div>
          </div>

          {/* Quick Start Banner */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: `${colors.secondary}15`,
            border: `1px solid ${colors.secondary}30`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.secondary }}>
              <RocketIcon />
              <strong>Quick Start:</strong>
            </div>
            <span style={{ opacity: 0.8 }}>
              Fork the repo → Add your GitHub token → Deploy to Vercel → Use the cards!
            </span>
            <a
              href="https://github.com/galcoca/galcocastats/fork"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                background: colors.secondary,
                color: colors.bg,
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginLeft: 'auto'
              }}
            >
              <ForkIcon />
              Fork Now
            </a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2rem' }}>
        {/* Theme Selector */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            color: colors.text,
            marginBottom: '1.25rem',
            fontSize: '1.25rem',
            fontWeight: 600
          }}>
            Select Theme
            <span style={{
              marginLeft: '0.75rem',
              fontSize: '0.875rem',
              opacity: 0.5,
              fontWeight: 400
            }}>
              {themes.length} themes
            </span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem'
          }}>
            {themes.map(theme => {
              const isSelected = currentTheme === theme
              const tc = themeColors[theme]
              return (
                <button
                  key={theme}
                  onClick={() => setCurrentTheme(theme)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: isSelected ? tc.bg : 'rgba(255,255,255,0.05)',
                    color: isSelected ? tc.text : colors.text,
                    border: `2px solid ${isSelected ? tc.accent : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${tc.accent} 0%, ${tc.secondary} 100%)`,
                    border: '2px solid rgba(255,255,255,0.2)',
                    flexShrink: 0
                  }} />
                  {theme}
                </button>
              )
            })}
          </div>
        </section>

        {/* Cards Preview */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            color: colors.text,
            marginBottom: '1.5rem',
            fontSize: '1.25rem',
            fontWeight: 600
          }}>
            Preview
            <span style={{
              marginLeft: '0.75rem',
              padding: '0.25rem 0.75rem',
              background: colors.accent,
              color: colors.bg,
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              {currentTheme}
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {endpoints.map(({ path, name, desc }) => (
              <div key={path}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <h3 style={{ color: colors.accent, fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>
                      {name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', opacity: 0.6, fontSize: '0.875rem' }}>
                      {desc}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(
                      `![${name}](https://YOUR-DEPLOYMENT.vercel.app${path}?theme=${currentTheme})`,
                      path
                    )}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.75rem',
                      background: copiedEndpoint === path ? colors.secondary : 'rgba(255,255,255,0.1)',
                      color: copiedEndpoint === path ? colors.bg : colors.text,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <CopyIcon />
                    {copiedEndpoint === path ? 'Copied!' : 'Copy Markdown'}
                  </button>
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '16px',
                  padding: '1rem',
                  overflow: 'auto',
                  border: `1px solid ${colors.accent}20`,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <img
                    key={`${path}-${currentTheme}`}
                    src={`${path}?theme=${currentTheme}`}
                    alt={name}
                    style={{
                      maxWidth: '100%',
                      display: 'block',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Setup Instructions */}
        <section style={{
          background: `linear-gradient(135deg, ${colors.accent}10 0%, ${colors.secondary}10 100%)`,
          border: `1px solid ${colors.accent}20`,
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: colors.accent, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
            Setup Your Own Instance
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: colors.accent,
                color: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0
              }}>1</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.text, fontWeight: 600 }}>Fork the Repository</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                  Go to <a href="https://github.com/galcoca/galcocastats" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent }}>github.com/galcoca/galcocastats</a> and click Fork
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: colors.accent,
                color: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0
              }}>2</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.text, fontWeight: 600 }}>Create GitHub Token</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                  Generate a Personal Access Token with <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>read:user</code> and <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>repo</code> scopes
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: colors.accent,
                color: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0
              }}>3</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.text, fontWeight: 600 }}>Deploy to Vercel</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                  Import your fork to Vercel and add environment variables: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>GITHUB_TOKEN</code> and <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>GITHUB_USERNAME</code>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: colors.secondary,
                color: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0
              }}>✓</div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: colors.text, fontWeight: 600 }}>Use Your Cards!</h3>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                  Replace <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>YOUR-DEPLOYMENT</code> in the markdown with your Vercel URL
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: `1px solid ${colors.accent}20`,
          paddingTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Created by{' '}
            <a
              href="https://github.com/galcoca"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.accent, textDecoration: 'none', fontWeight: 600 }}
            >
              @galcoca
            </a>
          </p>
          <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>
            Open source · MIT License · {themes.length} themes · 4 card types
          </p>
        </footer>
      </div>
    </main>
  )
}
