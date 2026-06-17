# AI Pulse // Daily AI News Hub

A premium, interactive web dashboard summarizing the latest developments in AI development. Tailored for startups, AI founders, and active developers.

This repository runs autonomously every day at 9:00 AM Eastern Time (13:00 UTC) via **GitHub Actions** to fetch RSS feeds, summarize them with **Gemini Flash**, and commit a structured JSON database (`data.json`) that is rendered instantly on **GitHub Pages**.

---

## 📂 Repository Contents

- **`index.html`**: The main Single Page Web App (SPWA) dashboard. Displays interactive topic cards for **Agents**, **Models**, **Tools**, **Companies**, and **Upskilling & Learning**.
- **`styles.css`**: Design system code styling dark-theme, glassmorphism panels, glow layouts, and hover micro-animations.
- **`app.js`**: Frontend JavaScript that fetches `./data.json` and dynamically populates the cards.
- **`data.json`**: The structured JSON database compiled daily. Holds the highlights and latest top 3 articles per category.
- **`index.js`**: Orchestrator file responsible for triggering the fetcher, calling the summarizer, and outputting `data.json`.
- **`fetcher.js`**: Fetches articles from AI RSS feeds (MarkTechPost, arXiv cs.AI, OpenAI, Google AI, Hugging Face).
- **`summarizer.js`**: Connects to the Gemini API (`gemini-2.0-flash`) and uses JSON-mode prompts to tag and summarize the raw feed items.
- **`config.js`**: Holds feed targets, limits, and file paths.
- **`.github/workflows/daily-update.yml`**: GitHub Actions runner workflow configuration.
- **`FUTURE_ARCHITECTURE.md`**: Architectural blueprint and plan history for future expansions.
- **`.gitignore`**: Excludes local environment variables (`.env`) and standard packages (`node_modules`) from commits.
