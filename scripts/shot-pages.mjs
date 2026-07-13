// Capture toutes les pages du nouveau site (desktop + mobile pour l'accueil).
import { chromium } from 'playwright';

const dir = '/private/tmp/claude-503/-Users-md-Documents-Treepi/354718d8-9e28-43cb-8ccb-36fc31bb5643/scratchpad/newsite';
import fs from 'fs';
fs.mkdirSync(dir, { recursive: true });

const PAGES = [
  ['home', '/'],
  ['home-en', '/en'],
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
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:3100${path}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
  await page.close();
  console.log(name, 'ok');
}
// Mobile : accueil uniquement
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 60000 });
await m.waitForTimeout(1200);
await m.screenshot({ path: `${dir}/home-mobile.png`, fullPage: true });
await m.close();
console.log('home-mobile ok');
await browser.close();
