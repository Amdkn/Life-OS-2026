import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('vue.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

const objs = Array.from(document.querySelectorAll('.card.obj'));
objs.forEach((obj, idx) => {
  const title = obj.querySelector('h3')?.textContent || '';
  const srcElements = Array.from(obj.querySelectorAll('.src')).map(el => el.textContent);
  console.log(`Obj ${idx}: ${title}`);
  console.log(`Src:`, srcElements);
});
