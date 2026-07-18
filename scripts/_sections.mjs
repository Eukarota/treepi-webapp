import { chromium } from 'playwright';
import fs from 'fs';
const dir = '/private/tmp/claude-503/-Users-md-Documents-Treepi/f0e8d8c1-1d6a-4e88-b92c-13e9c2e8cdd9/scratchpad/sections';
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto('https://www.treepi.app', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2500);
// scroll through to trigger lazy content
for (let y=0; y<14000; y+=800){ await page.evaluate(v=>window.scrollTo(0,v), y); await page.waitForTimeout(120);}
await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(600);

// Identifie les blocs de contenu : enfants directs du conteneur principal
const blocks = await page.evaluate(() => {
  // trouve le plus grand conteneur vertical (le <main> ou équivalent)
  const candidates = [...document.querySelectorAll('main, #__nuxt > div, [class*="container"]')];
  // fallback: parcours body pour les sections
  const sections = [...document.querySelectorAll('section')];
  const list = sections.length ? sections : [...(document.querySelector('main')?.children||[])];
  return list.map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      i,
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class')||'').slice(0,200),
      top: Math.round(window.scrollY + r.top),
      height: Math.round(r.height),
      heading: (el.querySelector('h1,h2,h3')?.textContent||'').trim().slice(0,80),
    };
  });
});
fs.writeFileSync(`${dir}/blocks.json`, JSON.stringify(blocks, null, 2));

// Sauve l'outerHTML de chaque section
const html = await page.evaluate(() => [...document.querySelectorAll('section')].map(s => s.outerHTML));
html.forEach((h, i) => fs.writeFileSync(`${dir}/sec-${String(i).padStart(2,'0')}.html`, h));

// Screenshot serré par section
for (const b of blocks) {
  if (b.height < 40) continue;
  await page.evaluate(y => window.scrollTo(0, y), b.top);
  await page.waitForTimeout(400);
  const clip = { x: 0, y: 0, width: 1440, height: Math.min(b.height, 1400) };
  // capture depuis le haut de la section
  await page.evaluate(y => window.scrollTo(0, y), b.top);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${dir}/shot-${String(b.i).padStart(2,'0')}.png`, clip: { x:0, y:0, width:1440, height: Math.min(b.height,1400) } });
}
await browser.close();
console.log('blocks:', blocks.length);
console.log(JSON.stringify(blocks.map(b=>({i:b.i,h:b.height,head:b.heading,cls:b.cls.slice(0,50)})), null, 1));
