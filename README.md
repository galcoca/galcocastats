# galcocastats

Beautiful, customizable SVG cards displaying GitHub statistics for your profile README.

![Overview Card](https://galcocastats.vercel.app/api/overview?theme=radical)

## Features

- **4 Card Types**: Overview, Tech & Skills, Activity Heatmap, and Developer Profile
- **6 Themes**: radical, glass, neon, gradient, minimal, aurora
- **Real-time Data**: Fetches live stats from GitHub GraphQL API
- **SVG Output**: Crisp, scalable cards that look great everywhere
- **Easy Embedding**: Just paste the URL in your README

## Cards

### Overview
Shows contribution streak, longest streak, total contributions, merge rate, and active projects.

```markdown
![Overview](https://galcocastats.vercel.app/api/overview?theme=radical)
```

### Tech & Skills
Displays top programming languages and DevOps indicators.

```markdown
![Tech & Skills](https://galcocastats.vercel.app/api/tech-skills?theme=radical)
```

### Activity
30-day contribution heatmap visualization.

```markdown
![Activity](https://galcocastats.vercel.app/api/activity?theme=radical)
```

### Profile
Developer profile with key statistics.

```markdown
![Profile](https://galcocastats.vercel.app/api/profile?theme=radical)
```

## Themes

Add `?theme=<theme_name>` to any card URL:

| Theme | Description |
|-------|-------------|
| `radical` | Vibrant pink/purple gradient |
| `glass` | Glassmorphism effect |
| `neon` | Cyberpunk style with glow effects |
| `gradient` | Smooth color transitions |
| `minimal` | Clean, simple design |
| `aurora` | Northern lights inspired |

## Tech Stack

- **Next.js 16** - Full-stack React framework
- **Satori** - HTML/CSS to SVG rendering
- **TypeScript** - Type-safe development
- **Vercel** - Deployment and hosting

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create `.env.local` with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   ```
4. Run the development server:
   ```bash
   bun dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub Personal Access Token (requires `read:user` and `repo` scopes) |
| `GITHUB_USERNAME` | GitHub username to fetch stats for |

## License

MIT
