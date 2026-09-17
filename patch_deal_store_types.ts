import fs from 'fs';

let content = fs.readFileSync('src/stores/fw-deal.store.ts', 'utf-8');

// Fix the LDAction issue
content = content.replace(
  /'remove'/g,
  `'delete'`
);

// We need to write back and format
fs.writeFileSync('src/stores/fw-deal.store.ts', content, 'utf-8');
console.log('Fixed types in fw-deal.store.ts');
