import fs from 'fs';

let content = fs.readFileSync('scripts/test-time-use-blocks.ts', 'utf-8');

content = content.replace(
  /updatedAt: Date\.now\(\)\n\s*\};/g,
  `updatedAt: Date.now(),\n    description: ''\n  };`
);

fs.writeFileSync('scripts/test-time-use-blocks.ts', content, 'utf-8');
console.log('Patched scripts/test-time-use-blocks.ts');
