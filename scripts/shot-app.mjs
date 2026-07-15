// Captures des écrans de l'app en mobile (375x812) pour vérification visuelle.
import { chromium } from 'playwright';
import fs from 'fs';

const dir = '/private/tmp/claude-503/-Users-md-Documents-Treepi/42aca770-e268-4b56-8c5f-4357ce52e040/scratchpad/app-shots';
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

// 1. Launch screen (avant redirection)
await page.goto('http://localhost:3100/app', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${dir}/01-launch.png` });

// 2. Walkthrough : 4 diapositives
await page.goto('http://localhost:3100/app/decouverte', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
for (let i = 1; i <= 4; i++) {
  await page.screenshot({ path: `${dir}/02-walkthrough-${i}.png` });
  if (i < 4) { await page.click('text=Suivant'); await page.waitForTimeout(500); }
}

// 3. Bienvenue (SignUp)
await page.goto('http://localhost:3100/app/bienvenue', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${dir}/03-bienvenue.png` });

// 4. Connexion : vide, erreur, modales
await page.goto('http://localhost:3100/app/connexion', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/04-login.png` });
await page.fill('input[name="email"]', 'test@exemple.com');
await page.fill('input[name="motDePasse"]', 'mauvais');
await page.click('button[type="submit"]');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${dir}/05-login-erreur.png` });
await page.click('text=Mot de passe oublié ?');
await page.waitForTimeout(300);
await page.screenshot({ path: `${dir}/06-login-modal1.png` });
await page.click('text=Je réinitialise mon mot de passe');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${dir}/07-login-modal2.png` });

// 5. Inscription : email → OTP → mdp → infos → tel → bravo
await page.goto('http://localhost:3100/app/inscription', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/08-insc-email1.png` });
await page.fill('input[name="email"]', 'awa.test@exemple.com');
await page.click('text=Continuer');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${dir}/09-insc-email2.png` });
await page.click('text=Entre le code');
await page.waitForTimeout(300);
await page.screenshot({ path: `${dir}/10-insc-email3.png` });
// Saisie de l'OTP de démonstration.
await page.click('input[aria-label="Chiffre 1"]');
await page.keyboard.type('123456');
await page.waitForTimeout(200);
await page.screenshot({ path: `${dir}/11-insc-otp-rempli.png` });
await page.click('text=Vérifier');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${dir}/12-insc-mdp.png` });
await page.fill('input[name="motDePasse"]', 'Treepi2026!');
await page.waitForTimeout(300);
await page.screenshot({ path: `${dir}/13-insc-mdp-fort.png` });
await page.click('text=Continuer');
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/14-insc-infos1.png` });
await page.click('text=Femme');
await page.fill('input[name="prenom"]', 'Awa');
await page.fill('input[name="nom"]', 'Diallo');
await page.click('text=Continuer');
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/15-insc-infos2.png` });
await page.click('text=DD/MM/AAAA');
await page.waitForTimeout(300);
await page.screenshot({ path: `${dir}/16-insc-calendrier.png` });
await page.click('button:has-text("12")');
await page.click('text=Sélectionner');
await page.waitForTimeout(300);
await page.fill('input[name="villeNaissance"]', 'Abidjan');
await page.click('text=Continuer');
await page.waitForTimeout(400);
await page.fill('input[name="nationalite"]', 'Ivoirienne');
await page.fill('input[name="paysResidence"]', "Côte d'Ivoire");
await page.fill('input[name="villeResidence"]', 'Abidjan');
await page.screenshot({ path: `${dir}/17-insc-infos3.png` });
await page.click('text=Continuer');
await page.waitForTimeout(400);
await page.fill('input[id="telephone"]', '0700000000');
await page.screenshot({ path: `${dir}/18-insc-tel.png` });
await page.click('text=Continuer');
await page.waitForTimeout(1400);
await page.screenshot({ path: `${dir}/19-insc-bravo.png` });
await page.click('text=Continuer');
await page.waitForTimeout(800);
await page.screenshot({ path: `${dir}/20-accueil.png` });

await browser.close();
console.log('captures ok');
