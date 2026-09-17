const fs = require('fs');

const path = 'src/utils/paraAdapter.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "description: '', // Géré séparément si besoin ou stocké dans metadata",
  "description: project.description || '', // Géré séparément si besoin ou stocké dans metadata"
);

code = code.replace(
  "export function paraItemToProject(item: ParaItem, ldId?: LDId): Project {\n  // Fallback sûr si les champs V0.4 sont manquants (anciens items)\n  return {\n    id: item.id,",
  "export function paraItemToProject(item: ParaItem, ldId?: LDId): Project {\n  // Fallback sûr si les champs V0.4 sont manquants (anciens items)\n  return {\n    id: item.id,\n    description: item.description,"
);

fs.writeFileSync(path, code);
console.log('Updated paraAdapter.ts');
