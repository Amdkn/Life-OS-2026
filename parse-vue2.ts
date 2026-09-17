import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('vue.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

const objs = Array.from(document.querySelectorAll('.card.obj'));
objs.forEach((obj, idx) => {
  const title = obj.querySelector('h3')?.textContent || '';
  const doms = obj.getAttribute('data-dom');
  const hor = obj.getAttribute('data-hor');
  const srcElements = Array.from(obj.querySelectorAll('.src')).map(el => el.textContent);
  console.log(`Obj ${idx}: ${title} [Dom: ${doms}] [Hor: ${hor}]`);
  console.log(`Src:`, srcElements);
});

const weeks = Array.from(document.querySelectorAll('#week .card'));
weeks.forEach((w, idx) => {
  const title = w.querySelector('b')?.textContent || '';
  const tags = Array.from(w.querySelectorAll('.tag')).map(el => el.textContent);
  const src = w.querySelector('.src')?.textContent || '';
  console.log(`Week ${idx}: ${title}`);
  console.log(`Tags:`, tags, `Src:`, src);
});
