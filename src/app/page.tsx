'use client'

import { useState } from 'react'

const themes = ['radical', 'glass', 'neon', 'gradient', 'minimal', 'aurora'] as const

const themeColors: Record<string, { bg: string; accent: string; text: string }> = {
  radical: { bg: '#141321', accent: '#fe428e', text: '#a9fef7' },
  glass: { bg: 'rgba(17, 25, 40, 0.95)', accent: '#38bdf8', text: '#cbd5e1' },
  neon: { bg: '#0a0a0f', accent: '#00fff9', text: '#ff00ff' },
  gradient: { bg: '#1e1e2e', accent: '#a78bfa', text: '#e2e8f0' },
  minimal: { bg: '#000000', accent: '#22c55e', text: '#a1a1aa' },
  aurora: { bg: '#0f172a', accent: '#818cf8', text: '#e0e7ff' },
}

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<string>('neon')
  const colors = themeColors[currentTheme]

  const endpoints = [
    // Main stats
    { path: '/api/overview', name: 'Overview', width: 900 },
    { path: '/api/tech-skills', name: 'Tech & Skills', width: 900 },

    // Activity
    { path: '/api/activity', name: 'Activity', width: 900 },

    // Professional
    { path: '/api/profile', name: 'Developer Profile', width: 900 },
  ]

  return (
    <main style={{
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      background: colors.bg,
      minHeight: '100vh',
      color: colors.text,
      transition: 'background 0.3s ease'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: colors.accent, marginBottom: '0.5rem', fontSize: '2.5rem' }}>
          galcocastats
        </h1>
        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
          GitHub statistics cards with style
        </p>

        {/* Theme Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: colors.text, marginBottom: '1rem', opacity: 0.7 }}>Select Theme</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {themes.map(theme => (
              <button
                key={theme}
                onClick={() => setCurrentTheme(theme)}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentTheme === theme ? colors.accent : 'rgba(255,255,255,0.1)',
                  color: currentTheme === theme ? '#000' : colors.text,
                  border: `2px solid ${currentTheme === theme ? colors.accent : 'transparent'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: currentTheme === theme ? '600' : '400',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Preview */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: colors.text, marginBottom: '1rem', opacity: 0.7 }}>
            Preview: {currentTheme}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {endpoints.map(({ path, name, width }) => (
              <div key={path}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ color: colors.accent, fontSize: '1rem', margin: 0 }}>{name}</h3>
                  <code style={{
                    fontSize: '0.75rem',
                    opacity: 0.6,
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {path}?theme={currentTheme}
                  </code>
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  overflow: 'auto'
                }}>
                  <img
                    key={`${path}-${currentTheme}`}
                    src={`${path}?theme=${currentTheme}`}
                    alt={name}
                    style={{
                      maxWidth: '100%',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h2 style={{ color: colors.accent, marginBottom: '1rem' }}>Usage</h2>
          <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
            Add these to your GitHub README:
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
{`<!-- Overview -->
<img src="https://galcocastats.vercel.app/api/overview?theme=${currentTheme}" />

<!-- Tech & Skills -->
<img src="https://galcocastats.vercel.app/api/tech-skills?theme=${currentTheme}" />

<!-- Activity -->
<img src="https://galcocastats.vercel.app/api/activity?theme=${currentTheme}" />

<!-- Developer Profile -->
<img src="https://galcocastats.vercel.app/api/profile?theme=${currentTheme}" />`}
          </pre>
        </div>
      </div>
    </main>
  )
}
