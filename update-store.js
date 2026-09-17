const fs = require('fs');

const path = 'src/stores/fw-para.store.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Add description to Project interface
code = code.replace(
  "export interface Project {",
  "export interface Project {\n  description?: string; // V2 Doctrinal Manifest"
);

// 2. Add descriptions to PICARD_PROJECTS
const descriptions = {
  'PRJ-PICARD-01': 'Manifest: B2/B3 Core operations & strategy',
  'PRJ-PICARD-02': 'Manifest: Franchise scaling & SOP integration',
  'PRJ-PICARD-03': 'Manifest: Members space community engine',
  'PRJ-PICARD-04': 'Manifest: Legal & corporate transition',
  'PRJ-PICARD-05': 'Manifest: Cleaning operations SOP mapping',
  'PRJ-PICARD-06': 'Manifest: Pilot onboarding systems',
  'PRJ-PICARD-07': 'Manifest: Agent mission control AI systems',
  'PRJ-PICARD-08': 'Manifest: Graph topology orchestration',
  'PRJ-PICARD-09': 'Manifest: OMK external services delivery'
};

for (const [id, desc] of Object.entries(descriptions)) {
  const regex = new RegExp(`({ id: '${id}', [^}]+)( })`);
  code = code.replace(regex, `$1, description: '${desc}'$2`);
}

fs.writeFileSync(path, code);
console.log('Updated fw-para.store.ts');
