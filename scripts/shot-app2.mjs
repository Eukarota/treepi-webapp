// Captures : dashboard, activation, tutoriel, profil (mobile + desktop).
import { chromium } from 'playwright';
import fs from 'fs';

const dir = '/private/tmp/claude-503/-Users-md-Documents-Treepi/42aca770-e268-4b56-8c5f-4357ce52e040/scratchpad/app-shots2';
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

// Session + compte activé via l'écran d'activation.
await page.goto('http://localhost:3100/app/activation', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${dir}/01-activation-login.png` });
await page.click('text=Ou utilise');
await page.waitForTimeout(1400);
await page.screenshot({ path: `${dir}/02-activation-felicitations.png` });
await page.click('text=J\'accède à mon compte Euro');
await page.waitForTimeout(1600);
await page.screenshot({ path: `${dir}/03-tuto-etape1.png` });
await page.click('text=Suivant');
await page.waitForTimeout(600);
await page.screenshot({ path: `${dir}/04-tuto-etape2.png` });
await page.click('text=Suivant');
await page.waitForTimeout(600);
await page.screenshot({ path: `${dir}/05-tuto-etape3.png` });
await page.click('text=C\'est parti !');
await page.waitForTimeout(1000);
await page.screenshot({ path: `${dir}/06-accueil-haut.png` });
await page.screenshot({ path: `${dir}/07-accueil-full.png`, fullPage: true });

// Profil
await page.goto('http://localhost:3100/app/profil', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: `${dir}/08-profil.png` });
await page.click('text=Info personnelles');
await page.waitForTimeout(600);
await page.screenshot({ path: `${dir}/09-profil-perso.png` });
await page.goto('http://localhost:3100/app/profil/infos-professionnelles', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${dir}/10-profil-pro.png` });
await page.goto('http://localhost:3100/app/profil/infos-financieres', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${dir}/11-profil-fi.png` });
await page.close();

// Desktop
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto('http://localhost:3100/app/activation', { waitUntil: 'networkidle' });
await desk.click('text=Ou utilise');
await desk.waitForTimeout(1400);
await desk.click('text=J\'accède à mon compte Euro');
await desk.waitForTimeout(1600);
await desk.goto('http://localhost:3100/app/accueil', { waitUntil: 'networkidle' });
await desk.waitForTimeout(800);
await desk.screenshot({ path: `${dir}/12-desktop-accueil.png` });
await desk.goto('http://localhost:3100/app/decouverte', { waitUntil: 'networkidle' });
await desk.waitForTimeout(500);
await desk.screenshot({ path: `${dir}/13-desktop-walkthrough.png` });
await desk.goto('http://localhost:3100/app/inscription', { waitUntil: 'networkidle' });
await desk.waitForTimeout(500);
await desk.screenshot({ path: `${dir}/14-desktop-inscription.png` });
await desk.goto('http://localhost:3100/app/profil', { waitUntil: 'networkidle' });
await desk.waitForTimeout(500);
await desk.screenshot({ path: `${dir}/15-desktop-profil.png` });

await browser.close();
console.log('captures ok');
