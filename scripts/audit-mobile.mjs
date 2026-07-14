// Audit responsive iPhone SE (375 × 667) : captures + détection de débordement horizontal.
import { chromium } from 'playwright';
import fs from 'fs';

const dir = '/private/tmp/claude-503/-Users-md-Documents-Treepi/354718d8-9e28-43cb-8ccb-36fc31bb5643/scratchpad/mobile';
fs.mkdirSync(dir, { recursive: true });

const PAGES = [
  ['home', '/'],
  ['compte-euro', '/compte-euro'],
  ['recharge', '/recharge'],
  ['attestation', '/attestation-garantie'],
  ['assurance-voyage', '/assurance-voyage'],
  ['assurance-recours', '/assurance-recours'],
  ['carte', '/carte'],
  ['tarifs', '/tarifs'],
  ['blog', '/blog'],
  ['article', '/blog/l-impact-de-treepi-5'],
];

const browser = await chromium.launch();
for (const [name, path] of PAGES) {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto(`http://localhost:3100${path}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  // Détecte les éléments qui débordent horizontalement du viewport.
  const overflow = await page.evaluate(() => {
    const bad = [];
    const vw = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 2 || r.left < -2)) {
        const cls = (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 70);
        bad.push(`${el.tagName.toLowerCase()}.${cls} [${Math.round(r.left)}..${Math.round(r.right)}]`);
      }
      if (bad.length > 12) break;
    }
    return { scrollW, vw, bad };
  });
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  console.log(`${name}: scrollWidth=${overflow.scrollW} vw=${overflow.vw} ${overflow.scrollW > overflow.vw ? '⚠️ OVERFLOW' : 'ok'}`);
  if (overflow.bad.length) console.log('  ' + overflow.bad.slice(0, 8).join('\n  '));
  await page.close();
}
await browser.close();
