import Parser from 'rss-parser';
import { CONFIG } from './config.js';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  timeout: 10000
});

export async function fetchAllFeeds(options = {}) {
  const limit = options.limit || CONFIG.DEFAULT_LIMIT;
  const allArticles = [];

  for (const feed of CONFIG.FEEDS) {
    console.log(`[Fetcher] Fetching: ${feed.name}...`);
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      
      const items = parsedFeed.items.slice(0, limit).map(item => ({
        title: item.title ? item.title.trim() : 'No Title',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: (item.contentSnippet || item.content || item.summary || '').trim(),
        source: feed.name
      }));

      console.log(`[Fetcher] ✓ Success: ${feed.name} (found ${items.length} items)`);
      allArticles.push(...items);
    } catch (error) {
      console.warn(`[Fetcher] ⚠ Failed to fetch ${feed.name} (${feed.url}): ${error.message}`);
      
      if (feed.name === 'Hugging Face Blog') {
        console.log(`[Fetcher] Attempting fallback feed for Hugging Face updates...`);
        try {
          const fallbackUrl = 'https://papers.takara.ai/api/feed';
          const parsedFeed = await parser.parseURL(fallbackUrl);
          const items = parsedFeed.items.slice(0, limit).map(item => ({
            title: item.title ? item.title.trim() : 'No Title',
            link: item.link || '',
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            description: (item.contentSnippet || item.content || item.summary || '').trim(),
            source: 'Hugging Face (Daily Papers)'
          }));
          console.log(`[Fetcher] ✓ Success (Fallback): Hugging Face Daily Papers (found ${items.length} items)`);
          allArticles.push(...items);
        } catch (fallbackError) {
          console.warn(`[Fetcher] ⚠ Fallback also failed: ${fallbackError.message}`);
        }
      }
    }
  }

  return allArticles;
}
