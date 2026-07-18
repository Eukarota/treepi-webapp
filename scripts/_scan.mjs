import { chromium } from 'playwright';
import fs from 'fs';
const dir='/private/tmp/claude-503/-Users-md-Documents-Treepi/f0e8d8c1-1d6a-4e88-b92c-13e9c2e8cdd9/scratchpad/rebuilt';
fs.mkdirSync(dir,{recursive:true});
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 90000 });
await p.waitForTimeout(800);
const H = await p.evaluate(()=>document.body.scrollHeight);
let i=0;
for(let y=0; y<H-800; y+=820){
  await p.evaluate(v=>window.scrollTo(0,v), y);
  await p.waitForTimeout(350);
  await p.screenshot({ path: `${dir}/v${String(i).padStart(2,'0')}.png` });
  i++;
}
console.log('height',H,'shots',i);
await b.close();
