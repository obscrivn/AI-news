#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { fetchAllFeeds } from './fetcher.js';
import { summarizeArticles } from './summarizer.js';
import { CONFIG } from './config.js';

const program = new Command();

program
  .name('ai-news-builder')
  .description('Backend builder that fetches and compiles AI summaries into data.json')
  .version('1.0.0')
  .option('-o, --output <file>', 'Output JSON file path', CONFIG.DEFAULT_OUTPUT_FILE)
  .option('-k, --key <key>', 'Gemini API Key override', CONFIG.GEMINI_API_KEY)
  .option('-l, --limit <number>', 'Maximum articles to fetch per feed', (val) => parseInt(val, 10), CONFIG.DEFAULT_LIMIT)
  .option('--stdout', 'Output the JSON to stdout rather than writing to file', false);

program.parse(process.argv);
const options = program.opts();

async function main() {
  console.log('==================================================');
  console.log('⚡  AI News Hub JSON Builder  ⚡');
  console.log('==================================================\n');

  try {
    const articles = await fetchAllFeeds({ limit: options.limit });
    console.log(`\n[Builder] Total articles fetched: ${articles.length}`);

    const dataReport = await summarizeArticles(articles, options.key);

    if (options.stdout) {
      console.log(JSON.stringify(dataReport, null, 2));
    } else {
      const outputFilePath = path.resolve(options.output);
      const outputDir = path.dirname(outputFilePath);
      
      // Ensure the directory exists
      await fs.mkdir(outputDir, { recursive: true });

      // Save report in formatted JSON format
      await fs.writeFile(outputFilePath, JSON.stringify(dataReport, null, 2), 'utf-8');
      
      console.log(`\n[Builder] ✓ Success: data.json compiled at:`);
      console.log(`          ${outputFilePath}`);
    }
  } catch (error) {
    console.error(`\n[Builder] ❌ Critical Error: ${error.message}`);
    process.exit(1);
  }
}

main();
