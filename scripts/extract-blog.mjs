// Extrait les articles scrapés vers un fichier de données structuré + télécharge les images.
import { parseFragment, serialize } from 'parse5';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const DIR = '/private/tmp/claude-503/-Users-md-Documents-Treepi/354718d8-9e28-43cb-8ccb-36fc31bb5643/scratchpad/blog';
const IMG_DIR = '/Users/md/Documents/Treepi/public/blog';
fs.mkdirSync(IMG_DIR, { recursive: true });

const download = (url, dest) =>
  new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.headers.location) {
        file.close();
        return download(res.headers.location, dest).then(resolve, reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });

// --- utilitaires parse5 ---
const attr = (n, name) => (n?.attrs || []).find((a) => a.name === name)?.value;
const cls = (n) => attr(n, 'class') || '';
const els = (n) => (n.childNodes || []).filter((c) => c.tagName);
const text = (n) => {
  if (!n) return '';
  if (n.nodeName === '#text') return n.value;
  return (n.childNodes || []).map(text).join('');
};
function find(n, pred) {
  if (n.tagName && pred(n)) return n;
  for (const c of n.childNodes || []) {
    const r = find(c, pred);
    if (r) return r;
  }
  return null;
}
function findAll(n, pred, out = []) {
  if (n.tagName && pred(n)) out.push(n);
  for (const c of n.childNodes || []) findAll(c, pred, out);
  return out;
}

let imgCounter = 0;
const imgMap = new Map();
async function localizeImage(src, slug) {
  if (!src) return null;
  const full = src.startsWith('http') ? src : `https://www.treepi.app${src}`;
  if (imgMap.has(full)) return imgMap.get(full);
  const name = `${slug}-${imgCounter++}.webp`;
  await download(full, path.join(IMG_DIR, name));
  const local = `/blog/${name}`;
  imgMap.set(full, local);
  return local;
}

// Sérialise le contenu de l'article en HTML propre (sans classes/attrs Vue)
async function cleanBody(node, slug) {
  const KEEP = new Set(['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td']);
  async function ser(n) {
    if (n.nodeName === '#text') return n.value.replace(/\s+/g, ' ');
    if (!n.tagName) {
      let out = '';
      for (const c of n.childNodes || []) out += await ser(c);
      return out;
    }
    const tag = n.tagName;
    let inner = '';
    for (const c of n.childNodes || []) inner += await ser(c);
    if (!KEEP.has(tag)) return inner;
    if (tag === 'img') {
      const local = await localizeImage(attr(n, 'src'), slug);
      const alt = (attr(n, 'alt') || '').replace(/"/g, '&quot;');
      return `<img src="${local}" alt="${alt}" />`;
    }
    if (tag === 'a') {
      let href = attr(n, 'href') || '#';
      return `<a href="${href}">${inner}</a>`;
    }
    return `<${tag}>${inner}</${tag}>`;
  }
  return (await ser(node)).replace(/\s+</g, ' <').trim();
}

const posts = [];
for (const f of fs.readdirSync(DIR).filter((f) => f.startsWith('article-') && f.endsWith('.html'))) {
  const slug = f.replace(/^article-/, '').replace(/\.html$/, '');
  let html = fs.readFileSync(path.join(DIR, f), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const frag = parseFragment(html);
  const article = find(frag, (n) => n.tagName === 'article');
  if (!article) { console.log('SKIP (pas d\'article):', slug); continue; }

  const category = text(find(article, (n) => n.tagName === 'span' && cls(n).includes('rounded-full'))).trim();
  const title = text(find(article, (n) => n.tagName === 'h1')).trim();
  const authorBlock = find(article, (n) => n.tagName === 'div' && cls(n).includes('flex items-center gap-3'));
  const author = text(find(authorBlock, (n) => cls(n).includes('font-medium'))).trim();
  const date = text(find(authorBlock, (n) => cls(n).includes('text-gray-500'))).trim();
  const avatarSrc = attr(find(authorBlock, (n) => n.tagName === 'img'), 'src');
  const coverWrap = find(article, (n) => n.tagName === 'div' && cls(n).includes('rounded-2xl overflow-hidden'));
  const coverSrc = coverWrap ? attr(find(coverWrap, (n) => n.tagName === 'img'), 'src') : null;

  // Corps : le div de prose après le header
  const header = find(article, (n) => n.tagName === 'header');
  const bodyNodes = els(article).filter((n) => n !== header);
  let bodyHtml = '';
  for (const bn of bodyNodes) bodyHtml += await cleanBody(bn, slug);

  const cover = await localizeImage(coverSrc, slug);
  const avatar = await localizeImage(avatarSrc, `avatar-${author.toLowerCase()}`);

  posts.push({ slug, category, title, author, avatar, date, cover, body: bodyHtml });
  console.log('OK', slug, '|', category, '|', title.slice(0, 60), '|', author, '|', date);
}

// Métadonnées du listing (temps de lecture + extrait) depuis listing.html
let listing = fs.readFileSync(path.join(DIR, 'listing.html'), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const lfrag = parseFragment(listing);
const cards = findAll(lfrag, (n) => n.tagName === 'a' && (attr(n, 'href') || '').includes('/blog/') && cls(n).includes('block'));
console.log('listing cards:', cards.length);
for (const card of cards) {
  const href = attr(card, 'href');
  const slug = href.split('/blog/')[1]?.split('#')[0]?.replace(/\/$/, '');
  const post = posts.find((p) => p.slug === slug);
  if (!post) continue;
  const t = text(card);
  const m = t.match(/(\d+)\s*minutes? de lecture/);
  if (m) post.readingTime = parseInt(m[1]);
  const ps = findAll(card, (n) => n.tagName === 'p');
  if (ps.length) post.excerpt = text(ps[ps.length - 1]).trim();
}

fs.writeFileSync(`${DIR}/posts.json`, JSON.stringify(posts, null, 2));
console.log('written posts.json —', posts.length, 'articles,', imgCounter, 'images');
