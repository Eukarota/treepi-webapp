// Tests fonctionnels du nouveau site : i18n, navigation, simulateurs, accordéons.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const results = [];
const check = (name, ok) => results.push(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const BASE = 'http://localhost:3100';

// 1. Détection de langue : Accept-Language en → redirection /en
{
  const ctx = await browser.newContext({ locale: 'en-US', extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  check('Auto-détection EN → /en', page.url().includes('/en'));
  await ctx.close();
}
// 2. Défaut FR : Accept-Language fr → racine sans préfixe
{
  const ctx = await browser.newContext({ locale: 'fr-FR', extraHTTPHeaders: { 'Accept-Language': 'fr-FR,fr;q=0.9' } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const lang = await page.getAttribute('html', 'lang');
  check('Défaut FR à la racine', !page.url().includes('/en') && lang === 'fr');
  await ctx.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });

// 3. Sélecteur de langue FR → EN conserve la page
await page.click('button:has-text("en")');
await page.waitForTimeout(1000);
check('Sélecteur de langue → /en', page.url().endsWith('/en'));
await page.click('button:has-text("fr")');
await page.waitForTimeout(1000);

// 4. Méga-menu Solutions
await page.click('button:has-text("Solutions")');
await page.waitForTimeout(300);
check('Méga-menu Solutions visible', await page.locator('a[href*="assurance-voyage"]').first().isVisible()
  && await page.locator('a[href*="compte-euro"]').first().isVisible());
await page.click('body', { position: { x: 10, y: 300 } });

// 5. Simulateur visa : changer la durée met à jour le montant
await page.goto(BASE + '/#simulator', { waitUntil: 'networkidle' });
const before = await page.locator('#simulator .font-outfit.text-6xl').textContent();
await page.fill('#simulator input[type="number"]', '30');
await page.waitForTimeout(300);
const after = await page.locator('#simulator .font-outfit.text-6xl').textContent();
check('Simulateur visa recalcule', before !== after && (after ?? '').includes('€'));

// 6. FAQ accordéon
await page.goto(BASE + '/#faq', { waitUntil: 'networkidle' });
const faqBtn = page.locator('#faq button').first();
await faqBtn.click();
await page.waitForTimeout(500);
check('FAQ accordéon s\'ouvre', await page.locator('text=méfie-toi de quiconque').isVisible());

// 7. Simulateur de recharge
await page.goto(BASE + '/recharge#simulateur', { waitUntil: 'networkidle' });
await page.fill('#simulateur input[type="number"]', '655957');
await page.waitForTimeout(400);
const received = await page.locator('#simulateur dd.text-gradient-secondary').textContent();
check('Simulateur recharge : 655 957 FCFA ≈ 1000 €', (received ?? '').replace(/ |\s/g, '').startsWith('1000'));

// 8. Devis assurance : 2 voyageurs 3 mois = 120 €
await page.goto(BASE + '/assurance-voyage#devis', { waitUntil: 'networkidle' });
await page.fill('#devis input[type="number"]', '45');
const selects = page.locator('#devis select');
await selects.nth(1).selectOption('2');
await page.waitForTimeout(400);
const total = await page.locator('#devis .font-outfit.text-4xl').textContent();
check('Devis assurance 2 pers. × 3 mois = 120 €', (total ?? '').includes('120'));

// 9. Onglets avant/après (compte euro)
await page.goto(BASE + '/compte-euro', { waitUntil: 'networkidle' });
await page.click('button:has-text("Après le visa")');
await page.waitForTimeout(400);
check('Onglets avant/après basculent', await page.locator('text=Fonds débloqués').isVisible());

// 10. Carte blog : navigation vers l'article
await page.goto(BASE + '/blog', { waitUntil: 'networkidle' });
await page.locator('a[href*="/blog/"]').first().click();
await page.waitForTimeout(1200);
check('Carte blog → article', /\/blog\/.+/.test(page.url()));

// 11. Marqueur du globe : la rotation change entre deux pays
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('img[src*="planete"]')?.scrollIntoView({ block: 'center' }));
const t1 = await page.locator('img[src*="country_vector"]').locator('..').locator('..').getAttribute('style');
await page.waitForTimeout(3300);
const t2 = await page.locator('img[src*="country_vector"]').locator('..').locator('..').getAttribute('style');
check('Marqueur globe : rotation animée', t1 !== t2 && /rotate\(-?\d+\.?\d*deg\)/.test(t2 ?? ''));

await page.close();
await browser.close();
console.log(results.join('\n'));
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
