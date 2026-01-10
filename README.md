# galcocastats

Beautiful, customizable SVG cards displaying GitHub statistics for your profile README.

> **Important:** This project requires you to fork and deploy your own instance. The cards fetch YOUR GitHub stats using your personal access token, so you need your own deployment.

## Live Demo

Here's how the cards look with real data:

### Overview
![Overview Card](https://galcocastats.vercel.app/api/overview?theme=github)

### Tech & Skills
![Tech Skills Card](https://galcocastats.vercel.app/api/tech-skills?theme=dracula)

### Activity Heatmap
![Activity Card](https://galcocastats.vercel.app/api/activity?theme=nord)

### Developer Profile
![Profile Card](https://galcocastats.vercel.app/api/profile?theme=catppuccin)

---

## Features

- **4 Card Types**: Overview, Tech & Skills, Activity Heatmap, and Developer Profile
- **18 Themes**: radical, glass, neon, gradient, minimal, aurora, nord, dracula, github, sunset, ocean, catppuccin, rosegold, monokai, synthwave, forest, gruvbox, tokyonight
- **Real-time Data**: Fetches live stats from GitHub GraphQL API
- **SVG Output**: Crisp, scalable cards that look great everywhere
- **Easy Embedding**: Just paste the URL in your README

## Cards

### Overview
Shows contribution streak, longest streak, total contributions, merge rate, and active projects.

```markdown
![Overview](https://YOUR-DEPLOYMENT.vercel.app/api/overview?theme=radical)
```

### Tech & Skills
Displays top programming languages and DevOps indicators.

```markdown
![Tech & Skills](https://YOUR-DEPLOYMENT.vercel.app/api/tech-skills?theme=radical)
```

### Activity
30-day contribution heatmap visualization.

```markdown
![Activity](https://YOUR-DEPLOYMENT.vercel.app/api/activity?theme=radical)
```

### Profile
Developer profile with key statistics.

```markdown
![Profile](https://YOUR-DEPLOYMENT.vercel.app/api/profile?theme=radical)
```

## Themes

Add `?theme=<theme_name>` to any card URL. **18 themes available!**

### Classic Themes

| Theme | Style | Preview |
|:------|:------|:--------|
| `radical` | Vibrant pink/cyan neon | ![radical](https://galcocastats.vercel.app/api/profile?theme=radical) |
| `neon` | Cyberpunk glow effects | ![neon](https://galcocastats.vercel.app/api/profile?theme=neon) |
| `minimal` | Clean black + green | ![minimal](https://galcocastats.vercel.app/api/profile?theme=minimal) |

### Modern Themes

| Theme | Style | Preview |
|:------|:------|:--------|
| `glass` | Glassmorphism blur | ![glass](https://galcocastats.vercel.app/api/profile?theme=glass) |
| `gradient` | Purple gradient | ![gradient](https://galcocastats.vercel.app/api/profile?theme=gradient) |
| `aurora` | Northern lights | ![aurora](https://galcocastats.vercel.app/api/profile?theme=aurora) |
| `sunset` | Warm orange/pink | ![sunset](https://galcocastats.vercel.app/api/profile?theme=sunset) |
| `ocean` | Deep blue professional | ![ocean](https://galcocastats.vercel.app/api/profile?theme=ocean) |

### Developer Favorites

| Theme | Style | Preview |
|:------|:------|:--------|
| `github` | Official GitHub dark | ![github](https://galcocastats.vercel.app/api/profile?theme=github) |
| `dracula` | Classic dev theme | ![dracula](https://galcocastats.vercel.app/api/profile?theme=dracula) |
| `nord` | Arctic blue palette | ![nord](https://galcocastats.vercel.app/api/profile?theme=nord) |
| `monokai` | Editor classic | ![monokai](https://galcocastats.vercel.app/api/profile?theme=monokai) |
| `catppuccin` | Pastel trending | ![catppuccin](https://galcocastats.vercel.app/api/profile?theme=catppuccin) |
| `tokyonight` | Modern dev favorite | ![tokyonight](https://galcocastats.vercel.app/api/profile?theme=tokyonight) |
| `gruvbox` | Warm retro colors | ![gruvbox](https://galcocastats.vercel.app/api/profile?theme=gruvbox) |

### Special Themes

| Theme | Style | Preview |
|:------|:------|:--------|
| `rosegold` | Elegant rose/gold | ![rosegold](https://galcocastats.vercel.app/api/profile?theme=rosegold) |
| `synthwave` | 80s retro aesthetic | ![synthwave](https://galcocastats.vercel.app/api/profile?theme=synthwave) |
| `forest` | Nature green | ![forest](https://galcocastats.vercel.app/api/profile?theme=forest) |

## Tech Stack

- **Next.js 16** - Full-stack React framework
- **Satori** - HTML/CSS to SVG rendering
- **TypeScript** - Type-safe development
- **Vercel/Heroku** - Deployment and hosting

---

## Deployment

> **You must fork and deploy your own instance** to use these cards with your GitHub stats.

### Step 1: Create a GitHub Personal Access Token

You can use either a **Classic Token** or a **Fine-grained Token**:

<details>
<summary><strong>Option A: Classic Token (Simpler)</strong></summary>

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token"** > **"Generate new token (classic)"**
3. Give it a name (e.g., `galcocastats`)
4. Set expiration (recommend: 90 days or No expiration)
5. Select these scopes:
   - `read:user` - Read user profile data
   - `repo` - Access repository data (for contribution stats)
6. Click **"Generate token"**
7. **Copy the token immediately** (starts with `ghp_`)

</details>

<details>
<summary><strong>Option B: Fine-grained Token (More Secure)</strong></summary>

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click **"Generate new token"**
3. Give it a name (e.g., `galcocastats`)
4. Set expiration (recommend: 90 days)
5. Under **"Repository access"**, select:
   - **"All repositories"** (needed to read contribution data across repos)
6. Under **"Permissions"** > **"Account permissions"**:
   - `Read-only` access to: **Profile**
7. Under **"Permissions"** > **"Repository permissions"**:
   - `Read-only` access to: **Contents**, **Metadata**
8. Click **"Generate token"**
9. **Copy the token immediately** (starts with `github_pat_`)

</details>

---

### Step 2: Deploy to Vercel (Recommended)

1. **Fork this repository** to your GitHub account

2. **Deploy to Vercel:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/galcocastats)

   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" and import your forked repository
   - Add Environment Variables:
     ```
     GITHUB_TOKEN = your_personal_access_token
     GITHUB_USERNAME = your_github_username
     ```
   - Click "Deploy"

4. **Use your cards:**
   ```markdown
   ![Overview](https://YOUR-PROJECT.vercel.app/api/overview?theme=github)
   ```

### Alternative: Deploy to Heroku

1. **Fork this repository**

2. **Deploy to Heroku:**
   - Go to [heroku.com](https://heroku.com) and create an account
   - Click "New" > "Create new app"
   - Connect your GitHub account and select your forked repo
   - Go to "Settings" > "Config Vars" and add:
     ```
     GITHUB_TOKEN = your_personal_access_token
     GITHUB_USERNAME = your_github_username
     ```
   - Go to "Deploy" > "Manual deploy" > "Deploy Branch"

4. **Use your cards:**
   ```markdown
   ![Overview](https://YOUR-APP.herokuapp.com/api/overview?theme=dracula)
   ```

### Alternative: Local Development

1. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/galcocastats.git
   cd galcocastats
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Create `.env.local`:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   ```

4. Run the development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000/api/overview](http://localhost:3000/api/overview)

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token with `read:user` and `repo` scopes | Yes |
| `GITHUB_USERNAME` | Your GitHub username | Yes |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/overview` | Contribution streak, total contributions, merge rate |
| `/api/tech-skills` | Top programming languages and DevOps tools |
| `/api/activity` | 30-day contribution heatmap |
| `/api/profile` | Developer profile with key statistics |

All endpoints accept `?theme=<theme_name>` parameter.

---

## Quick Start Example

After deploying, add these to your GitHub profile README:

```markdown
## My GitHub Stats

![Overview](https://YOUR-DEPLOYMENT-URL/api/overview?theme=github)

![Tech & Skills](https://YOUR-DEPLOYMENT-URL/api/tech-skills?theme=github)

![Activity](https://YOUR-DEPLOYMENT-URL/api/activity?theme=github)

![Profile](https://YOUR-DEPLOYMENT-URL/api/profile?theme=github)
```

---

## License

MIT License - Open source, free to use, modify and distribute.

**Attribution Required:** Please keep credits to the original author visible. This includes:
- Keeping the LICENSE file in your fork
- Maintaining the footer attribution in the web interface

Created by [@galcoca](https://github.com/galcoca)
