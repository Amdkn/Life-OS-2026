import fs from 'fs';

const html = fs.readFileSync('vue.html', 'utf-8');
const idMatch = html.match(/OBJ-[A-Z0-9-]+/g);
console.log([...new Set(idMatch)]);
