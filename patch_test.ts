import fs from 'fs';

let content = fs.readFileSync('scripts/test-deal-automation.ts', 'utf-8');

content = content.replace(
  /\(global as any\)\.window\.localStorage = global\.localStorage; \/\/ If using any local storage\nObject\.defineProperty\(globalThis, 'localStorage', \{\n  value: \{\n    getItem: \(\) => null,\n    setItem: \(\) => \{\},\n    removeItem: \(\) => \{\},\n  \}\n\}\);/g,
  `Object.defineProperty(dom.window, 'localStorage', {\n  value: {\n    getItem: () => null,\n    setItem: () => {},\n    removeItem: () => {},\n  }\n});`
);

fs.writeFileSync('scripts/test-deal-automation.ts', content, 'utf-8');
console.log('Patched test script');
