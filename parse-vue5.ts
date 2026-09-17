import fs from 'fs';
const html = fs.readFileSync('vue.html', 'utf-8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('OBJ-')) {
    console.log(`${i+1}: ${l}`);
  }
});
