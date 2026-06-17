# AI News Intelligence

AI News Intelligence is an AI-powered news aggregation and summarization platform designed to help researchers, developers, educators, and builders stay informed about the rapidly evolving AI ecosystem.

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

## Motivation

The pace of AI development makes it increasingly difficult to follow important announcements across multiple organizations and communities.

This project aims to provide a concise and accessible view of developments in:

* OpenAI
* Google DeepMind
* Anthropic
* Meta
* Microsoft
* xAI
* Hugging Face
* Open-source ecosystems

## Architecture

```text
News Sources
      ↓
Collection Pipeline
      ↓
AI Summarization
      ↓
Static Site Generation
      ↓
GitHub Pages
```

## Future Roadmap

### Phase 1

* Daily and weekly summaries
* Improved categorization
* Better search

### Phase 2

* Agent-assisted news analysis
* Trend detection
* Personalized feeds

### Phase 3

* Autonomous publishing agents
* LinkedIn integration
* Newsletter generation
* Multi-platform distribution

### Phase 4

* Multi-agent research workflows
* Topic-specific agents
* Retrieval and memory
* Longitudinal AI trend analysis

## Technology Stack

* TypeScript
* GitHub Pages
* GitHub Actions
* Generative AI models
* Static site generation

## Potential Extensions

* Weekly AI briefings
* Research paper digests
* Podcast generation
* MCP integration
* Multi-agent orchestration
* Knowledge graph construction

## License

MIT

---

Built as an exploration of AI-assisted information synthesis and autonomous agent workflows.