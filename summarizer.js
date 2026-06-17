import { CONFIG } from './config.js';

/**
 * Heuristic fallback grouping of articles when Gemini is unavailable.
 * Returns a JSON object matching the standard schema.
 */
function heuristicGroup(articles) {
  const groups = {
    agents: [],
    models: [],
    tools: [],
    companies: [],
    learning: []
  };

  const regexes = {
    agents: /\b(agent|agents|multi-agent|swarm|crewai|autogen|autonomous|workflow)\b/i,
    models: /\b(model|models|llm|gpt|gemini|claude|llama|deepseek|mistral|phi|dense|moe|weights|transformer|bert|diffusion)\b/i,
    tools: /\b(tool|tools|sdk|framework|library|langchain|llamaindex|hugging\s*face|github|npm|package|pipeline|api|database|db|vectordb|milvus|chroma|pinecone)\b/i,
    companies: /\b(openai|google|microsoft|meta|anthropic|nvidia|apple|amazon|cohere|perplexity|mistral)\b/i,
    learning: /\b(learn|learning|course|courses|lab|labs|tutorial|tutorials|upskill|upskilling|class|education|guide|guides|training)\b/i
  };

  for (const article of articles) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    const cleanItem = {
      title: article.title,
      summary: article.description ? `${article.description.slice(0, 150)}${article.description.length > 150 ? '...' : ''}` : 'No description available.',
      link: article.link,
      source: article.source
    };

    let matched = false;
    if (regexes.learning.test(text)) {
      if (groups.learning.length < 3) groups.learning.push(cleanItem);
      matched = true;
    }
    if (regexes.agents.test(text) && !matched) {
      if (groups.agents.length < 3) groups.agents.push(cleanItem);
      matched = true;
    }
    if (regexes.models.test(text) && !matched) {
      if (groups.models.length < 3) groups.models.push(cleanItem);
      matched = true;
    }
    if (regexes.tools.test(text) && !matched) {
      if (groups.tools.length < 3) groups.tools.push(cleanItem);
      matched = true;
    }
    if (regexes.companies.test(text) && !matched) {
      if (groups.companies.length < 3) groups.companies.push(cleanItem);
      matched = true;
    }
  }

  // Create mock highlights from top articles
  const highlights = articles.slice(0, 3).map(a => a.title);
  if (highlights.length === 0) highlights.push("No updates fetched today.");

  return {
    lastUpdated: new Date().toISOString(),
    highlights,
    agents: groups.agents,
    models: groups.models,
    tools: groups.tools,
    companies: groups.companies,
    learning: groups.learning
  };
}

/**
 * Uses Gemini API to summarize and group fetched articles into structured JSON.
 */
async function generateAIPoweredReport(articles, apiKey) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);

  // Use fastest and cheapest models
  const modelsToTry = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-3.5-flash'];
  let lastError = null;

  const articleText = articles.map((art, idx) => {
    return `[Article #${idx + 1}]
Source: ${art.source}
Title: ${art.title}
Link: ${art.link}
Date: ${art.pubDate}
Description: ${art.description}
------------------------------------`;
  }).join('\n');

  const prompt = `You are Antigravity, an expert AI research analyst.
Below is a list of the latest articles/papers/announcements fetched from AI RSS feeds.
Your task is to analyze these entries, filter out the noise, select the top 3 most important updates for each category, and generate a structured JSON report.

You MUST follow the JSON schema below. Your response must be valid JSON matching this schema:

{
  "lastUpdated": "ISO date string representing current execution time",
  "highlights": [
    "A high-impact executive summary highlight of the day's trends (1-2 sentences)",
    "Another high-impact highlight",
    "A third high-impact highlight"
  ],
  "agents": [
    {
      "title": "Title of the agent news (Keep it concise, clear)",
      "summary": "1-2 sentence professional summary of the development.",
      "link": "The URL link for this article",
      "source": "The RSS source name (e.g. MarkTechPost, arXiv cs.AI, Hugging Face Blog, OpenAI News, Google AI Blog)"
    }
  ],
  "models": [
    // Top 3 model/paper announcements (with title, summary, link, source)
  ],
  "tools": [
    // Top 3 developer tools/SDKs/libraries (with title, summary, link, source)
  ],
  "companies": [
    // Top 3 corporate releases/announcements (with title, summary, link, source)
  ],
  "learning": [
    // Top 3 new courses, labs, guides, tutorials, or upskilling opportunities (with title, summary, link, source)
  ]
}

Guidelines:
- Choose at most 3 items per category. Choose only the most impactful ones.
- Categorize under 'learning' if the article mentions new tutorials, courses, learning paths, labs, or guides (e.g. Google Cloud labs, Claude tutorials, new books, or educational releases).
- Summaries must be extremely clear and startup-oriented (dense with information, focusing on what it enables builders to do).

Here is the raw data:
${articleText}`;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Summarizer] Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text().trim());
    } catch (error) {
      console.warn(`[Summarizer] ⚠ Model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError ? lastError.message : 'Unknown error'}`);
}

/**
 * High-level function that returns structured JSON.
 */
export async function summarizeArticles(articles, customApiKey = '') {
  const apiKey = customApiKey || CONFIG.GEMINI_API_KEY;

  if (articles.length === 0) {
    return {
      lastUpdated: new Date().toISOString(),
      highlights: ["No new articles were fetched today."],
      agents: [],
      models: [],
      tools: [],
      companies: [],
      learning: []
    };
  }

  if (!apiKey) {
    console.log('[Summarizer] No Gemini API key detected. Generating JSON using offline heuristic...');
    return heuristicGroup(articles);
  }

  console.log('[Summarizer] Generating AI-powered JSON report...');
  try {
    return await generateAIPoweredReport(articles, apiKey);
  } catch (error) {
    console.error(`[Summarizer] Gemini AI generation failed: ${error.message}. Falling back to offline heuristic...`);
    return heuristicGroup(articles);
  }
}
