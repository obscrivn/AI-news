import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file if it exists locally
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  FEEDS: [
    {
      name: 'MarkTechPost',
      url: 'https://www.marktechpost.com/feed/',
      description: 'Broad model and tool releases'
    },
    {
      name: 'arXiv cs.AI',
      url: 'https://rss.arxiv.org/rss/cs.AI',
      description: 'Primary AI academic research papers'
    },
    {
      name: 'OpenAI News',
      url: 'https://openai.com/news/rss.xml',
      description: 'Official first-party lab announcements'
    },
    {
      name: 'Google AI Blog',
      url: 'https://blog.google/technology/ai/rss/',
      description: 'Corporate enterprise updates'
    },
    {
      name: 'Hugging Face Blog',
      url: 'https://huggingface.co/blog/feed.xml',
      description: 'Open-source community updates'
    }
  ],
  DEFAULT_OUTPUT_FILE: path.join(__dirname, 'data.json'),
  DEFAULT_LIMIT: 15 // Higher limit to ensure we fetch enough items for selection
};
