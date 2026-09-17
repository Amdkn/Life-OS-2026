import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('vue.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

const newCards = [];

const cards = document.querySelectorAll('.card.obj');
cards.forEach((card, index) => {
  const title = card.querySelector('h3')?.textContent || '';
  const tags = Array.from(card.querySelectorAll('.tag')).map(el => el.textContent || '');
  const doms = card.getAttribute('data-dom') || '';
  const hor = card.getAttribute('data-hor') || '';

  const srcElements = Array.from(card.querySelectorAll('.src')).map(el => el.textContent || '');
  const provenance = srcElements.join(' | ');

  const proposedLinks = Array.from(card.querySelectorAll('.unknown')).map(el => el.textContent || '');
  const status = tags.includes('historique') ? 'historique' : 'propose';

  const sourceFileMatch = srcElements[0]?.match(/Source:\s*([^\s]+)/);
  let sourceFile = 'unknown-source';
  if (sourceFileMatch) {
    const parts = sourceFileMatch[1].split('/');
    sourceFile = parts[parts.length - 1].replace('.md', '');
  }

  const id = `IMPORT-OBJ-${sourceFile.replace(/[^A-Za-z0-9_-]/g, '')}-${index}`;

  newCards.push({
    id,
    title,
    provenance,
    status,
    proposedLinks,
    domainTags: doms.split(' ').filter(Boolean),
    horizonTag: hor,
    type: 'historical-card'
  });
});

const weekCards = document.querySelectorAll('#week .card');
weekCards.forEach((card, index) => {
  const title = card.querySelector('b')?.textContent || '';
  const tags = Array.from(card.querySelectorAll('.tag')).map(el => el.textContent || '');
  const src = card.querySelector('.src')?.textContent || '';

  const idMatch = src.match(/OBJ-[A-Z0-9-]+/);
  const id = idMatch ? idMatch[0] : `IMPORT-WK-PROPOSAL-${index}`;

  newCards.push({
    id,
    title,
    provenance: src,
    status: tags.includes('historique') ? 'historique' : 'propose',
    proposedLinks: [],
    domainTags: [],
    horizonTag: '',
    type: 'historical-card'
  });
});

console.log(newCards);
