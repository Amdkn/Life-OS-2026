import fs from 'fs';

let content = fs.readFileSync('src/apps/deal/DealProtostarView.tsx', 'utf-8');

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">/,
  `<div className="flex flex-col gap-8">\n      <ProtostarElimination />\n      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">`
);

content = content.replace(
  /<\/div>\n  \);\n\}/,
  `      </div>\n    </div>\n  );\n}`
);

fs.writeFileSync('src/apps/deal/DealProtostarView.tsx', content, 'utf-8');
console.log('Patched DealProtostarView.tsx');
