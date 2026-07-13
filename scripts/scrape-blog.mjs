// Scrape le blog Treepi existant (listing + articles) pour la migration.
import { chromium } from 'playwright';
import fs from 'fs';

const dir = '/private/tmp/claude-503/-Users-md-Documents-Treepi/354718d8-9e28-43cb-8ccb-36fc31bb5643/scratchpad/blog';
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.treepi.app/blog', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(6000);
for (let y = 0; y < 8000; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(150); }
fs.writeFileSync(`${dir}/listing.html`, await page.evaluate(() => document.documentElement.outerHTML));
await page.screenshot({ path: `${dir}/listing.png`, fullPage: true });

// Récupère tous les liens d'articles
const links = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('a[href*="/blog/"]')].map((a) => a.getAttribute('href')))]
);
console.log('links:', links);

for (const href of links) {
  const slug = href.split('/blog/')[1]?.split('#')[0]?.replace(/\/$/, '');
  if (!slug) continue;
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`https://www.treepi.app/blog/${slug}`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(5000);
  for (let y = 0; y < 12000; y += 800) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
  fs.writeFileSync(`${dir}/article-${slug}.html`, await p.evaluate(() => document.documentElement.outerHTML));
  await p.screenshot({ path: `${dir}/article-${slug}.png`, fullPage: true });
  console.log('scraped', slug);
  await p.close();
}
await browser.close();
console.log('done');
