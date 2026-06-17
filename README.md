# AI Pulse // Daily AI News Hub for Builders

A sleek, premium, high-information-density dashboard summarizing the latest developments in AI development. Tailored for startups, YCombinator founders, and active AI builders.

Hostable completely free on **GitHub Pages**, updating autonomously every morning at 9:00 AM Eastern Time (13:00 UTC) via **GitHub Actions** and **Gemini Flash**.

---

## ⚡ Key Features

- **Interactive Topic Cards**: Organizes news into **Agents**, **Models**, **Tools**, and **Companies**.
- **🎓 Upskilling Section**: Curates new learning resources, tutorials, Google/Claude developer labs, or educational releases.
- **Visual Excellence**: Built with a sleek dark theme, glassmorphism, responsive grid layout, and subtle hover micro-animations.
- **Zero Server Costs**: Completely static client rendering using vanilla HTML/CSS/JS fetching a compiled `data.json` database.
- **Cascading AI Models**: Runs on `gemini-2.0-flash` (cheapest & fastest) with automatic fallback layers to ensure summaries never fail.

---

## 🚀 Quick Start: Deploying to GitHub

This repository is pre-configured for instant deployment using **GitHub Actions** and **GitHub Pages**.

### Step 1: Create a GitHub Repository
1. Create a new public repository on GitHub (e.g. `AI-news`).
2. Do not initialize it with a README, gitignore, or license (these are already included here).

### Step 2: Push this Folder to your Repository
Navigate to this `AI-news` directory in your terminal and push the code:
```bash
git init
git add .
git commit -m "initial commit: YC-style AI news dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 3: Configure GitHub Actions & Secrets
To allow the autonomous updates to run and write back the data without revealing your API key:
1. On GitHub, navigate to your repository **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name it **`GEMINI_API_KEY`** and paste your API key in the value.
4. Navigate to **Settings** > **Actions** > **General**.
5. Scroll down to **Workflow permissions**, select **Read and write permissions**, and click **Save**. *(This allows the Action to commit the updated `data.json` back to your repo).*

### Step 4: Enable GitHub Pages
1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment**, set the Source to **Deploy from a branch**.
3. Select the **`main`** branch and the **`/ (root)`** folder, then click **Save**.

Within a few minutes, your site will be live at:
`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🛠️ Local Development

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Configure Local Keys
Create a local `.env` file containing your key for local testing (this is excluded from git commits by `.gitignore`):
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Generate Summaries Locally
To run the news aggregator and compile a fresh `data.json` file:
```bash
node index.js
```

### 4. Serve the Dashboard Locally
Start a local server to view the frontend (e.g. using `live-server`, python HTTP server, or standard IDE preview extension):
```bash
npx live-server
# OR
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
