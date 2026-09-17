import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('vue.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

const objs = Array.from(document.querySelectorAll('.card.obj'));
objs.forEach((obj, idx) => {
  const title = obj.querySelector('h3')?.textContent || '';
  const src = Array.from(obj.querySelectorAll('.src')).map(el => el.textContent);
  console.log(`Obj ${idx}: ${title}`);
  console.log(`Src:`, src);
});

const weeks = Array.from(document.querySelectorAll('#week .card'));
weeks.forEach((w, idx) => {
  const title = w.querySelector('b')?.textContent || '';
  const tags = Array.from(w.querySelectorAll('.tag')).map(el => el.textContent);
  const src = w.querySelector('.src')?.textContent || '';
  console.log(`Week ${idx}: ${title}`);
  console.log(`Tags:`, tags, `Src:`, src);
});
