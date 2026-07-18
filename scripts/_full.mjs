import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs=[];
p.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,140)); });
p.on('pageerror', e=> errs.push('PAGEERR '+String(e).slice(0,140)));
await p.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 90000 });
// scroll to trigger reveals/lazy
for(let y=0;y<12000;y+=700){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(80);}
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(500);
await p.screenshot({ path: '/private/tmp/claude-503/-Users-md-Documents-Treepi/f0e8d8c1-1d6a-4e88-b92c-13e9c2e8cdd9/scratchpad/rebuilt-full.png', fullPage: true });
const oflow = await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
console.log('overflow=',oflow,'errors=',errs.length); errs.slice(0,10).forEach(e=>console.log(' -',e));
await b.close();
