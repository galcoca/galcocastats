import { Card } from '../renderer'
import type { Theme } from '@/lib/themes'
import type { LanguageStats } from '@/lib/github/types'

export interface DevOpsIndicators {
  activeRepos: number
  codeReviews: number
  hasMultipleOrgs: boolean
  crossRepoWork: number
}

interface SkillLevel {
  name: string
  level: number
}

const LANGUAGE_TO_SKILLS: Record<string, { category: string; weight: number }[]> = {
  'TypeScript': [{ category: 'Backend', weight: 0.6 }, { category: 'Frontend', weight: 0.4 }],
  'JavaScript': [{ category: 'Backend', weight: 0.4 }, { category: 'Frontend', weight: 0.6 }],
  'Kotlin': [{ category: 'Backend', weight: 0.8 }, { category: 'Mobile', weight: 0.2 }],
  'Java': [{ category: 'Backend', weight: 0.8 }, { category: 'Mobile', weight: 0.2 }],
  'Python': [{ category: 'Backend', weight: 0.5 }, { category: 'DevOps', weight: 0.5 }],
  'Go': [{ category: 'Backend', weight: 0.5 }, { category: 'DevOps', weight: 0.5 }],
  'Rust': [{ category: 'Backend', weight: 0.8 }, { category: 'Systems', weight: 0.2 }],
  'Svelte': [{ category: 'Frontend', weight: 1.0 }],
  'Vue': [{ category: 'Frontend', weight: 1.0 }],
  'React': [{ category: 'Frontend', weight: 1.0 }],
  'HTML': [{ category: 'Frontend', weight: 1.0 }],
  'CSS': [{ category: 'Frontend', weight: 1.0 }],
  'SCSS': [{ category: 'Frontend', weight: 1.0 }],
  'PLpgSQL': [{ category: 'Database', weight: 1.0 }],
  'SQL': [{ category: 'Database', weight: 1.0 }],
  'Shell': [{ category: 'DevOps', weight: 1.0 }],
  'Dockerfile': [{ category: 'DevOps', weight: 1.0 }],
  'YAML': [{ category: 'DevOps', weight: 1.0 }],
  'Swift': [{ category: 'Mobile', weight: 1.0 }],
  'Dart': [{ category: 'Mobile', weight: 1.0 }],
}

function getProficiencyLevel(percentage: number): { label: string; color: string } {
  if (percentage >= 50) return { label: 'Expert', color: '#10b981' }
  if (percentage >= 25) return { label: 'Advanced', color: '#3b82f6' }
  if (percentage >= 10) return { label: 'Proficient', color: '#8b5cf6' }
  if (percentage >= 5) return { label: 'Intermediate', color: '#f59e0b' }
  return { label: 'Familiar', color: '#6b7280' }
}

function calculateSkillsFromLanguages(languages: LanguageStats[], devops?: DevOpsIndicators): SkillLevel[] {
  const skillScores: Record<string, number> = {
    'Backend': 0,
    'Frontend': 0,
    'DevOps': 0,
    'Database': 0,
    'Mobile': 0,
  }

  for (const lang of languages) {
    const mappings = LANGUAGE_TO_SKILLS[lang.name]
    if (mappings) {
      for (const mapping of mappings) {
        skillScores[mapping.category] += lang.percentage * mapping.weight
      }
    }
  }

  if (devops) {
    if (devops.activeRepos >= 5) skillScores['DevOps'] += 30
    else if (devops.activeRepos >= 3) skillScores['DevOps'] += 20
    if (devops.codeReviews >= 30) skillScores['DevOps'] += 25
    else if (devops.codeReviews >= 10) skillScores['DevOps'] += 15
    if (devops.hasMultipleOrgs) skillScores['DevOps'] += 20
    if (devops.crossRepoWork >= 5) skillScores['DevOps'] += 15
  }

  const maxScore = Math.max(...Object.values(skillScores), 1)

  return Object.entries(skillScores)
    .filter(([_, score]) => score > 5)
    .map(([name, score]) => ({
      name,
      level: Math.min(Math.round((score / maxScore) * 100), 100),
    }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 5)
}

export function TechSkillsCard({
  languages,
  devops,
  theme
}: {
  languages: LanguageStats[]
  devops?: DevOpsIndicators
  theme: Theme
}) {
  const skills = calculateSkillsFromLanguages(languages, devops)

  if (languages.length === 0) {
    return (
      <Card theme={theme} width={900} height={340}>
        <div style={{ display: 'flex', color: theme.text }}>No data available</div>
      </Card>
    )
  }

  // Radar chart config
  const centerX = 140
  const centerY = 115
  const maxRadius = 90
  const numAxes = skills.length || 1
  const angleStep = (2 * Math.PI) / numAxes

  const generatePolygon = (scale: number) => {
    return skills
      .map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        const x = centerX + maxRadius * scale * Math.cos(angle)
        const y = centerY + maxRadius * scale * Math.sin(angle)
        return `${x},${y}`
      })
      .join(' ')
  }

  const dataPoints = skills.map((skill, i) => {
    const normalizedValue = skill.level / 100
    const angle = i * angleStep - Math.PI / 2
    const radius = maxRadius * normalizedValue
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      labelX: centerX + (maxRadius + 20) * Math.cos(angle),
      labelY: centerY + (maxRadius + 20) * Math.sin(angle),
      ...skill,
    }
  })

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <Card theme={theme} width={900} height={340}>
      <div style={{ display: 'flex', height: '100%', gap: 40 }}>
        {/* Left - Tech Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 16, fontWeight: 600, color: theme.title, marginBottom: 4 }}>
            Tech Stack
          </div>
          {languages.slice(0, 6).map((lang) => {
            const proficiency = getProficiencyLevel(lang.percentage)
            const barWidth = Math.min(lang.percentage * 1.8, 100)

            return (
              <div key={lang.name} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      display: 'flex',
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: lang.color,
                    }} />
                    <div style={{ display: 'flex', fontSize: 15, fontWeight: 600, color: theme.text }}>
                      {lang.name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', fontSize: 13, color: theme.dates }}>
                      {lang.percentage.toFixed(0)}%
                    </div>
                    <div style={{
                      display: 'flex',
                      fontSize: 11,
                      color: proficiency.color,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: `${proficiency.color}20`,
                      fontWeight: 600,
                    }}>
                      {proficiency.label}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  height: 6,
                  borderRadius: 3,
                  background: `${theme.border}40`,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'flex',
                    width: `${barWidth}%`,
                    height: '100%',
                    borderRadius: 3,
                    background: lang.color,
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', width: 1, background: `${theme.border}30` }} />

        {/* Right - Skills Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 16, fontWeight: 600, color: theme.title }}>
            Skills
          </div>
          <div style={{ display: 'flex', flex: 1, position: 'relative', width: 280, marginTop: 32 }}>
            <svg width={280} height={240} style={{ position: 'absolute', left: 0, top: 0 }}>
              {/* Grid polygons */}
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <polygon
                  key={scale}
                  points={generatePolygon(scale)}
                  fill="none"
                  stroke={theme.border}
                  strokeOpacity={0.2}
                  strokeWidth={1}
                />
              ))}

              {/* Axis lines */}
              {skills.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2
                const x = centerX + maxRadius * Math.cos(angle)
                const y = centerY + maxRadius * Math.sin(angle)
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke={theme.border}
                    strokeOpacity={0.3}
                  />
                )
              })}

              {/* Data polygon */}
              {skills.length > 0 && (
                <polygon
                  points={dataPolygon}
                  fill={theme.accent}
                  fillOpacity={0.25}
                  stroke={theme.accent}
                  strokeWidth={2}
                />
              )}

              {/* Data points */}
              {dataPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill={theme.accent}
                  stroke={theme.background}
                  strokeWidth={2}
                />
              ))}
            </svg>

            {/* Labels */}
            {dataPoints.map((p, i) => {
              const isLeft = p.labelX < centerX - 10
              const isCenter = p.labelX >= centerX - 10 && p.labelX <= centerX + 10

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: isLeft ? p.labelX - 55 : isCenter ? p.labelX - 28 : p.labelX - 5,
                    top: p.labelY - 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isLeft ? 'flex-end' : isCenter ? 'center' : 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', fontSize: 12, fontWeight: 600, color: theme.text }}>
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', fontSize: 11, color: theme.accent }}>
                    {p.level}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
