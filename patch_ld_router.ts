import fs from 'fs';

let content = fs.readFileSync('src/lib/ld-router.ts', 'utf-8');

content = content.replace(
  /deal: \{\s*ld01: \['R'\], ld02: \['R'\], ld03: \['R'\], ld04: \['R'\],\s*ld05: \['R'\], ld06: \['R'\], ld07: \['R'\], ld08: \['R'\]\s*\}/g,
  `deal: { \n    ld01: ['R', 'W'], ld02: ['R', 'W'], ld03: ['R', 'W'], ld04: ['R', 'W'],\n    ld05: ['R', 'W'], ld06: ['R', 'W'], ld07: ['R', 'W'], ld08: ['R', 'W']\n  }`
);

fs.writeFileSync('src/lib/ld-router.ts', content, 'utf-8');
console.log('Patched ld-router.ts');
